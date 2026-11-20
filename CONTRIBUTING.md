# Contributing to flutter.ph

Thanks for helping. Most changes are content: an event, a talk, a fix to some text. You can do those in your browser without installing anything.

## The 5-minute way (no coding needed)

1. Open the file you want to change on GitHub, or the folder you want to add to (see the table below).
2. Click the pencil icon to edit, or **Add file > Create new file** to add one. Copying an existing file is the easiest start.
3. Write a short description at the bottom and choose **Create a new branch and start a pull request**.
4. An organizer reviews it. Checks run automatically, and if a field is wrong they tell you which one.

Not sure where something goes? Open an issue instead and pick a template: **Add an event**, **Add a talk by the team**, **Propose a talk** or **Report a bug**.

## Where things live

| You want to add                       | Put it in                                                               | Example                                        |
| ------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| A Flutter PH event                    | `content/events/<short-name>.mdx`                                       | `content/events/shipaton-manila-2026.mdx`      |
| A talk, workshop or booth by the team | `content/talks/<year>.yaml` (add to `talks:`)                           | `content/talks/2026.yaml`                      |
| A demo or workshop repo               | `content/talks/<year>.yaml` (add to `openSource:`)                      | same file                                      |
| A person (speaker, organizer)         | `content/people/<name>.mdx`                                             | `content/people/joshua-de-guzman.mdx`          |
| A supporter or partner logo           | `content/partners/<name>.mdx` and the logo in `public/images/partners/` | `content/partners/google-developer-groups.mdx` |
| An older Meetup event                 | `content/archive/meetup.yaml`                                           |                                                |

Every field is described in [docs/content-guide.md](docs/content-guide.md).

## Content rules

- **Only real facts.** Dates, names, numbers and links must be checked. If you are unsure, leave the field out. Never guess a URL.
- **Times are in Manila time** with the offset, for example `2027-01-23T14:00:00+08:00`.
- **Every image needs alt text** that says what it shows.
- **Plain, short copy.** No em dashes. Write like you would talk to a friend at a meetup.
- **Logos** must be the official files from the owner, used with permission.
- **Sample content** (`sample: true`) is for previews only and never appears on the live site.

## Working on the code

```bash
nvm use && corepack enable
pnpm install
pnpm dev
```

Before you open a pull request:

```bash
pnpm check
```

That runs type checks, lint, formatting, unit tests, a production build, accessibility and end-to-end tests in Chromium and WebKit, and the scroll performance test. CI runs the same thing.

Guidelines:

- Server Components by default. Add `"use client"` only for real interactivity, and keep it small.
- Use the tokens in `src/app/globals.css` (`bg-surface`, `text-muted`, ...). Do not hard-code colors.
- Motion should be CSS, transform-based, and must respect `prefers-reduced-motion`.
- Every text color must pass WCAG 2.2 AA. The axe tests will tell you if it does not.
- Keep pages static. There is no server on GitHub Pages.

## Commits and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `content:`, `docs:`, `chore:`.
- Pull request titles follow `[type] Short description`, for example `[content] Add DevFest Cebu 2027`.
- Fill in the pull request template: what changed, how you tested it, and screenshots for anything visible.
- `main` is the live site. Changes land through reviewed pull requests and are squash-merged.

## Code of conduct

Be kind, be patient, and assume good intent. Harassment of any kind is not welcome at our events or in our channels. Report problems to the organizers through the Facebook group or at team@flutter.ph.
