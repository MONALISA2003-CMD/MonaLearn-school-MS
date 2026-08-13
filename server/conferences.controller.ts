import { Controller, Get, Post, Query, Body, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class BookSlotDto {
  slotId: string;
  studentId: string;
}

// Firestore collection: `conferenceSlots` (staffId, schoolId
// denormalized from staff — the original Prisma version scoped through
// `staff: { schoolId }` since ConferenceSlot has no direct schoolId
// column; same fix pattern as everywhere else in this migration).
@Injectable()
export class ConferencesService {
  constructor(private firestore: FirestoreService) {}

  async getOpenSlots(schoolId: string, staffId?: string) {
    let query: FirebaseFirestore.Query = this.firestore.db
      .collection('conferenceSlots')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'open');
    if (staffId) query = query.where('staffId', '==', staffId);

    const snap = await query.orderBy('startsAt', 'asc').get();
    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const staffIds = [...new Set(slots.map((s) => s.staffId).filter(Boolean))];
    const staffDocs = staffIds.length
      ? await this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id)))
      : [];
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return slots.map((s) => ({ ...s, staff: staffById.get(s.staffId) ?? null }));
  }

  // Booking is the write side of the Staff <-> Student link: once a slot
  // has a studentId, Communication's conference tab and the Parent
  // Portal both show it as confirmed from the same row. Wrapped in a
  // transaction so two guardians can't both book the same slot at once.
  async bookSlot(dto: BookSlotDto) {
    const ref = this.firestore.db.collection('conferenceSlots').doc(dto.slotId);
    return this.firestore.db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) throw new NotFoundException(`Conference slot ${dto.slotId} not found`);
      const slot: any = doc.data();
      if (slot.status !== 'open') {
        throw new BadRequestException('This slot is no longer available');
      }
      tx.update(ref, { studentId: dto.studentId, status: 'confirmed' });
      return { id: doc.id, ...slot, studentId: dto.studentId, status: 'confirmed' };
    });
  }

  // Existed in the service since it was first built but was never
  // reachable — the same "unreachable method" pattern found repeatedly
  // across the original sweep (Admissions, Finance, Settings, ApiKeys).
  async getScheduleForDay(schoolId: string, dateFrom: string, dateTo: string) {
    const snap = await this.firestore.db
      .collection('conferenceSlots')
      .where('schoolId', '==', schoolId)
      .where('startsAt', '>=', dateFrom)
      .where('startsAt', '<', dateTo)
      .orderBy('startsAt', 'asc')
      .get();
    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const staffIds = [...new Set(slots.map((s) => s.staffId).filter(Boolean))];
    const studentIds = [...new Set(slots.map((s) => s.studentId).filter(Boolean))];
    const [staffDocs, studentDocs] = await Promise.all([
      staffIds.length ? this.firestore.db.getAll(...staffIds.map((id) => this.firestore.db.collection('staff').doc(id))) : [],
      studentIds.length ? this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id))) : [],
    ]);
    const staffById = new Map(staffDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return slots.map((s) => ({
      ...s,
      staff: staffById.get(s.staffId) ?? null,
      student: s.studentId ? studentById.get(s.studentId) ?? null : null,
    }));
  }
}

@Controller('conferences')
export class ConferencesController {
  constructor(private readonly conferences: ConferencesService) {}

  @Get('open')
  getOpen(@CurrentUser() user: { schoolId: string }) {
    return this.conferences.getOpenSlots(user.schoolId);
  }

  @Post('book')
  book(@Body() dto: BookSlotDto) {
    return this.conferences.bookSlot(dto);
  }

  @Get('schedule')
  getSchedule(@CurrentUser() user: { schoolId: string }, @Query('from') from: string, @Query('to') to: string) {
    return this.conferences.getScheduleForDay(user.schoolId, from, to);
  }
}
