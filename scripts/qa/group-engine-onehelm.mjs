#!/usr/bin/env node
/* ONEHELM check for the group engine (lane B, 28 Sep).

   The fact: "what a person sees of a group series depends on who they are".
   ONE place decides it: js/group-engine.js. This goes red (exit 1) the moment
   a second place appears — a role compared, a facilitator flag read, or the
   member-ticks switch defined, anywhere else in the site's code.

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

/* Writing the flag at registration is a record, not a decision. */
const ALLOW = [/facilitator:\s*true/];

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
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may talk about roles
    for (const { re, why } of RULES) {
      if (re.test(line) && !ALLOW.some((a) => a.test(line))) hits.push(`${rel}:${i + 1}  ${why}\n    ${line.trim()}`);
    }
  });
}

const engine = readFileSync(join(ROOT, ENGINE), 'utf8');
if ((engine.match(/\bFACILITATOR_SEES_MEMBER_TICKS\s*=/g) || []).length !== 1) {
  hits.push(`${ENGINE}  must define FACILITATOR_SEES_MEMBER_TICKS exactly once`);
}

if (hits.length) {
  console.error(`RED — a role is decided outside ${ENGINE} (ONEHELM, lane B):\n\n${hits.join('\n')}\n`);
  console.error('Move the decision into the engine; the display may only draw what deriveSeries returns.');
  process.exit(1);
}
console.log(`green — only ${ENGINE} decides what a role sees.`);
