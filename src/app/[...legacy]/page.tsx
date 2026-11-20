import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legacyRedirects } from "@/lib/site";

/**
 * Old flutter.ph redirect pages (join.html, ask.html, meetups/3.html, ...).
 * GitHub Pages cannot send HTTP redirects, so each one is a tiny static page
 * with an instant meta refresh and a visible link as a fallback.
 */
type Key = keyof typeof legacyRedirects;
type Props = { params: Promise<{ legacy: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legacyRedirects).map((key) => ({ legacy: key.split("/") }));
}

const lookup = (segments: string[]) =>
  legacyRedirects[segments.join("/") as Key] as (typeof legacyRedirects)[Key] | undefined;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const target = lookup((await params).legacy);
  return {
    title: target ? `Redirecting to ${target.label}` : "Not found",
    robots: { index: false, follow: true },
  };
}

export default async function LegacyRedirect({ params }: Props) {
  const target = lookup((await params).legacy);
  if (!target) notFound();
  return (
    <main id="main" className="mx-auto max-w-prose px-4 py-16">
      <meta httpEquiv="refresh" content={`0; url=${target.to}`} />
      <h1 className="text-2xl font-bold">Redirecting you to {target.label}</h1>
      <p className="mt-4">
        If nothing happens,{" "}
        <a className="text-link underline" href={target.to}>
          continue to {target.label}
        </a>
        .
      </p>
    </main>
  );
}
