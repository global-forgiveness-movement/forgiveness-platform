---
phase: quick-260901-i0z
plan: 01
status: complete
completed: 2026-09-01
commits:
  - cf3296e — fix(review-1sep): items 1, 2, 3, 4, 7 + stamp 2026-09-01c
  - ae23805 — feat(workbook)/fix(auth): items 5 and 6
push: HELD — committed on claude/forgiveness-platform-v1-kvyc0t, NOT pushed (orchestrator pushes after Wyatt's read)
stamp: GFM-V1 · 2026-09-01c
requirements:
  - WYATT-260901-item-1-contact-404
  - WYATT-260901-item-2-groups-anchor
  - WYATT-260901-item-3-chooser-move-reword
  - WYATT-260901-item-4-start-it-now-top
  - WYATT-260901-item-5-workbook-platform-bar
  - WYATT-260901-item-6-my-path-flash
  - WYATT-260901-item-7-navy-band-buttons
actuals:
  tokens: 21000
  tasks: 3
  commits: 2
---

# Quick task 260901-i0z: Wyatt's 1 Sep review batch — seven fixes — Summary

**One-liner:** All seven 1 Sep review items closed with rendered proof — dead
Harvard links now hit the live /post/ page (curl 200), the group-form anchor
lands on its heading, the workbooks page leads with "Start it now" and asks one
chooser question, the interactive workbook gained a quiet way back to the site,
the My Path signed-out flash is gone at the auth layer, and every navy-band
button reads as a real button.

## Plain English, and the size (rule 3)

A visitor yesterday could hit a Harvard 404 from our contact page, land on
naked form fields with no heading when following "the group form", meet a
two-question chooser where one question does, hunt mid-page for the screen
option, get stranded inside the interactive workbook with no way back, watch
My Path tell a signed-in member to sign in for a second, and read the navy
bands' calls-to-action as greyed-out. After this batch, all seven are fixed.
**Covers the whole 1 Sep list; leaves undone: nothing from the list.** Still
open with Kate (pre-existing): which inbox receives site contact.

## Per-item rulings and what shipped (rule 10)

### Item 1 — dead HFP URL (ruling: Wyatt 1 Sep, item 1)
The two served-file stragglers on the dead old path — contact "Contact via the
program page" and groups Community-of-Practice "Register" — now point at
`https://hfh.fas.harvard.edu/post/global-forgiveness-movement`. **Proven live:
curl through the proxy returns 200 on /post/, 404 on the old path.** They are
static anchors with no render path, so hardcoding is the ruling's sanctioned
option; each carries a breadcrumb comment pointing at the HFH constant in
js/data.js, whose own comment now says to grep `*.html` on any future HFP move.
Repo grep for the dead path across served files: **zero hits**.

### Item 2 — group-form anchor mis-lands at ~900px (ruling: fix anchor targeting; diagnosis required first)
**Diagnosis, measured before any edit** (900×700 cold load of
`/groups/#groupForm`, 200ms samples):
1. **The anchor targeted the bare form, not its section** — the browser put
   `#groupForm` at viewport top with the "Tell us about your group" heading
   sitting 146px ABOVE the viewport (`h2Top: -146`). The before-screenshot
   shows exactly Wyatt's symptom: naked fields, heading cut off.
2. **Late hydration grows the page above the anchor** — at the store's 2.5s
   answer, the three `figure.video` slots went 0→290/264/264px and the events
   list 0→3 items: **~560px of growth above the form after the anchor scroll**
   (pageH 4686→5247). In this run Chrome's own scroll anchoring compensated
   (scrollY jumped 3612→4172 unprompted), but that rescue is browser- and
   timing-dependent — with a fast production backend the growth lands during
   the ~1s smooth-scroll animation, whose target offset is already stale.
3. **NOT the mechanism:** a sticky-header overlap — `.site-head` has no
   position rule, and it was prepended (72px) before the anchor scroll began.

**All three planned fixes shipped:** `id="tell-us"` on the section (contact
links `../groups/#tell-us`; `#groupForm` untouched for the page's script);
`.section[id] { scroll-margin-top: 1rem }`; `figure.video:empty
{ aspect-ratio: 16/9 }` reserving every video slot on every page (rule 8); and
one shell-level `keepAnchorAligned()` in js/site.js — for 3.5s after a
cold-load with a hash, a body ResizeObserver re-aligns the target unless the
visitor has started moving. **After-shot at 900×700: heading and intro line
visible near the viewport top.** "I want to lead a group" (#lead) also lands
at its section top.

### Items 3 + 4 — workbooks reorder + one-question chooser (rulings: Wyatt 1 Sep, items 3 and 4)
Page now reads: hero → **"Start it now"** (card copy untouched, section now
plain) → the two main workbook cards → languages → **one-question chooser**
(now `section--paper`, directly above "If REACH helped") → next steps → navy
band. Backgrounds still alternate paper/plain/paper/plain/paper/plain/navy
(DOM-audited and screenshotted). Chooser buttons jump to #reach/#church as
before — no new JS; the page's inline module is order-independent and was not
touched.

**⚑ NEW COPY, shipping pending Wyatt's veto (rule 11):**
- Item 3 chooser, verbatim as shipped: question **"Would you prefer the
  standard edition, or one framed within Christian faith?"**; buttons
  **"Standard edition"** / **"Church edition"**; muted line **"Seeking to
  receive God's forgiveness yourself? That's the RECEIVE workbook, just
  below."** (The "Two questions, and we'll point you…" line was deleted — no
  longer true.)
- Item 4 section title: **"Start it now"** (replacing "Rather do it on a
  screen?"). Every word inside the card is unchanged.

### Item 5 — workbook platform bar (ruling: Wyatt 1 Sep, item 5)
A 44px cream bar above the workbook app: leaf + "Global Forgiveness Movement"
wordmark (navy, links `../`), "My Path" right (teal-deep, links
`../my-path/`). Brand tokens the workbook stylesheet already carries; no
shadow, no bold, nothing animated. `.page` min-height now subtracts
`--platform-bar-h` so dark screens gain no scrollbar. The HTML comment marks
it a deliberate exception to the one-shell rule — two static links, not a
shell fork. **CSP unchanged** (static same-origin markup); the shared gate
still covers the full viewport. Click-throughs verified: brand → site home,
My Path → /my-path/. Rendered at 1280 and 390 with the workbook UI intact.

### Item 6 — My Path flash (ruling: no fix without naming the cause)
**Cause, named from painted frames captured BEFORE the fix:** `js/auth.js`
`onAuth(cb)` invoked `cb(user)` synchronously at subscription while `user` was
still `null` — before the backend's first answer. My Path's callback un-hid
the signed-out section from that early null and `mountAuth` painted the
sign-in links; when `announce()` later delivered the real user, everything
swapped. Frame evidence (CDP screencast, real auth.js/site.js/my-path code;
the unreachable Firebase CDN stood in by a mock answering "signed in" at
600ms): **t=335ms paints "My Path — Sign in to see your place…" with a Sign
in button; t=869ms swaps to "Welcome back, Wyatt".** The frames also disprove
the gate/unstyled-body theory: frame00 is blank white — the
`body{visibility:hidden}` curtain works.

**Fix at the one auth layer (rule 8):** listeners now hear nothing until the
first `announce()` (unknown ≠ signed out); `impl.init()` rejection and a 2.5s
bound (the store-patience precedent) still resolve to signed-out so an
offline/blocked visitor never waits on a blank page. **After-frames: calm
blank paper at t=268ms, "Welcome back, Wyatt" at t=806ms — the signed-out
section never paints.**

**Header swap (executor's call, taken):** the same class of flash lived in
the header ("Sign in" → "My Path · Wyatt"). A one-bit
last-answer-was-signed-in hint (`gfm.auth.hint.v1`, written only by
announce(); no identity stored) lets `buildHeader()` render a blank auth slot
for a returning member instead of sign-in links about to swap. Signed-out
visitors keep the static links untouched and immediately — no delay for the
majority. Verified: on a hinted device the header never contains "Sign in" at
any sample before settling signed-in.

**Sweep of every onAuth consumer** (all tolerate the deferred initial
callback): mountAuth (static/blank until first answer), my-path (both
sections start hidden — the desired calm blank), workbook/bridge.js (uid null
→ sync no-ops), join (redirect fires only on a truthy user — verified: a
signed-in visitor still lands on /my-path/). **Demo mode re-verified** via a
null-config mock: signed-out shows the signed-out view; a seeded demo session
shows "Welcome back" with no signed-out paint. Signed-out with the backend
fully unreachable resolves in ~140ms (init rejection path).

### Item 7 — navy-band buttons (ruling: Wyatt 1 Sep item 7 + his mid-flight correction: the greyed look is the green TEXT on the teal, not the teal fill)
Root cause exactly as Wyatt said: `css/site.css` `.section--navy a { color:
var(--sage) }` — specificity (0,1,1) — beat `.btn--primary` (0,1,0), painting
button labels sage on teal. Fixed once at the source: the tint is now
`.section--navy a:not(.btn)`, so no navy band — current or future — can tint
a button again. The homepage band's hardcoded sage-outline button became
`btn--primary` with the inline style deleted. Sweep (rule 8): the repo has
exactly two `.section--navy` bands (index.html, workbooks/index.html; the
footer is navy but holds no .btn) — both verified rendering **solid
rgb(0,136,122) with rgb(255,255,255) text**, desktop and mobile, pixels read.

**Contrast report (report only — the hex is Wyatt's ruling):** white on
#00887A = **4.37:1**, just under the 4.5:1 AA line for small text (.btn label
is ~15.7px semibold; at 3:1 it would pass as large text if bumped to 18.66px+
or 700 weight — noted for Wyatt, not changed).

## Deviations from plan

- **Hint-aware header first paint:** the plan's executor's-call allowance on
  the header swap was taken one step further than mountAuth — `buildHeader()`
  in js/site.js also reads the hint, because verification showed the static
  markup painting before mountAuth could clear it on pages that load auth.js
  fresh. Same one-bit key, written in one place (auth.js), read for first
  paint (site.js, commented both ends).
- Everything else executed as planned; both diagnoses confirmed the plan's
  suspected mechanisms (and disproved the sticky-header and gate-overlay
  guesses, as the plan anticipated).

## Verification record

- `node --check` clean: js/site.js, js/data.js, js/auth.js.
- Dead-path grep across served files: zero hits; /post/ URL curls 200.
- Stamp: footer renders `GFM-V1 · 2026-09-01c`.
- Servers and headless browsers: killed and verified gone (rule 16).
- Committed on `claude/forgiveness-platform-v1-kvyc0t`, **NOT pushed** — held
  for Wyatt's read.

## Screenshot inventory (all in /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/)

| File | What it shows |
|---|---|
| rev7-item2-before-settled.png | THE DEFECT: naked form fields, heading cut off above (900×700) |
| rev7-item2-before-early.png | Cold load mid-smooth-scroll, videos still 0px |
| rev7-item2-before-lead-click.png | #lead click before fix (landed fine post-hydration) |
| rev7-item2-after-900px.png | ACCEPTANCE: "Tell us about your group" heading + intro visible near top |
| rev7-item2-after-lead-click.png | #lead still lands at section top after fix |
| rev7-item6-before-frame00-t102ms.png | Blank white — visibility curtain works (gate theory disproven) |
| rev7-item6-before-frame02-t335ms.png | THE FLASH: signed-in member told to sign in |
| rev7-item6-before-frame04-t869ms.png | The swap to "Welcome back, Wyatt" |
| rev7-item6-after-frame03-t268ms.png | After fix: calm blank paper, no signed-out paint |
| rev7-item6-after-frame05-t806ms.png | After fix: straight to "Welcome back, Wyatt" |
| rev7-item6-after-returning-settled.png | Returning hinted device settled signed-in |
| rev7-item6-after-signedout-nobackend.png | Signed-out view with backend unreachable |
| rev7-item5-workbook-bar-desktop.png | 44px cream bar above intact workbook UI, 1280 |
| rev7-item5-workbook-bar-mobile.png | Same at 390 — wordmark fits, no overflow |
| rev7-workbooks-top-1280.png / -390.png | Hero → "Start it now" order, both widths |
| rev7-workbooks-bottom-1280.png / -390.png | Navy band button solid teal/white, both widths |
| rev7-workbooks-chooser-1280.png / -390.png | One-question chooser, locked copy verbatim |
| rev7-workbooks-chooser-jump-church.png | Chooser "Church edition" jump landing on the cards |
| rev7-workbooks-navy-band.png | Workbooks navy band close-up |
| rev7-home-navy-band-1280.png / -390.png | Homepage "Begin today": both buttons solid teal/white |
| rev7-contact-page.png | Contact page with the /post/ program-page button |

## Self-Check: PASSED

- Commits cf3296e and ae23805 exist on the branch; nothing pushed.
- All touched files present; syntax checks clean; all seven truths observed
  rendered.
