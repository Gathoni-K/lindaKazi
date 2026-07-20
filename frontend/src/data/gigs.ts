import type { LucideIcon } from "lucide-react";
import { Home, Wrench, GraduationCap, Sparkles, Car, Baby } from "lucide-react";

export type GigStatus = "verified" | "pending" | "flagged" | "completed";

export interface Gig {
  id: string;
  title: string;
  icon: LucideIcon;
  time: string;
  location: string;
  client: string;
  status: GigStatus;
  note: string;
}

export const gigs: Gig[] = [
  {
    id: "g1",
    title: "House Cleaning",
    icon: Home,
    time: "10:00 AM – 2:00 PM",
    location: "Westlands, Nairobi",
    client: "Mrs. Njoroge",
    status: "verified",
    note: "Regular client. SIM verified, 6 completed gigs together.",
  },
  {
    id: "g2",
    title: "Plumbing Repair",
    icon: Wrench,
    time: "3:30 PM – 5:00 PM",
    location: "Kilimani, Nairobi",
    client: "David K.",
    status: "pending",
    note: "New client — SIM verification in progress. Proceed with standard caution.",
  },
  {
    id: "g3",
    title: "Private Tutoring",
    icon: GraduationCap,
    time: "6:00 PM – 7:30 PM",
    location: "Karen, Nairobi",
    client: "Unknown number",
    status: "flagged",
    note: "Client SIM registered less than 24 hours ago. Recommend confirming via video call before attending.",
  },
  {
    id: "g4",
    title: "Deep Cleaning",
    icon: Sparkles,
    time: "9:00 AM – 12:00 PM",
    location: "Lavington, Nairobi",
    client: "Grace W.",
    status: "verified",
    note: "Returning client. Trust score 96.",
  },
  {
    id: "g5",
    title: "Airport Pickup Assist",
    icon: Car,
    time: "5:00 AM – 6:30 AM",
    location: "JKIA, Nairobi",
    client: "Peter M.",
    status: "completed",
    note: "Completed on time. Client left a 5-star review.",
  },
  {
    id: "g6",
    title: "Childcare (Evening)",
    icon: Baby,
    time: "4:00 PM – 8:00 PM",
    location: "Runda, Nairobi",
    client: "Sarah O.",
    status: "completed",
    note: "Completed. Emergency contact chain was active throughout.",
  },
];