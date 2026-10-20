# Board
Labels: #ops #infra

## To do

## In progress

## Done
- Add migration tooling to move Studio to another server #ops #infra
  `ops/migrate-server.sh` (snapshot/restore), `studio-admin reapply-services`, and a README runbook.
  Carries DB, projects, uploads, secrets and sessions; keeps STUDIO_SECRET; regenerates certs for the new domain.
  The actual move is run by hand on the two servers per the runbook.
