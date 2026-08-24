"use client";

import { useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { usePhaseFrameActive } from "./usePhaseFrameActive";

function getDpr(): number | [number, number] {
  if (typeof window === "undefined") return [1, 1.25];
  if (window.matchMedia("(pointer: coarse)").matches) return 1;
  return [1, 1.25];
}

export function PhaseCanvas(props: CanvasProps) {
  const active = usePhaseFrameActive();
  const [dpr] = useState(getDpr);

  return (
    <Canvas
      {...props}
      dpr={dpr}
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
