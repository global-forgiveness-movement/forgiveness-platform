#!/usr/bin/env node
/* ONEHELM check: "the cards under 'where to go next' on the Workbooks page"
   (Kate, 1 Nov: "make it so I can add new resources as we create them").

   ONE list decides which cards show and in what order: the `workbooks`
   collection, edited in /admin with the same add-a-row editor as the About
   team, read through workbookRows() in js/content.js. Red (exit 1) if:
   - workbooks/index.html picks cards by edition name again (the hard-coded
     ['receive', 'activity'] that made the list impossible to extend);
   - a second collection for resources appears in DEFAULTS or the schema;
   - workbooks is marked fixed (no add-a-row) in the admin schema;
   - workbookRows stops doing what the list says.

   Run: node scripts/qa/one-resource-list.mjs */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log(`  ✓ ${msg}`); };

const page = readFileSync(join(ROOT, 'workbooks/index.html'), 'utf8');
ok(!/['"](receive|activity)['"]/.test(page), 'workbooks/index.html names no edition to choose its cards');
ok(/data-render="workbooks-more"/.test(page) && /more\.map\(/.test(page), 'the where-to-go-next cards are drawn from workbookRows().more');

const { DEFAULTS, workbookRows, TOP_EDITIONS } = await import(join(ROOT, 'js/content.js'));
const { COLLECTIONS } = await import(join(ROOT, 'js/content-schema.js'));
const second = Object.keys({ ...DEFAULTS, ...COLLECTIONS }).filter((k) => /resource|more|next/i.test(k));
ok(!second.length, `no second collection for resources (found: ${second.join(', ') || 'none'})`);
ok(COLLECTIONS.workbooks && !COLLECTIONS.workbooks.fixed, 'the workbooks list has add-a-row in /admin');

const ids = (rows) => rows.map((r) => r.id || r.key);
const base = workbookRows(DEFAULTS.workbooks);
ok(ids(base.top).join() === TOP_EDITIONS.join(), `top row: ${TOP_EDITIONS.join(', ')}`);
ok(ids(base.more).join() === 'receive,activity', 'by default: RECEIVE, then the activity book');
const added = workbookRows([...DEFAULTS.workbooks, { id: 'new-guide-x1', name: 'A new guide', desc: 'Kate’s', link: 'https://example.org/g.pdf' }]);
ok(ids(added.more).join() === 'receive,activity,new-guide-x1' && added.more[2].link, 'a row Kate adds appears, last, with its link');
const trimmed = workbookRows(DEFAULTS.workbooks.filter((w) => w.id !== 'receive' && w.id !== 'reach'));
ok(ids(trimmed.more).join() === 'activity', 'a row removed from the list goes from the page');
ok(ids(trimmed.top).join() === TOP_EDITIONS.join() && trimmed.top[0].files, 'the top editions show even if their row is removed, files intact');
const moved = workbookRows([...DEFAULTS.workbooks].reverse());
ok(ids(moved.more).join() === 'activity,receive', 'reordering the list reorders the cards');
ok(moved.more.every((r) => r.files), 'a row matching a hosted edition keeps its files');

if (fails.length) { console.error(`RED — the resource cards have a second decider:\n  ✗ ${fails.join('\n  ✗ ')}`); process.exit(1); }
console.log('green — one list (workbooks, /admin) decides the Workbooks page cards.');
