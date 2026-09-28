#!/usr/bin/env bash
# ONEHELM check (lane A, 2026-09-28) — "the evidence is about the workbook".
# One line, one data-copy key (evidence.p.these-results-come-from), said on the
# home page and the Groups page. An editor's change to that key changes both;
# this goes red if the two committed defaults drift apart, if the key turns up
# on a third page, or if either page loses it.
set -u
cd "$(dirname "$0")/../.."
KEY='evidence.p.these-results-come-from'
fail=0
pages=$(git ls-files '*.html' | xargs grep -l "data-copy=\"$KEY\"" | sort | tr '\n' ' ')
[ "$pages" = "groups/index.html index.html " ] || { echo "RED: $KEY is on: ${pages:-nowhere} (want index.html and groups/index.html)"; fail=1; }
texts=$(git ls-files '*.html' | xargs grep -ho "data-copy=\"$KEY\">[^<]*<" | sort -u | wc -l)
[ "$texts" -eq 1 ] || { echo "RED: the two copies of $KEY have different default text — change both, or neither"; fail=1; }
[ $fail -eq 0 ] && echo "GREEN: one-evidence-line — one key, one wording, on the home and Groups pages."
exit $fail
