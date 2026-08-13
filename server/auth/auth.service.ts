import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FirestoreService } from '../firestore.service';

interface JwtPayload {
  sub: string;      // Firestore doc id, users collection
  schoolId: string;
  role: string;
  staffId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private firestore: FirestoreService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Firestore has no unique index to enforce one document per email —
    // that's application-level here, same as everywhere else in a
    // document database. limit(1) is safe in practice because writes
    // that create a user always check for an existing email first (see
    // register() below), but nothing in Firestore itself prevents two
    // concurrent writes from both passing that check at once — a real
    // gap worth a Cloud Function trigger or transaction-based check if
    // this system ever needs stronger guarantees than "very unlikely."
    const snap = await this.firestore.db.collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) throw new UnauthorizedException('Invalid credentials');

    const doc = snap.docs[0];
    const user = doc.data();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: doc.id,
      schoolId: user.schoolId,
      role: user.role,
      staffId: user.staffId ?? undefined,
    };

    return {
      accessToken: this.jwt.sign(payload),
      user: { email: user.email, role: user.role },
    };
  }

  // There is no signup flow anywhere in this system by design (accounts
  // are provisioned by an admin, not self-registered) — which means a
  // freshly created, empty Firestore database has zero documents in
  // `users` and nobody can ever log in. This is the one-time exception:
  // it creates the first `schools` doc and admin `users` doc, and then
  // permanently refuses to run again the moment any `users` document
  // exists, so it can't be used as a standing backdoor.
  async bootstrapAdmin(schoolName: string, domain: string, email: string, password: string) {
    const existing = await this.firestore.db.collection('users').limit(1).get();
    if (!existing.empty) {
      throw new ConflictException('Setup has already been completed for this deployment.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Firestore has no foreign-key constraint the way Postgres did, so
    // nothing stops a `users` doc from referencing a `schools` doc that
    // doesn't exist — but the two writes are still wrapped in a
    // transaction so a failure partway through (e.g. the second write
    // rejected by a security rule) can't leave an orphaned school
    // behind with no admin, same reasoning as the Postgres version this
    // replaces.
    const schoolRef = this.firestore.db.collection('schools').doc();
    const userRef = this.firestore.db.collection('users').doc();

    await this.firestore.db.runTransaction(async (tx) => {
      tx.set(schoolRef, {
        name: schoolName,
        domain,
        createdAt: new Date(),
      });
      tx.set(userRef, {
        schoolId: schoolRef.id,
        email,
        passwordHash,
        role: 'admin',
        staffId: null,
        createdAt: new Date(),
      });
    });

    const payload: JwtPayload = { sub: userRef.id, schoolId: schoolRef.id, role: 'admin' };
    return {
      accessToken: this.jwt.sign(payload),
      user: { email, role: 'admin' },
    };
  }

  // Existed as dead code before this conversion too — a service method
  // with no controller route wired to it (same "unreachable service
  // method" pattern found repeatedly during the original backend
  // sweep). Kept for when a real "admin creates a staff account" flow
  // gets built — bootstrapAdmin() above calls this for the one-time
  // first-admin case, but this is the general version any future
  // account-creation endpoint should call instead of duplicating the
  // password-hashing logic.
  async register(schoolId: string, email: string, password: string, role: string, staffId?: string) {
    // Same email-uniqueness caveat as login() above — checked here at
    // application level since Firestore has no unique index to enforce
    // it at the database level the way Postgres's User.email did.
    const existing = await this.firestore.db.collection('users').where('email', '==', email).limit(1).get();
    if (!existing.empty) {
      throw new ConflictException('That email is already registered.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const ref = this.firestore.db.collection('users').doc();
    const data = { schoolId, email, passwordHash, role, staffId: staffId ?? null, createdAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }
}
