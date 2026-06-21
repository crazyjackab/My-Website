import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getLocalizedExperiences } from "@/data/i18n/experience";
import { getLocalizedProfile } from "@/data/i18n/profile";
import { getLocalizedProjects } from "@/data/i18n/projects";

export function useLocalizedContent() {
  const locale = useLocale() as Locale;

  return {
    locale,
    profile: getLocalizedProfile(locale),
    projects: getLocalizedProjects(locale),
    experiences: getLocalizedExperiences(locale),
  };
}
