# ZTD Devs Studio

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
| `lib/agent.mjs` | Chats: runs `claude -p --output-format stream-json`, saves events and streams them over SSE. Chats resume their Claude session. Each chat runs in its own systemd scope in `studio-chats.slice`, outside `studio.service`: 1.5 GB per chat (`chatMemoryMB` in ctl.json), 1.5 GB for all chats together. A chat that goes over its limit only loses the process that did, never Studio or other chats. |
| `lib/uploads.mjs` | Files attached in chat (paste, drop or the paperclip): up to 20 MB each and 10 per message, saved to `/srv/studio-uploads/<slug>/<id>/`. That folder is owned by `studio` with group `ztd`, so Claude can read the files but not change them, and they stay out of git. The prompt lists the paths and Claude opens them with Read, which handles images, PDFs, notebooks and text. |
| `lib/notify.mjs` | Notifications each person chooses on the Account page, by email and on their phone |
| `lib/phone.mjs` | Phone notifications: pairing phones (a code shown once as a QR code; only its hash is kept), the WebSocket at `/api/phone/socket` the phone app keeps open, and a day of messages for phones that were offline |
| `lib/webpush.mjs` | Web push: Studio added to a phone's Home Screen (or open in a desktop browser) gets notifications while closed. Studio's VAPID keys (made once, the private one encrypted), each browser's subscription (only real push services' addresses are accepted), and sending encrypted pushes. `public/sw.js` shows them; `public/push.js` turns them on and off and tells Studio when it's open, which stops reminders. |
| `lib/runner.mjs` | People's own computers running their chats (Account → Your computers). See "Running chats on your own computer" below. |
| `runner/` | What runs on such a computer: `studio-runner.mjs`, and `install.sh`, which the install command on the Account page fetches. Studio serves both at `/runner/`. |
| `ops/gitsync.mjs` | Moving a project's files between Studio and a computer with git: snapshots of the working tree, bundles, and a three-way merge back. Used by `studio-ctl` (installed next to it), the runner and the tests. |
| `lib/claude.mjs` | Each user's Claude connection: a subscription token via `claude setup-token`, or an API key. Stored encrypted (AES-256-GCM). |
| `lib/ctl.mjs` | Runs `studio-ctl` through sudo |
| `ops/studio-ctl.mjs` | The root helper. It's the only privileged code. AI agents (user `ztd` or a project's own user) may run only `status`, and `svc` and `logs` for projects that run as their own user. |
| `ops/install.sh` | Installs or updates everything on the server. Safe to re-run. Also installs ffmpeg for project tasks, if it's missing. Project services get `OOMPolicy=continue` from a drop-in, so a process going over a service's memory limit doesn't stop the whole service. |
| `ops/backup.sh` | Nightly backup (03:30) to `/var/backups/ztd`, kept for 14 days |
| `ops/isolate-studio.sh` | One-off: moves the Studio source into its own project, `studio-src`, run as the user `studiodev` (see Security model) |
| `ops/migrate-pipeline.sh` | Copies this repo and its board data from a Mac to the server, then registers it as the Pipeline project |
| `ops/fake-claude.mjs` | Stand-in for the `claude` CLI for tests. Turn it on with `"fakeClaude"` in `/etc/studio/ctl.json`. |
| `bin/admin.mjs` | `studio-admin` on the server: `bootstrap`, `reset-link`, `import-project`, `make-admin`, `add-user`, `delete-user` |
| `mobile/` | The phone app (Expo, React Native) that rings for phone notifications. See `mobile/README.md`. Not installed on the server. |
| `public/` | The front end. Plain ES modules, no build step and no CDNs. |
| `test/` | `mock-ctl.mjs` and `e2e.mjs`: a 26-step browser test against a throwaway local instance |

## Running chats on your own computer

The server is small (2 CPUs, 4 GB). Anyone can add their own computer under **Account → Your computers** to run their chats on it, with its own CPU, memory and Claude Code login. The page shows a one-line command, with a code that's shown once (Studio keeps only its hash). That command installs Studio Runner in `~/StudioRunner`, with a LaunchAgent on a Mac, so it starts at login. It needs Node.js 22+, git and Claude Code signed in. The runner keeps an outgoing WebSocket open to `/api/runner/socket`, so nothing on the computer is opened to the internet.

- **Whose chats:** only the computer owner's own prompts run on it, never teammates'. Each chat has a **Runs on** choice next to the model:
  - **Auto:** the owner's computer if it's connected and has room, otherwise the server;
  - **Your computer:** the computer, or an error;
  - **Studio server.**

  A computer runs up to 2 chats at once by default, and one at a time per project.
- **Files:** the project stays on the server.
  - Before each turn, Studio sends a snapshot of the folder, uncommitted changes included, as a git bundle with only what the computer lacks.
  - The runner makes its copy (`~/StudioRunner/projects/<project>`) match it, keeping ignored files like `node_modules`.
  - After the turn, the runner sends back a snapshot of its copy. Studio merges the difference into the project folder (`studio-ctl sync-in`), with conflict markers where someone changed the same lines meanwhile.
  - Commits Claude made there become the project's if its history hasn't moved meanwhile; otherwise they come in as uncommitted changes.
  - Changes that can't be added are kept in git as `refs/studio/unapplied/…`.
- **Claude's session:** after every turn on a computer, its session transcript is copied to the project user's `~/.claude` on the server (`studio-ctl session-import`). Before a turn on a computer, if the chat last ran elsewhere, the server's copy goes to the computer. So a chat can switch between turns in either direction and Claude remembers it. Claude is told when a chat has moved, since the paths differ.
- **Interruptions:** a turn on a computer carries on if its connection drops or Studio restarts.
  - The runner keeps the output and the changes (in `~/StudioRunner/pending`) until Studio has them, and Studio picks up from the last line it had.
  - If the computer doesn't come back within 15 minutes, Studio ends the turn. Its changes come in when it reconnects.
  - Chats never move to the server in the middle of a turn.
- **Limits:**
  - Turns on a computer use its own Claude, so they don't count against daily budgets.
  - Claude there can't restart the server's services, so it says which ones need a restart.
  - Attachments are sent along with the prompt.
  - Claude runs with full permissions as the computer's user.
- **Updates:** runners update themselves to the version Studio serves, between turns.

## Server layout

| Path | What |
| --- | --- |
| `/srv/studio/app` | Studio code (owned by root) |
| `/srv/studio/data/studio.db` | Accounts, teams, projects, chats, audit log (SQLite) |
| `/etc/studio/studio.env` | Secrets and settings: `STUDIO_SECRET`, SMTP. Mode 640 root:studio. |
| `/etc/studio/ctl.json` | studio-ctl settings (domain, ports, optional `fakeClaude`) |
| `/etc/studio/env/` | Each service's environment variables (root only) |
| `/srv/projects/<slug>/repo` | Project folders (owned by `ztd`). `/srv/projects` itself belongs to root. Deleted projects go to `/srv/projects/.trash`. |
| `/srv/projects/studio-src/repo` | The Studio source, owned by `studiodev`, mode 700 |
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

**Or update from Studio itself.** Commit the changes in the **Studio** project's Changes tab, then press **Update and restart Studio** on the Admin page (Studio admins only). It runs `studio-ctl studio-update`, which installs the last commit of the Studio source project (`studioSource` in `/etc/studio/ctl.json`) with its own `ops/install.sh` in a separate systemd unit (`studio-update`) and shows the log as it goes. Uncommitted changes aren't installed. Agents can't run this. `studio-update` refuses to install from a project that runs as `ztd`, or whose folders other users could change.

**A broken update can't take Studio down.** `install.sh` first runs `ops/check.sh`, which syntax-checks every `.js`/`.mjs` file, and stops before changing anything if one fails. After restarting, it checks that Studio answers on its port and is still running a few seconds later; if not, it puts back the previous version (kept root-only in `/var/lib/studio/app.prev`) and the update reports a failure. The same check runs on every commit in a clone with `git config core.hooksPath .githooks` (turned on in the Studio source project).

**Moving the Studio source out of the pipeline project** (once). Studio used to update from `studio/` in the pipeline repo, which every project's agent could change. To move it:

1. Commit these changes in the pipeline project, then press **Update and restart Studio**. This installs the new `install.sh`, which creates `studiodev` and gives `/srv/projects` to root.
2. In Teams and people, create a team, for example "Studio", with only Studio admins in it.
3. On the server, as root: `bash /srv/studio/app/ops/isolate-studio.sh <that team's slug>`. It copies `studio/` (with its history) as of the installed commit into `/srv/projects/studio-src/repo`, sets `projectUsers` and `studioSource` in `ctl.json`, and adds the **Studio** project to that team.
4. Delete `studio/` from the pipeline project and commit that. From then on, change Studio in the Studio project.

**Turn on email** (password resets and invites). The easy way: Admin page → Email. Enter the settings, then press Check and save. Studio signs in to the mail server before saving, and stores the password encrypted in its database. Settings saved there replace any in the server file. Or add these to `/etc/studio/studio.env`, then run `systemctl restart studio`:

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
- Each new project runs (chats, git, services) as its own user, `zp-<name>`, in a folder only that user can open, and its chat attachments are readable by that user only. `studio-ctl project-create` makes the user and records it in `projectUsers` in `ctl.json`; set `"projectOwnUsers": false` there to put new projects on the shared `ztd` user instead. Projects made before this share `ztd` until a Studio admin presses **Move to its own user** in the project's Settings (`studio-ctl project-own-user`): its services stop, its files, chat sessions and attachments move to the new user, and Studio rewrites and restarts its services. Project users are in the `studio-agents` group, and `sudo studio-ctl` lets each agent user act only on its own project's services, even after its project is deleted.
- The Studio source is one such project (`studio-src`, user `studiodev`), so team members' chats can't change the code that updates install as root. Keep its team to Studio admins.
- systemd holds Studio's port (`studio.socket`) even while Studio restarts, so a project's process can't take it over and pose as Studio.
- Projects may only set cookies for their own host: Studio drops `Domain=` from their cookies, and refuses Studio's own cookie names.
- Each run receives the user's Claude token as an environment variable. Another agent running at the same moment could read it through `/proc`. That's acceptable for a small trusted team.

## Testing

```sh
npm test        # the browser test, about a minute; exits 1 if anything fails
npm run check   # just the syntax check (also run on every commit and before every update)
```

`npm test` (`test/run.sh`) copies this folder as it is now, uncommitted changes included, starts a throwaway Studio from the copy on port 4310 (`STUDIO_TEST_PORT` to change it), and drives Chrome through `test/e2e.mjs`. It needs no root or systemd: `test/mock-ctl.mjs` stands in for `studio-ctl` and `ops/fake-claude.mjs` for Claude. Packages are installed once into `~/.cache/studio-test`. Screenshots go to `/tmp/studio-test-shots`, and on a failure Studio's log is printed. Set `CHROME_BIN` if Chrome isn't at the usual place.

The test covers:

- invite-only sign-up and required two-step sign-in
- teams, invites and roles
- creating a project, and Connect Claude
- streaming chat, resume and stop, and prompts showing up over a stuck connection
- the Changes tab and committing
- services and logs, and the Files tab
- the project login gate, and that cookies don't leak to projects
- admin reset links
- the phone layout
- deleting a project
