#!/usr/bin/env node
/* ONEHELM check: "what a facilitator sees under Your materials on My Path"
   (Wyatt, 3 Nov: Kate adds materials the same way as Workbooks and resources).

   ONE list decides: the `facilitatorKit` collection, edited in /admin with
   add-a-row, read through kitRows() in js/content.js. Red (exit 1) if:
   - My Path or the engine names a row again (manual-…, 'film');
   - the list loses add-a-row in the admin schema;
   - kitRows stops following the list.

   Run: node scripts/qa/one-facilitator-list.mjs */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log(`  ✓ ${msg}`); };

const page = readFileSync(join(ROOT, 'my-path/index.html'), 'utf8');
const engine = readFileSync(join(ROOT, 'js/group-engine.js'), 'utf8');
for (const [name, src] of [['my-path/index.html', page], ['js/group-engine.js', engine]]) {
  ok(!/manual-|['"]film['"]/.test(src), `${name} names no row of the list`);
}
ok(/kitRows\(/.test(page), 'My Path draws its rows from kitRows()');

const { DEFAULTS, kitRows } = await import(join(ROOT, 'js/content.js'));
const { COLLECTIONS } = await import(join(ROOT, 'js/content-schema.js'));
const { isFilm } = await import(join(ROOT, 'js/video.js'));
ok(!COLLECTIONS.facilitatorKit.fixed, 'the list has add-a-row in /admin');

const ids = (rows) => rows.map((r) => r.id).join();
ok(ids(kitRows(DEFAULTS.facilitatorKit, ['secular'])) === 'manual-secular,film', 'a REACH leader: the REACH manual and the film');
ok(ids(kitRows(DEFAULTS.facilitatorKit, ['church'])) === 'manual-church,film', 'a church leader: the church manual and the film');
ok(ids(kitRows(DEFAULTS.facilitatorKit, ['secular', 'church'])) === 'manual-secular,manual-church,film', 'someone leading both gets both');
const added = [...DEFAULTS.facilitatorKit, { id: 'q-1', edition: 'Adapted for Churches' }, { id: 'q-2', edition: 'Both editions' }, { id: 'q-3' }];
ok(ids(kitRows(added, ['secular'])) === 'manual-secular,film,q-2,q-3', 'an added row shows, by its edition; no edition means both');
ok(ids(kitRows(added, ['church'])) === 'manual-church,film,q-1,q-2,q-3', 'a church row reaches church leaders, in list order');
ok(isFilm('https://vimeo.com/1239523658?fl=ip') && isFilm('https://youtu.be/abc'), 'Vimeo and YouTube links play on the page');
ok(!isFilm('https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:9918') && !isFilm('https://drive.google.com/file/d/x') && !isFilm(''), 'any other link is a file to open, never an iframe');

if (fails.length) { console.error(`RED — the facilitator's materials have a second decider:\n  ✗ ${fails.join('\n  ✗ ')}`); process.exit(1); }
console.log('green — one list (facilitatorKit, /admin) decides what a facilitator sees.');
