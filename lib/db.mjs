// One SQLite file holds Better Auth's tables and Studio's own.
import Database from 'better-sqlite3';
import { join } from 'node:path';
import { DATA_DIR } from './config.mjs';

export const db = new Database(join(DATA_DIR, 'studio.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

db.exec(`
CREATE TABLE IF NOT EXISTS project (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,            -- folder name under /srv/projects
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  organizationId TEXT NOT NULL,         -- the team that owns it
  workerClaudeUserId TEXT,              -- whose Claude connection the project's own AI workers use
  createdBy TEXT,
  createdAt INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready', -- creating | ready | error
  statusDetail TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS service (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                   -- short id, e.g. "board"
  label TEXT NOT NULL DEFAULT '',
  command TEXT NOT NULL,                -- run with bash in the repo; $PORT is set
  port INTEGER UNIQUE NOT NULL,
  subdomain TEXT UNIQUE,                -- <subdomain>.<DOMAIN>, or null for internal-only
  env TEXT NOT NULL DEFAULT '',         -- encrypted KEY=value lines
  memoryMB INTEGER NOT NULL DEFAULT 1200,
  autostart INTEGER NOT NULL DEFAULT 1,
  publicAccess INTEGER NOT NULL DEFAULT 0, -- 1 = no Studio login needed (for client previews)
  certStatus TEXT NOT NULL DEFAULT 'none',
  UNIQUE(projectId, name)
);
CREATE TABLE IF NOT EXISTS chat (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  userId TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'New chat',
  claudeSessionId TEXT,                 -- for --resume
  model TEXT NOT NULL DEFAULT 'opus',
  mode TEXT NOT NULL DEFAULT 'edit',    -- edit | plan
  costUsd REAL NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS chat_project ON chat(projectId, updatedAt);
CREATE TABLE IF NOT EXISTS chat_event (
  chatId TEXT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (chatId, seq)
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  userId TEXT,
  action TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  ip TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS audit_at ON audit(at);
CREATE TABLE IF NOT EXISTS gate_token (
  token TEXT PRIMARY KEY,               -- one-time hand-off from Studio to a project subdomain
  sessionToken TEXT NOT NULL,
  host TEXT NOT NULL,
  next TEXT NOT NULL,
  expiresAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS setting (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS upload (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,                   -- image | pdf | notebook | text | file
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,                   -- UPLOADS_DIR/<slug>/<id>/<name>
  createdAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS email_change (
  token TEXT PRIMARY KEY,               -- sha256 of the token in the link sent to the new address
  userId TEXT NOT NULL,
  email TEXT NOT NULL,                  -- the new address
  expiresAt INTEGER NOT NULL
);
`);

// Columns added after a table was first created.
const addColumn = (table, col, def) => { if (!db.prepare(`PRAGMA table_info(${table})`).all().some(c => c.name === col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`); };
addColumn('chat', 'archivedAt', 'INTEGER');   // set = hidden from the chat list, under "Archived"
addColumn('chat', 'runUserId', 'TEXT');        // set while Claude runs in it: who sent the prompt (picked up after a restart, lib/agent.mjs)
addColumn('chat', 'autoResumes', 'INTEGER NOT NULL DEFAULT 0');   // times picked up after restarts since the last prompt
// Chats on people's own computers (lib/runner.mjs)
addColumn('chat', 'runOn', "TEXT NOT NULL DEFAULT 'auto'");   // auto | computer | server: where its owner's turns run
addColumn('chat', 'lastRanOn', 'TEXT');        // 'server' or a runner id: where its newest Claude session is
addColumn('chat', 'runnerId', 'TEXT');         // set while a turn runs on a computer: which one,
addColumn('chat', 'runnerJob', 'TEXT');        // that turn,
addColumn('chat', 'runnerLine', 'INTEGER');    // and the last of its output lines Studio has
addColumn('project', 'dailyBudgetUsd', 'REAL');   // most its chats and AI workers may spend on Claude in a day (lib/budget.mjs)
addColumn('project', 'usageToken', 'TEXT');      // in its services' ANTHROPIC_BASE_URL, so Studio can count what its workers spend

export const now = () => Date.now();

export function audit(userId, action, target = '', detail = '', ip = ''){
  db.prepare('INSERT INTO audit (at, userId, action, target, detail, ip) VALUES (?,?,?,?,?,?)')
    .run(now(), userId || null, action, String(target), typeof detail === 'string' ? detail : JSON.stringify(detail), ip || '');
}

export function getSetting(key, fallback = null){
  const r = db.prepare('SELECT value FROM setting WHERE key = ?').get(key);
  return r ? JSON.parse(r.value) : fallback;
}
export function setSetting(key, value){
  db.prepare('INSERT INTO setting (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, JSON.stringify(value));
}
