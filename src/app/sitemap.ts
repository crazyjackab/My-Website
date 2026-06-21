import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { getAllLocalizedProjectSlugs } from "@/data/i18n/projects";
import { absoluteUrl } from "@/lib/site";

function localePath(locale: string, path: string) {
  if (locale === routing.defaultLocale) return path;
  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const postsByLocale = routing.locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: absoluteUrl(localePath(locale, `/blog/${post.slug}`)),
      lastModified: new Date(post.meta.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  const projectSlugs = getAllLocalizedProjectSlugs();
  const projectsByLocale = routing.locales.flatMap((locale) =>
    projectSlugs.map((slug) => ({
      url: absoluteUrl(localePath(locale, `/projects/${slug}`)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [
    ...routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, "/")),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
    ...routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, "/blog")),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...projectsByLocale,
    ...postsByLocale,
  ];
}
