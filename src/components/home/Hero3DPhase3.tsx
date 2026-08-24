"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const TETRAS = [
  { offset: 0, radius: 2.6, color: "#f472b6", size: 0.5, speed: 0.8 },
  { offset: 2.1, radius: 3.1, color: "#22d3ee", size: 0.42, speed: 1.0 },
  { offset: 4.2, radius: 2.3, color: "#a78bfa", size: 0.38, speed: 0.7 },
];

function Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(11, 8, s);
    camera.position.y = THREE.MathUtils.lerp(1.2, -0.2, s);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function WaveTetra({
  offset,
  radius,
  color,
  size,
  speed,
}: (typeof TETRAS)[number]) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 1.2) * 1.3,
      Math.sin(t) * radius * 0.4
    );
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={ref} scale={size}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function Hero3DPhase3Scene() {
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
      <fog attach="fog" args={["#050816", 13, 28]} />
      <ambientLight intensity={0.55} />
      <group ref={groupRef}>
        <Camera />
        {TETRAS.map((tetra) => (
          <WaveTetra key={tetra.color} {...tetra} />
        ))}
        <mesh position={[0, 0, -1.5]}>
          <torusGeometry args={[1.15, 0.18, 8, 24]} />
          <meshBasicMaterial color="#22d3ee" wireframe />
        </mesh>
      </group>
    </>
  );
}
