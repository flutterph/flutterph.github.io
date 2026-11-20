import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { site, social, type SocialKey } from "@/lib/site";
import { primaryNav } from "./nav";

const footerSocials: SocialKey[] = [
  "facebookGroup",
  "facebook",
  "luma",
  "instagram",
  "x",
  "linkedin",
  "github",
];

export function Footer() {
  return (
    <footer className="px-[max(16px,env(safe-area-inset-left))] pt-16 pb-[calc(env(safe-area-inset-bottom)+40px)]">
      <div className="mx-auto grid max-w-page gap-10 text-muted md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <Link href="/" className="flex w-fit items-center gap-2.5 font-semibold text-fg">
            <Logo className="h-8 w-auto" />
            Flutter Philippines
          </Link>
          <p className="max-w-sm text-sm">{site.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-medium text-fg">Explore</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-fg hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.repo}
                rel="noopener noreferrer"
                className="hover:text-fg hover:underline"
              >
                Contribute on GitHub
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-medium text-fg">Follow along</h2>
          <ul className="mt-3 flex flex-wrap gap-1">
            {footerSocials.map((key) => (
              <li key={key}>
                <a
                  href={social[key].href}
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-pill transition-colors hover:bg-bg hover:text-fg"
                >
                  <SocialIcon name={key} />
                  <span className="sr-only">{social[key].label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-page flex-col gap-2 border-t border-border-strong/30 pt-6 text-xs text-muted lg:flex-row lg:justify-between lg:gap-8">
        <p>© {new Date().getFullYear()} Flutter Philippines. Community-run.</p>
        <p className="lg:text-right">{site.affiliation}</p>
      </div>
    </footer>
  );
}
