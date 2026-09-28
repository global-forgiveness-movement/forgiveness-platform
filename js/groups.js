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

import { SERIES, PLAYLIST } from './data.js';
import { store, withPatience } from './store.js';
import { getCollection } from './content.js';
import { applyGroupAction, applyMyTick, runsGroup, createdBy, FACILITATOR_SEES_MEMBER_TICKS } from './group-engine.js';

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

/* Why a typed code is not a code, in words a person can act on. Follows
   parseGroupCode's own steps, so the two cannot disagree about what a code is;
   null means parseGroupCode would accept it. */
export function groupCodeProblem(raw) {
  if (parseGroupCode(raw)) return null;
  const clean = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const body = clean.startsWith('GFM') ? clean.slice(3) : clean;
  if (!body) return `Type the code your facilitator gave you. It looks like ${CODE_SHAPE}.`;
  if (!DIGIT_SERIES[body[0]]) return 'The number after “GFM” says which series your group uses, so it is always 3 or 6. Check that part with your facilitator.';
  const block = body.slice(1);
  const odd = [...block].find((c) => !ALPHABET.includes(c));
  if (odd) return `Group codes never use “${odd}”, so one character is off. Check it with your facilitator.`;
  return `That has ${block.length} character${block.length === 1 ? '' : 's'} after the ${body[0]}. A group code has 4, like ${CODE_SHAPE}.`;
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
  /* `facilitator` is the account id (a random string — no name, no email)
     that firestore.rules checks before letting anyone write the group's
     dates and ticks. Written once, never changed. */
  await store.set('groupCodes', code, {
    seriesId,
    groupName: fields.location || '',
    createdAt: record.submittedAt,
    ...(userId ? { facilitator: userId } : {}),
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
  return { ...parsed, groupName: detail?.groupName || '', known: !!detail, codeDoc: detail };
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

/* `kept` is false when this browser refuses storage (some private windows):
   the page then says so, instead of promising a connection it cannot make. */
export function holdGroupCode(raw) {
  const parsed = parseGroupCode(raw);
  if (!parsed) return null;
  let kept = false;
  try { localStorage.setItem(PENDING, parsed.code); kept = localStorage.getItem(PENDING) === parsed.code; } catch { /* private window */ }
  return { ...parsed, kept };
}

/* The one sentence that tells someone their held code is waiting — My Path
   and /join/ both say it, so it is written once, here. */
export function heldCodeLine(held) {
  if (held.kept === false) {
    return `That’s the <b>${held.series.name}</b>. This browser won’t let us hold on to your code, so write down <b>${held.code}</b> and enter it again once you have an account.`;
  }
  return `Your group code <b>${held.code}</b> is saved in this browser. It’s for the <b>${held.series.name}</b>. Create your free account and we’ll connect you to your group.`;
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
  /* A facilitator who removed their group and types its code back in gets
     it back as theirs — the engine decides from the code's own record. */
  await store.set('members', userId, {
    code: found.code,
    seriesId: found.seriesId,
    groupName: found.groupName,
    joinedAt: new Date().toISOString(),
    facilitator: createdBy(found.codeDoc, userId),
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

/* Leaving takes your lesson ticks with you; the group's own dates and
   ticks stay, because they belong to everyone else in it. */
export async function leaveGroup(userId) {
  try { await store.remove('memberTicks', userId); } catch { /* none kept */ }
  try { await store.remove('members', userId); } catch { /* already gone */ }
}

/* ------------------------------------------------ the running group

   Three documents, and the engine (js/group-engine.js) is the only thing
   that reads meaning into them:

   groupState/{code}   the group's shared state — which steps the
                       facilitator has ticked, and each meeting's date, time,
                       place and link. Members read it; only the facilitator
                       named on groupCodes/{code} may write it.
   memberTicks/{uid}   one person's own lesson ticks, and the code they were
                       ticked under. Only that person reads or writes it.
   content/series      the series themselves, editable (THE CONTRACT);
                       SERIES in data.js is the default. */

export { PLAYLIST as SESSION_VIDEO };

/* Every series by id — editor wording on top of the committed defaults. */
export async function loadSeries() {
  const list = await getCollection('series');
  const byId = Object.fromEntries(list.map((x) => [x.id, x]));
  return { ...SERIES, ...byId };
}

export async function groupState(code) {
  try { return (await withPatience(store.get('groupState', code))) || { steps: {} }; }
  catch { return { steps: {} }; }
}

/* Read, apply, write the whole document back — so a cleared date really
   clears (a merge could never delete it). */
export async function actOnGroup(code, stepId, action) {
  const current = await store.get('groupState', code);
  const next = applyGroupAction(current, stepId, action);
  await store.set('groupState', code, { steps: next.steps, updatedAt: new Date().toISOString() }, { replace: true });
  return next;
}

/* Ticks kept under another code (an earlier group) are not this group's. */
export async function myTicks(userId, code) {
  try {
    const doc = await withPatience(store.get('memberTicks', userId));
    return doc?.code === code ? doc.ticks || {} : {};
  } catch { return {}; }
}

export async function tickMine(userId, code, stepId, value) {
  const ticks = applyMyTick(await myTicks(userId, code), stepId, value);
  await store.set('memberTicks', userId, { code, ticks, updatedAt: new Date().toISOString() }, { replace: true });
  return ticks;
}

/* Ruling 5: only ever read while the switch is on. The live rules keep the
   matching permission commented out, so flipping the switch alone reads
   nothing on the real site. */
export async function groupTicks(code) {
  if (!FACILITATOR_SEES_MEMBER_TICKS) return [];
  try { return (await store.list('memberTicks')).filter((t) => t.code === code); }
  catch { return []; }
}

/* Account deletion: everything the account stores in the group world. A
   facilitator's group state goes too — "deleting removes your account and
   everything it stores" (My Path) has to stay literally true. */
export async function eraseGroupData(userId) {
  const m = await store.get('members', userId).catch(() => null);
  if (m?.code && runsGroup(m)) await store.remove('groupState', m.code).catch(() => {});
  await store.remove('memberTicks', userId).catch(() => {});
}
