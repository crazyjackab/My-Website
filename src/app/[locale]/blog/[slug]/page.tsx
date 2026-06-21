import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { getLocalizedProfile } from "@/data/i18n/profile";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale as Locale);
  if (!post) return {};

  const profile = getLocalizedProfile(locale as Locale);
  const path = locale === routing.defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: `${post.meta.title} | ${profile.name}`,
      description: post.meta.description,
      type: "article",
      url: absoluteUrl(path),
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
    alternates: { canonical: absoluteUrl(path) },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug, locale as Locale);
  if (!post) notFound();

  const path = locale === routing.defaultLocale ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const profile = getLocalizedProfile(locale as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    url: absoluteUrl(path),
    author: {
      "@type": "Person",
      name: profile.name,
      url: siteConfig.url,
    },
    keywords: post.meta.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostView post={post} />
    </>
  );
}
