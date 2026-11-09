#!/usr/bin/env bash
# ONEHELM check (SOW, 2026-11-09) — "which interactive workbook edition this is".
# ONE place names each edition's storage key, address and sign-up return:
# js/workbook-editions.js. Goes red if a second place spells one of them, or if
# the church edition grows a copied lesson instead of an overlay.
# Run from anywhere: bash scripts/qa/one-workbook-edition.sh
set -u
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
files=$(git ls-files -co --exclude-standard '*.js' '*.html' | grep -v '^plan/')

# 1. Each edition's storage key and address are written once, in js/workbook-editions.js.
for literal in 'reach-forgiveness\.v1' 'reach-forgiveness-church\.v1' 'edition=church' "next=workbook" "'workbook-church'"; do
  other=$(grep -nE "$literal" $files | grep -v '^js/workbook-editions.js:')
  [ -z "$other" ] || say "$literal is spelled outside js/workbook-editions.js:
$other"
done

# 2. The church edition reuses the REACH lessons: church.js defines no lesson of its own.
grep -nE '^\s*n: [0-9]+,' workbook/js/church.js >/dev/null && say "workbook/js/church.js defines a lesson (n: …) — add steps to the REACH lessons instead"

[ "$fail" -eq 0 ] && echo "GREEN: one-workbook-edition — js/workbook-editions.js alone names each edition's key, address and return."
exit "$fail"
