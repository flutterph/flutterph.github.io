import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PillLink } from "@/components/ui/PillLink";
import { getEvents, type SiteEvent } from "@/lib/content";
import { eventPhase, formatEventRange } from "@/lib/dates";
import { eventPath } from "@/lib/event-path";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getEvents().map(({ slug }) => ({ slug }));
}

async function readEvent(params: Props["params"]) {
  const { slug } = await params;
  return getEvents().find((event) => event.slug === slug) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await readEvent(params);
  const url = new URL(eventPath(event.slug), site.url).href;
  const title = `${event.title} | ${site.name}`;
  const image = { url: event.coverImage ?? "/og.jpg", alt: event.coverAlt ?? site.name };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: event.summary,
      url,
      type: "website",
      siteName: site.name,
      locale: site.locale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: "@flutter_ph",
      title,
      description: event.summary,
      images: [image],
    },
  };
}

const formats = { online: "Online", "in-person": "In person", hybrid: "Hybrid" };
const modes = {
  online: "OnlineEventAttendanceMode",
  "in-person": "OfflineEventAttendanceMode",
  hybrid: "MixedEventAttendanceMode",
};
const resourceLabels = {
  slides: "Presentation slides",
  recording: "Event recording",
  photos: "Event photos",
} as const;

function eventSchema(event: SiteEvent) {
  const url = new URL(eventPath(event.slug), site.url).href;
  const venue = event.venue && {
    "@type": "Place",
    name: event.venue.name,
    address: event.venue.address,
  };
  const online = { "@type": "VirtualLocation", name: "Online" };
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": url + "#event",
    url,
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: event.cancelled ? "https://schema.org/EventCancelled" : undefined,
    eventAttendanceMode: `https://schema.org/${modes[event.format]}`,
    location:
      event.format === "online" ? online : event.format === "hybrid" ? [venue, online] : venue,
    organizer: {
      "@type": "Organization",
      "@id": new URL("/#organization", site.url).href,
      name: site.name,
      url: new URL("/", site.url).href,
    },
    image: event.coverImage ? new URL(event.coverImage, site.url).href : undefined,
    sameAs: event.rsvpUrl,
  };
}

export default async function EventPage({ params }: Props) {
  const event = await readEvent(params);
  const past = eventPhase(event) === "past";
  const resources = (Object.keys(resourceLabels) as (keyof typeof resourceLabels)[]).filter(
    (key) => event.resources[key],
  );
  return (
    <main id="main" className="mx-auto max-w-4xl px-4 pt-28 pb-12 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema(event)).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/#events" prefetch={false} className="font-medium text-link underline">
        All community events
      </Link>
      <article className="mt-5 grid gap-8 rounded-sheet bg-bg px-6 py-10 sm:px-12">
        <header className="grid gap-3">
          <p className="text-sm font-medium text-muted">
            {event.cancelled ? "Cancelled event" : past ? "Past event" : "Community event"} ·{" "}
            {formats[event.format]}
          </p>
          <h1 className="text-4xl font-semibold tracking-[var(--tracking-display)] sm:text-5xl">
            {event.title}
          </h1>
          <p className="max-w-prose text-lg text-muted">{event.summary}</p>
        </header>
        <dl className="grid gap-4 rounded-2xl bg-surface p-5">
          <div>
            <dt className="font-semibold">When</dt>
            <dd>{formatEventRange(event.startsAt, event.endsAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Where</dt>
            <dd>
              {event.venue
                ? [event.venue.name, event.venue.address ?? event.city].filter(Boolean).join(" · ")
                : formats[event.format]}
            </dd>
          </div>
          {event.registered ? (
            <div>
              <dt className="font-semibold">Registrations</dt>
              <dd>{event.registered} registered</dd>
            </div>
          ) : null}
        </dl>
        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold">{past ? "Event recap" : "About the event"}</h2>
          <div className="grid max-w-prose gap-3 [&_a]:text-link [&_a]:underline">
            <MDXContent code={event.body} />
          </div>
        </section>
        {event.rsvpUrl || resources.length ? (
          <section className="grid justify-items-start gap-3">
            <h2 className="text-2xl font-semibold">Event links</h2>
            {event.rsvpUrl ? (
              <PillLink href={event.rsvpUrl}>Original event listing</PillLink>
            ) : null}
            {resources.length ? (
              <ul className="grid gap-2">
                {resources.map((key) => (
                  <li key={key}>
                    <a href={event.resources[key]} className="text-link underline">
                      {resourceLabels[key]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
        {event.title.includes("Flutter") ? (
          <p className="text-sm text-muted">{site.eventDisclaimer}</p>
        ) : null}
      </article>
    </main>
  );
}
