import { email, handle } from "@/data/profile";
import { getLocalizedProfile } from "@/data/i18n/profile";

const defaultProfile = getLocalizedProfile("zh");

export const siteConfig = {
  name: defaultProfile.name,
  title: defaultProfile.title,
  description: `${defaultProfile.name} 的个人网站 — ${defaultProfile.slogan}`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chenpeng.dev",
  ogImage: "/opengraph-image",
  email,
  handle,
} as const;

export function absoluteUrl(path = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
