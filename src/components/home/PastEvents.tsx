import { LogoWatermark } from "@/components/brand/LogoWatermark";
import { ArrowUpRight } from "@/components/icons/Arrow";
import { PillLink } from "@/components/ui/PillLink";
import { Sheet } from "@/components/ui/Sheet";
import type { SiteEvent } from "@/lib/content";
import { formatEventRange, manilaDateParts } from "@/lib/dates";
import { social } from "@/lib/site";

const typeLabel: Record<SiteEvent["type"], string> = {
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

function Highlight({ event }: { event: SiteEvent }) {
  return (
    <article className="reveal relative grid gap-6 overflow-hidden rounded-[2rem] bg-tint-orange p-7 text-on-tint sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="relative z-10 grid gap-4">
        <p className="text-[15px] font-medium text-on-tint-muted">Our biggest gathering so far</p>
        <h3 className="text-3xl font-semibold tracking-[var(--tracking-display)]">{event.title}</h3>
        <p className="max-w-xl text-lg text-on-tint-muted">{event.summary}</p>
        <p className="text-on-tint-muted">
          {formatEventRange(event.startsAt, event.endsAt)}
          {event.venue ? (
            <>
              <br />
              {event.venue.name}, {event.city}
            </>
          ) : null}
        </p>
      </div>
      <div className="relative z-10 grid gap-5 lg:justify-items-end">
        <p className="grid">
          <span className="text-6xl leading-none font-semibold tracking-[var(--tracking-display)] tabular-nums sm:text-7xl">
            {event.registered}
          </span>
          <span className="text-on-tint-muted">registered on Luma</span>
        </p>
        {event.rsvpUrl ? (
          <PillLink href={event.rsvpUrl} className="w-fit">
            View on Luma <ArrowUpRight />
          </PillLink>
        ) : null}
      </div>
      <LogoWatermark corner="top-right" className="h-72 sm:h-[26rem]" opacity={0.2} />
    </article>
  );
}

function EventRow({ event }: { event: SiteEvent }) {
  const d = manilaDateParts(event.startsAt);
  const where = event.format === "online" ? "Online" : (event.city ?? event.venue?.name ?? "");
  return (
    <li>
      <a
        href={event.rsvpUrl ?? social.luma.href}
        rel="noopener noreferrer"
        className="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-surface sm:grid-cols-[6rem_minmax(0,1fr)_10rem_auto] sm:px-5"
      >
        <span className="grid leading-tight">
          <span className="font-medium tabular-nums">
            {d.month} {d.day}
          </span>
          <span className="text-sm text-muted tabular-nums">{d.year}</span>
        </span>
        <span className="grid min-w-0 gap-0.5">
          <span className="text-lg font-medium tracking-[var(--tracking-heading)]">
            {event.title}
          </span>
          <span className="text-sm text-muted sm:hidden">
            {typeLabel[event.type]} · {where}
          </span>
        </span>
        <span className="hidden text-sm text-muted sm:grid">
          <span>{typeLabel[event.type]}</span>
          <span>{where}</span>
        </span>
        <span className="text-muted transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg">
          <ArrowUpRight className="size-5" />
          <span className="sr-only">(opens Luma)</span>
        </span>
      </a>
    </li>
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

export function PastEvents({
  events,
  highlight,
  archive,
}: {
  events: SiteEvent[];
  highlight: SiteEvent | undefined;
  archive: ArchiveEvent[];
}) {
  if (events.length === 0) return null;
  return (
    <Sheet
      id="events"
      aria-labelledby="events-title"
      className="reveal-sheet scroll-mt-24 px-5 py-14 sm:px-10 sm:py-20"
    >
      <div className="mx-auto grid max-w-5xl gap-10">
        <div className="grid justify-items-center gap-4 text-center">
          <h2
            id="events-title"
            className="text-4xl font-semibold tracking-[var(--tracking-display)]"
          >
            Recent events
          </h2>
          <p className="max-w-2xl text-lg text-muted">
            Our latest meetups, watch parties and hackathon nights. Each one links to its original
            page.
          </p>
        </div>
        {highlight ? <Highlight event={highlight} /> : null}
        <ul className="reveal grid divide-y divide-border">
          {events.map((e) => (
            <EventRow key={e.slug} event={e} />
          ))}
        </ul>
        <Archive events={archive} />
      </div>
    </Sheet>
  );
}
