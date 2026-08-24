"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  SceneInteractionProvider,
  useSceneInteraction,
} from "./scene-context";
import { PhaseScrollProvider } from "./phase-scroll-context";
import {
  dampScrollProgress,
  getPhasePosition,
  getScrollProgress,
} from "./scroll-scene-utils";
import { PhaseCanvas } from "./PhaseCanvas";
import { Hero3DScene } from "./Hero3D";
import { Hero3DPhase2Scene } from "./Hero3DPhase2";
import { Hero3DPhase3Scene } from "./Hero3DPhase3";
import { Hero3DPhase4Scene } from "./Hero3DPhase4";
import { Hero3DPhase5Scene } from "./Hero3DPhase5";
import { Hero3DPhase6Scene } from "./Hero3DPhase6";

const ALL_SCENES: ComponentType[] = [
  Hero3DScene,
  Hero3DPhase2Scene,
  Hero3DPhase3Scene,
  Hero3DPhase4Scene,
  Hero3DPhase5Scene,
  Hero3DPhase6Scene,
];

const MOBILE_COMPONENT_INDICES = [0, 1, 3, 4, 5];

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

function activeSlotForProgress(progress: number, phaseCount: number): number {
  const p = getPhasePosition(progress, phaseCount);
  return Math.round(Math.min(phaseCount - 1, Math.max(0, p)));
}

function ScrollSceneCanvas() {
  const { mouseRef, scrollRef, phaseCountRef } = useSceneInteraction();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const componentIndices = isMobile
    ? MOBILE_COMPONENT_INDICES
    : ALL_SCENES.map((_, i) => i);
  const phaseCount = componentIndices.length;

  const smoothScrollRef = useRef(0);
  const lastFrameRef = useRef(0);
  const slotRef = useRef(0);
  const [activeSlot, setActiveSlot] = useState(0);

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

      const nextSlot = activeSlotForProgress(progress, phaseCount);
      if (slotRef.current !== nextSlot) {
        slotRef.current = nextSlot;
        if (!cancelled) setActiveSlot(nextSlot);
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
  }, [reducedMotion, scrollRef, phaseCount]);

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

  const sceneIndex = componentIndices[activeSlot] ?? 0;
  const Scene = ALL_SCENES[sceneIndex];

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-bg" />
      <PhaseScrollProvider index={activeSlot}>
        <PhaseCanvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Scene />
        </PhaseCanvas>
      </PhaseScrollProvider>
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
