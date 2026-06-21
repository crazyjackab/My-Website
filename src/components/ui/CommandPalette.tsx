"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { navRoutes, resumeUrl, social, email } from "@/data/profile";
import { useRouter } from "@/i18n/navigation";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { scrollToSection } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import {
  Command,
  Download,
  ExternalLink,
  Github,
  LayoutGrid,
  Mail,
  Moon,
  Sun,
  Terminal,
  Zap,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  keywords?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onToggleRecruiter: () => void;
  onToggleMatrix: () => void;
  matrixMode: boolean;
}

export function CommandPalette({
  open,
  onClose,
  onToggleRecruiter,
  onToggleMatrix,
  matrixMode,
}: CommandPaletteProps) {
  const t = useTranslations("commandPalette");
  const tNav = useTranslations("nav");
  const { profile, projects } = useLocalizedContent();
  const router = useRouter();
  const { recruiterMode } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<CommandItem[]>(
    () => [
      ...navRoutes.map((item) => ({
        id: `nav-${item.href}`,
        label: t("goTo", { label: tNav(item.key) }),
        hint: item.href,
        icon: <LayoutGrid size={14} />,
        keywords: [item.key, item.href.replace("#", "")],
        action: () => {
          if (item.href.startsWith("/")) {
            router.push(item.href);
            onClose();
            return;
          }
          scrollToSection(item.href.slice(1));
          onClose();
        },
      })),
      ...projects
        .filter((p) => p.featured)
        .map((p) => ({
          id: `project-${p.slug}`,
          label: t("project", { title: p.title }),
          hint: `/projects/${p.slug}`,
          icon: <Zap size={14} />,
          keywords: [p.title, p.slug, ...p.tags],
          action: () => {
            router.push(`/projects/${p.slug}`);
            onClose();
          },
        })),
      {
        id: "toggle-recruiter",
        label: recruiterMode ? t("switchGeek") : t("switchRecruiter"),
        hint: t("modeHint"),
        icon: recruiterMode ? <Moon size={14} /> : <Sun size={14} />,
        keywords: ["recruiter", "geek", "mode"],
        action: () => {
          onToggleRecruiter();
          onClose();
        },
      },
      {
        id: "toggle-matrix",
        label: matrixMode ? t("matrixDisable") : t("matrixEnable"),
        hint: t("matrixHint"),
        icon: <Terminal size={14} />,
        keywords: ["matrix", "konami", "easter egg"],
        action: () => {
          onToggleMatrix();
          onClose();
        },
      },
      {
        id: "blog",
        label: t("openBlog"),
        hint: "/blog",
        icon: <LayoutGrid size={14} />,
        keywords: ["blog", "mdx", "notes"],
        action: () => {
          router.push("/blog");
          onClose();
        },
      },
      {
        id: "github",
        label: t("openGithub"),
        hint: social.github,
        icon: <Github size={14} />,
        keywords: ["github", "code", "repo"],
        action: () => {
          window.open(social.github, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "email",
        label: t("sendEmail"),
        hint: email,
        icon: <Mail size={14} />,
        keywords: ["email", "mail", "contact"],
        action: () => {
          scrollToSection("contact");
          onClose();
        },
      },
      {
        id: "resume",
        label: t("downloadResume"),
        hint: "PDF",
        icon: <Download size={14} />,
        keywords: ["resume", "cv", "pdf"],
        action: () => {
          window.open(resumeUrl, "_blank");
          onClose();
        },
      },
      {
        id: "terminal-hint",
        label: t("openTerminal"),
        hint: t("terminalHint"),
        icon: <Command size={14} />,
        keywords: ["terminal", "cli", "shell"],
        action: () => {
          onClose();
        },
      },
    ],
    [matrixMode, onClose, onToggleMatrix, onToggleRecruiter, projects, recruiterMode, router, t, tNav],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [items, query]);

  const runItem = useCallback(
    (item: CommandItem) => {
      item.action();
    },
    [],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
        return;
      }

      if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        runItem(filtered[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, filtered, onClose, open, runItem]);

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl",
          recruiterMode
            ? "border-slate-200 bg-white"
            : "border-neon-cyan/30 bg-[#0a0a0f]/95 shadow-[0_0_40px_rgba(0,240,255,0.12)]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b px-4 py-3",
            recruiterMode ? "border-slate-200" : "border-white/10",
          )}
        >
          <Command size={16} className={recruiterMode ? "text-blue-600" : "text-neon-cyan"} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className={cn(
              "flex-1 bg-transparent font-mono text-sm outline-none",
              recruiterMode ? "text-slate-800 placeholder:text-slate-400" : "text-white placeholder:text-white/40",
            )}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[10px]",
              recruiterMode ? "border-slate-200 text-slate-500" : "border-white/10 text-white/50",
            )}
          >
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p
              className={cn(
                "px-3 py-6 text-center font-mono text-xs",
                recruiterMode ? "text-slate-500" : "text-text-muted",
              )}
            >
              {t("noResults")}
            </p>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => runItem(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  index === activeIndex
                    ? recruiterMode
                      ? "bg-blue-50 text-blue-800"
                      : "bg-neon-cyan/10 text-neon-cyan"
                    : recruiterMode
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-white/80 hover:bg-white/5",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded border",
                    recruiterMode ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/5",
                  )}
                >
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-sm">{item.label}</span>
                  {item.hint && (
                    <span
                      className={cn(
                        "block truncate font-mono text-[10px]",
                        recruiterMode ? "text-slate-500" : "text-text-muted",
                      )}
                    >
                      {item.hint}
                    </span>
                  )}
                </span>
                <ExternalLink size={12} className="shrink-0 opacity-40" />
              </button>
            ))
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-between border-t px-4 py-2 font-mono text-[10px]",
            recruiterMode ? "border-slate-200 text-slate-500" : "border-white/10 text-text-muted",
          )}
        >
          <span>{t("navigate")}</span>
          <span>{t("shortcut")}</span>
        </div>
      </div>
    </div>
  );
}
