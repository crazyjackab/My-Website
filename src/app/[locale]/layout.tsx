import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { routing } from "@/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050508" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const localizedName = locale === "en" ? "Chen Peng" : "陈鹏";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${localizedName} | ${siteConfig.title}`,
      template: `%s | ${localizedName}`,
    },
    description: t("siteDescription"),
    openGraph: {
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? ["en_US"] : ["zh_CN"],
    },
    alternates: {
      canonical: absoluteUrl(locale === "zh" ? "/" : `/${locale}`),
      languages: {
        zh: absoluteUrl("/"),
        en: absoluteUrl("/en"),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <NextIntlClientProvider messages={messages}>
      <PageViewTracker />
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>
      <JsonLd locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
