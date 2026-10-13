# Familiar Faces Dental

> Pipeline name: **Familiar Faces Dental** (folder `templates/uk-team/`). The **Front Desk** family (GP, Dental, Local) is task-first with little imagery; the **Familiar Faces** family (GP, Dental) and **Doorway** are people- and photo-led. When this brief says "Familiar Faces", it means this template.

A people-led website template for UK dental practices (NHS, private or mixed), adaptable for GP surgeries.

**The idea in one line:** patients choose people, not buildings. So the homepage shows the people they'll actually see, by name, face and personality, without ever making them hunt for the phone number, how to join or what to do in pain.

Familiar Faces is the people-first sibling of the approved **Front Desk** family (`uk-dental/`, `uk-gp/`, `uk-local/`). It keeps Front Desk's discipline (tasks first, live status, plain English, no pop-ups) and moves the practice's own team from the bottom of the page to the centre of it.

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), components below, numbered. Section 14 holds the inner-page patterns. | Tokens only. |
| `faces.js` | About 90 lines of plain JS: the phone menu (`aria-expanded`, `aria-controls`, Escape to close) and the live open or closed status. It reads the hours from the page's hours table, in Europe/London time. | No. |
| `fonts/` | Red Hat Display and Red Hat Text variable woff2 (latin and latin-ext), plus `OFL.txt`. Self-hosted, no CDN. | No. |
| `example/index.html` | The worked homepage for Kirriemuir Dental Practice. Copy it for each practice. | Yes, for each practice. |
| `example/our-team.html` | Worked inner page: every dentist with a full profile and whole bio, hygienists, the clinical dental technician, managers, and the nursing and reception group photos. | Yes, for each practice. |
| `example/fees.html` | Worked inner page: NHS charges in Scotland (from NHS inform), the full private fee list, the dental plan, missed appointment charges, a short urgent block. | Yes, for each practice. |
| `example/new-patients.html` | Worked inner page: two ways to join, the first visit, the nervous-patient spotlight, hours and directions, joining FAQs, the full urgent card. | Yes, for each practice. |
| `example/no-photos.html` | Demo of the fallback when a practice has only 1 or 2 photos. Not linked from the homepage. | Reference only. |
| `example/img/` | That practice's own photos, optimised, and `CREDITS.txt` with every source URL. | Replace for each practice. |
| `PHOTO-SHOTLIST.md` | One-page brief for the practice or a local photographer. Doubles as a paid add-on. | Hand it out. |

The example links `../styles.css`, `../faces.js` and `../fonts/`. Keep that layout: one template folder, one practice folder inside it.

## 2. The concept, and how it differs from what came before

**The team is the brand.** A small practice's real advantage over a corporate chain is its people: the dentist who's been there 20 years, the hygienist who's brilliant with nervous patients. Most practice sites bury them on a "Meet the team" page with tiny thumbnails. Familiar Faces puts them on the homepage, in a consistent, dignified card with their own published story.

**But tasks still come first.** On a 390px phone, the first screen holds the live status, "In pain? Phone NHS 24 on 111" when closed, the h1, a row of real faces, the Call button and four task links (join, emergency, costs, hours). The people are visible, and nothing is pushed below the fold to make room for them.

How it stays distinct from the approved and rejected work:

- **Front Desk** (approved) is task-led and light on imagery: faces appear at a sensible size near the bottom. Familiar Faces is portrait-led. It has a face pile in the hero, the reception team as the hero photo, portrait cards for every clinician as the second section, a "Meet Beverley" spotlight for nervous patients, and the nursing team as a full-width group photo. Different signature components, same discipline.
- **Atelier, Civic, Haven** (rejected) started from a mood and made the h1 a slogan. Familiar Faces starts from two research findings: patients come to do a task, and they're told by NHS inform that they should know who will treat them. The h1 says what and where, the photos are the practice's own, and there's no decoration the patient has to decode.
- **No trend devices.** No oversized italic serif, no full-bleed mood photo, no text over images, no gradient, no animation. The premium comes from consistent portraits, precise type and real information.

## 3. Research and the decisions it drives

| Decision | Research finding it comes from |
| --- | --- |
| **Photos of people are used, but only real ones, each with a job.** The reception photo answers "who will I speak to?" Portraits answer "who will treat me?" The spotlight answers "is anyone good with nervous patients?" No decorative stock, no smiling-model hero. | NHS service manual, Images component: "Use images only if there is a real user need. Avoid unnecessary decoration." NHS England GP website guide 1.7: "Avoid using images and banners unless essential." A recognisable clinician is a real need (below); a stock smile is not. |
| **"Who you'll see" is the second section, with every dentist's name, role, qualification, GDC number and story.** The join section says "When you join, we'll tell you which dentist will look after you." | NHS inform, *Receiving NHS dental treatment in Scotland*: when you register "you should be given all the relevant information you need about your dentist including … who will carry out your dental treatment". The template makes that information public and pleasant. |
| **No text on photos. Every caption is a solid panel below the image.** No words baked into images. | NHS service manual: "Do not use images that have words in them, because screen readers will not be able to read the words." NHS England GP guide repeats this for banners. WCAG 1.4.3 contrast can't be guaranteed over a photo. |
| **Portraits sit in a single consistent grid, never a slider.** On phones, each card puts the photo beside the name badge so all eight dentists stay scannable. | NHS service manual: "gallery views (images side by side) confused users… users clicked images expecting them to appear larger in a pop-up modal." Our grid is people cards with names attached, not an image gallery. There's nothing to click to enlarge and no carousel. |
| **Meaningful alt text for each person:** name plus a short visual description ("Michael Byrne, smiling, with curly hair, a red beard and navy practice scrubs."). Face-pile thumbnails are `aria-hidden` because the link beside them says "Meet our dentists". | NHS service manual, accessibility content: images "must have text alternatives that describe the information or function they represent". The pile is a visual preview of the linked section, so its function is carried by the link text. |
| **Tasks first on the phone's first screen:** Call button in the sticky header and the hero, then Join, Toothache or emergency, What it costs and Opening hours as large task links. | NHS England GP guide 3.6: "the homepage is the first place that 80% of users will look… Put all key tasks high up on the homepage. Don't have paragraphs of text on the homepage." Top tasks include registering, the phone number and opening times. |
| **Live "Open now / Closed now · opens tomorrow at 9am" status** in the hero, the emergency card and the hours section. "In pain? Phone NHS 24 on 111." appears only when closed. | GP guide 3.6: "Make sure useful information like opening times and the practice phone number are visible on the homepage." |
| **Emergency card with three routes:** our patients (phone us), closed (NHS 24 on 111, as text), not registered (the health board's dental advice line). 999 as text. | NHS inform, *Dental emergencies*: "always phone the dental practice that you normally attend"; out of hours "phone the emergency dental service on 111"; unregistered patients use the local line (Angus: 01241 432 481). |
| **"Join" not "Register"** in the menu and task links. | GP guide 3.3: "'Register' was often confused with other items you can register for." |
| **Six menu items, no submenus, and the word "Menu"** (not a hamburger icon) on phones. | GP guide 3.4 and 3.5: no more than seven items, no submenus; users often don't understand hamburger icons, "use the word 'menu'". |
| **No pop-ups, cookie walls, chat widgets, carousels or autoplay.** No map iframe: a text link to Google Maps instead (no third-party cookies, nothing to trap focus). | GP guide 1.7: 27% of participants who met an overlay first struggled to get past it. |
| **Plain English, links that say where they go and start with a verb,** times as "9am to 5pm". | NHS service manual content guide ("How we write"; numbers and times). GP guide: verb-first calls to action. |

## 4. Rules (every build, no exceptions)

1. **Never invent facts, quotes, bios or reviews.** Use only what the practice has published or confirmed in writing. If something is unclear or might be stale, write "phone to check" (as we do for whether Kirriemuir is taking new NHS patients and for Clare Perez's GDC number).
2. **Bios are the practice's words.** Quote them verbatim. You may shorten, and you may swap "she" for the person's first name so a quote stands alone. Never add an adjective. The team section says "in the practice's own words" so patients know the source.
3. **The team's own words** (first-person quotes) appear only if the person wrote or approved them. Kirriemuir has none published, so the example uses no first-person quotes.
4. **Tasks on the first phone screen** (390×844): status, Call, Join, Emergency. Check with a real phone before handover.
5. **111 and 999 are text, never `tel:` links.** The practice number and health-board lines are `tel:` links with 44px tap height.
6. **No text over photos.** Captions are solid panels.
7. **No stock or AI-generated people, ever.** Nobody appears as staff who isn't. Group photos are captioned with the heading the practice used ("Our dental nursing team"). Don't name people the practice didn't name.
8. **WCAG 2.2 AA.** Contrast of 4.5:1 or more (the tokens are mostly 7:1 or more), visible yellow focus, skip link, landmarks, headings in order, 44px tap targets including footer and inline links, works at 200% text and 320px reflow, respects `prefers-reduced-motion`.
9. **Performance.** Self-hosted fonts, no CDNs. Portraits served at 360w and 520w via `srcset`, lazy-loaded below the hero. Budget: under 1.2 MB desktop and 700 KB phone. Kirriemuir with 17 photos measures 526 KB at desktop DPR 1, 729 KB at DPR 2 and 609 KB on a phone at DPR 3, all after a full scroll.

## 5. Homepage structure

| # | Section | Purpose | Phone behaviour |
| --- | --- | --- | --- |
| 1 | **Header** | Practice name, six links, Call button | Sticky. Brand, Call, Menu in one row. |
| 2 | **Front of house** | Live status, 111 line when closed, h1 (what and where), face pile linking to the team, Call button, four task links. Right: the reception team photo with a solid caption ("They're who you'll speak to when you phone…"). | Everything down to the fourth task link sits on the first screen. The photo follows. |
| 3 | **Meet your dentists** | One portrait card per dentist: photo, name, role, facts (qualified, joined, interests, GDC number), one personality line from the published bio, "More about [name]" disclosure with the rest. | Photo beside the name badge; facts and story full width below. |
| 4 | **Join as a new patient** | NHS route as numbered steps, the private plan with published prices, "phone to check" where unknown. | Stacked panels. |
| 5 | **Spotlight** | One person matched to one patient need. Kirriemuir: Beverley, hygienist with anxiety-management training, for nervous patients. A large portrait plus a quote from her profile and a call to action. | A short photo card (portrait beside its caption) above the text. From 576px, portrait column beside the text. |
| 6 | **Toothache or a dental emergency** | Red-edged urgent card with the live status and three routes, plus 999. | Stacked. |
| 7 | **What it costs** | Official NHS Scotland rules beside a short list of the practice's published private fees. | Stacked. |
| 8 | **Who else you'll meet** | Compact cards for hygienists, technicians and managers, then the nursing team group photo. | Compact cards stack. |
| 9 | **Opening hours and how to find us** | Hours table (drives the live status), address, facilities, directions link, call and email, premises photo. | Stacked. |
| 10 | **Footer** | Address, call, task links, NHS inform links. All links 44px tall. | |

### Responsive layout

Checked at 320, 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px, and at 200% text size: one header row, no sideways scrolling, every tap target at least 44px. Keep these rules when you build. Set columns explicitly as below. Don't go back to `auto-fit` for card grids: that is what produced the 3 + 1 orphans and the cramped tablet rows.

**Breakpoints** (all in `styles.css`; rem, so they follow text zoom):

| Width | Name | What changes |
| --- | --- | --- |
| up to 352px (22rem) | small phone | The logo tile hides, so the practice name keeps two lines beside Call and Menu. The face pile shows 3 faces. |
| up to 480px (30rem) | phone | The address under the name hides. The face pile shows 4 faces. The tasks are one column. |
| 480px and up | | The tasks become 2 × 2. |
| 576px and up (36rem) | small tablet | Dentists, compact cards and footer go to 2 columns. The spotlight goes side by side. The hero photo sits beside its caption. |
| 640px and up (40rem) | tablet | In Visit, hours and address go side by side, with the premises photo as a wide strip (photo beside caption) underneath. |
| 928 to 1024px (58 to 64rem) | large tablet | Dentist cards put the name, role and facts beside a bigger photo. |
| 960px and up (60rem) | | The hero goes 2 columns (tasks left, reception photo right, 5:4). |
| 1025px and up (64.0625rem) | desktop | Full nav. Dentists go to 4 columns as tall portrait cards (subgrid lines up the name badges and "words" panels across each row). Compact cards go to 3 columns, and Visit and the footer go to 3. |
| 1200px and up (75rem) | wide | The header Call button also shows the number. |

**Header.** One row at every width. Up to 1024px it shows the brand, Call (the word only) and Menu. The brand takes the leftover space and wraps its own text; Call and Menu never shrink. The open menu is a full-width panel under the header, with links on the same left edge as the page. From 1025px it shows the brand, the six nav links (no wrapping) and Call; from 1200px Call includes the number. If a practice name is long, test it at 320px. Shorten it to the name people use, never the legal name, before you shrink the type.

**Grids:**
- **Dentists** (`.people`): 1 column, then 2, then 4. Use 3 columns automatically when the count divides by 3 but not by 4 (3, 6, 9). Other counts (5, 7) leave a short last row on desktop. That's acceptable, but if you can choose who to show, pick a count that fills the rows.
- **Compact cards** (`.people--compact`): 1 column, then 2. With an odd count on tablets, the last card runs full width on purpose. Desktop uses 3 columns, or 4 when 3 would leave one card alone.
- **Tasks** (`.tasks`): always 1 column or 2 × 2. Keep it to four tasks.
- **Emergency routes** (`.urgent__grid`): this uses container queries on the card. Routes stack, then go 2 + 1 (the third full width), then sit 3 across when the card is 800px wide or more.
- **Panels** (`.panels`): stacked until the content is about 664px wide (a screen of about 710px), then 2 columns.
- **Footer**: 1 column, then 2 with the practice details across the top, then 3.

**Spacing and edges.** The side gutter is the `--gutter` token: 17px at 360px, 27px at 768px, 32px from 1024px up. Everything sits inside `.wrap`. In fees and hours tables, the first and last cell have no side padding, so the text lines up with the panel heading. Only the highlighted "today" row is indented. Section padding and panel padding use `clamp()`. Don't add fixed paddings at breakpoints.

**Photos.** The hero photo is 3:2 on phones, 4:3 beside its caption on tablets and 5:4 on desktop, so it never pushes the tasks off the first screen. Portraits are 4:5 with `object-position: 50% 20%`. The group photo keeps its own ratio, so nobody at the edge is cropped out.

**Text.** Headings use `clamp()` and `text-wrap: balance`. Paragraphs use `text-wrap: pretty`, so no last word sits alone. Phone numbers stay on one line at every width; they wrap only at 200% text size. Long emails get a `<wbr>` after the `@`.

If the practice has a spotlight-worthy person for a different need (a children's dentist, a dentist who speaks Polish, a denture specialist), use the spotlight for that need instead. Use only one spotlight per page.

## 6. Components quick reference

- `.status[data-status]`: live pill. Put the static fallback text inside, which shows if JS fails.
- `[data-when-closed]`: shown only when closed (starts `hidden`).
- `table[data-hours]` with `tr[data-day][data-open][data-close]`: the single source of opening hours (0 = Sunday). Rows without `data-open` are closed days.
- `.facepile`: up to 8 `-face.jpg` crops (112px squares), `aria-hidden`, plus one text link. Shows 4 on phones and 3 on 320px screens.
- `.people > .person`: the portrait card, built from `.person__photo`, `.person__id` (h3 name, `.person__role`, `dl.person__facts`), and `.person__more` (`.person__words` with a `.label`, `details.story`).
- `.people--compact > .person--compact`: small cards for the wider team.
- `.spotlight`: one large portrait plus a `blockquote.quote` from the published bio.
- `.group-photo`, `.front-photo`, `.place-photo`: figures with solid captions.
- `.panel`, `.steps`, `.fees`, `.urgent`, `.tasks/.task`, `.action`, `.btn--call`, `.btn--quiet`.

## 7. Tokens and re-theming a practice

All tokens are custom properties at the top of `styles.css`. To re-theme, change these, and only these:

| Token | What it does | Rule |
| --- | --- | --- |
| `--brand` | Buttons, links, card edges, step numbers | 7:1 or more against white (white text sits on it). Darken the practice's logo colour until it passes. Kirriemuir `#663399` became `#5c2e91` (9.3:1). |
| `--brand-strong` | Hover and pressed states | About 15% darker than `--brand`. |
| `--brand-tint`, `--brand-tint-2` | Portrait panels, quote boxes, the spotlight band | Very light, so `--ink-soft` keeps 7:1 on it. |
| `--accent` | Small marks only: caption rules, chevrons | Never used for text. |
| `--accent-ink` | Eyebrows and role lines | 7:1 on paper. Kirriemuir green `#669933` became `#3b5e1a`. |
| `--font-display`, `--font-text` | Typefaces | Any OFL family, self-hosted in `fonts/`. Keep one family with two optical cuts or one family only. |
| `--radius`, `--radius-photo` | Shape | Keep photos softly rounded (10 to 16px), never circles in cards. Circles are for the face pile only. |

Leave the neutrals, status, urgent and focus tokens alone: they carry the accessibility guarantees. To check a new pair, run a contrast check (a short WCAG luminance script is enough). The example's ratios are: ink on paper 16.2, ink-soft on paper 8.6, white on brand 9.3, brand on tint 8.1, accent-ink on paper 7.2, open status 6.6, closed status 7.9, focus 14.6.

For the inline SVG mark in the header, swap the initials and colours. Don't use an `<img src="logo.svg">` for a text logo: the in-house audit flags it as broken. Use inline SVG, or a PNG or WebP of the real logo.

## 8. Photo rules

**Source.** Use only the practice's own photos: from their current site, their social media (with permission) or a new shoot (see `PHOTO-SHOTLIST.md`). Never use stock or AI-generated people. Never show anyone as staff who isn't. Record every source URL in `example/img/CREDITS.txt`.

**Consent.** Before launch, the practice confirms in writing that each person shown consents to their photo, name, role and bio appearing on the website. People who leave are removed within 5 working days. Withdrawn consent is honoured the same day. Patients never appear unless the practice holds their specific written consent for web use. If in doubt, leave the photo out and use the fallback.

**Cropping and sizes.**
- Portraits are 4:5. Head and shoulders, eyes about a third from the top. Make `-360.jpg` and `-520.jpg` (progressive JPEG, about quality 70, 15 to 35 KB each).
- Face-pile crops are 112×112px squares from the same portrait (about 3 KB).
- Group and premises photos are 480 or 720 and 800 or 1200 wide (25 to 85 KB).
- Never upscale. Don't retouch faces, swap backgrounds or apply filters. If a portrait set is inconsistent (different backgrounds or light), keep them all the same crop and size, and recommend a reshoot as an add-on.
- Use `width` and `height` attributes on every `<img>` (no layout shift), `loading="lazy"` on everything below the hero, and `fetchpriority="high"` on the hero photo.

**Alt text.**
- **Portraits:** "Name, a short visual description." Example: "Jane Leslie, smiling, with shoulder-length blonde hair and navy practice scrubs." Don't describe a person's age, body or ethnicity. Don't repeat the role (it's in the card).
- **Group photos:** say who they are as a group, how many, and where. Example: "Eleven dental nurses in purple uniforms, smiling, gathered at the purple KDP wall in reception." Don't name people the practice hasn't named.
- **Face pile:** `alt=""` inside an `aria-hidden` list, because the adjacent link carries the meaning.
- **Captions:** a full sentence that adds to the alt text and doesn't repeat it.

## 9. When a practice has only 1 or 2 photos, or none

The layout is built so missing photos look intentional, not broken. See `example/no-photos.html`.

| Photos available | What to do |
| --- | --- |
| **Group photo but few portraits** | Keep the group photo as the hero. In the team grid, people without portraits get an initials tile (`<div class="person__photo"><span class="initials" aria-hidden="true">AH</span></div>` on a `.person--no-photo` card). Same card, same rhythm. |
| **1 or 2 portraits, no group photo** | Replace the hero `<figure class="front-photo">` with `<div class="front-card">` (address, hours, access). The face pile mixes real faces with initials circles. Put photographed people first in the grid. If one of them suits a patient need, use them in the spotlight. |
| **No photos at all** | Use the hero `.front-card`, remove the face pile, keep the team grid with initials tiles (names, roles, facts and stories still carry the people-led idea), drop the spotlight's figure (the quote and text stand alone) and remove the group photo. Sell the photo shoot (`PHOTO-SHOTLIST.md`). |

Never fill gaps with silhouettes, avatars, illustrations of people or stock.

## 10. Adapting Familiar Faces for a GP practice

- **h1:** "GP surgery in [Town]". **Tasks:** Request an appointment, Order a repeat prescription, Register with the surgery (research participants used both 'register' and 'join'; pick one and use it everywhere), Opening hours. Change the emergency card to "Urgent help": phone the surgery from 8am, NHS 24 on 111 when closed, 999 for emergencies.
- **Menu (GP guide 3.4):** Home, Appointments, Prescriptions, Your health, About us, Contact us.
- **People:** GPs, practice nurses, pharmacists and other clinicians get portrait cards. Use the GMC number for doctors and the NMC PIN for nurses, but only if the surgery wants them shown. For GPs, "Special interests" matters more than "Outside work". The spotlight suits, for example, a GP with a women's health or child health interest.
- **Remove** "What it costs". Replace it with "How to contact us" (online form first, then phone, as the surgery's process says). Don't use the term "online consultation" (GP guide).
- **Keep** the live status, reception team photo ("They're who you'll speak to when you phone…"), the no-pop-up rule and the hours table.
- **Rotas change.** Never say who is "in today" unless the surgery maintains it daily. Say "Ask for a named GP when you book" only if the surgery offers that.

## 11. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the practice's site, NHS inform or written confirmation. Where it doesn't, the page says "phone to check".
- [ ] NHS Scotland rules are correct: check-ups free; free treatment if under 26, pregnant or gave birth in the last 12 months, or exempt (for example HC2); others pay 80% up to £384; HC3 gives partial help; out of hours is NHS 24 on 111.
- [ ] The health board's dental advice line is the right one for the practice's area (from NHS inform, *Dental emergencies*).
- [ ] Names are spelled as the practice prints them. Check against the GDC register.
- [ ] Prices are labelled with their source and "phone to check".

**People and photos**
- [ ] Written consent is held for every person shown.
- [ ] `CREDITS.txt` lists every source URL.
- [ ] Alt text is written for every portrait and group photo.
- [ ] No stock, AI or unnamed patients appear.
- [ ] Bios are verbatim (shortened only). No first-person quotes unless approved.

**Behaviour**
- [ ] On a 390px phone, the first screen shows the status, Call, Join and Emergency.
- [ ] The live status is right for today, an evening, a Saturday and the moment of opening. Test by editing `data-open` temporarily.
- [ ] Menu works by keyboard. Escape closes it. `aria-expanded` changes.
- [ ] All `details` stories open with Enter or Space.
- [ ] 111 and 999 are text. `tel:` links use `+44`.
- [ ] Works at 200% text and at 320px width with no sideways scroll (tables scroll inside their wrapper).
- [ ] Reduced motion: no transitions. No smooth scrolling anywhere (it also confuses the in-house audit).

**Audit and weight**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:4484/example/ <out>` gives 0 blockers, 0 major and 0 minor.
- [ ] Desktop is under 1.2 MB and phone under 700 KB after a full scroll.
- [ ] No external CDN requests (fonts are local; Google Maps is a link, not an embed).

## 12. The worked example: Kirriemuir Dental Practice

**Why this practice.** Graded **Average** in the prospect data ("Dated colourful tile layout, phone only in top bar, no booking button"). The town starts with K. Its Meet the Team page has the best real team photography I found. I scanned about 360 Bad or Average A to L practices for team pages, then compared about 10 by eye: 14 consistent studio portraits, plus nursing team and reception team group shots. Its bios have genuine personality ("Michael is a bit of a petrol-head!", "Nicole is a Disney fan…", Beverley's anxiety-management training) and GDC numbers. That's exactly what a people-led template needs, and the current site hides it behind "» View Biog" pop-ups.

**Sources (fetched 11 October 2026):**
- kirriemuirdentalpractice.com: Meet the Team, About the Practice (opening times, 50+ years, 10,000+ patients, parking, wheelchair, wifi, premises since 2012), NHS Treatments, Private Fees Cost, KDP Membership Plan, Contact Us.
- NHS inform service directory listing (hours match; "Please contact the dental surgery directly to enquire about joining").
- NHS inform: *Receiving NHS dental treatment in Scotland* and *Dental emergencies* (Angus Dental Advice Line 01241 432 481, Monday to Friday 8:30am to 5:30pm).

**Unsure, so marked "phone to check" or left out:**
- Whether new NHS patients are being accepted (not published).
- Clare Perez's GDC number (not published).
- Spellings: the page prints "Clare Perez", "Clair Ruxton" and "Emma Millar", but the image files say "claire" and "miller". We use the printed names.
- The plan is called both "KDP Membership Plan" and "Highland Dental Plan" on the site, so the page says "our dental plan". The price page doesn't state that prices are monthly, only that payment is by monthly direct debit.
- Private fees and plan prices may be out of date.
- Public holiday closures.
- Sean Ward's GDC number (not published, so not shown).
- Nursing and reception team members aren't named on the site, so they aren't named here.
- Added for the inner pages (re-crawled 12 October 2026): whether plan prices are per month; what the Dental Emergency Assistance Support product actually covers (the site calls it "discretionary"); whether the private fee list and plan prices are current (the pages carry no date); whether the "Join our dental plan" online link (identportal.co.uk) is still the one the practice wants used.
- Light edits to the published bios, for grammar only: Nicole's "During her time at university, Nicole outreach posts at both Stornoway and Elgin" is left out because it's missing a word, and her next two sentences are joined; Alan's "went onto" and "Batchelor Of" are corrected. Ask the practice to approve the bios as shown.
- NHS charges on `fees.html` are NHS inform's own table ("correct as at 1 November 2025"), checked 12 October 2026. Re-check them before every handover.

## Inner pages

The worked example is a four-page site: `index.html` plus `our-team.html`, `fees.html` and `new-patients.html`. Real practice sites need more pages: Redesign study writes a `pages` site map, and Build makes every page on it. Copy the worked inner pages and the patterns below exactly; don't invent new layouts.

- **Same shell everywhere.** Every page reuses this template's header, menu, footer, tokens, fonts and JS, copied exactly from `example/index.html`. Mark the current page in the menu with `aria-current="page"`.
- **Page pattern.** A short breadcrumb or "Back to home" link, one `h1` that says what the page is, a one- or two-sentence intro, then sections with `h2` headings. Use the same components as the homepage (cards, care cards, summary lists, tables, the team grid) rather than inventing new ones.
- **Keep the urgent route on every page.** The call button stays in the header. Pages about appointments, emergencies or treatment repeat the short urgent-help block.
- **Long content.** FAQs go in `<details>` expanders grouped under headings. Fee lists go in a simple table with a "last checked" date and a link to the official NHS charges. Policies (privacy, FOI, complaints) go on plain text pages linked from the footer.
- **Menu.** The 7 or fewer menu items point to the most-used pages. Everything else is linked from the footer and from the pages it belongs to.
- **File names.** Use short lowercase names like `treatments.html` and `new-patients.html`, all in the site root, with relative links between them.
- **Check.** The browser audit crawls every page. All pages must pass it, and `viewports.mjs` must show clean layouts on the main inner pages too.

### The example's pages and menu

| Page | Menu item | What it holds |
| --- | --- | --- |
| `index.html` | Home | The homepage (section 5). Its task links and section links now point to the inner pages: Join → `new-patients.html`, What it costs → `fees.html`, "Meet the whole team" → `our-team.html`, "See what each plan includes" → `fees.html#plan`. Emergency and Find us stay on the homepage as anchors (`./#emergency`, `./#visit`). |
| `new-patients.html` | Join | Page head with live status and Call; Two ways to join (NHS steps panel, plan panel); Your first visit (three panels); the Beverley spotlight; hours and directions with the practice-front photo (this page carries the `data-hours` table, so the status is live); Questions about joining (FAQ); the full urgent card. |
| `fees.html` | Costs | Page head with a "Last checked" note; NHS (who pays nothing and what others pay, combined in one panel, beside the common NHS charges table); Private fees (11 fee groups); Our dental plan (two plan panels, family discounts, how to join, plan FAQ); If you miss an appointment beside a short urgent block. |
| `our-team.html` | Our team | Dentists as full profiles; hygienists as compact cards with their whole bios; the clinical dental technician as a full profile; practice managers as two compact cards; nursing and reception group photos. |

The menu is the same six items on every page, with `aria-current="page"` on the current one. The header and footer are byte-for-byte identical across pages apart from `aria-current`. The footer's Patients column links all four pages plus `./#emergency` and `./#visit`.

### Inner-page patterns (copy exactly)

All of these live in `styles.css` section 14. They only arrange existing components: no new colours, type sizes or shapes.

**Page head.** Every inner page starts with the same block, on the paper background, before the first `.section`:

```html
<div class="page-head"><div class="wrap">
  <a class="back-link" href="./">Back to home</a>
  <!-- optional, on pages about appointments: the .front__status block from the homepage -->
  <h1>What the page is</h1>
  <p class="lede">One or two sentences.</p>
  <!-- optional: .front__call (Call button + one line), or a .note "Last checked" box -->
  <nav class="contents" aria-labelledby="contents-title">
    <h2 id="contents-title">On this page</h2>
    <ul class="actions"><li><a class="action" href="#section-id">Section name</a></li>…</ul>
  </nav>
</div></div>
```

The back link is a plain "Back to home" (left chevron), not a full breadcrumb: every inner page sits one level under home. "On this page" lists the page's h2 sections as action links: stacked on phones, flowing in a row from 576px. Name each link after its section, 2 to 4 words. Then alternate `.section--surface` and plain `.section` bands, as on the homepage.

**Full profile (team page).** Use `ul.profiles > li.profile` when the whole bio is shown, not hidden in a `details`:

```html
<li class="profile" id="first-last">
  <figure class="profile__photo"><img … 360w/520w, sizes="(min-width: 64.0625rem) 224px, (min-width: 40rem) 192px, 34vw"></figure>
  <div class="profile__id"><h3 class="person__name">Name</h3><p class="person__role">Role</p></div>
  <dl class="person__facts profile__facts">…</dl>
  <div class="profile__bio"><p>The practice's own words.</p>…</div>
</li>
```

Phones: photo beside the name, facts and bio full width. From 640px: photo column beside name, facts and bio. From 1025px: photo, then name and facts, then the bio in its own column with a hairline rule. Give each profile an `id` (the person's name) so other pages can link to it, as `fees.html` links to `our-team.html#sam-cobley`. Use the same `person__facts` rows as the homepage cards. On the team page, people with short bios (hygienists) use the homepage's `.people--compact` cards with the whole bio in `.person__words`. Two compact cards sit side by side at every width from 576px. Group photos follow the cards; a second group photo with a squarer ratio uses `.group-photo--split` (photo beside its caption from 640px).

**Fee groups (fees page).** Use the practice's own fee headings, one small `table.fees` per heading, inside `.fee-groups` (1 column, 2 from 768px, groups never split across columns):

```html
<div class="fee-groups">
  <div class="fee-group"><h3 id="fees-exams">Examinations</h3>
    <div class="table-wrap"><table class="fees" aria-labelledby="fees-exams"><tbody>
      <tr><td>New patient examination</td><td>£85</td></tr>…
    </tbody></table></div></div>
  …
</div>
<p class="small">From our current private fee list. Last checked [date]. Phone to check before you book.</p>
```

Write prices as "£85", "from £95", "about £350 to £650", "£1,200". No pence when the source shows .00. Price ranges that might not fit on a phone use `table.fees.fees--wrap`. Every fee page carries a **"Last checked" note** (`.note` in the page head and a `.small` line under each list) and **links to the official NHS charges** on NHS inform. Show NHS charges in their own table, copied from NHS inform's "Receiving NHS dental treatment in Scotland" table with its "correct as at" date. Never copy NHS charges from the practice's site.

**Panels in threes.** `.panels--3` is the explicit 1, 2, 3 column version of `.panels` (3 columns from 1025px). Use it for three equal panels, such as What to bring, At your check-up and Who you'll see.

**FAQ group.** Questions go in a `.faq` wrapper of the same `details.story` used for the homepage bios, at reading size. Each `summary` is the patient's question in their words. Answers are short and plain. Links inside an answer go in an `.actions` list, never inline, so every tap target stays 44px. Give the group an `h3` (`.faq__title`) when it sits inside a section, or let the section's `h2` head it.

```html
<div class="faq">
  <details class="story"><summary>Can I register my children?</summary>
    <div class="story__text"><p>Yes…</p></div></details>
  …
</div>
```

**Urgent help.** Pages about appointments, joining or emergencies end with the homepage's full `.urgent` card (same three routes and 999). Pages about treatment or costs carry a short `.urgent` block: an `h3`, one line ("If you're our patient, phone us. When we're closed, phone NHS 24 on 111."), 999 as text, then Call and "Find out what to do in a dental emergency" (`./#emergency`) as action links. The live status needs a `table[data-hours]` on the same page; on pages without one the pill shows its static fallback, so leave it out there.

**Phone numbers in body text.** Inline `tel:` links inside sentences are under 44px tall and fail the audit. Say "phone us" in the sentence and put "Call 01575 572711" in an `.actions` list after it.

