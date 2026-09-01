---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 5
current_phase_name: all five phases built
status: executing
last_updated: "2026-09-01T13:25:21.023Z"
last_activity: 2026-08-21
last_activity_desc: All phases executed in one session; browser-QA'd with
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
Status: V1.0 skeleton complete, awaiting Wyatt's review (then Kate's)
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

- Send Kate the new /plan link once pushed (root URL becomes the platform)
- Wyatt to create the Firebase project and commit its web config when ready to leave demo mode
  — when that happens, also update workbook/index.html CSP (hosts listed in its comment) and
  re-read the workbook privacy copy so it still tells the truth

- Wyatt to drop the GFM Brand Cheat Sheet into the repo for a color/type true-up pass
- Testimonial permission flags flip to true as Kate confirms names (js/data.js)
- Vimeo swap-in when final video files arrive (target 9 Oct) — one line per slot in js/data.js
- Direct download URLs (js/data.js TODO) — CLOSED 2026-09-01 (quick task #7): all nine files
  hosted in-repo (5 translations + 4 English-edition PDFs pulled from the HFP page after its
  move to /post/global-forgiveness-movement broke the fallback links). Note for the record:
  HFP's old URL 404s with NO redirect — if they migrate again, our HFH constant
  (top of js/data.js) is the one place to fix

- Contact inbox: confirm with Kate which email receives site contact (contact/index.html TODO)
- Community of Practice registration link (js/data.js TODO)
- At Firebase go-live, security rules must also cover the CMS: content/* and pages/* world-readable,
  editor-writable via settings/editors allowlist; contentHistory editor-only; seed settings/editors
  with Wyatt's and Kate's emails

- SEO note for launch: editor-created pages are served as 404-status; commit a stub file for any
  Kate page that should be indexed (automatable with an Action later)

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

## Session Continuity

**Handoff from 2026-08-21 (post-transfer session) — read this before doing anything:**

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

  - PENDING: `cdn.prestosports.com` — needed ONCE for Cooper Harris's photo, then trim it too.
    (YouTube embeds verified live in Wyatt's real browser 2026-08-27.)

- **Container QA how-to (hard-won):** headless Chromium cannot reach github.io through the
  egress proxy even when curl can (TLS passthrough quirk) — QA by serving the repo locally
  (`python3 -m http.server` from the repo root; byte-identity with live makes it equivalent).
  For any HTTPS the browser fetches through the proxy, first import the proxy CA into NSS:
  `apt-get install -y libnss3-tools`, split `/root/.ccr/ca-bundle.crt` on BEGIN CERTIFICATE,
  `certutil -A -t "C,," -d sql:/root/.pki/nssdb` each part. Playwright needs
  `proxy: {server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1'}`.

- **Project position unchanged:** V1.0 skeleton 100% built; the gate everything waits on is
  Wyatt's review of the site (password `reach1`). Nothing is in flight.

- **Known record gap:** `.planning/` has no phase directories — `validate health` reports W006
  for all 5 phases. The code is all committed; the per-phase PLAN/SUMMARY record is not.
  Rebuild only if Wyatt asks; it has zero visitor impact.

Last session: 2026-08-21 — org-transfer cleanup in a Claude Code cloud container (docs commit
applied + pushed, org app access fixed, Pages deploy verified, network allowlist widened).
Environment note: gsd-core is not preinstalled in cloud containers; install with
`npx -y @opengsd/gsd-core -g --claude` at session start (see .claude/CLAUDE.md).
