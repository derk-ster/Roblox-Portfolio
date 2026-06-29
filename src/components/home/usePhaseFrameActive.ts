"use client";

import { useContext, useSyncExternalStore } from "react";
import { useSceneInteraction } from "./scene-context";
import { PhaseScrollIndexContext } from "./usePhaseScroll";

const ACTIVE_THRESHOLD = 0.008;

export function usePhaseFrameActive(): boolean {
  const phaseIndex = useContext(PhaseScrollIndexContext);
  const { layerOpacityRef, subscribeLayerVisibility } = useSceneInteraction();

  return useSyncExternalStore(
    subscribeLayerVisibility,
    () => (layerOpacityRef.current[phaseIndex] ?? 0) > ACTIVE_THRESHOLD,
    () => true
  );
}
