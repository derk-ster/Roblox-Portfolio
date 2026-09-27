"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

export function UISection() {
  const assets = getSectionAssets("ui", getAssetsByCategory("ui"));

  return (
    <CategorySection
      id="ui"
      eyebrow="UI Design"
      title="UI"
      description="Interface designs made in Figma, then imported and set up in Roblox Studio."
      accent="cyan"
      className="overflow-hidden"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="UI work"
        folderPath="public/assets/ui"
        libraryTitle="UI"
      />
    </CategorySection>
  );
}
