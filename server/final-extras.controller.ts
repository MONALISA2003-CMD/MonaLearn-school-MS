import { Controller, Get, Post, Patch, Param, Body, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser, Roles } from './auth/auth.guards';

// ─── HOSTEL: Warden Duty — Firestore collection: `wardenDuties`
// (staffId, hostelRoomId, shiftLabel). ───
@Injectable()
export class WardenDutyService {
  constructor(private firestore: FirestoreService) {}

  async assign(staffId: string, hostelRoomId: string, shiftLabel: string) {
    const ref = this.firestore.db.collection('wardenDuties').doc();
    const data = { staffId, hostelRoomId, shiftLabel };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getRoster(hostelRoomId?: string) {
    let query: FirebaseFirestore.Query = this.firestore.db.collection('wardenDuties');
    if (hostelRoomId) query = query.where('hostelRoomId', '==', hostelRoomId);
    const snap = await query.get();
    const duties = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const staffIds = [...new Set(duties.map((d) => d.staffId).filter(Boolean))];
    const roomIds = [...new Set(duties.map((d) => d.hostelRoomId).filter(Boolean))];
    const [staffDocs, roomDocs] = await Promise.all([
      staffIds.length ? this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id))) : [],
      roomIds.length ? this.firestore.db.getAll(...roomIds.map((id) => this.firestore.db.collection('hostelRooms').doc(id))) : [],
    ]);
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));
    const roomById = new Map(roomDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return duties.map((d) => ({
      ...d,
      staff: staffById.get(d.staffId) ?? null,
      hostelRoom: roomById.get(d.hostelRoomId) ?? null,
    }));
  }
}

// ─── SPECIAL ED: Accommodations — Firestore collection:
// `accommodations` (iepPlanId). ───
@Injectable()
export class AccommodationsService {
  constructor(private firestore: FirestoreService) {}

  async add(iepPlanId: string, description: string) {
    const ref = this.firestore.db.collection('accommodations').doc();
    const data = { iepPlanId, description };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getForPlan(iepPlanId: string) {
    const snap = await this.firestore.db.collection('accommodations').where('iepPlanId', '==', iepPlanId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// ─── COUNSELING: Referrals + Case Notes — Firestore collections:
// `referrals` (studentId, schoolId denormalized), `caseNotes`
// (studentId, counselorId). ───
@Injectable()
export class ReferralsService {
  constructor(private firestore: FirestoreService) {}

  async raise(studentId: string, referredBy: string, reason: string, severity = 'medium') {
    const studentDoc = await this.firestore.db.collection('students').doc(studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('referrals').doc();
    const data = { studentId, schoolId, referredBy, reason, severity, status: 'open', referredAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  close(id: string) {
    return this.firestore.db.collection('referrals').doc(id).update({ status: 'closed' });
  }

  // Tenant-scoping gap found while wiring the frontend, fixed then and
  // preserved here: getOpen() had no schoolId filter at all, so any
  // authenticated user would see every school's open referrals, not
  // just their own. Same class of bug found repeatedly during the
  // earlier full sweep and again several times during this Firestore
  // migration (Library, HR). Closed here via the denormalized schoolId
  // set in raise() above.
  async getOpen(schoolId: string) {
    const snap = await this.firestore.db
      .collection('referrals')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'open')
      .get();
    const referrals = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(referrals.map((r) => r.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as any]));

    const classIds = [...new Set([...studentById.values()].map((s) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return referrals.map((r) => {
      const student = studentById.get(r.studentId);
      return { ...r, student: student ? { ...student, class: classById.get(student.classId) ?? null } : null };
    });
  }
}

@Injectable()
export class CaseNotesService {
  constructor(private firestore: FirestoreService) {}

  // Access to this is gated by role at the controller level — case
  // notes are the most sensitive record type in the whole system.
  async add(studentId: string, counselorId: string, note: string) {
    const ref = this.firestore.db.collection('caseNotes').doc();
    const data = { studentId, counselorId, note, createdAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getForStudent(studentId: string) {
    const snap = await this.firestore.db
      .collection('caseNotes')
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// ─── COLLEGE & CAREER: Course Plans — Firestore collection:
// `coursePlans`, keyed BY studentId as the document id itself (one plan
// per student is the actual invariant here, so the id enforces it
// directly rather than replicating Prisma's @unique(studentId) as a
// separate query-then-check). ───
@Injectable()
export class CoursePlansService {
  constructor(private firestore: FirestoreService) {}

  async setPlan(studentId: string, pathway: string) {
    const ref = this.firestore.db.collection('coursePlans').doc(studentId);
    await ref.set({ studentId, pathway, status: 'in_progress' }, { merge: true });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  updateStatus(studentId: string, status: string) {
    return this.firestore.db.collection('coursePlans').doc(studentId).update({ status });
  }

  async getAll(schoolId: string) {
    const studentSnap = await this.firestore.db.collection('students').where('schoolId', '==', schoolId).get();
    const students = studentSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    if (students.length === 0) return [];

    const planDocs = await this.firestore.db.getAll(
      ...students.map((s) => this.firestore.db.collection('coursePlans').doc(s.id)),
    );
    const classIds = [...new Set(students.map((s) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));
    const studentById = new Map(students.map((s) => [s.id, s]));

    return planDocs
      .filter((d) => d.exists)
      .map((d) => {
        const plan: any = { id: d.id, ...d.data() };
        const student = studentById.get(d.id);
        return { ...plan, student: student ? { ...student, class: classById.get(student.classId) ?? null } : null };
      });
  }
}

@Controller('warden-duty')
export class WardenDutyController {
  constructor(private readonly wardenDuty: WardenDutyService) {}

  @Post()
  assign(@Body() body: { staffId: string; hostelRoomId: string; shiftLabel: string }) {
    return this.wardenDuty.assign(body.staffId, body.hostelRoomId, body.shiftLabel);
  }

  @Get()
  getRoster() {
    return this.wardenDuty.getRoster();
  }
}

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodations: AccommodationsService) {}

  @Post()
  add(@Body() body: { iepPlanId: string; description: string }) {
    return this.accommodations.add(body.iepPlanId, body.description);
  }

  @Get(':iepPlanId')
  getForPlan(@Param('iepPlanId') iepPlanId: string) {
    return this.accommodations.getForPlan(iepPlanId);
  }
}

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  @Post()
  raise(@Body() body: { studentId: string; referredBy: string; reason: string; severity?: string }) {
    return this.referrals.raise(body.studentId, body.referredBy, body.reason, body.severity);
  }

  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.referrals.close(id);
  }

  @Get('open')
  getOpen(@CurrentUser() user: { schoolId: string }) {
    return this.referrals.getOpen(user.schoolId);
  }
}

@Controller('case-notes')
export class CaseNotesController {
  constructor(private readonly caseNotes: CaseNotesService) {}

  // Before: any authenticated user could read/write the most sensitive
  // record type in the system. Now: only these two roles can.
  @Roles('counselor', 'admin')
  @Post()
  add(@Body() body: { studentId: string; counselorId: string; note: string }) {
    return this.caseNotes.add(body.studentId, body.counselorId, body.note);
  }

  @Roles('counselor', 'admin')
  @Get(':studentId')
  getForStudent(@Param('studentId') studentId: string) {
    return this.caseNotes.getForStudent(studentId);
  }
}

@Controller('course-plans')
export class CoursePlansController {
  constructor(private readonly coursePlans: CoursePlansService) {}

  @Post()
  setPlan(@Body() body: { studentId: string; pathway: string }) {
    return this.coursePlans.setPlan(body.studentId, body.pathway);
  }

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.coursePlans.getAll(user.schoolId);
  }
}
