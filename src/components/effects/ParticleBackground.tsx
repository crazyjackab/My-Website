"use client";

import { useEffect, useRef, useState } from "react";
import { Scene3D } from "@/components/three/Scene3D";
import type { SceneStateData } from "@/components/three/SceneContext";
import { useIsMobile, useReducedMotion } from "@/hooks/useMotion";
import { cn } from "@/lib/utils";

interface ParticleBackgroundProps {
  /** When false, hide and pause rendering but keep the WebGL context warm. */
  active?: boolean;
}

export function ParticleBackground({ active = true }: ParticleBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 350 : 1000;
  const [sceneReady, setSceneReady] = useState(false);

  const stateRef = useRef<SceneStateData>({
    mouse: { x: 0, y: 0 },
    scrollProgress: 0,
    particleCount,
  });

  useEffect(() => {
    if (!reducedMotion) setSceneReady(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (!sceneReady) return;

    const onMove = (e: MouseEvent) => {
      stateRef.current.mouse = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [sceneReady]);

  useEffect(() => {
    stateRef.current.particleCount = particleCount;
  }, [particleCount]);

  if (!sceneReady) return null;

  return (
    <div
      className={cn(
        "particle-canvas pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 ease-out",
        active ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!active}
    >
      <Scene3D
        stateRef={stateRef}
        particleCount={particleCount}
        paused={!active}
      />
    </div>
  );
}
