/* Anonymous counting — the only measurement on the site.
   A download click records edition + language and nothing else. No identities,
   no cookies, no third-party analytics.

   Form submissions used to live here too, which was never right: a message
   someone chose to send us is not a metric. They moved to js/inbox.js. */

import { store } from './store.js';

export function recordDownload(tag) {
  // tag is "edition:lang", e.g. "reach:en"
  store.increment('downloads', tag.replaceAll(':', '_'), 'count').catch(() => {});
}
