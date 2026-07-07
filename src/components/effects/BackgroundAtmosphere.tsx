"use client";

import { useReducedMotion } from "motion/react";

/** Lightweight static backdrop — no animated layers. */
export function BackgroundAtmosphere() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <div className="mouse-glow-bg" />
      <div className="atmo-grid" />
    </div>
  );
}
