---
phase: quick-260828-hif
plan: 01
subsystem: workbooks
tags: [downloads, translations, data-driven, client-content]
requires: []
provides:
  - Five translated REACH workbooks hosted in-repo (assets/workbooks/)
  - Per-language direct-download buttons on /workbooks/ via one applyLang path
affects: [js/data.js, workbooks/index.html, js/site.js]
tech-stack:
  added: []
  patterns:
    - Data-driven download buttons — data.js files map drives href/label/attrs/count-tag through one function
key-files:
  created:
    - assets/workbooks/REACH-Forgiveness-Workbook-Spanish.docx
    - assets/workbooks/REACH-Forgiveness-Workbook-Chinese.docx
    - assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx
    - assets/workbooks/REACH-Forgiveness-Workbook-Indonesian.docx
    - assets/workbooks/REACH-Forgiveness-Workbook-Portuguese.docx
  modified:
    - js/data.js
    - workbooks/index.html
    - js/site.js
decisions:
  - "Ship the five .docx files AS-IS, md5-verified against the content-verified sources — no conversion, no editing (Wyatt ruling 27 Aug)"
  - "en deliberately absent from the files map — English keeps the HFP programme-page fallback exactly as before (no file was delivered for it)"
  - "Portuguese is Portuguese-only despite the source filename's 'Eng-PT-BR' — label and filename stay Portuguese"
metrics:
  duration: ~12 min
  completed: 2026-08-28
actuals:
  tokens: 3200
  tasks: 3
  commits: 2
status: complete
---

# Quick Task 260828-hif: Host Five Translated Workbooks In-Repo Summary

**Five translated REACH workbooks (es/zh/uk/id/pt) now download directly from this site via one data-driven applyLang path; English untouched; downloads still counted per edition+language.**

## What a visitor gets (rule 3)

A visitor on /workbooks/ who picks Español, 中文, Українська, Bahasa Indonesia, or
Português (Brasil) on the REACH card now downloads that Word file in one click from this
site — no Discover Forgiveness / HFP detour. Covers 5 of 6 languages on the REACH edition
only. **Left undone:** the English direct link, direct links for the other three editions,
and the Muslim-adapted edition (data slot comment ready for when Kate sends it).

## Task Commits

| Task | Name | Commit |
|------|------|--------|
| 1 | Files into the repo AS-IS (tracer) | 31534de |
| 2 | Per-language downloads, one applyLang path, stamp 2026-08-28c | ac2ea93 |
| 3 | Rendered verification + download/count proof | (verification only — no repo files) |

## NEW VISITOR-FACING COPY — flagged for Wyatt (rule 11)

Every new string a visitor can see, verbatim:

1. **`Download (Word, 4.3 MB)`** — REACH button label with Español selected (size varies
   per language: zh `2.3 MB`, uk `1.2 MB`, id `0.9 MB`, pt `0.9 MB`; format always `Word`).
   This replaces `Download PDF` ONLY when a hosted translation is selected — it states
   format and size honestly because the file is Word, not PDF.
2. **No other visible copy changed.** English (and every other edition's button) still
   reads `Download PDF` and behaves exactly as before. No language names in LANGUAGES
   were changed.

## Findings from document inspection (read-only — files shipped untouched)

**Portuguese — NOT bilingual.** The source filename said "Eng-PT-BR" but the body is
Portuguese-only: opener *"Seu Caminho para o Perdão REACH — Torne-se uma Pessoa Mais
Perdoadora em Menos de Duas Horas… Tradução voluntária para o português do Brasil:
Marconi Fabio Vieira"*. Word counts across the full 75k-char text: "você" ×397,
"perdão" ×217 vs "you" ×0, "and" ×0 (the few "forgiveness" hits are the
evworthington-forgiveness.com resource URL). Label stays **Português (Brasil)**,
filename `REACH-Forgiveness-Workbook-Portuguese.docx`.

**Chinese — body is TRADITIONAL script (open question for Wyatt).** Not just the opener:
Traditional-indicator characters ×2,581 vs Simplified ×504 across the body (and the 504
is inflated by characters shared between scripts). Sample: *"建議用法…此手冊將幫助你寬恕
一個一直困擾你的傷害"* (寬恕/建議/幫助 are Traditional forms). **Question for Wyatt:**
should the language label say 繁體中文 (Traditional Chinese) instead of the current 中文?
A label change is client-facing copy, so it was NOT made. Filename stays `...-Chinese.docx`.

**English:** still points at the HFP programme page — the English file was not among the
delivered five; no URL was invented.

## What was built

- **assets/workbooks/** — five .docx files, 9.7 MB total, each md5-identical to its
  content-verified source (5/5 MATCH at copy time; hashes in commit 31534de's check run).
  All five verified as valid zip containers (.docx = macro-free format by spec, per T-q-02).
- **js/data.js** — `files` map on the `reach` entry keyed by language code (path, format,
  size); `en` deliberately absent so the button falls back to `w.url`; the TODO(wyatt)
  comment rewritten to the current truth; a comment slot inside WORKBOOKS marks where the
  Muslim-adapted edition's entry goes.
- **workbooks/index.html** — ONE `applyLang(id, code)` function sets href
  (`../` + path for hosted, `w.url` fallback), download-vs-`target=_blank rel=noopener`
  attributes, visible label, and `data-download="${id}:${code}"` — called for every card's
  initial render (code 'en') AND from the delegated change listener, whose body is now just
  that call. The card template keeps one button; no per-language markup fork (rule 8).
- **js/site.js** — STAMP `'GFM-V1 · 2026-08-28c'`. `watchDownloads()`/`recordDownload`
  untouched.

## Verification (Task 3 — looked at rendered, rules 4/6)

**Served-file check:** `curl -sI` on the Ukrainian file over localhost → HTTP 200,
Content-Length exactly **1270987**, Content-Type
`application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

**Screenshots (taken AND read):**

| Path | What it shows |
|---|---|
| `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/wb-1280-default.png` | Full /workbooks/ at 1280px, English default: REACH card shows the language select ("English") beside a "Download PDF" button, same as before this task; church/receive/activity cards unchanged; footer stamp reads GFM-V1 · 2026-08-28c |
| `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/wb-390-default.png` | Same page at 390px: select and button stack vertically in the dl-row, no horizontal overflow, gate not shown (pre-opened), everything legible |
| `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/wb-1280-ukrainian.png` | 1280px with Українська selected: button now reads "Download (Word, 1.2 MB)" and sits cleanly beside the select — no wrap, no clipping; everything else identical to default |
| `/tmp/claude-0/-home-user/142384f0-2593-5d9f-97de-b6ce63376dfa/scratchpad/wb-390-ukrainian.png` | 390px with Українська selected (extra shot for the longer-label risk): the "Download (Word, 1.2 MB)" label fits on one line in the stacked row, no layout breakage |

**Download + counting end-to-end (Playwright, real click):**
- Button state with uk selected: href `…/assets/workbooks/REACH-Forgiveness-Workbook-Ukrainian.docx`,
  `download` attribute present, no `target`, tag `reach:uk`
- English state re-checked first: href is the HFP programme page, `target="_blank"`,
  label `Download PDF`, tag `reach:en` — unchanged behavior confirmed rendered
- Download event: suggested filename `REACH-Forgiveness-Workbook-Ukrainian.docx`, saved
  file exactly **1,270,987 bytes**
- Demo store: `localStorage['gfm.store.v1']` = `{"downloads":{"reach_uk":{"count":1}}}` —
  `recordDownload('reach:uk')` fired and counted

**Cleanup (rule 16):** http.server killed, browser closed by the script; final
`pgrep` for http.server/chromium matched nothing; localhost:8765 confirmed down.

## Deviations from Plan

None - plan executed exactly as written. (One extra screenshot beyond the three planned:
390px with Ukrainian selected, because the longer label's mobile fit was the named risk.)

## Rulings used (rule 10)

Kate's 26 Aug email §2 (Ev approved posting the translations) → Wyatt's 27 Aug ruling
(host in-repo, ship AS-IS, no conversion) → partially supersedes 25 Aug ruling 1 for these
five editions (links now verified by construction).

## Self-Check: PASSED

- All 5 .docx files exist in assets/workbooks/ — FOUND
- js/data.js, workbooks/index.html, js/site.js modified — FOUND
- Commit 31534de — FOUND; Commit ac2ea93 — FOUND
- Four wb-*.png screenshots on disk — FOUND
