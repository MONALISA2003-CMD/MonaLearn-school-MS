import { getFirestore } from '../../../server/firestore.service';
import { envCheckResponse } from '../../../server/lib/env-check';

// A real read, not just "the process is alive" — if Firestore is
// unreachable or credentials are misconfigured, this fails and reports
// degraded instead of ok.
export async function GET() {
  const envError = envCheckResponse();
  if (envError) return envError;

  try {
    const db = getFirestore();
    await db.collection('_health').limit(1).get();
    return Response.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ status: 'degraded', database: 'unreachable', message, timestamp: new Date().toISOString() });
  }
}
