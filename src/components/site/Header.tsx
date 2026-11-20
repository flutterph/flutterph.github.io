import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { PillLink } from "@/components/ui/PillLink";
import { site } from "@/lib/site";
import { primaryNav } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

/** Floating pill header. The mobile menu is a native <details>, so it needs no JavaScript. */
export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-[max(12px,env(safe-area-inset-left))] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-5xl items-center gap-2 rounded-pill bg-bg/95 pr-2 pl-4 shadow-pill ring-1 ring-border backdrop-blur-md">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-pill pr-2 font-semibold tracking-tight"
        >
          <Logo className="h-7 w-auto" />
          <span>
            Flutter <span className="text-muted">PH</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-pill px-3.5 py-2 text-[15px] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <span className="hidden sm:block">
            <PillLink href={site.joinUrl}>Join the community</PillLink>
          </span>
          <details className="group relative md:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-pill text-fg hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg
                viewBox="0 0 20 20"
                className="size-5 group-open:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 7h14M3 13h14" />
              </svg>
              <svg
                viewBox="0 0 20 20"
                className="hidden size-5 group-open:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute top-[calc(100%+12px)] right-0 w-[min(80vw,18rem)] rounded-[1.5rem] bg-bg p-2 shadow-lift ring-1 ring-border"
            >
              <ul className="grid">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-lg hover:bg-surface-2"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="p-2 pt-3">
                  <PillLink href={site.joinUrl} className="w-full">
                    Join the community
                  </PillLink>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
