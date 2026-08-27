---
phase: quick-260827-vfk
plan: 01
status: complete
subsystem: design-tokens, about-roster
tags: [brand, palette, wcag, about]
requires: []
provides:
  - Official GFM Brand Cheat Sheet hexes live site-wide (tokens, gate, favicons, rgba tints)
  - Five-person About roster (Yuna removed, restoreable)
affects: [every rendered page, workbook, gate]
tech-stack:
  added: []
  patterns: [one design-token file per tree (workbook duplicate flagged for converge)]
key-files:
  created: []
  modified:
    - css/site.css
    - workbook/css/style.css
    - js/gate.js
    - js/site.js
    - js/data.js
    - 404.html
    - index.html
    - about/index.html
    - join/index.html
    - groups/index.html
    - privacy/index.html
    - my-path/index.html
    - research/index.html
    - admin/index.html
    - accessibility/index.html
    - contact/index.html
    - workbooks/index.html
    - workbook/index.html
    - .claude/CLAUDE.md
decisions:
  - Four derived shade tokens re-derived from new bases with the same arithmetic (planner-locked)
  - Cream family (--cream-soft/--paper/--white) left as-is (planner-locked)
  - Contrast failures reported, no ruled hex altered (Wyatt ruling 27 Aug)
metrics:
  duration: ~25 min
  completed: 2026-08-27
actuals:
  tokens: 8400
  tasks: 3
  commits: 2
---

# Quick Task 260827-vfk: Official Brand Hexes + Remove Yuna — Summary

**One-liner:** Every page now paints the official GFM Brand Cheat Sheet palette (teal
#00887A, navy #003D57, plum #770061, mustard #FAB812, cream #F5F1E2) instead of the
workbook-sampled colors, and the About roster is down to Kate's five people.

## What changed (plain English + size)

What a visitor sees: the same site in the clients' actual brand colors — teal noticeably
bluer-green, plum more magenta, mustard brighter — and one fewer name on the About page.
Covered the whole sweep: ~60 substitutions (base hexes, 4 re-derived shades, rgba tints,
13 favicon data-URIs, 2 inline styles) across 18 files, plus the Yuna deletion. Leaves
undone (separate tasks): the seven bios, font licensing, converging the workbook's
duplicate token block.

## Commits

| Task | Commit | What |
|---|---|---|
| 1 | `4147770` | style: adopt official GFM brand hexes site-wide (18 files; STAMP → GFM-V1 · 2026-08-27a) |
| 2 | `0f0e1c9` | content(about): remove Yuna per Kate's 26 Aug bios list (restoreable — entry preserved in this commit's parent) |

Both cite `.planning/qa/2026-08-26-KATE-EMAIL.md`. Push is left to Wyatt/orchestrator;
the stamp is already bumped for whenever that happens.

## FLAGGED FOR WYATT — WCAG contrast (surfaced, not settled; no ruled hex altered)

| # | Pairing | Where | Ratio | Threshold | Verdict |
|---|---------|-------|-------|-----------|---------|
| 1 | #ffffff on #00887a | .btn--primary, active nav pill, gate Enter button, workbook primary buttons | **4.37:1** | 4.5:1 | **FAIL** — old teal was ≈4.9:1, so this is a small regression introduced by the official teal. Passes the 3:1 large-text/UI bar; fails AA for normal-size button text. |
| 2 | #fab812 outline vs #f5f1e2 | :focus-visible outline on cream | **1.56:1** | 3:1 (non-text) | **FAIL** — pre-existing in kind (old mustard also failed, ≈1.7:1); the official mustard doesn't change the situation materially. |
| 3 | #003d57 on #f5f1e2 | headings/body on cream | 10.28:1 | 4.5:1 | pass |
| 4 | #003d57 on #fffdf7 | headings/body on card white | 11.44:1 | 4.5:1 | pass |
| 5 | #770061 on #fffdf7 | kickers on card white | 10.55:1 | 4.5:1 | pass |
| 6 | #770061 on #f5f1e2 | kickers on cream | 9.49:1 | 4.5:1 | pass |
| 7 | #ffffff on #003d57 | navy sections | 11.63:1 | 4.5:1 | pass |
| 8 | #f2f4f0 on #003d57 | footer text | 10.51:1 | 4.5:1 | pass |
| 9 | #006d62 on #f5f1e2 | links (--teal-deep) on cream | 5.52:1 | 4.5:1 | pass |
| 10 | #003d57 on #fab812 | REACH "E" letter (large) | 6.61:1 | 3:1 | pass |
| 11 | #8fbcad on #003d57 | links in navy sections | 5.52:1 | 4.5:1 | pass |

Both failures are Wyatt's conversation with Kate to carry if he wants them fixed —
options exist (e.g. bolder/larger button text, a darker focus-outline color) but each
would move away from a ruled hex or add a non-official shade, so nothing was changed.

## Planner-discretion choices (documented, not re-decided)

- Four site-derived chromatic shade tokens re-derived from the new bases with the same
  arithmetic that produced the old values: `--teal-deep #006d62` (×0.8/channel),
  `--teal-bright #009a8a` (×1.13), `--navy-deep #003146` (×0.8), `--plum-soft #871071`
  (+16/channel) — so links/hovers stay in the same family as their bases (no fork).
- Cream family (`--cream-soft #efe9d8`, `--paper #faf7ee`, `--white #fffdf7`) unchanged:
  new cream is within 2/channel of old. Sage/lavender/slate/ink unchanged. Fonts unchanged.
- `workbook/css/style.css` carries a duplicate of the token block — updated in step this
  time, **flagged for a future converge** (CLAUDE.md rule 8: one design-token file).

## Verification

- **Gate proven functionally:** clean context, filled `#gatePw` with `reach1`, submitted —
  `html[data-shell-ready]` and `.site-head` appeared. GATE_HASH/GATE_KEY untouched.
- **Straggler greps clean:** zero occurrences of the five old hexes, four old derived
  shades, or their rgb/rgba triplets outside `/plan/`, `.planning/`, `.git`
  (case-insensitive). Sage `#8fbcad` present in both :root blocks.
- **Record intact:** `git diff HEAD~2 --name-only` shows no `/plan/` or `.planning/` file.
- **PEOPLE:** module imports cleanly, exports exactly 5 entries, no Yuna; About renders
  five cards on both widths.
- **All 9 screenshots taken AND read** — new palette visibly painted (bluer-green teal
  buttons/nav pill, magenta plum, brighter mustard, deep navy), no layout breakage,
  footer stamp `GFM-V1 · 2026-08-27a` visible:
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-gate-desktop.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-home-desktop.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-groups-desktop.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-about-desktop.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-workbook-desktop.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-home-mobile.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-groups-mobile.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-about-mobile.png
  - /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/brand-workbook-mobile.png
- **Cleanup:** http.server and chromium killed; `pgrep` confirms none running.

Observation from the gate screenshot (pre-existing, not a regression): a fullPage capture
scrolls past the fixed-position gate curtain, so page content appears below the gate card
in the image. In a real viewport the gate covers everything; behavior unchanged by this task.

## Deviations from Plan

**1. [Rule 3 - Blocking] Yuna comment wording adjusted to satisfy the verify gate**
- **Found during:** Task 2
- **Issue:** The plan's suggested comment text named Yuna, but the task's automated gate
  requires zero occurrences of "Yuna" in js/data.js. The gate is authoritative.
- **Fix:** Comment says "the second leader entry was removed per that email's seven-person
  bios list" and points to the commit (which names her, keeping her restoreable).
- **Files modified:** js/data.js
- **Commit:** 0f0e1c9

No other deviations — plan executed as written.

## Self-Check: PASSED

- All 19 modified files exist and are committed; commits `4147770` and `0f0e1c9` in log.
- 9 screenshots on disk in the scratchpad.
- No orphaned server/browser processes.
