---
phase: quick-260901-bqz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - assets/workbooks/REACH-Forgiveness-Workbook-English.pdf
  - assets/workbooks/REACH-Workbook-Adapted-for-Churches.pdf
  - assets/workbooks/RECEIVE-Divine-Forgiveness-Workbook.pdf
  - assets/workbooks/Community-Wide-Forgiveness-Activity-Book.pdf
  - js/data.js
  - js/site.js
autonomous: true
requirements: [WYATT-260901-broken-pdf-downloads]
estimate:
  tokens: 30000
  raw_tokens: 30000
  tasks: 3
  confidence: high
must_haves:
  truths:
    - "Every Download button on /workbooks/ resolves — the HFP moved its GFM page from /global-forgiveness-movement (now a hard 404, no redirect) to /post/global-forgiveness-movement, which silently broke all four editions that fell back to the landing page"
    - "A visitor downloading English REACH, the Churches edition, RECEIVE, or the Activity Book gets the PDF directly from this site — same one-click treatment the five translations got on 28 Aug (Wyatt's 27 Aug host-in-repo ruling, extended; sources: the PDFs the HFP page itself serves, verified by title page)"
    - "This fully resolves 25 Aug ruling-1 for the workbooks section: no workbook link depends on a third party any more; the HFH constant survives only as the never-taken fallback and for the Community of Practice links, updated to the working /post/ URL"
    - "ONE path: applyLang in workbooks/index.html already derives href/label/count-tag from w.files — the fix is data-only (files.en entries); no markup or logic fork (rule 8)"
    - "Download labels state format and size honestly (PDF, MiB convention matching the translations); recordDownload keeps counting edition:lang"
    - "The four PDFs are byte-identical to what the HFP page serves — no conversion, no editing"
  artifacts:
    - "assets/workbooks/*.pdf — four files, ~11.5 MB total, verified title pages"
    - "js/data.js — files.en on all four editions; HFH constant and /events link on /post/ URLs; stale TODO comment rewritten"
    - "js/site.js — STAMP 'GFM-V1 · 2026-09-01a'"
  key_links:
    - "WORKBOOKS[*].files.en → applyLang(id,'en') on load → button href + 'Download (PDF, N MB)' label + data-download='id:en' tag"
    - "button click → site.js watchDownloads → recordDownload('<id>:en')"
    - "HFH constant → nav Community of Practice + two program cards + workbook url fallback (all now resolve 200)"
---

<objective>
Fix the broken workbook downloads: host the four remaining editions' PDFs in-repo
(English REACH, REACH Adapted for Churches, RECEIVE, Community-Wide Activity Book)
and repoint every remaining HFP link at the page's new /post/ address.

Purpose: Wyatt reported the English REACH download 404s. Root cause: HFP migrated
their site; the old GFM page URL dies with no redirect. Four editions relied on it
as their download destination. The PDFs were pulled from the working /post/ page
on 2026-09-01 and verified by title page before this plan was written.

Output: four .pdf files under assets/workbooks/, files.en entries wired through the
existing applyLang path, working /post/ URLs for the fallback + Community of
Practice + events links, stamp 2026-09-01a, SUMMARY flagging label copy for Wyatt.

Size (rule 3): a visitor clicking Download on ANY of the four broken editions today
gets a 404 page from Harvard — after this, all nine hosted files (4 PDFs + 5
translations) download in one click from our site. Covers the whole workbooks
section. Leaves undone: the Muslim-adapted edition (Kate is sending it; data slot
stays ready) and the Community of Practice Zoom-registration swap (separate TODO).
</objective>

<tasks>

## Task 1 — Wire the four PDFs through the existing data path (js/data.js)

The four PDFs are already at assets/workbooks/ (downloaded + verified this session).

- reach: add `en: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-English.pdf', format: 'PDF', size: '2.7 MB' }`
  and delete the "'en' is deliberately absent" comment — it no longer tells the truth.
- church: add `files: { en: { path: 'assets/workbooks/REACH-Workbook-Adapted-for-Churches.pdf', format: 'PDF', size: '3.1 MB' } }`
- receive: `files: { en: { path: 'assets/workbooks/RECEIVE-Divine-Forgiveness-Workbook.pdf', format: 'PDF', size: '2.9 MB' } }`
- activity: `files: { en: { path: 'assets/workbooks/Community-Wide-Forgiveness-Activity-Book.pdf', format: 'PDF', size: '2.3 MB' } }`
- HFH constant → 'https://hfh.fas.harvard.edu/post/global-forgiveness-movement' (fallback + CoP links resolve again)
- events link → 'https://hfh.fas.harvard.edu/post/events' (old path currently 301s there; the GFM page proves old paths can die outright)
- Rewrite the workbook-downloads block comment: TODO(wyatt) direct-URLs is CLOSED; record the 2026-09-01 migration fact so the next reader knows why /post/.

Verify: node --check js/data.js (it's an ES module — use a syntax-only check that handles export).

## Task 2 — Stamp

js/site.js STAMP → 'GFM-V1 · 2026-09-01a'.

## Task 3 — Render and verify (rules 4, 6)

Serve the repo locally, drive /workbooks/ headless at 1280 and 390 wide:
- Every edition's button reads "Download (PDF, N MB)" (translations still per-language)
- Each button's href resolves 200 against the local server (all nine files)
- Screenshots desktop + mobile saved to the task directory for Wyatt
- Kill the server and browser afterward (rule 16)

</tasks>

<commits>
1. feat(workbooks): host all four edition PDFs in-repo; fix moved HFP page URLs; stamp 2026-09-01a
2. docs(quick-260901-bqz): plan, summary, state
</commits>
