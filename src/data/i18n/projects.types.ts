import type { Locale } from "@/i18n/routing";
import type { Project } from "@/data/projects";

export interface ProjectContent {
  title: string;
  tagline: string;
  description: string;
  highlights?: string[];
}

export interface ProjectSource {
  slug: string;
  tags: string[];
  links: { live?: string; github?: string };
  featured: boolean;
  published?: boolean;
  year: number;
  metrics?: Record<string, string>;
  image?: string;
  imageFull?: string;
  zh: ProjectContent;
  en: ProjectContent;
}

function toProject(item: ProjectSource, locale: Locale): Project {
  const content = item[locale];
  return {
    slug: item.slug,
    title: content.title,
    tagline: content.tagline,
    description: content.description,
    highlights: content.highlights ? [...content.highlights] : undefined,
    tags: [...item.tags],
    links: { ...item.links },
    featured: item.featured,
    published: item.published ?? true,
    year: item.year,
    metrics: item.metrics ? { ...item.metrics } : undefined,
    image: item.image,
    imageFull: item.imageFull,
  };
}

function publishedSources(sources: ProjectSource[]): ProjectSource[] {
  return sources.filter((item) => item.published !== false);
}

export function buildProjectHelpers(sources: ProjectSource[]) {
  return {
    getLocalizedProjects(locale: Locale): Project[] {
      return publishedSources(sources).map((item) => toProject(item, locale));
    },
    getLocalizedProjectBySlug(slug: string, locale: Locale): Project | undefined {
      const item = publishedSources(sources).find((p) => p.slug === slug);
      return item ? toProject(item, locale) : undefined;
    },
    getAllLocalizedProjectSlugs(): string[] {
      return publishedSources(sources).map((p) => p.slug);
    },
    getAllProjectSources(): ProjectSource[] {
      return sources;
    },
  };
}
