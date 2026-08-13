import { Controller, Get, Post, Patch, Param, Body, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { FirestoreService } from './firestore.service';
import { CurrentUser, Roles } from './auth/auth.guards';
import { StudentsService } from './students.controller';
import { AcademicsService } from './academics.controller';
import { FeesService } from './fees.controller';

// ─── PORTALS — no new collections. Each portal is a curated slice of
// data other services already expose, reassembled per audience. ───
@Injectable()
export class PortalsService {
  constructor(
    private students: StudentsService,
    private firestore: FirestoreService,
  ) {}

  // Bug found in the original Prisma version, fixed then and preserved
  // here: this had NO ownership or tenant check at all — any
  // authenticated user from any school could view any student's fee
  // balance, attendance, and grades just by changing the ID in the URL.
  // This closes the cross-school leak; true per-guardian ownership
  // (this specific parent -> this specific child) still needs a
  // modeled Guardian-Student link, which doesn't exist yet — noted
  // honestly rather than claimed as fully fixed.
  async getParentSnapshot(schoolId: string, studentId: string) {
    const doc = await this.firestore.db.collection('students').doc(studentId).get();
    if (!doc.exists) throw new NotFoundException(`Student ${studentId} not found`);
    if (doc.data()!.schoolId !== schoolId) {
      throw new ForbiddenException('This student does not belong to your school');
    }
    return this.students.getStudentSummary(studentId);
  }

  // Everything the Teacher Portal home screen needs — today's classes
  // would come from TimetableService in the full wiring.
  async getTeacherSnapshot(staffId: string) {
    return { staffId, message: 'Composed from TimetableService + AcademicsService in full wiring' };
  }
}

// ─── MULTI-CAMPUS — Campus already exists as a collection; this is
// pure aggregation across campuses, no new collections needed. ───
@Injectable()
export class CampusesService {
  constructor(private firestore: FirestoreService) {}

  async getCampusComparison(schoolId: string) {
    const snap = await this.firestore.db.collection('campuses').where('schoolId', '==', schoolId).get();
    const campuses = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      campuses.map(async (c) => {
        const [studentCount, staffCount] = await Promise.all([
          this.firestore.db.collection('students').where('campusId', '==', c.id).count().get(),
          this.firestore.db.collection('staff').where('campusId', '==', c.id).count().get(),
        ]);
        return {
          name: c.name,
          location: c.location ?? null,
          students: studentCount.data().count,
          staff: staffCount.data().count,
        };
      }),
    );
  }
}

// ─── ANALYTICS — every query here delegates to a domain service; this
// module owns cross-domain composition, not data. ───
@Injectable()
export class AnalyticsService {
  constructor(
    private academics: AcademicsService,
    private fees: FeesService,
  ) {}

  async getExecutiveOverview(schoolId: string, term: string) {
    const [feeSummary, correlation] = await Promise.all([
      this.fees.getCollectionSummary(schoolId, term),
      this.academics.getAttendanceGradeCorrelation(schoolId, term),
    ]);
    return { feeSummary, correlation };
  }
}

// ─── API MANAGEMENT — Firestore collection: `apiKeys`. ───
@Injectable()
export class ApiKeysService {
  constructor(private firestore: FirestoreService) {}

  // Bugs found in the original Prisma version, fixed then and preserved
  // here: (1) create() had no controller endpoint at all — a school
  // could never actually generate a key through the API, the same
  // "unreachable service method" pattern found in Admissions'
  // advanceStage. (2) the original signature accepted a pre-hashed
  // string from the caller, which the original audit flagged — the
  // server should generate and hash the key itself.
  async create(schoolId: string, name: string) {
    const rawKey = `mlk_live_${randomBytes(24).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const ref = this.firestore.db.collection('apiKeys').doc();
    const data = { schoolId, name, keyHash, status: 'active', createdAt: new Date() };
    await ref.set(data);
    // rawKey is returned exactly once — it is never stored or retrievable again.
    return { id: ref.id, ...data, rawKey };
  }

  revoke(id: string) {
    return this.firestore.db.collection('apiKeys').doc(id).update({ status: 'revoked' });
  }

  async list(schoolId: string) {
    const snap = await this.firestore.db.collection('apiKeys').where('schoolId', '==', schoolId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// ─── SETTINGS — Firestore collections: `rolePermissions` (deterministic
// doc id `${schoolId}_${role}_${module}`, replacing Prisma's
// @@unique(schoolId, role, module) the same way Attendance's
// `${studentId}_${date}` pattern replaced its own composite key),
// `auditLogs` (read side only — nothing currently registered writes to
// it, since AuditInterceptor still depends on Prisma and hasn't been
// converted; this returns real but empty results until that happens,
// same "honest gap, not a fabricated one" pattern used throughout this
// migration). ───
@Injectable()
export class SettingsService {
  constructor(private firestore: FirestoreService) {}

  updateBranding(schoolId: string, name: string, primaryColor: string) {
    return this.firestore.db.collection('schools').doc(schoolId).update({ name, primaryColor });
  }

  setPermission(
    schoolId: string,
    role: string,
    module: string,
    patch: Partial<{ canView: boolean; canEdit: boolean; canDelete: boolean; canAdmin: boolean }>,
  ) {
    const id = `${schoolId}_${role}_${module}`;
    return this.firestore.db.collection('rolePermissions').doc(id).set(
      { schoolId, role, module, ...patch },
      { merge: true }, // merge = upsert semantics, same as Prisma's upsert
    );
  }

  async getPermissionMatrix(schoolId: string, role: string) {
    const snap = await this.firestore.db
      .collection('rolePermissions')
      .where('schoolId', '==', schoolId)
      .where('role', '==', role)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // The read side of the audit trail — Settings' UI has shown hardcoded
  // rows for this since it was first built; this is what makes it real,
  // once AuditInterceptor itself gets converted and starts writing here.
  async getAuditLog(schoolId: string, limit = 50) {
    const snap = await this.firestore.db
      .collection('auditLogs')
      .where('schoolId', '==', schoolId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('portals')
export class PortalsController {
  constructor(private readonly portals: PortalsService) {}

  @Get('parent/:studentId')
  getParent(@CurrentUser() user: { schoolId: string }, @Param('studentId') studentId: string) {
    return this.portals.getParentSnapshot(user.schoolId, studentId);
  }

  @Get('teacher/:staffId')
  getTeacher(@Param('staffId') staffId: string) {
    return this.portals.getTeacherSnapshot(staffId);
  }
}

@Controller('campuses')
export class CampusesController {
  constructor(private readonly campuses: CampusesService) {}

  @Get('comparison')
  getComparison(@CurrentUser() user: { schoolId: string }) {
    return this.campuses.getCampusComparison(user.schoolId);
  }
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview/:term')
  getOverview(@CurrentUser() user: { schoolId: string }, @Param('term') term: string) {
    return this.analytics.getExecutiveOverview(user.schoolId, term);
  }
}

@Controller('api-keys')
@Roles('admin')
export class ApiKeysController {
  constructor(private readonly apiKeys: ApiKeysService) {}

  @Get()
  list(@CurrentUser() user: { schoolId: string }) {
    return this.apiKeys.list(user.schoolId);
  }

  @Post()
  create(@CurrentUser() user: { schoolId: string }, @Body('name') name: string) {
    return this.apiKeys.create(user.schoolId, name);
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string) {
    return this.apiKeys.revoke(id);
  }
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  // Branding changes and permission edits are admin-only actions.
  @Roles('admin')
  @Patch('branding')
  updateBranding(@CurrentUser() user: { schoolId: string }, @Body() body: { name: string; primaryColor: string }) {
    return this.settings.updateBranding(user.schoolId, body.name, body.primaryColor);
  }

  @Get('permissions/:role')
  getPermissions(@CurrentUser() user: { schoolId: string }, @Param('role') role: string) {
    return this.settings.getPermissionMatrix(user.schoolId, role);
  }

  @Roles('admin')
  @Patch('permissions/:role/:module')
  setPermission(
    @CurrentUser() user: { schoolId: string },
    @Param('role') role: string,
    @Param('module') module: string,
    @Body() patch: Partial<{ canView: boolean; canEdit: boolean; canDelete: boolean; canAdmin: boolean }>,
  ) {
    return this.settings.setPermission(user.schoolId, role, module, patch);
  }

  @Get('audit-log')
  getAuditLog(@CurrentUser() user: { schoolId: string }) {
    return this.settings.getAuditLog(user.schoolId);
  }
}
