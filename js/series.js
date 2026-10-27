/* THE DISPLAY for a Forgiveness Group series — every page, every role.

   It draws what js/group-engine.js's deriveSeries returns, and decides
   nothing: not what a step says, not whether it is open, not who may tick
   it. An action appears because the engine listed it. If you are about to
   compare a role in here, the rule belongs in the engine instead —
   scripts/qa/group-engine-onehelm.mjs goes red if you do.

   The rhythm (Richard, 22 Sep): what you do ON YOUR OWN, then what you do
   TOGETHER, in order. The two kinds differ in shape (dashed / solid), fill,
   icon and word, so the difference survives color blindness, grayscale
   printing and a quick glance. The icon sits inside the box beside its label
   (ruling 9); the key stays at the top.

   Every text drawn from the series carries data-field (THE CONTRACT), so the
   page-text editor can change it where it sits. */

import { videoFrame } from './video.js';

const ICON_TOGETHER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.5" cy="8" r="3.2"/><circle cx="15.5" cy="8" r="3.2"/><path d="M2.5 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3M9.5 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3"/></svg>';
const ICON_OWN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c.7-3.6 3.3-5.6 6.5-5.6s5.8 2 6.5 5.6"/></svg>';
const ICON = { own: ICON_OWN, together: ICON_TOGETHER };
const ICON_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/></svg>';
/* The two lanes' names — ONE pair for the key and the lanes (Kate, 14 Oct:
   "on your own time prior to the meeting", not "on your own"). */
const LANE = { own: 'On your own time, before the meeting', together: 'Together' };

/* Anything a facilitator typed (a place, a link) is shown to other people,
   so it is always escaped. Series text is editor content and is drawn as
   the editor saved it, like every other collection. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const FLOW_LEGEND = `
  <p class="flow-legend">
    <span class="flow-key flow-key--own">${ICON_OWN}${LANE.own}</span>
    <span class="flow-key flow-key--together">${ICON_TOGETHER}${LANE.together}</span>
  </p>`;

const STATE_WORD = { done: 'Done', open: 'Open now', upcoming: 'Coming up' };

const field = (seriesId, path) => `data-field="series/${seriesId}/${path}"`;

/* `datetime-local` wants local wall-clock time, no zone. */
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function meetingLine(m) {
  if (!m) return '';
  const bits = [];
  if (m.whenText) bits.push(`<b>${esc(m.whenText)}</b>`);
  if (m.place) bits.push(esc(m.place));
  if (m.link) bits.push(`<a href="${esc(m.link)}" target="_blank" rel="noopener">Join the video call →</a>`);
  return bits.join(' · ');
}

/* THE TO-DO (Wyatt, 27 Oct: the ticks read as rounded squares, not as a
   to-do list, so people missed that ticking opens the next step). Every
   tick a step offers sits in one box headed "To do", each a large square
   box with its words beside it; a tick that opens the next step says so
   underneath (the engine's note), and turns into "Done" once ticked. */
function checkHtml(step, a) {
  return `<label class="flow-check${a.locked ? ' is-locked' : ''}${a.opens ? ' flow-check--opens' : ''}">
        <input type="checkbox" data-act="check" data-scope="${a.scope}" data-step="${a.target || step.id}"${a.checked ? ' checked' : ''}${a.locked ? ' disabled' : ''}>
        <span class="flow-box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        <span>${esc(a.label)}${a.note ? `<small>${esc(a.note)}</small>` : ''}</span>
      </label>`;
}

function todoHtml(step) {
  const checks = step.actions.filter((a) => a.type === 'check');
  if (!checks.length) return '';
  const done = checks.every((a) => a.checked);
  return `<div class="flow-todo${done ? ' is-done' : ''}">
      <p class="flow-todo-h">${done ? 'Done' : 'To do'}</p>
      ${checks.map((a) => checkHtml(step, a)).join('')}
    </div>`;
}

/* THE meeting form — one, wherever a date and place are set: folded inside
   each meeting step, and laid open in the Next box when nothing is set yet
   (Wyatt, 28 Sep: "I don't even know where you add it"). */
function meetingForm(stepId, a, { open = false } = {}) {
  const form = `<form class="flow-meet-form" data-act="meeting" data-step="${stepId}" data-others="${esc((a.others || []).join(' '))}">
      <label>Date and time <input type="datetime-local" name="when" value="${toLocalInput(a.when)}"></label>
      <label>Place <input name="place" maxlength="140" placeholder="e.g. Church hall, room 2" value="${esc(a.place)}"></label>
      <label>Or a video-call link <input name="link" inputmode="url" placeholder="https://…" value="${esc(a.link)}"></label>
      <button class="btn btn--primary" type="submit">Save</button>
    </form>`;
  if (open) return form;
  return `<details class="flow-meet">
      <summary>Change date and place</summary>
      ${form}
    </details>`;
}

/* Every meeting at once, before the group starts (29 Sep call): a date and
   time for each, and one place or link that goes with all of them. */
function planForm(plan) {
  return `<form class="flow-meet-form flow-plan" data-act="schedule">
      ${plan.meetings.map((m) => `<label>Meeting ${m.n} · ${esc(m.title)}
        <input type="datetime-local" name="when:${m.stepId}"></label>`).join('')}
      <label>Place <input name="place" maxlength="140" placeholder="e.g. Church hall, room 2" value="${esc(plan.place)}"></label>
      <label>Or a video-call link <input name="link" inputmode="url" placeholder="https://…" value="${esc(plan.link)}"></label>
      <button class="btn btn--primary" type="submit">Save</button>
    </form>`;
}

/* The one thing to do next, at the top: the next meeting, and — for whoever
   sets it — its date and place, right here. Before any date is set, that is
   the whole plan. */
export function nextBox(view) {
  if (view.plan) {
    return `<div class="next-meet">
      <p class="kicker">Next · Plan your meetings</p>
      ${planForm(view.plan)}
    </div>`;
  }
  const n = view.next;
  if (!n) {
    return `<div class="next-meet"><p class="kicker">Every meeting is done</p>
      <p class="muted">The videos stay below to re-watch whenever you like.</p></div>`;
  }
  const set = !!(n.whenText || n.place || n.link);
  const body = set
    ? `<p class="next-when">${meetingLine(n)}</p>${n.action ? meetingForm(n.stepId, n.action) : ''}`
    : n.action ? meetingForm(n.stepId, n.action, { open: true }) : `<p class="muted">${esc(n.note)}</p>`;
  return `<div class="next-meet">
      <p class="kicker">Next · Meeting ${n.n}</p>
      <p class="next-title">${n.title}</p>
      ${body}
    </div>`;
}

function videoHtml(v) {
  if (!v) return '';
  if (v.playable) {
    return `<figure class="video flow-video">
        ${videoFrame(v.src, v.title)}
        ${v.note ? `<figcaption>${esc(v.note)}</figcaption>` : ''}
      </figure>`;
  }
  /* Not yet playable: the film's place, grayed, saying what opens it
     (Wyatt, 27 Oct), so nobody wonders where the video went. */
  return `<figure class="video flow-video flow-video--locked">
        <div class="flow-video-shut">${ICON_LOCK}<span>${esc(v.note)}</span></div>
      </figure>`;
}

function materialHtml(m, base) {
  if (m.kind === 'link') return `<a class="flow-material" href="${base}${m.href}">${esc(m.label)} →</a>`;
  return `<span class="flow-material flow-material--soon">${esc(m.label)}</span>`;
}

function stepHtml(view, s, base) {
  const sid = view.series.id;
  const state = s.state === 'preview' ? '' : ` is-${s.state}${view.currentId === s.id ? ' is-current' : ''}`;
  const word = STATE_WORD[s.state] ? `<span class="flow-state">${STATE_WORD[s.state]}</span>` : '';
  const extras = [
    s.meeting ? `<p class="flow-when">${meetingLine(s.meeting)}</p>` : '',
    videoHtml(s.video),
    s.materials.filter((m) => m.kind === 'code').map((m) => `<ul class="flow-bullets"><li>${esc(m.label)} <span class="groupcode">${esc(m.code)}</span>${m.copy ? ` <button type="button" class="btn btn--outline btn--sm" data-copycode="${esc(m.code)}">${esc(m.copy)}</button>` : ''}</li></ul>`).join(''),
    s.materials.some((m) => m.kind !== 'code') ? `<p class="flow-materials">${s.materials.filter((m) => m.kind !== 'code').map((m) => materialHtml(m, base)).join('')}</p>` : '',
    s.tally ? `<p class="flow-tally">${s.tally.done} of ${s.tally.of} have ticked these lessons</p>` : '',
    todoHtml(s),
    s.actions.filter((a) => a.type === 'meeting').map((a) => meetingForm(s.id, a)).join(''),
  ].join('');
  return `
  <li class="flow-step flow-step--${s.kind}${state}" data-step="${s.id}">
    <div class="flow-body">
      <p class="flow-tag"><span class="flow-icon">${ICON[s.kind]}</span><span>${s.tag}</span>${word}</p>
      <b ${field(sid, s.fields.title)}>${s.title}</b>
      <span class="flow-detail" ${field(sid, s.fields.detail)}>${s.detail}</span>
      ${extras ? `<div class="flow-extras">${extras}</div>` : ''}
    </div>
  </li>`;
}

/* The series, step by step. `base` is the path back to the site root. */
export function seriesFlow(view, { base = '../' } = {}) {
  return `<ol class="flow" aria-label="${esc(view.series.name)}, step by step">${view.steps.map((s) => stepHtml(view, s, base)).join('')}</ol>`;
}

/* THE RHYTHM, as a picture (Wyatt, 12 Oct; Richard on the October 6 call;
   a tester on 12 Oct read boxes and skipped prose). Two lanes — on your own
   above, together below — and one column per meeting, with the lessons done
   before it directly above it. Drawn from the same steps as seriesFlow, so
   the two can never disagree; the titles stay editable where they sit.
   Each column is numbered by meeting only (Kate, 14 Oct: "don't need weeks,
   just meeting numbers"); the once-a-week suggestion stays in the line above. */
export function seriesLanes(view) {
  const sid = view.series.id;
  const cols = [];
  let own = null;
  view.steps.forEach((s) => {
    if (s.kind === 'own') { own = s; return; }
    cols.push({ own, meet: s });
    own = null;
  });
  const cell = (s, lane, i) => s
    ? `<div class="lane-cell lane-cell--${lane}" style="--i:${i}"><b ${field(sid, s.fields.title)}>${s.title}</b></div>`
    : `<div class="lane-cell lane-cell--empty" style="--i:${i}" aria-hidden="true"></div>`;
  return `
  <div class="lanes-wrap">
    <div class="lanes" style="--cols:${cols.length}" role="img" aria-label="${esc(view.series.name)}: ${cols.length} meetings, each after lessons done on your own">
      <span class="lane-label lane-label--own">${ICON_OWN}${LANE.own}</span>
      ${cols.map((c, i) => cell(c.own, 'own', i)).join('')}
      <span class="lane-label lane-label--together">${ICON_TOGETHER}${LANE.together}</span>
      ${cols.map((c, i) => `<div class="lane-cell lane-cell--together" style="--i:${i}"><small>Meeting ${c.meet.n}</small><b ${field(sid, c.meet.fields.title)}>${c.meet.title}</b></div>`).join('')}
    </div>
  </div>`;
}

/* The series' own name and framing, editable where they sit. */
export const seriesName = (view, tag = 'h3') =>
  `<${tag} ${field(view.series.id, 'name')}>${view.series.name}</${tag}>`;
export const seriesFraming = (view) =>
  `<p class="kicker" ${field(view.series.id, 'framing')}>${view.series.framing}</p>`;

/* One listener for every action the engine offered, on any page. The page
   says what to do with it (`onAction`), then re-derives and redraws. */
export function wireSeries(root, onAction) {
  const busy = (el, on) => { el.closest('.flow-step')?.classList.toggle('is-saving', on); };
  root.addEventListener('change', async (e) => {
    const box = e.target.closest('input[data-act="check"]');
    if (!box) return;
    busy(box, true);
    try { await onAction({ type: 'check', scope: box.dataset.scope, stepId: box.dataset.step, value: box.checked }); }
    catch { box.checked = !box.checked; alert('That didn’t save. Please try again.'); }
    busy(box, false);
  });
  root.addEventListener('submit', async (e) => {
    const plan = e.target.closest('form[data-act="schedule"]');
    if (plan) {
      e.preventDefault();
      const f = new FormData(plan);
      const entries = [...f.keys()].filter((k) => k.startsWith('when:')).map((k) => {
        const local = f.get(k);
        return { stepId: k.slice(5), when: local ? new Date(local).toISOString() : '' };
      });
      busy(plan, true);
      try { await onAction({ type: 'schedule', scope: 'group', stepId: null, entries, place: f.get('place'), link: f.get('link') }); }
      catch { alert('That didn’t save. Please try again.'); }
      busy(plan, false);
      return;
    }
    const form = e.target.closest('form[data-act="meeting"]');
    if (!form) return;
    e.preventDefault();
    const f = new FormData(form);
    const local = f.get('when');
    busy(form, true);
    try {
      await onAction({
        type: 'meeting', scope: 'group', stepId: form.dataset.step,
        when: local ? new Date(local).toISOString() : '', place: f.get('place'), link: f.get('link'),
        others: (form.dataset.others || '').split(' ').filter(Boolean),
      });
    } catch { alert('That didn’t save. Please try again.'); }
    busy(form, false);
  });
}
