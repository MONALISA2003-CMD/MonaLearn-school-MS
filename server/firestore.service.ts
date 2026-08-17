import { Firestore } from '@google-cloud/firestore';

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
// The private key needs literal `\n` characters (not real line breaks)
// when pasted into Vercel's dashboard — the replace() below converts
// them back at runtime. Paste it with NO surrounding quote marks —
// Vercel's input takes the raw string as-is, unlike a .env file.
//
// preferRest avoids loading Firestore's underlying gRPC client, which
// depends on a natively-compiled binary — documented to cause exactly
// this kind of silent serverless deployment failure.
let firestoreInstance: Firestore | undefined;

export function getFirestore(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
      },
      preferRest: true,
    });
  }
  return firestoreInstance;
}
