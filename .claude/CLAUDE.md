# GFM Platform — the standing rules

**This file loads into every session. Each rule was earned — most on Pastry Pirates, some on day
one here.** It stays short so it survives being read.

> # THE POINT
>
> This is a client project. Kate Jackson-Meyer and Richard Cowden (Harvard Human Flourishing
> Program) are trusting Wyatt with the front door to an evidence-based intervention that people
> in real pain will use. **The check at the start and end of any task: is the site more useful to
> a person trying to forgive, and more trustworthy to the clients, than it was this morning?**
> A perfectly closed ticket that moves neither has failed.
>
> And the fastest way to find what needs fixing is to **OPEN IT IN A BROWSER AND LOOK** — a
> session that reads code all day will miss what one screenshot shows in seconds.

## THE RULES, IN ONE SCREEN

| | Rule |
|---|---|
| 1 | **Ask 2–5 clarifying questions before building anything non-trivial — with the question UI, never as prose.** Arrive with the homework done; ask only what is genuinely Wyatt's call, with a marked recommendation |
| 2 | **Restate every mid-flight instruction in your next reply** — acting on it is not the same as showing you heard it |
| 3 | **Plain English AND the size** — what a visitor gets, how much of the problem it covers, what it leaves undone. A plan he can't size is a plan he can't redirect |
| 4 | **Screenshot your own work — desktop AND mobile — before handing it over.** A green check proves nothing about what he will see |
| 5 | **Read every screenshot he sends, pixel by pixel; pairs are for comparing** |
| 6 | **Never report a defect (or a fix) as confirmed before you have looked at it rendered** |
| 7 | **Do not build tooling when the ask is to build the site** — say the one line, park it |
| 8 | **ELEGANCE OVER PATCHING** — architect once, use repeatedly; no drifting forks (§Design) |
| 9 | **ELIMINATE FRICTION** — the visitor thinks about forgiveness, never about the website (§Design) |
| 10 | **The feedback record is the requirement** — Kate's email > her CSV > the scope plan; cite which ruling you used |
| 11 | **Nothing client-facing ships without Wyatt's approval** — new copy is flagged as new, never silently blended in |
| 12 | **Every research claim traceable, phrased the clients' way** ("over 4,500 participants", "5 relatively high-conflict countries") |
| 13 | **Privacy copy is load-bearing** — the code must make the words literally true, or the words change |
| 14 | **`git fetch` before you trust any ref; absolute paths always** |
| 15 | **This repo is public: web config is fine, secrets never** — no service keys, no tokens, nothing you wouldn't print |
| 16 | **Kill every server and headless browser you start, before you reply** |
| 17 | **Work through GSD** — and in a cloud container, install it first (§GSD) |

## Design — Wyatt's two principles (2026-08-21, his words distilled)

**Elegance and simplicity over patching and piecemeal.** Code is architected efficiently, written
once and used repeatedly, so there are no drifting forks that are hard to keep track of. In
practice here: ONE shell component renders every page's header/nav/footer; ONE design-token file;
ONE gate include; content (testimonials, workbooks, sessions, publications) lives as data, not
copies. **The trigger to memorize: "the existing one works, I'll just add a branch/copy for the
new case" — that is the moment a fork is born. Converge instead: make the first case go through
the new path too.** (Pastry Pirates learned this as ONE DISPLAY PATH, at the cost of a
host/guest split that took three phases to see.)

**Eliminate friction for the user.** They should focus on the experience, not the logistics of
the website. Every field is a person we might lose; every step between someone and the workbook
gets challenged. The PDF stays free with no account. Accounts justify themselves in the copy
("so we can save your place"). Nobody is enrolled in anything automatically. If a feature adds a
step, it argues for its life.

**Tone follows the material.** People arrive carrying the worst thing that ever happened to them.
Calm pages, no urgency, no streaks, no gamification, honest warnings ("this may be hard"), and
the way out always visible. "There's no hurry" is design language here.

## Client work — what's different from a solo project

- **Three feedback sources, later corrects earlier:** scope plan Draft 3 (`/plan/`, password
  `reach`) → Kate's CSV (17 Aug) → Kate's email. The email's big correction: **videos exist to
  facilitate groups, not to guide individuals — the homepage has exactly two doors, "Do it solo"
  and "Start a group", and "start the series" is banned copy.**
- **The Forgiveness Group model is the clients' own design** (workbook done solo, group meets to
  discuss). Don't describe it as Worthington's group protocol.
- **Testimonials are permission-gated**: names render only when their `permissionConfirmed` flag
  is true. Kate is collecting permissions.
- **When a client ruling and a design instinct collide, surface it, don't settle it** — that's
  Wyatt's conversation with Kate, carried by him.

## Safety

- The password gate is a curtain, not a lock. Never present it as security, never put anything
  behind it that would matter if read straight from the repo.
- `/plan/` is a client-facing document Kate has the link to. Don't edit or move it casually.
- What's on `main` is what's live (GitHub Pages, no build step). Treat the diff as the thing to
  check, not the push. Bump the build stamp in `js/site.js` on every push so a stale page is
  detectable at a glance — if Wyatt reports an old stamp, it is not on `main`; there is no cache.
- The interactive workbook at `/workbook/` is canonical here; the standalone `forgiveness` repo
  stays untouched. Never let the two drift silently — changes happen here.

## GSD

Start work through GSD so planning artifacts stay true: `/gsd-progress` to orient,
`/gsd-plan-phase N` / `/gsd-execute-phase N` for phase work, `/gsd-quick` for small fixes,
`/gsd-debug` for investigation. Read `.planning/STATE.md` at session start.

**Cloud containers (claude.ai/code) don't have gsd-core preinstalled.** First thing, every cloud
session:

```bash
command -v node >/dev/null && ls ~/.claude/gsd-core/bin/gsd-tools.cjs 2>/dev/null \
  || npx -y @opengsd/gsd-core -g --claude
```

Installed skills register live in the session (verified 2026-08-21). Subagent *types* (e.g.
gsd-roadmapper) do not register mid-session — run those roles inline following the agent
definition in `~/.claude/agents/`, as the GSD workflows' own fallback prescribes.

## Project facts

- **Stack:** vanilla HTML/CSS/JS ES modules, no build, GitHub Pages from `main` root.
- **Gate password:** `reach` (also unlocks `/plan/`).
- **Brand:** the workbook's identity — cream `#F4EFE3`, teal `#1B7F72`, ink navy `#123B53`, plum
  `#7E3A67`, mustard `#E7B54A`, sage `#8FBCAD`; Poppins / Nunito Sans / Sacramento, self-hosted.
  True up against the GFM Brand Cheat Sheet when Wyatt adds it to the repo.
- **Backend:** Firebase (Auth + Firestore) behind `js/firebase-config.js`; with no config
  committed the site runs in a labeled local demo mode. Progress-only workbook sync — **what
  people write never leaves their device.**
- **Video:** YouTube embeds are placeholders (client's playlist); Vimeo files land Sept–Oct and
  swap in per-embed.
