/* The one shell. Every standard page loads this module and nothing else.
   It runs the pre-launch gate (js/gate.js), injects the shared header/nav/
   footer, hydrates video embeds from data.js, and counts workbook downloads.
   Written once, used everywhere — page files contain only their <main>. */

import { NAV, FOOTER_COLS, BRAND, ACCOUNT_LINKS, FORGIVING_BENEFITS } from './data.js';
import { getVideos, getPages, fieldAttr } from './content.js';
import { recordDownload } from './metrics.js';
import { videoFrame } from './video.js';
import { ensureGate, leaf } from './gate.js';

export const STAMP = 'GFM-V1 · 2026-10-13h';

/* Resolve everything relative to the site root (js/ → root), so pages work
   at any depth and on any host (github.io project path or a custom domain). */
const ROOT = new URL('..', import.meta.url);
export const href = (path) => { const u = new URL(path, ROOT); return u.pathname + u.hash; };

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
  const authLinks = hintSignedIn ? '' : `<a class="signin" href="${href(ACCOUNT_LINKS.signIn)}">Sign in</a>
         <a class="btn btn--outline" href="${href(ACCOUNT_LINKS.signUp)}">Create account</a>`;
  const head = el('header', { class: 'site-head' }, `
    <a class="site-brand" href="${href('')}">
      ${/* The GFM logo carries the name, so no words beside it, and it stands
           alone — no seal beside it (Wyatt, 28 Sep); its alt text keeps the
           link named for screen readers. */ ''}
      ${BRAND.gfm ? `<img class="brand-mark brand-mark--logo" src="${href(BRAND.gfm)}" alt="Global Forgiveness Movement — home">`
        : `${leaf('#00887a')}<span class="t"><b>Global Forgiveness Movement</b>
      <span>Human Flourishing Program</span></span>`}
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
      <p>The REACH Forgiveness workbooks are self-guided learning, not therapy, and not a replacement for professional mental-health support.</p>
      <p>© 2026 Human Flourishing Program · <a href="${href('privacy/')}">Privacy</a> · <a href="${href('accessibility/')}">Accessibility</a> · <span class="stamp">${STAMP}</span></p>
    </div>`);
}

/* Video slots: <figure class="video" data-video="key"></figure> hydrates from
   the videos collection (editor-published version wins, committed default
   otherwise). Swapping a placeholder for the real Vimeo file is a data edit:
   paste the Vimeo page link as it is — js/video.js turns it into the address
   the film plays from. */
async function hydrateVideos() {
  const videos = await getVideos();
  document.querySelectorAll('[data-video]').forEach((slot) => {
    const v = videos[slot.dataset.video];
    if (!v || slot.querySelector('iframe')) return;
    slot.innerHTML = `
      ${videoFrame(v.src, v.title)}
      <figcaption ${fieldAttr('videos', v, 0, 'caption')}>${v.caption}</figcaption>`;
  });
}

/* THE DEFINITION — written onto the page the way Kate's animated screen
   does it (Wyatt, 13 Oct: "I love the way it animates the definition"):
   the word in script, how to say it, "definition:", then the meaning wiped
   in from the left. Real text, every word editable where it sits; ONE
   drawing for every page that asks with data-render="definition". */
function renderDefinitions() {
  document.querySelectorAll('[data-render="definition"]').forEach((el) => {
    el.innerHTML = `
      <p class="def-word" data-copy="def.word">Forgiveness</p>
      <p class="def-say" data-copy="def.say">[for • give • ness]</p>
      <p class="def-label" data-copy="def.label">definition:</p>
      <p class="def-text" data-copy="def.text">replacing <i>ill</i> will with <i>good</i>will toward those who have wronged us</p>`;
  });
}

/* KATE'S BENEFITS CHART, drawn natively (Wyatt, 13 Oct: "rebuild it… so we
   can simplify it"). Four labeled bars, every one pointing the good way; the
   length is the size of the difference. No axis, no units to decode — the
   source sits underneath. ONE drawing for every page that asks with
   data-render="benefits"; the figures live in FORGIVING_BENEFITS alone. */
function renderBenefits() {
  const { findings, source, doi } = FORGIVING_BENEFITS;
  const top = Math.max(...findings.map((f) => Math.abs(f.beta)));
  const label = `Compared with people who seldom or never forgive, people who almost always forgive have ${findings.map((f) => `${f.label.toLowerCase()} (standardized difference ${Math.abs(f.beta).toFixed(2)})`).join(', ')}.`;
  document.querySelectorAll('[data-render="benefits"]').forEach((el) => {
    el.dataset.locked = 'research claim';
    el.innerHTML = `
      <ul class="benefits-bars" role="img" aria-label="${label}">${findings.map((f) => `
        <li><span class="bb-label">${f.label}</span><span class="bb-track"><span class="bb-bar" style="width:${(Math.abs(f.beta) / top * 100).toFixed(1)}%"></span></span></li>`).join('')}
      </ul>
      <figcaption class="small muted">People who almost always forgive, compared with people who seldom or never do. Longer bar, bigger difference. ${source} <a href="${doi}" target="_blank" rel="noopener">Read the study →</a></figcaption>`;
  });
}

/* Things that reveal once, when half on screen (the written-on definition):
   a [data-reveal] block gets .is-on and its CSS does the rest. The site is
   calm, so nothing repeats. Reduced motion, or no observer: shown finished.
   One place for every page. */
function playAnimationsInView() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-on'));
    return;
  }
  const seen = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    seen.unobserve(e.target);
    e.target.classList.add('is-on');
  }), { threshold: 0.5 });
  items.forEach((el) => seen.observe(el));
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
  renderDefinitions();
  renderBenefits();
  playAnimationsInView();
  /* The HFP seal, wherever a page asks for it (About and Home). */
  document.querySelectorAll('img[data-render="hfp-seal-harvard"]').forEach((img) => { img.src = href(BRAND.hfpSealHarvard); });
  /* A page that draws video slots late (the Groups page series chooser)
     asks for the same hydration again rather than keeping its own. */
  window.addEventListener('gfm:videos', hydrateVideos);
  appendCustomNav();
  import('./copy.js').then((m) => m.mountCopy()).catch((err) => console.warn('page text unavailable:', err));
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
