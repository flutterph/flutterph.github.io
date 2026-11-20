import type { ComponentProps } from "react";

/** The large white rounded surface every section sits on, inset from the canvas. */
export function Sheet({ className = "", children, ...rest }: ComponentProps<"section">) {
  return (
    <section {...rest} className={`mx-auto w-full max-w-page rounded-sheet bg-bg ${className}`}>
      {children}
    </section>
  );
}
