#!/usr/bin/env node
/* ONEHELM check for "the film a group meeting plays" (Kate, 22 Oct).

   ONE place decides it: the meetingVideos collection, edited in /admin →
   Group meeting videos. Its rows are MEETING_VIDEOS in js/data.js, made from
   SERIES, and loadSeries() in js/groups.js is the only code that puts a film
   on a meeting. This goes red (exit 1) when:

   1. ROWS — a meeting in SERIES has no row, or a row has no meeting, or two
      rows share an id.
   2. DATA — a meeting in SERIES carries its own `video`, a second place
      that would drift from what an editor pasted.
   3. STATIC — any file but js/groups.js reads the meetingVideos collection,
      or sets a meeting's `video` field.

   No network, no browser. Run: node scripts/qa/one-meeting-video.mjs */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SERIES, MEETING_VIDEOS } from '../../js/data.js';
import { COLLECTIONS } from '../../js/content-schema.js';

const ROOT = new URL('../..', import.meta.url).pathname;
const HOME = 'js/groups.js';
const SKIP = new Set(['.git', 'node_modules', '.planning', 'plan', 'scripts', 'assets', 'forgiveness-platform', '.claude']);

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };

console.log('One row per meeting');
const meetings = Object.values(SERIES).flatMap((s) => s.sessions.map((m) => `${s.id}-${m.n}`));
const rows = MEETING_VIDEOS.map((r) => r.id);
ok(meetings.every((id) => rows.includes(id)), `every meeting has a row (${meetings.length} meetings)`);
ok(rows.every((id) => meetings.includes(id)), 'every row is a real meeting');
ok(new Set(rows).size === rows.length, 'no two rows share an id');
ok(COLLECTIONS.meetingVideos?.fixed === true, '/admin can’t add or remove rows (fixed)');

console.log('No meeting carries its own film in data.js');
const own = Object.values(SERIES).flatMap((s) => s.sessions.filter((m) => 'video' in m).map((m) => `${s.id}-${m.n}`));
ok(own.length === 0, own.length ? `meetings with their own video: ${own.join(', ')}` : 'none do');

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(js|mjs|html)$/.test(name)) yield p;
  }
}

console.log(`Only ${HOME} puts a film on a meeting`);
const others = [];
for (const p of files(ROOT)) {
  const rel = relative(ROOT, p);
  if (rel === HOME || rel === 'js/content.js' || rel === 'js/content-schema.js' || rel === 'js/data.js') continue;
  const src = readFileSync(p, 'utf8');
  if (/getCollection\(\s*['"]meetingVideos['"]/.test(src)) others.push(`${rel}: reads meetingVideos`);
  if (/\bMEETING_VIDEOS\b/.test(src)) others.push(`${rel}: uses MEETING_VIDEOS`);
  if (/sessions[\s\S]{0,80}\.map\([^)]*\)\s*=>\s*\(\{[^}]*\bvideo\s*:/.test(src)) others.push(`${rel}: sets a meeting's video`);
}
ok(others.length === 0, others.length ? others.join('; ') : 'no second place');

if (failed) { console.error(`\n${failed} failed`); process.exit(1); }
console.log('\nAll good.');
