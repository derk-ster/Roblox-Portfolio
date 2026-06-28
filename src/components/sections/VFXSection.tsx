"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

const VFX_TAGS = [
  "Roblox VFX",
  "Particles",
  "Trails",
  "Impact",
  "Dash",
  "Domain",
  "Combat",
];

export function VFXSection() {
  const assets = getSectionAssets("vfx", getAssetsByCategory("vfx"));

  return (
    <CategorySection
      id="vfx"
      eyebrow="VFX"
      title="VFX"
      description="Particle and trail work, mostly tied into scripted systems."
      accent="pink"
      glow
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="VFX work"
        folderPath="public/assets/vfx"
        extraTags={VFX_TAGS}
        variant="vfx"
      />
    </CategorySection>
  );
}
