import { RiskScoringService } from './riskScoring.service';
import { db } from '../config/db.config';
import { riskChecks } from '../db/schema';
import { SMSService } from './sms.service';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface ClassificationResult {
  status: 'success' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
  reasons: string[];
}

export class GeminiClassificationService {
  private static templates = {
    verified: "This worker has passed safety verification. Clear to proceed.",
    flagged_video_call: "Risk factors detected: {reasons}. We recommend a video call before confirming this gig.",
    flagged_decline: "High risk detected: {reasons}. Consider declining or requesting additional verification.",
  };

  static async evaluateGigRisk(gigId: string, score: number, reasons: string[]): Promise<ClassificationResult> {
    const fallbackLevel = RiskScoringService.mapScoreToRiskLevel(score);
    let finalRiskLevel = fallbackLevel;
    let finalMessage = "AI classification unavailable. Rule-based risk level applied.";
    let status: 'success' | 'pending' = 'pending';

    if (GEMINI_API_KEY) {
      try {
        const prompt = `
You are a safety classification AI for a gig worker app.
Given a worker's risk score and reasons, classify the risk and choose a response template.
Score: ${score}/100
Reasons: ${reasons.join(', ') || 'None'}

Return ONLY a valid JSON object in this exact format, with no markdown formatting or extra text:
{"riskLevel": "low"|"medium"|"high", "template": "verified"|"flagged_video_call"|"flagged_decline"}
`;
        
        // Using native fetch against the Gemini REST API to avoid new dependencies
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.riskLevel && parsed.template) {
            finalRiskLevel = parsed.riskLevel;
            const templateKey = parsed.template as keyof typeof this.templates;
            const templateText = this.templates[templateKey] || this.templates.flagged_video_call;
            
            // Replace placeholder with actual reasons, fallback to generic if empty
            finalMessage = templateText.replace('{reasons}', reasons.length > 0 ? reasons.join(', ') : 'unknown factors');
            status = 'success';
          }
        }
      } catch (error) {
        console.error('[GeminiClassificationService] AI evaluation failed, falling back to rule-based:', error);
      }
    } else {
       console.warn('[GeminiClassificationService] GEMINI_API_KEY missing, using fallback rule-based classification.');
    }

    // Store the result in the database
    try {
      await db.insert(riskChecks).values({
        gigId,
        compositeScore: score.toString(),
        riskLevel: finalRiskLevel,
        reasons,
        aiMessage: finalMessage
      });
    } catch (dbError) {
      console.error('[GeminiClassificationService] Failed to save risk check to DB:', dbError);
    }

    if (finalRiskLevel === 'high') {
      const emergencyContact = process.env.EMERGENCY_CONTACT_NUMBER;
      if (emergencyContact) {
        SMSService.sendSMS(emergencyContact, `HIGH RISK ALERT: Gig ${gigId} has been flagged as high risk. Please review immediately.`);
      } else {
        console.warn('[GeminiClassificationService] EMERGENCY_CONTACT_NUMBER not set. High risk SMS not sent.');
      }
    }

    return {
      status,
      riskLevel: finalRiskLevel,
      message: finalMessage,
      reasons
    };
  }
}
