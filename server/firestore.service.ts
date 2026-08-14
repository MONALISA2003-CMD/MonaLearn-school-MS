import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

// Replaces PrismaService as the thing every data-touching service
// injects. Firestore has no connection pool to manage the way Postgres
// did (no onModuleInit/$connect, no pooled-vs-direct URL distinction) —
// the SDK manages its own connections internally, which is part of why
// this file is much shorter than prisma.service.ts was.
//
// Uses @google-cloud/firestore DIRECTLY rather than the `firebase-admin`
// package this used to go through. Both offer identical Firestore
// functionality (confirmed via Google's own docs: firebase-admin is
// @google-cloud/firestore bundled together with Auth, Cloud Messaging,
// and several other Firebase products this app never uses at all — its
// auth is entirely custom JWT + bcryptjs) — but firebase-admin's extra
// bundled products meaningfully inflate what Vercel has to package into
// this serverless function. Multiple real, documented cases (Vercel's
// own community discussions, GitHub issues) describe exactly this
// combination — firebase-admin on a Vercel serverless function —
// exceeding Vercel's function size limit, which fails the function's
// own deploy silently: the rest of the site (the Next.js frontend)
// still builds and serves fine, while every request that should reach
// this function gets a generic platform-level 500 with no
// application-level error to catch, no matter what the application
// code does. That symptom matches this project's troubleshooting
// history closely enough that this is worth having fixed regardless of
// whether it turns out to be the whole story.
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
// bcrypt had. @google-cloud/firestore supports this option directly on
// its own constructor (it's the same option firebase-admin's
// initializeFirestore() was just forwarding to underneath).
//
// Guarded at module scope so only one Firestore client is ever
// constructed per warm container, even though multiple NestJS modules
// (AuthModule, AppModule) each provide their own FirestoreService
// instance — constructing more than one Firestore client for the same
// credentials is wasted overhead, not an error, but there's no reason
// to pay for it twice.
let firestoreInstance: Firestore | undefined;

@Injectable()
export class FirestoreService {
  public readonly db: Firestore;

  constructor() {
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
    this.db = firestoreInstance;
  }
}
