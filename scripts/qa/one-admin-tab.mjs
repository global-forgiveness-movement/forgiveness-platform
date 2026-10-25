#!/usr/bin/env node
/* Check for "which panel an /admin tab opens" (Kate, 20 Oct).

   Each tab in /admin is named once. The Inbox's account list was once also
   named "people", the same as the About page's team, so the About team could
   not be opened at all. This goes red (exit 1) when a tab named in admin's
   LABELS repeats a collection's name in js/content-schema.js.

   No network, no browser. Run: node scripts/qa/one-admin-tab.mjs */
import { readFileSync } from 'node:fs';
import { COLLECTIONS } from '../../js/content-schema.js';

const ROOT = new URL('../..', import.meta.url).pathname;
const html = readFileSync(`${ROOT}admin/index.html`, 'utf8');
const m = html.match(/const LABELS = \{([^}]*)\}/);
if (!m) { console.error('  ✗ could not find LABELS in admin/index.html'); process.exit(1); }
const tabs = [...m[1].matchAll(/(\w+)\s*:/g)].map((x) => x[1]);
const clash = tabs.filter((t) => t in COLLECTIONS);
if (clash.length) {
  console.error(`  ✗ these tabs share a collection's name: ${clash.join(', ')}`);
  process.exit(1);
}
console.log(`  ✓ ${tabs.length} tabs, none shares a name with the ${Object.keys(COLLECTIONS).length} collections`);
