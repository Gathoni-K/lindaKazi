## 📌 Project Overview

**LindaKazi** is a hyper-local, high-impact STEM solution addressing a critical, multi-layered crisis in our community: **the physical safety and economic invisibility of informal gig workers.** In Kenya and across developing economies, millions of informal workers (such as *mama fuas* [domestic cleaners], plumbers, electricians, and day laborers) enter strangers' homes daily to earn a living, with zero institutional protections — leaving them vulnerable to harassment, wage theft, and violence. At the same time, clients booking these workers have no reliable way to verify who they're letting into their homes.

LindaKazi addresses both sides of this trust gap: a verified identity and risk-check layer that protects clients, integrated with an automated, zero-friction safety layer that protects workers — all built on infrastructure (SMS, USSD, voice) that works on any phone, not just smartphones with reliable data.

---

## 🚨 The Problem

1. **Physical Vulnerability & Lack of Accountability:** When a domestic worker or plumber goes into a new compound, their safety is invisible. Manual check-ins ("call me when you get there") are easily forgotten or cut off if a phone dies.
2. **Client-Side Trust Gap:** Clients have no way to verify a worker's identity or track record before letting them into their home — about 80% of informal gig workers operate without any identity verification today.
3. **The Marketplace Failure of Safety Apps:** Traditional safety/panic apps fail because users only open them out of fear, and rarely use them consistently. To succeed, a safety layer has to run passively in the background of a transaction both sides already want to complete — not require a separate app workers have to remember to launch.

---

## ✨ The Solution (How LindaKazi Works)

### 1. Client-Side Risk Verification
* **SIM-Swap & Identity Check:** Before a gig is confirmed, LindaKazi runs a live SIM-swap check against the worker's number via Africa's Talking, combined with KYC status and community rating.
* **AI Risk Classification:** Gemini AI classifies the combined risk signal into a tier, giving clients a clear, fast read on a worker's trustworthiness before they arrive.
* **Graceful Fallback:** If the AI call fails or is unavailable, the system falls back to deterministic rule-based scoring — the pipeline never breaks, it degrades safely.

### 2. The Automated Safety Layer (Worker Protection)
* **Gig Lifecycle Tracking:** Each gig moves through a tracked state — `pending → active → completed` — alongside a check-in state (`not started → awaiting → checked in / missed`).
* **Passive Check-In:** Once a gig starts, the worker is expected to check in before the job's expected end time. No active monitoring needed from either side.
* **Automatic SOS Escalation:** If a check-in is missed, the system automatically opens an SOS event and dispatches an emergency SMS to a designated contact — **zero active intervention required from the worker in a crisis.**
* **Keypad SOS:** Workers can also self-trigger an SOS at any time via DTMF keypad (pressing '9' during an active voice session), for situations where they can act but can't safely use an app.

---

## 🌍 Hackathon Theme Alignment

LindaKazi directly supports the **Girls in STEM Global Hackathon** theme: *"Think globally. Solve locally."*

* **Public Safety & Emergency Response:** Mitigates daily physical threats faced by informal workers entering unvetted private properties.
* **Technology for Social Good:** Serves an overlooked sector using accessible, low-bandwidth technology — USSD and SMS work on any phone, not just smartphones.
* **UN SDG 5 (Gender Equality):** Protects women in the informal domestic care economy (*mama fuas*), one of the highest-risk employment cohorts locally.
* **UN SDG 8 (Decent Work & Economic Growth):** Builds a verified track record for informal workers, a first step toward the kind of provable history that's currently invisible to formal financial systems.

---

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript
* **Backend:** Node.js / Express, with Zod-validated routes
* **Database:** PostgreSQL via Drizzle ORM, hosted on Supabase
* **Auth:** Supabase Auth with JWT-based session validation
* **Risk Pipeline:** Rule-based scoring + Gemini AI classification, with deterministic fallback
* **Telephony & Messaging:** Africa's Talking API for SMS dispatch, voice triggers, and SIM-swap/identity checks
