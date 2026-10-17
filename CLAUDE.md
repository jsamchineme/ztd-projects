# Project

Built with ZTD Devs Studio. Next.js 16 + Prisma 7 (Postgres/Neon) storefront with a CMS.

Studio runs `node server.mjs` as the "web" service on `$PORT`, with env from the Studio service env.
On start, `server.mjs` runs `prisma migrate deploy`, seeds only an empty DB (`seed.ts --if-empty`),
rebuilds (`npm run build`) only if the source changed, then boots Next.js on 127.0.0.1.
After code changes, restart it with `sudo studio-ctl svc <project> web restart`.

- Dependencies: run `npm install` on the server after `package.json` changes (node_modules is git-ignored).
- Local dev: `npm run dev` (needs a local Postgres in `.env`).
- Uploads go to Cloudinary under `CLOUDINARY_FOLDER` when Cloudinary env is set, else `public/uploads/`.
