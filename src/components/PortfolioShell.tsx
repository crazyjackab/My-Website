"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ThemeContext } from "@/context/ThemeContext";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { initScrollBus, notifyScroll } from "@/lib/scroll-bus";
import {
  APP_EVENTS,
  subscribeAppEvent,
} from "@/lib/app-events";
import {
  getScrollY,
  initHashNavigation,
  setLenisInstance,
} from "@/lib/smooth-scroll";
import { preload3DScene } from "@/lib/preload-3d";
import {
  beginThemeSwitch,
  endThemeSwitch,
  runThemeTransition,
  setRecruiterModeClasses,
  supportsViewTransition,
} from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

const ScrollProgress = dynamic(
  () => import("@/components/layout/ScrollProgress").then((m) => m.ScrollProgress),
  { ssr: false },
);

const ExperienceSection = dynamic(
  () =>
    import("@/components/sections/ExperienceSection").then(
      (m) => m.ExperienceSection,
    ),
);

const ProjectsSection = dynamic(
  () =>
    import("@/components/sections/ProjectsSection").then(
      (m) => m.ProjectsSection,
    ),
);

const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then(
      (m) => m.ContactSection,
    ),
);

const TerminalWidget = dynamic(
  () =>
    import("@/components/terminal/TerminalWidget").then(
      (m) => m.TerminalWidget,
    ),
  { ssr: false },
);

const CommandPalette = dynamic(
  () =>
    import("@/components/ui/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

const MatrixOverlay = dynamic(
  () =>
    import("@/components/effects/MatrixOverlay").then((m) => m.MatrixOverlay),
  { ssr: false },
);

export function PortfolioShell() {
  const t = useTranslations("common");
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    preload3DScene();
    const teardownBus = initScrollBus({ getScrollY });
    const teardownHash = initHashNavigation();
    return () => {
      teardownBus();
      teardownHash();
    };
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setLenisInstance(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);
    document.documentElement.classList.add("lenis", "lenis-smooth");

    const onLenisScroll = () => notifyScroll();
    lenis.on("scroll", onLenisScroll);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.off("scroll", onLenisScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  const handleToggleRecruiter = useCallback(() => {
    const next = !recruiterMode;

    const apply = () => {
      setRecruiterMode(next);
      setRecruiterModeClasses(next);
      if (next) setMatrixMode(false);
    };

    if (supportsViewTransition()) {
      void runThemeTransition(apply);
      return;
    }

    beginThemeSwitch();
    setOverlayVisible(true);

    requestAnimationFrame(() => {
      apply();
      requestAnimationFrame(() => {
        setOverlayVisible(false);
        endThemeSwitch();
      });
    });
  }, [recruiterMode]);

  const handleToggleMatrix = useCallback(() => {
    if (recruiterMode) return;
    setMatrixMode((v) => !v);
  }, [recruiterMode]);

  const handleKonami = useCallback(() => {
    if (recruiterMode) return;
    setMatrixMode(true);
  }, [recruiterMode]);

  useKonamiCode(handleKonami);

  useEffect(() => {
    const unsubMatrix = subscribeAppEvent(APP_EVENTS.TOGGLE_MATRIX, handleToggleMatrix);
    const unsubRecruiter = subscribeAppEvent(APP_EVENTS.TOGGLE_RECRUITER, handleToggleRecruiter);
    const unsubPalette = subscribeAppEvent(APP_EVENTS.OPEN_COMMAND_PALETTE, () =>
      setCommandOpen(true),
    );

    return () => {
      unsubMatrix();
      unsubRecruiter();
      unsubPalette();
    };
  }, [handleToggleMatrix, handleToggleRecruiter]);

  useEffect(() => {
    document.body.classList.toggle("matrix-mode", matrixMode && !recruiterMode);
    return () => document.body.classList.remove("matrix-mode");
  }, [matrixMode, recruiterMode]);

  useEffect(() => {
    if (!matrixMode || recruiterMode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (commandOpen) return;
      if (document.querySelector("[role='dialog'][aria-modal='true']")) return;

      setMatrixMode(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [matrixMode, recruiterMode, commandOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;

      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isEditable && !commandOpen) return;

      e.preventDefault();
      setCommandOpen((open) => !open);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandOpen]);

  return (
    <ThemeContext.Provider value={{ recruiterMode }}>
      <div
        className={cn(
          "theme-crossfade pointer-events-none fixed inset-0 z-[9999]",
          recruiterMode ? "bg-[#f8fafc]" : "bg-[#050508]",
          overlayVisible ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />

      <div className="scanline-overlay scan-sweep grain-overlay" aria-hidden="true" />
      {!recruiterMode && <div className="aurora-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />}
      <MatrixOverlay active={matrixMode && !recruiterMode} />
      {matrixMode && !recruiterMode && (
        <p
          className="pointer-events-none fixed bottom-6 left-1/2 z-[9998] -translate-x-1/2 font-mono text-[10px] tracking-widest text-[#39ff14]/80"
          aria-hidden="true"
        >
          {t("pressEscMatrix")}
        </p>
      )}
      <ParticleBackground active={!recruiterMode} />
      <ScrollProgress />
      <Navbar recruiterMode={recruiterMode} onToggleRecruiter={handleToggleRecruiter} />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onToggleRecruiter={handleToggleRecruiter}
        onToggleMatrix={handleToggleMatrix}
        matrixMode={matrixMode}
      />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
      <div className={cn(recruiterMode && "hidden")} aria-hidden={recruiterMode}>
        <TerminalWidget />
      </div>
    </ThemeContext.Provider>
  );
}
