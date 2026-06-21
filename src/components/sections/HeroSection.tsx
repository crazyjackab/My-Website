"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { resumeUrl, social } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { cn } from "@/lib/utils";
import { ArrowDown, Download, Github } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");
  const { profile } = useLocalizedContent();
  const { recruiterMode } = useTheme();
  const [bootDone, setBootDone] = useState(false);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);

  const bootLines = useMemo(
    () =>
      (t.raw("boot") as string[]).map((line) =>
        line.replace("{name}", profile.displayName.toUpperCase()),
      ),
    [t, profile.displayName],
  );

  useEffect(() => {
    if (recruiterMode) {
      setSkipped(true);
      setBootDone(true);
      return;
    }

    if (skipped) {
      setVisibleLines(bootLines);
      setBootDone(true);
      return;
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < bootLines.length) {
        setVisibleLines((prev) => [...prev, bootLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [skipped, recruiterMode, bootLines]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16"
    >
      <div className="relative z-10 w-full max-w-4xl">
        {!bootDone && !recruiterMode && (
          <div className="cyber-panel mb-8 rounded-lg border border-neon-green/20 bg-black/60 p-4 font-mono text-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <button
                type="button"
                onClick={() => setSkipped(true)}
                className="text-[10px] text-text-muted hover:text-neon-cyan"
              >
                {t("skip")}
              </button>
            </div>
            <div className="space-y-1 text-neon-green/80">
              {visibleLines.map((line, i) => (
                <p key={i} className="animate-pulse">{line}</p>
              ))}
              {!bootDone && visibleLines.length < bootLines.length && (
                <span className="cursor-blink inline-block" />
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "transition-all duration-700",
            bootDone || recruiterMode ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <p className="section-label mb-4">// system.identity</p>

          <h1
            className={cn(
              "font-display text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight tracking-wider",
              !recruiterMode && "glitch-text",
            )}
          >
            <span className="gradient-text">{profile.displayName}</span>
          </h1>

          <p
            className={cn(
              "mt-4 font-mono text-lg md:text-xl",
              recruiterMode ? "text-slate-700" : "text-neon-cyan/90",
            )}
          >
            <span className={recruiterMode ? "text-green-700" : "text-neon-green"}>&gt;</span>{" "}
            {profile.title}
          </p>

          <p className={cn("mt-3 max-w-xl font-mono text-sm md:text-base", recruiterMode ? "text-slate-600" : "text-text-muted")}>
            {profile.slogan}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#projects">{t("viewProjects")}</Button>
            <Button variant="secondary" href={resumeUrl} download>
              <Download size={14} />
              {t("resume")}
            </Button>
            <Button variant="ghost" href={social.github} target="_blank" rel="noopener noreferrer">
              <Github size={14} />
              GitHub
            </Button>
          </div>

          {!recruiterMode && (
            <div className="cyber-panel mt-12 rounded-lg border border-neon-cyan/15 bg-black/40 p-4 font-mono text-sm backdrop-blur-sm">
              <p className="text-neon-green/70">
                <span className="text-neon-magenta">$</span> {t("terminalHint")}
                <span className="cursor-blink" />
              </p>
              <p className="mt-1 text-[11px] text-text-muted">{t("terminalTry")}</p>
            </div>
          )}
        </div>
      </div>

      <a
        href="#about"
        className={cn(
          "absolute bottom-8 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] transition-opacity",
          bootDone || recruiterMode ? "opacity-100" : "opacity-0",
          recruiterMode ? "text-slate-400" : "text-neon-cyan/50",
        )}
        aria-label="Scroll down"
      >
        <span>{recruiterMode ? t("scrollDown") : t("scrollInit")}</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}
