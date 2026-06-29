"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { usePhaseFrameActive } from "./usePhaseFrameActive";

export function PhaseCanvas(props: CanvasProps) {
  const active = usePhaseFrameActive();

  return (
    <Canvas
      {...props}
      frameloop={active ? "always" : "never"}
      performance={{ min: 0.5 }}
    />
  );
}
