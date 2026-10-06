#!/usr/bin/env bash
# ONEHELM check (lane A, 2026-09-28) — "how wide a page's content and its text run".
# Decided in ONE place: --page and --measure in css/site.css :root. Goes red if
# the stylesheet hard-codes a page-scale width again, if the page wrapper or the
# footer stops using --page, or if the HTML gains inline max-widths (each one is
# a second place deciding a column). The counts below are a ratchet: the inline
# widths still standing are in regions lane A does not own (My Path signed-in,
# the Groups series and form sections, Contact); lower a count when one goes,
# never raise it.
set -u
# A check that crashes must never read as green (it did on macOS bash 3.2, which
# has no associative arrays): any error below exits non-zero.
trap 'echo "RED: one-page-width crashed at line $LINENO"; exit 2' ERR
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
css=css/site.css

grep -q -- '--page: ' $css && grep -q -- '--measure: ' $css || say "--page / --measure missing from $css :root"
grep -qE '^\.wrap \{[^}]*max-width: var\(--page\)' $css || say ".wrap does not take its width from --page"
grep -qE '\.site-foot \.cols \{[^}]*max-width: var\(--page\)' $css || say "the footer does not take its width from --page"
big=$(grep -nE 'max-width: *([7-9][0-9]{2}|[1-9][0-9]{3,})px' $css | grep -v '@media' || true)
[ -z "$big" ] || say "page-scale width hard-coded in $css (use --page or --measure):
$big"

# Portable to bash 3.2 (macOS): a case, not an associative array.
allow() { case "$1" in
  contact/index.html) echo 5;; groups/index.html) echo 0;; my-path/index.html) echo 1;;
  research/index.html) echo 1;; *) echo 0;; esac; }
for f in $(git ls-files '*.html' | grep -v '^plan/\|^workbook/\|^admin/'); do
  n=$(grep -o 'style="[^"]*max-width' "$f" | wc -l | tr -d ' ' || true)
  max=$(allow "$f")
  [ "$n" -le "$max" ] || say "$f has $n inline max-width(s), allowed $max — put it in the column (css/site.css), not the page"
done

[ $fail -eq 0 ] && echo "GREEN: one-page-width — --page and --measure decide every column."
exit $fail
