export const profile = {
  name: "陈鹏",
  englishName: "Chen Peng",
  handle: "crazyjackab",
  title: "应届毕业生 · 开发者",
  slogan: "用代码构建有温度的数字体验",
  bio: [
    "你好，我是陈鹏，武汉纺织大学外经贸学院计算机科学与技术专业全日制本科毕业生。",
    "我热爱技术与创造，专注于 Web 与桌面应用开发，享受将想法落地为可用产品的过程。",
    "目前暂无正式工作经历，正在通过个人项目与开源实践持续打磨技能，并积极寻找合适的机会。",
  ],
  location: "武汉",
  email: "15623652880@163.com",
  website: "https://chenpeng.dev",
  availableFor: "寻求全职 · 实习机会",
  avatar: "/avatar-placeholder.svg",
  resumeUrl: "/resume.pdf",
    stats: {
    years: "应届",
    projects: "3+",
    githubStars: "—",
    articles: "—",
  },
} as const;

export const social = {
  github: "https://github.com/crazyjackab",
  email: "mailto:15623652880@163.com",
} as const;

export const navItems = [
  { label: "Home", href: "#hero", icon: "~" },
  { label: "About", href: "#about", icon: "01" },
  { label: "Skills", href: "#skills", icon: "02" },
  { label: "Experience", href: "#experience", icon: "03" },
  { label: "Projects", href: "#projects", icon: "04" },
  { label: "Contact", href: "#contact", icon: "05" },
] as const;

export const levels = [
  { id: "hero", label: "BOOT", title: "系统启动" },
  { id: "about", label: "L1", title: "关于我" },
  { id: "skills", label: "L2", title: "技能树" },
  { id: "experience", label: "L3", title: "教育" },
  { id: "projects", label: "L4", title: "项目" },
  { id: "contact", label: "L5", title: "联系" },
] as const;
