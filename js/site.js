/* The one shell. Every standard page loads this module and nothing else.
   It runs the pre-launch gate (js/gate.js), injects the shared header/nav/
   footer, hydrates video embeds from data.js, and counts workbook downloads.
   Written once, used everywhere — page files contain only their <main>. */

import { NAV, FOOTER_COLS, VIDEOS } from './data.js';
import { recordDownload } from './metrics.js';
import { ensureGate, leaf } from './gate.js';

export const STAMP = 'GFM-P4 · 2026-08-21d';

/* Resolve everything relative to the site root (js/ → root), so pages work
   at any depth and on any host (github.io project path or a custom domain). */
const ROOT = new URL('..', import.meta.url);
export const href = (path) => new URL(path, ROOT).pathname;

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

ensureGate(buildShell);
