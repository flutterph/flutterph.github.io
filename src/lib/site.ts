/**
 * Single source of truth for site-wide settings and outbound links.
 * The old site linked through bit.ly; these are the resolved destinations
 * (checked 2026-11-20).
 */
export const site = {
  name: "Flutter Philippines",
  shortName: "Flutter PH",
  tagline:
    "A collaborative community for anyone interested in developing apps using Flutter and Dart.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://flutter.ph",
  locale: "en_PH",
  timeZone: "Asia/Manila",
  repo: "https://github.com/flutterph/flutterph.github.io",
  /** Primary call to action. go.flutter.ph/join is a separate redirect service; keep its DNS record untouched. */
  joinUrl: "https://go.flutter.ph/join",
  /**
   * Google Analytics 4 measurement ID ("G-..."). Public by design: it ships in every page.
   * Property "Flutter Philippines - GA4" (382764891), web stream for https://flutter.ph.
   * It replaces Universal Analytics UA-121652877-4, which Google retired in 2023.
   */
  gaMeasurementId: "G-YF5SJSL54Q",
  /** Wording required by the Flutter brand guidelines for community websites (docs.flutter.dev/brand). */
  affiliation:
    "Flutter and the related logo are trademarks of Google LLC. We are not endorsed by or affiliated with Google LLC.",
  /** Required on event pages that use "Flutter" in the event name. */
  eventDisclaimer:
    "This event is community-run and is not affiliated with or otherwise sponsored by Google LLC.",
} as const;

export type SocialKey =
  "facebook" | "facebookGroup" | "luma" | "instagram" | "x" | "linkedin" | "github";

export const social: Record<SocialKey, { label: string; href: string }> = {
  facebook: { label: "Facebook", href: "https://www.facebook.com/flutterphilippines" },
  facebookGroup: {
    label: "Facebook Group",
    href: "https://www.facebook.com/groups/flutterphilippines",
  },
  luma: { label: "Luma", href: "https://luma.com/flutterph" },
  instagram: { label: "Instagram", href: "https://www.instagram.com/flutter_ph" },
  x: { label: "X (Twitter)", href: "https://x.com/flutter_ph" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/company/flutterph" },
  github: { label: "GitHub", href: "https://github.com/flutterph" },
};

/**
 * The Meetup group (meetup.com/flutterph) has been closed, so it is no longer
 * listed. Old event pages on Meetup still resolve, so legacy links point there.
 *
 * Legacy flutter.ph URLs that must keep working after migration.
 * Each becomes a static page at the same path (e.g. out/join.html).
 */
export const legacyRedirects = {
  join: { to: "https://go.flutter.ph/join", label: "the Flutter Philippines community group" },
  ask: { to: "https://app.sli.do/event/sl8leavi/live/questions", label: "Slido" },
  "meetup-3": {
    to: "https://www.meetup.com/95f405ab-a03b-4018-9ced-739af084e304/events/268351354/",
    label: "Meetup",
  },
  "meetups/3": {
    to: "https://www.meetup.com/95f405ab-a03b-4018-9ced-739af084e304/events/268351354/",
    label: "Meetup",
  },
  "webinars/1": {
    to: "https://www.meetup.com/95f405ab-a03b-4018-9ced-739af084e304/events/269500209/",
    label: "Meetup",
  },
} as const;
