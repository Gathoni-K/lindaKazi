import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface Metric {
  label: string;
  value: number;
  color: string;
}

const metrics: Metric[] = [
  { label: "KYC Document Validity", value: 99, color: "var(--color-teal)" },
  { label: "Telecom / SIM Integrity", value: 85, color: "var(--color-amber)" },
  { label: "Behavioral Telemetry", value: 92, color: "var(--color-violet)" },
];

export default function RiskScoreCard() {
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let frame: number;
    const target = 92;
    const start = performance.now();
    const duration = 1400;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setScore(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-teal/30 blur-3xl animate-blob" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber/25 blur-3xl animate-blob [animation-delay:3s]" />

      <div className="relative rounded-card border border-line bg-surface-raised/90 backdrop-blur p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] animate-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/15 text-teal">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-mono text-[11px] text-mist">ID_784920</p>
              <p className="font-mono text-[10px] text-amber">ANALYZING…</p>
            </div>
          </div>
          <span className="rounded-pill bg-amber/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-amber">
            LIVE
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-mist">
                <span>{m.label}</span>
                <span style={{ color: m.color }}>{mounted ? m.value : 0}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full transition-[width] duration-[1400ms] ease-out"
                  style={{
                    width: mounted ? `${m.value}%` : "0%",
                    background: m.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <span className="font-mono text-[11px] text-mist">Composite Trust Score</span>
          <span className="font-display text-3xl font-bold text-teal">
            {score}
            <span className="text-base text-mist">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}