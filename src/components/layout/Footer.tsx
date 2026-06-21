"use client";

import { useTranslations } from "next-intl";
import { social } from "@/data/profile";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Github, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const { profile } = useLocalizedContent();
  const { recruiterMode } = useTheme();

  return (
    <footer
      className={cn(
        "border-t py-12",
        recruiterMode
          ? "border-slate-200 bg-white"
          : "border-white/5 bg-bg-secondary/50",
      )}
    >
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p
              className={cn(
                "font-mono text-xs",
                recruiterMode ? "text-blue-600" : "text-neon-cyan/60",
              )}
            >
              {t("builtWith")}
            </p>
            <p className="mt-1 font-mono text-xs text-text-muted">
              {t("rights", { year: new Date().getFullYear(), name: profile.name })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "transition-colors",
                recruiterMode
                  ? "text-slate-500 hover:text-blue-700"
                  : "text-text-muted hover:text-neon-cyan",
              )}
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={social.email}
              className={cn(
                "transition-colors",
                recruiterMode
                  ? "text-slate-500 hover:text-blue-700"
                  : "text-text-muted hover:text-neon-cyan",
              )}
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {!recruiterMode && (
          <div className="mt-8 rounded border border-white/5 bg-black/30 p-4 font-mono text-[11px] text-neon-green/60">
            <p>{t("commit")}</p>
            <p>{t("status")}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
