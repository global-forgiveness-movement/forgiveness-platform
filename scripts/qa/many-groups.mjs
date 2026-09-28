#!/usr/bin/env node
/* Lane D (28 Sep): one person, several groups — and nobody loses the group
   they joined before the change.

   1. A pre-28 Sep members record ({ code, seriesId, facilitator, ... }) reads
      as the new map, keeps the person's name and newsletter choice, and
      drops the facilitator flag (who facilitates is the code's record only).
   2. A new-shape record reads back unchanged and is not re-saved.
   3. Old single-set lesson ticks read as that group's ticks; a second group's
      ticks sit beside them without touching them.

   Run: node scripts/qa/many-groups.mjs   (exit 1 on any failure) */
import { membershipsOf, ticksOf } from '../../js/groups.js';

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };

console.log('An old single-group record converts');
const old = { name: 'Wyatt Roy', newsletter: true, createdAt: '2026-09-20T00:00:00Z',
  code: 'GFM-3-4NXT', seriesId: 'secular', groupName: 'Boston', joinedAt: '2026-09-24T00:00:00Z', facilitator: true };
const a = membershipsOf(old);
ok(a.converted, 'marked for saving once');
ok(a.doc.name === 'Wyatt Roy' && a.doc.newsletter === true && a.doc.createdAt === old.createdAt, 'name, newsletter and createdAt kept');
ok(JSON.stringify(a.doc.groups) === JSON.stringify({ 'GFM-3-4NXT': { seriesId: 'secular', groupName: 'Boston', status: 'active', joinedAt: old.joinedAt } }), 'the group is in the map, active');
ok(!('facilitator' in a.doc) && !('code' in a.doc) && !('seriesId' in a.doc), 'old top-level fields, the facilitator flag included, are gone');

console.log('A new record is left alone');
const b = membershipsOf(a.doc);
ok(!b.converted && JSON.stringify(b.doc) === JSON.stringify(a.doc), 'reads back identical, not re-saved');
ok(!membershipsOf(null).converted && Object.keys(membershipsOf(null).doc.groups).length === 0, 'no record: no groups, nothing to save');
ok(!membershipsOf({ name: 'Kate' }).converted, 'a name-only record (signed up, never joined) is not re-saved');

console.log('Old record whose group is already in the map');
const both = membershipsOf({ code: 'GFM-3-4NXT', seriesId: 'secular', groups: { 'GFM-3-4NXT': { seriesId: 'secular', status: 'past', joinedAt: 'x' } } });
ok(both.doc.groups['GFM-3-4NXT'].status === 'past', 'the map wins — a finished group is not revived by leftovers');

console.log('Lesson ticks, per group');
const t = ticksOf({ code: 'GFM-3-4NXT', ticks: { 'own-2': true } });
ok(t['GFM-3-4NXT']?.['own-2'] === true, 'old single set reads as that group’s ticks');
const t2 = ticksOf({ groups: { ...t, 'GFM-6-GPQQ': { 'own-1': true } } });
ok(t2['GFM-3-4NXT']['own-2'] && t2['GFM-6-GPQQ']['own-1'] && !t2['GFM-6-GPQQ']['own-2'], 'two groups’ ticks sit side by side');

if (failed) { console.error(`\nRED — ${failed} failed.`); process.exit(1); }
console.log('\ngreen — many groups, and the old shape converts without losing anyone’s group.');
