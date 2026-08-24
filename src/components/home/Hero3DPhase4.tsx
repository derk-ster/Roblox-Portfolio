"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const LINKS = 6;

function Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(12, 9, s);
    camera.position.y = THREE.MathUtils.lerp(0.8, -0.4, s);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CapsuleChain() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.32;
    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const progress = i / LINKS;
      const angle = progress * Math.PI * 3 + t;
      child.position.set(
        Math.cos(angle) * 1.7,
        progress * 4 - 2,
        Math.sin(angle) * 1.7
      );
      child.rotation.x = angle;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: LINKS }).map((_, i) => (
        <mesh key={i} scale={0.45}>
          <capsuleGeometry args={[0.32, 0.5, 4, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#34d399" : "#2dd4bf"} />
        </mesh>
      ))}
    </group>
  );
}

export function Hero3DPhase4Scene() {
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
      <fog attach="fog" args={["#050816", 14, 30]} />
      <ambientLight intensity={0.5} />
      <group ref={groupRef}>
        <Camera />
        <CapsuleChain />
        <mesh position={[0, -0.4, -3]} rotation={[0.4, 0.2, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 1.6, 6, 1, true]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      </group>
    </>
  );
}
