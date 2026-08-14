import { Controller, Get, Post, Patch, Param, Body, Injectable } from '@nestjs/common';
import { FieldValue } from '@google-cloud/firestore';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Firestore collection: `dispensaryItems` (schoolId).
@Injectable()
export class DispensaryService {
  constructor(private firestore: FirestoreService) {}

  async addStock(schoolId: string, medicine: string, stock: number, unit: string) {
    const ref = this.firestore.db.collection('dispensaryItems').doc();
    const data = { schoolId, medicine, stock, unit };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // FieldValue.increment(-quantity) gives the same atomic
  // read-and-subtract-in-one-step guarantee Prisma's `decrement` did —
  // two dispenses against the same item at once can't lose an update.
  dispense(id: string, quantity: number) {
    return this.firestore.db.collection('dispensaryItems').doc(id).update({
      stock: admin.firestore.FieldValue.increment(-quantity),
    });
  }

  async getLowStock(schoolId: string, threshold = 20) {
    const snap = await this.firestore.db
      .collection('dispensaryItems')
      .where('schoolId', '==', schoolId)
      .where('stock', '<=', threshold)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('dispensaryItems').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// Firestore collection: `immunizationRecords` (studentId, schoolId
// denormalized from the student at record time).
@Injectable()
export class ImmunizationService {
  constructor(private firestore: FirestoreService) {}

  async record(studentId: string, vaccine: string, dueOrDoneAt: string, status: string) {
    const studentDoc = await this.firestore.db.collection('students').doc(studentId).get();
    const schoolId = studentDoc.exists ? studentDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('immunizationRecords').doc();
    const data = { studentId, schoolId, vaccine, dueOrDoneAt, status };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getForStudent(studentId: string) {
    const snap = await this.firestore.db.collection('immunizationRecords').where('studentId', '==', studentId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getPending(schoolId: string) {
    const snap = await this.firestore.db
      .collection('immunizationRecords')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'pending')
      .get();
    const records = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(records.map((r) => r.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return records.map((r) => ({ ...r, student: studentById.get(r.studentId) ?? null }));
  }
}

@Controller('dispensary')
export class DispensaryController {
  constructor(private readonly dispensary: DispensaryService) {}

  @Post()
  addStock(@CurrentUser() user: { schoolId: string }, @Body() body: { medicine: string; stock: number; unit: string }) {
    return this.dispensary.addStock(user.schoolId, body.medicine, body.stock, body.unit);
  }

  @Patch(':id/dispense')
  dispense(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.dispensary.dispense(id, quantity);
  }

  @Get('low-stock')
  getLowStock(@CurrentUser() user: { schoolId: string }) {
    return this.dispensary.getLowStock(user.schoolId);
  }
}

@Controller('immunizations')
export class ImmunizationController {
  constructor(private readonly immunizations: ImmunizationService) {}

  @Post()
  record(@Body() body: { studentId: string; vaccine: string; dueOrDoneAt: string; status: string }) {
    return this.immunizations.record(body.studentId, body.vaccine, body.dueOrDoneAt, body.status);
  }

  @Get('pending')
  getPending(@CurrentUser() user: { schoolId: string }) {
    return this.immunizations.getPending(user.schoolId);
  }
}
