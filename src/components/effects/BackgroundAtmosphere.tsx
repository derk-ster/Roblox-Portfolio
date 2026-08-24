"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { usePageVisible } from "@/lib/use-page-visible";

/** Lightweight static backdrop — glow follows the pointer without a custom cursor. */
export function BackgroundAtmosphere() {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !pageVisible) return;
    const glow = glowRef.current;
    if (!glow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      glow.style.translate = `${event.clientX.toFixed(1)}px ${event.clientY.toFixed(1)}px`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, pageVisible]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <div ref={glowRef} className="mouse-glow-bg" />
      <div className="atmo-grid" />
    </div>
  );
}
