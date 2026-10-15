# Practice manager — install instructions

For the practices you deploy to directly (the 289 "direct / GTM" and most of the
197 Cloudflare-fronted sites). Google Tag Manager is the recommended default
because once it's in, you ship and update the widget yourself without touching
their site again.

---

## Option A (recommended): Google Tag Manager — one-time setup

**Email to the practice manager:**

**Subject:** Quick one-time setup for your new website layout

Hi [name],

To switch on your refreshed website layout, I need one small snippet added once.
The easiest route is Google Tag Manager — after this single step I can make all
future updates myself, so I won't need to bother you or your web person again.

Two options:

1. **You already use Google Tag Manager** — just add me as a user with Publish
   rights on your container: in GTM → Admin → User Management → add
   `[your-email]`. Send me the container ID (looks like `GTM-XXXXXX`) and I'll do
   the rest.

2. **You don't use GTM yet** — I'll set up a free container for you and send two
   short code snippets. Your website person pastes the first in the `<head>` and
   the second just after the opening `<body>` tag of the site template. One-time,
   ~5 minutes. After that everything is managed from my side.

Happy to jump on a quick call and walk through it. Nothing here changes your
content, booking links or NHS integrations — it only improves how the page looks
and works on phones.

Thanks,
[name] — [company] — [phone]

---

## Option B: Direct script tag (if they can't/won't use GTM)

Ask the person who maintains the site template to paste this once, immediately
before the closing `</head>` tag:

```html
<!-- [Product] website layout enhancer -->
<script async src="https://cdn.[yourdomain].com/widget.js"
        data-practice="PRACTICE_ID"></script>
```

Replace `PRACTICE_ID` with the id from deployment-plan.csv for that practice.
The script is async (won't slow the page) and only restyles the rendered page.

---

## Option C: Cloudflare-fronted practices

If the practice's site is behind Cloudflare, they can inject the widget without
editing the site template at all:

- **Simplest:** still use Option A (GTM) — it works regardless of host.
- **Alternative:** the manager adds you to their Cloudflare account
  (cloudflare.com → the zone → Manage Account → Members) and you deploy via a
  Cloudflare Worker / snippet that injects the script at the edge. No origin
  changes, no vendor involvement.

---

## Platform-specific self-serve (Wix / Squarespace)

- **Wix (9 sites):** Settings → Custom Code → Add Custom Code → paste the Option B
  snippet, apply to all pages, place in Head.
- **Squarespace (8 sites):** Settings → Advanced → Code Injection → paste the
  Option B snippet into the Header box.
