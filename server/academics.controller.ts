import { Controller, Get, Post, Body, Param, Injectable, BadRequestException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class RecordGradeDto {
  studentId: string;
  subjectId: string;
  term: string;
  assessment: string;
  score: number;
}

// Firestore collection: `gradeRecords` (studentId, subjectId, term,
// assessment, score). Reuses `students`, `attendanceRecords`, `subjects`
// from earlier conversions.
@Injectable()
export class AcademicsService {
  constructor(private firestore: FirestoreService) {}

  // Two bugs found in the original Prisma version, fixed then and
  // preserved here: (1) no score range check — a typo'd "500" instead
  // of "50" would silently corrupt every average it touches; (2) no
  // duplicate guard — recording the same assessment twice for one
  // student double-weighted it in getGradebook's average, the same bug
  // class as HR's duplicate-payroll issue.
  async recordGrade(dto: RecordGradeDto) {
    if (dto.score < 0 || dto.score > 100) {
      throw new BadRequestException('Score must be between 0 and 100');
    }

    const existingSnap = await this.firestore.db
      .collection('gradeRecords')
      .where('studentId', '==', dto.studentId)
      .where('subjectId', '==', dto.subjectId)
      .where('term', '==', dto.term)
      .where('assessment', '==', dto.assessment)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      const ref = existingSnap.docs[0].ref;
      await ref.update({ score: dto.score });
      return { id: ref.id, ...dto };
    }

    const ref = this.firestore.db.collection('gradeRecords').doc();
    await ref.set(dto);
    return { id: ref.id, ...dto };
  }

  // Bug found in the original Prisma version, fixed then and preserved
  // here: no schoolId scoping at all, the same tenant-leak class of bug
  // fixed in Timetable. classId is unique so this was lower severity,
  // but a caller from any school could still pull any other school's
  // gradebook by guessing/enumerating IDs.
  async getGradebook(schoolId: string, classId: string, term: string) {
    const studentSnap = await this.firestore.db
      .collection('students')
      .where('classId', '==', classId)
      .where('schoolId', '==', schoolId)
      .get();
    const students = studentSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    if (students.length === 0) return [];

    const studentIds = students.map((s) => s.id);
    // Firestore's `in` operator caps at 30 values — fine for a single
    // class's roster, would need chunking if this pattern were reused
    // for a school-wide query instead.
    const gradeSnap = await this.firestore.db
      .collection('gradeRecords')
      .where('studentId', 'in', studentIds.slice(0, 30))
      .where('term', '==', term)
      .get();
    const grades = gradeSnap.docs.map((d) => d.data() as any);

    const subjectIds = [...new Set(grades.map((g) => g.subjectId).filter(Boolean))];
    const subjectDocs = subjectIds.length
      ? await this.firestore.db.getAll(...subjectIds.map((id) => this.firestore.db.collection('subjects').doc(id)))
      : [];
    const subjectById = new Map(subjectDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return students.map((s: any) => {
      const studentGrades = grades.filter((g) => g.studentId === s.id);
      const avg = studentGrades.length
        ? studentGrades.reduce((sum, g) => sum + Number(g.score), 0) / studentGrades.length
        : null;
      return {
        studentId: s.id,
        fullName: s.fullName,
        grades: studentGrades.map((g) => ({ subject: (subjectById.get(g.subjectId) as any)?.name ?? '—', score: Number(g.score) })),
        average: avg,
      };
    });
  }

  // Powers Analytics' attendance-vs-grade correlation view.
  async getAttendanceGradeCorrelation(schoolId: string, term: string) {
    const studentSnap = await this.firestore.db.collection('students').where('schoolId', '==', schoolId).get();
    const students = studentSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    if (students.length === 0) return [];

    const studentIds = students.map((s) => s.id);
    const chunks: string[][] = [];
    for (let i = 0; i < studentIds.length; i += 30) chunks.push(studentIds.slice(i, i + 30));

    const [gradeSnaps, attendanceSnaps] = await Promise.all([
      Promise.all(chunks.map((chunk) =>
        this.firestore.db.collection('gradeRecords').where('studentId', 'in', chunk).where('term', '==', term).get(),
      )),
      Promise.all(chunks.map((chunk) =>
        this.firestore.db.collection('attendanceRecords').where('studentId', 'in', chunk).get(),
      )),
    ]);
    const grades = gradeSnaps.flatMap((s) => s.docs.map((d) => d.data() as any));
    const attendance = attendanceSnaps.flatMap((s) => s.docs.map((d) => d.data() as any));

    return students
      .map((s: any) => {
        const studentGrades = grades.filter((g) => g.studentId === s.id);
        const studentAttendance = attendance.filter((a) => a.studentId === s.id);
        if (!studentGrades.length || !studentAttendance.length) return null;
        const avgGrade = studentGrades.reduce((sum, g) => sum + Number(g.score), 0) / studentGrades.length;
        const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT').length;
        const attendancePct = Math.round((presentCount / studentAttendance.length) * 100);
        return { studentId: s.id, attendancePct, avgGrade: Math.round(avgGrade * 10) / 10 };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }
}

@Controller('academics')
export class AcademicsController {
  constructor(private readonly academics: AcademicsService) {}

  @Post('grades')
  recordGrade(@Body() dto: RecordGradeDto) {
    return this.academics.recordGrade(dto);
  }

  @Get('gradebook/:classId/:term')
  getGradebook(@CurrentUser() user: { schoolId: string }, @Param('classId') classId: string, @Param('term') term: string) {
    return this.academics.getGradebook(user.schoolId, classId, term);
  }

  @Get('correlation/:term')
  getCorrelation(@CurrentUser() user: { schoolId: string }, @Param('term') term: string) {
    return this.academics.getAttendanceGradeCorrelation(user.schoolId, term);
  }
}
