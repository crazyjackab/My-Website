import type Lenis from "lenis";

const NAVBAR_OFFSET = -64;

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getScrollY(): number {
  if (lenisInstance) return lenisInstance.scroll;
  return typeof window !== "undefined" ? window.scrollY : 0;
}

export function scrollToSection(id: string, options?: { immediate?: boolean }) {
  const el = document.getElementById(id);
  if (!el) return false;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, {
      offset: NAVBAR_OFFSET,
      immediate: options?.immediate,
    });
  } else {
    el.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
  }

  const hash = `#${id}`;
  if (typeof window !== "undefined" && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  return true;
}

export function handleHashLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (!href.startsWith("#") || href.length < 2) return;
  e.preventDefault();
  scrollToSection(href.slice(1));
}

export function initHashNavigation() {
  const scrollFromUrl = () => {
    const id = window.location.hash.slice(1);
    if (id) scrollToSection(id);
  };

  requestAnimationFrame(() => setTimeout(scrollFromUrl, 150));

  const onClick = (e: MouseEvent) => {
    const anchor = (e.target as Element).closest<HTMLAnchorElement>(
      "a[href^='#']",
    );
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;

    e.preventDefault();
    scrollToSection(href.slice(1));
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
