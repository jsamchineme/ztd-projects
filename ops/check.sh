#!/usr/bin/env bash
# Syntax-checks every JavaScript file of Studio (server, root helper and browser code), so a broken file can't be
# committed (.githooks/pre-commit) or installed (ops/install.sh). Prints each broken file and exits 1.
#   bash ops/check.sh [folder]      default: the Studio code this script belongs to
set -uo pipefail
DIR="$(cd "${1:-$(dirname "$0")/..}" && pwd)"
bad=0
while IFS= read -r -d '' f; do
  if ! err=$(node --check "$f" 2>&1); then
    echo "✗ ${f#"$DIR"/}"; echo "$err" | grep -Ev '^Node.js v|^\s+at ' | sed '/^$/d; s/^/    /' | head -8
    bad=1
  fi
done < <(find "$DIR" \( -name node_modules -o -name .git \) -prune -o -type f \( -name '*.mjs' -o -name '*.js' \) -print0)
[ "$bad" = 0 ] || echo "Fix the files above first: Studio would not start (or its pages would not load) with them."
exit "$bad"
