// Every route touching Firestore needs FIREBASE_PROJECT_ID/CLIENT_EMAIL/
// PRIVATE_KEY, and every route signing/verifying a JWT needs JWT_SECRET.
// Checked explicitly and first, so a missing or misspelled variable
// shows up as a plain-English answer in the response instead of an
// opaque crash from whatever library first tries to read it.
const REQUIRED_ENV_VARS = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'JWT_SECRET'];

export function checkRequiredEnvVars(): string[] {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key] || process.env[key]!.trim() === '');
}

export function envCheckResponse(): Response | null {
  const missing = checkRequiredEnvVars();
  if (missing.length === 0) return null;
  return Response.json(
    {
      error: 'Missing required environment variables',
      missing,
      fix: 'Go to Vercel → this project → Settings → Environment Variables and add the variable(s) listed above, spelled exactly as shown, then redeploy.',
    },
    { status: 500 },
  );
}
