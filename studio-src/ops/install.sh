#!/usr/bin/env bash
# Installs or updates ZTD Devs Studio on an Ubuntu server. Run as root from the folder holding the Studio code:
#   bash ops/install.sh <domain>
# Safe to re-run: it updates the code and keeps data, secrets and project folders.
set -euo pipefail
DOMAIN="${1:?usage: install.sh <domain>}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
APP=/srv/studio/app
DATA=/srv/studio/data
PORT=4300
# The previous install, kept for a rollback. Root-only: it's put back as root, so Studio mustn't be able to change it.
PREV=/var/lib/studio/app.prev

# Nothing is changed until every JavaScript file parses (a broken file used to take Studio down until fixed by hand).
bash "$SRC/ops/check.sh" "$SRC" || { echo "Not installed: Studio is still running the previous version."; exit 1; }

id studio >/dev/null 2>&1 || useradd --system --create-home --home-dir /srv/studio --shell /usr/sbin/nologin studio
id ztd >/dev/null 2>&1 || useradd --create-home --home-dir /home/ztd --shell /bin/bash ztd
usermod -aG systemd-journal ztd
# The Studio source project runs as its own user, so other projects' agents (ztd) can't change the code that
# studio-update installs as root. It's in group ztd only to read chat attachments.
id studiodev >/dev/null 2>&1 || useradd --create-home --home-dir /home/studiodev --shell /bin/bash studiodev
usermod -aG ztd studiodev
# New projects each get their own user (zp-<name>, made by studio-ctl project-create), all in this group.
groupadd -f studio-agents
chmod 750 /home/studiodev
mkdir -p "$APP" "$DATA" /srv/projects /etc/studio/env /usr/local/lib/studio /var/backups/ztd
chown studio:studio /srv/studio "$DATA"; chmod 750 "$DATA"
# Root owns the projects folder, so an agent can't rename a project's folder and put its own in its place.
chown root:root /srv/projects; chmod 755 /srv/projects
# Chat attachments: Studio writes them, Claude (group ztd) can only read them. setgid keeps the group on new folders.
mkdir -p /srv/studio-uploads
# 2751: project users can't list the folder, but can reach their own project's folder in it (studio:<project user>).
chown studio:ztd /srv/studio-uploads; chmod 2751 /srv/studio-uploads

# Code (owned by root, so neither Studio nor agents can change it)
if [ -f "$APP/server.mjs" ]; then
  mkdir -p "$(dirname "$PREV")"; chmod 700 "$(dirname "$PREV")"
  rm -rf "$PREV"; cp -al "$APP" "$PREV" 2>/dev/null || cp -a "$APP" "$PREV"   # hard links: the copy below replaces files rather than writing into them
fi
rsync -a --delete --exclude node_modules --exclude data --exclude '.env' "$SRC/" "$APP/"
( cd "$APP" && npm ci --omit=dev --no-audit --no-fund >/dev/null 2>&1 || npm install --omit=dev --no-audit --no-fund >/dev/null )
chown -R root:root "$APP"; chmod -R go-w "$APP"
# The update unpacks into a root-only temp folder, and rsync -a copies that mode onto $APP; Studio must be able to enter it.
chmod 755 "$APP"

# Root helper and starters
install_helpers(){
  install -m 755 -o root -g root "$APP/ops/studio-ctl.mjs" /usr/local/lib/studio/studio-ctl.mjs
  install -m 755 -o root -g root "$APP/ops/fake-claude.mjs" /usr/local/lib/studio/fake-claude.mjs
  ln -sf /usr/local/lib/studio/studio-ctl.mjs /usr/local/sbin/studio-ctl
  if [ -f "$APP/ops/github-backup.sh" ]; then install -m 755 -o root -g root "$APP/ops/github-backup.sh" /usr/local/lib/studio/github-backup.sh; fi
  rsync -a --delete "$APP/ops/starters/" /usr/local/lib/studio/starters/
  chown -R root:root /usr/local/lib/studio
}
install_helpers

if [ ! -f /etc/studio/ctl.json ]; then
  cat > /etc/studio/ctl.json <<EOF
{ "domain": "$DOMAIN", "studioSub": "studio", "studioPort": $PORT, "projectsDir": "/srv/projects", "runUser": "ztd", "runHome": "/home/ztd", "claudeBin": "/usr/bin/claude" }
EOF
fi
chmod 644 /etc/studio/ctl.json

# Studio may run studio-ctl; agents (ztd, studiodev and every project user in studio-agents) may run it too, and
# studio-ctl limits them to svc, logs and status for their own projects.
cat > /etc/sudoers.d/studio <<'EOF'
Defaults:studio !requiretty
Defaults:ztd !requiretty
Defaults:studiodev !requiretty
Defaults:%studio-agents !requiretty
studio ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
ztd ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
studiodev ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
%studio-agents ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
EOF
chmod 440 /etc/sudoers.d/studio
visudo -cf /etc/sudoers.d/studio >/dev/null

# Secrets
if [ ! -f /etc/studio/studio.env ]; then
  cat > /etc/studio/studio.env <<EOF
PORT=$PORT
STUDIO_DOMAIN=$DOMAIN
STUDIO_HOST=studio.$DOMAIN
STUDIO_URL=https://studio.$DOMAIN
STUDIO_DATA=$DATA
STUDIO_SECRET=$(openssl rand -base64 48 | tr -d '\n')
# Email for password resets and invites (Gmail: an app password from https://myaccount.google.com/apppasswords)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_USER=you@gmail.com
# SMTP_PASS=abcd efgh ijkl mnop
# SMTP_FROM=you@gmail.com
EOF
fi
grep -q '^STUDIO_UPLOADS=' /etc/studio/studio.env || echo 'STUDIO_UPLOADS=/srv/studio-uploads' >> /etc/studio/studio.env
chown root:studio /etc/studio/studio.env; chmod 640 /etc/studio/studio.env

# systemd holds Studio's port, even while Studio restarts, so a project's process can't take it and pose as Studio.
cat > /etc/systemd/system/studio.socket <<EOF
[Unit]
Description=ZTD Devs Studio port

[Socket]
ListenStream=127.0.0.1:$PORT
NoDelay=true

[Install]
WantedBy=sockets.target
EOF

cat > /etc/systemd/system/studio.service <<EOF
[Unit]
Description=ZTD Devs Studio
After=network.target studio.socket
Requires=studio.socket

[Service]
User=studio
Group=studio
WorkingDirectory=$APP
EnvironmentFile=/etc/studio/studio.env
ExecStart=/usr/bin/node $APP/server.mjs
Restart=always
RestartSec=2
MemoryMax=700M
KillMode=mixed

[Install]
WantedBy=multi-user.target
EOF

# Admin commands (root only): studio-admin bootstrap | reset-link | import-project | make-admin
cat > /usr/local/sbin/studio-admin <<EOF
#!/bin/sh
set -a; . /etc/studio/studio.env; set +a
cd $APP && exec runuser -u studio -- node bin/admin.mjs "\$@"
EOF
chmod 700 /usr/local/sbin/studio-admin

# Nightly backups
install -m 755 "$APP/ops/backup.sh" /usr/local/sbin/studio-backup
cat > /etc/cron.d/studio-backup <<'EOF'
# ZTD Devs Studio nightly backup
30 3 * * * root /usr/local/sbin/studio-backup >> /var/log/studio-backup.log 2>&1
EOF

# Hourly backup of every project to GitHub, once an admin sets a repo (Admin → GitHub backup)
cat > /etc/cron.d/studio-github-backup <<'EOF'
# ZTD Devs Studio: push every project to the GitHub backup repo (does nothing until one is set)
17 * * * * root /usr/local/sbin/studio-ctl github-backup run --quiet >/dev/null 2>&1
EOF

# Apache: the modules Studio's sites need
a2enmod -q proxy proxy_http proxy_wstunnel headers rewrite ssl >/dev/null
systemctl daemon-reload
systemctl enable studio studio.socket >/dev/null 2>&1
# The first time, Studio still holds the port itself: stop it so the socket can take it over.
if ! systemctl is-active --quiet studio.socket; then systemctl stop studio; systemctl start studio.socket; fi
systemctl restart studio

# Studio must answer, and still be running a few seconds later (not crashing and restarting in a loop). If it
# doesn't, the previous version goes back in, so a bad update never leaves Studio down.
answers(){ [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time "$1" "http://127.0.0.1:$PORT/api/me" || true)" != 000 ]; }
studio_up(){ answers 20 && sleep 3 && systemctl is-active --quiet studio && answers 10; }
if studio_up; then systemctl is-active studio; exit 0; fi
echo "Studio didn't start with this version. Its log:"
journalctl -u studio -n 25 --no-pager -o cat || true
if [ ! -d "$PREV" ]; then echo "No previous version to go back to."; exit 1; fi
echo "Putting the previous version back…"
rsync -a --delete "$PREV/" "$APP/"
install_helpers
systemctl restart studio
if studio_up; then echo "Rolled back: Studio is running the previous version."; else echo "Studio didn't start after the rollback either. Check: journalctl -u studio"; fi
exit 1
