#!/usr/bin/env bash
# Moves the Studio source out of the pipeline project into its own project, "studio-src", which runs as the user
# studiodev. Other projects' agents run as ztd, so they can no longer change the code that studio-update installs as root.
# Run once as root, after an update has installed the install.sh that creates studiodev:
#   bash /srv/studio/app/ops/isolate-studio.sh <team slug>
# The team should hold only Studio admins (make it first in Teams and people). Safe to re-run.
set -euo pipefail
TEAM="${1:?usage: isolate-studio.sh <team slug>}"
FROM=/srv/projects/pipeline/repo
SLUG=studio-src
U=studiodev
DIR=/srv/projects/$SLUG
APP=/srv/studio/app

id "$U" >/dev/null 2>&1 || { echo "No user $U yet: update Studio first, so its install.sh creates it."; exit 1; }
[ "$(stat -c %U /srv/projects)" = root ] || { echo "/srv/projects must belong to root: update Studio first."; exit 1; }

# 1. The new repo, from the commit Studio is running now (not whatever the pipeline repo holds today), with the
#    history of studio/. Agents can write to the pipeline repo, so only that commit's content is trusted.
if [ ! -d "$DIR/repo/.git" ]; then
  COMMIT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$APP/.version','utf8')).commit)")
  echo "Copying studio/ as of the installed commit $COMMIT"
  TMP=$(mktemp -d)
  # --no-local: the objects are copied through upload-pack and checked, and the repo's hooks don't come along.
  git -c safe.directory="$FROM" clone -q --no-local "$FROM" "$TMP/full"
  git -C "$TMP/full" checkout -q --detach "$COMMIT"
  git -C "$TMP/full" subtree split -q -P studio "$COMMIT" -b studio-only >/dev/null
  mkdir -p "$DIR"
  git clone -q -b studio-only "$TMP/full" "$DIR/repo"
  git -C "$DIR/repo" branch -q -m studio-only main
  git -C "$DIR/repo" remote remove origin
  # Same commit identity as the pipeline repo, if it has one
  for k in user.name user.email; do
    v=$(git -C "$FROM" -c safe.directory='*' config --local --get "$k" || true)
    if [ -n "$v" ]; then git -C "$DIR/repo" config "$k" "$v"; fi
  done
  rm -rf "$TMP"
fi
chown -R "$U:$U" "$DIR"
chmod 700 "$DIR"

# 2. studio-ctl: this project runs as studiodev, and Studio updates come from it
node -e '
const fs = require("fs"), f = "/etc/studio/ctl.json", c = JSON.parse(fs.readFileSync(f, "utf8"));
c.projectUsers = { ...(c.projectUsers || {}), [process.argv[1]]: process.argv[2] };
c.studioSource = { project: process.argv[1], path: "." };
fs.writeFileSync(f, JSON.stringify(c, null, 2) + "\n");
' "$SLUG" "$U"

# 3. Register it in Studio (no services)
SPEC=$(mktemp); echo '{"services":[],"description":"ZTD Studio source. Commit here, then Admin → Update and restart Studio."}' > "$SPEC"; chmod 644 "$SPEC"
studio-admin import-project "$SLUG" "Studio" "$TEAM" "$SPEC"
rm -f "$SPEC"

# 4. Check
runuser -u studio -- sudo -n studio-ctl studio-source - >/dev/null && echo "Studio source is now $DIR/repo, run as $U."
echo "Next: delete studio/ from the pipeline project and commit that in its Changes tab."
