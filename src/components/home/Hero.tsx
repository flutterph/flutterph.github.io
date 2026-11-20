import { Logo } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/icons/Arrow";
import { PillLink } from "@/components/ui/PillLink";
import { site } from "@/lib/site";
import s from "./hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={`${s.hero} mx-auto w-full max-w-page`}>
      <div className="mx-auto grid max-w-4xl content-center justify-items-center gap-5 px-3 text-center lg:mx-0 lg:max-w-none lg:justify-items-start lg:pl-8 lg:text-left xl:pl-12">
        <a
          href="#ai"
          className="group inline-flex items-center gap-2 rounded-pill bg-bg py-1.5 pr-3 pl-1.5 text-sm font-medium text-fg shadow-pill transition-colors hover:bg-surface"
        >
          <span className="rounded-pill bg-ink px-2.5 py-0.5 text-xs text-on-ink">New</span>
          AI for the community: Gemini, GenUI and Firebase AI Logic
          <ArrowRight className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
        <h1
          id="hero-title"
          className="text-5xl font-semibold tracking-[var(--tracking-display)] lg:text-[clamp(3.75rem,1rem+5vw,6rem)]"
        >
          Flutter Philippines
        </h1>
        <p className="max-w-xl text-xl font-medium tracking-[var(--tracking-heading)] text-muted lg:text-2xl">
          Join thousands of developers, designers and founders building apps with Flutter, Dart and
          AI.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
          <PillLink href={site.joinUrl} size="lg">
            Join the community
          </PillLink>
          <PillLink href="#events" variant="light" size="lg">
            Recent events
          </PillLink>
        </div>
      </div>
      <div className="grid place-items-center">
        <Logo className={`${s.logo} ${s.drift}`} />
      </div>
    </section>
  );
}
