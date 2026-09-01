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
