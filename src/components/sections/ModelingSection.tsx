"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

export function ModelingSection() {
  const assets = getSectionAssets(
    "modeling",
    getAssetsByCategory("modeling")
  );

  return (
    <CategorySection
      id="modeling"
      eyebrow="3D Modeling"
      title="3D Modeling"
      description="Blender work for OUTRUN, a game lobby I modeled. Same map, different angles."
      accent="lime"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="3D modeling work"
        folderPath="public/assets/modeling"
        variant="modeling"
        columns="grid-3d"
      />
    </CategorySection>
  );
}
