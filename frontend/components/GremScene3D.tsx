"use client";

// 3D voxel GREM: built from plain boxes so it matches the 8-bit brand
// and needs no external model file. Loaded only on the client (see HeroMascot).

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const C = {
  skin: "#5fae3a",
  skinDark: "#3d7a2a",
  hood: "#1b1b24",
  hoodLight: "#2a2a36",
  eye: "#d9ff3a",
  neon: "#00ff66",
  purple: "#9945ff",
  teal: "#14f195",
  dark: "#0a0a0f",
};

type Vec3 = [number, number, number];

function Voxel({
  p,
  s,
  color,
  emissive,
  intensity = 0,
  rot,
}: {
  p: Vec3;
  s: Vec3;
  color: string;
  emissive?: string;
  intensity?: number;
  rot?: Vec3;
}) {
  return (
    <mesh position={p} rotation={rot}>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={intensity}
        flatShading
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

function Goblin() {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent smoothing

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, px * 0.35, k);
      root.current.position.y = Math.sin(t * 1.4) * 0.07;
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, px * 0.55, k);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -py * 0.3, k);
    }
    if (arm.current) {
      arm.current.rotation.z = -0.35 + Math.sin(t * 1.1) * 0.06;
      arm.current.rotation.x = Math.sin(t * 0.9) * 0.05;
    }
  });

  return (
    <group ref={root}>
      {/* body / hoodie */}
      <Voxel p={[0, -1.05, 0]} s={[1.6, 1.7, 1.05]} color={C.hood} />
      <Voxel p={[0, -0.35, 0.02]} s={[1.9, 0.35, 1.2]} color={C.hoodLight} />
      <Voxel p={[0, -1.2, 0.55]} s={[0.9, 0.5, 0.1]} color={C.hoodLight} />
      {/* drawstrings */}
      <Voxel p={[-0.22, -0.75, 0.55]} s={[0.07, 0.5, 0.06]} color="#d8d8e0" />
      <Voxel p={[0.22, -0.75, 0.55]} s={[0.07, 0.5, 0.06]} color="#d8d8e0" />

      {/* head */}
      <group ref={head} position={[0, 0.45, 0]}>
        {/* hood shell */}
        <Voxel p={[0, 0.1, -0.25]} s={[1.6, 1.5, 1.1]} color={C.hood} />
        <Voxel p={[0, 0.72, 0.05]} s={[1.5, 0.35, 1.35]} color={C.hoodLight} />
        <Voxel p={[-0.72, 0.05, 0.1]} s={[0.22, 1.2, 1.0]} color={C.hood} />
        <Voxel p={[0.72, 0.05, 0.1]} s={[0.22, 1.2, 1.0]} color={C.hood} />
        {/* face */}
        <Voxel p={[0, 0, 0.3]} s={[1.15, 1.05, 0.85]} color={C.skin} />
        <Voxel p={[0, -0.42, 0.45]} s={[1.0, 0.25, 0.6]} color={C.skinDark} />
        {/* ears */}
        <Voxel p={[-1.0, 0.18, 0.2]} s={[0.75, 0.22, 0.14]} color={C.skin} rot={[0, 0, 0.45]} />
        <Voxel p={[-1.45, 0.42, 0.2]} s={[0.4, 0.16, 0.12]} color={C.skinDark} rot={[0, 0, 0.7]} />
        <Voxel p={[1.0, 0.18, 0.2]} s={[0.75, 0.22, 0.14]} color={C.skin} rot={[0, 0, -0.45]} />
        <Voxel p={[1.45, 0.42, 0.2]} s={[0.4, 0.16, 0.12]} color={C.skinDark} rot={[0, 0, -0.7]} />
        {/* brows */}
        <Voxel p={[-0.28, 0.27, 0.74]} s={[0.36, 0.09, 0.06]} color={C.skinDark} rot={[0, 0, -0.25]} />
        <Voxel p={[0.28, 0.27, 0.74]} s={[0.36, 0.09, 0.06]} color={C.skinDark} rot={[0, 0, 0.25]} />
        {/* glowing eyes */}
        <Voxel p={[-0.28, 0.1, 0.74]} s={[0.24, 0.13, 0.05]} color={C.eye} emissive={C.eye} intensity={1.6} />
        <Voxel p={[0.28, 0.1, 0.74]} s={[0.24, 0.13, 0.05]} color={C.eye} emissive={C.eye} intensity={1.6} />
        {/* nose + smirk */}
        <Voxel p={[0, -0.08, 0.82]} s={[0.17, 0.3, 0.2]} color={C.skinDark} />
        <Voxel p={[0.04, -0.36, 0.74]} s={[0.55, 0.07, 0.05]} color={C.dark} rot={[0, 0, 0.08]} />
      </group>

      {/* left arm (hand in pocket) */}
      <Voxel p={[-1.08, -0.95, 0.1]} s={[0.4, 1.1, 0.5]} color={C.hood} />
      {/* right arm with magnifier */}
      <group ref={arm} position={[1.0, -0.45, 0.1]}>
        <Voxel p={[0.15, -0.35, 0.2]} s={[0.4, 0.95, 0.45]} color={C.hood} rot={[-0.5, 0, 0]} />
        <Voxel p={[0.15, -0.65, 0.65]} s={[0.3, 0.3, 0.3]} color={C.skin} />
        <group position={[0.15, -0.35, 1.0]}>
          <mesh>
            <torusGeometry args={[0.36, 0.07, 6, 12]} />
            <meshStandardMaterial color="#8892a6" flatShading metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.32, 12]} />
            <meshStandardMaterial
              color={C.teal}
              emissive={C.teal}
              emissiveIntensity={0.6}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Voxel p={[0, -0.5, 0]} s={[0.09, 0.32, 0.09]} color="#8892a6" rot={[0, 0, 0.0]} />
        </group>
      </group>
    </group>
  );
}

const ORBIT_COLORS = [C.neon, C.purple, C.teal, C.neon, C.purple, C.teal];

function OrbitCubes() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      ORBIT_COLORS.map((color, i) => ({
        color,
        angle: (i / ORBIT_COLORS.length) * Math.PI * 2,
        radius: 2.5 + (i % 2) * 0.45,
        y: -0.4 + ((i * 37) % 10) / 6,
        size: 0.18 + (i % 3) * 0.06,
        speed: 0.35 + (i % 3) * 0.08,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const it = items[i];
      const a = it.angle + t * it.speed;
      child.position.set(Math.cos(a) * it.radius, it.y + Math.sin(t * 1.2 + i) * 0.15, Math.sin(a) * it.radius * 0.6);
      child.rotation.x = t * 0.8 + i;
      child.rotation.y = t * 0.6 + i;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i}>
          <boxGeometry args={[it.size, it.size, it.size]} />
          <meshStandardMaterial color={it.color} emissive={it.color} emissiveIntensity={1.1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export default function GremScene3D({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 7], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#e8ffe8" />
      <pointLight position={[-4, 1, 3]} intensity={18} color={C.neon} distance={12} />
      <pointLight position={[4, -1, 2]} intensity={14} color={C.purple} distance={12} />
      <gridHelper args={[14, 28, C.neon, "#0c3a22"]} position={[0, -2.05, 0]} />
      <Goblin />
      <OrbitCubes />
    </Canvas>
  );
}
