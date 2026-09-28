#!/usr/bin/env bash
# ONEHELM check (lane E, 2026-09-28) — "which marks sit beside the site name".
# ONE place names them: BRAND in js/data.js (the GFM logo file, null until it
# arrives, and the HFP seal). ONE place draws them: buildHeader in js/site.js.
# Red if a brand file is named anywhere else in the site's code, or if the
# header draws a mark that does not come from BRAND.
set -u
cd "$(dirname "$0")/../.."
fail=0
say() { echo "RED: $*"; fail=1; }
files=$(git ls-files '*.js' '*.html' '*.css' | grep -v '^plan/\|^workbook/\|^scripts/')
named=$(grep -n 'assets/brand/' $files | grep -v '^js/data.js:' || true)
[ -z "$named" ] || say "a brand file is named outside BRAND in js/data.js:
$named"
grep -q '^export const BRAND = {' js/data.js || say "BRAND is missing from js/data.js"
grep -q 'BRAND.gfm ?' js/site.js && grep -q 'BRAND.hfpSeal' js/site.js || say "the header does not draw its marks from BRAND"
n=$(grep -c 'brand-seal' js/site.js)
[ "$n" -eq 1 ] || say "the seal is drawn $n times in js/site.js (want 1)"
[ $fail -eq 0 ] && echo "GREEN: one-brand-mark — BRAND names the header's marks; the header alone draws them."
exit $fail
