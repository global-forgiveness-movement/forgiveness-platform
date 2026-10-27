#!/usr/bin/env node
/* ONEHELM check for "the order of a page's sections, and their bands"
   (Kate, 27 Oct).

   ONE place decides it: js/page-order.js, from the page's own HTML (its
   <main data-page> and data-section names) and the editor's saved list. This
   goes red (exit 1) when:

   1. MARKUP — a page in ORDERED_PAGES has a section with no name or label, a
      repeated name, anything inside <main> that isn't a named section, or no
      locked opening that holds the page's <h1>.
   2. BANDS — a page's HTML disagrees with bandsFor(), so the page would
      change colors the moment the script ran.
   3. RULE — orderedNames() mishandles a saved list (unknown names, sections
      added since, locked sections).
   4. STATIC — any file but js/page-order.js reads data-section to move
      sections (admin may read it, through sectionsOf()).

   No network, no browser. Run: node scripts/qa/one-page-order.mjs */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ORDERED_PAGES, orderedNames, bandsFor } from '../../js/page-order.js';

const ROOT = new URL('../..', import.meta.url).pathname;
const SKIP = new Set(['.git', 'node_modules', '.planning', 'plan', 'scripts', 'assets', 'forgiveness-platform', '.claude']);
let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1] || '';

for (const page of ORDERED_PAGES) {
  const file = `${page.path}index.html`;
  console.log(`${page.label} (${file})`);
  const html = readFileSync(join(ROOT, file), 'utf8');
  const mainOpen = html.match(/<main[^>]*>/)?.[0] || '';
  ok(attr(mainOpen, 'data-page') === page.id, `<main data-page="${page.id}">`);
  const body = html.slice(html.indexOf(mainOpen) + mainOpen.length, html.indexOf('</main>'));
  /* Top-level children of <main>: strip comments, then every opening tag at
     depth 0 must be a <section>. */
  const bare = body.replace(/<!--[\s\S]*?-->/g, '');
  const tops = [];
  let depth = 0;
  for (const m of bare.matchAll(/<(\/?)(section|div|p|figure|aside|nav|header|footer|h[1-6]|ul|ol)\b[^>]*>/g)) {
    if (m[1]) { depth--; continue; }
    if (depth === 0) tops.push(m[0]);
    depth++;
  }
  const secs = tops.filter((t) => t.startsWith('<section')).map((t, i) => ({
    tag: t, name: attr(t, 'data-section'), label: attr(t, 'data-section-label'),
    lock: attr(t, 'data-section-lock'), band: attr(t, 'data-band'), paper: /\bsection--paper\b/.test(attr(t, 'class')), i,
  }));
  ok(tops.length === secs.length, 'everything in <main> is a section');
  ok(secs.every((s) => s.name && s.label), 'every section has a name and a label');
  ok(new Set(secs.map((s) => s.name)).size === secs.length, 'no name is used twice');
  const firsts = secs.filter((s) => s.lock === 'first');
  ok(firsts.length === 1 && firsts[0].i === 0, 'one locked opening, and it comes first');
  const firstChunk = bare.split(/<section\b/)[1] || '';
  ok(/<h1\b/.test(firstChunk), 'the opening holds the page’s <h1>');
  const lasts = secs.filter((s) => s.lock === 'last');
  ok(lasts.every((s) => s.i === secs.length - 1), 'a locked last section comes last');
  const bands = bandsFor(secs);
  const wrong = secs.filter((s, i) => bands[i] !== null && (bands[i] === 'paper') !== s.paper).map((s) => s.name);
  ok(wrong.length === 0, wrong.length ? `the HTML disagrees with the band rule: ${wrong.join(', ')}` : 'the HTML’s bands match the band rule');
}

console.log('The order rule');
const D = [{ name: 'a', lock: 'first' }, { name: 'b' }, { name: 'c' }, { name: 'd' }, { name: 'z', lock: 'last' }];
const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);
ok(eq(orderedNames(D, null), ['a', 'b', 'c', 'd', 'z']), 'no saved list: the HTML order');
ok(eq(orderedNames(D, ['a', 'd', 'b', 'c', 'z']), ['a', 'd', 'b', 'c', 'z']), 'a saved list is followed');
ok(eq(orderedNames(D, ['d', 'gone', 'b', 'c']), ['a', 'd', 'b', 'c', 'z']), 'unknown names dropped, locked sections pinned');
ok(eq(orderedNames(D, ['c', 'b']), ['a', 'c', 'd', 'b', 'z']), 'a section added since is kept after the one it follows in the HTML');
ok(eq(orderedNames(D, ['z', 'b', 'a', 'c', 'd']), ['a', 'b', 'c', 'd', 'z']), 'a saved list can’t move a locked section');
ok(eq(bandsFor([{}, { band: 'join' }, {}, { band: 'own' }, {}]), ['paper', 'paper', 'plain', null, 'plain']), 'bands: alternate, join, own');

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(js|mjs|html)$/.test(name)) yield p;
  }
}
console.log('Only js/page-order.js moves sections');
const others = [];
for (const p of files(ROOT)) {
  const rel = relative(ROOT, p);
  if (rel === 'js/page-order.js') continue;
  const src = readFileSync(p, 'utf8').replace(/<section [^>]*>/g, '');
  if (/dataset\.section\b|\[data-section[\]=]|data-section-lock/.test(src) && rel !== 'admin/index.html') others.push(rel);
  if (rel === 'admin/index.html' && /dataset\.section\b|querySelectorAll\(['"][^'"]*data-section/.test(src)) others.push(`${rel} (reads sections itself)`);
}
ok(others.length === 0, others.length ? `a second place reads sections: ${others.join(', ')}` : 'no second place');

if (failed) { console.error(`\n${failed} failed`); process.exit(1); }
console.log('\nAll good.');
