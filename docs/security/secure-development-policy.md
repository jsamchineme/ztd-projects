# Secure development policy

ISO/IEC 27001:2022 Annex A 8.25 (secure development life cycle), 8.26 (application security
requirements), 8.28 (secure coding), 8.4 (access to source code), 8.33 (test information).
Owner: Samuel. Applies to everyone who writes code for ZTD Office, including AI assistants.
Review every 12 months.

## Requirements before building

Each feature that handles client data or credentials states in its task or PR:

- who can use it (ZTD staff, client admin, public) and how that is enforced on the **server**;
- what data it stores or sends, and where;
- what is logged in the activity log.

## Coding rules

1. **Access control on the server.** Every API route checks the signed-in user and their client
   before acting. The browser hides nothing that the server allows.
2. **Validate all input** on the server (addresses, domains, numbers, lengths). Use parameterised
   database queries only, never string-built SQL.
3. **No secrets in code**, tests, logs, error messages, URLs or commits. Secrets live in
   environment variables (Vercel/Neon) or root-only files on the VPS.
4. **Passwords**: hashed with a slow, salted function (scrypt/argon2); minimum 10 characters;
   generated passwords shown once only. Login attempts are rate-limited.
5. **Sessions**: random tokens stored hashed; `HttpOnly`, `Secure`, `SameSite` cookies; expire.
   State-changing requests are protected against CSRF.
6. **Escape output** in the browser to prevent XSS; don't insert untrusted HTML.
7. **Least privilege** for integrations: the mail-server API key is limited to the objects the
   panel manages; Resend/SES keys are sending-only and per domain where possible.
8. **Destructive actions** (delete inbox, suspend client) ask for confirmation and are recorded in
   the activity log with who did them.
9. **Dependencies**: add only well-maintained packages, pin versions with a lockfile, and keep
   Dependabot alerts at zero high/critical.
10. **Errors** shown to users are plain and contain no stack traces or internal details.

## Testing

- Automated tests cover access control (who can see and change what), plan limits and every
  route that changes data. They run on every PR in CI and must pass before merge.
- Tests never use production data or the live mail server; they use the in-memory fake.
- Secret scanning runs on every PR.

## Review checklist (in every PR)

The pull request template asks the author and reviewer to confirm access control, input
validation, no secrets, logging of sensitive actions, tests, and a rollback plan.

## Access to source code

- The GitHub repository is private.
- Write access: Samuel (organisation owner) and the `ztd-devs-studio` GitHub App used by Claude
  (push branches and open PRs only; cannot approve or merge to `main`).
- Access is reviewed every 6 months and removed the same day someone leaves.
