import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/routing";

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published?: boolean;
}

export interface BlogPost {
  slug: string;
  meta: BlogPostMeta;
  content: string;
  readingMinutes: number;
}

function getBlogDir(locale: Locale): string {
  const localized = path.join(process.cwd(), "content/blog", locale);
  if (fs.existsSync(localized)) return localized;
  return path.join(process.cwd(), "content/blog");
}

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const meta = data as BlogPostMeta;

  return {
    slug,
    meta: {
      title: meta.title,
      description: meta.description,
      date: meta.date,
      tags: meta.tags ?? [],
      published: meta.published ?? true,
    },
    content,
    readingMinutes: estimateReadingMinutes(content),
  };
}

export function getAllPosts(locale: Locale = "zh"): BlogPost[] {
  const blogDir = getBlogDir(locale);
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
      return parsePost(slug, raw);
    })
    .filter((post) => post.meta.published)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getPostBySlug(slug: string, locale: Locale = "zh"): BlogPost | undefined {
  const filePath = path.join(getBlogDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf8");
  const post = parsePost(slug, raw);
  return post.meta.published ? post : undefined;
}

export function getAllPostSlugs(locale: Locale = "zh"): string[] {
  return getAllPosts(locale).map((post) => post.slug);
}

export function formatBlogDate(date: string, locale: Locale = "zh"): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
