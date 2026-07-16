import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

interface ComparisonRow {
  label: string;
  them: boolean;
  us: boolean;
}

const rows: ComparisonRow[] = [
  { label: "Works with zero mobile data", them: false, us: true },
  { label: "Works in low-signal / dead zones", them: false, us: true },
  { label: "Requires a smartphone", them: true, us: false },
  { label: "Instant SIM identity verification", them: false, us: true },
  { label: "Manual check-in (timer anxiety)", them: true, us: false },
  { label: "One-press SOS via keypad", them: false, us: true },
];

export default function CompetitiveEdge() {
  return (
    <section className="relative overflow-hidden mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-widest text-teal-soft">
            Why LindaKazi Wins
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-paper sm:text-4xl">
            Competitor apps fail the moment data runs out.
          </h2>
          <p className="mt-4 text-mist">
            LindaKazi's native telecom integration — USSD, SMS, Voice, SIM
            insights — makes it universal, lightweight, and unstoppable, even
            for workers on the most basic keypad phone.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-line px-5 py-3 font-mono text-xs uppercase tracking-wide text-mist-dim">
              <span></span>
              <span className="w-16 text-center">Internet-Only</span>
              <span className="w-16 text-center text-teal">LindaKazi</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 text-sm transition-colors duration-200 hover:bg-surface-raised ${
                  i !== rows.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <span className="text-paper">{r.label}</span>
                <span className="flex w-16 justify-center">
                  {r.them ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist-dim/15 text-mist-dim">
                      <Check size={13} />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger/10 text-danger/80">
                      <X size={13} />
                    </span>
                  )}
                </span>
                <span className="flex w-16 justify-center">
                  {r.us ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/15 text-teal shadow-[0_0_12px_-2px_rgba(46,230,199,0.6)]">
                      <Check size={13} />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist-dim/15 text-mist-dim">
                      <X size={13} />
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}