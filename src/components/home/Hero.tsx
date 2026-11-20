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
          Flutter Philippines
        </h1>
        <p className="max-w-2xl text-2xl font-medium tracking-[var(--tracking-heading)] text-muted lg:text-3xl">
          A community for designers, builders and founders crafting every pixel.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
          <PillLink href={site.joinUrl} size="lg">
            Join the community
          </PillLink>
          <PillLink href="#events" variant="light" size="lg">
            See what we&apos;ve done
          </PillLink>
        </div>
      </div>
      <div className="grid place-items-center">
        <Logo className={`${s.logo} ${s.drift}`} />
      </div>
    </section>
  );
}
