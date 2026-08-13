import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Models that support soft delete. Student was the reference example;
// Staff and Book are covered too — extending to Asset etc. is a
// one-line addition each.
const SOFT_DELETE_MODELS = ['Student', 'Staff', 'Book'];

// Every service below injects this instead of creating its own client.
// One connection pool, shared across Students, Fees, Attendance, etc.
//
// SERVERLESS NOTE (Vercel): each concurrent function invocation can spin
// up its own container, and each container that calls onModuleInit opens
// its own Postgres connection. A plain Postgres instance has a hard
// connection ceiling (often ~100) that a burst of traffic can exhaust in
// seconds. DATABASE_URL on Vercel MUST point at a pooled connection —
// Neon or Vercel Postgres both provide one (?pgbouncer=true or their
// dedicated pooled host). Do not point Vercel at a raw, unpooled
// Postgres connection string.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();

    // Rewrites delete/deleteMany into an update that sets deletedAt,
    // and rewrites every find* to exclude soft-deleted rows by default —
    // so nothing calling `prisma.student.delete()` needs to change, and
    // nothing calling `prisma.student.findMany()` needs to remember to
    // filter deletedAt itself. This is what makes soft delete "automatic"
    // rather than something every one of the 28 services has to opt into.
    this.$use(async (params, next) => {
      if (!SOFT_DELETE_MODELS.includes(params.model ?? '')) return next(params);

      if (params.action === 'delete') {
        params.action = 'update';
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        params.args.data = { ...(params.args.data ?? {}), deletedAt: new Date() };
      }
      if (['findUnique', 'findFirst'].includes(params.action)) {
        params.args.where = { ...params.args.where, deletedAt: null };
      }
      if (params.action === 'findMany') {
        params.args.where = { ...(params.args.where ?? {}), deletedAt: params.args.where?.deletedAt ?? null };
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
