import { LogoWatermark } from "@/components/brand/LogoWatermark";
import { ArrowUpRight } from "@/components/icons/Arrow";
import { PillLink } from "@/components/ui/PillLink";
import { Sheet } from "@/components/ui/Sheet";
import type { EventItem, SiteEvent } from "@/lib/content";
import { formatEventRange } from "@/lib/dates";
import s from "./events.module.css";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/** Regional-indicator emoji for an ISO country code, e.g. "ID" -> 🇮🇩. */
const flag = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

const pinIcon = (
  <svg
    viewBox="0 0 16 16"
    className="size-3.5 shrink-0"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.2 3.6 7.3 4 7.8a.6.6 0 0 0 1 0c.4-.5 4-4.6 4-7.8A4.5 4.5 0 0 0 8 1.5Zm0 6.2A1.7 1.7 0 1 1 8 4.3a1.7 1.7 0 0 1 0 3.4Z" />
  </svg>
);

const screenIcon = (
  <svg
    viewBox="0 0 16 16"
    className="size-3.5 shrink-0"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5v6a1.5 1.5 0 0 1-1.5 1.5h-4v1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h1.5V12h-4A1.5 1.5 0 0 1 1 10.5v-6A1.5 1.5 0 0 1 2.5 3Zm0 1a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-11Z" />
  </svg>
);

/**
 * Where an event happened. In person: a pin with the city, or the country
 * flag and name when outside the Philippines. Online: a quiet grey badge.
 */
function PlaceBadge({ item }: { item: EventItem }) {
  const base =
    "inline-flex max-w-full items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium whitespace-nowrap";
  if (item.format === "online") {
    return (
      <span className={`${base} bg-surface-2 text-muted`}>
        {screenIcon}
        Online
      </span>
    );
  }
  const place = item.country ? (regionNames.of(item.country) ?? item.country) : item.location;
  return (
    <span className={`${base} bg-tint-blue text-on-tint`}>
      {item.country ? <span aria-hidden="true">{flag(item.country)}</span> : pinIcon}
      <span className="truncate">{place}</span>
      {item.format === "hybrid" ? <span className="text-on-tint-muted">· Hybrid</span> : null}
    </span>
  );
}

const xLogo =
  "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z";

function SpeakerLine({ item }: { item: EventItem }) {
  const sp = item.speakers?.[0];
  if (!sp) return null;
  return (
    <span className="flex items-center gap-2.5 pt-2">
      {sp.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sp.photo}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-on-ink"
        >
          {sp.initials}
        </span>
      )}
      <span className="grid text-sm leading-tight">
        <span className="flex items-center gap-1.5">
          <span className="font-medium">{sp.name}</span>
          {sp.href ? (
            <a
              href={sp.href}
              rel="noopener noreferrer"
              aria-label={`${sp.handle ?? sp.name} on X`}
              className="grid size-5 place-items-center rounded-full text-muted transition-colors hover:text-fg"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-3"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d={xLogo} />
              </svg>
            </a>
          ) : null}
        </span>
        {sp.role ? <span className="text-muted">{sp.role}</span> : null}
      </span>
    </span>
  );
}

function ItemRow({ item, upcoming = false }: { item: EventItem; upcoming?: boolean }) {
  const body = (
    <>
      <span
        className={`text-sm font-medium whitespace-nowrap tabular-nums ${upcoming ? "text-fg" : "text-muted"}`}
      >
        {item.monthYear}
      </span>
      <span className="grid min-w-0">
        <span className="leading-snug font-medium text-pretty">{item.title}</span>
        <span className="text-sm leading-snug text-muted">{item.subtitle}</span>
        <SpeakerLine item={item} />
        <span className="flex pt-2 sm:hidden">
          <PlaceBadge item={item} />
        </span>
      </span>
      <span className="hidden min-w-0 justify-end sm:flex">
        <PlaceBadge item={item} />
      </span>
      <span className="text-muted">
        {item.href ? (
          <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
        ) : null}
      </span>
    </>
  );
  const grid =
    "grid grid-cols-[4.75rem_minmax(0,1fr)_1.25rem] items-start gap-4 rounded-2xl px-3 py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto_1.25rem] sm:items-center sm:px-5";
  return (
    <li data-kind={item.kind}>
      {item.href ? (
        <a
          href={item.href}
          rel="noopener noreferrer"
          className={`group ${grid} transition-colors hover:bg-surface`}
        >
          {body}
        </a>
      ) : (
        <div className={grid}>{body}</div>
      )}
    </li>
  );
}

const VISIBLE_ROWS = 20;

function Group({
  title,
  items,
  upcoming = false,
}: {
  title: string;
  items: EventItem[];
  upcoming?: boolean;
}) {
  if (items.length === 0) return null;
  const has = (k: EventItem["kind"]) => String(items.some((i) => i.kind === k));
  const shown = items.slice(0, VISIBLE_ROWS);
  const rest = items.slice(VISIBLE_ROWS);
  return (
    <div
      className={`${s.group} reveal grid gap-2`}
      data-has-community={has("community")}
      data-has-team={has("team")}
    >
      <h3 className="px-3 text-[0.9375rem] font-semibold tracking-[0.1em] text-fg uppercase sm:px-5">
        {title}
      </h3>
      <ul className="grid gap-1">
        {shown.map((item) => (
          <ItemRow key={item.key} item={item} upcoming={upcoming} />
        ))}
      </ul>
      {rest.length > 0 ? (
        <details className={s.more}>
          <summary className="mx-auto mt-2 flex w-fit cursor-pointer list-none items-center gap-2 rounded-pill bg-surface px-5 py-2.5 text-sm font-medium hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
            View all {items.length} events
          </summary>
          <ul className="grid gap-1">
            {rest.map((item) => (
              <ItemRow key={item.key} item={item} upcoming={upcoming} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function Highlight({ event }: { event: SiteEvent }) {
  return (
    <article
      className={`${s.featured} reveal relative grid gap-8 overflow-hidden rounded-[2rem] p-7 text-white sm:p-10`}
    >
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid content-start gap-4">
          <p className={`${s.featuredLabel} text-sm font-semibold tracking-[0.18em] uppercase`}>
            Featured
          </p>
          <h3 className="text-3xl font-semibold tracking-[var(--tracking-display)]">
            {event.title}
          </h3>
          <p className="max-w-xl text-lg text-on-ink-muted">{event.summary}</p>
          <p className="grid gap-1 text-on-ink-muted">
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 16 16"
                className="size-4 shrink-0 text-white"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 1a.75.75 0 0 1 .75.75V2.5h4.5v-.75a.75.75 0 0 1 1.5 0v.75h.75A2 2 0 0 1 14.5 4.5v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h.75v-.75A.75.75 0 0 1 5 1Zm8 6H3v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7Z" />
              </svg>
              {formatEventRange(event.startsAt, event.endsAt)}
            </span>
            {event.venue ? (
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0 text-white"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.2 3.6 7.3 4 7.8a.6.6 0 0 0 1 0c.4-.5 4-4.6 4-7.8A4.5 4.5 0 0 0 8 1.5Zm0 6.2A1.7 1.7 0 1 1 8 4.3a1.7 1.7 0 0 1 0 3.4Z" />
                </svg>
                {event.venue.name}, {event.city}
              </span>
            ) : null}
          </p>
        </div>
        <div className="grid content-between gap-5 lg:justify-items-end lg:text-right">
          <p className="grid">
            <span
              className={`${s.featuredNumber} text-6xl leading-none font-semibold tracking-[var(--tracking-display)] tabular-nums sm:text-7xl`}
            >
              {event.registered}
            </span>
            <span className="text-on-ink-muted">builders joined</span>
          </p>
          {event.rsvpUrl ? (
            <PillLink href={event.rsvpUrl} variant="on-dark" className="w-fit">
              View on Luma <ArrowUpRight />
            </PillLink>
          ) : null}
        </div>
      </div>
      {event.sponsors.length > 0 ? (
        <div className="relative z-10 grid gap-3 border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-on-ink-muted">Sponsored by</p>
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {event.sponsors.map((sp) => (
              <li key={sp.name}>
                <a
                  href={sp.url}
                  rel="noopener noreferrer"
                  className="block opacity-70 transition-opacity hover:opacity-100"
                >
                  {/* Official logos rendered as white silhouettes on the dark card. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.logo}
                    alt={sp.name}
                    height={28}
                    className="h-6 w-auto brightness-0 invert sm:h-7"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <LogoWatermark corner="top-right" className="h-72 sm:h-[26rem]" opacity={0.08} />
    </article>
  );
}

type ArchiveEvent = { title: string; date: string; place: string; url: string; source: string };

function Archive({ events }: { events: ArchiveEvent[] }) {
  if (events.length === 0) return null;
  const first = events.at(-1)?.date.slice(0, 4);
  const last = events[0]?.date.slice(0, 4);
  return (
    <details className="reveal group rounded-[2rem] bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[2rem] px-6 py-5 hover:bg-surface-2 sm:px-8 [&::-webkit-details-marker]:hidden">
        <span className="grid gap-0.5">
          <span className="text-lg font-medium">
            From the Meetup archive, {first} to {last}
          </span>
          <span className="text-sm text-muted">
            {events.length} earlier events, from the first Study Jams to Flutter Engage. More are
            being recovered.
          </span>
        </span>
        <svg
          viewBox="0 0 16 16"
          className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </summary>
      <ul className="grid divide-y divide-border px-3 pb-3 sm:px-5">
        {events.map((e) => (
          <li key={e.url}>
            <a
              href={e.url}
              rel="noopener noreferrer"
              className="group/row grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl px-3 py-3 hover:bg-bg sm:grid-cols-[5rem_minmax(0,1fr)_8rem_auto]"
            >
              <span className="text-sm text-muted tabular-nums">{e.date.slice(0, 4)}</span>
              <span className="min-w-0 font-medium">{e.title}</span>
              <span className="hidden text-sm text-muted sm:block">{e.place}</span>
              <ArrowUpRight className="size-4 text-muted group-hover/row:text-fg" />
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

const filters = [
  { value: "all", label: "All" },
  { value: "community", label: "Community events" },
  { value: "team", label: "Events by team" },
] as const;

export function PastEvents({
  upcoming,
  past,
  highlight,
  archive,
}: {
  upcoming: EventItem[];
  past: EventItem[];
  highlight: SiteEvent | undefined;
  archive: ArchiveEvent[];
}) {
  if (upcoming.length + past.length === 0) return null;
  const count = (k?: EventItem["kind"]) =>
    [...upcoming, ...past].filter((i) => !k || i.kind === k).length;
  const counts = {
    all: count() + archive.length,
    community: count("community") + archive.length,
    team: count("team"),
  };
  return (
    <Sheet
      id="events"
      aria-labelledby="events-title"
      className={`${s.events} reveal-sheet scroll-mt-24 px-5 py-14 sm:px-10 sm:py-20`}
    >
      <div className="mx-auto grid max-w-5xl gap-10">
        <div className="reveal grid justify-items-center gap-4 text-center">
          <h2
            id="events-title"
            className="text-4xl font-semibold tracking-[var(--tracking-display)]"
          >
            Recent and upcoming events
          </h2>
          <p className="max-w-2xl text-lg text-muted">
            Our own meetups, plus the talks and workshops our team gives at events across the
            Philippines and beyond.
          </p>
        </div>

        {highlight ? <Highlight event={highlight} /> : null}

        <div className="reveal grid justify-items-center">
          <fieldset className="flex flex-wrap justify-center gap-2">
            <legend className="sr-only">Show</legend>
            {filters.map((f) => (
              <label key={f.value} className={s.chip}>
                <input
                  type="radio"
                  name="event-filter"
                  value={f.value}
                  defaultChecked={f.value === "all"}
                  className="sr-only"
                />
                <span>
                  {f.label} <span className="tabular-nums">{counts[f.value]}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <Group title="Coming up" items={upcoming} upcoming />
        <Group title="Recent" items={past} />
        <div data-kind="community">
          <Archive events={archive} />
        </div>
      </div>
    </Sheet>
  );
}
