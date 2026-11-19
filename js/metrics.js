/* Anonymous counting — the only measurement on the site.
   Three counts, each a number and nothing else (SOW, 5 Nov: /admin shows
   totals for page visits, workbook downloads and video plays, and does not
   follow individuals):
     downloads/{edition_lang}  a download click: edition + language
     visits/{page}             a page opened: the page's name
     plays/{film}              a film started: which film
     opens/{edition}           the interactive workbook opened (Wyatt, 19 Nov)
     daily/{kind_YYYY-MM-DD}   each of the four, summed per day (Boston), so
                               /admin can draw the trend (Wyatt, 19 Nov)
   No identities, no cookies, no third-party analytics. The privacy page says
   exactly this ("What we do collect"); change one, change the other.

   Form submissions used to live here too, which was never right: a message
   someone chose to send us is not a metric. They moved to js/inbox.js. */

import { store } from './store.js';

/* The counters' names, ONE list: /admin reads the same three. */
export const COUNTERS = { downloads: 'downloads', visits: 'visits', plays: 'plays', opens: 'opens' };
export const DAILY = 'daily';

/* Today in Boston, YYYY-MM-DD: the day a count lands in. */
export const dayOf = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(d);

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

/* A copy running on this computer (a Dev preview, a local check) counts
   nothing, so reviewing a change never adds to the real totals. */
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

function count(kind, raw, once) {
  if (LOCAL) return;
  const tag = tagOf(raw);
  if (!tag || (once && !firstTimeThisTab(kind, tag))) return;
  store.increment(COUNTERS[kind], tag, 'count').catch(() => {});
  store.increment(DAILY, `${kind}_${dayOf()}`, 'count').catch(() => {});
}

export function recordDownload(tag) {
  // tag is "edition:lang", e.g. "reach:en"
  count('downloads', String(tag).replaceAll(':', '_'), false);
}

/* page: the page's name, e.g. "home", "workbooks", or an editor's page slug. */
export const recordVisit = (page) => count('visits', page, true);

/* film: video.js filmTag(), e.g. "youtube-dQw4w9WgXcQ" or "vimeo-123456789". */
export const recordPlay = (film) => count('plays', film, true);

/* edition: 'reach' or 'church' (js/workbook-editions.js), once per tab. Called
   by workbook/bridge.js only: the workbook never loads site.js. */
export const recordOpen = (edition) => count('opens', edition, true);
