"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import {
  SceneInteractionProvider,
  useSceneInteraction,
} from "./scene-context";
import { PhaseScrollProvider } from "./phase-scroll-context";
import {
  formatLayerTransform,
  dampScrollProgress,
  getPhaseLayerVisual,
  getPhasePosition,
  getScrollProgress,
} from "./scroll-scene-utils";
import { SceneLoadingFallback } from "./SceneLoadingFallback";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: SceneLoadingFallback,
});

const Hero3DPhase2 = dynamic(
  () => import("./Hero3DPhase2").then((m) => m.Hero3DPhase2),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DPhase3 = dynamic(
  () => import("./Hero3DPhase3").then((m) => m.Hero3DPhase3),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DPhase4 = dynamic(
  () => import("./Hero3DPhase4").then((m) => m.Hero3DPhase4),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DPhase5 = dynamic(
  () => import("./Hero3DPhase5").then((m) => m.Hero3DPhase5),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DPhase6 = dynamic(
  () => import("./Hero3DPhase6").then((m) => m.Hero3DPhase6),
  { ssr: false, loading: SceneLoadingFallback }
);

const ALL_PHASES: ComponentType[] = [
  Hero3D,
  Hero3DPhase2,
  Hero3DPhase3,
  Hero3DPhase4,
  Hero3DPhase5,
  Hero3DPhase6,
];

const MOBILE_COMPONENT_INDICES = [0, 1, 3, 4, 5];

function slotsToMount(progress: number, phaseCount: number): number[] {
  const p = getPhasePosition(progress, phaseCount);
  const lo = Math.max(0, Math.floor(p));
  const hi = Math.min(phaseCount - 1, Math.ceil(p));
  return lo === hi ? [lo] : [lo, hi];
}

function sameSlots(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}

function ScrollSceneCanvas() {
  const {
    mouseRef,
    scrollRef,
    phaseCountRef,
    layerOpacityRef,
    notifyLayerVisibility,
  } = useSceneInteraction();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const componentIndices = isMobile
    ? MOBILE_COMPONENT_INDICES
    : ALL_PHASES.map((_, i) => i);
  const phaseCount = componentIndices.length;

  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smoothScrollRef = useRef(0);
  const lastFrameRef = useRef(0);
  const layerActiveRef = useRef<boolean[]>([]);
  const mountedRef = useRef<number[]>([0]);
  const [mountedSlots, setMountedSlots] = useState<number[]>([0]);

  useEffect(() => {
    phaseCountRef.current = phaseCount;
  }, [phaseCount, phaseCountRef]);

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseRef]);

  useEffect(() => {
    if (reducedMotion) {
      scrollRef.current = 0;
      smoothScrollRef.current = 0;
      return;
    }

    let raf = 0;
    let cancelled = false;

    const syncMounted = (progress: number) => {
      const next = slotsToMount(progress, phaseCount);
      if (sameSlots(mountedRef.current, next)) return;
      mountedRef.current = next;
      if (!cancelled) setMountedSlots(next);
    };

    const update = (now: number) => {
      const delta = lastFrameRef.current
        ? Math.min(0.05, (now - lastFrameRef.current) / 1000)
        : 1 / 60;
      lastFrameRef.current = now;

      const target = getScrollProgress();
      const progress = dampScrollProgress(
        smoothScrollRef.current,
        target,
        delta
      );
      smoothScrollRef.current = progress;
      scrollRef.current = progress;
      syncMounted(progress);

      let visibilityChanged = false;

      for (let slot = 0; slot < phaseCount; slot++) {
        const el = layerRefs.current[slot];
        const visual = getPhaseLayerVisual(slot, progress, phaseCount);
        layerOpacityRef.current[slot] = visual.opacity;

        const wasActive = layerActiveRef.current[slot] ?? false;
        if (wasActive !== visual.active) {
          layerActiveRef.current[slot] = visual.active;
          visibilityChanged = true;
        }

        if (!el) continue;

        el.style.opacity = String(visual.opacity);
        el.style.visibility = visual.active ? "visible" : "hidden";
      }

      if (visibilityChanged) {
        notifyLayerVisibility();
      }

      if (Math.abs(progress - target) > 0.0002) {
        raf = requestAnimationFrame(update);
      } else {
        raf = 0;
        lastFrameRef.current = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [
    reducedMotion,
    scrollRef,
    phaseCount,
    layerOpacityRef,
    notifyLayerVisibility,
  ]);

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-purple/5 to-bg" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-bg" />
      {componentIndices.map((componentIndex, slot) => {
        const Component = ALL_PHASES[componentIndex];
        const mounted = mountedSlots.includes(slot);

        return (
          <div
            key={slot}
            ref={(el) => {
              layerRefs.current[slot] = el;
              if (!el) return;
              const visual = getPhaseLayerVisual(
                slot,
                scrollRef.current ?? 0,
                phaseCount
              );
              layerOpacityRef.current[slot] = visual.opacity;
              el.style.opacity = String(visual.opacity);
              el.style.transform = formatLayerTransform();
              el.style.visibility = visual.active ? "visible" : "hidden";
            }}
            className="absolute inset-0 origin-center"
            style={{
              opacity: slot === 0 ? 1 : 0,
              transform: formatLayerTransform(),
              visibility: slot === 0 ? "visible" : "hidden",
            }}
          >
            {mounted ? (
              <PhaseScrollProvider index={slot}>
                <Component />
              </PhaseScrollProvider>
            ) : null}
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-bg/75 to-transparent" />
    </div>
  );
}

/** Fixed 3D scroll backdrop — load client-only from the page (see page.tsx). */
export function ScrollSceneBackdrop() {
  return (
    <SceneInteractionProvider>
      <ScrollSceneCanvas />
    </SceneInteractionProvider>
  );
}
