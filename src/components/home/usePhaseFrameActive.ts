"use client";

import { useContext, useSyncExternalStore } from "react";
import { usePageVisible } from "@/lib/use-page-visible";
import { useSceneInteraction } from "./scene-context";
import { PhaseScrollIndexContext } from "./phase-scroll-context";

const ACTIVE_THRESHOLD = 0.04;

export function usePhaseFrameActive(): boolean {
  const phaseIndex = useContext(PhaseScrollIndexContext);
  const { layerOpacityRef, subscribeLayerVisibility } = useSceneInteraction();
  const pageVisible = usePageVisible();

  const layerActive = useSyncExternalStore(
    subscribeLayerVisibility,
    () => (layerOpacityRef.current[phaseIndex] ?? 0) > ACTIVE_THRESHOLD,
    () => false
  );

  return pageVisible && layerActive;
}
