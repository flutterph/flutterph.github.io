import { LogoWatermark } from "@/components/brand/LogoWatermark";
import { LOGO_VIEWBOX, logoPieces } from "@/components/brand/logo-paths";
import { PillLink } from "@/components/ui/PillLink";
import { site, social } from "@/lib/site";

/** Closing call to action. Dark in both themes, so it reads as the end of the page. */
export function JoinPanel() {
  return (
    <section
      aria-labelledby="join-title"
      className="relative mx-auto w-full max-w-page overflow-hidden rounded-sheet bg-ink-soft px-6 py-16 text-white sm:px-12 sm:py-24"
    >
      <LogoWatermark corner="bottom-right" className="h-[24rem] sm:h-[36rem]" opacity={0.12} />
      <div className="relative z-10 mx-auto grid max-w-3xl justify-items-center gap-6 text-center">
        <svg viewBox={LOGO_VIEWBOX} className="h-14 w-auto" aria-hidden="true" focusable="false">
          {logoPieces.map((p) => (
            <path key={p.id} d={p.d} fill={p.fill} />
          ))}
        </svg>
        <h2 id="join-title" className="text-4xl font-semibold tracking-[var(--tracking-display)]">
          Come build with us.
        </h2>
        <p className="max-w-xl text-lg text-on-ink-muted">
          Whether you shipped your tenth app or installed Flutter last night, there&apos;s a seat
          for you. Sama-sama tayo.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PillLink href={site.joinUrl} variant="on-dark" size="lg">
            Join the Facebook group
          </PillLink>
          <PillLink href={social.luma.href} variant="on-dark-outline" size="lg">
            Follow on Luma
          </PillLink>
        </div>
      </div>
    </section>
  );
}
