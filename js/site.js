/* The one shell. Every page loads this module and nothing else.
   It runs the pre-launch gate, injects the shared header/nav/footer,
   hydrates video embeds from data.js, and counts workbook downloads.
   Written once, used everywhere — page files contain only their <main>. */

import { NAV, FOOTER_COLS, VIDEOS } from './data.js';
import { recordDownload } from './metrics.js';

export const STAMP = 'GFM-P4 · 2026-08-21d';

/* Resolve everything relative to the site root (js/ → root), so pages work
   at any depth and on any host (github.io project path or a custom domain). */
const ROOT = new URL('..', import.meta.url);
export const href = (path) => new URL(path, ROOT).pathname;

/* ---------------------------------------------------------------- gate
   A curtain, not a lock: it keeps the pre-launch site out of casual view
   and search engines. The repo is public and the content is not sensitive. */
const GATE_KEY = 'gfm.gate.v1';
const GATE_HASH = 'ed4561f685f133532832f705209e693c573c85ed7f93865ffe6dfea3653bd8a6';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const leaf = (fill) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7 7 4 12 4 16a8 8 0 0 0 16 0c0-4-3-9-8-14z" fill="${fill}" transform="rotate(40 12 12)"/></svg>`;

function showGate() {
  const gate = document.createElement('div');
  gate.className = 'gate';
  gate.innerHTML = `
    <div class="gate-card">
      ${leaf('#1b7f72')}
      <span class="script">Global Forgiveness</span>
      <h1>A site in the making</h1>
      <p>This preview isn't public yet. Enter the password Wyatt sent you to look around.</p>
      <form>
        <label class="visually-hidden" for="gatePw">Password</label>
        <input id="gatePw" type="password" autocomplete="off" autofocus>
        <button class="btn btn--primary" type="submit">Enter</button>
      </form>
      <div class="gate-err" role="alert" aria-live="polite"></div>
    </div>`;
  document.body.append(gate);
  document.documentElement.setAttribute('data-shell-ready', '');
  gate.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = gate.querySelector('input').value.trim().toLowerCase();
    if ((await sha256(pw)) === GATE_HASH) {
      localStorage.setItem(GATE_KEY, 'open');
      gate.remove();
      buildShell();
    } else {
      gate.querySelector('.gate-err').textContent = 'That’s not it — check the note from Wyatt.';
    }
  });
}

/* ---------------------------------------------------------------- shell */
function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  node.innerHTML = html;
  return node;
}

function currentPath() {
  let p = location.pathname;
  if (!p.startsWith(ROOT.pathname)) return '';
  p = p.slice(ROOT.pathname.length);
  return p.replace(/index\.html$/, '');
}

function buildHeader() {
  const here = currentPath();
  const nav = NAV.map(([path, label]) => {
    const current = path === here ? ' aria-current="page"' : '';
    return `<a href="${href(path)}"${current}>${label}</a>`;
  }).join('');
  return el('header', { class: 'site-head' }, `
    <a class="site-brand" href="${href('')}">
      ${leaf('#1b7f72')}
      <span class="t"><b>Global Forgiveness Movement</b>
      <span>Human Flourishing Program at Harvard</span></span>
    </a>
    <nav class="site-nav" aria-label="Main">${nav}</nav>
    <div class="site-auth" data-auth-slot>
      <a class="signin" href="${href('join/')}">Sign in</a>
    </div>`);
}

function buildFooter() {
  const cols = FOOTER_COLS.map(
    ({ title, links }) => `<div><h4>${title}</h4><ul>${links
      .map(([path, label]) => `<li><a href="${path.startsWith('http') ? path : href(path)}">${label}</a></li>`)
      .join('')}</ul></div>`
  ).join('');
  return el('footer', { class: 'site-foot' }, `
    <div class="cols">${cols}</div>
    <div class="legal">
      <p>An initiative of the <a href="https://hfh.fas.harvard.edu/">Human Flourishing Program</a> at Harvard University.</p>
      <p>The REACH workbooks are self-guided learning, not therapy, and not a replacement for professional mental-health support.</p>
      <p>© 2026 President and Fellows of Harvard College · <a href="${href('privacy/')}">Privacy</a> · <a href="${href('accessibility/')}">Accessibility</a> · <span class="stamp">${STAMP}</span></p>
    </div>`);
}

/* Video slots: <figure class="video" data-video="key"></figure> hydrates from
   data.js. Swapping a placeholder for the real Vimeo file is a data change. */
function hydrateVideos() {
  document.querySelectorAll('[data-video]').forEach((slot) => {
    const v = VIDEOS[slot.dataset.video];
    if (!v) return;
    slot.innerHTML = `
      <iframe src="${v.src}" title="${v.title}" loading="lazy"
        allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
      <figcaption>${v.caption}</figcaption>`;
  });
}

/* Download counting: any <a data-download="edition:lang"> is counted
   anonymously (edition + language, nothing else) when clicked. */
function watchDownloads() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-download]');
    if (a) recordDownload(a.dataset.download);
  });
}

async function buildShell() {
  const main = document.querySelector('main');
  document.body.prepend(buildHeader());
  document.body.append(buildFooter());
  hydrateVideos();
  watchDownloads();
  document.documentElement.setAttribute('data-shell-ready', '');
  /* Auth is optional dressing on every page; it must never block the shell. */
  try {
    const { mountAuth } = await import('./auth.js');
    mountAuth(document.querySelector('[data-auth-slot]'));
  } catch (err) {
    console.warn('auth unavailable:', err);
  }
  main?.dispatchEvent(new CustomEvent('shell:ready', { bubbles: true }));
}

if (localStorage.getItem(GATE_KEY) === 'open') {
  buildShell();
} else {
  showGate();
}
