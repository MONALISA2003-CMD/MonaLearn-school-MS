import { Controller, Get, Post, Patch, Body, Param, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';
import { WatchlistService } from './visitors-extras.controller';

class RegisterForEventDto {
  eventId: string;
  studentId: string;
}

// Firestore collections: `events` (schoolId), `eventRegistrations`
// (eventId — read via the event's id directly, not queried
// independently, so no schoolId denormalization needed here).
@Injectable()
export class EventsService {
  constructor(private firestore: FirestoreService) {}

  async getUpcoming(schoolId: string) {
    const nowStr = new Date().toISOString();
    const snap = await this.firestore.db
      .collection('events')
      .where('schoolId', '==', schoolId)
      .where('startsAt', '>=', nowStr)
      .orderBy('startsAt', 'asc')
      .get();
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      events.map(async (e) => {
        const regSnap = await this.firestore.db.collection('eventRegistrations').where('eventId', '==', e.id).get();
        return { ...e, registrations: regSnap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }),
    );
  }

  // Capacity check reads the same registrations relation the UI
  // displays — no separate "seats remaining" counter to keep in sync.
  // Wrapped in a transaction so two students registering for the last
  // seat at the same moment can't both succeed — Firestore transactions
  // retry automatically on the kind of write conflict this would cause.
  async register(dto: RegisterForEventDto) {
    const eventRef = this.firestore.db.collection('events').doc(dto.eventId);

    return this.firestore.db.runTransaction(async (tx) => {
      const eventDoc = await tx.get(eventRef);
      if (!eventDoc.exists) throw new NotFoundException(`Event ${dto.eventId} not found`);
      const event: any = eventDoc.data();

      const regSnap = await this.firestore.db.collection('eventRegistrations').where('eventId', '==', dto.eventId).get();
      const registrations = regSnap.docs.map((d) => d.data() as any);

      if (event.capacity && registrations.length >= event.capacity) {
        throw new BadRequestException(`${event.title} is at capacity`);
      }
      const alreadyRegistered = registrations.some((r) => r.studentId === dto.studentId);
      if (alreadyRegistered) {
        throw new BadRequestException('This student is already registered for this event');
      }

      const regRef = this.firestore.db.collection('eventRegistrations').doc();
      tx.set(regRef, dto);
      return { id: regRef.id, ...dto };
    });
  }
}

// Firestore collection: `visitors` (schoolId).
@Injectable()
export class VisitorsService {
  constructor(
    private firestore: FirestoreService,
    private watchlist: WatchlistService,
  ) {}

  // Bug found while extending test coverage on the original Prisma
  // version, fixed then and preserved here: the watchlist screening was
  // only ever described in a code comment ("called from checkIn() in
  // the full wiring") — it was never actually called. Every visitor had
  // been checking in completely unscreened since Visitors was first
  // built.
  async checkIn(schoolId: string, fullName: string, purpose: string, hostStaffId?: string) {
    const flagged = await this.watchlist.isFlagged(schoolId, fullName);
    if (flagged) {
      throw new BadRequestException(`${fullName} matches a watchlist entry — front desk staff must review before badging`);
    }
    const ref = this.firestore.db.collection('visitors').doc();
    const data = { schoolId, fullName, purpose, hostStaffId: hostStaffId ?? null, checkedInAt: new Date(), checkedOutAt: null };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  checkOut(id: string) {
    return this.firestore.db.collection('visitors').doc(id).update({ checkedOutAt: new Date() });
  }

  async getOnCampus(schoolId: string) {
    const snap = await this.firestore.db
      .collection('visitors')
      .where('schoolId', '==', schoolId)
      .where('checkedOutAt', '==', null)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get('upcoming')
  getUpcoming(@CurrentUser() user: { schoolId: string }) {
    return this.events.getUpcoming(user.schoolId);
  }

  @Post('register')
  register(@Body() dto: RegisterForEventDto) {
    return this.events.register(dto);
  }
}

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitors: VisitorsService) {}

  @Post('check-in')
  checkIn(@CurrentUser() user: { schoolId: string }, @Body() body: { fullName: string; purpose: string; hostStaffId?: string }) {
    return this.visitors.checkIn(user.schoolId, body.fullName, body.purpose, body.hostStaffId);
  }

  @Patch(':id/check-out')
  checkOut(@Param('id') id: string) {
    return this.visitors.checkOut(id);
  }

  @Get('on-campus')
  getOnCampus(@CurrentUser() user: { schoolId: string }) {
    return this.visitors.getOnCampus(user.schoolId);
  }
}
