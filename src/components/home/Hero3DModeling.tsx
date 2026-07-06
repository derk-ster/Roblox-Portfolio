"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const CLAY = "#c4a882";
const CLAY_DARK = "#a68b5b";
const HAND = "#e8c4a0";

function ModelingCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.05;
    camera.position.z = THREE.MathUtils.lerp(8.5, 7.5, s);
    camera.position.y = THREE.MathUtils.lerp(-0.2, -0.4, s) + Math.sin(t) * 0.04;
    camera.lookAt(0, -0.2, 0);
  });

  return null;
}

function PotterWheel() {
  const discRef = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!discRef.current) return;
    const s = smooth.current;
    discRef.current.rotation.y = state.clock.elapsedTime * 0.4 * (0.8 + s * 0.2);
  });

  return (
    <group position={[0, -1.35, 0]}>
      <mesh ref={discRef}>
        <cylinderGeometry args={[1.4, 1.4, 0.12, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

function ClayCup() {
  const cupRef = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!cupRef.current) return;
    const t = state.clock.elapsedTime;
    const s = smooth.current;
    const cycle = (t * 0.25) % 1;
    const grow = 0.35 + cycle * 0.65;
    const wobble = Math.sin(t * 2.5) * 0.02 * cycle;

    cupRef.current.scale.set(0.7 + grow * 0.35 + wobble, grow, 0.7 + grow * 0.35 + wobble);
    cupRef.current.position.y = THREE.MathUtils.lerp(-1.1, -0.85, grow) + s * 0.05;
  });

  return (
    <mesh ref={cupRef} position={[0, -1.1, 0]}>
      <cylinderGeometry args={[0.55, 0.4, 0.9, 24, 1, true]} />
      <meshStandardMaterial
        color={CLAY}
        emissive={CLAY_DARK}
        emissiveIntensity={0.08}
        roughness={0.85}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Hand({
  side,
}: {
  side: "left" | "right";
}) {
  const groupRef = useRef<THREE.Group>(null);
  const sign = side === "left" ? -1 : 1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const cycle = (t * 0.25) % 1;
    const press = Math.sin(cycle * Math.PI) * 0.15;

    groupRef.current.position.x = sign * (0.85 - press * 0.3);
    groupRef.current.position.y = -0.5 + press * 0.1;
    groupRef.current.rotation.z = sign * (-0.3 + press * 0.2);
    groupRef.current.rotation.y = sign * 0.15;
  });

  return (
    <group ref={groupRef} position={[sign * 0.85, -0.5, 0.3]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0, sign * 0.2]}>
        <boxGeometry args={[0.35, 0.5, 0.2]} />
        <meshStandardMaterial color={HAND} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Fingers */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[sign * (i - 1.5) * 0.08, 0.35, 0.05]}
          rotation={[0.3, 0, sign * (0.1 + i * 0.05)]}
        >
          <boxGeometry args={[0.1, 0.3, 0.12]} />
          <meshStandardMaterial color={HAND} roughness={0.7} metalness={0.05} />
        </mesh>
      ))}
      {/* Thumb */}
      <mesh position={[sign * -0.22, 0.1, 0.1]} rotation={[0.4, 0, sign * -0.5]}>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color={HAND} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  );
}

function ClaySpiral() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 4;
      const r = 0.5 + (i / count) * 0.3;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -0.9 + (i / count) * 0.6;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={CLAY_DARK} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function ModelingScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.05,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.02,
      0.03
    );
  });

  return (
    <group ref={groupRef}>
      <ModelingCamera />
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 4, 3]} intensity={0.55} color="#fde68a" />
      <pointLight position={[-2, 2, 2]} intensity={0.3} color="#d946ef" />

      <PotterWheel />
      <ClayCup />
      <ClaySpiral />
      <Hand side="left" />
      <Hand side="right" />
    </group>
  );
}

export function Hero3DModeling() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, -0.2, 8.5], fov: 44 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 9, 22]} />
      <ModelingScene />
    </PhaseCanvas>
  );
}
