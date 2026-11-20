import { Logo } from "@/components/brand/Logo";
import { PillLink } from "@/components/ui/PillLink";
import { site } from "@/lib/site";
import s from "./hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={`${s.hero} mx-auto w-full max-w-page`}>
      <div className="mx-auto grid max-w-4xl content-center justify-items-center gap-5 px-3 text-center lg:mx-0 lg:max-w-none lg:justify-items-start lg:pl-8 lg:text-left xl:pl-12">
        <h1
          id="hero-title"
          className="text-5xl font-semibold tracking-[var(--tracking-display)] lg:text-[clamp(3.75rem,1rem+5vw,6rem)]"
        >
          <span className="block">Flutter Philippines</span>
          <span className="mt-2 block text-[0.6em] leading-[1.08] text-subtle">
            Designers, builders and founders crafting every pixel.
          </span>
        </h1>
        <p className="max-w-xl text-lg text-muted">
          A community of Filipino designers, developers and founders building for every screen with
          Flutter and Dart.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
          <PillLink href={site.joinUrl} size="lg">
            Join the community
          </PillLink>
          <PillLink href="#events" variant="outline" size="lg">
            See what we&apos;ve done
          </PillLink>
        </div>
      </div>
      <div className="grid place-items-center">
        <Logo className={s.logo} />
      </div>
    </section>
  );
}
