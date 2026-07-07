"use client";

import { useCallback, useMemo, useState } from "react";
import { HorizontalMarquee } from "@/components/effects/HorizontalMarquee";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioFilters } from "./PortfolioFilters";
import { MediaModal } from "./MediaModal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PortfolioAsset } from "@/types/portfolio";

interface PortfolioGridProps {
  assets: PortfolioAsset[];
  categoryLabel: string;
  folderPath: string;
  extraTags?: string[];
  variant?: "default" | "vfx" | "wip" | "modeling" | "building";
  showFilters?: boolean;
  layout?: "marquee" | "grid";
  marqueeDurationSeconds?: number;
}

const CARD_WIDTH = "w-[min(88vw,20rem)] shrink-0 sm:w-80";

function expandAssetsForMarquee(
  assets: PortfolioAsset[],
  minCount = 6
): Array<{ asset: PortfolioAsset; key: string }> {
  if (assets.length === 0) return [];

  const items: Array<{ asset: PortfolioAsset; key: string }> = [];
  let round = 0;

  while (items.length < minCount) {
    for (const asset of assets) {
      items.push({ asset, key: `${asset.id}-marquee-${round}` });
      if (items.length >= minCount) break;
    }
    round += 1;
  }

  return items;
}

export function PortfolioGrid({
  assets,
  categoryLabel,
  folderPath,
  extraTags = [],
  variant = "default",
  showFilters = true,
  layout = "marquee",
  marqueeDurationSeconds = 75,
}: PortfolioGridProps) {
  const [filtered, setFiltered] = useState(assets);
  const [modalAsset, setModalAsset] = useState<PortfolioAsset | null>(null);

  const handleFilterChange = useCallback((filteredAssets: PortfolioAsset[]) => {
    setFiltered(filteredAssets);
  }, []);

  const marqueeItems = useMemo(
    () => expandAssetsForMarquee(filtered, 6),
    [filtered]
  );

  if (assets.length === 0) {
    return <EmptyState category={categoryLabel} folderPath={folderPath} />;
  }

  const cards = filtered.map((asset, i) => (
    <div key={asset.id} className={layout === "marquee" ? CARD_WIDTH : undefined}>
      <PortfolioCard
        asset={asset}
        index={i}
        variant={variant}
        compact={layout === "marquee"}
        isPlaceholder={asset.id.startsWith("placeholder-")}
        onViewDetails={setModalAsset}
        onOpenMedia={setModalAsset}
      />
    </div>
  ));

  const marqueeCards = marqueeItems.map(({ asset, key }, i) => (
    <div key={key} className={CARD_WIDTH}>
      <PortfolioCard
        asset={asset}
        index={i}
        variant={variant}
        compact
        isPlaceholder={asset.id.startsWith("placeholder-")}
        onViewDetails={setModalAsset}
        onOpenMedia={setModalAsset}
      />
    </div>
  ));

  return (
    <>
      {showFilters && assets.length > 1 && (
        <PortfolioFilters
          assets={assets}
          onFilterChange={handleFilterChange}
          extraTags={extraTags}
          className="mb-6"
        />
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted">
          No items match the current filters.
        </p>
      ) : layout === "marquee" ? (
        <HorizontalMarquee
          durationSeconds={marqueeDurationSeconds}
        >
          {marqueeCards}
        </HorizontalMarquee>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards}</div>
      )}

      <MediaModal
        asset={modalAsset}
        assets={filtered}
        onClose={() => setModalAsset(null)}
        onNavigate={setModalAsset}
      />
    </>
  );
}
