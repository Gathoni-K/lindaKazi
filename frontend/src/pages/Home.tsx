import Hero from "../components/Hero";
import RiskSection from "../components/RiskSection";
import SafetyLoop from "../components/SafetyLoop";
import CompetitiveEdge from "../components/CompetitiveEdge";
import Pricing from "../components/Pricing";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <RiskSection />
      <SafetyLoop />
      <CompetitiveEdge />
      <Pricing />
      <FinalCTA />
    </>
  );
}