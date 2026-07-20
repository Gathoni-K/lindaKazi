import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type IncidentStatus = "resolved" | "false-alarm";

export interface ActiveIncident {
  id: string;
  gigTitle: string;
  triggeredAt: number;
}

export interface Incident extends ActiveIncident {
  status: IncidentStatus;
  resolutionNote: string;
}

interface AlertContextValue {
  activeIncident: ActiveIncident | null;
  history: Incident[];
  triggerSOS: (gigTitle: string) => void;
  resolveActive: (status: IncidentStatus) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const seedHistory: Incident[] = [
  {
    id: "inc-seed-1",
    gigTitle: "House Cleaning — Westlands",
    triggeredAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    status: "resolved",
    resolutionNote: "Confirmed safe after a follow-up call. Gig completed normally.",
  },
  {
    id: "inc-seed-2",
    gigTitle: "Private Tutoring — Karen",
    triggeredAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    status: "false-alarm",
    resolutionNote: "Triggered accidentally while walking. Marked as a false alarm.",
  },
];

export function AlertProvider({ children }: { children: ReactNode }) {
  const [activeIncident, setActiveIncident] = useState<ActiveIncident | null>(null);
  const [history, setHistory] = useState<Incident[]>(seedHistory);

  const triggerSOS = (gigTitle: string) => {
    if (activeIncident) return;
    setActiveIncident({
      id: crypto.randomUUID(),
      gigTitle,
      triggeredAt: Date.now(),
    });
  };

  const resolveActive = (status: IncidentStatus) => {
    if (!activeIncident) return;
    setHistory((prev) => [
      {
        ...activeIncident,
        status,
        resolutionNote:
          status === "resolved"
            ? "Marked safe by worker. Emergency contacts notified of resolution."
            : "Marked as a false alarm by worker.",
      },
      ...prev,
    ]);
    setActiveIncident(null);
  };

  return (
    <AlertContext.Provider value={{ activeIncident, history, triggerSOS, resolveActive }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be used within an AlertProvider");
  return ctx;
}