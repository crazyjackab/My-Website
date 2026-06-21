"use client";

import { useEffect, useState } from "react";
import {
  scrollMetricsRef,
  subscribeScroll,
  type ScrollMetrics,
} from "@/lib/scroll-bus";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return mobile;
}

/** Subscribe to throttled scroll metrics (single shared bus). */
export function useScrollMetrics(): ScrollMetrics {
  const [metrics, setMetrics] = useState<ScrollMetrics>(scrollMetricsRef.current);

  useEffect(() => subscribeScroll(setMetrics), []);

  return metrics;
}

/** @deprecated Use scrollMetricsRef for imperative reads or useScrollMetrics for React state. */
export function useScrollProgress() {
  const { progress } = useScrollMetrics();
  return progress;
}
