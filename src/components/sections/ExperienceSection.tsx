"use client";

import { Reveal } from "@/components/animations/Reveal";
import { experiences } from "@/data/experience";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const { recruiterMode } = useTheme();

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">Level 3 · quest.log</p>
          <h2 className="section-title mt-2 gradient-text">教育背景</h2>
        </Reveal>

        <div className="relative mt-12">
          <div
            className={cn(
              "absolute top-0 bottom-0 left-4 w-px md:left-1/2 md:-translate-x-px",
              recruiterMode
                ? "bg-gradient-to-b from-blue-400 via-violet-400 to-transparent"
                : "bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent",
            )}
          />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <Reveal key={exp.id} delay={index * 100}>
                <div
                  className={`relative flex flex-col gap-6 md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="hidden w-1/2 md:block" />

                  <div
                    className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                  >
                    <div className="glass-card rounded-xl p-6">
                      <div className="absolute top-6 left-4 flex h-3 w-3 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                        <span
                          className={cn(
                            "experience-ping absolute h-3 w-3 animate-ping rounded-full",
                            recruiterMode ? "bg-blue-400/40" : "bg-neon-cyan/40",
                          )}
                        />
                        <span
                          className={cn(
                            "relative h-2 w-2 rounded-full",
                            recruiterMode ? "bg-blue-600" : "bg-neon-cyan shadow-[0_0_10px_#00f0ff]",
                          )}
                        />
                      </div>

                      <p
                        className={cn(
                          "font-mono text-[10px] tracking-wider uppercase",
                          recruiterMode ? "text-blue-700" : "text-neon-cyan",
                        )}
                      >
                        {exp.period}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                      <h3
                        className={cn(
                          "mt-2 font-display text-lg tracking-wide",
                          recruiterMode ? "text-slate-900" : "text-white",
                        )}
                      >
                        {exp.company}
                      </h3>
                      <p className={cn("font-mono text-sm", recruiterMode ? "text-violet-700" : "text-neon-purple")}>
                        {exp.role}
                      </p>
                      <p className={cn("mt-3 text-sm", recruiterMode ? "text-slate-600" : "text-text-muted")}>
                        {exp.description}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((h, i) => (
                          <li
                            key={i}
                            className={cn(
                              "flex items-start gap-2 text-sm",
                              recruiterMode ? "text-slate-600" : "text-text-muted",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                                recruiterMode ? "bg-green-600" : "bg-neon-green",
                              )}
                            />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className={cn(
                              "rounded border px-2 py-0.5 font-mono text-[10px]",
                              recruiterMode
                                ? "border-slate-200 text-blue-700"
                                : "border-white/10 text-neon-cyan/70",
                            )}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {!recruiterMode && (
                        <p className="mt-4 font-mono text-[10px] text-neon-green/50">
                          ✓ CHECKPOINT CLEARED
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
