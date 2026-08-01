import { pgTable, text, timestamp, uuid, boolean, decimal, integer, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';

export const kycStatusEnum = pgEnum('kyc_status', ['unverified', 'pending', 'verified']);
export const gigStatusEnum = pgEnum('gig_status', ['pending', 'active', 'completed', 'cancelled']);
export const checkinStatusEnum = pgEnum('checkin_status', ['not_started', 'awaiting', 'checked_in', 'missed']);
export const riskLevelEnum = pgEnum('risk_level', ['low', 'medium', 'high']);
export const userRoleEnum = pgEnum('user_role', ['worker', 'client', 'both']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phoneNumber: text('phone_number').unique().notNull(),
  role: userRoleEnum('role').default('client').notNull(),
  kycStatus: kycStatusEnum('kyc_status').default('unverified').notNull(),
  simSwapFlag: boolean('sim_swap_flag').default(false).notNull(),
  communityRating: decimal('community_rating', { precision: 3, scale: 2 }).default('5.00').notNull(),
  verifiedProBadge: boolean('verified_pro_badge').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const gigs = pgTable('gigs', {
  id: uuid('id').defaultRandom().primaryKey(),
  workerId: uuid('worker_id').references(() => users.id).notNull(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  status: gigStatusEnum('status').default('pending').notNull(),
  expectedDurationMinutes: integer('expected_duration_minutes'),
  startedAt: timestamp('started_at'),
  expectedEndAt: timestamp('expected_end_at'),
  actualEndAt: timestamp('actual_end_at'),
  checkinStatus: checkinStatusEnum('checkin_status').default('not_started').notNull(),
  location: text('location'),
}, (table) => {
  return {
    workerIdIdx: index('gigs_worker_id_idx').on(table.workerId),
    clientIdIdx: index('gigs_client_id_idx').on(table.clientId),
    statusIdx: index('gigs_status_idx').on(table.status),
    checkinStatusIdx: index('gigs_checkin_status_idx').on(table.checkinStatus),
  };
});

export const riskChecks = pgTable('risk_checks', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id).notNull(),
  compositeScore: decimal('composite_score', { precision: 5, scale: 2 }),
  riskLevel: riskLevelEnum('risk_level').notNull(),
  reasons: jsonb('reasons'),
  aiMessage: text('ai_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    gigIdIdx: index('risk_checks_gig_id_idx').on(table.gigId),
  };
});

export const sosEvents = pgTable('sos_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  gigId: uuid('gig_id').references(() => gigs.id).notNull(),
  triggeredAt: timestamp('triggered_at').defaultNow().notNull(),
  lastKnownLocation: text('last_known_location'),
  resolved: boolean('resolved').default(false).notNull(),
  resolvedAt: timestamp('resolved_at'),
}, (table) => {
  return {
    gigIdIdx: index('sos_events_gig_id_idx').on(table.gigId),
  };
});
