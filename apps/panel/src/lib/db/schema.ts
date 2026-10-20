// Control panel database (Postgres via Drizzle). Holds the commercial side only: clients with
// plan and price, panel logins, sessions, invites, upgrade requests, activity and cached DNS
// checks. Mailboxes, aliases and groups themselves live on the mail server (lib/stalwart.ts).
import { pgTable, text, integer, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

export const clients = pgTable('panel_clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contactName: text('contact_name').notNull().default(''),
  contactEmail: text('contact_email').notNull().default(''),
  plan: text('plan').notNull().default('lite'),
  customPrice: integer('custom_price'), // pence; null = list price
  extraInboxes: integer('extra_inboxes').notNull().default(0),
  extraAliases: integer('extra_aliases').notNull().default(0),
  status: text('status').notNull().default('active'), // active | suspended
  suspendedIds: jsonb('suspended_ids').$type<string[]>(),
  internal: boolean('internal').notNull().default(false),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const clientDomains = pgTable('panel_client_domains', {
  domain: text('domain').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable('panel_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(), // staff | client
  clientId: text('client_id').references(() => clients.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

export const sessions = pgTable('panel_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  userAgent: text('user_agent'),
});

export const invites = pgTable('panel_invites', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
});

export const requests = pgTable('panel_requests', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  detail: text('detail').notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

export const activity = pgTable('panel_activity', {
  id: text('id').primaryKey(),
  clientId: text('client_id'),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  detail: text('detail').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('panel_activity_at').on(t.createdAt)]);

export const dnsChecks = pgTable('panel_dns', {
  domain: text('domain').primaryKey(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).notNull().defaultNow(),
  results: jsonb('results').notNull(),
});

export type ClientRow = typeof clients.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type RequestRow = typeof requests.$inferSelect;
export type ActivityRow = typeof activity.$inferSelect;
