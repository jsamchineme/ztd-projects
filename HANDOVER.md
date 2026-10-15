# Studio handover (15 October 2026)

Studio is live at **https://studio.ztddevs.com**. It's your Claude-style web app for building and running projects on your server. Three steps that only you can do are left: about 10 minutes in total.

## Do this first (in order)

**1. Create your owner account** (1 minute). In Terminal on your Mac, run:

```sh
ssh -i ~/.ssh/ztddevs root@129.121.95.175 'studio-admin bootstrap samuel@cookseytechnologygroup.com "Samuel" "ZTD"'
```

It prints a `setPasswordLink`, which works for 48 hours.

- Open it and choose a password (at least 12 characters), then sign in.
- Studio then makes you set up two-step sign-in. Scan the QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password or Authy).
- Save the 10 backup codes in your password manager.

**2. Connect your Claude subscription** (30 seconds).

1. Go to **Account → Connect my Claude subscription**.
2. Click **Open claude.ai to approve**, sign in and approve.
3. claude.ai shows a code. Paste it back into Studio.

Your prompts now run on your Claude.ai plan, with no API key. If you prefer, you can paste an API key instead.

**3. Move the pipeline to the server** (5–10 minutes, depending on your upload speed). In Terminal, from this repo:

```sh
bash studio/ops/migrate-pipeline.sh
```

This copies the whole repo to the server: code, git history, both boards' data, `prospects/` and `pipeline/notify.local.json`. That's about 600 MB. It then registers it in Studio as the **Pipeline** project with three services:

| Service | Address | Starts by itself |
| --- | --- | --- |
| GP and dental board | https://pipeline.ztddevs.com | yes |
| Nursery board | https://nurseries.ztddevs.com | yes |
| Mapboard | https://mapboard.ztddevs.com | no (start it from Services) |

I couldn't run this copy myself. Claude Code's safety check blocked uploading your prospect data, so it's yours to run. It's safe to run again later to send newer local changes. It never deletes anything on the server.

After that, open **Pipeline → Chat** in Studio and tell Claude what to change.

## What's built

- **Chat with Claude.** It works like Claude Code: Claude reads and edits the project's files on the server and runs commands. You see its thinking, tool calls and replies as they stream in.
  - Choose a model (Opus, Fable, Sonnet or Haiku) and a mode: **Edit** changes things, **Plan only** changes nothing.
  - Press **■** to stop. Chats are saved and resume where they left off. Teammates can see each other's chats.
- **Services.** Start, stop or restart each part of a project, and watch live logs. Claude restarts services itself after changing server code.
  - **Edit services** sets the start command, web address, memory limit and environment variables. A new address gets HTTPS automatically.
- **Changes.** See every file Claude changed as a diff, then commit it with a message or undo single files. **Undo last commit** is also there.
- **Files.** Browse and read any file.
- **New project.** Start from a blank site or copy a public Git repo. The project goes live at `<name>.ztddevs.com` within a minute.
- **Teams and people.**
  - Create teams and invite people by email link, with roles (owner, admin, member). Members can work on a team's projects; owners and admins can also change settings and invite.
  - Each project web address is visible only to signed-in members of its team. Mark a service **Public** to share a client preview.
- **Security.**
  - Two-step sign-in is required for everyone, with backup codes.
  - Password reset, a "where you're signed in" list with remote sign-out, and login rate limits.
  - Admins can suspend people, reset someone's two-step sign-in, and give or remove admin rights.
  - Admins see a full activity log.
- **Nightly backups** at 03:30 to `/var/backups/ztd` on the server, kept for 14 days.

**How I tested it:**
- 26-step browser test of every feature above, run on a throwaway copy of Studio: all passing.
- The real pipeline board, with a copy of your 501 cards, works through the login gate.
- On the server: services, logs, agent runs, git, HTTPS certificates and backups.

## Things to know

- **Email isn't set up yet.** Until it is, invite and password-reset links aren't emailed. Studio shows them to admins to copy instead (Teams and people, and Admin). To turn email on, see "Turn on email" in `studio/README.md`. You need a Gmail app password.
- **Teammates and Claude subscriptions.** Each person connects their own Claude account. Doing that inside our own app is a grey area under Anthropic's terms. It's fine for you, but before giving access to people outside your company, either check with Anthropic or have them use an API key.
- **The pipeline's own AI workers** use your Claude connection. You can change that in Pipeline → Settings. They run on the server, so audits use the server's Chrome.
- **The server is small:** 2 CPUs, 3.8 GB of memory plus 4 GB swap. It also runs someone's revisaacmpamaugo.online site, which I didn't touch. Running two boards, Chrome audits and Claude at once is fine for a few people. If it feels slow, upgrade the server to 8 GB.
- **After you migrate, the server copy is the source of truth.** Studio commits on the server. Pushing to GitHub from the server needs a deploy key, which isn't set up yet. Ask me to do it.
- **Backups stay on the same server.** For real safety, copy them somewhere else too. That needs a destination, such as Backblaze or S3.
- **Port 9090 (Cockpit) is open to the internet.** It was already there before me. If nobody uses it, close it: `firewall-cmd --remove-service=cockpit --permanent && firewall-cmd --reload`.
- **Not built:** passkey sign-in (authenticator codes only), attaching images to prompts, and per-project isolation between agents (all projects share one Linux user). Details are in `studio/README.md` under "Security model".

## Local changes I made (nothing committed or pushed)

- `studio/`: all of Studio's code, deploy scripts and tests.
- `pipeline/index.html`: preview links work when the board isn't on localhost.
- `pipeline/server.mjs`: notification emails link to the board's real address (`PUBLIC_URL`).
- `CLAUDE.md`: a short Studio section.
- `HANDOVER.md`: this file.
