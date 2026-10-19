# Board

Stack: **Stalwart** (mail server) · **Resend** for outgoing mail during the pilot, **Amazon SES** before rollout · **Bulwark** (webmail) · **Jitsi Meet** (meetings) · this app (**control panel**).
Owner: **Samuel** = needs your accounts/decisions · **Claude** = build/config work.
Environment: **develop and test locally on the Mac** (Stalwart + Bulwark in Docker, outbound via Resend SMTP). Real inbound mail from the internet needs the VPS, which comes at pilot time.

## To do

### 1. Branded Bulwark demo (Stage 1)
Owner: Claude · Needs: product name + logo (placeholder OK)
- Bulwark Lite in demo mode at businessmail.ztddevs.com/webmail/
- Your name, logo and colours

### 2. Brand and platform domain
Owner: Samuel
- Choose product name
- Buy a dedicated platform domain (not ztddevs.com) for mail hostnames, e.g. mail.<platform-domain>

### 3. Outgoing mail for the pilot (Resend)
Owner: Samuel (account) + Claude (config)
- Upgrade Resend to Pro + 100 extra domains (~$40/mo) for 10–20 pilot clients
- Email Resend to confirm hosting client mailboxes is within their usage policy
- Verify each pilot client domain in Resend
- Request SES production access now so it's ready before rollout (see 17)

### 4. Local dev environment (Mac)
Owner: Claude · Needs: Docker Desktop running
- Stalwart + Bulwark via docker-compose in the repo (data volumes + secrets gitignored)
- Outbound through Resend SMTP relay; test internal + outbound-to-real-address send
- This is where tasks 5, 6, 8, 9 are built and tested before the VPS

### 4b. Mail server VPS (pilot)
Owner: Samuel (order) + Claude (setup) · When: pilot time
- Ubuntu 24.04, 2 vCPU / 4 GB+ RAM, root access, UK/EU location
- Ports 25, 443, 465, 587, 993 open; reverse DNS set to mail hostname
- Off-site backup storage
- Deploy the same compose stack from local dev; enables real inbound mail

### 5. Install and configure Stalwart
Owner: Claude · Depends on: 3, 4
- HTTPS certificate, admin console
- Route outgoing mail through Resend's SMTP relay (smtp.resend.com:465)
- DNS per domain: MX, SPF, DKIM, DMARC
- Spam filtering, mailbox quotas
- Test send/receive with Gmail; connect Outlook and phones

### 6. Deploy Bulwark (full edition)
Owner: Claude · Depends on: 5
- Docker on the mail VPS, connected to Stalwart
- Branding, including per-client (per-domain) branding
- Enable plug-ins (needed for meetings)

### 7. Online meetings (Jitsi)
Owner: Samuel (VPS) + Claude (setup) · Depends on: 6
- Separate VPS: ~4 cores / 8 GB, generous bandwidth
- Self-hosted Jitsi Meet with your branding
- Bulwark Jitsi plug-in so calendar events get meeting links
- Recording: later, only if clients ask

### 8. Control panel (this app)
Owner: Claude · Depends on: 3, 5
- Switch mailbox management to Stalwart (JMAP); keep Resend domain API for the pilot
- Clients → domains → mailboxes (create, suspend, reset password, quotas)
- Generate DNS records per client domain and check they're live
- Per-mailbox sending limits and volume alerts

### 9. Security and abuse protection
Owner: Claude
- Two-factor sign-in, strong password rules
- Sending limits per mailbox, alerts on spikes (Stalwart)

### 10. Monitoring, backups and recovery
Owner: Claude
- Uptime monitoring and alerts
- Nightly off-site backups; test a restore
- DMARC report monitoring

### 12. Migration process
Owner: Claude
- Import old mail from clients' current providers (IMAP import)
- Step-by-step switch-over checklist (DNS cutover without lost mail)

### 14. Legal and commercial
Owner: Samuel
- Terms: domain/account ownership, included support, SLA
- GDPR data processing agreement
- Confirm Stalwart free-edition use with Stalwart Labs; AGPL obligations for Stalwart/Bulwark

### 19. Managed DNS (your own nameservers)
Owner: Samuel (AWS account, registrar access) + Claude (setup, control panel)
- Amazon Route 53 with white-label nameservers ns1–ns4.ztddevs.com (~$40/mo for 300 domains)
- Create the reusable delegation set; add glue records at the ztddevs.com registrar
- Control panel creates each client's zone and records via the AWS API (website, MX, SPF, DKIM, DMARC)
- Client move process: copy existing records first, turn off DNSSEC at the old provider, then the client switches nameservers
- Don't host nameservers on the mail VPS

### 16. Pilot
Owner: Samuel + Claude · Depends on: 5–10, 12, 14, 19
- Pilot with 10–20 willing clients for a few months

### 17. Switch outgoing mail to Amazon SES
- AWS account; SES production access (requested in 3)

## Before rollout

### 11. Billing integration
Owner: Samuel (choose system) + Claude
- Pilot: invoice the 10–20 pilot clients manually
- Link mailbox creation/suspension to your billing system
- Pricing: base mailbox price; meetings as an add-on

### 13. Client setup guides
Owner: Claude (drafts) + Samuel (review) · Draft during the pilot from real client questions
- Outlook, iPhone/iPad, Android, Mac Mail, webmail, meetings

### 15. Support desk
Owner: Samuel (choose tool) + Claude
- Pilot: handle support by email/phone
- Ticketing system for email support

### 17. Switch outgoing mail to Amazon SES
Owner: Samuel (account) + Claude (config) · Depends on: 16
- Add SES DNS records alongside the Resend ones ahead of time, so cutover has no downtime
- Switch Stalwart's relay from Resend to SES
- Control panel: create SES identity + tenant per client
- Tenants with automatic reputation policy, so one hacked account can't stop everyone's mail
- Cancel the Resend plan once all mail goes through SES
- Verify each client domain in SES (Easy DKIM) and create SMTP credentials

### 18. Rollout
Owner: Samuel + Claude · Depends on: 11, 13, 15, 17
- Migrate the remaining clients in batches
- Keep Google Workspace / Microsoft 365 as a premium option

## In progress

### 4. Local dev environment (Mac)
Owner: Claude · Needs: Samuel to run Stalwart's 2-min first-time setup
- Done: docker-compose stack (Stalwart + Bulwark "ZTD Mail", Studio logo), both containers running
- Remaining: complete Stalwart initial setup in browser, add test domain + mailboxes (see dev/README.md)

## Done
