/* PAGE ORDER — the order of the sections on a page, and their bands.
   (Kate, 27 Oct: "Is it possible to be able to move around aspects or
   sections on each page?")

   ONE place decides it. The page's own HTML says which sections exist: every
   <section> directly inside <main data-page="…"> carries
     data-section="name"          a stable name, never shown
     data-section-label="Words"   what /admin calls it
     data-section-lock="first"    (optional) stays first: it holds the h1
     data-section-lock="last"     (optional) stays last: the seal
     data-band="join" | "own"     (optional) how its background is chosen
   An editor's order is one saved list per page (content/pageOrder), set in
   /admin → Page order. This module turns "the HTML's sections" plus "the
   saved list" into the order shown, and gives every section its band.

   BANDS. The cream/white stripes follow the order, so moving a section never
   puts two creams together:
     (default) alternate by position, cream first;
     join      the same band as the section above, with no rule or gap
               between them, so several sections read as one;
     own       keeps the background written on it (the navy banner, the seal)
               and takes a place in the alternation.
   scripts/qa/one-page-order.mjs checks that every page's HTML already
   matches this rule, so the page looks the same before and after this runs. */

/* The pages whose sections can be moved, in the order /admin lists them.
   `path` is from the site root. */
export const ORDERED_PAGES = [
  { id: 'home', label: 'Home', path: '' },
  { id: 'research', label: 'Research', path: 'research/' },
  { id: 'groups', label: 'Groups', path: 'groups/' },
  { id: 'about', label: 'About', path: 'about/' },
  { id: 'workbooks', label: 'Workbooks', path: 'workbooks/' },
];

/* The order shown: the editor's list where it names real sections, any
   section the list doesn't know yet kept beside the one it follows in the
   HTML, and the locked sections pinned. Pure, so the check can test it.
   defaults: [{ name, lock }] in HTML order. saved: [name] or null. */
export function orderedNames(defaults, saved) {
  const names = defaults.map((d) => d.name);
  if (!Array.isArray(saved) || !saved.length) return names;
  const out = [...new Set(saved.filter((n) => names.includes(n)))];
  names.forEach((n, i) => {
    if (out.includes(n)) return;
    const before = names.slice(0, i).reverse().find((m) => out.includes(m));
    out.splice(before ? out.indexOf(before) + 1 : 0, 0, n);
  });
  const lock = Object.fromEntries(defaults.map((d) => [d.name, d.lock || '']));
  const first = out.filter((n) => lock[n] === 'first');
  const last = out.filter((n) => lock[n] === 'last');
  return [...first, ...out.filter((n) => !lock[n]), ...last];
}

/* Each section's band, in the order shown: 'paper' (cream), 'plain' (white),
   or null for an `own` section, which keeps its own look.
   sections: [{ band: '' | 'join' | 'own' }] in the order shown. */
export function bandsFor(sections) {
  let slot = 0;
  let previous = 'paper';
  return sections.map((s, i) => {
    if (s.band === 'join' && i > 0) return previous;
    const band = slot % 2 === 0 ? 'paper' : 'plain';
    slot++;
    previous = band;
    return s.band === 'own' ? null : band;
  });
}

/* What the page's HTML says, read from the DOM (the site, and /admin reading
   a fetched page). */
export function sectionsOf(main) {
  return [...main.children].filter((el) => el.matches('section[data-section]')).map((el) => ({
    el,
    name: el.dataset.section,
    label: el.dataset.sectionLabel || el.dataset.section,
    lock: el.dataset.sectionLock || '',
    band: el.dataset.band || '',
  }));
}

/* Put the page's sections in the saved order and give each its band. Safe to
   run twice; a page with no data-page is left alone. */
export function applyPageOrder(doc, savedItems) {
  const main = doc.querySelector('main[data-page]');
  if (!main) return;
  const sections = sectionsOf(main);
  if (!sections.length) return;
  const saved = (savedItems || []).find((x) => x.id === main.dataset.page)?.order || null;
  const byName = Object.fromEntries(sections.map((s) => [s.name, s]));
  const shown = orderedNames(sections, saved).map((n) => byName[n]);
  /* Already in order: move nothing, so a playing film never reloads. */
  if (shown.some((s, i) => s !== sections[i])) {
    const end = sections[sections.length - 1].el.nextSibling;
    shown.forEach((s) => main.insertBefore(s.el, end));
  }
  bandsFor(shown).forEach((band, i) => {
    if (band) shown[i].el.classList.toggle('section--paper', band === 'paper');
  });
}

/* The last order this browser saw, so a returning visitor's page is in order
   before the store answers. A per-device convenience, never the record. */
const CACHE = 'gfm.pageOrder.v1';
export function cachedOrder() {
  try { return JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch { return null; }
}
export function rememberOrder(items) {
  try { localStorage.setItem(CACHE, JSON.stringify(items || [])); } catch { /* storage blocked: the store still answers */ }
}
