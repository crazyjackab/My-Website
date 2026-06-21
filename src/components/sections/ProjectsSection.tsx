"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/animations/Reveal";
import type { Project } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { useIsMobile, useReducedMotion } from "@/hooks/useMotion";
import { useTilt } from "@/hooks/useTilt";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, Star, X } from "lucide-react";

interface LightboxImage {
  src: string;
  alt: string;
}

function getLightboxSize(naturalWidth: number, naturalHeight: number) {
  const maxWidth = window.innerWidth * 0.96;
  const maxHeight = window.innerHeight * 0.96;
  const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);

  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale),
  };
}

function ProjectCard({
  project,
  recruiterMode,
  onOpenLightbox,
  viewDetailsLabel,
  viewImageLabel,
}: {
  project: Project;
  recruiterMode: boolean;
  onOpenLightbox: (image: LightboxImage) => void;
  viewDetailsLabel: string;
  viewImageLabel: string;
}) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const tiltEnabled = !recruiterMode && !reducedMotion && !isMobile;
  const tiltRef = useTilt<HTMLElement>({ maxTilt: 10, scale: 1.02, enabled: tiltEnabled });

  return (
    <article
      ref={tiltRef}
      className="glass-card neon-border tilt-card group flex h-full flex-col overflow-hidden rounded-xl"
    >
      {project.image && (
        <button
          type="button"
          onClick={() =>
            onOpenLightbox({
              src: project.imageFull ?? project.image!,
              alt: `${project.title} 项目截图`,
            })
          }
          className={cn(
            "relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden border-b text-left",
            recruiterMode ? "border-slate-200 bg-slate-100" : "border-white/10 bg-bg-elevated",
          )}
          aria-label={viewImageLabel}
        >
          <Image
            src={project.imageFull ?? project.image}
            alt={`${project.title} 项目截图`}
            fill
            loading="lazy"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </button>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className={cn("font-mono text-[10px]", recruiterMode ? "text-amber-700" : "text-neon-amber")}>
              {project.year}
            </span>
            <h3
              className={cn(
                "mt-1 font-display text-lg tracking-wide transition-colors",
                recruiterMode
                  ? "text-slate-900 group-hover:text-blue-700"
                  : "text-white group-hover:text-neon-cyan",
              )}
            >
              <Link href={`/projects/${project.slug}`} className="hover:underline">
                {project.title}
              </Link>
            </h3>
            <p className={cn("mt-1 font-mono text-xs", recruiterMode ? "text-violet-700" : "text-neon-purple")}>
              {project.tagline}
            </p>
          </div>
          {project.featured && (
            <Star
              size={14}
              className={cn("shrink-0", recruiterMode ? "text-amber-500" : "text-neon-amber")}
              fill="currentColor"
            />
          )}
        </div>

        <p className={cn("mt-4 flex-1 text-sm leading-relaxed", recruiterMode ? "text-slate-600" : "text-text-muted")}>
          {project.description}
        </p>

        {project.metrics && (
          <div className={cn("mt-4 flex gap-4 font-mono text-[10px]", recruiterMode ? "text-blue-700" : "text-neon-cyan/70")}>
            {Object.entries(project.metrics).map(([key, val]) => (
              <span key={key}>
                ↑ {val} {key}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded border px-2 py-0.5 font-mono text-[10px]",
                recruiterMode
                  ? "border-slate-200 text-slate-600"
                  : "border-white/10 text-text-muted",
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className={cn(
              "flex items-center gap-1 font-mono text-xs hover:underline",
              recruiterMode ? "text-green-700" : "text-neon-green",
            )}
          >
            {viewDetailsLabel}
          </Link>
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1 font-mono text-xs hover:underline",
                recruiterMode ? "text-blue-700" : "text-neon-cyan",
              )}
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1 font-mono text-xs hover:underline",
                recruiterMode ? "text-violet-700" : "text-neon-purple",
              )}
            >
              <Github size={12} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const t = useTranslations("projects");
  const { projects } = useLocalizedContent();
  const { recruiterMode } = useTheme();
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const [lightboxSize, setLightboxSize] = useState<{ width: number; height: number } | null>(null);
  const featured = projects.filter((p) => p.featured);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setLightboxSize(null);
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    const onResize = () => {
      if (!lightboxSize) return;
      const img = document.getElementById("project-lightbox-image") as HTMLImageElement | null;
      if (!img?.naturalWidth) return;
      setLightboxSize(getLightboxSize(img.naturalWidth, img.naturalHeight));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [lightbox, lightboxSize, closeLightbox]);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="section-container">
        <Reveal>
          <p className="section-label">{t("label")}</p>
          <h2 className="section-title mt-2 gradient-text">{t("title")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 100}>
              <ProjectCard
                project={project}
                recruiterMode={recruiterMode}
                onOpenLightbox={setLightbox}
                viewDetailsLabel={t("viewDetails")}
                viewImageLabel={t("viewImage", { title: project.title })}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={t("lightbox")}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className={cn(
              "absolute top-4 right-4 z-10 rounded-full border p-2 transition-colors",
              recruiterMode
                ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                : "border-white/20 bg-bg-elevated text-white hover:border-neon-cyan/50 hover:text-neon-cyan",
            )}
            aria-label={t("closePreview")}
          >
            <X size={18} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="project-lightbox-image"
            src={lightbox.src}
            alt={lightbox.alt}
            width={lightboxSize?.width}
            height={lightboxSize?.height}
            className="rounded-lg shadow-2xl"
            style={{
              width: lightboxSize?.width,
              height: lightboxSize?.height,
              maxWidth: "96vw",
              maxHeight: "96vh",
            }}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              setLightboxSize(getLightboxSize(naturalWidth, naturalHeight));
            }}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
