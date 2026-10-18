// Studio "web" service entry point. Studio runs `node server.mjs` on $PORT with the
// service env file loaded, so this file prepares everything a restart needs:
//
//   1. `prisma migrate deploy`   — apply pending migrations to DATABASE_URL
//   2. `prisma generate` + seed (upserts), only when the seed or its scraped data changed
//   3. `next build`, only if the source changed since the last build
//   4. boot Next.js
//
// Local development: use `npm run dev` instead.
import { createServer } from "node:http";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = import.meta.dirname;
const dev = process.env.NODE_ENV === "development";
if (!dev) process.env.NODE_ENV = "production";

const port = Number(process.env.PORT || 4402);
const hostname = process.env.HOST || "127.0.0.1";

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

// Hash of every tracked or untracked-but-not-ignored file, so any code change triggers a rebuild.
function sourceHash() {
  const files = execSync("git ls-files -co --exclude-standard", { cwd: root })
    .toString()
    .split("\n")
    .filter(Boolean)
    .sort();
  const hash = createHash("sha256");
  for (const f of files) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    hash.update(f).update(readFileSync(p));
  }
  return hash.digest("hex");
}

if (!dev) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set — add it to the Studio service env.");
    process.exit(1);
  }

  // Migrations + seed only when the migrations, the seed/scraped data, or the
  // target DB changed; a plain restart skips straight to booting.
  // NOTE: while the site is being migrated from Wix the seed is the source of
  // truth, so a changed seed re-applies its content (upserts) to the DB.
  const bin = (name) => join(root, "node_modules", ".bin", name);
  const dbStampFile = join(root, ".next", "db-hash");
  const dbHash = createHash("sha256").update(process.env.DATABASE_URL);
  const dbFiles = execSync(
    "git ls-files -co --exclude-standard prisma/migrations prisma/seed.ts prisma/data",
    { cwd: root },
  )
    .toString()
    .split("\n")
    .filter(Boolean)
    .sort();
  for (const f of dbFiles) dbHash.update(f).update(readFileSync(join(root, f)));
  const dbCurrent = dbHash.digest("hex");
  const dbBuilt = existsSync(dbStampFile) ? readFileSync(dbStampFile, "utf8") : "";
  if (dbCurrent !== dbBuilt) {
    // Migrations run over Neon's direct host (the pooler breaks session state),
    // without Prisma's advisory lock: a lock left behind on a pooled connection
    // otherwise blocks every start. Safe here — this service is the only deployer.
    const directUrl = process.env.DATABASE_URL.replace("-pooler.", ".");
    console.log(`$ ${bin("prisma")} migrate deploy`);
    execSync(`${bin("prisma")} migrate deploy`, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: directUrl, PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1" },
    });
    // The seed uses the generated client, so it must match the schema just migrated
    // (`npm run build` regenerates too, but only after the seed has run).
    run(`${bin("prisma")} generate`);
    run(`${bin("tsx")} prisma/seed.ts`);
    mkdirSync(join(root, ".next"), { recursive: true });
    writeFileSync(dbStampFile, dbCurrent);
  } else {
    console.log("Database is up to date — skipping migrations.");
  }

  const stampFile = join(root, ".next", "source-hash");
  const current = sourceHash();
  const built = existsSync(stampFile) ? readFileSync(stampFile, "utf8") : "";
  if (current !== built || !existsSync(join(root, ".next", "BUILD_ID"))) {
    run("npm run build");
    writeFileSync(stampFile, current);
  } else {
    console.log("Build is up to date — skipping next build.");
  }
}

const { default: next } = await import("next");
const app = next({ dev, hostname, port, dir: root });
const handle = app.getRequestHandler();

await app.prepare();

createServer((req, res) => {
  handle(req, res);
}).listen(port, hostname, () => {
  console.log(
    `▲ Debb's Kitchen ready on http://${hostname}:${port} (${dev ? "development" : "production"})`,
  );
});
