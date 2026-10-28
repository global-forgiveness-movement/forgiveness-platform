#!/usr/bin/env bash
# ONEHELM check (2026-10-27) — "the site has five text styles".
# Decided in ONE place: the --fs-* tokens in css/site.css :root. Goes red if any
# font-size or font shorthand in the stylesheet, a page or a page script names
# a size of its own instead of a token, if a token goes missing, or if a sixth
# one appears. The one exception is the script word on About (.def-word), a
# flourish rather than text. /admin and the interactive workbook keep their own
# stylesheets and are outside this check.
set -u
trap 'echo "RED: one-type-scale crashed at line $LINENO"; exit 2' ERR
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
css=css/site.css

for t in display heading body small label; do
  grep -q -- "--fs-$t: " $css || say "--fs-$t missing from $css :root"
done
n=$(grep -oE -- '--fs-[a-z]+: ' $css | sort -u | wc -l | tr -d ' ')
[ "$n" -eq 5 ] || say "$css defines $n type tokens; the scale has five"

files=$(git ls-files '*.css' '*.html' '*.js' | grep -v '^plan/\|^workbook/\|^admin/\|^scripts/\|^\.planning/\|^forgiveness-platform/\|^js/firebase')
stray=$(grep -nE 'font-size: *[^;"]+|font: *[0-9]{3} +[0-9.]+(px|rem|em)' $files \
  | grep -v 'var(--fs-' | grep -v 'font-size on the site' | grep -v '^css/site.css:[0-9]*:\.def-word' || true)
[ -z "$stray" ] || say "a size that isn't one of the five styles (use var(--fs-…)):
$stray"

[ $fail -eq 0 ] && echo "GREEN: one-type-scale — five tokens decide every text size."
exit $fail
