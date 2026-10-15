# ZTD Studio

A web app for building and running projects with Claude. It runs on the server at https://studio.ztddevs.com. Each project lives on the server, and Studio gives you:

- a chat with Claude Code that works in the project's folder
- the project's running services (start, stop, restart, live logs)
- its uncommitted changes (diff, commit, undo)
- read-only file browsing
- settings

Projects are served at `<name>.ztddevs.com`, behind Studio's sign-in. Teams, invitations, roles, two-step sign-in (TOTP) and password resets are built in.

## How it fits together

```
browser ──https──> Apache (80/443, certbot) ──> Studio :4300 ──┬─ studio.ztddevs.com: the app and /api
                                                               └─ <sub>.ztddevs.com: login gate, then proxy to the project port
Studio (user "studio") ──sudo──> studio-ctl (root, validates every argument)
                                    ├─ systemd units ztd-<project>-<service> (run as user "ztd")
                                    ├─ git in /srv/projects/<project>/repo (as "ztd")
                                    ├─ claude -p … (as "ztd", in the project folder)
                                    └─ Apache site + certificate for a new subdomain
```

| File | What it does |
| --- | --- |
| `server.mjs` | HTTP server: routes by host, the JSON API, static files, security headers |
| `lib/auth.mjs` | Better Auth: email and password, TOTP and backup codes, teams (Better Auth "organizations"), admin. Sign-up is invite-only. |
| `lib/gate.mjs` | Login gate and reverse proxy for project subdomains. It uses a one-time hand-off and a host-only cookie, so Studio's session cookie never reaches project code. |
| `lib/projects.mjs` | Projects and services: validation, systemd specs, status, certificates |
| `lib/agent.mjs` | Chats: runs `claude -p --output-format stream-json`, saves events and streams them over SSE. Chats resume their Claude session. |
| `lib/claude.mjs` | Each user's Claude connection: a subscription token via `claude setup-token`, or an API key. Stored encrypted (AES-256-GCM). |
| `lib/ctl.mjs` | Runs `studio-ctl` through sudo |
| `ops/studio-ctl.mjs` | The root helper. It's the only privileged code. AI agents (user `ztd`) may run only `status`, `svc` and `logs`. |
| `ops/install.sh` | Installs or updates everything on the server. Safe to re-run. |
| `ops/backup.sh` | Nightly backup (03:30) to `/var/backups/ztd`, kept for 14 days |
| `ops/migrate-pipeline.sh` | Copies this repo and its board data from a Mac to the server, then registers it as the Pipeline project |
| `ops/fake-claude.mjs` | Stand-in for the `claude` CLI for tests. Turn it on with `"fakeClaude"` in `/etc/studio/ctl.json`. |
| `bin/admin.mjs` | `studio-admin` on the server: `bootstrap`, `reset-link`, `import-project`, `make-admin`, `add-user`, `delete-user` |
| `public/` | The front end. Plain ES modules, no build step and no CDNs. |
| `test/` | `mock-ctl.mjs` and `e2e.mjs`: a 26-step browser test against a throwaway local instance |

## Server layout

| Path | What |
| --- | --- |
| `/srv/studio/app` | Studio code (owned by root) |
| `/srv/studio/data/studio.db` | Accounts, teams, projects, chats, audit log (SQLite) |
| `/etc/studio/studio.env` | Secrets and settings: `STUDIO_SECRET`, SMTP. Mode 640 root:studio. |
| `/etc/studio/ctl.json` | studio-ctl settings (domain, ports, optional `fakeClaude`) |
| `/etc/studio/env/` | Each service's environment variables (root only) |
| `/srv/projects/<slug>/repo` | Project folders (owned by `ztd`). Deleted projects go to `/srv/projects/.trash`. |
| `/var/backups/ztd` | Nightly backups |

## Operating it

```sh
ssh -i ~/.ssh/ztddevs root@129.121.95.175

systemctl status studio            # Studio itself
journalctl -u studio -f            # its logs
studio-ctl status                  # every project service
studio-ctl logs pipeline board 100
studio-admin reset-link you@example.com   # password link, valid 48 hours
```

**Deploy a change to Studio.** Run this from the repo on a Mac:

```sh
rsync -az --delete --exclude node_modules --exclude data --exclude test \
  -e "ssh -i ~/.ssh/ztddevs" studio/ root@129.121.95.175:/root/studio-src/
ssh -i ~/.ssh/ztddevs root@129.121.95.175 'bash /root/studio-src/ops/install.sh ztddevs.com'
```

Restarting Studio stops any Claude runs in progress.

**Turn on email** (password resets and invites). Add these to `/etc/studio/studio.env`, then run `systemctl restart studio`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=you@gmail.com
SMTP_PASS=<16-character app password from https://myaccount.google.com/apppasswords>
SMTP_FROM=you@gmail.com
```

Without email, admins copy invite links from Teams and people, and reset links from Admin.

## Security model

- Everyone must use two-step sign-in. The API refuses everything except account setup until it's on.
- Login is rate-limited to 5 attempts a minute per IP. After 10 wrong codes, two-step sign-in locks for 15 minutes. Passwords need at least 12 characters, and a password reset signs out every session.
- Project subdomains are team-only unless a service is marked public.
- Claude runs as `ztd` in bypass-permissions mode. It can change any project's files, and it can restart services through `sudo studio-ctl svc`. It can't read Studio's database or secrets, and it can't install services or change Apache.
- Agents for different projects share the `ztd` user, so project folders aren't isolated from each other. Give each project its own Unix user if you ever host untrusted code.
- Each run receives the user's Claude token as an environment variable. Another agent running at the same moment could read it through `/proc`. That's acceptable for a small trusted team.

## Testing

```sh
# a throwaway local instance (no root, no systemd), then the browser test
STUDIO_ALLOW_FIRST_SIGNUP=1 STUDIO_SECRET=local-test-secret-0123456789abcdefghijklmnop STUDIO_DATA=/tmp/st/data \
  PORT=4310 STUDIO_DOMAIN=localhost STUDIO_HOST=studio.localhost STUDIO_URL=http://studio.localhost:4310 \
  STUDIO_CTL=$PWD/studio/test/mock-ctl.mjs STUDIO_CTL_SUDO=0 MOCK_ROOT=/tmp/st/mock node studio/server.mjs &
node studio/test/e2e.mjs http://studio.localhost:4310 localhost:4310 /tmp/st/shots
```

The test covers:

- invite-only sign-up and required two-step sign-in
- teams, invites and roles
- creating a project, and Connect Claude
- streaming chat, resume and stop
- the Changes tab and committing
- services and logs, and the Files tab
- the project login gate, and that cookies don't leak to projects
- admin reset links
- the phone layout
- deleting a project
