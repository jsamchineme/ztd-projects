#!/usr/bin/env bash
# Backs up every project's committed code to one GitHub repo, a folder per project (Admin → GitHub backup).
# Run by studio-ctl github-backup run (hourly from cron, or "Back up now"), as root. Each run adds one commit to main
# whose tree holds <project>/ for every project, with each project's own history merged in, so the backup has it too.
# Only root can read the deploy key and the copy below. Each project's repo is read as the user who owns it (git
# upload-pack runs as that user), so no git command runs as root inside a folder an agent can change.
set -euo pipefail
PROJECTS="${PROJECTS_DIR:-/srv/projects}"
STATE="${STATE_DIR:-/var/lib/studio/github-backup}"
CONFIG="${CONFIG_FILE:-/etc/studio/github-backup.json}"
KEY="${KEY_FILE:-/etc/studio/github-backup-key}"
mkdir -p "$STATE"; chmod 700 "$STATE"
URL=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).url || "")' "$CONFIG")
[ -n "$URL" ] || { echo "No GitHub repo is set"; exit 1; }
MIRROR="$STATE/mirror.git"
[ -d "$MIRROR" ] || git init -q --bare "$MIRROR"
mkdir -p "$STATE/empty"   # the folder trees are put together in the index only; nothing is checked out here
export GIT_DIR="$MIRROR" GIT_WORK_TREE="$STATE/empty" GIT_INDEX_FILE="$STATE/index" GIT_TERMINAL_PROMPT=0
export GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=$STATE/known_hosts"
export GIT_AUTHOR_NAME="ZTD Devs Studio" GIT_AUTHOR_EMAIL="studio@localhost" GIT_COMMITTER_NAME="ZTD Devs Studio" GIT_COMMITTER_EMAIL="studio@localhost"
report(){ node -e 'require("fs").writeFileSync(process.argv[1], JSON.stringify({ at: new Date().toISOString(), ok: process.argv[2] === "1", message: process.argv[3] }))' "$STATE/last.json" "$1" "$2"; echo "$2"; }
count(){ if [ "$1" = 1 ]; then echo "1 project"; else echo "$1 projects"; fi; }
trap 'report 0 "The backup failed. See: journalctl -u studio-github-backup"' ERR

# What GitHub has now, so history carries on from there (also checks that the key works).
if ! remote=$(git ls-remote "$URL" refs/heads/main 2>&1); then
  trap - ERR; report 0 "GitHub refused the connection. Check the repo address, and that the deploy key is added with write access. ($(echo "$remote" | tail -1))"; exit 1
fi
if [ -n "$remote" ]; then git fetch -q --no-tags "$URL" +refs/heads/main:refs/heads/main; fi
prev=$(git rev-parse -q --verify refs/heads/main || true)

rm -f "$GIT_INDEX_FILE"
parents=() changed=() list=()
for dir in "$PROJECTS"/*/repo; do
  slug=$(basename "$(dirname "$dir")")
  [[ "$slug" =~ ^[a-z][a-z0-9-]*[a-z0-9]$ ]] && [ -d "$dir/.git" ] || continue
  owner=$(stat -c %U "$dir")
  [ "$owner" != root ] || continue
  if [ "$(id -u)" = 0 ]; then up="/usr/sbin/runuser -u $owner -- git upload-pack"; else up="git upload-pack"; fi
  git fetch -q --no-tags --upload-pack="$up" "$dir" "+HEAD:refs/projects/$slug" 2>/dev/null || continue   # no commits yet
  head=$(git rev-parse "refs/projects/$slug")
  git read-tree --prefix="$slug/" "$head"
  list+=("- [$slug]($slug/): $(git log -1 --format='%s (%h, %cs)' "$head")")
  if [ -z "$prev" ] || ! git merge-base --is-ancestor "$head" "$prev"; then parents+=(-p "$head"); changed+=("$slug"); fi
done
readme=$(printf '# ZTD Devs Studio projects\n\nA backup of every project'"'"'s committed code, one folder per project, pushed by ZTD Devs Studio.\nUncommitted changes aren'"'"'t included. Each project'"'"'s own commits are part of this history too.\n\n%s\n' "$(printf '%s\n' "${list[@]}")" | git hash-object -w --stdin)
git update-index --add --cacheinfo "100644,$readme,README.md"
tree=$(git write-tree)

if [ -n "$prev" ] && [ "$tree" = "$(git rev-parse "$prev^{tree}")" ] && [ ${#changed[@]} = 0 ]; then
  trap - ERR; report 1 "Up to date: $(count ${#list[@]}), nothing new since the last backup."; exit 0
fi
msg="Backup of $(count ${#list[@]})"
[ ${#changed[@]} = 0 ] || msg="$msg: ${changed[*]} changed"
commit=$(git commit-tree "$tree" ${prev:+-p "$prev"} "${parents[@]}" -m "$msg")
git update-ref refs/heads/main "$commit"
git push -q "$URL" main:main
trap - ERR
report 1 "Backed up $(count ${#list[@]})${changed:+ (changed: ${changed[*]})}."
