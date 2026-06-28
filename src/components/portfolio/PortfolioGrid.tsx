"use client";

import { useCallback, useState } from "react";
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
  columns?: "default" | "large" | "grid-3d";
}

export function PortfolioGrid({
  assets,
  categoryLabel,
  folderPath,
  extraTags = [],
  variant = "default",
  showFilters = true,
  columns = "default",
}: PortfolioGridProps) {
  const [filtered, setFiltered] = useState(assets);
  const [modalAsset, setModalAsset] = useState<PortfolioAsset | null>(null);

  const handleFilterChange = useCallback((filteredAssets: PortfolioAsset[]) => {
    setFiltered(filteredAssets);
  }, []);

  const gridClass =
    columns === "large"
      ? "grid gap-5 sm:grid-cols-1 lg:grid-cols-2"
      : columns === "grid-3d"
        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  if (assets.length === 0) {
    return <EmptyState category={categoryLabel} folderPath={folderPath} />;
  }

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
        <p className="text-center text-muted py-12">
          No items match the current filters.
        </p>
      ) : (
        <div className={gridClass}>
          {filtered.map((asset, i) => (
            <PortfolioCard
              key={asset.id}
              asset={asset}
              index={i}
              variant={variant}
              isPlaceholder={asset.id.startsWith("placeholder-")}
              onViewDetails={setModalAsset}
              onOpenMedia={setModalAsset}
            />
          ))}
        </div>
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
