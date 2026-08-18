"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { usePhaseFrameActive } from "./usePhaseFrameActive";

export function PhaseCanvas(props: CanvasProps) {
  const active = usePhaseFrameActive();

  return (
    <Canvas
      {...props}
      dpr={[1, 1.25]}
      frameloop={active ? "always" : "never"}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
    />
  );
}
