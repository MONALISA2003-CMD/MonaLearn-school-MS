import { Controller, Get, Post, Body, Param, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

class EnrollDto {
  courseId: string;
  studentId: string;
}

class SubmitAssignmentDto {
  assignmentId: string;
  studentId: string;
}

// Firestore collections: `enrollments` (deterministic doc id
// `${courseId}_${studentId}` — replaces Prisma's find-then-guard
// duplicate check with the same enforced-by-construction pattern used
// throughout this migration, e.g. Attendance's `studentId_date`),
// `submissions` (deterministic doc id `${assignmentId}_${studentId}`,
// same reasoning), `assignments`, `courses`.
@Injectable()
export class LmsService {
  constructor(private firestore: FirestoreService) {}

  async getMyCourses(studentId: string) {
    const snap = await this.firestore.db.collection('enrollments').where('studentId', '==', studentId).get();
    const enrollments = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const courseIds = [...new Set(enrollments.map((e) => e.courseId).filter(Boolean))];
    const courseDocs = courseIds.length
      ? await this.firestore.db.getAll(...courseIds.map((id) => this.firestore.db.collection('courses').doc(id)))
      : [];
    const coursesById = new Map(courseDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as any]));

    const staffIds = [...new Set([...coursesById.values()].map((c) => c.staffId).filter(Boolean))];
    const staffDocs = staffIds.length
      ? await this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id)))
      : [];
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return enrollments.map((e) => {
      const course = coursesById.get(e.courseId);
      return { ...e, course: course ? { ...course, staff: staffById.get(course.staffId) ?? null } : null };
    });
  }

  // Bug found in the original Prisma version, fixed then and preserved
  // here: no duplicate-enrollment guard — enrolling the same student
  // twice created two Enrollment rows, which skewed
  // getSubmissionRate's "enrolled" total (each duplicate counted as a
  // separate student, inflating the denominator). The deterministic doc
  // id makes a duplicate structurally impossible now rather than merely
  // guarded against.
  async enroll(dto: EnrollDto) {
    const id = `${dto.courseId}_${dto.studentId}`;
    const ref = this.firestore.db.collection('enrollments').doc(id);
    const data = { ...dto, progressPct: 0 };
    await ref.set(data, { merge: true });
    return { id, ...data };
  }

  // Same bug class as enroll() above, same fix: a resubmission used to
  // create a second Submission row instead of updating the first, which
  // double-counted the student in getSubmissionRate's "submitted"
  // figure. The deterministic id (`${assignmentId}_${studentId}`) means
  // a resubmission overwrites in place rather than needing a
  // find-then-decide step.
  async submit(dto: SubmitAssignmentDto) {
    const id = `${dto.assignmentId}_${dto.studentId}`;
    const data = { ...dto, submittedAt: new Date() };
    await this.firestore.db.collection('submissions').doc(id).set(data);
    return { id, ...data };
  }

  // Powers the "Progress & Certificates" tab: submission rate against a
  // course's assignments, computed live rather than tracked separately.
  async getSubmissionRate(courseId: string) {
    const [assignmentSnap, enrolledSnap] = await Promise.all([
      this.firestore.db.collection('assignments').where('courseId', '==', courseId).get(),
      this.firestore.db.collection('enrollments').where('courseId', '==', courseId).count().get(),
    ]);
    const assignments = assignmentSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    const enrolled = enrolledSnap.data().count;

    return Promise.all(
      assignments.map(async (a) => {
        const subSnap = await this.firestore.db.collection('submissions').where('assignmentId', '==', a.id).get();
        return { title: a.title, submitted: subSnap.size, total: enrolled };
      }),
    );
  }
}

@Controller('lms')
export class LmsController {
  constructor(private readonly lms: LmsService) {}

  @Get('courses/:studentId')
  getMyCourses(@Param('studentId') studentId: string) {
    return this.lms.getMyCourses(studentId);
  }

  @Post('enroll')
  enroll(@Body() dto: EnrollDto) {
    return this.lms.enroll(dto);
  }

  @Post('submit')
  submit(@Body() dto: SubmitAssignmentDto) {
    return this.lms.submit(dto);
  }

  @Get('courses/:courseId/submission-rate')
  getSubmissionRate(@Param('courseId') courseId: string) {
    return this.lms.getSubmissionRate(courseId);
  }
}
