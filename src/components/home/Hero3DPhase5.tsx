"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const PYRAMIDS = [
  { angle: 0.4, dist: 2.8, color: "#fb923c" },
  { angle: 2.5, dist: 3.2, color: "#f97316" },
  { angle: 4.6, dist: 2.5, color: "#fdba74" },
];

function Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(10.5, 8, s);
    camera.position.y = THREE.MathUtils.lerp(1, 0, s);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FloatingPyramid({
  angle,
  dist,
  color,
}: (typeof PYRAMIDS)[number]) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.45 + angle;
    ref.current.position.set(
      Math.cos(t) * dist,
      Math.sin(t * 0.8) * 1.1,
      Math.sin(t) * dist * 0.3
    );
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref} scale={[0.7, 1.05, 0.7]}>
      <coneGeometry args={[0.7, 1.4, 4]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function Hero3DPhase5Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = mouseRef.current;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.1,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.05,
      0.04
    );
  });

  return (
    <>
      <fog attach="fog" args={["#050816", 12, 26]} />
      <ambientLight intensity={0.5} />
      <group ref={groupRef}>
        <Camera />
        {PYRAMIDS.map((pyramid) => (
          <FloatingPyramid key={pyramid.color} {...pyramid} />
        ))}
        <mesh rotation={[Math.PI * 0.5, 0, 0]} position={[0, -0.6, -2.5]}>
          <ringGeometry args={[1.7, 1.95, 6]} />
          <meshBasicMaterial
            color="#fb923c"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}
