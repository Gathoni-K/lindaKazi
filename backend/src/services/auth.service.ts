import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.config';
import { users } from '../db/schema';
import { SignUpInput, signUpSchema, LoginInput, loginSchema } from '../schemas/auth.schema';
import { eq, or } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_JWT_SECRET) {
  throw new Error('Supabase environment variables are missing.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class AuthService {
  static async signUpUser(input: SignUpInput) {
    // 1. Validate input
    const validatedInput = signUpSchema.parse(input);

    // 2. Check if email or phone is already registered in Drizzle
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, validatedInput.email),
          eq(users.phoneNumber, validatedInput.phoneNumber)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email or phone number already exists.');
    }

    // 3. Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedInput.email,
      password: validatedInput.password,
      options: {
        data: {
          name: validatedInput.name,
          phone: validatedInput.phoneNumber,
          role: validatedInput.role,   // passed in metadata so trigger can consume it
        },
      },
    });

    if (authError || !authData.user) {
      throw new Error(`Supabase signup failed: ${authError?.message}`);
    }

    // 4. The public.users row is created automatically by the Postgres trigger
    //    `on_auth_user_created`. Because the trigger does not know the app-level
    //    role, we patch it immediately after signup via a Drizzle update.
    //    This is intentionally non-blocking — if it fails the user can still log
    //    in and the role defaults to 'client' until corrected.
    try {
      await db
        .update(users)
        .set({ role: validatedInput.role })
        .where(eq(users.id, authData.user.id));
    } catch (roleErr) {
      console.error('[AuthService] Failed to persist role after signup:', roleErr);
    }

    return {
      id: authData.user.id,
      email: authData.user.email,
      role: validatedInput.role,
      message: 'User created. Check your email to confirm your account before logging in.',
    };
  }

  static async loginUser(input: LoginInput) {
    // 1. Validate input
    const validatedInput = loginSchema.parse(input);

    // 2. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedInput.email,
      password: validatedInput.password,
    });

    if (authError || !authData.session) {
      throw new Error(`Invalid login credentials: ${authError?.message}`);
    }

    // 3. Fetch user public profile from Drizzle
    const userProfile = await db
      .select()
      .from(users)
      .where(eq(users.id, authData.user.id))
      .limit(1);

    if (userProfile.length === 0) {
      throw new Error('User profile not found in database.');
    }

    // 4. Return token and public data
    return {
      token: authData.session.access_token,
      user: userProfile[0],
    };
  }

  static verifyJwtToken(token: string) {
    try {
      // 1. Trim whitespace to guard against copy-paste or deployment encoding issues.
      const secret = SUPABASE_JWT_SECRET.trim();

      // 2. Explicitly enforce HS256 — the algorithm Supabase uses.
      //    Passing `algorithms` prevents algorithm-confusion attacks where a
      //    malicious actor might send a token signed with 'none' or an RSA key.
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      });

      return decoded;
    } catch (error: any) {
      // Surface the underlying reason in server logs without leaking it to clients.
      console.error('[AuthService] JWT verification failed:', error.message);
      throw new Error('Unauthorized: Invalid or expired token');
    }
  }
}
