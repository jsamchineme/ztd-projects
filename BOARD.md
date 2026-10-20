# Board

Product: **ZTD Office** (ztdoffice.com) — email, calendar, meetings, nameservers.
Stack: **Stalwart** (mail server) · **Resend** for outgoing mail during the pilot, **Amazon SES** before rollout · **Bulwark** (webmail) · **Jitsi Meet** (meetings) · this app (**control panel**).
Owner: **Samuel** = needs your accounts/decisions · **Claude** = build/config work.
Environment: **pilot mail server is live** at mx1.ztdoffice.com (see `docs/vps-pilot.md`, DNS in `docs/dns.md`). The local Mac stack (`dev/`) is for experiments.

## To do

### 10. Monitoring, backups and recovery — next
Owner: Claude
- Nightly off-site backups of /opt/ztdmail (mail, accounts, settings, DKIM keys); test a restore
- Uptime monitoring and alerts (mail ports, certificate expiry, disk space)
- DMARC report monitoring (see task 20)

### 20. DMARC tracking and enforcement
Owner: Claude (setup, monitoring) + Samuel (approve each policy step)
- First: create postmaster@ztdoffice.com (alias to an existing mailbox) — DMARC (`rua`) and TLS-RPT reports are addressed there and currently bounce
- Collect and review the daily aggregate reports from Google, Microsoft, Yahoo (Stalwart parses incoming reports; or a DMARC monitoring tool)
- Check every legitimate sender passes SPF/DKIM alignment (Stalwart → Resend now; SES later; any website or app sending as ztdoffice.com)
- Tighten the policy step by step once reports are clean: p=none → p=quarantine (~2 weeks) → p=reject
- Then switch MTA-STS from testing to enforce (bump the `_mta-sts` id)
- Repeat per client domain during the pilot; the control panel should show each domain's DMARC status

### 8. Control panel (this app)
Owner: Claude · Depends on: 3, 5
- Plans (website + email included; list prices, can change): Lite £40/mo (3 inboxes, 5 aliases/groups, 5 GB) · Premium £70/mo (7 inboxes, 10 aliases/groups, 10 GB, meetings) · Business £125/mo (15 inboxes, 25 aliases/groups, 25 GB, 3 domains). Annual = 2 months free
- Add-ons: +1 inbox £5/mo · +10 GB £3/mo · meetings on Lite £10/mo · extra domain £5/mo
- Per-client custom price and limits (prices vary by client); panel enforces limits with an upgrade prompt
- CHOSEN DIRECTION: design E — faithful Resend dashboard (dark, studied from Samuel's own Resend account recording). /prototype/panel5.html. Dark canvas, workspace switcher, pill tabs, green icon tiles + status pills, white primary buttons, line-chart metrics, domain event timeline, ⌘K "Ask anything" bar; extra Resend pages (Domains, Activity, Settings). Build the real control panel on this.
- Earlier options (kept for reference): A /prototype/panel.html · B editorial /prototype/panel2.html · C light-monochrome /prototype/panel3.html · D Attio /prototype/panel4.html
- Switch mailbox management to Stalwart (JMAP admin API, as used for setup); keep Resend domain API for the pilot
- Clients → domains → mailboxes (create, suspend, reset password, quotas)
- Generate DNS records per client domain (from Stalwart's per-domain zone file) and check they're live
- Per-mailbox sending limits and volume alerts

### 9. Security and abuse protection
Owner: Claude
- Two-factor sign-in, strong password rules (admin: done — TOTP on admin@ztdoffice.com, password alone refused; automation uses an API key locked to the VPS)
- Spamhaus DQS registration for commercial use of the blocklists
- Sending limits per mailbox, alerts on spikes (Stalwart)
- Restrict the Stalwart admin console (https://mx1.ztdoffice.com/admin) to your own connections — home + work VPN — with a Stalwart access rule; everyone else gets refused. Keep the VPS-only API key working. (Admin stays at mx1: same Stalwart service, so a separate admin hostname would only be cosmetic.)

### 7. Online meetings (Jitsi)
Owner: Samuel (VPS) + Claude (setup) · Depends on: 6
- Separate VPS: ~4 cores / 8 GB, generous bandwidth
- Self-hosted Jitsi Meet with your branding
- Bulwark Jitsi plug-in so calendar events get meeting links
- Recording: later, only if clients ask

### 12. Migration process
Owner: Claude
- Import old mail from clients' current providers (IMAP import)
- Step-by-step switch-over checklist (DNS cutover without lost mail)

### 19. Managed DNS (your own nameservers)
Owner: Samuel (AWS account, registrar access) + Claude (setup, control panel)
- Amazon Route 53 with white-label nameservers ns1–ns4.ztdoffice.com (~$40/mo for 300 domains)
- Create the reusable delegation set; add glue records ("Personal DNS Server") at Namecheap
- Control panel creates each client's zone and records via the AWS API (website, MX, SPF, DKIM, DMARC)
- Client move process: copy existing records first, turn off DNSSEC at the old provider, then the client switches nameservers
- Don't host nameservers on the mail VPS

### 14. Legal and commercial
Owner: Samuel
- Terms: domain/account ownership, included support, SLA
- GDPR data processing agreement
- Decided 2026-10-19: Stalwart **Enterprise** licence (see task 21); AGPL obligations for Bulwark
- Add SIC code 63110 (data processing, hosting) at the next Companies House confirmation statement
- Search the UK IPO trade mark register for "ZTD" (classes 38 and 42); also "ZTD Office"; register the marks once the service is taking shape (~£170 for the first class)
- Show registered company name and number on the website, invoices and business emails
- Pay the ICO data protection fee (if not already); breach-response procedure
- Check insurance (professional indemnity/cyber) covers hosting client email
- Ask your adviser whether Ofcom customer-protection rules for email services apply

### 1. Branded Bulwark demo (optional)
Owner: Claude
- Bulwark Lite in demo mode at businessmail.ztddevs.com/webmail/
- Probably no longer needed: task 6 puts the real webmail live at mail.ztdoffice.com

### 16. Pilot
Owner: Samuel + Claude · Depends on: 5–10, 12, 14, 19
- Pilot with 10–20 willing clients for a few months

## Before rollout

### 11. Billing integration
Owner: Samuel (choose system) + Claude
- Pilot: invoice the 10–20 pilot clients manually
- Link mailbox creation/suspension to your billing system
- Pricing: base mailbox price; meetings as an add-on

### 13. Client setup guides
Owner: Claude (drafts) + Samuel (review) · Draft during the pilot from real client questions
- Outlook, iPhone/iPad, Android, Mac Mail, webmail, meetings
- Settings: IMAP mx1.ztdoffice.com:993 SSL; SMTP mx1.ztdoffice.com:587 STARTTLS; full email as username

### 15. Support desk
Owner: Samuel (choose tool) + Claude
- Pilot: handle support by email/phone
- Ticketing system for email support

### 17. Switch outgoing mail to Amazon SES
Owner: Samuel (account) + Claude (config) · Depends on: 16
- AWS account; SES production access (request early — see 3)
- Verify each client domain in SES (Easy DKIM) and create SMTP credentials
- Add SES DNS records alongside the Resend ones ahead of time, so cutover has no downtime
- Switch Stalwart's relay route from Resend to SES (then restart Stalwart)
- Control panel: create SES identity + tenant per client
- Tenants with automatic reputation policy, so one hacked account can't stop everyone's mail
- Cancel the Resend plan once all mail goes through SES

### 22. BIMI — show the ZTD Office logo in recipients' inboxes
Owner: Samuel (trade mark, certificate) + Claude (logo file, DNS) · Depends on: 14, 20
- Today Gmail/Outlook show a letter "S" next to mail from @ztdoffice.com; BIMI shows your logo instead (Gmail, Yahoo, Apple Mail)
- Requires DMARC at p=quarantine or p=reject first (task 20)
- Logo in the BIMI SVG format (SVG Tiny PS), hosted on HTTPS; BIMI DNS record `default._bimi.ztdoffice.com`
- Gmail and Apple: a paid VMC/CMC certificate (~£1,000+/yr); a VMC usually needs the logo as a registered trade mark (task 14). Yahoo accepts the DNS record alone
- Later: offer BIMI to clients as a premium add-on (per client domain)
- Done: ztddevs.com favicon shows for @ztddevs.com senders in the webmail (Bulwark cached a blank icon at first; restarting the bulwark container clears it)

### 18. Rollout
Owner: Samuel + Claude · Depends on: 11, 13, 15, 17
- Migrate the remaining clients in batches
- Keep Google Workspace / Microsoft 365 as a premium option

## In progress

### 21. Stalwart Enterprise licence and branding
Owner: Samuel (licence) + Claude (setup)
- Samuel: make sure the subscription continues after the trial so renewal on 2026-11-19 succeeds
- Remaining: multi-tenancy — one tenant per client with its own quotas and logo (foundation for the control panel, task 8)

### 6. Deploy Bulwark webmail (full edition)
Owner: Claude + Samuel (login test) · Depends on: 5
- Remaining: Samuel tests send/search/calendar in the webmail
- Later: per-client (per-domain) branding; enable plug-ins (needed for meetings, task 7)

### 3. Outgoing mail for the pilot (Resend)
Owner: Samuel (account) + Claude (config)
- Remaining: upgrade to Pro + extra domains (~$40/mo) before adding pilot clients (Free: 3 domains, 100 emails/day)
- Remaining: email Resend to confirm hosting client mailboxes is within their usage policy
- Remaining: verify each pilot client domain in Resend
- Remaining: request SES production access now so it's ready before rollout (see 17)

### 2. Brand and platform domain
Owner: Samuel
- Remaining: register ztdoffice.co.uk and ztdoffice.uk (to protect the name)

### 4. Local dev environment (Mac)
Owner: Claude · Lower priority now the VPS is live
- Remaining: finish Stalwart setup (can be done headlessly with `x:Bootstrap/set`, as on the VPS — needs a Mac session); add a test domain + mailboxes

## Done

### 5. Install and configure Stalwart
Owner: Claude · Completed 2026-10-19
- Done: ZTD Office logo on invitation/RSVP/reminder emails and the RSVP page (domain + default logo, PNG); admin console logo
- Done: Enterprise licence active for ztdoffice.com (25 mailboxes, trial to 2026-11-23, auto-renew via API key)
- Done: HTTPS certificate (Let's Encrypt, auto-renews) and admin console at https://mx1.ztdoffice.com/admin
- Done: outgoing mail relayed through Resend on 587 (not 465); receiving direct on 25
- Done: DNS for ztdoffice.com (MX, SPF, DKIM, DMARC, MTA-STS, TLS-RPT, SRV) — 24 records, `node scripts/check-dns.mjs`
- Done: 5 GB mailbox quotas; send/receive tested with Gmail (SPF, DKIM, DMARC pass; inbox)
- Done: Gmail RSVP loop retested — Maybe/No/Yes replies land in Inbox (score ~2) and update the organizer's calendar (attendee now accepted)
- Done: signed in on iPhone (inbox loads); iPhone Home Screen icon fixed to the ZTD logo
- Done: Bulwark admin dashboard at https://mail.ztdoffice.com/admin (password root-only on the VPS)
- Done: in use for mx1/mail.ztdoffice.com, auto-setup names, mailboxes
- Done: name **ZTD Office**; **ztdoffice.com** registered at Namecheap (2026-10-19, renews 2027-10-19)
- Done: docker-compose stack (Stalwart + Bulwark "ZTD Office", Studio logo); storage paths fixed for Stalwart 0.16
- Done: ztdoffice.com added and verified (sending only, EU region); restricted sending key on the VPS
- Done: businessmail.ztddevs.com removed to stay within the Free plan's 3 domains
- Done: nginx SNI router on 443 (webmail vs Stalwart passthrough), certbot certificate for mail.ztdoffice.com, real client IPs preserved
- Done: Bulwark full edition live at https://mail.ztdoffice.com, branded "ZTD Office" + Studio logo, connected to Stalwart
- Done: iPhone Gmail app over IMAP (993) + SMTP (587): logins and sending via Resend confirmed in server logs (2026-10-19)
- Optional: also try Outlook desktop before the pilot
- Done: spam filtering reviewed: defaults on (Junk at score 5); private Unbound resolver so Spamhaus blocklists work; verified with Spamhaus test domain (scored 8.8 → Junk)

### 4b. Mail server VPS (pilot)
Owner: Samuel (DNS) + Claude (setup) · Completed 2026-10-19 — details in `docs/vps-pilot.md`
- Hetzner ARM VPS in Helsinki (62.238.17.8), hardened (key-only SSH, firewall, fail2ban, auto-updates); SSH from the Mac and the Studio server
- Renamed to mx1.ztdoffice.com with matching reverse DNS; Docker + Stalwart 0.16 with data on /opt/ztdmail/{etc,data,logs}
- Setup completed; admin admin@ztdoffice.com (password rotated, root-only file on the VPS)
- Mailboxes hello@ and samuel@ztdoffice.com (5 GB each); IMAP 993, submission 587 (STARTTLS) and 465; no open relay
- Ports 25 inbound and outbound both work despite Hetzner's "blocked by default" warning (no unblock request needed so far)
- Leftovers moved to: webmail → task 6, backups → task 10, mail-app testing → task 5
