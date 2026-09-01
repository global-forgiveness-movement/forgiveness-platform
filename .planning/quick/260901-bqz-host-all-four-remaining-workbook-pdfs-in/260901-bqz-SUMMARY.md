---
phase: quick-260901-bqz
plan: 01
status: complete
subsystem: workbooks
tags: [downloads, broken-links, data-driven, client-content]
requires: [quick-260828-hif]
provides:
  - All four English-edition workbook PDFs hosted in-repo (assets/workbooks/)
  - Every download button on /workbooks/ resolves — no third-party dependency left in the section
  - One shared HFH constant pointing at the HFP page's new /post/ address
affects: [js/data.js, js/site.js]
tech-stack:
  added: []
  patterns:
    - Data-only fix — files.en entries ride the existing applyLang path; zero markup/logic change
key-files:
  created:
    - assets/workbooks/REACH-Forgiveness-Workbook-English.pdf
    - assets/workbooks/REACH-Workbook-Adapted-for-Churches.pdf
    - assets/workbooks/RECEIVE-Divine-Forgiveness-Workbook.pdf
    - assets/workbooks/Community-Wide-Forgiveness-Activity-Book.pdf
  modified:
    - js/data.js
    - js/site.js
decisions:
  - "Host the four edition PDFs in-repo, byte-identical from the HFP page's own file links — extends Wyatt's 27 Aug host-in-repo ruling from the translations to every edition; each verified by title page before wiring"
  - "HFH constant hoisted to the top of data.js and shared by footer CoP link, both CoP events, and the workbook fallback — the three literal copies were a fork waiting to drift (rule 8)"
  - "events link canonicalized to /post/events (old path currently 301s, but the GFM page proved HFP's old paths can die without redirecting)"
  - "The GFM Summary PDF on the HFP page was downloaded for reference (scratchpad) but NOT added to the site — nothing references it; no feature invented"
metrics:
  duration: ~25 min
  completed: 2026-09-01
commits:
  - "6030e8e feat(workbooks): host all four edition PDFs in-repo; fix moved HFP page URLs; stamp 2026-09-01a"
---

# Quick 260901-bqz: Host all four remaining workbook PDFs in-repo, fix moved HFP URL

## What broke, in plain English

Wyatt clicked Download on the English REACH workbook and got a Harvard 404. Root
cause: the Human Flourishing Program migrated their website; the Global
Forgiveness Movement page moved from `/global-forgiveness-movement` (now a hard
404, **no redirect**) to `/post/global-forgiveness-movement`. Four editions —
English REACH, Churches, RECEIVE, Activity Book — used that page as their
download destination, so every one of their buttons was broken.

## What a visitor gets now (rule 3: the size)

All nine workbook files (4 English-edition PDFs + 5 translations) download in
one click from our own site. No workbook link depends on a third party any
more — 25 Aug ruling-1 ("an unverified deep link that 404s is worse than a
landing page that works") is now fully resolved for the workbooks section,
because every link is ours by construction. Covers the whole section.

**Leaves undone:** the Muslim-adapted edition (Kate is sending it; the data
slot comment in data.js stays ready) and swapping the Community of Practice
links for Kate's Zoom registration link (standing TODO, still pointing at the
HFP page — now the working address).

## Visitor-facing copy changes (rule 11 — for Wyatt's approval)

No new strings were written. Four buttons changed from the generic
`Download PDF` to the existing template's `Download (PDF, 2.7 MB)` form —
the same label pattern the five translations have shown since 28 Aug, now
fed by the new file entries.

## Verification (rules 4/6)

- Rendered locally (byte-identical to what Pages serves), Playwright at 1280
  and 390: screenshots `workbooks-desktop.png` / `workbooks-mobile.png` in
  this directory, both read — four PDF buttons with sizes, layout intact,
  stamp `2026-09-01a` visible in the footer
- All nine hosted files return 200; each PDF's title page matches its name
  (RECEIVE carries the Rutledge/Jackson-Meyer/Cook/Cowden citation)
- Per-language path spot-checked: Ukrainian still yields
  `Download (Word, 1.2 MB)` with tag `reach:uk`; English tags `reach:en` etc.,
  so download counting is unchanged
- Both HFP URLs curl-verified: old = 404, new /post/ = 200
- Server and headless browser killed (rule 16)

## Deviation from workflow

Planner/executor roles ran inline rather than as subagents: the session was
already on a dedicated task worktree, and the four PDFs sat untracked — a
forked executor worktree (from origin/HEAD) would not have contained them.
GSD guarantees kept: PLAN.md before execution, atomic feat + docs commits,
this SUMMARY, STATE.md table updated.
