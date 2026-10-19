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

  # A clickable "Reconnect to Studio" app in ~/Applications, so you can restart the runner without the Terminal.
  # Best-effort: left of || disables set -e for this block, so a hiccup here never fails the install.
  {
    APP="$HOME/Applications/Reconnect to Studio.app"
    WORK="$(mktemp -d)"
    mkdir -p "$HOME/Applications"
    cat > "$WORK/app.applescript" <<OSA
on run
	set logPath to "$DIR/runner.log"
	set userID to do shell script "id -u"
	do shell script "launchctl kickstart -k gui/" & userID & "/$LABEL 2>/dev/null; true"
	set connected to false
	set removed to false
	repeat 12 times
		delay 1
		try
			set tailOut to do shell script "tail -20 " & quoted form of logPath
		on error
			set tailOut to ""
		end try
		if tailOut contains "ready as" then
			set connected to true
			exit repeat
		else if tailOut contains "removed from Studio" then
			set removed to true
			exit repeat
		end if
	end repeat
	if connected then
		display dialog "Connected to Studio." & return & return & "This Mac can now run your chats." buttons {"OK"} default button "OK" with title "Studio Runner" with icon note
	else if removed then
		display dialog "This Mac was removed from Studio." & return & return & "Open Studio, go to Account, then Your computers, and add it again." buttons {"OK"} default button "OK" with title "Studio Runner" with icon caution
	else
		try
			set tailOut to do shell script "tail -20 " & quoted form of logPath
		on error
			set tailOut to "(no log yet at " & logPath & ")"
		end try
		display dialog "Still not connected. Latest log:" & return & return & tailOut buttons {"OK"} default button "OK" with title "Studio Runner" with icon caution
	end if
end run
OSA
    rm -rf "$APP"
    if osacompile -o "$APP" "$WORK/app.applescript" 2>/dev/null; then
      # Use the Studio icon. osacompile also bakes an icon into Assets.car, which overrides applet.icns — so remove it.
      if curl -fsSL "$STUDIO/icon-512.png" -o "$WORK/icon.png" 2>/dev/null; then
        ISET="$WORK/Studio.iconset"; mkdir -p "$ISET"
        for s in 16 32 128 256 512; do
          sips -z "$s" "$s" "$WORK/icon.png" --out "$ISET/icon_${s}x${s}.png" >/dev/null 2>&1
          sips -z "$((s*2))" "$((s*2))" "$WORK/icon.png" --out "$ISET/icon_${s}x${s}@2x.png" >/dev/null 2>&1
        done
        if iconutil -c icns "$ISET" -o "$WORK/Studio.icns" 2>/dev/null; then
          cp "$WORK/Studio.icns" "$APP/Contents/Resources/applet.icns"
          rm -f "$APP/Contents/Resources/Assets.car"
          /usr/libexec/PlistBuddy -c "Delete :CFBundleIconName" "$APP/Contents/Info.plist" 2>/dev/null || true
          touch "$APP"
          /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP" 2>/dev/null || true
        fi
      fi
      echo "✓ Added a 'Reconnect to Studio' app (in your Applications) to restart the runner if it drops."
    fi
    rm -rf "$WORK"
  } || true

  sleep 3
  if grep -q "ready as" "$DIR/runner.log" 2>/dev/null; then echo "✓ Connected to Studio. It starts by itself when you log in."
  else echo "Started. If Studio doesn't show this computer as connected within a minute, see $DIR/runner.log"; fi
  echo
  echo "To stop it:       launchctl bootout gui/\$(id -u)/$LABEL"
  echo "To remove it:     remove this computer in Studio, then:  rm -rf \"$DIR\" \"$PLIST\" \"$HOME/Applications/Reconnect to Studio.app\""
else
  echo "✓ Installed. Run it with:"
  echo "  STUDIO_RUNNER_HOME=\"$DIR\" node \"$DIR/app/studio-runner.mjs\""
fi
