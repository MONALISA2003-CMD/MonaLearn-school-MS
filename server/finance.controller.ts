import { Controller, Get, Post, Param, Body, Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class PostEntryDto {
  account: string;
  debit?: number;
  credit?: number;
  ref?: string;
}

class CreateBudgetDto {
  category: string;
  term: string;
  allocated: number;
}

// Firestore collections: `ledgerEntries`, `budgets` — both simple
// schoolId-scoped lists, no relations to work around here.
@Injectable()
export class FinanceService {
  constructor(private firestore: FirestoreService) {}

  // Append-only by design: correcting a mistake means posting a reversing
  // entry, not editing history. Anyone auditing the books later sees both.
  async postEntry(schoolId: string, dto: PostEntryDto) {
    // Bug found in the original Prisma version, fixed then and
    // preserved here: a call with neither debit nor credit set used to
    // silently create a zero-value ledger row — a garbage entry that
    // pollutes getNetPosition's totals for nothing.
    if (!dto.debit && !dto.credit) {
      throw new BadRequestException('A ledger entry must have a debit or a credit amount');
    }
    const ref = this.firestore.db.collection('ledgerEntries').doc();
    const data = { schoolId, account: dto.account, debit: dto.debit ?? 0, credit: dto.credit ?? 0, ref: dto.ref ?? null, postedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getNetPosition(schoolId: string) {
    const snap = await this.firestore.db.collection('ledgerEntries').where('schoolId', '==', schoolId).get();
    const entries = snap.docs.map((d) => d.data() as any);
    const totalDebit = entries.reduce((s, e) => s + Number(e.debit), 0);
    const totalCredit = entries.reduce((s, e) => s + Number(e.credit), 0);
    return { totalDebit, totalCredit, net: totalCredit - totalDebit };
  }

  // Gap flagged in the original audit and fixed then: incrementSpend
  // existed but there was no way to create the Budget row it increments
  // in the first place.
  async createBudget(schoolId: string, dto: CreateBudgetDto) {
    const ref = this.firestore.db.collection('budgets').doc();
    const data = { schoolId, ...dto, spent: 0 };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getBudgetStatus(schoolId: string, term: string) {
    const snap = await this.firestore.db
      .collection('budgets')
      .where('schoolId', '==', schoolId)
      .where('term', '==', term)
      .get();
    return snap.docs.map((d) => {
      const b: any = d.data();
      return {
        category: b.category,
        allocated: Number(b.allocated),
        spent: Number(b.spent),
        overBudget: Number(b.spent) > Number(b.allocated),
      };
    });
  }

  // Called whenever an expense is approved (Procurement) or a payslip
  // runs (HR) — keeps Budget.spent in sync without a separate
  // reconciliation job. FieldValue.increment() is Firestore's atomic
  // counter operation — the same "don't read-then-write, let the
  // database do the math" guarantee Prisma's `increment` gave, avoiding
  // a lost-update race if two expenses post against the same budget at
  // once.
  incrementSpend(budgetId: string, amount: number) {
    return this.firestore.db.collection('budgets').doc(budgetId).update({
      spent: admin.firestore.FieldValue.increment(amount),
    });
  }
}

@Controller('finance')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Post('ledger')
  post(@CurrentUser() user: { schoolId: string }, @Body() dto: PostEntryDto) {
    return this.finance.postEntry(user.schoolId, dto);
  }

  @Get('net-position')
  getNetPosition(@CurrentUser() user: { schoolId: string }) {
    return this.finance.getNetPosition(user.schoolId);
  }

  @Post('budgets')
  createBudget(@CurrentUser() user: { schoolId: string }, @Body() dto: CreateBudgetDto) {
    return this.finance.createBudget(user.schoolId, dto);
  }

  @Get('budgets/:term')
  getBudgets(@CurrentUser() user: { schoolId: string }, @Param('term') term: string) {
    return this.finance.getBudgetStatus(user.schoolId, term);
  }

  @Post('budgets/:id/increment-spend')
  incrementSpend(@Param('id') id: string, @Body('amount') amount: number) {
    return this.finance.incrementSpend(id, amount);
  }
}
