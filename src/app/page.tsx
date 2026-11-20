import { Hero } from "@/components/home/Hero";
import { JoinPanel } from "@/components/home/JoinPanel";
import { Manifesto } from "@/components/home/Manifesto";
import { PastEvents } from "@/components/home/PastEvents";
import { Steps } from "@/components/home/Steps";
import { SupportedBy } from "@/components/home/SupportedBy";
import {
  getArchiveEvents,
  getHighlightEvent,
  getPastEvents,
  getUpcomingEvents,
} from "@/lib/content";

export default function HomePage() {
  const now = new Date();
  const highlight = getHighlightEvent(now);
  const past = getPastEvents(now).filter((e) => e.slug !== highlight?.slug);

  return (
    <main id="main" className="grid gap-3 px-[max(12px,env(safe-area-inset-left))] pb-3">
      <Hero />
      <SupportedBy />
      <Manifesto />
      <Steps nextEvent={getUpcomingEvents(now)[0]} />
      <PastEvents events={past} highlight={highlight} archive={getArchiveEvents()} />
      <JoinPanel />
    </main>
  );
}
