---
quick_id: 260825-ier
slug: mobile-horizontal-overflow-join-and-workbook
date: 2026-08-25
status: planned
---

# Quick task — kill the two mobile sideways-scroll faults

Found in the 25 Aug browser QA pass (`.planning/qa/2026-08-25-QA-CLIENT-BLOCKERS.md`).
Both measured element-by-element at 390px, not eyeballed.

## Task 1 — `/join/` clips 19px at 390px

**Measured:** `document.documentElement.scrollWidth` 409 against `clientWidth` 390. Every element
in the account column sits at left 18, right 409.

**Cause:** the auth `.card` lives in `<div class="wrap grid grid--2">`. Grid items default to
`min-width: auto`, so the card refuses to shrink below its min-content width (391px) inside a
354px content box, and the track drags the whole column past the viewport.

**Change:** `.grid > * { min-width: 0; }` in `css/site.css`, beside the existing `.grid` rules.
Converge rather than patch the one card — this closes the same fault on every page that puts a
card in a grid, present and future (elegance-over-patching).

## Task 2 — `/workbook/` scrolls sideways 22px at 390px

**Measured:** scrollWidth 412 against clientWidth 390. Single offender: `svg.branch`, left 192,
right 412.

**Cause:** `.welcome .branch` (`workbook/css/style.css:566`) is `position:absolute; right:-40px;
width:220px`. `img, svg { max-width:100% }` cannot constrain it because it is out of flow.

**Change:** `overflow-x: clip` on the workbook page root `#app`. Clipping at the page edge kills
the scrollbar while leaving overflow-y visible, so the branch keeps its `top:-70px` overhang.
Not a breakpoint fork, and not applied to `.welcome` — that would cut the decoration at desktop
where it fits fine and nothing is broken.

## Constraints

- Layout only. No copy changes. Gate untouched — site stays gated at the current password.
- Verify by rendering: re-drive all 11 pages at 1280px and 390px, assert
  `scrollWidth === clientWidth`, and confirm the branch still draws at desktop and the workbook's
  absolutely-positioned drawer/timer still place correctly (clip must not have broken them).
- Bump `STAMP` in `js/site.js`.

## Done when

All 11 pages report zero horizontal overflow at both widths, the workbook still looks right at
desktop in a screenshot, and the change is pushed to
`claude/mentor-qa-client-blockers-mgd2fq`.
