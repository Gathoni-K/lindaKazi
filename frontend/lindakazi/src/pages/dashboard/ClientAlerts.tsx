import { useState } from "react";
import {
  Siren,
  ShieldCheck,
  ChevronDown,
  Phone,
  User,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import Avatar from "../../components/Avatar";

type ClientIncidentStatus = "resolved" | "false-alarm";

interface ClientIncident {
  id: string;
  worker: string;
  gigTitle: string;
  triggeredAt: number;
  status: ClientIncidentStatus;
  note: string;
}

const seedHistory: ClientIncident[] = [
  {
    id: "c-inc-1",
    worker: "Grace Wambui",
    gigTitle: "Deep Cleaning — Lavington",
    triggeredAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    status: "resolved",
    note: "Worker confirmed safe within 4 minutes. No further action needed.",
  },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function HistoryItem({ incident }: { incident: ClientIncident }) {
  const [expanded, setExpanded] = useState(false);
  const isResolved = incident.status === "resolved";

  return (
    <div className="rounded-card border border-line bg-surface">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <Avatar name={incident.worker} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-paper">{incident.worker}</p>
          <p className="truncate font-mono text-[11px] text-mist-dim">
            {incident.gigTitle} · {formatDate(incident.triggeredAt)}
          </p>
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
          <p className="text-sm leading-relaxed text-mist">{incident.note}</p>
        </div>
      )}
    </div>
  );
}

export default function ClientAlerts() {
  const [activeAlert, setActiveAlert] = useState<ClientIncident | null>(null);
  const [history, setHistory] = useState<ClientIncident[]>(seedHistory);
  const [calling, setCalling] = useState(false);

  const simulateIncoming = () => {
    setActiveAlert({
      id: crypto.randomUUID(),
      worker: "Samuel Otieno",
      gigTitle: "House Painting — Riverside Drive",
      triggeredAt: Date.now(),
      status: "resolved",
      note: "",
    });
  };

  const acknowledge = () => {
    if (!activeAlert) return;
    setHistory((prev) => [
      {
        ...activeAlert,
        note: "Acknowledged by client. Worker confirmed safe.",
      },
      ...prev,
    ]);
    setActiveAlert(null);
  };

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => setCalling(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Alerts</h1>
        <p className="mt-1 text-sm text-mist">
          Safety alerts from workers on your active gigs, and a record of past incidents.
        </p>
      </Reveal>

      {activeAlert ? (
        <Reveal delay={80} className="mt-8">
          <div className="relative overflow-hidden rounded-card border border-danger/50 bg-danger/5 p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-danger/15 blur-3xl animate-blob" />
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-danger/40 bg-danger/15 text-danger animate-pulse-ring">
                <Siren size={24} />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-paper">
                Safety Alert Received
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <Avatar name={activeAlert.worker} size={28} />
                <p className="text-sm text-paper">{activeAlert.worker}</p>
              </div>
              <p className="mt-1 text-xs text-mist-dim">{activeAlert.gigTitle}</p>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={handleCall}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-pill border border-line px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-teal/50 hover:text-teal-soft"
                >
                  <Phone size={15} />
                  {calling ? "Calling…" : "Call Worker"}
                </button>
                <button
                  onClick={acknowledge}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-teal px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
                >
                  <ShieldCheck size={15} />
                  Acknowledge
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
            <p className="mt-1 text-sm text-mist">
              You'll be notified here if a worker on your gig triggers an SOS.
            </p>
            <button
              onClick={simulateIncoming}
              className="mt-5 inline-flex items-center gap-1.5 rounded-pill border border-line px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-danger/40 hover:text-danger"
            >
              <User size={15} />
              Simulate Incoming Alert (Demo)
            </button>
          </div>
        </Reveal>
      )}

      <Reveal delay={140} className="mt-10">
        <h2 className="font-display text-sm font-semibold text-paper">Alert History</h2>
        <div className="mt-4 flex flex-col gap-3">
          {history.map((incident) => (
            <HistoryItem key={incident.id} incident={incident} />
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