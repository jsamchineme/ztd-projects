# Front Desk Nursery, spacious: a website template for independent Scottish nurseries

## Spacious version (read this first)

This folder (`templates/nursery/front-desk-spacious/`) is the **spacious version** of Front Desk Nursery (`templates/nursery/front-desk/`, left unchanged so the owner can compare them side by side). It answers the owner's feedback on the originals: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."* The spec is the **space brief, rules S1 to S13**, in `prospects/research/nursery-spacious-directions.md` (Part 2). Read it before changing any spacing.

Same nursery (Clarkston), same palette, fonts, mark, voice, live term-aware status, grades meter, timeline, team cards and every fact and photo. Nothing was deleted: what left the homepage moved to an inner page or into an accordion.

**What changed and why**
| Change | Rule |
|---|---|
| Gutters 24px on phones, 40px from 600px, 64px from 1024px; content 1,120px at most (`--gutter`, `--wrap: 78rem`). | S1 |
| Section padding `--section: clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80px phone, 128px at 1280). Heading to body 16 to 20px, body to action 32px (`.go-row`), groups 48/64px (`--group`). | S2 |
| Homepage cut from hero + 8 sections (12 screens) to **hero + 4**: At a glance → Choosing a nursery (doors) → For parents → Book a visit band. | S3 |
| Hero holds only the status, name, one sentence, Book a visit and Phone. On phones the church-hall arch (the logo idea, drawn large) fills its foot; the garden photo still shows from 56em. | S2, S12 |
| The 5-cell **key facts strip** became **"At a glance"**: 5 lines, each ≤ 8 words with an icon disc, hairline dividers, no sub-notes, one "See all the details" link. | S9, S6 |
| The 6 **answer cards** became **4 doors** (Visit and join, Fees and funding, Our nursery, Our team). Each door keeps the Front Desk idea of the answer printed on the card, as a line of ≤ 8 words ("Free with funded hours, or £21.50 a session"). Full-width white bands on phones (one per row, ≥ 96px, 32px apart), cards 2 by 2 from 64em. | S9, S6, S7 |
| The boxed green **parents panel** with 4 tasks became a full-width green band: the live next-closure line and one door link to Parents. | S5, S9 |
| Grades panel, day timeline, team cards, settling-in steps, What to bring, contact list and opening-times card left the homepage (all already on inner pages, except the contact and opening times, which moved to **Visit and join → Find us and opening times**). The homepage dated notice moved to Parents (the live status pill already says the same on the homepage). | S3, S9 |
| One action wording: **Book a visit** (green `.btn`, to `join-us.html#visit`) and **Phone 07906 954441** (`.phone-link`) in the hero and the end band. On Visit and join itself Book a visit stays a `tel:` link. "Join the waiting list" now lives behind the Visit and join door. | S13 |
| Body text 18px on phones (20px from 48em), line height 1.6, lines ≤ 60ch (`--measure`). | S8 |
| Phone menu: no inline items under the logo (the two "keep" items are gone on phones); Menu opens 56px rows ending in Book a visit. From 60em the row ends in a Book a visit button. | S11 |
| Inner pages: the same page head on every page (breadcrumb, H1, lead, one action, an arch drawing with the page icon), then "On this page" as a 48px-row list (≤ 7 items), sections ≤ 120 words with long detail in `.details` accordions, then a **Next** door and the Book a visit band. Parents went from 9 sections to 7. | S10 |

**Space figures** (390 × 844 phone, `density.mjs` and a words-in-`<main>` count, 14 October 2026, with the October holiday notice live):
| Homepage | Original | Spacious |
|---|---:|---:|
| Length | 9,982px | 4,558px |
| Phone screens | 12 | 6 |
| Words in `<main>` | 873 | 158 |
| Sections after the hero | 8, plus a notice band | 4 (the last is Book a visit) |
| Text blocks / boxes on the first screen | 13 / 10 | 4 / 3 |
| Text blocks per screen (average) | 10.5 | 5.5 |
| Boxes per screen (average) | 3.4 | 1.2 |

Content screens hold ≤ 6 text blocks and ≤ 1 content H2 each (screens 1 to 4: 4, 6, 5, 3). Screen 5 counts 10 because it holds the Book a visit band and the top of the footer, whose headings and links are required (section 3). Inner pages: Visit and join 765 words, Fees and funding 728, Our nursery 888, Our team 446, Parents 774 (visible, accordions closed).

**Keep it spacious when you build a nursery:** don't add homepage sections, cells or answer cards back. A new fact goes on an inner page; if a section passes 120 words, fold the detail into `.details`. The phone section spacing (`.section--glance`, `.section--doors` in section 10 of `styles.css`) is tuned so each homepage section starts on its own phone screen; re-run `density.mjs` after changing homepage copy.

---


> Pipeline name: **Front Desk Nursery, spacious** (folder `templates/nursery/front-desk-spacious/`; the original is `templates/nursery/front-desk/`). It belongs to the **Front Desk** family (GP `practice/front-desk-gp`, Dental `practice/front-desk-dental`, Local `practice/front-desk-local`): task-first, little imagery, answers printed on the page. Its siblings for nurseries are Key Worker (people-led, Familiar Faces family) and Garden Gate (place-led, Doorway family). When this brief says "Front Desk", it means this template.

**The idea in one line:** the homepage does what a good nursery office does at the door. It says who the nursery is for and whether it's open today (or closed for the holidays) on the first phone screen, then what it costs, how good it is and how to visit in five short lines, and then opens the doors to the detail. Current parents get one green band with the next closure and a door to their page.

It is the "after" in a before-and-after pitch, and the system AI build workers reuse for every nursery that suits it. It looks premium because of how calmly and honestly it presents evidence: dated grades with every heading shown, dated fees, real staff with their qualifications, a live term-aware status, and "phone to check" wherever a fact is unknown. There are no rainbows, crayon fonts, clip art, cartoon animals or stock toddlers.

The research behind every decision is `prospects/research/nursery-websites.md` (13 October 2026). Section numbers like **§6.2** and source tags like **[SG25-7]** below point into it. Read it once before your first build.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `frontdesk.js` | About 170 lines of plain JavaScript, no dependencies. It runs the phone menu, dated notices, the live term-aware status, the "Today" row, the "Now", "Next" and "past" marks on term dates, and the next-closure line. | Never. It reads its data from the page |
| `fonts/` | Atkinson Hyperlegible Next (variable, body text) and Source Serif 4 (variable, `h1` and `h2` only), Latin and Latin Extended subsets as woff2. SIL Open Font Licence in `fonts/OFL.txt`. | Never |
| `example/index.html` | Worked homepage for **Clarkston Nursery**, a real parent-run charity nursery in Clarkston, East Renfrewshire, built only from its own website, its 2026/27 handbook and its Care Inspectorate record. | Copy it for each nursery |
| `example/join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html` | The five worked inner pages, one per menu item. | Yes |
| `example/img/` | The example's one photo (the garden, WebP and JPEG at 720 and 1200px) and `CREDITS.txt`, which also lists every photo on the old site that was **not** used and why. | Each nursery gets its own `img/` |
| `thumb.jpg` | Picker thumbnail. Regenerate with `node pipeline/template-thumbs.mjs nursery/front-desk-spacious`. | After changes |

Pages link `../styles.css` and `../frontdesk.js`, and fonts load from `../fonts/` through the stylesheet. Keep that folder shape. No build step, no framework, and nothing loads from another server: no Google Fonts, no CDNs, no analytics, no maps, no social embeds (GDPR, §6.6).

---

## 1. Concept, and what it avoids

Most nursery sites in our sample lead with primary-colour rainbows, bubble fonts, clip-art suns and stock smiling toddlers, often in an auto-playing slider (§7.1). They say nothing about the nursery, and they bury the four things parents are judging: fit, cost, quality and trust.

Front Desk Nursery goes the other way:
- **Answers before atmosphere.** The hero says, in one sentence, who the nursery is for, its hours and its weeks. A key facts strip answers "Is this for us?" in five cells: ages, hours, funded status, places, grades.
- **Live and honest.** The status pill knows term time: "Open now. Home time is 3pm", "Closed now. Opens tomorrow at 9am", or "Closed for the October holiday. Opens on Monday 19 October at 9am".
- **Evidence presented calmly.** Every grade from the latest report with its date and a link, dated fees, named staff with qualifications and years at the nursery.
- **Two audiences, clearly split.** Prospective parents get the hero, the facts and "Choosing a nursery". Current parents get one deep-green panel with closures, absence, lunch and fees.
- **Premium through restraint.** Warm paper ground, one garden-green brand colour, a grown-up serif for the two top heading levels only, a highly legible sans for everything else, an exact rhythm, real information design (grades meter, routine timeline, term table with "Now" and "Next"), and one real photo of the place.

It is not re-skinned NHS. A nursery isn't an NHS service, so it drops NHS Blue and NHS components. It keeps the public-service patterns parents already trust from GOV.UK and mygov.scot: the yellow focus state, the green main button, link blue, plain English and "On this page" contents.

## 2. Research-to-design decisions

Each decision and the finding that drives it. If a client asks for something that breaks one, show them the finding.

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Hero sentence, then "At a glance"** answer "Is this for us?" first: ages, hours, funded hours, places and grades in 5 lines straight after the hero (spacious version: a list, not a facts grid, S9). | Location (52%) and practical fit are the top reasons for choosing [SG25-7]. No local places (19%) and inflexible hours (14%) are the top barriers [SG25-9]. Top task 1 must be visible without scrolling (§2). |
| 2 | **One green main action, "Book a visit"** (a phone link), with "Join the waiting list" as the outlined second action. No form unless the nursery has a compliant way to receive it. | §6.2 item 4 and §6.3. Waiting-list forms collect children's personal data and need a privacy notice at the point of collection [ICO-I]; templates are static, so phone or email is the default. |
| 3 | **Doors with the answer printed on them** (spacious version: 4 doors, each with an answer line of ≤ 8 words; the full answers live on the inner pages). | Parent Club tells parents to ask exactly these questions [PC-C]. Direction A in §7.2 asks for task cards with the answer on them, so many parents never need to click. |
| 4 | **Grades panel** showing *every* grade from the latest report with the inspection date, publication date, a 6-point meter and a "Read our latest inspection report" link. Designed for an honest "good". | Parent Club tells parents to judge quality from the inspection report [PC-Q]. 73% of our prospects' lowest grade is 4 (§1). Never show only the best grade; upheld complaints are public anyway [CI-P] (§4.1). |
| 5 | **"For parents at [nursery]" band**: the live closures line ("Closed now for the October holiday. Back on Monday 19 October.") and one door to Parents, where absence, lunch and fees are answered. | Current parents' tasks (§2): closure notices, holiday dates, menus, forms, fees. Facebook-only updates exclude parents and grandparents (§6.4). |
| 6 | **Live, term-aware status** from a schedule with term dates and closures, in UK time. | "Opening hours with the current period marked, reusing Front Desk's live status" (§7.1). Holiday cover is a top-3 barrier [SG25-9], so holidays must be obvious. |
| 7 | **Dated notice band** (`data-show-from` / `data-show-until`) in the page flow, never a pop-up, only for closures, snow or deadlines. | §6.2 item 5. 27% of people who met an overlay first struggled to get past it (GP benchmark, §6.4). |
| 8 | **Routine timeline** ("A day at nursery") with times only where supplied. | Parents ask about the day, food, sleep and outdoor time [PC-C]. Information design reassures (§7.1). |
| 9 | **Team cards** with name, role, qualification, SSSC registration, year qualified, years at the nursery and usual days, plus a "What the letters mean" expander. Initials, not photos, by default. | "Liked and trusted the staff" is the second reason for choice, at 43% [SG25-7]. Parents are told to ask about key workers and qualifications [PC-C]. Direction A needs no photos of people (§7.2). |
| 10 | **Fees and funding page**: funded hours first (with the council's own process), then a dated fee table with "Last checked", then voluntary extras labelled optional, then Tax-Free Childcare and Universal Credit as links. | §3.1 and §3.4. Funded providers can't charge top-up fees for funded hours, and extras must be optional [FFC-2]. Link to GOV.UK rather than calculate, because caps change each April. |
| 11 | **Settling in as numbered steps**, only as the nursery describes them. | §4.4; parents ask about settling in [PC-C]. |
| 12 | **One real photo** of the place (the garden), desktop-only on the homepage, and on the Our nursery page. No people. Phones never download the hero photo. | Users ignore generic stock people but study real places [NNG-P]. Photo rules §5.2: lead with rooms and garden, not children's faces. Direction A needs at most one exterior photo. |
| 13 | **Six-item menu** (Home, Visit and join, Fees and funding, Our nursery, Our team, Parents) plus Book a visit. On phones everything sits behind a button labelled "Menu", with no hamburger icon (spacious version, S11: no inline items under the logo). | §6.1, following the GP brief: a word, not an icon, and the two most-used items always visible. |
| 14 | **Calm, homely palette**: warm paper `#F8F6F1`, garden green brand, one decorative accent in the logo only. **Grown-up type**: Source Serif 4 for `h1`/`h2` only (one weight) and Atkinson Hyperlegible Next for everything else. | §7.1: warm neutrals, one confident accent, natural photos; a humanist sans for body text, optionally one warm serif for headings only, two weights at most; no crayon or bubble fonts. Atkinson suits grandparents with low vision (distinct I, l and 1; a 0 that differs from O). |
| 15 | **Plain English at reading age 9 to 11**: "you" and "we", sentences of 20 words or fewer on the homepage, "9am to 3pm", days and months in full, verb-led links. | §6.5 [GOVUK-S]. Avoid "pedagogy", "provocations" and unexplained "SCQF" (§6.4). |
| 16 | **No pop-ups, carousels, auto-play, chat widgets, social feeds, map embeds or trackers**; a "Get directions" link instead of a map. | [NNG-C], [NNG-A], [ICO-PECR], §6.4 and §6.6. |
| 17 | **Footer**: Care Inspectorate record, complaints (nursery process then the Care Inspectorate route), policies, charity register, help for families, "Page last reviewed" and "Next review due". | §6.1 footer list; [CI-CO]. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, policy and service must come from the nursery's current site, its handbook or documents, or its Care Inspectorate record (`prospects/nursery/data/*.json` and the datastore CSV in `prospects/nursery/source/`).
   - The list in §3.6 of the research brief is binding: never invent fees, availability, funded status, grades, report dates, ratios, staff, qualifications, SSSC status, menus, allergen handling, hours, closures, policies, awards, reviews, "forest school", "Gaelic medium", languages, ASN specialisms, apps, CCTV, parking or access features.
   - Use the "Otherwise write" wording from §3.6 when something is unconfirmed: "Phone us to check for places", "Phone us for our current fees", "Ask us about staff ratios when you visit".
2. **Grades:** show every grade from the latest report, with the exact headings and dates of that report. Don't relabel them, don't show only the best one, and never use the Care Inspectorate logo. If any grade is 3 or below, still show it and link the report (§4.1).
3. **Funded status changes** (§3.1). Confirm it with the nursery and, where possible, the council's provider list, at build time. Only write "We're a funded provider for [council] for [ages]" when confirmed.
4. **Where sources disagree** (old website versus new handbook, handbook versus Care Inspectorate), use the newest dated source, and list the disagreement in your report. If it affects money, write "Phone us for the current amount".
5. **Dates:** term dates go in the term table *and* the schedule JSON, and they must match. Check each date's weekday with a script before you publish.

### Photos (research brief §5)
6. **No identifiable children, ever.** No faces, names, name pegs, nappies, changing, bathing or sleeping. Treat any old-site image with a child in it as excluded.
7. **Allowed:** empty rooms, the garden, the entrance, food as served, children's own artwork (no names), hands at work, and staff with their own written consent.
8. **Never** stock or AI-generated children or staff, clip-art children, or "happy toddler" illustrations.
9. Strip all metadata (EXIF, location). Record every photo's source, and every rejected photo with the reason, in `img/CREDITS.txt`.
10. The template must look complete with **no photos at all**: remove `.hero__photo` and the hero becomes one column.

### Content style
11. **Times and dates:** `9am`, `12:30pm`, `midday`; ranges with "to" ("9am to 3pm", "Friday 9 to Friday 16 October"); days and months in full.
12. **Phone numbers:** nursery numbers are `tel:+44…` links shown as written locally ("07906 954441"). Short numbers such as 999 are plain text in `<strong>`, never links.
13. **Links start with a verb** and make sense on their own. Contents lists, menus and breadcrumbs are navigation, so they are labels.
14. **Homepage sentences** are 20 words or fewer. **Section paragraphs** are 60 words or fewer.
15. **Pop-ups:** none of any kind. A cookie notice, if a live site ever needs one, sits in the page flow.

### Accessibility (WCAG 2.2 AA)
16. **Contrast:** keep the token pairs in section 7. Re-check any colour you change: text 4.5:1, UI edges and focus 3:1.
17. **Structure:** one `h1` per page, then `h2` per section, `h3` inside, `h4` for names inside a grouped list. Never skip a level. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. The skip link is the first element in `body`.
18. **Focus:** the GOV.UK focus style (yellow with a black bar) comes from `styles.css`. Never remove it.
19. **Tap targets** are 44×44px or more. Stand-alone links use `.go`. Phone numbers and emails in panels use `p.phone-line`, which gives the link 44px. A link inside a running sentence is exempt.
20. **Menu:** keep `aria-expanded` and `aria-controls="site-nav"` on `.menu-toggle`; Escape closes it; `li.nav__item--keep` marks the two items that stay visible on phones.
21. **Grades meter** is `aria-hidden="true"`. The words ("4 Good") carry the meaning.
22. **Motion** only inside `prefers-reduced-motion: no-preference`. Everything is in rem and em and is tested at 200% text.

### Known quirks of the in-house audit
23. Facebook and some council sites (East Renfrewshire uses a bot wall) refuse automated checks. Facebook returns a "400" minor, so don't link it from the footer; council links show "couldn't be verified" as information only. Check those by hand in a browser.
24. Inline SVG logos. Never use `<img src="….svg">` for text-only SVGs.
25. Don't embed maps; link to directions (`https://www.google.com/maps/search/?api=1&query=…`).

### Performance
26. Homepage under about 1.5 MB (§6.6). The example weighs **152 KB on a phone and 193 KB on desktop**.
27. Photos: crop to 4:3, save at 720px and 1200px wide, WebP at quality 60 to 65 plus JPEG at about 72, metadata stripped. Below-the-fold `<img>` gets `loading="lazy"`, `width` and `height`.
28. The homepage hero photo uses `<source media="(min-width: 56em)">` with a 1px placeholder `src`, so phones never download it. Keep that pattern.

## 4. Homepage structure (keep this order; spacious version)

All ids are used by menus, doors and the footer. Keep them.

1. **Skip link** `a.skip-link` → `#main`, then the inline SVG icon sprite (`#i-phone`, `#i-down`, essentials and door icons `#i-age`, `#i-clock`, `#i-funded`, `#i-chair`, `#i-star`, `#i-door`, `#i-tree`, `#i-key`, `#i-calendar`, `#i-pin`, `#i-arrow`). Draw with `<use href="#id">` only; board previews are sandboxed.
2. **Header** `header.site-header`:
   - `.site-header__bar`: `a.brand` (inline SVG `.brand__mark` 44×44, `.brand__name`, `.brand__place`), then `.header-actions` holding `a.btn.header-call` and `button.menu-toggle`.
   - `nav.site-nav#site-nav[aria-label="Main menu"]` with 6 items plus `li.nav__cta` (Book a visit). On phones the whole nav is hidden until Menu opens it (S11). The `nav__item--keep` classes stay in the markup but no longer show a band on phones.
3. **Hero** `section.hero`: `.hero__grid` with `.hero__copy` (`p.status[data-status]`, `h1`, `p.hero__lead` of one sentence, `.actions` with `a.btn` Book a visit and `a.phone-link` Phone), `svg.hero__arch` (phones and tablets) and `figure.photo.hero__photo` (desktop only, optional). Hero ≤ 25 words besides the status.
4. **At a glance** `section.section--surface.section--glance > .wrap.glance`: `h2`, `ul.essentials` of 5 `li` (each `span.essentials__icon` + text ≤ 8 words: ages, hours, funded hours, places, grades with the report link), then `p.go-row > a.go` "See all the details".
5. **Choosing a nursery** `section.section--doors#choosing`: `h2` in a `.wrap`, then `ul.doors` (outside the wrap, so doors are full width on phones) of 4 to 6 `a.door` (`.door__icon`, `.door__label` ≤ 3 words, `.door__line` ≤ 8 words with the answer, `svg.door__arrow`).
6. **For parents** `section.section--parents`: `.parents-band__icon`, `h2`, `p.parents-band__line[data-next-closure]` (static fallback), one `a.go`.
7. **Book a visit band** `section.visit-band`: on the homepage `figure.visit-band__photo` (phones and tablets only), then `h2` "Come and see us", one sentence, Book a visit and Phone.
8. **Footer**, **schedule** `script#nursery-schedule`, `frontdesk.js` (unchanged).

Dated notices (`.notice-band`) now go on the Parents page, under "On this page". The live status pill already carries closures on the homepage. A jobs strip, if a nursery is hiring, goes on Visit and join, not the homepage.

## 5. Responsive layout (keep it right)

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px, and by hand at 320px: no layout flags and no sideways scroll on any page. Breakpoints are in em; side gutters come only from `.wrap`.

| From | What changes |
|---|---|
| 0 | One column, 24px gutters. Header: name, then compact icon-over-label "Phone" and "Menu" buttons on one row; no menu items until Menu opens. At a glance is one list; doors are full-width bands. |
| 25em (400px) | The logo mark appears beside the name. |
| 30em (480px) | Header buttons become single-line ("Phone us", "Menu"). `.btn--block` stops being full width. |
| 37.5em (600px) | Gutters 40px. |
| 46em (736px) | `.split` goes to 2 columns (except `--wide-left` and `--late`). Doors become cards (still one per row). Answer cards and people go to 2 columns. Timelines put the time in a left column. Page heads put their arch drawing on the right. |
| 48em (768px) | Body text 20px. The header Phone button shows the number. |
| 56em (896px) | `.split--wide-left` and `.split--late` go to 2 columns. The hero photo appears and the arch and the visit-band photo go. At a glance puts its heading beside the list. |
| 60em (960px) | Full 6-item nav row; the Menu button goes. |
| 64em (1024px) | Gutters 64px. Doors 2 by 2. Answer cards and `.people--3` go to 3 columns. Footer in 3 columns. "On this page" stays one column. |

Rules:
- Never put an aside or panel beside a main column below 56em: use `.split--wide-left`.
- Person cards use a container query: label and value sit side by side only when the card's text column is 18rem or wider.
- Keep the header to name, Phone and Menu. A long nursery name wraps inside `.brand` (flex `1 1 9rem`). Keep the menu to 6 or 7 short items so it fits one row at 60em.
- Wrap postcodes and short phrases in `span.nowrap`. Phone links and `.nowrap` are inline blocks: they move to the next line whole, and only break inside at very large text sizes, so nothing overflows at 200% text.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn` | The green main action. Once per screen ("Book a visit"). |
| `.btn--secondary` | Outlined second action ("Join the waiting list", "Phone 07906 954441"). |
| `.go` | A stand-alone verb link with an arrow and a 44px tap height. |
| `.status[data-status]` + `[data-status-text]` | Live status pill: `open`, `closing` (last 30 minutes, "Home time soon") or `closed`. Use it in the hero, the contact section and the page heads of Visit and join and Parents. |
| `.notice` in `.notice-band[data-show-from][data-show-until]` | Dated closure notice. |
| `.facts`, `.facts__wide` | The original key facts strip. **Not used on the spacious homepage** (it was the main cause of "cramped"); use `.essentials`. |
| `.essentials`, `.essentials__icon`, `.glance` | At a glance: 5 lines, icon disc, hairlines (S9). |
| `.doors`, `.door`, `.door__icon/__text/__kicker/__label/__line/__arrow` | Whole-tile doors (homepage) and the Next door (`nav.next-door`) on inner pages. |
| `.phone-link` | The secondary action, "Phone 07906 954441" (S13). |
| `.section--parents`, `.parents-band__icon`, `.parents-band__line` | The For parents band. |
| `.hero__arch`, `.page-art`, `.arch__*` | The church-hall arch drawings (hero on phones; page heads with the page icon). Recolour through the tokens. |
| `.visit-band`, `.visit-band__photo` | Book a visit band that ends every page. |
| `.answers`, `.answer`, `.answer__fact` | Answer cards. An odd last card spans the row. |
| `.parents-panel`, `.parent-tasks` | The original boxed parents panel. Not used in the spacious version. |
| `.grades`, `.grades__list`, `.meter[data-grade="1-6"]` | Grades panel. One `li` per grade heading: `.grades__area`, `.grades__word` ("**4** Good"), then the 6-segment meter. |
| `.day`, `.day__time`, `.day--years` | Routine timeline; `--years` for a short history. |
| `.steps` | Numbered process (settling in, joining, complaints). |
| `.people`, `.people--3`, `.person`, `.person__initial`, `.person__role` | Staff cards with a `dl` of facts. Use initials unless there is a consented, child-free portrait (then a 52px round `<img>`). |
| `.today`, `.hours` | Opening-times card. `tr[data-day="mon tue …"]` gets "Today". |
| `.table`, `.table--fees`, `.table__group`, `.table-note` | Fee table and term-date table. `tr[data-from][data-to]` gets "past", "Now" or "Next". `.table-note` carries the source and "Last checked". |
| `.figure-row` | A big figure with a one-line explanation ("£0", "1,140"). |
| `.summary` | Key and value rows (sessions, contact, collection times). |
| `.ruled` | Hairline list; `small` for a second line. |
| `.note` | Tinted inset for one important point. |
| `.panel` | White panel for the one key action beside a section. |
| `.faq`, `.details` | Expanders ("What the letters mean"). |
| `.photo` | Figure with a 4:3 rounded photo and caption. |
| `.page-head`, `.page-head__grid`, `.breadcrumb`, `.contents.wrap`, `.next-links` | Inner page head (with `.page-art`), breadcrumb, "On this page" (after the head, 48px rows) and section-end links. |
| `.phone-line` | A phone number or email in a panel with a 44px tap height. |
| `.visually-hidden`, `.nowrap`, `.mb-0`, `.mt-section`, `.h3-size` | Utilities. |

Don't add a component until you have checked that one of these won't do. If you must, use tokens only.

## 7. Tokens (section 1 of `styles.css`)

| Token | Default (Clarkston) | Role, and the rule to keep |
|---|---|---|
| `--brand` | `#24513F` garden green | Header rule, mark, parents panel, step numbers, meter, current-page bar. **7:1 or more with white** (9.0:1). |
| `--brand-strong` | `#16402F` | Hover and pressed on brand surfaces (11.6:1). |
| `--brand-tint` | `#EDF3EE` | Hero and page-head ground, "Today" and "Now" rows. Ink 13.9:1, link 6.1:1, soft ink 6.9:1. Keep lightness at 95% or more. |
| `--brand-line` | `#CBDBCF` | Rules on the tint. Decorative only. |
| `--mark-accent` | `#B8452F` (the nursery's red uniform) | Logo mark only. **Never text.** |
| `--button`, `--button-strong`, `--button-shadow` | `#1D6B44`, `#13502F`, `#0B3320` | The green main button (white 6.5:1). **Keep it green** even when the brand isn't, as §6.2 asks for a green "Book a visit". |
| `--ink` | `#1E2421` | Body text: 14.6:1 on paper. |
| `--ink-soft` | `#4B5550` | Secondary text: 7.2:1 on paper, 7.7:1 on white. Don't go lighter. |
| `--paper` / `--surface` | `#F8F6F1` / `#FFFFFF` | Warm page ground; cards and alternate sections. |
| `--line` / `--line-strong` | `#E2DDD2` / `#8A8473` | Hairlines (decorative); meter and control edges (3.7:1 on white). |
| `--footer`, `--footer-ink`, `--footer-soft` | `#1C2A24`, `#E6EAE7`, `#C9D2CC` | Footer (12.3:1 and 9.7:1). |
| `--link`, `--link-hover`, `--link-visited` | `#1A5C9E`, `#0F3A66`, `#4C2C92` | **Don't re-theme.** 6.8:1 on white. |
| `--open`, `--closing`, `--closed` | `#00703C`, `#8A4B00`, `#4B5550` | Status pill. Don't re-theme. |
| `--notice-bg`, `--notice-edge` | `#FBF3DC`, `#C99A06` | Dated notice (ink 14.3:1; the edge is decorative). |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. **Never change.** |
| `--font` / `--font-display` / `--display-weight` | Atkinson Hyperlegible Next / Source Serif 4 / 600 | Keep. The serif is for `h1`, `h2` and the brand name only. |
| `--text-base`, `--text-small`, `--text-lead` | 18px (20px from 48em), 17px, 21px | Don't go below 17px anywhere (S8). |
| `--h1`, `--h2`, `--h3` | `clamp()` scales, 21px | Change only if a long name breaks the `h1` at 320px. |
| `--radius`, `--radius-small` | 14px, 8px | Cards; buttons and inputs. |
| `--tap`, `--button-height` | 44px, 56px | Never lower. |
| `--gutter`, `--section`, `--group`, `--gap-cards`, `--wrap`, `--measure` | 24/40/64px, 80 to 128px, 48/64px, 24/32px, 78rem, 60ch | The space brief (S1, S2, S7, S8). **Don't lower them.** |

### How to re-theme for a new nursery
1. Copy the whole `nursery/front-desk-spacious/` folder, or copy `example/` to a sibling folder, keeping `../styles.css`, `../frontdesk.js` and `../fonts/` resolving.
2. **Gather facts** (section 9's list) and note where each came from. Read the nursery's handbook if it has one: it is usually newer and fuller than its website.
3. **Brand colour.** Take the nursery's main colour (logo, sign or uniform). Darken it until white on it is 7:1 or more, and set `--brand`, `--brand-strong` (about 15% darker), `--brand-tint` (95 to 97% lightness, same hue) and `--brand-line` (85 to 88%). Calm, natural hues work best; if the nursery's colour is a bright primary, use it only as `--mark-accent` and keep the green. Don't touch link, status, focus or button tokens.
4. **Mark.** Draw a simple inline SVG at 44×44 from something real about the place (Clarkston's is the arched window of its church hall), using `.brand__bg`, `.brand__line` and `.brand__accent` so it follows the tokens. If the nursery has a simple logo, redraw it. Never clip art.
5. **Copy:** replace every Clarkston fact on every page. Afterwards `grep -n "Clarkston\|07906\|G76\|Williamwood\|Seres\|McKendrick\|SC010635\|CS2003003859\|East Renfrewshire" *.html` must return nothing from Clarkston.
6. **Schedule and dates:** rewrite `#nursery-schedule` (section 8), the opening-times table, the term table and the dated notice. Check weekdays with a script.
7. **Grades:** copy every heading, grade and date from the latest report. Check the Care Inspectorate link resolves.
8. Update `<title>`, meta description, `theme-color` (= `--brand`) and the footer review dates (today and today plus 6 months).
9. Run the checklist in section 11.

## 8. The schedule (`#nursery-schedule`)

Put it at the end of `body` on **every** page (inner pages use it for their status pill and term table).

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["09:00", "15:00"]], "tue": [["09:00", "15:00"]], "wed": [["09:00", "15:00"]],
            "thu": [["09:00", "15:00"]], "fri": [["09:00", "15:00"]], "sat": [], "sun": [] },
  "term": { "from": "2026-08-12", "to": "2027-06-25", "label": "the summer holidays" },
  "closures": [
    { "from": "2026-10-09", "to": "2026-10-16", "label": "the October holiday" },
    { "from": "2027-05-06", "to": "2027-05-06", "label": "an in-service day" }
  ]
}
```

- `days`: 24-hour sessions per weekday. A gap between sessions (for example a lunchtime closure) is two sessions.
- `term` (optional): for **term-time nurseries**. Days outside it are closed with its `label`. Leave `term` out for all-year nurseries and list their closures (public holidays, Christmas) instead.
- `closures`: whole days, `from` and `to` inclusive, in date order, each with a `label` that reads after "Closed for …" (lowercase "the", for example "the Christmas holidays"). Only dates the nursery has published.
- Status wording: "Open now. Home time is 3pm"; in the last 30 minutes "Open now. Home time soon, at 3pm"; then "Closed now. Opens tomorrow at 9am", "Closed now. Opens on Monday at 9am", or "Closed for the Christmas holidays. Opens on Tuesday 5 January at 9am". After the term ends it says "Closed for the summer holidays." until you add next year's dates.
- `[data-next-closure]` gets "Closed now for … Back on …" or "Next closure: …, from [first weekday]. Back on …".
- Keep the term table rows' `data-from` / `data-to` in step with `closures`.

Test with Playwright's clock (`page.clock.setFixedTime`) before handover: a weekday at 8:15am, 10am, 2:40pm and 3:30pm; a Friday at 4pm; a day inside each closure; the day before a closure; and a date after the term ends. The example passed all of these.

## 9. Inner pages

Every page reuses the homepage's head, header, menu, footer, tokens, fonts, schedule JSON and script, copied exactly. Only `<title>` ("[Page]: [Nursery], [area]"), the meta description and `aria-current="page"` change. Menu links are page-relative (`./`, `join-us.html` …) and identical everywhere.

**Page head** (replaces the hero, the same on every page, S10): `div.page-head > .wrap.page-head__grid` with a `div` holding `nav.breadcrumb`, `h1` (≤ 6 words), `p.page-head__lead` (≤ 35 words), `.page-head__actions` (one action: Book a visit, or Phone on Fees and Parents, plus the status pill on Visit and join and Parents), then `svg.page-art` (the arch with this page's icon). Then `nav.contents.wrap` ("On this page", one link per `h2`, at most 7). Then `section.section` blocks, the first one `.section--surface`, alternating after that. Each opens with `.section-head` and keeps to 120 words plus one list, table or image; put the rest in `.faq > details.details`. Every page ends with `nav.next-door` (a `.door` with `.door__kicker` "Next") and the `section.visit-band`. Next order: Visit and join → Fees and funding → Our nursery → Our team → Parents → Visit and join. Keep each page under about 900 visible words.

| Page | `h1` | Sections, in order |
|---|---|---|
| `join-us.html` | Visit and join | Book a visit (Parent Club questions, phone panel) · Join the waiting list (`.steps`, funded-hours note) · Sessions and places (`dl.summary`; other nursery and starting school as accordions) · Settling in (`.steps` and a panel in the nursery's own words) · What to wear and bring (two `.ruled` lists) · **Find us and opening times** (`#find-us`: status, contact `dl.summary`, directions link, the `.today` card; moved from the homepage) · Your information |
| `fees-and-funding.html` | Fees and funding | Funded hours for 3 and 4 year olds (`.figure-row` ×2, how to use them here as `.steps`, the council deadline `.note`, council link) · When funding starts (birthday table, deferral) · 2 year olds (eligibility links; "phone to check") · Fees (`.table--fees` with "Other charges" group, `.table-note`, voluntary contribution `.note`) · Paying your fees (`dl.summary`) · Help with costs (`.answers`: Tax-Free Childcare, Universal Credit, Parent Club) |
| `our-nursery.html` | Our nursery | Our halls and garden (`.ruled` plus the photo) · A day at nursery (full `ol.day`) · Food and allergies (allergies in an accordion) · Nappies, teeth and health (`.answers`) · Additional support (`.steps` plus panel) · Our inspection grades (the full `.grades` panel; the homepage only has the one-line summary) · Who we are (values, charity; the `ol.day.day--years` history in an accordion) |
| `our-team.html` | Our team | Our staff (`h3` groups, `h4` names in `.people.people--3`; "Ask us about our staff ratios when you visit.") · Your child's key worker (plus child protection lead panel) · What the letters mean (`.details`, only qualifications on the page) · Our parent committee or owners |
| `parents.html` | For parents | (dated `.notice-band`) · Term dates and closures (grouped `.table` with `tr[data-from]`) · If your child is off or ill (illness, medicines, accidents and fees as accordions under `#illness`) · Drop-off and collection (`dl.summary`; someone else collecting and late collection as accordions) · Lunch and menus · Paying fees · Worries and complaints (nursery process as `.steps`, then the Care Inspectorate) · Keeping safe, and our policies (999 in a `.note`; `h3#policies` and the `.ruled` policy list in an accordion). 7 sections, so "On this page" stays at 7. |

Rules:
- **Forms are HTML, not PDF** (§6.4). If the nursery only has Word or PDF forms, describe what to do in HTML and offer the file alongside, never instead.
- **Waiting-list forms**: only with a compliant receiving service, minimal fields (§6.3) and a privacy notice at the point of collection. Otherwise phone or email.
- **Policies, privacy notice, accessibility statement and jobs** go on plain pages (page head plus sections) linked from the footer, when the nursery supplies them. Don't link pages that don't exist.
- File names are short and lowercase, all in the site root.

## 10. Variants

- **All-year private nursery:** drop `term`; list public holidays and Christmas in `closures`. Hours often run 7:30am to 6pm: the hero sentence says "Open 7:30am to 6pm, Monday to Friday, all year". Add a baby room row to "Our nursery" only if the nursery takes under-2s (`under3s` in our data shows registration, not what it offers; check).
- **Playgroup (mornings only):** one session in `days`; the answer cards keep "How do we start?" but "What is a day like?" may be 3 or 4 timeline steps.
- **Not a funded provider:** the Funded hours fact reads "Phone us to check if we offer funded hours", and the fees page leads with the fee table.
- **Grades 3 or below:** keep the grades panel. Add a `.note` under it in the nursery's own words about what it is improving, if supplied.
- **Vacancies:** add a jobs strip on the homepage and a jobs page; say what it pays only if the nursery confirms the figure (funded providers must pay at least the real Living Wage for funded hours [FFC-2]).

## 11. Pre-handover checklist

Any "no" blocks handover. This adds to §8 of the research brief.

**Facts**
- [ ] Every fact traces to the nursery's site or documents, or its Care Inspectorate record. Disagreements between sources are listed in your report.
- [ ] Funded status is confirmed with the nursery (and the council list where there is one).
- [ ] Grades, their exact headings, the inspection date and the publication date match the latest report. The report link resolves.
- [ ] Fees show their source and "Last checked". Voluntary extras say they are optional.
- [ ] Term dates, the schedule JSON and the dated notice agree, and every weekday is correct.
- [ ] Staff: names, roles, qualifications, SSSC and years exactly as supplied. No ratio printed unless the nursery states it.
- [ ] No identifiable child in any image, EXIF stripped, `img/CREDITS.txt` complete.

**Content**
- [ ] The first 390×844 screen shows the status, the nursery name, the hero sentence, "Book a visit" and "Phone", and the At a glance heading.
- [ ] Homepage: ≤ 6 phone screens, hero + ≤ 4 content sections + the visit band, 120 to 180 words in `<main>`, ≤ 6 text blocks and ≤ 1 H2 per content screen (`density.mjs`).
- [ ] Menu is 6 items plus Book a visit; on phones everything sits behind Menu in 56px rows.
- [ ] Homepage sentences are 20 words or fewer; links start with verbs; times use "to".
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or trackers.
- [ ] Footer review dates set (today and today plus 6 months).

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>` reports **0 blockers, 0 major, 0 minor** across every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` shows no layout flags on every page. Look at the 390px and 768px screenshots yourself.
- [ ] The live status has been tested with Playwright's clock (section 8).
- [ ] Keyboard only: skip link, menu (Escape closes), yellow focus on every control.
- [ ] Text at 200%: no sideways scroll at 390px or 1280px.
- [ ] Every external link checked by hand where the audit couldn't verify it.

## 12. Clarkston example: sources, and facts to confirm

**Sources** (crawled 12 October 2026): clarkstonnursery.co.uk (57 pages), its *Handbook 2026/27* (Word file), news posts, and the Care Inspectorate datastore of 31 August 2026 (service CS2003003859). Nothing else.

Confirm these with the nursery before go-live:
1. **Grade headings.** The report published 10 April 2026 is under the new quality improvement framework (from 22 September 2025). The headings shown ("Care, play and learning" 4, "Care and support planning" 5, "Setting" 4, "Leadership" 4) are the datastore's columns, not read from the report itself, because the Care Inspectorate site wouldn't render the record for automated checks. Replace them with the report's exact headings.
2. **Manager's name.** The handbook and website say Maureen McKendrick; the Care Inspectorate datastore says Mary McKendrick.
3. **Places.** The handbook says up to 30 children per session; the Care Inspectorate registers 31 places; a 2018 post says up to 31 in the morning. The example says "Up to 30 children each session".
4. **Voluntary family contribution.** The website says £10 a month; the 2026/27 handbook says £20. The example says "Phone us for the current amount".
5. **Late collection fee.** The website lists "£5 per month"; the handbook says £5 if up to 10 minutes late, then the cost of 2 staff. The example uses the handbook.
6. **Funding start for January and February birthdays.** The handbook gives "April"; mygov.scot says "March or April". The handbook also contradicts itself ("on or after 28 February … following August"). The example shows "April" and says to phone to check.
7. **The 31 March deadline.** The handbook says the nursery must tell the council "prior to March 31st of the academic year in which the funding will apply". The wording is unclear; confirm the date parents should aim for.
8. **Funded 2 year olds.** The nursery takes 2 year olds but doesn't say whether it takes *funded* 2 year olds. The example says "phone us to check".
9. **Tax-Free Childcare.** Not mentioned by the nursery. The example says "Ask us if we accept it".
10. **Term dates.** The handbook lists East Renfrewshire school dates (teacher in-service days included). The example assumes the nursery is closed on every listed holiday and in-service day, and opens on Wednesday 12 August 2026. Election closures are "phone to check".
11. **Gill Hall's days.** The handbook's days column reads "Support"; the example shows the role "Child development officer (support)" and no usual days.
12. **Registration form.** The current site offers a Word form to download. The example says to email or phone for it; at handover, publish the form as HTML or alongside as a download.
13. **Garden photo** is from a 2013 upload; confirm the garden still looks like this and that the nursery is happy to reuse it.
14. **Council links.** East Renfrewshire's pages block automated checks; the two links (`article/7605`, `article/1243`) came from a search on 13 October 2026. Open them in a browser before go-live.
15. **Policies.** The privacy notice (2018), food and drink policy (reviewed June 2023) and breastfeeding policy (January 2016) are old. Ask for current versions to publish as HTML pages.
16. **Committee.** The handbook still lists the 2022/23 committee, so the example names nobody and says to phone.
