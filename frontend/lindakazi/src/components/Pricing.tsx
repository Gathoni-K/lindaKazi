import { Check, Scale } from "lucide-react";
import Reveal from "./Reveal";

interface Tier {
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  features: string[];
  cta: string;
}

const tiers: Tier[] = [
  {
    name: "Free Tier",
    price: "KES 0",
    period: "for individual workers",
    highlight: false,
    features: [
      "USSD gig activation",
      "Basic onboarding + work log",
      "SMS emergency alerts",
    ],
    cta: "Get Protected",
  },
  {
    name: "Premium Pay-Per-Gig",
    price: "KES 5",
    period: "per active gig session",
    highlight: true,
    features: [
      "Everything in Free",
      "Instant SIM client verification",
      "Voice-routed SOS escalation",
      "Priority emergency contact chain",
    ],
    cta: "Start a Gig",
  },
  {
    name: "B2B Enterprise API",
    price: "Custom",
    period: "monthly platform licensing",
    highlight: false,
    features: [
      "Bulk worker verification",
      "Embedded safety metrics",
      "Compliance & reporting dashboard",
    ],
    cta: "Talk to Sales",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="pointer-events-none absolute left-1/3 top-0 h-72 w-72 rounded-full bg-amber/10 blur-3xl" />
      <Reveal>
        <div className="relative mb-14 max-w-2xl">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-teal-soft">
            <Scale size={13} />
            Safety is a right, not a luxury
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-paper sm:text-4xl">
            Core protection stays free. Scale pays for itself.
          </h2>
        </div>
      </Reveal>

      <div className="relative grid gap-6 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <div
              className={`flex h-full flex-col rounded-card border p-6 transition-all duration-300 hover:-translate-y-1 ${
                t.highlight
                  ? "border-teal/50 bg-teal/[0.06] animate-glow"
                  : "border-line bg-surface hover:bg-surface-raised hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]"
              }`}
            >
              {t.highlight && (
                <span className="mb-4 inline-block w-fit rounded-pill bg-teal px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink animate-badge-pulse">
                  Most Active
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-paper">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-paper">{t.price}</span>
              </div>
              <p className="mt-1 text-xs text-mist-dim">{t.period}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-mist">
                    <Check size={15} className="mt-0.5 shrink-0 text-teal" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#top"
                className={`mt-8 inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  t.highlight
                    ? "bg-teal text-ink shadow-[0_0_25px_-5px_rgba(46,230,199,0.6)] hover:bg-teal-dim"
                    : "border border-line text-paper hover:border-teal/50 hover:text-teal-soft"
                }`}
              >
                {t.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}