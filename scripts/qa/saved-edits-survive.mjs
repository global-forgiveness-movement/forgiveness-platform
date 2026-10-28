#!/usr/bin/env node
/* PRE-PUSH check: "a push never erases what Kate or Wyatt wrote on the page"
   (Wyatt, 27 Oct 2026).

   Saved edits live in the store, not the repo: content/copy holds the
   data-copy words, content/<collection> the data-field words. A push can't
   overwrite them, because they win at load. But it CAN make them vanish:
   rename or delete the element that carries the key, or hide it. This
   serves two copies of the site, origin/main (what is live) and HEAD (what a
   push sends; `--tree` serves the working folder instead, uncommitted edits
   and all), reads the LIVE saved edits through the
   site's own store.js, visits every page of each, and goes red when a saved
   edit that shows today would no longer show anywhere after the push.
   Saved values no page draws today (video links, photos) are not this
   push's doing; they are counted, not failed.

   It also lists, without failing, the words you changed in code that a saved
   edit is covering, so you know your new default won't show.

   Exit 0 = every saved edit still shows. 1 = one would disappear. 2 = the
   check couldn't run (a check that can't see is not a green).
   Needs Playwright (found in the project, the global root, or ~/.pw). */

import { createServer } from 'node:http';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { homedir, tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(new URL('../..', import.meta.url).pathname);
const sh = (cmd) => execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();

/* Every page a saved edit could be shown on: each page's index.html, except
   the apps that keep their own words (plan, the interactive workbook, admin). */
const PAGES = sh(`git ls-files '*index.html'`).split('\n').filter(Boolean)
  .filter((p) => !/^(plan|workbook|admin|forgiveness-platform|\.planning|home2)\//.test(p))
  .map((p) => p.replace(/index\.html$/, ''));

/* Saved edits hidden ON PURPOSE. Each is a decision with a name and a date;
   add one here only when hiding it is the point, and delete it when the
   words show again. */
const HIDDEN_ON_PURPOSE = {
  'workbooks/reach/badge': 'Workbooks top row is names and buttons only (Wyatt, 27 Oct; sheet row 63)',
  'workbooks/reach/desc': 'same',
  'workbooks/church/badge': 'same',
  'workbooks/church/desc': 'same',
  'home.b.on-your-own': 'Home: the two-picture band folded into the doors; the door headings name them (Wyatt, 27 Oct)',
  'home.b.in-a-forgiveness-group': 'same',
};

/* ------------------------------------------------------------ serve */
/* The live code, unpacked from origin/main into a throwaway folder. */
try { sh('git fetch -q origin main'); } catch { /* offline: the last fetched main */ }
const unpack = async (ref) => {
  const dir = await mkdtemp(join(tmpdir(), 'gfm-'));
  execSync(`git archive ${ref} | tar -x -C ${dir}`, { cwd: ROOT });
  return dir;
};
const LIVE = await unpack('origin/main');
const TREE = process.argv.includes('--tree');
const PUSHED = TREE ? ROOT : await unpack('HEAD');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const servers = [];
async function serve(root) {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const body = await readFile(join(root, p));
      res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}/`;
}
const NOW = await serve(PUSHED);
const THEN = await serve(LIVE);
const cleanup = async () => {
  servers.forEach((s) => s.close());
  for (const dir of [LIVE, PUSHED]) if (dir !== ROOT) await rm(dir, { recursive: true, force: true });
};
const cannot = async (why) => { console.error(`saved-edits-survive: cannot run — ${why}`); await cleanup(); process.exit(2); };

let chromium;
for (const from of [join(ROOT, 'x.js'), join(sh('npm root -g').trim(), 'x.js'), join(homedir(), '.pw', 'x.js')]) {
  try { ({ chromium } = createRequire(from)('playwright')); break; } catch { /* next */ }
}
if (!chromium) await cannot('Playwright not found');
/* Playwright's own browser, or this machine's Chrome when that copy of
   Playwright hasn't downloaded its own. */
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }))
  .catch((e) => cannot(`no browser to launch (${e.message.split('\n')[0]})`));

let saved, before, after;
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  /* 1. The live saved edits, read the way the site reads them. */
  await page.goto(NOW, { waitUntil: 'load' });
  saved = await page.evaluate(async () => {
    const { store, MODE } = await import('/js/store.js');
    const { DEFAULTS, itemKey } = await import('/js/content.js');
    if (MODE !== 'firebase') return { error: 'the site is in demo mode; there is no live store to read' };
    try {
      const copy = await store.get('content', 'copy');
      const fields = [];
      /* A collection field counts as an edit when its saved words differ
         from the committed default for the same item. */
      const leaves = (obj, pre = '') => Object.entries(obj || {}).flatMap(([k, v]) =>
        typeof v === 'string' ? [[pre + k, v]]
          : Array.isArray(v) ? v.flatMap((x, n) => typeof x === 'string' ? [[`${pre}${k}.${n}`, x]] : leaves(x, `${pre}${k}.${n}.`))
          : v && typeof v === 'object' ? leaves(v, `${pre}${k}.`) : []);
      for (const name of Object.keys(DEFAULTS)) {
        const doc = await store.get('content', name);
        if (!doc?.items?.length) continue;
        const def = Object.fromEntries(DEFAULTS[name].map((x, i) => [itemKey(x, i), x]));
        doc.items.forEach((item, i) => {
          const key = itemKey(item, i);
          const base = Object.fromEntries(leaves(def[key]));
          for (const [path, value] of leaves(item)) {
            if (value.trim() && base[path] !== value) fields.push({ addr: `${name}/${key}/${path}`, value });
          }
        });
      }
      return { slots: copy?.slots || {}, fields };
    } catch (e) { return { error: String(e) }; }
  });
  if (saved.error) throw new Error(saved.error);

  /* 2. Every page, live and about to be pushed: which keys exist, which show. */
  const crawl = async (base) => {
    const shown = new Set(), present = new Set();
    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: 'load' });
      await page.waitForSelector('html[data-shell-ready]', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1500);   // late renderers (collections) settle
      const found = await page.evaluate(() => [...document.querySelectorAll('[data-copy],[data-field]')].map((el) => {
        const visible = (el.getClientRects().length > 0 && !el.closest('[hidden]'))
          || !!el.closest('details:not([open])');   // a visitor can open it
        return [el.dataset.copy ? `copy:${el.dataset.copy}` : `field:${el.dataset.field}`, visible];
      }));
      for (const [k, vis] of found) { present.add(k); if (vis) shown.add(k); }
    }
    return { shown, present };
  };
  before = await crawl(THEN);
  after = await crawl(NOW);
} catch (e) {
  await browser.close().catch(() => {});
  await cannot(e.message);
}
await browser.close().catch(() => {});
await cleanup();

/* ------------------------------------------------------------ verdict */
const words = (v) => `“${String(v).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 70)}”`;
const all = [
  ...Object.entries(saved.slots).map(([key, value]) => ({ k: `copy:${key}`, label: key, value })),
  ...saved.fields.map(({ addr, value }) => ({ k: `field:${addr}`, label: addr, value })),
];
const lost = [];
let notShownToday = 0;
for (const { k, label, value } of all) {
  if (!before.shown.has(k)) { notShownToday++; continue; }   // not this push's doing
  if (after.shown.has(k) || HIDDEN_ON_PURPOSE[label]) continue;
  lost.push(`${label} ${words(value)} — ${after.present.has(k) ? 'still on a page, but hidden' : 'no element carries it any more'}`);
}

/* Not a failure: code words changed under a saved edit (the saved words still win). */
const line = (ref, key) => { try { return sh(`git grep -h -F 'data-copy="${key}"' ${ref} -- '*.html' '*.js'`); } catch { return ''; } };
const covered = Object.keys(saved.slots).filter((key) => {
  const then = line('origin/main', key), now = line(TREE ? '' : 'HEAD', key);
  return then && now && then !== now;
});
if (covered.length) {
  console.log(`saved-edits-survive: note — you changed the code's words under ${covered.length} saved edit(s); the saved words still show:\n  ${covered.join('\n  ')}`);
}

if (lost.length) {
  console.error(`saved-edits-survive: RED — ${lost.length} saved edit(s) would disappear with this push:\n  ${lost.join('\n  ')}\n` +
    `Put the key back where it was, or, if hiding it is a decision, add it to HIDDEN_ON_PURPOSE with who and when.`);
  process.exit(1);
}
console.log(`saved-edits-survive: GREEN — all ${all.length - notShownToday} saved edits that show today still show after this push ` +
  `(${PAGES.length} pages; ${notShownToday} saved values no page draws, such as video links, are not counted).`);
