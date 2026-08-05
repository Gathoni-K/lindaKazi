import { useMemo, useState } from "react";
import { Wallet, Star, ShieldCheck, TrendingUp, Play, UserCheck, Siren, Loader2, CheckCircle2, X } from "lucide-react";
import { gigs as initialGigs } from "../../data/gigs";
import type { Gig, GigStatus } from "../../data/gigs";
import GigCard from "../../components/GigCard";
import Reveal from "../../components/Reveal";
import { useCountUp } from "../../hooks/useCountUp";
import { useAuth } from "../../context/AuthContext";
import { gigApi, ApiError } from "../../lib/api";

export default function WorkerDashboard() {
  const { user, token } = useAuth();
  const [gigList, setGigList] = useState<Gig[]>(initialGigs);
  const [showAll, setShowAll] = useState(false);

  const trustScore = useCountUp(98, 1200, true);

  // ── Lifecycle Controls (pinned to the first verified/active gig) ────────────
  // We use the first "verified" gig from the list as the demo active gig.
  const activeGig = gigList.find((g) => g.status === "verified") ?? null;
  const [gigLiveStatus, setGigLiveStatus] = useState<"scheduled" | "in-progress" | "checked-in">("scheduled");
  const [isStarting, setIsStarting] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSimulatingTimeout, setIsSimulatingTimeout] = useState(false);
  const [sosAlertMessage, setSosAlertMessage] = useState<string | null>(null);
  const [lifecycleError, setLifecycleError] = useState<string | null>(null);

  const handleStartGig = async () => {
    if (!token || !activeGig) return;
    setLifecycleError(null);
    setIsStarting(true);
    try {
      // Use the string gig id from local data for the demo; in prod this would be the DB UUID.
      await gigApi.startGig(activeGig.id, token);
      setGigLiveStatus("in-progress");
    } catch (err) {
      setLifecycleError(err instanceof ApiError ? err.message : "Failed to start gig.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCheckin = async () => {
    if (!token || !activeGig) return;
    setLifecycleError(null);
    setIsCheckingIn(true);
    try {
      await gigApi.checkinGig(activeGig.id, token);
      setGigLiveStatus("checked-in");
    } catch (err) {
      setLifecycleError(err instanceof ApiError ? err.message : "Worker check-in failed.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleSimulateTimeout = async () => {
    if (!token || !activeGig) return;
    setLifecycleError(null);
    setSosAlertMessage(null);
    setIsSimulatingTimeout(true);
    try {
      const res = await gigApi.simulateTimeout(activeGig.id, token);
      setSosAlertMessage(res.message ?? "SOS triggered — emergency SMS dispatched.");
    } catch (err) {
      setSosAlertMessage(err instanceof ApiError ? err.message : "Timeout simulation failed.");
    } finally {
      setIsSimulatingTimeout(false);
    }
  };

  const handleAdvanceStatus = (id: string, next: GigStatus) => {
    setGigList((prev) => prev.map((g) => (g.id === id ? { ...g, status: next } : g)));
  };

  const visibleGigs = useMemo(
    () => (showAll ? gigList : gigList.slice(0, 3)),
    [showAll, gigList]
  );

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-mist">Your dashboard is active and monitored.</p>
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Reveal delay={80}>
          <div className="h-full rounded-card border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg border border-amber/30 bg-amber/10 p-2 text-amber">
                <Wallet size={17} />
              </div>
              <span className="rounded-pill bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-mist-dim">
                This Week
              </span>
            </div>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-wide text-mist-dim">
              Total Earnings
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">KSh 14,500</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-teal">
              <TrendingUp size={13} />
              +12% vs last week
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="h-full rounded-card border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-lg border border-amber/30 bg-amber/10 p-2 text-amber">
                <Star size={17} />
              </div>
              <span className="rounded-pill bg-surface-raised px-2.5 py-1 font-mono text-[10px] text-mist-dim">
                Overall
              </span>
            </div>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-wide text-mist-dim">
              Average Rating
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">
              4.9 <span className="text-base font-normal text-mist">/5.0</span>
            </p>
            <p className="mt-2 text-xs text-mist-dim">Based on 42 reviews</p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="h-full rounded-card border border-l-4 border-line border-l-teal bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-wide text-mist-dim">
                Trust Score
              </p>
              <div className="text-amber">
                <ShieldCheck size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10">
                <span className="font-display text-3xl font-bold text-teal">{trustScore}</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-mist-dim">
              Top 5% of workers in your region.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={100} className="mt-10">
        {/* ── ACTIVE GIG CONTROLS PANEL ── */}
        {activeGig && (
          <div className="mb-6 rounded-card border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-sm font-semibold text-paper">Active Gig Controls</h2>
                <p className="mt-0.5 font-mono text-[10px] text-mist-dim">{activeGig.title} &bull; {activeGig.location}</p>
              </div>
              <span className={`rounded-pill px-2.5 py-1 font-mono text-[10px] font-semibold border ${
                gigLiveStatus === "scheduled" ? "bg-amber/10 text-amber border-amber/30" :
                gigLiveStatus === "in-progress" ? "bg-teal/10 text-teal border-teal/30" :
                "bg-teal/20 text-teal border-teal/40"
              }`}>
                {gigLiveStatus === "scheduled" ? "Scheduled" :
                 gigLiveStatus === "in-progress" ? "In Progress" :
                 "Checked In"}
              </span>
            </div>

            {lifecycleError && (
              <div className="mt-3 rounded-lg bg-danger/10 border border-danger/30 px-3 py-2 text-xs text-danger">
                {lifecycleError}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2.5">
              {/* Start Gig */}
              <button
                id="btn-worker-start-gig"
                onClick={handleStartGig}
                disabled={gigLiveStatus !== "scheduled" || isStarting}
                className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-semibold transition-all ${
                  gigLiveStatus !== "scheduled"
                    ? "cursor-default bg-teal/15 text-teal"
                    : "bg-teal text-ink shadow-[0_0_18px_-4px_rgba(46,230,199,0.5)] hover:-translate-y-0.5 hover:bg-teal-dim disabled:opacity-50"
                }`}
              >
                {isStarting ? <Loader2 size={13} className="animate-spin" /> :
                 gigLiveStatus !== "scheduled" ? <CheckCircle2 size={13} /> : <Play size={13} />}
                {gigLiveStatus === "scheduled" ? "Start Gig" :
                 gigLiveStatus === "in-progress" ? "In Progress" : "Started"}
              </button>

              {/* Worker Check-In */}
              <button
                id="btn-worker-checkin"
                onClick={handleCheckin}
                disabled={gigLiveStatus !== "in-progress" || isCheckingIn}
                className="inline-flex items-center gap-2 rounded-pill border border-line px-4 py-2 text-xs font-semibold text-paper transition-colors hover:border-teal/50 hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCheckingIn ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                Worker Check-In
              </button>

              {/* Simulate Timeout */}
              <button
                id="btn-worker-simulate-timeout"
                onClick={handleSimulateTimeout}
                disabled={gigLiveStatus === "scheduled" || isSimulatingTimeout}
                className="group inline-flex items-center gap-2 rounded-pill border border-danger/50 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition-all hover:bg-danger/20 hover:shadow-[0_0_16px_-4px_rgba(255,80,80,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSimulatingTimeout
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Siren size={13} className="group-hover:animate-pulse" />}
                {isSimulatingTimeout ? "Triggering SOS…" : "Simulate Timeout (Demo Only)"}
              </button>
            </div>

            {/* SOS Alert Banner */}
            {sosAlertMessage && (
              <div className="mt-4 relative rounded-lg border border-danger/40 bg-danger/10 p-4">
                <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-danger animate-ping opacity-75" />
                <div className="flex items-start gap-3">
                  <Siren size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div className="flex-1">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-danger">SOS Triggered</p>
                    <p className="mt-1 text-xs leading-relaxed text-mist">{sosAlertMessage}</p>
                  </div>
                  <button
                    onClick={() => setSosAlertMessage(null)}
                    className="shrink-0 rounded p-0.5 text-mist-dim hover:text-danger"
                    aria-label="Dismiss SOS alert"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-card border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-sm font-semibold text-paper">Upcoming Gigs</h2>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="font-mono text-xs text-teal-soft transition-colors hover:text-teal"
            >
              {showAll ? "Show Less" : "View All"} →
            </button>
          </div>

          <div className="flex flex-col gap-3 p-4">
            {visibleGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} onAdvanceStatus={handleAdvanceStatus} />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}