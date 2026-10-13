# Backlog — UX interview, 12 Oct

**Source:** a recorded call where Wyatt guided one first-time tester through the site. She was on
a phone, in a car. She signed in with Google and started a group called "Ojai". Wyatt added the
four items marked *(Wyatt)*. **This is one guided session, so it's a signal, not a ruling.**
Rule 10 still ranks the clients' rulings above it. Section C lists where they collide.

Sizes: **S** = copy or one attribute · **M** = change a section or flow · **L** = new flow or infrastructure

---

## A. Do now — no decision needed

| # | Item | Size | Where | Evidence |
|---|---|---|---|---|
| A1 | **Social preview card** *(Wyatt)*. The logo on **cream `#F5F1E2`** (Wyatt, 12 Oct), 1200×630. No page has `og:` or `twitter:` tags today. Link previews don't run JS, so the tags must be in every page's static `<head>`. Add a `scripts/qa/` check that every page has the same tags. `og:image` needs an absolute URL, which changes when the custom domain lands | S–M | every `*.html` | Wyatt |
| A2 | **Audit font sizes on mobile, including the interactive workbook** *(Wyatt)*. The small grey text is in `css/site.css:99,254,262,281,286,344–346` (0.72–0.85rem). Also check the "page 1 of 124" counter and the workbook controls | M | `css/site.css`, `/workbook/` | "This is a little hard in the car with small font" |
| A3 | **Rewrite the Groups intro sentence.** She found "working through the REACH Forgiveness Workbook **on their own**" unpolished. The same phrasing appears in `index.html:66` and `workbooks/index.html:52`, so change all three together. Ask about the bold `<b>` before dropping it. **New copy: needs Wyatt's approval (rule 11)** | S | `groups/index.html:20` | "I think this sounds a little bit… unpolished. I'd probably reword the sentence" |
| A4 | **Tell group creators they'll facilitate.** Add one line in the create-group flow, e.g. "You'll be this group's facilitator. That just means pressing play and keeping time." | S | `my-path/` create flow | "Am I gonna be the facilitator?… if you started a group, you will be designated the facilitator" |
| A5 | **Put "or" between the two sign-up choices.** "Create your free account" followed by "Continue with Google" read to her as two different things | S | `join/index.html:24–27` | "what you should say [is] or continue with Google" |

## B. Needs a setting or a client answer

| # | Item | Size | What's blocking |
|---|---|---|---|
| B1 | **A friendlier Google sign-in screen** *(Wyatt)*. She saw "Sign in to gfm-platform.firebaseapp.com". **(a)** Set the app name and logo on the Google Cloud OAuth consent screen. This is a settings change with no code; Google may require brand verification before they show. **(b)** Replacing the firebaseapp.com address needs a custom `authDomain` (`js/firebase-config.js:12`). Google's recommended setup assumes Firebase Hosting, which GitHub Pages can't stand in for. So (b) waits for the custom domain and a hosting decision | S + L | (a) console setting · (b) custom domain |
| B2 | **Remove the Vimeo logo from the player** *(Wyatt)*. `js/video.js:78` already hides the title, byline and portrait. Hiding the logo is a paid-plan setting on the **clients'** Vimeo account. Which current plan includes it is **not confirmed** | S | Kate/Richard's Vimeo plan |
| B3 | **Explain a group meeting before asking someone to plan one.** In "Plan your meetings" she said "I have no idea" what happens at a meeting. She also hesitated at naming meetings before any topic was written. Add a short "what usually happens at a meeting" explainer, using the Groups page content. New copy | M | rule 11 approval |

## C. Clashes with a client ruling — Wyatt raises with Kate

| # | Item | Status |
|---|---|---|
| C1 | **Put the forgiveness definition back above the three doors.** She would have left at the doors ("I would have left it"). What made it click was "Forgiveness involves replacing ill will with goodwill…". On 6 Oct, at Kate's request, that definition moved down above the video (`index.html:17,85`). She also called "Your forgiveness journey starts here" not a summary | **Wyatt raises it with Kate (12 Oct). `index.html` stays as it is until she rules** |
| C2 | **"Download the workbook" on a phone took her to the interactive version.** She was glad it did. To her, "download" means saving a file on a laptop | **Not yet reproduced (rule 6).** If it's real: fix the label, or lead with the interactive version on phones. Either way it touches the ruling that the PDF stays free with no account |

## D. Watch, no action yet

- **Getting out of the workbook on mobile:** she went looking for a back arrow at the bottom. Wyatt's call thumbnail may have been covering it. Screenshot it at 390px during A2.
- **Where she looks for context:** she went to Home or About, not Groups. Revisit if another tester does the same.
- **Keep:** she called it warm, "not just clip art". She liked the sans-serif font, the purple and teal buttons, the short video and the evidence. Don't add stock icons.
