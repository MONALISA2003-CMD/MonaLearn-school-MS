import { Controller, Get, Post, Body, Query, Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class MarkAttendanceDto {
  studentId: string;
  date: string; // ISO date
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

// Firestore collection: `attendanceRecords`, one doc per student per
// day — enforced not by a unique constraint (Firestore has none) but by
// using a deterministic doc id (`${studentId}_${date}`) and .set()
// (full overwrite) instead of .add(), which gives the exact same
// re-marking-corrects-not-duplicates behavior Prisma's upsert used to.
// schoolId is denormalized onto each record (one extra read in
// markAttendance to look it up) — same reasoning as FeeInvoice in
// fees.controller.ts: querying "every record for a school" by first
// listing every student id and chunking an `in` query would be far more
// expensive at real scale than one field kept in sync at write time.
function attendanceDocId(studentId: string, date: string) {
  return `${studentId}_${date}`;
}

@Injectable()
export class AttendanceService {
  constructor(private firestore: FirestoreService) {}

  async markAttendance(dto: MarkAttendanceDto) {
    const studentDoc = await this.firestore.db.collection('students').doc(dto.studentId).get();
    if (!studentDoc.exists) throw new NotFoundException(`Student ${dto.studentId} not found`);
    const schoolId = studentDoc.data()!.schoolId;

    const id = attendanceDocId(dto.studentId, dto.date);
    const data = { studentId: dto.studentId, schoolId, date: dto.date, status: dto.status };
    await this.firestore.db.collection('attendanceRecords').doc(id).set(data);
    return data;
  }

  async getClassRegister(classId: string, date: string) {
    const studentSnap = await this.firestore.db
      .collection('students')
      .where('classId', '==', classId)
      .where('status', '==', 'ACTIVE')
      .where('deletedAt', '==', null)
      .get();
    const students = studentSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    if (students.length === 0) return [];

    // Deterministic ids mean this is a batch-get of exact documents,
    // not a query — cheaper and simpler than filtering a collection.
    const attendanceDocs = await this.firestore.db.getAll(
      ...students.map((s) => this.firestore.db.collection('attendanceRecords').doc(attendanceDocId(s.id, date))),
    );
    const statusById = new Map(attendanceDocs.filter((d) => d.exists).map((d) => [d.id, d.data()!.status]));

    return students.map((s: any) => ({
      studentId: s.id,
      fullName: s.fullName,
      status: statusById.get(attendanceDocId(s.id, date)) ?? null, // null = not yet marked today, NOT a silent "present"
    }));
  }

  // Powers Dashboard's "avg attendance" card and Academics' "low attendance"
  // flag with the same underlying rows — no drift between the two views.
  async getSchoolWideRate(schoolId: string, sinceDays = 30) {
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);
    const sinceStr = since.toISOString().slice(0, 10);

    const snap = await this.firestore.db
      .collection('attendanceRecords')
      .where('schoolId', '==', schoolId)
      .where('date', '>=', sinceStr)
      .get();
    const records = snap.docs.map((d) => d.data());

    const present = records.filter((r: any) => r.status === 'PRESENT').length;
    return records.length ? Math.round((present / records.length) * 100) : null;
  }

  // Flags students the way the prototype's Academics view did inline —
  // now a reusable query any module can call (Communication, Counseling, etc.)
  async findLowAttendance(schoolId: string, thresholdPct = 85, sinceDays = 30) {
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);
    const sinceStr = since.toISOString().slice(0, 10);

    const [studentSnap, recordSnap] = await Promise.all([
      this.firestore.db.collection('students').where('schoolId', '==', schoolId).where('status', '==', 'ACTIVE').where('deletedAt', '==', null).get(),
      this.firestore.db.collection('attendanceRecords').where('schoolId', '==', schoolId).where('date', '>=', sinceStr).get(),
    ]);

    const recordsByStudent = new Map<string, any[]>();
    recordSnap.docs.forEach((d) => {
      const r = d.data();
      const list = recordsByStudent.get(r.studentId) ?? [];
      list.push(r);
      recordsByStudent.set(r.studentId, list);
    });

    return studentSnap.docs
      .map((d) => {
        const s: any = { id: d.id, ...d.data() };
        const records = recordsByStudent.get(s.id) ?? [];
        const total = records.length;
        const present = records.filter((r) => r.status === 'PRESENT').length;
        const pct = total ? Math.round((present / total) * 100) : 100;
        return { id: s.id, fullName: s.fullName, attendancePct: pct };
      })
      .filter((s) => s.attendancePct < thresholdPct);
  }
}

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Post('mark')
  mark(@Body() dto: MarkAttendanceDto) {
    return this.attendance.markAttendance(dto);
  }

  @Get('register')
  getRegister(@Query('classId') classId: string, @Query('date') date: string) {
    return this.attendance.getClassRegister(classId, date);
  }

  @Get('school-rate')
  getSchoolRate(@CurrentUser() user: { schoolId: string }) {
    return this.attendance.getSchoolWideRate(user.schoolId);
  }

  @Get('low-attendance')
  getLowAttendance(@CurrentUser() user: { schoolId: string }) {
    return this.attendance.findLowAttendance(user.schoolId);
  }
}
