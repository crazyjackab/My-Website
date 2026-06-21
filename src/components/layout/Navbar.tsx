"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { handle, navRoutes } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useScrollMetrics } from "@/hooks/useMotion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  recruiterMode: boolean;
  onToggleRecruiter: () => void;
}

export function Navbar({ recruiterMode, onToggleRecruiter }: NavbarProps) {
  const t = useTranslations("nav");
  const { profile } = useLocalizedContent();
  const { recruiterMode: isRecruiter } = useTheme();
  const { scrolled } = useScrollMetrics();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? isRecruiter
            ? "border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm"
            : "border-b border-neon-cyan/10 bg-bg-primary/80 backdrop-blur-xl"
          : isRecruiter
            ? "bg-white/60 backdrop-blur-sm"
            : "bg-transparent",
      )}
    >
      <nav className="section-container flex h-16 items-center justify-between" aria-label={t("ariaMain")}>
        <a
          href="#hero"
          className={cn(
            "group flex items-center gap-2 font-mono text-sm",
            isRecruiter ? "text-blue-700" : "text-neon-cyan",
          )}
        >
          <span className={isRecruiter ? "text-violet-600" : "text-neon-magenta"}>{"{"}</span>
          <span className="group-hover:animate-pulse">{getInitials(profile.displayName)}</span>
          <span className={isRecruiter ? "text-violet-600" : "text-neon-magenta"}>{"}"}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navRoutes.map((item) => {
            const label = t(item.key);
            const className = cn(
              "group relative px-3 py-2 font-mono text-xs tracking-wider transition-colors",
              isRecruiter
                ? "text-slate-600 hover:text-blue-700"
                : "text-text-muted hover:text-neon-cyan",
            );

            return (
              <li key={item.href}>
                {item.href.startsWith("/") ? (
                  <Link href={item.href} className={className}>
                    <span className={cn("mr-1", isRecruiter ? "text-violet-400" : "text-neon-purple/50")}>
                      {item.icon}
                    </span>
                    {label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px scale-x-0 transition-transform group-hover:scale-x-100",
                        isRecruiter ? "bg-blue-600" : "bg-neon-cyan",
                      )}
                    />
                  </Link>
                ) : (
                  <a href={item.href} className={className}>
                    <span className={cn("mr-1", isRecruiter ? "text-violet-400" : "text-neon-purple/50")}>
                      {item.icon}
                    </span>
                    {label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px scale-x-0 transition-transform group-hover:scale-x-100",
                        isRecruiter ? "bg-blue-600" : "bg-neon-cyan",
                      )}
                    />
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <button
            type="button"
            onClick={onToggleRecruiter}
            className={cn(
              "hidden rounded border px-3 py-1.5 font-mono text-[10px] tracking-wider transition-all sm:block",
              recruiterMode
                ? "border-violet-300 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100"
                : "border-neon-cyan/30 text-neon-cyan/80 hover:border-neon-cyan hover:text-neon-cyan",
            )}
          >
            {recruiterMode ? t("geek") : t("recruiter")}
          </button>

          <button
            type="button"
            className={cn(
              "rounded border p-2 md:hidden",
              isRecruiter ? "border-slate-200 text-slate-600" : "border-white/10 text-white/70",
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className={cn(
            "border-t backdrop-blur-xl md:hidden",
            isRecruiter ? "border-slate-200 bg-white/95" : "border-white/10 bg-bg-primary/95",
          )}
        >
          <ul className="section-container flex flex-col gap-1 py-4">
            {navRoutes.map((item) => (
              <li key={item.href}>
                {item.href.startsWith("/") ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 font-mono text-sm text-text-muted hover:text-neon-cyan"
                  >
                    <span className="mr-2 text-neon-purple/50">{item.icon}</span>
                    {t(item.key)}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 font-mono text-sm text-text-muted hover:text-neon-cyan"
                  >
                    <span className="mr-2 text-neon-purple/50">{item.icon}</span>
                    {t(item.key)}
                  </a>
                )}
              </li>
            ))}
            <li className="py-2">
              <LocaleSwitcher />
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  onToggleRecruiter();
                  setMobileOpen(false);
                }}
                className="py-2 font-mono text-sm text-neon-cyan"
              >
                {t("toggleMode", {
                  mode: recruiterMode ? t("geekMode") : t("cleanMode"),
                })}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
