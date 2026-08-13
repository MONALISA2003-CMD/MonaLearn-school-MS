import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from '../server/app.module';

// This is the ONLY function in this project — every request to /api/*
// lands here, via the explicit rewrite in vercel.json
// ({"source": "/api/:path*", "destination": "/api"}) rather than
// relying on a bracket-filename catch-all convention. That's a
// deliberate change: this file used to be named `[...slug].ts`, on the
// assumption that Vercel's routing for a plain top-level /api folder
// (outside Next.js's own app/pages router) supports the same
// catch-all bracket syntax Next.js uses internally — an assumption
// that was never actually verified and, after persistent unexplained
// 500s survived two unrelated real fixes, became the more suspicious
// thing. vercel.json's rewrite is the same explicit, well-documented
// mechanism recommended for wrapping one full framework's router (here,
// NestJS's own internal routing) in a single Vercel function — it
// preserves the original request path, so NestJS's own routes
// (/api/auth/login, /api/students, etc.) still resolve correctly
// against req.url exactly as before, just via an unambiguous mechanism
// instead of an unverified filename convention.
let cachedServer: any;

// Every service in this app needs FIREBASE_PROJECT_ID/CLIENT_EMAIL/
// PRIVATE_KEY (via FirestoreService) and every authenticated route needs
// JWT_SECRET (via JwtStrategy/JwtModule) — both are read directly from
// process.env at construction time, and if either is missing, the
// underlying library (firebase-admin or passport-jwt) throws immediately,
// crashing the ENTIRE app before it can serve a single request. That
// crash normally only shows up in Vercel's build/runtime logs, which
// have been hard to fully capture from a phone in this project — so this
// check runs first and, if something's missing, returns a plain-English
// answer directly in the browser response instead of an opaque stack
// trace buried in a log you may not be able to scroll to.
function checkRequiredEnvVars(): string[] {
  const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'JWT_SECRET'];
  return required.filter((key) => !process.env[key] || process.env[key]!.trim() === '');
}

async function bootstrapServer() {
  if (cachedServer) return cachedServer;

  const expressApp = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  nestApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  // No enableCors() here on purpose: in single-project mode the frontend
  // and API are served from the same origin, so cross-origin requests
  // never happen — the two-project version needs CORS, this one doesn't.
  nestApp.setGlobalPrefix('api');

  await nestApp.init();
  cachedServer = serverlessExpress({ app: expressApp });
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const missing = checkRequiredEnvVars();
  if (missing.length > 0) {
    res.status(500).json({
      error: 'Missing required environment variables',
      missing,
      fix: 'Go to Vercel → this project → Settings → Environment Variables and add the variable(s) listed above, spelled exactly as shown, then redeploy.',
    });
    return;
  }

  try {
    const server = await bootstrapServer();
    return server(req, res);
  } catch (err: any) {
    // Same idea as the env-var check above: put the real error where it
    // can actually be read, instead of only in a log.
    res.status(500).json({
      error: 'The app failed to start',
      message: err?.message ?? String(err),
    });
  }
}
