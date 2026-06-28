"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

export function BuildingSection() {
  const assets = getSectionAssets(
    "building",
    getAssetsByCategory("building")
  );

  return (
    <CategorySection
      id="building"
      eyebrow="Building"
      title="Building"
      description="Maps, lobbies, and environments built in Roblox Studio."
      accent="orange"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="building work"
        folderPath="public/assets/building"
        variant="building"
        columns="large"
      />
    </CategorySection>
  );
}
