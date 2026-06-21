import type { Locale } from "@/i18n/routing";

export interface LocalizedProfile {
  name: string;
  displayName: string;
  title: string;
  slogan: string;
  bio: string[];
  location: string;
  availableFor: string;
  stats: {
    years: string;
    projects: string;
    githubStars: string;
    articles: string;
  };
}

const profiles: Record<Locale, LocalizedProfile> = {
  zh: {
    name: "陈鹏",
    displayName: "陈鹏",
    title: "应届毕业生 · 开发者",
    slogan: "用代码构建有温度的数字体验",
    bio: [
      "你好，我是陈鹏，武汉纺织大学外经贸学院计算机科学与技术专业全日制本科毕业生。",
      "我热爱技术与创造，专注于 Web 与桌面应用开发，享受将想法落地为可用产品的过程。",
      "目前暂无正式工作经历，正在通过个人项目与开源实践持续打磨技能，并积极寻找合适的机会。",
    ],
    location: "武汉",
    availableFor: "寻求全职 · 实习机会",
    stats: {
      years: "应届",
      projects: "3+",
      githubStars: "—",
      articles: "—",
    },
  },
  en: {
    name: "Chen Peng",
    displayName: "Chen Peng",
    title: "Graduate · Developer",
    slogan: "Building thoughtful digital experiences with code",
    bio: [
      "Hi, I'm Chen Peng, a full-time Computer Science and Technology graduate from Wuhan Textile University.",
      "I enjoy turning ideas into usable products across web and desktop development.",
      "I am actively looking for full-time or internship opportunities while sharpening skills through personal projects and open-source work.",
    ],
    location: "Wuhan",
    availableFor: "Open to full-time · internship roles",
    stats: {
      years: "Graduate",
      projects: "3+",
      githubStars: "—",
      articles: "—",
    },
  },
};

export function getLocalizedProfile(locale: Locale): LocalizedProfile {
  return profiles[locale];
}
