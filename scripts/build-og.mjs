#!/usr/bin/env node
// Renders the share card (Open Graph and X/Twitter) to public/og.jpg, 1200x630.
// Uses real Chromium so the card is set in the site's own Google Sans.
// Usage: pnpm og   (re-run after changing the name, tagline or logo)
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const font = (w) =>
  readFile(
    new URL(
      "node_modules/@fontsource-variable/google-sans/files/google-sans-latin-wght-normal.woff2",
      root,
    ),
  ).then((b) => `data:font/woff2;base64,${b.toString("base64")}`);
const logo = await readFile(new URL("public/flutter-ph-logo.svg", root), "utf8");
const fontUrl = await font();

const html = `<!doctype html><html><head><style>
@font-face { font-family: "Google Sans"; src: url(${fontUrl}) format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; }
body { background: #e8ebf0; padding: 36px; font-family: "Google Sans", sans-serif; display: flex; }
.sheet { flex: 1; background: #fff; border-radius: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 76px; overflow: hidden; position: relative; }
.copy { width: 660px; }
h1 { font-size: 84px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; color: #0b0d12; }
p { text-wrap: balance; margin-top: 26px; font-size: 33px; line-height: 1.3; letter-spacing: -0.015em; color: #4f5764; font-weight: 500; }
.pill { display: inline-flex; margin-top: 42px; background: #0b0d12; color: #fff; border-radius: 999px; padding: 14px 30px; font-size: 27px; font-weight: 600; }
.logo svg { width: 300px; height: auto; display: block; }
</style></head><body><div class="sheet"><div class="copy">
<h1>Flutter Philippines</h1>
<p>Join thousands of developers, designers and founders building apps with Flutter, Dart and AI.</p>
<div class="pill">flutter.ph</div></div>
<div class="logo">${logo}</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

const jpg = await sharp(png)
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toBuffer();
await writeFile(new URL("public/og.jpg", root), jpg);
console.log(`public/og.jpg written (${Math.round(jpg.length / 1024)} KB, 1200x630)`);
