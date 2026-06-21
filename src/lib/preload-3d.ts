let preloaded = false;

/** Warm the Three.js chunk as early as possible so geek mode appears instantly. */
export function preload3DScene(): void {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  void import("@/components/effects/ParticleBackground");
}
