import { levelRoutes } from "@/data/profile";

export interface ScrollMetrics {
  progress: number;
  progressPct: number;
  scrollY: number;
  activeLevel: number;
  scrolled: boolean;
}

const DEFAULT: ScrollMetrics = {
  progress: 0,
  progressPct: 0,
  scrollY: 0,
  activeLevel: 0,
  scrolled: false,
};

/** Shared ref for imperative reads (Three.js, no React re-render). */
export const scrollMetricsRef: { current: ScrollMetrics } = { current: DEFAULT };

type Listener = (metrics: ScrollMetrics) => void;

const listeners = new Set<Listener>();
let rafId: number | null = null;
let getScrollY: () => number = () =>
  typeof window !== "undefined" ? window.scrollY : 0;

function computeMetrics(): ScrollMetrics {
  const scrollY = getScrollY();
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollY / docHeight : 0;

  const scrollPos = scrollY + window.innerHeight * 0.4;
  let activeLevel = 0;
  for (let i = 0; i < levelRoutes.length; i++) {
    const el = document.getElementById(levelRoutes[i].id);
    if (el && el.offsetTop <= scrollPos) activeLevel = i;
  }

  return {
    progress,
    progressPct: progress * 100,
    scrollY,
    activeLevel,
    scrolled: scrollY > 40,
  };
}

export function notifyScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const next = computeMetrics();
    const prev = scrollMetricsRef.current;
    scrollMetricsRef.current = next;

    if (
      Math.round(prev.progressPct) === Math.round(next.progressPct) &&
      prev.activeLevel === next.activeLevel &&
      prev.scrolled === next.scrolled
    ) {
      return;
    }

    listeners.forEach((fn) => fn(next));
  });
}

export function subscribeScroll(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initScrollBus(options?: { getScrollY?: () => number }) {
  if (options?.getScrollY) getScrollY = options.getScrollY;

  notifyScroll();

  window.addEventListener("scroll", notifyScroll, { passive: true });
  window.addEventListener("resize", notifyScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", notifyScroll);
    window.removeEventListener("resize", notifyScroll);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
