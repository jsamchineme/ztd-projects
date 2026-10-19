# ZTD Mail — local dev stack

Stalwart (mail server) + Bulwark (webmail "ZTD Mail"), via Docker Compose, on your Mac.
Outbound relays through Resend. Real inbound from the internet needs the VPS (pilot time).

## Run
```bash
cd dev
docker compose up -d        # start
docker compose ps           # status
docker compose logs -f stalwart
docker compose down         # stop (keeps data in ./stalwart, ./bulwark)
```

## URLs
- **ZTD Mail webmail:** http://localhost:3000
- **Stalwart admin:** http://localhost:8080/admin
- Mail ports (host → container): SMTP 1025→25, submission 1587→587 / 1465→465, IMAP 1143→143 / 1993→993

## First-time setup (one time, ~2 min — must be done in the browser)
Stalwart starts in **bootstrap mode** (only the setup UI runs; SMTP/IMAP/JMAP are down) until you
complete initial setup:
1. Open http://localhost:8080/admin
2. Log in with the bootstrap admin:
   - username: `admin`
   - password: in `dev/.env` as `STALWART_ADMIN_PASSWORD` (printed once in `docker compose logs stalwart`)
3. Complete the setup wizard (accept defaults for local dev). Stalwart then starts all mail services.
4. **Add a domain:** Settings → Domains → add `ztdmail.test` (any test domain).
5. **Create 2 mailboxes:** Settings → Accounts → add e.g. `sam@ztdmail.test` and `jane@ztdmail.test`, each with a password.
6. Log into **ZTD Mail** (http://localhost:3000) as `sam@ztdmail.test`, email `jane@ztdmail.test` → confirms internal send/receive.

## Outbound to real addresses (optional, needs your Resend key)
1. Put your Resend API key in `dev/.env` → `RESEND_API_KEY=...` (gitignored).
2. In Stalwart admin → Settings → SMTP → outbound/relay, add a relay host:
   - host `smtp.resend.com`, port `465` (implicit TLS), username `resend`, password = your Resend API key.
3. Send from ZTD Mail to a real address (e.g. your Gmail) to verify delivery.

## Notes
- Data + secrets are gitignored (`dev/stalwart/`, `dev/bulwark/`, `dev/.env`); only compose + examples are committed.
- Branding (name "ZTD Mail", Studio logo) is set via env in `docker-compose.yml`; logo is served from
  `https://businessmail.ztddevs.com/ztdmail-logo.svg`.
