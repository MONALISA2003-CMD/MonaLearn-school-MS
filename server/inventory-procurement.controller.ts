import { Controller, Get, Post, Patch, Body, Param, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class LogMaintenanceDto {
  assetId: string;
  workType: string;
  cost: number;
}

// Firestore collections: `assets` (schoolId), `maintenanceRecords`
// (assetId — no schoolId denormalized here since it's only ever read
// scoped to one already-known asset, not listed school-wide).
@Injectable()
export class InventoryService {
  constructor(private firestore: FirestoreService) {}

  async getAssets(schoolId: string) {
    const snap = await this.firestore.db.collection('assets').where('schoolId', '==', schoolId).get();
    const assets = snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    return Promise.all(
      assets.map(async (a) => {
        const maintSnap = await this.firestore.db.collection('maintenanceRecords').where('assetId', '==', a.id).get();
        return { ...a, maintenance: maintSnap.docs.map((d) => ({ id: d.id, ...d.data() })) };
      }),
    );
  }

  async logMaintenance(dto: LogMaintenanceDto) {
    const ref = this.firestore.db.collection('maintenanceRecords').doc();
    const data = { ...dto, loggedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  // Powers the "Depreciation" tab conceptually — total maintenance spend
  // against original value is a real signal for "repair vs. replace".
  async getMaintenanceCostToValue(assetId: string) {
    const assetDoc = await this.firestore.db.collection('assets').doc(assetId).get();
    if (!assetDoc.exists) throw new NotFoundException(`Asset ${assetId} not found`);
    const asset: any = assetDoc.data();

    const maintSnap = await this.firestore.db.collection('maintenanceRecords').where('assetId', '==', assetId).get();
    const totalMaintenanceCost = maintSnap.docs.reduce((s, d) => s + Number(d.data().cost), 0);
    return { asset: asset.name, value: Number(asset.value), totalMaintenanceCost };
  }
}

class CreatePurchaseRequestDto {
  item: string;
  amount: number;
  requestedBy: string;
}

// Firestore collections: `purchaseRequests` (schoolId), `purchaseOrders`
// (requestId — a purchaseOrder's existence for a given request IS the
// uniqueness check, queried directly rather than needing Prisma's
// @unique constraint replicated).
@Injectable()
export class ProcurementService {
  constructor(private firestore: FirestoreService) {}

  async createRequest(schoolId: string, dto: CreatePurchaseRequestDto) {
    const ref = this.firestore.db.collection('purchaseRequests').doc();
    const data = { schoolId, ...dto, status: 'pending', createdAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  approve(id: string) {
    return this.firestore.db.collection('purchaseRequests').doc(id).update({ status: 'approved' });
  }

  // Converting an approved request into a PO is the same "promote"
  // pattern Admissions used for Applicant -> Student — one entity
  // becomes another once it clears a gate, instead of overloading a
  // single status field.
  async issuePurchaseOrder(requestId: string, vendor: string) {
    const requestDoc = await this.firestore.db.collection('purchaseRequests').doc(requestId).get();
    if (!requestDoc.exists) throw new NotFoundException(`Purchase request ${requestId} not found`);
    const request: any = requestDoc.data();

    if (request.status !== 'approved') {
      throw new BadRequestException('Only approved requests can become purchase orders');
    }

    const existingSnap = await this.firestore.db.collection('purchaseOrders').where('requestId', '==', requestId).limit(1).get();
    if (!existingSnap.empty) {
      throw new BadRequestException(`A purchase order already exists for this request (${existingSnap.docs[0].id})`);
    }

    const ref = this.firestore.db.collection('purchaseOrders').doc();
    const data = { requestId, vendor, issuedAt: new Date() };
    await ref.set(data);
    return { id: ref.id, ...data };
  }

  async getPendingRequests(schoolId: string) {
    const snap = await this.firestore.db
      .collection('purchaseRequests')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'pending')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('assets')
  getAssets(@CurrentUser() user: { schoolId: string }) {
    return this.inventory.getAssets(user.schoolId);
  }

  @Post('maintenance')
  logMaintenance(@Body() dto: LogMaintenanceDto) {
    return this.inventory.logMaintenance(dto);
  }

  @Get('assets/:id/cost-analysis')
  getCostAnalysis(@Param('id') id: string) {
    return this.inventory.getMaintenanceCostToValue(id);
  }
}

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService) {}

  @Post('requests')
  createRequest(@CurrentUser() user: { schoolId: string }, @Body() dto: CreatePurchaseRequestDto) {
    return this.procurement.createRequest(user.schoolId, dto);
  }

  @Patch('requests/:id/approve')
  approve(@Param('id') id: string) {
    return this.procurement.approve(id);
  }

  @Post('requests/:id/issue-po')
  issuePO(@Param('id') id: string, @Body('vendor') vendor: string) {
    return this.procurement.issuePurchaseOrder(id, vendor);
  }

  @Get('requests/pending')
  getPending(@CurrentUser() user: { schoolId: string }) {
    return this.procurement.getPendingRequests(user.schoolId);
  }
}
