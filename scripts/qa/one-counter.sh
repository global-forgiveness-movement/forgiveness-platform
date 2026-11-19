#!/usr/bin/env bash
# ONEHELM check (SOW, 2026-11-09) — "what the site counts".
# ONE place counts: js/metrics.js (downloads, visits, plays — a number and
# nothing else, the privacy page's "What we do collect"). Goes red if a second
# place pushes a counter up, or marks a film for counting.
# Run from anywhere: bash scripts/qa/one-counter.sh
set -u
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
files=$(git ls-files -co --exclude-standard '*.js' '*.html' | grep -v '^plan/')

other=$(grep -nE '\.increment\(' $files | grep -v '^js/metrics.js:\|^js/store.js:')
[ -z "$other" ] || say "a counter is pushed up outside js/metrics.js:
$other"

other=$(grep -nE 'data-film=' $files | grep -v '^js/video.js:')
[ -z "$other" ] || say "a film is marked for counting outside videoFrame() in js/video.js:
$other"

grep -q 'Anonymous visit and video counts' privacy/index.html || say "the privacy page no longer says visits and plays are counted (js/metrics.js still counts them)"

grep -q 'the interactive workbook is opened' privacy/index.html || say "the privacy page no longer says workbook opens are counted (workbook/bridge.js still counts them)"
grep -q 'The only thing counted is how many times the workbook is opened' workbook/js/app.js || say "the workbook's own privacy page no longer says opens are counted"
other=$(grep -nE 'recordOpen\(' $files | grep -v '^js/metrics.js:\|^workbook/bridge.js:')
[ -z "$other" ] || say "a workbook open is counted outside workbook/bridge.js:
$other"

[ "$fail" -eq 0 ] && echo "GREEN: one-counter — js/metrics.js alone counts, and the privacy page says what."
exit "$fail"
