"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

const ANIMATION_TAGS = [
  "Emotes",
  "Sukuna",
  "Gojo",
  "Fortnite",
  "Blender",
  "R15",
  "Animation",
];

export function AnimationSection() {
  const assets = getSectionAssets(
    "animation",
    getAssetsByCategory("animation")
  );

  return (
    <CategorySection
      id="animation"
      eyebrow="Animation"
      title="Animation"
      description="Emotes and movement animations made in Blender for Roblox."
      accent="purple"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="animation work"
        folderPath="public/assets/animation"
        extraTags={ANIMATION_TAGS}
      />
    </CategorySection>
  );
}
