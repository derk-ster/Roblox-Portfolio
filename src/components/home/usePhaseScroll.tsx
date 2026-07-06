"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useSceneInteraction } from "./scene-context";
import { getPhaseLocalProgress } from "./scroll-scene-utils";

const PhaseScrollIndexContext = createContext(0);

export { PhaseScrollIndexContext };

export function PhaseScrollProvider({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <PhaseScrollIndexContext.Provider value={index}>
      {children}
    </PhaseScrollIndexContext.Provider>
  );
}

export function usePhaseScroll() {
  const phaseIndex = useContext(PhaseScrollIndexContext);
  const { scrollRef, phaseCountRef, activeLayerIndexRef } = useSceneInteraction();
  const smooth = useRef(0);

  useFrame((state) => {
    const activeLayer = activeLayerIndexRef.current;
    const isActiveLayer = Math.abs(phaseIndex - activeLayer) < 0.55;

    if (isActiveLayer) {
      // Time-based loop so scenes animate while their section is visible
      smooth.current = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      return;
    }

    const global = scrollRef.current ?? 0;
    const count = phaseCountRef.current;
    smooth.current = getPhaseLocalProgress(global, phaseIndex, count);
  });

  return smooth;
}
