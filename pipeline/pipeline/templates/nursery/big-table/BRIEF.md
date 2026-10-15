# Big Table: a website template for Scottish nurseries that sell through food and family

> Pipeline name: **Big Table** (folder `templates/nursery/big-table/`). It is direction 5 of `prospects/research/nursery-engaging-patterns.md` (§4.5). Its siblings are the calm, information-first nursery templates (Front Desk Nursery `nursery/front-desk`, Key Worker `nursery/key-worker`, Garden Gate `nursery/garden-gate`) and the other engaging directions (Cut and Stick, Full Stop, Chapter One, Weatherproof). When this brief says "Big Table", it means this template.

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
| `table.js` | About 190 lines, no dependencies. Front Desk's `frontdesk.js` logic unchanged (phone menu, dated notices, live term-aware status, "Today" rows, term-date marks, next closure) plus a small motion helper. | Never. It reads its data from the page |
| `paper.webp` | The speckled recycled-paper tile (1 KB, 320px, tiled). | Never |
| `fonts/` | Gluten (display, variable 500 to 800, slant 0) and Mulish (body, variable 400 to 800), Latin and Latin Extended woff2. Licence in `fonts/OFL.txt`. About 75 KB per page in Latin. | Never |
| `PHOTO-SHOTLIST.md` | What to photograph (food, table, kitchen, hands, rooms) and what never to. Send it to the nursery. | No |
| `example/` | Worked example for **Sheephouse Nursery, Fauldhouse** (a real West Lothian prospect), built only from its own website, its PDFs and its Care Inspectorate record. 7 pages. | Copy it for each nursery |
| `example/img/` | 5 cropped photos (WebP + JPEG) and `CREDITS.txt`, which also lists every photo on the old site that was **not** used and why. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/big-table` | After changes |

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
| 1 | **Promise of 8 words or fewer, inside the `h1`, after the nursery name as an eyebrow**, then a plain fact sentence (ages, hours, days, weeks). | §1.1: feeling first, then a hard fact straight under it (`busy-bees.md`). §2.2 row 2. |
| 2 | **Key facts strip on the first phone screen**: ages, hours, funded hours, places, grades with date and link. Paper chips with a mustard top rule. | FB §6.2; §2.2 row 3. The first 390×844 screen must answer "Is this for us?". |
| 3 | **"Book a visit" (terracotta, `tel:`) and "Email us" (leaf outline)** under the facts, side by side on a phone. Book a visit also in the desktop header and the footer. | §1.5: a visit button always visible and a phone route next to it (`links-city-nurseries.md`, `tops-day-nurseries.md`). FB §6.3: phone or email by default. |
| 4 | **"Already with us?" strip, menu first**: this week's menu, closures, school runs, paying. | §2.2 row 5; §4.5 item 5 (menu first). |
| 5 | **The food story is section 1 after the strip**: the recipe card with the week's lunches, puddings and snacks; "Cooked here by…" with a plate-framed photo or the chef's-hat badge; "How we eat"; an allergies line; the free funded-session meal. | §1.7 and §4.5 item 6: food is the most underused selling point; *Setting the Table* and the free meal are Scottish facts every funded provider can claim (FB §3.1). |
| 6 | **Six earthy colour cards with doodles** ("Why families choose us"), one sentence and one leaf button each. | §1.2 item 2 and pattern 3 (`young-friends-kindergarten.md`, `n-family-club.md`). |
| 7 | **Proof: every grade, its exact heading, inspection and publication dates, a 6-leaf meter and the report link; one real award as a stamped plate.** No logo, no "mostly 5s". | §1.4 (1) and (5); FB §4.1. One award object, drawn well, not a badge stack (`bright-beginnings-leeds.md`, `storal.md`). |
| 8 | **Rooms in arched frames**, with drawn still lifes when there's no child-free room photo; room names only if the nursery uses them. | §1.9, §4.5 item 9; empty rooms sell (`bright-beginnings-leeds.md`). |
| 9 | **A day here with the meals marked** by mustard plate icons; times only where supplied. | §4.5 item 10; FB §4.5. |
| 10 | **Settling in as steps plus the nursery's own promise**, including "Tell us what they like to eat". | §1.8: a promise, not a policy (`busy-bees.md`, `kirktonholme.md`). |
| 11 | **Parents' words on a sage band in the display face**, at most 3, labelled without children's names. | §1.4 (3); `young-friends-kindergarten.md` labels by room and date. FB §5.2: no children's names. |
| 12 | **"What's included" as colour tiles** next to the fee line ("Phone us for our current fees" when unpublished). | §1.7 last bullet; §2.3; `bright-horizons-uk.md`, `kids-planet.md`. |
| 13 | **Come and see us** on a forest-green leaf block: 3 honest steps, "no obligation", visit times, both buttons. | §1.5 (`young-friends-kindergarten.md`, `thrive.md`, `kids-planet.md`). |
| 14 | **A drawn local map** (inline SVG) and drive times as real text, plus a directions link. No map embed. | §2.2 row 17; FB §6.4 (no third-party embeds). |
| 15 | **Seven-item menu with "Food" as its own page.** Phones keep "Visit and join" and "Fees and funding" visible; the rest open with a "Menu" button (a word, not an icon). | §2.1: Big Table may add Food as a 7th item. FB §6.1. |
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
21. Doodles never sit on text. Check every doodle at 360, 390 and 430px. The hero doodle is hidden below 40em on purpose.

### Performance
22. Homepage under about 1 MB on a phone. The example weighs **about 220 KB** (fonts 73 KB, CSS 41 KB, photos 45 KB).
23. Photos: WebP (quality 60 to 66) plus JPEG (about 76), `width` and `height` set, `loading="lazy"` below the fold. The desktop hero image (if a photo is used instead of the drawn table) uses `<source media="(min-width: 56em)">` with a 1px placeholder `src`, so phones never download it.

## 4. Homepage structure (keep this order, §2.2)

All ids are used by menus, cards and the footer. Keep them.

1. **Skip link**, then the inline SVG sprite (doodles `#d-*`, kitchen icons `#i-*`). Copy it whole onto every page.
2. **Header** `header.site-header`: `a.brand` (sheep or leaf mark `.brand__mark` 48×48, `.brand__name`, `.brand__place`), `.header-actions` with `a.pill` Phone (word on phones, number from 48em; number in the `aria-label`), `a.btn.header-book` "Book a visit" (from 64em), `button.pill.pill--ink.menu-toggle`. Then `nav.site-nav#site-nav` with 7 items; `li.nav__item--keep` on Visit and join, Fees and funding.
3. **Hero** `section.hero`: `.hero__grid` with `.hero__block` (terracotta leaf block: `.hero__doodle` spiral, `p.status[data-status]`, `h1` with `span.eyebrow` name and town then the promise, `p.hero__lead` fact sentence) and `figure.frame-arch.hero__photo` (desktop only: the drawn table, or a real table photo). Then `dl.facts` (5 chips; `.facts__wide` for grades) and `.actions` (Book a visit, Email us).
4. **Dated notice** (optional) `[data-show-from][data-show-until]` with `.notice` (closures, open days, deadlines only). A commented example sits in the homepage.
5. **Already with us?** `section.already`: `h2` and 4 links with kitchen icons, menu first.
6. **Today at our table** `section#food`: `.section-head` (eyebrow line, `h2`, lede), `.table-story` = `article.recipe` + a stack (`.cook`, "How we eat" `ul.how-we-eat`, allergies `.callout`, funded meal `.callout--clay`, link to Food), then an optional `.strip-photo` (a band of real plates).
7. **Why families choose us**: `ul.cards.cards--3` of 4 to 6 `li.card.card--{colour}`, each with `svg.card__doodle` (`data-draw`), `h3`, `p`, `a.leaf-link`.
8. **Proof** `section#proof` (cream): `.proof` = `.grades` panel + `.stamp` (award). Add an exact inspector quote in `p.quote-inspector` with month and year only if you have the report text.
9. **Our rooms** `section#rooms`: `ul.rooms` of `li.room.room--clay|--sage` with `.room__art` (drawn SVG or a room photo), `h3`, `.age-chip`, `p`.
10. **A day here** `section#day` (clay): `ol.day`, `li.day__meal` for meals, `.day__time` only where supplied.
11. **Settling in** `section#settling`: `ol.steps` + the nursery's promise in `.callout--mustard`.
12. **Families together**: a photo (`.photo`) + text, only for things the nursery really does (stay-and-play, harvest lunch, community links). Add a "Try this at home" recipe card only with the nursery's real recipe.
13. **The people at the table**: manager and cook first (`.cook` with `.badge--initials`, `.badge` chef's hat or `.frame-plate.cook__photo`), link to the team.
14. **Parents say**: `section.quotes-band`, `ul.quotes` of 3 `figure`s.
15. **What's included** `section#fees`: `ul.included.included--4` tiles, then the fee line and funded hours in `.split`.
16. **Come and see us** `section#visit`: `.visit` block (forest): `.visit__doodle`, `h2`, lead, `ol.steps.steps--row`, visit-times callout, both buttons.
17. **Find us** `section#contact`: status pill, `dl.summary`, "Get directions", `ul.minutes` (drive times as text), `figure.map` (drawn SVG).
18. **Jobs strip** (only with vacancies): a `.callout` with role, closing date and how to apply.
19. **Footer** `footer.site-footer` (deep brown, wavy `.site-footer__edge`): `.foot-promise` (doodles, the promise, Book a visit), `.foot-cols` (contact; About us: Care Inspectorate record, complaints, policies, privacy; Help for families), `.foot-bottom` (©, CS number, "Page last reviewed" and "Next review due").
20. `script#nursery-schedule` (section 8), then `<script src="../table.js" defer>`.

Sections alternate the speckled paper, `.section--cream` and one or two tinted bands (`.section--clay`, `.quotes-band`). Never put two tinted bands next to each other.

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags and no sideways scroll on any page. Breakpoints are in em; side gutters come only from `.wrap`.

| From | What changes |
|---|---|
| 0 | One column. Header: name, Phone and Menu pills; the two keep items in a band under the mustard rule. Hero block full width, no doodle. Facts in 2 columns (grades full width). Both hero buttons share one row. Already-with-us links 2×2. Recipe day name above the dish. |
| 30em (480px) | The sheep mark appears beside the name. Hero buttons stop stretching. Drive times in 2 columns. |
| 36em (576px) | Recipe rows put the day in a left column. Grades rows put the grade beside the heading. `dl.summary` puts the label beside the value. |
| 40em (640px) | Facts in 3 columns. Colour cards and "help" cards in 2 columns. The hero spiral doodle appears. Fee tables stop stacking. |
| 46em (736px) | Rooms in 2 columns. |
| 48em (768px) | The header Phone pill shows the number. The lunch strip photo becomes a thin band. |
| 52em (832px) | `.split` goes to 2 columns. |
| 56em (896px) | Hero gets its arched drawing on the right. Proof, quotes, `.steps--row` and already-with-us go to rows. |
| 60em (960px) | Recipe card beside the food story. |
| 64em (1024px) | Full 7-item nav row; Book a visit in the header; Menu button goes. Facts in one row of 5. Cards in 3 columns. Footer in 3 columns. Menu weeks 2 up on the Food page. |

Rules:
- Keep the brand to the nursery's short name plus a small place line, so it fits beside two pills at 360px. Long names: drop the place line on phones rather than shrink the name below 1.2rem.
- Doodles sit on corners with negative offsets no larger than the side gutter (16px), so they never cause sideways scroll.
- Rotation is limited to the 2° button tilt. Never rotate cards or text.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn` | Terracotta leaf button, once per screen ("Book a visit"). Variants: `--leaf` (olive outline), `--light` and `--outline-light` (on dark blocks), `--mustard` (ink text, footer and visit block). |
| `.pill`, `.pill--ink` | Header Phone and Menu buttons. |
| `.leaf-link` | Small leaf button on colour cards (cream on dark cards, ink on mustard/sage/clay cards). |
| `.go` | Stand-alone verb link with an arrow, 44px tall. |
| `.status[data-status]` | Live status pill (filled by `table.js`); static fallback text in `[data-status-text]`. |
| `.notice` in `[data-show-from][data-show-until]` | Dated notice. |
| `.facts`, `.facts__wide` | Key facts strip. |
| `.already` | Current parents' strip. |
| `.recipe`, `.recipe__head`, `.recipe__tag`, `.recipe__days`, `.recipe__day`, `.recipe__dish`, `.recipe__pud`, `.recipe__snacks`, `.recipe__veg`, `.recipe__foot`, `.recipe__steam` | The recipe card. One `li` per day. Use it on Home (this week), Food (all weeks, in `.menu-weeks`) and Parents. |
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
| `.visit`, `.visit__doodle` | The "Come and see us" block. |
| `.summary`, `.ruled`, `.ticks`, `.minutes` | Key–value rows, hairline lists, ticked lists, drive times. |
| `.map` | Figure for the drawn local map. |
| `.frame-arch`, `.frame-plate`, `.photo`, `.strip-photo` | Arched room frames, circular plate frames (food, people), leaf-corner photos, a thin band of plates. |
| `.page-head`, `.page-head__block--{olive, terracotta, forest, brick, teal, deep}`, `.page-head__doodle`, `.breadcrumb`, `.contents` | Inner page heads and "On this page" chips. |
| `.table`, `.table--stack`, `.table-note`, `.panel`, `.faq`, `.next-links` | Inner-page parts. `.table--stack` turns rows into cards below 40em (cells need `data-label`). |
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
| `--text-base`, `--text-small`, `--text-lead` | 18px, 17px, 20px | Never below 17px. |
| `--h1`, `--h2`, `--h3` | `clamp()` scales, 21.6px | Line height 1.15 or more for Gluten. |
| `--leaf`, `--leaf-sm`, `--arch` | `2rem .4rem 2rem .4rem` etc. | The one brand shape. Use it everywhere a corner is rounded. |
| `--tap`, `--button-height` | 44px, 54px | Never lower. |
| `--gutter`, `--section`, `--wrap` | fluid, fluid, 74rem | Layout. |

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

**Page head:** `div.page-head > .wrap` with `nav.breadcrumb`, `.page-head__block--{colour}` (doodle, `h1`, `p.page-head__lead`, optional status pill and actions), then `nav.contents` ("On this page" chips). Sections alternate cream and paper; each opens with `.section-head` (`h2` and a lede).

| Page | Block colour | Sections, in order |
|---|---|---|
| `join-us.html` (Visit and join) | olive, sprout | Book a visit (3 steps, visit times, "Questions you might ask" panel) · How places are offered (`dl.summary`: places now, registered places, ages, waiting list, moving up) · Sessions (`.table--stack`) · Settling in (steps + the nursery's guarantee) · Your information (privacy) |
| `food.html` (Food) | terracotta, steam | Our four-week menu (week chips, one recipe card per week, season and year, PDF alongside) · How we eat · Babies and first tastes · Allergies and special diets · Free meals at funded sessions (*Setting the Table*) · Food safety (Food Hygiene Information Scheme result only if "Pass" and dated) |
| `our-nursery.html` | forest, fern | A day here · Our rooms · Outdoors · Out of school club (if any) · Additional support · Families and community · Inspection and awards (grades + stamp) · Who we are |
| `fees-and-funding.html` | brick, wheat | What's included · Our fees (fee table with "Fees from [date]", or "Phone us for our current fees") · Funded hours (council, how to apply) · When funding starts (birthday table) · 2 year olds · Help with costs (Tax-Free Childcare, Universal Credit, Parent Club) |
| `our-team.html` | teal, dots | Who's who (manager and cook first; whole-team list) · Growing our own (training, apprentices, awards) · anything else the nursery says about its people. "Ask us about our staff ratios when you visit." |
| `parents.html` | deep, seed | Closures · This week's menu · School drop-off and pick-up (if any) · Your child's day (app, only if confirmed) · Paying fees · Worries and complaints (nursery, then the Care Inspectorate) · Policies and reports · Keeping children safe (999) |

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
- [ ] The first 390×844 screen shows the status, name, promise, fact sentence, key facts and both buttons.
- [ ] Menu is 7 items at most; "Visit and join" and "Fees and funding" visible on phones.
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
