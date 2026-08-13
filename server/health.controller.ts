import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.guards';
import { FirestoreService } from './firestore.service';

// The k8s manifest's readinessProbe/livenessProbe both hit GET /health —
// this is the endpoint that was referenced but never actually existed.
// @Public() because a load balancer checking pod health has no JWT.
// Converted from a Postgres check to a Firestore check alongside the
// rest of the data layer's move away from Prisma.
@Controller('health')
export class HealthController {
  constructor(private firestore: FirestoreService) {}

  @Public()
  @Get()
  async check() {
    try {
      // A real read, not just "the process is alive" — if Firestore is
      // unreachable or credentials are misconfigured, this fails.
      await this.firestore.db.collection('_health').limit(1).get();
      return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'degraded', database: 'unreachable', timestamp: new Date().toISOString() };
    }
  }
}
