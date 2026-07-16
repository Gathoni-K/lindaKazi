import Reveal from "./Reveal";
import Footer from "./Footer";

export default function FinalCTA() {
  return (
    <>
      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-teal/25 bg-gradient-to-br from-teal/[0.1] via-surface to-violet/[0.08] p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-teal/20 blur-3xl animate-blob" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-amber/20 blur-3xl animate-blob [animation-delay:3s]" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-paper sm:text-4xl">
                No signal shouldn't mean no safety.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-mist">
                Join the workers and platforms building a gig economy where
                protection doesn't depend on a data bundle.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-pill bg-teal px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_-5px_rgba(46,230,199,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-teal-dim"
                >
                  Protect My Gigs — Workers
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-pill border border-line px-6 py-3 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal-soft"
                >
                  Verify My Workers — Clients
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}