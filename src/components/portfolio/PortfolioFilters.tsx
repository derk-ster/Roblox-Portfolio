"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { filterAssets, getUniqueTags } from "@/lib/assets";
import type { FilterType, PortfolioAsset } from "@/types/portfolio";

interface PortfolioFiltersProps {
  assets: PortfolioAsset[];
  onFilterChange: (filtered: PortfolioAsset[]) => void;
  extraTags?: string[];
  className?: string;
}

const BASE_FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "completed", label: "Completed" },
  { id: "wip", label: "WIP" },
];

export function PortfolioFilters({
  assets,
  onFilterChange,
  extraTags = [],
  className,
}: PortfolioFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeTag, setActiveTag] = useState("all");

  const tags = useMemo(() => {
    const assetTags = getUniqueTags(assets);
    const combined = new Set([...extraTags, ...assetTags]);
    return Array.from(combined).sort();
  }, [assets, extraTags]);

  const applyFilters = (filter: FilterType, tag: string) => {
    const filtered = filterAssets(assets, filter, tag);
    onFilterChange(filtered);
  };

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    applyFilters(filter, activeTag);
  };

  const handleTag = (tag: string) => {
    setActiveTag(tag);
    applyFilters(activeFilter, tag);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Media type filters"
      >
        {BASE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === f.id}
            onClick={() => handleFilter(f.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              activeFilter === f.id
                ? "border-cyan/30 bg-cyan/10 text-cyan"
                : "border-white/8 bg-white/[0.03] text-muted hover:border-white/15 hover:text-text"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div
          className="flex flex-wrap gap-2 scrollbar-thin overflow-x-auto pb-1"
          role="tablist"
          aria-label="Tag filters"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTag === "all"}
            onClick={() => handleTag("all")}
            className={cn(
              "shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              activeTag === "all"
                ? "border-purple/30 bg-purple/10 text-purple"
                : "border-white/8 text-muted hover:text-text"
            )}
          >
            All Tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={activeTag === tag}
              onClick={() => handleTag(tag)}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                activeTag === tag
                  ? "border-purple/30 bg-purple/10 text-purple"
                  : "border-white/8 text-muted hover:text-text"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
