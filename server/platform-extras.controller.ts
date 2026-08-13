import { Controller, Get, Post, Patch, Param, Body, Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Firestore collection: `webhooks` (schoolId).
@Injectable()
export class WebhooksService {
  constructor(private firestore: FirestoreService) {}

  async register(schoolId: string, event: string, url: string) {
    const ref = this.firestore.db.collection('webhooks').doc();
    const data = { schoolId, event, url, status: 'active' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  disable(id: string) {
    return this.firestore.db.collection('webhooks').doc(id).update({ status: 'disabled' });
  }

  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('webhooks').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// Firestore collection: `integrations`, keyed by `${schoolId}-${name}` —
// this deterministic id already existed in the Prisma version's `where`
// clause even though Postgres itself used a random primary key there;
// Firestore just makes that intent literal by using it as the doc id.
@Injectable()
export class IntegrationsService {
  constructor(private firestore: FirestoreService) {}

  async connect(schoolId: string, name: string, type: string) {
    const id = `${schoolId}-${name}`;
    const ref = this.firestore.db.collection('integrations').doc(id);
    await ref.set({ schoolId, name, type, status: 'connected' }, { merge: true });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  async getAll(schoolId: string) {
    const snap = await this.firestore.db.collection('integrations').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// Firestore collection: `alumni` (schoolId, studentId).
@Injectable()
export class AlumniService {
  constructor(private firestore: FirestoreService) {}

  // Called once, typically as part of the withdrawal/graduation
  // clearance flow — the alumni record outlives the academic ones and
  // shouldn't be recreated by hand.
  async createFromGraduate(studentId: string, schoolId: string, graduationYear: number) {
    const studentDoc = await this.firestore.db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) throw new NotFoundException(`Student ${studentId} not found`);
    const fullName = studentDoc.data()!.fullName;

    const ref = this.firestore.db.collection('alumni').doc();
    const data = { schoolId, fullName, graduationYear, studentId };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getDirectory(schoolId: string) {
    const snap = await this.firestore.db
      .collection('alumni')
      .where('schoolId', '==', schoolId)
      .orderBy('graduationYear', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post()
  register(@CurrentUser() user: { schoolId: string }, @Body() body: { event: string; url: string }) {
    return this.webhooks.register(user.schoolId, body.event, body.url);
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    return this.webhooks.disable(id);
  }

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.webhooks.getAll(user.schoolId);
  }
}

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Post('connect')
  connect(@CurrentUser() user: { schoolId: string }, @Body() body: { name: string; type: string }) {
    return this.integrations.connect(user.schoolId, body.name, body.type);
  }

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.integrations.getAll(user.schoolId);
  }
}

@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumni: AlumniService) {}

  @Post('from-graduate/:studentId')
  createFromGraduate(@CurrentUser() user: { schoolId: string }, @Param('studentId') studentId: string, @Body('graduationYear') graduationYear: number) {
    return this.alumni.createFromGraduate(studentId, user.schoolId, graduationYear);
  }

  @Get()
  getDirectory(@CurrentUser() user: { schoolId: string }) {
    return this.alumni.getDirectory(user.schoolId);
  }
}
