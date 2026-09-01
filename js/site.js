/* The one shell. Every standard page loads this module and nothing else.
   It runs the pre-launch gate (js/gate.js), injects the shared header/nav/
   footer, hydrates video embeds from data.js, and counts workbook downloads.
   Written once, used everywhere — page files contain only their <main>. */

import { NAV, FOOTER_COLS } from './data.js';
import { getVideos, getPages } from './content.js';
import { recordDownload } from './metrics.js';
import { ensureGate, leaf } from './gate.js';

export const STAMP = 'GFM-V1 · 2026-09-01e';

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
  /* The static auth links are the pre-answer placeholder. A device whose
     last auth answer was signed-in (one-bit hint written by js/auth.js)
     gets a blank slot instead — sign-in links here would paint and then
     swap once the backend answers. */
  let hintSignedIn = false;
  try { hintSignedIn = localStorage.getItem('gfm.auth.hint.v1') === '1'; } catch {}
  const authLinks = hintSignedIn ? '' : `<a class="signin" href="${href('join/')}">Sign in</a>
         <a class="btn btn--outline" href="${href('join/')}">Create account</a>`;
  const head = el('header', { class: 'site-head' }, `
    <a class="site-brand" href="${href('')}">
      ${leaf('#00887a')}
      <span class="t"><b>Global Forgiveness Movement</b>
      <span>Human Flourishing Program</span></span>
    </a>
    <nav class="site-nav" id="site-menu" aria-label="Main">${nav}</nav>
    <div class="site-auth" data-auth-slot>${authLinks}</div>
    <button class="nav-toggle" type="button" aria-expanded="false"
      aria-controls="site-menu" aria-label="Menu">
      <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M3 6h16M3 11h16M3 16h16"></path>
      </svg>
    </button>`);
  wireMenu(head);
  return head;
}

/* Collapsed-header menu (below 1100px). One piece of state — the
   data-menu-open attribute on .site-head — and CSS draws everything from it.
   At ≥1100px the toggle is display:none and none of this can run. */
function wireMenu(header) {
  const toggle = header.querySelector('.nav-toggle');
  const isOpen = () => header.hasAttribute('data-menu-open');
  const setOpen = (open) => {
    header.toggleAttribute('data-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  /* A chosen link closes the menu (belt-and-braces beside the page load). */
  header.addEventListener('click', (e) => {
    if (isOpen() && e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  /* Resizing back to desktop never strands the menu open. */
  matchMedia('(min-width: 1100px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
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
      <p>An initiative of the <a href="https://hfh.fas.harvard.edu/">Human Flourishing Program</a>.</p>
      <p>The REACH workbooks are self-guided learning, not therapy, and not a replacement for professional mental-health support.</p>
      <p>© 2026 Human Flourishing Program · <a href="${href('privacy/')}">Privacy</a> · <a href="${href('accessibility/')}">Accessibility</a> · <span class="stamp">${STAMP}</span></p>
    </div>`);
}

/* Video slots: <figure class="video" data-video="key"></figure> hydrates from
   the videos collection (editor-published version wins, committed default
   otherwise). Swapping a placeholder for the real Vimeo file is a data edit. */
async function hydrateVideos() {
  const videos = await getVideos();
  document.querySelectorAll('[data-video]').forEach((slot) => {
    const v = videos[slot.dataset.video];
    if (!v) return;
    slot.innerHTML = `
      <iframe src="${v.src}" title="${v.title}" loading="lazy"
        allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
      <figcaption>${v.caption}</figcaption>`;
  });
}

/* Editor-created pages that asked for a menu spot appear after the core nav. */
async function appendCustomNav() {
  const pages = (await getPages()).filter((p) => p.showInNav);
  if (!pages.length) return;
  const nav = document.querySelector('.site-nav');
  const here = currentPath();
  pages.forEach((p) => {
    const a = document.createElement('a');
    a.href = href(p.slug + '/');
    a.textContent = p.title;
    if (here === p.slug + '/' || here === p.slug) a.setAttribute('aria-current', 'page');
    nav.append(a);
  });
}

/* Cold-loading a #fragment: the browser scrolls to it before this header,
   the video slots, and async lists exist, so hydration above the target
   pushes it away from where the visitor landed (measured ~560px on the
   groups form at 900px). Video slots now reserve their space in CSS; this
   one correction covers the rest, on every page: while the opening seconds
   still grow the page, keep the named target aligned — unless the visitor
   has started moving themselves. */
function keepAnchorAligned() {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  let userMoved = false;
  ['wheel', 'touchstart', 'keydown'].forEach((ev) =>
    addEventListener(ev, () => (userMoved = true), { passive: true, once: true }));
  const align = () => userMoved || target.scrollIntoView({ behavior: 'instant' });
  const settle = new ResizeObserver(align);
  settle.observe(document.body);
  setTimeout(() => settle.disconnect(), 3500);
}

/* Download counting: any <a data-download="edition:lang"> is counted
   anonymously (edition + language, nothing else) when clicked. */
function watchDownloads() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-download]');
    if (a) recordDownload(a.dataset.download);
  });
}

/* Every link that leaves this site opens in a new tab — decided once, at click
   time, so it holds for static markup, data-driven links, and pages Kate
   creates in /admin alike (Wyatt's ruling, 1 Sep). Capture phase: attributes
   are set before the browser acts on the click. */
function externalLinksInNewTabs() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    if (a.origin && a.origin !== location.origin) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  }, true);
}

async function buildShell() {
  const main = document.querySelector('main');
  externalLinksInNewTabs();
  document.body.prepend(buildHeader());
  document.body.append(buildFooter());
  hydrateVideos();
  appendCustomNav();
  watchDownloads();
  document.documentElement.setAttribute('data-shell-ready', '');
  keepAnchorAligned();
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
