import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from './config.mjs';

mkdirSync(dirname(config.dbPath), { recursive: true });
mkdirSync(config.attachmentsDir, { recursive: true });

export const db = new DatabaseSync(config.dbPath);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS orgs (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  totp_secret TEXT,
  signature TEXT DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  user_agent TEXT
);
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  domain TEXT NOT NULL UNIQUE,
  resend_domain_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  records_json TEXT,
  receiving INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS aliases (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  subject TEXT,
  snippet TEXT,
  last_at TEXT NOT NULL,
  unread INTEGER NOT NULL DEFAULT 0,
  starred INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  thread_id TEXT NOT NULL REFERENCES threads(id),
  resend_id TEXT,
  direction TEXT NOT NULL,
  message_id TEXT,
  in_reply_to TEXT,
  references_ids TEXT,
  from_name TEXT,
  from_addr TEXT,
  to_json TEXT,
  cc_json TEXT,
  bcc_json TEXT,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  snippet TEXT,
  headers_json TEXT,
  has_attachments INTEGER NOT NULL DEFAULT 0,
  unread INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  sort_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS labels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  color TEXT,
  system TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS thread_labels (
  thread_id TEXT NOT NULL REFERENCES threads(id),
  label_id TEXT NOT NULL REFERENCES labels(id),
  PRIMARY KEY (thread_id, label_id)
);
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL REFERENCES messages(id),
  filename TEXT,
  content_type TEXT,
  size INTEGER,
  content_id TEXT,
  disposition TEXT,
  resend_attachment_id TEXT,
  storage_path TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  thread_id TEXT,
  to_json TEXT, cc_json TEXT, bcc_json TEXT,
  subject TEXT, text_body TEXT, html_body TEXT,
  in_reply_to TEXT,
  updated_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS filters (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  match_json TEXT,
  action_json TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  user_id TEXT NOT NULL REFERENCES users(id),
  key TEXT NOT NULL,
  value TEXT,
  PRIMARY KEY (user_id, key)
);
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT,
  received_at TEXT,
  payload TEXT,
  status TEXT
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  action TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_msgid ON messages(message_id);
CREATE INDEX IF NOT EXISTS idx_threads_user_last ON threads(user_id, last_at);
CREATE INDEX IF NOT EXISTS idx_thread_labels_label ON thread_labels(label_id);

CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  message_id UNINDEXED, thread_id UNINDEXED, user_id UNINDEXED,
  subject, from_text, to_text, body
);
`);
