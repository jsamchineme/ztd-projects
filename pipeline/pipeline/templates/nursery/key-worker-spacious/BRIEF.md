# Key Worker, spacious version: a people-led website template for Scottish nurseries

> Pipeline name: **Key Worker spacious** (folder `templates/nursery/key-worker-spacious/`). A copy of Key Worker (`templates/nursery/key-worker/`) rebuilt to the **space brief** (rules S1 to S13, Part 2 of `prospects/research/nursery-spacious-directions.md`). Same palette, fonts, portraits, voice, example nursery and facts. **Read the space brief before changing any spacing.**

## Spacious version: what changed and why

The owner found the originals "a bit cramped, especially in mobile view" and wanted "less detail on the home page, with a clear way to go into separate pages". The homepage is now a short, people-led summary with doors; every detail it used to carry lives on an inner page.

**Homepage (S3, S4, S5, S9):** notice line → hero → The essentials → Your child's key worker → Find out more (doors) → Come and see us (visit band). Hero plus 4 sections, the last being the Book a visit band.
- **Hero (S2):** the name, one sentence, Book a visit and Phone, then the **team mosaic** (Kerri large, Caroline and Chelsea beside her on phones; Fern and Steph join from 36em). Photo-only tiles, 2 per row on phones (S6).
- **The essentials (S9)** replace the boxed 2 by 3 key facts strip: 5 lines with an icon each, hairline dividers, closed by "All the details".
- **Your child's key worker** keeps the **hello band's** voice (pine ground, large Lora type) for the template's central promise, with a playroom photo (S12) and a facepile of practitioners. Kerri's welcome quote moved to Our team (`#welcome`), in full.
- **Doors (S9):** 5 doors, one per inner page, each a round photo ringed in a **lanyard team colour**, a label of up to 3 words and a line of up to 8. One per row on phones (rows at least 112px, 24px apart), 2 across from 60em, 3 tiles across from 72em.
- **Come and see us:** the same band at the foot of every page, with the live status, Book a visit and Phone.

**What moved where (nothing was dropped):**
| Was on the homepage | Now |
|---|---|
| Key facts strip | The essentials (5 lines); full detail on Visit and join and Fees and funding |
| Manager's welcome (hello band) | Our team, `#welcome`, in full; the key-worker band on the homepage keeps its style |
| Key-worker 4 points + Amy's quote | Points: Our team `#key-workers`. Amy's quote: Visit and join `#settling-in` (it is about the first weeks) |
| Lanyard cards and "plus 17 others" facepile | Our team (already listed everyone) |
| Who to ask (4 routes) | Parents `#who-to-ask` |
| Rooms and garden cards, gallery | Our nursery (adds "opened in March 2021") |
| Grades panel and HM Inspectors link | Visit and join `#inspection` |
| Fees and funding summary | Fees and funding |
| Starting with us steps, Book a visit callout | Visit and join |
| For parents task cards | Parents (and the doors) |
| Find us (address, parking, building photo) | Visit and join `#find-us`; the photo heads that page's band |
| Christmas notice | A one-line dated strip at the top of the homepage |

**Inner pages (S10):** every page opens with the same pine **page band** (breadcrumb as the eyebrow, H1, intro of 35 words or fewer, one action: Phone, and a photo or faces unique to the page), then an **"On this page"** list (48px rows, up to 7), sections of 120 words or fewer, a **"Next" door** and the visit band.
- **Food** became a sub-page, `food.html` ("Back to Our nursery"), because Our nursery's food section was 257 words: cooked here, allergies (with Lindsey's ask item) and the sample week in an accordion. Our nursery keeps a 30-word food section that links to it.
- Our nursery: the second paragraph of each room card is in a small "More about…" fold; the Learning Journal is its own short section; the unattributed testimonial sits in "A day at nursery".
- Fees and funding: funded hours split into "Funded hours" (the 3 patterns) and "Applying for funded hours".
- Visit and join: the booking fee moved into the questions accordion (it is also in Fees and funding).
- Parents: the duplicate ask items in Paying and Complaints were folded into Who to ask.
- Next doors: Visit and join → Fees → Our nursery → Food → Our team → Visit and join; Parents → Fees.

**Navigation (S11):** on phones and tablets the header is the brand and a "Menu" button; the menu opens as a full-height sheet (56px rows in door order, then Book a visit and Phone). The original kept "Visit and join" and "Fees and funding" printed under the logo; S11 forbids an inline menu, and both are now the first two doors. From 64em all 6 items show with a Book a visit button.

**Actions (S13):** "Book a visit" (the pine button) goes to `join-us.html#visit` everywhere; the secondary is always "Phone 01292 388456". The old "Join the waiting list" secondary button is now a section on Visit and join.

**Spacing tokens (S1, S2, S7, S8), section 1 of `styles.css`:** `--gutter` 24px phones, 40px from 600px, 64px from 900px; `--page-max` 70rem (1,120px); `--space-section` clamp(5rem, 3.6rem + 5.6vw, 8rem); `--space-group` 48 / 64px; `--gap-cards` 24 / 32px; `--measure` 60ch; body 18px, 19px from 40em, 20px from 72em, line height 1.6. **Never lower them.** New components are in section 13 of `styles.css`.

### Space figures (390 by 844 phone, `density.mjs` and `words.mjs`)
| Homepage | Original | Spacious |
|---|---:|---:|
| Length | 11,980px (15 screens) | 5,013px (6 screens) |
| Words in `<main>` | 969 | 164 (156 once the Christmas strip expires) |
| First screen: text blocks / boxes | 14 / 10 | 6 / 3 |
| Average per screen: text blocks / boxes | 11.5 / 3.1 | 6.5 / 1.0 |
| Sections after the hero | 10 | 4 (last is the visit band) |

Per screen in `<main>`: at most 1 H2, at most 6 text blocks, at most 3 boxes. The last screen is the footer, which carries the registration and review lines (12 text blocks); it is outside the S5 count. Inner pages: 245 (Food) to 714 (Visit and join) words; every section is 120 words or fewer with accordions closed.

---

## Original brief (still applies unless the section above says otherwise)

> Pipeline name: **Key Worker** (folder `templates/nursery/key-worker/`). It is direction **B** in `prospects/research/nursery-websites.md` (section 7.2) and belongs to the **Familiar Faces** family (`practice/familiar-faces-gp/`, `practice/familiar-faces-dental/`). Its sister nursery directions are **Front Desk Nursery** (A, task-first) and **Garden Gate** (C, place-led).

**Key Worker** shows parents the real people who will look after their child: the manager who runs the place, the room leads, every practitioner with their qualifications, the cook and the office. It explains the key-worker system in plain words and routes each question to the right person. It still answers "Is this for us?" first: ages, hours, weeks a year, funded status, places and grades sit above the fold on a 390px phone.

It is the "after" in a sales pitch, and a design system that AI build workers reuse. Follow this brief exactly. The research brief (`prospects/research/nursery-websites.md`) is the source of truth; its tags (**[SG25-7]**, **[PC-C]** and so on) are used below.

- **For:** owner-run private nurseries with a stable, qualified team, and any nursery with a baby room, where parents weigh up trusting staff with an infant.
- **Not for:** nurseries with no staff photos and no wish to take them. Use Front Desk Nursery instead, or sell the photo shoot (`PHOTO-SHOTLIST.md`) first.
- **Worked example:** Heads of Ayr Nursery, Alloway by Ayr, South Ayrshire (prospect `n031-06`, CS2020380758). It is a 6-page site. Every fact comes from its current website, headsofayrnursery.co.uk (crawled 13 October 2026), its Parent Handbook PDF, or its Care Inspectorate record in our data. Section 11 lists what to confirm.

## Files

| File | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token as a CSS custom property. Sections are numbered 1 to 12. | Tokens only |
| `keyworker.js` | About 110 lines of plain JavaScript: the phone menu sheet, the live "Open now" status, and dated items (past closure dates hide; notices show only between their dates). It reads its data from the page. | Never |
| `fonts/` | Nunito Sans (body) and Lora (headings), Latin, variable woff2 (31 KB and 38 KB). SIL Open Font Licence (`fonts/OFL.txt`). | Never |
| `example/index.html` | The worked homepage. Copy it to start a new nursery. | Yes |
| `example/our-team.html`, `join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `food.html`, `parents.html` | The worked inner pages, built with the same shell. See "Inner pages". | Yes |
| `example/img/` | `people/` (each person at 240 and 400px 4:5, and 96 and 160px square, WebP), place and food photos, and `CREDITS.txt` with every source URL. | Each nursery gets its own |
| `PHOTO-SHOTLIST.md` | One-page brief for the nursery or a photographer, with staff consent wording and the no-children rules. Doubles as a paid add-on. | No |

Pages link `../styles.css` and `../keyworker.js`; fonts load from `../fonts/`. Nothing loads from another server: no CDNs, no Google Fonts, no analytics, no social feeds and no embedded maps [ICO-PECR].

---

## 1. Concept

**"The people who will know your child's name."** The second biggest reason parents give for choosing a setting is that they "liked and trusted the staff" (43%) [SG25-7]. Parent Club tells them to ask "Will my child have a key worker?" and about staff qualifications [PC-C]. A nursery's real advantage over a chain is its people, but most nursery sites hide them behind clip art and stock toddlers.

Key Worker puts the team at the centre, and makes every face do a job:
- **Who runs this place?** The manager's welcome, in her own published words, with a small face and a signature.
- **Who will look after my child?** The key-worker system as 4 numbered points, then the people: managers, room leads and every practitioner, each with qualifications.
- **Who do I ask?** A "Who to ask" list that routes fees, food, progress and complaints to a named person, as the nursery's own handbook does.
- **Is it good?** Every Care Inspectorate grade, the date and the report link, beside fees and funding.

Faces never replace answers. On a phone, the key facts and both actions come before any portrait except the hero mosaic.

**How it differs from its siblings**
- **Familiar Faces GP and Dental:** NHS blue, an "Are we open?" card, role cards and clinician badges. Key Worker keeps their discipline (tasks first, live status, plain English, initials fallbacks, consistent portraits) but drops the NHS identity, because a nursery is not an NHS service.
- **Front Desk Nursery (A):** task cards with answers and almost no photos. Key Worker is portrait-led.
- **Garden Gate (C):** a photo walk through the building and garden. Key Worker uses place photos only as support.

**Signature components:** the hero **team mosaic**, the **essentials** list (was the key facts strip), the **hello** quote band (homepage key-worker band and Our team), **lanyard cards** (portrait, role, name, qualification chips, a coloured "lanyard" bar per team), the **team wall** of practitioners, the **Who to ask** list, the **grades panel** and the **key-worker points**.

**What it avoids (the rejected rounds and the research):**
- No rainbows, crayon or bubble fonts, clip-art suns, ABC blocks or cartoon animals [7.1].
- No stock or AI people, no illustrations of children, and no children's faces at all [5.2].
- No full-bleed hero photo, no text over photos, no carousels, no auto-play, no pop-ups [6.4, NNG-C, NNG-A].
- No trend devices: no oversized italic serif, no gradient, no animation.

The premium comes from consistent real portraits, a calm natural palette and careful information design [7.1].

## 2. Research and the decisions it drives

| Decision | Finding it comes from |
|---|---|
| On a 390 x 844 phone the first screen holds the name, one sentence with ages and area, and both actions. The essentials (ages, hours and weeks, funded hours, places, grades) follow on screen 2; the live status is in the visit band (spacious version). | Parents' first task is "Is this for us?": ages, hours, weeks, area, all visible without scrolling [2, top task 1]. Location and practical fit are the top reasons for choice [SG25-7]. |
| The team leads the page: a mosaic in the hero (the manager large, 4 leads small), the manager's welcome, 4 lanyard cards and a facepile, all on the homepage. | "Liked and trusted the staff" is the second reason for choice, 43% [SG25-7]. Users study photos of real people and ignore stock ones [NNG-P]. |
| Every card shows the person's role and every qualification exactly as the nursery publishes it, with a "What do the letters mean?" expander on the team page. | Parents are told to ask about qualifications [PC-C]. Avoid jargon such as "SCQF" without explanation [6.4]. |
| The key-worker system is explained as 4 short numbered points, in the nursery's own terms. | Parent Club: "Will my child have a key worker?" [PC-C]. Research 4.2: "Name the key-worker system". |
| A "Who to ask" list routes fees, food and allergies, progress and complaints to a face and a name. | Parents value open communication; dissatisfaction comes from generic communication [SG25-12]. Complaints go to the nursery first, then the Care Inspectorate [CI-CO]. |
| The grades panel shows all 4 grades with their exact headings, the inspection date and the report link, never the best one alone. | Parent Club tells parents to judge quality from the report [PC-Q]. Show every grade and the date [4.1]. Most prospects are an honest "Good" [1]. |
| One main action, **Book a visit** (a `tel:` link), with **Join the waiting list** as the secondary. The waiting list is "phone or email", with the minimum data listed and a "don't send health details" line. | Calls to action [6.3]. Waiting-list data is children's personal data; no website form without a compliant receiver [6.3, ICO-I]. |
| Fees and funding sit side by side with the grades on the homepage, and get their own page with a dated fee table. | "What will it cost?" is top task 3 [2]. Fees only "as supplied", dated [3.6]. |
| Funded hours: the nursery's own patterns, "apply through the council", the usual start dates table, and a link to mygov.scot for 2 year olds. No council dates are printed. | [MG-F], [MG-2], [PC-F]. Councils set exact dates, so link rather than print [3.1]. |
| Help with costs links to GOV.UK and mygov.scot and says "Ask us about paying". "We accept Tax-Free Childcare" appears only if confirmed. | [GOV-TFC], [GOV-UC], [MG-SCP], wording table [3.6]. |
| Menus, closures, policies and forms are HTML. PDFs are linked only as extras, labelled "(PDF)". | PDFs are hard to use on phones and go stale [GDS-PDF]. |
| A dated notice band (`data-show-from`, `data-show-until`) for closures and snow, never for marketing. | [6.2 item 5]. |
| Menu of 6: Home, Visit and join, Fees and funding, Our nursery, Our team, Parents. On phones "Visit and join" and "Fees and funding" stay visible beside a button labelled "Menu". | [6.1]. |
| Lora headings (a warm serif, headings only) and Nunito Sans body at 18 to 19px. Warm birch-white ground, pine green, one heather accent. | "Grown-up typography"; "warm neutrals, one confident accent colour" [7.1]. The birch-and-charcoal palette comes from the example nursery's own portrait backdrop. |
| Reading age 9 to 11, sentences of 20 words or fewer on the homepage, "8am to 6pm", days and months in full. | [6.5, GOVUK-S]. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts, quotes, bios or services.** Every name, role, qualification, hour, fee, ratio, policy and service comes from the nursery's site, its handbook or policies, its Care Inspectorate record in our data, or the job card. If unknown or unclear, write **"Phone to check"**. Section 3.6 of the research brief has the exact wording.
2. **People:**
   - Print names exactly as the nursery publishes them. If it uses first names only, use first names only, even if a PDF gives surnames.
   - Print qualifications exactly as published. Never add SSSC status, years at the nursery or room assignments unless supplied.
   - Never say which room a person works in, or which room a photo shows, unless the source says so.
   - Never write bios or "interests" that the nursery has not published.
3. **Quotes:** the manager's welcome and parent quotes must be verbatim from the nursery's own materials, credited ("From the welcome letter in our parent handbook", "Amy, a parent, on our testimonials page"). Never invent or "tidy" a testimonial.
4. **Ratios:** print the nursery's own stated ratios only. Otherwise "Ask us about staff ratios when you visit" [3.3].
5. **Grades:** from our Care Inspectorate data, with the headings of the report's framework (before 22 September 2025: care, play and learning; setting; leadership; staff team) [CI-QIF]. Never estimate or relabel a grade. Never use the Care Inspectorate logo.
6. **Conflicts:** when two sources disagree (website and handbook, or website and Care Inspectorate), print the nursery's own figure, add "Phone to check" where it matters, and list it in the facts to confirm.

### Photos and children
7. **Use only:** the nursery's own staff portraits (identity already public on its site), photos taken under `PHOTO-SHOTLIST.md`, and the nursery's own photos of empty rooms, garden, building and food.
8. **Never use** an image with an identifiable child, a child's name, a named peg or label, or a child in nappies, changing, washing or asleep, even if it is on the nursery's current site. Never use stock or AI people, illustrations of children, or clip art [5.2].
9. **Strip EXIF** from every image (re-saving as WebP does this).
10. **Consent:** before go-live the nursery confirms in writing that every person shown agreed. Anyone can opt out at any time and then shows as initials.
11. **Alt text:** a portrait's alt text is the name exactly as printed. When the name is printed right beside the photo (mosaic, facepile, Who to ask), use `alt=""`. Never describe appearance. Place photos describe what helps a parent picture the space ("A playroom with glass doors out to the garden").
12. **No text over photos.** Captions sit below on solid ground.
13. **Record every photo's source URL** in `img/CREDITS.txt`, plus what was excluded and why.

### Content style
14. Times as `8am`, `5:30pm`, `midday`; ranges with "to"; dates in full ("Friday 25 December 2026").
15. Nursery numbers are `tel:+44...` links, with `&nbsp;` in the visible number. Short numbers (999, 111) are plain text.
16. Homepage sentences 20 words or fewer; paragraphs 60 words or fewer; links start with a verb and make sense alone.
17. No jargon: no "pedagogy", "provocations", "in the moment planning", or unexplained "SCQF" [6.4].

### Accessibility (WCAG 2.2 AA)
18. **Contrast:** keep the checked token pairs (section 6). Re-check any colour you change: 4.5:1 for text, 3:1 for UI edges.
19. **Structure:** one `h1`; `h2` per section, `h3` per card; landmarks `header`, `nav[aria-label]`, `main#main`, `footer`; skip link first.
20. **Focus:** the yellow focus style in `styles.css`. Never remove it.
21. **Tap targets:** every standalone link is at least 44px tall on phones. Section 3 of `styles.css` covers links in `li` and `dd`, `p.link-line`, the footer, the ask list and the contents list. **Never put a link inside a sentence in a FAQ answer or card:** put it in its own `p.link-line` (the audit fails 24px inline links).
22. **Phone menu:** keep `aria-expanded` and `aria-controls="nav-list"` on `button.nav__toggle`, which sits in the header bar before the list so focus moves into the sheet. The sheet closes on Escape, on a link, and when focus leaves it.
23. **Header call link:** hidden under 40em (Phone is in the hero, the sheet and the visit band); the number from 40em; label and number from 64em. Never add an `aria-label` to it.
24. **Motion:** no animation; transitions are off under reduced motion; no smooth scrolling.
25. **200% text:** every grid uses `minmax(0, 1fr)`; tables scroll inside `.table-wrap`.

### Performance
26. **Budget:** under 1.2 MB desktop, 700 KB phone. After a full scroll the example weighs about 340 KB (home), 305 KB (team), 270 KB (our nursery), 175 KB (parents), 150 KB (fees) and 130 KB (visit and join), with no request to another server.
27. **Portraits:** 4:5 at 240 and 400px for cards, square at 96 and 160px for faces, WebP quality about 60, face in the upper third. `width`, `height` and `loading="lazy"` below the first screen; `srcset` and `sizes` on lead cards.
28. **Place photos:** 640 and 1080px (1280 for the building) WebP through `srcset`.
29. **Fonts:** only the two preloaded woff2 files.

## 4. Homepage structure (keep this order)

1. Inline SVG sprite (`svg.visually-hidden`, icons only), skip link.
2. **Header** `header.masthead`: `.masthead__top` with `a.brand`, `a.masthead__call`, `button.nav__toggle`; then `nav.nav > ul#nav-list` (6 items, then `li.nav__extra--book` Book a visit and `li.nav__extra--phone` Phone).
3. **Dated notice** `div.notice-strip[data-show-from][data-show-until]`: one link line, closures only. Optional.
4. **Hero** `section.hero > .hero__grid`: `h1`, `p.lede` (one sentence), `.actions` (`a.button` Book a visit, `a.phone-link` Phone), then `ul.mosaic` (`li.mosaic__lead` manager, 2 faces, 2 `li.mosaic__more` faces; names in `span.mosaic__name`, `alt=""`).
5. **The essentials** `section.section--white > .side-head`: `h2`, `ul.essentials` (5 `li`, each `span.essentials__icon`), `div.go` "All the details".
6. **Key worker** `section.section--pine > .kw`: `figure.kw__photo`, `h2.eyebrow`, `p.kw__promise`, `div.facepile` (decorative), `div.go`.
7. **Doors** `section.section--sand`: `h2`, `ul.doors` of 4 to 6 `a.door` (`span.door__img.ring--{team}`, `.door__label`, `.door__line`, `svg.door__arrow`).
8. **Visit band** `section.visit-band`: `h2`, one sentence, `.status[data-status]`, `.actions`.
9. Footer, then `script#nursery-hours`.

Every content section ends with exactly one `div.go` link. Words in `<main>`: 120 to 180 (hard maximum 200); hero up to 25, essentials lines up to 8, door labels up to 3 plus a line up to 8. Never put grades tables, team lists, FAQs, menus or steps on the homepage (S3).

### Responsive layout
Checked at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px with `viewports.mjs`: no flags on any page.
- **Spacious version:** 36em (mosaic 3 across), 40em (header number), 56em (`.side-head`, `.kw`, page band 2 columns), 60em (doors 2 across), 64em (desktop header and menu, hero 2 columns), 72em (doors as 3 tiles).
- **Original breakpoints, still used on inner pages** (em, so they follow text zoom): 30em, 36em (2-column grids, team wall), 40em (body 19px, wider gutter, breadcrumb trail), 48em (facts 3 across, ask list 2 across), 56em (`.split` 2 columns, lead cards stack vertically), 64em (desktop header and menu, hero 2 columns, facts 6 across), 72em (4 lead cards across).
- **Header:** under 30em the brand shrinks and the call button says "Call"; 30em to 63.99em shows the number; from 64em label and number sit as text on the right and all 6 menu items show.
- **Mosaic:** under 30em the 4 small faces become a 2 x 2 list of round faces with names; from 30em, 4 squares across.
- **Lanyard cards:** horizontal (photo left) on phones and tablets; vertical (photo on top) from 56em, 3 across, 4 from 72em.
- **Team wall** (`.lanyards--team`): rows on phones, then a portrait wall with `auto-fill, minmax(12rem, 1fr)` (5 across at 1280px).
- **Gallery:** first photo full width and two below on phones; 3 across from 64em. An odd last item spans the row on tablets.

## 5. Components

| Class | Use |
|---|---|
| `.masthead`, `.brand`, `.brand__mark`, `.masthead__call`, `.nav`, `.nav__toggle` | Header and menu. |
| `.status[data-status]`, `.pill`, `[data-status-word]`, `[data-status-detail]` | Live "Open now" status. |
| `.actions`, `.button`, `.button--secondary` | The two main actions. |
| `.facts` (`.facts__wide`) | Original key facts strip. Not used in the spacious example; use `.essentials`. |
| `.mosaic`, `.mosaic__lead`, `.mosaic__text`, `.mosaic__name`, `.mosaic__role` | Hero team mosaic. |
| `.hello`, `.hello__sign`, `.hello__source` (`.hello--photo` + `.hello__photo`) | Manager's welcome. Use the photo variant only if the manager is not in the mosaic. |
| `.points` (`--four`) | Numbered explainer (the key-worker system). |
| `.lanyards` (`--lead`, `--team`), `.lanyard`, `.lanyard__photo` (`--initials`), `.lanyard__role`, `.lanyard__name`, `.quals` (`--none`) | Staff cards. `--lead` for managers and room leads, `--team` for the wall. |
| `.team-group[data-team]`, `.team-group__head` | Group heading with its colour key square. |
| `[data-team=lead/room/practice/support]` | Sets `--team` and `--team-tint` for the lanyard bar, chips and initials. Decorative only; the role is always in words. |
| `.face`, `.face--initials`, `.facepile` (`--large`), `.team-more` | Faces at 44 to 64px. |
| `.ask` | Who to ask: face, topic, who, link. Single column inside a `.split`. |
| `.rooms` (`--three`), `.room`, `.room__photo`, `.room__facts` | Rooms by age. `.room__photo` only when the source says which room a photo shows. |
| `.gallery` | Static photo grid with solid captions. Never a carousel. |
| `.grades`, `.grades__list`, `.grades__num`, `.grades__scale` | Care Inspectorate grades panel. |
| `.steps`, `.step__who` | Numbered steps; `.step__who` adds the face of the person who does that step, when the nursery says who. |
| `.quote` (`--follow`) | A parent's or manager's published words. |
| `.notice`, `.notice-band` | Dated notice. |
| `.task-list` (`--four`), `.task`, `.task__link` | Current-parent task cards; the whole card is the target. |
| `.inset`, `.card`, `.card--flag`, `.callout`, `.details`, `.questions`, `.summary-list` (+ `.contact-box` container), `.table-wrap`, `.table` (`--menu`), `.dates`, `.place` (`--wide`, `--portrait`), `.action-link`, `p.link-line`, `p.checked` | Content patterns. |
| `.page-head`, `.page-head__grid`, `.page-head__art` (`--portrait`), `.breadcrumb` (`.breadcrumb__home` for sub-pages), `.contents` | Inner-page band and "On this page". |
| `.notice-strip`, `.essentials`, `.essentials__icon`, `.side-head`, `.kw`, `.kw__promise`, `.doors`, `.door` (`__img`, `__img--faces`, `__kicker`, `__label`, `__line`, `__arrow`), `.ring--lead/room/practice/support`, `.next`, `.visit-band`, `.go`, `.phone-link`, `.icon`, `.details--small` | Spacious components (section 13). |
| `.split` (`--even`, `--wide-right`), `.grid-2`, `.grid-3`, `.stack-top` | Layout. |

**Team colours.** Pine for managers, heather for room leads, ochre for practitioners, slate for office, kitchen and apprentices. Keep the same mapping across nurseries. For a baby room, room leads keep heather.

## 6. Tokens and re-theming

All tokens are in section 1 of `styles.css`. Every pair below was measured.

| Token | Default | Checked pair |
|---|---|---|
| `--colour-ink` | `#1d2521` | 14.4:1 on paper, 12.9:1 on sand, 13.1:1 on pine tint, 15.7:1 on white |
| `--colour-ink-soft` | `#4b544f` | 7.2:1 paper, 6.4:1 sand, 6.5:1 pine tint, 7.8:1 white |
| `--colour-paper`, `--colour-surface`, `--colour-sand` | `#f8f5ef`, `#fff`, `#efe8dc` | Grounds |
| `--colour-brand` / `--colour-link` / `--colour-button` | `#1f5c45` pine | 7.2:1 paper, 6.4:1 sand, 7.9:1 white; white text on it 7.9:1 |
| `--colour-brand-dark` | `#143d2e` | White text 12.1:1 (footer, callout); 10.1:1 on pine tint |
| `--colour-brand-tint` | `#e2ede6` | Ground for the pine sections and chips |
| `--colour-accent` | `#8e3a5c` heather | 6.6:1 paper, 5.9:1 sand, 7.2:1 white (eyebrows, notice border, quote rule) |
| `--colour-link-visited` | `#5c3a6d` | 8.5:1 paper |
| `--colour-line-strong` | `#7f786d` | 4.4:1 white, 4.0:1 paper (edges that must be seen) |
| `--colour-focus`, `--colour-focus-text` | `#ffdd00`, `#0b0c0c` | 14.5:1. **Never change.** |
| `--colour-open-*`, `--colour-closed-*` | Pale ground, dark text | 9.9:1, 12.4:1 |
| `--team-*`, `--team-*-tint` | Pine, heather, ochre, slate | Ink on every tint 12.3:1 or more |
| `--font-head`, `--font-body` | Lora, Nunito Sans | Weights 600 (head), 400 and 700 (body) |
| `--fs-*` | 18px body on phones, 19px from 40em; h1 32 to 52px | – |
| `--space-1` to `--space-8` | 4px to 72px | – |
| `--radius`, `--radius-card`, `--radius-photo` | 6, 12, 14px | – |
| `--page-max`, `--measure`, `--gutter`, `--tap` | 72rem, 38rem, 18px or 32px, 44px | – |
| `--face-s/m/l` | 2.75, 4 and 5.5rem | – |

### Re-theming for a new nursery
1. Copy `example/` to a new folder beside `styles.css`, so `../styles.css`, `../keyworker.js` and `../fonts/` resolve.
2. **Colour:** change only `--colour-brand`, `--colour-brand-dark`, `--colour-brand-tint` and `--colour-accent` to the nursery's colours, darkened until the pairs above still pass (brand and accent 4.5:1 on paper and sand, white 4.5:1 on brand). Keep `--colour-button` equal to `--colour-brand`. Never change focus or status tokens. Never use primary-colour rainbows, even if the logo has one: take one colour from it.
3. **Mark:** the `.brand__mark` disc holds the nursery's initials. If the nursery supplies its logo as a vector, inline it as SVG in the disc's place; never `<img src="….svg">`.
4. **Content:** replace every Heads of Ayr fact. `grep -n "Heads of Ayr\|01292\|KA7\|Alloway\|South Ayrshire\|Kerri\|Rankin" *.html` must return nothing afterwards.
5. **People:** rebuild the mosaic, lanyards, wall and ask list from the nursery's own team list. Count people exactly ("21 people work here").
6. **Hours:** rewrite `script#nursery-hours`, the essentials hours line, the visit band status text and the footer together.
7. **Footer:** registration line from the data (`registered`, `provider`), review dates (today, and today plus 6 months).

## 7. Hours, closures and notices

```json
{
  "timezone": "Europe/London",
  "weekdays": [1, 2, 3, 4, 5],
  "hours": { "from": "08:00", "to": "18:00" },
  "closures": [ { "from": "2026-12-25", "to": "2027-01-04", "label": "Closed for Christmas" } ]
}
```

- The pill says "Open now" (green) with "We close at 6pm today.", or "Closed now" / the closure label with "Opens today at 8am.", "Opens tomorrow…", "Opens on Monday…", or the full date if it is a week or more away.
- Tested with Playwright's clock: Tuesday 7:59am, 8am and 5:59pm; Friday 7pm; Saturday; Christmas Eve evening; Christmas Day; Monday 4 January 2027; Tuesday 5 January 2027. All correct.
- `li[data-date="YYYY-MM-DD"]` in a `.dates` list hides after that date; an empty list says "No upcoming closures are published. Phone to check."
- `[data-show-from][data-show-until]` shows a notice only between those dates (inclusive). Without the script it always shows, so write notices that are safe to show early.

## 8. Fallbacks: full photos, a group photo, or none

The template must look intentional in all three states.
1. **Full photo set** (the example). Anyone without a portrait gets `.lanyard__photo--initials` (a 4:5 tinted tile with initials in Lora) or `.face--initials`.
2. **One group photo, no portraits.** Put it in a `figure.place.place--wide` at the top of the team preview and the team page, with a caption naming people left to right. Everything else uses initials. Never crop individuals out of a group photo.
3. **No photos.** Every lanyard uses `.lanyard__photo--initials`. Replace the hero mosaic with the manager's name and role and a `ul.facepile.facepile--large` of `.face--initials`, and drop the hello band's face. Retitle the team preview "Who works here" and sell the photo shoot (`PHOTO-SHOTLIST.md`). Front Desk Nursery may suit better.

Initials are the first letters of the first and last names as printed (a first name alone gives one letter). They are `aria-hidden`, because the name is printed beside them. The "KW" disc in the ask list and settling-in steps stands for "key worker", not a person.

## 9. Adapting for a baby room or a larger nursery
- **Baby room:** add a room card ("Ages 0 to 2", places and the nursery's stated ratio) and a lanyard group for the baby-room team. Put safe sleep, feeding and nappy changing on Our nursery, from the nursery's own policies only. The under-2s ratio is not verified in our research, so print only the nursery's figure [3.3].
- **Room teams:** when the nursery says who works in which room, add a facepile of that room's team to each `.room` card (`.room__body` before the last paragraph) and group the team page by room instead of by role.
- **Years of service, SSSC:** when supplied, add `p.lanyard__facts` under the chips ("At the nursery since 2021 · SSSC registered").
- **More than 30 staff:** keep lead cards for managers and room leads only; everyone else goes on the wall.

## 10. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the nursery's site, handbook, policies, Care Inspectorate record or the job card. Conflicts are flagged.
- [ ] Funded status confirmed with the nursery, and with the council's provider list where there is one [8].
- [ ] Grades, their headings and the date match the latest Care Inspectorate record; the report link resolves.
- [ ] Fees, places, hours, closures, ratios, qualifications and SSSC status are as supplied, or say "Phone to check".
- [ ] The hours JSON, essentials, visit band and footer agree; the status is tested at the section 7 times.

**People and photos**
- [ ] Written consent for every person shown; opt-outs show as initials.
- [ ] No identifiable child, no child's name, no named pegs or labels in any image; EXIF stripped.
- [ ] Alt text is the name, or empty where the name is printed beside it.
- [ ] Quotes are verbatim and credited; the nursery has approved them.
- [ ] `CREDITS.txt` lists every source URL and what was excluded.

**Content and accessibility**
- [ ] On a 390 x 844 phone, the name, lede and both actions show on the first screen; the essentials follow within 2 screens. Homepage: 6 screens or fewer, 120 to 180 words in `<main>` (`density.mjs`, `words.mjs`).
- [ ] Menu of 6 items; "Visit and join" and "Fees and funding" stay visible on phones.
- [ ] Menus, closures and forms are HTML; PDFs labelled.
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or trackers.
- [ ] `node pipeline/audit.mjs http://127.0.0.1:<port>/example/ <out>` reports **0 blockers, 0 major, 0 minor** across every page.
- [ ] `node pipeline/viewports.mjs` on every page shows no flags; screenshots reviewed by eye.
- [ ] Every external link returns 200 (`curl -sL -o /dev/null -w "%{http_code}"`).
- [ ] After changing the template, re-run `node pipeline/template-thumbs.mjs nursery/key-worker-spacious`.

## 11. Heads of Ayr example: facts to confirm with the nursery

- **Places and ages:** the website and handbook say 57 children aged 2 to 5 (25 in the Sunshine Room, 32 in the Rainbow Room). The Care Inspectorate data says 106 places and that under-3s are cared for. The pages use the nursery's figures and say "Phone to check" for places and for younger children.
- **Inspection:** the latest Care Inspectorate grades in our data are 4 (good) in all 4 areas, inspected 30 March 2022 and published 5 August 2022. HM Inspectors also inspected on 8 October 2024 (linked, no grades shown). Check whether a newer Care Inspectorate report exists, and that `careinspectorate.scot/find-care?detail=CS2020380758` still resolves.
- **Funded hours:** the website and handbook say the nursery is in partnership with South Ayrshire Council and offers 1,140 hours in 3 patterns. Funded places for eligible 2 year olds are not mentioned, so the page says "Phone to check". The council's own ELC page blocked automated checks, so the page links to mygov.scot; add the council link once a person has checked it.
- **Fees:** £73 full day, £42 half day, booking fee £30 or £60, late collection £10 per 10 minutes, late payment £20. The fee list is undated. The website says fees are paid monthly; the handbook says weekly or monthly. "Minimum 2 full days" sits under the 2 to 3 year olds paragraph in the handbook, so it may apply only to that room.
- **Tax-Free Childcare:** not mentioned by the nursery; the page says "Phone to check".
- **Closures:** only the Christmas closure is published (25 December 2026 to reopening on 5 January 2027), with a note that dates differ by room.
- **Weeks a year:** the handbook says 51 weeks; fee calculations use 51 weeks (2 to 3) and 50 weeks (3 to 5).
- **Names:** the website gives first names only, and the pages follow it. The handbook gives surnames, and differs: it lists "Holly Pririe" but not Rachel, and calls Rochelle "Office Administrator" (the website says "Admin Co-ordinator"). Kerri Miller's surname is used because it is on her Care Inspectorate record and the handbook. Confirm the current team list.
- **Room leads:** the website names Fern and Steph as room leads but not their rooms. The pages say "Ask us which room each of them leads."
- **Photos of rooms:** the source does not say which room each playroom photo shows, so the pages do not name the room.
- **Qualifications:** printed as the website lists them; "PDA (Pending)" is shown as "PDA (pending)". The "What do the letters mean?" definitions are our plain-English summaries; ask the nursery to check them. SSSC registration is not published, so it is not shown.
- **Who to ask:** routes follow the handbook (fees and funding: "a member of staff in the office"; allergen information: the kitchen; progress: management and the key worker; complaints: Kerri, then the Care Inspectorate). Confirm Rochelle is the right office contact.
- **Quotes:** Kerri's welcome is from the handbook letter signed by Kerri Miller and the Rankin family. Parent quotes (Amy, Eilidh, and one unattributed) are from the testimonials page; confirm the parents agreed to be quoted.
- **Waiting list:** the nursery runs a first-come, first-served waiting list but does not publish how to join; the page says phone or email and lists the minimum details to give (our recommended wording, from research 6.3).
- **Parking:** the handbook says "our own car park and driveway". Disabled access details beyond "ramp access" and a disabled bathroom are not published.
- **Phone answering hours:** the pages say "Phone us, Monday to Friday, 8am to 6pm" from the opening hours; confirm the office answers throughout.

## Inner pages

The example is a 6-page site. Redesign study writes a `pages` site map; Build makes every page on it. Copy these patterns; do not invent new ones.

| Page | Holds |
|---|---|
| `index.html` | Section 4. |
| `our-team.html` | How key workers work (with a parent quote), Managers (lead cards), Room leads (lead cards), Early years practitioners (team wall), Office, kitchen and apprentice (team wall), "What do the letters mean?" expander, Questions about our staff (checks, ratios, safeguarding, SSSC, first aid) beside a Work with us card (`#jobs`). |
| `join-us.html` | Book a visit (Parent Club's questions, callout), Join the waiting list (minimum details, booking fee card), Settling in (steps and a parent quote), What to bring (two cards), Starting with funded hours (usual start table, link, funded card), Questions about joining. |
| `fees-and-funding.html` | Fee table with a "checked" line, Other charges, What is included (food photo), How fees work (with a conflict inset), Funded hours (the nursery's patterns, how to apply, 2 year olds), Help with childcare costs (3 cards), Questions about fees beside the office contact. |
| `our-nursery.html` | Rooms (room cards with folds, gallery), Outdoors and animals, A day at nursery (steps and a parent quote), Seeing your child's day, Food (a short summary linking to `food.html`), Sleep and care (3 cards), Support for every child (with an ask item). |
| `food.html` | Sub-page of Our nursery: Cooked here (lunch photo), Allergies and special diets (inset, Lindsey's ask item), A sample week (table in an accordion). |
| `parents.html` | Closure dates (`.dates`), If we have to close, Illness and medicine, Dropping off and collecting, Paying fees, Complaints (2 steps, Care Inspectorate link, ask item), Our plans and reports (PDF links, labelled). |

### Rules for every inner page
- **Same shell everywhere.** Header, menu and footer are identical on every page; only `aria-current="page"` moves. The example pages were assembled from one shell, so copy `index.html`'s header and footer byte for byte.
- **Page band:** `div.page-head > .wrap.page-head__grid` holding `nav.breadcrumb` ("Home › Page" from 40em, "‹ Back to Home" on phones; sub-pages say "‹ Back to Our nursery"), one `h1` of up to 6 words, a `p.lede` of up to 35 words, one action (`a.phone-link`), and a photo or the team facepile unique to the page. Then `nav.contents.wrap` ("On this page", up to 7 links) for 3 or more sections.
- **Sections** are 120 words or fewer plus at most one list, table or image; long detail goes in `details.details`. A page past about 900 words splits into a sub-page (as Food did).
- **End of page:** `nav.next` (a `.door` with "Next") then the visit band, identical on every page.
- **Sections** alternate paper, sand and pine; `h2` per section, `h3` per card.
- **FAQs:** `div.questions` of `details.details`, 4 to 7 questions, answers of one to three short paragraphs. Links in answers go in their own `p.link-line`.
- **Tables:** inside `div.table-wrap[tabindex=0][role=region][aria-labelledby]` with a `caption`, followed by a `p.checked` line saying where the figures came from and when.
- **File names:** as in the research page set [6.1]: `join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html`, all beside `index.html`.
- **Check:** the audit crawls every linked page and must report 0 / 0 / 0. Run `viewports.mjs` on every page.
