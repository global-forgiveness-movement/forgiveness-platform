/* The one content path. Every page asks THIS module for its content; it
   answers with the editor-published version from the store when one exists,
   and the committed defaults from data.js otherwise. The site never knows
   which — and keeps working fully if the store is unreachable. */

import { store, withPatience } from './store.js';
import {
  TESTIMONIALS, VIDEOS, EVENTS, PUBLICATIONS, PEOPLE, GROUP_STATS, SERIES,
  WORKBOOKS, REACH_STEPS, GROUP_GUIDELINES, FACILITATOR_KIT, MEETING_VIDEOS,
} from './data.js';

/* Workbook cards: only their words are content. Files, sizes and links stay
   in WORKBOOKS, read by downloadFor() alone — see getWorkbooks(). `link` and
   `button` belong to a resource Kate adds herself (1 Nov): a card with no
   file of ours, whose button opens the address she gives it. */
const WORKBOOK_WORDS = ['badge', 'name', 'desc', 'about', 'pills', 'link', 'button'];

export const DEFAULTS = {
  testimonials: TESTIMONIALS,
  videos: Object.entries(VIDEOS).map(([key, v]) => ({ key, ...v })),
  events: EVENTS,
  publications: PUBLICATIONS,
  people: PEOPLE,
  stats: GROUP_STATS,
  workbooks: WORKBOOKS.map((w) => ({ id: w.id, ...pick(w, WORKBOOK_WORDS) })),
  reach: REACH_STEPS,
  guidelines: GROUP_GUIDELINES.map((text) => ({ text })),
  series: Object.values(SERIES),
  facilitatorKit: FACILITATOR_KIT,
  meetingVideos: MEETING_VIDEOS,
};

/* Rows whose structure is fixed in code: the editor's version only fills in
   `src`, so a meeting added to SERIES still gets its row after a save. */
const ROWS_FROM_CODE = { meetingVideos: ['src'] };

/* Fields added after an editor saved a list: a saved row takes them from the
   committed row with its id until the editor saves its own. */
const FILLED_FROM_CODE = { facilitatorKit: ['edition'] };

export async function getCollection(name) {
  let items = null;
  try {
    const doc = await withPatience(store.get('content', name));
    if (doc?.items?.length) items = doc.items;
  } catch { /* fall through to defaults */ }
  const keep = ROWS_FROM_CODE[name];
  if (keep) {
    const byId = Object.fromEntries((items || []).map((x) => [x.id, x]));
    return DEFAULTS[name].map((row) => ({ ...row, ...pick(byId[row.id] || {}, keep) }));
  }
  const fill = FILLED_FROM_CODE[name];
  if (fill && items) {
    const byId = Object.fromEntries(DEFAULTS[name].map((x) => [x.id, x]));
    return items.map((it) => ({ ...pick(byId[it.id] || {}, fill), ...it }));
  }
  return items || (DEFAULTS[name] ?? []);
}

/* The facilitator's materials — ONE list, the `facilitatorKit` collection,
   edited in /admin with the same add-a-row editor as Workbooks and resources.
   Whether someone gets any is the engine's (view.kit: the editions they lead);
   which rows they get is this. Pure, so scripts/qa/one-facilitator-list.mjs
   can test it. */
const KIT_EDITION = { 'REACH Forgiveness': 'secular', 'Adapted for Churches': 'church' };
export function kitRows(kit, seriesIds) {
  return (kit || []).filter((k) => !KIT_EDITION[k.edition] || seriesIds.includes(KIT_EDITION[k.edition]));
}

/* Videos as a map keyed by slot, for the shell's embed hydration. */
export async function getVideos() {
  const list = await getCollection('videos');
  return Object.fromEntries(list.map((v) => [v.key, v]));
}

/* The workbook cards — ONE list, the `workbooks` collection, edited in
   /admin with the same add-a-row editor as the About team (Kate, 1 Nov: "make
   it so I can add new resources as we create them").
   - `top`: the two editions in the Workbooks page's first row. They always
     show, whatever the list says, because their files are the site's.
   - `more`: every other row, in the list's order — the cards under "If REACH
     Forgiveness helped, here is where to go next". RECEIVE and the activity
     book are rows like any other: remove one and it goes; add one and it
     appears. A row that matches an edition in WORKBOOKS takes its files,
     sizes and languages from there; a row Kate added has its own `link`.
   `key` is the address its words are saved under (fieldAttr), so on-page
   edits land on the right row however the list is ordered. Pure, so
   scripts/qa/one-resource-list.mjs can test it. */
export const TOP_EDITIONS = ['reach', 'church'];
export function workbookRows(edited) {
  const code = Object.fromEntries(WORKBOOKS.map((w) => [w.id, w]));
  const rows = (edited || []).map((e, i) => ({ ...(code[e.id] || {}), ...pick(e, WORKBOOK_WORDS), key: itemKey(e, i) }));
  const top = TOP_EDITIONS.map((id) => rows.find((r) => r.id === id) || { ...code[id] });
  return { top, more: rows.filter((r) => !TOP_EDITIONS.includes(r.id)) };
}
export async function getWorkbooks() {
  return workbookRows(await getCollection('workbooks'));
}

function pick(obj, keys) {
  return Object.fromEntries(keys.filter((k) => obj[k] !== undefined && obj[k] !== '').map((k) => [k, obj[k]]));
}

/* ------------------------------------------- words where they sit */
/* THE CONTRACT (.planning/FLEET-2026-09-28.md): every word the site draws
   from a collection carries data-field="<collection>/<itemKey>/<fieldPath>",
   and the page editor (js/copy.js) saves it back through here. One way to
   name an item, used by every renderer: */
export const itemKey = (item, i) => String(item?.id ?? item?.key ?? i);
export const fieldAttr = (name, item, i, path) =>
  `data-field="${name}/${itemKey(item, i)}/${path}"`;

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const parent = keys.reduce((o, k) => (o[k] ??= {}), obj);
  parent[last] = value;
}

/* Save words edited on the page. `changes` is [{ field, value, isDefault }]:
   `field` a data-field address, `value` the cleaned text, `isDefault(v)` true
   when v reads the same as the value the page was committed with. A field
   typed back to its default takes the default again, and a collection that
   is entirely default again stops being overridden at all — so a later
   change to data.js shows through. Every write lands in History. */
export async function saveFields(changes, editor) {
  const byName = new Map();
  for (const c of changes) {
    const [name, key, ...rest] = c.field.split('/');
    if (!(name in DEFAULTS)) throw new Error(`no collection "${name}" for ${c.field}`);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push({ ...c, key, path: rest.join('/') });
  }
  for (const [name, list] of byName) {
    /* A strict read, never getCollection's patient fallback: saving on top of
       the defaults because the store was slow would wipe other edits. */
    const doc = await store.get('content', name);
    const items = structuredClone(doc?.items?.length ? doc.items : DEFAULTS[name]);
    for (const c of list) {
      const i = items.findIndex((it, n) => itemKey(it, n) === c.key);
      if (i < 0) throw new Error(`no item "${c.key}" in ${name}`);
      const d = DEFAULTS[name].findIndex((it, n) => itemKey(it, n) === c.key);
      const committed = d < 0 ? undefined : getPath(DEFAULTS[name][d], c.path);
      setPath(items[i], c.path, committed !== undefined && c.isDefault(committed) ? committed : c.value);
    }
    if (JSON.stringify(items) === JSON.stringify(DEFAULTS[name])) {
      if (doc) {
        await keepHistory(name, doc, editor);
        await store.remove('content', name);
      }
    } else {
      await saveCollection(name, items, editor);
    }
  }
}

/* ------------------------------------------------------------ pages */
export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

export async function getPages() {
  try {
    return (await withPatience(store.list('pages'))).filter((p) => p.published !== false);
  } catch {
    return [];
  }
}

export async function getPage(slug) {
  try {
    const page = await withPatience(store.get('pages', slug));
    return page && page.published !== false ? { slug, ...page } : null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------- editor writes */
async function keepHistory(target, snapshot, editor) {
  await store.add('contentHistory', {
    target,
    snapshot: JSON.stringify(snapshot),
    savedAt: new Date().toISOString(),
    editor: editor || 'unknown',
  });
}

export async function saveCollection(name, items, editor) {
  const previous = await store.get('content', name);
  await keepHistory(name, previous ?? { items: DEFAULTS[name] ?? [] }, editor);
  await store.set('content', name, { items, updatedAt: new Date().toISOString() });
}

export async function savePage(page, editor) {
  const slug = slugify(page.slug || page.title || 'page');
  const previous = await store.get('pages', slug);
  if (previous) await keepHistory(`page:${slug}`, previous, editor);
  await store.set('pages', slug, { ...page, slug, updatedAt: new Date().toISOString() });
  return slug;
}

/* Page text (js/copy.js): one document, every editable block keyed by its
   data-copy name. Kept in history like everything else, so /admin can restore. */
export async function saveCopy(slots, editor) {
  const previous = await store.get('content', 'copy');
  await keepHistory('copy', previous ?? { slots: {} }, editor);
  /* Replace, not merge: `slots` is the complete set of overrides, and one
     that was removed (typed back to the original) must actually go. A merge
     kept a stale headline live after Wyatt reverted it, 22 Sep. */
  await store.set('content', 'copy', { slots, updatedAt: new Date().toISOString() }, { replace: true });
}

export async function listHistory() {
  const entries = await store.list('contentHistory');
  return entries.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

export async function restoreHistory(entry, editor) {
  const snapshot = JSON.parse(entry.snapshot);
  if (entry.target.startsWith('page:')) {
    await savePage({ ...snapshot, slug: entry.target.slice(5) }, editor);
  } else if (entry.target === 'copy') {
    await saveCopy(snapshot.slots ?? {}, editor);
  } else {
    await saveCollection(entry.target, snapshot.items ?? [], editor);
  }
}

/* Editor allowlist. Demo mode: any signed-in account edits (it's all local to
   the browser anyway, and the admin page says so). Firebase mode: the
   settings/editors doc lists allowed emails — mirrored in security rules. */
export async function isEditor(user) {
  if (!user) return false;
  const { MODE } = await import('./store.js');
  if (MODE === 'demo') return true;
  const doc = await store.get('settings', 'editors');
  return (doc?.emails || []).map((e) => e.toLowerCase()).includes(user.email.toLowerCase());
}
