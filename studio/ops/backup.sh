#!/usr/bin/env bash
# Nightly backup of Studio's database, secrets and every project folder (code and data).
# Keeps 14 days in /var/backups/ztd. Copy that folder off the server for real safety.
set -euo pipefail
DEST=/var/backups/ztd
STAMP=$(date +%Y-%m-%d)
mkdir -p "$DEST"
chmod 700 "$DEST"
# A consistent copy of the live SQLite database
sqlite3 /srv/studio/data/studio.db ".backup '$DEST/studio-$STAMP.db'"
tar -czf "$DEST/projects-$STAMP.tar.gz" --exclude='node_modules' --exclude='.trash' -C /srv projects
tar -czf "$DEST/config-$STAMP.tar.gz" -C / etc/studio etc/apache2/sites-available etc/letsencrypt 2>/dev/null || true
gzip -f "$DEST/studio-$STAMP.db"
find "$DEST" -type f -mtime +14 -delete
echo "$(date -Is) backup ok: $(du -sh "$DEST" | cut -f1) in $DEST"
