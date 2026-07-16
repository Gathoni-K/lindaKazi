import { HeartHandshake, Radio, Users } from "lucide-react";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";

const pillars = [
  {
    icon: Radio,
    title: "Telecom-native by design",
    body: "We build on USSD, SMS, and Voice first — the infrastructure that already reaches every phone in the region, smartphone or not.",
  },
  {
    icon: Users,
    title: "Built with the people we protect",
    body: "LindaKazi is shaped directly by conversations with domestic workers, caregivers, and casual laborers about what safety actually feels like on the ground.",
  },
  {
    icon: HeartHandshake,
    title: "Safety as a shared responsibility",
    body: "Workers and clients both carry risk in informal gig work. Our tools are built to protect both sides, not just one.",
  },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-teal/15 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet/15 blur-3xl animate-blob [animation-delay:3s]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-widest text-teal-soft">
              About LindaKazi
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-paper sm:text-5xl">
              Safety shouldn't depend on a signal bar.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-mist sm:text-lg">
              LindaKazi started with a simple observation: millions of women
              in gig work — domestic workers, caregivers, cleaners — walk
              into strangers' homes every day with no reliable way to verify
              who they're meeting or call for help if something goes wrong.
              Existing safety apps assume good internet. We built for the
              reality most workers actually face.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className="h-full rounded-card border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-raised hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]">
                <div className="mb-4 inline-flex rounded-lg border border-teal/30 bg-teal/10 p-2.5 text-teal">
                  <p.icon size={19} />
                </div>
                <h3 className="font-display text-lg font-semibold text-paper">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="rounded-card border border-line bg-surface p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-paper">Our approach</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">
              Every feature we ship has to work on a KES 1,000 keypad phone
              in a low-signal estate, not just the latest smartphone on fast
              LTE. That constraint shapes everything — from how we verify
              identity over a SIM record instead of a photo upload, to how we
              deliver emergency alerts over SMS instead of push
              notifications. If it doesn't work offline, it doesn't ship.
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}