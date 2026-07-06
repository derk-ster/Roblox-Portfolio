"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import {
  SceneInteractionProvider,
  useSceneInteraction,
} from "./scene-context";
import { PhaseScrollProvider } from "./usePhaseScroll";
import {
  formatLayerTransform,
  dampScrollProgress,
  getSectionLayerVisual,
} from "./scroll-scene-utils";
import { getScrollLayerIndex } from "@/lib/section-scroll";
import { SceneLoadingFallback } from "./SceneLoadingFallback";
import {
  BACKGROUND_LAYERS,
  type BackgroundSceneId,
  type SceneComponentMap,
} from "@/lib/section-layers";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: SceneLoadingFallback,
});

const Hero3DPhase2 = dynamic(
  () => import("./Hero3DPhase2").then((m) => m.Hero3DPhase2),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DScripting = dynamic(
  () => import("./Hero3DScripting").then((m) => m.Hero3DScripting),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DAnimation = dynamic(
  () => import("./Hero3DAnimation").then((m) => m.Hero3DAnimation),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DWorkWithMe = dynamic(
  () => import("./Hero3DWorkWithMe").then((m) => m.Hero3DWorkWithMe),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DVfx = dynamic(
  () => import("./Hero3DVfx").then((m) => m.Hero3DVfx),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DBuilding = dynamic(
  () => import("./Hero3DBuilding").then((m) => m.Hero3DBuilding),
  { ssr: false, loading: SceneLoadingFallback }
);

const Hero3DModeling = dynamic(
  () => import("./Hero3DModeling").then((m) => m.Hero3DModeling),
  { ssr: false, loading: SceneLoadingFallback }
);

const SCENE_COMPONENTS: SceneComponentMap = {
  hero: Hero3D,
  showcase: Hero3DPhase2,
  scripting: Hero3DScripting,
  animation: Hero3DAnimation,
  vfx: Hero3DVfx,
  building: Hero3DBuilding,
  modeling: Hero3DModeling,
  "work-with-me": Hero3DWorkWithMe,
};

function ScrollSceneCanvas() {
  const {
    mouseRef,
    scrollRef,
    phaseCountRef,
    layerOpacityRef,
    activeLayerIndexRef,
    notifyLayerVisibility,
  } = useSceneInteraction();
  const reducedMotion = useReducedMotion();

  const layerCount = BACKGROUND_LAYERS.length;
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smoothLayerRef = useRef(0);
  const lastFrameRef = useRef(0);
  const layerActiveRef = useRef<boolean[]>([]);

  useEffect(() => {
    phaseCountRef.current = layerCount;
  }, [layerCount, phaseCountRef]);

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseRef]);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;

    const update = (now: number) => {
      const delta = lastFrameRef.current
        ? Math.min(0.05, (now - lastFrameRef.current) / 1000)
        : 1 / 60;
      lastFrameRef.current = now;

      const targetIndex = getScrollLayerIndex();
      let layerIndex = dampScrollProgress(
        smoothLayerRef.current,
        targetIndex,
        delta,
        18
      );

      if (Math.abs(layerIndex - targetIndex) < 0.003) {
        layerIndex = targetIndex;
      }

      smoothLayerRef.current = layerIndex;
      activeLayerIndexRef.current = layerIndex;
      scrollRef.current = layerIndex / Math.max(1, layerCount - 1);

      let visibilityChanged = false;

      for (let slot = 0; slot < layerCount; slot++) {
        const el = layerRefs.current[slot];
        const visual = getSectionLayerVisual(slot, layerIndex, layerCount);
        layerOpacityRef.current[slot] = visual.opacity;

        const wasActive = layerActiveRef.current[slot] ?? false;
        if (wasActive !== visual.active) {
          layerActiveRef.current[slot] = visual.active;
          visibilityChanged = true;
        }

        if (!el) continue;

        el.style.opacity = String(visual.opacity);
        el.style.transform = formatLayerTransform();
        el.style.visibility = visual.active ? "visible" : "hidden";
        el.style.pointerEvents = "none";
      }

      if (visibilityChanged) {
        notifyLayerVisibility();
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [
    reducedMotion,
    scrollRef,
    layerCount,
    layerOpacityRef,
    activeLayerIndexRef,
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
      {BACKGROUND_LAYERS.map((layer, slot) => {
        const Component = SCENE_COMPONENTS[layer.scene as BackgroundSceneId];

        return (
          <div
            key={layer.scene}
            ref={(el) => {
              layerRefs.current[slot] = el;
              if (!el) return;
              const visual = getSectionLayerVisual(
                slot,
                smoothLayerRef.current,
                layerCount
              );
              layerOpacityRef.current[slot] = visual.opacity;
              el.style.opacity = String(visual.opacity);
              el.style.transform = formatLayerTransform();
              el.style.visibility = visual.active ? "visible" : "hidden";
            }}
            className="absolute inset-0 origin-center will-change-[opacity]"
            style={{
              opacity: slot === 0 ? 1 : 0,
              transform: formatLayerTransform(),
              visibility: slot === 0 ? "visible" : "hidden",
            }}
          >
            <PhaseScrollProvider index={slot}>
              <Component />
            </PhaseScrollProvider>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-bg/75 to-transparent" />
    </div>
  );
}

export function ScrollSceneBackdrop({ children }: { children: ReactNode }) {
  return (
    <SceneInteractionProvider>
      <ScrollSceneCanvas />
      <div className="relative z-10">{children}</div>
    </SceneInteractionProvider>
  );
}
