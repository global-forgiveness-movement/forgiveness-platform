/* Anonymous counting — the only measurement on the site.
   A download click records edition + language and nothing else; a group
   registration is a form someone chose to send. No identities, no cookies,
   no third-party analytics. */

import { store } from './store.js';

export function recordDownload(tag) {
  // tag is "edition:lang", e.g. "reach:en"
  store.increment('downloads', tag.replaceAll(':', '_'), 'count').catch(() => {});
}

export async function submitGroupForm(fields) {
  return store.add('groups', { ...fields, submittedAt: new Date().toISOString() });
}
