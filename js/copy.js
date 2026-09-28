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
import { saveCopy, saveFields, isEditor } from './content.js';

/* ONE editor for both kinds of words (Wyatt, 28 Sep: "all text is editable
   where it sits, and the site handles the data structure backend"):
   - data-copy="page.tag.words" — words written into the page's HTML, saved
     to content/copy as above;
   - data-field="collection/item/path" — words the site draws from a content
     collection (testimonials, people, the workbook cards...), saved back into
     that collection through saveFields (js/content.js), so /admin History
     keeps and restores them like any other save.
   The editor never asks which kind it is holding until the moment it saves.
   Elements drawn after the bar mounts (collections load late) are picked up
   as they appear. */
const EDITABLE = '[data-copy], [data-field]';
const SLOTS = () => [...document.querySelectorAll(EDITABLE)];
const defaults = new Map();   // data-copy key → committed HTML, captured before overrides
let published = {};           // data-copy key → editor HTML currently live

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
/* A data-copy element takes its override the moment it exists — at load, or
   later when a renderer draws it (the same label repeated on every card). */
function adoptCopy(el) {
  const key = el.dataset.copy;
  if (!defaults.has(key)) defaults.set(key, el.innerHTML);
  const html = published[key];
  if (typeof html === 'string') el.innerHTML = sanitize(html);
}

export async function applyCopy() {
  try {
    const doc = await withPatience(store.get('content', 'copy'));
    published = doc?.slots || {};
  } catch { published = {}; }
  document.querySelectorAll('[data-copy]').forEach(adoptCopy);
}

/* ------------------------------------------------------ reading a value */
/* Most words are one run of text. A field marked data-field-format=
   "paragraphs" (a bio) is several, stored with a blank line between. */
function valueOf(el, html = el.innerHTML) {
  if (el.dataset.fieldFormat !== 'paragraphs') return sanitize(html);
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const paras = [];
  let loose = '';
  const flush = () => { if (sanitize(loose)) paras.push(sanitize(loose)); loose = ''; };
  tpl.content.childNodes.forEach((n) => {
    if (n.nodeType === 1 && /^(P|DIV)$/.test(n.tagName)) { flush(); if (sanitize(n.innerHTML)) paras.push(sanitize(n.innerHTML)); }
    else loose += n.nodeType === 1 ? n.outerHTML : n.textContent;
  });
  flush();
  return paras.join('\n\n');
}
const sameText = (el) => (committed) => {
  if (typeof committed !== 'string') return false;
  const html = el.dataset.fieldFormat === 'paragraphs'
    ? committed.split('\n\n').map((p) => `<p>${p}</p>`).join('') : committed;
  return valueOf(el, html) === valueOf(el);
};

/* ------------------------------------------------------------- editing */
let bar;
let editing = false;
let before = new WeakMap();   // element → its HTML when editing began (or when it appeared)

function makeEditable(el, on) {
  if (on) {
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'true');
    if (!before.has(el)) before.set(el, el.innerHTML);
  } else {
    el.removeAttribute('contenteditable');
    el.removeAttribute('spellcheck');
  }
}

function setEditing(on) {
  editing = on;
  document.documentElement.toggleAttribute('data-copy-editing', on);
  SLOTS().forEach((el) => makeEditable(el, on));
  render();
}

function changed() {
  return SLOTS().filter((el) => before.has(el) && valueOf(el) !== valueOf(el, before.get(el)));
}

/* The Color button (Wyatt, 28 Sep, ruling 3): it works in every heading on
   every page, and is grayed out unless the selected words sit in one. */
function selectedHeading() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed) return null;
  const node = sel.getRangeAt(0).commonAncestorContainer;
  const el = node.nodeType === 1 ? node : node.parentElement;
  const head = el?.closest('h1, h2, h3');
  return head && el.closest(EDITABLE) ? head : null;
}

function syncColor() {
  const btn = bar?.querySelector('[data-copy-act="accent"]');
  if (!btn) return;
  const ok = !!selectedHeading();
  btn.disabled = !ok;
  btn.title = ok ? 'Color the selected words' : 'Select words in a heading to color them';
}

function render(msg = '') {
  if (!bar) return;
  if (!editing) {
    bar.innerHTML = `<button type="button" class="copybar-btn" data-copy-act="start">Edit page text</button>${msg ? `<span class="copybar-msg">${msg}</span>` : ''}`;
    return;
  }
  const n = changed().length;
  bar.innerHTML = `
    <span class="copybar-msg">Editing — click any outlined text. To color words in a heading, select them and press <b>Color</b>. ${msg ? `<b>${msg}</b> ` : ''}${n ? `<b>${n} unsaved change${n === 1 ? '' : 's'}</b>` : 'No changes yet.'}</span>
    <button type="button" class="copybar-btn" data-copy-act="accent">Color</button>
    <button type="button" class="copybar-btn copybar-btn--primary" data-copy-act="save" ${n ? '' : 'disabled'}>Save — goes live</button>
    <button type="button" class="copybar-btn" data-copy-act="cancel">Cancel</button>`;
  syncColor();
}

async function save(editorEmail) {
  const els = changed();
  if (!els.length) return;
  const nextCopy = { ...published };
  let copyTouched = false;
  const fields = [];
  els.forEach((el) => {
    const value = valueOf(el);
    if (el.dataset.copy) {
      const k = el.dataset.copy;
      // Typed back to the original? Then there is nothing to override.
      if (value === sanitize(defaults.get(k) ?? '')) delete nextCopy[k];
      else nextCopy[k] = value;
      copyTouched = true;
    } else {
      fields.push({ field: el.dataset.field, value, isDefault: sameText(el) });
    }
  });
  bar.querySelector('[data-copy-act="save"]').disabled = true;
  try {
    if (copyTouched) await saveCopy(nextCopy, editorEmail);
    if (fields.length) await saveFields(fields, editorEmail);
    if (copyTouched) published = nextCopy;
    /* The same words may sit in more than one place on the page (a label on
       every card): all of them show what was saved. */
    els.forEach((el) => {
      const html = el.dataset.fieldFormat === 'paragraphs'
        ? valueOf(el).split('\n\n').map((p) => `<p>${p}</p>`).join('') : valueOf(el);
      const sel = el.dataset.copy ? `[data-copy="${CSS.escape(el.dataset.copy)}"]` : `[data-field="${CSS.escape(el.dataset.field)}"]`;
      document.querySelectorAll(sel).forEach((twin) => { twin.innerHTML = html; });
    });
    before = new WeakMap();
    setEditing(false);
    render(`Saved — live now. Every version is kept in /admin → History.`);
  } catch (err) {
    console.error(err);
    render('');
    bar.insertAdjacentHTML('beforeend', '<span class="copybar-msg copybar-msg--err">That didn’t save. Nothing changed on the live site — try again.</span>');
  }
}

/* Color a phrase in a heading. It toggles the phrase's italic, which the
   stylesheet renders upright in the accent color (h1 i, h2 i, h3 i). A button
   rather than Cmd+I: Safari keeps Cmd+I for "Email This Page", and a shortcut
   is invisible anyway. Headings only — in body text italic stays italic. */
function accent() {
  if (!selectedHeading()) return;
  try { document.execCommand('styleWithCSS', false, false); } catch { /* older engines */ }
  document.execCommand('italic');
  render();
}

function cancel() {
  SLOTS().forEach((el) => { if (before.has(el)) el.innerHTML = before.get(el); });
  before = new WeakMap();
  setEditing(false);
}

function wireEditor(user) {
  bar = document.createElement('div');
  bar.className = 'copybar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Edit page text');
  document.body.append(bar);
  render();

  /* Pressing a button normally clears the text selection before the click
     lands; holding it lets Color act on the words the editor selected. */
  bar.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-copy-act="accent"]')) e.preventDefault();
  });

  bar.addEventListener('click', (e) => {
    const act = e.target.closest('[data-copy-act]')?.dataset.copyAct;
    if (act === 'start') {
      before = new WeakMap();
      setEditing(true);
    }
    if (act === 'save') save(user.email);
    if (act === 'cancel') cancel();
    if (act === 'accent') accent();
  });

  document.addEventListener('selectionchange', () => { if (editing) syncColor(); });

  /* While editing, a click on an editable link or button edits it rather than
     following it. Capture phase, so the site's own click handlers never see it. */
  document.addEventListener('click', (e) => {
    if (editing && e.target.closest(EDITABLE)) e.preventDefault();
  }, true);

  document.addEventListener('input', (e) => {
    if (editing && e.target.closest(EDITABLE)) render();
  });

  document.addEventListener('keydown', (e) => {
    const el = editing && e.target.closest?.(EDITABLE);
    if (!el) return;
    /* Inside a <summary> (a bio card) the space bar would fold the card. */
    if (e.key === ' ' && el.closest('summary')) {
      e.preventDefault();
      document.execCommand('insertText', false, ' ');
      return;
    }
    /* Headings and labels are one line; paragraphs may take Shift+Enter, and
       a multi-paragraph field (a bio) takes Enter for a new paragraph. */
    if (e.key !== 'Enter') return;
    if (el.dataset.fieldFormat === 'paragraphs') return;
    if (el.tagName === 'P' && e.shiftKey) return;
    e.preventDefault();
  });

  /* Paste arrives as plain text, so Word or Google Docs formatting can't ride in. */
  document.addEventListener('paste', (e) => {
    if (!editing || !e.target.closest?.(EDITABLE)) return;
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
}

/* Words drawn after load — a collection arriving, a series redrawn — join
   in as they appear: page-text overrides land on them, and while editing
   they are editable straight away. */
function watchLateWords() {
  new MutationObserver((records) => {
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        const found = [...(n.matches(EDITABLE) ? [n] : []), ...n.querySelectorAll(EDITABLE)];
        found.forEach((el) => {
          if (el.dataset.copy) adoptCopy(el);
          if (editing && !el.isContentEditable) makeEditable(el, true);
        });
        if (found.length) onWords?.();
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
}
let onWords = null;

/* Called once per page by the shell. Visitors get the text; editors also get
   the bar — once the page has any words to edit, which on some pages is only
   after a collection has drawn them. */
export async function mountCopy() {
  await applyCopy();
  watchLateWords();
  try {
    const { onAuth } = await import('./auth.js');
    let mounted = false;
    let who = null;
    const tryMount = () => {
      if (mounted || !who || !document.querySelector(EDITABLE)) return;
      mounted = true;
      wireEditor(who);
    };
    onWords = tryMount;
    onAuth(async (u) => {
      if (mounted || !u) return;
      if (await isEditor(u)) { who = u; tryMount(); }
    });
  } catch { /* no auth, no editing — the page still reads fine */ }
}
