import { Controller, Get, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

// Gap found while wiring the frontend: Attendance's Daily Register and
// Academics' Gradebook both require a real classId, but nothing anywhere
// in the API let a caller discover what classes actually exist — every
// module that takes a classId silently assumed the caller already had
// one. Small module, but it's what makes the other two pages wireable.
//
// Firestore collection: `classes`, each doc { schoolId, name, level,
// createdAt }. No relations to denormalize here — this collection is
// the thing OTHER collections reference (students, timetable slots,
// applicants all store a classId pointing at a doc here), not the
// other way around, so this conversion needed no schema redesign.
@Injectable()
export class ClassesService {
  constructor(private firestore: FirestoreService) {}

  async getAll(schoolId: string) {
    const snap = await this.firestore.db
      .collection('classes')
      .where('schoolId', '==', schoolId)
      .orderBy('name', 'asc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('classes')
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}

  @Get()
  getAll(@CurrentUser() user: { schoolId: string }) {
    return this.classes.getAll(user.schoolId);
  }
}
