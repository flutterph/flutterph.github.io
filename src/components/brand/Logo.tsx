import { LOGO_VIEWBOX, logoPieces } from "./logo-paths";

type Props = { className?: string; title?: string };

/** Static mark. Pass a title when the logo is the only label for a link. */
export function Logo({ className = "h-7 w-auto", title }: Props) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {logoPieces.map((p) => (
        <path key={p.id} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
