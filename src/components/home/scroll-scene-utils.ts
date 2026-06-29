import * as THREE from "three";

export const DESKTOP_PHASE_COUNT = 6;
export const MOBILE_PHASE_COUNT = 5;

export function getPhaseCount(isMobile: boolean): number {
  return isMobile ? MOBILE_PHASE_COUNT : DESKTOP_PHASE_COUNT;
}

export function getMaxScroll(): number {
  return Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

export function getScrollProgress(): number {
  return Math.min(1, Math.max(0, window.scrollY / getMaxScroll()));
}

/** Frame-rate-independent smoothing for scroll-linked motion. */
export function dampScrollProgress(
  current: number,
  target: number,
  delta: number,
  smoothing = 14
): number {
  return THREE.MathUtils.damp(current, target, smoothing, delta);
}

export interface PhaseLayerVisual {
  opacity: number;
  scale: number;
  active: boolean;
}

function smootherstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Continuous scroll position mapped to phase indices (0 … phaseCount − 1). */
export function getPhasePosition(global: number, phaseCount: number): number {
  if (phaseCount <= 1) return 0;
  return global * (phaseCount - 1);
}

/**
 * Symmetric crossfade between adjacent phases — opacity only (no scale jumps).
 * At phase center opacity is 1; fades to 0 one segment away in either direction.
 */
export function getPhaseLayerVisual(
  slot: number,
  global: number,
  phaseCount: number
): PhaseLayerVisual {
  if (phaseCount <= 1) {
    return { opacity: slot === 0 ? 1 : 0, scale: 1, active: slot === 0 };
  }

  const p = getPhasePosition(global, phaseCount);
  const dist = Math.abs(p - slot);

  if (dist >= 1) {
    return { opacity: 0, scale: 1, active: false };
  }

  const opacity = smootherstep(1 - dist);
  return { opacity, scale: 1, active: opacity > 0.008 };
}

/** Internal 3D animation progress aligned to each phase scroll segment. */
export function getPhaseLocalProgress(
  global: number,
  phaseIndex: number,
  phaseCount: number
): number {
  if (phaseCount <= 1) return global;
  const p = getPhasePosition(global, phaseCount);
  return Math.max(0, Math.min(1, p - phaseIndex));
}

export function formatLayerTransform(): string {
  return "translate3d(0, 0, 0)";
}
