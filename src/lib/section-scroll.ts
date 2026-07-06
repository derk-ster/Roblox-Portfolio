import {
  BACKGROUND_SECTIONS,
  type BackgroundSectionId,
} from "@/lib/background-sections";
import { getLayerIndexForSection } from "@/lib/section-layers";

/** Viewport anchor as a fraction of window height (matches nav highlight zone). */
const VIEWPORT_ANCHOR_RATIO = 0.38;

interface SectionAnchor {
  id: BackgroundSectionId;
  scrollCenter: number;
  layerIndex: number;
}

function getSectionAnchors(): SectionAnchor[] {
  return BACKGROUND_SECTIONS.flatMap((id) => {
    const el = document.getElementById(id);
    if (!el) return [];

    const rect = el.getBoundingClientRect();
    const scrollCenter = window.scrollY + rect.top + rect.height / 2;

    return [
      {
        id,
        scrollCenter,
        layerIndex: getLayerIndexForSection(id),
      },
    ];
  });
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Scroll-driven layer index (fractional) for smooth crossfades between section backdrops.
 * More reliable than IntersectionObserver when sections overlap during scroll.
 */
export function getScrollLayerIndex(): number {
  const anchor = window.scrollY + window.innerHeight * VIEWPORT_ANCHOR_RATIO;
  const sections = getSectionAnchors();

  if (sections.length === 0) return 0;
  if (sections.length === 1) return sections[0].layerIndex;

  if (anchor <= sections[0].scrollCenter) return sections[0].layerIndex;
  const last = sections[sections.length - 1];
  if (anchor >= last.scrollCenter) return last.layerIndex;

  for (let i = 0; i < sections.length - 1; i++) {
    const a = sections[i];
    const b = sections[i + 1];
    if (anchor >= a.scrollCenter && anchor <= b.scrollCenter) {
      const span = b.scrollCenter - a.scrollCenter;
      if (span <= 1) return b.layerIndex;
      const t = smoothstep((anchor - a.scrollCenter) / span);
      return a.layerIndex + (b.layerIndex - a.layerIndex) * t;
    }
  }

  return last.layerIndex;
}

/**
 * Discrete section id for nav / UI — section whose center is closest to the viewport anchor.
 */
export function getActiveSectionFromScroll(): BackgroundSectionId {
  const anchor = window.scrollY + window.innerHeight * VIEWPORT_ANCHOR_RATIO;
  const sections = getSectionAnchors();

  if (sections.length === 0) return "home";

  let best = sections[0];
  let bestDist = Math.abs(anchor - best.scrollCenter);

  for (let i = 1; i < sections.length; i++) {
    const dist = Math.abs(anchor - sections[i].scrollCenter);
    if (dist < bestDist) {
      bestDist = dist;
      best = sections[i];
    }
  }

  return best.id;
}
