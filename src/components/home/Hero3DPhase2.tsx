"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Torus } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const ORBS = [
  { angle: 0, radius: 2.8, color: "#38bdf8", size: 0.55, speed: 0.7 },
  { angle: 1.4, radius: 3.4, color: "#8b5cf6", size: 0.42, speed: 1.1 },
  { angle: 2.8, radius: 2.2, color: "#c084fc", size: 0.38, speed: 0.9 },
  { angle: 4.2, radius: 3.8, color: "#84cc16", size: 0.48, speed: 1.3 },
  { angle: 5.6, radius: 3.1, color: "#6366f1", size: 0.35, speed: 1.0 },
];

function Phase2Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;

    camera.position.z = THREE.MathUtils.lerp(10, 7.5, s);
    camera.position.y = THREE.MathUtils.lerp(1.5, 0.5, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.cos(s * Math.PI * 2) * 1.8, s);
    camera.lookAt(0, s * 0.4, s * -0.8);
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
      Math.cos(t) * radius * (0.85 + s * 0.25),
      Math.sin(t * 0.7) * 1.4 + s * 0.6,
      Math.sin(t) * radius * 0.45 - s * 2.5
    );
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.55;
    ref.current.scale.setScalar(size * (0.8 + s * 0.35));
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={ref}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          metalness={0.5}
          roughness={0.22}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Phase2Core() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;

    ref.current.rotation.x = state.clock.elapsedTime * 0.18 + s;
    ref.current.rotation.y = state.clock.elapsedTime * 0.24;
    ref.current.position.y = THREE.MathUtils.lerp(0.2, -0.4, s);
    ref.current.position.z = THREE.MathUtils.lerp(-1, -2.8, s);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(1.1, 1.6, s));
  });

  return (
    <Float speed={0.8} floatIntensity={0.35}>
      <mesh ref={ref}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.18}
        />
      </mesh>
    </Float>
  );
}

function Phase2Rings() {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;

    if (ringA.current) {
      ringA.current.rotation.x = Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
      ringA.current.rotation.z = state.clock.elapsedTime * 0.12 + s * 0.5;
      ringA.current.position.y = -1.8 - s * 1.2;
      ringA.current.scale.setScalar(1.4 + s * 1.1);
    }
    if (ringB.current) {
      ringB.current.rotation.x = Math.PI * 0.35 + s * 0.4;
      ringB.current.rotation.y = state.clock.elapsedTime * -0.18;
      ringB.current.position.set(0, 0.5 + s, -3 - s * 2);
      ringB.current.scale.setScalar(0.9 + s * 0.6);
    }
  });

  return (
    <>
      <Torus ref={ringA} args={[2.2, 0.04, 12, 80]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
          transparent
          opacity={0.55}
        />
      </Torus>
      <Torus ref={ringB} args={[1.4, 0.03, 10, 64]}>
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          emissiveIntensity={0.85}
          transparent
          opacity={0.45}
        />
      </Torus>
    </>
  );
}

function Phase2Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.18 + s * 0.25,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.08 - s * 0.12,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Phase2Camera />
      <ambientLight intensity={0.22} />
      <pointLight position={[8, 6, 6]} intensity={0.9} color="#38bdf8" />
      <pointLight position={[-6, -2, 4]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, -4, -6]} intensity={0.45} color="#c084fc" />

      {ORBS.map((orb) => (
        <OrbitOrb key={orb.color + orb.angle} {...orb} />
      ))}

      <Phase2Rings />
      <Phase2Core />

      <Sparkles
        count={48}
        scale={[14, 8, 10]}
        size={2}
        speed={0.35}
        color="#38bdf8"
        opacity={0.45}
      />
    </group>
  );
}

export function Hero3DPhase2() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 1.5, 10], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 12, 28]} />
      <Phase2Scene />
    </Canvas>
  );
}
