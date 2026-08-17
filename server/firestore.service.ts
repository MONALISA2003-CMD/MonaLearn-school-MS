import { Firestore } from '@google-cloud/firestore';
import { normalizePrivateKey, validatePrivateKey } from './lib/private-key';

// A plain lazy singleton — no NestJS DI container needed. Every service
// function calls getFirestore() directly and gets the same instance
// back within one warm container.
//
// Uses @google-cloud/firestore directly rather than the `firebase-admin`
// package this used to go through — firebase-admin bundles Auth, Cloud
// Messaging, and several other Firebase products this app never uses at
// all (its auth is entirely custom JWT + bcryptjs), and is documented to
// meaningfully inflate what a serverless function has to package.
//
// Needs three env vars, all from a Firebase service account (Firebase
// Console → Project Settings → Service Accounts → Generate new private
// key): FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.
// See server/lib/private-key.ts for the normalization/validation this
// last one goes through — it's the one value in this whole project most
// prone to subtle corruption when pasted through a single-line
// environment-variable input, and very likely the actual root cause
// behind a long chain of previously-opaque deployment failures.
//
// preferRest avoids loading Firestore's underlying gRPC client, which
// depends on a natively-compiled binary — documented to cause silent
// serverless deployment failures on platforms that don't guarantee
// native bindings load correctly.
let firestoreInstance: Firestore | undefined;

export function getFirestore(): Firestore {
  if (!firestoreInstance) {
    const normalizedKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY ?? '');
    const check = validatePrivateKey(normalizedKey);
    if (!check.valid) {
      // Thrown here, at the one place this value is actually used —
      // callers already catch and surface this message directly in
      // their HTTP response (see server/lib/errors.ts's toHttpResponse),
      // the same diagnostic-first approach used throughout this
      // project's deployment troubleshooting.
      throw new Error(`Invalid FIREBASE_PRIVATE_KEY: ${check.reason}`);
    }

    firestoreInstance = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: normalizedKey,
      },
      preferRest: true,
    });
  }
  return firestoreInstance;
}
