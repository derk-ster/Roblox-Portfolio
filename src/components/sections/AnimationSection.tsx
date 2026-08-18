"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

const ANIMATION_TAGS = [
  "Combat",
  "JJS",
  "Emotes",
  "Sukuna",
  "Gojo",
  "Fortnite",
  "Blender",
  "R6",
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
      description="Combat, movement, and emote animations made in Blender for Roblox."
      accent="purple"
      className="overflow-hidden"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="animation work"
        folderPath="public/assets/animation"
        extraTags={ANIMATION_TAGS}
        libraryTitle="Animation"
      />
    </CategorySection>
  );
}
