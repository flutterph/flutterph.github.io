import "server-only";
import { allArchives, allEvents, allPartners } from "content-collections";
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
