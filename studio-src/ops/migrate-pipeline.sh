#!/usr/bin/env bash
# Copies this repo (code, git history and the live board data) to the Studio server and registers it
# as the "pipeline" project. Run from anywhere inside the repo on your Mac:
#   bash studio/ops/migrate-pipeline.sh
# Safe to re-run: it updates files in place and never deletes anything on the server.
# Works with macOS's built-in rsync (openrsync), which lacks newer options such as --info.
set -euo pipefail
KEY="$HOME/.ssh/ztddevs"
HOST="root@129.121.95.175"
SSH="ssh -i $KEY -o IdentitiesOnly=yes -o ServerAliveInterval=30"
cd "$(git rev-parse --show-toplevel)"

echo "Checking the server…"
TEAM=$($SSH "$HOST" 'sqlite3 /srv/studio/data/studio.db "select slug from organization order by createdAt limit 1"') \
  || { echo "Can't reach the server with $KEY."; exit 1; }
[ -n "$TEAM" ] || { echo "Create your Studio owner account first (studio-admin bootstrap, see HANDOVER.md)."; exit 1; }

echo "Copying the repo and board data to the server (about 600 MB the first time; later runs send only changes)…"
$SSH "$HOST" 'mkdir -p /srv/projects/pipeline/repo'
rsync -az --stats \
  --exclude node_modules --exclude .DS_Store --exclude 'studio/data' \
  -e "$SSH" ./ "$HOST:/srv/projects/pipeline/repo/" | grep -E "^(Number of files|Total transferred file size|Total bytes sent)" || true

echo "Installing the pipeline's packages and registering the project in Studio…"
$SSH "$HOST" TEAM="$TEAM" bash -s <<'REMOTE'
set -e
chown -R ztd:ztd /srv/projects/pipeline
cd /srv/projects/pipeline/repo
runuser -u ztd -- env HOME=/home/ztd PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm --prefix pipeline install --no-audit --no-fund >/dev/null
studio-admin import-project pipeline "Pipeline" "$TEAM" /srv/studio/app/ops/projects/pipeline.json
for s in board nurseries; do studio-ctl svc pipeline $s restart; done
studio-ctl vhost mapboard >/dev/null || echo "(Couldn't get a certificate for mapboard.ztddevs.com; retry it from Studio → Services.)"
sleep 3
studio-ctl status | jq -r 'to_entries[] | select(.key|startswith("ztd-pipeline")) | "  \(.key | sub("ztd-pipeline-"; "")): \(.value.ActiveState)"'
REMOTE
echo "Done. Open https://studio.ztddevs.com and choose the Pipeline project."
echo "The boards: https://pipeline.ztddevs.com and https://nurseries.ztddevs.com"
