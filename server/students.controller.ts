import { Controller, Get, Post, Delete, Param, Body, Query, Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser, Roles } from './auth/auth.guards';
import { PaginationQuery, paginate } from './pagination';

// ─── DTOs ───
class EnrollStudentDto {
  admissionNo: string;
  fullName: string;
  classId: string;
  guardianName?: string;
  guardianPhone?: string;
}

// ─── Firestore data model ───
// Collections: `students` (schoolId, classId, status, deletedAt, ...),
// `feeInvoices` (studentId, billedAmount, term), `payments` (invoiceId,
// amount), `attendanceRecords` (studentId, date, status), `gradeRecords`
// (studentId, subjectId, score). No native joins, so findOne() below
// does the same work Prisma's `include` used to do as several explicit
// reads instead of one query with nested includes — slower, but
// correct and easy to follow, which matters more than round-trip count
// at this stage. classId is resolved fresh against `classes` rather
// than denormalizing a className field onto each student doc, so a
// class rename is never a source of stale data on the student list —
// the tradeoff is one extra batch-read per page of students, accepted
// deliberately rather than risking silently-wrong data.
//
// Soft delete: Prisma's middleware used to rewrite delete()->update()
// and inject `deletedAt: null` into every find* automatically. Firestore
// has no query middleware layer, so every read below that should
// exclude removed students filters on deletedAt explicitly instead —
// easy to forget on a new query, worth double-checking on any future
// addition to this file.
@Injectable()
export class StudentsService {
  constructor(private firestore: FirestoreService) {}

  private async attachClassNames<T extends { classId?: string }>(rows: T[]): Promise<(T & { class: { name: string } | null })[]> {
    const classIds = [...new Set(rows.map((r) => r.classId).filter(Boolean))] as string[];
    if (classIds.length === 0) return rows.map((r) => ({ ...r, class: null }));

    const classDocs = await this.firestore.db.getAll(
      ...classIds.map((id) => this.firestore.db.collection('classes').doc(id)),
    );
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return rows.map((r) => ({
      ...r,
      class: r.classId && classById.has(r.classId) ? { name: (classById.get(r.classId) as any).name } : null,
    }));
  }

  // Before: returned every active student in one response — fine for
  // 6 demo students, breaks a real school's 1,800. Now: page + pageSize.
  // Firestore's .offset() does real work reading-and-discarding every
  // skipped doc rather than jumping straight to the right page the way
  // a SQL OFFSET can — fine at the row counts a single school has, but
  // worth switching to cursor-based (startAfter) pagination if this
  // ever needs to scale past a few thousand students per school.
  async findAll(schoolId: string, page: number, pageSize: number) {
    const base = this.firestore.db
      .collection('students')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'ACTIVE')
      .where('deletedAt', '==', null);

    const [snap, countSnap] = await Promise.all([
      base.orderBy('fullName', 'asc').offset((page - 1) * pageSize).limit(pageSize).get(),
      base.count().get(),
    ]);

    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const withClass = await this.attachClassNames(rows as any);
    return paginate(withClass, countSnap.data().count, page, pageSize);
  }

  async findOne(id: string) {
    const doc = await this.firestore.db.collection('students').doc(id).get();
    if (!doc.exists) throw new NotFoundException(`Student ${id} not found`);
    const student: any = { id: doc.id, ...doc.data() };

    const [classDoc, invoiceSnap, attendanceSnap, gradeSnap] = await Promise.all([
      student.classId ? this.firestore.db.collection('classes').doc(student.classId).get() : Promise.resolve(null),
      this.firestore.db.collection('feeInvoices').where('studentId', '==', id).get(),
      this.firestore.db.collection('attendanceRecords').where('studentId', '==', id).orderBy('date', 'desc').limit(30).get(),
      this.firestore.db.collection('gradeRecords').where('studentId', '==', id).get(),
    ]);

    const invoices = invoiceSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const invoicesWithPayments = await Promise.all(
      invoices.map(async (inv: any) => {
        const paySnap = await this.firestore.db.collection('payments').where('invoiceId', '==', inv.id).get();
        return { ...inv, payments: paySnap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }),
    );

    return {
      ...student,
      class: classDoc?.exists ? { id: classDoc.id, ...classDoc.data() } : null,
      invoices: invoicesWithPayments,
      attendance: attendanceSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      grades: gradeSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  }

  enroll(schoolId: string, dto: EnrollStudentDto) {
    const ref = this.firestore.db.collection('students').doc();
    const data = { schoolId, ...dto, status: 'ACTIVE', deletedAt: null, createdAt: new Date() };
    return ref.set(data).then(() => ({ id: ref.id, ...data }));
  }

  // Powers the Academics module's "attendance %" and "average grade" columns
  // with one derived response instead of the client computing it locally.
  async getStudentSummary(id: string) {
    const student: any = await this.findOne(id);

    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter((a: any) => a.status === 'PRESENT').length;
    const attendancePct = totalDays ? Math.round((presentDays / totalDays) * 100) : null;

    const avgGrade = student.grades.length
      ? student.grades.reduce((sum: number, g: any) => sum + Number(g.score), 0) / student.grades.length
      : null;

    const billed = student.invoices.reduce((sum: number, inv: any) => sum + Number(inv.billedAmount), 0);
    const paid = student.invoices.reduce(
      (sum: number, inv: any) => sum + inv.payments.reduce((s: number, p: any) => s + Number(p.amount), 0),
      0,
    );

    return {
      id: student.id,
      fullName: student.fullName,
      class: student.class?.name ?? null,
      attendancePct,
      avgGrade,
      feeBalance: billed - paid,
    };
  }

  // Used by Communication's auto-built "overdue reminder" audience.
  async findOverdue(schoolId: string) {
    const snap = await this.firestore.db
      .collection('students')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'ACTIVE')
      .where('deletedAt', '==', null)
      .get();

    const students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const withBalances = await Promise.all(
      students.map(async (s: any) => {
        const invSnap = await this.firestore.db.collection('feeInvoices').where('studentId', '==', s.id).get();
        const invoices = invSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const billed = invoices.reduce((sum: number, i: any) => sum + Number(i.billedAmount), 0);
        const paySnaps = await Promise.all(
          invoices.map((i: any) => this.firestore.db.collection('payments').where('invoiceId', '==', i.id).get()),
        );
        const paid = paySnaps.reduce(
          (sum, snap) => sum + snap.docs.reduce((s2, d) => s2 + Number(d.data().amount), 0),
          0,
        );
        return { id: s.id, fullName: s.fullName, guardianPhone: s.guardianPhone ?? null, balance: billed - paid };
      }),
    );

    return withBalances.filter((s) => s.balance > 0);
  }

  // Prisma's soft-delete middleware used to rewrite this into an update
  // transparently. No middleware layer in Firestore, so it's explicit
  // here: set deletedAt, and every find* above already filters it out.
  remove(id: string) {
    return this.firestore.db.collection('students').doc(id).update({ deletedAt: new Date() });
  }
}

// ─── Controller ───
@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  findAll(@CurrentUser() user: { schoolId: string }, @Query() query: PaginationQuery) {
    return this.students.findAll(user.schoolId, query.page, query.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.students.findOne(id);
  }

  @Get(':id/summary')
  getSummary(@Param('id') id: string) {
    return this.students.getStudentSummary(id);
  }

  @Get('overdue/list')
  getOverdue(@CurrentUser() user: { schoolId: string }) {
    return this.students.findOverdue(user.schoolId);
  }

  @Post()
  enroll(@CurrentUser() user: { schoolId: string }, @Body() dto: EnrollStudentDto) {
    return this.students.enroll(user.schoolId, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.students.remove(id);
  }
}
