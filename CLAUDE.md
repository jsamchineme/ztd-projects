# Mapboard and Pipeline

This repo holds three things:

- **Mapboard** (`index.html`, `server.mjs`): a whiteboard app that can generate and edit boards with Claude.
- **Pipeline** (`pipeline/`): the main project. It's a board that moves website-redesign prospects through stages, worked by people and by AI workers (the local `claude` CLI).
- **Prospects** (`prospects/`): graded lists of Scottish dental practices (`prospects/data`, `prospects/grades`) and GP practices (`prospects/gp/`). Screenshots are gitignored.

The business: redesign the websites of NHS dental and GP practices in Scotland, then pitch the before and after. The audience is patients, often older or anxious, and practice managers.

## Running it

- `make pipeline` starts the board at http://localhost:4390. It installs `pipeline/node_modules` (Playwright, axe-core, Playwright MCP) on the first run and uses the installed Chrome.
- Restart the server after changing `server.mjs`, `workers.mjs`, `audit.mjs` or `config.json`. Changes to `pipeline/index.html` only need a browser reload.
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
| `pipeline/cli.mjs` | CLI for agents. See `pipeline/AGENTS.md` |
| `pipeline/import-prospects.mjs` | Loads graded prospects into Bad and Average |

Live board data lives in `pipeline/data/` (cards.json, plus `work/<card>/` with built sites and audits). It is gitignored and isn't backed up.

## AI workers: things that bit us

- Previews are on localhost, and Claude's WebFetch can't reach localhost. Reviewers get the audit report and screenshots instead.
- Browser workers use the Playwright MCP and need `MCP_CONNECTION_NONBLOCKING=false`, or the tools aren't loaded in `-p` mode.
- The server refuses `/api/` requests whose user agent contains `HeadlessChrome`, so browser workers can't drive the board. Playwright tests that use the board must set a normal `userAgent`.
- Build workers may only run `Bash(node <abs path>/audit.mjs:*)`.
- Worker names must start with "AI ": the board uses that prefix to show AI status.
- Models: `fable`, `opus`, `sonnet`, `haiku`. Build steps default to Fable with a $6 cap per card.

## Templates (`pipeline/templates/`)

There are six. The **Front Desk** family is task-first with little imagery (GP `uk-gp`, Dental `uk-dental`, Local `uk-local`). The **Familiar Faces** family is people-led (GP `uk-people-gp`, Dental `uk-team`). **Doorway** (`uk-inside`) is led by photos of the practice premises. Each one has `BRIEF.md`, `styles.css` (tokens at the top), `fonts/`, a small JS file and `example/`. The people-led ones also have `PHOTO-SHOTLIST.md`.

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
