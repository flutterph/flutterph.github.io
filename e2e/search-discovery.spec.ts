import { expect, test } from "@playwright/test";
import { site, social } from "../src/lib/site";

const home = new URL("/", site.url).href;

test.use({ javaScriptEnabled: false });
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "Static output is viewport-independent.");
});

test("robots and sitemap expose only the canonical homepage", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const rules = await robots.text();
  expect(rules).toMatch(/^User-agent:\s*\*\s*$/im);
  expect(rules).toMatch(/^Allow:\s*\/\s*$/im);
  expect(rules.split(/\r?\n/)).toContain(`Sitemap: ${home}sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), ([, url]) => url)).toEqual([home]);
});

test("homepage metadata, linked entities and answers are available without JavaScript", async ({
  page,
}) => {
  await page.goto("/");
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  expect(new URL((await canonical.getAttribute("href"))!).href).toBe(home);
  expect(await page.locator('meta[name="robots"][content*="noindex" i]').count()).toBe(0);
  const title = await page.title();
  expect(title).toContain(site.name);
  expect(title).not.toBe(site.name);

  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toBeTruthy();
  for (const tag of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    await expect(page.locator(tag)).toHaveAttribute("content", description!);
  }
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
  expect(new URL(ogUrl!).href).toBe(home);

  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = graphs.flatMap((text) => JSON.parse(text)["@graph"] ?? []);
  const organization = nodes.find((node) => node["@type"] === "Organization");
  const website = nodes.find((node) => node["@type"] === "WebSite");
  expect(organization).toMatchObject({ name: site.name });
  expect(organization["@id"]).toBeTruthy();
  expect(organization.sameAs).toEqual(expect.arrayContaining([social.github.href]));
  expect(website).toMatchObject({ publisher: { "@id": organization["@id"] } });

  await expect(page.locator("#get-involved h2")).toHaveText(/\?/);
  await expect(page.locator("#get-involved")).toContainText(/Metro Manila/);
  await expect(page.locator("#learn h2")).toHaveText(/\?/);
  await expect(page.locator("#learn")).toContainText(/codelab/i);
  const join = page.locator("#join-community");
  await expect(join.locator("h2")).toHaveText(/join Flutter Philippines/i);
  await expect(join.getByRole("link", { name: /Facebook/i })).toHaveAttribute("href", site.joinUrl);
  await expect(join.getByRole("link", { name: /Luma/i })).toHaveAttribute("href", social.luma.href);
});
