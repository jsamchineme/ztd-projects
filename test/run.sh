#!/usr/bin/env bash
# Runs the browser test against a throwaway Studio built from this folder (including uncommitted changes):
#   npm test                 or   bash test/run.sh [screenshot dir]
# No root and no systemd: projects and services are faked by test/mock-ctl.mjs, Claude by ops/fake-claude.mjs.
# Its project services get ports from 4971 up, clear of real projects (4400 up) on the same machine.
# Packages are installed once per package-lock.json into ~/.cache/studio-test, so later runs start in seconds.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
SHOTS="${1:-/tmp/studio-test-shots}"
PORT="${STUDIO_TEST_PORT:-4310}"
CHROME_BIN="${CHROME_BIN:-$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)}"
# macOS keeps Chrome in an app bundle, off PATH.
[ -n "$CHROME_BIN" ] || for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Chromium.app/Contents/MacOS/Chromium"; do [ -x "$c" ] && CHROME_BIN="$c" && break; done
[ -n "$CHROME_BIN" ] || { echo "No Chrome found: set CHROME_BIN"; exit 2; }
export CHROME_BIN

# Packages, cached by the lock file's hash (sha1sum on Linux, shasum on macOS).
sha1(){ if command -v sha1sum >/dev/null 2>&1; then sha1sum "$1"; else shasum "$1"; fi; }
CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/studio-test/$(sha1 "$SRC/package-lock.json" | cut -c1-12)"
if [ ! -d "$CACHE/node_modules" ]; then
  echo "Installing packages into $CACHE (once)…"
  rm -rf "$CACHE"; mkdir -p "$CACHE"
  cp "$SRC/package.json" "$SRC/package-lock.json" "$CACHE/"
  ( cd "$CACHE" && npm ci --no-audit --no-fund >/dev/null )
fi

# A copy of the code as it is now, with its own data folder. pwd -P resolves symlinks (on macOS /tmp -> /private/tmp),
# so paths here match a process's resolved cwd — Claude's session folder is keyed on the project path.
WORK=$(cd "$(mktemp -d /tmp/studio-test.XXXXXX)" && pwd -P)
SERVER=
cleanup(){
  set +e   # teardown must finish and keep the real exit code, even if a process is already gone (kill fails on macOS)
  touch "$WORK/stop"
  [ -n "$SERVER" ] && kill "$SERVER" 2>/dev/null
  [ -f "$WORK/server.pid" ] && kill "$(cat "$WORK/server.pid")" 2>/dev/null
  # services started by mock-ctl run in their own process groups
  [ -f "$WORK/mock/state.json" ] && node -e 'for (const u of Object.values(require(process.argv[1]).units)) if (u.pid) try { process.kill(-u.pid) } catch {}' "$WORK/mock/state.json" 2>/dev/null
  rm -rf "$WORK"
}
trap cleanup EXIT
mkdir -p "$WORK/app" "$WORK/data" "$WORK/mock"
# Copy each tracked or untracked (non-ignored) file, keeping its folder. Plain cp/mkdir, so it works on macOS too
# (GNU-only `cp --parents -t` isn't on BSD/macOS).
( cd "$SRC" && git ls-files -z --cached --others --exclude-standard | while IFS= read -r -d '' f; do
    [ -e "$f" ] || continue
    mkdir -p "$WORK/app/$(dirname "$f")" && cp "$f" "$WORK/app/$f"
  done )
ln -s "$CACHE/node_modules" "$WORK/app/node_modules"

if curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/"; then echo "Port $PORT is in use: set STUDIO_TEST_PORT"; exit 2; fi
# Like systemd, start Studio again whenever it stops (the test restarts it through $WORK/server.pid).
( cd "$WORK/app" && while :; do env STUDIO_ALLOW_FIRST_SIGNUP=1 STUDIO_SECRET=local-test-secret-0123456789abcdefghijklmnop \
    STUDIO_DATA="$WORK/data" PORT="$PORT" STUDIO_DOMAIN=localhost STUDIO_HOST=studio.localhost STUDIO_URL="http://studio.localhost:$PORT" \
    STUDIO_FIRST_SERVICE_PORT=4971 STUDIO_CTL="$WORK/app/test/mock-ctl.mjs" STUDIO_CTL_SUDO=0 MOCK_ROOT="$WORK/mock" \
    STUDIO_EXPO_PUSH_URL="http://127.0.0.1:$((PORT + 1))/push" STUDIO_PUSH_REPEAT_MS=300 STUDIO_PUSH_HOSTS="127.0.0.1:$((PORT + 1))" STUDIO_ANTHROPIC_URL="http://127.0.0.1:$((PORT + 2))" node server.mjs & echo $! > "$WORK/server.pid"; wait $!; [ -f "$WORK/stop" ] && break; sleep 0.2; done ) > "$WORK/server.log" 2>&1 &
SERVER=$!
for _ in $(seq 40); do curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/" && break; sleep 0.25; done
curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/" || { echo "Studio didn't start:"; cat "$WORK/server.log"; exit 1; }

code=0
MOCK_ROOT="$WORK/mock" STUDIO_PID_FILE="$WORK/server.pid" node "$WORK/app/test/e2e.mjs" "http://studio.localhost:$PORT" "localhost:$PORT" "$SHOTS" || code=$?
[ "$code" = 0 ] || { echo; echo "Studio's log (last 30 lines):"; tail -30 "$WORK/server.log"; echo "Screenshots: $SHOTS"; }
exit "$code"
