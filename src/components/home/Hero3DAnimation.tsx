"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const LIMB_COLOR = "#a78bfa";
const TORSO_COLOR = "#8b5cf6";
const HEAD_COLOR = "#c4b5fd";
const LIMB_ACCENT = "#7c3aed";

function AnimationCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(8, 9.5, s);
    camera.position.y = THREE.MathUtils.lerp(0.2, -0.2, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.sin(s * Math.PI * 2) * 0.6, s);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function R6Block({
  position,
  size,
  color,
  emissive,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.35}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function R6Avatar() {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = smooth.current;
    const dance = Math.sin(t * 2.2) * 0.5;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.15 + s * 0.1;
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = dance * 0.8 + 0.2;
      leftArmRef.current.rotation.x = Math.sin(t * 2.2 + 0.5) * 0.3;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -dance * 0.8 - 0.2;
      rightArmRef.current.rotation.x = Math.sin(t * 2.2 + Math.PI) * 0.3;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = -dance * 0.5;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = dance * 0.5;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, -1]}>
        <R6Block
          position={[0, 1.35, 0]}
          size={[0.85, 0.85, 0.85]}
          color={HEAD_COLOR}
          emissive={LIMB_ACCENT}
        />
        <R6Block
          position={[0, 0.35, 0]}
          size={[1.4, 1.2, 0.65]}
          color={TORSO_COLOR}
          emissive={LIMB_ACCENT}
        />

        <group ref={leftArmRef} position={[-1.05, 0.55, 0]}>
          <R6Block
            position={[0, -0.55, 0]}
            size={[0.45, 1.1, 0.45]}
            color={LIMB_COLOR}
            emissive={LIMB_ACCENT}
          />
        </group>
        <group ref={rightArmRef} position={[1.05, 0.55, 0]}>
          <R6Block
            position={[0, -0.55, 0]}
            size={[0.45, 1.1, 0.45]}
            color={LIMB_COLOR}
            emissive={LIMB_ACCENT}
          />
        </group>
        <group ref={leftLegRef} position={[-0.35, -0.35, 0]}>
          <R6Block
            position={[0, -0.65, 0]}
            size={[0.5, 1.3, 0.5]}
            color={LIMB_COLOR}
            emissive={LIMB_ACCENT}
          />
        </group>
        <group ref={rightLegRef} position={[0.35, -0.35, 0]}>
          <R6Block
            position={[0, -0.65, 0]}
            size={[0.5, 1.3, 0.5]}
            color={LIMB_COLOR}
            emissive={LIMB_ACCENT}
          />
        </group>
      </group>
    </Float>
  );
}

function OrbitKeyframes() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime * 0.5 + i * 0.9;
      mesh.position.set(
        Math.cos(t) * (3 + i * 0.2),
        Math.sin(t * 1.3) * 1.5,
        Math.sin(t) * 1.2 - 4 - s
      );
      mesh.rotation.y = t;
    });
  });

  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#8b5cf6"
            emissiveIntensity={0.7}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
}

function AnimationScene() {
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
      y * 0.04,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <AnimationCamera />
      <ambientLight intensity={0.22} />
      <pointLight position={[5, 5, 4]} intensity={0.8} color="#a78bfa" />
      <pointLight position={[-4, 2, 3]} intensity={0.5} color="#c084fc" />

      <R6Avatar />
      <OrbitKeyframes />
    </group>
  );
}

export function Hero3DAnimation() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0.3, 8], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 10, 26]} />
      <AnimationScene />
    </PhaseCanvas>
  );
}
