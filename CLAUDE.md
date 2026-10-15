# Mapboard and Pipeline

This repo holds three things:

- **Mapboard** (`index.html`, `server.mjs`): a whiteboard app that can generate and edit boards with Claude.
- **Pipeline** (`pipeline/`): the main project. It's a board that moves website-redesign prospects through stages, worked by people and by AI workers (the local `claude` CLI).
- **Prospects** (`prospects/`): graded lists of Scottish dental practices (`prospects/data`, `prospects/grades`) and GP practices (`prospects/gp/`)., plus independent nurseries (`prospects/nursery/`, see its README). Screenshots are gitignored.

The business: redesign the websites of NHS dental and GP practices in Scotland, then pitch the before and after. The audience is patients, often older or anxious, and practice managers.

## Studio (`studio/`)

The hosted web app for building and running these projects with Claude: https://studio.ztddevs.com, on the server `root@129.121.95.175` (key `~/.ssh/ztddevs`). Projects live in `/srv/projects/<slug>/repo` and run as systemd services behind Studio's login at `<sub>.ztddevs.com`. If you're running inside Studio, the system prompt gives the service names. Restart a service after changing its server code with `sudo studio-ctl svc <project> <service> restart`. Don't commit: people commit from Studio's Changes tab. See `studio/README.md` for the architecture, deploys and security model. The server also hosts an unrelated site (revisaacmpamaugo.online, Apache, MySQL), so never touch its config.

## Running it

- `make pipeline` starts the board at http://localhost:4390. It installs `pipeline/node_modules` (Playwright, axe-core, Playwright MCP) on the first run and uses the installed Chrome.
- Restart the server after changing `server.mjs`, `workers.mjs`, `audit.mjs` or `config.json`. Changes to `pipeline/index.html` only need a browser reload.
- `make nurseries` runs the separate nursery board at http://localhost:4391: `pipeline/nursery.config.json` (its own stages, templates and `research` brief that every worker reads) with data in `pipeline/data-nursery/`. A config can set `title`, `audience`, `businessNoun` and `research`; `PIPELINE_CONFIG` picks the config file.
- `make start` runs Mapboard at http://localhost:4380.

## Pipeline layout

| File | What it does |
| --- | --- |
| `pipeline/server.mjs` | API, live updates (SSE), and serving `/preview/<card>/`, `/audit/<card>/` and `/templates/…` (all sandboxed) |
| `pipeline/workers.mjs` | Workflow runner: runs Claude workers per stage, time and spend limits, Needs attention routing |
| `pipeline/config.json` | Stages and outcomes, card fields, and templates (`templates`, `templateFiles`, `templateSummaries`) |
| `pipeline/index.html` | Board UI: cards, panel, workflows drawer, template picker |
| `pipeline/audit.mjs` | Playwright and axe browser audit. `node pipeline/audit.mjs <url> <outdir>` |
| `pipeline/crawl.mjs` | Crawls a practice's current site into `work/<card>/source/` (SITE.md, page texts, photos, documents). Runs before Redesign study. `node pipeline/crawl.mjs <url> <outdir> [max pages]` |
| `pipeline/viewports.mjs` | Screenshots and layout flags at 9 widths from 360 to 1440px. `node pipeline/viewports.mjs <url> <outdir> [widths]` |
| `pipeline/template-thumbs.mjs` | Regenerates `templates/*/thumb.jpg` for the picker |
| `pipeline/notify.mjs` | Notifications (needs attention, ready for review, workflow ended, workers gave up): desktop via the board, email via Gmail SMTP. Settings in `pipeline/notify.local.json` (git-ignored) |
| `pipeline/cli.mjs` | CLI for agents. See `pipeline/AGENTS.md` |
| `pipeline/import-prospects.mjs` | Loads graded prospects into Bad and Average |

Live board data lives in `pipeline/data/` (cards.json, plus `work/<card>/` with built sites and audits). It is gitignored and isn't backed up.

## AI workers: things that bit us

- Previews are on localhost, and Claude's WebFetch can't reach localhost. Reviewers get the audit report and screenshots instead.
- Browser workers use the Playwright MCP and need `MCP_CONNECTION_NONBLOCKING=false`, or the tools aren't loaded in `-p` mode.
- The server refuses `/api/` requests whose user agent contains `HeadlessChrome`, so browser workers can't drive the board. Playwright tests that use the board must set a normal `userAgent`.
- Build workers get Bash without approval prompts, inside Claude Code's macOS sandbox (`--settings` sandbox: writes only in the card's folder, no network). `node <abs path>/audit.mjs` is the one command excluded from the sandbox, because it needs Chrome and localhost. Exclusions need the `:*` form or they don't match.
- Worker names must start with "AI ": the board uses that prefix to show AI status.
- Workers run `claude -p --output-format stream-json --verbose`. Each step (thinking, tool calls, messages) feeds the card panel's "AI activity" feed through `GET /api/cards/<id>/activity`, and the last 8 sessions are saved to `work/<card>/activity.json`. A fake `CLAUDE_BIN` must print stream-json lines ending with a `{"type":"result",…}` event.
- Models: `fable`, `opus`, `sonnet`, `haiku`. Build steps default to Fable with a $6 cap per card.

## Templates (`pipeline/templates/`)

There are six. The **Front Desk** family is task-first with little imagery (GP `practice/front-desk-gp`, Dental `practice/front-desk-dental`, Local `practice/front-desk-local`). The **Familiar Faces** family is people-led (GP `practice/familiar-faces-gp`, Dental `practice/familiar-faces-dental`). **Doorway** (`practice/doorway`) is led by photos of the practice premises. The nursery board has its own three: **Front Desk Nursery** (`nursery/front-desk`), **Key Worker** (`nursery/key-worker`) and **Garden Gate** (`nursery/garden-gate`), built from `prospects/research/nursery-websites.md`; nursery builds never show identifiable children. Each one has `BRIEF.md`, `styles.css` (tokens at the top), `fonts/`, a small JS file and `example/`. The people-led ones also have `PHOTO-SHOTLIST.md`.

Rules for any template or built site:
- **Never invent facts:** no made-up prices, reviews, staff, online booking or policies. Write "phone to check" when a fact is unclear. Check NHS facts against nhsinform.scot or nhs.uk.
- **Follow the NHS research:** patient tasks first on a 390px phone, no pop-ups or carousels, plain English at a reading age of 9–11, a menu of 7 items or fewer for GP practices.
- **Photos:** only real staff photos with consent. Never stock or AI-generated people.
- **Accessibility:** WCAG 2.2 AA. `audit.mjs` must report 0 blockers, 0 major and 0 minor, and `viewports.mjs` must show clean layouts at every width.
- **Performance:** self-hosted fonts, no CDNs (GDPR), and a small page weight.
- After changing a template, re-run `node pipeline/template-thumbs.mjs`.

## Testing safely

- Test against a copy of the data on another port: `PIPELINE_DATA=<scratch>/cards.json node pipeline/server.mjs 4398`. Never run test workflows on the live board.
- Use `CLAUDE_BIN=<fake script>` to test workflows without spending money.
- In zsh, quote URLs that contain `?`, and don't rely on word-splitting `$VARS`.
- When editing `config.json` with a script, check that every top-level key survives (`claimMinutes`, `attentionStage`, `ratingBands`, `templates`, `templateFiles`, `templateSummaries`, `fields`, `pipelines`). Losing `fields` once stopped the server from starting.
- Parallel subagents share the session scratchpad, so give each its own subfolder.

## Git

- **Remote:** the private repo `jsamchineme/product-mapboard`, via the SSH host `github-personal` (the user's personal key). The `gh` CLI is signed in as a different account (samuelviv), so use git over SSH.
- **Commit identity** (set locally in this repo): `jsamchineme <jsamchineme@gmail.com>`.
- Commit only when asked.

## Ideas folder

`ideas/` holds the user's own notes: competitors (`competitors/gp-website-competitors.xlsx`), improvements and partnerships. Read them for intent, and don't edit them unless asked.
