"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const ORBIT_SPHERES = [
  { angle: 0, radius: 2.5, color: "#e879f9", size: 0.32 },
  { angle: 1.5, radius: 3, color: "#c026d3", size: 0.28 },
  { angle: 3.0, radius: 2.2, color: "#d946ef", size: 0.35 },
  { angle: 4.5, radius: 3.4, color: "#a855f7", size: 0.26 },
];

function Phase6Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(9.5, 7, s);
    camera.position.y = THREE.MathUtils.lerp(0.5, -0.8, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.cos(s * Math.PI) * 0.8, s);
    camera.lookAt(0, s * -0.15, s * -0.4);
  });

  return null;
}

function OrbitSphere({
  angle,
  radius,
  color,
  size,
}: (typeof ORBIT_SPHERES)[number]) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.45 + angle;

    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.6) * 0.9 + s * 0.2,
      Math.sin(t) * radius * 0.4 - s * 1.8
    );
    ref.current.scale.setScalar(size * (0.9 + s * 0.15));
  });

  return (
    <Float speed={0.7} floatIntensity={0.4}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.35}
          roughness={0.35}
        />
      </mesh>
    </Float>
  );
}

function SoftRing() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.rotation.x = Math.PI * 0.42;
    ref.current.rotation.z = state.clock.elapsedTime * 0.06;
    ref.current.position.y = -0.3 - s * 0.5;
    ref.current.position.z = -2 - s * 1;
    ref.current.scale.setScalar(1.5 + s * 0.4);

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.35, 0.55, s);
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2, 0.025, 8, 80]} />
      <meshStandardMaterial
        color="#e879f9"
        emissive="#c026d3"
        emissiveIntensity={0.6}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function DriftTrails() {
  const ref = useRef<THREE.Points>(null);
  const smooth = usePhaseScroll();

  const positions = useMemo(() => {
    const count = 35;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.5 + (i % 5) * 0.6;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (i / count) * 4 - 2;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.5 - 1.5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04 + s * 0.1;
    ref.current.position.y = s * -0.3;

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.4, 0.6, s);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#d946ef"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Phase6Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    const mouseWeight = 1 - s * 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.1 * mouseWeight + s * 0.08,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.04 * mouseWeight - s * 0.04,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Phase6Camera />
      <ambientLight intensity={0.22} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#e879f9" />
      <pointLight position={[-3, -2, 2]} intensity={0.35} color="#c026d3" />

      {ORBIT_SPHERES.map((s) => (
        <OrbitSphere key={s.color + s.angle} {...s} />
      ))}

      <SoftRing />
      <DriftTrails />
    </group>
  );
}

export function Hero3DPhase6() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.5, 9.5], fov: 45 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 11, 26]} />
      <Phase6Scene />
    </Canvas>
  );
}
