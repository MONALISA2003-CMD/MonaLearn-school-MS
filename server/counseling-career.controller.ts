import { Controller, Get, Post, Patch, Body, Param, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { Roles, CurrentUser } from './auth/auth.guards';

class LogSessionDto {
  studentId: string;
  type: string;
}

// Firestore collection: `counselingSessions` (studentId, schoolId
// denormalized from the student at logSession time).
@Injectable()
export class CounselingService {
  constructor(private firestore: FirestoreService) {}

  async logSession(dto: LogSessionDto) {
    const studentDoc = await this.firestore.db.collection('students').doc(dto.studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('counselingSessions').doc();
    const data = { ...dto, schoolId, status: 'active', date: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  resolve(id: string) {
    return this.firestore.db.collection('counselingSessions').doc(id).update({ status: 'resolved' });
  }

  // Gap found while wiring the frontend: the Sessions tab needs every
  // active session across the school at once, but the only read
  // endpoint was per-student (getStudentContext). Added rather than
  // forcing the roster view onto a single-student lookup.
  async getAllSessions(schoolId: string) {
    const snap = await this.firestore.db
      .collection('counselingSessions')
      .where('schoolId', '==', schoolId)
      .orderBy('date', 'desc')
      .get();
    const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(sessions.map((s) => s.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as any]));

    const classIds = [...new Set([...studentById.values()].map((s) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return sessions.map((s) => {
      const student = studentById.get(s.studentId);
      return { ...s, student: student ? { ...student, class: classById.get(student.classId) ?? null } : null };
    });
  }

  // A counselor deciding whether to escalate can pull attendance and
  // clinic history for the same student in the same review — this is the
  // one place that's designed to read across several other services.
  async getStudentContext(studentId: string) {
    const [sessionSnap, visitSnap] = await Promise.all([
      this.firestore.db.collection('counselingSessions').where('studentId', '==', studentId).get(),
      this.firestore.db.collection('clinicVisits').where('studentId', '==', studentId).get(),
    ]);
    return {
      sessions: sessionSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      clinicVisits: visitSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  }
}

class CreateApplicationDto {
  studentId: string;
  institution: string;
  deadline?: string;
}

// Firestore collection: `universityApplications` (studentId, schoolId
// denormalized from the student at createApplication time).
@Injectable()
export class CollegeCareerService {
  constructor(private firestore: FirestoreService) {}

  async createApplication(dto: CreateApplicationDto) {
    const studentDoc = await this.firestore.db.collection('students').doc(dto.studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('universityApplications').doc();
    const data = { ...dto, schoolId, status: 'pending', deadline: dto.deadline ?? null };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  updateStatus(id: string, status: string) {
    return this.firestore.db.collection('universityApplications').doc(id).update({ status });
  }

  async getForStudent(studentId: string) {
    const snap = await this.firestore.db.collection('universityApplications').where('studentId', '==', studentId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Gap found while wiring the frontend: the Applications tab needs
  // every application across the school at once, but the only read
  // endpoint was per-student. Same pattern as Special Ed's roster and
  // Counseling's sessions gap.
  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('universityApplications').where('schoolId', '==', schoolId).get();
    const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(apps.map((a) => a.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return apps.map((a) => ({ ...a, student: studentById.get(a.studentId) ?? null }));
  }
}

// Bug found while extending test coverage on the original Prisma
// version, fixed then and preserved here: getStudentContext combines
// counseling sessions AND clinic visit history for a student — at least
// as sensitive as Case Notes, which was correctly gated with
// @Roles('counselor', 'admin') earlier in this sweep. This controller
// had no @Roles() protection at all, breaking that established pattern.
@Controller('counseling')
@Roles('counselor', 'admin')
export class CounselingController {
  constructor(private readonly counseling: CounselingService) {}

  @Post('sessions')
  logSession(@Body() dto: LogSessionDto) {
    return this.counseling.logSession(dto);
  }

  @Patch('sessions/:id/resolve')
  resolve(@Param('id') id: string) {
    return this.counseling.resolve(id);
  }

  // Declared before context/:studentId so it isn't shadowed, same as
  // Special Ed's plans route.
  @Get('sessions')
  getAllSessions(@CurrentUser() user: { schoolId: string }) {
    return this.counseling.getAllSessions(user.schoolId);
  }

  @Get('context/:studentId')
  getContext(@Param('studentId') studentId: string) {
    return this.counseling.getStudentContext(studentId);
  }
}

@Controller('college-career')
export class CollegeCareerController {
  constructor(private readonly collegeCareer: CollegeCareerService) {}

  @Post('applications')
  create(@Body() dto: CreateApplicationDto) {
    return this.collegeCareer.createApplication(dto);
  }

  @Patch('applications/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.collegeCareer.updateStatus(id, status);
  }

  // Declared before applications/:studentId so it isn't shadowed.
  @Get('applications')
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.collegeCareer.getAll(user.schoolId);
  }

  @Get('applications/:studentId')
  getForStudent(@Param('studentId') studentId: string) {
    return this.collegeCareer.getForStudent(studentId);
  }
}
