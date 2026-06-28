"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";

const CHAIN_LINKS = 14;

function Phase4Camera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(12, 9, s);
    camera.position.y = THREE.MathUtils.lerp(0.8, -0.6, s);
    camera.position.x = THREE.MathUtils.lerp(0, Math.cos(s * Math.PI * 1.5) * 1.2, s);
    camera.lookAt(0, s * 0.15, s * -0.5);
  });

  return null;
}

function CapsuleChain() {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.35;

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const progress = i / CHAIN_LINKS;
      const angle = progress * Math.PI * 4 + t;
      const helixR = 1.8 + s * 0.6;

      child.position.set(
        Math.cos(angle) * helixR,
        progress * 5 - 2.5 + Math.sin(t + i * 0.4) * 0.15 + s * 0.4,
        Math.sin(angle) * helixR - s * 2
      );
      child.rotation.x = angle;
      child.rotation.z = progress * Math.PI * 2 + t * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: CHAIN_LINKS }).map((_, i) => (
        <mesh key={i} scale={[0.35, 0.55, 0.35]}>
          <capsuleGeometry args={[0.35, 0.6, 6, 12]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#2dd4bf" : "#6ee7b7"}
            emissive={i % 3 === 0 ? "#059669" : "#14b8a6"}
            emissiveIntensity={0.35}
            metalness={0.65}
            roughness={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

function Phase4Cylinders() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const angle = (i / 4) * Math.PI * 2 + state.clock.elapsedTime * 0.25;
      mesh.position.set(
        Math.cos(angle) * 3.5,
        Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.6 - 0.5,
        Math.sin(angle) * 1.2 - 3 - s * 1.8
      );
      mesh.rotation.x = state.clock.elapsedTime * 0.3 + i;
      mesh.rotation.z = angle;
      mesh.scale.setScalar(0.5 + s * 0.2);
    });
  });

  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <cylinderGeometry args={[0.6, 0.6, 1.8, 6, 1, true]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={0.55}
            metalness={0.5}
            roughness={0.2}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
}

function CubeCloud() {
  const ref = useRef<THREE.Points>(null);
  const smooth = usePhaseScroll();

  const positions = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const half = 2.5;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * half * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * half * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * half * 2 - 1;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.rotation.y = state.clock.elapsedTime * 0.06 + s * 0.25;
    ref.current.position.y = 1.5 - s * 1.2;
    ref.current.position.z = -1 - s * 1.5;
    ref.current.scale.setScalar(1 + s * 0.5);

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.55, 0.3, s);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#6ee7b7"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

function Phase4Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.14 + s * 0.18,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.06 - s * 0.08,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Phase4Camera />
      <ambientLight intensity={0.18} />
      <pointLight position={[5, 6, 4]} intensity={0.8} color="#34d399" />
      <pointLight position={[-4, -2, 3]} intensity={0.5} color="#2dd4bf" />

      <CapsuleChain />
      <Phase4Cylinders />
      <CubeCloud />
    </group>
  );
}

export function Hero3DPhase4() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.8, 12], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 14, 32]} />
      <Phase4Scene />
    </Canvas>
  );
}
