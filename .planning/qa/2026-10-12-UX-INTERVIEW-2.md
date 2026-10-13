# Backlog — UX interview 2, 12 Oct

**Source:** a recorded call with a second first-time tester. She is a trained social worker and
counsellor, which makes her a skeptical reader of wellness sites. The setup: a friend has said
forgiveness can be learned and sent her the link. **One session, so it's a signal, not a ruling.**
The first interview is in `2026-10-12-UX-INTERVIEW.md`, and section X lists where the two agree.

Sizes: **S** = copy or one attribute · **M** = change a section or flow · **L** = new flow or page

---

## X. Both testers said it — the strongest signal so far

| # | Finding | Interview 1 | Interview 2 |
|---|---|---|---|
| X1 | **Home asks for a decision before it has earned trust or said what you'd get.** Both would have left at the top | "I would have left it" | "Briefly scroll… see that it's a time commitment. And not try it" |
| X2 | **Being the facilitator is a surprise, and it puts people off** | "Am I gonna be the facilitator?" | "If I came here to forgive someone, I wouldn't feel great about being a facilitator also" |

## A. Do now — no decision needed

| # | Item | Size | Where | Evidence |
|---|---|---|---|---|
| A1 | **Add a "Join with a code" entry point on the Groups page**, next to "Create your group". It now exists only on My Path (`my-path/index.html:491`). Someone sent a code goes to Groups first. Make it the same component as on My Path, not a copy (`ONEHELM`) | S–M | `groups/index.html:109–123` | "If someone sent me a code… I would click on groups and be like, where do I put in the code?" |
| A2 | **Say what a facilitator does, wherever someone is asked to be one.** "Gather your people and press play; the video does the guiding." She was willing once she heard that. This extends interview 1's A4 to the Groups page and the door copy. New copy | S | groups, home door, create flow | "Would you feel more [comfortable]?" — "Down, man." |
| A3 | **Give the session plan a sense of time.** Show something like "Week 1 · Week 2…", or a sentence on how often groups usually meet. As it stands, lessons 6–12 look like one heap of homework | S–M | `groups/` series step-by-step (`:101`) | "Is that back to back to back? Is that once a week?" |
| A4 | **Put Groups sections in the order a newcomer asks:** what a group is and how it works first, why groups exist second. Today "Doing this work alongside other people changes it" comes before "What happens in a Forgiveness Group" (`:36`) | S | `groups/index.html` | "I would read the second section before the top section" |
| A5 | **Turn paragraphs into boxes or lists where the content allows.** She read the four facilitating boxes and the eight guidelines, and skipped the prose. Candidates: the Groups intro and "The two versions" (`:91–93`) | M | groups, then other pages | "When I see a list like this… I'm more willing to read" |
| A6 | **Make the "Both are ways of getting a group through…" note normal colour.** It's `class="muted"`, and to her it read as unimportant. While there, make the series buttons look like buttons: she didn't recognise them | S | `groups/index.html:93,101` | "It feels like that's receding into the distance" |

## B. Needs a decision from Wyatt

| # | Item | Size | Question |
|---|---|---|---|
| B1 | **Reframe the Research headline as a confident claim.** Today it's the question "Does the REACH Forgiveness Workbook actually work?" (`research/index.html:21`), which to her plants doubt. Any replacement is client-facing copy and must be phrased the clients' way (rule 12) | S | Wyatt approves the wording |
| B2 | **Is there a mode for people who want to join a group but not run one?** She described two "modes": holding space for others, or being held. Someone who comes to forgive doesn't want to run the room. Kate ruled out a group directory on 25 Aug, so this goes no further than copy unless Kate reopens it | — | Raise with Kate? |
| B3 | **About page:** she expected the story of how this came to be (who developed it and why), then the mission. People bios matter less to her. Today the page leads with the mission (`about/index.html:18`), then people | M | Wyatt: is there an origin story to tell? |
| B4 | **A "for counsellors and professionals" path.** She sees the site speaking only to individuals. Out of scope for now. Park it unless the clients want it | L | Park |

## C. Clashes with a client ruling — Wyatt raises with Kate

| # | Item | Ruling it touches |
|---|---|---|
| C1 | **Results up front on Home: tested with over 4,500 participants, in 6 sites in 5 countries, and how much it reduced depression and anxiety.** "Stats immediately build trust… and give me the motivation." **Kate moved the result boxes from Home to Research on 6 Oct** (`2026-10-06-CALL.md` row 2), with her graphics possibly replacing them on Home. Together with interview 1's C1 (the definition at the top), that makes **two testers asking to put back above the doors what came off Home on 6 Oct** | Kate, 6 Oct |
| C2 | **She looked for the Harvard name up front** and was surprised not to find it. She worries a wellness site might turn out to be a cult, a religious group or a blog. **Richard ruled on 25 Aug: no Harvard in site chrome or marketing.** Don't settle this. Note it for Richard as the trust job the name would have done, which the evidence has to do instead. (Factual attribution, e.g. "Human Flourishing Program" next to the trial, is still allowed) | Richard, 25 Aug |

## D. Watch / keep

- **She opened the interactive workbook first only because it was "the biggest button"**, then backed out: "that's not the mode I'm in". A curious visitor isn't ready to commit, so the biggest button may be asking too much too soon. Watch this alongside X1.
- **She skips videos** ("I still always skip a video"). Interview 1 liked the short video. Don't make anything depend on watching one.
- **My Path matched what she expected:** your progress, your group, your account.
- **Keep:** "Professional. Very much like a wellness website." The Research page reads as "super clear" and builds trust through its sources.
