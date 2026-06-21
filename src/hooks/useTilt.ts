"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseTiltOptions {
  maxTilt?: number;
  scale?: number;
  enabled?: boolean;
}

export function useTilt<T extends HTMLElement = HTMLDivElement>(
  options: UseTiltOptions = {},
): RefObject<T | null> {
  const { maxTilt = 10, scale = 1.02, enabled = true } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale3d(${scale}, ${scale}, ${scale})`;
        el.classList.add("tilt-active");
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      el.style.transform = "";
      el.classList.remove("tilt-active");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
      el.classList.remove("tilt-active");
    };
  }, [enabled, maxTilt, scale]);

  return ref;
}
