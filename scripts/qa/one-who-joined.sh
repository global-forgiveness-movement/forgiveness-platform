#!/usr/bin/env bash
# ONEHELM check (Kate, 2026-11-18) — "who joined a group".
# ONE place writes a group's list of who joined: js/groups.js, from what
# whoJoinedEntries() says a person's own record stands for. ONE place says who
# may see it: the engine's seesWhoJoined (facilitator only), matched by
# firestore.rules groupRoster. Goes red if a second place writes the list, if
# the rule stops limiting it to the leader, or if a privacy line stops saying
# the leader sees your name.
# Run from anywhere: bash scripts/qa/one-who-joined.sh
set -u
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
files=$(git ls-files -co --exclude-standard '*.js' '*.html' '*.mjs' | grep -vE '^(plan|scripts/qa)/')  # tests may name it

other=$(grep -nE 'groupRoster' $files | grep -v '^js/groups.js:')
[ -z "$other" ] || say "the who-joined list is named outside js/groups.js:
$other"

n=$(grep -cE 'store\.(set|remove)\(WHO_JOINED' js/groups.js)
[ "$n" -eq 3 ] || say "js/groups.js should touch the list in three places only (writeWhoJoined: one set, one remove; eraseGroupData: one remove on account deletion), found $n"
n=$(grep -cE 'store\.set\(WHO_JOINED' js/groups.js)
[ "$n" -eq 1 ] || say "an entry is written in more than one place in js/groups.js ($n); only writeWhoJoined may"

grep -q 'seesWhoJoined: true' js/group-engine.js || say "the engine no longer says the facilitator sees who joined"
[ "$(grep -c 'seesWhoJoined: true' js/group-engine.js)" -eq 1 ] || say "more than one role sees who joined"

grep -q "match /groupRoster/{code}/people/{uid}" firestore.rules || say "firestore.rules has no groupRoster rule"
grep -A1 "match /groupRoster/{code}/people/{uid}" firestore.rules | grep -q "allow read: if isOwner(uid) || facilitates(code) || isEditor();" \
  || say "the groupRoster read rule is no longer owner, the code's facilitator, or an editor"
grep -A8 "match /groupRoster/{code}/people/{uid}" firestore.rules | grep -q "hasOnly(\['name', 'status', 'joinedAt'\])" \
  || say "an entry may now hold more than a name, a status and a date"

grep -q 'that group’s leader can see your name' privacy/index.html || say "the privacy page no longer says the leader sees your name"
grep -q 'Your group’s leader will see your name' my-path/index.html || say "My Path's join card no longer says the leader sees your name"
grep -q 'Your group’s leader will see your name' js/code-entry.js || say "the code box no longer says the leader sees your name"

[ "$fail" -eq 0 ] && echo "GREEN: one-who-joined — js/groups.js alone writes it, the leader alone reads it, and the privacy lines say so."
exit "$fail"
