export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image?: string;
  imageFull?: string;
  tags: string[];
  links: {
    live?: string;
    github?: string;
  };
  featured: boolean;
  year: number;
  metrics?: Record<string, string>;
}

export const projects: Project[] = [
  {
    slug: "cloud-knowledge-base",
    title: "Cloud Knowledge Base",
    tagline: "基于 RAG 的云端知识库智能问答，文档入库—向量检索—可追溯回答",
    description:
      "本科毕设 · Spring Boot 3 + Vue 3 全栈实现。支持 PDF、Word、Markdown 等文档解析与语义分块，通义 Embedding 向量化写入 Milvus，提问时 Top-K 检索后由大模型生成带引用来源的答案。含 JWT 多用户隔离、删文档同步清向量、问答历史，并扩展书架/备忘/媒体等资源库模块，28 条功能与安全测试全部通过。",
    tags: ["Spring Boot", "Vue 3", "MySQL", "Milvus", "RAG", "JWT"],
    links: {},
    featured: true,
    year: 2026,
    metrics: { tests: "28/28 pass" },
  },
  {
    slug: "file-manager",
    title: "File Manager",
    tagline: "Windows 桌面私人文件资料库，收纳散落文件并按类浏览",
    description:
      "基于 Tauri 2 + React + Rust 开发的桌面文件整理工具。将桌面、下载文件夹中的文件收纳到统一资料库，按图片、视频、文档等分类浏览，支持缩略图网格、库内搜索与从桌面一键收纳，扫描与统计在 Rust 侧完成，避免大目录卡顿。",
    tags: ["Tauri 2", "React", "TypeScript", "Rust"],
    links: {
      live: "https://github.com/crazyjackab/cp/releases/tag/v0.3.1",
      github: "https://github.com/crazyjackab/File-Manager",
    },
    featured: true,
    year: 2026,
    metrics: { version: "v0.3.1" },
  },
  {
    slug: "agent-preset-desktop",
    title: "Agent Preset Desktop",
    tagline: "可自定义 Agent 人设的桌面 AI 助手，支持多模型对话与本地数据管理",
    description:
      "基于 Electron + React + TypeScript 的 monorepo 桌面应用。提供 Agent 五层设定编辑器、Prompt 编译、多 LLM 流式对话、SQLite 本地存储，并集成 MCP 工具、长期记忆、微信/QQ IM 桥接等能力。",
    image: "/projects/agent-preset-desktop.png",
    imageFull: "/projects/agent-preset-desktop.png",
    tags: ["Electron", "React", "TypeScript", "SQLite", "Fastify"],
    links: {},
    featured: true,
    year: 2026,
  },
];
