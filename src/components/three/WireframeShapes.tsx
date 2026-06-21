"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneState } from "./SceneContext";

interface WireShapeProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotationSpeed: number;
  color: string;
  scale?: number;
}

function WireShape({ geometry, position, rotationSpeed, color, scale = 1 }: WireShapeProps) {
  const ref = useRef<THREE.Mesh>(null);
  const stateRef = useSceneState();

  useFrame((state) => {
    if (!ref.current) return;
    const { mouse } = stateRef.current;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * rotationSpeed + mouse.y * 0.3;
    ref.current.rotation.y = t * rotationSpeed * 0.7 + mouse.x * 0.4;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
    </mesh>
  );
}

const icosahedron = new THREE.IcosahedronGeometry(1.2, 0);
const octahedron = new THREE.OctahedronGeometry(0.9, 0);
const tetrahedron = new THREE.TetrahedronGeometry(0.7, 0);

export function WireframeShapes() {
  return (
    <group>
      <WireShape
        geometry={icosahedron}
        position={[-4, 1.5, -3]}
        rotationSpeed={0.15}
        color="#00f0ff"
        scale={1.1}
      />
      <WireShape
        geometry={octahedron}
        position={[4.5, -1, -4]}
        rotationSpeed={0.2}
        color="#a855f7"
      />
      <WireShape
        geometry={tetrahedron}
        position={[0, 2.5, -6]}
        rotationSpeed={0.25}
        color="#ff00aa"
        scale={0.9}
      />
    </group>
  );
}
