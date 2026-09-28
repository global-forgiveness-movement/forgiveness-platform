/* The one content path. Every page asks THIS module for its content; it
   answers with the editor-published version from the store when one exists,
   and the committed defaults from data.js otherwise. The site never knows
   which — and keeps working fully if the store is unreachable. */

import { store, withPatience } from './store.js';
import {
  TESTIMONIALS, VIDEOS, EVENTS, PUBLICATIONS, PEOPLE, GROUP_STATS,
  WORKBOOKS, REACH_STEPS, GROUP_GUIDELINES,
} from './data.js';

/* Workbook cards: only their words are content. Files, sizes and links stay
   in WORKBOOKS, read by downloadFor() alone — see getWorkbooks(). */
const WORKBOOK_WORDS = ['badge', 'title', 'desc', 'pills'];

const DEFAULTS = {
  testimonials: TESTIMONIALS,
  videos: Object.entries(VIDEOS).map(([key, v]) => ({ key, ...v })),
  events: EVENTS,
  publications: PUBLICATIONS,
  people: PEOPLE,
  stats: GROUP_STATS,
  workbooks: WORKBOOKS.map((w) => ({ id: w.id, ...pick(w, WORKBOOK_WORDS) })),
  reach: REACH_STEPS,
  guidelines: GROUP_GUIDELINES.map((text) => ({ text })),
};

export async function getCollection(name) {
  try {
    const doc = await withPatience(store.get('content', name));
    if (doc?.items?.length) return doc.items;
  } catch { /* fall through to defaults */ }
  return DEFAULTS[name] ?? [];
}

/* Videos as a map keyed by slot, for the shell's embed hydration. */
export async function getVideos() {
  const list = await getCollection('videos');
  return Object.fromEntries(list.map((v) => [v.key, v]));
}

/* The workbook cards: every structural fact (files, sizes, languages, the
   landing page) from WORKBOOKS, with an editor's words laid over the top.
   Editions are fixed in code, so an added or removed item here changes
   nothing — a new edition needs its files first. */
export async function getWorkbooks() {
  const edited = await getCollection('workbooks');
  return WORKBOOKS.map((w) => {
    const e = edited.find((x) => x.id === w.id);
    return e ? { ...w, ...pick(e, WORKBOOK_WORDS) } : w;
  });
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
