import type { ComponentProps, ReactNode } from "react";

type Variant = "ink" | "outline" | "on-dark" | "on-dark-outline";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-on-ink hover:bg-ink/85",
  outline: "bg-bg text-fg ring-1 ring-border-strong ring-inset hover:bg-surface",
  "on-dark": "bg-white text-[#0b0d12] hover:bg-white/85",
  "on-dark-outline": "text-white ring-1 ring-white/40 ring-inset hover:bg-white/10",
};

type Props = Omit<ComponentProps<"a">, "className"> & {
  variant?: Variant;
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
};

/** Pill-shaped link, the site's only button shape. External hrefs get safe rel attributes. */
export function PillLink({
  variant = "ink",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: Props) {
  const external = typeof href === "string" && /^https?:\/\//.test(href);
  const sizing = size === "lg" ? "h-14 px-7 text-lg" : "h-11 px-5 text-base";
  return (
    <a
      href={href}
      {...(external ? { rel: "noopener noreferrer" } : {})}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap transition-colors duration-150 ${sizing} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
