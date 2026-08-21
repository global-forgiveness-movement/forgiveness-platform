# Requirements — GFM Platform V1.0

Source of truth: the Scope & Process Plan (`/plan/index.html`, password `reach`), corrected by
Kate's CSV (17 Aug) and Kate's email (Aug 2026). Where they disagree, the email wins, then the
CSV, then the plan.

## v1 Requirements

### Gate

- [ ] **GATE-01**: Visitor sees a calm password screen before any page content; entering `reach`
      unlocks the whole site in that browser until they clear site data
- [ ] **GATE-02**: The gate is one shared include used by every page — no per-page forks
- [ ] **GATE-03**: The scope plan lives at `/plan/` unchanged (its own AES password screen)

### Shell & identity

- [ ] **SHELL-01**: Every page shares one header (Global Forgiveness Movement / Human Flourishing
      Program at Harvard, per CSV), one nav (Home, Workbooks, Research, Groups, About), one footer
      — rendered from one shared component, written once
- [ ] **SHELL-02**: Design system uses the workbook palette (cream, teal, ink navy, plum, mustard,
      sage) and fonts (Poppins, Nunito Sans, Sacramento), self-hosted
- [ ] **SHELL-03**: Site is responsive mobile-first and keyboard-navigable; WCAG 2.1 AA contrast

### Homepage

- [ ] **HOME-01**: Hero leads with the forgiveness definition; CTAs are the two doors ("Do it
      solo" → Workbooks, "Start a group" → Groups) — no "start the series" anywhere
- [ ] **HOME-02**: Evidence section carries trial numbers ("over 4,500 participants", "5
      relatively high-conflict countries", effect sizes with units) — trial stats live here, not
      in the top stat band (CSV part 2/4)
- [ ] **HOME-03**: Top stat band carries group/program stats: 6–12 people per group, 3- or
      6-session options, 1–1.5 hr meetings, ~10 min of video guidance, 6 languages
- [ ] **HOME-04**: REACH five steps shown with A = "Altruistic gift of forgiveness offered
      freely"; the "forgiveness is not forgetting/excusing/reconciling" line above the fold's end
- [ ] **HOME-05**: Testimonials render from one data file with a per-person `permissionConfirmed`
      flag — names show only when true (Kate is collecting permissions)
- [ ] **HOME-06**: Closing invitation offers exactly: download the workbook / start a Forgiveness
      Group (CSV part 7)
- [ ] **HOME-07**: Homepage embeds a video snippet slot (Kate: shortened current film) — YouTube
      embed now, Vimeo swap later

### Workbooks

- [ ] **WB-01**: All four workbooks (REACH, REACH church edition, RECEIVE, Activity Book)
      downloadable with language selector, no account, "which one is for me" two-question chooser
- [ ] **WB-02**: Download clicks recorded anonymously (edition + language), viewable later
- [ ] **WB-03**: Page offers the interactive workbook as the on-screen way through REACH

### Research

- [ ] **RES-01**: Research page presents the trial with effect sizes, confidence intervals, units,
      the two-week limitation paragraph, and DOI links; publications list; existing research video
      embedded

### Groups

- [ ] **GRP-01**: Groups page teaches the clients' own Forgiveness Group model (workbook done
      solo, group meets to discuss; leader plays one video per session; nobody is asked to share
      their hurt) using Kate's comprehensive description (CSV Q3 answer)
- [ ] **GRP-02**: Both series shown with real session breakdowns from Kate's email (3-session
      secular; 6-session church with Scripture), framed as ways through the tested workbook
- [ ] **GRP-03**: Group registration form captures what Kate wants to count: leader name, email,
      location, group size, which workbook version, which series — stored via Firebase
- [ ] **GRP-04**: "How to run a group" section with the step-by-step and leader-kit placeholder;
      group film + series trailers embedded from YouTube

### About & utility

- [ ] **ABT-01**: About page with mission, the four people, partners, HFP connection
- [ ] **UTIL-01**: Contact page; privacy notice in plain language; accessibility statement; 404

### Accounts & member area

- [ ] **ACCT-01**: Visitor can create a free account (email/password or Google) on one screen,
      sign in, sign out, reset password — Firebase Auth
- [ ] **ACCT-02**: Sign-up page explains why the account exists ("save your place") and what is
      never collected; marketing consent unticked by default
- [ ] **ACCT-03**: Signed-in member area ("My Path") shows workbook progress, the two series
      (shells until video arrives), and their downloads
- [ ] **ACCT-04**: User can delete their account and all its data themselves
- [ ] **ACCT-05**: With no Firebase config present, auth runs in a clearly-labeled local demo mode
      so the clickable build works end to end; flipping to real Firebase is config-only

### Interactive workbook

- [ ] **IWB-01**: The interactive workbook runs at `/workbook/`, restyled only as needed to feel
      native to the platform; its content and engine unchanged
- [ ] **IWB-02**: Signed-in users sync workbook *position and completion only* — what they write
      never leaves the device, and the privacy copy says so accurately
- [ ] **IWB-03**: Signed-out use keeps working exactly as today (localStorage only)

## v2 Requirements

Everything in the scope plan §4 "Not yet" table, unchanged: crisis-resources page, events
listing, newsletter integration, payments/church tier, groups map, org dashboards, validated
surveys (IRB), leader credentials, cohort codes, event registration, book sales — plus Vimeo
integration when files arrive, and leader account types if Kate confirms that model.

## Out of Scope

- Syncing workbook answers — breaks the literal privacy promise; progress-only is the decision
- Interface translation at launch — English UI, six-language workbooks
- Custom domain — GitHub Pages URL until plan §12 Q1 resolves
- Analytics beyond anonymous download counting — nothing tracks identified behavior in V1.0

## Traceability

(Filled by roadmap.)
