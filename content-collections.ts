import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

/**
 * Content model for flutter.ph.
 *
 * Every collection is validated with Zod at build time. A bad field fails
 * `pnpm dev` / `pnpm build` with the file path and the field that is wrong.
 * See docs/content-guide.md for how to add each type of entry.
 */

/** ISO 8601 with an explicit Philippine offset, e.g. 2026-12-05T14:00:00+08:00 */
const manilaDateTime = z.iso
  .datetime({ offset: true })
  .refine(
    (v) => v.endsWith("+08:00"),
    "use the Philippine offset +08:00, e.g. 2026-12-05T14:00:00+08:00",
  );

const isoDate = z.iso.date();
const url = z.url();

/** Images live in public/images/... and are referenced as /images/... */
const imagePath = z
  .string()
  .regex(
    /^\/images\/.+\.(png|jpe?g|webp|avif|svg)$/i,
    "put the file in public/images/ and write it as /images/<file>",
  );

/** Every image must say what it shows. Empty alt is only allowed for purely decorative images, which content never has. */
const alt = z.string().min(3, "describe the image for people using screen readers");

const sample = z.boolean().default(false);

/** MDX body below the frontmatter. */
const content = z.string();

const links = z
  .object({
    website: url,
    github: url,
    linkedin: url,
    x: url,
    bluesky: url,
    mastodon: url,
    youtube: url,
    facebook: url,
    instagram: url,
  })
  .partial()
  .default({});

const people = defineCollection({
  name: "people",
  directory: "content/people",
  include: "*.mdx",
  schema: z
    .object({
      name: z.string().min(2),
      role: z.string().optional(),
      photo: imagePath.optional(),
      photoAlt: alt.optional(),
      pronouns: z.string().max(20).optional(),
      links,
      sample,
      content,
    })
    .refine((p) => !p.photo || p.photoAlt, {
      message: "photoAlt is required when photo is set",
      path: ["photoAlt"],
    }),
  transform: async (doc, ctx) => ({
    ...doc,
    slug: doc._meta.path,
    bio: await compileMDX(ctx, doc),
  }),
});

const eventTypes = [
  "meetup",
  "watch-party",
  "social",
  "study-jam",
  "workshop",
  "io-extended",
  "hackathon",
  "talk",
  "other",
] as const;
const eventFormats = ["in-person", "online", "hybrid"] as const;

const events = defineCollection({
  name: "events",
  directory: "content/events",
  include: "*.mdx",
  schema: z
    .object({
      title: z.string().min(3),
      summary: z.string().min(10).max(200),
      type: z.enum(eventTypes),
      format: z.enum(eventFormats),
      startsAt: manilaDateTime,
      endsAt: manilaDateTime,
      city: z.string().optional(),
      chapter: z.string().optional(),
      venue: z
        .object({
          name: z.string(),
          address: z.string().optional(),
          mapUrl: url.optional(),
        })
        .optional(),
      rsvpUrl: url.optional(),
      coverImage: imagePath.optional(),
      coverAlt: alt.optional(),
      speakers: z.array(z.string()).default([]),
      agenda: z
        .array(
          z.object({
            time: z.string().regex(/^\d{2}:\d{2}$/, "use 24-hour HH:MM"),
            title: z.string(),
            speaker: z.string().optional(),
          }),
        )
        .default([]),
      /** Upcoming vs past is computed from the dates. Only cancellation is set by hand. */
      cancelled: z.boolean().default(false),
      /** Sponsors with official logo files in public/images/sponsors. */
      sponsors: z.array(z.object({ name: z.string(), logo: imagePath, url })).default([]),
      /** Registrations shown on the RSVP platform, if public. Shown as-is, never estimated. */
      registered: z.number().int().positive().optional(),
      resources: z.object({ slides: url, recording: url, photos: url }).partial().default({}),
      sample,
      content,
    })
    .refine((e) => Date.parse(e.endsAt) > Date.parse(e.startsAt), {
      message: "endsAt must be after startsAt",
      path: ["endsAt"],
    })
    .refine((e) => !e.coverImage || e.coverAlt, {
      message: "coverAlt is required when coverImage is set",
      path: ["coverAlt"],
    })
    .refine((e) => e.format === "online" || e.venue, {
      message: "in-person and hybrid events need a venue",
      path: ["venue"],
    }),
  transform: async (doc, ctx) => {
    const knownPeople = new Set(ctx.documents(people).map((p) => p._meta.path));
    const refs = [...doc.speakers, ...doc.agenda.flatMap((a) => (a.speaker ? [a.speaker] : []))];
    const missing = refs.filter((r) => !knownPeople.has(r));
    if (missing.length > 0) {
      throw new Error(
        `${doc._meta.filePath}: unknown speaker(s) ${missing.join(", ")}. Add content/people/<slug>.mdx first.`,
      );
    }
    return { ...doc, slug: doc._meta.path, body: await compileMDX(ctx, doc) };
  },
});

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: z
    .object({
      title: z.string().min(3),
      description: z.string().min(20).max(200),
      date: isoDate,
      author: z.string(),
      tags: z.array(z.string()).default([]),
      cover: imagePath.optional(),
      coverAlt: alt.optional(),
      draft: z.boolean().default(false),
      sample,
      content,
    })
    .refine((p) => !p.cover || p.coverAlt, {
      message: "coverAlt is required when cover is set",
      path: ["coverAlt"],
    }),
  transform: async (doc, ctx) => {
    const known = new Set(ctx.documents(people).map((p) => p._meta.path));
    if (!known.has(doc.author)) {
      throw new Error(
        `${doc._meta.filePath}: unknown author "${doc.author}". Add content/people/${doc.author}.mdx first.`,
      );
    }
    return { ...doc, slug: doc._meta.path, body: await compileMDX(ctx, doc) };
  },
});

const showcase = defineCollection({
  name: "showcase",
  directory: "content/showcase",
  include: "*.mdx",
  schema: z.object({
    appName: z.string(),
    team: z.string(),
    description: z.string().min(10).max(200),
    platforms: z.array(z.enum(["android", "ios", "web", "macos", "windows", "linux"])).min(1),
    storeLinks: z
      .object({ playStore: url, appStore: url, web: url, github: url })
      .partial()
      .default({}),
    screenshots: z.array(z.object({ src: imagePath, alt })).default([]),
    featured: z.boolean().default(false),
    sample,
    content,
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const partners = defineCollection({
  name: "partners",
  directory: "content/partners",
  include: "*.mdx",
  schema: z.object({
    name: z.string(),
    /** Official logo file, added with the owner's permission. Without one, the name is shown as text. */
    logo: imagePath.optional(),
    logoAlt: alt.optional(),
    url,
    tier: z.enum(["community", "venue", "sponsor", "supporter"]),
    since: z.number().int().min(2017).max(2100).optional(),
    /** Lower numbers show first in the "Supported by" strip. */
    order: z.number().int().default(100),
    sample,
    content,
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const chapters = defineCollection({
  name: "chapters",
  directory: "content/chapters",
  include: "*.mdx",
  schema: z.object({
    name: z.string(),
    city: z.string(),
    region: z.string(),
    leads: z.array(z.string()).default([]),
    channels: z
      .object({ facebook: url, discord: url, meetup: url, luma: url, telegram: url })
      .partial()
      .default({}),
    active: z.boolean().default(true),
    sample,
    content,
  }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

const jobs = defineCollection({
  name: "jobs",
  directory: "content/jobs",
  include: "*.mdx",
  schema: z
    .object({
      title: z.string(),
      company: z.string(),
      location: z.string(),
      remote: z.enum(["onsite", "hybrid", "remote"]),
      url,
      postedAt: isoDate,
      expiresAt: isoDate,
      sample,
      content,
    })
    .refine((j) => j.expiresAt > j.postedAt, {
      message: "expiresAt must be after postedAt",
      path: ["expiresAt"],
    }),
  transform: (doc) => ({ ...doc, slug: doc._meta.path }),
});

/**
 * Older events from the closed Meetup group (meetup.com/flutterph), recovered
 * from public event pages and the Wayback Machine. One YAML file, a list.
 */
const archive = defineCollection({
  name: "archive",
  directory: "content/archive",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    source: z.string(),
    events: z.array(
      z.object({
        title: z.string(),
        date: isoDate,
        place: z.string(),
        url,
      }),
    ),
  }),
});

/**
 * Talks and workshops the Flutter PH team gave at other communities' events.
 * One YAML file per year.
 */
const talks = defineCollection({
  name: "talks",
  directory: "content/talks",
  include: "*.yaml",
  parser: "yaml",
  schema: z.object({
    year: z.number().int(),
    talks: z.array(
      z
        .object({
          date: isoDate,
          endDate: isoDate.optional(),
          event: z.string(),
          host: z.string().optional(),
          location: z.string().optional(),
          /** ISO 3166-1 alpha-2 code, only for events outside the Philippines (shows a flag). */
          country: z
            .string()
            .regex(/^[A-Z]{2}$/, "use a two-letter country code, e.g. ID")
            .optional(),
          format: z.enum(eventFormats),
          kind: z.enum(["talk", "workshop", "talk-and-workshop", "booth", "masterclass", "panel"]),
          speakers: z.array(z.string()).default([]),
          title: z.string().optional(),
          /** The talk's real title when `title` is a varied display title for a repeat. */
          officialTitle: z.string().optional(),
          audience: z.number().int().positive().optional(),
          url: url.optional(),
        })
        .refine((t) => !t.endDate || t.endDate >= t.date, {
          message: "endDate must be on or after date",
          path: ["endDate"],
        }),
    ),
    /** Demo and workshop repos published alongside the talks. */
    openSource: z
      .array(z.object({ date: isoDate, repo: z.string(), for: z.string(), url }))
      .default([]),
  }),
});

export default defineConfig({
  content: [people, events, posts, showcase, partners, chapters, jobs, archive, talks],
});
