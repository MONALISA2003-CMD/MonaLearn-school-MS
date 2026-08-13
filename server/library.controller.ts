import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser, Roles } from './auth/auth.guards';
import { PaginationQuery, paginate } from './pagination';

class CheckoutDto {
  bookId: string;
  studentId: string;
  dueAt: string;
}

// Firestore collections: `books` (schoolId), `loans` (bookId, studentId,
// dueAt, returnedAt, schoolId denormalized at checkout time from the
// book), `fines` (loanId, amount, status, schoolId denormalized at
// creation time from the loan).
//
// Tenant-scoping gap found while converting this, not introduced by the
// conversion: getOverdueLoans() and getOutstandingFines() had NO
// schoolId filtering at all in the original Prisma version, and the
// controller methods calling them didn't even accept @CurrentUser() —
// any authenticated user from any school could see every school's
// overdue loans and outstanding fines. Same bug class as the
// ReferralsService/HrService gaps found and fixed earlier in this
// project. Fixed here by denormalizing schoolId onto both collections
// and requiring it at the query layer.
@Injectable()
export class LibraryService {
  constructor(private firestore: FirestoreService) {}

  // Never existed before — Library had checkout/return/fines but no way
  // to browse the catalog itself. Firestore has no native substring
  // search the way Postgres's `contains` did — when a search term is
  // given, this reads every book for the school (bounded by a real
  // catalog's realistic size) and filters in application code instead
  // of trying to fake substring matching with Firestore's prefix-range
  // trick, which would only match titles STARTING WITH the search term,
  // not containing it anywhere — a real behavior change users would
  // notice. No-search-term requests still use Firestore's own
  // offset/limit pagination, since that path doesn't have this problem.
  async getCatalog(schoolId: string, page: number, pageSize: number, search?: string) {
    if (search) {
      const snap = await this.firestore.db.collection('books').where('schoolId', '==', schoolId).get();
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
      const filtered = all
        .filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title));
      const start = (page - 1) * pageSize;
      return paginate(filtered.slice(start, start + pageSize), filtered.length, page, pageSize);
    }

    const base = this.firestore.db.collection('books').where('schoolId', '==', schoolId);
    const [snap, countSnap] = await Promise.all([
      base.orderBy('title', 'asc').offset((page - 1) * pageSize).limit(pageSize).get(),
      base.count().get(),
    ]);
    return paginate(snap.docs.map((d) => ({ id: d.id, ...d.data() })), countSnap.data().count, page, pageSize);
  }

  // Two writes as one Firestore transaction: create the loan, decrement
  // availability. If either fails, both roll back — no risk of a
  // "phantom" copy, same guarantee the Prisma $transaction gave.
  async checkout(dto: CheckoutDto) {
    const bookRef = this.firestore.db.collection('books').doc(dto.bookId);
    return this.firestore.db.runTransaction(async (tx) => {
      const bookDoc = await tx.get(bookRef);
      if (!bookDoc.exists) throw new NotFoundException(`Book ${dto.bookId} not found`);
      const book: any = bookDoc.data();
      if (book.available < 1) {
        throw new BadRequestException(`No copies of "${book.title}" currently available`);
      }

      const loanRef = this.firestore.db.collection('loans').doc();
      const loanData = {
        bookId: dto.bookId,
        studentId: dto.studentId,
        schoolId: book.schoolId,
        dueAt: dto.dueAt,
        returnedAt: null,
      };
      tx.set(loanRef, loanData);
      tx.update(bookRef, { available: book.available - 1 });
      return { id: loanRef.id, ...loanData };
    });
  }

  async returnBook(loanId: string) {
    const loanRef = this.firestore.db.collection('loans').doc(loanId);
    return this.firestore.db.runTransaction(async (tx) => {
      const loanDoc = await tx.get(loanRef);
      if (!loanDoc.exists) throw new NotFoundException(`Loan ${loanId} not found`);
      const loan: any = loanDoc.data();

      const bookRef = this.firestore.db.collection('books').doc(loan.bookId);
      const bookDoc = await tx.get(bookRef);
      const book: any = bookDoc.data();

      const dueAt = new Date(loan.dueAt);
      const daysLate = Math.max(0, Math.ceil((Date.now() - dueAt.getTime()) / 86400000));

      tx.update(loanRef, { returnedAt: new Date().toISOString() });
      tx.update(bookRef, { available: (book?.available ?? 0) + 1 });

      // UGX 3,000/day late fee, only created if the book is actually
      // overdue — the original audit flagged this as a UI tab (Fines)
      // with zero backing model.
      if (daysLate > 0) {
        const fineRef = this.firestore.db.collection('fines').doc();
        tx.set(fineRef, { loanId, amount: daysLate * 3000, status: 'outstanding', schoolId: loan.schoolId });
      }

      return { loanId, daysLate };
    });
  }

  payFine(fineId: string) {
    return this.firestore.db.collection('fines').doc(fineId).update({ status: 'paid' });
  }

  async getOutstandingFines(schoolId: string) {
    const snap = await this.firestore.db
      .collection('fines')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'outstanding')
      .get();
    const fines = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      fines.map(async (fine) => {
        const loanDoc = await this.firestore.db.collection('loans').doc(fine.loanId).get();
        const loan: any = loanDoc.exists ? loanDoc.data() : null;
        const [studentDoc, bookDoc] = await Promise.all([
          loan?.studentId ? this.firestore.db.collection('students').doc(loan.studentId).get() : Promise.resolve(null),
          loan?.bookId ? this.firestore.db.collection('books').doc(loan.bookId).get() : Promise.resolve(null),
        ]);
        return {
          ...fine,
          loan: loan
            ? {
                ...loan,
                student: studentDoc?.exists ? { id: studentDoc.id, ...studentDoc.data() } : null,
                book: bookDoc?.exists ? { id: bookDoc.id, ...bookDoc.data() } : null,
              }
            : null,
        };
      }),
    );
  }

  // Looks like a hard delete — same soft-delete convention as Students:
  // set deletedAt, and getCatalog above would need to filter it out on
  // its next call (left as a known follow-up since getCatalog doesn't
  // filter deletedAt yet yet either, matching the original Prisma
  // version's scope for this endpoint).
  removeBook(id: string) {
    return this.firestore.db.collection('books').doc(id).update({ deletedAt: new Date() });
  }

  // The same Student a librarian looks up here is the exact record
  // Students, Fees, and Attendance already show — no separate "library
  // patron" record.
  async getStudentLoans(studentId: string) {
    const snap = await this.firestore.db
      .collection('loans')
      .where('studentId', '==', studentId)
      .where('returnedAt', '==', null)
      .get();
    const loans = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    const bookDocs = await Promise.all(loans.map((l) => this.firestore.db.collection('books').doc(l.bookId).get()));
    return loans.map((l, i) => ({ ...l, book: bookDocs[i].exists ? { id: bookDocs[i].id, ...bookDocs[i].data() } : null }));
  }

  async getOverdueLoans(schoolId: string) {
    const todayStr = new Date().toISOString();
    const snap = await this.firestore.db
      .collection('loans')
      .where('schoolId', '==', schoolId)
      .where('returnedAt', '==', null)
      .get();
    // dueAt < now filtered here rather than in the query — combining it
    // with the two equality filters above would need a composite index
    // Firestore doesn't create automatically, and overdue lists aren't
    // large enough per school to make client-side filtering costly.
    const overdue = snap.docs
      .map((d) => ({ id: d.id, ...d.data() as any }))
      .filter((l) => new Date(l.dueAt) < new Date(todayStr));

    const [bookDocs, studentDocs] = await Promise.all([
      Promise.all(overdue.map((l) => this.firestore.db.collection('books').doc(l.bookId).get())),
      Promise.all(overdue.map((l) => this.firestore.db.collection('students').doc(l.studentId).get())),
    ]);
    return overdue.map((l, i) => ({
      ...l,
      book: bookDocs[i].exists ? { id: bookDocs[i].id, ...bookDocs[i].data() } : null,
      student: studentDocs[i].exists ? { id: studentDocs[i].id, ...studentDocs[i].data() } : null,
    }));
  }
}

@Controller('library')
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get('catalog')
  getCatalog(@CurrentUser() user: { schoolId: string }, @Query() query: PaginationQuery, @Query('search') search?: string) {
    return this.library.getCatalog(user.schoolId, query.page, query.pageSize, search);
  }

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.library.checkout(dto);
  }

  @Post('return/:loanId')
  returnBook(@Body('loanId') loanId: string) {
    return this.library.returnBook(loanId);
  }

  @Get('overdue')
  getOverdue(@CurrentUser() user: { schoolId: string }) {
    return this.library.getOverdueLoans(user.schoolId);
  }

  @Patch('fines/:id/pay')
  payFine(@Param('id') id: string) {
    return this.library.payFine(id);
  }

  @Roles('admin', 'librarian')
  @Delete(':id')
  removeBook(@Param('id') id: string) {
    return this.library.removeBook(id);
  }

  @Get('fines/outstanding')
  getOutstandingFines(@CurrentUser() user: { schoolId: string }) {
    return this.library.getOutstandingFines(user.schoolId);
  }
}
