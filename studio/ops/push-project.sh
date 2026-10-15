#!/usr/bin/env bash
# Pushes a folder from your Mac into an existing Studio project on the server, then restarts its services.
#   bash studio/ops/push-project.sh <local folder> <project short name> [service …]
# Examples:
#   bash studio/ops/push-project.sh . pipeline              # this repo into the Pipeline project, restart all
#   bash studio/ops/push-project.sh ~/sites/demo demo-site web
# Only sends changed files and never deletes anything on the server. node_modules, .DS_Store and
# studio/data are skipped. Changes made on the server since are overwritten if the same file changed here.
set -euo pipefail
SRC="${1:?usage: push-project.sh <local folder> <project short name> [service …]}"
SLUG="${2:?usage: push-project.sh <local folder> <project short name> [service …]}"
shift 2
[[ "$SLUG" =~ ^[a-z][a-z0-9-]*[a-z0-9]$ ]] || { echo "Project short names use lowercase letters, numbers and dashes."; exit 1; }
[ -d "$SRC" ] || { echo "No folder $SRC"; exit 1; }
KEY="$HOME/.ssh/ztddevs"
HOST="root@129.121.95.175"
SSH="ssh -i $KEY -o IdentitiesOnly=yes -o ServerAliveInterval=30"

$SSH "$HOST" "sqlite3 /srv/studio/data/studio.db \"select 1 from project where slug = '$SLUG'\" | grep -q 1" \
  || { echo "Studio has no project called $SLUG. Create it in Studio first (New project)."; exit 1; }

echo "Pushing $SRC to the $SLUG project…"
rsync -az --stats \
  --exclude node_modules --exclude .DS_Store --exclude 'studio/data' \
  -e "$SSH" "${SRC%/}/" "$HOST:/srv/projects/$SLUG/repo/" | grep -E "^(Number of files|Total transferred file size)" || true

$SSH "$HOST" SLUG="$SLUG" SERVICES="$*" bash -s <<'REMOTE'
set -e
chown -R ztd:ztd "/srv/projects/$SLUG/repo"
if [ -z "$SERVICES" ]; then
  SERVICES=$(sqlite3 /srv/studio/data/studio.db "select s.name from service s join project p on p.id = s.projectId where p.slug = '$SLUG' and s.autostart = 1")
fi
for s in $SERVICES; do studio-ctl svc "$SLUG" "$s" restart; done
REMOTE
echo "Done. Review what changed in Studio → $SLUG → Changes."
