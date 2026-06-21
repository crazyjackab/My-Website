import { getLocalizedProfile } from "@/data/i18n/profile";
import { social, email, resumeUrl } from "@/data/profile";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function JsonLd({ locale = "zh" }: { locale?: string }) {
  const profile = getLocalizedProfile(locale as Locale);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    email,
    jobTitle: profile.title,
    description: profile.slogan,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    sameAs: [social.github],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} Portfolio`,
    url: siteConfig.url,
    inLanguage: locale === "en" ? "en-US" : "zh-CN",
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
