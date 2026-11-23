# Content guide

All content lives in `content/`. The build checks every file against the schemas in `content-collections.ts`. If something is wrong, `pnpm dev` and the pull request check print the file and the field to fix.

## Events (`content/events/*.mdx`)

Flutter PH's own events. The file name becomes a public URL: `content/events/shipaton-manila-2026.mdx` is served at `/events/shipaton-manila-2026`. Keep that name stable when updating an event.

```mdx
---
title: Flutter PH Meetup, January 2027
summary: One or two sentences about the event (10 to 200 characters).
type: meetup # meetup, watch-party, social, study-jam, workshop, io-extended, hackathon, talk, other
format: in-person # in-person, online, hybrid
startsAt: 2027-01-23T14:00:00+08:00
endsAt: 2027-01-23T18:00:00+08:00
city: Pasig
venue: # required for in-person and hybrid
  name: White Cloak Technologies, Inc.
  address: 20th Floor, Strata 2000, F. Ortigas Jr. Road, Ortigas Center, Pasig City
rsvpUrl: https://luma.com/your-event
registered: 88 # optional, only a real number from the RSVP page
sponsors: # optional, official logos in public/images/sponsors/
  - { name: RevenueCat, logo: /images/sponsors/revenuecat.svg, url: "https://www.revenuecat.com" }
---

A longer description in Markdown.
```

After an event, update the Markdown body with a short recap: who spoke, what they demonstrated, and where to find the materials. Link the speaker’s original demo repository or slides when available. Use the optional `resources.slides`, `resources.recording` and `resources.photos` fields for event materials. If a watch party has only the conference broadcast, label it as such in the body rather than calling it a local recording. Distinguish the published program from what an organizer can confirm actually happened.

Upcoming or past is worked out from `endsAt` in Manila time. The event with the most registrations is shown as the featured event.

## Talks by the team (`content/talks/<year>.yaml`)

Talks, workshops and booths that organizers gave at other communities' events.

```yaml
talks:
  - date: 2027-03-14
    event: Exact Event Name as the Host Wrote It
    host: GDG Example # optional
    location: Cebu City # optional
    country: ID # only outside the Philippines, two letters; shows a flag
    format: in-person # in-person, online, hybrid
    kind: talk # talk, workshop, talk-and-workshop, booth, masterclass, panel
    title: "Session Title" # leave out if unknown; shows "Session title to be announced"
    officialTitle: "..." # only when `title` is a varied display title for a repeated talk
    audience: 120 # optional, only a reported number
    url: https://... # leave out if there is no public page
    speakers: [joshua-de-guzman]
openSource:
  - date: 2027-03-14
    repo: repo-name
    for: What it was for
    url: https://github.com/...
```

## People (`content/people/*.mdx`)

```mdx
---
name: Full Name
role: Community Lead & Google Developer Expert
links:
  x: https://x.com/handle
  github: https://github.com/handle
---
```

A photo at `public/images/people/<file-name>.jpg` (square, at least 256 px) is picked up automatically.

## Partners and supporters (`content/partners/*.mdx`)

```mdx
---
name: Google Developer Groups
logo: /images/partners/gdg.png
url: https://gdg.community.dev
tier: supporter # supporter, sponsor, venue, community
order: 2
---
```

Supporters appear in greyscale under the hero. Use only official logo files, with the owner's permission.

## Meetup archive (`content/archive/meetup.yaml`)

Older events from the closed Meetup group: `title`, `date`, `place`, `url`.

## Sample content

Entries with `sample: true` show only in `pnpm dev` and `pnpm build:preview`. Remove them all with `pnpm content:clear-samples`.
