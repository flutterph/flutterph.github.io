import type { CSSProperties } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { PhMap } from "./PhMap";
import s from "./manifesto.module.css";

/** Self-description as published on the Flutter Philippines Luma calendar and event pages. */
const text =
  "Flutter Philippines is a community of designers, developers, and product builders who create experiences for any screen. We are a non-profit community, led by community leaders, technical experts, and volunteers.";

/** Map pin, drawn on a 24x24 grid in the shape of a Google Maps marker. */
function Pin() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${s.pin} size-7 shrink-0 sm:size-8`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 4.9 5.6 11.3 6.3 12.1a.9.9 0 0 0 1.4 0C13.4 20.3 19 13.9 19 9a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}

export function Manifesto() {
  const words = text.split(" ");
  return (
    <Sheet
      aria-labelledby="about-title"
      className={`${s.typer} reveal-sheet px-6 py-14 sm:px-12 sm:py-20`}
      style={{ "--step": `${42 / words.length}%` } as CSSProperties}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <PhMap />
        <div className="grid justify-items-center gap-5 text-center lg:justify-items-start lg:text-left">
          <h2
            id="about-title"
            className="flex items-center gap-2 text-lg font-medium tracking-[var(--tracking-heading)] text-muted"
          >
            <Pin />
            <span>
              Founded in the heart of <span className={s.place}>Manila</span> in 2019
            </span>
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed font-medium tracking-[var(--tracking-heading)]">
            {words.map((w, i) => (
              <span
                key={i}
                className={`${s.word} ${i === words.length - 1 ? s.last : ""}`}
                style={{ "--i": i } as CSSProperties}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </Sheet>
  );
}
