export const handle = "crazyjackab";
export const email = "15623652880@163.com";
export const website = "https://chenpeng.dev";
export const avatar = "/avatar-placeholder.svg";
export const resumeUrl = "/resume.pdf";

export const social = {
  github: "https://github.com/crazyjackab",
  email: "mailto:15623652880@163.com",
} as const;

export const navRoutes = [
  { key: "home", href: "#hero", icon: "~" },
  { key: "about", href: "#about", icon: "01" },
  { key: "skills", href: "#skills", icon: "02" },
  { key: "experience", href: "#experience", icon: "03" },
  { key: "projects", href: "#projects", icon: "04" },
  { key: "blog", href: "/blog", icon: "05" },
  { key: "contact", href: "#contact", icon: "06" },
] as const;

export const levelRoutes = [
  { id: "hero", labelKey: "boot", titleKey: "bootTitle" },
  { id: "about", labelKey: "about", titleKey: "aboutTitle" },
  { id: "skills", labelKey: "skills", titleKey: "skillsTitle" },
  { id: "experience", labelKey: "experience", titleKey: "experienceTitle" },
  { id: "projects", labelKey: "projects", titleKey: "projectsTitle" },
  { id: "contact", labelKey: "contact", titleKey: "contactTitle" },
] as const;
