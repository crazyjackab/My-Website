import Image from "next/image";
import { useTranslations } from "next-intl";
import { SiteSubpageHeader } from "@/components/layout/SiteSubpageHeader";
import type { Project } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { useLocalizedContent } from "@/hooks/useLocalizedContent";
import { ExternalLink, Github } from "lucide-react";

export function ProjectDetailView({ project }: { project: Project }) {
  const t = useTranslations("common");
  const { projects } = useLocalizedContent();
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#050508] text-text-primary">
      <SiteSubpageHeader backHref="/#projects" backLabel={t("backProjects")} />

      <main id="main-content" className="section-container py-12 md:py-16">
        <p className="section-label">Level 4 · project.detail</p>
        <h1 className="section-title mt-2 gradient-text">{project.title}</h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-neon-purple">{project.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[10px] text-neon-cyan/70">
          <span>{project.year}</span>
          {project.metrics &&
            Object.entries(project.metrics).map(([key, val]) => (
              <span key={key}>↑ {val} {key}</span>
            ))}
        </div>

        {project.image && (
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-bg-elevated">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={project.imageFull ?? project.image}
                alt={`${project.title} screenshot`}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="glass-card rounded-xl p-6 md:p-8">
            <h2 className="font-display text-lg tracking-wide text-white">{t("overview")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">{project.description}</p>

            {project.highlights && project.highlights.length > 0 && (
              <div className="mt-8">
                <h3 className="font-mono text-xs tracking-widest text-neon-cyan/80 uppercase">
                  {t("highlights")}
                </h3>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-text-muted before:font-mono before:text-neon-green before:content-['>']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-mono text-xs tracking-widest text-neon-cyan/80 uppercase">
                {t("techStack")}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-mono text-xs tracking-widest text-neon-cyan/80 uppercase">
                {t("links")}
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-xs text-neon-cyan hover:underline"
                  >
                    <ExternalLink size={12} />
                    Live Demo / Release
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-xs text-neon-purple hover:underline"
                  >
                    <Github size={12} />
                    GitHub Repository
                  </a>
                )}
                {!project.links.live && !project.links.github && (
                  <p className="font-mono text-xs text-text-muted">{t("noPublicLinks")}</p>
                )}
              </div>
            </div>

            <Button href="/#contact" variant="primary" className="w-full">
              {t("contactAuthor")}
            </Button>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-projects">
            <h2
              id="related-projects"
              className="font-mono text-xs tracking-widest text-neon-purple/80 uppercase"
            >
              {t("relatedProjects")}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="glass-card neon-border group rounded-xl p-5 transition-colors hover:border-neon-cyan/40"
                >
                  <p className="font-mono text-[10px] text-neon-amber">{item.year}</p>
                  <h3 className="mt-1 font-display text-base text-white group-hover:text-neon-cyan">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted line-clamp-2">{item.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
