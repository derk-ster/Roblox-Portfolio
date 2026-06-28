"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory, getFeaturedAssets } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

export function BestWorkSection() {
  const bestWork = getAssetsByCategory("best-work");
  const featured = getFeaturedAssets();
  const assets = getSectionAssets(
    "best-work",
    bestWork.length > 0 ? bestWork : featured
  );

  return (
    <CategorySection
      id="best-work"
      eyebrow="Featured"
      title="Best Work"
      description="A few projects I am most happy with."
      accent="cyan"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="best work"
        folderPath="public/assets/best-work"
        showFilters={assets.length > 2}
      />
    </CategorySection>
  );
}
