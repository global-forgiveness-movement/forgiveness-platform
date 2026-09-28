#!/usr/bin/env node
/* ONEHELM check for "an editor changed these words" (lane C, 2026-09-28).

   ONE editor (js/copy.js) changes words where they sit, for both kinds of
   text: words written in the page (data-copy) and words the site draws from
   data (data-field). This goes red when:

   1. RENDERED — a visible word under <main> on a public page is not inside
      [data-copy], [data-field], or a block deliberately locked with
      [data-locked="why"] (trial figures, file facts, privacy promises).
      That is text an editor can see but not change: a second, engineer-only
      way to change words has quietly come back.
   2. STATIC — anything besides js/copy.js makes page text editable
      (contenteditable), or anything besides js/content.js and /admin writes
      a content collection (saveCollection). That is a second editor.

   Runs the site in demo mode (js/firebase-config.js is answered with a null
   config in the browser; the file on disk is never touched) behind its own
   throwaway static server. Needs Playwright:  node scripts/qa/edit-anywhere.mjs
   Exit 0 = one editor, every word reachable. Exit 1 = a second place. */

import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(new URL('../..', import.meta.url).pathname);

/* Pages whose every visible word must be editable or deliberately locked. */
const PAGES = ['', 'about/', 'research/', 'groups/', 'workbooks/'];

/* Regions another lane owns and will mark under THE CONTRACT
   (.planning/FLEET-2026-09-28.md). Each entry is a debt, not an exemption:
   delete it the moment that lane's work is merged. */
const PENDING = {
  'groups/': ['[data-render="series"]'],   // lane B · js/series.js emits data-field
};

const failures = [];

/* ------------------------------------------------------------ static */
async function walk(dir, out = []) {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    if (d.name.startsWith('.') || d.name === 'node_modules' || d.name === 'scripts') continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) await walk(p, out);
    else if (/\.(js|mjs|html)$/.test(d.name)) out.push(p);
  }
  return out;
}
const rel = (p) => p.slice(ROOT.length + 1);
for (const file of await walk(ROOT)) {
  const r = rel(file);
  if (r.startsWith('plan/') || r.startsWith('workbook/')) continue;   // own apps, not site pages
  const src = await readFile(file, 'utf8');
  if (/contenteditable/i.test(src) && r !== 'js/copy.js') {
    failures.push(`${r}: makes text editable — only js/copy.js may (one editor)`);
  }
  if (/\bsaveCollection\s*\(/.test(src) && !['js/content.js', 'admin/index.html'].includes(r)) {
    failures.push(`${r}: writes a content collection — only js/content.js (for the page editor) and /admin may`);
  }
}

/* ---------------------------------------------------------- rendered */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = await readFile(join(ROOT, p));
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${server.address().port}/`;

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  const g = execSync('npm root -g').toString().trim();
  ({ chromium } = createRequire(join(g, 'x.js'))('playwright'));
}
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('gfm.gate.v2', 'open'));
  await ctx.route('**/js/firebase-config.js', (r) =>
    r.fulfill({ contentType: 'text/javascript', body: 'export const firebaseConfig = null;' }));
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());   // no network beyond the site
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForSelector('html[data-shell-ready]');
    await page.waitForTimeout(800);   // late renderers (collections) settle
    const loose = await page.evaluate((pending) => {
      const OK = '[data-copy],[data-field],[data-locked],select,option,script,style,noscript,template,[hidden],[aria-hidden="true"],.visually-hidden';
      const main = document.querySelector('main');
      const skip = pending.flatMap((s) => [...main.querySelectorAll(s)]);
      const out = [];
      const tw = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        const text = n.textContent.replace(/\s+/g, ' ').trim();
        if (!/\p{L}/u.test(text)) continue;             // numbering, arrows, quote marks
        const el = n.parentElement;
        if (el.closest(OK) || skip.some((s) => s.contains(el))) continue;
        if (!el.getClientRects().length) continue;       // not visible
        out.push(`<${el.tagName.toLowerCase()}> “${text.slice(0, 70)}”`);
      }
      return out;
    }, PENDING[path] || []);
    loose.forEach((t) => failures.push(`/${path}: not editable and not locked — ${t}`));
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`edit-anywhere: RED — ${failures.length} place(s) outside the one editor\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log(`edit-anywhere: green — ${PAGES.length} pages, every visible word is editable in place or deliberately locked; one editor.`);
