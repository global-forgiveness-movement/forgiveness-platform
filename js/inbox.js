/* Things people send us — one module, one shape, one inbox.

   Two kinds arrive: a message from the contact page, and a leader registering
   a Forgiveness Group. They are the same thing wearing different fields: a
   person, an email address, some words, a date. So they are described here as
   DATA rather than handled as two code paths — /admin renders the inbox with
   no per-kind branches, and a third kind later is a row in this table, not a
   new screen.

   Nothing here is readable by the public. firestore.rules gives both
   collections `create: if true` and `read: if isEditor()`, so a visitor can
   send but only an editor can look. That is what lets the contact page carry
   no email address at all — there is nothing on it to harvest. */

import { store } from './store.js';
import { SERIES } from './data.js';

/* Each kind: where it lives, what to call it, and how to read one row.
   `detail` returns [label, value] pairs, already ordered for display. */
export const SUBMISSIONS = {
  contact: {
    collection: 'contact',
    label: 'Message',
    detail: (r) => [
      ['About', r.subject],
      ['Message', r.message],
    ],
  },
  groups: {
    collection: 'groups',
    label: 'Group registration',
    detail: (r) => [
      ['Group code', r.code],
      ['Where', r.location],
      ['Expected size', r.size],
      ['Series', SERIES[r.seriesId]?.name || r.seriesId],
      ['Notes', r.notes],
    ],
  },
};

/* What the contact form sends. Deliberately few fields — every one is a person
   we might lose (CLAUDE.md §Design, eliminate friction). */
export async function sendMessage(fields) {
  return store.add('contact', { ...fields, submittedAt: new Date().toISOString() });
}

/* Everything anyone has sent, newest first, each row tagged with its kind.
   One unreadable collection must not blank the whole inbox, so each is read
   independently and a failure becomes an empty list for that kind only. */
export async function listInbox() {
  const kinds = Object.entries(SUBMISSIONS);
  const results = await Promise.all(
    kinds.map(async ([kind, spec]) => {
      try {
        const rows = await store.list(spec.collection);
        return rows.map((r) => ({ ...r, kind }));
      } catch {
        return [];
      }
    })
  );
  return results
    .flat()
    .sort((a, b) => String(b.submittedAt || '').localeCompare(String(a.submittedAt || '')));
}
