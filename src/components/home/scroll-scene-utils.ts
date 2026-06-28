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

/** Scale at the far end of a fade-out / start of a fade-in. */
export const SCALE_MIN = 0.86;
export const SCALE_RANGE = 1 - SCALE_MIN;

/** Hold full opacity at the start of each scroll segment before crossfade begins. */
export const TRANSITION_HOLD = 0.12;

export interface PhaseLayerVisual {
  opacity: number;
  scale: number;
  active: boolean;
}

function smootherstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Eased progress through the crossfade portion of a segment (0 → 1). */
export function segmentEase(local: number): number {
  if (local <= TRANSITION_HOLD) return 0;
  if (local >= 1) return 1;
  return smootherstep((local - TRANSITION_HOLD) / (1 - TRANSITION_HOLD));
}

/** Continuous scroll position mapped to phase indices (0 … phaseCount − 1). */
export function getPhasePosition(global: number, phaseCount: number): number {
  if (phaseCount <= 1) return 0;
  return global * (phaseCount - 1);
}

/**
 * Per-phase opacity + scale driven only by scroll position.
 * Outgoing: fade out + scale down. Incoming: fade in + scale up.
 * No discrete role swapping — eliminates boundary snaps.
 */
export function getPhaseLayerVisual(
  slot: number,
  global: number,
  phaseCount: number
): PhaseLayerVisual {
  if (phaseCount <= 1) {
    return { opacity: slot === 0 ? 1 : 0, scale: 1, active: slot === 0 };
  }

  const last = phaseCount - 1;
  const p = getPhasePosition(global, phaseCount);

  if (p <= slot - 1 || p >= slot + 1) {
    return { opacity: 0, scale: SCALE_MIN, active: false };
  }

  if (slot === 0 && p < TRANSITION_HOLD * 0.25) {
    return { opacity: 1, scale: 1, active: true };
  }

  if (slot === last && p >= last - TRANSITION_HOLD * 0.25) {
    return { opacity: 1, scale: 1, active: true };
  }

  // Incoming — scroll entering this phase from the one above.
  if (p <= slot) {
    if (slot === 0) {
      return { opacity: 1, scale: 1, active: true };
    }
    const local = p - (slot - 1);
    const t = segmentEase(local);
    return {
      opacity: t,
      scale: SCALE_MIN + t * SCALE_RANGE,
      active: t > 0.002,
    };
  }

  // Outgoing — scroll leaving this phase toward the next.
  const local = p - slot;
  const t = segmentEase(local);
  return {
    opacity: 1 - t,
    scale: 1 - t * SCALE_RANGE,
    active: 1 - t > 0.002,
  };
}

/** Internal 3D animation progress for a given phase slot. */
export function getPhaseLocalProgress(
  global: number,
  phaseIndex: number,
  phaseCount: number
): number {
  if (phaseCount <= 1) return global;
  const p = getPhasePosition(global, phaseCount);
  return Math.max(0, Math.min(1, p - phaseIndex + 0.48));
}

/** Pre-mount phases slightly before they become visible. */
export function getSlotsToMount(
  global: number,
  phaseCount: number
): Set<number> {
  const slots = new Set<number>();
  const p = getPhasePosition(global, phaseCount);
  const lead = 0.35;

  for (let slot = 0; slot < phaseCount; slot++) {
    if (p >= slot - 1 - lead && p <= slot + 1 + lead) {
      slots.add(slot);
    }
  }

  if (slots.size === 0) slots.add(0);
  return slots;
}

export function formatLayerTransform(scale: number): string {
  return `translate3d(0, 0, 0) scale(${scale})`;
}
