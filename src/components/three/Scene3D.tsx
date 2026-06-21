"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { WireframeShapes } from "./WireframeShapes";
import { InfiniteGrid } from "./InfiniteGrid";
import { SceneContext, type SceneStateRef } from "./SceneContext";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { scrollMetricsRef } from "@/lib/scroll-bus";

function CameraController({ stateRef }: { stateRef: SceneStateRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const { mouse } = stateRef.current;
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(mouse.x * 0.5, mouse.y * 0.3, 0);
  });

  return null;
}

interface SceneContentProps {
  stateRef: SceneStateRef;
  particleCount: number;
  isMobile: boolean;
}

function SceneContent({ stateRef, particleCount, isMobile }: SceneContentProps) {
  return (
    <>
      <fog attach="fog" args={["#050508", 12, 35]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#00f0ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#a855f7" />
      <ParticleField count={particleCount} />
      {!isMobile && <WireframeShapes />}
      <InfiniteGrid />
      <CameraController stateRef={stateRef} />
    </>
  );
}

function ScrollSync({ stateRef }: { stateRef: SceneStateRef }) {
  useFrame(() => {
    stateRef.current.scrollProgress = scrollMetricsRef.current.progress;
  });
  return null;
}

interface Scene3DProps {
  stateRef: SceneStateRef;
  particleCount: number;
  paused?: boolean;
}

export function Scene3D({ stateRef, particleCount, paused = false }: Scene3DProps) {
  const isMobile = particleCount <= 600;
  const pageVisible = usePageVisibility();
  const shouldRender = pageVisible && !paused;

  return (
    <SceneContext.Provider value={stateRef}>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        frameloop={shouldRender ? "always" : "never"}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ScrollSync stateRef={stateRef} />
        <SceneContent
          stateRef={stateRef}
          particleCount={particleCount}
          isMobile={isMobile}
        />
      </Canvas>
    </SceneContext.Provider>
  );
}
