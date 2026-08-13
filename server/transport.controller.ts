import { Controller, Get, Post, Body, Param, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class AssignRouteDto {
  routeId: string;
  studentId: string;
  stopName: string;
}

// Firestore collections: `routes` (schoolId), `vehicles` (routeId),
// `routeAssignments` (routeId), `drivers` (schoolId).
@Injectable()
export class TransportService {
  constructor(private firestore: FirestoreService) {}

  async getRoutes(schoolId: string) {
    const routeSnap = await this.firestore.db.collection('routes').where('schoolId', '==', schoolId).get();
    const routes = routeSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      routes.map(async (r) => {
        const [vehicleSnap, assignSnap] = await Promise.all([
          this.firestore.db.collection('vehicles').where('routeId', '==', r.id).limit(1).get(),
          this.firestore.db.collection('routeAssignments').where('routeId', '==', r.id).get(),
        ]);
        return {
          ...r,
          vehicle: vehicleSnap.empty ? null : { id: vehicleSnap.docs[0].id, ...vehicleSnap.docs[0].data() },
          assignments: assignSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        };
      }),
    );
  }

  // Gap found in the original Prisma version, fixed then and preserved
  // here: Hostel and Library both guard against overbooking, Transport
  // didn't — a route with a 32-seat bus could silently take a 33rd
  // student with no error. Wrapped in a Firestore transaction (the
  // original wasn't) since this is a read-capacity-then-write
  // operation — the same race-condition reasoning as Fundraising's
  // double-spend fix and Hostel's room assignment.
  async assignStudent(dto: AssignRouteDto) {
    return this.firestore.db.runTransaction(async (tx) => {
      const routeDoc = await tx.get(this.firestore.db.collection('routes').doc(dto.routeId));
      if (!routeDoc.exists) throw new NotFoundException(`Route ${dto.routeId} not found`);
      const route: any = routeDoc.data();

      const [vehicleSnap, assignSnap] = await Promise.all([
        this.firestore.db.collection('vehicles').where('routeId', '==', dto.routeId).limit(1).get(),
        this.firestore.db.collection('routeAssignments').where('routeId', '==', dto.routeId).get(),
      ]);
      const vehicle = vehicleSnap.empty ? null : vehicleSnap.docs[0].data();

      if (vehicle && assignSnap.size >= (vehicle as any).capacity) {
        throw new BadRequestException(
          `${route.name} is at capacity (${(vehicle as any).capacity} seats) — no room for another student`,
        );
      }
      const ref = this.firestore.db.collection('routeAssignments').doc();
      tx.set(ref, dto);
      return { id: ref.id, ...dto };
    });
  }

  // The audit flagged Driver as entirely missing despite being core to
  // the Transport UI. License expiry is queryable directly, powering
  // the "expiring soon" flag the UI showed with hardcoded dates.
  async addDriver(schoolId: string, dto: { fullName: string; licenseNo: string; licenseExpiry: string; phone?: string; vehicleId?: string }) {
    const ref = this.firestore.db.collection('drivers').doc();
    const data = { schoolId, ...dto };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getDrivers(schoolId: string) {
    const snap = await this.firestore.db.collection('drivers').where('schoolId', '==', schoolId).get();
    const drivers = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const vehicleIds = [...new Set(drivers.map((d) => d.vehicleId).filter(Boolean))];
    const vehicleDocs = vehicleIds.length
      ? await this.firestore.db.getAll(...vehicleIds.map((id) => this.firestore.db.collection('vehicles').doc(id)))
      : [];
    const vehicleById = new Map(vehicleDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return drivers.map((d) => ({ ...d, vehicle: d.vehicleId ? vehicleById.get(d.vehicleId) ?? null : null }));
  }

  async getExpiringLicenses(schoolId: string, withinDays = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + withinDays);
    const cutoffStr = cutoff.toISOString();
    const snap = await this.firestore.db
      .collection('drivers')
      .where('schoolId', '==', schoolId)
      .where('licenseExpiry', '<=', cutoffStr)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Powers the "Student Ridership" tab — which students ride which
  // route, pulled straight from the same Student rows Fees and
  // Attendance use.
  async getRidership(routeId: string) {
    const snap = await this.firestore.db.collection('routeAssignments').where('routeId', '==', routeId).get();
    const assignments = snap.docs.map((d) => d.data() as any);

    const studentIds = [...new Set(assignments.map((a) => a.studentId).filter(Boolean))];
    const studentDocs = studentIds.length
      ? await this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id)))
      : [];
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as any]));

    return assignments.map((a) => ({
      studentName: studentById.get(a.studentId)?.fullName ?? '—',
      stop: a.stopName,
    }));
  }
}

@Controller('transport')
export class TransportController {
  constructor(private readonly transport: TransportService) {}

  @Get('routes')
  getRoutes(@CurrentUser() user: { schoolId: string }) {
    return this.transport.getRoutes(user.schoolId);
  }

  @Post('assign')
  assign(@Body() dto: AssignRouteDto) {
    return this.transport.assignStudent(dto);
  }

  @Get('routes/:id/ridership')
  getRidership(@Param('id') id: string) {
    return this.transport.getRidership(id);
  }

  @Post('drivers')
  addDriver(@CurrentUser() user: { schoolId: string }, @Body() dto: { fullName: string; licenseNo: string; licenseExpiry: string; phone?: string; vehicleId?: string }) {
    return this.transport.addDriver(user.schoolId, dto);
  }

  @Get('drivers')
  getDrivers(@CurrentUser() user: { schoolId: string }) {
    return this.transport.getDrivers(user.schoolId);
  }

  @Get('drivers/expiring-licenses')
  getExpiringLicenses(@CurrentUser() user: { schoolId: string }) {
    return this.transport.getExpiringLicenses(user.schoolId);
  }
}
