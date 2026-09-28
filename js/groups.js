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
import { applyGroupAction, applyMyTick, createdBy, facilitatorOf, FACILITATOR_SEES_MEMBER_TICKS } from './group-engine.js';

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

   `userId` is present because the form sits behind sign-in (Kate 18 Sep,
   Wyatt's ruling the same day). The facilitator is then enrolled in their
   OWN group through the same membership a participant gets (enroll, below)
   — so My Path shows them their code forever. What makes them its
   facilitator is not that membership: it is the account id written onto
   groupCodes/{code} here, the one record the engine and firestore.rules both
   read (lane D, 28 Sep). */
export async function registerGroup(fields, userId) {
  const seriesId = seriesIdFromFormValue(fields.series);
  const code = makeGroupCode(seriesId);
  const record = { ...fields, code, seriesId, userId: userId || null, submittedAt: new Date().toISOString() };
  await store.add('groups', record);
  // A second, code-keyed record so a member's lookup can name the group.
  /* `facilitator` is the account id (a random string — no name, no email)
     that firestore.rules checks before letting anyone write the group's
     dates and ticks. Written once; only an editor can change it. */
  await store.set('groupCodes', code, {
    seriesId,
    groupName: fields.location || '',
    createdAt: record.submittedAt,
    ...(userId ? { facilitator: userId } : {}),
  });
  if (userId) await enroll(userId, { code, seriesId, groupName: fields.location || '' });
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

/* A code entered on My Path (or held from before there was an account).
   Entering a code you already have brings that group back if it was
   finished; it never makes a second copy. */
export async function joinGroup(userId, raw) {
  const found = await lookupGroup(raw);
  if (!found) return null;
  await enroll(userId, found);
  return found;
}

/* ------------------------------------------------ memberships

   Wyatt, 28 Sep: a person can be in several groups at once — lead one or
   more, and follow others. So members/{uid} (which also holds the person's
   name and newsletter choice — never clobbered) keeps a map keyed by code:

     groups: { 'GFM-3-4NXT': { seriesId, groupName, status: 'active' | 'past',
                              joinedAt, pastAt? } }

   Before 28 Sep it held ONE group at its top level ({ code, seriesId,
   groupName, joinedAt, facilitator }). That shape is still read, and
   converted the first time it is — so nobody loses their group. The old
   `facilitator` flag is dropped, not carried: who facilitates is
   groupCodes/{code}.facilitator and nothing else. */
const OLD_SHAPE = ['code', 'seriesId', 'groupName', 'joinedAt', 'facilitator'];

/* Pure: any members doc, old or new, in the new shape. */
export function membershipsOf(doc) {
  const groups = { ...(doc?.groups || {}) };
  const converted = !!doc && OLD_SHAPE.some((k) => k in doc);
  if (doc?.code && SERIES[doc.seriesId] && !groups[doc.code]) {
    groups[doc.code] = { seriesId: doc.seriesId, groupName: doc.groupName || '', status: 'active', joinedAt: doc.joinedAt || '' };
  }
  const rest = { ...(doc || {}) };
  OLD_SHAPE.forEach((k) => delete rest[k]);
  return { doc: { ...rest, groups }, converted };
}

/* Read, converting an old-shape record on the way (and saving the
   conversion, so it happens once). A failed save still shows the groups. */
async function readMember(userId) {
  const raw = await withPatience(store.get('members', userId));
  const { doc, converted } = membershipsOf(raw);
  if (converted) await writeMember(userId, doc).catch(() => {});
  return doc;
}

/* The whole document, written back exactly — so a converted record really
   loses its old top-level fields (a merge could never delete them). */
const writeMember = (userId, doc) => store.set('members', userId, doc, { replace: true });

async function changeMembership(userId, code, change) {
  const doc = await readMember(userId);
  const next = change(doc.groups[code] || null);
  const groups = { ...doc.groups };
  if (next) groups[code] = next; else delete groups[code];
  await writeMember(userId, { ...doc, groups });
}

/* The ONE way into a group, for whoever creates it and whoever joins it. */
function enroll(userId, { code, seriesId, groupName }) {
  return changeMembership(userId, code, (cur) => {
    const back = { ...(cur || { seriesId, groupName: groupName || '', joinedAt: new Date().toISOString() }), status: 'active' };
    delete back.pastAt;
    return back;
  });
}

/* Every group this person is in, active and past, oldest first. `null`
   means the record could not be read (not "no groups"). */
export async function myGroups(userId) {
  try {
    const doc = await readMember(userId);
    return Object.entries(doc.groups)
      .filter(([, g]) => SERIES[g?.seriesId])
      .map(([code, g]) => ({ code, ...g, status: g.status === 'past' ? 'past' : 'active', series: SERIES[g.seriesId] }))
      .sort((a, b) => String(a.joinedAt).localeCompare(String(b.joinedAt)));
  } catch {
    return null;
  }
}

/* Ruling 2, 28 Sep: "Finished with this group" moves it to Past groups;
   "Bring back" returns it. Nothing is deleted either way — the code, the
   group's state and your own ticks all stay — so neither asks first. */
export const finishGroup = (userId, code) =>
  changeMembership(userId, code, (cur) => cur && { ...cur, status: 'past', pastAt: new Date().toISOString() });
export const bringBackGroup = (userId, code) =>
  changeMembership(userId, code, (cur) => {
    if (!cur) return null;
    const back = { ...cur, status: 'active' };
    delete back.pastAt;
    return back;
  });

/* The group's own record — public, and the one place that says who runs it. */
export async function codeRecord(code) {
  try { return await withPatience(store.get('groupCodes', code)); }
  catch { return null; }
}

/* ------------------------------------------------ the running group

   Three documents, and the engine (js/group-engine.js) is the only thing
   that reads meaning into them:

   groupState/{code}   the group's shared state — which steps the
                       facilitator has ticked, and each meeting's date, time,
                       place and link. Members read it; only the facilitator
                       named on groupCodes/{code} may write it.
   memberTicks/{uid}   one person's own lesson ticks, one set per group code.
                       Only that person reads or writes it.
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

/* A person's own lesson ticks, one set per group:
     memberTicks/{uid} = { groups: { [code]: { [stepId]: true } }, updatedAt }
   Before 28 Sep one set was kept ({ code, ticks }); read and converted. */
export function ticksOf(doc) {
  const groups = { ...(doc?.groups || {}) };
  if (doc?.code && doc?.ticks && !groups[doc.code]) groups[doc.code] = doc.ticks;
  return groups;
}

export async function myTicks(userId, code) {
  try { return ticksOf(await withPatience(store.get('memberTicks', userId)))[code] || {}; }
  catch { return {}; }
}

export async function tickMine(userId, code, stepId, value) {
  const groups = ticksOf(await store.get('memberTicks', userId));
  groups[code] = applyMyTick(groups[code], stepId, value);
  if (!Object.keys(groups[code]).length) delete groups[code];
  await store.set('memberTicks', userId, { groups, updatedAt: new Date().toISOString() }, { replace: true });
  return groups[code] || {};
}

/* Ruling 5: only ever read while the switch is on. The live rules keep the
   matching permission commented out, so flipping the switch alone reads
   nothing on the real site. */
export async function groupTicks(code) {
  if (!FACILITATOR_SEES_MEMBER_TICKS) return [];
  try {
    return (await store.list('memberTicks'))
      .map((t) => ticksOf(t)[code])
      .filter(Boolean)
      .map((ticks) => ({ ticks }));
  } catch { return []; }
}

/* Account deletion: everything the account stores in the group world —
   every membership (auth.js removes members/{uid}), every tick, and the
   shared state of every group this account facilitates, found the one way
   facilitation is decided: the code's own record. "Deleting removes your
   account and everything it stores" (My Path) has to stay literally true. */
export async function eraseGroupData(userId) {
  const codes = new Set();
  const listed = await store.list('groupCodes').catch(() => []);
  listed.forEach((c) => { if (createdBy(c, userId)) codes.add(c.id); });
  const mine = (await myGroups(userId)) || [];
  await Promise.all(mine.map(async (g) => { if (createdBy(await codeRecord(g.code), userId)) codes.add(g.code); }));
  await Promise.all([...codes].map((code) => store.remove('groupState', code).catch(() => {})));
  await store.remove('memberTicks', userId).catch(() => {});
}

/* ------------------------------------------------ /admin: the older groups

   Groups created before September 28 were registered before the code's
   record named its facilitator, so nobody could tick their meetings (the
   bug Wyatt hit on GFM-3-4NXT). Each registration in groups/ carries the
   account that created it; this names that account on the code's record.
   Editors only (firestore.rules: groups/ is editor-read, groupCodes/ is
   editor-update). Never guesses: a code with no registration, a
   registration made signed out, or two accounts claiming one code is
   listed, not assigned. Safe to run twice — a named code is left alone. */
export async function repairFacilitators() {
  const [codes, regs] = await Promise.all([store.list('groupCodes'), store.list('groups')]);
  const report = { given: [], left: [], alreadyNamed: 0 };
  for (const { id: code, ...rec } of codes) {
    if (facilitatorOf(rec)) { report.alreadyNamed++; continue; }
    const theirs = regs.filter((r) => r.code === code);
    const accounts = [...new Set(theirs.map((r) => r.userId).filter(Boolean))];
    if (accounts.length === 1) {
      await store.set('groupCodes', code, { ...rec, facilitator: accounts[0] });
      report.given.push({ code, groupName: rec.groupName || '' });
    } else {
      report.left.push({
        code, groupName: rec.groupName || '',
        why: accounts.length > 1 ? 'more than one account registered this code'
          : theirs.length ? 'it was registered without an account, so there is no one to name'
          : 'there is no registration for this code',
      });
    }
  }
  return report;
}
