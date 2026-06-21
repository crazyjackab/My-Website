"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneState } from "./SceneContext";
import { createParticleData, updateParticlePositions } from "./particleUtils";

interface ParticleFieldProps {
  count: number;
}

export function ParticleField({ count }: ParticleFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useSceneState();
  const frameRef = useRef(0);

  const { pointGeometry, basePositions } = useMemo(() => {
    const { positions, colors, basePositions: base } = createParticleData(count);

    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    points.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return { pointGeometry: points, basePositions: base };
  }, [count]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    frameRef.current += 1;
    const isMobile = count <= 600;
    if (isMobile && frameRef.current % 2 !== 0) {
      const { mouse } = stateRef.current;
      group.rotation.y = state.clock.elapsedTime * 0.04 + mouse.x * 0.15;
      group.rotation.x = mouse.y * 0.08;
      return;
    }

    const { mouse, scrollProgress } = stateRef.current;
    const posAttr = pointGeometry.attributes.position as THREE.BufferAttribute;
    const spread = 1 + scrollProgress * 0.8;
    const time = state.clock.elapsedTime;

    updateParticlePositions(
      basePositions,
      posAttr.array as Float32Array,
      count,
      spread,
      time,
    );
    posAttr.needsUpdate = true;

    group.rotation.y = time * 0.04 + mouse.x * 0.15;
    group.rotation.x = mouse.y * 0.08;
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointGeometry} frustumCulled={false}>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
