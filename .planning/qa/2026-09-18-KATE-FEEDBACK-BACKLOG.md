# Backlog — Kate's 18 Sep review

Source of truth: `.planning/qa/2026-09-18-KATE-FEEDBACK.md`. Every row cites the section it
came from. **Rule 10 applies:** where this collides with an earlier ruling, this email wins,
except where the collision is with a *different* client (Richard) — those are flagged ⚠️ and go
to Wyatt, not settled here.

Sizes: **S** = copy or one attribute · **M** = restructure a section · **L** = new flow or page.

---

## A. Ship now — unambiguous, no decision needed (34 items)

### Data layer (`js/data.js`) — one edit, many pages

| # | Item | Size | From |
|---|---|---|---|
| A1 | `TRIAL.countries`: "5 relatively high-conflict countries" → **"6 sites in 5 countries"**; retire "relatively high-conflict" from the file header comment too | S | §1, §5 |
| A2 | Church workbook: drop the **"6 sections"** pill | S | §2 |
| A3 | REACH workbook: add the **"Group ready"** pill | S | §2 |
| A4 | Church edition title → **"REACH Forgiveness Workbook, Adapted for Churches"** (the one place "Forgiveness" was missing) | S | §2 |
| A5 | REACH `languages: true` — label the language control as applying to this edition | S | §2 |
| A6 | New export `GROUP_GUIDELINES` — the eight guidelines, verbatim | S | §3 |
| A7 | Community of Practice → the Zoom registration URL (footer + `EVENTS` + groups page); retires the `TODO(wyatt)` marker | S | §3, §8 |
| A8 | `PEOPLE[].role` → append "Human Flourishing Program, Harvard University" (all but Worthington) | S | §4 |
| A9 | `PEOPLE[].line` — remove from the render (title only, bio on click) | S | §4 |
| A10 | `PUBLICATIONS` — add the two studies from the HFP GFM page | S | §5 |
| A11 | Video captions: name which film belongs in each slot per the frame.io share | S | §1,3,5 |

### Home (`index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A12 | Hero line → *"It can be learned, and we have a do-it-yourself version of one method that has been tested."* | S | §1 |
| A13 | Remove the **"What forgiveness is and is not →"** link (keep the sentence it hangs off) | S | §1 |
| A14 | `.door .script` — make the script headings legible (they are Sacramento at 1.9rem) | S | §1 |
| A15 | "Five steps to REACH forgiveness" → drop the count; state REACH is worked across the 12 lessons | S | §1 |
| A16 | Door copy: the interactive workbook is an account feature (pending Q1) | S | §1 |

### Workbooks (`workbooks/index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A17 | **"Start it now" = PDFs only.** Move the interactive card out of it and below the editions | M | §2 |
| A18 | Interactive card: say plainly that **only progress syncs, never what you write** | S | §2 |
| A19 | State that **the PDF is free and will stay free and available** | S | §2 |
| A20 | Languages section: **"for the REACH Forgiveness Workbook"** | S | §2 |
| A21 | **Delete "Which workbook is right for me?"** entirely | S | §2 |
| A22 | Move the **Start a Forgiveness Group** band above "where to go next" (Kate's own alternative) | M | §2 |

### Groups (`groups/index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A23 | **"lead" → "facilitate"** across the page, and "leader" → "facilitator" site-wide for consistency | M | §3 |
| A24 | Notice box: "skip a section or stop, you should" → **"pause or stop"** | S | §3 |
| A25 | **"Running a group, step by step"** — retire "Step 1–4" language (pairs with A15) | S | §1, §3 |
| A26 | Make the **video-based** nature of both series unmissable | M | §3 |
| A27 | **New section: the eight Forgiveness Group Guidelines** | M | §3 |
| A28 | Sessions ≠ lessons — say the lessons are done **before** each meeting, everywhere the series render | M | §3, §7 |
| A29 | Say what an account gets a facilitator: videos, facilitator guide, interactive workbook | S | §3 |

### About (`about/index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A30 | Rewrite the three belief boxes so heading and content match; *"We believe in a world…"* | S | §4 |
| A31 | **Remove** "See the full program team and research collaborators →" | S | §4 |
| A32 | **Delete** the "carried out with partners in Colombia…Salam Institute" sentence | S | §4 |
| A33 | Partners → a **funding acknowledgement**: Templeton funded the RCT; **Bancel Philanthropies funds the GFM** | S | §4 |

### Research (`research/index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A34 | **Cut the "Under 2 hours" card**; rebalance the remaining two | S | §5 |
| A35 | "More from the program on the Human Flourishing blog" → **"More research from the Human Flourishing Program on the blog"** | S | §5 |

### My Path (`my-path/index.html`) + shell

| # | Item | Size | From |
|---|---|---|---|
| A36 | Show **display name**, not email, as the signed-in identity | S | §7 |
| A37 | **Sign out is hard to find** (Richard) — surface it in the header account slot | M | §7 |
| A38 | Group-code card: say **what happens when you enter a code**, before they enter it | S | §7 |

### Contact (`contact/index.html`)

| # | Item | Size | From |
|---|---|---|---|
| A39 | **Book a meeting with Kate** — Calendly | S | §8 |
| A40 | **Request a GFM speaker** — Google Form | S | §8 |
| A41 | Trim the subject dropdown (pending Q3's sibling — see notes) | S | §8 |

---

## B. Decisions — Wyatt ruled 18 Sep 2026

| # | Question | **Ruling** |
|---|---|---|
| Q1 | Does the interactive workbook go behind an account? | **Soft gate.** It still opens without an account. The entry leads with "create a free account so we can save your place" and keeps a quieter "continue without an account — your place is kept on this device only". Kate's intent is served; nobody is turned away; the PDF promise is untouched. |
| Q2 | Harvard in the site chrome? | **HFP in chrome, Harvard in body only.** Header carries GFM + HFP marks, no Harvard shield — Richard's 25 Aug ruling holds. Bios get the full "Human Flourishing Program, Harvard University" title and About gains the sponsorship block with both links — Kate's factual attribution granted in full. |
| Q3 | Kate's address on the Contact page? | **Form-only stands.** No address in the page. The /admin Messages inbox is hers and replies go to her address. Wyatt's 1 Sep anti-harvesting ruling holds; say this back to Kate. |
| Q4 | Gate "Tell us about your group" behind sign-in? | **Yes — sign in, then the form.** Defensible here in a way the workbook gate is not: a facilitator needs the account anyway for the videos and facilitator materials, so the account is what they came for, not a toll. |

## C. Blocked on assets from the clients

| # | Item | Waiting on |
|---|---|---|
| C1 | Hero film — non-religious promo | frame.io → Vimeo (Wyatt, §9) |
| C2 | Groups film — "HFP Forgiveness video" | same |
| C3 | Series trailers — secular = non-rel promo, christian = rel promo | same |
| C4 | Research film — hi-res "research video" | same |
| C5 | **GFM and HFP logo files** — nothing in `assets/` today | Kate |
| C6 | Facilitator guide document | Kate (*"I need to make a document for that"*) |
| C7 | Richard's additional research | Richard |
| C8 | Muslim-adapted workbook edition | Kate (outstanding since 26 Aug) |
| C9 | Vimeo account set-up + site registration | Wyatt + Kate (§9) |

## D. Parked — V2 or not yet a decision

| # | Item | Note |
|---|---|---|
| D1 | "Join a Forgiveness Group" map / directory | Kate flags V2; **collides with the 25 Aug no-directory ruling** — needs her, not us |
| D2 | Group members connecting with each other | V2, §3 and §7 both raise it |
| D3 | Host-organisation logos | V2, §4 |
| D4 | Preliminary questions for prospective facilitators | Kate is thinking aloud, §7 |
| D5 | "Next steps" tab in My Path, triggered on completion | Kate says "maybe", §7 |
| D6 | A graphic for "what forgiveness is and is not" | Kate wants one; none exists |
| D7 | Tone check with people carrying a real hurt | Kate: defer to the user-feedback phase |
| D8 | Tagline period on the About page | House style is no terminal period on headlines — answering, not changing |

---

## Notes carried forward

- **"6 sites in 5 countries" retires the CSV's "5 relatively high-conflict countries."** The
  standing rule in `CLAUDE.md` §12 quotes the old phrasing — update it when this ships.
- **RECEIVE naming:** Kate asks for "the same format" as "REACH Forgiveness Workbook". RECEIVE
  is already "RECEIVE Divine Forgiveness Workbook" — the odd one out was the church edition
  (A4). Reading it that way; flag to Kate in the reply.
- **Subject dropdown:** removing "Something about this website" is safe. Keeping a catch-all
  ("Something else") is what stops a message going unfiled — recommending we keep that one.
