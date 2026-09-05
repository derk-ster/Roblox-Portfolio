"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { MediaLoadingSkeleton } from "@/components/ui/MediaLoadingSkeleton";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { VideoPlayOverlay } from "@/components/portfolio/VideoPlayOverlay";
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

async function tryPlay(video: HTMLVideoElement, withSound: boolean) {
  video.muted = !withSound;
  try {
    await video.play();
    if (withSound) {
      video.muted = false;
    }
    return true;
  } catch {
    if (withSound) {
      video.muted = true;
      try {
        await video.play();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function MediaModal({
  asset,
  assets,
  onClose,
  onNavigate,
}: MediaModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsPlayGesture, setNeedsPlayGesture] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAttemptId = useRef(0);

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
    setIsPlaying(false);
    setNeedsPlayGesture(false);

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

  const startPlayback = useCallback(async (preferSound: boolean) => {
    const video = videoRef.current;
    if (!video) return;

    const attempt = ++playAttemptId.current;
    const played = await tryPlay(video, preferSound);
    if (attempt !== playAttemptId.current) return;

    if (played) {
      setIsPlaying(true);
      setNeedsPlayGesture(false);
      setLoaded(true);
    } else {
      setIsPlaying(false);
      setNeedsPlayGesture(true);
      setLoaded(true);
    }
  }, []);

  const handleManualPlay = useCallback(() => {
    void startPlayback(true);
  }, [startPlayback]);

  useEffect(() => {
    if (!asset || asset.type !== "video") return;

    let cancelled = false;
    let raf = 0;
    let onReady: (() => void) | null = null;
    const attempt = ++playAttemptId.current;

    const kickOff = () => {
      if (cancelled || attempt !== playAttemptId.current) return;
      void startPlayback(true);
    };

    const waitForVideo = () => {
      if (cancelled || attempt !== playAttemptId.current) return;

      const video = videoRef.current;
      if (!video) {
        raf = requestAnimationFrame(waitForVideo);
        return;
      }

      // Browser autoplay policies block unmuted play() outside the click
      // gesture. Wait until the element can play, then try sound → muted.
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        kickOff();
        return;
      }

      onReady = () => {
        if (!onReady) return;
        video.removeEventListener("canplay", onReady);
        onReady = null;
        kickOff();
      };
      video.addEventListener("canplay", onReady);
      video.load();
    };

    waitForVideo();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (onReady && videoRef.current) {
        videoRef.current.removeEventListener("canplay", onReady);
      }
    };
  }, [asset, startPlayback]);

  return (
    <ModalPortal>
      <AnimatePresence>
        {asset && (
          <motion.div
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
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
            className="relative z-10 flex max-h-[min(85vh,40rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[0_0_60px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
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

            <div className="relative flex min-h-[20vh] flex-1 overflow-hidden bg-bg">
              {!loaded && <MediaLoadingSkeleton />}

              {asset.type === "video" ? (
                <>
                  {asset.thumbnail && !loaded && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.thumbnail}
                      alt=""
                      className="absolute inset-0 max-h-[45vh] w-full object-contain opacity-100"
                    />
                  )}
                  <video
                    ref={videoRef}
                    key={asset.id}
                    className={cn(
                      "max-h-[45vh] w-full object-contain transition-opacity duration-300",
                      loaded ? "opacity-100" : "opacity-0"
                    )}
                    controls
                    playsInline
                    preload="auto"
                    poster={asset.thumbnail}
                    onLoadedData={() => setLoaded(true)}
                    onCanPlay={() => setLoaded(true)}
                    onPlay={() => {
                      setIsPlaying(true);
                      setNeedsPlayGesture(false);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => {
                      setLoaded(true);
                      setNeedsPlayGesture(false);
                    }}
                  >
                    <source
                      src={resolveMediaUrl(asset.src)}
                      type={`video/${asset.extension === "mov" ? "quicktime" : asset.extension}`}
                    />
                  </video>
                  {needsPlayGesture && !isPlaying && (
                    <button
                      type="button"
                      onClick={handleManualPlay}
                      className="absolute inset-0 z-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                      aria-label={`Play ${asset.title}`}
                    >
                      <VideoPlayOverlay />
                    </button>
                  )}
                </>
              ) : (
                <div className="relative flex min-h-[20vh] w-full items-center justify-center">
                  <Image
                    key={asset.id}
                    src={asset.src}
                    alt={asset.title}
                    width={1920}
                    height={1080}
                    className="max-h-[45vh] w-auto object-contain"
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
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-text backdrop-blur-sm transition-colors hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label="Next item"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-[var(--border)] p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant={categoryBadgeVariant[asset.category]}>
                  {CATEGORY_LABELS[asset.category]}
                </Badge>
                {asset.status === "WIP" && <Badge variant="wip">WIP</Badge>}
                {asset.featured && <Badge variant="purple">Featured</Badge>}
              </div>
              <h3 className="text-xl font-bold text-[var(--text)]">{asset.title}</h3>
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
                  {asset.date ?? "N/A"}
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
    </ModalPortal>
  );
}
