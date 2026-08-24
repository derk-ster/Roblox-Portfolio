"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface HorizontalMarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds to complete one loop of the first track */
  durationSeconds?: number;
  showScrubber?: boolean;
}

function EdgeFades() {
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent sm:w-12" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent sm:w-12" />
    </>
  );
}

function cloneWithKeys(nodes: ReactNode[], pass: number): ReactNode[] {
  return Children.toArray(nodes).map((child, index) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ "aria-hidden"?: boolean }>;
    return cloneElement(el, {
      key: `${el.key ?? index}-marquee-${pass}`,
      ...(pass > 0 ? { "aria-hidden": true } : {}),
    });
  });
}

function buildTrack(nodes: ReactNode[], repeatCount: number): ReactNode[] {
  const items: ReactNode[] = [];
  for (let pass = 0; pass < repeatCount; pass++) {
    items.push(...cloneWithKeys(nodes, pass));
  }
  return items;
}

export function HorizontalMarquee({
  children,
  className,
  durationSeconds = 60,
  showScrubber = true,
}: HorizontalMarqueeProps) {
  const reducedMotion = useReducedMotion();
  const scrubId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const isDraggingRef = useRef(false);
  const inViewRef = useRef(false);

  const childNodes = Children.toArray(children);
  const [repeatCount, setRepeatCount] = useState(1);
  const [canScroll, setCanScroll] = useState(false);
  const [inView, setInView] = useState(false);

  const measureOverflow = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || childNodes.length === 0) return;

    const containerWidth = container.clientWidth;
    const trackWidth = track.scrollWidth;
    const overflow = trackWidth > containerWidth + 2;

    setCanScroll(overflow);

    if (!overflow && repeatCount < 4) {
      setRepeatCount((count) => count + 1);
    }
  }, [childNodes.length, repeatCount]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        inViewRef.current = visible;
        setInView(visible);

        const animation = animationRef.current;
        if (!animation) return;
        if (visible) animation.play();
        else animation.pause();
      },
      { rootMargin: "240px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    measureOverflow();
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(container);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measureOverflow, children, repeatCount]);

  useEffect(() => {
    const el = animRef.current;
    const track = trackRef.current;
    if (!el || !track || !canScroll || reducedMotion) return;

    const loopWidth = track.scrollWidth;
    if (loopWidth <= 0) return;

    const durationMs = durationSeconds * 1000;
    animationRef.current?.cancel();

    const animation = el.animate(
      [
        { transform: "translateX(0px)" },
        { transform: `translateX(-${loopWidth}px)` },
      ],
      {
        duration: durationMs,
        iterations: Infinity,
        easing: "linear",
      }
    );

    if (!inViewRef.current) animation.pause();
    animationRef.current = animation;

    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [canScroll, reducedMotion, durationSeconds, repeatCount]);

  useEffect(() => {
    if (!showScrubber || !inView || !canScroll || reducedMotion) return;

    const durationMs = durationSeconds * 1000;
    let raf = 0;
    let frame = 0;

    const syncScrubber = () => {
      frame += 1;
      const animation = animationRef.current;
      const scrub = scrubRef.current;
      if (
        animation &&
        scrub &&
        !isDraggingRef.current &&
        animation.playState === "running" &&
        frame % 4 === 0
      ) {
        const time = Number(animation.currentTime ?? 0);
        const progress = ((time % durationMs) / durationMs) * 100;
        scrub.value = String(progress);
      }
      raf = requestAnimationFrame(syncScrubber);
    };

    raf = requestAnimationFrame(syncScrubber);
    return () => cancelAnimationFrame(raf);
  }, [showScrubber, inView, canScroll, reducedMotion, durationSeconds]);

  const handleScrub = (value: number) => {
    const animation = animationRef.current;
    if (!animation) return;

    const durationMs = durationSeconds * 1000;
    animation.currentTime = (value / 100) * durationMs;
  };

  const handleScrubEnd = () => {
    isDraggingRef.current = false;
    if (inViewRef.current) animationRef.current?.play();
  };

  const trackItems = buildTrack(childNodes, repeatCount);
  const animating = canScroll && !reducedMotion && inView;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <EdgeFades />

      <div
        className={cn(
          "overflow-hidden",
          reducedMotion && canScroll && "overflow-x-auto overflow-y-hidden scrollbar-thin"
        )}
      >
        <div
          ref={animRef}
          className={cn("flex w-max", animating && "will-change-transform")}
        >
          <div
            ref={trackRef}
            className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
          >
            {trackItems}
          </div>
          <div
            className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
            aria-hidden
          >
            {trackItems}
          </div>
        </div>
      </div>

      {showScrubber && canScroll && !reducedMotion && (
        <div className="mt-4 px-1">
          <label className="sr-only" htmlFor={scrubId}>
            Scroll carousel
          </label>
          <input
            id={scrubId}
            ref={scrubRef}
            type="range"
            min={0}
            max={100}
            step={0.1}
            defaultValue={0}
            onChange={(e) => handleScrub(Number(e.target.value))}
            onPointerDown={() => {
              isDraggingRef.current = true;
              animationRef.current?.pause();
            }}
            onPointerUp={handleScrubEnd}
            onPointerCancel={handleScrubEnd}
            className="marquee-scrubber w-full"
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  );
}
