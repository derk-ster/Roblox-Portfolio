"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const TETRAS = [
  { offset: 0, radius: 2.6, color: "#f472b6", size: 0.55, speed: 0.85 },
  { offset: 1.3, radius: 3.2, color: "#22d3ee", size: 0.45, speed: 1.05 },
  { offset: 2.6, radius: 2.1, color: "#fbbf24", size: 0.5, speed: 0.75 },
  { offset: 3.9, radius: 3.6, color: "#a78bfa", size: 0.4, speed: 1.15 },
];

function Phase3Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(11, 8, s);
    camera.position.y = THREE.MathUtils.lerp(1.2, -0.3, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.sin(s * Math.PI) * 1.4, s);
    camera.lookAt(0, s * -0.2, s * -0.6);
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
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * speed + offset;

    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 1.3) * 1.6 + Math.sin(t * 0.5) * 0.4 + s * 0.5,
      Math.sin(t) * radius * 0.5 - s * 2
    );
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.z = t * 0.25;
    ref.current.scale.setScalar(size * (0.85 + s * 0.3));
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={ref}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.55}
          roughness={0.2}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function Phase3Knot() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15 + s * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.22;
    ref.current.position.y = THREE.MathUtils.lerp(0, -0.8, s);
    ref.current.position.z = THREE.MathUtils.lerp(-1.5, -3.2, s);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1.15, s));
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.22, 120, 16]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#0891b2"
        emissiveIntensity={0.45}
        metalness={0.7}
        roughness={0.15}
      />
    </mesh>
  );
}

function Phase3Cones() {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = smooth.current;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08 + s * 0.2;
    groupRef.current.position.y = -1.5 - s * 0.8;
    groupRef.current.position.z = -2.5 - s * 1.5;

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const angle = (i / 5) * Math.PI * 2;
      child.position.set(
        Math.cos(angle + state.clock.elapsedTime * 0.3) * (2 + s),
        Math.sin(angle * 2 + state.clock.elapsedTime * 0.5) * 0.5,
        Math.sin(angle + state.clock.elapsedTime * 0.3) * 0.8
      );
      child.rotation.z = angle + state.clock.elapsedTime * 0.4;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} scale={0.35}>
          <coneGeometry args={[0.5, 1.2, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#fbbf24" : "#f472b6"}
            emissive={i % 2 === 0 ? "#fbbf24" : "#f472b6"}
            emissiveIntensity={0.4}
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function Phase3Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.16 + s * 0.2,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.07 - s * 0.1,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Phase3Camera />
      <ambientLight intensity={0.2} />
      <pointLight position={[6, 8, 5]} intensity={0.85} color="#f472b6" />
      <pointLight position={[-5, -3, 4]} intensity={0.55} color="#22d3ee" />

      {TETRAS.map((t) => (
        <WaveTetra key={t.color + t.offset} {...t} />
      ))}

      <Phase3Knot />
      <Phase3Cones />
    </group>
  );
}

export function Hero3DPhase3() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 1.2, 11], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 13, 30]} />
      <Phase3Scene />
    </Canvas>
  );
}
