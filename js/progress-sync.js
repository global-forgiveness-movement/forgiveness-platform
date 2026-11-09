/* Progress-only sync for the interactive workbook.
   What syncs: position (lesson/step), furthest point, completed lessons,
   started/updated timestamps. What never syncs: answers — anything a person
   wrote stays in their browser, by construction: this module never reads the
   `answers` field at all.

   Each edition (js/workbook-editions.js) keeps its own place: on this device
   under its own key, and in progress/{uid} the REACH place at the top (where it
   has always been) and the church edition's under one field beside it. Writing
   one edition never touches the other's. */

import { store, withPatience, MODE } from './store.js';
import { WORKBOOK_EDITIONS } from './workbook-editions.js';

const edition = (id) => WORKBOOK_EDITIONS[id] || WORKBOOK_EDITIONS.reach;

function local(id) {
  try {
    return JSON.parse(localStorage.getItem(edition(id).key)) || {};
  } catch {
    return {};
  }
}

/* The synced snapshot — answers excluded by listing, not by deleting. */
export function readLocalProgress(id = 'reach') {
  const d = local(id);
  return {
    progress: d.progress || null,
    furthest: d.furthest || null,
    completed: d.completed || [],
    startedAt: d.startedAt || null,
    updatedAt: d.updatedAt || null,
  };
}

function writeLocalPosition(id, snap) {
  const d = local(id); // keeps answers untouched
  d.progress = snap.progress;
  d.furthest = snap.furthest;
  d.completed = snap.completed;
  d.startedAt = d.startedAt || snap.startedAt;
  d.updatedAt = new Date().toISOString();
  localStorage.setItem(edition(id).key, JSON.stringify(d));
}

const later = (a, b) => (!a ? b : !b ? a : a.lesson > b.lesson || (a.lesson === b.lesson && a.step >= b.step) ? a : b);
const POSITION = ['progress', 'furthest', 'completed', 'startedAt', 'updatedAt'];
const positionOf = (doc) => Object.fromEntries(POSITION.filter((k) => doc?.[k] !== undefined).map((k) => [k, doc[k]]));

/* Two-way merge: never lose progress from either side. */
export async function syncProgress(uid, id = 'reach') {
  const { remote } = edition(id);
  const mine = readLocalProgress(id);
  /* The backend is optional here. If it is slow or unreachable we sync nothing
     and answer from this device — a person's own progress is still true, and
     the caller must never be left with nothing to render. */
  let doc = {};
  let reachable = true;
  try {
    doc = (await withPatience(store.get('progress', uid))) || {};
  } catch {
    reachable = false;
  }
  const theirs = remote ? doc[remote] || {} : positionOf(doc);
  const merged = {
    progress: (theirs.updatedAt || '') > (mine.updatedAt || '') ? theirs.progress || mine.progress : mine.progress || theirs.progress,
    furthest: later(mine.furthest, theirs.furthest),
    completed: [...new Set([...(mine.completed || []), ...(theirs.completed || [])])].sort((a, b) => a - b),
    startedAt: mine.startedAt || theirs.startedAt || null,
    updatedAt: new Date().toISOString(),
  };
  if (merged.progress || merged.furthest || merged.completed.length) {
    writeLocalPosition(id, merged);
    if (reachable) {
      /* Firestore merges, so only this edition's place is written and the
         other's is never rewritten from a stale read. The demo backend
         replaces a record, so there the whole record goes back. */
      const own = remote ? { [remote]: merged } : merged;
      const next = MODE === 'demo' ? { ...doc, ...own } : own;
      try { await store.set('progress', uid, next); } catch { /* keep the local copy */ }
    }
  }
  return merged;
}
