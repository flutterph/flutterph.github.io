import { site } from "@/lib/site";

// Phase 1 placeholder. The real home page is built in Phase 2 after design approval.
export default function HomePage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-prose flex-col justify-center gap-6 px-4 py-16"
    >
      <h1 className="text-4xl font-bold">{site.name}</h1>
      <p className="text-lg text-muted">{site.tagline}</p>
      <p className="text-sm text-subtle">New site in progress. Phase 1 scaffold.</p>
    </main>
  );
}
