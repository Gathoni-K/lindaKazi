/**
 * seed.ts — Demo persona seeder for LindaKazi
 *
 * Creates two contrasting worker profiles AND a client account that are
 * fully login-able via the Supabase Auth system (not just DB rows).
 *
 * Strategy:
 *  1. Use supabase.auth.admin.createUser() to create the Supabase Auth identity.
 *     The on_auth_user_created Postgres trigger then inserts the public.users row.
 *  2. Drizzle-update the public.users row to stamp the demo risk signals
 *     (kycStatus, simSwapFlag, communityRating, createdAt).
 *
 * Run: npm run seed
 * ─────────────────────────────────────────────────────────────────────────────
 * Personas
 *  Alice Clean   — alice.clean@lindakazi.dev / Demo1234!
 *                  kycStatus:verified, simSwap:false, rating:4.90, age:>180 days
 *
 *  Dave Danger   — dave.danger@lindakazi.dev / Demo1234!
 *                  kycStatus:unverified, simSwap:true,  rating:2.10, age:<2 days
 *                  phone: +254700000000 (triggers SimSwapService mock flag)
 *
 *  Demo Client   — demo.client@lindakazi.dev / Demo1234!
 *                  kycStatus:verified, role:client — used to book gigs in demo
 */

import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// ── Load env ─────────────────────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DATABASE_URL    = process.env.DATABASE_URL;
const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DATABASE_URL)              throw new Error('DATABASE_URL is not set.');
if (!SUPABASE_URL)              throw new Error('SUPABASE_URL is not set.');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. This key is required for admin user creation.');

// ── Clients ───────────────────────────────────────────────────────────────────
// NOTE: prepare:false is required for Supabase's pgBouncer transaction-mode pooler.
const pgClient = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(pgClient, { schema });

// Service-role client bypasses RLS and can call auth.admin API
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Persona definitions ───────────────────────────────────────────────────────
interface PersonaDef {
  email:       string;
  password:    string;
  name:        string;
  phoneNumber: string;
  role:        'worker' | 'client';
  // Risk signals to stamp onto the public.users row after trigger creates it
  kycStatus:          'unverified' | 'pending' | 'verified';
  simSwapFlag:        boolean;
  communityRating:    string;  // decimal string e.g. "4.90"
  verifiedProBadge:   boolean;
  // Override createdAt to simulate account age
  accountCreatedDaysAgo: number;
}

const PERSONAS: PersonaDef[] = [
  // ── 1. Alice Clean — Low Risk ───────────────────────────────────────────────
  {
    email:               'alice.clean@lindakazi.dev',
    password:            'Demo1234!',
    name:                'Alice Clean',
    phoneNumber:         '+254711000001',
    role:                'worker',
    kycStatus:           'verified',
    simSwapFlag:         false,
    communityRating:     '4.90',
    verifiedProBadge:    true,
    accountCreatedDaysAgo: 200,   // > 180 days — established account
  },

  // ── 2. Dave Danger — High Risk ──────────────────────────────────────────────
  // Phone +254700000000 is in SimSwapService.FLAGGED_NUMBERS, ensuring the
  // live telemetry check during risk-check ALSO flags this account regardless
  // of the stored simSwapFlag boolean.
  {
    email:               'dave.danger@lindakazi.dev',
    password:            'Demo1234!',
    name:                'Dave Danger',
    phoneNumber:         '+254700000000',
    role:                'worker',
    kycStatus:           'unverified',
    simSwapFlag:         true,
    communityRating:     '2.10',
    verifiedProBadge:    false,
    accountCreatedDaysAgo: 1,     // < 2 days — brand new account
  },

  // ── 3. Demo Client — books gigs in the demo ─────────────────────────────────
  {
    email:               'demo.client@lindakazi.dev',
    password:            'Demo1234!',
    name:                'Demo Client',
    phoneNumber:         '+254722000001',
    role:                'client',
    kycStatus:           'verified',
    simSwapFlag:         false,
    communityRating:     '5.00',
    verifiedProBadge:    false,
    accountCreatedDaysAgo: 90,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns a Date that is `daysAgo` days in the past. */
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Upserts a Supabase Auth user.
 * If the email already exists, retrieves the existing user ID.
 * Returns the Supabase Auth user UUID.
 */
async function upsertAuthUser(persona: PersonaDef): Promise<string> {
  // Attempt to create
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email:             persona.email,
    password:          persona.password,
    email_confirm:     true, // skip email confirmation so login works immediately
    user_metadata: {
      name:  persona.name,
      phone: persona.phoneNumber,
      role:  persona.role,
    },
  });

  if (created?.user) {
    console.log(`  [AUTH] Created new auth user: ${persona.email} (${created.user.id})`);
    return created.user.id;
  }

  // If already exists, list and find by email
  if (createErr?.message?.toLowerCase().includes('already registered') ||
      createErr?.message?.toLowerCase().includes('already been registered')) {
    console.log(`  [AUTH] User already exists, fetching ID for: ${persona.email}`);
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find((u) => u.email === persona.email);
    if (!existing) throw new Error(`Could not find existing auth user for ${persona.email}`);
    console.log(`  [AUTH] Found existing user: ${existing.id}`);
    return existing.id;
  }

  throw new Error(`Failed to create auth user for ${persona.email}: ${createErr?.message}`);
}

/**
 * Waits for the Postgres trigger (on_auth_user_created) to insert the
 * public.users row, then patches it with demo risk signals.
 *
 * The trigger runs asynchronously after the auth insert, so we poll briefly.
 */
async function patchUserRow(userId: string, persona: PersonaDef): Promise<void> {
  // Poll for the trigger-created row (up to 3 seconds)
  let userRow = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const rows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (rows.length > 0) {
      userRow = rows[0];
      break;
    }
    // Wait 500ms before retrying
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!userRow) {
    // Trigger may not exist or there is an RLS issue — insert the row manually
    console.warn(`  [DB] Trigger row not found for ${userId}; inserting manually.`);
    await db.insert(schema.users).values({
      id:              userId,
      name:            persona.name,
      email:           persona.email,
      phoneNumber:     persona.phoneNumber,
      role:            persona.role,
      kycStatus:       persona.kycStatus,
      simSwapFlag:     persona.simSwapFlag,
      communityRating: persona.communityRating,
      verifiedProBadge: persona.verifiedProBadge,
      createdAt:       daysAgo(persona.accountCreatedDaysAgo),
      updatedAt:       new Date(),
    }).onConflictDoUpdate({
      target: schema.users.id,
      set: {
        name:            persona.name,
        phoneNumber:     persona.phoneNumber,
        role:            persona.role,
        kycStatus:       persona.kycStatus,
        simSwapFlag:     persona.simSwapFlag,
        communityRating: persona.communityRating,
        verifiedProBadge: persona.verifiedProBadge,
        createdAt:       daysAgo(persona.accountCreatedDaysAgo),
        updatedAt:       new Date(),
      },
    });
    return;
  }

  // Patch the trigger-created row with demo signals
  await db
    .update(schema.users)
    .set({
      name:            persona.name,
      phoneNumber:     persona.phoneNumber,
      role:            persona.role,
      kycStatus:       persona.kycStatus,
      simSwapFlag:     persona.simSwapFlag,
      communityRating: persona.communityRating,
      verifiedProBadge: persona.verifiedProBadge,
      createdAt:       daysAgo(persona.accountCreatedDaysAgo),
      updatedAt:       new Date(),
    })
    .where(eq(schema.users.id, userId));

  console.log(`  [DB] Patched public.users row for ${persona.name}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n LindaKazi — Demo Persona Seeder\n' + '-'.repeat(42));

  try {
    for (const persona of PERSONAS) {
      console.log(`\n> Seeding: ${persona.name} (${persona.role})`);

      const userId = await upsertAuthUser(persona);
      await patchUserRow(userId, persona);

      console.log(`  OK ${persona.name} ready — login: ${persona.email} / ${persona.password}`);
    }

    console.log('\nSeeding complete!\n');
    console.log('Demo credentials:');
    console.log('-'.repeat(60));
    for (const p of PERSONAS) {
      const tag = p.role === 'client' ? 'Client    ' : p.simSwapFlag ? 'High Risk ' : 'Low Risk  ';
      console.log(`  ${tag} | ${p.email.padEnd(38)} | ${p.password}`);
    }
    console.log('-'.repeat(60));

  } catch (error) {
    console.error('\nSeeding failed:', error);
    process.exitCode = 1;
  } finally {
    await pgClient.end();
  }
}

seed();
