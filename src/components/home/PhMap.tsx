import type { CSSProperties } from "react";
import { MANILA, PH_VIEWBOX, phIslands } from "./ph-map";
import s from "./ph-map.module.css";

const [, , vbW, vbH] = PH_VIEWBOX.split(" ").map(Number) as [number, number, number, number];

/** Decorative map of the Philippines with a pin on Manila. The text beside it carries the meaning. */
export function PhMap() {
  const pos = {
    "--x": `${(MANILA.x / vbW) * 100}%`,
    "--y": `${(MANILA.y / vbH) * 100}%`,
  } as CSSProperties;
  return (
    <div className={s.scene} aria-hidden="true">
      <div className={s.shadow} />
      <div className={s.plane} style={pos}>
        <svg viewBox={PH_VIEWBOX} className={s.map} focusable="false">
          <path d={phIslands.mindanao} className={`${s.island} ${s.mindanao}`} />
          <path d={phIslands.visayas} className={`${s.island} ${s.visayas}`} />
          <path d={phIslands.luzon} className={`${s.island} ${s.luzon}`} />
        </svg>
        <span className={s.ring} />
        <svg viewBox="0 0 24 24" className={s.pin} fill="currentColor" focusable="false">
          <path d="M12 2a7 7 0 0 0-7 7c0 4.9 5.6 11.3 6.3 12.1a.9.9 0 0 0 1.4 0C13.4 20.3 19 13.9 19 9a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z" />
        </svg>
        <span className={s.label}>Manila</span>
      </div>
    </div>
  );
}
