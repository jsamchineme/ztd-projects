## What and why
<!-- What changes, and the board task / issue it comes from. -->

Task:

## Risk
<!-- What could break, and who would notice (clients, mail delivery, ZTD staff only)? Low / medium / high. -->

## How it was tested
<!-- Automated tests added or changed; what you checked on the preview deployment. -->

## Rollback
<!-- How to undo: revert this PR / promote previous Vercel deployment / database down-migration. -->

## Security checklist (author ticks, reviewer confirms)
- [ ] Server checks who is signed in and which client they belong to, for every new or changed route
- [ ] Input is validated on the server; database queries are parameterised
- [ ] No secrets, passwords or keys in code, tests, logs or this PR
- [ ] Destructive or sensitive actions ask for confirmation and are written to the activity log
- [ ] Tests cover the change, including someone who should *not* be allowed to do it
- [ ] New dependencies are necessary, maintained and pinned (or: none added)
- [ ] Docs updated if this changes how a system is set up (`docs/`)

<!-- Infrastructure changes (VPS, DNS, providers): link the approved board task and say when the change was made. -->
<!-- Self-review (author is the only engineer): write "Self-review" here and complete the checklist; see docs/security/change-management.md. -->
