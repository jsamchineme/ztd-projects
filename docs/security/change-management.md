# Change management

ISO/IEC 27001:2022 Annex A 8.32 (change management), 8.31 (separate environments), 8.29 (security
testing). Owner: Samuel. Review this document every 12 months or after any incident.

## Scope

Every change to:

1. **Code and configuration in this repository**: the control panel, scripts, docs that describe
   how systems are set up.
2. **Infrastructure**: the mail server (VPS), DNS records, Stalwart settings, Resend/SES, Vercel,
   Neon, GitHub settings.

## Normal change (code)

| Step | Who | Evidence |
|---|---|---|
| 1. Reason recorded: a task on `BOARD.md` or a GitHub issue | Requester | Task / issue |
| 2. Work on a branch named after the change (`panel/add-resend-domains`) | Author | Branch |
| 3. Pull request using the template: what, why, risk, how tested, rollback | Author | PR |
| 4. Automated checks pass: tests and secret scan | CI | Checks on the PR |
| 5. Preview deployment checked | Author + reviewer | Vercel preview link on the PR |
| 6. Review and approval by someone other than the author | Reviewer (Samuel) | GitHub approval |
| 7. Merge to `main`, then automatic production deployment | Reviewer | Merge commit, Vercel deployment |
| 8. Check production after deploy; close the task | Author | PR comment |

`main` is protected (see [github-setup.md](github-setup.md)): nobody can push to it directly, and a
PR needs one approval and passing checks before it can merge. This includes the repository owner
and automated tools.

**Claude (AI assistant)** writes code on branches and opens PRs; it never merges or approves.
Samuel reviews and approves. If Samuel writes a change himself, he records a self-review on the PR
(the checklist in the template) and the automated checks still apply. This compensating control is
accepted while ZTD Office has one engineer; add a second reviewer when staff join.

## Infrastructure change

Changes made directly on the mail server, in DNS or in a provider's console can't go through a PR
before they happen. For these:

1. Plan it: a board task stating the change, risk and how to undo it, approved by Samuel *before*
   the change (a comment or "go ahead" on the task is enough).
2. Make the change and verify it (e.g. `node scripts/check-dns.mjs`, a test email).
3. Record it the same day by updating the relevant doc (`docs/vps-pilot.md`, `docs/dns.md`, …)
   in a PR that says what was changed, when and by whom.

Keep a backup or the previous value before changing anything (e.g. `docker-compose.yml.bak-<date>`
on the VPS, old DNS values in the PR).

## Emergency change

To stop an active incident (outage, security breach, abuse), a change may be made first and
reviewed after:

- make the smallest change that stops the problem;
- within 2 working days, open a PR or update the docs with the change, labelled `emergency`, and
  have it reviewed;
- record the incident (date, what happened, what was done) in `docs/security/incidents.md`.

## Rollback

- Code: revert the PR on GitHub, or promote the previous deployment in Vercel (instant).
- Database: migrations must be backwards-compatible with the previous release, or come with a
  written down-migration in the PR.
- Mail server: restore the backed-up config file and restart the container.

## Separation of environments

| | Purpose | Data |
|---|---|---|
| Local / Studio | Development and automated tests | In-memory fake mail server, test database |
| Vercel preview (per PR) | Review before merge | Neon branch database; read-only or test mail server access |
| Vercel production (`main`) | Clients | Production Neon database, live mail server |

Production secrets exist only in Vercel and Neon production settings and on the VPS. They are never
put in the repository, in PRs, or in chat.
