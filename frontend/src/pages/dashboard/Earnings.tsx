import { Wallet, TrendingUp, Calendar } from "lucide-react";
import Reveal from "../../components/Reveal";

interface WeekEarning {
  label: string;
  amount: number;
}

const weeklyEarnings: WeekEarning[] = [
  { label: "Wk 1", amount: 9800 },
  { label: "Wk 2", amount: 11200 },
  { label: "Wk 3", amount: 8600 },
  { label: "Wk 4", amount: 14500 },
];

const maxAmount = Math.max(...weeklyEarnings.map((w) => w.amount));

interface Transaction {
  id: string;
  gig: string;
  date: string;
  amount: number;
}

const transactions: Transaction[] = [
  { id: "t1", gig: "House Cleaning — Westlands", date: "Jul 15, 2026", amount: 2500 },
  { id: "t2", gig: "Deep Cleaning — Lavington", date: "Jul 13, 2026", amount: 3200 },
  { id: "t3", gig: "Airport Pickup Assist", date: "Jul 11, 2026", amount: 1800 },
  { id: "t4", gig: "Childcare (Evening) — Runda", date: "Jul 9, 2026", amount: 4000 },
  { id: "t5", gig: "House Cleaning — Westlands", date: "Jul 6, 2026", amount: 3000 },
];

export default function Earnings() {
  const monthTotal = weeklyEarnings.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Earnings</h1>
        <p className="mt-1 text-sm text-mist">Track your income across gigs and payout cycles.</p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Reveal delay={80}>
          <div className="h-full rounded-card border border-line bg-surface p-5">
            <div className="rounded-lg border border-teal/30 bg-teal/10 p-2 text-teal w-fit">
              <Wallet size={17} />
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-mist-dim">
              This Month
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">
              KSh {monthTotal.toLocaleString()}
            </p>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="h-full rounded-card border border-line bg-surface p-5">
            <div className="rounded-lg border border-amber/30 bg-amber/10 p-2 text-amber w-fit">
              <TrendingUp size={17} />
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-mist-dim">
              Growth Trend
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">+12%</p>
            <p className="mt-1 text-xs text-mist-dim">vs previous 4-week period</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={100} className="mt-8">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-display text-sm font-semibold text-paper">Weekly Breakdown</h2>
          <div className="mt-6 flex items-end gap-4 sm:gap-6">
            {weeklyEarnings.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[11px] text-mist-dim">
                  {w.amount.toLocaleString()}
                </span>
                <div className="flex h-32 w-full items-end overflow-hidden rounded-md bg-ink">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-teal-dim to-teal transition-all duration-700"
                    style={{ height: `${(w.amount / maxAmount) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-mist">{w.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={140} className="mt-8">
        <div className="rounded-card border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Calendar size={15} className="text-teal" />
            <h2 className="font-display text-sm font-semibold text-paper">Recent Payouts</h2>
          </div>
          <div className="flex flex-col">
            {transactions.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                  i !== transactions.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <div>
                  <p className="text-paper">{t.gig}</p>
                  <p className="font-mono text-[11px] text-mist-dim">{t.date}</p>
                </div>
                <span className="font-display font-semibold text-teal">
                  +KSh {t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}