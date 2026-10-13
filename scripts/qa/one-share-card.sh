#!/usr/bin/env bash
# ONEHELM check (2026-10-12) — "what a link looks like when someone shares it".
# Every page carries the SAME share-card block in its <head> (link previews
# don't run JavaScript, so it can't be drawn by site.js). Goes red if a page
# is missing it or carries a version that differs from the home page's.
# Run from anywhere: bash scripts/qa/one-share-card.sh
set -u
cd "$(dirname "$0")/../.."
fail=0
block() { sed -n '/SHARE CARD/,/twitter:card/p' "$1"; }
ref=$(block index.html)
[ -n "$ref" ] || { echo "RED: index.html has no share-card block"; exit 1; }
for f in $(git ls-files '*.html' | grep -v '^plan/\|^admin/'); do
  b=$(block "$f")
  [ -n "$b" ] || { echo "RED: $f has no share-card block"; fail=1; continue; }
  [ "$b" = "$ref" ] || { echo "RED: $f's share-card block differs from index.html's"; fail=1; }
  n=$(grep -c 'og:image"' "$f"); [ "$n" -eq 1 ] || { echo "RED: $f has $n og:image tags (want 1)"; fail=1; }
done
img=$(echo "$ref" | sed -n 's#.*og:image" content="https://globalforgiveness.org/\([^"]*\)".*#\1#p')
[ -n "$img" ] || { echo "RED: og:image is not an absolute https://globalforgiveness.org/ address (the CNAME)"; fail=1; }
[ -f "$img" ] || { echo "RED: the share image $img is not in the repo"; fail=1; }
[ $fail -eq 0 ] && echo "GREEN: one-share-card — every page shares the same card, and its image exists."
exit $fail
