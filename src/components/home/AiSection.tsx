import { ArrowUpRight } from "@/components/icons/Arrow";
import { PillLink } from "@/components/ui/PillLink";
import { social } from "@/lib/site";
import { aiTools } from "@/lib/ai";
import s from "./ai.module.css";

type Tool = { title: string; detail: string; href: string };

function ToolList({ title, tools }: { title: string; tools: readonly Tool[] }) {
  return (
    <div className="grid content-start gap-3">
      <h3 className="px-1 text-lg font-medium text-white">{title}</h3>
      <ul className={`${s.panel} divide-y divide-white/10 overflow-hidden rounded-[1.75rem]`}>
        {tools.map((t) => (
          <li key={t.href}>
            <a
              href={t.href}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.05] sm:px-6"
            >
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="font-medium text-white">{t.title}</span>
                <span className="text-sm text-on-ink-muted">{t.detail}</span>
              </span>
              <ArrowUpRight className="size-5 shrink-0 text-on-ink-muted transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AiSection() {
  return (
    <section
      id="ai"
      aria-labelledby="ai-title"
      className={`${s.sheet} reveal-sheet mx-auto w-full max-w-page scroll-mt-24 rounded-sheet px-5 py-16 sm:px-10 sm:py-24`}
    >
      <div className="mx-auto grid max-w-5xl gap-12">
        <div className="reveal grid justify-items-center gap-5 text-center">
          <h2
            id="ai-title"
            className="max-w-3xl text-4xl font-semibold tracking-[var(--tracking-display)] text-white"
          >
            <span className={s.gradientText}>AI</span> is part of how we build
          </h2>
          <p className="max-w-2xl text-lg text-on-ink-muted">
            We ship Flutter apps with Gemini inside them and build them with AI agents beside us.
            These are the tools we use and teach. All of them are official, and all of them are free
            to start.
          </p>
        </div>

        <div className="reveal grid gap-8 lg:grid-cols-2">
          <ToolList title="Put AI in your app" tools={aiTools.inYourApp} />
          <ToolList title="Build faster with AI" tools={aiTools.whileYouBuild} />
        </div>
        <div className="reveal grid gap-4">
          <div className="grid justify-items-center gap-3 pt-4 text-center">
            <p className="text-on-ink-muted">
              We run AI talks at our meetups. Follow us on Luma to catch the next one.
            </p>
            <PillLink href={social.luma.href} variant="on-dark" size="lg">
              Follow us on Luma
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
