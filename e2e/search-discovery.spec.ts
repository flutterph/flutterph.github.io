import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { allEvents } from "../.content-collections/generated/index.js";
import { formatEventRange } from "../src/lib/dates";
import { site, social } from "../src/lib/site";

const home = new URL("/", site.url).href;
const eventPath = (slug: string) => `/events/${encodeURIComponent(slug)}`;
const events = allEvents.filter(
  (event) => !event.sample || existsSync(`out${eventPath(event.slug)}.html`),
);

test.use({ javaScriptEnabled: false });
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "Static output is viewport-independent.");
});

test("robots and sitemap expose the homepage and published event details", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const rules = await robots.text();
  expect(rules).toMatch(/^User-agent:\s*\*\s*$/im);
  expect(rules).toMatch(/^Allow:\s*\/\s*$/im);
  expect(rules.split(/\r?\n/)).toContain(`Sitemap: ${home}sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), ([, url]) => url);
  const published = [home, ...events.map((event) => new URL(eventPath(event.slug), home).href)];
  expect(urls.toSorted()).toEqual(published.toSorted());
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

test("homepage links to every published community event without JavaScript", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("main a[href]")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  for (const event of events) {
    expect(hrefs, event.title).toContain(eventPath(event.slug));
  }
});

for (const event of events) {
  test(`event detail: ${event.slug}`, async ({ page }) => {
    const path = eventPath(event.slug);
    const url = new URL(path, home).href;
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(event.title);
    await expect(page.locator("main")).toContainText(event.summary);
    await expect(page.locator("main")).toContainText(
      formatEventRange(event.startsAt, event.endsAt),
    );
    if (event.registered) {
      await expect(page.locator("main")).toContainText(`${event.registered} registered`);
    }
    await expect(page).toHaveTitle(`${event.title} | ${site.name}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      event.summary,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", url);
    await expect(page.locator('meta[name="robots"][content*="noindex" i]')).toHaveCount(0);
    if (event.rsvpUrl) {
      expect(
        await page
          .locator("main a")
          .evaluateAll((links) => links.map((a) => a.getAttribute("href"))),
      ).toContain(event.rsvpUrl);
    }

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const item = scripts.map((text) => JSON.parse(text)).find((doc) => doc["@type"] === "Event");
    expect(item).toMatchObject({
      name: event.title,
      url,
      description: event.summary,
      startDate: event.startsAt,
      endDate: event.endsAt,
      organizer: { "@type": "Organization", name: site.name },
    });
    if (event.format === "in-person" && event.venue) {
      expect(item.location).toMatchObject({ "@type": "Place", name: event.venue.name });
      await expect(page.locator("main")).toContainText(event.venue.name);
    } else if (event.format === "online") {
      expect(item.location).toMatchObject({ "@type": "VirtualLocation" });
    }
  });
}
