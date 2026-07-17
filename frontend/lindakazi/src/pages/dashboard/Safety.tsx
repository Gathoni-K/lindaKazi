import { useState } from "react";
import type { FormEvent } from "react";
import { Phone, Hash, Plus, Trash2, ShieldAlert, Siren } from "lucide-react";
import Reveal from "../../components/Reveal";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const initialContacts: EmergencyContact[] = [
  { id: "c1", name: "Grace (Sister)", phone: "+254 712 345 678" },
  { id: "c2", name: "James (Neighbor)", phone: "+254 733 987 654" },
];

const tips = [
  "Always confirm the client's SIM verification badge before starting a gig.",
  "Share your gig location with an emergency contact before you arrive.",
  "If a client's account was registered less than 24 hours ago, consider a video call first.",
  "Press 9 during any active call to trigger an instant SOS escalation.",
];

export default function Safety() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const addContact = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setContacts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim() },
    ]);
    setName("");
    setPhone("");
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">
          Safety Toolkit
        </h1>
        <p className="mt-1 text-sm text-mist">
          Manage your emergency contacts and review your safety loop.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal delay={100}>
          <div className="h-full rounded-card border border-danger/30 bg-danger/5 p-6">
            <div className="flex items-center gap-2 text-danger">
              <Siren size={18} />
              <h2 className="font-display text-base font-semibold">SOS Quick Reference</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              During any active gig call, press{" "}
              <span className="rounded bg-danger/15 px-1.5 py-0.5 font-mono text-danger">9</span>{" "}
              to trigger an instant SOS. This works even with zero data — the alert routes over
              Voice/DTMF and SMS, not the internet.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2.5 font-mono text-xs text-mist">
              <Hash size={14} className="text-amber" />
              Dial <span className="text-paper">*483*9#</span> to activate manually
            </div>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="h-full rounded-card border border-line bg-surface p-6">
            <h2 className="font-display text-base font-semibold text-paper">
              Emergency Contacts
            </h2>
            <p className="mt-1 text-xs text-mist-dim">
              These contacts receive automatic SMS alerts during your gig sessions.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-ink px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-teal" />
                    <div>
                      <p className="text-sm text-paper">{c.name}</p>
                      <p className="font-mono text-[11px] text-mist-dim">{c.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeContact(c.id)}
                    aria-label={`Remove ${c.name}`}
                    className="text-mist-dim transition-colors hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-mist-dim">
                  No emergency contacts yet — add one below.
                </p>
              )}
            </div>

            <form onSubmit={addContact} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name"
                className="flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-mist-dim focus:border-teal/60 focus:outline-none"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7xx xxx xxx"
                className="flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-mist-dim focus:border-teal/60 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-dim"
              >
                <Plus size={14} />
                Add
              </button>
            </form>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-8">
        <div className="rounded-card border border-line bg-surface p-6">
          <div className="flex items-center gap-2 text-amber">
            <ShieldAlert size={17} />
            <h2 className="font-display text-base font-semibold text-paper">Safety Tips</h2>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-mist">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}