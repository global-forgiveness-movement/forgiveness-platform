/* Create a group — ONE form, wherever it appears (the Groups page and My
   Path, ruling 9). Same one question, same registerGroup, so the two can't
   drift: Wyatt's ruling 19 Sep, the series is the only answer the code
   needs; everything else Kate asked for is asked, optional, behind it.

   The page decides only what to say once the code exists (`onCreated`). */

import { registerGroup, sendGroupDetails, doneAskingAboutGroup } from './groups.js';
import { currentUser } from './auth.js';

export function createGroupForm({ series = 'secular' } = {}) {
  const opt = (v, label) => `<option value="${v}"${v === series ? ' selected' : ''}>${label}</option>`;
  return `
    <form class="form" data-create-group>
      <label>Which version will you use?
        <select name="series">
          ${opt('secular', '3 sessions · REACH Forgiveness Workbook')}
          ${opt('church', '6 sessions · REACH Forgiveness Workbook, Adapted for Churches')}
        </select>
      </label>
      <button class="btn btn--primary" type="submit">Create my group</button>
      <div class="form-msg" hidden role="status"></div>
    </form>`;
}

/* The optional questions — asked once, beside a new group's code on My Path
   (Richard, 28 Sep), never before the code exists. */
export function mountGroupDetails(slot, { code, onDone }) {
  slot.innerHTML = `
    <h3>Tell us about your group</h3>
    <p class="small muted" data-copy="groups.p.none-of-this-is">None of this is required. It helps us support you and understand where this work is taking root.</p>
    <form class="form" data-group-details>
      <label>Where is your group? (city, country) <input name="location"></label>
      <label>How many people do you expect? <input name="size" type="number" min="2" max="99"></label>
      <label>Anything you’d like us to know? <textarea name="notes" rows="3"></textarea></label>
      <div class="dl-row">
        <button class="btn btn--primary" type="submit">Send</button>
        <button class="linkish" type="button" data-skip>Skip</button>
      </div>
      <div class="form-msg" hidden role="status"></div>
    </form>`;
  const form = slot.querySelector('form');
  slot.querySelector('[data-skip]').addEventListener('click', () => { doneAskingAboutGroup(); onDone?.(); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await sendGroupDetails(code, Object.fromEntries(new FormData(form)), currentUser());
      onDone?.();
    } catch {
      const msg = form.querySelector('.form-msg');
      msg.className = 'form-msg form-msg--err';
      msg.textContent = 'That didn’t send. Please try again, or skip it.';
      msg.hidden = false;
      btn.disabled = false;
    }
  });
}

export function mountCreateGroup(slot, { series, onCreated } = {}) {
  slot.innerHTML = createGroupForm({ series });
  const form = slot.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const u = currentUser();
      /* Name and email come from the account, not from six fields retyped. */
      const fields = { ...Object.fromEntries(new FormData(form)), name: u?.name || '', email: u?.email || '' };
      const created = await registerGroup(fields, u?.id);
      form.reset();
      await onCreated?.(created, { form, msg });
    } catch {
      msg.className = 'form-msg form-msg--err';
      msg.textContent = 'That didn’t send. Please try again, or email us via the Contact page.';
      msg.hidden = false;
    }
    btn.disabled = false;
  });
  return form;
}

/* Preselect a series (the Groups page chooser hands its pick across). */
export function preselectSeries(slot, seriesId) {
  const sel = slot.querySelector('select[name="series"]');
  if (sel && [...sel.options].some((o) => o.value === seriesId)) sel.value = seriesId;
}
