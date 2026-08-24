"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { usePageVisible } from "@/lib/use-page-visible";

export function PhaseCanvas({ children, ...props }: CanvasProps) {
  const pageVisible = usePageVisible();

  return (
    <Canvas
      {...props}
      dpr={1}
      frameloop={pageVisible ? "always" : "never"}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
    >
      <color attach="background" args={["#050816"]} />
      {children}
    </Canvas>
  );
}
