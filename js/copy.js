/* Page text an editor can change in place.

   Every editable block in the site's HTML carries data-copy="page.tag.words".
   The HTML itself is the default; an editor's version lives in ONE document,
   content/copy → { slots: { key: html } }, and wins when present. If the
   store is unreachable the committed text simply stays — the site never
   depends on this to read correctly.

   Wyatt's rulings, 21 Sep: edit on the page itself; a save goes live
   immediately and is kept in history (restorable from /admin); privacy
   promises are never marked editable — the code has to make those words
   literally true, so they only change with the code. */

import { store, withPatience } from './store.js';
import { saveCopy, isEditor } from './content.js';

const SLOTS = () => [...document.querySelectorAll('[data-copy]')];
const defaults = new Map();   // key → committed HTML, captured before overrides
let published = {};           // key → editor HTML currently live

/* ---------------------------------------------------------- sanitizing */
/* Editors are trusted, but whatever they save renders for every visitor, so
   it is reduced to the handful of things copy needs: emphasis, links, breaks. */
const ALLOWED = new Set(['B', 'STRONG', 'I', 'EM', 'A', 'BR']);
const safeHref = (h) => /^(https?:|mailto:|\/|\.\.?\/|#)/i.test(h || '') || (!!h && !/^[a-z]+:/i.test(h));

export function sanitize(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) return;
      if (n.nodeType === Node.ELEMENT_NODE && /^(SCRIPT|STYLE|TEMPLATE|IFRAME|OBJECT)$/.test(n.tagName)) {
        n.remove();   // contents too — never meant to be read as copy
        return;
      }
      if (n.nodeType !== Node.ELEMENT_NODE || !ALLOWED.has(n.tagName)) {
        const text = document.createTextNode(n.textContent || '');
        n.replaceWith(text);
        return;
      }
      const href = n.tagName === 'A' ? n.getAttribute('href') : null;
      [...n.attributes].forEach((a) => n.removeAttribute(a.name));
      if (n.tagName === 'A' && safeHref(href)) n.setAttribute('href', href);
      walk(n);
    });
  };
  walk(tpl.content);
  return tpl.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------ applying */
export async function applyCopy() {
  SLOTS().forEach((el) => defaults.set(el.dataset.copy, el.innerHTML));
  try {
    const doc = await withPatience(store.get('content', 'copy'));
    published = doc?.slots || {};
  } catch { published = {}; }
  SLOTS().forEach((el) => {
    const html = published[el.dataset.copy];
    if (typeof html === 'string') el.innerHTML = sanitize(html);
  });
}

/* ------------------------------------------------------------- editing */
let bar;
let editing = false;
let before = new Map();

function setEditing(on) {
  editing = on;
  document.documentElement.toggleAttribute('data-copy-editing', on);
  SLOTS().forEach((el) => {
    if (on) { el.setAttribute('contenteditable', 'true'); el.setAttribute('spellcheck', 'true'); }
    else { el.removeAttribute('contenteditable'); el.removeAttribute('spellcheck'); }
  });
  render();
}

function changedKeys() {
  return SLOTS().filter((el) => sanitize(el.innerHTML) !== sanitize(before.get(el.dataset.copy) ?? '')).map((el) => el.dataset.copy);
}

function render(msg = '') {
  if (!bar) return;
  if (!editing) {
    bar.innerHTML = `<button type="button" class="copybar-btn" data-copy-act="start">Edit page text</button>${msg ? `<span class="copybar-msg">${msg}</span>` : ''}`;
    return;
  }
  const n = changedKeys().length;
  bar.innerHTML = `
    <span class="copybar-msg">Editing — click any outlined text. In a headline, select words and press ⌘I to colour them. ${n ? `<b>${n} unsaved change${n === 1 ? '' : 's'}</b>` : 'No changes yet.'}</span>
    <button type="button" class="copybar-btn copybar-btn--primary" data-copy-act="save" ${n ? '' : 'disabled'}>Save — goes live</button>
    <button type="button" class="copybar-btn" data-copy-act="cancel">Cancel</button>`;
}

async function save(editorEmail) {
  const keys = changedKeys();
  if (!keys.length) return;
  const next = { ...published };
  keys.forEach((k) => {
    const el = document.querySelector(`[data-copy="${CSS.escape(k)}"]`);
    const html = sanitize(el.innerHTML);
    // Typed back to the original? Then there is nothing to override.
    if (html === sanitize(defaults.get(k) ?? '')) delete next[k];
    else next[k] = html;
    el.innerHTML = html;
  });
  bar.querySelector('[data-copy-act="save"]').disabled = true;
  try {
    await saveCopy(next, editorEmail);
    published = next;
    setEditing(false);
    render(`Saved — live now. Every version is kept in /admin → History.`);
  } catch (err) {
    console.error(err);
    render('');
    bar.insertAdjacentHTML('beforeend', '<span class="copybar-msg copybar-msg--err">That didn’t save. Nothing changed on the live site — try again.</span>');
  }
}

function cancel() {
  SLOTS().forEach((el) => { if (before.has(el.dataset.copy)) el.innerHTML = before.get(el.dataset.copy); });
  setEditing(false);
}

function wireEditor(user) {
  bar = document.createElement('div');
  bar.className = 'copybar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Edit page text');
  document.body.append(bar);
  render();

  bar.addEventListener('click', (e) => {
    const act = e.target.closest('[data-copy-act]')?.dataset.copyAct;
    if (act === 'start') {
      before = new Map(SLOTS().map((el) => [el.dataset.copy, el.innerHTML]));
      setEditing(true);
    }
    if (act === 'save') save(user.email);
    if (act === 'cancel') cancel();
  });

  /* While editing, a click on an editable link or button edits it rather than
     following it. Capture phase, so the site's own click handlers never see it. */
  document.addEventListener('click', (e) => {
    if (editing && e.target.closest('[data-copy]')) e.preventDefault();
  }, true);

  document.addEventListener('input', (e) => {
    if (editing && e.target.closest('[data-copy]')) render();
  });

  /* Headings and button labels are one line; paragraphs may take Shift+Enter. */
  document.addEventListener('keydown', (e) => {
    const el = editing && e.target.closest?.('[data-copy]');
    if (!el || e.key !== 'Enter') return;
    if (el.tagName === 'P' && e.shiftKey) return;
    e.preventDefault();
  });

  /* Paste arrives as plain text, so Word or Google Docs formatting can't ride in. */
  document.addEventListener('paste', (e) => {
    if (!editing || !e.target.closest?.('[data-copy]')) return;
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
}

/* Called once per page by the shell. Visitors get the text; editors also get the bar. */
export async function mountCopy() {
  if (!document.querySelector('[data-copy]')) return;
  await applyCopy();
  try {
    const { onAuth } = await import('./auth.js');
    let mounted = false;
    onAuth(async (u) => {
      if (mounted || !u) return;
      if (await isEditor(u)) { mounted = true; wireEditor(u); }
    });
  } catch { /* no auth, no editing — the page still reads fine */ }
}
