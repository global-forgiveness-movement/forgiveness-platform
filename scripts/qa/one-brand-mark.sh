#!/usr/bin/env bash
# ONEHELM check (lane E, 2026-09-28) — "which marks sit beside the site name".
# ONE place names them: BRAND in js/data.js (the GFM logo file, null until it
# arrives). The header shows that logo alone — the HFP seal came out (Wyatt, 28 Sep). ONE place draws them: buildHeader in js/site.js.
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
grep -q 'BRAND.gfm ?' js/site.js || say "the header does not draw its mark from BRAND"
# Wyatt, 28 Sep: the GFM logo stands alone; no seal in the header. (The Harvard
# seal, BRAND.hfpSealHarvard, is drawn by site.js into page bodies only.)
grep -qE 'brand-seal|BRAND\.hfpSeal([^H]|$)' js/site.js && say "the header draws a seal again — it shows the GFM logo alone (Wyatt, 28 Sep)"
[ $fail -eq 0 ] && echo "GREEN: one-brand-mark — BRAND names the header's marks; the header alone draws them."
exit $fail
