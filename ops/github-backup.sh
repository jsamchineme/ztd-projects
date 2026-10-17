#!/usr/bin/env bash
# Backs up every project's committed code to one GitHub repo, a branch per project (Admin → GitHub backup).
# Run by studio-ctl github-backup run (hourly from cron, or "Back up now"), as root. Branch projects/<slug> is the
# project's own history as it stands (force-pushed, so it follows the project even if its history is rewritten), which
# makes it easy to move a project to a repo of its own later. main only holds a README listing the projects.
# A project that's deleted keeps its branch on GitHub.
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
# Errors go to a file as well as the journal, so a failure can say on the Admin page what went wrong.
ERRLOG="$STATE/errors"; : > "$ERRLOG"
exec 3>&2 2> >(tee -a "$ERRLOG" >&3)
failed(){ local step=$1; sleep 0.2; report 0 "The backup failed at: $step. $(grep -v -e '^\s*$' -e '^To ' "$ERRLOG" | sed 's/^remote: *//' | tail -n 4 | tr '\n' ' ' | tr -s ' ' | cut -c1-500)"; }
trap 'failed "$BASH_COMMAND"' ERR

# What GitHub has now, so main carries on from there and only branches that moved are pushed (also checks the key works).
if ! remote=$(git ls-remote "$URL" 'refs/heads/*' 2>&1); then
  trap - ERR; report 0 "GitHub refused the connection. Check the repo address, and that the deploy key is added with write access. ($(echo "$remote" | tail -1))"; exit 1
fi
# The sha GitHub has for a ref, looked up without bash-4 associative arrays (macOS ships bash 3.2).
there(){ printf '%s\n' "$remote" | awk -v r="$1" '$2==r{print $1; exit}'; }
if [ -n "$(there refs/heads/main)" ]; then git fetch -q --no-tags "$URL" +refs/heads/main:refs/heads/main; fi
prev=$(git rev-parse -q --verify refs/heads/main || true)

push=() changed=() list=()
for dir in "$PROJECTS"/*/repo; do
  slug=$(basename "$(dirname "$dir")")
  [[ "$slug" =~ ^[a-z][a-z0-9-]*[a-z0-9]$ ]] && [ -d "$dir/.git" ] || continue
  owner=$(stat -c %U "$dir" 2>/dev/null || stat -f %Su "$dir")   # GNU stat on Linux, BSD stat on macOS (tests)
  [ "$owner" != root ] || continue
  if [ "$(id -u)" = 0 ]; then up="/usr/sbin/runuser -u $owner -- git upload-pack"; else up="git upload-pack"; fi
  git fetch -q --no-tags --upload-pack="$up" "$dir" "+HEAD:refs/projects/$slug" 2>/dev/null || continue   # no commits yet
  head=$(git rev-parse "refs/projects/$slug")
  list+=("- **$slug**, branch \`projects/$slug\`: $(git log -1 --format='%s (%h, %cs)' "$head")")
  if [ "$(there "refs/heads/projects/$slug")" != "$head" ]; then push+=("+refs/projects/$slug:refs/heads/projects/$slug"); changed+=("$slug"); fi
done

# main: just a README listing every project and its branch.
rm -f "$GIT_INDEX_FILE"
readme=$(printf '# ZTD Devs Studio projects\n\nA backup of every project'"'"'s committed code, pushed by ZTD Devs Studio. Each project is on its own\nbranch, `projects/<name>`, with its full history. Uncommitted changes aren'"'"'t included.\n\nTo give a project a repo of its own: `git push <new-repo> origin/projects/<name>:refs/heads/main`\n\n%s\n' "$(printf '%s\n' "${list[@]}")" | git hash-object -w --stdin)
git update-index --add --cacheinfo "100644,$readme,README.md"
tree=$(git write-tree)
if [ -z "$prev" ] || [ "$tree" != "$(git rev-parse "$prev^{tree}")" ]; then
  git update-ref refs/heads/main "$(git commit-tree "$tree" ${prev:+-p "$prev"} -m "List of $(count ${#list[@]})${changed:+: ${changed[*]} changed}")"
  push+=(main:main)
fi

if [ ${#push[@]} = 0 ]; then
  trap - ERR; report 1 "Up to date: $(count ${#list[@]}), nothing new since the last backup."; exit 0
fi
git push -q "$URL" "${push[@]}"
trap - ERR
report 1 "Backed up $(count ${#list[@]})${changed:+ (changed: ${changed[*]})}."
