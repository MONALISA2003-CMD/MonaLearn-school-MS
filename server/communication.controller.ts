import { Controller, Get, Post, Body, Injectable, BadRequestException } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CurrentUser } from './auth/auth.guards';

class SendMessageDto {
  channel: 'sms' | 'email' | 'whatsapp' | 'push';
  body: string;
  studentIds: string[]; // pre-resolved audience — e.g. from StudentsService.findOverdue()
}

// Firestore: `messages` (schoolId, channel, body, sentAt) with a
// `recipients` subcollection per message (studentId, status) — a
// natural fit here since recipients are only ever read together with
// their parent message, never queried independently across messages
// (unlike the earlier conversions' collections, which needed to be
// queried directly, so those stayed top-level).
@Injectable()
export class CommunicationService {
  constructor(private firestore: FirestoreService) {}

  // The audience list is computed by the CALLER (often
  // StudentsService.findOverdue() for a fee reminder) and just passed
  // in here — Communication doesn't own audience logic, it only owns
  // sending and delivery tracking.
  async sendMessage(schoolId: string, dto: SendMessageDto) {
    // Bug found in the original Prisma version, fixed then and
    // preserved here: an empty studentIds array used to silently create
    // a Message with zero recipients and report success — a caller with
    // a bug in their audience-building logic would never know nothing
    // actually got sent.
    if (!dto.studentIds?.length) {
      throw new BadRequestException('Cannot send a message with zero recipients');
    }

    const messageRef = this.firestore.db.collection('messages').doc();
    const messageData = { schoolId, channel: dto.channel, body: dto.body, sentAt: new Date() };
    await messageRef.set(messageData);

    // In production this queues actual sends (SMS gateway, WhatsApp
    // API...); here we simulate immediate delivery for the demo data
    // path, same as the Prisma version did.
    const batch = this.firestore.db.batch();
    const recipientsRef = messageRef.collection('recipients');
    dto.studentIds.forEach((studentId) => {
      batch.set(recipientsRef.doc(), { studentId, status: 'delivered' });
    });
    await batch.commit();

    const recipientsSnap = await recipientsRef.get();
    return {
      id: messageRef.id,
      ...messageData,
      recipients: recipientsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  }

  async getDeliveryStats(schoolId: string, sinceDays = 7) {
    const since = new Date();
    since.setDate(since.getDate() - sinceDays);

    const messageSnap = await this.firestore.db
      .collection('messages')
      .where('schoolId', '==', schoolId)
      .where('sentAt', '>=', since)
      .get();

    const recipientCounts = await Promise.all(
      messageSnap.docs.map((doc) => doc.ref.collection('recipients').get()),
    );
    const allRecipients = recipientCounts.flatMap((snap) => snap.docs.map((d) => d.data()));

    const delivered = allRecipients.filter((r: any) => r.status === 'delivered').length;
    return {
      totalSent: allRecipients.length,
      deliveryRate: allRecipients.length ? Math.round((delivered / allRecipients.length) * 100) : 0,
    };
  }
}

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communication: CommunicationService) {}

  @Post('send')
  send(@CurrentUser() user: { schoolId: string }, @Body() dto: SendMessageDto) {
    return this.communication.sendMessage(user.schoolId, dto);
  }

  @Get('stats')
  getStats(@CurrentUser() user: { schoolId: string }) {
    return this.communication.getDeliveryStats(user.schoolId);
  }
}
