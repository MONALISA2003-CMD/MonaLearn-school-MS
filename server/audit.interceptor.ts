import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
import { SetMetadata } from '@nestjs/common';

// Attach to any controller method worth auditing:
//   @Audit('payment.recorded', 'FeeInvoice')
//   @Post('payments') recordPayment(...) { ... }
export const AUDIT_KEY = 'audit';
export const Audit = (action: string, entityType: string) =>
  SetMetadata(AUDIT_KEY, { action, entityType });

// Firestore collection: `auditLogs` (schoolId, createdAt) — this is the
// writer side; SettingsService.getAuditLog (in platform.controller.ts,
// converted earlier in this migration) is the reader, and had been
// returning real-but-permanently-empty results the whole time this
// interceptor sat unconverted. That gap is what this closes.
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private firestore: FirestoreService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.get<{ action: string; entityType: string }>(
      AUDIT_KEY,
      context.getHandler(),
    );

    // No @Audit() decorator on this handler = nothing to log, pass through.
    if (!meta) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user as { userId: string; schoolId: string } | undefined;

    return next.handle().pipe(
      tap((result) => {
        // Fire-and-forget: a logging failure should never break the
        // actual request that triggered it — same guarantee the Prisma
        // version gave, just with Firestore's collection API instead of
        // auditLog.create().
        this.firestore.db
          .collection('auditLogs')
          .add({
            schoolId: user?.schoolId ?? 'unknown',
            userId: user?.userId ?? null,
            action: meta.action,
            entityType: meta.entityType,
            entityId: (result as any)?.id ?? null,
            metadata: request.body ?? null,
            createdAt: new Date(),
          })
          .catch((err) => console.error('Audit log write failed:', err));
      }),
    );
  }
}
