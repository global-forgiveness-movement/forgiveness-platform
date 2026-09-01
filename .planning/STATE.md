---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 5
current_phase_name: all five phases built
status: executing
last_updated: "2026-09-01T21:00:00.000Z"
last_activity: 2026-09-01
last_activity_desc: Client review round opened — Kate and Richard walked through
  the platform and are assembling feedback (due ~15 Sep)
progress:
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-21)

**Core value:** Help more people finish the REACH workbook, with video helping them do it.
**Current focus:** Phase 1 — Foundation

## Current Position

Phase: 5 of 5 (CMS) — all five phases built
Plan: 11 of 11 complete
Status: V1.0 built, Wyatt-reviewed, ten fix batches shipped; Firebase live.
Awaiting Kate and Richard's written feedback (~15 Sep)
Last activity: 2026-08-21 — All phases executed in one session; browser-QA'd with
screenshots (desktop + mobile); pushed to claude/forgiveness-platform-v1-kvyc0t

Progress: [██████████] 100% of V1.0 skeleton

**Verification notes (what was actually checked):**

- Playwright drive of every page, desktop 1280px + mobile 390px, screenshots read
- Gate: wrong password rejected, `reach` unlocks, persists per browser
- Account flow: sign-up → My Path redirect, sign-out, demo-mode labels visible
- Sync invariant: synced progress doc contains position/completed ONLY — a seeded
  answer string was confirmed absent from the synced document

- NOT verified here: YouTube embeds (blocked by container proxy — verify in a real
  browser), real Firebase mode (no config yet), GitHub Pages serving

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. The twelve initialization decisions
(scope, repo layout, gate, stack, Firebase, account model, privacy, brand, workbook location,
video placeholders, first deliverable, working rules) were all made by Wyatt via question rounds
on 2026-08-21.

### Pending Todos

- Send Kate the new /plan link — CLOSED 2026-09-01: Kate and Richard have the site and the
  gate password (`reach1`); /plan/ keeps its own password `reach`
- Firebase go-live — CLOSED 2026-09-01 (quick task #6): real config committed, workbook CSP
  opened to exactly four Google endpoints, live Auth + Firestore rules verified, privacy copy
  re-read and tightened

- Brand true-up — CLOSED 2026-08-27 (quick task #3): official hexes adopted site-wide. Fonts
  settled 1 Sep: the free stand-ins are final, no licensing
- Testimonial names — SUPERSEDED by Kate's 25 Aug ruling: testimonials never show names, only a
  vague descriptor. The permission flags stay false; there is nothing to flip
- Vimeo swap-in when final video files arrive (target 9 Oct) — one line per slot in js/data.js
- Direct download URLs (js/data.js TODO) — CLOSED 2026-09-01 (quick task #7): all nine files
  hosted in-repo (5 translations + 4 English-edition PDFs pulled from the HFP page after its
  move to /post/global-forgiveness-movement broke the fallback links). Note for the record:
  HFP's old URL 404s with NO redirect — if they migrate again, our HFH constant
  (top of js/data.js) is the one place to fix

- Contact inbox — CLOSED 2026-09-01 (quick task #11): the page carries a form, not an
  address. Messages land in Firestore and Kate reads them in /admin → Messages, alongside
  group registrations. **Action outstanding: paste the updated firestore.rules into the
  console** (the `contact` collection is denied by the catch-all until that happens).
  Revisit notification-by-email when the domain lands
- Community of Practice registration link — ruled 1 Sep: the programme-page link is fine for
  now; no change needed (js/data.js TODO stays as a marker only)
- At Firebase go-live, security rules must also cover the CMS: content/* and pages/* world-readable,
  editor-writable via settings/editors allowlist; contentHistory editor-only; seed settings/editors
  with Wyatt's and Kate's emails

- SEO note for launch: editor-created pages are served as 404-status; commit a stub file for any
  Kate page that should be indexed (automatable with an Action later)

### Client review round — opened 2026-09-01

Wyatt walked Kate and Richard through the platform on the 1 Sep call. **They loved it.**
Both have the site and the gate password, and are working through a ten-step review page.
**Their feedback is due about 15 Sep (two weeks)**, then another build round.

**Do not restructure anything before that feedback lands** — it would be rework against
notes nobody has read. Small fixes are fine.

**Decided on the call (these are rulings, not opinions):**

| Question | Their answer |
|---|---|
| Fonts — licence Brandon Grotesque / Handsome Pro? | **No. Keep the free stand-ins.** Settled |
| White-on-teal at 4.37:1 | **Fine as it is.** Accepted knowingly; their hex stands |
| Community of Practice link | **Fine for now** — the programme-page link stays |
| Muslim-adapted workbook | TBD and not blocking; it gets added whenever it arrives |
| Contact page email | **Send to Kate's address for now** (address still needed from Wyatt) |
| Who owns the domain | **globalforgivenessmovement@gmail.com** — not an individual's account |

**Still open with them:**
- **The URL.** They lean to `globalforgiveness.org` and are taking the two weeks to decide.
  DNS on 1 Sep showed no record for it (likely free) — confirm at a registrar before anyone
  commits. A domain also gives them real email addresses, which may revisit the contact answer.
- **Vimeo.** Kate is creating the account this week and will send the link. Every video slot
  is a placeholder until the films are on it; swapping each one is a single line in js/data.js.

### Blockers

(None.)

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | Header collapses to hamburger below 1100px (Wyatt review note #1) | 2026-08-21 | 54db937, 10ab673 | .planning/quick/260821-rx2-responsive-header-hamburger-below-1100px/ |
| 2 | Two mobile horizontal-overflow faults (/join/, /workbook/) closed | 2026-08-25 | pending | .planning/quick/260825-ier-mobile-horizontal-overflow-join-and-workbook/ |
| 3 | Official brand hexes site-wide + Yuna removed (Kate 26 Aug email) | 2026-08-27 | 4147770, 0f0e1c9 | .planning/quick/260827-vfk-brand-hexes-official-and-remove-yuna/ |
| 4 | About: seven-person roster, bios expand in place (Kate 26 Aug email; photos await host allowlist) | 2026-08-28 | 1e1a7b3, 32dd8a5 | .planning/quick/260828-h02-about-page-seven-bios-expand-in-place/ |
| 5 | Five translated REACH workbooks hosted in-repo, per-language direct downloads (Kate 26 Aug email §2; Wyatt ruling 27 Aug) | 2026-08-28 | 31534de, ac2ea93 | .planning/quick/260828-hif-host-five-translated-workbooks-in-repo/ |
| 6 | Firebase go-live: config committed, workbook CSP opened, live Auth+rules verified | 2026-09-01 | 3426fcb | — |
| 7 | All four English-edition workbook PDFs hosted in-repo; moved HFP page URL fixed (old path 404s) | 2026-09-01 | 6030e8e | .planning/quick/260901-bqz-host-all-four-remaining-workbook-pdfs-in/ |
| 8 | Staff batch (Kate 1 Sep + Wyatt rulings): three HFP staff w/ verbatim bios, short lines for all ten, external links open new tabs, 2.5s store-patience fix, noscript privacy line | 2026-09-01 | 4520af7 | — |
| 9 | Wyatt 1 Sep review batch: seven fixes (dead links, tablet anchor, workbooks restructure+reword, workbook platform bar, My Path flash, navy buttons) | 2026-09-01 | ae23805 | — |
| 10 | My Path empty cards root-caused and fixed (unguarded store read aborted render); workbook second leaf removed | 2026-09-01 | c98808e | — |
| 11 | Contact form saves to Firestore (no address on the page) + one Messages inbox in /admin; duplicate `groups` write retired | 2026-09-01 | 51aa887 | .planning/quick/260901-mq7-contact-form-firestore-and-messages-inbox/ |

## Session Continuity

**Handoff — read this before doing anything:**

- **Repo home:** github.com/global-forgiveness-movement/forgiveness-platform. Org transfer is
  DONE and fully unblocked: the Claude GitHub App is installed on the org, pushes work, and
  `main` and `claude/forgiveness-platform-v1-kvyc0t` are even (both at the same commit —
  verify with `git fetch origin` first, per the standing rules, not from this sentence).

- **Live site VERIFIED 2026-08-21** at the new URL
  `global-forgiveness-movement.github.io/forgiveness-platform/`: Pages deploys green from
  `main`/root; curl returns 200; six key live files hashed byte-identical to the repo; and the
  site was rendered and screenshotted (desktop 1280 + mobile 390) — gate unlocks with `reach1`,
  footer stamp current, homepage two-doors + nameless testimonials correct, groups page correct.

- **Network allowlist ledger** (environment "Default", Custom access; each line's purpose so
  cleanup stays one glance — updated 2026-08-28):

  - KEEP: `global-forgiveness-movement.github.io` (live-site QA), `www.gstatic.com` (Firebase
    SDK QA once the project exists), `*.youtube.com` + `*.ytimg.com` + `*.youtube-nocookie.com`
    (embed QA until the Vimeo swap), plus the trusted defaults checkbox.

  - TRIM-ELIGIBLE (one-time fetch scaffolding, sources now committed to the repo 2026-08-28):
    `hfh.fas.harvard.edu`, `*.discoverforgiveness.org`, `www.evworthington-forgiveness.com`,
    `www.ecgulls.com`, `cdn.prod.website-files.com`, `static.wixstatic.com`,
    `images.squarespace-cdn.com`, `d2o2figo6ddd0g.cloudfront.net` (stale before it was ever
    used — ecgulls moved to prestosports).

  - Cooper Harris's photo never needed an allowlist entry in the end — Wyatt uploaded it through
    the GitHub web uploader (2026-09-01). `cdn.prestosports.com` is trim-eligible if it was added.
    (YouTube embeds verified live in Wyatt's real browser 2026-08-27.)

- **Container QA how-to (hard-won):** headless Chromium cannot reach github.io through the
  egress proxy even when curl can (TLS passthrough quirk) — QA by serving the repo locally
  (`python3 -m http.server` from the repo root; byte-identity with live makes it equivalent).
  For any HTTPS the browser fetches through the proxy, first import the proxy CA into NSS:
  `apt-get install -y libnss3-tools`, split `/root/.ccr/ca-bundle.crt` on BEGIN CERTIFICATE,
  `certutil -A -t "C,," -d sql:/root/.pki/nssdb` each part. Playwright needs
  `proxy: {server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1'}`.

- **Project position (updated 2026-09-01):** V1.0 built and reviewed by Wyatt; ten quick-task
  batches shipped on top of it (table above). Firebase is LIVE — this is no longer demo mode.
  **The gate everything now waits on is Kate and Richard's written feedback, due ~15 Sep.**
  Nothing is in flight. Do not restructure the site before those notes land.

- **Known record gap:** `.planning/` has no phase directories — `validate health` reports W006
  for all 5 phases. The code is all committed; the per-phase PLAN/SUMMARY record is not.
  Rebuild only if Wyatt asks; it has zero visitor impact.

Last session: 2026-09-01 — a long cloud-container day: org-transfer cleanup, navbar hamburger,
Kate's 26 Aug and 1 Sep emails (ten About bios, official brand hexes, nine hosted workbook files),
Firebase go-live, Wyatt's seven-item review batch, the My Path empty-card root cause, and two
client-facing artifacts (a review page for Kate and Richard, an agenda for the call). The call
happened; they loved it; their rulings are in the Client review round section above.
Environment note: gsd-core is not preinstalled in cloud containers; install with
`npx -y @opengsd/gsd-core -g --claude` at session start (see .claude/CLAUDE.md).
