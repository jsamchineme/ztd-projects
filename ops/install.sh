#!/usr/bin/env bash
# Installs or updates ZTD Studio on an Ubuntu server. Run as root from the folder holding the Studio code:
#   bash ops/install.sh <domain>
# Safe to re-run: it updates the code and keeps data, secrets and project folders.
set -euo pipefail
DOMAIN="${1:?usage: install.sh <domain>}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
APP=/srv/studio/app
DATA=/srv/studio/data
PORT=4300

id studio >/dev/null 2>&1 || useradd --system --create-home --home-dir /srv/studio --shell /usr/sbin/nologin studio
id ztd >/dev/null 2>&1 || useradd --create-home --home-dir /home/ztd --shell /bin/bash ztd
usermod -aG systemd-journal ztd
mkdir -p "$APP" "$DATA" /srv/projects /etc/studio/env /usr/local/lib/studio /var/backups/ztd
chown studio:studio /srv/studio "$DATA"; chmod 750 "$DATA"
chown ztd:ztd /srv/projects; chmod 755 /srv/projects

# Code (owned by root, so neither Studio nor agents can change it)
rsync -a --delete --exclude node_modules --exclude data --exclude '.env' "$SRC/" "$APP/"
( cd "$APP" && npm ci --omit=dev --no-audit --no-fund >/dev/null 2>&1 || npm install --omit=dev --no-audit --no-fund >/dev/null )
chown -R root:root "$APP"; chmod -R go-w "$APP"

# Root helper and starters
install -m 755 -o root -g root "$APP/ops/studio-ctl.mjs" /usr/local/lib/studio/studio-ctl.mjs
install -m 755 -o root -g root "$APP/ops/fake-claude.mjs" /usr/local/lib/studio/fake-claude.mjs
ln -sf /usr/local/lib/studio/studio-ctl.mjs /usr/local/sbin/studio-ctl
rsync -a --delete "$APP/ops/starters/" /usr/local/lib/studio/starters/
chown -R root:root /usr/local/lib/studio

if [ ! -f /etc/studio/ctl.json ]; then
  cat > /etc/studio/ctl.json <<EOF
{ "domain": "$DOMAIN", "studioSub": "studio", "studioPort": $PORT, "projectsDir": "/srv/projects", "runUser": "ztd", "runHome": "/home/ztd", "claudeBin": "/usr/bin/claude" }
EOF
fi
chmod 644 /etc/studio/ctl.json

# Studio may run studio-ctl; agents (ztd) may run it too, and studio-ctl limits them to svc, logs and status.
cat > /etc/sudoers.d/studio <<'EOF'
Defaults:studio !requiretty
Defaults:ztd !requiretty
studio ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
ztd ALL=(root) NOPASSWD: /usr/local/sbin/studio-ctl, /usr/local/sbin/studio-ctl *
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
chown root:studio /etc/studio/studio.env; chmod 640 /etc/studio/studio.env

cat > /etc/systemd/system/studio.service <<EOF
[Unit]
Description=ZTD Studio
After=network.target

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
# ZTD Studio nightly backup
30 3 * * * root /usr/local/sbin/studio-backup >> /var/log/studio-backup.log 2>&1
EOF

# Apache: the modules Studio's sites need
a2enmod -q proxy proxy_http proxy_wstunnel headers rewrite ssl >/dev/null
systemctl daemon-reload
systemctl enable studio >/dev/null 2>&1
systemctl restart studio
sleep 2
systemctl is-active studio
