---
quick_id: 260825-ier
slug: mobile-horizontal-overflow-join-and-workbook
date: 2026-08-25
status: complete
---

# Summary — both mobile sideways-scroll faults closed

## What changed

| File | Change |
|---|---|
| `css/site.css` | `.grid > * { min-width: 0; }` beside the `.grid` rules |
| `workbook/css/style.css` | `#app { overflow-x: clip; }` above `.page` |
| `js/site.js` | `STAMP` → `GFM-V1 · 2026-08-25a` |

Eleven lines total, layout only. No copy touched, gate untouched.

## Verified by rendering

Re-drove all 11 pages at 1280px and 390px after the change:

- **22 of 22 page-views report `scrollWidth === clientWidth`.** Before: `/join/` 409 vs 390,
  `/workbook/` 412 vs 390. Both now 390.
- **No JavaScript errors on any page**, either width.
- **The welcome branch still draws in full at desktop** — screenshot read, leaves and twig
  intact, overhanging up and right exactly as before. The clip only bites where the page is
  too narrow to hold the overhang.
- **`overflow-x: clip` did not break absolute positioning**, which was the one real risk. The
  workbook drawer opens correctly at both widths — desktop `[956,64,1216,383]`, mobile
  `[18,71,372,389]`, both fully inside the viewport, screenshot read at mobile showing all six
  menu items and the close button.
- **New build stamp confirmed rendering** in the footer: `GFM-V1 · 2026-08-25a`.

## Correction to the QA record

The QA pass also listed a third defect — "`/my-path/` shows a ~200px empty band when signed
out". **That is not a defect and no fix was made.** Measured: `body` already carries
`min-height:100vh; display:flex; flex-direction:column` with `main { flex: 1 }`, and the footer
sits at exactly the viewport bottom (575→900 in a 900px viewport). The band is a short page with
a correctly pinned sticky footer. The original entry was a screenshot read without a
measurement behind it.

## Left undone

The nine client-facing items in `.planning/qa/2026-08-25-QA-CLIENT-BLOCKERS.md` are untouched —
all of them wait on Kate and Richard.
