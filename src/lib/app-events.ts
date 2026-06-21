export const APP_EVENTS = {
  TOGGLE_MATRIX: "portfolio:toggle-matrix",
  TOGGLE_RECRUITER: "portfolio:toggle-recruiter",
  OPEN_COMMAND_PALETTE: "portfolio:open-command-palette",
} as const;

export function dispatchAppEvent(name: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name));
}

export function subscribeAppEvent(name: string, handler: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}
