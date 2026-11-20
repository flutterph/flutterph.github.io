import { describe, expect, it } from "vitest";
import { pastEvents, showSamples, upcomingEvents, visible } from "./visibility";

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

describe("showSamples", () => {
  it("shows samples in development by default", () => {
    expect(showSamples(env({ NODE_ENV: "development" }))).toBe(true);
  });
  it("hides samples in production by default", () => {
    expect(showSamples(env({ NODE_ENV: "production" }))).toBe(false);
  });
  it("respects the explicit flag either way", () => {
    expect(showSamples(env({ NODE_ENV: "production", SHOW_SAMPLE_CONTENT: "true" }))).toBe(true);
    expect(showSamples(env({ NODE_ENV: "development", SHOW_SAMPLE_CONTENT: "false" }))).toBe(false);
  });
});

describe("visible", () => {
  const items = [
    { id: "real", sample: false },
    { id: "sample", sample: true },
    { id: "draft", sample: false, draft: true },
  ];
  it("never ships samples or drafts in production", () => {
    expect(visible(items, env({ NODE_ENV: "production" })).map((i) => i.id)).toEqual(["real"]);
  });
  it("shows everything in development", () => {
    expect(visible(items, env({ NODE_ENV: "development" })).map((i) => i.id)).toEqual([
      "real",
      "sample",
      "draft",
    ]);
  });
  it("preview builds include samples but not drafts", () => {
    expect(
      visible(items, env({ NODE_ENV: "production", SHOW_SAMPLE_CONTENT: "true" })).map((i) => i.id),
    ).toEqual(["real", "sample"]);
  });
});

describe("upcoming and past events", () => {
  const now = new Date("2026-12-06T01:00:00+08:00");
  const ev = (id: string, startsAt: string, endsAt: string, cancelled = false) => ({
    id,
    startsAt,
    endsAt,
    cancelled,
  });
  const events = [
    ev("last-month", "2026-11-07T14:00:00+08:00", "2026-11-07T18:00:00+08:00"),
    ev("overnight-live", "2026-12-05T20:00:00+08:00", "2026-12-06T02:00:00+08:00"),
    ev("next-week", "2026-12-12T14:00:00+08:00", "2026-12-12T18:00:00+08:00"),
    ev("tomorrow", "2026-12-07T14:00:00+08:00", "2026-12-07T18:00:00+08:00"),
    ev("cancelled-old", "2026-10-01T14:00:00+08:00", "2026-10-01T18:00:00+08:00", true),
    ev("last-week", "2026-11-28T14:00:00+08:00", "2026-11-28T18:00:00+08:00"),
  ];

  it("keeps an overnight event upcoming until it ends, sorted soonest first", () => {
    expect(upcomingEvents(events, now).map((e) => e.id)).toEqual([
      "overnight-live",
      "tomorrow",
      "next-week",
    ]);
  });

  it("lists past events newest first and drops cancelled ones", () => {
    expect(pastEvents(events, now).map((e) => e.id)).toEqual(["last-week", "last-month"]);
  });
});
