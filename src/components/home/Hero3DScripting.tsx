"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const CODE_SNIPPETS = [
  "local RS = game:GetService('RunService')",
  "function onHeartbeat(dt)",
  "  char.Humanoid.WalkSpeed = speed",
  "end",
  "RS.Heartbeat:Connect(onHeartbeat)",
  "module.exports = Controller",
  "if not player then return end",
  "RemoteEvent:FireServer(data)",
  "TweenService:Create(part, info, goal)",
  "CollectionService:GetTagged('Door')",
];

const COLUMN_COUNT = 14;

function ScriptingCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame(() => {
    const s = smooth.current;
    camera.position.z = THREE.MathUtils.lerp(9, 11, s);
    camera.position.y = THREE.MathUtils.lerp(0, -0.4, s);
    camera.lookAt(0, s * -0.3, -2);
  });

  return null;
}

function CodeColumn({ x, z, offset }: { x: number; z: number; offset: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const snippet = CODE_SNIPPETS[offset % CODE_SNIPPETS.length];
  const lines = snippet.split(" ");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.35 + offset;
    groupRef.current.position.y = ((t * 0.6) % 6) - 3;
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {lines.map((word, i) => (
        <Text
          key={i}
          position={[0, -i * 0.35, 0]}
          fontSize={0.14}
          color={i % 3 === 0 ? "#22d3ee" : "#4ade80"}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.55 - i * 0.04}
        >
          {word}
        </Text>
      ))}
    </group>
  );
}

function MatrixGrid() {
  const ref = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!ref.current) return;
    const s = smooth.current;
    ref.current.position.y = -2.5 - s * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -1]}>
      <planeGeometry args={[18, 18, 18, 18]} />
      <meshBasicMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function FloatingBrackets() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime * 0.4 + i * 1.2;
      mesh.position.set(
        Math.cos(t) * (2.5 + i * 0.3),
        Math.sin(t * 0.7) * 1.2 + s * 0.2,
        Math.sin(t) * 1.5 - 3
      );
      mesh.rotation.y = t * 0.5;
    });
  });

  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <boxGeometry args={[0.5, 0.5, 0.08]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            metalness={0.4}
            roughness={0.3}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
}

function ScriptingScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseRef } = useSceneInteraction();
  const smooth = usePhaseScroll();

  const columns = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }).map((_, i) => {
      const angle = (i / COLUMN_COUNT) * Math.PI * 2;
      const radius = 3.5 + (i % 3) * 0.4;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius * 0.35 - 2,
        offset: i,
      };
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = smooth.current;
    const { x, y } = mouseRef.current;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.12 + s * 0.08,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.05,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <ScriptingCamera />
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 3]} intensity={0.7} color="#22d3ee" />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#4ade80" />

      <MatrixGrid />
      <FloatingBrackets />

      {columns.map((col) => (
        <CodeColumn key={col.offset} {...col} />
      ))}
    </group>
  );
}

export function Hero3DScripting() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0, 9], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 10, 24]} />
      <ScriptingScene />
    </PhaseCanvas>
  );
}
