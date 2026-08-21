/* storage.js — all data stays in this browser via localStorage. Nothing is ever sent anywhere. */

const KEY = 'reach-forgiveness.v1';

let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    cache = {};
  }
  cache.answers = cache.answers || {};
  return cache;
}

function persist() {
  try {
    cache.updatedAt = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

export const store = {
  get(key, fallback = '') {
    const v = load().answers[key];
    return v === undefined ? fallback : v;
  },
  set(key, value) {
    load().answers[key] = value;
    persist();
  },
  has(key) {
    return load().answers[key] !== undefined && load().answers[key] !== '' && load().answers[key] !== null;
  },
  allAnswers() {
    return { ...load().answers };
  },
  getProgress() {
    return load().progress || null; // {lesson, step}
  },
  setProgress(lesson, step) {
    const d = load();
    d.progress = { lesson, step };
    if (!d.startedAt) d.startedAt = new Date().toISOString();
    persist();
  },
  furthest() {
    return load().furthest || null;
  },
  bumpFurthest(lesson, step) {
    const d = load();
    const f = d.furthest;
    if (!f || lesson > f.lesson || (lesson === f.lesson && step > f.step)) {
      d.furthest = { lesson, step };
    }
    persist();
  },
  completedLessons() {
    return new Set(load().completed || []);
  },
  completeLesson(n) {
    const d = load();
    d.completed = Array.from(new Set([...(d.completed || []), n]));
    persist();
  },
  startedAt() {
    return load().startedAt || null;
  },
  hasAnyData() {
    const d = load();
    return Object.keys(d.answers).length > 0 || !!d.progress;
  },
  eraseAll() {
    cache = null;
    localStorage.removeItem(KEY);
  },
  exportJSON() {
    return JSON.stringify(load(), null, 2);
  },
};
