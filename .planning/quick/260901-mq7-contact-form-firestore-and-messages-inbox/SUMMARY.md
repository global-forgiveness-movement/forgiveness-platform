---
gsd_summary_version: 1.0
type: quick
quick_id: 260901-mq7
slug: contact-form-firestore-and-messages-inbox
date: 2026-09-01
status: complete
---

# Summary

Wyatt's ruling of 1 Sep, after the client call: contact mail goes through a form saving to
Firestore rather than a `mailto:` link, with `globalforgivenessmovement@gmail.com` as the
account behind it. Built — and the form means the address appears nowhere on the page, so
the gmail stays purely an account.

## What shipped

**`js/inbox.js` (new).** The one module for things people send us. Both kinds — a contact
message and a group registration — are described as DATA in a `SUBMISSIONS` table (label,
collection, how to read a row) rather than handled as two code paths. `sendMessage()`
writes; `listInbox()` reads every collection in the table, merges and sorts newest first.
A third kind later is a row in that table, not another screen.

**Contact page rewritten** (`contact/index.html`): name, email, subject select, message.
Same `.form` markup and `.form-msg` states as the groups form, so it behaves identically.
Verified: zero `@` characters in the page, and zero email addresses in the rendered text.

**`/admin` gets a Messages tab** — read-only, newest first, both kinds side by side, with a
`mailto:` reply link (safe there and only there; that page is editors-only). Until now the
`groups` collection was editor-readable in the rules but had **no screen anywhere** — every
leader who filled that form went into a drawer with no handle on it. That is now readable.

**`firestore.rules`:** `contact` gets exactly the `groups` shape — `create: if true`,
`read/update/delete: if isEditor()`. Write-only from the public. **Needs pasting into the
console** before the live form can write; nothing in this repo deploys rules.

## The defect found on the way, measured not assumed

`groups/index.html` called BOTH `submitGroupForm()` (js/metrics.js) and `registerGroup()`
(js/groups.js), and both did `store.add('groups', …)`. **Every group registration wrote two
documents**, the first carrying no group code and no series — an orphan per leader. The old
call was left in when `registerGroup` superseded it: the fork CLAUDE.md §Design describes,
exactly.

Measured with a harness driving the real demo backend: **2 documents per submission before,
1 after**, and the harness was red-proofed (it reported 2 for the old code and 1 for the
new, so it can tell the difference). Confirmed again in the browser at both widths.
`submitGroupForm` is deleted; metrics.js is back to being only what its header claims.

## Browser QA — what was actually looked at

Local server, demo mode (config nulled in a scratch copy so QA could not write into the
clients' live database), Chromium at 1280×900 and 390×844, screenshots read:

- Contact page empty and after sending — confirmation renders in the ok state, form clears.
- Group registration → **one** document in the store.
- Messages tab as a signed-in editor: both rows, correct fields, correct order.
- **A real fault caught here:** the Messages tab overflowed 390px by **81px** (the reply
  link and the email in a non-wrapping flex row). Fixed at the shared `.adm-block-head`
  class, so every admin header row wraps now. Re-measured: all four tabs 390 = 390.
- One phantom ruled out: some inbox values *looked* teal in the screenshot. Computed colour
  is `rgb(36,51,62)` on all seven — identical. A compression artefact, not a defect.

## New client-facing copy — needs Wyatt's approval

One new line on the contact page, marked with an HTML comment: a crisis note. Wording was
matched to the line the workbook already carries (`workbook/js/app.js`) so the site says it
one way. It is there because a contact page is where someone in distress may write. Easy to
remove if Wyatt would rather not add copy before the clients' review.

## Deliberately not done

No email notification on a new message — that needs a Cloud Function and a paid plan. Kate
reads the inbox. No restructuring of anything: the clients' feedback is due ~15 Sep.
