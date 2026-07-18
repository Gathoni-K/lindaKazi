import { useEffect, useState } from "react";
import {
  Siren,
  MapPin,
  MessageSquareText,
  PhoneCall,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import { useAlerts } from "../../context/AlertContext";
import type { Incident } from "../../context/AlertContext";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const escalationSteps = [
  { atSeconds: 0, icon: MapPin, label: "Location captured" },
  { atSeconds: 3, icon: MessageSquareText, label: "Emergency contacts notified via SMS" },
  { atSeconds: 6, icon: PhoneCall, label: "Voice escalation queued" },
];

function IncidentHistoryItem({ incident }: { incident: Incident }) {
  const [expanded, setExpanded] = useState(false);
  const isResolved = incident.status === "resolved";

  return (
    <div className="rounded-card border border-line bg-surface">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
            isResolved
              ? "border-teal/30 bg-teal/10 text-teal"
              : "border-amber/30 bg-amber/10 text-amber"
          }`}
        >
          {isResolved ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-paper">{incident.gigTitle}</p>
          <p className="font-mono text-[11px] text-mist-dim">{formatDate(incident.triggeredAt)}</p>
        </div>
        <span
          className={`hidden shrink-0 rounded-pill border px-2.5 py-1 font-mono text-[10px] font-semibold sm:inline ${
            isResolved
              ? "border-teal/30 bg-teal/15 text-teal"
              : "border-amber/30 bg-amber/15 text-amber"
          }`}
        >
          {isResolved ? "Resolved" : "False Alarm"}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-mist-dim transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="border-t border-line/70 px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-mist">{incident.resolutionNote}</p>
        </div>
      )}
    </div>
  );
}

export default function WorkerAlerts() {
  const { activeIncident, history, triggerSOS, resolveActive } = useAlerts();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!activeIncident) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeIncident]);

  const elapsedMs = activeIncident ? now - activeIncident.triggeredAt : 0;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Alerts</h1>
        <p className="mt-1 text-sm text-mist">
          Your live safety status and a record of every alert you've triggered.
        </p>
      </Reveal>

      {activeIncident ? (
        <Reveal delay={80} className="mt-8">
          <div className="relative overflow-hidden rounded-card border border-danger/50 bg-danger/5 p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-danger/15 blur-3xl animate-blob" />
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-danger/40 bg-danger/15 text-danger animate-pulse-ring">
                <Siren size={24} />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-paper">
                SOS Active — {formatElapsed(elapsedMs)}
              </h2>
              <p className="mt-1 text-sm text-mist">
                Triggered during: <span className="text-paper">{activeIncident.gigTitle}</span>
              </p>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5 text-left">
                {escalationSteps.map((step) => {
                  const reached = elapsedSeconds >= step.atSeconds;
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
                        reached
                          ? "border-teal/30 bg-teal/10 text-teal"
                          : "border-line bg-surface text-mist-dim"
                      }`}
                    >
                      <step.icon size={15} className="shrink-0" />
                      <span className="text-xs">{step.label}</span>
                      {reached && <CheckCircle2 size={13} className="ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={() => resolveActive("resolved")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-teal px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
                >
                  <ShieldCheck size={15} />
                  I'm Safe — Cancel
                </button>
                <button
                  onClick={() => resolveActive("false-alarm")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-pill border border-line px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-mist-dim"
                >
                  False Alarm
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={80} className="mt-8">
          <div className="rounded-card border border-line bg-surface p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-teal">
              <ShieldCheck size={20} />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-paper">
              No Active Alerts
            </h2>
            <p className="mt-1 text-sm text-mist">You're all clear. Stay safe out there.</p>
            <button
              onClick={() => triggerSOS("Test Alert (Manual Trigger)")}
              className="mt-5 inline-flex items-center gap-1.5 rounded-pill border border-danger/40 px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              <Siren size={15} />
              Send Test SOS
            </button>
          </div>
        </Reveal>
      )}

      <Reveal delay={140} className="mt-10">
        <h2 className="font-display text-sm font-semibold text-paper">Alert History</h2>
        <div className="mt-4 flex flex-col gap-3">
          {history.map((incident) => (
            <IncidentHistoryItem key={incident.id} incident={incident} />
          ))}
          {history.length === 0 && (
            <p className="rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-mist-dim">
              No past alerts yet.
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}