"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/animations/Reveal";
import { skills, type Skill } from "@/data/skills";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const categories = ["frontend", "backend", "devops", "tools"] as const;

function SkillCard({ skill, recruiterMode }: { skill: Skill; recruiterMode: boolean }) {
  return (
    <div
      className={cn(
        "glass-card group rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1",
        skill.highlight && "neon-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("font-mono text-sm", recruiterMode ? "text-slate-800" : "text-white")}>
          {skill.name}
        </span>
        <span className={cn("font-mono text-[10px]", recruiterMode ? "text-blue-700" : "text-neon-cyan")}>
          {skill.level}%
        </span>
      </div>
      <div className="skill-bar mt-3">
        <div
          className="skill-bar-fill transition-all duration-1000"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations("skills");
  const { recruiterMode } = useTheme();

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">{t("label")}</p>
          <h2 className="section-title mt-2 gradient-text">{t("title")}</h2>
          <p className={cn("mt-3 max-w-lg font-mono text-sm", recruiterMode ? "text-slate-600" : "text-text-muted")}>
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-12 space-y-12">
          {categories.map((cat, catIndex) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <Reveal key={cat} delay={catIndex * 80}>
                <div>
                  <h3
                    className={cn(
                      "mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase",
                      recruiterMode ? "text-violet-700" : "text-neon-purple",
                    )}
                  >
                    <span className={cn("h-px flex-1", recruiterMode ? "bg-violet-200" : "bg-neon-purple/20")} />
                    {t(`categories.${cat}`)}
                    <span className={cn("h-px flex-1", recruiterMode ? "bg-violet-200" : "bg-neon-purple/20")} />
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {catSkills.map((skill) => (
                      <SkillCard key={skill.name} skill={skill} recruiterMode={recruiterMode} />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
