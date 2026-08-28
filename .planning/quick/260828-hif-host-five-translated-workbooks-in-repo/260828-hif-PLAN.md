---
phase: quick-260828-hif
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - assets/workbooks/REACH-Forgiveness-Workbook-Spanish.docx
  - assets/workbooks/REACH-Forgiveness-Workbook-Chinese.docx
  - assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx
  - assets/workbooks/REACH-Forgiveness-Workbook-Indonesian.docx
  - assets/workbooks/REACH-Forgiveness-Workbook-Portuguese.docx
  - js/data.js
  - workbooks/index.html
  - js/site.js
autonomous: true
requirements: [KATE-260826-S2-translated-workbooks]
estimate:
  tokens: 45000
  raw_tokens: 45000
  tasks: 3
  confidence: low
must_haves:
  truths:
    - "A visitor on /workbooks/ who picks Español, 中文, Українська, Bahasa Indonesia, or Português on the REACH card downloads that Word file directly from this site — no Discover Forgiveness / HFP detour (Kate 26 Aug email §2; Wyatt's 27 Aug ruling: host in-repo; replaces the 25 Aug ruling-1 landing-page fallback for these five)"
    - "English keeps its current link exactly (the HFP programme page) — the English file was NOT among the delivered five; no invented URL"
    - "The download button states format and size honestly for the translated files (Word document, size in MB), in the site's calm register; every new visitor-facing string is flagged in the SUMMARY for Wyatt (rule 11)"
    - "recordDownload still counts edition + language for the new direct links (the click still lands on an a[data-download] with the current edition:lang tag)"
    - "ONE rendering path: the same card template and one language-apply function serve all six languages including English — no per-language markup fork (rule 8)"
    - "The five .docx files in the repo are byte-identical to the verified sources — shipped AS-IS, no conversion, no editing (Wyatt's explicit ruling)"
  artifacts:
    - "assets/workbooks/*.docx — five files, ~9.7 MB total"
    - "js/data.js — per-language file data on the REACH entry + Muslim-adapted-edition data slot comment"
    - "workbooks/index.html — one applyLang path driving href/label/count-tag"
    - "js/site.js — STAMP 'GFM-V1 · 2026-08-28c'"
  key_links:
    - "select change → applyLang → button href + label + data-download tag (all three from the same data, same function as initial render)"
    - "button click → site.js watchDownloads → recordDownload('reach:<lang>') → store"
    - "data.js reach.files map → rendered button (data drives markup, not the reverse)"
---

<objective>
Host the five translated REACH workbooks (Spanish, Chinese, Ukrainian, Indonesian, Portuguese)
in this repo and give the workbooks page real per-language direct downloads.

Purpose: Kate's 26 Aug email §2 — Ev approved posting the translations; Wyatt ruled 27 Aug:
host in-repo, ship the Word files AS-IS, no conversion. This partially closes the
TODO(wyatt) at js/data.js:151 and, for these five editions, resolves 25 Aug ruling 1
("an unverified deep link that 404s is worse than a landing page that works") — the files
are now ours, so the links are verified by construction.

Output: five .docx files under assets/workbooks/, data-driven per-language download buttons
on /workbooks/, stamp 2026-08-28c, SUMMARY flagging all new copy for Wyatt.

Size (rule 3): a visitor picking one of five languages now gets the workbook in one click
instead of being sent to a third-party page to hunt for it. Covers 5 of 6 languages on the
REACH edition only; leaves undone: the English direct link, the other three editions'
direct links, and the Muslim-adapted edition (Kate sends it later — data slot left ready).
</objective>

<execution_context>
@$HOME/.claude/gsd-core/workflows/execute-plan.md
@$HOME/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/qa/2026-08-26-KATE-EMAIL.md
@.planning/qa/2026-08-25-CALL-RULINGS.md
@js/data.js
@workbooks/index.html
@js/metrics.js
@js/site.js
</context>

<interfaces>
Current mechanics the tasks build on (verified against disk 2026-08-28):

- `js/data.js` — `LANGUAGES` is `[code, name]` pairs (en/es/zh/uk/id/pt); `WORKBOOKS[0]`
  (id `reach`) has `languages: true` and `url: HFH` (the HFP programme landing page).
  The TODO(wyatt) comment sits at ~line 147-154.
- `workbooks/index.html` inline module — `card(w)` renders one button
  `<a class="btn btn--primary" href="${w.url}" data-download="${w.id}:en" target="_blank" rel="noopener">Download PDF</a>`;
  a delegated `change` listener updates ONLY `btn.dataset.download` on language select —
  the href and label never change today. That listener is what applyLang replaces.
- `js/site.js` — `STAMP = 'GFM-V1 · 2026-08-28b'` (line 11); `watchDownloads()` (line ~134)
  is a delegated click listener on `a[data-download]` → `recordDownload(tag)`. It needs NO
  change — it fires regardless of href.
- `js/metrics.js` — `recordDownload(tag)` → `store.increment('downloads', tag.replaceAll(':','_'), 'count')`;
  store is localStorage-backed in demo mode (no Firebase config committed).
- Gate: `js/gate.js` — headless unlock is `localStorage.setItem('gfm.gate.v2', 'open')`
  before page load (or type `reach1`).

Source files, ALREADY DOWNLOADED and content-verified (each opens with the REACH title in
its language), at `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/workbooks/`:

| source | bytes | label size | target filename (assets/workbooks/) |
|---|---|---|---|
| spanish.docx | 4,537,779 | 4.3 MB | REACH-Forgiveness-Workbook-Spanish.docx |
| mandarin.docx | 2,389,441 | 2.3 MB | REACH-Forgiveness-Workbook-Chinese.docx |
| ukrainian.docx | 1,270,987 | 1.2 MB | REACH-Forgiveness-Workbook-Ukrainian.docx |
| indonesian.docx | 969,438 | 0.9 MB | REACH-Forgiveness-Workbook-Indonesian.docx |
| portuguese.docx | 953,837 | 0.9 MB | REACH-Forgiveness-Workbook-Portuguese.docx |

All five are `Microsoft Word 2007+` (.docx — cannot carry macros; .docm would).
Portuguese source filename said "Eng-PT-BR" → may be bilingual; Task 1 checks.
Chinese opener 建議用法 is Traditional script → Task 1 checks which script the body uses.
</interfaces>

<tasks>

<task type="tracer">
  <name>Task 1: Files into the repo AS-IS, with truthful names and labels settled</name>
  <files>assets/workbooks/REACH-Forgiveness-Workbook-Spanish.docx, assets/workbooks/REACH-Forgiveness-Workbook-Chinese.docx, assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx, assets/workbooks/REACH-Forgiveness-Workbook-Indonesian.docx, assets/workbooks/REACH-Forgiveness-Workbook-Portuguese.docx</files>
  <action>
    First, `git fetch origin` and confirm the working tree is clean (rule 14).

    Inspect two documents before naming anything (read-only — the files themselves are
    NEVER modified; Wyatt's ruling is AS-IS, no conversion, no editing):

    1. Portuguese: `unzip -p .../portuguese.docx word/document.xml` and look for
       substantial parallel English text (the source filename said "Eng-PT-BR"). If it is
       a bilingual English/Portuguese document, the visitor-facing language label becomes
       "English / Português (Brasil)" and the filename
       `REACH-Forgiveness-Workbook-English-Portuguese.docx`; if Portuguese-only, keep
       "Português (Brasil)" and `REACH-Forgiveness-Workbook-Portuguese.docx`. Record what
       was found (with a quoted sample) in the SUMMARY.
    2. Chinese: same extraction; determine whether the body is Traditional or Simplified
       (the opener 建議用法 is Traditional). Do NOT change the "中文" label yourself —
       record the finding in the SUMMARY as a flagged question for Wyatt (a label change
       is client-facing copy, rule 11). Keep the filename `...-Chinese.docx` either way.

    Then `mkdir -p /home/user/forgiveness-platform/assets/workbooks` and copy all five
    files from the scratchpad to their target names (table in <interfaces>). Verify
    byte-identity of every copy against its source (`cksum` or `md5sum` pair-by-pair) —
    these are the client-approved artifacts and must ship untouched.

    Commit the five files: `content(workbooks): host five translated REACH workbooks in-repo, as-is (Kate 26 Aug email §2; Ev's permission; Wyatt ruling 27 Aug)`.
  </action>
  <verify>
    <automated>cd /home/user/forgiveness-platform && ls -la assets/workbooks/ && for f in assets/workbooks/*.docx; do unzip -l "$f" >/dev/null && echo "OK $f"; done && du -sh assets/workbooks/</automated>
    Plus: md5sums of repo copies match scratchpad sources (5/5); total ~9.7 MB.
  </verify>
  <done>Five .docx files exist under assets/workbooks/ with clean descriptive names, each byte-identical to its verified source; Portuguese structure and Chinese script findings recorded for the SUMMARY; committed.</done>
</task>

<task type="auto">
  <name>Task 2: Wire per-language downloads through ONE render path; bump the stamp</name>
  <files>js/data.js, workbooks/index.html, js/site.js</files>
  <action>
    **js/data.js** — extend the data, not the markup (rule 8):

    1. On the `reach` entry in WORKBOOKS, add a `files` map keyed by language code, one
       entry per hosted translation, e.g.
       `files: { es: { path: 'assets/workbooks/REACH-Forgiveness-Workbook-Spanish.docx', format: 'Word', size: '4.3 MB' }, ... }`
       for es, zh, uk, id, pt (sizes from the table in <interfaces>; pt path/label per
       Task 1's finding). `en` is deliberately ABSENT from the map — the English file was
       not among the delivered five; its absence means the button falls back to `w.url`
       (the HFP programme page), exactly as today. Paths are site-root-relative strings.
    2. If Task 1 found the Portuguese document bilingual, update the pt entry in
       LANGUAGES to the truthful name; otherwise leave LANGUAGES untouched.
    3. Rewrite the TODO(wyatt) comment above LANGUAGES to tell the current truth: the five
       REACH translations are now hosted in-repo (Kate's 26 Aug email §2, Ev's
       permission; Wyatt ruling 27 Aug — as-is, no conversion), which resolves the 25 Aug
       ruling-1 deep-link concern for those five; still open: the English direct link and
       the other three editions' direct URLs. Keep the "counted per edition + language"
       sentence.
    4. Add a data-shaped slot for the coming Muslim-adapted edition: a short comment
       inside WORKBOOKS marking where its entry goes when Kate sends the final version
       (her 26 Aug email §2). Comment only — no visible placeholder, no card renders.

    **workbooks/index.html** — converge, don't fork (rule 8): write ONE function
    `applyLang(id, code)` that reads the edition from WORKBOOKS and, from
    `w.files?.[code]`, sets on the card's button ALL of: (a) `href` — `'../' + path` for a
    hosted file (matching the page's existing '../' link convention so it works on the
    github.io project path and a future custom domain), or `w.url` when no file exists;
    (b) the `download` attribute present for hosted files, and `target="_blank"
    rel="noopener"` only for the external fallback; (c) the visible label — proposed
    strings, to be flagged verbatim in the SUMMARY for Wyatt (rule 11): hosted files
    `Download (Word, 4.3 MB)` (per-language size); fallback keeps the existing
    `Download PDF` unchanged; (d) `data-download="${id}:${code}"` so counting keeps
    working. Call applyLang for the initial render (code 'en') AND from the existing
    delegated `change` listener — delete the listener's current one-off
    `btn.dataset.download` line so the listener body is just the applyLang call. The
    `card()` template itself keeps one button; no per-language markup.

    **js/site.js** — STAMP → `'GFM-V1 · 2026-08-28c'`. `watchDownloads()` and
    `recordDownload` are untouched.

    Commit: `feat(workbooks): per-language direct downloads for five hosted translations, one applyLang path; stamp 2026-08-28c`.
  </action>
  <verify>
    <automated>cd /home/user/forgiveness-platform && node --check js/data.js && node -e "import('./js/data.js').then(m => { const r = m.WORKBOOKS.find(w => w.id === 'reach'); const langs = Object.keys(r.files); if (langs.sort().join() !== ['es','id','pt','uk','zh'].sort().join()) throw new Error('files map wrong: ' + langs); if (r.files.en) throw new Error('en must be absent'); for (const [c, f] of Object.entries(r.files)) { const fs = require('fs'); if (!fs.existsSync(f.path)) throw new Error('missing file for ' + c + ': ' + f.path); } console.log('files map OK, all five paths exist, en falls back'); })" && grep -n "2026-08-28c" js/site.js</automated>
  </verify>
  <done>Data drives five direct-download buttons through one applyLang path; English falls back to w.url untouched; every referenced file exists on disk; Muslim-edition slot comment present; stamp bumped.</done>
</task>

<task type="auto">
  <name>Task 3: Look at it rendered, prove a download serves and counts, clean up</name>
  <files>(verification only — screenshots to the scratchpad, no repo files)</files>
  <action>
    Serve the repo root: `python3 -m http.server 8765` (background). Playwright from
    `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/node_modules/playwright`,
    `executablePath: '/opt/pw-browsers/chromium'`, `args: ['--no-sandbox']`, no proxy for
    localhost. Pre-open the gate with `addInitScript` setting
    `localStorage.setItem('gfm.gate.v2', 'open')` (password would be `reach1`).

    1. **Served file check:** `curl -sI http://localhost:8765/assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx`
       → HTTP 200, Content-Length exactly 1270987, and note the Content-Type served.
    2. **Screenshots, then READ them (rules 4/6):** /workbooks/ at 1280px and 390px in
       the default (English) state, and a third shot at 1280px after selecting
       Українська on the REACH card — the button must now read the Word/size label.
       Describe what each screenshot actually shows in the SUMMARY; look for layout
       breakage from the longer button label, especially at 390px where the select and
       button share the dl-row.
    3. **Download + counting, end-to-end:** with Українська selected, click the REACH
       download button; capture Playwright's `download` event and assert the suggested
       filename is the Ukrainian .docx and the saved file's size is 1270987 bytes. Then
       read localStorage via page.evaluate and assert the demo store recorded a
       `downloads` increment tagged `reach_uk` (key layout per js/store.js — locate the
       actual key if it differs, and quote what was found).
    4. **Kill everything before replying (rule 16):** close the browser, kill the
       http.server, then confirm with `pgrep -af 'http.server|chromium'` printing nothing.

    No repo changes in this task. If any check fails, fix in Task 1/2's files, re-verify,
    and amend the record honestly.
  </action>
  <verify>
    <automated>curl -sI http://localhost:8765/assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx | head -5</automated>
    Plus: three screenshots taken AND read; download event filename + byte size asserted; reach_uk count found in localStorage; `pgrep -af 'http.server|chromium'` empty at the end.
  </verify>
  <done>The rendered page (desktop + mobile + selected-language state) has been looked at and described; one translated download served with correct bytes and was counted as reach:uk; no server or browser left running.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| repo → visitor's device | .docx files served publicly from GitHub Pages, opened in visitors' word processors |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-q-01 | Tampering | assets/workbooks/*.docx | medium | mitigate | Byte-identity check against the content-verified sources at copy time (Task 1); ship AS-IS per Wyatt's ruling — any future edit is a client decision, not a session's |
| T-q-02 | Elevation | .docx macro surface | low | accept | All five verified `Microsoft Word 2007+` .docx (macro-free format by spec; .docm would be the hazard); extensions must remain .docx |
| T-q-03 | Information Disclosure | public repo hosting | low | accept | The files are meant to be public — Ev's explicit permission (Kate's 26 Aug email §2); nothing secret ships (rule 15) |
</threat_model>

<verification>
- Five .docx in assets/workbooks/, md5-identical to sources, ~9.7 MB total
- data.js files map: exactly {es, zh, uk, id, pt}, en absent, all paths exist on disk
- One applyLang path: initial render and change listener both call it; no second markup branch
- Ukrainian download serves 1,270,987 bytes over localhost and increments reach_uk in the demo store
- Screenshots (1280 default, 390 default, 1280 Ukrainian-selected) taken and read
- STAMP 'GFM-V1 · 2026-08-28c'; no stray processes; working tree committed
</verification>

<success_criteria>
A visitor on /workbooks/ picks any of the five translated languages and gets that Word
file directly from this site, honestly labeled with format and size; English behaves
exactly as before; downloads still count per edition + language; the SUMMARY flags every
new visitor-facing string (button labels, any pt/zh label change) and the Chinese-script
question for Wyatt's approval before he shows Kate.
</success_criteria>

<output>
Create `.planning/quick/260828-hif-host-five-translated-workbooks-in-repo/260828-hif-SUMMARY.md`
when done. It MUST include, beyond the standard template:
- Every new visitor-facing copy string, verbatim, flagged as new (rule 11)
- The Portuguese structure finding (bilingual or not) and what was labeled
- The Chinese script finding (Traditional/Simplified) as an open question for Wyatt
- The note that English still points at the HFP programme page (no file was delivered for it)
- What the three screenshots showed
Also append the quick-task row to STATE.md's "Quick Tasks Completed" table and update the
"Direct PDF URLs" pending todo to reflect partial closure.
</output>
