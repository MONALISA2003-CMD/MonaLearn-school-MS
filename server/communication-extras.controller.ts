import { Controller, Get, Post, Body, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Firestore collections: `announcements`, `messageTemplates` — both
// simple schoolId-scoped lists, no relations to work around here.
@Injectable()
export class AnnouncementsService {
  constructor(private firestore: FirestoreService) {}

  async post(schoolId: string, dto: { title: string; body: string; author: string; audience: string; pinned?: boolean }) {
    const ref = this.firestore.db.collection('announcements').doc();
    const data = { schoolId, ...dto, pinned: dto.pinned ?? false, postedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // Pinned items first, then newest — matches how the UI's notice board
  // sorted them. Firestore can't orderBy two fields without a composite
  // index defined up front, so the pinned-first ordering is applied
  // client-side after a single sort-by-date query — announcement boards
  // are small enough per school that this costs nothing meaningful.
  async getBoard(schoolId: string) {
    const snap = await this.firestore.db
      .collection('announcements')
      .where('schoolId', '==', schoolId)
      .orderBy('postedAt', 'desc')
      .get();
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    return rows.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
  }
}

@Injectable()
export class TemplatesService {
  constructor(private firestore: FirestoreService) {}

  async create(schoolId: string, dto: { name: string; tag: string; body: string }) {
    const ref = this.firestore.db.collection('messageTemplates').doc();
    const data = { schoolId, ...dto };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('messageTemplates').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcements: AnnouncementsService) {}

  @Post()
  post(@CurrentUser() user: { schoolId: string }, @Body() dto: { title: string; body: string; author: string; audience: string; pinned?: boolean }) {
    return this.announcements.post(user.schoolId, dto);
  }

  @Get()
  getBoard(@CurrentUser() user: { schoolId: string }) {
    return this.announcements.getBoard(user.schoolId);
  }
}

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Post()
  create(@CurrentUser() user: { schoolId: string }, @Body() dto: { name: string; tag: string; body: string }) {
    return this.templates.create(user.schoolId, dto);
  }

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.templates.getAll(user.schoolId);
  }
}
