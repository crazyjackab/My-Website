#!/usr/bin/env node
import fs from "fs";
import path from "path";

const slug = process.argv[2];

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new:post -- <slug>");
  console.error("Example: npm run new:post -- my-new-article");
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const title = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

function template(locale) {
  const isZh = locale === "zh";
  return `---
title: "${title}"
description: "${isZh ? "一句话摘要" : "One-line summary"}"
date: "${date}"
tags: []
published: false
---

${isZh ? "在此撰写正文…" : "Write your post here…"}

<Callout type="tip">
  ${isZh ? "将 frontmatter 中 published 设为 true 后发布。" : "Set published: true in frontmatter when ready to ship."}
</Callout>
`;
}

for (const locale of ["zh", "en"]) {
  const dir = path.join("content", "blog", locale);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    console.error(`Already exists: ${filePath}`);
    process.exit(1);
  }
  fs.writeFileSync(filePath, template(locale), "utf8");
  console.log(`✓ ${filePath}`);
}

console.log("\nPreview: npm run dev → /blog/" + slug);
console.log("Publish: set published: true in both locale files");
