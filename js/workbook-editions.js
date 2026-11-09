/* The interactive workbook's editions, in ONE place (SOW, 5 Nov: an interactive
   church workbook beside the REACH one). Read by the workbook itself
   (workbook/js/), by progress sync, by sign-up's return address and by My Path,
   so an edition's name, address and storage can never disagree between them.
   No imports: the workbook's strict CSP page loads this file too.

   key     — this device's localStorage key for that edition's answers and place.
             Each edition keeps its own, so the two never overwrite each other.
   query   — what the workbook's address carries to open it.
   next    — sign-up's ?next= value that returns a person to it (join/).
   remote  — where its place is kept in progress/{uid}: REACH at the top (as it
             always has been), the church edition under one field beside it. */
export const WORKBOOK_EDITIONS = {
  reach: {
    id: 'reach',
    name: 'Interactive REACH Forgiveness Workbook',
    key: 'reach-forgiveness.v1',
    query: '',
    next: 'workbook',
    remote: null,
  },
  church: {
    id: 'church',
    name: 'Interactive REACH Forgiveness Workbook, Adapted for Churches',
    key: 'reach-forgiveness-church.v1',
    query: '?edition=church',
    next: 'workbook-church',
    remote: 'church',
  },
};

/* The edition an address asks for. Anything unknown is the REACH edition. */
export const editionFrom = (search) =>
  new URLSearchParams(search || '').get('edition') === 'church' ? 'church' : 'reach';

/* The address of an edition's workbook, from a page `prefix` away from the root. */
export const workbookHref = (id, prefix = '../') =>
  `${prefix}workbook/${(WORKBOOK_EDITIONS[id] || WORKBOOK_EDITIONS.reach).query}`;
