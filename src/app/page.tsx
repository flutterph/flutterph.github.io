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

export default function HomePage() {
  const now = new Date();
  const highlight = getHighlightEvent(now);
  const items = getEventItems(now);
  const past = items.past.filter((i) => i.key !== `e-${highlight?.slug}`);

  return (
    <main
      id="main"
      className="grid gap-[var(--sheet-gap)] px-[max(12px,env(safe-area-inset-left))] pb-[var(--sheet-gap)]"
    >
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
        past={past}
        highlight={highlight}
        archive={getArchiveEvents()}
      />
      <JoinPanel />
    </main>
  );
}
