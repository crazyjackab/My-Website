import type { Locale } from "@/i18n/routing";
import type { Experience } from "@/data/experience";

const experiencesByLocale: Record<Locale, Experience[]> = {
  zh: [
    {
      id: "edu-1",
      company: "武汉纺织大学外经贸学院",
      role: "计算机科学与技术 · 全日制本科 · 学士",
      period: "2022.09 — 2026.06",
      location: "武汉",
      description:
        "在武汉纺织大学外经贸学院计算机科学与技术专业完成全日制本科学习。目前暂无正式工作经历，主要通过课程学习、个人项目与开源实践积累开发能力。",
      highlights: [
        "计算机科学与技术专业 · 全日制本科学历",
        "系统学习计算机基础与软件工程相关课程",
        "通过 Cloud Knowledge Base 毕设实践 Spring Boot、Vue 3 与 RAG 全栈开发",
        "通过 File Manager 等个人项目实践 Tauri、React 与 Rust 开发",
      ],
      techStack: ["Spring Boot", "Vue 3", "RAG", "软件工程"],
    },
  ],
  en: [
    {
      id: "edu-1",
      company: "Wuhan Textile University",
      role: "B.S. · Computer Science and Technology",
      period: "2022.09 — 2026.06",
      location: "Wuhan",
      description:
        "Completed a full-time undergraduate program in Computer Science and Technology. No formal work experience yet — skills were built through coursework, personal projects, and open-source practice.",
      highlights: [
        "Full-time bachelor's degree in Computer Science",
        "Core CS and software engineering coursework",
        "Capstone: Spring Boot, Vue 3, and RAG full-stack development",
        "Personal projects with Tauri, React, and Rust",
      ],
      techStack: ["Spring Boot", "Vue 3", "RAG", "Software Engineering"],
    },
  ],
};

export function getLocalizedExperiences(locale: Locale): Experience[] {
  return experiencesByLocale[locale];
}
