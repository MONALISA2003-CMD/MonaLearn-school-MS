import { Controller, Get, Post, Patch, Param, Body, Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Firestore collections: `timetableSlots` (schoolId denormalized —
// previously scoped only via `class: { schoolId }`, same join-filter
// problem as every other module converted so far), `staff`, `payslips`
// (schoolId also denormalized, same reasoning). This module is the one
// place the frontend prototype specifically demonstrated cross-module
// linkage — Timetable reads staff.onLeave, HR writes it — so the join
// pattern below (batch-fetching referenced staff/subject/class docs
// after the slot query) matters more here than in most other modules:
// it's preserving the exact behavior the interlinked demo was built to
// prove, just without a database-level join to do it in one query.
@Injectable()
export class TimetableService {
  constructor(private firestore: FirestoreService) {}

  private async withStaffAndSubject(slots: any[]) {
    const staffIds = [...new Set(slots.map((s) => s.staffId).filter(Boolean))];
    const subjectIds = [...new Set(slots.map((s) => s.subjectId).filter(Boolean))];

    const [staffDocs, subjectDocs] = await Promise.all([
      staffIds.length ? this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id))) : [],
      subjectIds.length ? this.firestore.db.getAll(...subjectIds.map((id) => this.firestore.db.collection('subjects').doc(id))) : [],
    ]);
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));
    const subjectById = new Map(subjectDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return slots.map((slot) => {
      const staff: any = staffById.get(slot.staffId);
      const subject: any = subjectById.get(slot.subjectId);
      return { slot, staff, subject };
    });
  }

  // Bug found while extending test coverage on the original Prisma
  // version: this query had NO schoolId scoping at all — any
  // authenticated user from any tenant could see every other school's
  // timetable. Denormalized schoolId is what makes this filterable
  // directly now, same fix, different database.
  async getTodaySlots(schoolId: string, dayOfWeek: number) {
    const snap = await this.firestore.db
      .collection('timetableSlots')
      .where('schoolId', '==', schoolId)
      .where('dayOfWeek', '==', dayOfWeek)
      .orderBy('startTime', 'asc')
      .get();
    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    const classIds = [...new Set(slots.map((s: any) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    const joined = await this.withStaffAndSubject(slots);
    return joined.map(({ slot, staff, subject }) => ({
      time: slot.startTime,
      class: (classById.get(slot.classId) as any)?.name ?? '—',
      subject: subject?.name ?? '—',
      teacher: staff?.fullName ?? '—',
      needsCover: staff?.onLeave ?? false, // <- reads HR's field directly
      room: slot.room,
    }));
  }

  // Gap found while wiring the frontend originally: the timetable grid
  // page needs a single class's full Mon-Fri week, but the only
  // endpoint that existed was a school-wide single-day query.
  async getWeekSlots(schoolId: string, classId: string) {
    const snap = await this.firestore.db
      .collection('timetableSlots')
      .where('schoolId', '==', schoolId)
      .where('classId', '==', classId)
      .orderBy('startTime', 'asc')
      .get();
    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }))
      .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek); // Firestore can't orderBy two fields without a composite index defined up front

    const joined = await this.withStaffAndSubject(slots);
    return joined.map(({ slot, staff, subject }) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      subject: subject?.name ?? '—',
      teacher: staff?.fullName ?? '—',
      needsCover: staff?.onLeave ?? false,
      room: slot.room,
    }));
  }
}

@Injectable()
export class HrService {
  constructor(private firestore: FirestoreService) {}

  // Toggling this is the write side of the same link: HR sets it,
  // Timetable's query above reflects it on the very next request.
  setLeaveStatus(staffId: string, onLeave: boolean) {
    return this.firestore.db.collection('staff').doc(staffId).update({ onLeave });
  }

  // Uganda-specific statutory deductions: PAYE is a simplified flat-band
  // approximation here — a real implementation would use URA's current
  // tax bands, not a flat rate. Guarded against running payroll twice
  // for the same staff+period the same way the Prisma version was —
  // finds the existing payslip by a deterministic-enough query and
  // updates it instead of creating a duplicate.
  async runPayroll(staffId: string, grossSalary: number, period: string) {
    const staffDoc = await this.firestore.db.collection('staff').doc(staffId).get();
    if (!staffDoc.exists) throw new NotFoundException(`Staff ${staffId} not found`);
    const schoolId = staffDoc.data()!.schoolId;

    const paye = Math.round(grossSalary * 0.18);        // approximation only
    const nssf = Math.round(grossSalary * 0.05);          // employee's 5% share
    const lst = 25000;                                    // flat Local Service Tax
    const netPay = grossSalary - paye - nssf - lst;

    const existingSnap = await this.firestore.db
      .collection('payslips')
      .where('staffId', '==', staffId)
      .where('period', '==', period)
      .limit(1)
      .get();

    const data = { staffId, schoolId, period, grossSalary, paye, nssf, lst, netPay, status: 'processing' };
    if (!existingSnap.empty) {
      const ref = existingSnap.docs[0].ref;
      await ref.update(data);
      return { id: ref.id, ...data };
    }
    const ref = this.firestore.db.collection('payslips').doc();
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  markPaid(payslipId: string) {
    return this.firestore.db.collection('payslips').doc(payslipId).update({ status: 'paid' });
  }

  async getPayslip(staffId: string, period: string) {
    const snap = await this.firestore.db
      .collection('payslips')
      .where('staffId', '==', staffId)
      .where('period', '==', period)
      .limit(1)
      .get();
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  }

  // Tenant-scoping gap found while wiring the frontend originally:
  // getPayrollRun filtered only by period, with no schoolId check at
  // all — any authenticated user could pull another school's payroll
  // run by guessing a period string. schoolId is denormalized onto
  // payslips (set in runPayroll above) specifically so this stays a
  // direct filter rather than the multi-collection join every other
  // tenant-scoping fix in this migration has needed.
  async getPayrollRun(schoolId: string, period: string) {
    const snap = await this.firestore.db
      .collection('payslips')
      .where('schoolId', '==', schoolId)
      .where('period', '==', period)
      .get();
    const payslips = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const staffIds = [...new Set(payslips.map((p: any) => p.staffId).filter(Boolean))];
    const staffDocs = staffIds.length
      ? await this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id)))
      : [];
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return payslips.map((p: any) => ({ ...p, staff: staffById.get(p.staffId) ?? null }));
  }

  // Gap found while wiring the frontend originally: the Directory tab
  // needs the full staff roster, but no listing endpoint existed at all.
  async getAllStaff(schoolId: string) {
    const snap = await this.firestore.db.collection('staff').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetable: TimetableService) {}

  @Get('today')
  getToday(@CurrentUser() user: { schoolId: string }) {
    const today = new Date().getDay(); // 1 = Monday ... 5 = Friday
    return this.timetable.getTodaySlots(user.schoolId, today);
  }

  @Get('week/:classId')
  getWeek(@CurrentUser() user: { schoolId: string }, @Param('classId') classId: string) {
    return this.timetable.getWeekSlots(user.schoolId, classId);
  }
}

@Controller('hr')
export class HrController {
  constructor(private readonly hr: HrService) {}

  @Patch('staff/:id/leave/:status')
  setLeave(@Param('id') id: string, @Param('status') status: string) {
    return this.hr.setLeaveStatus(id, status === 'true');
  }

  @Post('payroll/run')
  runPayroll(@Body() body: { staffId: string; grossSalary: number; period: string }) {
    return this.hr.runPayroll(body.staffId, body.grossSalary, body.period);
  }

  @Patch('payroll/:id/mark-paid')
  markPaid(@Param('id') id: string) {
    return this.hr.markPaid(id);
  }

  @Get('staff')
  getAllStaff(@CurrentUser() user: { schoolId: string }) {
    return this.hr.getAllStaff(user.schoolId);
  }

  @Get('payroll/:period')
  getRun(@Param('period') period: string, @CurrentUser() user: { schoolId: string }) {
    return this.hr.getPayrollRun(user.schoolId, period);
  }
}
