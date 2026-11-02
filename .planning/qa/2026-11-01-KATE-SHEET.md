# Kate's decisions sheet — 1 Nov 2026

Source: Google Sheet `1V6IaOxiVNuSUknFCKM8geHhgv0zlwJCapvfNcbUQ1UU`, tab "Items"
("GFM site review: Kate and Richard's decisions"). Every vote is Kate's; Richard's
columns are empty. Wyatt answered the clarifying questions in the handoff brief.

## Dates and money

- **Done by Wed 4 Nov** (Boston). Changes allowed until Thu 5 Nov, kept minimal after the 4th.
- Cooper's group starts **Tue 3 Nov**; Richard's first group meets **Sat 7 Nov**.
- The **3 Nov meeting happens no matter what.**
- After 3 Nov this phase ends and **Wyatt invoices Kate and Sophie.**
- A **fine-tuning-v1 meeting in mid/late January** (fee quoted then), then **6–9 months in the field.**

## Rulings carried out (branch `claude/kate-sheet-nov1`, awaiting Wyatt's OK before `main`)

| | Ruling | Where |
|---|---|---|
| A | Unticking meeting N unticks every later meeting; ticking N ticks every earlier step; nothing locks. A meeting whose time has passed stays unticked if unticked after it ended. Facilitators preview every meeting's film without ticking; members unchanged. | `js/group-engine.js` (`applyGroupAction`, `gatesDone`, `CAN.preview`) |
| B | Research: the "Tested at Harvard" boxes and bars removed (sheet row 3). `/home2` keeps them. | `research/index.html` |
| C | Church edition: Kate's "who made it" paragraph on the Workbooks card and the Groups church series, from one place; plus a line telling leaders to read the whole workbook first. | `WORKBOOKS.church.about` in `js/data.js` |
| D | Both PDF editions: "For anyone, on your own or in a group." | `workbooks/index.html` |
| E | Nothing added: Kate's saved edits on Home ("to forgive a specific hurt") and Workbooks ("Use the workbook to forgive a specific hurt in your life") already say it; the church line about Scripture is in C. | — |
| F | Interactive workbook welcome: "You'll see how you changed". | `workbook/js/app.js` |
| G | Third Home door's button: "I have a code". | `index.html` |
| H | Expected group size is required; Skip removed. | `js/group-create.js` |
| I | /admin → Accounts: "Meetings held" ("2 of 3") in the table and spreadsheet, counted by the engine's `meetingsHeld`. | `js/groups.js`, `admin/index.html` |
| J | Older readers, narrow pass: darker quiet text, 44px tap targets, tokens only. | `css/site.css` |
| K | "Where to go next" cards are the `workbooks` list in /admin, with add-a-row; Kate adds a resource with a name, a line and a link. | `js/content.js` `workbookRows`, `js/content-schema.js` |

## Not doing (decided)

- Notes for facilitators or participants: **January**. The meeting card stays simple.
- Piece 4 (Listen and reading settings): v2. Pictures in the editor, the emails/money line, a
  simpler-reading version, Pauline's lines: January. PDF blank pages: Kate fixes them in her next edition.
- Denied: Piece 3, Piece 6, Piece 8, the code box first on My Path, a "Download" button in the
  Home hero, the "does not mean" definition.
- Already done: Glen's and Micah's photos (`650d0d0`), the Calendly and speaker links on Contact.

## Still open

- **Richard hasn't voted.** He needs to confirm the depression and anxiety bars (6 vs 8, 6 vs 7).
- Kate hasn't voted on the four "New since Oct 27" rows, which carry new wording: for the **3 Nov agenda**.

## Follow-ups, 2 Nov (Wyatt)

- Pushed live on Wyatt's "push live now" (build `2026-11-02a`). The site serves at globalforgiveness.org.
- The interactive workbook's welcome no longer says "No account is needed". It now says "Your free
  account remembers only how far you've gotten — never a word you write." (true to `workbook/bridge.js`
  and `js/progress-sync.js`).
- My Path: a new group's "Tell us about your group" sits **above** "Next · Plan your meetings" on every
  screen, full width. This replaces "beside its code" (Richard, 28 Sep), which squeezed the meeting dates
  into a narrow column on wide screens.
