# Big Table, spacious: a website template for Scottish nurseries that sell through food and family

## Spacious version (read this first)

This folder (`templates/nursery/big-table-spacious/`) is the **spacious version of Big Table**, built on 14 October 2026 so the owner can compare it side by side with the original (`templates/nursery/big-table/`, unchanged). His feedback on the original: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."*

The spec is the space brief, rules **S1 to S13** in `prospects/research/nursery-spacious-directions.md` (Part 2). The identity is unchanged: the same six earthy colours, Gluten and Mulish, the leaf corner, the doodles on speckled paper, the drawn lunch table, the recipe card, the plate frames, the same Sheephouse example and every fact and photo in it. Nothing was deleted: everything that left the homepage moved to an inner page or into an accordion.

### Space figures (390 by 844 phone, `density.mjs` and `words.mjs`)

| Homepage | Original | Spacious | Brief |
|---|---:|---:|---|
| Length on a phone | 17,009px (21 screens) | **4,948px (6 screens)** | 6 screens at most (S3) |
| Length at 768px / 1280px | 13,879px / 10,948px | 4,488px / 4,085px | |
| Sections after the hero | 14 | **4** (essentials, food, doors, visit band) | 5 at most (S3) |
| Words in `<main>` | 1,459 | **160** | 120 to 180 (S4) |
| `h2`s | 13 | 4 | |
| Text blocks, every screen | 15 / 9 / 6 / … (first three) | **2 / 6 / 4 / 6 / 6 / 11 (footer)** | 6 (7 on screen 1) (S5) |
| Boxes, every screen | 13 / 6 / 1 / … (first three) | **3 / 1 / 1 / 0 / 2 / 1** | 3 (S5) |
| Average per screen (text / boxes) | 8.2 / 2.9 | 5.8 / 1.3 | |
| Page weight on a phone | about 220 KB | about 173 KB | under 1 MB |

How the S5 numbers are met on a phone: the hero block and the doors are **full-width colour bands** below 600px (S5 doesn't count full-width bands), like stripes on a tablecloth, and turn back into leaf-cornered cards from 600px. The arched table frame is drawn with rings (box-shadow), so it reads as the picture it is. The first screen's 3 boxes are the off-screen skip link (the script counts it), the Menu pill and Book a visit. The essentials rows are taller (30px padding), so "All the details" starts the next screen; there are **5 doors** (Our team is reached from the menu and the Next door on Our nursery) so the doors screen holds the heading plus 5. The footer screen has 11 text blocks, as Signpost's does: the footer lists aren't content (phone and email now share one line block). Image share (S12): the drawing and the plate photo are about 11% of the phone page; with the colour bands (hero, doors, visit band) about 40%.

Inner pages: every section is 120 words or fewer of body text (plus one list, table, card or image), and every page is under 900 visible words (Visit and join 600, Food 540, Our nursery 703, Fees and funding 469, Our team 240, Parents 327).

### What changed, and why

| Change | Rule |
|---|---|
| **Gutters** 24px on a phone, 40px from 600px, 64px from 1024px; content at most 1,120px; prose at most 60 characters a line. | S1, S8 |
| **Section padding** `clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80px phone, 128px at 1280px); groups 48 to 64px apart; doors and cards at least 24px apart. | S2, S7 |
| **Body text** 18px on a phone, rising to 20px at 1280px. | S8 |
| **Hero** holds only the name, the promise, one sentence and two actions (Book a visit and "Phone 01501 770235"). The drawn lunch table now shows on phones too (4:3 under the actions), so the hero fills the whole first phone screen. The status pill, the 5 key-fact chips and Email us left the hero. | S2, S5, S13 |
| **The essentials**: one list of 5 lines with mustard plate icons (ages, hours, funded hours, places, grades with date and report link), closing with "All the details". It replaces the 2 by 2 fact chips. | S9 |
| **The food story** is one plate-framed photo, two sentences and one link. **The recipe card moved to the Food page**, where week 1 is open and weeks 2 to 4 fold into accordions. | S3, S9, S10 |
| **Why families choose us** became the **doors**: five colour cards with doodles, one per main inner page (full-width stripes on phones), each a single link (label and a line of up to 6 words). Each door's colour and doodle match its page's band, so colour now means place. | S6, S9 |
| **Come and see us** is a short forest band (heading, one sentence, two actions) that ends every page. | S3, S10 |
| **Menu**: 6 items (Home dropped; the name is the home link), in the doors' order. On phones nothing prints under the logo: "Menu" opens a full-height sheet with 56px rows, then Book a visit and Phone. The phone header's Phone pill became a plain link. | S11, S5 |
| **Inner pages** all open with the same band (breadcrumb, `h1`, intro of up to 35 words, one action, and a cream plate with that page's doodle), then a vertical "On this page" list (48px rows) when there are 3 or more sections. They end with a "Next" door and the visit band. | S10 |
| Long detail went into accordions: weeks 2 to 4 of the menu, the visit questions, the drive times, Additional support / Families and community / Who we are, How to apply, and each policy. | S10 |
| Removed from the homepage and where it went: "Already with us?" (the Parents door), grades and award (Our nursery), rooms and the day (Our nursery), settling in and the guarantee (Visit and join), Part of Fauldhouse (Our nursery, accordion), team (Our team), parents' quotes (Our nursery, new "What families say" band), what's included and fees (Fees and funding), Find us with the map and drive times (Visit and join, new "Find us" section). | S3, S9 |

### Judgement calls
- **Outdoors left the homepage.** A "Two gardens and a forest" photo section fitted the brief on words but took the phone page to 7.2 screens, so it went; the gardens and forest are on the Our nursery door's line and page.
- **Phone actions** go straight to `tel:`; "Book a visit" now always goes to Visit and join (`join-us.html#visit`), so one wording leads to one place (S13). On dark bands the terracotta button gets a cream ring rather than changing colour.
- **The footer promise** ("Pull up a chair…") is hidden below 768px because it repeats the hero right under the visit band.
- Two homepage cards' wording now lives on inner pages: "Hearty, healthy food cooked from scratch each morning, with menus shaped by the seasons and the children" is the Food intro, and "Two cosy baby rooms with their own private garden, and lots of cuddles" is the "For babies" note on Visit and join.
- Food safety merged into "Cooked here, every day" on the Food page; "Your child's day" merged with the menu on Parents ("Menus and your child's day"), keeping the `#menu` and `#app` anchors; so no page lists more than 7 sections.

The rest of this brief is the original Big Table brief, updated where the spacious version changed it.

---

> Pipeline name: **Big Table** (folder `templates/nursery/big-table/`; this spacious version is `templates/nursery/big-table-spacious/`). It is direction 5 of `prospects/research/nursery-engaging-patterns.md` (§4.5). Its siblings are the calm, information-first nursery templates (Front Desk Nursery `nursery/front-desk`, Key Worker `nursery/key-worker`, Garden Gate `nursery/garden-gate`) and the other engaging directions (Cut and Stick, Full Stop, Chapter One, Weatherproof). When this brief says "Big Table", it means this template.

**The idea in one line:** an earthy, 70s-warm kitchen-table site that sells the nursery through its food and its family feel: this week's lunches on a recipe card, the cook in their own kitchen, how mealtimes really work, and colour cards with leaf-shaped corners and hand-drawn doodles on speckled paper.

**The promise:** "Pull up a chair." Food is the most concrete daily proof of care. A parent can picture lunch and judge it, and the table is the strongest picture of "home from home". Every fact a parent needs (ages, hours, funded hours, places, grades, fees, visits) is still on the page; the dressing is what changes.

It is the "after" in a before-and-after pitch, and the system AI build workers reuse for every nursery that suits it. It looks premium because it is consistent: one shape (the leaf corner), one illustration style (loose brush doodles and flat kitchen drawings), six earthy colours, two typefaces, and honest, dated facts.

Research behind every decision:
- `prospects/research/nursery-engaging-patterns.md` (13 October 2026). **§1** = selling patterns, **§2** = blueprint, **§3** = visual vocabulary, **§4.5** = this direction.
- `prospects/research/nursery-websites.md` (the first brief). **FB §3.6** = what a nursery may claim; **FB §5** = photos and children; **FB §6** = structure.
- Study files in `prospects/research/nursery-sites/`, cited by name, e.g. `young-friends-kindergarten.md`.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `table.js` | About 195 lines, no dependencies. Front Desk's `frontdesk.js` logic unchanged (phone menu, dated notices, live term-aware status, "Today" rows, term-date marks, next closure) plus a small motion helper. Spacious version: opening the phone menu scrolls to the top and locks the page behind the full-height sheet. | Never. It reads its data from the page |
| `paper.webp` | The speckled recycled-paper tile (1 KB, 320px, tiled). | Never |
| `fonts/` | Gluten (display, variable 500 to 800, slant 0) and Mulish (body, variable 400 to 800), Latin and Latin Extended woff2. Licence in `fonts/OFL.txt`. About 75 KB per page in Latin. | Never |
| `PHOTO-SHOTLIST.md` | What to photograph (food, table, kitchen, hands, rooms) and what never to. Send it to the nursery. | No |
| `example/` | Worked example for **Sheephouse Nursery, Fauldhouse** (a real West Lothian prospect), built only from its own website, its PDFs and its Care Inspectorate record. 7 pages. | Copy it for each nursery |
| `example/img/` | 5 cropped photos (WebP + JPEG) and `CREDITS.txt`, which also lists every photo on the old site that was **not** used and why. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/big-table-spacious` | After changes |

Pages link `../styles.css` and `../table.js`; fonts and `paper.webp` load through the stylesheet. Keep that folder shape. No build step, no framework, nothing from another server: no Google Fonts, no CDNs, no analytics, no maps, no social embeds, no review widgets (FB §6.6).

**Who it suits** (§4.5): private nurseries in a house, villa or farm, or with a kitchen garden, that **cook on site and will share a real menu**; family-run nurseries whose strongest daily story is food and togetherness; 30 to 140 places. If the nursery doesn't cook on site, or won't share a menu, **use another template**. Prospects named in the research: Sheephouse (Fauldhouse), Munro House (Glasgow), Beech House (Aberdeen), Bonnington House (Edinburgh), Ankerville House (Tain) and Ankerville Alness, Victoria Park Kindergarten (Glasgow), Orchard Grove Kindergarten (Glasgow), Apple Tree (Perth). Confirm the cook and menu at build.

---

## 1. Concept, and what it avoids

The Scottish sample sells "home from home" in words (`banbury-cross.md`, `links-city-nurseries.md`, `kirktonholme.md`, `thrive.md`) but rarely proves it. The best proof is concrete: a named cook and real dishes (`kirktonholme.md`), a printed weekly menu (`links-city-nurseries.md`), and how food is served ("calm, social and unhurried", `young-friends-kindergarten.md`). Big Table makes that proof the headline act, then gives every other answer.

It borrows Young Friends' earthy colour-card system (leaf corner, doodles, paper texture, chunky friendly display face) because it was the one site in the study that is both fun and premium (`young-friends-kindergarten.md`), and sets it to a kitchen beat: recipe cards, plate frames, a drawn table.

It avoids:
- primary-colour rainbows, bubble or crayon fonts, cartoon food with faces, smiling suns, clip-art children (§3);
- white text on mustard (Young Friends' known contrast failure);
- light 300-weight body text (`storal.md`, `young-friends-kindergarten.md`);
- doodles floating in white space beside polished photos (`fennies.md`): doodles always overlap a card corner;
- carousels, pop-ups, review widgets, count-up numbers, parallax, auto-play (§3 motion).

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Promise of 8 words or fewer, inside the `h1`, after the nursery name as an eyebrow**, then one short sentence (spacious: up to 25 words in the whole hero, S2 and S4; the hard facts sit in the essentials just below). | §1.1: feeling first, then a hard fact straight under it (`busy-bees.md`). §2.2 row 2. |
| 2 | **"The essentials" in the second phone screen** (spacious): ages, hours, funded hours, places, grades with date and link, as one list with plate icons, not chips. | FB §6.2; space brief S9. |
| 3 | **"Book a visit" (terracotta, to Visit and join) and "Phone 01501 770235" (a text link)** under the hero block. Book a visit also in the desktop header, the phone menu sheet and the visit band that ends every page. | §1.5; S13: one primary wording, and Phone as the secondary. |
| 4 | **Current parents use the Parents door** ("Closures, menus, school runs and fees"). The "Already with us?" strip is gone from the homepage (spacious). | §2.2 row 5; S3 (hero plus 5 sections). |
| 5 | **The food story is the first content section after the essentials**: a plate-framed photo of the kitchen, two sentences, "See this week's menu". The recipe card, "How we eat", allergies and the free funded-session meal are on the Food page. | §1.7 and §4.5 item 6; S9 (summarise on the homepage, expand inside). |
| 6 | **Earthy colour cards with doodles are the doors** (5 in the example; full-width stripes on phones): one per inner page, a label and a short line, the whole card one link, in the page's band colour. | §1.2 item 2 and pattern 3; S9 doors. |
| 7 | **Proof (Our nursery page): every grade, its exact heading, inspection and publication dates, a 6-leaf meter and the report link; one real award as a stamped plate.** No logo, no "mostly 5s". | §1.4 (1) and (5); FB §4.1. One award object, drawn well, not a badge stack (`bright-beginnings-leeds.md`, `storal.md`). |
| 8 | **Rooms in arched frames** (Our nursery), with drawn still lifes when there's no child-free room photo; room names only if the nursery uses them. | §1.9, §4.5 item 9; empty rooms sell (`bright-beginnings-leeds.md`). |
| 9 | **A day here with the meals marked** (Our nursery) by mustard plate icons; times only where supplied. | §4.5 item 10; FB §4.5. |
| 10 | **Settling in as steps plus the nursery's own promise** (Visit and join), including "Tell us what they like to eat". | §1.8: a promise, not a policy (`busy-bees.md`, `kirktonholme.md`). |
| 11 | **Parents' words on a sage band in the display face** (Our nursery), at most 3, labelled without children's names. | §1.4 (3); `young-friends-kindergarten.md` labels by room and date. FB §5.2: no children's names. |
| 12 | **"What's included" as colour tiles** (Fees and funding) next to the fee line ("Phone us for our current fees" when unpublished). | §1.7 last bullet; §2.3; `bright-horizons-uk.md`, `kids-planet.md`. |
| 13 | **Come and see us** on a forest-green leaf block that ends every page: "No obligation", one sentence, Book a visit and Phone. The 3 honest steps and visit times are on Visit and join. | §1.5 (`young-friends-kindergarten.md`, `thrive.md`, `kids-planet.md`). |
| 14 | **A drawn local map** (inline SVG, Visit and join) and drive times as real text, plus a directions link. No map embed. | §2.2 row 17; FB §6.4 (no third-party embeds). |
| 15 | **Six-item menu with "Food" as its own page** (spacious: Home dropped, the name is the home link). On phones a "Menu" button (a word, not an icon) opens a full-height sheet; nothing prints under the logo. | §2.1; FB §6.1; S11. |
| 16 | **Motion only as a reward**: doodles draw in once, recipe rows fade in once, buttons tilt 2°. Nothing is hidden before the script runs; all off under reduced motion. | §3 motion rules; Young Friends' lazy frames showed empty outlines (`young-friends-kindergarten.md`). |

## 3. Rules (non-negotiable)

### Facts (FB §3.6 is binding)
1. **Never invent facts.** Every fee, date, time, name, dish, grade, policy and service comes from the nursery's site, its documents (menus, handbooks, reports), or its Care Inspectorate record (`prospects/nursery/data/*.json` and `prospects/nursery/source/datastore-*.csv`). Where something is missing, use FB §3.6's "Otherwise write" wording.
2. **The menu is real or it is absent.** Transcribe the nursery's own menu exactly (dishes, puddings, snacks). Say which season and year it is from. If it is old, say so and add "phone to check this season's". Mark vegetarian dishes (`.recipe__veg`) **only** where the nursery marks them. No "organic", "no added sugar", calories or nutrition claims unless proven (§4.5 avoid list).
3. **The cook** is named only with consent and only if the nursery names them. Otherwise "our cook" and the chef's-hat badge.
4. **Grades:** every grade from the latest report, its exact headings and both dates. Reports before 22 September 2025 use the old key questions ("How good is our care, play and learning?" and so on); later ones use the new framework (FB §3.2). Never show only the best grade, never the Care Inspectorate logo.
5. **Funded status** changes (FB §3.1). Write "partner provider for [council]" only when the nursery says so, and confirm with the council at build.
6. **Quotes** come only from the nursery's own site or a source it links, copied exactly (a whole sentence may be dropped, never trimmed mid-sentence). Replace any child's name in the label ("Olly's mum") with a neutral label ("A Sheephouse mum"). Three at most.
7. **Awards:** name, awarding body and year, and "shortlisted" or "finalist" where that's the truth. Set in our own type on the stamped plate; use a body's badge only where its rules allow.
8. **Where sources disagree**, use the newest dated source and list the disagreement in your report. If it affects money, write "phone to check".

### Photos (FB §5)
9. **No identifiable children, ever.** No faces, names, name pegs, logos on children's clothes, nappies, changing, bathing or sleeping. Treat every old-site photo with a child in it as excluded unless a crop removes the child completely except hands (record the crop in `CREDITS.txt`).
10. **Food photos must be this nursery's food.** Never stock food.
11. Strip EXIF, location data and JPEG comments. Record every source and every rejected photo, with the reason, in `img/CREDITS.txt`.
12. The template must look complete with **no photos at all**: the drawn table, room scenes, recipe card, colour cards and doodles carry it.

### Content style
13. Plain English, reading age 9 to 11. Homepage sentences 20 words or fewer. Times as "7am to 6pm"; days and months in full; "to", not dashes.
14. Copy voice (§4.5): warm, homely, sensory and specific. Name the dish, not the "balanced diet". Use the nursery's own jokes sparingly (Sheephouse's "baa'rn" is a real room name; "baa'rilliant" is not used in facts).
15. Links start with a verb. Phone numbers are `tel:+44…` links; 999 is plain bold text.

### Accessibility (WCAG 2.2 AA)
16. Keep the token pairs in section 7. **White text only on terracotta, olive, brick, forest, teal, ink and deep. Ink text on mustard, clay, sage, paper and cream.** `--ink-soft` never sits on sage or clay; terracotta text never sits on clay (use `--terracotta-strong`).
17. One `h1` per page, `h2` per section, `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. Skip link first in `body`.
18. Focus is the GOV.UK yellow with an ink bar, on every ground. Never remove it.
19. Tap targets 44px or more. `main a:not([class])` gets a 44px tap height automatically (negative margins keep the line height). Block-style links (`.already`, `.contents`, `.breadcrumb`) opt out at the end of `styles.css`.
20. Every drawing is decorative (`aria-hidden="true"`) except the map, which has `role="img"` and a `<title>`; its facts (drive times) are also printed as text.
21. Doodles never sit on text. Check every doodle at 360, 390 and 430px. The hero doodle is hidden below 40em on purpose. Door doodles sit on the top-right corner; door text keeps 4.5rem clear on the right.

### Performance
22. Homepage under about 1 MB on a phone. The spacious example weighs **about 173 KB** (fonts 75 KB, CSS 53 KB, script 10 KB, one 8 KB photo; uncompressed).
23. Photos: WebP (quality 60 to 66) plus JPEG (about 76), `width` and `height` set, `loading="lazy"` below the fold. The desktop hero image (if a photo is used instead of the drawn table) uses `<source media="(min-width: 48em)">` with a 1px placeholder `src`, so phones never download it.

## 4. Homepage structure (spacious: hero plus 4 sections, S3)

Keep this order. Ids are used by menus, doors and the footer.

1. **Skip link**, then the inline SVG sprite (doodles `#d-*`, kitchen icons `#i-*`). Copy it whole onto every page.
2. **Header** `header.site-header`: `a.brand` (sheep or leaf mark `.brand__mark` 48×48, `.brand__name`, `.brand__place`), `.header-actions` with `a.pill` Phone (a plain link on phones, the number from 48em; number in the `aria-label`), `a.btn.header-book` "Book a visit" (from 64em), `button.pill.pill--ink.menu-toggle`. Then `nav.site-nav#site-nav` with **6 items in the doors' order** (Visit and join, Fees and funding, Our nursery, Food, Our team, Parents) and `.nav-extra` (Book a visit and Phone, shown only in the phone sheet).
3. **Hero** `section.hero`: `.hero__grid` with `.hero__main` (`.hero__block`: terracotta leaf block with `.hero__doodle`, `h1` with `span.eyebrow` name and town then the promise, `p.hero__lead`; then `.actions`: `a.btn` Book a visit to `join-us.html#visit` and `a.phone-go`) and `figure.frame-arch.hero__photo` (the drawn table, `aria-hidden`; 4:3 on phones, full height beside the block from 48em). **No facts, status pill or third button here.**
4. **Dated notice** (optional) `[data-show-from][data-show-until]` with `.notice` (closures, open days, deadlines only). Put it just under the hero.
5. **The essentials** `section.section--cream`: `.essentials-wrap` = `h2` + `ul.essentials` of exactly 5 `li` (each `.essentials__icon` plus a line of up to 8 words; the grades line is the report link) + `p.go-row` "All the details" to Visit and join.
6. **Today at our table** `section#food`: `.feature` = `.feature__plate` (plate-framed kitchen or food photo, steam doodle) + `.feature__text` (eyebrow line, `h2`, one sentence of up to 30 words, one `.go` link to `food.html#menu`).
7. **Doors** `section`: `h2.doors-title` + `ul.doors` of 4 to 6 (the example has 5) `a.door.door--{colour}` (doodle, `.door__label` up to 3 words, `.door__line` up to 8 words, arrow). Use the colour and doodle of the page each door opens.
8. **Visit band** `section.visit-section` > `.visit` (forest): seed doodle, `.visit__plate` (desktop only), `h2` "Come and see us", one sentence, Book a visit and Phone. The same band ends every page.
9. **Footer** `footer.site-footer` (deep brown, wavy `.site-footer__edge`): `.foot-promise` (doodles and the promise; hidden below 48em), `.foot-cols` (contact; About us: Care Inspectorate record, complaints, policies, privacy; Help for families), `.foot-bottom` (©, CS number, "Page last reviewed" and "Next review due").
10. `script#nursery-schedule` (section 8), then `<script src="../table.js" defer>`.

**Never on the homepage** (S3): the recipe card or any menu, the grade table, the day, settling-in steps, rooms, quotes, team lists, fees tables, the map, FAQs. Each lives on its inner page (section 9). Each content section ends with exactly one link.

Sections alternate the speckled paper and `.section--cream`; never put two tinted bands next to each other.

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags and no sideways scroll on any page. Breakpoints are in em; side gutters come only from `.wrap`.

| From | What changes |
|---|---|
| 0 | One column, 24px gutters. Header: name, Phone link and Menu pill; the menu is a full-height sheet. Hero block as a full-width band, then the actions, then the drawn table at 4:3. Essentials one per row with 30px row padding. Doors one per row as full-width stripes 12px apart (at least 112px tall). Page bands put the plate above the `h1`. |
| 30em (480px) | The sheep mark appears beside the name. Drive times in 2 columns. |
| 36em (576px) | Recipe rows put the day in a left column. Grades rows put the grade beside the heading. `dl.summary` puts the label beside the value. |
| 37.5em (600px) | Gutters 40px. The hero block and doors become leaf-cornered cards. Doors and "What's included" tiles 2 per row. |
| 40em (640px) | The hero spiral doodle appears. Colour cards 2 per row. Fee tables stop stacking. |
| 46em (736px) | Rooms in 2 columns. |
| 48em (768px) | The header Phone pill shows the number. Hero block and drawn table side by side. Feature rows (photo and story) side by side. Page bands put the plate on the right. The visit band shows its plate. The footer promise appears. |
| 52em (832px) | `.split` goes to 2 columns. |
| 56em (896px) | Essentials heading beside the list. Proof, quotes and `.steps--row` go to rows. |
| 64em (1024px) | Gutters 64px. Full 6-item nav row; Book a visit in the header; Menu button goes. Doors and cards 3 per row. Footer in 3 columns. |

Rules:
- Keep the brand to the nursery's short name plus a small place line, so it fits beside two pills at 360px. Long names: drop the place line on phones rather than shrink the name below 1.2rem.
- Doodles sit on corners with negative offsets no larger than the side gutter (24px on a phone), so they never cause sideways scroll.
- Rotation is limited to the 2° button tilt. Never rotate cards or text.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn` | Terracotta leaf button, once per screen ("Book a visit", S13). Inside `.on-dark` blocks and `.visit` it keeps its colour and gains a cream ring. Older variants (`--leaf`, `--light`, `--outline-light`, `--mustard`) remain in the CSS but the example no longer uses them: keep one primary colour. |
| `.phone-go` | The secondary action: "Phone 01xxx xxxxxx" as a text link with the phone icon (white on dark blocks). |
| `.pill`, `.pill--ink` | Header Phone (a plain link below 48em) and Menu buttons. |
| `.nav-extra` | Book a visit and Phone at the foot of the phone menu sheet. |
| `.leaf-link` | Small leaf button on colour cards (cream on dark cards, ink on mustard/sage/clay cards). |
| `.go` | Stand-alone verb link with an arrow, 44px tall. |
| `.status[data-status]` | Live status pill (filled by `table.js`); static fallback text in `[data-status-text]`. |
| `.notice` in `[data-show-from][data-show-until]` | Dated notice. |
| `.essentials`, `.essentials__icon`, `.essentials-wrap` | The 5-line essentials list with mustard plate icons (homepage). Replaces the old `.facts` chips and `.already` strip, which are gone. |
| `.feature`, `.feature--flip`, `.feature__plate`, `.feature__photo`, `.feature__text`, `.feature__doodle` | One picture beside one short story (homepage food row). |
| `.doors`, `.door`, `.door--{olive, brick, forest, terracotta, teal, deep}`, `.door__doodle`, `.door__kicker`, `.door__label`, `.door__line`, `.door__arrow` | Door tiles: one link each, colour and doodle matching the page they open. `.next-door` wraps the "Next" door at the end of inner pages (with `.door__kicker` "Next"). |
| `.go-row` | The one onward link that closes a section, 32px below the body. |
| `.recipe`, `.recipe--plain`, `.recipe__head`, `.recipe__tag`, `.recipe__days`, `.recipe__day`, `.recipe__dish`, `.recipe__pud`, `.recipe__snacks`, `.recipe__veg`, `.recipe__foot`, `.recipe__steam` | The recipe card. One `li` per day. **Food page only** (spacious): week 1 open in `.menu-weeks`, weeks 2 to 4 as `.recipe--plain` cards inside `.faq.recipe-fold` accordions. |
| `.cook`, `.badge`, `.badge--initials`, `.frame-plate.cook__photo` | A person row: plate-framed photo, chef's-hat badge or initials. |
| `.how-we-eat` | Icon list of how meals work. |
| `.callout` (+ `--clay`, `--cream`, `--mustard`) | One important point. |
| `.cards`, `.cards--3`, `.card--{terracotta, olive, brick, forest, teal, mustard, sage, clay}`, `.card__doodle--{tr, tl, bl}` | Colour cards with a doodle on one corner. |
| `.grades`, `.grades__list`, `.meter[data-grade]` | Grades panel. One `li` per heading; the meter is `aria-hidden`. |
| `.stamp`, `.stamp__plate`, `.stamp__text` | The stamped plate for a real award (the SVG text is decorative; the award is repeated as text below). |
| `.rooms`, `.room--clay`, `.room--sage`, `.room__art`, `.age-chip` | Room cards with arched frames. |
| `.day`, `.day__meal`, `.day__mark`, `.day__time`, `.day__what`, `.day__note` | Day timeline with meals marked. |
| `.steps`, `.steps--row` | Numbered steps in plate rings. |
| `.quotes-band`, `.quotes` | Parents' words. |
| `.included`, `.included--4` | "What's included" tiles (colours cycle automatically). |
| `.visit-section`, `.visit`, `.visit__doodle`, `.visit__plate` | The "Come and see us" band that ends every page. |
| `.summary`, `.ruled`, `.ticks`, `.minutes` | Key–value rows, hairline lists, ticked lists, drive times. |
| `.map` | Figure for the drawn local map. |
| `.frame-arch`, `.frame-plate`, `.photo`, `.strip-photo` | Arched room frames, circular plate frames (food, people), leaf-corner photos, a thin band of plates. |
| `.page-head`, `.page-head__block--{olive, terracotta, forest, brick, teal, deep}.on-dark`, `.page-head__plate`, `.breadcrumb` | The inner-page band (S10): breadcrumb as the eyebrow, then the colour block with a cream plate holding the page's doodle, `h1`, intro and one action. |
| `.contents` | "On this page": a vertical `ol` of anchor links, 48px rows with hairlines (not chips). Only with 3 or more sections; 7 links at most. |
| `.faq` | Accordions: `details`/`summary` rows with hairlines and a mustard plus/minus. For long reference detail (S10). |
| `.table`, `.table--stack`, `.table-note`, `.panel`, `.link-list`, `.narrow-block`, `.callout__title` | Inner-page parts. `.table--stack` turns rows into cards below 40em (cells need `data-label`). |
| `.visually-hidden`, `.nowrap`, `.mb-0`, `.soft`, `.lead`, `.eyebrow-line` | Utilities. |

### The drawings (sprite at the top of every page)
- **Doodles** (64×64, loose brush strokes, `pathLength="1"` so they draw in): `d-spiral`, `d-fern`, `d-dots`, `d-sprout`, `d-mushroom`, `d-steam`, `d-wheat`, `d-seed`, `d-loop`, `d-burst`, `d-leaf`, `d-wave`.
- **Kitchen icons** (32×32, 2.2px line): `i-spoon`, `i-bowl`, `i-plate`, `i-cup`, `i-apron`, `i-sprout`, `i-carrot`, `i-bread`, `i-apple`, `i-pot`, `i-chef`, `i-can` (watering can), plus `i-tree`, `i-house`, `i-moon`, `i-sun`, `i-heart`, `i-check`, `i-phone`, `i-mail`, `i-arrow`, `i-down`.
- **Scenes** (inline, in the example pages): the lunch table from above (hero), the baby-room still life (treasure basket, pine cones, brush, sponge), the older-room still life (mud-kitchen bench, hanging tools, tree and swing), the stamped plate, the local map, the sheep mark.
- All drawn in code for this template. No stock packs, no AI images. **No people, faces or hands**, and no faces on food. Colour comes from `currentColor` or palette hexes; re-colour by editing the hexes to the tokens.
- Draw a **new mark** for each nursery from something real (Sheephouse's is its own sheep logo, redrawn; otherwise use `d-leaf` on a terracotta leaf tile). Re-draw the **map** for each nursery (towns and roads from the nursery's own directions). Re-draw the **table** plates to match that nursery's real dishes.

## 7. Tokens (section 1 of `styles.css`)

| Token | Default | Rule |
|---|---|---|
| `--ink` | `#3A2A1F` | Body text. 12.0:1 on paper, 12.8:1 on cream. |
| `--ink-soft` | `#6B5A4C` | Secondary text. 5.8:1 on paper, 6.2:1 on cream. Never on sage or clay. |
| `--paper` / `--cream` | `#F6EFE3` / `#FBF7EF` | Page ground (under `paper.webp`) / cards, recipe card, chips. |
| `--line` / `--line-strong` | `#E4D6C0` / `#8C7663` | Hairlines (decorative) / meter and control edges (3:1+). |
| `--terracotta` / `--terracotta-strong` | `#A3471F` / `#84381A` | Main button, hero block (white 6.0:1). Strong for hover and small text on clay. |
| `--mustard` | `#E0AE45` | Recipe strip, rules, card. **Ink only (6.7:1), never white.** |
| `--olive` | `#56662F` | Leaf outline button, card, meter (white 6.3:1). |
| `--brick` | `#7A3B2E` | Card (white 8.4:1). |
| `--forest` | `#2F4A3A` | Card, visit block (white 9.7:1). |
| `--teal` | `#2E6466` | Card (white 6.7:1). |
| `--clay` | `#F2D7C4` | Card, chips, already strip, day band (ink 10.0:1). |
| `--sage` | `#C9D3A8` | Quotes band, card (ink 8.7:1). |
| `--deep` | `#2E2018` | Footer (white 15.7:1, mustard 7.7:1). |
| `--link`, `--link-hover` | `#8A3A17`, `#5E2810` | Links (6.8:1 on paper). |
| `--open`, `--closing`, `--closed` | `#2F6B33`, `#8A4B00`, `#6B5A4C` | Status dot colours. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. **Never change.** |
| `--font`, `--font-display`, `--display-weight` | Mulish, Gluten, 600 | Gluten for `h1`, `h2`, buttons, card titles, recipe day names and quotes only. Never body text, tables or the grades list. |
| `--text-base`, `--text-small`, `--text-lead` | 18px rising to 20px at 1280 (S8), 17px, 20px | Never below 17px. Prose is capped at `--measure` (60ch). |
| `--h1`, `--h2`, `--h3` | `clamp()` scales, 21.6px | Line height 1.15 or more for Gluten. |
| `--leaf`, `--leaf-sm`, `--arch` | `2rem .4rem 2rem .4rem` etc. | The one brand shape. Use it everywhere a corner is rounded. |
| `--tap`, `--button-height` | 44px, 54px | Never lower. |
| `--gutter`, `--section`, `--group`, `--gap`, `--wrap`, `--measure` | 24 / 40 / 64px; `clamp(5rem, 3.6rem + 5.6vw, 8rem)`; 48 to 64px; 24 to 32px; 70rem; 60ch | Spacious layout (S1, S2, S7, S8). Gutters step up at 37.5em and 64em. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../table.js`, `../paper.webp` and `../fonts/` still resolve.
2. **Gather facts** (section 11's list) and note each source. Read every PDF the nursery links: menus, handbooks, standards and quality reports, duty of candour reports. They are usually fuller than the website.
3. **Colour.** The six card colours are the system; keep them. If the nursery has a strong brand colour, let it replace `--terracotta` only if white on it is 4.5:1 or more (Sheephouse's orange is close to terracotta already). Never add a seventh colour.
4. **Mark, table, rooms and map**: redraw for this nursery (section 6, drawings).
5. **Copy:** replace every Sheephouse fact on every page. Afterwards `grep -n "Sheephouse\|Fauldhouse\|01501\|EH47\|Angela\|West Lothian\|CS2011297290\|Falla\|Baa'rn\|Longridge" example/*.html` must return nothing from Sheephouse.
6. **Menu:** transcribe the real menu into the recipe cards (one `li` per day). Update the "From our [season] menu ([year])" line.
7. **Schedule** (section 8), opening times and any dated notice.
8. **Grades:** headings, grades and both dates from the latest report. Check the record link resolves.
9. `<title>`, meta description, `theme-color`, footer review dates (today and today plus 6 months).
10. Run the checklist in section 10.

## 8. The schedule (`#nursery-schedule`)

Same JSON and behaviour as Front Desk Nursery (`templates/nursery/front-desk/BRIEF.md` §8). Put it at the end of `body` on every page.

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["07:00", "18:00"]], "tue": [["07:00", "18:00"]], "wed": [["07:00", "18:00"]],
            "thu": [["07:00", "18:00"]], "fri": [["07:00", "18:00"]], "sat": [], "sun": [] },
  "closures": [
    { "from": "2026-12-25", "to": "2027-01-01", "label": "Christmas and New Year" }
  ]
}
```

- All-year nurseries leave out `term` and list closures. Term-time nurseries add `"term": {"from", "to", "label"}`.
- **Only dates the nursery has published.** The Sheephouse example has an empty `closures` list because the nursery says only that it closes "between Christmas and New Year"; add the dates when confirmed.
- Tested with Playwright's clock: 6:30am ("Closed now. Opens today at 7am"), 10am ("Open now. Home time is 6pm"), 5:40pm ("Open now. Home time soon, at 6pm"), Friday 6:30pm and Saturday ("Closed now. Opens on Monday at 7am").

## 9. Inner pages

Every page reuses the homepage's head, sprite, header, footer and schedule exactly. Only `<title>` ("[Page]: [Nursery], [area]"), the meta description and `aria-current="page"` change.

**Page band (S10):** `div.page-head > .wrap` with `nav.breadcrumb` (the eyebrow: Home / page), then `.page-head__block--{colour}.on-dark` holding `.page-head__plate` (the page's doodle on a cream plate), `h1` (6 words at most), `p.page-head__lead` (35 words at most) and **one** action (Book a visit, or Phone where the page is about money or current parents). Then `nav.contents` ("On this page") when the page has 3 or more sections. Sections alternate cream and paper; each opens with `.section-head` (`h2` and an optional lede) and holds **120 words or fewer** of body plus one list, table, card set or image. Long reference material goes in `.faq` accordions. Every page ends with `nav.next-door` (the most likely next page) and the visit band. Keep each page under about 900 visible words.

| Page | Band colour, doodle | Sections, in order | Next |
|---|---|---|---|
| `join-us.html` (Visit and join) | olive, sprout | Book a visit (3 steps, visit times; "Questions you might ask" accordion) · How places are offered (`dl.summary`) · Sessions (`.table--stack`) · Settling in (steps, the guarantee, "For babies") · Find us (status, address, directions, drawn map; drive times accordion) · Your information | Fees and funding |
| `food.html` (Food) | terracotta, steam | Our four-week menu (week 1 recipe card; weeks 2 to 4 accordions; season, year and PDF) · Cooked here, every day (the cook, food hygiene; add a Food Hygiene Information Scheme result only if "Pass" and dated) · How we eat · Babies and first tastes · Allergies and special diets · Free meals at funded sessions (*Setting the Table*) | Our nursery |
| `our-nursery.html` | forest, fern | A day at Sheephouse · Our rooms · Outdoors · Out of school club (if any) · Inspection and awards (grades + stamp) · What families say (quotes band) · More about us (accordions: Additional support, Families and community, Who we are) | Our team |
| `fees-and-funding.html` | brick, wheat | What's included · Our fees (fee table with "Fees from [date]", or "Phone us for our current fees"; the guarantee) · Funded hours ("How to apply" accordion, open) · When funding starts (birthday table) · Funded places for 2 year olds · Help with costs (Tax-Free Childcare, Universal Credit, Parent Club) | Food |
| `our-team.html` | teal, dots | Who's who (manager and cook first; whole-team list; "Ask us about our staff ratios when you visit.") · Growing our own · Families help us choose | Visit and join |
| `parents.html` | deep, seed | Closures (live status) · Menus and your child's day (`#menu`, `#app`) · School drop-off and pick-up (if any) · Paying fees · Worries and complaints · Policies and reports (one accordion per document, with a short summary and the link) · Keeping children safe (999) | Food |

Optional pages (`inspection.html`, `awards.html`, `jobs.html`, `privacy.html`, `accessibility.html`) are linked from the footer only when they exist. Don't link pages that don't exist. Forms, menus and policies are HTML; a PDF may sit alongside, never instead.

## 10. Pre-handover checklist

Any "no" blocks handover. Adds to FB §8.

**Facts**
- [ ] The nursery cooks on site, and the menu on the page is its own, transcribed exactly, with season and year.
- [ ] Every other fact traces to the nursery's site or documents or its Care Inspectorate record. Disagreements are listed in your report.
- [ ] Funded status confirmed with the nursery and the council.
- [ ] Grades, exact headings and both dates match the latest report; the record link resolves.
- [ ] Fees dated or "Phone us for our current fees". Extras for funded hours marked optional.
- [ ] Quotes copied exactly from the nursery's own site; no children's names in labels.
- [ ] Award name, body and year are real.
- [ ] No identifiable child in any image; EXIF and comments stripped; `CREDITS.txt` complete.

**Content and design**
- [ ] The first 390×844 screen shows the name, promise, one sentence, Book a visit, Phone and the drawn table; the essentials follow in the second screen.
- [ ] Space brief (S1 to S13): homepage 6 phone screens at most, hero plus 5 sections at most, 120 to 180 words in `<main>`; every section ends with one link; inner pages have the band, "On this page" (3+ sections), sections of 120 words or fewer, a Next door and the visit band. Check with `density.mjs` and a words-in-`<main>` count.
- [ ] Menu is 6 items, in the doors' order; on phones nothing prints under the logo and the sheet ends with Book a visit and Phone.
- [ ] No doodle touches text at 360, 390 or 430px. No rotation except the button tilt.
- [ ] Mark, table drawing, room scenes and map redrawn for this nursery.
- [ ] No pop-ups, carousels, auto-play, embeds, widgets or trackers.
- [ ] Footer review dates set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>`: **0 blockers, 0 major, 0 minor** on every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` on every page: no layout flags at all 9 widths. Look at 390, 768 and 1280 yourself.
- [ ] Live status tested with Playwright's clock (section 8).
- [ ] Keyboard only: skip link, menu (Escape closes), yellow focus on every control.
- [ ] Text at 200%: no sideways scroll at 390px or 1280px.
- [ ] Every external link checked by hand where the audit couldn't verify it.
- [ ] Homepage under 1 MB on a phone.

## 11. Sheephouse example: sources, and facts to confirm

**Why Sheephouse:** the research names it first for Big Table. It cooks every meal in its own kitchen, has a dedicated kitchen page, a dining room next to the kitchen, a published four-week menu, a cook on the staff list, and a family voice ("home from home"). It is a 54-place private nursery and out of school club with all four grades at 5.

**Sources** (crawled 13 October 2026): sheephousenursery.co.uk (10 pages); its PDFs *Summer/Autumn 2022 menu*, *Progress report for session 2023/24 (Standards and Quality Report)* and *Duty of Candour Report 2022/23*; and the Care Inspectorate datastore of 31 August 2026 (CS2011297290). Nothing else.

Confirm these with the nursery before go-live:
1. **The menu is from summer/autumn 2022.** The page says so. Ask for this season's menu, and which dishes are vegetarian (none are marked, so none are marked here).
2. **Grade headings.** The report was published 9 September 2025, before the new framework (22 September 2025), so the old key-question headings are shown. They come from the datastore columns; check them against the report itself.
3. **No inspector quote** is shown because the report text wasn't available to us. Add one exact sentence, ideally about mealtimes or care, with the month and year.
4. **Places.** The Care Inspectorate registers 54; the homepage still says "up to 43"; the 2023/24 report says 54 with no more than 12 under 2. The example uses 54.
5. **Afternoon sessions.** The nursery page says 1pm to 6pm; the homepage says 1:30pm to 6pm. The example uses 1pm.
6. **Closures.** "Between Christmas and New Year" only; no dates, so the schedule has no closures. Add the dates.
7. **Fees** are not published ("we'd encourage you to come in"). The example says "Phone us for our current fees". Ask whether they will publish a dated fee table.
8. **What's included.** The nursery page says breakfast, a two-course lunch and afternoon snack "are included"; milk and water all day is from the kitchen page. Confirm nothing else is charged as extra, and what optional extras apply to funded hours.
9. **Universal Credit.** The old site says "up to 70%"; GOV.UK now says up to 85%. The example links GOV.UK and says 85%.
10. **Funded 2 year olds.** The 2022/23 duty of candour report says they can support funded places for eligible 2 year olds "where applicable". The example says "Phone us to check".
11. **Manager.** Angela Savage is from the Care Inspectorate record; the website names no staff. The role "Manager, nursery and out of school club" combines the record with the report's "ELC and OSC manager". Confirm the name, role and consent to be named.
12. **The cook** is not named anywhere. Ask their first name and consent; the cropped apron photo shows no face.
13. **Team list** is from the 2023/24 report. Ask for an update.
14. **Parent app.** Only a parent quote mentions "the app". The Parents page says "our parent app" without a name; confirm the app's name and login route, or remove that section.
15. **Holiday club.** The 2022/23 report mentions a holiday club; the current site doesn't. The example says "Phone to check holiday club dates".
16. **Settling-in steps** 2 and 3 are our suggested wording ("Tell us about them", "Phone us to ask how these work"); the nursery describes only the 4-week guarantee and "lots of cuddles". Replace with their own process.
17. **Quotes** are undated and the labels are ours (the site names the children). Ask permission to use them, and dates if known.
18. **Award** wording: "Innovation award from The Scottish Government and the Children and Young People Improvement Collaborative (CYPIC)", 2021, from the team page and the 2023/24 report. Confirm the exact award title.
19. **Drive times** are from the nursery's own map graphic, typed as text and redrawn. Confirm they're still the ones it wants to use.
20. **Policies.** Only the progress report, the duty of candour report (2022/23) and a privacy notice are online. Ask for current versions, a complaints procedure and an accessibility statement.
21. **Food Hygiene Information Scheme**: not shown. Look up the result and add it only if "Pass", with the date.
22. **Photos**: five crops of the nursery's own photos (see `example/img/CREDITS.txt`). Confirm the nursery is happy to reuse them, and the cook's consent for the apron photo.
