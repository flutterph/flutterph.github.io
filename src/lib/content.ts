import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { allArchives, allEvents, allPartners, allPeople, allTalks } from "content-collections";
import { manilaDateParts, manilaDayKey } from "./dates";
import { pastEvents, upcomingEvents, visible } from "./visibility";

export type SiteEvent = (typeof allEvents)[number];

export function getEvents(): SiteEvent[] {
  return visible(allEvents);
}

export function getUpcomingEvents(now = new Date()) {
  return upcomingEvents(getEvents(), now);
}

export function getPastEvents(now = new Date()) {
  return pastEvents(getEvents(), now);
}

/** The past event with the most public registrations, if any have counts. */
export function getHighlightEvent(now = new Date()) {
  return getPastEvents(now)
    .filter((e) => e.registered)
    .toSorted((a, b) => (b.registered ?? 0) - (a.registered ?? 0))[0];
}

export function getSupporters() {
  return visible(allPartners)
    .filter((p) => p.tier === "supporter")
    .toSorted((a, b) => a.order - b.order);
}

/** Older events from the closed Meetup group, newest first. */
export function getArchiveEvents() {
  return allArchives
    .flatMap((a) => a.events.map((e) => ({ ...e, source: a.source })))
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export type EventFormat = SiteEvent["format"] | "open-source";

/** One row in the events list: a Flutter PH event or a talk our team gave elsewhere. */
export type EventItem = {
  key: string;
  kind: "community" | "team";
  title: string;
  subtitle: string;
  /** YYYY-MM-DD in Manila, for sorting. */
  day: string;
  monthYear: string;
  location: string;
  format: EventFormat;
  /** ISO country code for events outside the Philippines. */
  country?: string;
  href?: string;
  count?: { value: number; label: string };
  speakers?: Speaker[];
};

export type Speaker = {
  name: string;
  role?: string;
  initials: string;
  handle?: string;
  href?: string;
  photo?: string;
};

/** Looks up a person by slug. A photo at public/images/people/<slug>.jpg is used when present. */
export function getSpeaker(slug: string): Speaker | undefined {
  const p = allPeople.find((x) => x.slug === slug);
  if (!p) return undefined;
  const xUrl = p.links.x;
  const file = `/images/people/${slug}.jpg`;
  const photo = p.photo ?? (existsSync(join(process.cwd(), "public", file)) ? file : undefined);
  return {
    name: p.name,
    role: p.role,
    initials: p.name
      .split(" ")
      .filter((w) => /^[A-Z]/.test(w))
      .map((w) => w[0])
      .slice(0, 2)
      .join(""),
    handle: xUrl ? `@${xUrl.split("/").filter(Boolean).at(-1)}` : undefined,
    href: xUrl ?? p.links.github ?? p.links.website,
    photo,
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYearOf = (day: string) => `${MONTHS[Number(day.slice(5, 7)) - 1]} ${day.slice(0, 4)}`;

const eventTypeLabel: Record<SiteEvent["type"], string> = {
  meetup: "Meetup",
  "watch-party": "Watch party",
  social: "Social",
  "study-jam": "Study Jam",
  workshop: "Workshop",
  "io-extended": "I/O Extended",
  hackathon: "Hackathon",
  talk: "Talk",
  other: "Event",
};

const talkKindLabel = {
  talk: "Talk",
  workshop: "Workshop",
  "talk-and-workshop": "Talk and workshop",
  booth: "Booth",
  masterclass: "Masterclass",
  panel: "Panel",
} as const;

export function getTeamTalks() {
  return allTalks.flatMap((y) => y.talks);
}

/** Flutter PH events and team talks, split into upcoming (soonest first) and past (newest first). */
export function getEventItems(now = new Date()): { upcoming: EventItem[]; past: EventItem[] } {
  const today = manilaDayKey(now);
  const community: (EventItem & { upcoming: boolean })[] = getEvents().map((e) => {
    const p = manilaDateParts(e.startsAt);
    return {
      key: `e-${e.slug}`,
      kind: "community",
      title: e.title,
      subtitle: eventTypeLabel[e.type],
      day: manilaDayKey(e.startsAt),
      monthYear: `${p.month} ${p.year}`,
      location: e.format === "online" ? "Online" : (e.city ?? e.venue?.name ?? ""),
      format: e.format,
      href: e.rsvpUrl,
      count: e.registered ? { value: e.registered, label: "registered" } : undefined,
      upcoming: Date.parse(e.endsAt) > now.getTime(),
    };
  });
  const team: (EventItem & { upcoming: boolean })[] = getTeamTalks().map((t, i) => ({
    key: `t-${t.date}-${i}`,
    kind: "team",
    title: t.title ?? "Session title to be announced",
    subtitle: [talkKindLabel[t.kind], t.event, t.host].filter(Boolean).join(" · "),
    day: t.date,
    monthYear: monthYearOf(t.date),
    location: t.location ?? "",
    format: t.format,
    country: t.country,
    href: t.url,
    count: t.audience ? { value: t.audience, label: "attendees" } : undefined,
    speakers: t.speakers.map(getSpeaker).filter((x): x is Speaker => Boolean(x)),
    upcoming: (t.endDate ?? t.date) >= today,
  }));
  const repos: (EventItem & { upcoming: boolean })[] = allTalks
    .flatMap((y) => y.openSource)
    .map((r) => ({
      key: `r-${r.repo}`,
      kind: "team",
      title: r.repo,
      subtitle: `Open source · ${r.for}`,
      day: r.date,
      monthYear: monthYearOf(r.date),
      location: "GitHub",
      format: "open-source",
      href: r.url,
      upcoming: false,
    }));
  const all = [...community, ...team, ...repos];
  const strip = (i: EventItem & { upcoming: boolean }): EventItem => {
    const { upcoming, ...rest } = i;
    void upcoming;
    return rest;
  };
  return {
    upcoming: all
      .filter((i) => i.upcoming)
      .sort((a, b) => a.day.localeCompare(b.day))
      .map(strip),
    past: all
      .filter((i) => !i.upcoming)
      .sort((a, b) => b.day.localeCompare(a.day))
      .map(strip),
  };
}
