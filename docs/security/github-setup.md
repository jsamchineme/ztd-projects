# GitHub and Vercel settings

The settings that make the [change-management](change-management.md) process enforced rather
than optional. Re-check them at every 6-monthly access review.

## Repository

- **Private** repository `ZTD-Devs/ztdoffice` (git@github.com:ZTD-Devs/ztdoffice.git): docs, board, panel, website, mail-server config.
- Organisation `ZTD-Devs` on the **GitHub Team** plan (rulesets aren't enforced on private repos
  on GitHub Free). Organisation settings → Authentication security: **require two-factor
  authentication** for all members.
- **Settings → Code security**: enable the dependency graph, Dependabot alerts and Dependabot
  security updates. GitHub's own secret scanning for private repos is a paid add-on (Secret
  Protection); instead, the `secret-scan` CI check (TruffleHog) scans every PR and the whole history.
- **GitHub App `ztd-devs-studio`** (organisation → Developer settings → GitHub Apps) is how the
  Studio server (Claude) works on the repo. It has its own identity in the history and audit log.
  - Repository permissions: Contents read/write, Pull requests read/write, Workflows read/write,
    Checks read, Metadata read. Everything else: no access. No webhook.
  - Installed on `ztdoffice` only.
  - Its private key is on the Studio server only, in `~/.config/ztdoffice-gh/` (folder 700, files
    600). Git asks `token.mjs` for a token that expires after 1 hour; no long-lived password exists.
  - It can push branches and open PRs; the ruleset below stops it from changing `main`, approving
    or merging. To revoke: uninstall the App, or delete its private key in the App settings.
- Deploy keys stay **disabled** for the organisation (the default).

## Ruleset for `main` (Settings → Rules → Rulesets → New branch ruleset)

| Setting | Value |
|---|---|
| Name | `protect-main` |
| Enforcement | Active |
| Bypass list | **empty** (not admins, not the GitHub App) |
| Target | Default branch |
| Restrict deletions | on |
| Block force pushes | on |
| Require a pull request before merging | on: 1 required approval; dismiss stale approvals on new commits; require conversation resolution |
| Require status checks to pass | on: `tests`, `secret-scan`; require branches to be up to date |
| Require linear history | on (squash merges) |

**Pull request settings** (Settings → General → Pull Requests): squash merging only; allow
auto-merge; automatically delete head branches. Claude opens PRs with auto-merge on, so a PR merges
by itself once Samuel approves and the checks pass. Approvals are never automated: the human
approval is the change-management control.

**Verified 2026-10-20:** rules on `main` read back through the API (deletion, non-fast-forward,
linear history, pull request with 1 approval + stale-review dismissal + thread resolution, required
checks `tests` and `secret-scan` with up-to-date branches). A direct push to `main` by the GitHub
App was refused: `GH013: Repository rule violations — Changes must be made through a pull request;
2 of 2 required status checks are expected.` Repeat this test at each access review.

With one engineer, GitHub doesn't let you approve your own PR. Claude's PRs are approved by Samuel;
for Samuel's own PRs, temporarily set required approvals to 0, complete the self-review checklist
in the PR, and set it back. Note it in the PR. Replace this once a second reviewer exists.

## Vercel

- Import the repository; **Production Branch** = `main`. Every PR gets a preview deployment.
- **Environment variables**: production values only in the *Production* environment. Preview gets
  test values (Neon preview branch, mail server in read-only or fake mode).
- **Deployment Protection**: Vercel Authentication on for preview deployments.
- Team members: Samuel only (Owner). Turn on two-factor authentication for the Vercel, GitHub and
  Neon accounts.

## Neon

- Create the database through Vercel → Storage → Neon, so `DATABASE_URL` is managed by Vercel.
- Enable branching for preview deployments; production branch protected.
- Point-in-time restore window: at least 7 days.
