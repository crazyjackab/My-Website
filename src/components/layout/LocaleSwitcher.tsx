"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { recruiterMode } = useTheme();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "flex rounded border font-mono text-[10px] tracking-wider",
        recruiterMode ? "border-slate-200" : "border-white/10",
        className,
      )}
      role="group"
      aria-label="Language switcher"
    >
      {(["zh", "en"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            "px-2.5 py-1.5 transition-colors",
            locale === code
              ? recruiterMode
                ? "bg-blue-600 text-white"
                : "bg-neon-cyan/15 text-neon-cyan"
              : recruiterMode
                ? "text-slate-500 hover:text-blue-700"
                : "text-text-muted hover:text-neon-cyan",
          )}
          aria-pressed={locale === code}
        >
          {code === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </div>
  );
}
