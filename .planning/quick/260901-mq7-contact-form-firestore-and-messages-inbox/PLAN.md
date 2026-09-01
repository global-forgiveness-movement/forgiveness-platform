---
gsd_plan_version: 1.0
type: quick
quick_id: 260901-mq7
slug: contact-form-firestore-and-messages-inbox
date: 2026-09-01
status: planned
---

# Contact form → Firestore, and one Messages inbox in /admin

## Why

Wyatt's ruling, 1 Sep, after the client call: contact-page mail goes to
`globalforgivenessmovement@gmail.com` for now, sent through **a form that saves to
Firestore** rather than a `mailto:` link. Firebase went live earlier today, so this is
newly possible. The form means no address is printed in the page source — the gmail
stays purely an account, which is what Wyatt wanted, and spam crawlers get nothing when
the gate comes down at launch.

## What is actually broken today (both measured, not read off the page)

1. **The groups form writes every submission twice.** `groups/index.html` calls
   `submitGroupForm()` (js/metrics.js) *and* `registerGroup()` (js/groups.js); both do
   `store.add('groups', …)`. The first copy carries no group code and no series — a
   stray orphan per leader. Measured with a harness driving the real demo backend:
   2 documents per submission, and 1 once the superseded call is removed.
   `registerGroup()` is the survivor; it writes everything the old one did plus the code.

2. **Nobody can read any of it.** firestore.rules makes `groups` editor-readable, but
   `/admin` has no screen for it — its tabs are `Object.keys(COLLECTIONS)` plus Pages
   and History, all *editable content*. Leaders' names and emails have been landing in a
   drawer with no handle. A contact form would have had the same problem.

So the contact form must not become a third submission path. Converge: ONE module owns
"things people send us", ONE inbox screen reads them, both kinds flow through it.
(CLAUDE.md §Design — "the existing one works, I'll just add a copy for the new case" is
the moment a fork is born.)

## Tasks

### 1. `js/inbox.js` — the one module for submissions

New file. Owns both kinds and describes them as data, so the inbox screen has no
per-kind branches:

- `SUBMISSIONS` — a small table: collection name, label, which field is the person's
  name / email / body, how to summarise a row.
- `sendMessage(fields)` — writes `{...fields, submittedAt}` to `contact`.
- `listInbox()` — reads every collection in the table, merges, newest first, tags each
  row with its kind.

`registerGroup()` stays in js/groups.js (it owns codes, which is its own job) but its
write is the one the inbox reads.

### 2. Retire the duplicate write

- Delete `submitGroupForm` from js/metrics.js — metrics.js goes back to being only what
  its header claims: anonymous counting.
- Drop its import and call from groups/index.html.
- Re-run the harness: 1 document per submission.

### 3. The contact page gets the form

`contact/index.html`: replace the "Contact via the program page" button with a real
form — name, email, message, and a subject select so Kate can triage. Same `.form`
markup and `.form-msg` states as the groups form, so it looks and behaves identically
(CLAUDE.md — consistency; friction: three fields, nothing optional-looking that isn't).
Keep the "planning to run a group?" pointer, which sends the right people elsewhere.
No email address anywhere in the markup.

### 4. `/admin` gets a Messages tab

- Add `'messages'` to `TABS`, before Pages/History.
- Render read-only rows from `listInbox()`: kind pill, name, date, email as a
  `mailto:` (safe — that page is editors-only), the body, and for a group registration
  its code, location, size and series.
- Newest first. Empty state that says what will appear there.

### 5. Rules for the new collection

`firestore.rules`: `contact` gets exactly the `groups` shape — `allow create: if true`,
`read, update, delete: if isEditor()`. Write-only from the public. Note in the file that
it must be pasted into the console; nothing here deploys it.

## Verify

- Harness re-run: one group submission → one document.
- Browser, local server, demo mode: send a contact message, see the confirmation; sign
  in as an editor, see it in Messages beside a group registration.
- Screenshot desktop (1280) and mobile (390) of both the contact page and the Messages
  tab, and read them.
- Grep the built contact page for `@` to prove no address ships.

## Out of scope

No restructuring — the clients' feedback is due ~15 Sep and nothing should move before
it lands. No email notifications (that needs a Cloud Function and a billing plan; Kate
reads the inbox for now). The gmail address is not published anywhere.
