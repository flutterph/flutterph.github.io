#!/usr/bin/env node
// Reports gzipped first-load JS per page of the static export in out/.
// Usage: node scripts/first-load-js.mjs [page.html ...]   (default: index.html)
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const out = new URL("../out/", import.meta.url).pathname;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ["index.html"];
for (const page of pages) {
  const html = await readFile(join(out, page), "utf8");
  // Skip noModule polyfills: modern browsers never download them.
  const srcs = [
    ...new Set(
      [...html.matchAll(/<script(?![^>]*nomodule)[^>]+src="([^"]+\.js)"/gi)].map((m) => m[1]),
    ),
  ];
  let total = 0;
  for (const src of srcs)
    total += gzipSync(await readFile(join(out, src.replace(/^\//, "")))).length;
  const inline = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].reduce(
    (n, m) => n + gzipSync(m[1]).length,
    0,
  );
  console.log(
    `${page}: ${(total / 1024).toFixed(1)} KB gzipped across ${srcs.length} files (+ ${(inline / 1024).toFixed(1)} KB inline RSC payload)`,
  );
}
