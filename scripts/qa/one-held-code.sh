#!/usr/bin/env bash
# ONEHELM check (lane A, 2026-09-28) — "a code someone typed before they had an account".
# ONE place holds it and says it: js/groups.js (holdGroupCode / heldGroupCode /
# forgetGroupCode / heldCodeLine). Goes red if a second place stores, reads or
# words it. Run from anywhere: bash scripts/qa/one-held-code.sh
set -u
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
files=$(git ls-files '*.js' '*.html' | grep -v '^plan/\|^workbook/')

# 1. The storage key is written exactly once, in js/groups.js.
n=$(grep -o 'gfm\.pendingGroupCode' $files | wc -l)
where=$(grep -l 'gfm\.pendingGroupCode' $files)
[ "$n" -eq 1 ] && [ "$where" = "js/groups.js" ] || say "the held-code storage key appears $n time(s), in: $where (want once, in js/groups.js)"

# 2. Nobody else touches storage for a group code.
other=$(grep -nE 'localStorage[^;]*[Cc]ode|[Cc]ode[^;]*localStorage' $files | grep -v '^js/groups.js:')
[ -z "$other" ] || say "group code kept in storage outside js/groups.js:
$other"

# 3. The sentence that tells someone their code is waiting is written once.
#    Pages call heldCodeLine(); none composes its own from the held series.
own=$(grep -nE '(held|already)\.series\.name' $files | grep -v '^js/groups.js:')
[ -z "$own" ] || say "a page words the held code itself instead of heldCodeLine():
$own"
n=$(grep -o 'is saved in this browser' $files | wc -l)
[ "$n" -eq 1 ] || say "\"is saved in this browser\" appears $n times (want 1, in heldCodeLine)"

# 4. The reason a code is refused comes from groupCodeProblem, not per-page copy.
own=$(grep -nE "doesn.t look like a group code" $files)
[ -z "$own" ] || say "a page writes its own refusal instead of groupCodeProblem():
$own"

[ $fail -eq 0 ] && echo "GREEN: one-held-code — one place holds, reads and words a code typed before an account."
exit $fail
