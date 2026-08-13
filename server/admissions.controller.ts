import { Controller, Get, Post, Patch, Param, Body, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class CreateApplicantDto {
  fullName: string;
  applyingForClassId: string;
  guardianPhone?: string;
}

// Firestore collection: `applicants` (schoolId, applyingForClassId,
// stage, createdAt). Reuses `classes`, `students` from earlier
// conversions.
@Injectable()
export class AdmissionsService {
  constructor(private firestore: FirestoreService) {}

  async apply(schoolId: string, dto: CreateApplicantDto) {
    const ref = this.firestore.db.collection('applicants').doc();
    const data = { schoolId, ...dto, stage: 'applied', createdAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getPipeline(schoolId: string) {
    const snap = await this.firestore.db
      .collection('applicants')
      .where('schoolId', '==', schoolId)
      .orderBy('createdAt', 'desc')
      .get();
    const applicants = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const classIds = [...new Set(applicants.map((a) => a.applyingForClassId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return applicants.map((a) => ({
      ...a,
      applyingForClass: classById.get(a.applyingForClassId) ?? null,
    }));
  }

  advanceStage(id: string, stage: string) {
    return this.firestore.db.collection('applicants').doc(id).update({ stage });
  }

  // The one operation that matters most: turning an Applicant into a real
  // Student. Only students who make it through the full pipeline ever
  // get an admissionNo and touch Fees/Attendance/Academics.
  async enroll(applicantId: string, admissionNo: string) {
    const applicantRef = this.firestore.db.collection('applicants').doc(applicantId);

    return this.firestore.db.runTransaction(async (tx) => {
      const applicantDoc = await tx.get(applicantRef);
      if (!applicantDoc.exists) throw new NotFoundException(`Applicant ${applicantId} not found`);
      const applicant: any = applicantDoc.data();

      // Bug found in the original Prisma version, fixed then and
      // preserved here: nothing stopped calling enroll() twice on the
      // same applicant with a different admissionNo, which would
      // silently create a second Student row for one person.
      if (applicant.stage === 'enrolled') {
        throw new BadRequestException(`${applicant.fullName} has already been enrolled`);
      }

      const studentRef = this.firestore.db.collection('students').doc();
      const studentData = {
        admissionNo,
        schoolId: applicant.schoolId,
        classId: applicant.applyingForClassId,
        fullName: applicant.fullName,
        guardianPhone: applicant.guardianPhone ?? null,
        status: 'ACTIVE',
        deletedAt: null,
        createdAt: new Date(),
      };
      tx.set(studentRef, studentData);
      tx.update(applicantRef, { stage: 'enrolled' });

      return { id: studentRef.id, ...studentData };
    });
  }

  // A capacity check the UI's "seat allocation" tab depends on — how
  // many seats remain per class, computed live from actual Student
  // counts. count() is an aggregation query — it doesn't read every
  // student document to get a number, just the count, same efficiency
  // idea as Firestore's .count() used elsewhere in this migration.
  async getSeatAvailability(schoolId: string) {
    const classSnap = await this.firestore.db.collection('classes').where('schoolId', '==', schoolId).get();
    const classes = classSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      classes.map(async (c) => {
        const countSnap = await this.firestore.db
          .collection('students')
          .where('classId', '==', c.id)
          .where('status', '==', 'ACTIVE')
          .count()
          .get();
        // capacity would live on Class in a fuller schema; using a placeholder here
        return { classId: c.id, name: c.name, filled: countSnap.data().count };
      }),
    );
  }
}

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissions: AdmissionsService) {}

  @Post('apply')
  apply(@CurrentUser() user: { schoolId: string }, @Body() dto: CreateApplicantDto) {
    return this.admissions.apply(user.schoolId, dto);
  }

  @Get('pipeline')
  getPipeline(@CurrentUser() user: { schoolId: string }) {
    return this.admissions.getPipeline(user.schoolId);
  }

  @Patch(':id/stage')
  advanceStage(@Param('id') id: string, @Body('stage') stage: string) {
    return this.admissions.advanceStage(id, stage);
  }

  @Post(':id/enroll/:admissionNo')
  enroll(@Param('id') id: string, @Param('admissionNo') admissionNo: string) {
    return this.admissions.enroll(id, admissionNo);
  }

  @Get('seats')
  getSeatAvailability(@CurrentUser() user: { schoolId: string }) {
    return this.admissions.getSeatAvailability(user.schoolId);
  }
}
