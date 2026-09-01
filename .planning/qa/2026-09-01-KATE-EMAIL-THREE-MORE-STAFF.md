# Kate's email — three more HFP staff for the About page (relayed by Wyatt, 1 Sep 2026)

**Sits above the 26 Aug email in the feedback record** (scope plan Draft 3 → Kate's CSV →
Kate's email ~17 Aug → the 25 Aug call → the 26 Aug email → this). It adds to that email's
About-page roster rather than replacing it — the seven already on the page all stand.

## The ask, verbatim

> "could you add three more Human Flourishing staff people to our about page:
> https://hfh.fas.harvard.edu/team/suzanne-ouyang and https://hfh.fas.harvard.edu/team/sophie-frushell
> https://hfh.fas.harvard.edu/team/ying-chen"

Three people, each identified only by their HFP team-page URL:

1. Suzanne Ouyang — https://hfh.fas.harvard.edu/team/suzanne-ouyang
2. Sophie Frushell — https://hfh.fas.harvard.edu/team/sophie-frushell
3. Ying Chen — https://hfh.fas.harvard.edu/team/ying-chen

## Wyatt's rulings, 1 Sep

- **Bio text comes from the source, not from a paraphrase.** Kate gave URLs, and the 26 Aug
  convention holds: bios are verbatim from each person's own HFP page, never reworded. Wyatt
  allowlisted `hfh.fas.harvard.edu` so the text is fetched rather than reconstructed.
- **Position: after Kate Jackson-Meyer, before Everett Worthington** — the three are HFP staff,
  so they join the staff block; Everett stays last because he is the outside affiliate and the
  originator of the REACH model, and ending on him is deliberate.
- **Initials circles for now.** Photos are a later one-line-per-person change, exactly as
  Cooper Harris runs today. The page must never show a broken image.

## Status — what is done and what is blocked

- **Done:** the ten-card layout is verified in a browser at desktop (1280px) and mobile (390px)
  against a scratch prototype — the roster wraps 4 + 4 + 2 centred at desktop, stacks to a
  single column on mobile, and expand-in-place still works from the new middle positions.
  Screenshots taken 1 Sep; the prototype was never committed.
- **Blocked:** the bio text itself. `hfh.fas.harvard.edu` was allowlisted mid-session but the
  running container kept its start-time egress policy — every fetch still returned CONNECT 403,
  and `web.archive.org` closed the tunnel mid-exchange on all four attempts. The allowlist
  should apply to a **new session**. No entry was written to `js/data.js` with invented or
  search-summarised bio text.

**Nothing client-facing shipped from this session.** When the three entries land they are NEW
copy on a client-facing page and need Wyatt's read before they go to `main`.

## Handoff — what the next session does (Wyatt's ruling: fresh session, re-fetch)

The allowlist applies when a container starts, so a new session can reach the pages this one
could not. Everything except the bio text is already decided and proven; this is a content
drop, not a design task.

1. **Fetch all three pages** — `https://hfh.fas.harvard.edu/team/{suzanne-ouyang,
   sophie-frushell,ying-chen}`. Take the displayed title and the bio **verbatim**, trimmed to
   the bio proper, never paraphrased — the standing convention for this roster, set by the
   comment above `PEOPLE` in `js/data.js`. If a fetch still 403s, stop and say so; do not
   reconstruct bio text from search summaries.
2. **Insert three entries into `PEOPLE` in `js/data.js`**, in this order, immediately before
   the `everett-worthington` entry: `suzanne-ouyang` (SO), `sophie-frushell` (SF),
   `ying-chen` (YC). Fields: `slug`, `initials`, `name`, `role`, `line: ''`, `bio`, `link`.
   Omit `photo` entirely unless the file exists — an absent `photo` gives the initials circle,
   and a wrong path gives a broken image.
3. **Photos, same visit:** save each headshot to `assets/people/<slug>.jpg`, verify with
   `file` (JPEG/PNG, >5 KB), then add the `photo` field. Cooper Harris is still on an initials
   circle too — worth grabbing while the host is reachable.
4. **Bump `STAMP` in `js/site.js`** (currently `GFM-V1 · 2026-08-28c`) — this one does change
   what is served.
5. **Look at it rendered** before handing over — desktop and mobile. Gate bypass for a headless
   pass: `localStorage.setItem('gfm.gate.v2','open')` in an init script.

**Already settled, do not re-litigate:** the position (after Kate, before Everett), initials
circles as the acceptable interim, and the ten-card layout — verified 1 Sep at 1280px and
390px, wrapping 4 + 4 + 2 centred with expand-in-place working from the new middle slots.

**One thing worth telling Wyatt:** until the photos land, the middle row reads as three
initials circles against one photo (Cooper, Suzanne, Sophie beside Kate). It is not broken,
but it is the strongest argument for doing step 3 in the same pass.

---

## Second session, 1 Sep — the fresh container did NOT unblock it

The handoff above predicted that a new container would pick up the widened allowlist. It did
not. Measured at the start of this session, not assumed:

| Host | Result |
|---|---|
| `hfh.fas.harvard.edu` | CONNECT 403 — policy denial (curl **and** the WebFetch tool, which reports `EGRESS_BLOCKED`) |
| `www.hsph.harvard.edu` | CONNECT 403 |
| `web.archive.org` | tunnel opens, then resets / 502 — four attempts, no snapshot retrieved |
| `r.jina.ai` (text proxy) | CONNECT 403 |
| `cdn.prestosports.com` | CONNECT 403 — Cooper Harris's photo is blocked too |
| `www.ecgulls.com` | CONNECT 403 |
| `www.youtube.com` | 200 — so the allowlist **is** being enforced; these hosts are simply not on it |

**The likely cause is in our own record.** The network ledger in `.planning/STATE.md` (commit
`15cc116`, 28 Aug) lists `hfh.fas.harvard.edu` under **TRIM-ELIGIBLE**, and `cdn.prestosports.com`
as PENDING-then-trim. Both now read as denied, which is what a completed trim looks like. Kate's
1 Sep ask needs `hfh.fas.harvard.edu` back; the ledger has been corrected accordingly.

No Google Drive copy of the three bios exists either (searched 1 Sep).

**Nothing was invented.** Per the standing convention above the `PEOPLE` array, no entry was
written to `js/data.js` from a search summary, a reconstruction, or a model's own knowledge.
The three cards are a content drop waiting on one input: the source text.

### The two ways forward — Wyatt's call

1. **Paste the three bios** (name as displayed, role/title, bio paragraphs) into the session.
   Fastest, and the text is then provably the source's.
2. **Re-add `hfh.fas.harvard.edu` to the environment allowlist** (plus `cdn.prestosports.com`
   if the headshots should land in the same pass) and start a fresh session. The container
   reads the policy at start, so the retry has to be a new session — this one cannot see a
   mid-session change.

Everything else is ready: position (after Kate, before Everett), slugs `suzanne-ouyang` /
`sophie-frushell` / `ying-chen`, initials SO / SF / YC, `photo` omitted so the initials circle
shows, and the ten-card layout already proven at 1280px and 390px.
