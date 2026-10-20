// Database handle. Production: Postgres (Neon or any) via DATABASE_URL. Dev/test: in-process
// PGlite (file-backed under .pglite, or in-memory when PANEL_DB=memory / NODE_ENV=test).
// Schema is created with idempotent CREATE TABLE IF NOT EXISTS so no migration step is needed yet.
import * as schema from './schema';

type Drizzle = import('drizzle-orm/node-postgres').NodePgDatabase<typeof schema>
  | import('drizzle-orm/pglite').PgliteDatabase<typeof schema>;

const DDL = `
CREATE TABLE IF NOT EXISTS panel_clients (
  id text PRIMARY KEY, name text NOT NULL, contact_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '', plan text NOT NULL DEFAULT 'lite', custom_price integer,
  extra_inboxes integer NOT NULL DEFAULT 0, extra_aliases integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active', suspended_ids jsonb, internal boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS panel_client_domains (
  domain text PRIMARY KEY, client_id text NOT NULL REFERENCES panel_clients(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS panel_users (
  id text PRIMARY KEY, email text NOT NULL UNIQUE, name text NOT NULL, role text NOT NULL,
  client_id text REFERENCES panel_clients(id) ON DELETE CASCADE, password_hash text,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE TABLE IF NOT EXISTS panel_sessions (
  token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES panel_users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, user_agent text
);
CREATE TABLE IF NOT EXISTS panel_invites (
  token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES panel_users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, used_at timestamptz
);
CREATE TABLE IF NOT EXISTS panel_requests (
  id text PRIMARY KEY, client_id text NOT NULL REFERENCES panel_clients(id) ON DELETE CASCADE,
  kind text NOT NULL, detail text NOT NULL, created_by text,
  created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);
CREATE TABLE IF NOT EXISTS panel_activity (
  id text PRIMARY KEY, client_id text, actor text NOT NULL, action text NOT NULL,
  detail text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS panel_activity_at ON panel_activity(created_at);
CREATE TABLE IF NOT EXISTS panel_dns (
  domain text PRIMARY KEY, checked_at timestamptz NOT NULL DEFAULT now(), results jsonb NOT NULL
);
`;

let ready: Promise<Drizzle> | null = null;

async function build(): Promise<Drizzle> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: url, max: 5 });
    await pool.query(DDL);
    return drizzle(pool, { schema });
  }
  const { drizzle } = await import('drizzle-orm/pglite');
  const { PGlite } = await import('@electric-sql/pglite');
  const memory = process.env.PANEL_DB === 'memory' || process.env.NODE_ENV === 'test';
  const client = new PGlite(memory ? undefined : process.env.PGLITE_DIR || '.pglite');
  await client.waitReady;
  await client.exec(DDL);
  return drizzle(client, { schema });
}

export function getDb(): Promise<Drizzle> {
  ready ??= build();
  return ready;
}

export { schema };
