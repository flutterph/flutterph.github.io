const origin = "https://flutter.ph/";
const sitemap = new URL("sitemap.xml", origin).href;
const property = process.env.SEARCH_CONSOLE_PROPERTY || "sc-domain:flutter.ph";
const token = process.env.SEARCH_CONSOLE_ACCESS_TOKEN;
const submit = process.argv.includes("--submit-sitemap");

if (!token) {
  throw new Error("Set SEARCH_CONSOLE_ACCESS_TOKEN for a verified flutter.ph property.");
}

async function google(url, method, data) {
  const response = await fetch(url, {
    method,
    redirect: "error",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: data && JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Search Console: ${response.status} ${await response.text()}`);
  return method === "PUT" ? null : response.json();
}

const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}`;
const response = await fetch(sitemap);
if (!response.ok) throw new Error(`Deploy the event sitemap first (HTTP ${response.status}).`);
const urls = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const event = urls.find((url) => url.startsWith(origin + "events/"));
if (!urls.includes(origin) || !event) throw new Error("The event sitemap is not live yet.");
if (submit) await google(`${api}/sitemaps/${encodeURIComponent(sitemap)}`, "PUT");

const date = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
const period = { startDate: date(31), endDate: date(4) };
const inspections = [];
for (const inspectionUrl of [origin, event]) {
  const { inspectionResult } = await google(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    "POST",
    { inspectionUrl, siteUrl: property, languageCode: "en-US" },
  );
  inspections.push({ url: inspectionUrl, ...inspectionResult.indexStatusResult });
}

const queries = [];
for (const query of ["flutter philippines", "flutter meetup manila"]) {
  const { rows = [] } = await google(`${api}/searchAnalytics/query`, "POST", {
    ...period,
    type: "web",
    dimensions: ["query"],
    dimensionFilterGroups: [
      { filters: [{ dimension: "query", operator: "equals", expression: query }] },
    ],
  });
  queries.push({ query, metrics: rows[0] ?? null });
}

console.log(
  JSON.stringify({ property, period, sitemapSubmitted: submit, inspections, queries }, null, 2),
);
