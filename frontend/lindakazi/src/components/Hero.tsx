import { ShieldCheck, Sparkles } from "lucide-react";
import RiskScoreCard from "./RiskScoreCard";
import Reveal from "./Reveal";
import { useRoleCTA } from "../hooks/useRoleCTA";

export default function Hero() {
  const goTo = useRoleCTA();

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-amber/15 blur-3xl animate-blob [animation-delay:4s]" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet/15 blur-3xl animate-blob [animation-delay:2s]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/40 to-ink" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <Reveal>
                    <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-[3.4rem]">
            The trust layer
            <br />
            <span className="bg-gradient-to-r from-teal via-teal-soft to-amber bg-clip-text text-transparent">
              gig work was missing.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            LindaKazi verifies identity, scores risk in real time, and keeps
            an emergency safety loop running over USSD, SMS, and Voice — so
            protection never depends on data, Wi-Fi, or a smartphone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => goTo("worker")}
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-teal px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_-5px_rgba(46,230,199,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
            >
              <ShieldCheck size={17} />
              Protect My Gigs — Workers
            </button>
            <button
              onClick={() => goTo("client")}
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-line px-6 py-3 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal-soft"
            >
              Verify My Workers — Clients
            </button>
          </div>

          <p className="mt-6 font-mono text-xs text-mist-dim">
            No app download. No airtime required. Works on any phone.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <RiskScoreCard />
        </Reveal>
      </div>
    </section>
  );
}