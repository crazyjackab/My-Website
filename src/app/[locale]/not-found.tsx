import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocalizedProfile } from "@/data/i18n/profile";
import { getAllLocalizedProjectSlugs } from "@/data/i18n/projects";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const resolved = params ? await params : { locale: routing.defaultLocale };
  const locale = resolved.locale as Locale;
  const t = await getTranslations({ locale, namespace: "notFound" });
  const profile = getLocalizedProfile(locale);
  const projectSlugs = getAllLocalizedProjectSlugs().slice(0, 3);
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-4 text-center">
      <main id="main-content" className="max-w-lg">
        <p className="font-mono text-xs tracking-widest text-neon-cyan/70">{t("code")}</p>
        <h1 className="mt-4 font-display text-4xl tracking-wide gradient-text glitch-text">
          {t("title")}
        </h1>
        <div className="cyber-panel mt-8 rounded-xl border border-neon-green/20 p-6 text-left font-mono text-sm">
          <p className="text-neon-green/80">
            <span className="text-text-muted">$</span> cat requested_path
          </p>
          <p className="mt-2 text-red-400">ENOENT: route not found in portfolio-os</p>
          <p className="mt-4 text-text-muted">
            The page you are looking for may have moved, or never existed in this build.
          </p>
          <p className="mt-4 text-neon-cyan/70">
            <span className="text-neon-green">&gt;</span> {t("tryRoutes")}
          </p>
          <ul className="mt-3 space-y-1 text-neon-cyan/80">
            <li>
              <Link href={prefix || "/"} className="hover:text-neon-cyan hover:underline">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href={`${prefix}/#projects`} className="hover:text-neon-cyan hover:underline">
                {t("projects")}
              </Link>
            </li>
            <li>
              <Link href={`${prefix}/blog`} className="hover:text-neon-cyan hover:underline">
                {t("blog")}
              </Link>
            </li>
            {projectSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`${prefix}/projects/${slug}`}
                  className="hover:text-neon-cyan hover:underline"
                >
                  {prefix}/projects/{slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href={prefix || "/"} variant="primary">{t("backHome")}</Button>
          <Button href={`${prefix}/#contact`} variant="secondary">
            {t("contact", { name: profile.name })}
          </Button>
        </div>
      </main>
    </div>
  );
}
