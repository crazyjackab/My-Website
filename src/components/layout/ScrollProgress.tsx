"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@/context/ThemeContext";
import { levelRoutes } from "@/data/profile";
import { useScrollMetrics } from "@/hooks/useMotion";
import { cn } from "@/lib/utils";

export function ScrollProgress() {
  const t = useTranslations("levels");
  const { recruiterMode } = useTheme();
  const { progressPct, activeLevel } = useScrollMetrics();

  return (
    <div
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      aria-hidden="true"
    >
      <div
        className={cn(
          "font-mono text-[10px] tracking-widest",
          recruiterMode ? "text-slate-500" : "text-neon-cyan/70",
        )}
      >
        {t(levelRoutes[activeLevel]?.labelKey ?? "boot")} · {Math.round(progressPct)}%
      </div>
      <div
        className={cn(
          "h-32 w-1 overflow-hidden rounded-full",
          recruiterMode ? "bg-slate-200" : "bg-white/10",
        )}
      >
        <div
          className={cn(
            "w-full rounded-full transition-[height] duration-150",
            recruiterMode
              ? "bg-gradient-to-b from-blue-600 to-violet-600"
              : "bg-gradient-to-b from-neon-cyan to-neon-purple",
          )}
          style={{ height: `${progressPct}%` }}
        />
      </div>
      {levelRoutes.map((level, i) => (
        <a
          key={level.id}
          href={`#${level.id}`}
          className={cn(
            "font-mono text-[9px] tracking-wider transition-colors",
            i === activeLevel
              ? recruiterMode
                ? "text-blue-700"
                : "text-neon-cyan"
              : recruiterMode
                ? "text-slate-400 hover:text-slate-600"
                : "text-white/30 hover:text-white/60",
          )}
          title={t(level.titleKey)}
        >
          {t(level.labelKey)}
        </a>
      ))}
    </div>
  );
}
