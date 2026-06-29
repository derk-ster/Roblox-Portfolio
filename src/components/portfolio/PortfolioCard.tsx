"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  ExternalLink,
  Eye,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { AnimatedBorder } from "@/components/effects/AnimatedBorder";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

const categoryGlow: Record<PortfolioCategory, string> = {
  "best-work": "rgba(56, 189, 248, 0.1)",
  scripting: "rgba(56, 189, 248, 0.1)",
  animation: "rgba(139, 92, 246, 0.1)",
  vfx: "rgba(192, 132, 252, 0.1)",
  building: "rgba(249, 115, 22, 0.1)",
  modeling: "rgba(132, 204, 22, 0.1)",
  wip: "rgba(249, 115, 22, 0.08)",
};

interface PortfolioCardProps {
  asset: PortfolioAsset;
  index?: number;
  onViewDetails: (asset: PortfolioAsset) => void;
  onOpenMedia: (asset: PortfolioAsset) => void;
  variant?: "default" | "vfx" | "wip" | "modeling" | "building";
  isPlaceholder?: boolean;
}

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

  return (
    <button
      type="button"
      onClick={onClick}
      className="group/media relative aspect-video w-full overflow-hidden rounded-t-2xl bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
      aria-label={`Preview ${asset.title}`}
    >
      {!loaded && !error && <MediaLoadingSkeleton />}

      {asset.type === "video" && asset.thumbnail ? (
        <Image
          src={asset.thumbnail}
          alt={asset.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover/media:scale-105",
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : asset.type === "video" ? (
        <VideoPreview
          src={asset.src}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/media:scale-105"
          onReady={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <Image
          src={previewSrc}
          alt={asset.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover/media:scale-105",
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {asset.type === "video" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-4 backdrop-blur-sm border border-cyan/40 transition-transform group-hover/media:scale-110">
            <Play className="h-8 w-8 text-cyan fill-cyan" aria-hidden />
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel text-sm text-muted">
          Media unavailable
        </div>
      )}
    </button>
  );
}

export function PortfolioCard({
  asset,
  onViewDetails,
  onOpenMedia,
  variant = "default",
  isPlaceholder = false,
}: PortfolioCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <MouseGlow color={categoryGlow[asset.category]}>
        <AnimatedBorder
          glow={asset.featured || variant === "vfx"}
          accent={categoryAccent[asset.category]}
          className={cn(
            variant === "wip" && "opacity-95",
            isPlaceholder && "border-dashed"
          )}
        >
          <div className="rounded-2xl transition-transform duration-300 hover:-translate-y-0.5">
              <MediaPreview asset={asset} onClick={() => onOpenMedia(asset)} />

              <div className="p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={categoryBadgeVariant[asset.category]}>
                    {CATEGORY_LABELS[asset.category]}
                  </Badge>
                  {asset.status === "WIP" && <Badge variant="wip">WIP</Badge>}
                  {asset.featured && (
                    <Badge variant="cyan">Featured</Badge>
                  )}
                  {isPlaceholder && (
                    <Badge variant="default">Demo</Badge>
                  )}
                </div>

                <h3 className="text-base font-semibold text-text sm:text-lg">
                  {asset.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {asset.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {asset.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  {asset.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {asset.date}
                    </span>
                  )}
                  <span>{asset.status}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onViewDetails(asset)}
                    icon={<Eye className="h-4 w-4" aria-hidden />}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenMedia(asset)}
                    icon={<ExternalLink className="h-4 w-4" aria-hidden />}
                  >
                    Open Media
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedBorder>
      </MouseGlow>
    </motion.article>
  );
}
