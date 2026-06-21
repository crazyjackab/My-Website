#!/usr/bin/env node
import fs from "fs";
import path from "path";

const slug = process.argv[2];

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new:project -- <slug>");
  console.error("Example: npm run new:project -- my-side-project");
  process.exit(1);
}

const dir = path.join("content", "projects");
fs.mkdirSync(dir, { recursive: true });

const filePath = path.join(dir, `${slug}.json`);
if (fs.existsSync(filePath)) {
  console.error(`Already exists: ${filePath}`);
  process.exit(1);
}

const title = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

const project = {
  slug,
  tags: [],
  links: {},
  featured: false,
  published: false,
  year: new Date().getFullYear(),
  zh: {
    title,
    tagline: "一句话介绍",
    description: "项目详细描述…",
    highlights: ["亮点 1", "亮点 2"],
  },
  en: {
    title,
    tagline: "One-line tagline",
    description: "Project description…",
    highlights: ["Highlight 1", "Highlight 2"],
  },
};

fs.writeFileSync(filePath, JSON.stringify(project, null, 2) + "\n", "utf8");
console.log(`✓ ${filePath}`);
console.log("\nRun: npm run sync:projects (or included in new:project)");
console.log("Preview: npm run dev → /projects/" + slug);
console.log("Publish: set published: true in the JSON file");
