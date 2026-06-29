"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const PYRAMIDS = [
  { angle: 0.5, dist: 2.8, color: "#fb923c", height: 1.1 },
  { angle: 2.1, dist: 3.3, color: "#f97316", height: 0.85 },
  { angle: 3.8, dist: 2.4, color: "#fdba74", height: 0.95 },
  { angle: 5.2, dist: 3.6, color: "#ea580c", height: 0.75 },
];

function Phase5Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(10.5, 7.8, s);
    camera.position.y = THREE.MathUtils.lerp(1, 0, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.sin(s * Math.PI * 2.5) * 1.5, s);
    camera.lookAt(0, s * 0.25, s * -0.7);
  });

  return null;
}

function FloatingPyramid({
  angle,
  dist,
  color,
  height,
}: (typeof PYRAMIDS)[number]) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.5 + angle;

    ref.current.position.set(
      Math.cos(t) * dist * (0.9 + s * 0.15),
      Math.sin(t * 0.8) * 1.2 + s * 0.3,
      Math.sin(t) * dist * 0.35 - s * 2.2
    );
    ref.current.rotation.y = t * 0.6;
    ref.current.scale.set(0.7, height, 0.7);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.55}>
      <mesh ref={ref}>
        <coneGeometry args={[0.7, 1.4, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.42}
          metalness={0.48}
          roughness={0.22}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function HexRing() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.rotation.x = Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.18) * 0.1;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    ref.current.position.y = -0.5 - s * 0.9;
    ref.current.position.z = -2.8 - s * 1.6;
    ref.current.scale.setScalar(1.2 + s * 0.7);
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[1.8, 2.05, 6]} />
      <meshStandardMaterial
        color="#fb923c"
        emissive="#f97316"
        emissiveIntensity={0.75}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ArcLines() {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  const curves = useRef(
    Array.from({ length: 3 }).map((_, i) => {
      const points = [];
      for (let j = 0; j <= 24; j++) {
        const t = j / 24;
        const a = t * Math.PI + i * 0.8;
        points.push(
          new THREE.Vector3(
            Math.cos(a) * 2.5,
            t * 3 - 1.5,
            Math.sin(a) * 1.2 - 2
          )
        );
      }
      return points;
    })
  ).current;

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = smooth.current;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06 + s * 0.15;
    groupRef.current.position.z = -s * 1.2;
  });

  return (
    <group ref={groupRef}>
      {curves.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={i === 1 ? "#fdba74" : "#fb923c"}
          lineWidth={1}
          transparent
          opacity={0.45}
        />
      ))}
    </group>
  );
}

function Phase5Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.15 + s * 0.15,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.06 - s * 0.06,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Phase5Camera />
      <ambientLight intensity={0.2} />
      <pointLight position={[7, 5, 5]} intensity={0.75} color="#fb923c" />
      <pointLight position={[-5, -1, 3]} intensity={0.45} color="#f97316" />

      {PYRAMIDS.map((p) => (
        <FloatingPyramid key={p.color + p.angle} {...p} />
      ))}

      <HexRing />
      <ArcLines />
    </group>
  );
}

export function Hero3DPhase5() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 1, 10.5], fov: 47 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 12, 28]} />
      <Phase5Scene />
    </PhaseCanvas>
  );
}
