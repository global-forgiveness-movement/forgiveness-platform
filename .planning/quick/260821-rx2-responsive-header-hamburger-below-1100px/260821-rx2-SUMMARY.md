---
phase: quick-260821-rx2
plan: 01
subsystem: shell (header)
tags: [responsive, header, accessibility, css]
requires: []
provides: [responsive-header]
affects: [every page — one shell renders all headers]
tech-stack:
  added: []
  patterns: ["display:contents + flex order for one DOM serving two layouts"]
key-files:
  created: []
  modified:
    - js/site.js
    - css/site.css
decisions:
  - "Wrapped controls row on narrow phones (<~560px) right-aligns via margin-left:auto — brand + button + hamburger physically cannot share a 390px row with the brand legible and the Harvard subtitle kept"
metrics:
  duration: ~25 min
  completed: 2026-08-21
status: complete
---

# Quick Task 260821-rx2: Responsive Header — Hamburger Below 1100px Summary

**One-liner:** Below 1100px the header's 5 nav links + "Sign in" fold into an aria-wired
hamburger slide-down; the row keeps brand + auth button + toggle, and ≥1100px is
structurally unchanged (all new CSS appended behind a max-width media query — 37
insertions, 0 deletions in css/site.css against the pre-task baseline).

## What a visitor gets

Tablets and phones no longer see the header wrap onto a bare second line — the first thing
every visitor saw broken from ~1060px down. They now get brand + "Create account" (or
"My Path" when signed in) + a hamburger; opening it slides down a calm stacked menu (5 nav
links + Sign in, in-flow, no overlay, no scroll lock, 180ms ease-out that
prefers-reduced-motion already disables). Desktop (≥1100px) is pixel-identical.

## How it's built (one header path — rule 8)

- `buildHeader()` gained exactly one element: the `.nav-toggle` `<button>`
  (aria-expanded/aria-controls="site-menu", inline SVG). The pre-hydration auth slot now
  includes the Create account anchor character-for-character from `mountAuth`'s signed-out
  markup, so nothing pops in below 1100px.
- `wireMenu()` — one piece of state, the `data-menu-open` attribute on `.site-head`; CSS
  draws everything from it. Toggle click, Escape (returns focus to the button), link-click
  close, and a `matchMedia('(min-width: 1100px)')` listener so a resize never strands the
  menu open.
- CSS: `.site-auth { display: contents }` promotes the auth slot's children to header flex
  items; flex `order` puts the `.btn` in the row and `.signin` in the panel — both auth
  states served by the same rules, `js/auth.js` untouched. `appendCustomNav()` pages
  inherit the panel for free.
- STAMP bumped to `GFM-V1 · 2026-08-21h`.

## Commits

| Commit | What |
|--------|------|
| 54db937 | feat: collapse header into hamburger menu below 1100px (site.js + site.css) |
| 10ab673 | fix: right-align wrapped header controls on narrow phones |

## Deviations from Plan

**1. [In-plan adjustment, sanctioned by Task 1's "if the 390px screenshot looks cramped"
clause] Right-aligned the wrapped controls row on narrow phones.**
- **Found during:** Task 2, reading the first 390px screenshot.
- **Issue:** At 390px the row wraps (brand ~280px + button ~145px + toggle ~43px + gaps
  can never fit 355px of content width with the brand legible and the Harvard subtitle
  kept, which the plan requires). The wrapped Create account + hamburger sat left-aligned
  under the brand — reading as overflow, and leaving the hamburger not at the right edge.
- **Fix:** `margin-left: auto` on `.site-auth .btn` inside the same media block. When
  wrapped, the controls row sits flush right (hamburger at the edge); in a single row the
  auto margin dissolves into the gap the brand's `margin-right: auto` already owns —
  re-rendered at 1000px and confirmed identical.
- **Files:** css/site.css. **Commit:** 10ab673.

No other deviations — no auth.js changes, no existing CSS rule edited.

## Verification (rules 4 & 6 — everything below was looked at rendered)

23 Playwright assertions passed, zero JS pageerrors, across both auth states. Every
screenshot was read with the Read tool. Screenshots for the orchestrator:

| Path | Shows |
|------|-------|
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1280-signedout.png | D-03 exhibit: single row, inline nav, Sign in + Create account, no hamburger |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1000-signedout-closed.png | Row = brand + Create account + hamburger, no orphan second line |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1000-signedout-open.png | Panel: 5 stacked links (Home current-page pill) + Sign in row, top border |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-390-signedout-closed.png | Brand row + right-aligned Create account + hamburger; brand + subtitle legible |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-390-signedout-open.png | Same + open panel, calm full-width rows |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1280-signedin.png | Desktop unchanged, My Path · QA right of nav, no hamburger |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1000-signedin-closed.png | My Path button in the header row + hamburger |
| /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/hdr-1000-signedin-open.png | Panel is the 5 nav links ONLY — no Sign in row when signed in |

Also verified: aria-expanded true/false round-trip at 1000 and 390; Escape closes and
returns focus to the toggle; nav-link click from the open menu navigates and the next page
loads closed; demo sign-up (throwaway account, container-local only — repo untouched).

Gates: `node --check` on site.js passed; STAMP grep passed; css diff vs pre-task baseline
= 37 insertions / 0 deletions (D-03 structural proof).

Process hygiene (rule 16): QA http.server (PID 11706, port 8080) killed — port confirmed
free; zero chromium processes remain (`ps` check, not self-matching pgrep). A pre-existing
`http.server 8123` (PID 6306) was running before this task and was not started by it —
left alone.

## Self-Check: PASSED

- js/site.js, css/site.css modified: FOUND
- Commit 54db937: FOUND · Commit 10ab673: FOUND
- 8 hdr-*.png screenshots on disk: FOUND
