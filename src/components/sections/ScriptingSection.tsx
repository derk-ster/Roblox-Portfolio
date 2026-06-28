"use client";

import { CategorySection } from "@/components/portfolio/CategorySection";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getAssetsByCategory } from "@/lib/assets";
import { getSectionAssets } from "@/lib/placeholders";

const SCRIPTING_TAGS = [
  "UI Systems",
  "Emote Systems",
  "Movement",
  "Inventory",
  "Quests",
  "Settings",
  "Lua",
  "Roblox Studio",
];

export function ScriptingSection() {
  const assets = getSectionAssets(
    "scripting",
    getAssetsByCategory("scripting")
  );

  return (
    <CategorySection
      id="scripting"
      eyebrow="Scripting"
      title="Scripting"
      description="Mostly UI and emote systems, plus movement and gameplay scripts."
      accent="cyan"
    >
      <PortfolioGrid
        assets={assets}
        categoryLabel="scripting work"
        folderPath="public/assets/scripting"
        extraTags={SCRIPTING_TAGS}
      />
    </CategorySection>
  );
}
