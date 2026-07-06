"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Cloud, Line } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

function VfxCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.08;
    camera.position.z = THREE.MathUtils.lerp(10, 9, s);
    camera.position.y = THREE.MathUtils.lerp(0.3, 0, s) + Math.sin(t) * 0.08;
    camera.position.x = Math.sin(t * 0.7) * 0.3;
    camera.lookAt(0, 0, -1);
  });

  return null;
}

function FlamePillar({ x, z, phase }: { x: number; z: number; phase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 1.8 + phase;
    const s = smooth.current;
    const flicker = 0.85 + Math.sin(t * 3.5) * 0.1 + Math.sin(t * 7.2) * 0.05;

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const h = 0.5 + i * 0.22;
      child.position.y = h * flicker;
      child.scale.set(
        (1 - i * 0.12) * flicker,
        h * flicker,
        (1 - i * 0.12) * flicker
      );
      const mat = child.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(0.5, 0.9, s) * (1 - i * 0.15);
      mat.opacity = 0.75 - i * 0.12;
    });
  });

  return (
    <group ref={groupRef} position={[x, -1.2, z]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i}>
          <coneGeometry args={[0.35 - i * 0.05, 0.7, 6]} />
          <meshStandardMaterial
            color={i < 2 ? "#fb923c" : "#f97316"}
            emissive={i < 2 ? "#fbbf24" : "#ea580c"}
            emissiveIntensity={0.7}
            transparent
            opacity={0.8}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function StormCloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.position.x =
      position[0] + Math.sin(state.clock.elapsedTime * 0.12 + scale) * 0.25;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.08 + scale * 2) * 0.1;
    ref.current.scale.setScalar(scale * (0.95 + s * 0.05));
  });

  return (
    <group ref={ref} position={position}>
      <Cloud
        opacity={0.35}
        speed={0.15}
        segments={12}
        color="#c4b5fd"
      />
    </group>
  );
}

function LightningBolt() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const points = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = [];
    let y = 2.5;
    let x = 0;
    for (let i = 0; i < 8; i++) {
      pts.push([x, y, -2]);
      y -= 0.45 + (i % 3) * 0.08;
      x += ((i % 2) - 0.5) * 0.4;
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const cycle = (state.clock.elapsedTime * 0.55) % 4;
    const flash = cycle < 0.12 || (cycle > 1.8 && cycle < 1.92);
    groupRef.current.visible = flash;
    if (lightRef.current) {
      lightRef.current.intensity = flash ? 2.5 : 0;
    }
  });

  return (
    <group ref={groupRef} position={[1.2, 0, 0]}>
      <Line
        points={points}
        color="#e0f2fe"
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={0}
        color="#bae6fd"
        distance={6}
      />
    </group>
  );
}

function EmberParticles() {
  const ref = useRef<THREE.Points>(null);
  const smooth = usePhaseScroll();

  const positions = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 4 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += 0.008 + Math.sin(state.clock.elapsedTime + i) * 0.002;
      if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -1.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.35, 0.55, s);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#fbbf24"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function VfxScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.06,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.025,
      0.03
    );
  });

  return (
    <group ref={groupRef}>
      <VfxCamera />
      <ambientLight intensity={0.12} />
      <pointLight position={[3, 2, 2]} intensity={0.5} color="#f97316" />
      <pointLight position={[-2, 3, 1]} intensity={0.35} color="#c084fc" />

      <StormCloud position={[-3, 2.2, -3]} scale={0.9} />
      <StormCloud position={[2.5, 2.8, -4]} scale={1.1} />
      <StormCloud position={[0, 3, -5]} scale={1.3} />

      <FlamePillar x={-1.5} z={-1} phase={0} />
      <FlamePillar x={1.8} z={-1.5} phase={1.4} />
      <FlamePillar x={0} z={-2.2} phase={2.8} />

      <LightningBolt />
      <EmberParticles />

      <Sparkles
        count={45}
        scale={[14, 8, 10]}
        size={2}
        speed={0.3}
        color="#f472b6"
        opacity={0.4}
      />
    </group>
  );
}

export function Hero3DVfx() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0.3, 10], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#0a0618", 11, 28]} />
      <VfxScene />
    </PhaseCanvas>
  );
}
