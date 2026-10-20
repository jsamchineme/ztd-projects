# Project

Built with ZTD Devs Studio. `node server.mjs` serves `public/` on `$PORT`.
Studio runs it as the "web" service; after changing `server.mjs`, restart it with `sudo studio-ctl svc <project> web restart`.

Control panel (`/panel/`, `src/panel/`, `src/stalwart.mjs`): `docs/control-panel.md`. Ops docs: `docs/dns.md` (all ztdoffice.com DNS records; verify with `node scripts/check-dns.mjs`) and `docs/vps-pilot.md` (pilot mail server: access, paths, Stalwart setup, server moves). Task board: `BOARD.md`.

Change control (ISO 27001, `docs/security/`): GitHub repo `ZTD-Devs/ztdoffice`; `main` is protected. Never commit to `main` — branch from `origin/main`, push, open a PR with the template (as the `ztd-devs-studio` App: token from `node ~/.config/ztdoffice-gh/token.mjs`; git already uses it), turn on squash auto-merge, and leave approval to Samuel. Afterwards return the Studio copy to `main` and fast-forward it. Infrastructure changes (VPS, DNS, providers) need Samuel's go-ahead on a board task first and a doc update PR after.
