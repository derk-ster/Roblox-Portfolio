import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { ScrollSceneBackdrop } from "@/components/home/ScrollSceneBackdrop";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { BestWorkSection } from "@/components/sections/BestWorkSection";
import { ScriptingSection } from "@/components/sections/ScriptingSection";
import { AnimationSection } from "@/components/sections/AnimationSection";
import { VFXSection } from "@/components/sections/VFXSection";
import { BuildingSection } from "@/components/sections/BuildingSection";
import { ModelingSection } from "@/components/sections/ModelingSection";
import { WhyHireSection } from "@/components/sections/WhyHireSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export default function Home() {
  return (
    <ScrollSceneBackdrop>
      <ScrollProgress />
      <FloatingParticles count={14} />
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <BestWorkSection />
        <ScriptingSection />
        <AnimationSection />
        <VFXSection />
        <BuildingSection />
        <ModelingSection />
        <WhyHireSection />
        <ProcessSection />
      </main>
      <Footer />
    </ScrollSceneBackdrop>
  );
}
