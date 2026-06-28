"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  src: string;
  poster?: string;
  className?: string;
  onReady?: () => void;
  onError?: () => void;
}

export function VideoPreview({
  src,
  poster,
  className,
  onReady,
  onError,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frameReady, setFrameReady] = useState(Boolean(poster));

  const markReady = useCallback(() => {
    setFrameReady(true);
    onReady?.();
  }, [onReady]);

  const primeFirstFrame = useCallback(
    (video: HTMLVideoElement) => {
      video.pause();

      const seekTarget =
        Number.isFinite(video.duration) && video.duration > 0
          ? Math.min(0.1, video.duration * 0.01)
          : 0.01;

      if (Math.abs(video.currentTime - seekTarget) < 0.001) {
        markReady();
        return;
      }

      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        markReady();
      };

      video.addEventListener("seeked", onSeeked);
      try {
        video.currentTime = seekTarget;
      } catch {
        markReady();
      }
    },
    [markReady]
  );

  useEffect(() => {
    setFrameReady(Boolean(poster));
  }, [src, poster]);

  useEffect(() => {
    const fallback = window.setTimeout(() => markReady(), 5000);
    return () => window.clearTimeout(fallback);
  }, [src, markReady]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      poster={poster}
      className={cn(className, frameReady ? "opacity-100" : "opacity-0")}
      muted
      playsInline
      preload="auto"
      onLoadedData={(event) => primeFirstFrame(event.currentTarget)}
      onError={onError}
    />
  );
}
