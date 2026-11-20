#!/usr/bin/env node
// Deletes every content entry marked `sample: true`, plus public/images/sample/.
// Usage: pnpm content:clear-samples          (asks nothing, prints what it removed)
//        pnpm content:clear-samples --dry-run
import { readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const dryRun = process.argv.includes("--dry-run");
const root = new URL("../content/", import.meta.url).pathname;
const removed = [];

for (const dir of await readdir(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const file of await readdir(join(root, dir.name))) {
    if (!file.endsWith(".mdx")) continue;
    const path = join(root, dir.name, file);
    const frontmatter = (await readFile(path, "utf8")).split(/^---$/m)[1] ?? "";
    if (/^sample:\s*true\s*$/m.test(frontmatter)) {
      removed.push(`content/${dir.name}/${file}`);
      if (!dryRun) await rm(path);
    }
  }
}

const sampleImages = new URL("../public/images/sample/", import.meta.url).pathname;
removed.push("public/images/sample/");
if (!dryRun) await rm(sampleImages, { recursive: true, force: true });

console.log(
  `${dryRun ? "Would remove" : "Removed"} ${removed.length} item(s):\n  ${removed.join("\n  ")}`,
);
