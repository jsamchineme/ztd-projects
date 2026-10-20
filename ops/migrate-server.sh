#!/usr/bin/env bash
# Move a whole ZTD Devs Studio install to another server, domain change included.
# Two steps, both run as root:
#
#   On the OLD server:   bash ops/migrate-server.sh snapshot [DIR]
#     Writes a self-contained bundle to DIR (default /var/backups/ztd/migrate): the database, every project
#     folder, chat uploads, the config and secrets, and each agent user's Claude sessions and git deploy keys.
#
#   Carry the bundle to the NEW server yourself (scp/rsync the whole DIR).
#
#   On the NEW server:   bash ops/install.sh <new-domain>
#                        bash ops/migrate-server.sh restore <new-domain> <bundle-dir>
#     install.sh lays down a fresh Studio for the new domain; restore then grafts the old data on top:
#     the same STUDIO_SECRET (so stored Claude tokens, TOTP, SMTP and push keys still decrypt), the project
#     users, the projects and uploads, the sessions, and new-domain Apache sites + certificates.
#
# Apache sites and Let's Encrypt certificates are NOT copied: they belong to the old domain. The restore
# regenerates them for the new domain with certbot, so DNS for the new domain must already point here.
set -euo pipefail

DATA=/srv/studio/data
PROJECTS=/srv/projects
UPLOADS=/srv/studio-uploads

die(){ echo "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || die "Run as root."

snapshot(){
  local DIR="${1:-/var/backups/ztd/migrate}"
  [ -f "$DATA/studio.db" ] || die "No Studio here: $DATA/studio.db is missing."
  mkdir -p "$DIR"; chmod 700 "$DIR"
  echo "Snapshotting to $DIR …"

  # A consistent copy of the live database (safe while Studio is running).
  sqlite3 "$DATA/studio.db" ".backup '$DIR/studio.db'"
  # Projects (code and data) and chat uploads. Numeric ownership is ignored on restore, which re-chowns.
  tar -czf "$DIR/projects.tar.gz" --exclude=node_modules --exclude=.trash -C /srv projects
  if [ -d "$UPLOADS" ]; then tar -czf "$DIR/uploads.tar.gz" -C /srv studio-uploads; else : > "$DIR/uploads.tar.gz"; fi
  # Config and secrets: ctl.json (projectUsers, studioSource) and studio.env (STUDIO_SECRET, SMTP), plus per-service env.
  tar -czf "$DIR/studio-config.tar.gz" -C / etc/studio
  # Per-user Claude sessions (chat resume) and git deploy keys (private project remotes).
  local paths=()
  for h in /srv/studio /home/*; do
    for s in .claude .ssh; do [ -e "$h/$s" ] && paths+=("${h#/}/$s"); done
  done
  if [ ${#paths[@]} -gt 0 ]; then tar -czf "$DIR/homes.tar.gz" --ignore-failed-read -C / "${paths[@]}"; else : > "$DIR/homes.tar.gz"; fi

  local olddomain; olddomain=$(sed -n 's/^STUDIO_DOMAIN=//p' /etc/studio/studio.env || true)
  printf 'old_domain=%s\n' "$olddomain" > "$DIR/MANIFEST"
  echo "Done. Bundle is $DIR ($(du -sh "$DIR" | cut -f1)). It holds secrets — move it over a private channel and delete it after."
  echo "Next, on the new server: bash ops/install.sh <new-domain> && bash ops/migrate-server.sh restore <new-domain> <bundle-dir>"
}

restore(){
  local NEW="${1:-}" DIR="${2:-}"
  [ -n "$NEW" ] && [ -n "$DIR" ] || die "usage: restore <new-domain> <bundle-dir>"
  [ -f "$DIR/studio.db" ] || die "No bundle at $DIR (studio.db missing)."
  command -v studio-ctl >/dev/null || die "Run ops/install.sh $NEW first."
  command -v node >/dev/null || die "node is required."

  echo "Restoring bundle $DIR onto $NEW …"
  systemctl stop studio 2>/dev/null || true

  # 1) Database.
  install -o studio -g studio -m 640 "$DIR/studio.db" "$DATA/studio.db"

  # 2) Projects and uploads. --no-same-owner so everything lands as root; ownership is set per project below.
  tar -xzf "$DIR/projects.tar.gz" --no-same-owner -C /srv
  chown root:root "$PROJECTS"; chmod 755 "$PROJECTS"
  if [ -s "$DIR/uploads.tar.gz" ]; then tar -xzf "$DIR/uploads.tar.gz" --no-same-owner -C /srv; fi
  mkdir -p "$UPLOADS"; chown studio:ztd "$UPLOADS"; chmod 2751 "$UPLOADS"

  # 3) Graft the old secret, project-user map and studioSource onto the fresh new-domain config.
  local TMP; TMP=$(mktemp -d)
  tar -xzf "$DIR/studio-config.tar.gz" -C "$TMP"           # -> $TMP/etc/studio/{ctl.json,studio.env,env/}
  local OLDCTL="$TMP/etc/studio/ctl.json" OLDENV="$TMP/etc/studio/studio.env"
  local secret; secret=$(sed -n 's/^STUDIO_SECRET=//p' "$OLDENV")
  [ -n "$secret" ] || die "Old STUDIO_SECRET not found in the bundle."
  # studio.env: keep install.sh's new-domain lines, replace STUDIO_SECRET, and carry over any SMTP_* / STUDIO_NAME.
  sed -i "s#^STUDIO_SECRET=.*#STUDIO_SECRET=$secret#" /etc/studio/studio.env
  grep -E '^(SMTP_[A-Z]+|STUDIO_NAME)=' "$OLDENV" >> /etc/studio/studio.env || true
  chown root:studio /etc/studio/studio.env; chmod 640 /etc/studio/studio.env
  # ctl.json: carry projectUsers, studioSource and projectOwnUsers; keep the new domain and ports.
  node -e '
    const fs=require("fs"), [nf,of]=process.argv.slice(1);
    const n=JSON.parse(fs.readFileSync(nf)), o=JSON.parse(fs.readFileSync(of));
    for (const k of ["projectUsers","studioSource","projectOwnUsers"]) if (o[k]!==undefined) n[k]=o[k];
    fs.writeFileSync(nf, JSON.stringify(n,null,2)+"\n");
  ' /etc/studio/ctl.json "$OLDCTL"
  chmod 644 /etc/studio/ctl.json
  # Per-service environment files (root only).
  if [ -d "$TMP/etc/studio/env" ]; then mkdir -p /etc/studio/env; cp -a "$TMP/etc/studio/env/." /etc/studio/env/; chown -R root:root /etc/studio/env; chmod 700 /etc/studio/env; fi
  rm -rf "$TMP"

  # 4) Recreate each project's own Unix user, then hand it its folder. Projects not in projectUsers run as ztd.
  groupadd -f studio-agents
  chown -R ztd:ztd "$PROJECTS"/*/ 2>/dev/null || true
  while IFS=$'\t' read -r proj user; do
    [ -n "$user" ] || continue
    id -u "$user" >/dev/null 2>&1 || useradd --create-home --home-dir "/home/$user" --shell /bin/bash --groups studio-agents "$user"
    usermod -aG studio-agents "$user" 2>/dev/null || true
    [ -d "/home/$user" ] && chmod 750 "/home/$user"
    [ -d "$PROJECTS/$proj" ] && chown -R "$user:$user" "$PROJECTS/$proj"
  done < <(node -e 'const o=require("/etc/studio/ctl.json");for(const[p,u]of Object.entries(o.projectUsers||{}))console.log(p+"\t"+u)')
  # The Studio source project is extra-locked: only its own user may open it.
  node -e 'const o=require("/etc/studio/ctl.json");const s=o.studioSource&&o.studioSource.project;if(s)console.log(s)' | while read -r s; do
    [ -n "$s" ] && [ -d "$PROJECTS/$s" ] && chmod 700 "$PROJECTS/$s"
  done

  # 5) Per-user Claude sessions and git deploy keys.
  if [ -s "$DIR/homes.tar.gz" ]; then tar -xzf "$DIR/homes.tar.gz" --no-same-owner -C /; fi
  for h in /srv/studio /home/*; do
    u=$(basename "$h"); [ "$h" = /srv/studio ] && u=studio
    id -u "$u" >/dev/null 2>&1 || continue
    for s in .claude .ssh; do [ -e "$h/$s" ] && chown -R "$u:$u" "$h/$s"; done
  done

  # 6) Bring Studio up, recreate the project services' systemd units, and set up the web for the new domain.
  systemctl start studio
  sleep 2
  echo "Recreating project services from the database …"
  studio-admin reapply-services || echo "reapply-services reported problems — check its output above."
  echo "Provisioning Apache + certificates on $NEW (DNS for the new domain must point here) …"
  studio-ctl vhost studio || echo "  studio vhost failed — check certbot/DNS/ports 80,443."
  while IFS= read -r sub; do
    [ -n "$sub" ] || continue
    echo "  $sub.$NEW"
    studio-ctl vhost "$sub" || echo "    vhost $sub failed."
  done < <(sqlite3 "$DATA/studio.db" "SELECT subdomain FROM service WHERE subdomain IS NOT NULL AND subdomain <> '';")
  echo "Restore complete. Check: systemctl status studio ; studio-ctl status"
}

cmd="${1:-}"; shift || true
case "$cmd" in
  snapshot) snapshot "$@";;
  restore)  restore "$@";;
  *) die "usage: migrate-server.sh snapshot [DIR] | restore <new-domain> <bundle-dir>";;
esac
