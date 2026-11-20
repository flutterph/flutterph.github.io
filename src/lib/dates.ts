/**
 * Date helpers. Every date on the site is shown in Asia/Manila (UTC+8, no DST),
 * regardless of the visitor's or the build machine's time zone.
 */
export const MANILA_TZ = "Asia/Manila";

type DateInput = string | Date;
const toDate = (d: DateInput) => (typeof d === "string" ? new Date(d) : d);

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-PH", { timeZone: MANILA_TZ, ...opts });

const partsFmt = fmt({
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
  hourCycle: "h23",
});

/** Built from parts so output is identical across ICU versions and locales. */
function parts(d: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    weekday: p.weekday!,
    month: p.month!,
    day: p.day!,
    year: p.year!,
    hour: Number(p.hour),
    minute: p.minute!,
  };
}
const keyFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: MANILA_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar day in Manila as YYYY-MM-DD. */
export function manilaDayKey(d: DateInput): string {
  return keyFmt.format(toDate(d));
}

/** "Sat, Dec 5, 2026" or "Sat, Dec 5" */
export function formatManilaDate(d: DateInput, withYear = true): string {
  const p = parts(toDate(d));
  return `${p.weekday}, ${p.month} ${p.day}${withYear ? `, ${p.year}` : ""}`;
}

/** "2:00 PM" */
export function formatManilaTime(d: DateInput): string {
  const { hour, minute } = parts(toDate(d));
  return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${hour < 12 ? "AM" : "PM"}`;
}

/**
 * Human-readable range in Manila time.
 * Same day:      "Sat, Dec 5, 2026, 2:00 PM to 6:00 PM PHT"
 * Crosses days:  "Sat, Dec 5, 8:00 PM to Sun, Dec 6, 2026, 2:00 AM PHT"
 */
export function formatEventRange(startsAt: DateInput, endsAt: DateInput): string {
  const s = toDate(startsAt);
  const e = toDate(endsAt);
  if (manilaDayKey(s) === manilaDayKey(e)) {
    return `${formatManilaDate(s)}, ${formatManilaTime(s)} to ${formatManilaTime(e)} PHT`;
  }
  const sameYear = manilaDayKey(s).slice(0, 4) === manilaDayKey(e).slice(0, 4);
  return `${formatManilaDate(s, !sameYear)}, ${formatManilaTime(s)} to ${formatManilaDate(e)}, ${formatManilaTime(e)} PHT`;
}

export type EventPhase = "upcoming" | "live" | "past" | "cancelled";

/** An event is past once it has ended, so a talk still running counts as live, not past. */
export function eventPhase(
  e: { startsAt: string; endsAt: string; cancelled?: boolean },
  now: Date = new Date(),
): EventPhase {
  if (e.cancelled) return "cancelled";
  const t = now.getTime();
  if (t >= Date.parse(e.endsAt)) return "past";
  if (t >= Date.parse(e.startsAt)) return "live";
  return "upcoming";
}

/** Job posts disappear after the end of their expiry day in Manila. */
export function isExpired(expiresAt: string, now: Date = new Date()): boolean {
  return manilaDayKey(now) > expiresAt;
}

/** Month, day and year in Manila, for date badges: { month: "Dec", day: "5", year: "2026" }. */
export function manilaDateParts(d: DateInput): {
  month: string;
  day: string;
  year: string;
  weekday: string;
} {
  const p = parts(toDate(d));
  return { month: p.month, day: p.day, year: p.year, weekday: p.weekday };
}
