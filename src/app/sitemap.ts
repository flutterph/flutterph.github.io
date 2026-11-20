import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/content";
import { eventPath } from "@/lib/event-path";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...getEvents().map(({ slug }) => eventPath(slug))].map((path) => ({
    url: new URL(path, site.url).href,
  }));
}
