import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Extend Express's Request type so downstream handlers can read req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;         // Supabase user UUID
        email?: string;
        role?: string;
        iat?: number;        // issued-at
        exp?: number;        // expiry
        [key: string]: any;  // allow any other JWT claims
      };
    }
  }
}

/**
 * requireAuth middleware
 *
 * Intercepts every request it is applied to and:
 *  1. Checks for a valid "Bearer <token>" Authorization header.
 *  2. Cryptographically verifies the JWT using the Supabase JWT secret.
 *  3. Attaches the decoded token payload to req.user.
 *  4. Calls next() to hand off to the actual route handler.
 *
 * Usage:
 *   app.get('/api/protected', requireAuth, (req, res) => { ... })
 *   router.use(requireAuth)  // protect an entire router
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Token is empty.',
      });
      return;
    }

    // Verify and decode. verifyJwtToken throws on any failure.
    const decodedPayload = AuthService.verifyJwtToken(token);
    req.user = decodedPayload as Request['user'];

    next();
  } catch (error: any) {
    // Token was present but failed verification (expired, tampered, wrong secret, etc.)
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message ?? 'Invalid or expired token',
    });
  }
};
