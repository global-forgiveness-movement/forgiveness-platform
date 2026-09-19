/* Forgiveness Group membership — one module, one code format.

   A facilitator registers a group and gets a code. Anyone already meeting with
   that group enters the code once, and their account then knows which
   series their group is running, so their workbook progress and the session
   videos sit together in My Path.

   THIS IS NOT A DIRECTORY. Kate's ruling (25 Aug): there is no "find a
   group to join" — a person either works alone, leads a group, or links up
   with a group they are ALREADY part of in person.

   The series is encoded IN the code rather than looked up, so a code works
   the moment a facilitator reads it out — before any lookup, and across devices
   even while the backend is in demo mode. The lookup only ever adds detail
   (the group's name), never permission. */

import { SERIES } from './data.js';
import { store, withPatience } from './store.js';

/* No 0/O/1/I/L/S/5/2/Z — these get read aloud and written on whiteboards. */
const ALPHABET = 'ACDEFGHJKMNPQRTUVWXY34679';
const SERIES_DIGIT = { secular: '3', church: '6' };
const DIGIT_SERIES = { 3: 'secular', 6: 'church' };

export const CODE_SHAPE = 'GFM-3-XXXX';

function randomBlock(n) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('');
}

export function makeGroupCode(seriesId) {
  const digit = SERIES_DIGIT[seriesId];
  if (!digit) throw new Error(`unknown series: ${seriesId}`);
  return `GFM-${digit}-${randomBlock(4)}`;
}

/* Tolerant of how a person actually types it: spaces, lower case, missing
   dashes, and the GFM prefix left off entirely. */
export function parseGroupCode(raw) {
  if (!raw) return null;
  const clean = String(raw).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const body = clean.startsWith('GFM') ? clean.slice(3) : clean;
  const seriesId = DIGIT_SERIES[body[0]];
  const block = body.slice(1);
  if (!seriesId || block.length !== 4) return null;
  if ([...block].some((c) => !ALPHABET.includes(c))) return null;
  return { code: `GFM-${body[0]}-${block}`, seriesId, series: SERIES[seriesId] };
}

/* The group form's <select> already carries the series ids as its values
   ('secular' / 'church'), so this only has to guard against an unknown one. */
export const seriesIdFromFormValue = (value) =>
  (SERIES[value] ? value : 'secular');

/* A facilitator registering a group. Returns the code to show them.

   `userId` is present because the form now sits behind sign-in (Kate 18 Sep,
   Wyatt's ruling the same day). When it is, the facilitator is enrolled in
   their OWN group through the same `members` record a participant gets — so
   My Path shows them their code forever instead of the old "this is the only
   time we show it to you". One path renders both. */
export async function registerGroup(fields, userId) {
  const seriesId = seriesIdFromFormValue(fields.series);
  const code = makeGroupCode(seriesId);
  const record = { ...fields, code, seriesId, userId: userId || null, submittedAt: new Date().toISOString() };
  await store.add('groups', record);
  // A second, code-keyed record so a member's lookup can name the group.
  await store.set('groupCodes', code, {
    seriesId,
    groupName: fields.location || '',
    createdAt: record.submittedAt,
  });
  if (userId) {
    await store.set('members', userId, {
      code, seriesId,
      groupName: fields.location || '',
      facilitator: true,
      joinedAt: record.submittedAt,
    });
  }
  return { code, seriesId, series: SERIES[seriesId] };
}

/* A member entering a code. The parse decides; the lookup only adds detail. */
export async function lookupGroup(raw) {
  const parsed = parseGroupCode(raw);
  if (!parsed) return null;
  let detail = null;
  try {
    detail = await store.get('groupCodes', parsed.code);
  } catch { /* lookup is optional by design */ }
  return { ...parsed, groupName: detail?.groupName || '', known: !!detail };
}

/* A code entered before there is an account to attach it to.

   Wyatt, 19 Sep: "every member of a group has to create a login anyway — what
   you can do is make this process SIMPLE by letting them put the code in
   without creating an account, then save it and apply it after they've made
   the account."

   parseGroupCode is pure and offline, so a signed-out visitor gets a real
   answer — which series they are joining — with no round trip and no account.
   The code waits in THIS browser only. It is never sent anywhere until there
   is a user to attach it to, and it is forgotten the moment it is applied. */
const PENDING = 'gfm.pendingGroupCode.v1';

export function holdGroupCode(raw) {
  const parsed = parseGroupCode(raw);
  if (!parsed) return null;
  try { localStorage.setItem(PENDING, parsed.code); } catch { /* private window */ }
  return parsed;
}

export function heldGroupCode() {
  try { return parseGroupCode(localStorage.getItem(PENDING)); } catch { return null; }
}

export function forgetGroupCode() {
  try { localStorage.removeItem(PENDING); } catch { /* nothing to forget */ }
}

/* Called the moment someone signs in. A failure leaves the code held, so the
   next sign-in retries rather than losing it silently; a code that names no
   real group is dropped, because retrying it forever would be worse. */
export async function applyHeldGroupCode(userId) {
  const held = heldGroupCode();
  if (!held || !userId) return null;
  try {
    const joined = await joinGroup(userId, held.code);
    if (joined) forgetGroupCode();
    return joined;
  } catch {
    return null;
  }
}

export async function joinGroup(userId, raw) {
  const found = await lookupGroup(raw);
  if (!found) return null;
  await store.set('members', userId, {
    code: found.code,
    seriesId: found.seriesId,
    groupName: found.groupName,
    joinedAt: new Date().toISOString(),
  });
  return found;
}

export async function memberGroup(userId) {
  try {
    const m = await withPatience(store.get('members', userId));
    if (!m?.seriesId) return null;
    return { ...m, series: SERIES[m.seriesId] };
  } catch {
    return null;
  }
}

export async function leaveGroup(userId) {
  try { await store.remove('members', userId); } catch { /* already gone */ }
}
