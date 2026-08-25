# Client call rulings — 25 Aug 2026

Wyatt's notes from the call with Kate Jackson-Meyer and Richard Cowden, and what each ruling
changed. **This file is the current top of the feedback record: later corrects earlier**
(scope plan Draft 3 → Kate's CSV → Kate's email → this).

| # | Ruling | Whose | What it changed |
|---|--------|-------|-----------------|
| 1 | Every edition is downloadable from the Discover Forgiveness site, but none are designed yet and several people are producing different pieces | Kate | Links left on the programme page deliberately; ruling recorded in `js/data.js`. Direct URLs still to confirm — an unverified deep link that 404s is worse than a landing page that works |
| 2 | Captions uncertain; Kate to ask the video editor. Auto-transcribe on receipt is acceptable | Kate | Accessibility page no longer promises audio description; captions + transcripts remain |
| 3 | No newsletter exists; Kate works the list by hand. Remove the unsubscribe promise | Kate | Privacy and sign-up copy rewritten to describe what actually happens |
| 4 | Three paths, not two: alone, lead a group, or link up with a group you are **already** in. **No "find a group to join" directory** | Kate + Richard | Third door built; leader-issued group codes (`js/groups.js`) |
| 5 | People may need to log in to use the interactive workbook and keep progress | Richard | Already true — progress-only sync. No change |
| 6 | Testimonials: keep a vague descriptor, never a name | Kate | Existing descriptors kept verbatim — already name-free and every word true. No invented locations |
| 7 | Don't use Harvard anywhere on the site — just the Human Flourishing Program | Richard | Swept from header, footer, copyright, meta descriptions, About prose, accessibility page |
| 8 | Name people on About: Richard, Kate, Tyler, plus group leaders Cooper and Yuna | Kate | Cooper and Yuna added; descriptions blank until Kate sends them, and the renderer omits an empty one |
| 9 | Don't look more resourced than you are | Richard | Six people listed, no invented titles. Worth re-checking once Kate's descriptions land |
| 10 | Kate will start the Vimeo account and upload the existing films | Kate | No code change; placeholders stay until files land |
| 11 | No programme calendar — events updated by hand | Kate | Unchanged; Kate edits them via `/admin` after handover |

## Correction to the QA brief this call was based on

**"Nobody is named on the About page" was wrong.** The page already renders four people from
`PEOPLE` via script; the finding came from reading markup instead of the rendered page. Kate's
ruling therefore only *adds* Cooper and Yuna rather than creating the section.

## What the third door still needs

Group codes are generated, parsed and stored through the shared `store`, which is
**localStorage until Firebase is connected**. A code created in a leader's browser cannot be
looked up in a member's browser yet. The code carries its own series (the `3` or `6` in
`GFM-3-XXXX`), so the *right series* still resolves cross-device — only the group's name needs
the backend. Connecting Firebase closes this completely.

## A taste call left open for Wyatt

The homepage hero now carries three buttons, and at desktop width the third wraps to its own
line. The three doors also appear as cards further down, so the hero could drop back to two
without losing the client's model. Left as three deliberately — reducing it is a one-line
change, and placement is Wyatt's call, not one to settle silently.
