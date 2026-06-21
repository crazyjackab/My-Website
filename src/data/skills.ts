export interface Skill {
  name: string;
  category: "frontend" | "backend" | "devops" | "tools";
  level: number;
  highlight?: boolean;
}

export const skillCategories = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  tools: "Tools",
} as const;

export const skills: Skill[] = [
  { name: "React", category: "frontend", level: 90, highlight: true },
  { name: "TypeScript", category: "frontend", level: 85, highlight: true },
  { name: "Next.js", category: "frontend", level: 85, highlight: true },
  { name: "Tailwind CSS", category: "frontend", level: 88 },
  { name: "Vue.js", category: "frontend", level: 70 },
  { name: "Node.js", category: "backend", level: 80, highlight: true },
  { name: "Java", category: "backend", level: 75 },
  { name: "Python", category: "backend", level: 75, highlight: true },
  { name: "PostgreSQL", category: "backend", level: 70 },
  { name: "Redis", category: "backend", level: 65 },
  { name: "Docker", category: "devops", level: 75 },
  { name: "GitHub Actions", category: "devops", level: 70 },
  { name: "AWS", category: "devops", level: 65 },
  { name: "Git", category: "tools", level: 90 },
  { name: "VS Code", category: "tools", level: 95 },
  { name: "Figma", category: "tools", level: 60 },
];
