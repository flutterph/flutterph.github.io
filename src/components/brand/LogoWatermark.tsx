import { LOGO_VIEWBOX, logoPieces } from "./logo-paths";

type Corner = "top-right" | "bottom-right" | "bottom-left";

const corners: Record<Corner, string> = {
  "top-right": "-top-[18%] -right-[8%]",
  "bottom-right": "-right-[6%] -bottom-[28%]",
  "bottom-left": "-bottom-[30%] -left-[6%]",
};

/**
 * Theme motif: the full mark, large and faint, cropped off a corner of a
 * tinted surface. Decorative only. The parent needs `relative overflow-hidden`
 * and its content `relative z-10`.
 */
export function LogoWatermark({
  corner = "top-right",
  className = "h-[22rem] sm:h-[30rem]",
  opacity = 0.16,
}: {
  corner?: Corner;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={`pointer-events-none absolute w-auto ${corners[corner]} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      {logoPieces.map((p) => (
        <path key={p.id} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
