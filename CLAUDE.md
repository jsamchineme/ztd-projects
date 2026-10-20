# Project

Built with ZTD Devs Studio. `node server.mjs` serves `public/` on `$PORT`.
Studio runs it as the "web" service; after changing `server.mjs`, restart it with `sudo studio-ctl svc <project> web restart`.

Control panel (`/panel/`, `src/panel/`, `src/stalwart.mjs`): `docs/control-panel.md`. Ops docs: `docs/dns.md` (all ztdoffice.com DNS records; verify with `node scripts/check-dns.mjs`) and `docs/vps-pilot.md` (pilot mail server: access, paths, Stalwart setup, server moves). Task board: `BOARD.md`.

Change control (ISO 27001, `docs/security/`): once the GitHub repo exists, never commit to `main` — work on a branch, open a PR with the template, let CI pass, and leave approval and merging to Samuel. Infrastructure changes (VPS, DNS, providers) need Samuel's go-ahead on a board task first and a doc update PR after.
