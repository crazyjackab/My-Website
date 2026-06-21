"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollMetricsRef } from "@/lib/scroll-bus";

export function InfiniteGrid() {
  const ref = useRef<THREE.GridHelper>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useFrame((state) => {
    const grid = ref.current;
    if (!grid) return;

    grid.position.z = (state.clock.elapsedTime * 0.3) % 2;

    const opacity = Math.max(0.06, 0.15 - scrollMetricsRef.current.progress * 0.08);

    if (materialsRef.current.length === 0) {
      materialsRef.current = Array.isArray(grid.material)
        ? grid.material
        : [grid.material];
    }

    for (const mat of materialsRef.current) {
      mat.transparent = true;
      mat.opacity = opacity;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[40, 40, "#00f0ff", "#0a1a2e"]}
      position={[0, -6, 0]}
    />
  );
}
