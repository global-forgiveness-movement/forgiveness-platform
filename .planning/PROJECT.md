# Global Forgiveness Movement — Platform

## What This Is

The web platform for the Global Forgiveness Movement (Human Flourishing Program, Harvard
University), built by Wyatt Roy for clients Richard Cowden and Kate Jackson-Meyer. It gives the
evidence-based REACH Forgiveness workbook a home of its own: five public pages, open workbook
downloads, a groups pathway, a free-account member area holding two video series, and Wyatt's
already-built interactive workbook folded in at `/workbook/`.

Until launch (target 6 Nov 2026) the whole site sits behind a simple password gate — password
`reach` — on this public repo, served by GitHub Pages. Kate reviews it there.

**The full scope, wireframes, timeline, and budget live in `/plan/index.html`** (the client-facing
Scope & Process Plan, AES-encrypted behind the same password). That document plus the client
feedback record (below) are the requirements source of truth.

## Core Value

**Help more people finish the REACH workbook, with video helping them do it.** Every feature is
tested against that sentence. (Wyatt's scope plan, §1; confirmed by the clients.)

The main measure is workbook completions — including people in Forgiveness Groups, which is why
group registration captures group size and which workbook version they use.

## The Client Feedback Record

Requirements changed after the scope plan's Draft 3. Three sources, in order of arrival — later
corrects earlier:

1. **Scope & Process Plan Draft 3** (1 Aug 2026) — `/plan/index.html`, password `reach`
2. **Kate's CSV** ("Answers for Wyatt 8/17/26") — row-by-row wireframe feedback
3. **Kate's email** (Aug 2026) — the big correction, below

**The big correction (Kate's email):** the videos are NOT for individuals working through the
workbook. They exist so people can facilitate groups. The homepage offers exactly **two doors:
"Do it solo" (→ workbook) and "Start a group" (→ how-to-run-a-group → the video series)**. In the
Forgiveness Group model (the clients' own design, not Worthington's group protocols), participants
do the workbook on their own and meet periodically to discuss the experience. A leader plays an
8–15 minute video for the room: intro, education, guided exercise, discussion questions.
Participants do lessons *before* each meeting; the videos prompt no extra exercises and no video
progress needs saving.

Key CSV rulings: say "over 4,500 participants" (matches their research video); "5 relatively
high-conflict countries"; header reads "Global Forgiveness Movement" over "Human Flourishing
Program at Harvard"; never use "start the series" as a call to action — it's always about starting
a group; REACH's A = "Altruistic gift of forgiveness offered freely"; group stats: 6–12 people,
3- or 6-session options, 1–1.5 hour meetings guided by ~10 min of video; testimonial names need
permission before launch; Kate owns the site after launch; GFM brand colors match the workbook
design; Vimeo to be set up by Wyatt, clients pay directly.

## Requirements

### Validated

(None yet — ship to validate.)

### Active

- [ ] Password gate ("reach") on every page until launch; simple client-side gate, repo readable
- [ ] Five public pages — Home, Workbooks, Research, Groups, About — plus Contact, in the
      workbook's visual identity, with all CSV/email feedback applied
- [ ] Two-door homepage: "Do it solo" / "Start a group"
- [ ] Open workbook downloads, every edition and language, no account, download clicks countable
- [ ] Groups pathway: what a group is, how to run one, both series described, leader kit stub,
      group registration form capturing what Kate wants to count
- [ ] Free accounts (Firebase: email/password + Google), one account type
- [ ] Member area: series shells for the 3-session and 6-session series (video lands Sept–Oct),
      workbook progress card
- [ ] Interactive workbook at `/workbook/` (copied from the `forgiveness` repo; canonical here)
- [ ] Progress-only sync for signed-in users — position and completion, never what anyone writes
- [ ] Kate's existing YouTube films embedded wherever the wireframes show video

### Out of Scope

- Everything in the scope plan's "Not yet" table (payments, dashboards, maps, credentials,
  surveys, events system, forum, apps) — V2+, reasons documented in the plan §4
- Syncing workbook *answers* — the privacy promise "your writing never leaves this device" stays
  literally true; only position/completion syncs
- Vimeo integration — files arrive Sept–Oct; YouTube embeds are placeholders with a one-line swap
- Interface translation — English at launch, structure ready for languages later
- Custom domain — GitHub Pages URL until the domain question (plan §12 Q1) resolves

## Context

- **Serving**: GitHub Pages from this repo's root, `main` branch, no build step. What's on `main`
  is what Kate sees.
- **The scope doc previously WAS the repo root.** It moved to `/plan/` — same content, same
  password. Wyatt sends Kate the new link.
- **The `forgiveness` repo** (separate) holds the original interactive workbook. This repo's
  `/workbook/` copy is canonical from now on; the standalone stays as-is.
- **Videos**: 13 pieces arrive from the client Sept–Oct (rough cut ~11 Sept, final 9 Oct). Their
  finished films (trailers, 6-min group film, research video) are on YouTube:
  https://www.youtube.com/playlist?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE
- **Harvard constraints**: WCAG 2.1 AA target; brand/IT/privacy reviews are on the client side.

## Constraints

- **No build step** — vanilla HTML/CSS/JS ES modules, served directly. Matches Wyatt's other
  projects; keeps every session and every diff inspectable.
- **Free tier only** — Firebase Spark, GitHub Pages. No paid infrastructure before launch.
- **Every research claim traceable** — figures come from Ho et al. 2024 / the client's own pages,
  phrased the way the clients phrase them ("over 4,500"). Nothing may claim beyond the evidence.
- **Client-facing copy is the clients'** — apply their wording rulings verbatim; new copy is
  flagged for their approval, never silently shipped.
- **Privacy is a feature**: workbook writing never leaves the device; accounts collect the
  minimum; no third-party analytics in V1.0 beyond anonymous download counting.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| V1.0 = full public site + working accounts | Wyatt's pick over static-only; Kate clicks a real thing | — Pending |
| Platform at repo root, scope doc → `/plan/` | Clean URLs now and at launch | — Pending |
| Simple password gate, repo readable | Content isn't sensitive; zero edit friction | — Pending |
| No-build vanilla stack | Matches forgiveness + pastrypirates; Pages serves repo directly | — Pending |
| Firebase (Auth + Firestore) | Wyatt already runs Firebase; free tier; static-site friendly | — Pending |
| One account type | Leader data captured by the group form, not account type; matches Kate's email | — Pending |
| Progress-only workbook sync | Keeps "writing never leaves this device" literally true; it's the data Kate wants | — Pending |
| Workbook palette + fonts as brand | Kate: GFM colors match the workbook design; cheat sheet trues up later | — Pending |
| YouTube embeds now, Vimeo later | Real video in Kate's preview; one-line swap per embed | — Pending |
| Two-door homepage | Kate's email correction — videos serve groups, not solo users | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-21 after initialization*
