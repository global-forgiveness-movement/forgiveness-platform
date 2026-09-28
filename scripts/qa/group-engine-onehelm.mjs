#!/usr/bin/env node
/* ONEHELM check for the group engine (lane B, 28 Sep).

   The fact: "what a person sees of a group series depends on who they are".
   ONE place decides it: js/group-engine.js. This goes red (exit 1) the moment
   a second place appears — a role compared, a facilitator flag read, or the
   member-ticks switch defined, anywhere else in the site's code.

   Lane D (28 Sep) adds the fact underneath it: "who facilitates a group".
   ONE place records it — groupCodes/{code}.facilitator — and ONE function
   reads it (facilitatorOf, in the engine). Red if a membership ever again
   carries a facilitator flag, if the engine reads `.facilitator` anywhere
   but facilitatorOf, if roleFor answers from the membership instead of the
   code's record, or if firestore.rules decides it from anything but
   groupCodes.

   Run: node scripts/qa/group-engine-onehelm.mjs */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const ENGINE = 'js/group-engine.js';
/* plan/ is Kate's frozen scope document; admin/ never renders a series. */
const SKIP_DIRS = new Set(['.git', 'node_modules', '.planning', 'plan', 'scripts', 'assets']);

const RULES = [
  { re: /\brole\s*[!=]==?/, why: 'compares a role' },
  { re: /[!=]==?\s*['"](visitor|none|member|facilitator)['"]/, why: 'compares against a role name' },
  { re: /\bcase\s+['"](visitor|member|facilitator)['"]/, why: 'switches on a role name' },
  { re: /\.facilitator\b(?![-\w])(?!\s*[:=][^=])/, why: 'reads the facilitator flag' },
  { re: /\bFACILITATOR_SEES_MEMBER_TICKS\s*=/, why: 'defines the member-ticks switch' },
];

/* Writing the account id onto the code's record is the fact itself. */
const ALLOW = [/facilitator:\s*userId\b/];

/* A facilitator FLAG (true/false/computed) on anything is a second decider:
   that is exactly how the September 28 bug was born. Red everywhere,
   the engine included. */
const FLAG = /\bfacilitator\s*:\s*(true|false|!|createdBy|runsGroup|is)/;

/* Comments may talk about roles and facilitators; only code decides. Block
   comments are blanked line-for-line so reported line numbers stay true. */
const blank = (m) => m.replace(/[^\n]/g, ' ');
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/<!--[\s\S]*?-->/g, blank);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(name)) yield* walk(p); }
    else if (/\.(js|mjs|html)$/.test(name)) yield p;
  }
}

const hits = [];
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (rel === ENGINE) continue;
  codeOf(readFileSync(file, 'utf8')).split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may talk about roles
    for (const { re, why } of RULES) {
      if (re.test(line) && !ALLOW.some((a) => a.test(line))) hits.push(`${rel}:${i + 1}  ${why}\n    ${line.trim()}`);
    }
  });
}

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  codeOf(readFileSync(file, 'utf8')).split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    if (FLAG.test(line)) hits.push(`${rel}:${i + 1}  stores a facilitator flag (who facilitates lives on groupCodes/{code} only)\n    ${line.trim()}`);
  });
}

const engine = readFileSync(join(ROOT, ENGINE), 'utf8');
const codeLines = codeOf(engine).split('\n').filter((l) => !/^\s*\/\//.test(l));
const reads = codeLines.filter((l) => /\.facilitator\b/.test(l));
if (reads.length !== 1 || !/export const facilitatorOf\b/.test(reads[0] || '')) {
  hits.push(`${ENGINE}  must read \`.facilitator\` in exactly one place, facilitatorOf — found ${reads.length}:\n    ${reads.map((l) => l.trim()).join('\n    ')}`);
}

/* Behavior, not just text: the membership's say is ignored; the code's
   record is obeyed. */
const { roleFor } = await import(join(ROOT, ENGINE));
const me = { id: 'u_a' };
const flagOnly = roleFor({ surface: 'mypath', user: me, membership: { seriesId: 'secular', facilitator: true }, codeDoc: {} });
const recordOnly = roleFor({ surface: 'mypath', user: me, membership: { seriesId: 'secular' }, codeDoc: { facilitator: 'u_a' } });
const someoneElse = roleFor({ surface: 'mypath', user: me, membership: { seriesId: 'secular', facilitator: true }, codeDoc: { facilitator: 'u_b' } });
if (flagOnly !== 'member') hits.push(`roleFor  a membership flag made someone "${flagOnly}" — only groupCodes/{code}.facilitator may`);
if (recordOnly !== 'facilitator') hits.push(`roleFor  the code's record named this account but roleFor said "${recordOnly}"`);
if (someoneElse !== 'member') hits.push(`roleFor  the code names another account but roleFor said "${someoneElse}"`);

/* The database's twin of the same fact. */
const rules = readFileSync(join(ROOT, 'firestore.rules'), 'utf8');
const fx = rules.match(/function facilitates\(code\)\s*\{([\s\S]*?)\n\s*\}/);
if (!fx || !/groupCodes\/\$\(code\)\)\.data\.get\('facilitator'/.test(fx[1])) {
  hits.push('firestore.rules  facilitates(code) must read groupCodes/$(code).facilitator');
}
if (rules.split('\n').some((l) => !/^\s*(\/\/|\*|\/\*)/.test(l) && /members\/.*facilitator|facilitator.*members\//.test(l))) {
  hits.push('firestore.rules  decides facilitation from a members record');
}

if ((engine.match(/\bFACILITATOR_SEES_MEMBER_TICKS\s*=/g) || []).length !== 1) {
  hits.push(`${ENGINE}  must define FACILITATOR_SEES_MEMBER_TICKS exactly once`);
}

if (hits.length) {
  console.error(`RED — a role is decided outside ${ENGINE} (ONEHELM, lane B):\n\n${hits.join('\n')}\n`);
  console.error('Move the decision into the engine; the display may only draw what deriveSeries returns.');
  process.exit(1);
}
console.log(`green — only ${ENGINE} decides what a role sees, and only groupCodes/{code}.facilitator says who facilitates.`);
