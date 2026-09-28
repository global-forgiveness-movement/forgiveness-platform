#!/usr/bin/env node
/* ONEHELM check for "which address a film plays from" (lane E, 2026-09-28).

   ONE place decides it: js/video.js — embedUrl() turns whatever link an
   editor pasted into the address the film plays from, and videoFrame() is the
   only code that draws an <iframe>. This goes red (exit 1) when:

   1. STATIC — an <iframe> (markup or createElement) appears in the site's
      code anywhere but js/video.js: a second place building a player's
      address, which is how a pasted Vimeo page link stopped playing before.
   2. UNIT — embedUrl() gets any of the links below wrong: Vimeo page,
      private, player, channel and showcase-style links; YouTube watch,
      share, Shorts, embed, nocookie, playlist and start-time links.

   No network, no browser. Run: node scripts/qa/one-video-address.mjs */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { embedUrl, videoFrame } from '../../js/video.js';

const ROOT = new URL('../..', import.meta.url).pathname;
const HOME = 'js/video.js';
/* plan/ is Kate's frozen scope document; workbook/ is the canonical workbook
   app, which draws no films. */
const SKIP = new Set(['.git', 'node_modules', '.planning', 'plan', 'scripts', 'assets']);

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.error(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(js|mjs|html)$/.test(name)) yield p;
  }
}

console.log('Only js/video.js draws a player');
const others = [];
for (const p of files(ROOT)) {
  const rel = relative(ROOT, p);
  if (rel === HOME) continue;
  readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (/<iframe\b|createElement\(\s*['"`]iframe/i.test(line)) others.push(`${rel}:${i + 1}: ${line.trim()}`);
  });
}
ok(others.length === 0, others.length ? `an iframe is built outside ${HOME}:\n    ${others.join('\n    ')}` : `no iframe outside ${HOME}`);

console.log('Links an editor might paste');
const CASES = [
  // Vimeo
  ['https://vimeo.com/123456789', 'https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0'],
  ['vimeo.com/123456789', 'https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0'],
  ['https://vimeo.com/123456789/abcdef1234', 'https://player.vimeo.com/video/123456789?h=abcdef1234&title=0&byline=0&portrait=0'],
  ['https://vimeo.com/123456789?share=copy', 'https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0'],
  ['https://player.vimeo.com/video/123456789?h=abcdef1234&badge=0', 'https://player.vimeo.com/video/123456789?h=abcdef1234&title=0&byline=0&portrait=0'],
  ['https://vimeo.com/channels/staffpicks/123456789', 'https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0'],
  ['https://vimeo.com/groups/forgive/videos/123456789', 'https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0'],
  ['https://vimeo.com/manage/videos/123456789/abcdef1234', 'https://player.vimeo.com/video/123456789?h=abcdef1234&title=0&byline=0&portrait=0'],
  // YouTube
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ['https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=share', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ['https://youtu.be/dQw4w9WgXcQ?si=AbCdEf', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ['https://youtu.be/dQw4w9WgXcQ?t=90', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=90'],
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=90'],
  ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ['https://www.youtube.com/playlist?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE', 'https://www.youtube-nocookie.com/embed/videoseries?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE'],
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE'],
  // Today's placeholder (PLAYLIST in js/data.js) must keep playing unchanged.
  ['https://www.youtube-nocookie.com/embed/videoseries?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE', 'https://www.youtube-nocookie.com/embed/videoseries?list=PLwztLq8L6GzGM0KtjT74JTB-91uuo_dvE'],
  // Not a film address
  ['', null],
  ['not a link', null],
  ['javascript:alert(1)', null],
  ['https://vimeo.com/', null],
  ['https://www.youtube.com/watch?v=short', null],
];
for (const [input, want] of CASES) {
  const got = embedUrl(input);
  ok(got === want, `${JSON.stringify(input)} → ${got}${got === want ? '' : `   (want ${want})`}`);
}

console.log('The frame');
const frame = videoFrame('https://vimeo.com/123456789', 'A "film"');
ok(frame.includes('src="https://player.vimeo.com/video/123456789?title=0&amp;byline=0&amp;portrait=0"'), 'a Vimeo page link draws a player.vimeo.com frame');
ok(frame.includes('title="A &quot;film&quot;"'), 'the title is escaped');
ok(videoFrame('not a link') === '', 'a link that is not a film draws nothing, not a broken frame');

console.log(failed ? `\nRED — ${failed} failure(s).` : '\ngreen — one place decides which address a film plays from.');
process.exit(failed ? 1 : 0);
