"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/animations/Reveal";
import { useTheme } from "@/context/ThemeContext";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Target, Coffee } from "lucide-react";

export function AboutSection() {
  const t = useTranslations("about");
  const { profile } = useLocalizedContent();
  const { recruiterMode } = useTheme();

  const stats = [
    { label: t("statsRole"), value: profile.stats.years },
    { label: t("statsProjects"), value: profile.stats.projects },
    { label: t("statsStars"), value: profile.stats.githubStars },
    { label: t("statsArticles"), value: profile.stats.articles },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">{t("label")}</p>
          <h2 className="section-title mt-2 gradient-text">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[280px_1fr]">
          <Reveal delay={100}>
            <div className="relative mx-auto w-fit lg:mx-0">
              <div
                className={cn(
                  "about-orbit absolute -inset-3 animate-spin rounded-full border border-dashed [animation-duration:8s]",
                  recruiterMode ? "border-blue-300" : "border-neon-cyan/30",
                )}
              />
              <div
                className={cn(
                  "relative flex h-48 w-48 items-center justify-center rounded-2xl border font-display text-5xl gradient-text",
                  recruiterMode
                    ? "border-slate-200 bg-slate-50"
                    : "border-neon-cyan/20 bg-bg-elevated",
                )}
              >
                {profile.displayName.slice(0, 1)}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={150}>
              <div
                className={cn(
                  "space-y-4 leading-relaxed",
                  recruiterMode ? "text-slate-700" : "text-text-muted",
                )}
              >
                {profile.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                <li
                  className={cn(
                    "flex items-center gap-2 font-mono text-sm",
                    recruiterMode ? "text-slate-600" : "text-text-muted",
                  )}
                >
                  <MapPin size={14} className={recruiterMode ? "text-blue-600" : "text-neon-cyan"} />
                  {profile.location}
                </li>
                <li
                  className={cn(
                    "flex items-center gap-2 font-mono text-sm",
                    recruiterMode ? "text-slate-600" : "text-text-muted",
                  )}
                >
                  <Briefcase size={14} className={recruiterMode ? "text-violet-600" : "text-neon-purple"} />
                  {profile.availableFor}
                </li>
                <li
                  className={cn(
                    "flex items-center gap-2 font-mono text-sm",
                    recruiterMode ? "text-slate-600" : "text-text-muted",
                  )}
                >
                  <Target size={14} className={recruiterMode ? "text-green-700" : "text-neon-green"} />
                  {profile.title}
                </li>
                <li
                  className={cn(
                    "flex items-center gap-2 font-mono text-sm",
                    recruiterMode ? "text-slate-600" : "text-text-muted",
                  )}
                >
                  <Coffee size={14} className={recruiterMode ? "text-amber-600" : "text-neon-amber"} />
                  {t("educationField")}
                </li>
              </ul>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                    <p className="font-display text-2xl gradient-text">{stat.value}</p>
                    <p
                      className={cn(
                        "mt-1 font-mono text-[10px] tracking-wider uppercase",
                        recruiterMode ? "text-slate-500" : "text-text-muted",
                      )}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
