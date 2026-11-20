import type { CSSProperties, ReactNode } from "react";
import { LogoWatermark } from "@/components/brand/LogoWatermark";
import { ArrowUpRight } from "@/components/icons/Arrow";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { PillLink } from "@/components/ui/PillLink";
import { Sheet } from "@/components/ui/Sheet";
import type { SiteEvent } from "@/lib/content";
import { formatEventRange, manilaDateParts } from "@/lib/dates";
import { learnResources } from "@/lib/learn";
import { site, social, type SocialKey } from "@/lib/site";
import s from "./steps.module.css";

type StepProps = {
  index: number;
  id: string;
  label: string;
  title: string;
  lede: string;
  tint: "blue" | "yellow" | "red";
  items: string[];
  cta: { label: string; href: string };
  aside: ReactNode;
};

function Step({ index, id, label, title, lede, tint, items, cta, aside }: StepProps) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <Sheet
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${s.step} ${s[tint]} ${s[`s${index}` as "s0" | "s1" | "s2"]} scroll-mt-24 px-5 py-12 sm:px-10 sm:py-16`}
      style={{ "--i": index, "--progress": `${((index + 1) / 3) * 100}%` } as CSSProperties}
    >
      <LogoWatermark
        corner={index % 2 === 0 ? "top-right" : "bottom-left"}
        className="h-[20rem] sm:h-[34rem]"
        opacity={0.1}
      />
      <div className={`${s.content} relative z-10 mx-auto grid max-w-5xl gap-10`}>
        <div className="grid justify-items-center gap-5 text-center">
          <div className="grid justify-items-center gap-2">
            <p className="text-[15px] font-medium text-muted">
              <span className="tabular-nums">{number}</span> / {label}
            </p>
            <div className={s.bar} role="img" aria-label={`Step ${index + 1} of 3`}>
              <div className={s.fill} />
            </div>
          </div>
          <h2
            id={`${id}-title`}
            className="max-w-3xl text-4xl font-semibold tracking-[var(--tracking-display)]"
          >
            {title}
          </h2>
          <p className="max-w-2xl text-lg text-muted">{lede}</p>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="grid gap-6 rounded-[2rem] bg-bg p-7 shadow-pill ring-1 ring-border sm:p-9">
            <ol className="grid gap-4 text-xl font-medium">
              {items.map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="text-on-tint-muted tabular-nums">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <PillLink href={cta.href} size="lg" className="w-fit">
              {cta.label}
            </PillLink>
          </div>
          <div className="min-w-0">{aside}</div>
        </div>
      </div>
    </Sheet>
  );
}

function NextEvent({ event }: { event: SiteEvent | undefined }) {
  if (!event) {
    return (
      <div className="grid h-full content-center gap-3 rounded-[2rem] bg-bg p-7 shadow-pill ring-1 ring-border sm:p-9">
        <p className="text-sm font-medium text-muted">Next event</p>
        <p className="text-2xl font-semibold tracking-[var(--tracking-heading)]">
          Nothing on the calendar yet.
        </p>
        <p className="text-muted">
          New meetups appear here and on Luma first. Follow the calendar and you&apos;ll get the
          invite.
        </p>
        <a
          href={social.luma.href}
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1.5 font-medium text-link hover:underline"
        >
          luma.com/flutterph <ArrowUpRight />
        </a>
      </div>
    );
  }
  const date = manilaDateParts(event.startsAt);
  return (
    <article className="grid h-full gap-5 rounded-[2rem] bg-bg p-7 shadow-pill ring-1 ring-border sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted">Next event</p>
        <p className="rounded-pill bg-surface-2 px-3 py-1 text-sm text-muted capitalize">
          {event.format.replace("-", " ")}
        </p>
      </div>
      <div className="flex items-start gap-5">
        <div
          className="grid w-16 shrink-0 justify-items-center rounded-2xl bg-surface-2 py-2.5 text-center"
          aria-hidden="true"
        >
          <span className="text-xs font-medium text-muted uppercase">{date.month}</span>
          <span className="text-2xl font-semibold tabular-nums">{date.day}</span>
        </div>
        <div className="grid gap-1.5">
          <h3 className="text-2xl font-semibold tracking-[var(--tracking-heading)]">
            {event.title}
          </h3>
          <p className="text-muted">{formatEventRange(event.startsAt, event.endsAt)}</p>
          {event.venue ? (
            <p className="text-muted">
              {event.venue.name}
              {event.city ? `, ${event.city}` : ""}
            </p>
          ) : null}
        </div>
      </div>
      {event.rsvpUrl ? (
        <PillLink href={event.rsvpUrl} variant="outline" className="w-fit">
          RSVP <ArrowUpRight />
        </PillLink>
      ) : null}
    </article>
  );
}

function Resources() {
  return (
    <ul className="divide-y divide-border rounded-[2rem] bg-bg shadow-pill ring-1 ring-border">
      {learnResources.map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-6 py-4 transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem] hover:bg-surface sm:px-7"
          >
            <span className="grid min-w-0 flex-1 gap-0.5">
              <span className="font-medium">{r.title}</span>
              <span className="text-sm text-muted">{r.detail}</span>
            </span>
            <span className="text-muted transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg">
              <ArrowUpRight className="size-5" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const channels: SocialKey[] = [
  "facebookGroup",
  "facebook",
  "luma",
  "instagram",
  "x",
  "linkedin",
  "github",
];

function Channels() {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {channels.map((key) => (
        <li key={key}>
          <a
            href={social[key].href}
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl bg-bg px-5 py-4 shadow-pill ring-1 ring-border transition-colors hover:bg-surface"
          >
            <SocialIcon name={key} className="size-5 text-muted group-hover:text-fg" />
            <span className="flex-1 font-medium">{social[key].label}</span>
            <ArrowUpRight className="size-4 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ nextEvent }: { nextEvent: SiteEvent | undefined }) {
  return (
    <div className={s.stack}>
      <Step
        index={0}
        id="get-involved"
        label="Come to an event"
        title="Meet the people building with Flutter"
        lede="Meetups, watch parties and Shipaton nights, mostly in Metro Manila and sometimes online."
        tint="blue"
        items={[
          "Follow Flutter PH on Luma",
          "RSVP to the next meetup",
          "Show up, say hi, bring a friend",
        ]}
        cta={{ label: "Follow on Luma", href: social.luma.href }}
        aside={<NextEvent event={nextEvent} />}
      />
      <Step
        index={1}
        id="learn"
        label="Learn Flutter"
        title="Start building apps this weekend"
        lede="The official docs are the best place to begin. These are the pages we point newcomers to first."
        tint="yellow"
        items={["Install Flutter", "Build the first-app codelab", "Learn Dart as you go"]}
        cta={{ label: "Start with the docs", href: learnResources[0].href }}
        aside={<Resources />}
      />
      <Step
        index={2}
        id="community"
        label="Share what you build"
        title="Show your work, find your people"
        lede="Post your project, ask for feedback, or propose a talk for the next meetup. Everyone started somewhere."
        tint="red"
        items={[
          "Join the Facebook group",
          "Share your project or question",
          "Propose a talk for a meetup",
        ]}
        cta={{ label: "Join the Facebook group", href: site.joinUrl }}
        aside={<Channels />}
      />
    </div>
  );
}
