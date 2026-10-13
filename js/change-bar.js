/* THE CHANGE BAR — one way the site draws "this went down / up by x%"
   (Wyatt, 13 Oct: as few marks as possible; the size always labeled).

   One card per measure: its name, the change in words ("decreased 31%",
   "44% lower", "28% higher"), and one bar. For a fall, the full bar is where
   it started; the solid part is where it ended, and a dashed box with ←
   is what went away. For a rise, the full bar is where it ended; the solid
   part is where it started, and a dashed box with → is what was added.
   `theme` names the study's color, so two studies never look like one.

   Used by the trial's results (teal) and the nurses' study (plum). Pure:
   it returns HTML and touches nothing. */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* from, to: the two averages; said: the words after the name; spoken: the
   full sentence a screen reader hears. */
export function changeCard({ name, from, to, said, spoken, theme = 'teal' }) {
  const fall = to < from;
  const solid = fall ? to / from : from / to;
  return `<figure class="chg chg--${theme}" aria-label="${esc(spoken)}">
    <figcaption><b>${esc(name)}</b> <span>${esc(said)}</span></figcaption>
    <span class="chg-bar"><span class="chg-solid" style="width:${(solid * 100).toFixed(1)}%"></span><span class="chg-diff"><span aria-hidden="true">${fall ? '←' : '→'}</span></span></span>
  </figure>`;
}

/* How much one number differs from another, as a whole percent. */
export const percentChange = (from, to) => Math.round(Math.abs(to - from) / from * 100);
