/* "Been given a group code? Put it in now" — ONE card, wherever someone
   arrives holding a code before they have an account: My Path, and the
   Groups page (a tester, 13 Oct: "if someone sent me a code… I would click on
   groups and be like, where do I put in the code?").

   The code is parsed here, in the browser, so someone gets a real answer —
   which version they are joining — before any account exists. Holding it is
   js/groups.js's job alone (scripts/qa/one-held-code.sh). `base` is the path
   back to the site root; `onShow(held)` lets the page hide anything that
   would contradict the card (My Path's plain "Sign in" button). */

import { holdGroupCode, heldGroupCode, forgetGroupCode, heldCodeLine, groupCodeProblem, CODE_SHAPE } from './groups.js';

export function mountCodeEntry(slot, { base = '../', onShow = () => {} } = {}) {
  slot.innerHTML = `
    <div class="card precode">
      <p class="kicker" style="margin-bottom:0.3rem" data-copy="mypath.p.been-given-a-group">Been given a group code?</p>
      <h3 data-copy="mypath.h3.put-it-in-now">Put it in now</h3>
      <p class="small" data-locked="A privacy promise: the code makes it true, so it changes only with the code.">Enter it here and we’ll hold on to it. You still need a free account to save your place — we’ll connect you to your group the moment you have one. Entering a code never tells your facilitator anything about your workbook.</p>
      <form class="form" novalidate data-locked="The form itself: its words change with the code.">
        <label>Group code
          <input name="code" placeholder="${CODE_SHAPE}" autocomplete="off" spellcheck="false">
        </label>
        <div class="form-msg" hidden role="status"></div>
        <button class="btn btn--outline" type="submit" data-precode="check">Check my code</button>
        <p class="precode-next" data-precode="next" hidden>
          <a class="btn btn--primary btn--go" href="${base}join/">Create your free account</a>
          <a class="small" href="${base}join/#signin">I already have an account</a>
        </p>
      </form>
    </div>`;
  const form = slot.querySelector('form');
  const msg = form.querySelector('.form-msg');
  const part = (name) => form.querySelector(`[data-precode="${name}"]`);
  /* One function draws the card's three states — nothing typed yet, a code
     held, a code that isn't one — so the button and the message never
     disagree. */
  const show = (held, problem) => {
    msg.hidden = !held && !problem;
    msg.className = `form-msg ${held ? 'form-msg--ok' : 'form-msg--err'}`;
    if (held) msg.innerHTML = heldCodeLine(held);
    else if (problem) msg.textContent = problem;
    part('check').hidden = !!held;
    part('next').hidden = !held;
    form.code.setAttribute('aria-invalid', problem ? 'true' : 'false');
    onShow(held);
  };
  const already = heldGroupCode();
  if (already) form.code.value = already.code;
  show(already, null);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const held = holdGroupCode(form.code.value);
    /* A code that isn't one replaces any code held before — what /join/
       carries is always what this card last said yes to. */
    if (!held) forgetGroupCode();
    else form.code.value = held.code;   // shown the way it is written
    show(held, held ? null : groupCodeProblem(form.code.value));
    if (held) part('next').querySelector('.btn').focus();
  });
  /* Typing again means checking again — the "Create" button never points
     at a code other than the one on screen. */
  form.code.addEventListener('input', () => {
    if (!part('next').hidden) show(null, null);
  });
}
