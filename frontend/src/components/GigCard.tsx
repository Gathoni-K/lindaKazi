import { useState } from "react";
import { MapPin, Clock, ChevronDown, ShieldCheck, Flag } from "lucide-react";
import type { Gig, GigStatus } from "../data/gigs";

interface GigCardProps {
  gig: Gig;
  onAdvanceStatus: (id: string, next: GigStatus) => void;
}

const statusStyles: Record<GigStatus, { label: string; classes: string }> = {
  verified: { label: "Verified", classes: "bg-teal/15 text-teal border-teal/30" },
  pending: { label: "Pending", classes: "bg-amber/15 text-amber border-amber/30" },
  flagged: { label: "Flagged", classes: "bg-danger/15 text-danger border-danger/30" },
  completed: { label: "Completed", classes: "bg-mist-dim/15 text-mist border-line" },
};

const nextAction: Partial<Record<GigStatus, { label: string; next: GigStatus }>> = {
  flagged: { label: "Mark Reviewed", next: "pending" },
  pending: { label: "Confirm Verification", next: "verified" },
  verified: { label: "Mark Complete", next: "completed" },
};

export default function GigCard({ gig, onAdvanceStatus }: GigCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = statusStyles[gig.status];
  const action = nextAction[gig.status];
  const isFlagged = gig.status === "flagged";

  return (
    <div
      className={`rounded-card border bg-surface transition-colors ${
        isFlagged ? "border-danger/50" : "border-line"
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
            isFlagged
              ? "border-danger/30 bg-danger/10 text-danger"
              : "border-teal/30 bg-teal/10 text-teal"
          }`}
        >
          <gig.icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-paper">{gig.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-mist-dim">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {gig.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {gig.location}
            </span>
          </div>
        </div>

        <span
          className={`hidden shrink-0 items-center gap-1 rounded-pill border px-2.5 py-1 font-mono text-[10px] font-semibold sm:flex ${style.classes}`}
        >
          {isFlagged ? <Flag size={10} /> : <ShieldCheck size={10} />}
          {style.label}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-mist-dim transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-line/70 px-4 pb-4 pt-3">
          <span
            className={`mb-2 inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 font-mono text-[10px] font-semibold sm:hidden ${style.classes}`}
          >
            {style.label}
          </span>
          <p className="text-xs text-mist-dim">
            Client: <span className="text-mist">{gig.client}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mist">{gig.note}</p>

          {action && (
            <button
              onClick={() => onAdvanceStatus(gig.id, action.next)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-teal px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}