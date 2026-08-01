import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthService } from './services/auth.service';
import { ZodError } from 'zod';
import { requireAuth } from './middleware/requireAuth';
import { db } from './config/db.config';
import { gigs, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { canAccessGig } from './utils/authHelpers';
import { RiskScoringService } from './services/riskScoring.service';
import { GeminiClassificationService } from './services/geminiClassification.service';
import { SOSService } from './services/sos.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Sign Up Route
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const user = await AuthService.signUpUser(req.body);
    res.status(201).json({ message: 'User signed up successfully', user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.issues });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// 2. Login Route
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const data = await AuthService.loginUser(req.body);
    res.status(200).json({ message: 'Login successful', data });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.issues });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// 3. Verify JWT Route
app.get('/api/auth/verify', requireAuth, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

// 4. Gig Risk Check Route
app.post('/api/gigs/:id/risk-check', requireAuth, async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;
    const gigId = Array.isArray(paramId) ? paramId[0] : paramId;
    const userId = req.user!.sub;

    // A. Fetch gig and check authorization
    const gig = await db.query.gigs.findFirst({ where: eq(gigs.id, gigId) });
    if (!gig) {
      res.status(404).json({ error: 'Gig not found' });
      return;
    }

    if (!canAccessGig(userId, gig)) {
      res.status(403).json({ error: 'Forbidden: You do not have access to this gig.' });
      return;
    }

    // B. Fetch the worker profile
    const worker = await db.query.users.findFirst({ where: eq(users.id, gig.workerId) });
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }

    // C. Run pure scoring function
    const { score, reasons } = RiskScoringService.calculateRiskScore({
      kycStatus: worker.kycStatus,
      simSwapFlag: worker.simSwapFlag,
      communityRating: worker.communityRating,
      createdAt: worker.createdAt,
    });

    // D. Send to Gemini and store result
    const result = await GeminiClassificationService.evaluateGigRisk(gigId, score, reasons);

    // E. Return structured result
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Risk check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Gig Start Route
app.post('/api/gigs/:id/start', requireAuth, async (req: Request, res: Response) => {
  try {
    const gigId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.sub;

    const gig = await db.query.gigs.findFirst({ where: eq(gigs.id, gigId) });
    if (!gig) {
      res.status(404).json({ error: 'Gig not found' });
      return;
    }

    if (!canAccessGig(userId, gig)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (gig.status !== 'pending') {
      res.status(400).json({ error: 'Gig must be pending to start' });
      return;
    }

    const expectedDuration = gig.expectedDurationMinutes || 60; // default 1h
    const now = new Date();
    const expectedEndAt = new Date(now.getTime() + expectedDuration * 60000);

    const updated = await db.update(gigs)
      .set({
        status: 'active',
        startedAt: now,
        expectedEndAt,
        checkinStatus: 'awaiting'
      })
      .where(eq(gigs.id, gigId))
      .returning();

    res.status(200).json({ message: 'Gig started', gig: updated[0] });
  } catch (error: any) {
    console.error('Gig start error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Gig Check-in Route
app.post('/api/gigs/:id/checkin', requireAuth, async (req: Request, res: Response) => {
  try {
    const gigId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.sub;

    const gig = await db.query.gigs.findFirst({ where: eq(gigs.id, gigId) });
    if (!gig) {
      res.status(404).json({ error: 'Gig not found' });
      return;
    }

    if (!canAccessGig(userId, gig)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (gig.status !== 'active') {
      res.status(400).json({ error: 'Gig must be active to check in' });
      return;
    }

    const updated = await db.update(gigs)
      .set({
        checkinStatus: 'checked_in',
        actualEndAt: new Date(),
        status: 'completed'
      })
      .where(eq(gigs.id, gigId))
      .returning();

    res.status(200).json({ message: 'Checked in successfully', gig: updated[0] });
  } catch (error: any) {
    console.error('Gig check-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. Simulate Timeout (DEMO ONLY)
app.post('/api/gigs/:id/simulate-timeout', requireAuth, async (req: Request, res: Response) => {
  try {
    const gigId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.sub;

    const gig = await db.query.gigs.findFirst({ where: eq(gigs.id, gigId) });
    if (!gig) {
      res.status(404).json({ error: 'Gig not found' });
      return;
    }

    if (!canAccessGig(userId, gig)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    if (gig.status !== 'active' || gig.checkinStatus !== 'awaiting') {
      res.status(400).json({ error: 'Gig must be active and awaiting check-in to timeout' });
      return;
    }

    const updated = await db.update(gigs)
      .set({ checkinStatus: 'missed' })
      .where(eq(gigs.id, gigId))
      .returning();

    const sosEvent = await SOSService.triggerSOS(gigId, gig.location || undefined);

    res.status(200).json({ message: 'Timeout simulated, SOS triggered', gig: updated[0], sosEvent });
  } catch (error: any) {
    console.error('Simulate timeout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 8. Resolve SOS Route
app.post('/api/gigs/:id/resolve-sos', requireAuth, async (req: Request, res: Response) => {
  try {
    const gigId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.sub;

    const gig = await db.query.gigs.findFirst({ where: eq(gigs.id, gigId) });
    if (!gig) {
      res.status(404).json({ error: 'Gig not found' });
      return;
    }

    if (!canAccessGig(userId, gig)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const sosEvent = await SOSService.resolveSOS(gigId);
    if (!sosEvent) {
      res.status(404).json({ error: 'SOS event not found for this gig' });
      return;
    }

    res.status(200).json({ message: 'SOS resolved', sosEvent });
  } catch (error: any) {
    console.error('Resolve SOS error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
