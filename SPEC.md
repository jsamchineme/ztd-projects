# Businessmail — MVP build spec (single source of truth)

A Google-Workspace-style webmail app. Customers bring their own domains; the platform
domain for dev/test is `businessmail.ztddevs.com`. Mail is sent/received via **Resend**
(inbound through a signed webhook; outbound through the Resend API).

## Hard constraints (do not violate)
- **Zero external dependencies.** Node 22 only. Use `node:http`, `node:sqlite`, `node:crypto`,
  global `fetch`, `node:fs`. Do NOT add anything to package.json dependencies. No npm installs.
  (Reason: `node_modules` is NOT copied to the production server; only committed source runs there.)
- **ES modules** everywhere (`.mjs` on server, `type="module"` scripts in browser).
- All config comes from `process.env` via `src/config.mjs`. Never hard-code secrets or the domain.
- Everything must run with just `node server.mjs`.
- **File ownership is strict.** Only create/modify the files your task assigns you. Do not edit
  foundation files (listed below) or another agent's files. If you need a change in a file you
  don't own, assume its documented contract instead.

## Foundation files (ALREADY WRITTEN — read, import, do NOT modify)
- `src/config.mjs` — exports `config` (env + constants) and `TEST_MODE`.
- `src/util.mjs` — ids, time, json helpers, html→text snippet, escapeHtml.
- `src/db.mjs` — exports `db` (open DatabaseSync) and runs migrations on import. Schema below.
- `src/router.mjs` — tiny router. `createRouter()`, `ctx` request helpers. Contract below.
- `src/resend.mjs` — Resend client + fake (TEST_MODE). Contract below.
- `src/store.mjs` — data access for mail (threads/messages/labels/drafts/attachments/search). Contract below.
- `src/accounts.mjs` — data access for identity (orgs/users/sessions/domains/aliases/settings). Contract below.
- `server.mjs` — boots db, serves `public/`, mounts route modules, starts http server.
- `public/globals.css` — shadcn design tokens + components. Reuse these classes; add minimal CSS only.
- `public/index.html` — app shell; loads `js/app.js` as module.
- `public/js/api.js` — fetch wrapper. `api.get/post/patch/del(path, body)` → JSON, throws on !ok.
- `public/js/app.js` — bootstrap/router; mounts views into `#view`. Views register via `registerView`.

## Server context object (`ctx`) passed to every route handler
```
ctx.req, ctx.res            // node req/res
ctx.params                  // path params {id}
ctx.query                   // URLSearchParams-derived object
ctx.body                    // parsed JSON body (object) or {}
ctx.user                    // current user row or null (from session cookie)
ctx.session                 // session row or null
ctx.json(status, obj)       // send JSON
ctx.text(status, str)
ctx.setCookie(name, val, opts)
ctx.clearCookie(name)
ctx.requireAuth()           // throws {status:401} if no ctx.user; returns ctx.user
ctx.requireAdmin()          // throws {status:403} if not admin
```
Route modules export `export function register(router, deps)` where
`deps = { config, db, store, accounts, resend, util }`.
Register routes with `router.get(path, handler)`, `.post`, `.patch`, `.del`.
Path params use `:name` → `ctx.params.name`. Handlers are `async (ctx) => {}`.
Throwing an object `{status, message}` becomes that HTTP response. Uncaught errors → 500.

## Database schema (created by db.mjs — reference only)
Tables: orgs, users, sessions, domains, aliases, threads, messages, labels, thread_labels,
attachments, drafts, filters, settings, webhook_events, audit_log, and FTS table messages_fts.
Key columns (see db.mjs for the authoritative DDL):
- users(id, org_id, email, name, password_hash, role['admin'|'member'], status['active'|'suspended'],
  totp_secret, signature, created_at)
- sessions(id, user_id, created_at, expires_at, user_agent)
- domains(id, org_id, domain, resend_domain_id, status, records_json, receiving, created_at)
- aliases(id, address, user_id, created_at)
- threads(id, user_id, subject, snippet, last_at, unread, starred, created_at)
- messages(id, user_id, thread_id, resend_id, direction['in'|'out'], message_id, in_reply_to,
  references_ids, from_name, from_addr, to_json, cc_json, bcc_json, subject, text_body, html_body,
  snippet, headers_json, has_attachments, unread, created_at, sort_at)
- labels(id, user_id, name, color, system, created_at)  // system ∈ inbox,sent,drafts,trash,spam,archive or NULL
- thread_labels(thread_id, label_id)
- attachments(id, message_id, filename, content_type, size, content_id, disposition,
  resend_attachment_id, storage_path, created_at)
- drafts(id, user_id, thread_id, to_json, cc_json, bcc_json, subject, text_body, html_body,
  in_reply_to, updated_at, created_at)
- settings(user_id, key, value)
- webhook_events(id, type, received_at, payload, status)
- audit_log(id, actor_id, action, detail, created_at)

## store.mjs contract (mail data access — foundation, already implemented)
All functions synchronous (node:sqlite is sync) unless noted.
- `ensureSystemLabels(userId)` — creates inbox/sent/drafts/trash/spam/archive if missing.
- `listThreads(userId, {label, q, starred, unread, limit, offset})` → [threadSummary]
  threadSummary: {id, subject, snippet, last_at, unread, starred, from, labels:[{name,color,system}], has_attachments}
- `getThread(userId, threadId)` → {thread, messages:[messageFull]} or null. messageFull includes attachments.
- `insertIncomingMessage(userId, parsed)` → {messageId, threadId}. parsed fields documented in inbound task.
  Handles threading (In-Reply-To/References→existing thread else new), labels inbox+unread, FTS.
- `insertOutgoingMessage(userId, msg)` → {messageId, threadId}. Labels 'sent'; thread not unread.
- `setThreadLabels(userId, threadId, {add:[name], remove:[name]})`
- `starThread(userId, threadId, bool)` / `markThreadRead(userId, threadId, bool)`
- `trashThread(userId, threadId)` / `archiveThread(userId, threadId)` / `spamThread(userId, threadId)`
- `listLabels(userId)` / `createLabel(userId,{name,color})` / `deleteLabel(userId, id)`
- `search(userId, query, {limit})` → [threadSummary] (uses messages_fts + operators from:,to:,subject:,has:attachment)
- Drafts: `listDrafts(userId)`, `getDraft(userId,id)`, `saveDraft(userId, draft)`→id (upsert), `deleteDraft(userId,id)`
- Attachments: `getAttachment(userId, attId)` → attachment row (for download proxy)
- `countsByLabel(userId)` → {inbox: {unread, total}, ...} for sidebar badges

## accounts.mjs contract (identity data access — foundation, already implemented)
- `getOrgCount()`, `createOrg(name)`→orgId
- `getUserByEmail(email)`, `getUserById(id)`, `listUsers(orgId)`
- `createUser({orgId,email,name,passwordHash,role})`→userId
- `setUserStatus(id, status)`, `setUserPassword(id, hash)`, `updateUser(id, fields)`
- `findUserForAddress(address)` → user row (checks users.email and aliases) — used by inbound
- Sessions: `createSession(userId, ua, ttlDays)`→token, `getSession(token)`→{session,user}, `deleteSession(token)`, `purgeExpired()`
- Domains: `listDomains(orgId)`, `createDomain(orgId,{domain,resend_domain_id,records,status})`→id,
  `updateDomain(id, fields)`, `getDomain(id)`
- Aliases: `listAliases(orgId)`, `createAlias(address,userId)`, `deleteAlias(id)`
- Settings: `getSettings(userId)`→obj, `setSetting(userId,key,value)`
- `audit(actorId, action, detail)`

## resend.mjs contract (foundation, already implemented)
TEST_MODE (no RESEND_API_KEY) uses an in-memory fake so everything works offline/in tests.
- `sendEmail({from,to,cc,bcc,subject,html,text,headers,reply_to,attachments})` → {id}
- `getReceivedEmail(id)` → full email (html, text, headers, attachments, authentication, from, to, subject, message_id...)
- `listAttachments(emailId)` → [{id, filename, content_type, download_url, expires_at, size}]
- `createDomain(name,{receiving})` → {id, status, records:[...]}
- `getDomain(id)` / `verifyDomain(id)` / `listDomains()`
- `verifyWebhookSignature(secret, {svixId,svixTimestamp,svixSignature}, rawBody)` → bool (Svix HMAC-SHA256)
- Fake inbound helper (TEST_MODE only): `__fakeReceive(email)` stores an email so getReceivedEmail works.

## HTTP API (routes to BUILD)
Auth (feature/auth):
- `GET  /api/auth/state` → {needsSetup:bool, authed:bool, user?}
- `POST /api/auth/setup` {orgName,name,email,password} → creates first org+admin (only if no users). Logs in.
- `POST /api/auth/login` {email,password,totp?} → sets session cookie; {user} or {need2fa:true}
- `POST /api/auth/logout`
- `GET  /api/auth/me` → {user}
- (2FA optional) `POST /api/auth/2fa/enable`, `/verify`, `/disable`
Mail (feature/mail):
- `GET  /api/threads?label=inbox&q=&starred=&limit=&offset=` → {threads, counts}
- `GET  /api/threads/:id` → {thread, messages}
- `POST /api/threads/:id/read` {read:bool}
- `POST /api/threads/:id/star` {starred:bool}
- `POST /api/threads/:id/archive` | `/trash` | `/spam`
- `POST /api/threads/:id/labels` {add:[],remove:[]}
- `GET  /api/labels` / `POST /api/labels` {name,color} / `DELETE /api/labels/:id`
- `POST /api/send` {to,cc,bcc,subject,html,text,inReplyTo?,threadId?,draftId?} → sends via resend, stores sent
- `GET  /api/drafts` / `GET /api/drafts/:id` / `POST /api/drafts` (upsert) / `DELETE /api/drafts/:id`
- `GET  /api/search?q=` → {threads}
- `GET  /api/attachments/:id` → proxies download (stream bytes) with auth check
Inbound (feature/inbound):
- `POST /api/webhooks/resend` — verify Svix signature (raw body!), idempotent via webhook_events,
  on `email.received`: fetch full content, map `received_for`/`to` → user via accounts.findUserForAddress,
  store via store.insertIncomingMessage, apply filters. Return 200 fast. On bounce/complaint: log.
Admin (feature/admin, requireAdmin):
- `GET/POST /api/admin/users`, `PATCH /api/admin/users/:id` (role/status/password), `GET /api/admin/users/:id`
- `GET/POST /api/admin/domains`, `POST /api/admin/domains/:id/verify`
- `GET/POST /api/admin/aliases`, `DELETE /api/admin/aliases/:id`
Settings (feature/settings):
- `GET/PATCH /api/settings` (profile name, signature, prefs, blockRemoteImages)
- Filters: `GET/POST /api/settings/filters`, `DELETE /api/settings/filters/:id` (optional/stretch)

## Frontend (views to BUILD) — vanilla ES modules, no framework
`public/js/app.js` (foundation) provides:
- `registerView(name, mountFn)` and hash routing: `#/inbox`, `#/label/:id`, `#/thread/:id`,
  `#/search?q=`, `#/settings`, `#/admin`, `#/compose`. It calls `mountFn(root, params)`.
- `app.state` (current user, labels, counts), `app.refreshSidebar()`, `app.navigate(hash)`.
- `toast(msg)`, `confirmDialog(msg)`, `openCompose(prefill)` globals from `js/ui.js` (foundation-light; auth view may define login screen separately).
Views to build (each its own file, import `api` from './api.js'):
- `js/views/auth.js` — login + first-run setup screens (mounted when not authed).
- `js/views/mailbox.js` — sidebar nav (uses app.state), thread list, reading pane, safe HTML render
  (render incoming html in a sandboxed `<iframe srcdoc>` with CSP blocking remote images unless user clicks "Show images"), star/read/archive/trash/label actions, search box.
- `js/views/compose.js` — compose/reply/forward window; autosave drafts; send.
- `js/views/settings.js` — profile, signature, preferences.
- `js/views/admin.js` — users table (create/suspend/role), domains (add → show DNS records → verify), aliases.

## Security requirements
- Passwords: scrypt via util.hashPassword/verifyPassword (salt per user). No plaintext.
- Session cookie: httpOnly, SameSite=Lax, Secure, random 256-bit token; 30-day expiry.
- CSRF: require header `X-Requested-With: fetch` on all mutating API calls (api.js sets it; router rejects mutating requests without it). Same-origin only.
- Webhook: verify Svix signature over the RAW body before parsing. Idempotent by svix-id.
- Incoming HTML: never inject into the DOM directly. Use sandboxed iframe (no allow-scripts),
  block remote content via CSP, strip on click-to-load.
- Attachment download proxy must check the attachment belongs to the current user.
- Admin routes require admin role.

## Tests (test/*.test.mjs, node:test, run with `node --test`)
Use TEST_MODE (unset RESEND_API_KEY). Cover: setup+login+session, send (fake), inbound webhook
(signed, via resend.__fakeReceive + a correctly Svix-signed request), threading, labels, search,
drafts, admin user create, auth guards, attachment ownership check. Add a seed/helper in test/helpers.mjs.

## Run / verify
- `node server.mjs` (PORT env, default 4404). First load → setup screen.
- `node --test` → all green.
- Production restart (server side, tell the user): `sudo studio-ctl svc businessmail web restart`.
