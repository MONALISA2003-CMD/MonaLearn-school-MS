import { Controller, Get, Post, Param, Body, Query, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IsString, IsNumber, IsIn, Min } from 'class-validator';
import { CurrentUser } from './auth/auth.guards';
import { FirestoreService } from './firestore.service';
import { PaginationQuery, paginate } from './pagination';

class RecordPaymentDto {
  @IsString()
  invoiceId: string;

  @IsNumber()
  @Min(1) // before: no validation at all — a payment of -50000 or 0 would have been accepted
  amount: number;

  @IsIn(['Mobile Money', 'Bank', 'Cash', 'Cheque'])
  method: 'Mobile Money' | 'Bank' | 'Cash' | 'Cheque';
}

// Firestore collections: `feeInvoices`, `payments` (studentModule's
// remove()/enroll() conversion notes the same general pattern).
// FeeInvoice had no schoolId of its own in the Postgres schema — tenant
// scoping only ever reached it via `student: { schoolId }` in a Prisma
// `where`. Firestore has no equivalent join-through-relation filter, and
// batching every student id into an `in` query hits a hard 30-value
// ceiling that would silently break for any real school — so schoolId
// is denormalized directly onto each invoice doc instead. Whatever
// creates a FeeInvoice going forward needs to set it explicitly; nothing
// in this file creates invoices (only reads them and records payments
// against existing ones), so there's no write path here to update.
@Injectable()
export class FeesService {
  constructor(private firestore: FirestoreService) {}

  private async withPayments(invoices: any[]) {
    return Promise.all(
      invoices.map(async (inv) => {
        const paySnap = await this.firestore.db.collection('payments').where('invoiceId', '==', inv.id).get();
        return { ...inv, payments: paySnap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }),
    );
  }

  // Gap found while wiring the frontend originally: there was no way to
  // list invoices at all, only fetch one by id — the same "unreachable
  // feature" pattern found repeatedly during the backend sweep, just
  // surfacing here as a missing endpoint instead of a missing route.
  async getAllInvoices(schoolId: string, page: number, pageSize: number) {
    const base = this.firestore.db.collection('feeInvoices').where('schoolId', '==', schoolId);
    const [snap, countSnap] = await Promise.all([
      base.orderBy('term', 'desc').offset((page - 1) * pageSize).limit(pageSize).get(),
      base.count().get(),
    ]);
    const invoices = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const withPayments = await this.withPayments(invoices);
    return paginate(withPayments, countSnap.data().count, page, pageSize);
  }

  async getInvoice(invoiceId: string) {
    const doc = await this.firestore.db.collection('feeInvoices').doc(invoiceId).get();
    if (!doc.exists) throw new NotFoundException(`Invoice ${invoiceId} not found`);
    const invoice: any = { id: doc.id, ...doc.data() };

    const [paySnap, studentDoc] = await Promise.all([
      this.firestore.db.collection('payments').where('invoiceId', '==', invoiceId).get(),
      invoice.studentId ? this.firestore.db.collection('students').doc(invoice.studentId).get() : Promise.resolve(null),
    ]);

    return {
      ...invoice,
      payments: paySnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      student: studentDoc?.exists ? { id: studentDoc.id, ...studentDoc.data() } : null,
    };
  }

  // The real version of the prototype's recordPayment(): inserts a Payment
  // doc rather than mutating a balance field, so the audit trail is never lost.
  async recordPayment(dto: RecordPaymentDto) {
    const invoice = await this.getInvoice(dto.invoiceId);
    const alreadyPaid = invoice.payments.reduce((s: number, p: any) => s + Number(p.amount), 0);
    const remaining = Number(invoice.billedAmount) - alreadyPaid;

    if (dto.amount > remaining) {
      throw new BadRequestException(
        `Payment of ${dto.amount} exceeds remaining balance of ${remaining}`,
      );
    }

    const ref = this.firestore.db.collection('payments').doc();
    const data = { invoiceId: dto.invoiceId, amount: dto.amount, method: dto.method, paidAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // Powers the Dashboard's "Fees collected" stat card.
  async getCollectionSummary(schoolId: string, term: string) {
    const snap = await this.firestore.db
      .collection('feeInvoices')
      .where('schoolId', '==', schoolId)
      .where('term', '==', term)
      .get();
    const invoices = await this.withPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const totalBilled = invoices.reduce((s, i: any) => s + Number(i.billedAmount), 0);
    const totalPaid = invoices.reduce(
      (s, i: any) => s + i.payments.reduce((ps: number, p: any) => ps + Number(p.amount), 0),
      0,
    );

    return {
      totalBilled,
      totalPaid,
      collectionRate: totalBilled ? Math.round((totalPaid / totalBilled) * 100) : 0,
      overdueCount: invoices.filter(
        (i: any) => Number(i.billedAmount) > i.payments.reduce((ps: number, p: any) => ps + Number(p.amount), 0),
      ).length,
    };
  }
}

@Controller('fees')
export class FeesController {
  constructor(private readonly fees: FeesService) {}

  @Get('invoices')
  getAllInvoices(@CurrentUser() user: { schoolId: string }, @Query() query: PaginationQuery) {
    return this.fees.getAllInvoices(user.schoolId, query.page, query.pageSize);
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.fees.getInvoice(id);
  }

  @Post('payments')
  recordPayment(@Body() dto: RecordPaymentDto) {
    return this.fees.recordPayment(dto);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: { schoolId: string }) {
    // term would come from a query param in the real handler
    return this.fees.getCollectionSummary(user.schoolId, '2026-T2');
  }
}
