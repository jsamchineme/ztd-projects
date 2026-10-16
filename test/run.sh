#!/usr/bin/env bash
# Runs the browser test against a throwaway Studio built from this folder (including uncommitted changes):
#   npm test                 or   bash test/run.sh [screenshot dir]
# No root and no systemd: projects and services are faked by test/mock-ctl.mjs, Claude by ops/fake-claude.mjs.
# Packages are installed once per package-lock.json into ~/.cache/studio-test, so later runs start in seconds.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
SHOTS="${1:-/tmp/studio-test-shots}"
PORT="${STUDIO_TEST_PORT:-4310}"
CHROME_BIN="${CHROME_BIN:-$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)}"
[ -n "$CHROME_BIN" ] || { echo "No Chrome found: set CHROME_BIN"; exit 2; }
export CHROME_BIN

# Packages, cached by the lock file's hash.
CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/studio-test/$(sha1sum "$SRC/package-lock.json" | cut -c1-12)"
if [ ! -d "$CACHE/node_modules" ]; then
  echo "Installing packages into $CACHE (once)…"
  rm -rf "$CACHE"; mkdir -p "$CACHE"
  cp "$SRC/package.json" "$SRC/package-lock.json" "$CACHE/"
  ( cd "$CACHE" && npm ci --no-audit --no-fund >/dev/null )
fi

# A copy of the code as it is now, with its own data folder.
WORK=$(mktemp -d /tmp/studio-test.XXXXXX)
SERVER=
cleanup(){
  [ -n "$SERVER" ] && kill "$SERVER" 2>/dev/null
  # services started by mock-ctl run in their own process groups
  [ -f "$WORK/mock/state.json" ] && node -e 'for (const u of Object.values(require(process.argv[1]).units)) if (u.pid) try { process.kill(-u.pid) } catch {}' "$WORK/mock/state.json" 2>/dev/null
  rm -rf "$WORK"
}
trap cleanup EXIT
mkdir -p "$WORK/app" "$WORK/data" "$WORK/mock"
( cd "$SRC" && git ls-files -z --cached --others --exclude-standard | while IFS= read -r -d '' f; do [ -e "$f" ] && printf '%s\0' "$f"; done | xargs -0 cp --parents -t "$WORK/app" )
ln -s "$CACHE/node_modules" "$WORK/app/node_modules"

if curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/"; then echo "Port $PORT is in use: set STUDIO_TEST_PORT"; exit 2; fi
( cd "$WORK/app" && exec env STUDIO_ALLOW_FIRST_SIGNUP=1 STUDIO_SECRET=local-test-secret-0123456789abcdefghijklmnop \
    STUDIO_DATA="$WORK/data" PORT="$PORT" STUDIO_DOMAIN=localhost STUDIO_HOST=studio.localhost STUDIO_URL="http://studio.localhost:$PORT" \
    STUDIO_CTL="$WORK/app/test/mock-ctl.mjs" STUDIO_CTL_SUDO=0 MOCK_ROOT="$WORK/mock" \
    STUDIO_EXPO_PUSH_URL="http://127.0.0.1:$((PORT + 1))/push" STUDIO_PUSH_REPEAT_MS=300 STUDIO_PUSH_HOSTS="127.0.0.1:$((PORT + 1))" node server.mjs ) > "$WORK/server.log" 2>&1 &
SERVER=$!
for _ in $(seq 40); do curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/" && break; sleep 0.25; done
curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/" || { echo "Studio didn't start:"; cat "$WORK/server.log"; exit 1; }

code=0
MOCK_ROOT="$WORK/mock" node "$WORK/app/test/e2e.mjs" "http://studio.localhost:$PORT" "localhost:$PORT" "$SHOTS" || code=$?
[ "$code" = 0 ] || { echo; echo "Studio's log (last 30 lines):"; tail -30 "$WORK/server.log"; echo "Screenshots: $SHOTS"; }
exit "$code"
