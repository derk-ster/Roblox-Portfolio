"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

export function WIPSection() {
  const assets = getSectionAssets("wip", getAssetsByCategory("wip"));

  return (
    <CategorySection
      id="wip"
      eyebrow="In Development"
      title="Work In Progress"
      description="Unfinished previews. These are not final deliverables."
      accent="orange"
      className="bg-panel/30"
    >
      <div className="mb-6 rounded-xl border border-orange/20 bg-orange/5 p-3 text-xs text-orange sm:text-sm">
        <strong>Note:</strong> Items here are unfinished and may change before delivery.
      </div>
      <PortfolioGrid
        assets={assets}
        categoryLabel="work in progress"
        folderPath="public/assets/wip"
        variant="wip"
        showFilters={assets.length > 2}
      />
    </CategorySection>
  );
}
