import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { getLocalizedProfile } from "@/data/i18n/profile";
import { getAllLocalizedProjectSlugs, getLocalizedProjectBySlug } from "@/data/i18n/projects";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllLocalizedProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getLocalizedProjectBySlug(slug, locale as Locale);
  if (!project) return {};

  const profile = getLocalizedProfile(locale as Locale);
  const title = `${project.title} | ${profile.name}`;
  const path = locale === routing.defaultLocale ? `/projects/${slug}` : `/${locale}/projects/${slug}`;
  const url = absoluteUrl(path);
  const image = project.image ? absoluteUrl(project.image) : absoluteUrl(siteConfig.ogImage);

  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      type: "article",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: project.title }],
    },
    alternates: { canonical: url },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getLocalizedProjectBySlug(slug, locale as Locale);
  if (!project) notFound();

  const profile = getLocalizedProfile(locale as Locale);
  const path = locale === routing.defaultLocale ? `/projects/${slug}` : `/${locale}/projects/${slug}`;
  const url = absoluteUrl(path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    url,
    author: {
      "@type": "Person",
      name: profile.name,
      url: siteConfig.url,
    },
    dateCreated: `${project.year}`,
    keywords: project.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailView project={project} />
    </>
  );
}
