import { Controller, Get, Post, Patch, Param, Body, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class RaiseAccessRequestDto {
  requestedBy: string;
  subjectType: 'student' | 'staff';
  subjectId: string;
  description: string;
}

class StartWithdrawalDto {
  studentId: string;
  type: 'transfer_in' | 'withdrawal' | 'graduation';
  reason?: string;
}

// Firestore collections: `consentRecords`, `dataAccessRequests` — both
// simple schoolId-scoped lists.
@Injectable()
export class ComplianceService {
  constructor(private firestore: FirestoreService) {}

  async getConsentRecords(schoolId: string) {
    const snap = await this.firestore.db
      .collection('consentRecords')
      .where('schoolId', '==', schoolId)
      .orderBy('effectiveAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async raiseAccessRequest(schoolId: string, dto: RaiseAccessRequestDto) {
    const ref = this.firestore.db.collection('dataAccessRequests').doc();
    const data = { schoolId, ...dto, status: 'pending' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  fulfillAccessRequest(id: string) {
    return this.firestore.db.collection('dataAccessRequests').doc(id).update({ status: 'fulfilled' });
  }
}

// Firestore collection: `withdrawalRequests` (studentId, schoolId
// denormalized at startWithdrawal time).
@Injectable()
export class WithdrawalsService {
  constructor(private firestore: FirestoreService) {}

  async startWithdrawal(dto: StartWithdrawalDto) {
    const studentDoc = await this.firestore.db.collection('students').doc(dto.studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('withdrawalRequests').doc();
    const data = { ...dto, schoolId, feesCleared: false, libraryCleared: false, hostelCleared: false, status: 'pending' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // Each clearance is a separate write — Fees, Library, and Hostel each
  // call this independently as the student returns items / settles
  // balances. Wrapped in a transaction because it does a read (current
  // clearance state) then a conditional second write (status + student
  // status change) — two students' clearances landing at the exact same
  // moment shouldn't be able to both miss triggering the final check.
  async setClearance(id: string, area: 'fees' | 'library' | 'hostel', cleared: boolean) {
    const field = { fees: 'feesCleared', library: 'libraryCleared', hostel: 'hostelCleared' }[area];
    const ref = this.firestore.db.collection('withdrawalRequests').doc(id);

    return this.firestore.db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      const current: any = doc.data();
      const updated = { ...current, [field]: cleared };
      tx.update(ref, { [field]: cleared });

      // Bug found in the original Prisma version, fixed then and
      // preserved here: this final status-flip was only ever a code
      // comment ("this is where we'd update Student.status...") — never
      // actually implemented, the same "documented but not wired up"
      // class of bug found in Visitors' watchlist screening. A
      // fully-cleared withdrawal never actually changed the student's
      // status until this fix.
      if (updated.feesCleared && updated.libraryCleared && updated.hostelCleared) {
        tx.update(ref, { status: 'cleared' });
        if (updated.type === 'withdrawal') {
          tx.update(this.firestore.db.collection('students').doc(updated.studentId), { status: 'WITHDRAWN' });
        } else if (updated.type === 'graduation') {
          tx.update(this.firestore.db.collection('students').doc(updated.studentId), { status: 'GRADUATED' });
        }
        // transfer_in intentionally does not change status — it's a
        // student arriving, not leaving.
        return { id, ...updated, status: 'cleared' };
      }
      return { id, ...updated };
    });
  }

  // Bug found in the original Prisma version, fixed then and preserved
  // here: no schoolId scoping at all — the same tenant-leak class of
  // bug already fixed in Hostel, Timetable, and elsewhere throughout
  // this migration, closed here via the denormalized schoolId set in
  // startWithdrawal above.
  async getPending(schoolId: string) {
    const snap = await this.firestore.db
      .collection('withdrawalRequests')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'pending')
      .get();
    const requests = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(requests.map((r) => r.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return requests.map((r) => ({ ...r, student: studentById.get(r.studentId) ?? null }));
  }
}

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get('consent')
  getConsent(@CurrentUser() user: { schoolId: string }) {
    return this.compliance.getConsentRecords(user.schoolId);
  }

  @Post('access-requests')
  raise(@CurrentUser() user: { schoolId: string }, @Body() dto: RaiseAccessRequestDto) {
    return this.compliance.raiseAccessRequest(user.schoolId, dto);
  }

  @Patch('access-requests/:id/fulfill')
  fulfill(@Param('id') id: string) {
    return this.compliance.fulfillAccessRequest(id);
  }
}

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawals: WithdrawalsService) {}

  @Post()
  start(@Body() dto: StartWithdrawalDto) {
    return this.withdrawals.startWithdrawal(dto);
  }

  @Patch(':id/clear/:area')
  clear(@Param('id') id: string, @Param('area') area: 'fees' | 'library' | 'hostel') {
    return this.withdrawals.setClearance(id, area, true);
  }

  @Get('pending')
  getPending(@CurrentUser() user: { schoolId: string }) {
    return this.withdrawals.getPending(user.schoolId);
  }
}
