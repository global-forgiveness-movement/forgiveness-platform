/* A Forgiveness Group series drawn as its real rhythm: what you do ON YOUR
   OWN, then what you do TOGETHER, in order. Richard, 22 Sep: make every part
   of the process visible, so people see at a glance that the lessons happen
   alone and the meetings are for talking about them.

   One renderer for every page that shows a series (Groups, My Path), so the
   two cannot drift. The two kinds of step differ in shape as well as color,
   plus an icon and a word, so the difference survives color blindness,
   grayscale printing and a quick glance. */

const ICON_TOGETHER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.5" cy="8" r="3.2"/><circle cx="15.5" cy="8" r="3.2"/><path d="M2.5 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3M9.5 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3"/></svg>';
const ICON_OWN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c.7-3.6 3.3-5.6 6.5-5.6s5.8 2 6.5 5.6"/></svg>';

const own = (label, step) => `
  <li class="flow-step flow-step--own">
    <span class="flow-icon">${ICON_OWN}</span>
    <span class="flow-body">
      <span class="flow-tag">On your own · ${label}</span>
      <b>${step.title}</b>
      <span>${step.detail}</span>
    </span>
  </li>`;

const together = (x, note) => `
  <li class="flow-step flow-step--together">
    <span class="flow-icon">${ICON_TOGETHER}</span>
    <span class="flow-body">
      <span class="flow-tag">Together · meeting ${x.n}</span>
      <b>${x.title}</b>
      <span>${x.detail}${note ? ` · <i>${note}</i>` : ''}</span>
    </span>
  </li>`;

export const FLOW_LEGEND = `
  <p class="flow-legend">
    <span class="flow-key flow-key--own">${ICON_OWN}On your own</span>
    <span class="flow-key flow-key--together">${ICON_TOGETHER}Together</span>
  </p>`;

/* `meetingNote` is appended to every meeting (My Path: "video arrives this fall"). */
export function seriesFlow(s, { meetingNote = '' } = {}) {
  const steps = [];
  if (s.prep) steps.push(own('first', s.prep));
  s.sessions.forEach((x) => {
    if (x.before) steps.push(own(`before meeting ${x.n}`, x.before));
    steps.push(together(x, meetingNote));
  });
  return `<ol class="flow" aria-label="${s.name}, step by step">${steps.join('')}</ol>`;
}
