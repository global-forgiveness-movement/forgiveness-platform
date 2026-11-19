// Firestore rules, checked on Google's own rules tester (no emulator, no Java).
//   node scripts/qa/rules-test.mjs [account-email]
// Sends firestore.rules from this tree plus the cases below to
// firebaserules.googleapis.com projects/gfm-platform:test. Nothing is deployed
// and no data is read or written: get()/exists() are mocked per case.
// Uses the Firebase CLI's saved login (run any firebase-tools command first so
// the token is fresh). Red = a case came back the wrong way.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

const PROJECT = 'gfm-platform';
const account = process.argv[2] || 'globalforgivenessmovement@gmail.com';
const cfg = JSON.parse(readFileSync(homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const acct = cfg.user?.email === account ? cfg : (cfg.additionalAccounts || []).find(a => a.user.email === account);
if (!acct) { console.error('No Firebase CLI login for ' + account); process.exit(2); }
const token = acct.tokens.access_token;
const source = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');

const D = '/databases/(default)/documents';
const EDITOR = 'editor@example.org';
const CODE = 'ABC123', OTHER = 'XYZ789';
// The world every case sees: LEAD facilitates CODE, BOSS facilitates OTHER;
// MEM is in CODE; OUT is in nothing.
const codes = { [CODE]: 'LEAD', [OTHER]: 'BOSS' };
const members = { MEM: { groups: { [CODE]: { status: 'active' } } }, LEAD: { groups: { [CODE]: {} } }, OUT: { groups: {} }, OLD: { code: CODE } };
const mocks = [
  { function: 'get', args: [{ exact_value: `${D}/settings/editors` }], result: { value: { data: { emails: [EDITOR] } } } },
  ...Object.entries(codes).flatMap(([c, f]) => [
    { function: 'exists', args: [{ exact_value: `${D}/groupCodes/${c}` }], result: { value: true } },
    { function: 'get', args: [{ exact_value: `${D}/groupCodes/${c}` }], result: { value: { data: { facilitator: f } } } },
  ]),
  ...Object.entries(members).flatMap(([u, data]) => [
    { function: 'exists', args: [{ exact_value: `${D}/members/${u}` }], result: { value: true } },
    { function: 'get', args: [{ exact_value: `${D}/members/${u}` }], result: { value: { data } } },
  ]),
  { function: 'exists', args: [{ any_value: {} }], result: { value: false } },
];
const as = uid => uid === 'EDITOR' ? { uid: 'EDITOR', token: { email: EDITOR } } : uid ? { uid, token: { email: uid.toLowerCase() + '@example.org' } } : undefined;
const entry = (o = {}) => ({ name: 'Sam', status: 'active', joinedAt: '2026-11-18', ...o });
const C = (name, expectation, uid, method, path, data, existing) => ({ name, tc: {
  expectation,
  request: { ...(uid ? { auth: as(uid) } : {}), method, path: D + path, ...(data ? { resource: { data } } : {}) },
  ...(existing ? { resource: { data: existing } } : {}),
  functionMocks: mocks,
} });

const cases = [
  // who joined a group
  C('leader reads a person in their group', 'ALLOW', 'LEAD', 'get', `/groupRoster/${CODE}/people/MEM`),
  C('leader lists their group', 'ALLOW', 'LEAD', 'list', `/groupRoster/${CODE}/people/MEM`),
  C('leader cannot list another group', 'DENY', 'LEAD', 'list', `/groupRoster/${OTHER}/people/X`),
  C('member reads own entry', 'ALLOW', 'MEM', 'get', `/groupRoster/${CODE}/people/MEM`),
  C('member cannot read another entry', 'DENY', 'MEM', 'get', `/groupRoster/${CODE}/people/LEAD`),
  C('member cannot list their group', 'DENY', 'MEM', 'list', `/groupRoster/${CODE}/people/X`),
  C('signed out cannot read', 'DENY', null, 'get', `/groupRoster/${CODE}/people/MEM`),
  C('member writes own entry', 'ALLOW', 'MEM', 'create', `/groupRoster/${CODE}/people/MEM`, entry()),
  C('old single-group member writes own entry', 'ALLOW', 'OLD', 'create', `/groupRoster/${CODE}/people/OLD`, entry()),
  C('member marks own entry past', 'ALLOW', 'MEM', 'update', `/groupRoster/${CODE}/people/MEM`, entry({ status: 'past' }), entry()),
  C('outsider cannot add self to a group', 'DENY', 'OUT', 'create', `/groupRoster/${CODE}/people/OUT`, entry()),
  C('member cannot write someone else', 'DENY', 'MEM', 'create', `/groupRoster/${CODE}/people/OUT`, entry()),
  C('leader cannot write a member entry', 'DENY', 'LEAD', 'create', `/groupRoster/${CODE}/people/MEM`, entry()),
  C('no email field', 'DENY', 'MEM', 'create', `/groupRoster/${CODE}/people/MEM`, entry({ email: 'a@b.c' })),
  C('status must be active or past', 'DENY', 'MEM', 'create', `/groupRoster/${CODE}/people/MEM`, entry({ status: 'leader' })),
  C('name at most 80', 'DENY', 'MEM', 'create', `/groupRoster/${CODE}/people/MEM`, entry({ name: 'x'.repeat(81) })),
  C('editor fills an entry', 'ALLOW', 'EDITOR', 'create', `/groupRoster/${CODE}/people/MEM`, entry()),
  C('editor reads any group', 'ALLOW', 'EDITOR', 'list', `/groupRoster/${OTHER}/people/X`),
  C('member deletes own entry', 'ALLOW', 'MEM', 'delete', `/groupRoster/${CODE}/people/MEM`),
  C('leader cannot delete a member', 'DENY', 'LEAD', 'delete', `/groupRoster/${CODE}/people/MEM`),
  // the leader still cannot see member records
  C('leader cannot read a member record', 'DENY', 'LEAD', 'get', '/members/MEM'),
  C('leader cannot read member ticks', 'DENY', 'LEAD', 'get', '/memberTicks/MEM'),
  // visits and plays
  C('anyone starts a visit counter', 'ALLOW', null, 'create', '/visits/home', { count: 1 }),
  C('visit counter goes up by one', 'ALLOW', null, 'update', '/visits/home', { count: 8 }, { count: 7 }),
  C('visit counter cannot jump', 'DENY', null, 'update', '/visits/home', { count: 100 }, { count: 7 }),
  C('visit counter cannot be set high', 'DENY', null, 'create', '/visits/home', { count: 50 }),
  C('visit counter has no other fields', 'DENY', null, 'create', '/visits/home', { count: 1, who: 'x' }),
  C('visit tag is a plain name', 'DENY', null, 'create', '/visits/a.b', { count: 1 }),
  C('visit counter never deleted', 'DENY', 'EDITOR', 'delete', '/visits/home'),
  C('public cannot read visits', 'DENY', null, 'get', '/visits/home'),
  C('editor reads visits', 'ALLOW', 'EDITOR', 'get', '/visits/home'),
  C('anyone starts a play counter', 'ALLOW', null, 'create', '/plays/s1', { count: 1 }),
  C('play counter goes up by one', 'ALLOW', null, 'update', '/plays/s1', { count: 3 }, { count: 2 }),
  C('public cannot read plays', 'DENY', null, 'get', '/plays/s1'),
  // what was already there still holds
  C('downloads still public to read', 'ALLOW', null, 'get', '/downloads/reach-en'),
  C('public cannot read contact', 'DENY', null, 'get', '/contact/x'),
  C('public cannot read group registrations', 'DENY', null, 'get', '/groups/x'),
  C('unlisted collection denied', 'DENY', 'EDITOR', 'get', '/somethingNew/x'),
];

const res = await fetch(`https://firebaserules.googleapis.com/v1/projects/${PROJECT}:test`, {
  method: 'POST',
  headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
  body: JSON.stringify({ source: { files: [{ name: 'firestore.rules', content: source }] }, testSuite: { testCases: cases.map(c => c.tc) } }),
});
const out = await res.json();
if (!res.ok) { console.error(JSON.stringify(out, null, 2)); process.exit(2); }
if (out.issues?.length) console.error('Issues:', JSON.stringify(out.issues, null, 2));
let bad = 0;
out.testResults.forEach((r, i) => {
  const ok = r.state === 'SUCCESS';
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${cases[i].tc.expectation.padEnd(5)} ${cases[i].name}${ok ? '' : '  ' + (r.debugMessages || []).join(' | ')}`);
});
console.log(`\n${cases.length - bad} of ${cases.length} pass`);
process.exit(bad ? 1 : 0);
