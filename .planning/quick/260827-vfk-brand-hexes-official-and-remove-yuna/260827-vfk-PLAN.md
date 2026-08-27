---
phase: quick-260827-vfk
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
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
autonomous: true
requirements: [QUICK-VFK-BRAND, QUICK-VFK-YUNA]

estimate:
  tokens: 70000
  raw_tokens: 45000
  tasks: 3
  confidence: low

must_haves:
  truths:
    - "Every page renders with the official Brand Cheat Sheet hexes; no element anywhere still paints any of the five old hexes or their rgb()/rgba() forms (Wyatt ruling 27 Aug, per .planning/qa/2026-08-26-KATE-EMAIL.md)"
    - "Sage #8fbcad is unchanged (kept as derived accent, per the same ruling); fonts unchanged"
    - "The About roster shows five people; Yuna does not appear (Kate's 26 Aug bios list)"
    - "The gate still unlocks with reach1 after the gate.js edits"
    - "The footer stamp reads GFM-V1 · 2026-08-27a"
    - "/plan/ and .planning/ historical records are byte-identical to before"
    - "Any text/background pairing under WCAG threshold is REPORTED in the SUMMARY, never silently fixed by altering a ruled hex"
  artifacts:
    - ".planning/quick/260827-vfk-brand-hexes-official-and-remove-yuna/260827-vfk-SUMMARY.md"
    - "Screenshots (desktop 1280 + mobile 390) of gate, homepage, groups, about, workbook in the scratchpad"
  key_links:
    - "css/site.css :root tokens -> every platform page (one design-token file)"
    - "workbook/css/style.css :root -> the interactive workbook (known duplicate of the token block — update in step, flag for future converge)"
    - "js/gate.js GATE_CSS + leaf() -> gate on every page including the workbook"
    - "js/data.js PEOPLE -> js/content.js people collection -> /about/ roster"
---

<objective>
Adopt the official GFM brand hexes site-wide and remove Yuna from the About roster.

Purpose: Kate delivered the Brand Cheat Sheet and her bios list on 26 Aug
(`.planning/qa/2026-08-26-KATE-EMAIL.md`). Wyatt ruled 27 Aug: adopt the official hexes
outright with no comparison round; fonts stay the free stand-ins; remove Yuna now,
restoreable if Kate says otherwise. This makes the site the clients' actual brand instead of
colors sampled from the printed workbook.

Output: One palette, everywhere — tokens, inline styles, favicons, rgba tints, and the four
site-derived shade tokens re-derived from the new bases so the family doesn't fork. Yuna gone
from PEOPLE. STAMP bumped. Rendered proof in screenshots plus a WCAG contrast report.

Size (rule 3): mechanical but wide — ~37 hex occurrences plus ~20 rgba occurrences across 18
files, one data-entry deletion. What a visitor sees: the same site in the official brand
colors (teal noticeably bluer-green, plum more magenta, mustard brighter), and one fewer name
on About. Leaves undone: the seven bios themselves (separate task), font licensing (Wyatt's
separate decision), converging the workbook's duplicate token block.
</objective>

<context>
Locked rulings (Wyatt, 27 Aug — non-negotiable):
- cream #F4EFE3 → #F5F1E2, teal #1B7F72 → #00887A, navy #123B53 → #003D57,
  plum #7E3A67 → #770061, mustard #E7B54A → #FAB812. Sage #8FBCAD stays. Fonts unchanged.
- Remove Yuna's PEOPLE entry; cite `.planning/qa/2026-08-26-KATE-EMAIL.md` in the commit
  message so it's restoreable.
- Contrast failures are flagged for Wyatt in the SUMMARY, never silently "fixed" by moving a
  ruled hex.

Claude's-discretion choices already made by the planner (document in SUMMARY, do not re-decide):
- The four site-derived chromatic shade tokens are re-derived from the new bases with the same
  arithmetic that produced the old values, otherwise links/hovers keep old-family colors next
  to new-family bases (a drifting fork, CLAUDE.md rule 8):
  --teal-deep  #0f6659 → #006d62   (new teal × 0.8 per channel)
  --teal-bright #17907f → #009a8a  (new teal × 1.13 per channel)
  --navy-deep  #0e2f43 → #003146   (new navy × 0.8 per channel)
  --plum-soft  #8e4a77 → #871071   (new plum + 16 per channel)
- The cream family (--cream-soft #efe9d8, --paper #faf7ee, --white #fffdf7) stays as-is: new
  cream is within 2/channel of old, so the existing values keep their relationships. Lavender,
  slate, ink also unchanged.

Exclusions (hard): /plan/ (client-facing scope doc Kate has the link to) and .planning/
(historical record) are NOT touched. `git diff --name-only` must show neither.

Do not touch GATE_HASH or GATE_KEY in js/gate.js — the sweep is colors only.

Git: repo is on branch `claude/forgiveness-platform-v1-kvyc0t` (tracks origin, clean).
Run `git fetch origin` before trusting any ref (CLAUDE.md rule 14). Commit locally; pushing
is the orchestrator's/Wyatt's call, but the stamp is already bumped for whenever that happens.
Use absolute paths in every command.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Sweep the five old hexes (and every derived form) to the official palette; bump STAMP</name>
  <files>css/site.css, workbook/css/style.css, js/gate.js, js/site.js, 404.html, index.html, about/index.html, join/index.html, groups/index.html, privacy/index.html, my-path/index.html, research/index.html, admin/index.html, accessibility/index.html, contact/index.html, workbooks/index.html, workbook/index.html, .claude/CLAUDE.md</files>
  <action>
    Apply the five base swaps everywhere, preserving each file's existing case (source files
    use lowercase hex; .claude/CLAUDE.md uses uppercase). The complete occurrence inventory,
    verified 27 Aug — line numbers are stable because every replacement is same-length-ish and
    in place:

    BASE HEXES:
    - css/site.css :root — lines 8 (cream), 12 (teal), 15 (navy), 17 (plum), 19 (mustard).
    - workbook/css/style.css :root — lines 5, 8, 11, 13, 15 (same five).
    - js/gate.js GATE_CSS — line 21 (cream background), 26 (navy h1), 30 (teal focus border),
      31 (teal button background), 33 (plum error text); line 50 leaf('#1b7f72') → new teal.
    - js/site.js — line 40 leaf('#1b7f72') → new teal.
    - 404.html — line 8 favicon data-URI (`%231b7f72` → `%2300887a`), 15 (cream body), 18
      (navy h1), 19 (teal .btn), 27 (inline SVG fill teal).
    - workbook/index.html — line 15 favicon data-URI, line 23 inline style color teal.
    - Favicon data-URIs (`fill='%231b7f72'` → `%2300887a`) in: index.html:9, join/index.html:9,
      groups/index.html:9, about/index.html:9, privacy/index.html:9, my-path/index.html:9,
      research/index.html:9, admin/index.html:8, accessibility/index.html:9,
      contact/index.html:9, workbooks/index.html:9.
    - .claude/CLAUDE.md Brand bullet (lines ~119–120): replace the five old hexes with the
      official ones, keep the "sage" value and note it as our derived accent (not in the
      official palette), and replace the trailing "True up against the GFM Brand Cheat Sheet
      when Wyatt adds it to the repo" clause with a note that the official hexes were adopted
      2026-08-27 from `.planning/brand/Forgiveness_Brand_Cheat_Sheet.pdf` (fonts remain the
      free stand-ins pending licensing).

    RGBA TINTS — convert the rgb triplet, keep every alpha exactly as found:
    - rgba(18, 59, 83, α) → rgba(0, 61, 87, α): css/site.css lines 24, 33, 149;
      workbook/css/style.css lines 20, 28, 331, 432, 674; js/gate.js line 29 (this one is the
      no-space form `rgba(18,59,83,0.14)` — match it as written).
    - rgba(27, 127, 114, α) → rgba(0, 136, 122, α): css/site.css lines 95, 132, 284;
      workbook/css/style.css lines 109, 313, 361, 457 (457 has TWO occurrences).
    - rgba(126, 58, 103, α) → rgba(119, 0, 97, α): css/site.css lines 225, 241;
      workbook/css/style.css lines 204, 324, 403, 476.
    - rgba(231, 181, 74, α) → rgba(250, 184, 18, α): css/site.css line 287 (TWO occurrences).
    - Cream's rgb form rgba(244, 239, 227, …) has zero occurrences today; the Task-1 grep gate
      still covers it in case one is found mid-edit.

    DERIVED SHADE TOKENS (planner-locked values, rationale in <context>):
    - #0f6659 → #006d62: css/site.css:13, workbook/css/style.css:9, js/gate.js:25.
    - #17907f → #009a8a: css/site.css:14, workbook/css/style.css:10.
    - #0e2f43 → #003146: css/site.css:16, workbook/css/style.css:12.
    - #8e4a77 → #871071: css/site.css:18, workbook/css/style.css:14.

    COMMENT ACCURACY: both stylesheets' header comments say the palette was "sampled from the
    printed workbook" — update both (css/site.css lines 1–3, workbook/css/style.css lines 1–2)
    to say the hexes are the official GFM Brand Cheat Sheet palette (adopted 2026-08-27), with
    sage/lavender/slate as site-derived accents. Do NOT write any old hex value into a comment
    anywhere ("was #..." annotations are forbidden — the straggler grep in Task 3 must pass on
    content, not survive on comment exceptions).

    STAMP: js/site.js line 11 — change 'GFM-V1 · 2026-08-25b' to 'GFM-V1 · 2026-08-27a'
    (current on-disk value is 2026-08-25b; new date, letter restarts, per convention).

    Leave untouched: sage/lavender/slate/ink values, the cream family tokens (--cream-soft,
    --paper, --white and gate.js's inline #fffdf7), GATE_HASH/GATE_KEY, everything under
    /plan/ and .planning/, and all font declarations.

    Commit (files above only):
    "style: adopt official GFM brand hexes site-wide (Brand Cheat Sheet; Wyatt ruling 27 Aug —
    see .planning/qa/2026-08-26-KATE-EMAIL.md)"
  </action>
  <verify>
    <automated>cd /home/user/forgiveness-platform && ! grep -rniE '(1b7f72|123b53|7e3a67|e7b54a|f4efe3|0f6659|17907f|0e2f43|8e4a77)' --include='*.css' --include='*.js' --include='*.html' . --exclude-dir=plan --exclude-dir=.planning --exclude-dir=.git && ! grep -rnE 'rgba?\(\s*(244\s*,\s*239\s*,\s*227|27\s*,\s*127\s*,\s*114|18\s*,\s*59\s*,\s*83|126\s*,\s*58\s*,\s*103|231\s*,\s*181\s*,\s*74)' --include='*.css' --include='*.js' --include='*.html' . --exclude-dir=plan --exclude-dir=.planning --exclude-dir=.git && grep -q "2026-08-27a" js/site.js && grep -q "8fbcad" css/site.css && grep -q "8fbcad" workbook/css/style.css && ! git diff HEAD~1 --name-only | grep -E '^(plan/|\.planning/)'</automated>
  </verify>
  <done>Zero occurrences of the five old hexes, their rgb/rgba triplets, or the four old derived shades anywhere outside /plan/, .planning/, .git; sage #8fbcad still present in both :root blocks; GATE_HASH line unchanged; STAMP reads GFM-V1 · 2026-08-27a; committed with the email file cited.</done>
</task>

<task type="auto">
  <name>Task 2: Remove Yuna from PEOPLE; keep the comment truthful</name>
  <files>js/data.js</files>
  <action>
    Delete the Yuna entry at js/data.js line 274:
    { initials: 'Y', name: 'Yuna', role: 'Forgiveness Group leader', line: '' },

    The block comment above it (lines 270–272, "Added on Kate's ruling (25 Aug)...") still
    truthfully describes Cooper's entry, which STAYS — but reword it to the singular and add
    the current ruling, e.g.: Cooper added on Kate's 25 Aug ruling; his full bio arrives with
    the About-bios task (Kate's 26 Aug email). Yuna was removed per that same email's
    seven-person bios list — restoreable if Kate says otherwise. Keep it to 2–3 comment lines.
    Do not touch any other PEOPLE entry — the bios/ordering task is separate work.

    Commit (js/data.js only):
    "content(about): remove Yuna from the roster per Kate's 26 Aug bios list — restoreable if
    she says otherwise (see .planning/qa/2026-08-26-KATE-EMAIL.md)"
  </action>
  <verify>
    <automated>cd /home/user/forgiveness-platform && ! grep -q "Yuna" js/data.js && node --input-type=module -e "const m = await import('file:///home/user/forgiveness-platform/js/data.js'); if (m.PEOPLE.length !== 5) throw new Error('PEOPLE length ' + m.PEOPLE.length); if (m.PEOPLE.some(p => p.name === 'Yuna')) throw new Error('Yuna present'); console.log('PEOPLE ok: 5 entries');"</automated>
  </verify>
  <done>js/data.js exports PEOPLE with exactly 5 entries (VanderWeele, Cowden, Jackson-Meyer, Worthington, Cooper), no Yuna; module still imports cleanly; committed citing the email file.</done>
</task>

<task type="auto">
  <name>Task 3: Rendered verification — screenshots read, gate proven, WCAG contrast audit reported</name>
  <files>(no repo files — scratchpad script + screenshots; SUMMARY.md at the end)</files>
  <action>
    Serve and drive (parameters are hard-won from STATE.md — do not improvise):
    - `python3 -m http.server 8080` from /home/user/forgiveness-platform, run in background.
    - Playwright module at
      /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/node_modules/playwright
      (write the driver script in the scratchpad so that require/import resolves it there).
      Launch chromium with executablePath '/opt/pw-browsers/chromium' (symlink to the chrome
      binary — confirmed) and args ['--no-sandbox']. localhost needs no proxy — do not set one.

    GATE PROOF (functional check of the edited js/gate.js — do this in the first, clean
    context, desktop 1280×900): load http://localhost:8080/, screenshot the gate card (new
    teal button, new navy heading, new cream background), fill input #gatePw with `reach1`,
    submit the form, wait for `html[data-shell-ready]` AND `.site-head` to exist. If the shell
    appears, the gate hash path survived the style edits.

    SCREENSHOTS — fullPage, at desktop 1280×900 and mobile 390×844 (for contexts after the
    first, pre-unlock via addInitScript setting localStorage 'gfm.gate.v2' = 'open'):
    /, /groups/, /about/, /workbook/ — 8 page screenshots plus the gate shot.
    READ every screenshot (CLAUDE.md rule 4/6 — the grep proves text, only the picture proves
    rendering): confirm the new palette is actually painted (teal buttons/nav pill are the
    bluer-green #00887A, navy sections deeper, plum kickers more magenta, mustard notices
    brighter), no layout breakage, no element still visibly old-teal, and the About roster
    shows five cards with no Yuna, on both widths.

    CONTRAST AUDIT — compute WCAG 2.1 contrast ratios (relative-luminance formula) with a
    small node script in the scratchpad for these actual pairings, and put the table in the
    SUMMARY with pass/fail against 4.5:1 (normal text) and 3:1 (large text / UI):
    1. #ffffff on #00887a — .btn--primary, active nav pill, gate Enter button, workbook
       primary buttons. Planner pre-computed ≈4.4:1 — EXPECTED to fail 4.5:1 (old teal was
       ≈4.9:1). REPORT it for Wyatt; do not change any hex.
    2. #003d57 on #f5f1e2 and on #fffdf7 (headings/body on cream/card white) — expect ~10:1.
    3. #770061 on #fffdf7 and #f5f1e2 (kickers) — expect ~9:1.
    4. #ffffff / #f2f4f0 on #003d57 (.section--navy, footer) — expect ~11:1.
    5. #006d62 on #f5f1e2 (links via --teal-deep) — expect ~5.5:1.
    6. #fab812 vs #f5f1e2 (the :focus-visible outline, non-text 3:1) — expect ~1.6:1 FAIL;
       note it as pre-existing in kind (old mustard also failed) — still list it.
    7. #003d57 on #fab812 (REACH "E" letter, large) and #8fbcad on #003d57 (navy-section
       links) — expect passes; confirm.
    Any pairing under threshold goes in the SUMMARY as a flagged item for Wyatt — surfacing,
    not settling (CLAUDE.md client-work rule). Do NOT alter a ruled hex to fix contrast.

    STRAGGLER GATE: re-run the Task-1 grep pair (hex + rgb forms, same exclusions) as the
    final check after all edits.

    CLEANUP (CLAUDE.md rule 16): close the browser in the script; then
    `pkill -f "http.server" ; pkill -f "pw-browsers"` before finishing.

    Write the SUMMARY at
    .planning/quick/260827-vfk-brand-hexes-official-and-remove-yuna/260827-vfk-SUMMARY.md:
    what changed (plain English + size), the contrast table with flagged items, the
    planner-discretion notes (four re-derived shade tokens with their values; cream family
    left as-is), the workbook token-block duplication flagged for a future converge, and
    screenshot paths. Note that push is left to Wyatt/orchestrator; stamp already bumped.
  </action>
  <verify>
    <automated>cd /home/user/forgiveness-platform && ! grep -rniE '(1b7f72|123b53|7e3a67|e7b54a|f4efe3|0f6659|17907f|0e2f43|8e4a77)' --include='*.css' --include='*.js' --include='*.html' . --exclude-dir=plan --exclude-dir=.planning --exclude-dir=.git && [ "$(ls /tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/*.png 2>/dev/null | wc -l)" -ge 9 ] && ! pgrep -f "http.server" && ! pgrep -f "pw-browsers"</automated>
    <human-check>Wyatt eyeballs the screenshots / live page and rules on the flagged white-on-teal ≈4.4:1 contrast finding.</human-check>
  </verify>
  <done>Gate proven to unlock with reach1 post-edit; 9 screenshots taken AND read (gate + 4 pages × 2 widths) with the new palette visibly painted and five-person About roster; contrast table in SUMMARY with the white-on-teal failure (and any others) flagged for Wyatt, no hex altered in response; straggler grep clean; server and browser dead; SUMMARY written.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| (none new) | Static-site color/data edits; no new input paths, no package installs (Playwright pre-existing in scratchpad), no secrets. Repo is public — nothing added that couldn't be printed. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-vfk-01 | Tampering | js/gate.js GATE_HASH/GATE_KEY | low | mitigate | Sweep explicitly forbidden from touching lines 9–10; Task 3 functionally proves reach1 still unlocks |
| T-vfk-02 | Information Disclosure | /plan/ client doc | low | mitigate | Hard exclusion + Task-1 git-diff gate proving no /plan/ or .planning/ file changed |
</threat_model>

<verification>
- Task-level automated gates above (grep straggler sweep is the phase-wide invariant).
- Rendered: 9 screenshots taken and READ, desktop + mobile, gate included.
- Functional: gate unlocks with reach1 after edits.
- Record: /plan/ and .planning/ untouched per git diff; two commits, each citing
  .planning/qa/2026-08-26-KATE-EMAIL.md.
</verification>

<success_criteria>
- Repo-wide zero occurrences (outside /plan/, .planning/, .git) of the five old hexes, their
  rgb/rgba forms, and the four old derived shades — case-insensitive.
- Official hexes live in BOTH token files, gate.js, 404.html, all 13 favicons, and the one
  inline style; sage unchanged; fonts unchanged; STAMP = GFM-V1 · 2026-08-27a.
- PEOPLE exports 5 entries, no Yuna; About renders five cards.
- Contrast findings (expected: white-on-teal ≈4.4:1) reported in SUMMARY for Wyatt, with no
  ruled hex silently altered.
- No orphaned server or browser processes.
</success_criteria>

<output>
Create `.planning/quick/260827-vfk-brand-hexes-official-and-remove-yuna/260827-vfk-SUMMARY.md` when done.
</output>
