"use client";

import { createContext, useContext } from "react";

export interface SceneStateData {
  mouse: { x: number; y: number };
  scrollProgress: number;
  particleCount: number;
}

export type SceneStateRef = React.MutableRefObject<SceneStateData>;

export const SceneContext = createContext<SceneStateRef | null>(null);

export function useSceneState(): SceneStateRef {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error("useSceneState must be used within SceneContext");
  }
  return ctx;
}
