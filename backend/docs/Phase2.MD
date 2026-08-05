# Concept Map: Gig Lifecycle, SOS, and SMS Integration
### Extracted for independent practice, from the LindaKazi build

This isn't a recap of the LindaKazi task — it's a map of the *transferable backend engineering concepts* embedded in that task, stripped of domain specifics, so you can deliberately re-practice each one in a different project.

---

## 1. State Machine Design (the core concept underneath everything)

**What it was in context:** `gigs.status` moving through `pending → active → completed`, and `checkinStatus` moving through `not_started → awaiting → checked_in / missed`.

**The transferable concept:** Any entity with a lifecycle (an order, a subscription, a ticket, a job application) should have its valid states and valid *transitions* explicitly defined — not just a free-text status field anyone can set to anything.

**Practice prompt to use in a new project:**
> "I have a [entity] that moves through these states: [list them]. Help me design a state machine for it: which transitions are valid from which states, and where in the code should invalid transitions be rejected rather than silently allowed?"

**Self-check question:** Can you draw your entity's states and arrows between them on paper before writing any code? If not, you don't have a state machine yet, just a status field.

---

## 2. Guard Clauses for Invalid State Transitions

**What it was in context:** The fix flagged in your last plan — `checkin` shouldn't succeed if the gig isn't `active`; `simulate-timeout` shouldn't succeed on a `completed` gig.

**The transferable concept:** Every endpoint that mutates state should ask "is this transition even legal from where the record currently is?" *before* doing the mutation — and return a clean, specific error if not.

**Practice prompt:**
> "For this endpoint that changes [entity]'s status, add a guard clause that checks the current status is valid for this transition before proceeding. Return a 400 with a clear message if not."

**Self-check question:** If you clicked a button on your frontend twice by accident, would your backend handle it gracefully or corrupt data?

---

## 3. Non-Blocking Side Effects (graceful degradation)

**What it was in context:** SMS sending and Gemini classification both wrapped so failure doesn't crash or hang the main request — the core response still returns even if the "nice to have" side effect fails.

**The transferable concept:** Distinguish between **critical path** (must succeed or the request fails) and **side effects** (nice to have, log and move on if they fail). Wrap side effects in try/catch that logs, not one that propagates.

**Practice prompt:**
> "This endpoint has a core action [X] and a secondary side effect [Y, e.g. sending a notification]. Show me how to structure this so a failure in Y never blocks or crashes the response for X, but is still logged for debugging."

**Self-check question:** In your own project, list every external API call (email, SMS, push notification, third-party webhook) — for each one, ask "if this fails right now, does my user-facing request still succeed?"

---

## 4. Environment Variables for Anything That Might Change Without a Code Deploy

**What it was in context:** The fix to move the hardcoded emergency contact number into `EMERGENCY_CONTACT_NUMBER` in `.env` instead of a literal string in code.

**The transferable concept:** Any value that's likely to change per-environment (dev/staging/prod) or that a non-developer might need to update quickly — API keys, contact numbers, feature flags, URLs — belongs in environment config, not hardcoded.

**Practice prompt:**
> "Audit this file for any hardcoded values that should probably be environment variables instead — API keys, URLs, magic numbers, contact details. List them and tell me why each one qualifies or doesn't."

**Self-check question:** Could you swap a critical value in your app 5 minutes before a demo/deploy without touching code? If not, it's probably hardcoded somewhere it shouldn't be.

---

## 5. Authorization as a Consistent Pattern, Applied Everywhere — Including "Demo-Only" Routes

**What it was in context:** Catching that `simulate-timeout` was missing `requireAuth` even though it was demo-only, because every *other* route had it.

**The transferable concept:** Security/auth checks should be a habit applied uniformly, not something you remember selectively based on how "important" a route feels. The routes you consider low-stakes are exactly the ones most likely to get skipped.

**Practice prompt:**
> "Here's a list of all my API routes. For each, tell me what auth/authorization check is applied, and flag any that are inconsistent with similar routes elsewhere in the app."

**Self-check question:** If you listed every route in your app in a table with an "auth required?" column, would there be any gaps you can't explain?

---

## 6. Simulating Infrastructure You Don't Have Time to Build (Honest Simplification)

**What it was in context:** No cron/queue system existed, so instead of building one, a manual `simulate-timeout` endpoint stands in for "time has passed" — explicitly labeled as demo-only rather than pretending it's the real mechanism.

**The transferable concept:** Under real time constraints, it's often correct to build the *logic* for real and simulate the *trigger*. The dishonest version is disguising a simulated trigger as if it were the real one; the honest version names it clearly (in code comments, in your pitch, in documentation).

**Practice prompt:**
> "I don't have time to build [real infrastructure, e.g. a cron job / webhook listener / hardware sensor]. Help me build the downstream logic for real, and design a manual trigger endpoint that stands in for it — and tell me where I should clearly document that it's a stand-in."

**Self-check question:** In your own projects, can you point to every place where you've simulated something, and would you be comfortable explaining that out loud to someone technical?

---

## 7. Separating "What Fires the Side Effect" from "What the Side Effect Does"

**What it was in context:** `sms.service.ts` (generic: send any message to any number) is separate from `sos.service.ts` (specific: what happens on an SOS, which happens to include calling `sendSMS`). The Gemini classification service also calls `sendSMS` independently.

**The transferable concept:** A low-level capability (send an SMS, send an email, write a log) should be a small reusable service, not duplicated logic inside every feature that needs it. Higher-level services *compose* lower-level ones.

**Practice prompt:**
> "I have [a capability, e.g. sending notifications] needed in multiple places in my app. Help me extract it into its own service with a clean, generic function signature, and refactor the call sites to use it instead of duplicating the logic."

**Self-check question:** If you had to change *how* SMS gets sent (switch providers), would you edit one file or hunt through many?

---

## Suggested Way to Practice This Independently

Pick a small side project (even a toy one — a task tracker, a library-book checkout system, a simple booking app) and deliberately build **one entity with a real lifecycle** (not just CRUD). Then apply concepts 1–7 to it in order:

1. Draw the state machine on paper first.
2. Add guard clauses for invalid transitions.
3. Add one side effect (even something trivial like a console log standing in for an email) and make it non-blocking.
4. Move anything environment-specific into `.env`.
5. Audit every route for consistent auth.
6. If some piece of real infrastructure is out of scope (e.g. a payment gateway), build a clearly-labeled simulated version instead of skipping it entirely.
7. Extract your side effect into its own small service file, and call it from more than one place to prove it's reusable.

Doing this once, end-to-end, on a small toy entity will cement these patterns far better than re-reading the LindaKazi code — the goal is muscle memory for the *shape* of the decisions, not the specific domain.