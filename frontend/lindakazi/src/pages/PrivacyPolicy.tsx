import { Lock, Scale } from "lucide-react";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";

const sections = [
  {
    title: "What we collect",
    body: "Basic account details (name, email, phone), SIM/telecom metadata used for identity verification, and gig-session logs such as start/end times and emergency check-ins. We do not collect location history beyond an active session's SOS trigger.",
  },
  {
    title: "How we use it",
    body: "Data is used to verify identity between workers and clients, calculate composite trust scores, and route emergency alerts to the right contacts. We never sell personal data to third parties.",
  },
  {
    title: "Who can see it",
    body: "Workers and clients only see the verification outcome (e.g. a trust score), not each other's raw underlying data. Enterprise partners accessing the B2B API receive aggregated, permissioned data only.",
  },
  {
    title: "Your controls",
    body: "You can request a copy of your data or ask us to delete your account at any time. Emergency contact chains are opt-in and editable from your profile at any point.",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-80 w-80 rounded-full bg-teal/15 blur-3xl animate-blob" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-teal-soft">
              <Scale size={13} />
              Privacy Policy
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-paper sm:text-5xl">
              Your safety data, handled with care.
            </h1>
            
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <div className="flex flex-col gap-6">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="rounded-card border border-line bg-surface p-6">
                <div className="mb-3 flex items-center gap-2 text-teal">
                  <Lock size={15} />
                  <h2 className="font-display text-base font-semibold text-paper">
                    {s.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-mist">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}