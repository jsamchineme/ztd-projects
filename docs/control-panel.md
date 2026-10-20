# Control panel

**https://businessmail.ztddevs.com/panel/** — Design E (Resend-style), served by this app.
The old webmail pages at `/` are untouched.

## Who signs in

| Login | Sees |
|---|---|
| **ZTD staff** | Every client, plans and prices, domains, activity, licence, staff logins |
| **Client admin** | Only their own account: inboxes, groups & aliases, domain records, plan |

There is no self-sign-up. Logins are created by invite link (one use, valid 7 days):

- Staff invite another staff member: Settings → ZTD staff → Invite.
- Creating a client with a contact email makes their admin login and shows the link to send.
- "New link" next to any login makes a fresh link (also used for forgotten passwords).
- From the server: `node scripts/panel-invite.mjs staff <email> "<name>"`, or
  `node scripts/panel-invite.mjs again <email>` for a new link.

## Where things live

| | |
|---|---|
| Clients, plan, custom price, extras, panel logins, requests, activity, DNS results | SQLite `data/mail.db`, tables `panel_*` (`src/panel/store.mjs`) |
| Inboxes, aliases, groups, domains | On the mail server (Stalwart), read and written live (`src/stalwart.mjs`) |
| List prices and plan limits | `src/panel/plans.mjs` |

A client owns the mail-server domains assigned to it; everything on those domains counts
against its plan. The first time the panel loads it creates the internal **ZTD Office**
client and gives it `ztdoffice.com`.

| Panel term | Mail server object |
|---|---|
| Inbox | `x:Account` of type User (mailbox; uses a licence seat) |
| Alias | an entry in that account's `aliases` |
| Group | `x:MailingList` with `recipients` (no mailbox, free) |
| Shared inbox | `x:Account` of type Group (has a mailbox, uses a seat) — shown, not yet created from the panel |
| Suspend | every password credential gets `expiresAt` = 2000-01-01 (sign-in refused, mail still delivered) |

Deleting an inbox deletes its mail **immediately**; the panel asks the user to type the address
and removes it from the client's groups first.

## Connection to the mail server

The Stalwart admin API key only works from the mail server itself, so the panel runs `curl`
there over SSH (`~/.ssh/ztdoffice-vps-studio`, multiplexed so calls take ~0.1 s). The key
never leaves the VPS. Settings, all optional:

| Env | Default |
|---|---|
| `STALWART_MODE` | `ssh` if the key file exists, `fake` if `TEST_MODE=1` or nothing is set up |
| `STALWART_SSH` / `STALWART_SSH_KEY` | `root@62.238.17.8` / `~/.ssh/ztdoffice-vps-studio` |
| `STALWART_URL` + `STALWART_API_KEY` | direct HTTPS instead of SSH (mode `http`) |
| `LICENCE_SEATS` / `LICENCE_RENEWS` | `25` / `2026-11-19` |

Settings → Subscriptions shows which mode is in use. Tests run against the in-memory fake.

## Limits and requests

- Inboxes and groups & aliases are capped by plan + extras; the panel refuses past the limit and
  offers the client an upgrade or an extra. The client's choice becomes a **request** that staff
  see in Needs attention; staff change the plan on the client page and press "Mark done".
- New inboxes are refused when the licence (25 mailboxes) is full.

## DNS

Each client domain is checked against: MX → `mx1.ztdoffice.com`, SPF (`mx include:amazonses.com`),
the domain's own DKIM keys (read from Stalwart's zone), DMARC, and the Resend records
(`resend._domainkey`, `send` MX and SPF). Auto-setup CNAMEs are optional. Checks run when a
domain has never been checked, hourly in the background, and on "Check now".

New client domains are created in Stalwart without a certificate (they use `mx1.ztdoffice.com`
for everything). They still have to be **added in Resend by hand** (Resend → Domains) so outgoing
mail is accepted; the Resend DKIM value is unique per domain.
