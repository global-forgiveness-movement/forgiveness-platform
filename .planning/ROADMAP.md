# Roadmap: GFM Platform V1.0

## Overview

Four phases take the repo from a single encrypted scope doc to a clickable, password-gated
platform: first the foundation everyone stands on (gate, design system, one shared shell), then
the six public pages with all client feedback applied, then working accounts and the member area,
and finally the interactive workbook folded in with progress-only sync. Each phase ends with
something Wyatt can open in a browser and screenshot.

## Phases

- [x] **Phase 1: Foundation** - Password gate, design system, shared shell, scope doc moved to /plan
- [x] **Phase 2: Public pages** - Home, Workbooks, Research, Groups, About, Contact with client feedback applied
- [x] **Phase 3: Accounts & member area** - Firebase auth (with local demo mode), My Path, self-service deletion
- [x] **Phase 4: Interactive workbook** - Workbook at /workbook, native styling, progress-only sync

## Phase Details

### Phase 1: Foundation
**Goal**: A gated, branded, empty-but-real site: anyone with the password walks through the gate into a styled shell; the scope doc keeps working at /plan.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: GATE-01, GATE-02, GATE-03, SHELL-01, SHELL-02, SHELL-03
**Success Criteria** (what must be TRUE):
  1. Visiting any page without the password shows one calm gate screen; entering `reach` unlocks the whole site in that browser
  2. The scope plan opens at /plan/ exactly as it did at the root (its own password screen intact)
  3. Every page shares the same header, nav, and footer from a single component file — editing nav once changes it everywhere
  4. The site reads as the workbook's brand: cream/teal/navy palette, Poppins/Nunito Sans/Sacramento, self-hosted
**Plans**: 2 plans

Plans:
- [x] 01-01: Move scope doc to /plan; build the password gate as a shared include
- [x] 01-02: Design tokens, fonts, shared shell components (header/nav/footer), base layout

### Phase 2: Public pages
**Goal**: All six public pages live with the client's corrections applied — the two-door homepage, groups-first video framing, and every CSV wording ruling.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, WB-01, WB-02, WB-03, RES-01, GRP-01, GRP-02, GRP-03, GRP-04, ABT-01, UTIL-01
**Success Criteria** (what must be TRUE):
  1. The homepage offers exactly two doors — "Do it solo" and "Start a group" — and the phrase "start the series" appears nowhere on the site
  2. Trial evidence reads "over 4,500 participants" in "5 relatively high-conflict countries" with unit-labeled effect sizes, in the evidence section rather than the hero stat band
  3. Every workbook edition downloads in every language with no account, and each click records edition + language
  4. The Groups page teaches the clients' own model (solo workbook + periodic discussion), shows both real session breakdowns, and a leader can register a group with the details Kate wants to count
  5. Kate's existing YouTube films play in every video slot
**Plans**: 3 plans

Plans:
- [x] 02-01: Homepage
- [x] 02-02: Workbooks + Research pages
- [x] 02-03: Groups, About, Contact, privacy/accessibility/404

### Phase 3: Accounts & member area
**Goal**: A visitor can create an account, sign in, and land in a member area that knows them — running against Firebase when configured, and against a labeled local demo mode when not.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: ACCT-01, ACCT-02, ACCT-03, ACCT-04, ACCT-05
**Success Criteria** (what must be TRUE):
  1. Create account / sign in / sign out / password reset all work on one-screen forms (email+password and Google)
  2. The join page says why the account exists and what is never collected; marketing consent starts unticked
  3. Signed in, My Path shows workbook progress, both series shells, and downloads
  4. A user can delete their account and everything it stores, themselves
  5. With no Firebase config committed, the same flows work in a visibly-labeled demo mode
**Plans**: 2 plans

Plans:
- [x] 03-01: Auth layer (Firebase + demo fallback), join/sign-in screens
- [x] 03-02: My Path member area, series shells, account settings + deletion

### Phase 4: Interactive workbook
**Goal**: The interactive workbook lives at /workbook feeling native to the platform, and signed-in users keep their place across devices without their writing ever leaving the device.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: IWB-01, IWB-02, IWB-03
**Success Criteria** (what must be TRUE):
  1. /workbook/ serves the full 12-lesson interactive workbook, visually of a piece with the platform
  2. Signed out, it behaves exactly as the standalone does today — everything local
  3. Signed in, position and completion sync (visible in My Path); no answer text is ever transmitted, and the privacy copy states the distinction accurately
**Plans**: 2 plans

Plans:
- [x] 04-01: Copy workbook in, integrate shell/styling, platform links
- [x] 04-02: Progress-only sync + My Path progress card + privacy copy update

## Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| 1. Foundation | Complete | 2026-08-21 |
| 2. Public pages | Complete | 2026-08-21 |
| 3. Accounts & member area | Complete | 2026-08-21 |
| 4. Interactive workbook | Complete | 2026-08-21 |
| 5. CMS | Complete | 2026-08-21 |

### Phase 5: CMS — Kate edits the site (added 2026-08-21)
**Goal**: A completely non-technical editor can change every content list on the site and create whole new block-built pages, instantly, with history — no developer involved.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, CMS-05
**Success Criteria** (what must be TRUE):
  1. Editing a testimonial in /admin changes the homepage on the next load; the previous version is one click away in history
  2. An editor can build a brand-new page from section blocks and open it at its own URL, and optionally see it in the nav
  3. Every form in /admin is generated from the schema — adding a new content type is one schema entry
  4. All flows work in demo mode now and switch to Firestore with the config, unchanged
**Plans**: 2 plans

Plans:
- [x] 05-01: Schema, content merge layer, block renderer, dynamic page routing; site wired through it
- [x] 05-02: /admin editor app — collection forms, page builder, history & restore
