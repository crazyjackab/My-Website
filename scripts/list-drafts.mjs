#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const root = process.cwd();

function listDraftPosts() {
  const drafts = [];
  for (const locale of ["zh", "en"]) {
    const dir = path.join(root, "content/blog", locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      if (data.published === false) {
        drafts.push({ type: "blog", locale, slug: file.replace(/\.mdx$/, ""), title: data.title });
      }
    }
  }
  return drafts;
}

function listDraftProjects() {
  const dir = path.join(root, "content/projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.published === false) {
        return { type: "project", slug: data.slug, title: data.zh?.title ?? data.slug };
      }
      return null;
    })
    .filter(Boolean);
}

const drafts = [...listDraftPosts(), ...listDraftProjects()];

if (drafts.length === 0) {
  console.log("No drafts — all content is published.");
  process.exit(0);
}

console.log("Draft content (published: false):\n");
for (const item of drafts) {
  if (item.type === "blog") {
    console.log(`  [blog/${item.locale}] ${item.slug} — ${item.title}`);
  } else {
    console.log(`  [project] ${item.slug} — ${item.title}`);
  }
}
console.log("\nTo publish: set published: true, then npm run build");
