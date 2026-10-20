# ZTD Office control panel (Next.js)

The control panel at **admin.ztdoffice.com**. Next.js (App Router, TypeScript), Postgres via
Drizzle, deployed on a VPS in Docker behind Caddy. Replaces the earlier `/panel` built on the
root `server.mjs` (kept until this is deployed).

## Run locally
```
npm install
npm run seed     # staff login samuel@ztdoffice.com / staff-password-123 + sample clients
npm run dev      # http://localhost:4410
```
With no `DATABASE_URL`, an in-process PGlite database is used (under `.pglite/`). Production sets
`DATABASE_URL` (Neon or any Postgres). Mailboxes, groups and domains live on the mail server
(`src/lib/stalwart.ts`); `STALWART_MODE=fake` (the default) uses an in-memory stand-in, so no mail
server is needed for development or tests.

## Checks
```
npm run typecheck
npm test          # Vitest: plans, auth, the fake mail server and the Postgres store (PGlite)
npm run build
```

## Layout
- `src/lib` — plans, auth, sessions, the Drizzle schema/store, the Stalwart client, DNS checks,
  and `panel.ts` (server-side composition for the pages).
- `src/app` — App Router pages and server actions. `src/components` — shared UI.
- Design E (dark, Resend-style); the stylesheet is `src/app/globals.css`.

See `../../docs/control-panel.md` for how the panel maps to the mail server.
