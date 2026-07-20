import type { LucideIcon } from "lucide-react";
import { Phone, MessageSquareText, Hash, Fingerprint, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

interface Step {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
  color: "teal" | "amber" | "violet" | "danger";
}

const colorMap: Record<Step["color"], string> = {
  teal: "border-teal/30 bg-teal/10 text-teal",
  amber: "border-amber/30 bg-amber/10 text-amber",
  violet: "border-violet/30 bg-violet/10 text-violet",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

const steps: Step[] = [
  {
    icon: Phone,
    label: "01",
    title: "USSD Activation",
    body: "Worker dials a short code from any keypad phone to start a gig session — no app, no smartphone required.",
    color: "teal",
  },
  {
    icon: Fingerprint,
    label: "02",
    title: "SIM Verification",
    body: "The client's SIM identity and account age are checked instantly, flagging brand-new or suspicious numbers.",
    color: "violet",
  },
  {
    icon: MessageSquareText,
    label: "03",
    title: "Timed SMS Check-ins",
    body: "Automatic SMS alerts fire to emergency contacts at set intervals — no timer anxiety, no manual check-ins.",
    color: "amber",
  },
  {
    icon: Hash,
    label: "04",
    title: "DTMF SOS",
    body: "Pressing 9 during the call instantly escalates to emergency contacts and logs a location-timestamped alert.",
    color: "danger",
  },
];

export default function SafetyLoop() {
  return (
    <section id="safety-loop" className="relative overflow-hidden border-y border-line/60 bg-surface/40">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-teal-soft">
              The Safety Loop
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-paper sm:text-4xl">
              Four steps. Zero dependency on data or Wi-Fi.
            </h2>
            <p className="mt-4 text-mist">
              Built for zero-failure scenarios — deterministic logic, not a
              model waiting on a connection that might not be there.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120} className="relative h-full">
              <div className="group h-full rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-raised hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-mist-dim">{s.label}</span>
                  <div
                    className={`rounded-lg border p-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${colorMap[s.color]}`}
                  >
                    <s.icon size={17} />
                  </div>
                </div>
                <h3 className="font-display text-base font-semibold text-paper">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  size={16}
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-mist-dim lg:block"
                />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}