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
  Loader2,
  UserCheck,
  Siren,
  X,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import Avatar from "../../components/Avatar";
import RiskStatusBanner from "../../components/RiskStatusBanner";
import { useAuth } from "../../context/AuthContext";
import { gigApi, CreateGigResponse, RiskCheckResponse, ApiError } from "../../lib/api";

const worker = {
  name: "Samuel Otieno",
  id: "0d5a3eb1-11c5-4303-90d0-bb154032d8cf", // Using a valid UUID for the demo worker
  tier: "Verified Pro",
};

const trustBadges = [
  { icon: ShieldCheck, label: "Govt ID Verified" },
  { icon: Briefcase, label: "50+ Jobs Completed" },
  { icon: Star, label: "4.8/5.0 Safety Rating" },
  { icon: Fingerprint, label: "Biometrics Logged" },
];

export default function ClientDashboard() {
  const { token } = useAuth();
  
  // ── Form State ─────────────────────────────────────────────────────────────
  const [location, setLocation] = useState("124 Riverside Drive, Nairobi");
  const [title, setTitle] = useState("House Painting");
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(240);
  
  // ── Pipeline State ──────────────────────────────────────────────────────────
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingRisk, setIsCheckingRisk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ── Active Gig State ────────────────────────────────────────────────────────
  const [activeGig, setActiveGig] = useState<CreateGigResponse['gig'] | null>(null);
  const [riskResult, setRiskResult] = useState<RiskCheckResponse | null>(null);

  // ── Gig Lifecycle State ─────────────────────────────────────────────────────
  const [gigLiveStatus, setGigLiveStatus] = useState<"scheduled" | "in-progress" | "checked-in">("scheduled");
  const [isStarting, setIsStarting] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSimulatingTimeout, setIsSimulatingTimeout] = useState(false);
  const [sosAlertMessage, setSosAlertMessage] = useState<string | null>(null);

  // ── Other UI State ──────────────────────────────────────────────────────────
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [issueText, setIssueText] = useState("");

  const handleCreateAndCheckGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setError(null);
    setIsCreating(true);
    let createdGigId: string;
    
    try {
      // Step 1: Create Gig
      const createRes = await gigApi.create({
        workerId: worker.id, // Hardcoded for demo worker profile
        location,
        title,
        expectedDurationMinutes
      }, token);
      
      setActiveGig(createRes.gig);
      createdGigId = createRes.gig.id;
    } catch (err) {
      setIsCreating(false);
      setError(err instanceof ApiError ? err.message : "Failed to create gig.");
      return;
    }
    
    setIsCreating(false);
    setIsCheckingRisk(true);
    
    try {
      // Step 2: Run Risk Check Pipeline (Telemetry -> Gemini AI -> SMS)
      const riskRes = await gigApi.runRiskCheck(createdGigId, token);
      setRiskResult(riskRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Risk check failed.");
    } finally {
      setIsCheckingRisk(false);
    }
  };

  const handleStartGig = async () => {
    if (!token || !activeGig) return;
    setError(null);
    setIsStarting(true);
    try {
      await gigApi.startGig(activeGig.id, token);
      setGigLiveStatus("in-progress");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start gig.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCheckin = async () => {
    if (!token || !activeGig) return;
    setError(null);
    setIsCheckingIn(true);
    try {
      await gigApi.checkinGig(activeGig.id, token);
      setGigLiveStatus("checked-in");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Worker check-in failed.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleSimulateTimeout = async () => {
    if (!token || !activeGig) return;
    setError(null);
    setSosAlertMessage(null);
    setIsSimulatingTimeout(true);
    try {
      const res = await gigApi.simulateTimeout(activeGig.id, token);
      setSosAlertMessage(res.message ?? "SOS triggered — emergency SMS dispatched.");
    } catch (err) {
      setSosAlertMessage(
        err instanceof ApiError ? err.message : "Timeout simulation failed."
      );
    } finally {
      setIsSimulatingTimeout(false);
    }
  };

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
          {activeGig 
            ? "Review the security clearance and professional passport of your assigned freelancer before proceeding."
            : "Initiate a new gig to run live telemetry safety checks on your assigned worker."}
        </p>
      </Reveal>

      {error && (
        <div className="mt-6 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/30">
          {error}
        </div>
      )}

      {/* ── CREATE GIG FORM (Shown if no active gig) ── */}
      {!activeGig && !isCreating && (
        <Reveal delay={80}>
          <form onSubmit={handleCreateAndCheckGig} className="mt-8 max-w-xl rounded-card border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-paper">Create New Gig</h2>
            
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist">Job Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-paper focus:border-teal focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-paper focus:border-teal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist">Duration (Minutes)</label>
                <input 
                  type="number" 
                  value={expectedDurationMinutes}
                  onChange={(e) => setExpectedDurationMinutes(Number(e.target.value))}
                  min={15}
                  className="w-full rounded-lg border border-line bg-ink px-4 py-2.5 text-sm text-paper focus:border-teal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist">Assigned Worker ID</label>
                <input 
                  type="text" 
                  value={worker.id}
                  disabled
                  className="w-full rounded-lg border border-line/50 bg-ink/50 px-4 py-2.5 text-sm text-mist-dim cursor-not-allowed"
                />
                <p className="mt-1 text-[10px] text-mist-dim">Locked to demo worker for MVP pipeline execution.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-teal px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-teal-dim disabled:opacity-50"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Create & Run Security Check
            </button>
          </form>
        </Reveal>
      )}

      {/* ── ACTIVE GIG DASHBOARD ── */}
      {(activeGig || isCreating) && (
        <>
          {/* ── RISK BANNER PLACEMENT ── */}
          <div className="mt-8">
             <RiskStatusBanner 
               isLoading={isCreating || isCheckingRisk}
               riskLevel={riskResult?.riskLevel}
               message={riskResult?.message}
             />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
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
                </div>
              </Reveal>

              {/* Upcoming gig details */}
              {activeGig && (
                <Reveal delay={160}>
                  <div className="rounded-card border border-line bg-surface p-6">
                    <h2 className="font-display text-base font-semibold text-paper">
                      Active Gig Details
                    </h2>

                    <div className="mt-4 flex flex-col divide-y divide-line/70">
                      <div className="flex items-center justify-between gap-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                            <Wrench size={15} />
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                              Job Title
                            </p>
                            <p className="text-sm text-paper">{activeGig.title}</p>
                          </div>
                        </div>
                        <span className="rounded-pill bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-mist-dim">
                          {activeGig.id.split('-')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                          <Clock size={15} />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-mist-dim">
                            Expected Duration
                          </p>
                          <p className="text-sm text-paper">{expectedDurationMinutes} Minutes</p>
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
                          <p className="text-sm text-paper">{activeGig.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <Reveal delay={120}>
                <div className="rounded-card border border-line bg-surface p-6">
                  <h2 className="font-display text-base font-semibold text-paper text-center">
                    Gig Controls
                  </h2>
                  <p className="mt-1 text-center text-xs leading-relaxed text-mist">
                    Manage the live state of this gig and test emergency flows.
                  </p>

                  <div className="mt-5 flex flex-col gap-2.5">
                    {/* ── START GIG ─────────────────────────────────────────── */}
                    <button
                      id="btn-start-gig"
                      onClick={handleStartGig}
                      disabled={gigLiveStatus !== "scheduled" || isCheckingRisk || isStarting}
                      className={`inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition-all ${
                        gigLiveStatus !== "scheduled"
                          ? "cursor-default bg-teal/20 text-teal"
                          : "bg-teal text-ink shadow-[0_0_25px_-5px_rgba(46,230,199,0.6)] hover:-translate-y-0.5 hover:bg-teal-dim disabled:opacity-50 disabled:hover:translate-y-0"
                      }`}
                    >
                      {isStarting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : gigLiveStatus !== "scheduled" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Play size={15} />
                      )}
                      {gigLiveStatus === "scheduled" ? "Start Gig" :
                       gigLiveStatus === "in-progress" ? "Gig In Progress" :
                       "Worker Checked In"}
                    </button>

                    {/* ── WORKER CHECK-IN ───────────────────────────────────── */}
                    <button
                      id="btn-worker-checkin"
                      onClick={handleCheckin}
                      disabled={gigLiveStatus !== "in-progress" || isCheckingIn}
                      className="inline-flex items-center justify-center gap-2 rounded-pill border border-line px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-teal/50 hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isCheckingIn ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <UserCheck size={15} />
                      )}
                      Worker Check-In
                    </button>

                    {/* ── SIMULATE TIMEOUT (Demo) ───────────────────────────── */}
                    <button
                      id="btn-simulate-timeout"
                      onClick={handleSimulateTimeout}
                      disabled={gigLiveStatus === "scheduled" || isSimulatingTimeout}
                      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill border border-danger/50 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-all hover:bg-danger/20 hover:shadow-[0_0_20px_-4px_rgba(255,80,80,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSimulatingTimeout ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Siren size={15} className="group-hover:animate-pulse" />
                      )}
                      {isSimulatingTimeout ? "Triggering SOS…" : "Simulate Timeout (Demo Only)"}
                    </button>
                  </div>

                  {/* ── SOS ALERT BANNER ──────────────────────────────────── */}
                  {sosAlertMessage && (
                    <div className="mt-5 relative rounded-lg border border-danger/40 bg-danger/10 p-4 text-left">
                      <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-danger animate-ping opacity-75" />
                      <div className="flex items-start gap-3">
                        <Siren size={18} className="mt-0.5 shrink-0 text-danger" />
                        <div className="flex-1">
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-danger">
                            SOS Triggered
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-mist">
                            {sosAlertMessage}
                          </p>
                        </div>
                        <button
                          onClick={() => setSosAlertMessage(null)}
                          className="shrink-0 rounded p-0.5 text-mist-dim hover:text-danger"
                          aria-label="Dismiss alert"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── REPORT ISSUE ──────────────────────────────────────── */}
                  <div className="mt-4">
                    <button
                      id="btn-report-issue"
                      onClick={() => setReportOpen((v) => !v)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-line px-5 py-2.5 text-xs font-semibold text-mist transition-colors hover:border-danger/50 hover:text-danger"
                    >
                      <AlertTriangle size={13} />
                      Report Issue
                    </button>
                  </div>

                  {reportOpen && (
                    <div className="mt-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-left">
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
                      Worker is 2.4 km away
                    </span>
                    <span className="font-mono text-xs font-semibold text-teal-soft">
                      Live Tracking
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}