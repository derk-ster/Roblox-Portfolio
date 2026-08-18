"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

const VFX_TAGS = [
  "Roblox VFX",
  "Lightning",
  "Fire",
  "Combat",
  "Slash",
  "Beam",
  "Impact",
  "Dash",
  "Particles",
];

export function VFXSection() {
  const assets = getSectionAssets("vfx", getAssetsByCategory("vfx"));

  return (
    <CategorySection
      id="vfx"
      eyebrow="VFX"
      title="VFX"
      description="Custom ability effects, lightning, beams, explosions, and screen VFX in Roblox Studio."
      accent="pink"
      glow
      className="overflow-hidden"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="VFX work"
        folderPath="public/assets/vfx"
        extraTags={VFX_TAGS}
        variant="vfx"
        libraryTitle="VFX"
      />
    </CategorySection>
  );
}
