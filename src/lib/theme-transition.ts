import { flushSync } from "react-dom";

const SWITCH_CLASS = "theme-switching";

export function supportsViewTransition(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

export function beginThemeSwitch(): void {
  document.documentElement.classList.add(SWITCH_CLASS);
}

export function endThemeSwitch(): void {
  document.documentElement.classList.remove(SWITCH_CLASS);
}

export async function runThemeTransition(update: () => void): Promise<void> {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !supportsViewTransition()) {
    beginThemeSwitch();
    update();
    requestAnimationFrame(() => endThemeSwitch());
    return;
  }

  beginThemeSwitch();

  const transition = (
    document as Document & {
      startViewTransition: (callback: () => void) => { finished: Promise<void> };
    }
  ).startViewTransition(() => {
    flushSync(update);
  });

  try {
    await transition.finished;
  } finally {
    endThemeSwitch();
  }
}

export function setRecruiterModeClasses(enabled: boolean): void {
  document.body.classList.toggle("recruiter-mode", enabled);
  document.documentElement.classList.toggle("recruiter-mode", enabled);
}
