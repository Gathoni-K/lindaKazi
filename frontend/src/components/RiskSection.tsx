import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ShieldAlert, WifiOff, UserX, MapPinOff, FileWarning } from "lucide-react";
import Reveal from "./Reveal";

interface Risk {
  icon: LucideIcon;
  title: string;
  body: string;
}

const workerRisks: Risk[] = [
  {
    icon: UserX,
    title: "Unverified Clients",
    body: "Workers accept gigs from strangers with no way to confirm who they actually are before walking into their home.",
  },
  {
    icon: WifiOff,
    title: "Dead Zones & No Data",
    body: "Most safety apps stop working the moment a worker runs out of airtime or enters a low-signal area — exactly when risk is highest.",
  },
];

const clientRisks: Risk[] = [
  {
    icon: FileWarning,
    title: "Unverified Contractors",
    body: "Clients grant home and property access to workers with no background or SIM-identity check in place.",
  },
  {
    icon: MapPinOff,
    title: "No Escalation Trail",
    body: "If something goes wrong, there is no timed check-in or emergency contact chain already active in the background.",
  },
];

interface RiskCardProps extends Risk {
  tone: "danger" | "amber";
  delay: number;
}

function RiskCard({ icon: Icon, title, body, tone, delay }: RiskCardProps) {
  const border = tone === "danger" ? "border-l-danger" : "border-l-amber";
  const iconBox =
    tone === "danger"
      ? "border-danger/30 bg-danger/10 text-danger"
      : "border-amber/30 bg-amber/10 text-amber";

  return (
    <Reveal delay={delay}>
      <div
        className={`group rounded-card border border-line border-l-4 ${border} bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-raised hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]`}
      >
        <div
          className={`mb-3 inline-flex rounded-lg border p-2 transition-transform duration-300 group-hover:scale-110 ${iconBox}`}
        >
          <Icon size={18} />
        </div>
        <h4 className="font-display text-base font-semibold text-paper">{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-mist">{body}</p>
      </div>
    </Reveal>
  );
}

export default function RiskSection() {
  return (
    <section id="risk" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-teal-soft">
            Asymmetric Risk Profile
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-paper sm:text-4xl">
            The gig economy exposes both sides — with no signal to fall back on.
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Reveal>
            <div className="mb-4 flex items-center gap-2 text-danger">
              <AlertTriangle size={16} />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
                Worker Vulnerabilities
              </h3>
            </div>
          </Reveal>
          <div className="flex flex-col gap-4">
            {workerRisks.map((r, i) => (
              <RiskCard key={r.title} {...r} tone="danger" delay={i * 120} />
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <div className="mb-4 flex items-center gap-2 text-amber">
              <ShieldAlert size={16} />
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
                Client Liabilities
              </h3>
            </div>
          </Reveal>
          <div className="flex flex-col gap-4">
            {clientRisks.map((r, i) => (
              <RiskCard key={r.title} {...r} tone="amber" delay={i * 120} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}