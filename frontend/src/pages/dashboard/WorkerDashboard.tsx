import { useMemo, useState } from "react";
import { Wallet, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { gigs as initialGigs } from "../../data/gigs";
import type { Gig, GigStatus } from "../../data/gigs";
import GigCard from "../../components/GigCard";
import Reveal from "../../components/Reveal";
import { useCountUp } from "../../hooks/useCountUp";
import { useAuth } from "../../context/AuthContext";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [gigList, setGigList] = useState<Gig[]>(initialGigs);
  const [showAll, setShowAll] = useState(false);

  const trustScore = useCountUp(98, 1200, true);

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