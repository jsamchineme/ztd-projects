# Pilot mail server (VPS)

The ZTD Office pilot runs Stalwart on a single VPS. No passwords or private keys are kept in
this repo; they live on the server or on the machines that hold the SSH keys.

## Server

| | |
|---|---|
| Provider | Hetzner Cloud, Helsinki (EU) |
| Type | ARM (aarch64), 2 vCPU, ~4 GB RAM, 38 GB disk |
| OS | Ubuntu 26.04 LTS |
| IP | `62.238.17.8` |
| Hostname | `mx1.ztdoffice.com` (reverse DNS matches) |
| DNS | see [dns.md](dns.md) |

## Access

SSH is key-only as root (password login disabled).

| From | Command |
|---|---|
| Samuel's Mac | `ssh -i ~/.ssh/ztdmail-vps root@62.238.17.8` |
| Studio server (this project's account) | `ssh -i ~/.ssh/ztdoffice-vps-studio root@62.238.17.8` |

To revoke a machine's access, delete its line from `/root/.ssh/authorized_keys` on the VPS
(the lines end in `ztdmail-vps-20261019` and `ztdoffice-vps-studio-20261019`).

## Firewall

Two layers, both must allow a port:

- **Hetzner Cloud Firewall** (console → server → Firewalls)
- **ufw** on the server

Open inbound: 22 (SSH), 25 (receiving mail), 80, 443 (HTTPS: admin, webmail, TLS certificate),
465 and 587 (sending from mail apps), 993 (IMAP).

Hetzner shows ports 25 and 465 as "blocked by default", but on 2026-10-19 both inbound 25
(Gmail delivered to us) and outbound 25 (a test delivered straight to Google before the relay
was active) worked. We still relay everything through Resend on 587, because a brand-new server
IP has no sending reputation. If either direction stops working, request unblocking in the
Hetzner console.

Hardening also in place: fail2ban, unattended security updates.

## Stalwart

| | |
|---|---|
| Version | 0.16.27 (`stalwartlabs/stalwart:latest`) |
| Compose file | `/opt/ztdmail/docker-compose.yml` |
| Config | `/opt/ztdmail/etc` → `/etc/stalwart` in the container |
| Mail data (RocksDB) | `/opt/ztdmail/data` → `/var/lib/stalwart` |
| Logs | `/opt/ztdmail/logs` → `/var/log/stalwart` (written to files, not `docker logs`) |
| Admin | https://mx1.ztdoffice.com/admin — user `admin@ztdoffice.com` |
| Webmail | https://mail.ztdoffice.com (Bulwark, see below) |
| Admin password | `/opt/ztdmail/.admin` on the VPS (root-only); rotated 2026-10-19 |
| Licence | Stalwart **Enterprise**, domain `ztdoffice.com`, 25 mailboxes, valid to 2026-11-23 (trial; auto-renews via the API key, task `renewLicense` 2026-11-19). Keys entered in admin → Settings → Enterprise |
| Admin 2FA | TOTP enabled 2026-10-19 (password alone is refused) |
| Admin API key | `/opt/ztdmail/.admin-apikey` (root-only), Bearer auth, only accepted from the VPS itself (localhost + Docker network) — used for automation |
| Mailbox passwords | `/opt/ztdmail/.mailboxes` on the VPS (root-only) |

Common commands on the VPS:

```bash
cd /opt/ztdmail
docker compose ps                     # status
docker compose restart                # restart
tail -f logs/stalwart.$(date +%F)     # live log
cut -d: -f2- .admin                   # show the admin password
cat .mailboxes                        # show mailbox passwords
```

Listening (inside the container; HTTPS is reached through nginx, see below): SMTP 25, submission 587 (STARTTLS, added 2026-10-19 as listener `submission`),
submissions 465 (implicit TLS), IMAPS 993, POP3S 995, ManageSieve 4190, HTTPS 443, plain HTTP 8080
(bound to localhost only).

Verified 2026-10-19: 587 offers STARTTLS with the Let's Encrypt certificate, requires login
before sending (`503 You must authenticate first`), and accepts mailbox logins; port 25 refuses
to relay to outside addresses (`550 Relay not allowed`) while accepting mail for our mailboxes.

### Mail app settings

| | Server | Port | Security |
|---|---|---|---|
| Incoming (IMAP) | `mx1.ztdoffice.com` | 993 | SSL/TLS |
| Outgoing (SMTP) | `mx1.ztdoffice.com` | 587 | STARTTLS (or 465 with SSL/TLS) |

Username is the full email address. Outgoing mail to outside addresses only leaves the server
once the Resend relay is set up.

## Mailboxes

| Address | Quota | Notes |
|---|---|---|
| `hello@ztdoffice.com` | 5 GB | ZTD Office shared inbox |
| `samuel@ztdoffice.com` | 5 GB | Samuel |

Created over JMAP with `x:Account/set` (`@type: User`, `quotas.maxDiskQuota`, and
`credentials` given as a keyed map: `{"0": {"@type": "Password", "secret": …}}`).

## Outgoing mail (Resend relay)

Hetzner blocks outbound port 25, so the server never delivers directly. All mail to outside
domains goes through Resend:

- Route `resend` (`x:MtaRoute`, type Relay): `smtp.resend.com:587`, STARTTLS, user `resend`,
  password read from the container env var `RESEND_SMTP_PASS`.
- Outbound rule (`x:MtaOutboundStrategy.route`): local domains → `local`, everything else → `resend`.
- The key is a Resend **sending-only key restricted to ztdoffice.com** (`ztdoffice-stalwart-relay`),
  kept in `/opt/ztdmail/.resend` (root-only) and passed in with `env_file` in the compose file.
  To rotate it: create a new key in Resend, replace the file, `docker compose up -d`.
- **Restart Stalwart after changing routes or the outbound rule** (`docker compose restart`); the
  running server kept using the old rule until restarted.
- Verified 2026-10-19: mail from samuel@ztdoffice.com to info@ztddevs.com relayed via
  smtp.resend.com (250) and Resend reported it `delivered`.
- Gmail headers of that message: **SPF pass** (`send.ztdoffice.com`, sent from Amazon SES 54.240.3.9),
  **DKIM pass** (`d=ztdoffice.com`, selector `resend`), **DMARC pass** (aligned on ztdoffice.com); it
  landed in the inbox. A test sent directly from the VPS (before the relay was active) landed in
  spam: the new server IP has no reputation, which is why all outgoing mail goes via Resend.
- Resend re-signs with its own DKIM key; Stalwart's `v1-*` DKIM keys are only used if mail is
  ever delivered directly.
- Resend only accepts mail whose From domain is verified there. Each client domain must be added
  to Resend (plan limit: 3 domains on Free, 10 on Pro) until the switch to Amazon SES.

## Webmail (Bulwark) and the port-443 router

Webmail: **https://mail.ztdoffice.com** — Bulwark (`ghcr.io/bulwarkmail/webmail:latest`, full
edition), branded "ZTD Office" with the Studio logo. Container `ztdmail-bulwark` in the same
compose file, published on `127.0.0.1:3000` only. Config + secrets in `/opt/ztdmail/.bulwark.env`
(root-only); data in `/opt/ztdmail/bulwark/{settings,admin,admin-state,telemetry}` (owned by uid
1001); logo mounted from `/opt/ztdmail/branding/ztdoffice-logo.svg`. It talks to Stalwart at
`JMAP_SERVER_URL=https://mx1.ztdoffice.com`.

iPhone Home Screen icon: Bulwark ships its own `/apple-touch-icon.png` (red shield), which iOS uses
instead of the manifest icon. nginx overrides `/apple-touch-icon.png` and `/apple-touch-icon-precomposed.png`
with `/opt/ztdmail/branding/apple-touch-icon.png` (180×180, full-bleed `#00427c` background, made from
Bulwark's generated `/api/pwa-icon/512`). iOS caches icons: remove and re-add the Home Screen shortcut
after changing it.

Bulwark admin dashboard: https://mail.ztdoffice.com/admin — password in `/opt/ztdmail/.bulwark-admin`
(root-only; Bulwark stores only a hash in `bulwark/admin/admin.json`).

Port 443 is shared, so **nginx on the host routes by hostname (SNI)**:

| Port | Listener | Goes to |
|---|---|---|
| 443 (public) | nginx `stream` (`/etc/nginx/stream.d/ztdoffice-sni.conf`), `ssl_preread` | `mail.ztdoffice.com` → 127.0.0.1:9443; everything else → 127.0.0.1:8443 |
| 127.0.0.1:9443 | nginx TLS site (`sites-available/ztdoffice-webmail.conf`), cert from certbot | Bulwark on 127.0.0.1:3000 |
| 127.0.0.1:8443 | Stalwart's HTTPS (TLS **passthrough**: Stalwart keeps its own certificate and tls-alpn-01 renewals) | `mx1`, `autoconfig`, `autodiscover`, `mta-sts`, `ua-auto-config` |
| 80 (public) | nginx (`sites-available/ztdoffice-http.conf`) | ACME http-01 for `mail.ztdoffice.com`; everything else redirects to HTTPS |

nginx adds the PROXY protocol header on both paths, and Stalwart's `https` listener trusts it from
the Docker gateway (`overrideProxyTrustedNetworks: 172.30.0.1/32`), so Stalwart still sees real
client IPs (verified: a login from the Studio server logged `remoteIp = 129.121.95.175`).

The `mail.ztdoffice.com` certificate is from certbot (webroot `/var/www/certbot`), valid to
2027-01-17, renewed by `certbot.timer` with a deploy hook that reloads nginx. SMTP/IMAP ports are
not behind nginx; they go straight to Stalwart.

Because the webmail (`mail.`) and the JMAP server (`mx1.`) are different origins, the browser
needs CORS on Stalwart: `x:Http.usePermissiveCors = true` (set 2026-10-19; without it, sign-in fails
with "The server is reachable but is blocking cross-origin requests"). Credentials are still
required for every JMAP call. Alternative for later: serve JMAP under `mail.ztdoffice.com` so it
is same-origin and CORS isn't needed.

Verified 2026-10-19: all six HTTPS names answer with valid certificates; the webmail serves the
"ZTD Office" title, logo and PWA manifest (theme `#00427c`); Bulwark reaches Stalwart's JMAP.

## Calendar invitations

Stalwart sends iMIP invitations itself when the webmail saves an event with guests and "Send
invitations" ticked (`sendSchedulingMessages`), relayed via Resend like any mail. Verified 2026-10-19:
Gmail showed a proper invitation with Yes/No/Maybe. Notes:

- **No invitations are sent for events in the past.** An event dated last week silently sends nothing.
- **Branding (Enterprise):** invitation, RSVP-page and reminder emails use the sender domain's logo.
  Stalwart looks up domain logo → tenant logo → global default (`x:Enterprise.logoUrl`), **downloads it
  from a URL** (a base64/data-URI value fails silently and falls back to the Stalwart logo) and caches it
  until restart. Use **PNG** — Gmail doesn't render SVG. Set 2026-10-19: `ztdoffice.com` logo and the
  global default both = `https://mail.ztdoffice.com/branding/ztdoffice-email-logo.png` (760×192 wordmark,
  served by nginx from `/opt/ztdmail/branding/`). The RSVP page fetches `https://mx1.ztdoffice.com/logo`,
  which returns the same image. Default templates contain no other Stalwart text, so no custom
  templates are needed. Per-client: set each client domain's (or tenant's) `logo` URL.
- Bulwark display quirks (upstream, not server): an attendee's reply is shown as an invitation with a
  "sender isn't the organizer" warning, and UTC times in the invitation card aren't converted to
  local time.

## Spam filtering

Stalwart's built-in filter is on with its defaults: score ≥ 5 → delivered to the **Junk Mail**
folder; nothing is rejected or discarded (`scoreReject`/`scoreDiscard` = 0). 66 rules, 403 score
tags, 132 attachment-type rules, Pyzor, and 18 DNS blocklists. Mail from contacts and replies to
your own messages is trusted. The self-learning classifier starts training after 100 ham + 100
spam samples.

**Private DNS resolver (required for blocklists).** Spamhaus refuses lookups that come through
shared resolvers (Hetzner's, Google's, Cloudflare's) and answers `127.255.255.254`, which silently
disables it. So the VPS runs **Unbound** (`/etc/unbound/unbound.conf.d/ztdmail.conf`), listening on
127.0.0.1 and 172.30.0.1. The compose file pins the Docker network to `172.30.0.0/24` (gateway
172.30.0.1) and sets `dns: ["172.30.0.1"]` for Stalwart; ufw allows 172.30.0.0/24 → port 53.

Verified 2026-10-19: a message linking to Spamhaus' test domain `dbltest.com` scored 8.8
(`DBL_SPAM` +4.5) and landed in Junk Mail. Note: this Stalwart version has a `GTUBE_TEST` tag but
no rule that triggers it, so the classic GTUBE test string does **not** work as a test.

**Score tuning (2026-10-19).** A Gmail calendar reply scored 6.2 and went to Junk: SenderScore
reputation of Google's shared sending IP was 13 (`RBL_SENDERSCORE_REPUT_1`, +3.5) and Gmail puts the
recipient's name in calendar-reply subjects (`RCPT_LOCAL_IN_SUBJECT`, +2.0). Lowered: SenderScore
REPUT_0..7 from 4.0/3.5/3.0/2.5/2.0/1.5/1.0/0.5 to 1.5/1.25/1.0/0.75/0.5/0.25/0/0, and
RCPT_LOCAL_IN_SUBJECT 2.0 → 1.0 (`x:SpamTag/set`, then restart).

Follow-ups: Spamhaus' free public mirrors are for non-commercial / low-volume use; a commercial
hosting service should register for Spamhaus DQS. Consider rejecting at a high score (e.g. ≥ 15)
once the pilot shows no false positives.

## TLS certificate

Let's Encrypt, issued automatically by Stalwart (TLS-ALPN challenge on port 443). Covers `mx1`,
`autoconfig`, `autodiscover`, `mta-sts`, `ua-auto-config` (all `.ztdoffice.com`). First issued
2026-10-19, valid until 2027-01-17, renewed automatically.

## How it was set up

1. Ordered the VPS with the SSH key, hardened it (ufw, key-only SSH, fail2ban, auto-updates),
   installed Docker from Ubuntu's packages.
2. Started Stalwart with the volumes above. **Stalwart 0.16 uses `/etc/stalwart` and
   `/var/lib/stalwart`**; older guides mount `/opt/stalwart`, which this version ignores
   (data would be lost when the container is recreated).
3. A fresh Stalwart starts in **bootstrap mode** (only a setup page on port 8080). Instead of the
   browser wizard, setup was completed over JMAP with the temporary admin printed in the logs:
   `x:Bootstrap/set` with `serverHostname: mx1.ztdoffice.com` and `defaultDomain: ztdoffice.com`
   (capability `urn:stalwart:jmap`), then a container restart. This created the permanent admin,
   the `ztdoffice.com` domain and its DKIM keys.
4. Stalwart's suggested DNS records (from the domain's `dnsZoneFile` in `x:Domain/get`) were
   added at Namecheap, with DMARC set to `p=none` for the pilot.
5. Once the auto-setup CNAMEs existed, Let's Encrypt issued the certificate.

## Admin lockout recovery

If the authenticator for `admin@ztdoffice.com` is lost: SSH into the VPS and use the API key
(`/opt/ztdmail/.admin-apikey`) to remove the OTP from the admin credential over JMAP. Last resort:
start Stalwart once with `STALWART_RECOVERY_ADMIN=admin:<temporary password>` in the environment
(recovery mode, admin UI only), fix the account, then remove the variable and restart.

## Moving to a new server

Clients only ever point at names (`mx1`, `mail`, `autoconfig`, …), never at the IP, so a move
needs no client changes:

1. Build the new server the same way (steps 1–2 above).
2. Stop Stalwart on the old server and copy `/opt/ztdmail` across (keeps mail, accounts,
   settings, DKIM keys and the Let's Encrypt account).
3. Point the `mail` and `mx1` A records at the new IP, and set reverse DNS on the new server.
4. Start Stalwart on the new server; shut the old one down once traffic has moved.

Senders queue and retry during the few minutes of downtime, so no mail is lost.

## Still to do

See the "Mail server VPS (pilot)" card on [BOARD.md](../BOARD.md): add `mail.ztdoffice.com` to the certificate, mailboxes, webmail, backups.
