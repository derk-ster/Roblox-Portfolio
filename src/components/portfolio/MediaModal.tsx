"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { MediaLoadingSkeleton } from "@/components/ui/MediaLoadingSkeleton";
import { DISCORD_URL } from "@/lib/constants";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  CATEGORY_LABELS,
  type PortfolioAsset,
} from "@/types/portfolio";
import { cn } from "@/lib/utils";

const categoryBadgeVariant: Record<
  PortfolioAsset["category"],
  "cyan" | "purple" | "pink" | "orange" | "lime" | "wip"
> = {
  "best-work": "cyan",
  scripting: "cyan",
  animation: "purple",
  vfx: "pink",
  building: "orange",
  modeling: "lime",
  wip: "wip",
  certifications: "cyan",
};

function getRole(asset: PortfolioAsset): string {
  if (asset.category === "animation") return "Animator · Blender · R6";
  if (asset.category === "scripting") return "Roblox Scripter · Luau";
  if (asset.category === "vfx") return "VFX Artist";
  if (asset.category === "building") return "Builder · Map Design";
  if (asset.category === "modeling") return "3D Modeler · Blender";
  return CATEGORY_LABELS[asset.category];
}

interface MediaModalProps {
  asset: PortfolioAsset | null;
  assets: PortfolioAsset[];
  onClose: () => void;
  onNavigate: (asset: PortfolioAsset) => void;
}

export function MediaModal({
  asset,
  assets,
  onClose,
  onNavigate,
}: MediaModalProps) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIndex = asset
    ? assets.findIndex((a) => a.id === asset.id)
    : -1;

  const safeIndex =
    currentIndex >= 0 ? currentIndex : assets.length > 0 ? 0 : -1;

  const goPrev = useCallback(() => {
    if (assets.length <= 1 || safeIndex < 0) return;
    const nextIndex = (safeIndex - 1 + assets.length) % assets.length;
    onNavigate(assets[nextIndex]);
  }, [assets, onNavigate, safeIndex]);

  const goNext = useCallback(() => {
    if (assets.length <= 1 || safeIndex < 0) return;
    const nextIndex = (safeIndex + 1) % assets.length;
    onNavigate(assets[nextIndex]);
  }, [assets, onNavigate, safeIndex]);

  useEffect(() => {
    if (!asset) return;

    setLoaded(false);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [asset, onClose, goPrev, goNext]);

  useEffect(() => {
    if (!asset || asset.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    setLoaded(false);
    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        /* autoplay may be blocked until user interacts */
      });
    }
  }, [asset]);

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={asset.title}
        >
          <div
            className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[0_0_60px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-bg/80 p-2 text-muted backdrop-blur-sm transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex min-h-[40vh] flex-1 overflow-hidden bg-bg">
              {!loaded && <MediaLoadingSkeleton />}

              {asset.type === "video" ? (
                <>
                  {asset.thumbnail && !loaded && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.thumbnail}
                      alt=""
                      className="absolute inset-0 max-h-[60vh] w-full object-contain opacity-100"
                    />
                  )}
                  <video
                    ref={videoRef}
                    key={asset.id}
                    src={resolveMediaUrl(asset.src)}
                    className={cn(
                      "max-h-[60vh] w-full object-contain transition-opacity duration-300",
                      loaded ? "opacity-100" : "opacity-0"
                    )}
                    controls
                    autoPlay
                    playsInline
                    poster={asset.thumbnail}
                    onLoadedData={() => setLoaded(true)}
                    onCanPlay={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                  />
                </>
              ) : (
                <div className="relative flex min-h-[40vh] w-full items-center justify-center">
                  <Image
                    key={asset.id}
                    src={asset.src}
                    alt={asset.title}
                    width={1920}
                    height={1080}
                    className="max-h-[60vh] w-auto object-contain"
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                    priority
                  />
                </div>
              )}

              {assets.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label="Next item"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-[var(--border)] p-6">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant={categoryBadgeVariant[asset.category]}>
                  {CATEGORY_LABELS[asset.category]}
                </Badge>
                {asset.status === "WIP" && <Badge variant="wip">WIP</Badge>}
                {asset.featured && <Badge variant="purple">Featured</Badge>}
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">{asset.title}</h3>
              <p className="mt-1 text-sm font-medium text-[var(--primary)]">
                {getRole(asset)}
              </p>
              <p className="mt-3 leading-relaxed text-[var(--muted)]">
                {asset.description}
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Tools used
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[var(--border)] bg-white/[0.04] px-2.5 py-1 text-xs text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  Commission on Discord →
                </a>
              </div>

              {(asset.date || asset.type === "video") && (
                <p className="mt-4 flex items-center gap-1.5 text-sm text-[var(--muted)]">
                  <span className="font-medium text-[var(--text)]">Posted</span>
                  {asset.date ?? "—"}
                </p>
              )}
              {assets.length > 1 && safeIndex >= 0 && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {safeIndex + 1} of {assets.length}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
