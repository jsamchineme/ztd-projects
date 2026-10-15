# Mapboard and Pipeline

This repo holds three things:

- **Mapboard** (`index.html`, `server.mjs`): a whiteboard app that can generate and edit boards with Claude.
- **Pipeline** (`pipeline/`): the main project. It's a board that moves website-redesign prospects through stages, worked by people and by AI workers (the local `claude` CLI).
- **Prospects** (`prospects/`): graded lists of Scottish dental practices (`prospects/data`, `prospects/grades`) and GP practices (`prospects/gp/`)., plus independent nurseries (`prospects/nursery/`, see its README). Screenshots are gitignored.

The business: redesign the websites of NHS dental and GP practices in Scotland, then pitch the before and after. The audience is patients, often older or anxious, and practice managers.

## Current focus (October 2026)

**Making the templates good enough to send to prospects.** Samuel is generating templates and improving them by studying more real websites, both nurseries and NHS dental and GP practices. Over time the templates should look more standard and more polished, ready for distribution.

- **How it's done:** study real sites, write up the findings in `prospects/research/`, then make new templates or revise existing ones from them. Ground each change in the research or the owner's feedback, and say which.
- **Owner's feedback so far:** the nursery templates felt cramped, especially on phones. This led to the `-spacious` variants (`prospects/research/nursery-spacious-directions.md`): more space, less on the home page, and clear routes to separate pages for detail.
- **What "ready" means:** every template passes the rules below (0 audit issues, clean at every width). Each one has an up-to-date `BRIEF.md`, a worked `example/` and a fresh `thumb.jpg`.
- **Then:** send the templates to prospects.

Update this section when the focus changes.

## Studio (`studio/`)

The hosted web app for building and running these projects with Claude: https://studio.ztddevs.com, on the server `root@129.121.95.175` (key `~/.ssh/ztddevs`). Projects live in `/srv/projects/<slug>/repo` and run as systemd services behind Studio's login at `<sub>.ztddevs.com`. If you're running inside Studio, the system prompt gives the service names. Restart a service after changing its server code with `sudo studio-ctl svc <project> <service> restart`. Don't commit: people commit from Studio's Changes tab. See `studio/README.md` for the architecture, deploys and security model. The Studio source is moving out of this repo into its own **Studio** project (`/srv/projects/studio-src`, run as the user `studiodev`), so team members' chats can't change it: see "Moving the Studio source" in that README. Once it has moved, change Studio there, not here. The server also hosts an unrelated site (revisaacmpamaugo.online, Apache, MySQL), so never touch its config.

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

**Health practices (`practice/`):**
- The **Front Desk** family is task-first with little imagery: GP `front-desk-gp`, Dental `front-desk-dental` and Local `front-desk-local`.
- The **Familiar Faces** family is people-led: GP `familiar-faces-gp` and Dental `familiar-faces-dental`.
- **Doorway** (`doorway`) is led by photos of the practice premises.
- **Results** and **Studio** are for mainly private dental practices (`prospects/research/private-dental-patterns.md`).

**Nurseries (`nursery/`):**
- About 15 templates, most with a `-spacious` variant. They include `front-desk`, `key-worker`, `garden-gate` and `meadow`, among others.
- They're built from the research in `prospects/research/nursery-*.md` and the site studies in `nursery-sites*/`.
- `templates/compare.html` shows each original next to its spacious variant.
- Nursery builds never show identifiable children.

Every template has `BRIEF.md`, `styles.css` (tokens at the top), `fonts/`, a small JS file and `example/`. The people-led ones also have `PHOTO-SHOTLIST.md`.

Rules for any template or built site:
- **Never invent facts:** no made-up prices, reviews, staff, online booking or policies. Write "phone to check" when a fact is unclear. Check NHS facts against nhsinform.scot or nhs.uk.
- **Follow the NHS research:** patient tasks first on a 390px phone, no pop-ups or carousels, plain English at a reading age of 9–11, a menu of 7 items or fewer for GP practices.
- **Photos:** only real staff photos with consent. Never stock or AI-generated people.
- **Accessibility:** WCAG 2.2 AA. `audit.mjs` must report 0 blockers, 0 major and 0 minor, and `viewports.mjs` must show clean layouts at every width.
- **Performance:** self-hosted fonts, no CDNs (GDPR), and a small page weight.
- After changing a template, re-run `node pipeline/template-thumbs.mjs`.

Audit fixes that work:
- **Google Maps embeds:** the audit flags a cross-origin Google Maps `<iframe>` as "no visible focus". CSS can't fix that. Put `tabindex="-1" aria-hidden="true"` on the iframe, and add a visible, focusable "Open in Google Maps" link next to it, at least 44px tall.
- **Tap targets:** these are measured per element. Links that don't use the `.btn` class, such as `.emergency a.call`, need their own `min-height: 44px`.
- **Contrast:** failures usually come from white text on mid-tone brand colours. Darken the colour used for text and buttons until it reaches 4.5:1.

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
