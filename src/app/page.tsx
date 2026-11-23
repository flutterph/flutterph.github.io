import type { Metadata } from "next";
import { ScrollSpy } from "@/components/site/ScrollSpy";
import { AiSection } from "@/components/home/AiSection";
import { Hero } from "@/components/home/Hero";
import { JoinPanel } from "@/components/home/JoinPanel";
import { Manifesto } from "@/components/home/Manifesto";
import { PastEvents } from "@/components/home/PastEvents";
import { Steps } from "@/components/home/Steps";
import { SupportedBy } from "@/components/home/SupportedBy";
import {
  getArchiveEvents,
  getEventItems,
  getHighlightEvent,
  getUpcomingEvents,
} from "@/lib/content";
import { site, social } from "@/lib/site";

const title = `${site.name} | Flutter and Dart Meetups`;
const description =
  "Find Flutter and Dart meetups in Metro Manila and online, explore beginner resources, and join the Flutter Philippines community on Facebook.";
const homeUrl = new URL("/", site.url).href;
const organizationId = new URL("#organization", homeUrl).href;
const image = {
  url: "/og.jpg",
  alt: "Flutter Philippines: join thousands of developers, designers and founders building apps with Flutter, Dart and AI.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: homeUrl },
  openGraph: {
    type: "website",
    title,
    description,
    url: homeUrl,
    siteName: site.name,
    locale: site.locale,
    images: [{ ...image, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@flutter_ph",
    title,
    description,
    images: [image],
  },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      alternateName: site.shortName,
      description: site.tagline,
      url: homeUrl,
      logo: new URL("/flutter-ph-logo.svg", homeUrl).href,
      sameAs: [
        social.facebook.href,
        social.luma.href,
        social.instagram.href,
        social.x.href,
        social.linkedin.href,
        social.github.href,
      ],
    },
    {
      "@type": "WebSite",
      "@id": new URL("#website", homeUrl).href,
      url: homeUrl,
      name: site.name,
      alternateName: site.shortName,
      inLanguage: "en-PH",
      publisher: { "@id": organizationId },
    },
  ],
};

export default function HomePage() {
  const now = new Date();
  const highlight = getHighlightEvent(now);
  const items = getEventItems(now);

  return (
    <main
      id="main"
      className="grid gap-[var(--sheet-gap)] px-[max(12px,env(safe-area-inset-left))] pb-[var(--sheet-gap)]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <SupportedBy />
      <Manifesto />
      <AiSection />
      <Steps
        nextEvent={getUpcomingEvents(now)[0]}
        nextTalk={items.upcoming.find((i) => i.kind === "team")}
      />
      <PastEvents
        upcoming={items.upcoming}
        past={items.past}
        highlight={highlight}
        archive={getArchiveEvents()}
      />
      <JoinPanel />
      <ScrollSpy />
    </main>
  );
}
