// Studio "web" service entry point. Studio runs `node server.mjs` on $PORT with the
// service env file loaded, so this file prepares everything a restart needs:
//
//   1. `prisma migrate deploy`   — apply pending migrations to DATABASE_URL
//   2. seed, only if the DB is empty (first deploy)
//   3. `next build`, only if the source changed since the last build
//   4. boot Next.js
//
// Local development: use `npm run dev` instead.
import { createServer } from "node:http";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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

  run("npx prisma migrate deploy");
  run("npx tsx prisma/seed.ts --if-empty");

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
