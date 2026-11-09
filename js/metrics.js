/* Anonymous counting — the only measurement on the site.
   Three counts, each a number and nothing else (SOW, 5 Nov: /admin shows
   totals for page visits, workbook downloads and video plays, and does not
   follow individuals):
     downloads/{edition_lang}  a download click: edition + language
     visits/{page}             a page opened: the page's name
     plays/{film}              a film started: which film
   No identities, no cookies, no third-party analytics. The privacy page says
   exactly this ("What we do collect"); change one, change the other.

   Form submissions used to live here too, which was never right: a message
   someone chose to send us is not a metric. They moved to js/inbox.js. */

import { store } from './store.js';

/* The counters' names, ONE list: /admin reads the same three. */
export const COUNTERS = { downloads: 'downloads', visits: 'visits', plays: 'plays' };

/* A counter's id: what firestore.rules accepts, and nothing else. */
const tagOf = (s) => String(s ?? '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

/* Once per thing per browser tab, so a reload or a second press of play is
   not a second visit or play. sessionStorage, on this device only, and read
   by nothing but this. */
function firstTimeThisTab(kind, tag) {
  try {
    const k = `gfm.counted.${kind}.${tag}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, '1');
  } catch { /* storage off: count it */ }
  return true;
}

function count(kind, raw, once) {
  const tag = tagOf(raw);
  if (!tag || (once && !firstTimeThisTab(kind, tag))) return;
  store.increment(COUNTERS[kind], tag, 'count').catch(() => {});
}

export function recordDownload(tag) {
  // tag is "edition:lang", e.g. "reach:en"
  count('downloads', String(tag).replaceAll(':', '_'), false);
}

/* page: the page's name, e.g. "home", "workbooks", or an editor's page slug. */
export const recordVisit = (page) => count('visits', page, true);

/* film: video.js filmTag(), e.g. "youtube-dQw4w9WgXcQ" or "vimeo-123456789". */
export const recordPlay = (film) => count('plays', film, true);
