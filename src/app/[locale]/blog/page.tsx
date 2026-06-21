import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogListView } from "@/components/blog/BlogListView";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const path = locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`;

  return {
    title: t("listTitle"),
    description: t("listSubtitle"),
    openGraph: {
      title: `${t("listTitle")} | ${siteConfig.name}`,
      description: t("listSubtitle"),
      url: absoluteUrl(path),
      type: "website",
    },
    alternates: { canonical: absoluteUrl(path) },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts(locale as Locale);
  return <BlogListView posts={posts} />;
}
