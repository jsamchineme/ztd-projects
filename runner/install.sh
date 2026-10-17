#!/bin/bash
# Installs Studio Runner, which runs your ZTD Devs Studio chats on this computer (see studio-runner.mjs). Run the
# command from Studio's Account page → Your computers; it includes this computer's code:
#   curl -fsSL __STUDIO_URL__/runner/install.sh | bash -s -- <code>
# Safe to run again (with a new code from Studio, to re-add this computer). On a Mac it starts at login and restarts
# itself if it stops; elsewhere it prints the command to run it.
set -euo pipefail
STUDIO="__STUDIO_URL__"
TOKEN="${1:-}"
DIR="${STUDIO_RUNNER_HOME:-$HOME/StudioRunner}"
LABEL="com.ztddevs.studio-runner"
[ -n "$TOKEN" ] || { echo "Run the command from Studio's Account page: it includes this computer's code."; exit 1; }

need(){ command -v "$1" >/dev/null 2>&1 || { echo "✗ $2"; exit 1; }; }
need node "Install Node.js 22 or newer first: https://nodejs.org (or: brew install node)"
need git "Install git first: run  xcode-select --install"
need claude "Install Claude Code first: npm install -g @anthropic-ai/claude-code   Then run  claude  once and sign in."
[ "$(node -p 'Number(process.versions.node.split(".")[0])')" -ge 22 ] || { echo "✗ Studio Runner needs Node.js 22 or newer (this computer has $(node -v)). Update it: brew upgrade node"; exit 1; }

echo "Installing Studio Runner in $DIR"
mkdir -p "$DIR/app"
chmod 700 "$DIR"
curl -fsSL "$STUDIO/runner/studio-runner.mjs" -o "$DIR/app/studio-runner.mjs"
curl -fsSL "$STUDIO/runner/gitsync.mjs" -o "$DIR/app/gitsync.mjs"
# Settings, with the full paths of node, git and claude: apps started at login don't get your shell's PATH.
( umask 077; node -e 'require("fs").writeFileSync(process.argv[1], JSON.stringify({ studio: process.argv[2], token: process.argv[3], claude: process.argv[4], git: process.argv[5], path: process.argv[6] }, null, 2) + "\n")' \
    "$DIR/config.json" "$STUDIO" "$TOKEN" "$(command -v claude)" "$(command -v git)" "$PATH" )

if [ "$(uname)" = "Darwin" ]; then
  PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
  mkdir -p "$HOME/Library/LaunchAgents"
  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>$(command -v node)</string><string>$DIR/app/studio-runner.mjs</string></array>
  <key>EnvironmentVariables</key><dict><key>PATH</key><string>$PATH</string><key>STUDIO_RUNNER_HOME</key><string>$DIR</string></dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><dict><key>SuccessfulExit</key><false/></dict>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>ProcessType</key><string>Interactive</string>
  <key>StandardOutPath</key><string>$DIR/runner.log</string>
  <key>StandardErrorPath</key><string>$DIR/runner.log</string>
</dict>
</plist>
EOF
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$PLIST"
  sleep 3
  if grep -q "ready as" "$DIR/runner.log" 2>/dev/null; then echo "✓ Connected to Studio. It starts by itself when you log in."
  else echo "Started. If Studio doesn't show this computer as connected within a minute, see $DIR/runner.log"; fi
  echo
  echo "To stop it:       launchctl bootout gui/\$(id -u)/$LABEL"
  echo "To remove it:     remove this computer in Studio, then:  rm -rf \"$DIR\" \"$PLIST\""
else
  echo "✓ Installed. Run it with:"
  echo "  STUDIO_RUNNER_HOME=\"$DIR\" node \"$DIR/app/studio-runner.mjs\""
fi
