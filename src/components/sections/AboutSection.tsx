"use client";

import { Reveal } from "@/components/animations/Reveal";
import { profile } from "@/data/profile";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Target, Coffee } from "lucide-react";

const stats = [
  { label: "身份", value: profile.stats.years },
  { label: "项目数量", value: profile.stats.projects },
  { label: "GitHub Stars", value: profile.stats.githubStars },
  { label: "技术文章", value: profile.stats.articles },
];

export function AboutSection() {
  const { recruiterMode } = useTheme();

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">Level 1 · about.me</p>
          <h2 className="section-title mt-2 gradient-text">关于我</h2>
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
                {profile.name.slice(0, 1)}
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
                  计算机科学与技术 · 本科
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
