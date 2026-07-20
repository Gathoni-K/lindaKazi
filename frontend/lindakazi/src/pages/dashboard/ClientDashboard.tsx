import { useState } from "react";
import {
  ShieldCheck,
  Fingerprint,
  Star,
  Briefcase,
  MapPin,
  Clock,
  Wrench,
  Play,
  AlertTriangle,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import Avatar from "../../components/Avatar";

const worker = {
  name: "Samuel Otieno",
  id: "LK-8834-M",
  tier: "Verified Pro",
};

const trustBadges = [
  { icon: ShieldCheck, label: "Govt ID Verified" },
  { icon: Briefcase, label: "50+ Jobs Completed" },
  { icon: Star, label: "4.8/5.0 Safety Rating" },
  { icon: Fingerprint, label: "Biometrics Logged" },
];

const gig = {
  jobType: "House Painting",
  gigId: "GIG-3092",
  time: "Today, 2:00 PM – 6:00 PM (EAT)",
  location: "124 Riverside Drive, Nairobi",
  workerDistanceKm: 2.4,
};

type GigState = "scheduled" | "in-progress";

export default function ClientDashboard() {
  const [gigState, setGigState] = useState<GigState>("scheduled");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [issueText, setIssueText] = useState("");

  const handleStartGig = () => setGigState("in-progress");

  const handleSubmitReport = () => {
    if (!issueText.trim()) return;
    setReportSent(true);
    setReportOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">
          Gig Verification
        </h1>
        <p className="mt-1 max-w-xl text-sm text-mist">
          Review the security clearance and professional passport of your
          assigned freelancer before proceeding.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Worker trust passport */}
          <Reveal delay={80}>
            <div className="relative overflow-hidden rounded-card border border-line bg-surface-raised p-6">
              <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-teal/10 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={worker.name} size={64} />
                  <div>
                    <p className="font-display text-lg font-semibold text-paper">
                      {worker.name}
                    </p>
                    <p className="font-mono text-[11px] text-mist-dim">ID: {worker.id}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-amber px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
                      <ShieldCheck size={11} />
                      {worker.tier}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-3">
                {trustBadges.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5"
                  >
                    <b.icon size={15} className="shrink-0 text-teal" />
                    <span className="text-xs text-mist">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-4 flex items-start gap-2 rounded-lg border border-teal/30 bg-teal/10 px-4 py-3">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                <p className="text-xs leading-relaxed text-teal-soft">
                  This worker is safety-cleared by LindaKazi. No active risk
                  flags detected.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Upcoming gig details */}
          <Reveal delay={160}>
            <div className="rounded-card border border-line bg-surface p-6">
              <h2 className="font-display text-base font-semibold text-paper">
                Upcoming Gig Details
              </h2>

              <div className="mt-4 flex flex-col divide-y divide-line/70">
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                      <Wrench size={15} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                        Job Type
                      </p>
                      <p className="text-sm text-paper">{gig.jobType}</p>
                    </div>
                  </div>
                  <span className="rounded-pill bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-mist-dim">
                    {gig.gigId}
                  </span>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <Clock size={15} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                      Scheduled Time
                    </p>
                    <p className="text-sm text-paper">{gig.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                      Location
                    </p>
                    <p className="text-sm text-paper">{gig.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <Reveal delay={120}>
            <div className="rounded-card border border-line bg-surface p-6 text-center">
              <h2 className="font-display text-base font-semibold text-paper">
                Ready to Proceed?
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                By starting the gig, you confirm the worker's identity
                matches the Trust Passport above.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  onClick={handleStartGig}
                  disabled={gigState === "in-progress"}
                  className={`inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition-all ${
                    gigState === "in-progress"
                      ? "cursor-default bg-teal/20 text-teal"
                      : "bg-teal text-ink shadow-[0_0_25px_-5px_rgba(46,230,199,0.6)] hover:-translate-y-0.5 hover:bg-teal-dim"
                  }`}
                >
                  {gigState === "in-progress" ? (
                    <>
                      <CheckCircle2 size={16} />
                      Gig In Progress
                    </>
                  ) : (
                    <>
                      <Play size={15} />
                      Start Gig
                    </>
                  )}
                </button>

                <button
                  onClick={() => setReportOpen((v) => !v)}
                  className="inline-flex items-center justify-center gap-2 rounded-pill border border-line px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-danger/50 hover:text-danger"
                >
                  <AlertTriangle size={15} />
                  Report Issue
                </button>
              </div>

              {reportOpen && (
                <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 p-4 text-left">
                  <label className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                    Describe the issue
                  </label>
                  <textarea
                    value={issueText}
                    onChange={(e) => setIssueText(e.target.value)}
                    rows={3}
                    placeholder="e.g. Worker identity doesn't match photo..."
                    className="mt-2 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-mist-dim focus:border-danger/60 focus:outline-none"
                  />
                  <button
                    onClick={handleSubmitReport}
                    className="mt-3 w-full rounded-pill bg-danger px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-danger/85"
                  >
                    Submit Report
                  </button>
                </div>
              )}

              {reportSent && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-teal">
                  <CheckCircle2 size={13} />
                  Report submitted. Our safety team has been notified.
                </p>
              )}
            </div>
          </Reveal>

          {/* Map preview */}
          <Reveal delay={200}>
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="relative flex h-40 items-center justify-center bg-grid">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
                <div className="relative flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal/40 bg-teal/15 text-teal animate-pulse-ring">
                    <MapPin size={18} />
                  </div>
                  <span className="font-mono text-[10px] text-mist-dim">Nairobi, Kenya</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-3">
                <span className="flex items-center gap-1.5 text-xs text-mist">
                  <Navigation size={13} className="text-amber" />
                  Worker is {gig.workerDistanceKm} km away
                </span>
                <span className="font-mono text-xs font-semibold text-teal-soft">
                  Live Tracking
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}