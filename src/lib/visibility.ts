import { eventPhase } from "./dates";

/**
 * Sample entries (`sample: true`) exist so every page can be clicked through
 * before real content exists. They show in `pnpm dev` and are removed from
 * production builds unless SHOW_SAMPLE_CONTENT=true (used by `pnpm build:preview`).
 */
export function showSamples(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.SHOW_SAMPLE_CONTENT === "true") return true;
  if (env.SHOW_SAMPLE_CONTENT === "false") return false;
  return env.NODE_ENV === "development";
}

export function visible<T extends { sample: boolean; draft?: boolean }>(
  items: readonly T[],
  env = process.env,
): T[] {
  const samples = showSamples(env);
  const drafts = env.NODE_ENV === "development";
  return items.filter((i) => (samples || !i.sample) && (drafts || !i.draft));
}

type Datable = { startsAt: string; endsAt: string; cancelled: boolean };

/** Upcoming and live events, soonest first. Cancelled events stay listed (marked) until their date passes. */
export function upcomingEvents<T extends Datable>(events: readonly T[], now = new Date()): T[] {
  return events
    .filter((e) => Date.parse(e.endsAt) > now.getTime())
    .toSorted((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

/** Past events, most recent first. Cancelled events are dropped once their date passes. */
export function pastEvents<T extends Datable>(events: readonly T[], now = new Date()): T[] {
  return events
    .filter((e) => eventPhase(e, now) === "past")
    .toSorted((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
}
