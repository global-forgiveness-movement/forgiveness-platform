/* Progress-only sync for the interactive workbook.
   What syncs: position (lesson/step), furthest point, completed lessons,
   started/updated timestamps. What never syncs: answers — anything a person
   wrote stays in their browser, by construction: this module never reads the
   `answers` field at all. */

import { store } from './store.js';

const KEY = 'reach-forgiveness.v1'; // the workbook's own localStorage key

function local() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

/* The synced snapshot — answers excluded by listing, not by deleting. */
export function readLocalProgress() {
  const d = local();
  return {
    progress: d.progress || null,
    furthest: d.furthest || null,
    completed: d.completed || [],
    startedAt: d.startedAt || null,
    updatedAt: d.updatedAt || null,
  };
}

function writeLocalPosition(snap) {
  const d = local(); // keeps answers untouched
  d.progress = snap.progress;
  d.furthest = snap.furthest;
  d.completed = snap.completed;
  d.startedAt = d.startedAt || snap.startedAt;
  d.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(d));
}

const later = (a, b) => (!a ? b : !b ? a : a.lesson > b.lesson || (a.lesson === b.lesson && a.step >= b.step) ? a : b);

/* Two-way merge: never lose progress from either side. */
export async function syncProgress(uid) {
  const mine = readLocalProgress();
  const theirs = (await store.get('progress', uid)) || {};
  const merged = {
    progress: (theirs.updatedAt || '') > (mine.updatedAt || '') ? theirs.progress || mine.progress : mine.progress || theirs.progress,
    furthest: later(mine.furthest, theirs.furthest),
    completed: [...new Set([...(mine.completed || []), ...(theirs.completed || [])])].sort((a, b) => a - b),
    startedAt: mine.startedAt || theirs.startedAt || null,
    updatedAt: new Date().toISOString(),
  };
  if (merged.progress || merged.furthest || merged.completed.length) {
    writeLocalPosition(merged);
    await store.set('progress', uid, merged);
  }
  return merged;
}
