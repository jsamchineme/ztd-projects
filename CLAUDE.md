# Project

Built with ZTD Devs Studio. `node server.mjs` serves `public/` on `$PORT`.
Studio runs it as the "web" service; after changing `server.mjs`, restart it with `sudo studio-ctl svc <project> web restart`.

Control panel (`/panel/`, `src/panel/`, `src/stalwart.mjs`): `docs/control-panel.md`. Ops docs: `docs/dns.md` (all ztdoffice.com DNS records; verify with `node scripts/check-dns.mjs`) and `docs/vps-pilot.md` (pilot mail server: access, paths, Stalwart setup, server moves). Task board: `BOARD.md`.
