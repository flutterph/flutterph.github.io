import { Sheet } from "@/components/ui/Sheet";
import s from "./manifesto.module.css";

/** Self-description as published on the Flutter Philippines Luma calendar and event pages. */
const text =
  "Flutter Philippines is a community of designers, developers, and product builders who create experiences for any screen. We are a non-profit community, led by community leaders, technical experts, and volunteers.";

export function Manifesto() {
  const words = text.split(" ");
  return (
    <Sheet aria-labelledby="about-title" className="px-6 py-20 sm:px-12 sm:py-28">
      <h2 id="about-title" className="sr-only">
        About Flutter Philippines
      </h2>
      <p className="mx-auto max-w-4xl text-center text-3xl font-medium tracking-[var(--tracking-heading)]">
        {words.map((w, i) => (
          <span key={i} className={s.word}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </Sheet>
  );
}
