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
      className="mx-auto grid w-full max-w-page justify-items-center gap-5 px-4 py-10 sm:py-12"
    >
      <h2 id="supported-title" className="text-sm font-medium text-muted">
        Supported by
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {supporters.map((s) => (
          <li key={s.slug}>
            <a
              href={s.url}
              rel="noopener noreferrer"
              className="block text-muted grayscale transition duration-200 hover:text-fg hover:grayscale-0"
            >
              {s.logo ? (
                // SVG logos need no optimization; next/image would add ~6 KB of client JS here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logo}
                  alt={s.logoAlt ?? s.name}
                  width={160}
                  height={40}
                  className="h-8 w-auto opacity-70 hover:opacity-100"
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
