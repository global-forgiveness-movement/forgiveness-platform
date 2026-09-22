/* The one content path. Every page asks THIS module for its content; it
   answers with the editor-published version from the store when one exists,
   and the committed defaults from data.js otherwise. The site never knows
   which — and keeps working fully if the store is unreachable. */

import { store, withPatience } from './store.js';
import {
  TESTIMONIALS, VIDEOS, EVENTS, PUBLICATIONS, PEOPLE, GROUP_STATS,
} from './data.js';

const DEFAULTS = {
  testimonials: TESTIMONIALS,
  videos: Object.entries(VIDEOS).map(([key, v]) => ({ key, ...v })),
  events: EVENTS,
  publications: PUBLICATIONS,
  people: PEOPLE,
  stats: GROUP_STATS,
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
