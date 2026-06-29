"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Torus } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const BLOCKS = [
  { rest: [-2, 1, 0] as const, orbit: 0.0, color: "#00E5FF", size: 1.2, speed: 0.8 },
  { rest: [2.5, -0.5, -1] as const, orbit: 1.25, color: "#A855F7", size: 0.9, speed: 1.2 },
  { rest: [0, 2, -2] as const, orbit: 2.5, color: "#FF3DCE", size: 0.7, speed: 1.0 },
  { rest: [-3, -1.5, -2] as const, orbit: 3.75, color: "#3B82F6", size: 0.6, speed: 1.5 },
  { rest: [3, 1.5, 1] as const, orbit: 5.0, color: "#A3FF12", size: 0.5, speed: 0.9 },
];

function orbitPosition(angle: number, radius: number, y: number, scroll: number) {
  const a = angle + scroll * Math.PI * 0.6;
  return new THREE.Vector3(
    Math.cos(a) * radius,
    y + scroll * 0.8,
    Math.sin(a) * radius - scroll * 2
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;

    camera.position.z = THREE.MathUtils.lerp(8, 14, s);
    camera.position.y = THREE.MathUtils.lerp(0, -2.2, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.sin(s * Math.PI) * 1.2, s);
    camera.lookAt(0, s * -0.6, s * -1.5);
  });

  return null;
}

function ScrollBlock({
  rest,
  orbit,
  color,
  size,
  speed,
}: (typeof BLOCKS)[number]) {
  const meshRef = useRef<THREE.Mesh>(null);
  const restVec = useMemo(() => new THREE.Vector3(...rest), [rest]);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!meshRef.current) return;
    const s = smooth.current;

    const orbitPos = orbitPosition(orbit, 3.8 + s * 1.4, rest[1] * 0.5, s);
    pos.lerpVectors(restVec, orbitPos, s);
    meshRef.current.position.copy(pos);

    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed + s * 0.4;
    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.5 * speed + s * orbit * 0.15;

    const scale = size * (1 - s * 0.12);
    meshRef.current.scale.setScalar(scale);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(0.3, 0.65, s);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={1.1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.45}
          roughness={0.28}
        />
      </mesh>
    </Float>
  );
}

function ScrollRing({
  rest,
  color,
  scale,
  spin,
}: {
  rest: [number, number, number];
  color: string;
  scale: number;
  spin: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;

    ref.current.position.set(
      rest[0] * (1 + s * 0.3),
      rest[1] + s * 1.2,
      rest[2] - s * 3.5
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 0.55, s);
    ref.current.rotation.z =
      state.clock.elapsedTime * 0.35 * spin + s * Math.PI * 0.25;
    ref.current.scale.setScalar(scale * (1 + s * 0.55));

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.8, 0.45, s);
    mat.emissiveIntensity = THREE.MathUtils.lerp(1, 1.6, s);
  });

  return (
    <Torus ref={ref} args={[1.5 * scale, 0.05, 16, 64]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.8}
      />
    </Torus>
  );
}

function ScrollCore() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;

    ref.current.position.y = THREE.MathUtils.lerp(0, -0.8, s);
    ref.current.position.z = THREE.MathUtils.lerp(0, -2.5, s);
    ref.current.rotation.x = state.clock.elapsedTime * 0.25 + s * 0.8;
    ref.current.rotation.y = state.clock.elapsedTime * 0.35;
    const scale = THREE.MathUtils.lerp(0.8, 1.35, s);
    ref.current.scale.setScalar(scale);
  });

  return (
    <Float speed={1.2} floatIntensity={0.4}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.4}
          distort={0.3}
          speed={2}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function ScrollParticles() {
  const ref = useRef<THREE.Points>(null);
  const smooth = usePhaseScroll();

  const positions = useMemo(() => {
    const count = 55;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;

    ref.current.rotation.y = state.clock.elapsedTime * 0.05 + s * 0.4;
    const spread = 1 + s * 1.1;
    ref.current.scale.setScalar(spread);
    ref.current.position.y = s * -1.2;

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.7, 0.35, s);
    mat.size = THREE.MathUtils.lerp(0.06, 0.04, s);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00E5FF"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function ScrollGrid() {
  const ref = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!ref.current) return;
    const s = smooth.current;

    ref.current.position.y = -2.5 - s * 2;
    ref.current.position.z = -4 - s * 4;
    ref.current.scale.setScalar(1 + s * 1.8);

    ref.current.children.forEach((child) => {
      if (child instanceof THREE.LineSegments) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.transparent = true;
        mat.opacity = THREE.MathUtils.lerp(0, 0.25, Math.max(0, (s - 0.02) / 0.98));
      }
    });
  });

  return (
    <group ref={ref} rotation={[Math.PI * 0.5, 0, 0]}>
      <gridHelper args={[24, 24, "#38bdf8", "#1e293b"]} />
    </group>
  );
}

function ScrollLights() {
  const cyan = useRef<THREE.PointLight>(null);
  const purple = useRef<THREE.PointLight>(null);
  const pink = useRef<THREE.PointLight>(null);
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;

    if (cyan.current) {
      cyan.current.intensity = THREE.MathUtils.lerp(1, 0.35, s);
      cyan.current.position.y = THREE.MathUtils.lerp(10, 4, s);
    }
    if (purple.current) {
      purple.current.intensity = THREE.MathUtils.lerp(0.5, 1.1, s);
      purple.current.position.z = THREE.MathUtils.lerp(5, -2, s);
    }
    if (pink.current) {
      pink.current.intensity = THREE.MathUtils.lerp(0.4, 0.9, s);
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight ref={cyan} position={[10, 10, 10]} intensity={1} color="#00E5FF" />
      <pointLight ref={purple} position={[-10, -5, 5]} intensity={0.5} color="#A855F7" />
      <pointLight ref={pink} position={[0, 5, -10]} intensity={0.4} color="#FF3DCE" />
    </>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    const mouseWeight = 1 - s * 0.65;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.22 * mouseWeight + s * 0.35,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.1 * mouseWeight - s * 0.18,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(0, -1.5, s);
  });

  return (
    <group ref={groupRef}>
      <ScrollCamera />
      <ScrollLights />
      <ScrollGrid />

      {BLOCKS.map((block) => (
        <ScrollBlock key={block.color + block.orbit} {...block} />
      ))}

      <ScrollRing rest={[0, 0, -3]} color="#00E5FF" scale={1.2} spin={1} />
      <ScrollRing rest={[1, 2, -4]} color="#A855F7" scale={0.8} spin={-1} />

      <ScrollParticles />
      <ScrollCore />
    </group>
  );
}

export function Hero3D() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 14, 32]} />
      <Scene />
    </PhaseCanvas>
  );
}
