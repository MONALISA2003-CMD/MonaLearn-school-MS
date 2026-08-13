import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initializeFirestore, type Firestore } from 'firebase-admin/firestore';

// Replaces PrismaService as the thing every data-touching service
// injects. Firestore has no connection pool to manage the way Postgres
// did (no onModuleInit/$connect, no pooled-vs-direct URL distinction) —
// the SDK manages its own connections internally, which is part of why
// this file is much shorter than prisma.service.ts was.
//
// Needs three env vars, all from a Firebase service account (Firebase
// Console → Project Settings → Service Accounts → Generate new private
// key, which downloads a JSON file containing exactly these three
// fields): FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and
// FIREBASE_PRIVATE_KEY. The private key contains real newlines in the
// downloaded JSON, but most dashboards (Vercel's included) don't handle
// multi-line env var values cleanly — paste it in with literal `\n`
// characters instead of actual line breaks, and the replace() below
// converts them back at runtime. Paste the value with NO surrounding
// quote marks in Vercel's dashboard — unlike a .env file, Vercel's
// input takes the raw string as-is, so literal `"` characters typed
// around it become part of the key itself and corrupt it.
//
// preferRest avoids loading Firestore's underlying gRPC client, which
// depends on a natively-compiled binary — the same class of problem
// bcrypt had, and a well-documented cause of Firestore silently
// crashing serverless functions on platforms that don't guarantee
// native bindings load correctly (Vercel among them). Google added this
// setting specifically for that reason. Guarded at module scope, not
// just admin.apps.length, because initializeFirestore() throws if
// called more than once for the same underlying app — and multiple
// NestJS modules (AuthModule, AppModule) each provide their own
// FirestoreService instance within one warm container, so this file's
// own constructor can run more than once per process.
let firestoreInstance: Firestore | undefined;

@Injectable()
export class FirestoreService {
  public readonly db: Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
        }),
      });
    }
    if (!firestoreInstance) {
      firestoreInstance = initializeFirestore(admin.app(), { preferRest: true });
    }
    this.db = firestoreInstance;
  }
}
