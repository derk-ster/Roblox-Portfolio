"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const ORBS = [
  { angle: 0, radius: 2.8, color: "#38bdf8", size: 0.55, speed: 0.7 },
  { angle: 2.1, radius: 3.4, color: "#8b5cf6", size: 0.42, speed: 1.0 },
  { angle: 4.2, radius: 2.6, color: "#c084fc", size: 0.38, speed: 0.85 },
];

function Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(10, 7.5, s);
    camera.position.y = THREE.MathUtils.lerp(1.5, 0.5, s);
    camera.lookAt(0, s * 0.3, 0);
  });

  return null;
}

function OrbitOrb({
  angle,
  radius,
  color,
  size,
  speed,
}: (typeof ORBS)[number]) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * speed + angle;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * 1.2 + s * 0.4,
      Math.sin(t) * radius * 0.4 - s * 2
    );
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <mesh ref={ref} scale={size}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

export function Hero3DPhase2Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = mouseRef.current;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.12,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.06,
      0.04
    );
  });

  return (
    <>
      <fog attach="fog" args={["#050816", 12, 26]} />
      <ambientLight intensity={0.5} />
      <group ref={groupRef}>
        <Camera />
        {ORBS.map((orb) => (
          <OrbitOrb key={orb.color} {...orb} />
        ))}
        <mesh rotation={[Math.PI * 0.5, 0, 0]} position={[0, -1.6, -2]}>
          <torusGeometry args={[2.1, 0.03, 6, 24]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
        </mesh>
      </group>
    </>
  );
}
