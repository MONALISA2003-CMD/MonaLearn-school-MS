import { Controller, Get, Post, Patch, Body, Param, Injectable, BadRequestException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class CreateIepDto {
  studentId: string;
  need: string;
}

// Firestore collections: `iepPlans`, `iepGoals` (planId), `accommodations`
// (iepPlanId) — all top-level rather than subcollections, since goals
// are updated independently by their own id (updateGoalProgress) rather
// than always read through their parent plan.
@Injectable()
export class SpecialEdService {
  constructor(private firestore: FirestoreService) {}

  // Bug found while extending test coverage on the original Prisma
  // version, fixed then and preserved here: no guard against a second
  // active plan for the same student — getActivePlan's findFirst would
  // then arbitrarily pick one of two, silently hiding whichever plan
  // (and its accommodations) it didn't happen to return.
  async createPlan(dto: CreateIepDto) {
    const existingSnap = await this.firestore.db
      .collection('iepPlans')
      .where('studentId', '==', dto.studentId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    if (!existingSnap.empty) {
      throw new BadRequestException('This student already has an active IEP plan');
    }
    const ref = this.firestore.db.collection('iepPlans').doc();
    const data = { ...dto, status: 'active' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async addGoal(planId: string, goal: string) {
    const ref = this.firestore.db.collection('iepGoals').doc();
    const data = { planId, goal, progress: 'not_started' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  updateGoalProgress(goalId: string, progress: string) {
    return this.firestore.db.collection('iepGoals').doc(goalId).update({ progress });
  }

  // Reused by Counseling's referral workflow when a teacher flags a
  // student who turns out to already have an active plan.
  async getActivePlan(studentId: string) {
    const snap = await this.firestore.db
      .collection('iepPlans')
      .where('studentId', '==', studentId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    if (snap.empty) return null;
    const plan = { id: snap.docs[0].id, ...snap.docs[0].data() as any };
    const goalSnap = await this.firestore.db.collection('iepGoals').where('planId', '==', plan.id).get();
    return { ...plan, goals: goalSnap.docs.map((d) => ({ id: d.id, ...d.data() })) };
  }

  // Gap found while wiring the frontend: the Special Ed roster page
  // needs every student with an active plan at once, but the only
  // query that existed was per-student (getActivePlan). Added rather
  // than forcing the roster onto a single-student lookup.
  async getAllActivePlans(schoolId: string) {
    const studentSnap = await this.firestore.db.collection('students').where('schoolId', '==', schoolId).get();
    const studentIds = studentSnap.docs.map((d) => d.id);
    if (studentIds.length === 0) return [];

    const chunks: string[][] = [];
    for (let i = 0; i < studentIds.length; i += 30) chunks.push(studentIds.slice(i, i + 30));

    const planSnaps = await Promise.all(
      chunks.map((chunk) =>
        this.firestore.db.collection('iepPlans').where('studentId', 'in', chunk).where('status', '==', 'active').get(),
      ),
    );
    const plans = planSnaps.flatMap((s) => s.docs.map((d) => ({ id: d.id, ...d.data() as any })));
    if (plans.length === 0) return [];

    const planIds = plans.map((p) => p.id);
    const [goalSnap, accomSnap] = await Promise.all([
      this.firestore.db.collection('iepGoals').where('planId', 'in', planIds.slice(0, 30)).get(),
      this.firestore.db.collection('accommodations').where('iepPlanId', 'in', planIds.slice(0, 30)).get(),
    ]);
    const goalsByPlan = new Map<string, any[]>();
    goalSnap.docs.forEach((d) => {
      const g: any = { id: d.id, ...d.data() };
      goalsByPlan.set(g.planId, [...(goalsByPlan.get(g.planId) ?? []), g]);
    });
    const accomByPlan = new Map<string, any[]>();
    accomSnap.docs.forEach((d) => {
      const a: any = { id: d.id, ...d.data() };
      accomByPlan.set(a.iepPlanId, [...(accomByPlan.get(a.iepPlanId) ?? []), a]);
    });

    const studentById = new Map(studentSnap.docs.map((d) => [d.id, d.data() as any]));
    const classIds = [...new Set([...studentById.values()].map((s) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return plans.map((p) => {
      const student = studentById.get(p.studentId);
      return {
        ...p,
        goals: goalsByPlan.get(p.id) ?? [],
        accommodations: accomByPlan.get(p.id) ?? [],
        student: student ? { ...student, class: classById.get(student.classId) ?? null } : null,
      };
    });
  }
}

class LogClinicVisitDto {
  studentId: string;
  complaint: string;
}

// Firestore collection: `clinicVisits` (studentId, schoolId denormalized
// from the student at logVisit time — same pattern established for
// every tenant-scoped listing in this migration).
@Injectable()
export class MedicalService {
  constructor(private firestore: FirestoreService) {}

  async logVisit(dto: LogClinicVisitDto) {
    const studentDoc = await this.firestore.db.collection('students').doc(dto.studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('clinicVisits').doc();
    const data = { ...dto, schoolId, status: 'occupied', outcome: null, visitedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  discharge(id: string, outcome: string) {
    return this.firestore.db.collection('clinicVisits').doc(id).update({ status: 'discharged', outcome });
  }

  // Bug found while extending test coverage on the original Prisma
  // version, fixed then and preserved here: no schoolId scoping — the
  // recurring tenant-leak pattern, closed here via the denormalized
  // schoolId set in logVisit above.
  async getOccupiedBeds(schoolId: string) {
    const snap = await this.firestore.db
      .collection('clinicVisits')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'occupied')
      .get();
    const visits = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentDocs = await Promise.all(visits.map((v) => this.firestore.db.collection('students').doc(v.studentId).get()));
    const students = studentDocs.map((d) => (d.exists ? { id: d.id, ...d.data() as any } : null));
    const classIds = [...new Set(students.filter(Boolean).map((s: any) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return visits.map((v, i) => ({
      ...v,
      student: students[i] ? { ...students[i], class: classById.get((students[i] as any).classId) ?? null } : null,
    }));
  }

  // A student's clinic history is one query away for a counselor or nurse
  // deciding whether a pattern of complaints warrants a referral.
  async getStudentHistory(studentId: string) {
    const snap = await this.firestore.db
      .collection('clinicVisits')
      .where('studentId', '==', studentId)
      .orderBy('visitedAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('special-ed')
export class SpecialEdController {
  constructor(private readonly specialEd: SpecialEdService) {}

  @Post('plans')
  createPlan(@Body() dto: CreateIepDto) {
    return this.specialEd.createPlan(dto);
  }

  // Declared before the dynamic :studentId route below so NestJS
  // doesn't swallow this path as a studentId param.
  @Get('plans')
  getAllPlans(@CurrentUser() user: { schoolId: string }) {
    return this.specialEd.getAllActivePlans(user.schoolId);
  }

  @Get('plans/:studentId')
  getPlan(@Param('studentId') studentId: string) {
    return this.specialEd.getActivePlan(studentId);
  }

  @Post('plans/:planId/goals')
  addGoal(@Param('planId') planId: string, @Body('goal') goal: string) {
    return this.specialEd.addGoal(planId, goal);
  }

  @Patch('goals/:id')
  updateGoal(@Param('id') id: string, @Body('progress') progress: string) {
    return this.specialEd.updateGoalProgress(id, progress);
  }
}

@Controller('medical')
export class MedicalController {
  constructor(private readonly medical: MedicalService) {}

  @Post('visits')
  logVisit(@Body() dto: LogClinicVisitDto) {
    return this.medical.logVisit(dto);
  }

  @Patch('visits/:id/discharge')
  discharge(@Param('id') id: string, @Body('outcome') outcome: string) {
    return this.medical.discharge(id, outcome);
  }

  @Get('beds/occupied')
  getOccupiedBeds(@CurrentUser() user: { schoolId: string }) {
    return this.medical.getOccupiedBeds(user.schoolId);
  }

  @Get('visits/:studentId/history')
  getStudentHistory(@Param('studentId') studentId: string) {
    return this.medical.getStudentHistory(studentId);
  }
}
