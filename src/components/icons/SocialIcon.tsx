import type { SocialKey } from "@/lib/site";
import { socialIconPaths } from "./social-paths";

export function SocialIcon({
  name,
  className = "size-5",
}: {
  name: SocialKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={socialIconPaths[name]} />
    </svg>
  );
}
