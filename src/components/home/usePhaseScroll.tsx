"use client";

import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSceneInteraction } from "./scene-context";
import { getPhaseLocalProgress } from "./scroll-scene-utils";
import { PhaseScrollIndexContext } from "./phase-scroll-context";

export function usePhaseScroll() {
  const phaseIndex = useContext(PhaseScrollIndexContext);
  const { scrollRef, phaseCountRef } = useSceneInteraction();
  const smooth = useRef(0);

  useFrame(() => {
    const global = scrollRef.current ?? 0;
    const count = phaseCountRef.current;
    smooth.current = getPhaseLocalProgress(global, phaseIndex, count);
  });

  return smooth;
}
