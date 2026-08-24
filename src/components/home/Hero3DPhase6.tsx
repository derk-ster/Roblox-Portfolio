"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const ORBS = [
  { angle: 0, radius: 2.4, color: "#e879f9", size: 0.32 },
  { angle: 2.1, radius: 3.0, color: "#c026d3", size: 0.26 },
  { angle: 4.2, radius: 2.6, color: "#a855f7", size: 0.3 },
];

function Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(9.5, 7, s);
    camera.position.y = THREE.MathUtils.lerp(0.5, -0.6, s);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function OrbitSphere({
  angle,
  radius,
  color,
  size,
}: (typeof ORBS)[number]) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.4 + angle;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.6) * 0.8,
      Math.sin(t) * radius * 0.35
    );
  });

  return (
    <mesh ref={ref} scale={size}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function Hero3DPhase6Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = mouseRef.current;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.08,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.04,
      0.04
    );
  });

  return (
    <>
      <fog attach="fog" args={["#050816", 11, 24]} />
      <ambientLight intensity={0.5} />
      <group ref={groupRef}>
        <Camera />
        {ORBS.map((orb) => (
          <OrbitSphere key={orb.color} {...orb} />
        ))}
        <mesh rotation={[Math.PI * 0.42, 0, 0]} position={[0, -0.3, -2]}>
          <torusGeometry args={[1.9, 0.025, 6, 24]} />
          <meshBasicMaterial color="#e879f9" transparent opacity={0.4} />
        </mesh>
      </group>
    </>
  );
}
