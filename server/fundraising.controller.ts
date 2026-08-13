import { Controller, Get, Post, Patch, Body, Param, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class RecordDonationDto {
  donorId: string;
  campaignId: string;
  amount: number;
}

class ApplyScholarshipDto {
  studentId: string;
  campaignId: string;
  requested: number;
}

// Firestore collections: `donors` (schoolId), `campaigns` (schoolId),
// `donations` (donorId, campaignId — no schoolId needed, always read
// scoped through an already-known campaignId), `scholarshipApplications`
// (studentId, campaignId, schoolId denormalized from the campaign at
// apply time — needed for the school-wide listing gap fix below).
@Injectable()
export class FundraisingService {
  constructor(private firestore: FirestoreService) {}

  async recordDonation(dto: RecordDonationDto) {
    const ref = this.firestore.db.collection('donations').doc();
    const data = { ...dto, givenAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getCampaignProgress(campaignId: string) {
    const campaignDoc = await this.firestore.db.collection('campaigns').doc(campaignId).get();
    if (!campaignDoc.exists) throw new NotFoundException(`Campaign ${campaignId} not found`);
    const campaign: any = campaignDoc.data();

    const donSnap = await this.firestore.db.collection('donations').where('campaignId', '==', campaignId).get();
    const raised = donSnap.docs.reduce((s, d) => s + Number(d.data().amount), 0);
    return { name: campaign.name, goal: Number(campaign.goal), raised, pct: Math.round((raised / Number(campaign.goal)) * 100) };
  }

  async applyForScholarship(dto: ApplyScholarshipDto) {
    const campaignDoc = await this.firestore.db.collection('campaigns').doc(dto.campaignId).get();
    const schoolId = campaignDoc.exists ? campaignDoc.data()!.schoolId : null;
    const ref = this.firestore.db.collection('scholarshipApplications').doc();
    const data = { ...dto, schoolId, status: 'pending' };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // Bug found in the original Prisma version, fixed then and preserved
  // here: this checked the requested amount against total raised funds
  // but never subtracted scholarships already awarded from the same
  // campaign — two separate awards could each individually pass the
  // check while together exceeding what was actually left, a real
  // double-spending gap. Wrapped in a Firestore transaction (the
  // original Prisma version wasn't) specifically because this is a
  // read-then-conditionally-write operation — without a transaction,
  // two award requests submitted at the same moment could both read the
  // same "funds available" figure before either write lands, letting
  // the exact bug this fix targets slip back in through a race
  // condition instead of a logic error.
  async awardScholarship(applicationId: string) {
    const appRef = this.firestore.db.collection('scholarshipApplications').doc(applicationId);

    return this.firestore.db.runTransaction(async (tx) => {
      const appDoc = await tx.get(appRef);
      if (!appDoc.exists) throw new NotFoundException(`Scholarship application ${applicationId} not found`);
      const application: any = appDoc.data();

      const [donSnap, awardedSnap] = await Promise.all([
        this.firestore.db.collection('donations').where('campaignId', '==', application.campaignId).get(),
        this.firestore.db.collection('scholarshipApplications')
          .where('campaignId', '==', application.campaignId)
          .where('status', '==', 'awarded')
          .get(),
      ]);
      const raised = donSnap.docs.reduce((s, d) => s + Number(d.data().amount), 0);
      const alreadyAwarded = awardedSnap.docs.reduce((s, d) => s + Number(d.data().requested), 0);
      const available = raised - alreadyAwarded;

      if (Number(application.requested) > available) {
        throw new BadRequestException(
          `Requested amount exceeds funds actually available (UGX ${available.toLocaleString()} left after prior awards)`,
        );
      }
      tx.update(appRef, { status: 'awarded' });
      return { id: applicationId, ...application, status: 'awarded' };
    });
  }

  // Gaps found while wiring the frontend originally: Donors, Campaigns,
  // and Scholarship Applications tabs each need a school-wide list, but
  // the backend only had single-record writes and a per-campaign
  // progress read. Same pattern as the roster/listing gaps closed on
  // Special Ed, Counseling, and College & Career.
  async getAllDonors(schoolId: string) {
    const donorSnap = await this.firestore.db.collection('donors').where('schoolId', '==', schoolId).get();
    const donors = donorSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      donors.map(async (donor) => {
        const donSnap = await this.firestore.db.collection('donations').where('donorId', '==', donor.id).orderBy('givenAt', 'desc').get();
        const donations = donSnap.docs.map((d) => d.data() as any);
        return {
          id: donor.id,
          fullName: donor.fullName,
          totalGiving: donations.reduce((s, don) => s + Number(don.amount), 0),
          lastGift: donations[0]?.givenAt ?? null,
        };
      }),
    );
  }

  async getAllCampaigns(schoolId: string) {
    const campaignSnap = await this.firestore.db.collection('campaigns').where('schoolId', '==', schoolId).get();
    const campaigns = campaignSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    return Promise.all(
      campaigns.map(async (c) => {
        const donSnap = await this.firestore.db.collection('donations').where('campaignId', '==', c.id).get();
        return {
          id: c.id,
          name: c.name,
          goal: Number(c.goal),
          raised: donSnap.docs.reduce((s, d) => s + Number(d.data().amount), 0),
        };
      }),
    );
  }

  async getAllScholarshipApplications(schoolId: string) {
    const snap = await this.firestore.db.collection('scholarshipApplications').where('schoolId', '==', schoolId).get();
    const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const studentIds = [...new Set(apps.map((a) => a.studentId).filter(Boolean))];
    const campaignIds = [...new Set(apps.map((a) => a.campaignId).filter(Boolean))];
    const [studentDocs, campaignDocs] = await Promise.all([
      studentIds.length ? this.firestore.db.getAll(...studentIds.map((id) => this.firestore.db.collection('students').doc(id))) : [],
      campaignIds.length ? this.firestore.db.getAll(...campaignIds.map((id) => this.firestore.db.collection('campaigns').doc(id))) : [],
    ]);
    const studentById = new Map(studentDocs.filter((d) => d.exists).map((d) => [d.id, d.data() as any]));
    const campaignById = new Map(campaignDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    const classIds = [...new Set([...studentById.values()].map((s) => s.classId).filter(Boolean))];
    const classDocs = classIds.length
      ? await this.firestore.db.getAll(...classIds.map((id) => this.firestore.db.collection('classes').doc(id)))
      : [];
    const classById = new Map(classDocs.filter((d) => d.exists).map((d) => [d.id, d.data()]));

    return apps.map((a) => {
      const student = studentById.get(a.studentId);
      return {
        ...a,
        student: student ? { ...student, class: classById.get(student.classId) ?? null } : null,
        campaign: campaignById.get(a.campaignId) ?? null,
      };
    });
  }
}

@Controller('fundraising')
export class FundraisingController {
  constructor(private readonly fundraising: FundraisingService) {}

  @Post('donations')
  recordDonation(@Body() dto: RecordDonationDto) {
    return this.fundraising.recordDonation(dto);
  }

  @Get('donors')
  getAllDonors(@CurrentUser() user: { schoolId: string }) {
    return this.fundraising.getAllDonors(user.schoolId);
  }

  @Get('campaigns')
  getAllCampaigns(@CurrentUser() user: { schoolId: string }) {
    return this.fundraising.getAllCampaigns(user.schoolId);
  }

  @Get('scholarships/applications')
  getAllScholarshipApplications(@CurrentUser() user: { schoolId: string }) {
    return this.fundraising.getAllScholarshipApplications(user.schoolId);
  }

  @Get('campaigns/:id/progress')
  getProgress(@Param('id') id: string) {
    return this.fundraising.getCampaignProgress(id);
  }

  @Post('scholarships/apply')
  apply(@Body() dto: ApplyScholarshipDto) {
    return this.fundraising.applyForScholarship(dto);
  }

  @Patch('scholarships/:id/award')
  award(@Param('id') id: string) {
    return this.fundraising.awardScholarship(id);
  }
}
