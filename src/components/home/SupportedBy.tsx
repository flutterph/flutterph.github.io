import { getSupporters } from "@/lib/content";

/**
 * Greyscale "Supported by" strip under the hero. Renders only entries in
 * content/partners with tier: supporter. Logos must be official files added
 * with the owner's permission; entries without a logo show their name.
 * Hidden entirely when there are no supporters.
 */
export function SupportedBy() {
  const supporters = getSupporters();
  if (supporters.length === 0) return null;
  return (
    <section
      aria-labelledby="supported-title"
      className="reveal mx-auto grid w-full max-w-page justify-items-center gap-5 px-4 py-6 sm:py-8"
    >
      <h2 id="supported-title" className="text-base font-medium text-muted">
        Supported by
      </h2>
      <ul className="flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-12">
        {supporters.map((s) => (
          <li key={s.slug}>
            <a
              href={s.url}
              rel="noopener noreferrer"
              className="group block text-muted transition-colors duration-200 hover:text-fg"
            >
              {s.logo ? (
                // SVG logos need no optimization; next/image would add ~6 KB of client JS here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logo}
                  alt={s.logoAlt ?? s.name}
                  width={200}
                  height={32}
                  className="h-6 w-auto opacity-60 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0 sm:h-8 dark:invert"
                />
              ) : (
                <span className="text-lg font-medium tracking-tight">{s.name}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
