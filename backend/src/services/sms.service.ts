import africastalking from 'africastalking';
import dotenv from 'dotenv';

dotenv.config();

const credentials = {
  apiKey: process.env.AT_API_KEY || 'sandbox',
  username: process.env.AT_USERNAME || 'sandbox'
};

const at = africastalking(credentials);
const sms = at.SMS;

export class SMSService {
  static async sendSMS(to: string, message: string): Promise<void> {
    try {
      console.log(`[SMS Service] Attempting to send SMS to ${to}...`);
      const response = await sms.send({
        to: [to],
        message: message,
      });
      console.log(`[SMS Service] SMS dispatched successfully:`, response);
    } catch (error) {
      // Non-blocking: log the error and continue
      console.error(`[SMS Service] Failed to send SMS to ${to}:`, error);
    }
  }
}
