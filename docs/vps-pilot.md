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

Hetzner shows ports 25 and 465 as "blocked by default". Its restriction applies to the server
sending *out* on those ports, which we never do: outgoing mail is relayed through Resend on 587.
Inbound 25 was confirmed reachable. If receiving ever fails, request unblocking in the Hetzner
console.

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
| Admin password | `/opt/ztdmail/.admin` on the VPS (root-only) |

Common commands on the VPS:

```bash
cd /opt/ztdmail
docker compose ps                     # status
docker compose restart                # restart
tail -f logs/stalwart.$(date +%F)     # live log
cut -d: -f2- .admin                   # show the admin password
```

Listening: SMTP 25, submission 465, IMAPS 993, POP3S 995, ManageSieve 4190, HTTPS 443,
plain HTTP 8080 (bound to localhost only).

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

See the "Mail server VPS (pilot)" card on [BOARD.md](../BOARD.md): rotate the admin password,
add port 587, add `mail.ztdoffice.com` to the certificate, mailboxes, webmail, Resend relay,
send/receive test.
