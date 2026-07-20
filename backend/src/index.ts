import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthService } from './services/auth.service';
import { ZodError } from 'zod';
import { requireAuth } from './middleware/requireAuth';

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
// requireAuth middleware handles all token extraction and verification.
// If the token is invalid or missing, middleware returns 401 before this handler runs.
app.get('/api/auth/verify', requireAuth, (req: Request, res: Response) => {
  // If we reach here, requireAuth already verified the token and attached req.user
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
