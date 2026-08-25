# QA pass — 25 Aug 2026: client blockers & findings

Full browser pass over the live `main` build (stamp `GFM-V1 · 2026-08-21h`). All 11 pages
driven at 1280px and 390px; full-page screenshots read. Client-call brief published as an
artifact for Wyatt's 25 Aug call with Kate Jackson-Meyer and Richard Cowden.

## For the clients — launch blockers

1. **Workbook downloads don't download.** All four "Download PDF" buttons and the six-language
   picker resolve to the HFP landing page (`js/data.js`, `url: HFH`). The language `<select>`
   has no effect on the destination. **Need: direct PDF URLs per edition × language, or
   permission to host copies.**
2. **Accessibility promises exceed the video handover.** `accessibility/index.html` commits to
   WCAG 2.1 AA, "captions on every video we publish", and "audio description and transcripts
   ship with the video series". The 13 pieces due 9 Oct have no named producer for any of the
   three. **Need: who produces captions/transcripts/AD, and confirmation they ship together.**
3. **Email consent collected with no mailing list.** `join/index.html` has an opt-in tickbox
   (unticked by default, correct); `privacy/index.html` promises "every email has an
   unsubscribe link". No list, no sender, no owner exists. Rule 13 — the code must make the
   words true or the words change. **Need: list owner, and whether it must be a Harvard system.**

## For the clients — decisions only they can make

4. **"I want to join a group" is a dead end** — `groups/index.html:23` anchors to `#what`.
   No directory, no waitlist. Product gap, dependent on what Kate can staff.
5. **All three testimonial permission flags still false** (`js/data.js`) — quotes run nameless.
6. **Footer copyright unconfirmed** — "© 2026 President and Fellows of Harvard College" on
   every page, written as an assumption. Plus: Harvard privacy office review and the
   accessibility conformance report are both promised on the site and both client-side.
7. **No people named on the About page** — "The people behind this" links out to Harvard only.

## For the clients — information

8. **All five video slots share one placeholder playlist** (`js/data.js` `PLAYLIST`). By design,
   captioned as such, but reads as an error to an unbriefed viewer.
9. **Three hardcoded events go stale after 24 Oct** (`js/data.js` `EVENTS`). Kate owns these via
   `/admin` after handover — confirm she wants that rather than a feed.

## Ours to fix — not client items

- **`/join/` scrolls sideways at 390px.** Column min-content is 391px in a 390px viewport;
  every card and the form clip by 19px. Cause: the auth `.card` inside `.wrap.grid.grid--2`
  won't shrink (grid items default to `min-width:auto`). Convergent fix is `.grid > *
  { min-width: 0 }` in `css/site.css` — fixes this and prevents the class recurring, rather
  than patching one card (rule 8).
- **`/workbook/` scrolls sideways at 390px** — decorative SVG overruns by 22px.
- **`/my-path/` signed-out shows a ~200px empty band** — hidden sections still draw padding.
- **Firebase not connected** — demo mode, so group registrations are captured nowhere.

## Verified vs not

Verified rendered: two-door homepage; nameless testimonials; "over 4,500 participants";
"5 relatively high-conflict countries"; REACH A = "Altruistic gift of forgiveness offered
freely"; header "Global Forgiveness Movement" over "Human Flourishing Program at Harvard";
no "start the series" copy anywhere; every internal link resolves; no broken images; no JS
errors on any page; both overflow faults measured element-by-element.

Not verified: YouTube embeds rendering as players (container proxy blocks the host — curl
returns a full player page; needs one real-browser glance); live Firebase behaviour;
screen-reader/keyboard passes; `/admin` and `/plan`.
