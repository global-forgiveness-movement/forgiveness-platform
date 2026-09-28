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
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
css=css/site.css

grep -q -- '--page: ' $css && grep -q -- '--measure: ' $css || say "--page / --measure missing from $css :root"
grep -qE '^\.wrap \{[^}]*max-width: var\(--page\)' $css || say ".wrap does not take its width from --page"
grep -qE '\.site-foot \.cols \{[^}]*max-width: var\(--page\)' $css || say "the footer does not take its width from --page"
big=$(grep -nE 'max-width: *([7-9][0-9]{2}|[1-9][0-9]{3,})px' $css | grep -v '@media')
[ -z "$big" ] || say "page-scale width hard-coded in $css (use --page or --measure):
$big"

declare -A ALLOW=( [contact/index.html]=5 [groups/index.html]=10 [my-path/index.html]=7 [research/index.html]=1 [workbooks/index.html]=1 )
for f in $(git ls-files '*.html' | grep -v '^plan/\|^workbook/\|^admin/'); do
  n=$(grep -o 'style="[^"]*max-width' "$f" | wc -l)
  max=${ALLOW[$f]:-0}
  [ "$n" -le "$max" ] || say "$f has $n inline max-width(s), allowed $max — put it in the column (css/site.css), not the page"
done

[ $fail -eq 0 ] && echo "GREEN: one-page-width — --page and --measure decide every column."
exit $fail
