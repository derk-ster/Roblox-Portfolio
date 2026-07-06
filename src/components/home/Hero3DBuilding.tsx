"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { useSceneInteraction } from "./scene-context";
import { usePhaseScroll } from "./usePhaseScroll";
import { PhaseCanvas } from "./PhaseCanvas";

const BLOCK_COLORS = ["#fb923c", "#f97316", "#fdba74", "#ea580c", "#fbbf24"];
const STACK_LAYERS = 5;
const CYCLE = 6;

function BuildingCamera() {
  const { camera } = useThree();
  const smooth = usePhaseScroll();

  useFrame((state) => {
    const s = smooth.current;
    const t = state.clock.elapsedTime * 0.06;
    camera.position.z = THREE.MathUtils.lerp(11, 9.5, s);
    camera.position.y = THREE.MathUtils.lerp(0.5, 0.2, s) + Math.sin(t) * 0.05;
    camera.position.x = Math.sin(t * 0.5) * 0.4;
    camera.lookAt(0, 0.5, -1);
  });

  return null;
}

function BlockStack() {
  const blocks: { y: number; color: string }[] = [];
  for (let i = 0; i < STACK_LAYERS; i++) {
    blocks.push({ y: i * 0.55 - 1.2, color: BLOCK_COLORS[i % BLOCK_COLORS.length] });
  }

  return (
    <group position={[0, 0, -1]}>
      {blocks.map((block, i) => (
        <mesh key={i} position={[0, block.y, 0]}>
          <boxGeometry args={[1.1, 0.5, 1.1]} />
          <meshStandardMaterial
            color={block.color}
            emissive={block.color}
            emissiveIntensity={0.2}
            metalness={0.25}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

function Crane() {
  const craneRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);
  const cableRef = useRef<THREE.Mesh>(null);
  const smooth = usePhaseScroll();

  useFrame((state) => {
    if (!craneRef.current || !armRef.current || !hookRef.current || !blockRef.current || !cableRef.current) return;

    const t = state.clock.elapsedTime;
    const s = smooth.current;
    const phase = (t % CYCLE) / CYCLE;

    // Crane arm sweeps slowly
    const armAngle = THREE.MathUtils.lerp(-0.5, 0.35, Math.sin(phase * Math.PI * 2) * 0.5 + 0.5);
    armRef.current.rotation.z = armAngle;

    // Hook descends, places block, rises
    let hookY = 2.8;
    let blockVisible = 1;
    let blockY = 0;

    if (phase < 0.25) {
      const p = phase / 0.25;
      hookY = THREE.MathUtils.lerp(2.8, 0.6, p);
      blockY = hookY - 0.55;
    } else if (phase < 0.35) {
      hookY = 0.6;
      blockY = hookY - 0.55;
      blockVisible = 1 - (phase - 0.25) / 0.1;
    } else if (phase < 0.55) {
      const p = (phase - 0.35) / 0.2;
      hookY = THREE.MathUtils.lerp(0.6, 2.8, p);
      blockVisible = 0;
    } else {
      hookY = 2.8;
      blockVisible = 0;
    }

    hookRef.current.position.y = hookY;
    blockRef.current.position.y = blockY;
    blockRef.current.visible = blockVisible > 0.05;
    blockRef.current.scale.setScalar(blockVisible);

    const cableHeight = hookY - 2.8;
    cableRef.current.position.y = 2.8 + cableHeight / 2;
    cableRef.current.scale.y = Math.max(0.01, Math.abs(cableHeight));

    craneRef.current.position.x = THREE.MathUtils.lerp(-0.3, 0.2, s);
  });

  return (
    <group ref={craneRef} position={[2.5, 0, -1]}>
      {/* Mast */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.2, 3.2, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rotating arm */}
      <group ref={armRef} position={[0, 2.8, 0]}>
        <mesh position={[-1.8, 0, 0]}>
          <boxGeometry args={[3.6, 0.18, 0.18]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.3} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[-3.2, -0.1, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Cable */}
        <mesh ref={cableRef} position={[0, 0, 0]}>
          <boxGeometry args={[0.03, 1, 0.03]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Hook + block */}
        <group ref={hookRef} position={[-3.2, 2.8, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.1]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh ref={blockRef} position={[0, -0.55, 0]}>
            <boxGeometry args={[1.1, 0.5, 1.1]} />
            <meshStandardMaterial
              color="#fb923c"
              emissive="#f97316"
              emissiveIntensity={0.35}
              metalness={0.25}
              roughness={0.4}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GroundPlate() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, -1]}>
      <planeGeometry args={[8, 6]} />
      <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

function BuildingScene() {
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
      <BuildingCamera />
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 8, 4]} intensity={0.7} color="#fdba74" />
      <pointLight position={[-3, 3, 2]} intensity={0.35} color="#fb923c" />

      <GroundPlate />
      <BlockStack />
      <Crane />
    </group>
  );
}

export function Hero3DBuilding() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <PhaseCanvas
      camera={{ position: [0, 0.5, 11], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <fog attach="fog" args={["#050816", 12, 28]} />
      <BuildingScene />
    </PhaseCanvas>
  );
}
