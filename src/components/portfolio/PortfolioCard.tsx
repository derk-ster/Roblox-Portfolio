"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, ExternalLink, Eye } from "lucide-react";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { MediaLoadingSkeleton } from "@/components/ui/MediaLoadingSkeleton";
import { cn } from "@/lib/utils";
import { VideoPreview } from "@/components/portfolio/VideoPreview";
import {
  CATEGORY_LABELS,
  type PortfolioAsset,
  type PortfolioCategory,
} from "@/types/portfolio";

const categoryAccent: Record<PortfolioCategory, "cyan" | "purple" | "pink" | "orange" | "lime"> = {
  "best-work": "cyan",
  scripting: "cyan",
  animation: "purple",
  vfx: "pink",
  building: "orange",
  modeling: "lime",
  wip: "orange",
};

const categoryBadgeVariant: Record<
  PortfolioCategory,
  "cyan" | "purple" | "pink" | "orange" | "lime" | "wip" | "default"
> = {
  "best-work": "cyan",
  scripting: "cyan",
  animation: "purple",
  vfx: "pink",
  building: "orange",
  modeling: "lime",
  wip: "wip",
};

function getRole(asset: PortfolioAsset): string {
  const label = CATEGORY_LABELS[asset.category];
  if (asset.category === "animation") return "Animator · Blender · R6";
  if (asset.category === "scripting") return "Roblox Scripter · Luau";
  if (asset.category === "vfx") return "VFX Artist";
  return `Roblox ${label}`;
}

interface PortfolioCardProps {
  asset: PortfolioAsset;
  index?: number;
  onViewDetails: (asset: PortfolioAsset) => void;
  onOpenMedia: (asset: PortfolioAsset) => void;
  variant?: "default" | "vfx" | "wip" | "modeling" | "building";
  isPlaceholder?: boolean;
  compact?: boolean;
}

function MediaPreview({
  asset,
  onClick,
}: {
  asset: PortfolioAsset;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const previewSrc = asset.thumbnail || asset.src;
  const isVideo = asset.type === "video";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group/media relative aspect-video w-full overflow-hidden rounded-t-2xl bg-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50"
      aria-label={`${isVideo ? "Play" : "Open"} ${asset.title}`}
    >
      {!loaded && !error && <MediaLoadingSkeleton />}

      {isVideo && asset.thumbnail ? (
        <Image
          src={asset.thumbnail}
          alt={asset.title}
          fill
          className={cn("object-cover", loaded ? "opacity-100" : "opacity-0")}
          sizes="(max-width: 768px) 100vw, 20rem"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : isVideo ? (
        <VideoPreview
          src={asset.src}
          className="h-full w-full object-cover"
          onReady={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <Image
          src={previewSrc}
          alt={asset.title}
          fill
          className={cn("object-cover", loaded ? "opacity-100" : "opacity-0")}
          sizes="(max-width: 768px) 100vw, 20rem"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--panel)] text-sm text-[var(--muted)]">
          Media unavailable
        </div>
      )}
    </button>
  );
}

export function PortfolioCard({
  asset,
  index = 0,
  onViewDetails,
  onOpenMedia,
  variant = "default",
  isPlaceholder = false,
  compact = false,
}: PortfolioCardProps) {
  const showDate = asset.type === "video" ? Boolean(asset.date) : Boolean(asset.date);
  const tagLimit = compact ? 3 : 5;

  const card = (
    <AnimatedBorder
      glow={asset.featured || variant === "vfx"}
      accent={categoryAccent[asset.category]}
      className={cn(
        "h-full",
        variant === "wip" && "opacity-95",
        isPlaceholder && "border-dashed"
      )}
    >
      <div className="flex h-full flex-col">
        <MediaPreview asset={asset} onClick={() => onOpenMedia(asset)} />

        <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-5 sm:p-6")}>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge variant={categoryBadgeVariant[asset.category]}>
              {CATEGORY_LABELS[asset.category]}
            </Badge>
            {asset.status === "WIP" && <Badge variant="wip">WIP</Badge>}
            {asset.featured && <Badge variant="cyan">Featured</Badge>}
            {isPlaceholder && <Badge variant="default">Demo</Badge>}
          </div>

          <h3
            className={cn(
              "font-semibold text-[var(--text)]",
              compact ? "text-sm leading-snug" : "text-base sm:text-lg"
            )}
          >
            {asset.title}
          </h3>

          <p className="mt-1 text-xs text-[var(--muted)]">{getRole(asset)}</p>

          <p
            className={cn(
              "mt-2 text-sm leading-relaxed text-[var(--muted)]",
              compact ? "line-clamp-2" : "line-clamp-2"
            )}
          >
            {asset.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {asset.tags.slice(0, tagLimit).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--border)] bg-white/[0.04] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 text-xs text-[var(--muted)]">
            {showDate ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {asset.date}
              </span>
            ) : (
              <span />
            )}
            <span>{asset.status}</span>
          </div>

          <div className={cn("flex flex-wrap gap-2", compact ? "mt-3" : "mt-4")}>
            <button
              type="button"
              onClick={() => onViewDetails(asset)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] sm:text-sm"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              Details
            </button>
            <button
              type="button"
              onClick={() => onOpenMedia(asset)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_25%,transparent)] hover:bg-white/[0.03] sm:text-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              Open
            </button>
          </div>
        </div>
      </div>
    </AnimatedBorder>
  );

  if (compact) {
    return <article className="h-full">{card}</article>;
  }

  return (
    <ScrollReveal delay={index * 0.05} as="article">
      {card}
    </ScrollReveal>
  );
}
