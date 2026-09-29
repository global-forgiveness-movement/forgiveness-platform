#!/usr/bin/env node
/* Unit check for js/group-engine.js (lane B, 28 Sep).

   1. For both series, deriveSeries for all four roles returns the SAME steps,
      in the same order, with the same titles — roles change what a person may
      do and see, never what the series is.
   2. Wyatt's rulings 4–6 and the call's rules, each as an assertion.

   Run: node scripts/qa/group-engine-roles.mjs   (exit 1 on any failure) */
import { deriveSeries, roleFor, applyGroupAction, applyMyTick, ROLES, FACILITATOR_SEES_MEMBER_TICKS } from '../../js/group-engine.js';
import { SERIES } from '../../js/data.js';

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };
const NOW = new Date('2026-10-06T18:00:00Z');
const V = 'placeholder';
const step = (view, id) => view.steps.find((s) => s.id === id);
const act = (s, scope) => s.actions.find((a) => a.scope === scope);

console.log('Same series for every role');
for (const series of Object.values(SERIES)) {
  const group = { steps: { prep: { done: true }, 'meet-1': { done: true } } };
  const views = ROLES.map((role) => deriveSeries({ series, group, me: { 'own-2': true }, role, now: NOW, video: V }));
  const sig = (v) => v.steps.map((s) => `${s.id}|${s.kind}|${s.tag}|${s.title}|${s.detail}`).join('\n');
  ok(views.every((v) => sig(v) === sig(views[0])), `${series.id}: ${views[0].steps.length} steps identical across ${ROLES.join(', ')}`);
  ok(views[0].steps.every((s) => s.fields.title && s.fields.detail), `${series.id}: every step names its data-field paths`);
}

const S = SERIES.secular;

console.log('Who is looking');
ok(roleFor({ surface: 'public', user: { id: 'u' }, membership: { seriesId: 'secular' }, codeDoc: { facilitator: 'u' } }) === 'visitor', 'the Groups page is always the visitor view');
ok(roleFor({ surface: 'mypath', user: null }) === 'visitor', 'signed out is a visitor');
ok(roleFor({ surface: 'mypath', user: { id: 'u' }, membership: null }) === 'none', 'signed in, no group: none');
ok(roleFor({ surface: 'mypath', user: { id: 'u' }, membership: { seriesId: 'secular' } }) === 'member', 'a code entered: member');
ok(roleFor({ surface: 'mypath', user: { id: 'u' }, membership: { seriesId: 'secular' }, codeDoc: { facilitator: 'u' } }) === 'facilitator', 'the code’s record names you: facilitator');
ok(roleFor({ surface: 'mypath', user: { id: 'u' }, membership: { seriesId: 'secular' }, codeDoc: { seriesId: 'secular' } }) === 'member', 'a pre-28 Sep code naming nobody: member, so no tick is offered that the database would refuse');

console.log('Visitor and none see the plain map');
for (const role of ['visitor', 'none']) {
  const v = deriveSeries({ series: S, group: { steps: { 'meet-1': { done: true } } }, role, now: NOW, video: V });
  ok(v.steps.every((s) => s.state === 'preview' && s.actions.length === 0 && !s.video), `${role}: preview only, no actions, no session video`);
}

console.log('Ticking a meeting opens the next (Kate, 24 Sep)');
let g = { steps: {} };
let f = deriveSeries({ series: S, group: g, role: 'facilitator', now: NOW, video: V });
ok(step(f, 'prep').state === 'open' && step(f, 'meet-1').state === 'upcoming', 'fresh group: only the first step is open');
g = applyGroupAction(g, 'prep', { type: 'check', value: true });
g = applyGroupAction(g, 'meet-1', { type: 'check', value: true });
f = deriveSeries({ series: S, group: g, role: 'facilitator', now: NOW, video: V });
ok(step(f, 'meet-1').state === 'done' && step(f, 'own-2').state === 'open' && step(f, 'meet-2').state === 'open', 'meeting 1 ticked: lessons 1–6 and meeting 2 open');
ok(step(f, 'meet-3').state === 'upcoming', 'meeting 3 stays grayed');

console.log('Videos');
let m = deriveSeries({ series: S, group: g, role: 'member', now: NOW, video: V });
ok(step(m, 'meet-1').video.playable, 'member: a done meeting’s video can be re-watched');
ok(!step(m, 'meet-2').video.playable, 'member: an open, not-yet-held meeting’s video is not playable yet');
ok(step(f, 'meet-2').video.playable, 'facilitator: can play the open meeting’s video in the room');
ok(!step(f, 'meet-3').video.playable, 'facilitator: an upcoming meeting’s video is not playable');
ok(step(m, 'meet-1').video.src === V, 'every slot uses the placeholder (ruling 8)');

console.log('A forgotten tick: the date passes (ruling 4)');
let g4 = applyGroupAction({ steps: {} }, 'meet-2', { type: 'meeting', when: '2026-10-01T23:00:00.000Z', place: 'St. Mark’s hall', link: 'zoom.us/j/1' });
f = deriveSeries({ series: S, group: g4, role: 'facilitator', now: NOW, video: V });
ok(step(f, 'meet-2').state === 'done', 'meeting 2 is done once its time has passed, unticked');
ok(step(f, 'meet-1').state === 'done' && step(f, 'prep').state === 'done', 'and everything the group did before it is done too');
ok(act(step(f, 'meet-2'), 'group').locked && act(step(f, 'meet-2'), 'group').checked, 'its box shows ticked, locked, with a note');
ok(step(f, 'meet-3').state === 'open', 'meeting 3 opens by itself');
ok(step(f, 'meet-2').meeting.link === 'https://zoom.us/j/1', 'a typed link becomes a real https link');
ok(safeScheme(), 'a javascript: link is refused');
function safeScheme() {
  const x = applyGroupAction({ steps: {} }, 'meet-1', { type: 'meeting', link: 'javascript:alert(1)' });
  return !x.steps['meet-1'].link.startsWith('javascript');
}

console.log('Someone who joins late (ruling 6)');
const late = deriveSeries({ series: S, group: g, me: null, role: 'member', now: NOW, video: V });
ok(step(late, 'meet-1').state === 'done' && step(late, 'meet-1').video.playable, 'a brand-new member sees meeting 1 done and its video open');

console.log('A member’s ticks are theirs (ruling 5)');
m = deriveSeries({ series: S, group: g, me: applyMyTick(null, 'own-2', true), role: 'member', now: NOW, video: V });
ok(step(m, 'own-2').state === 'done', 'member ticked lessons 1–6: done for them');
ok(!step(m, 'meet-2').actions.some((a) => a.scope === 'group'), 'a member cannot tick a meeting');
ok(!step(m, 'meet-2').actions.some((a) => a.type === 'meeting'), 'a member cannot set a meeting date');
ok(m.steps.filter((s) => s.kind === 'own' && s.id !== 'prep').every((s) => act(s, 'mine')), 'a member can tick every block of lessons');
ok(!m.steps.some((s) => s.materials.some((x) => x.kind === 'soon')), 'a member is not shown facilitator materials (Kate, 24 Sep)');
f = deriveSeries({ series: S, group: g, me: null, ticks: [{ ticks: { 'own-2': true } }], role: 'facilitator', now: NOW, video: V });
ok(FACILITATOR_SEES_MEMBER_TICKS === false, 'FACILITATOR_SEES_MEMBER_TICKS is OFF');
ok(f.steps.every((s) => s.tally === null), 'with it off, a facilitator sees no member ticks');
ok(step(f, 'own-2').state !== 'done', 'a member’s tick does not change the facilitator’s own view');

console.log('The next meeting sits at the top');
m = deriveSeries({ series: S, group: applyGroupAction(g, 'meet-2', { type: 'meeting', when: '2026-10-13T23:00:00.000Z', place: 'Library' }), role: 'member', now: NOW, video: V });
ok(m.next && m.next.stepId === 'meet-2' && m.next.whenText.includes('October') && m.next.place === 'Library', `next: ${m.next?.whenText} · ${m.next?.place}`);

console.log('Every meeting planned before the group starts (29 Sep call)');
let pf = deriveSeries({ series: S, group: null, role: 'facilitator', now: NOW, video: V });
const together = pf.steps.filter((s) => s.kind === 'together').map((s) => s.id);
ok(pf.plan && pf.plan.meetings.length === together.length, `a new group asks for all ${together.length} meeting dates at once`);
ok(deriveSeries({ series: S, group: null, role: 'member', now: NOW, video: V }).plan === null, 'a member is never asked to plan');
const planned = applyGroupAction(null, null, { type: 'schedule', entries: together.map((id, i) => ({ stepId: id, when: `2026-10-${10 + 7 * i}T23:00:00.000Z` })), place: 'Library', link: '' });
ok(together.every((id) => planned.steps[id].when && planned.steps[id].place === 'Library'), 'the plan sets every date, and one place for all');
pf = deriveSeries({ series: S, group: planned, role: 'facilitator', now: NOW, video: V });
ok(pf.plan === null, 'once any date is set, the plan gives way to the next meeting');

console.log('A place typed once fills the other meetings (29 Sep call)');
const firstAct = step(deriveSeries({ series: S, group: null, role: 'facilitator', now: NOW, video: V }), together[0]).actions.find((x) => x.type === 'meeting');
ok(firstAct.others.length === together.length - 1, 'each meeting knows the others it fills');
const filled = applyGroupAction({ steps: { [together[1]]: { place: 'Own room' } } }, together[0], { type: 'meeting', when: '', place: 'Church hall', link: '', others: firstAct.others });
ok(filled.steps[together[0]].place === 'Church hall', 'the meeting typed in gets it');
ok(filled.steps[together[1]].place === 'Own room', 'a meeting with its own place keeps it');
ok(together.slice(2).every((id) => filled.steps[id].place === 'Church hall'), 'the rest are filled');

console.log('The account reminder (Richard, 29 Sep call)');
const prepF = step(deriveSeries({ series: S, group: null, role: 'facilitator', now: NOW, video: V }), 'prep');
const acct = prepF.actions.find((x) => x.target === 'prep-accounts');
ok(acct && !acct.checked, 'a facilitator is offered "Everyone has made a free account"');
ok(!step(deriveSeries({ series: S, group: null, role: 'member', now: NOW, video: V }), 'prep').actions.some((x) => x.target), 'a member is not');
const ticked = applyGroupAction(null, 'prep-accounts', { type: 'check', value: true });
const after = deriveSeries({ series: S, group: ticked, role: 'facilitator', now: NOW, video: V });
ok(step(after, 'prep').actions.find((x) => x.target === 'prep-accounts').checked, 'ticking it is remembered');
ok(step(after, 'meet-1').state === 'upcoming', 'and it opens nothing — the workbook tick still gates');

if (failed) { console.error(`\nRED — ${failed} failed.`); process.exit(1); }
console.log('\ngreen — the engine holds for every role.');
