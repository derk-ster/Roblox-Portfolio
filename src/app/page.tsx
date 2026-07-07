import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { ScrollSceneBackdropLoader } from "@/components/home/ScrollSceneBackdropLoader";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { BestWorkSection } from "@/components/sections/BestWorkSection";
import { ScriptingSection } from "@/components/sections/ScriptingSection";
import { AnimationSection } from "@/components/sections/AnimationSection";
import { VFXSection } from "@/components/sections/VFXSection";
import { BuildingSection } from "@/components/sections/BuildingSection";
import { ModelingSection } from "@/components/sections/ModelingSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { WhyHireSection } from "@/components/sections/WhyHireSection";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PortfolioChat } from "@/components/chat/PortfolioChat";

export default function Home() {
  return (
    <>
      <ScrollSceneBackdropLoader />
      <div className="relative z-10">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <StatsStrip />
          <ProjectShowcaseSection />
          <BestWorkSection />
          <ScriptingSection />
          <AnimationSection />
          <VFXSection />
          <BuildingSection />
          <ModelingSection />
          <PricingSection />
          <WhyHireSection />
          <ProcessSection />
        </main>
        <Footer />
        <PortfolioChat />
      </div>
    </>
  );
}
