import { Controller, Get, Post, Body, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class AssignRoomDto {
  studentId: string;
  hostelRoomId: string;
}

class LogIncidentDto {
  hostelRoomId: string;
  studentId?: string;
  description: string;
  severity?: string;
}

// Firestore collections: `hostelRooms` (schoolId — the original Prisma
// bug fixed then and preserved here: HostelRoom didn't even carry a
// schoolId field until that fix, so this migration starts from the
// already-corrected shape, not the original broken one), `hostelIncidents`
// (schoolId denormalized from the room, same established pattern as
// every other tenant-scoped listing in this migration).
@Injectable()
export class HostelService {
  constructor(private firestore: FirestoreService) {}

  async getRoomOccupancy(schoolId: string) {
    const roomSnap = await this.firestore.db.collection('hostelRooms').where('schoolId', '==', schoolId).get();
    const rooms = roomSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      rooms.map(async (r) => {
        const countSnap = await this.firestore.db.collection('students').where('hostelRoomId', '==', r.id).count().get();
        const occupied = countSnap.data().count;
        return { id: r.id, name: r.name, capacity: r.capacity, occupied, full: occupied >= r.capacity };
      }),
    );
  }

  async assignRoom(dto: AssignRoomDto) {
    const roomRef = this.firestore.db.collection('hostelRooms').doc(dto.hostelRoomId);
    const studentRef = this.firestore.db.collection('students').doc(dto.studentId);

    return this.firestore.db.runTransaction(async (tx) => {
      const roomDoc = await tx.get(roomRef);
      if (!roomDoc.exists) throw new NotFoundException(`Hostel room ${dto.hostelRoomId} not found`);
      const room: any = roomDoc.data();

      const occupiedSnap = await this.firestore.db.collection('students').where('hostelRoomId', '==', dto.hostelRoomId).count().get();
      if (occupiedSnap.data().count >= room.capacity) {
        throw new BadRequestException(`${room.name} is already full`);
      }

      tx.update(studentRef, { hostelRoomId: dto.hostelRoomId });
      return { studentId: dto.studentId, hostelRoomId: dto.hostelRoomId };
    });
  }

  async logIncident(dto: LogIncidentDto) {
    const roomDoc = await this.firestore.db.collection('hostelRooms').doc(dto.hostelRoomId).get();
    const schoolId = roomDoc.exists ? roomDoc.data()!.schoolId : null;

    const ref = this.firestore.db.collection('hostelIncidents').doc();
    const data = { ...dto, schoolId, status: 'open', loggedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getOpenIncidents(schoolId: string) {
    const snap = await this.firestore.db
      .collection('hostelIncidents')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'open')
      .get();
    const incidents = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const [roomDocs, studentDocs] = await Promise.all([
      Promise.all(incidents.map((i) => this.firestore.db.collection('hostelRooms').doc(i.hostelRoomId).get())),
      Promise.all(incidents.map((i) => (i.studentId ? this.firestore.db.collection('students').doc(i.studentId).get() : Promise.resolve(null)))),
    ]);

    return incidents.map((i, idx) => ({
      ...i,
      hostelRoom: roomDocs[idx].exists ? { id: roomDocs[idx].id, ...roomDocs[idx].data() } : null,
      student: studentDocs[idx]?.exists ? { id: studentDocs[idx]!.id, ...studentDocs[idx]!.data() } : null,
    }));
  }
}

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostel: HostelService) {}

  @Get('occupancy')
  getOccupancy(@CurrentUser() user: { schoolId: string }) {
    return this.hostel.getRoomOccupancy(user.schoolId);
  }

  @Post('assign')
  assign(@Body() dto: AssignRoomDto) {
    return this.hostel.assignRoom(dto);
  }

  @Post('incidents')
  logIncident(@Body() dto: LogIncidentDto) {
    return this.hostel.logIncident(dto);
  }

  @Get('incidents/open')
  getOpenIncidents(@CurrentUser() user: { schoolId: string }) {
    return this.hostel.getOpenIncidents(user.schoolId);
  }
}
