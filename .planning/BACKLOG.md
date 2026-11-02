# Backlog

Small things Wyatt has parked for later. Newest first. Not scheduled; pick up when there's room.

## ✅ FIXED 2 Nov — 2 Nov 2026 — Home, "The definition" section: two formatting bugs (Wyatt, wide screen)

Where: `index.html` `data-section="definition"`; styles in `css/site.css` (`.def`, `.def-kicker`, `.def-word`, the `def-write` animation).

1. **The "The definition" label isn't aligned.** It sits at the far left of the page. It should line up
   with the left edge of the definition text and the two boxes below it ("Forgiveness does not mean" /
   "It is compatible with").
2. **The "g" in the script word "Forgiveness" is cut off at the bottom.** The tail of the g is clipped.
   Suspects: `line-height: 1.1` on `.def-word`, or a clip or mask in the `def-write` reveal animation.

Fixed 2 Nov (build 2026-11-02e): the label, word, text and both boxes share the page's left edge; the
write-on clip reaches past the word's box. Checked wide, desktop and phone.
