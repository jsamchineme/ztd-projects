# Board

Stack: **Stalwart** (mail server) · **Amazon SES** (outgoing mail) · **Bulwark** (webmail) · **Jitsi Meet** (meetings) · this app (**control panel**).
Owner: **Samuel** = needs your accounts/decisions · **Claude** = build/config work.

## To do

### 1. Branded Bulwark demo (Stage 1)
Owner: Claude · Needs: product name + logo (placeholder OK)
- Bulwark Lite in demo mode at businessmail.ztddevs.com/webmail/
- Your name, logo and colours

### 2. Brand and platform domain
Owner: Samuel
- Choose product name
- Buy a dedicated platform domain (not ztddevs.com) for mail hostnames, e.g. mail.<platform-domain>

### 3. Amazon SES setup
Owner: Samuel (account) + Claude (config)
- Create AWS account, verify sending domain (Easy DKIM), create SMTP credentials
- Request production access (takes ~1 day; start early)
- Set up tenants (one per client) with automatic reputation policy

### 4. Mail server VPS
Owner: Samuel (order) + Claude (setup)
- Ubuntu 24.04, 2 vCPU / 4 GB+ RAM, root access, UK/EU location
- Ports 25, 443, 465, 587, 993 open; reverse DNS set to mail hostname
- Off-site backup storage

### 5. Install and configure Stalwart
Owner: Claude · Depends on: 3, 4
- HTTPS certificate, admin console
- Route outgoing mail through SES
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
- Replace Resend with Stalwart management (JMAP) + SES API
- Clients → domains → mailboxes (create, suspend, reset password, quotas)
- Generate DNS records per client domain and check they're live
- Create SES identity + tenant per client
- Per-mailbox sending limits and volume alerts

### 9. Security and abuse protection
Owner: Claude
- Two-factor sign-in, strong password rules
- Sending limits per mailbox, alerts on spikes
- SES tenant pausing so one hacked account can't stop everyone's mail

### 10. Monitoring, backups and recovery
Owner: Claude
- Uptime monitoring and alerts
- Nightly off-site backups; test a restore
- DMARC report monitoring

### 11. Billing integration
Owner: Samuel (choose system) + Claude
- Link mailbox creation/suspension to your billing system
- Pricing: base mailbox price; meetings as an add-on

### 12. Migration process
Owner: Claude
- Import old mail from clients' current providers (IMAP import)
- Step-by-step switch-over checklist (DNS cutover without lost mail)

### 13. Client setup guides
Owner: Claude (drafts) + Samuel (review)
- Outlook, iPhone/iPad, Android, Mac Mail, webmail, meetings

### 14. Legal and commercial
Owner: Samuel
- Terms: domain/account ownership, included support, SLA
- GDPR data processing agreement
- Confirm Stalwart free-edition use with Stalwart Labs; AGPL obligations for Stalwart/Bulwark

### 15. Support desk
Owner: Samuel (choose tool) + Claude
- Ticketing system for email support

### 16. Pilot and rollout
Owner: Samuel + Claude · Depends on: 5–13
- Pilot with 10–20 willing clients for a few months
- Migrate the rest in batches
- Keep Google Workspace / Microsoft 365 as a premium option

## In progress

## Done
