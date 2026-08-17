import * as bcrypt from 'bcryptjs';
import { getFirestore } from '../firestore.service';
import { signToken } from '../lib/jwt';
import { UnauthorizedError, ConflictError } from '../lib/errors';

export async function login(email: string, password: string) {
  // Firestore has no unique index to enforce one document per email —
  // that's application-level here, same as everywhere else in a
  // document database. limit(1) is safe in practice because writes
  // that create a user always check for an existing email first (see
  // register() below), but nothing in Firestore itself prevents two
  // concurrent writes from both passing that check at once — a real
  // gap worth a Cloud Function trigger or transaction-based check if
  // this system ever needs stronger guarantees than "very unlikely."
  const db = getFirestore();
  const snap = await db.collection('users').where('email', '==', email).limit(1).get();
  if (snap.empty) throw new UnauthorizedError('Invalid credentials');

  const doc = snap.docs[0];
  const user = doc.data();

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const accessToken = signToken({
    sub: doc.id,
    schoolId: user.schoolId,
    role: user.role,
    staffId: user.staffId ?? undefined,
  });

  return { accessToken, user: { email: user.email, role: user.role } };
}

// There is no signup flow anywhere in this system by design (accounts
// are provisioned by an admin, not self-registered) — which means a
// freshly created, empty Firestore database has zero documents in
// `users` and nobody can ever log in. This is the one-time exception:
// it creates the first `schools` doc and admin `users` doc, and then
// permanently refuses to run again the moment any `users` document
// exists, so it can't be used as a standing backdoor.
export async function bootstrapAdmin(schoolName: string, domain: string, email: string, password: string) {
  const db = getFirestore();
  const existing = await db.collection('users').limit(1).get();
  if (!existing.empty) {
    throw new ConflictError('Setup has already been completed for this deployment.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Firestore has no foreign-key constraint the way Postgres did, so
  // nothing stops a `users` doc from referencing a `schools` doc that
  // doesn't exist — but the two writes are still wrapped in a
  // transaction so a failure partway through can't leave an orphaned
  // school behind with no admin.
  const schoolRef = db.collection('schools').doc();
  const userRef = db.collection('users').doc();

  await db.runTransaction(async (tx) => {
    tx.set(schoolRef, { name: schoolName, domain, createdAt: new Date() });
    tx.set(userRef, {
      schoolId: schoolRef.id,
      email,
      passwordHash,
      role: 'admin',
      staffId: null,
      createdAt: new Date(),
    });
  });

  const accessToken = signToken({ sub: userRef.id, schoolId: schoolRef.id, role: 'admin' });
  return { accessToken, user: { email, role: 'admin' } };
}

// The general version any future "admin creates a staff account" flow
// should call — bootstrapAdmin() above calls this for the one-time
// first-admin case, avoiding duplicated password-hashing logic.
export async function register(schoolId: string, email: string, password: string, role: string, staffId?: string) {
  const db = getFirestore();
  const existing = await db.collection('users').where('email', '==', email).limit(1).get();
  if (!existing.empty) {
    throw new ConflictError('That email is already registered.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const ref = db.collection('users').doc();
  const data = { schoolId, email, passwordHash, role, staffId: staffId ?? null, createdAt: new Date() };
  await ref.set(data);
  return { id: ref.id, ...data };
}
