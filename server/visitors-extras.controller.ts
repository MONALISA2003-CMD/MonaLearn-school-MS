import { Controller, Get, Post, Body, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Firestore collections: `watchlistEntries`, `gatePasses` — both simple
// schoolId-scoped lists.
@Injectable()
export class WatchlistService {
  constructor(private firestore: FirestoreService) {}

  async add(schoolId: string, name: string, reason: string) {
    const ref = this.firestore.db.collection('watchlistEntries').doc();
    const data = { schoolId, name, reason };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('watchlistEntries').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Called by VisitorsService.checkIn() — every new visitor gets
  // screened against this before a badge prints. Firestore has no
  // case-insensitive equality match the way Prisma's `mode: 'insensitive'`
  // did — watchlists are small per school, so this compares in
  // application code after one query rather than trying to fake
  // case-insensitivity with a second denormalized lowercase field, which
  // would need every future watchlist write to remember to set it too.
  async isFlagged(schoolId: string, fullName: string) {
    const entries = await this.getAll(schoolId);
    const target = fullName.trim().toLowerCase();
    return entries.some((e: any) => e.name.trim().toLowerCase() === target);
  }
}

@Injectable()
export class GatePassService {
  constructor(private firestore: FirestoreService) {}

  async issue(schoolId: string, dto: { name: string; purpose: string; scheduledFor: string }) {
    const ref = this.firestore.db.collection('gatePasses').doc();
    const data = { schoolId, name: dto.name, purpose: dto.purpose, scheduledFor: dto.scheduledFor };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getUpcoming(schoolId: string) {
    const nowStr = new Date().toISOString();
    const snap = await this.firestore.db
      .collection('gatePasses')
      .where('schoolId', '==', schoolId)
      .where('scheduledFor', '>=', nowStr)
      .orderBy('scheduledFor', 'asc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlist: WatchlistService) {}

  @Post()
  add(@CurrentUser() user: { schoolId: string }, @Body() body: { name: string; reason: string }) {
    return this.watchlist.add(user.schoolId, body.name, body.reason);
  }

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.watchlist.getAll(user.schoolId);
  }
}

@Controller('gate-passes')
export class GatePassController {
  constructor(private readonly gatePasses: GatePassService) {}

  @Post()
  issue(@CurrentUser() user: { schoolId: string }, @Body() dto: { name: string; purpose: string; scheduledFor: string }) {
    return this.gatePasses.issue(user.schoolId, dto);
  }

  @Get('upcoming')
  getUpcoming(@CurrentUser() user: { schoolId: string }) {
    return this.gatePasses.getUpcoming(user.schoolId);
  }
}
