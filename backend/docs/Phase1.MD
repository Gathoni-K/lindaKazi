# LindaKazi — Hackathon Build Progress Report

**Project:** LindaKazi — Trust, Reputation, and Safety Infrastructure for African Gig Work
**Track:** Backend / AI / Fullstack Integration
**Status as of report date:** Day 1 in progress, on schedule

---

## 1. Project Recap

LindaKazi is a proactive safety verification layer for gig work: it scores risk *before* a gig begins, delivers a governed AI-classified warning in under 5 seconds, and monitors active gigs via a passive check-in system that triggers automated SOS if a worker fails to check in.

For the hackathon submission, scope was deliberately narrowed to one convincing end-to-end loop rather than the full production architecture, with clear separation between what's built live and what's pitched as roadmap (live SIM-swap detection, real KYC document verification, live USSD gateway, enterprise billing, data licensing pipeline — all flagged explicitly as Phase 2).

---

## 2. Architecture Decisions Made

| Decision | Rationale |
|---|---|
| Single `users` table with a `role` enum (`worker` / `client` / `both`), instead of separate `workers`/`clients` tables | An existing `AuthService` already syncs `public.users` to `auth.users` via a Postgres trigger on signup, guaranteeing `users.id === auth.uid()`. Unifying under this table avoided rebuilding a working, race-condition-free signup flow. |
| Authorization handled at the application layer, not via Postgres RLS | Backend connects to the database as the `postgres` superuser, which bypasses RLS entirely. Real RLS enforcement would require per-request role impersonation (setting JWT claims per transaction) — high effort, zero visible demo value, and a strong late-stage regression risk. Explicit ownership checks in route handlers are simpler, faster to build, and easy to defend verbally to judges. |
| Gemini AI constrained to **classification only**, never open-ended generation | Reduces hallucination/latency risk in a safety-critical flow. Gemini receives only a computed score + reasons, and must return structured JSON mapping to one of three pre-written, legally-reviewable message templates stored in code — not model-generated prose. |
| Deterministic, transparent composite risk scoring (weighted point system, not ML) | Fully explainable to judges line-by-line; avoids black-box scoring in a safety context. |
| USSD dead-man's-switch simulated via API endpoints rather than a live telco USSD gateway integration | Registering a USSD shortcode and integrating a live gateway is not feasible in a 3-day window. The *logic* (timer, grace period, SOS trigger) is built for real; only the phone-dial interface is simulated, with this explicitly called out during the demo. |
| Emergency-responder role deliberately not built | No such role concept exists yet in the auth system. Flagged as a roadmap item rather than improvised, to avoid inventing unvalidated logic under time pressure. |

---

## 3. Completed So Far

### 3.1 Database Schema
- Migrated from an initial multi-table plan (`workers`, `clients`) to a **unified `users` table** carrying role-specific fields directly: `role`, `kycStatus`, `simSwapFlag`, `communityRating`, `verifiedProBadge`.
- Core tables finalized: `users`, `gigs`, `risk_checks`, `sos_events`.
- `gigs.workerId` and `gigs.clientId` both reference `users.id`.
- `risk_checks` and `sos_events` both key off `gigs.id` — confirmed unaffected by the users-table refactor.
- Enums used throughout instead of free-text status fields (`kyc_status`, `gig_status`, `checkin_status`, `risk_level`, `user_role`) for data integrity.
- Indexes applied on foreign key columns (`gigs.workerId`, `gigs.clientId`) for query performance.
- Schema was split into per-table files with `schema.ts` retained purely as an export aggregator, following an explicit audit-first refactor to avoid breaking existing imports.

### 3.2 Seed Data
`seed.ts` populated with a deliberately varied test set to produce a convincing Low/Medium/High demo spread:

- **Low-risk workers:** Alice (verified, no SIM swap, 4.80 rating), Bob (verified, no SIM swap, 4.50 rating), Charlie (verified, no SIM swap, 4.90 rating)
- **High-risk workers:** Dave Danger (unverified, SIM swap flagged, 1.50 rating), Eve Suspicious (unverified, SIM swap flagged, 1.20 rating)
- **Clients:** Safe Client One (verified), New Client Two (unverified)
- Flagged for correction: ensure low-risk workers' `createdAt` timestamps are set safely in the past, so the "new account" scoring rule doesn't false-flag clean demo accounts.

### 3.3 Authentication & Authorization
- **Pre-existing and confirmed working:** `AuthService` (signup, login, JWT verification against Supabase, HS256 algorithm explicitly enforced to prevent algorithm-confusion attacks) and `requireAuth` middleware, which attaches `req.user.sub` (`auth.uid()`) to every protected request.
- **Newly built:** `authHelpers.ts` with explicit, readable ownership checks:
  - `canAccessGig(userId, gig)` — true if the requesting user is either the worker or client on that gig
  - `canAccessUserProfile(userId, targetUserId)` — true if requesting their own profile
- `risk_checks` and `sos_events` are authorized transitively through their parent gig — no separate ownership fields needed, since they're system-written, not user-written.
- Design goal explicitly maintained throughout: every authorization decision must be simple enough to explain out loud during judging Q&A — no abstraction layers that can't be justified live.

### 3.4 Risk Scoring Engine
`RiskScoringService.calculateRiskScore()` — a pure, dependency-free function producing a 0–100 score plus a plain-English `reasons[]` array:

| Signal | Weight |
|---|---|
| KYC unverified | +40 |
| KYC pending | +15 |
| SIM swap flagged | +35 |
| Community rating < 3.0 | +20 |
| Community rating < 4.0 | +10 |
| Account age < 7 days | +10 |

A fallback rule-based classifier (`mapScoreToRiskLevel`) maps score ranges to low/medium/high, serving as a safety net if the Gemini call fails — the pipeline is designed to degrade gracefully rather than fail silently or block the response.

Verified against seed data: Dave Danger scores ~95 (high), clean verified workers score ~0 (low) — confirming a clear, demo-ready spread between safe and risky profiles.

---

## 4. In Progress

- **Gemini classification endpoint** (`geminiClassification.service.ts` + `POST /api/gigs/:id/risk-check`): takes the computed score + reasons, sends only that (not raw PII) to Gemini with a strict system prompt forcing structured JSON output (`riskLevel` + a template key only — no free text). Backend maps the returned template key to one of three pre-written message strings. Result is persisted to `risk_checks`. Includes a non-blocking fallback to the rule-based classifier if the Gemini call fails or times out.
- **Blocking item:** `GEMINI_API_KEY` needs to be added to `.env` before this endpoint can be tested end-to-end.

---

## 5. Not Yet Started

- Gig lifecycle endpoints: `start`, `checkin`, and a demo-only `simulate-timeout` endpoint (to trigger the SOS path live without waiting on a real timer)
- `sos.service.ts` — SOS event creation and resolution flow
- `sms.service.ts` — Africa's Talking sandbox integration, wired into both high-risk classification results and SOS triggers
- Full fullstack integration (connecting the already-built frontend to these live endpoints)
- Deployment (Railway/Render) and live demo rehearsal
- Backup demo video recording

---

## 6. Risks & Mitigations Being Tracked

| Risk | Mitigation in place |
|---|---|
| Gemini API failure or rate limit during live judging | Rule-based fallback classifier ensures the pipeline still returns a usable result |
| SMS delivery failure | Logged, non-blocking — does not crash the request |
| Live USSD demo failure (not actually integrated) | Simulated via a manual API endpoint; explicitly labeled as simulated during the demo narrative rather than implied to be live |
| Timeline compression on remaining fullstack integration | API contract to be finalized and handed to frontend collaborator ahead of full integration, so frontend work can proceed against a stable contract while backend finishes |
| Live demo technical failure of any kind | Backup demo video to be recorded once the full loop works, as insurance |

---

## 7. Immediate Next Steps

1. Add `GEMINI_API_KEY` to `.env`
2. Complete and test `geminiClassification.service.ts` + risk-check route end-to-end via curl against seeded users
3. Build gig lifecycle endpoints (start / checkin / simulate-timeout)
4. Build `sos.service.ts` and `sms.service.ts`, wire SMS into both the high-risk classification path and the SOS trigger
5. Finalize and hand off API contract to frontend collaborator for integration
6. Full fullstack integration, deployment, and rehearsal (Day 3)