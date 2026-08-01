import { db } from '../config/db.config';
import { sosEvents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { SMSService } from './sms.service';
import dotenv from 'dotenv';

dotenv.config();

export class SOSService {
  static async triggerSOS(gigId: string, lastKnownLocation?: string) {
    const event = await db.insert(sosEvents).values({
      gigId,
      lastKnownLocation: lastKnownLocation || null,
      resolved: false,
    }).returning();

    const emergencyContact = process.env.EMERGENCY_CONTACT_NUMBER;
    if (emergencyContact) {
      const message = `SOS ALERT: Gig ${gigId} has missed a passive check-in or manually triggered an SOS. Please respond immediately.`;
      // Dispatch non-blocking SMS
      SMSService.sendSMS(emergencyContact, message);
    } else {
      console.warn('[SOS Service] EMERGENCY_CONTACT_NUMBER not set in environment. SMS not sent.');
    }

    return event[0];
  }

  static async resolveSOS(gigId: string) {
    const event = await db.update(sosEvents)
      .set({
        resolved: true,
        resolvedAt: new Date(),
      })
      .where(eq(sosEvents.gigId, gigId))
      .returning();

    return event[0];
  }
}
