"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Line } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

function WorkCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(10, 8.5, s);
    camera.position.y = THREE.MathUtils.lerp(0.5, 0, s);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

function ChatBubble({
  position,
  color,
  delay,
}: {
  position: [number, number, number];
  color: string;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.35 + delay;
    ref.current.position.y =
      position[1] + Math.sin(t) * 0.2 + s * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <Float speed={0.8} floatIntensity={0.25}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[1.4, 0.7, 0.15]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function ConnectionLines() {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  const points: [number, number, number][] = [
    [-2, 0.5, -2],
    [0, 1, -1.5],
    [2, 0.3, -2],
    [0, -0.5, -2.5],
    [-2, 0.5, -2],
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = smooth.current;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04 + s * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Line
        points={points}
        color="#38bdf8"
        lineWidth={1}
        transparent
        opacity={0.35}
      />
    </group>
  );
}

function WorkScene() {
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
      y * 0.03,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <WorkCamera />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 3]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#8b5cf6" />

      <ChatBubble position={[-2, 0.8, -2]} color="#38bdf8" delay={0} />
      <ChatBubble position={[2, 0.2, -2.2]} color="#8b5cf6" delay={1.2} />
      <ChatBubble position={[0, -0.6, -2.5]} color="#67e8f9" delay={2.4} />

      <ConnectionLines />

      <Sparkles
        count={30}
        scale={[12, 8, 8]}
        size={2}
        speed={0.25}
        color="#38bdf8"
        opacity={0.35}
      />
    </group>
  );
}

export function Hero3DWorkWithMe() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0.5, 10], fov: 46 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 11, 26]} />
      <WorkScene />
    </PhaseCanvas>
  );
}
