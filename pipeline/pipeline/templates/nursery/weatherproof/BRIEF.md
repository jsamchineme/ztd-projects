# Weatherproof: a website template for outdoor nurseries in Scotland

> Pipeline name: **Weatherproof** (folder `templates/nursery/weatherproof/`). One of the five engaging nursery directions (Cut and Stick, Full Stop, Chapter One, **Weatherproof**, Big Table) that sit beside the calmer Front Desk Nursery (`nursery/front-desk`), Key Worker (`nursery/key-worker`) and Garden Gate (`nursery/garden-gate`). When this brief says "Weatherproof", it means this template.

**The idea in one line:** a bold two-colour outdoor brand (deep loch and gorse yellow, a drawn emblem, wide capitals, a hi-vis stripe) that sells the outdoors as a promise, in Scottish weather, and proves it with the places, the kit and the inspector's own words.

**Who it's for:** forest-school and outdoor nurseries, and nurseries whose identity is outdoor play: a farm, a wood, a beach, daily walks. Any size. Suggested prospects: Abriachan Forest School, Earthtime's Forest School Nursery, Bardykes Farm Nursery School, The Croft Nurseries, KingsWellies, Acre Wood, Babes in the Wood, Woodlands Nursery, Dalmahoy Woodland. **Not** The Secret Garden Outdoor Nursery, which is Garden Gate's example.

**How it differs from Garden Gate.** Garden Gate is a calm photo walk-through of a place and needs 10 to 16 photos. Weatherproof is an attitude and a brand. It needs 0 to 8 photos and sells **adventure and resilience**: what happens in rain, wind, cold and sun, where the children go, and what they wear.

The research behind it:
- `prospects/research/nursery-engaging-patterns.md` (13 October 2026), especially §4.4 (this direction), §1 (selling patterns), §2 (blueprint), §3 (visual vocabulary) and §5 (build notes). Cited below as **E§**.
- `prospects/research/nursery-websites.md` (the first brief), especially §3 (Scottish facts), §4 (trust), §5 (photos) and §6 (structure). Cited as **§**.
- Study files in `prospects/research/nursery-sites/`, cited by name, for example `[littleforestfolk.md]`.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token; section 13 holds the classes the drawn art uses. | Tokens only (section 1) |
| `weatherproof.js` | About 200 lines of plain JavaScript. Parts 1 to 4 are Front Desk's shared logic, unchanged: phone menu, dated notices, the live term-aware status and term-date marks. Part 5 draws the route map once and nudges the weather glyphs once, only without `prefers-reduced-motion`. | Never. It reads its data from the page |
| `fonts/` | Archivo (Omnibus-Type), one variable file instanced to weight 400 to 800 and width 100 to 125%, Latin (51 KB) and Latin Extended (46 KB, loaded only when needed). SIL Open Font Licence in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | What to photograph, how, and what never to photograph. | Read it; give it to the nursery |
| `example/index.html` | Worked homepage for **Earthtime's Forest School Nursery**, a real, fully outdoor charity nursery on Duffus Estate near Elgin, Moray. Built only from its own website and its Care Inspectorate record and report. | Copy it for each nursery |
| `example/join-us.html`, `our-nursery.html`, `fees-and-funding.html`, `our-team.html`, `parents.html` | The five worked inner pages, one per menu item. | Yes |
| `example/img/` | Six of the nursery's own photos (no children) as WebP and JPEG, and `CREDITS.txt`, which also lists every photo **not** used and why. | Each nursery gets its own `img/` |
| `thumb.jpg` | Picker thumbnail. Regenerate with `node pipeline/template-thumbs.mjs nursery/weatherproof`. | After changes |

Pages link `../styles.css` and `../weatherproof.js`; fonts load from `../fonts/` through the stylesheet. Keep that folder shape. No build step, no framework, and nothing loads from another server: no Google Fonts, no CDNs, no analytics, no maps, no social embeds, no booking widgets (GDPR, §6.6).

**All illustration is inline SVG inside the HTML**, hand-drawn in code for this template: the emblem, the horizon, the footer hills, the route map, the kit pegs, four weather glyphs, an award rosette and about 20 line icons. Each big piece starts with an `<!-- ART ... -->` comment in `example/index.html`. They take their colours from CSS classes tied to the tokens, so re-theming recolours them. No stock packs, no AI images, **no people, no faces, no hands**, no animals with faces (the one squirrel on the map is a silhouette).

---

## 1. Concept, and what it avoids

Parents' fears about outdoor nurseries are practical: cold, wet, safety, toilets, kit. Their hopes are emotional: the free, muddy childhood they remember [`littleforestfolk.md`, `willowden.md`]. Weatherproof answers both at once.

- **A promise, then a fact.** The `h1` is the promise: "Outside every day. Whatever the weather." The sentence under it is the fact: who, where, ages, hours, weeks (E§1.1).
- **Weather as the selling section.** Four tiles (Rain, Wind, Cold, Sun) say what happens in each, in one bold line and one or two sentences. Facts the inspector saw get a "Seen by the inspector, [month year]" tag. This is the direction's signature.
- **Real places, by name.** A drawn route map with numbered stops and a plain list underneath: the base, the parachutes, the field, the woods. Real place names only, ideally the nursery's own.
- **Kit on pegs.** A drawn peg rail (hat, waterproof jacket, dungarees, mittens, bag, wellies, socks) beside a ticked list of what the nursery really provides, and an honest "Phone to check" list for the rest.
- **The practical questions answered plainly.** Where children eat, rest and go to the toilet, in "A day outside" (E§4.4 item 10).
- **Proof that fits the brand.** A loch band with every grade and its date, one exact inspector quote about the outdoors, and real awards set in our own type.

**Premium, not twee.** Two confident colours, one family of type, wide capitals, flat drawings with thick strokes, a 6% grain on the gorse only, and lots of space. No rainbows, crayon fonts, cartoon animals, smiling suns, stock toddlers or tartan (E§3).

**Why Earthtime as the example.** It is fully outdoor (the Care Inspectorate registers it as "a fully outdoor care service"), it has real named places (its own hand-drawn site map), real weather and kit facts in its inspection report, a Forest School accreditation, all 5s, a 2025 award shortlisting, and good empty photos of the yurt base and the parachute canopy. Its current site hides most of that behind sliders and partner logos.

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Promise-led `h1`** with the nursery name as an eyebrow inside it: `<h1><span class="eyebrow">Name, Place</span> Outside every day. Whatever the weather.</h1>`, then a plain fact sentence. | Feeling first, then a hard fact straight underneath (E§1.1, Busy Bees). The first phone screen must still answer "Is this for us?" (§6.2). |
| 2 | **Gorse hero, no photo on phones, no text on a photo.** A desktop-only arched photo of the welcome sign. | Thin white text on busy outdoor photos fails [`littleforestfolk.md`]. Phones never download the hero photo (Front Desk pattern). |
| 3 | **Key facts as loch luggage tags with gorse labels** (ages, hours, funded, places, inspection), 2 columns on a phone. | E§2.2 item 3 and E§4.4 item 3. Location and practical fit are the top reasons for choosing [SG25-7]. |
| 4 | **Two actions side by side** on a phone ("Book a visit" as a `tel:` link, "Email us"), then a visit button in the header on desktop, in "Come and see us", and in the page heads. | A visit button always visible, a phone next to it (E§1.5) [`links-city-nurseries.md`, `tops-day-nurseries.md`]. Default to phone or email; no form (§6.3). |
| 5 | **"Already with us?" band** in loch, continuing the horizon's ground, with "Today's kit" among four links. | Current parents shouldn't scroll through the pitch (E§2.2 item 5, E§4.4 item 5). |
| 6 | **Weather tiles** with "Seen by the inspector" tags. Only practice the nursery or its report confirms; otherwise the tile asks the parent to phone. | E§4.4 item 6 (the signature section). Kirktonholme's "no such thing as bad weather" kit list [`kirktonholme.md`]. Never invent practice (§3.6). |
| 7 | **Drawn route map** with numbered stops and a real `<ol>` underneath; one photo per stop where there is one. No map embed. | E§4.4 item 7. Real places sell [`banbury-cross.md`, `links-city-nurseries.md`]. Map embeds are third-party trackers (§6.4). |
| 8 | **Proof band in loch**: every grade with exact headings and dates, one exact inspector quote, real awards in our type. Never the Care Inspectorate logo. | E§1.4 (inspector's words beside the full grades) [`links-city-nurseries.md`, `storal.md`, `partou-uk.md`]. One award object, drawn [`bright-beginnings-leeds.md`]. |
| 9 | **Kit pegs plus two lists**: "What we know" (ticks) and "Phone to check" (question marks). | E§4.4 item 9 [`willowden.md`, `littleforestfolk.md`]. Never invent a kit list or what's provided (§3.6). |
| 10 | **"A day outside"** with where children eat, rest, wash and go to the toilet. Times only if supplied. | The questions parents of outdoor nurseries ask [`littleforestfolk.md`] (E§4.4 item 10, §4.5). |
| 11 | **Groups as cards with a hi-vis top edge**: ages big, the group's own name, sessions, numbers and ratio only as published. | Named groups make 0 to 5 a journey (E§1.9). Never invent names; use age bands if there are none. Ratios only as the nursery states them (§3.3). |
| 12 | **Manager card** with a consented photo or an initial roundel, and a line on outdoor qualifications as supplied. | E§1.11 and E§4.4 item 12. "Liked and trusted the staff" is the second reason for choice [SG25-7]. |
| 13 | **Parents say: 3 quotes at most**, each with its source and date, on white with a gorse quote mark and stripe. No slider. | E§1.4 (3 short quotes, sourced and dated) [`young-friends-kindergarten.md`]. No carousels (§6.4). |
| 14 | **Fees as big figures plus "What's included"** on the homepage; a fee table that **stacks into cards** below 640px on the fees page. | E§2.3 [`willowden.md`'s table broke words on a phone]. "Fees from [date]" or "Phone us for our current fees" (§3.6). |
| 15 | **"Come and see us" in loch**: "Visits happen outside, so wear your boots", 3 steps, both actions. | E§1.5 and E§4.4 item 15 [`young-friends-kindergarten.md`, `thrive.md`]. |
| 16 | **One family: Archivo.** Wide (120%) extra-bold capitals for `h1` and `h2`; 700 sentence case for `h3`; 400 at 100% width, 18px, for body. | E§4.4 Type: one variable file keeps it fast and gives the sports-brand caps of Little Forest Folk [`littleforestfolk.md`]. Body 400+ at 18px (E§3). |
| 17 | **Focus: a 3px loch ring with a 2px white gap** everywhere, a gorse ring on loch grounds. | GOV.UK yellow vanishes on gorse (E§4.4 Palette). |
| 18 | **Motion only once, only to reward a scroll**: the route draws itself (600ms), weather glyphs nudge once. All off under `prefers-reduced-motion`; nothing depends on JS to appear. | E§3 Motion; WCAG 2.2.2. Lazy frames showed empty outlines on Young Friends [`young-friends-kindergarten.md`]. |
| 19 | **Six-item menu**, "Visit and join" and "Fees and funding" always visible on phones, the rest behind a button labelled "Menu". | §6.1, E§2.1. |
| 20 | **Footer in loch with drawn hills**, the emblem, the promise in caps, CS number, charity and company numbers, "Page last reviewed". | E§4.4 item 17, §6.1. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, policy, place name and practice must come from the nursery's site or documents, or its Care Inspectorate record and latest report. The binding list is §3.6: never invent fees, availability, funded status, grades, report dates, ratios, staff, qualifications, SSSC status, menus, allergen handling, hours, closures, policies, awards, reviews, "forest school", "Gaelic medium", languages, ASN specialisms, apps, CCTV, parking or access features.
2. **"Forest school" only if the nursery says so** (§3.6). Earthtime does: it describes itself as "a fully outdoor Forest School accredited setting".
3. **Weather tiles hold confirmed practice only.** Use the nursery's words or its inspection report. If you have nothing for one weather, make that tile's last sentence "Ask us how we [plan for stormy days]". Tag report facts with `p.seen` "Seen by the inspector, [Month Year]".
4. **Route map: real places only.** Use the nursery's own names (its site map, its pages, its report). Don't claim how often children go anywhere unless the nursery says so. The drawing is "not to scale" and says so in its caption.
5. **Kit: never write a kit list the nursery hasn't given you.** Show what it provides (only if true) and put the rest under "Phone to check".
6. **Grades:** every grade from the latest report, with its exact headings, the inspection dates and the publication date, and a link to the service record. Never only the best grade, never the Care Inspectorate logo, never "mostly 5s" (E§1.4).
7. **Inspector quotes:** copied exactly from the latest report, with the month and year, beside the grades. Never trimmed so the meaning changes. A quote never replaces the grades.
8. **Parent quotes:** from the nursery's own site, or parents quoted in its inspection report, attributed exactly as the source does ("A parent, in our Care Inspectorate report, February 2025"). Three at most.
9. **Awards:** the award name, the body and the year, and "Finalist" or "Shortlisted" when that's what it was. Set in our type; don't reuse an awarding body's artwork unless its rules allow.
10. **Funded status changes** (§3.1). Confirm with the nursery and, where possible, the council's provider list.
11. **Where sources disagree**, use the newest dated source and list the disagreement in your report. If it affects money, write "Phone us for the current amount".
12. **Dates:** term dates go in the term table *and* the schedule JSON and must match. Check every weekday with a script.

### Photos (§5, E§3, `PHOTO-SHOTLIST.md`)
13. **No identifiable children, ever.** Treat any old-site image with a child in it as excluded, including group posters. No hi-vis close-ups.
14. **Allowed:** the base, empty woods and fields, kit on pegs, the gate or sign, food as served, staff with their own written consent, children from behind at a distance where no one can be recognised.
15. Strip all metadata. Record every photo used and every one rejected, with the reason, in `img/CREDITS.txt`.
16. The template must look complete with **no photos at all** (see section 12).

### Content style
17. Times "8am", "8:45am", "midday"; ranges with "to"; days and months in full. Homepage sentences 20 words or fewer. Reading age 9 to 11.
18. Phone numbers are `tel:+44…` links shown as written locally. 999 is plain text, never a link.
19. Links start with a verb and make sense alone. Menus, chips and breadcrumbs are labels.
20. **Copy voice:** upbeat, brisk, outdoorsy, a little dry and Scottish. Short imperatives in headings ("Dressed for it", "Come and see us"), plain reassurance in the body. **Avoid** "wild" in every heading, policy jargon on the homepage (UNCRC, Realising the Ambition) [`willowden.md`], and endorsements we can't verify [`littleforestfolk.md`].
21. Wide caps (`h1`, `h2`) are for 8 words or fewer. Longer headings go in `h3` sentence case.

### Accessibility (WCAG 2.2 AA)
22. Keep the token pairs in section 8. Text 4.5:1, UI edges and focus 3:1. **Never white text on gorse.**
23. One `h1` per page, `h2` per section, `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. Skip link first.
24. Focus is drawn by `styles.css` (loch ring with a white gap; gorse on dark). Any new dark surface gets class `on-dark` so focus turns gorse.
25. Tap targets 44×44px. Stand-alone links use `.go`. A short link alone in a fact (`.tag dd a`) or summary row (`a.tap`) gets a 44px tap height without changing the line.
26. Every drawing is `aria-hidden="true"`. Its facts live in real text next to it (the stop list, the kit list, the tile text).
27. Motion only inside `prefers-reduced-motion: no-preference`. Rotation 2 degrees or less; no loops.

### Known quirks of the in-house audit
28. Some nursery and council sites block automated checks (Earthtime's own site returns 403 to browsers it thinks are bots). The audit lists those as information only. Check them by hand.
29. Inline SVG for logos and art. Never `<img src="….svg">` for text-only SVGs.
30. The skip link sits off-screen until focused; the audit may flag it as unclickable. That's a known false positive.

### Performance
31. Homepage under about 1 MB on a phone. The example weighs **410 KB on a 390px phone** with every lazy image loaded (HTML 58 KB, CSS 50 KB, JS 9 KB, font 51 KB, five photos 242 KB), before gzip.
32. Photos: 4:3 at 720 and 1200px, 4:5 at 480 and 800px, portraits 1:1 at 200 and 400px; WebP plus JPEG; `loading="lazy"`, `width` and `height` below the fold.
33. The hero photo uses `<source media="(min-width: 56em)">` with a 1px placeholder `src`, so phones never download it.

## 4. Homepage structure (keep this order; E§2.2, E§4.4)

All ids are used by menus, chips and the footer. Keep them.

1. **Skip link** `a.skip-link` → `#main`, then the inline icon sprite (`#i-phone`, `#i-mail`, `#i-arrow`, `#i-down`, `#i-calendar`, `#i-boot`, `#i-clock`, `#i-coins`, `#i-eye`, and day icons `#i-sign`, `#i-leaf`, `#i-drop`, `#i-bowl`, `#i-hammock`, `#i-home`, `#i-book`, `#i-chat`, `#i-tent`, `#i-pin`).
2. **Header** `header.site-header` (loch): `a.brand` (the emblem `svg.brand__mark.emblem`, `.brand__name` in wide caps, `.brand__place`), `.header-actions` with `a.call-roundel` (icon only below 30em, "Phone" to 48em, the number from 48em; the number is always in the accessible name), `a.btn.btn--gorse.header-visit` (from 64em) and `button.menu-toggle`. Then `nav.site-nav#site-nav` with 6 items; "Visit and join" and "Fees and funding" are `li.nav__item--keep`.
3. **Hero** `section.hero` (gorse with grain): `p.status[data-status]` (no-JS text in `[data-status-text]`), `h1` with `span.eyebrow`, `p.hero__lead`, optional `figure.hero__photo` (desktop only), `dl.tags` (5 `div.tag`, the last `.tag--wide`), `.actions.hero__actions` (Book a visit, Email us), then `svg.horizon`.
4. **Dated notice** (optional) `div.notice-band[data-show-from][data-show-until]` straight after the hero. Closures, snow, a real open morning, or a true "Places for [season]" with a show-until date. Never standing marketing.
5. **Already with us?** `section.quick.on-dark`: `h2`, 4 links with icons (term dates, today's kit, holiday care or app, funded hours or pay fees).
6. **Whatever the weather** `section#weather`: `ul.weather` of 4 `article.wx` (alternate `wx--dark`): glyph, `h3` (the weather), `p.wx__line` (the bold line), 1 or 2 `p`, optional `p.seen`.
7. **Where we go** `section#where.section--alt`: `.route` with `figure.route__map` (the drawn map + caption) and `ol.stops` (3 to 6 `li`, each `h3`, `p`, optional `figure.stop-photo`).
8. **What the inspector saw** `section#proof.section--loch.on-dark`: `.split--wide-left` with `blockquote.inspector` + `ul.awards` (each `li.award` with the rosette), and the `.grades` panel.
9. **Dressed for it** `section#kit`: `.kit` with `figure.kit__art` and the lists (`ul.ticks`, `ul.ticks.ticks--ask`).
10. **A day outside** `section#day.section--white`: `ol.day` (icon, optional `span.day__when`, `h3`, `p`) and an `aside.panel` "Our groups".
11. **Team** `section#team`: `.manager` card.
12. **Parents say** `section#parents-say.section--alt`: `ul.quotes` of 3 `blockquote.quote`.
13. **Fees and funding** `section#fees.section--white`: `.figure-row` big fees, the date line, and a "What's included" `.panel`.
14. **Come and see us** `section#visit.section--loch.on-dark`: `ol.steps`, the places line, both buttons (`.btn--gorse`, `.btn--light`), optional arched photo.
15. **Find us** `section#find`: status pill, `dl.summary` (address, phone, email, parking and drop-off), "Get directions" (a Google Maps search link, never an embed), optional site-map image.
16. **Jobs strip** only when there are real vacancies.
17. **Footer** `footer.site-footer`: `svg.site-footer__edge`, the promise row (emblem + caps line), 3 columns, `.foot-bottom` (registrations, office, review dates).
18. **Schedule** `script#nursery-schedule`, then `<script src="../weatherproof.js" defer>`.

Sections 7 to 13 may move to suit the nursery (E§2.2 flex rules). Sections 1 to 6 and 13 to 17 stay in order. **Any section the nursery can't fill with real content is removed, not faked.**

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags on any page. Breakpoints are in em; side gutters come only from `.wrap`.

| From | What changes |
|---|---|
| 0 | One column. Header: emblem, name, round phone button, Menu. Keep-items band below. Tags in 2 columns, the inspection tag full width. The two hero buttons side by side. Weather tiles one per row, glyph beside the title. Route list with a dashed trail between numbered roundels. Fee and term tables become cards. |
| 30em (480px) | The phone button says "Phone". Buttons size to their text. |
| 40em (640px) | Tags in 3 columns. Weather tiles 2 by 2. Grids go to 2 columns. Tables become real tables. |
| 48em (768px) | Body text 19px. The phone button shows the number. |
| 56em (896px) | Hero photo appears (arched, 4:5). `.split` goes to 2 columns. Route map sticks beside the stop list. Kit art beside its lists. Quotes in 3 columns. |
| 64em (1024px) | Full 6-item nav row; the Menu button goes; "Book a visit" appears in the header. Tags in one row of 5. Weather tiles in one row of 4 with the glyph on top. Grids go to 3 or 4 columns. Footer in 3 columns. |

Rules: check every page at 360px with a long nursery name (`.brand` flexes at `1 1 9rem` and wraps); keep wide-caps headings to 8 words; wrap postcodes in `span.nowrap`.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn` | Loch pill with a pressed shadow. The main action on stone and gorse. |
| `.btn--gorse` | Gorse button for loch grounds (header, "Come and see us"). |
| `.btn--outline`, `.btn--light` | Second action on light and on loch grounds. |
| `.go` | Stand-alone verb link with an arrow and a 44px tap height. |
| `.call-roundel` | The header phone button (gorse). |
| `.status[data-status]` | Live status pill: open, closing, closed. Hero, Find us, and the page heads of Visit and join and Parents. |
| `.tags`, `.tag`, `.tag--wide` | Key facts as luggage tags (`dl`). `small` holds the second line; `small.wide-only` hides below 40em. |
| `.quick` | "Already with us?" band. |
| `.weather`, `.wx`, `.wx--dark`, `.wx__glyph`, `.wx__line`, `.seen` | Weather tiles. |
| `.route`, `.route__map`, `.stops`, `.stop-photo` | Route map and its list. The SVG's `.trail` path and `g.stop` roundels animate. |
| `.kit`, `.kit__art`, `.ticks`, `.ticks--ask` | Kit pegs and ticked lists ("?" for things to ask). |
| `.grades`, `.grades__list`, `.meter[data-grade]` | Grades panel (dark). The meter is `aria-hidden`; the words carry the meaning. |
| `.inspector`, `.awards`, `.award` | The inspector's quote, and awards with the rosette. |
| `.day`, `.day__icon`, `.day__when` | Timeline with a gorse rail (day, history). |
| `.group`, `.group--loch`, `.group__ages` | Group cards with a hi-vis top edge. |
| `.manager`, `.people`, `.person`, `.person__initial`, `.names` | Staff: manager card, initial roundels, a compact first-name list. |
| `.quotes`, `.quote` | Parents' words. |
| `.steps`, `.steps--row` | Numbered steps (visits, joining, complaints). |
| `.table`, `.table--stack`, `.group-row`, `.closed-tag`, `.table-note` | Fee and term tables; `tr[data-from][data-to]` get past, Now and Next. |
| `.figure-row` | A big figure with a line ("£50", "1,140"). |
| `.summary`, `.ruled`, `.note`, `.panel`, `.panel--loch`, `.details`, `.photo`, `.photo--arch` | Shared parts. |
| `.page-head`, `.breadcrumb`, `.jump` | Inner page head (gorse, with the horizon) and the "On this page" chips in loch. |
| `.notice-band`, `.notice` | Dated notice. |
| `.on-dark` | Put on any loch surface so focus rings turn gorse. |

## 7. The drawn art, and how to redraw it

Everything is flat, two-colour (loch and gorse, with mist, stone and one heather accent), thick-stroked and drawn in code. Keep that style if you add pieces.

1. **The emblem.** A gorse roundel with a loch ring, built from the nursery's real landmark. Earthtime's is its parachute shelter between two pines. Draw a new one per nursery from something real: a pine or rowan, a hill line, the farm gate, a boat shed, the cabin. It is the logo mark (44px), the footer mark (64px) and the favicon (a simplified data-URI copy in `<head>`). **If the nursery has its own logo, respect it:** put the logo in the header as an inline SVG, and use the roundel only as a frame or section marker (E§4.4 component 1).
2. **The horizon.** 1440×140, sliced from the middle on phones (`preserveAspectRatio="xMidYMax slice"`), so keep the landmarks between x 400 and 1050. Far hills in `.far` (gorse shade), the ground and landmarks in `.near` (loch), one lit window in `.lit`. Swap the landmarks for the nursery's: a byre, a boat, a cabin, a gate.
3. **Weather glyphs.** Rain cloud, wind with a blown leaf, snowflake, sun. `stroke="currentColor"`, accents in `.acc` (gorse). Keep all four even if a tile says "ask us".
4. **The route map.** 640×400. Ground, a road, the trail (`.trail-bed` white, `.trail` loch), numbered `g.stop` roundels and landmarks (pines, round trees, a yurt, a canopy, a fence, a meadow, a walled garden, a compass). Redraw per nursery: move the roundels to match the list order, redraw the trail through them, and use landmarks from the nursery's real places. The numbers in the SVG must match `ol.stops`.
5. **Kit pegs.** 640×360. Decorative only; the list beside it carries the facts. Recolour by token; if the nursery colour-codes waterproofs by group, recolour the jacket and dungarees to match.
6. **Award rosette.** Gorse star with a pine. Use it only beside a real award.

## 8. Tokens (section 1 of `styles.css`)

| Token | Default | Role, and the rule to keep |
|---|---|---|
| `--loch` | `#0E3B43` | Brand, header, footer, buttons, headings, links. White on it 12.2:1; on stone 10.8:1. **Keep 7:1 or more with white.** |
| `--loch-deep` | `#0A2E34` | Hover, nav band, grades panel. Gorse on it 8.7:1, mist 10.0:1. |
| `--gorse` | `#F4C31B` | Hero, stripe, roundels, tags' labels. Loch on it 7.3:1; ink 10.7:1. **Never white text.** |
| `--gorse-shade` | `#D9A912` | Far hills and grain on gorse. Decorative only. |
| `--stone`, `--stone-2`, `--white` | `#F4F1EA`, `#EAE4D6`, `#FFFFFF` | Page ground, alternate band, cards. Loch on stone-2 9.6:1. |
| `--ink`, `--ink-soft` | `#15191A`, `#4A5457` | Body 15.7:1 on stone; secondary 6.9:1 on stone, 6.1:1 on stone-2. |
| `--mist` | `#CFE3DF` | Text on loch 9.1:1; pale fills. |
| `--heather` | `#7A3E6E` | One small accent per section (weather labels, "Seen by" tags, timeline times, closed tags). 6.8:1 on stone. |
| `--line`, `--line-strong` | `#D8D1C1`, `#7D7869` | Hairlines; meter and control edges. |
| `--open`, `--closing`, `--closed`, `--notice-bg` | `#00703C`, `#8A4B00`, `#4A5457`, `#FFF4CC` | Status and notices. Don't re-theme. |
| `--focus`, `--focus-gap`, `--focus-on-dark` | loch, white, gorse | Focus rings. Don't change. |
| `--font`, `--wide`, `--display-weight`, `--track` | Archivo, 120%, 800, 0.02em | Wide caps for `h1` and `h2` only. |
| `--text-base`, `--text-small`, `--text-lead` | 18px (19px from 48em), 16px, 20px | Don't go below 16px anywhere. |
| `--h1`, `--h2`, `--h3` | `clamp()` scales, 20px | Lower `--h1` only if a long promise breaks at 360px. |
| `--radius`, `--radius-small`, `--stripe` | 18px, 10px, 6px | Cards; tags; the hi-vis stripe. |
| `--tap`, `--button-height` | 44px, 52px | Never lower. |

### How to re-theme for a new nursery
1. Copy the whole folder, or copy `example/` to a sibling folder so `../styles.css`, `../weatherproof.js` and `../fonts/` still resolve.
2. **Gather facts** first (section 14's list): the nursery's site and documents, its Care Inspectorate record, and its **latest inspection report** (the record page links the PDF). The report is often the richest source of outdoor practice.
3. **Colours.** Weatherproof is a two-colour brand. Take the nursery's deep colour (sign, fleece, logo) for `--loch` if white on it is 7:1 or more, and set `--loch-deep` about 25% darker. Take its bright colour for `--gorse` if loch on it is 7:1 or more; otherwise keep gorse. Update `--gorse-shade` (about 10% darker) and the inline SVG fills that use hex values (`#0E3B43`, `#F4C31B`, `#CFE3DF`, `#7A3E6E`; search and replace in the HTML and in the data-URI quote marks and ticks in `styles.css`). Then re-check every pair in the table above.
4. **Emblem and horizon** (section 7): redraw from the nursery's real landmark.
5. **Copy:** replace every Earthtime fact on every page. Afterwards `grep -n -i "earthtime\|duffus\|01343\|IV30\|kristy\|moray\|hopeman\|saplings\|wildcats\|CS2018364459\|SC043507" *.html` must return nothing from Earthtime.
6. **Schedule and dates:** rewrite `#nursery-schedule`, the term table, and any notice. Check weekdays with a script.
7. **Grades:** copy every heading, grade and date from the latest report. Check the record link resolves.
8. Update `<title>`, meta description, `theme-color` (= `--loch`), the favicon data URI and the footer review dates.
9. Run the checklist in section 14.

## 9. The schedule (`#nursery-schedule`)

The same JSON as Front Desk Nursery, read by `weatherproof.js`. Put it at the end of `body` on every page.

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["08:00", "17:00"]], "tue": [["08:00", "17:00"]], "wed": [["08:00", "17:00"]],
            "thu": [["08:00", "17:00"]], "fri": [["08:00", "17:00"]], "sat": [], "sun": [] },
  "term": { "from": "2026-08-19", "to": "2027-07-02", "label": "the summer holidays" },
  "closures": [ { "from": "2026-10-10", "to": "2026-10-25", "label": "the October holiday" } ]
}
```

- `days`: sessions per weekday, 24-hour times. `term` only for term-time nurseries. `closures`: whole days, inclusive, in date order, each `label` reading after "Closed for …".
- Status wording: "Open now. Home time is 5pm", "Open now. Home time soon, at 5pm", "Closed now. Opens tomorrow at 8am", "Closed for the October holiday. Opens on Monday 26 October at 8am".
- Term table rows carry `data-from` / `data-to` and get "past", "Now" and "Next". `[data-next-closure]` gets the next closure in words.
- Test with Playwright's clock (`page.clock.setFixedTime`) before handover: a weekday at 7:45am, 10am, 4:40pm and 5:15pm; a Friday evening; a day inside each closure; the day before a closure; and a date after the term ends.

## 10. Inner pages

Every page reuses the homepage's head, header, menu, footer, schedule and script, copied exactly. Only `<title>` ("[Page]: [Nursery], [place]"), the meta description and `aria-current="page"` change.

**Page head** (replaces the hero): `div.page-head` (gorse, grain) with `nav.breadcrumb`, `h1` in wide caps, `p.page-head__lead`, optional `.page-head__actions` (one button and/or the status pill), then the horizon. Then `nav.jump` ("On this page" chips, one per `h2`). Sections alternate stone, white and stone-2, with one loch section per page at most two. Each opens with `.section-head`.

| Page | `h1` | Sections, in order |
|---|---|---|
| `join-us.html` | Visit and join | How visits work (`.steps` + loch phone panel) · Questions to ask on your visit (our own words, `.ticks--ask` in 2 columns, Parent Club link) · How places are offered (`dl.summary`: ages, numbers, minimum days, places, waiting list, funded hours; "To join" steps panel) · Sessions (`.group` cards per group with sessions, numbers and published ratios) · Settling in (confirmed points + a parent quote) · What to wear and bring (kit pegs, "What we know", "Phone to check") · Your information (privacy notice) |
| `our-nursery.html` | Our nursery | Whatever the weather (all 4 tiles) · Where we go (route map with every stop photo + the nursery's own map if it has one) · A day outside (full `ol.day` with `.day__when`, plus "How children learn here") · Food and mealtimes · Rest, nappies and toilets (3 panels) · Our inspection (key messages copied exactly, awards, grades panel) · Our story (`ol.day` as a history, and who runs the nursery) |
| `fees-and-funding.html` | Fees and funding | Funded hours (`.figure-row` ×2, how to use them here, council panel) · When funding starts (birthday table from mygov.scot, deferral) · 2 year olds · Our fees (`.table--fees.table--stack` with "Last checked") · What's included (+ "Phone to check") · Paying (vouchers, Tax-Free Childcare, holiday care) · Help with costs (3 link panels) |
| `our-team.html` | Our team | Our manager (`.manager`) · Nursery team (`.names` list as published + an inspector quote) · Training and checks (as published) + "What the letters mean" (`.details`) · Key workers · The charity or owners (`.people--3`, board, team photo) |
| `parents.html` | For parents | Term dates and closures (grouped `.table--stack`, `tr[data-from]`, `.closed-tag`) · Holiday care (+ before and after school panel) · Today's kit · Your child's learning · Get involved · Worries and complaints (nursery first, then the Care Inspectorate; 999 in a `.note`) · Policies |

Forms are HTML, never PDF-only (§6.4). No waiting-list form unless the nursery has a compliant receiving service (§6.3). Don't link pages that don't exist; link the nursery's live privacy notice until it supplies one to publish.

## 11. Copy samples

Brief's voice, with the nursery's facts in brackets:
- "Outside every day. Whatever the weather."
- "Puddles become projects." / "Risks spotted and cleared." / "Cosy places to stop." / "Room to run."
- "Rain? Waterproofs on. Puddles are the best bit." (only if the nursery says children play in the rain)
- "Cold days: hot lunch, extra layers, and a warm cabin when we need it." (only if there's a cabin)
- "There's no such thing as bad weather. Just the wrong socks."
- "We go to [Dunnottar Woods] every [Tuesday]." (only as confirmed)
- "Visits happen outside, so wear your boots."
- "Who'll be out there with them" (team heading)

## 12. Variants

- **No photos:** delete `.hero__photo` (the hero text then spans the width), every `figure.stop-photo`, the "Come and see us" photo and the manager photo (use `.person__initial`). The horizon, weather tiles, route map and kit pegs carry the page.
- **The nursery has its own logo:** inline it in `.brand` in place of `.brand__mark`; keep the roundel for the footer promise and the favicon only if the nursery agrees.
- **Colour-coded waterproofs by group:** recolour each `.group` card's top stripe to the group's colour (keep contrast for any text) and say so in the card.
- **Farm or beach nursery:** swap the route map's landmarks (byre, gate, animals as silhouettes with no faces; dunes, rock pools) and the horizon.
- **Grades of 3 or below:** keep the grades panel exactly the same. Lean the selling on the places and the kit, and add a `.note` in the nursery's own words about what it is improving, if supplied.
- **All-year nursery:** drop `term`, list closures; the hero says "all year".
- **No inspector quote about outdoors:** use the report's most relevant key message, or leave the quote out. Never a quote from elsewhere.

## 13. What the example changed from the direction brief (E§4.4), and why

- **Kit list.** The brief asks for a ticked "What to bring" list. Earthtime doesn't publish one, so the example shows what it confirms (free waterproofs for 2 to 3 year olds, warm changing tents) and a "Phone to check" list. The template supports a full list when a nursery supplies one.
- **Weather tiles are Rain, Wind, Cold and Sun** ("Frost or snow" became "Cold") because the facts we had were about warmth and rest, not snow.
- **"Seen by the inspector" tags** were added to the tiles, so practice taken from the report is visibly sourced.
- **Parents' quotes** include two parents quoted in the Care Inspectorate report, because the nursery's own site has only one usable parent quote. Each is labelled with its source.
- **The route map is a stylised drawing** based on the nursery's own site map, labelled "not to scale", with the real names in a list. The brief's "photo per stop" is used where photos exist.
- **"How places are offered"** shows only what the nursery publishes (ages, numbers, minimum 2 sessions, funded hours) and "Phone to check" for intakes, priority and the waiting list.
- **One extra device:** "Questions to ask on your visit", in our own words (E§2.3 shared device), tuned to outdoor nurseries.

## 14. Pre-handover checklist

Any "no" blocks handover. This adds to §8 of the first brief.

**Facts**
- [ ] Every fact traces to the nursery's site or documents, or its Care Inspectorate record or report. Disagreements are listed in your report.
- [ ] "Forest school" appears only if the nursery uses it.
- [ ] Every weather tile, route stop, kit item and "day outside" line is confirmed or says "Phone to check".
- [ ] Grades, headings, inspection dates and publication date match the latest report; the record link resolves. Inspector quotes are exact.
- [ ] Funded status confirmed. Fees show their source and "Last checked".
- [ ] Term table, schedule JSON and notices agree; every weekday checked.
- [ ] Staff names, roles and qualifications as supplied; ratios only as the nursery states them.
- [ ] No identifiable child in any image; EXIF stripped; `img/CREDITS.txt` complete, with staff consent recorded.

**Content and design**
- [ ] The first 390×844 screen shows the header, the nursery name, the promise, the fact sentence, the key facts and both actions.
- [ ] Menu is 6 items, with "Visit and join" and "Fees and funding" visible on phones.
- [ ] Wide caps only for headings of 8 words or fewer. Homepage sentences 20 words or fewer.
- [ ] The emblem and horizon are redrawn from the nursery's real landmark (or the nursery's own logo is respected).
- [ ] No pop-ups, carousels, auto-play, embeds, map embeds or trackers.
- [ ] Footer review dates set (today and today plus 6 months).

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>` reports **0 blockers, 0 major, 0 minor** on every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` shows no layout flags on every page. Look at 390, 768 and 1280px yourself.
- [ ] With reduced motion on, the route map shows fully drawn and nothing moves.
- [ ] Keyboard: skip link, menu (Escape closes), visible focus on gorse, stone and loch.
- [ ] Text at 200%: no sideways scroll at 390px or 1280px.
- [ ] The live status has been tested with Playwright's clock (section 9).
- [ ] Re-run `node pipeline/template-thumbs.mjs nursery/weatherproof`.

## 15. Earthtime example: sources, and facts to confirm

**Sources** (13 October 2026): earthtime.co.uk, read through its public WordPress pages feed because its server refuses headless browsers (16 pages, including Nursery, modified 2 September 2026, and School Age, modified 28 August 2026); the August 2026 group posters on the Nursery page; the nursery's own site map image; the Care Inspectorate service record CS2018364459 and its report for the unannounced inspection of 19 and 20 February 2025 (published 13 March 2025); and the Care Inspectorate datastore of 31 August 2026.

Confirm these with the nursery before go-live:
1. **Fees.** £38 for a Little Saplings morning, £50 for a 6-hour day (3+), £8.15 an hour (3+), and Wildcats £8 and £16 are from the website and the August 2026 posters. Confirm they're current, and whether parents of funded children pay for snacks ("Parents/carers pay us directly for snacks") and how much. Funded providers can only charge for optional extras.
2. **Waterproofs for 3 to 5s.** Only the Little Saplings poster mentions a free set. The example says "Phone to check" for older children.
3. **Primary-age places.** The website says 20 (25 in the holiday club); the 2025 inspection report says no more than 15 of primary school age; the record's conditions say 20. The example says "up to 25" for holiday care only, as the website does, and doesn't print the term-time figure.
4. **After-school hours.** The website says 3pm to 5pm; the registration conditions allow until 6pm. The example uses 3pm to 5pm.
5. **Team list.** The team pages were last updated in April 2025. Confirm who's current, each person's role, and consent for Kristy's photo and the team photo.
6. **Route map places.** Squirrel Woods, the Haggis Tree, the Big Field and the Big Yew Tree come from the nursery's own site map. Confirm the children go to each, and the artist ("RS") credit for that map.
7. **Car park and drop-off.** The site map shows a car park beside the welcome area. Confirm where parents park and meet staff, and whether there are two drop-off points.
8. **Visits.** The nursery doesn't publish how visits work. Confirm the days and times, who shows families round, and whether children can come.
9. **Places, waiting list, intakes and priority.** Not published; the example says "Phone to check".
10. **Settling in.** Not published beyond what parents told the inspector; confirm the process.
11. **Kit list, illness, medicines, collection, complaints procedure and policies.** Not published; the example says "Phone to check". Ask for policies to publish as HTML.
12. **Tax-Free Childcare.** Not mentioned; the example says "Ask us". The site does say it accepts childcare vouchers, including Universal Credit and military vouchers.
13. **Lunch.** The full day "includes lunch", and the report describes mealtimes and Tasty Tuesdays, but not who prepares lunch or a menu. The example has no menu.
14. **Parent quote on the homepage** ("My daughter has gained immense resilience…") is unattributed and undated on the nursery's site; confirm it's from a nursery parent and that it may be used.
15. **Awards.** "Winner" of the Crown Estate Scotland Schools Trophy (Scotland's Finest Woods Awards 2019) is the nursery's own wording ("awarded"); the 2025 Scottish Nursery Awards "Finalist" comes from its own graphic. Confirm both.
16. **Upheld complaints.** The record lists 5 complaints (the latest received 18 March 2025); the datastore counts 1 upheld in 2025/26. The example links the record and says upheld complaints are listed there, without detail.
17. **Grade headings** are the four key questions of the old framework, exactly as in the February 2025 report. If a newer report is published under the 2025 framework, replace the whole panel.
18. **Holiday care dates 2026/27.** The site says "check back"; the example says "Phone to check".
19. **Privacy notice and jobs page** link to the nursery's current site, which blocks automated checks. Open both by hand.
