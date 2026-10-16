# Sidekick Spacious: a mascot-led website template for Scottish nurseries

## Spacious version (read this first)

This folder (`templates/nursery/sidekick-spacious/`) is the **spacious version** of Sidekick (`templates/nursery/sidekick/`, left unchanged so the owner can compare them side by side). It answers the owner's feedback on the nursery templates: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."* The spec is the **space brief** (rules S1 to S13) in `prospects/research/nursery-spacious-directions.md`, Part 2.

**What stayed:** the bee and all 17 poses, the palette and tokens, Fredoka and Rubik, highlighted-word headings, the speech bubble, the "quick answers" sentences, the clock band, the dashed day path, the colourful tiles with a pose, the grades meter, the sticky booking bar with the peeking bee, the sleeping bee on the footer, the same Jaybees example and every fact and photo in it.

**What changed, and why:**

| Change | Rule |
|---|---|
| **Homepage cut to the hero plus 4 sections:** Quick answers → Life in the hive → Find your way (doors) → "Come for a visit" band. Gone from the homepage: the facility pills, the clock band, the day path, the 4-photo strip, the parent quote and Find us. | S3 (hero + ≤ 5, last is Book a visit; no day timeline on the homepage), S4 |
| **The 7 facility pills that wrapped over 5 rows are gone** (Sidekick was the space brief's named anti-pattern). The facilities are now a one-per-row "What's here" list (`.facts`) on Our nursery. | S6 (≤ 4 pills, never a third line) |
| **Hero holds only** the bubble and the waving bee, the H1, one sentence, Book a visit (button) and "Phone 01387 810303" (a text link, not a second box). The status pill and kicker moved inward (Visit and join, Parents). | S2 hero, S5 (1 primary + 1 secondary action), S13 |
| **Quick answers became the 5-line essentials:** ages, hours, funded hours, places, grades with date and link; one highlighted fact per line, hairline rows, no sub-notes, no boxes; closed by "All the details". | S9, S8 (≤ 3 sizes per block) |
| **Life in the hive:** one big living photo (poster on phones) and one door, "See the gallery". The strip photos are all still in the gallery. | S12 (a full-width image every 2 screens) |
| **Doors:** 5 big tiles (Visit and join, Fees and funding, Our nursery, Our team, Parents), each a pose, a label and an 8-word line. One per row on phones, 8.25rem apart and joined by the bee's dashed flight path with a honey-drop stop, so no phone screen holds more than 3. 2 per row from 600px, 3 per row from 1024px (Visit and join spans 2). Gallery is reached from Life in the hive, the menu and Parents' Next door. | S5, S6, S7, S9 |
| **The clock band moved to Visit and join** ("Hours and sessions"), with its side box for half days and the school club. The day path stayed on Our nursery. | S3, S9 |
| **Spacing tokens:** gutters 24px phone, 40px from 600px, 64px from 1024px; content 1,120px; `--section: clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80px phone, 128px desktop); `--group` 48/64px; text column `--measure: 56ch` (about 60 characters). Card gaps 24px phone, 32px desktop; gallery gaps 12/16px. | S1, S2, S7, S8 |
| **Header and menu:** 6 items (Home dropped: the brand is the home link) plus a Book a visit button. Below 72em the menu is a full-height sheet of 56px rows with Phone and Book a visit at the bottom. The yellow header Phone pill shows only from 40em to 72em; on phones the hero and the sticky bar carry Phone. | S11, S5 (≤ 3 boxes on the first screen) |
| **One action wording, one colour:** "Book a visit" is the red button everywhere (header, hero, sticky bar, menu, visit band); Phone is always the secondary. The sticky bar's Book a visit was yellow and is now red. | S13 |
| **Inner pages:** the same cream page band on every page (eyebrow, H1, intro, **one** action, a different pose); breadcrumbs dropped; the wrapping chip tabs became a numbered **"On this page"** list (`nav.onpage`, 48px rows, joined by a dashed line on phones, 2 columns on desktop, not sticky); then short sections; then a **Next** door (a tile) and the visit band. | S10 |
| **Long detail into accordions** (`.faq` `<details>`): good questions to ask on a visit, funded-hours "Good to know", how menus work, keeping the hive healthy, the film transcript. | S10.3 |
| **Our team:** the 3 leaders as cards, then "People you'll meet" (Kerry, Stacy, Bev) as cards, then everyone else as a light list (`.roster`, hairline rows, 2 columns on desktop) instead of 14 boxes. The parent quote moved here ("What families say"). | S6, S10 |
| **Gallery:** the 6 filter pills became the "On this page" list (S6: ≤ 4 pills); the tour film moved here from Our nursery ("A short film"). | S6, S10 |
| **Footer:** compact. Contact details, then the About us and Help for families links as two sentences. | S3 phone length, S5 |
| Homepage words cut from 321 to 146. | S4 |

### Final space figures (Jaybees homepage, 390 × 844, `density.mjs` and `words.mjs`, 14 October 2026)

| Check | Space brief | Before (original Sidekick) | After (spacious) |
|---|---|---|---|
| Phone length | ≤ 6 screens (≈ 5,064px) | 7,053px, 9 screens | **4,981px, 6 screens** |
| Words in `<main>` | 120 to 180 | 321 | **146** |
| Sections | hero + ≤ 5, last is Book a visit | hero + 6, plus the clock band inside the quick answers | **hero + 4**, ending with the visit band |
| Text blocks per screen (first three; average) | ≤ 6 (7 on the first) | 5 / 10 / 8; average 7.9 | **4 / 6 / 4; average 4.2** (all six: 4, 6, 4, 3, 2, 6) |
| Boxes per screen as the script counts them (first three; average) | ≤ 3 | 9 / 6 / 9; average 5.6 | 6 / 2 / 4; average 3.3 |
| Real boxes per screen (without the off-screen skip link, highlighted-word spans and the fixed sticky bar, which the script also counts) | ≤ 3 | – | **3 / 1 / 3 / 3 / 1 / 0** |
| H2s per screen | ≤ 1 | – | **1** at most on every screen |
| Hero | ≥ 70% of the first screen | – | 674px of 765px below a 79px header |
| Section padding | ≥ 80px phone, ≥ 128px at 1280 | 48 to 96px | 80px phone, 128px at 1280 |
| Side gutters | 24 / 40 / ≥ 64px | 16 to 40px | 24 / 40 / 64px (80px at 1280 from the 1,120px container) |
| Body text | 18px phone, 19 to 20px desktop | 18 / 19px | 18 / 19px, lines ≤ 60 characters |

Inner pages: 166 to 565 words each (≤ 900), sections ≤ 120 words of body (Our nursery's four room cards are the longest at 136 words including the room names and age labels), "On this page" on every page with 3 or more sections.

Quality gates: `audit.mjs` 0 blockers, 0 major, 0 minor on all 7 pages; `viewports.mjs` shows no layout flags at all 9 widths on all 7 pages.

**Don't lower** `--gutter`, `--section`, `--group`, `--measure`, `--door-gap` or the 18px body size: they are the fix. If a nursery needs a sixth door, check the density script still shows ≤ 3 boxes per phone screen.

The rest of this brief is the original Sidekick brief, updated where the spacious changes made it out of date.

---

> Pipeline name: **Sidekick Spacious** (folder `templates/nursery/sidekick-spacious/`; the original is `templates/nursery/sidekick/`). It is direction 1 of `prospects/research/nursery-colourful-directions.md`: colourful, fun and light on words, built around a **drawn mascot** that guides parents through the site. Its siblings in that document are Make Waves (colour bands, a local theme) and Meadow (painterly, photo-led).

**The idea in one line:** the nursery gets its own cartoon character, drawn from its name or logo, and the character does every job on the page: it waves hello in the hero, holds the clock for the opening hours, carries lunch, explores, naps at cosy time, reads the map to find you, and peeks over the phone booking bar. The page stays white with two loud accents, so the character and the facts pop.

It looks like a confident children's brand (think Busy Bees' bee, which the owner loves), but every fact a parent needs is still on the first two phone screens: ages, hours, funded hours, places, grades with the date and a link, Book a visit and Phone.

The worked example is **Jaybees Childcare, Lochmaben** (Dumfries and Galloway), a real family-run nursery whose name, room names (Baby Bumbles, Bee Bops, Big Buzzers, Stingers) and email ("buzzus@") already speak bee. It was built only from its own website and its Care Inspectorate record.

Sources behind the decisions:
- `prospects/research/nursery-colourful-directions.md` (the direction, the shared rules, the devices we must not reuse);
- `prospects/research/nursery-sites-2/` (especially `busy-bees-melrose.md`, `banana-moon-*.md`, `buttercups.md`, `SUMMARY-A.md`, `SUMMARY-B.md`);
- `prospects/research/nursery-websites.md`: fact rules §3.6, trust signals §4, photo rules §5, structure §6. Section numbers like **§6.2** below point there.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `mascot.svg` | The mascot sprite (source only, never referenced by pages): shared body parts in `<defs>`, then one `<symbol>` per pose (17), plus the hero scene `deco-hero`. It's the source file: **every page carries its contents inline** in a hidden `<svg>` right after `<body>`, and uses poses with `<svg class="bee"><use href="#bee-wave"/></svg>`. | **Yes**: redraw for each nursery's animal (section 8) |
| `icons.svg` | 20 small line icons (clock, phone, pin, tree, pot, bottle, bag, star, pound, calendar, heart, sparkle, boot, sun, ball, play, pause, arrow, door, mail). No people. | Rarely |
| `sidekick.js` | About 220 lines, no dependencies: phone menu, sticky booking bar timing, dated notices, live open/closed status, closure table marks, living photo, gallery lightbox (and filter buttons, if a page has them). The chip highlighting was removed with the chips. | Never. It reads its data from the page |
| `fonts/` | Fredoka (display, 500 to 700) and Rubik (body, 400 to 700), Latin and Latin Extended woff2 subsets, 78 KB in all. OFL in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | What to photograph (and film) at a nursery, and the no-faces rule. | Give it to the nursery |
| `example/` | Seven finished pages for Jaybees: `index.html`, `join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html`, `gallery.html`. | Copy for each nursery |
| `example/img/` | 14 child-free crops of the nursery's own photos (WebP 400 and up to 800px), two posters, `favicon.svg` and `CREDITS.txt` (every source, and every photo **not** used and why). | Each nursery gets its own |
| `example/media/` | `forest-loop.mp4` (living photo, 10 s, 340 KB), `tour.mp4` (film, 32 s, 1.3 MB), `tour.vtt` (captions). | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail: `node pipeline/template-thumbs.mjs nursery/sidekick-spacious`. | After changes |

Pages link `../styles.css` and `../sidekick.js`. **The mascot and icon sprites are inlined into every page, never referenced as files:** board previews are sandboxed (an opaque origin), and `<use href="../mascot.svg#…">` silently draws nothing there. After editing `mascot.svg` or `icons.svg`, paste their contents (without the outer `<svg>`) into each page's hidden sprite block again. Keep that folder shape. Nothing loads from another server: no Google Fonts, CDNs, analytics, maps, social embeds, YouTube or Vimeo (§6.6).

---

## 1. Concept, and what it avoids

The owner's picks share one thing: "very colourful, fun and not too text dense, especially on the home page". Busy Bees Melrose does it best with almost no photos of children, because a **cartoon bee** in about 12 poses carries the warmth (`busy-bees-melrose.md`). Sidekick turns that into a system any nursery can have:

- **A mascot drawn for the nursery**, from its name or logo: a bee, owl, squirrel, hedgehog, puffin, bear, ladybird, or the nursery's own animal. It is never a child or a person.
- **One pose per section**, so a long scroll reads like a picture book and every fact has a friendly face beside it.
- **White ground, colour in doses**: two strong accents (tomato red and sunflower) plus deep ink, used for one highlighted word per heading, one inset clock band, buttons, tags and tiles. Busy Bees proves a mostly-white page makes the character and highlights pop.
- **Facts as objects, not sentences**: clock boxes for the hours, big "quick answer" sentences with the key fact highlighted, a "What's here" list, a dashed day path, a grades meter.
- **Light homepage**: 146 words in `<main>` in the example (space brief S4: 120 to 180). Depth lives on six inner pages reached by big colourful tiles.

It must **not** reuse the signature devices of our earlier nursery templates (luggage-tag facts, cork noticeboards, full-stop headlines, storybook chapters, weather tiles, recipe cards, leaf-shaped corners, torn paper, or key facts as a row of boxed cards). Sidekick's key facts are **big highlighted sentences** in a list, not boxes; its edges are **dashed paths and inset rounded blocks**, not torn paper or waves (waves belong to Make Waves).

What makes it premium rather than twee:
- The mascot is drawn properly: one consistent construction (same body, eyes, antennae, wellies, line weight and palette in every pose), flat colour with one shade and one highlight, an ink outline, and a soft ground shadow. Never clip art.
- Heavy rounded display type in **short** headings only; a calm, very readable body face.
- Flat "sticker lift" shadows (`0 6px 0`) instead of blurry drop shadows; dashed rules; generous space.
- Restraint: two accents only, with four soft tints for rooms and tags.

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **A drawn mascot in a different pose in every section**; decorative, `aria-hidden`, no people. | Busy Bees Melrose: the bee "in almost every section doing something" makes the page "colourful, fun and not too text dense" with almost no photos of children (`busy-bees-melrose.md`; SUMMARY-B technique 1). Drawn characters give "a children's book feeling with no consent problem" (§5.2). |
| 2 | **Highlighted-word headings**: one word in a solid box, alternating red-with-white and sunflower-with-ink (and a pale "sunbeam" box for facts). | Busy Bees' highlighter device, "the cheapest fun device in the study and needs no images" (`busy-bees-melrose.md`, Borrow this 1). |
| 3 | **Clock-box hours** on an inset deep-red block, with the mascot holding a clock on its edge. | Busy Bees' red band with "7:00 AM to 6:00 PM" as clock boxes is "the strongest single block on the page"; facts become graphics (SUMMARY-B technique 5). |
| 4 | **"Quick answers"**: five big one-line sentences (ages, hours, funded hours, places, grades with date and link), each with one highlighted fact, no sub-notes, closed by "All the details" (S9). | The directions document's "within one scroll of the phone homepage" list; §6.2 items 2 and 3. Presented as sentences, not boxed cards, to avoid our earlier templates' devices. |
| 5 | **Mascot day path**: six stops (Hello, Explore, Lunch, Outside, Cosy time, Home time), a pose per stop, joined by a dashed path; times only where the nursery publishes them. | Busy Bees' dashed timeline with "a different bee pose for each slot"; parents ask about the day (§4.5, [PC-C]). |
| 6 | **"What's here"** on Our nursery: the facilities as a one-per-row icon list, only what the nursery confirms. (The original's pills under the hero broke S6.) | Busy Bees' facility tags; SUMMARY-B technique 5. §3.6 forbids inventing facilities. |
| 7 | **Big colourful tiles with a mascot pose** as the homepage's doors to the inner pages (4 to 6; one per row on phones, ≤ 3 per phone screen). | Banana Moon's icon cards and Bright Horizons' playful two-word labels (SUMMARY-A technique 7, SUMMARY-B technique 8). Keeps the homepage light. |
| 8 | **Sticky "Book a visit" and "Phone" bar on phones**, with a tiny mascot peeking over it. It appears only after the hero's own buttons scroll away, and the body is padded by its height. | Busy Bees' bottom pill with "a little bee peeking over it"; Thrive's floating Call and Book a Tour. Busy Bees' pill covers content, so ours never does (SC 2.4.11). |
| 9 | **"On this page"** on inner pages: a numbered list of 48px links (S10), not tabs and not sticky. | Busy Bees' sticky tab bar, whose later items hide off-screen on phones (`busy-bees-melrose.md`, Doesn't). Cherubs' chips (SUMMARY-A technique 9). |
| 10 | **Grades shown honestly**: every grade from the latest report, the inspection and publication dates, a 6-segment meter and a link. | §3.2 and §4.1; never only the best grade. |
| 11 | **Gallery page**: CSS-column mosaic, 2 columns on phones, groups (Rooms, Garden, Forest, Food, Artwork) with filter buttons, real alt text and captions, a `<dialog>` lightbox. Missing photos become **drawn mascot tiles** ("Photos of our rooms are coming soon"). | The directions' gallery rules; no site in the study captions or filters well, and Bright Starts' lightbox loses focus (SUMMARY-B, Galleries). |
| 12 | **Living photo** (muted 6 to 10 s loop, autoplays only above phone width without reduced motion, Pause button) and **tour film** (click to play, `preload="none"`, poster, captions, transcript, no sound unless asked). | The directions' video rules. Heads of Ayr swaps a still in on phones; Busy Bees loads nothing until tapped; Cherubs' 81 MB autoloading film is the anti-pattern (SUMMARY-A/B, Video). |
| 13 | **Two OFL fonts, self-hosted**: Fredoka (heavy, rounded) for headings, Rubik (friendly, open, very readable) for text. | "Heavy rounded display type in short headings, and a friendly sans for body text" (direction 1). Hero Junior and Sofia Pro Soft are licensed; Fredoka is the free equivalent. |
| 14 | **Phone, not forms**, for visits and the waiting list. | §6.3: waiting-list forms collect children's data and need a compliant receiver. |
| 15 | **Plain English**, "to" not dashes, 20 words or fewer per homepage sentence. | §6.5 [GOVUK-S]. |
| 16 | **No pop-ups, sliders, autoplay with sound, chat widgets, maps or social feeds.** | §6.4, [NNG-C], [ICO-PECR]. Jaybees' current site has a cookie wall and a Facebook feed with 100 posts; this has neither. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, time, name, qualification, grade, policy and service comes from the nursery's site or documents, or its Care Inspectorate record (`prospects/nursery/data/*.json`). §3.6 of the research brief is binding. Where something is unclear, write **"phone to check"** (use `span.tbc` so it reads as a deliberate marker, not a gap).
2. **Grades**: every grade from the latest report, the exact headings, the inspection date and the publication date, plus "Read our inspection report". Never the Care Inspectorate logo.
3. **Funded status**: say "You apply through [council]" and link the council. Only say "We're a funded provider for [council]" when the nursery confirms it.
4. **Reviews and quotes** only from the nursery's own site, attributed as it does ("A Jaybees parent, from our website"). Inspection quotes only as quoted by the nursery or from the report itself, with the source named.
5. **The mascot never states a fact.** Speech bubbles are greetings only ("Come and see the hive!"). Don't give the mascot a name unless the nursery chooses one.

### Mascot and illustration
6. **No people, ever**: no children, faces, hands of people or figures, in the mascot, icons or scenes. Animals, plants, objects, weather and shapes only.
7. **One character, one construction.** Every pose reuses the same parts in `mascot.svg` (`bee-body`, `bee-wings`, `bee-antennae`, `bee-legs`, eyes and mouths). Don't draw a pose from scratch with different proportions.
8. **Every mascot `<svg>` is decorative**: `class="bee" aria-hidden="true" focusable="false"`. The words beside it carry the meaning.
9. Stock packs, clip art and AI-generated images are not allowed.

### Photos (§5)
10. **No identifiable children.** Children from behind, at a distance, or hands only. Treat any old-site photo with a face as excluded. Strip metadata. Record every source and every exclusion in `img/CREDITS.txt`.
11. Staff photos only where the person's identity is already public on the nursery's site, and confirm consent at handover.
12. The template must still look complete with **no photos**: drop the homepage's Life in the hive section (the doors and the visit band carry the page), use drawn tiles (`.drawn`) in the gallery, and every section already has a mascot.

### Content style
13. Times as `7:30am`, `6pm`, `midday`; ranges with "to"; days and months in full.
14. Headings 2 to 6 words, with **one** highlighted word. Homepage paragraphs 1 or 2 sentences.
15. Links start with a verb or name their destination; phone numbers are `tel:+44…` links shown as written locally.

### Accessibility (WCAG 2.2 AA)
16. Keep the token pairs in section 7. Text 4.5:1, large text and UI 3:1.
17. One `h1` per page; `h2` per section; `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. The skip link is first.
18. Focus is the GOV.UK yellow with an ink bar (`:focus-visible` in `styles.css`). Never remove it.
19. Tap targets 44px. Links in lists or panels that are not inside a sentence get `.go`, a button style, or sit inside a `<p>` with other words (the audit exempts links in sentences only).
20. The sticky bar must never hide focus: keep `scroll-padding-bottom` and the `body.has-bar` padding.
21. Motion only inside `prefers-reduced-motion: no-preference` (the hero bee's gentle bob, the peeking bee). The living photo never autoplays with reduced motion or on phones.

### Known audit quirks
22. `aria-label` on a `<p>` is an axe violation: give visual-only text (like the clock boxes) `aria-hidden` and add a `.visually-hidden` sentence.
23. Don't put a placeholder `<img>` in the lightbox; the script creates it.
24. `viewports.mjs` flags anything fixed that overlaps headings at scroll position 0. That is why the booking bar waits for the hero buttons to scroll away.
24a. Chrome gives links inside a **closed** `<details>` a size but no text, so `audit.mjs` flags them as small tap targets. `.faq details:not([open]) > div { display: none; }` fixes it; keep it.
24b. `density.mjs` counts the off-screen skip link (in screen 1), highlighted-word spans taller than 30px and the fixed booking bar as "boxes". Report real boxes separately (section "Final space figures").

### Performance
25. Homepage under about 1 MB on a phone. The example loads about **210 KB on a phone** (files before compression: page, CSS, JS, two fonts and the poster; the 4-photo strip is gone) and about 550 KB on desktop, where the 340 KB loop plays.
26. Photos: WebP at 400 and 800px (or the source's width, with the true `w` descriptor), `width` and `height` set. Lazy-load the gallery; the few in-page `.snap` photos load eagerly.
27. Video: living photo under 1.5 MB, `preload="none"`, `src` set by the script only when it will play. Film: `preload="none"`, poster, captions.

## 4. Homepage structure (keep this order)

1. **Skip link**, then **header** `header.site-header`: `a.brand` (the `bee-peek` pose, name, place; it is the home link), `a.header-call` (the yellow "Phone 01387 810303" pill, shown only from 40em to 72em), `button.menu-toggle` ("Menu", hidden from 72em), `nav.site-nav#site-nav` with **6 items** (Visit and join, Fees and funding, Our nursery, Our team, Parents, Gallery), then `li.site-nav__end.site-nav__phone` (Phone, in the sheet only) and `li.site-nav__end` (Book a visit button).
2. **Hero** `section.hero` (at least 70% of the first phone screen):
   - text: `h1` "[Nursery], your nursery in **[Town]**", `p.hero__lead` (one sentence; hero ≤ 25 words with the bubble and buttons), `.actions` with Book a visit (`.btn`) and `a.phone-link` "Phone [number]";
   - `.hero__mascot` with `svg.hero__scene` (`deco-hero`), a `.say` bubble (greeting only) and the `bee-wave` pose. On phones it sits above the heading, larger than before.
3. **Quick answers** `section.section--cream` > `.essentials`: `.essentials__head` (`h2` "The **quick** answers", plus a `bee-clock` pose shown only from 60em), `ul.said` with **5 lines** (ages; hours; funded hours "through [council]"; places; "Care Inspectorate: [summary], [Month Year]" as the link to the report), each ≤ 8 words with one `.hl--pale` fact, then `a.go.go-row` "All the details" (→ Visit and join).
4. **Life in the hive** `.life`: `h2`, `figure.living[data-living]` (the living photo, with a short `figcaption`), then `a.go.life__go` "See the gallery". No strip.
5. **Find your way** `ul.tiles.tiles--doors`: **4 to 6** doors (5 in the example), each `a.tile` with a pose, `.tile__title` (≤ 3 words) and `.tile__line` (≤ 8 words). Order: Visit and join, Fees and funding, Our nursery, Our team, Parents (add Gallery as a sixth only if the density check still passes).
6. **"Come for a visit" band** `section.visit-band` (the last section of `<main>` on every page): `bee-phone`, `h2`, one sentence, Book a visit and the Phone link.
7. **Footer** (the `bee-sleep` pose napping on its top edge; contact, then the About us and Help for families links as sentences), **booking bar** `nav.book-bar` (Book a visit red, Phone outlined), **schedule** `script#nursery-schedule`, then `sidekick.js`.

**Never on the homepage** (S3): the clock band, the day path, the facility list, photo strips, reviews, Find us, team, menus, FAQs. They live on the inner pages (section 9).

The first phone screen (390×844) shows the bubble, the bee, the `h1`, the lead, Book a visit, Phone and the "quick answers" heading; the second shows the five quick answers and the Life heading; doors start on the third. Every content section ends with exactly one onward link (S9).

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags on any of the seven pages.

| From | What changes |
|---|---|
| 0 | One column, 24px gutters, 18px text. Hero bee above the heading. One door per row, 8.25rem apart on a dashed flight path. Rooms, people, tiles one per row. "On this page" one link per row. Menu is a full-height sheet. Booking bar appears after the hero buttons scroll away. Below 24em the brand mark shrinks so Menu stays on the first row. |
| 37.5em (600px) | Gutters 40px. Doors and tiles 2 per row (an odd first door spans the row). |
| 40em | Hero goes to text plus a big mascot. Header shows the yellow Phone pill. Page bands put the pose on the right. Rooms and people 2 per row. |
| 48em | Body text 19px. Day path 3 columns. Booking bar goes. Visit band puts the bee on the right. |
| 52em | `.split` goes to 2 columns. Gallery mosaic 3 columns. Find us in 3 columns. Life in the hive: photo left, heading and link right. "On this page", "What's here" and the team roster go to 2 columns. Footer 2 columns. |
| 56em | Clock band goes to 2 columns (clocks plus the side box). |
| 60em | Quick answers: heading and the clock-holding bee on the left, the 5 lines on the right. |
| 64em | Gutters 64px, groups 64px apart. Doors 3 per row (Visit and join spans 2 when there are 5). Tiles and people 3 per row. |
| 72em | Full nav row with the Book a visit button (Menu button and header Phone go). Day path in one row of 6. Rooms in a row of 4 (`.rooms--4`). |

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.hl` / `.hl--sun` / `.hl--pale` | Highlighted word: red box with white text, sunflower box with ink, pale box with ink (for facts in big sentences). One per heading; alternate red and sunflower down the page. |
| `.kicker` | Small caps line above a heading. |
| `.say`, `.say--right` | Mascot speech bubble. Greetings only; `aria-hidden` when it repeats nothing useful. |
| `.bee`, `.bee--xs/s/m/l/xl`, `.bee--flip` | A mascot pose: `<svg class="bee" aria-hidden="true" focusable="false"><use href="#bee-POSE"/></svg>` (the sprite is inline in the page). Size with the modifier or `--bee-size`. |
| `.icon` | An icon from `icons.svg`. |
| `.btn`, `.btn--sun`, `.btn--line`, `.btn--block` | Red main action (once per screen; always "Book a visit" or Phone), sunflower, ink outline. |
| `.phone-link` | The secondary "Phone [number]" action beside a Book a visit button: a text link with a yellow phone disc, not a second box (S5). |
| `.go`, `.go-row` | Stand-alone link with a chevron and a 44px tap height; `.go-row` puts it 32px below the body (the one onward link per homepage section). |
| `.facts` | "What's here": facilities one per row with an icon disc and hairline rows (2 columns from 52em). Replaces the original's facility pills. |
| `.status[data-status]` + `[data-status-text]` | Live pill (`open`, `closing`, `closed`). |
| `.tbc` | The "phone to check" marker. |
| `.essentials`, `.essentials__head`, `.said`, `.said__icon`, `.said__text` | Quick answers: the 5-line essentials. One big sentence per line with one `.hl--pale` fact, hairline rows, no sub-notes (`.said__more` is gone). |
| `.clockband`, `.clocks`, `.clock-box`, `.clockband__side` | Opening hours as clock boxes on the deep-red inset block. Put the hours in a `.visually-hidden` span; the boxes are `aria-hidden`. |
| `.daypath`, `.daypath--6`, `.daypath__card`, `.daypath__time` | The mascot day path. Use `--6` for six stops (one row from 72em). |
| `.tiles`, `.tiles--doors`, `.tile`, `.tile__title`, `.tile__line`, `.tile__kicker`, `.tile--static`, `.tile--sky/mint/blush` | Big colourful link tiles with a pose. `.tiles--doors` is the homepage doors (spaced by `--door-gap`, joined by the dashed flight path on phones). `--static` for non-links (dashed border, no lift). `.tile__kicker` is the "Next" label. |
| `.next` | The "Next" door at the end of every inner page: one `a.tile` to the most likely next page. |
| `.visit-band`, `.visit-band__grid` | "Come for a visit": the last section of `<main>` on every page (pose, `h2`, one sentence, Book a visit and Phone). |
| `.life`, `.life__text`, `.life__go` | Homepage Life in the hive: the living photo, heading and one door. |
| `.rooms`, `.rooms--4`, `.room`, `.room--sky/mint/blush`, `.room__age` | One colour and one pose per room. |
| `.quote` | A review or inspection quote in a big rounded bubble, with the source in `figcaption`. |
| `.findus`, `.contact-list` | Find us block. |
| `.notice` | Dated notice in the flow (`data-show-from`, `data-show-until`), with a small pose. Closures and deadlines only. |
| `.page-head`, `.page-head__grid`, `.page-head__lead` | The page band at the top of every inner page: kicker, `h1`, intro, one action (optional status pill), a pose. |
| `.onpage` | "On this page": `nav.onpage` > `.wrap` > `h2` + `ol` of anchor links, numbered in yellow discs, 48px rows. Pages with 3 or more sections. |
| `.part` | An inner-page section's text column (≤ 44rem; paragraphs and lists at `--measure`). |
| `.roster` | A light list of names and one line each (the rest of the team), hairline rows, 2 columns from 52em. |
| `.panel`, `.panel--butter/sky/mint/blush`, `.panel--bee` | Bordered panel; `--bee` puts a pose on its top edge. |
| `.note` | Tinted inset for one important point. |
| `.steps` | Numbered steps joined by a dashed line. |
| `.summary` | Key and value rows. |
| `.ticks` | Ticked list. |
| `.grades`, `.grades__area`, `.grades__word`, `.meter[data-grade]` | Grades with a 6-segment meter (`aria-hidden`). |
| `.people`, `.people--3`, `.person`, `.person__face`, `.person__initial`, `.person__role`, `.person__text` | Team cards. Initials unless there is a consented, child-free portrait. |
| `.table-wrap`, `.table`, `.table-note` | Tables; `tr[data-from][data-to]` gets past, now and next marks. |
| `.faq` | `<details>` accordions for long detail (S10.3): visit questions, funded-hours notes, menus, hygiene, the film transcript. Closed content is `display: none`. |
| `.snap` | A photo as a sticker: white border, ink ring, flat lift. |
| `.living`, `.living__frame`, `.living__label`, `.living__toggle` | Living photo (see section 10). |
| `.film`, `.transcript` | Tour film (see section 10). |
| `.gallery-group`, `.mosaic`, `.gallery__open`, `.drawn`, `.lightbox` | Gallery (see section 9). `.filters` is still styled and scripted but unused: 6 filter pills break S6. |
| `.visually-hidden`, `.nowrap`, `.mb-0`, `.mt-section`, `.mt-group`, `.measure`, `.soft`, `.small`, `.lead`, `.center` | Utilities. |

## 7. Tokens (section 1 of `styles.css`) and contrast

| Token | Default (Jaybees) | Role, and the rule to keep |
|---|---|---|
| `--accent` | `#C8302A` tomato | Red highlight box, main buttons. **White on it 5.4:1.** Keep 4.5:1 or more. |
| `--accent-strong` | `#A8241F` | Clock band ground and hover. White 7.2:1; the band's kicker `#FFE3DF` 5.9:1. |
| `--sun` | `#FFC83D` sunflower | Second highlight, header Phone, sticky Book a visit. **Ink on it 9.8:1.** Never white text on it. Hover `#FFB91A` (ink 8.8:1). |
| `--sun-pale` | `#FFE9A8` | Pale highlight box. Ink 12.6:1. |
| `--ink` | `#2A2238` | Text, outlines and the mascot's line colour. 15.2:1 on white, 14.5:1 on cream. Footer ground: footer text `#EDE8F5` 12.6:1, `#D9D2E6` 10.3:1, `--sun` headings 9.8:1. |
| `--ink-soft` | `#554B66` | Secondary text: 8.1:1 white, 7.7:1 cream, 7.1:1 sky, 7.1:1 mint, 6.9:1 blush. |
| `--paper` / `--cream` | `#FFFFFF` / `#FFF9EC` | Main ground and alternate sections. |
| `--line` / `--line-strong` | `#EADFC8` / `#8C7E9E` | Dashed rules (decorative) / dashed path and meter edges (3.75:1 on white). |
| `--butter`, `--sky`, `--mint`, `--blush` | `#FFF3CF`, `#E3F2FB`, `#E2F4E6`, `#FFE7E2` | Tints for rooms, tags, tiles, panels. Ink 12.8:1 or more on each; links 5.8:1 or more. |
| `--sky-deep`, `--leaf` | `#1F6FA8`, `#2F7D4A` | Icons on tints (decorative). |
| `--link`, `--link-hover` | `#1B5E9E`, `#0F3A66` | **Don't re-theme.** 6.7:1 white, 6.4:1 cream, 6.0:1 butter. |
| `--open`, `--closing`, `--closed` | `#00703C`, `#8A4B00`, `#554B66` | Status dots. Don't re-theme. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. **Never change.** |
| `--bee-boot`, `--bee-prop` | `#E8473B`, `#2E8BC0` | Mascot wellies and antenna hearts; props (clock, bowl, camera). `mascot.svg` reads them through `<use>`. Set them to the nursery's colours. |
| `--font`, `--font-display` | Rubik / Fredoka | Keep. Fredoka is for headings, buttons, tags and the brand only. |
| `--text-base`, `--text-small`, `--text-lead` | 18px (19px from 48em), 16px, 20px | Don't go below 16px for running text. |
| `--radius`, `--radius-big`, `--radius-pill` | 18px, 40px, pill | Cards; the clock band and quote; buttons and tags. |
| `--tap`, `--button-height` | 44px, 56px | Never lower. |
| `--gutter` | 24px; 40px from 37.5em; 64px from 64em | S1. Don't lower. |
| `--section`, `--group` | `clamp(5rem, 3.6rem + 5.6vw, 8rem)`; 3rem (4rem from 64em) | S2: section padding and the gap between groups. Don't lower. |
| `--measure`, `--wrap` | 56ch (about 60 characters); 70rem (1,120px) | S8 line length; S1 container. |
| `--door-gap` | 8.25rem | Space between homepage doors on a phone, so ≤ 3 sit on one 844px screen (S5). |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../sidekick.js` and `../fonts/` still resolve, and keep each page's inline sprite block (or copy the whole template folder).
2. **Choose the animal** from the nursery's name or logo (section 8). If there is none, pick one from the place (a puffin by the sea, a red squirrel by woods, a hedgehog for a garden nursery) and say so in your report.
3. **Accents.** Take the nursery's main colour. If it carries white text at 4.5:1 or more, it can be `--accent` (darken it until it does; `--accent-strong` about 15% darker, 7:1 or more). The second accent must carry ink at 7:1 or more (a yellow, apricot or pale teal). Recompute every pair in the table above and update the comments in `styles.css`.
4. **Mascot.** Redraw `mascot.svg` (section 8). Update `--bee-boot` and `--bee-prop`.
5. **Copy.** Replace every Jaybees fact on every page, then `grep -n "Jaybees\|Lochmaben\|810303\|DG11\|buzzus\|Kerry\|Jackie\|CS2008190761\|Dumfries" *.html` must return nothing from Jaybees.
6. **Theme words** lightly: Jaybees uses "the hive" because the nursery does. Use the nursery's own words (its room names, its phrases), never invented themed names.
7. **Schedule, closures, notice, grades** (sections 9 and 11). Check weekdays with a script.
8. `<title>`, meta description, `theme-color` (= `--accent`), favicon (redraw the animal's face), footer review dates (today and today plus 6 months).
9. Photos and video (section 10), `img/CREDITS.txt`.
10. Run the checklist in section 12, then `node pipeline/template-thumbs.mjs <folder>` if it is a new template folder.

## 8. The mascot (`mascot.svg`)

### How it is built
- Every pose is a `<symbol>` with `viewBox="0 0 240 240"` (the peek pose crops to `24 26 192 110`). The character stands with its feet near `y=210` and a ground shadow at `y=222`.
- Shared parts live in `<defs>` and are reused with `<use href="#…"/>` inside each pose:
  - `bee-wings` (behind), `bee-antennae` (with heart tips in `--bee-boot`), `bee-legs` (standing, with wellies) or `bee-legs-dangle` (jumping, flying);
  - `bee-body`: a round body centred at `(120, 128)`, radius 56, flat yellow with one shade crescent, one highlight, two ink stripes drawn to the circle's edge (**no `clipPath`**, because clip paths fail inside external `<use>`), and an ink outline 4px wide;
  - `bee-cheeks`; eyes `bee-eyes`, `bee-eyes-look-down`, `bee-eyes-happy`, `bee-eyes-sleep`, `bee-eyes-wink`; mouths `bee-smile`, `bee-grin`, `bee-oh`, `bee-snooze`; `bee-hand` (a round ink mitten, r 7).
- **Arms** are drawn per pose as 7px ink "noodles" from the body's side to a `bee-hand`, so the same body can hold anything.
- **Props** use `--bee-prop` through `style="fill:var(--bee-prop,#2E8BC0)"` (presentation attributes can't take `var()`).
- **Palette**: ink `#2A2238`, body `#FFC83D`, shade `#F29E1F`, highlight `#FFE592`, wings `#D8EEFA` with white glints, cheeks `#FF8C7A` at 75%, wellies `--bee-boot`.
- Never put `--` inside an XML comment in the sprite: it breaks the whole file and every pose disappears.

### The 17 poses and where they go
| Pose id | What it does | Used for |
|---|---|---|
| `bee-wave` | Waves, big grin | Hero, day path "Hello", drop-off |
| `bee-clock` | Hugs an alarm clock | Clock band, dated notices |
| `bee-lunch` | Bowl of food and a spoon, happy eyes | Day path "Lunch", menus |
| `bee-explore` | Magnifying glass, "oh!" mouth | Day path "Explore", Our nursery, 2 year olds |
| `bee-sleep` | Asleep on a pillow in a nightcap | Day path "Cosy time", footer, drawn tiles |
| `bee-map` | Reads a map with a pin | Find us |
| `bee-garden` | Watering can and a seedling | Garden, eco work |
| `bee-phone` | On the phone, winking | Visit and join |
| `bee-camera` | Holds a camera | Gallery |
| `bee-book` | Reads a book | Parents, policies |
| `bee-star` | Holds a star rosette | Team training, help with costs |
| `bee-puddle` | Jumps in a puddle in wellies | Day path "Outside", Big Buzzers, outdoors |
| `bee-fly` | Flies with a backpack | Day path "Home time", school club |
| `bee-heart` | Hugs a heart | Reviews, Our team, babies' room |
| `bee-coins` | Coin jar and a pound coin | Fees and funding |
| `bee-paint` | Palette and brush | Artwork, toddler room |
| `bee-peek` | Head and hands only | Brand mark, sticky booking bar |
| `deco-hero` (scene) | Pale blob, honeycomb, daisies, a dashed flight path, a heart | Behind the hero mascot |

### Drawing a new animal for another nursery
1. Keep the **structure**: same ids for the poses (so pages don't change), same 240×240 box, same standing line and shadow, same arm and hand method, same ink colour and 4px outline.
2. Replace the parts in `<defs>`: `bee-body` (the animal's body and face shape), `bee-wings` (ears, tufts or tail behind the body), `bee-antennae` (anything on top of the head) and, if needed, the eye set. Keep the eyes big and glossy (white, ink pupil, two white glints) and the cheeks soft: that is what makes the character charming.
3. Keep the wellies unless they really don't suit the animal; they are the template's signature and they suit Scottish outdoor play.
4. Rename ids only if you also update every page (`grep -n 'href="#bee-' *.html`), and re-paste the sprite into every page.
5. Render all poses side by side in a browser and look at them at 48px and 240px. Check: same proportions in every pose, nothing poking past the box, every pose readable at small size.
6. Ideas by animal: **owl** (round body, ear tufts for antennae, wing-arms), **squirrel** (pear body, big tail behind for wings, tufted ears), **hedgehog** (spiky back as the "wings" layer), **puffin** (white face patch, striped beak), **ladybird** (red shell with spots, split shell as wings).

## 9. Inner pages

Every page reuses the head, header, footer, booking bar, schedule JSON and script exactly. Only `<title>` ("[Page]: [Nursery], [Town]"), meta description and `aria-current="page"` change.

**Every inner page has the same frame (S10):**
1. **The page band** `.page-head`: kicker (the page name), `h1` (≤ 6 words, one highlighted word), an intro (≤ 35 words), **one** action (Book a visit, or Phone where phoning is the point), optionally the live status pill, and a pose that differs per page. No breadcrumb.
2. **"On this page"** `nav.onpage` when the page has 3 or more sections.
3. **Short sections** `section.section` with ids, alternating white and cream: an `h2` and ≤ 120 words of body inside `.part`, plus at most one list, table or image; longer detail goes in a `.faq` accordion.
4. **A "Next" door** `nav.next`, then the **visit band**. Up to about 900 words a page.

| Page | `h1` (Jaybees) | Sections, in order | Next | Pose |
|---|---|---|---|---|
| `join-us.html` | Come and see the **hive** | Book a visit (questions in an accordion, Get in touch panel) · Join the waiting list (`.steps`, places "phone to check", funded hours note) · Hours and sessions (the **clock band** with its side box, then `.summary`) · Our rooms (`.rooms--4`) · Settling in (`.steps`, photo) · What to bring (and "Your information") · Find us (`bee-map`, directions, contact list) | Fees and funding | `bee-wave` |
| `fees-and-funding.html` | **Funding** and fees | 1,140 funded hours (council, directory link, "Good to know" accordion) · When funding starts (table) · 2 year olds · Our fees ("phone us", how monthly fees are worked out) · Paying (`.summary`) · Help with costs (tiles to GOV.UK and Parent Club) | Our nursery | `bee-coins` |
| `our-nursery.html` | Life in the **hive** | What's here (`.facts`, from the old homepage pills) · Rooms (one colour and pose each) · A day in the hive (the full day path) · Outdoors · Food (menus in an accordion) · Community (static tiles) · Inspection (grades and quote) | Our team | `bee-explore` |
| `our-team.html` | Meet the **team** | Who runs the hive (photo, 3 leader cards) · People you'll meet (Kerry, Stacy, Bev) · Everyone else (`.roster`) · Training and checks · What families say (the parent quote, from the old homepage) | Parents | `bee-heart` |
| `parents.html` | Parents' **corner** | Dated notice · Closures (table with `data-from`/`data-to`, `[data-next-closure]`) · Drop-off and collection · Illness (hygiene in an accordion) · Lunch and menus · Paying fees · Worries and complaints (nursery, then the Care Inspectorate; 999 note) · Policies | Gallery | `bee-book` |
| `gallery.html` | Peek inside the **hive** | "On this page" (the groups and the film) · one `section.gallery-group[data-group]` per group with a pose and `ul.mosaic` · A short film (tour with transcript, from Our nursery) · `dialog.lightbox` | Visit and join | `bee-camera` |

### Gallery details
- Each photo is `<button class="gallery__open" data-full="img/x-800.webp" data-caption="…"><figure><img …><figcaption>…</figcaption></figure></button>`.
- Groups: Rooms, Garden, Forest (or Outdoors), Food, Artwork. Leave a group out if it has nothing; if it has one photo, add a `.drawn` tile with a pose and "Photos of our [rooms] are coming soon".
- Alt text says what is in the photo; the caption is a short, warm label.
- The lightbox is a real `<dialog>`: Esc and the backdrop close it, and focus returns to the photo that opened it. Inside it, round Previous / Next icon buttons (`.lightbox__prev`, `.lightbox__next`, 48px, `aria-label` "Previous photo" / "Next photo") sit in a row under the photo on phones and on its sides from 40em; with a "3 of 12" count (`.lightbox__count`, `aria-live="polite"`), the arrow keys and a 40px swipe, they step through the photos shown (filters respected, drawn tiles skipped) and wrap at the ends. The page itself has no slider.

### The schedule (`#nursery-schedule`)
Same format as Front Desk Nursery (`templates/nursery/front-desk/BRIEF.md` section 8): `days` with 24-hour sessions, optional `term`, and `closures` with whole-day `from`/`to` and a `label` that reads after "Closed for". Status text: "Open now until 6pm", "Open now. Home time soon, at 6pm", "Closed now. Opens tomorrow at 7:30am", "Closed for Christmas Day. Opens on Tuesday 29 December at 7:30am". Keep the closures table rows in step. The example was tested with Playwright's clock at 8am and 5:45pm on a weekday, a Saturday, Christmas Day and Christmas Eve evening.

## 10. Video

### Living photo
```html
<figure class="living" data-living>
  <div class="living__frame">
    <video muted loop playsinline preload="none" poster="img/x-poster.webp" data-src="media/x-loop.mp4"
           aria-label="What it shows" width="640" height="360"></video>
    <span class="living__label" aria-hidden="true">Our forest classroom</span>
    <button class="living__toggle" type="button" hidden>…<span data-label>Pause</span></button>
  </div>
</figure>
```
- 6 to 10 seconds, muted, no audio track, under 1.5 MB, H.264 MP4 with `+faststart`, 640×360 is plenty.
- The script sets `src` and plays it **only** above 48em and without reduced motion. Phones and reduced-motion users get the poster and a Play button; without JavaScript, the poster.
- Make it from the nursery's own footage of rooms, the garden or food with no identifiable children, or as an **honest slow pan** across one real photo (as in the example), labelled for what it is.
- Example recipe (pan, seamless loop): `ffmpeg -loop 1 -i photo.png -t 10 -r 24 -vf "scale=960:720,crop=640:360:'320*(1-cos(2*PI*t/10))/2':'230',format=yuv420p" -an -c:v libx264 -crf 29 -movflags +faststart loop.mp4`.

### Tour or film
```html
<figure class="film">
  <video controls preload="none" playsinline poster="img/tour-poster.webp" width="640" height="360" aria-describedby="tour-note">
    <source src="media/tour.mp4" type="video/mp4">
    <track kind="captions" src="media/tour.vtt" srclang="en" label="English" default>
  </video>
  <figcaption id="tour-note"><p class="mb-0">… <a href="#tour-transcript">Read what it shows</a>.</p></figcaption>
</figure>
```
- Click to play, `preload="none"`, a real poster, WebVTT captions **and** a transcript on the page (`details#tour-transcript`). Sound only when the user presses play; if the film is silent, say so.
- Self-hosted only. No YouTube, Vimeo or Wistia.
- Jaybees has no usable footage (its films show children), so the example's film is a 32-second sequence of the eight child-free stills with slow zooms and fades, labelled "A 32-second film made from our own photos. It has no sound." Replace it with a real after-hours walk-through when the nursery films one (`PHOTO-SHOTLIST.md`).

## 11. Variants

- **Term-time nursery:** add `term` to the schedule; the clock band's line says "Monday to Friday, in term time".
- **No photos at all:** drop the homepage's Life in the hive section and move "See the gallery" into the doors, keep the tiles; the gallery page becomes drawn tiles with "Photos coming soon" plus a link to book a visit. The site still looks finished.
- **Grades 3 or below:** keep the grades panel and the link; add a `.note` in the nursery's own words about what it is improving.
- **Not a funded provider:** the quick answer reads "Phone us to check if we offer funded hours", and the fees page leads with fees.
- **No school club:** drop the club line in "What's here" and in the quick answers, the Stingers-style room and the clock band's side box line.
- **Vacancies:** add a short `.panel--bee` on Our team, with what it pays only if the nursery says. On the homepage, swap one door's line for "We're hiring" rather than adding a section.

## 12. Pre-handover checklist

Any "no" blocks handover.

**Facts**
- [ ] Every fact traces to the nursery's site or documents, or the Care Inspectorate record; "phone to check" wherever it doesn't. Disagreements listed in your report.
- [ ] Grades, headings, inspection and publication dates match the latest report; the link resolves.
- [ ] Funded status worded as confirmed (or "you apply through the council").
- [ ] Reviews and quotes come from the nursery's own site, attributed as it does.
- [ ] Closures, the schedule JSON and the dated notice agree; weekdays checked by script.
- [ ] Staff names and roles exactly as supplied; no invented roles, ratios or qualifications.

**Mascot and photos**
- [ ] The mascot is drawn for this nursery, consistent in every pose, with no people anywhere.
- [ ] No identifiable child in any image or video; metadata stripped; `img/CREDITS.txt` complete, including exclusions.
- [ ] Video labelled honestly; captions and transcript match.

**Content**
- [ ] Homepage 120 to 180 words in `<main>` (S4). Headings 2 to 6 words, one highlighted word each.
- [ ] Density script on the homepage at 390 × 844: ≤ 6 screens, ≤ 6 text blocks (7 on the first), ≤ 1 H2 and ≤ 3 real boxes per screen; one item per row on phones.
- [ ] Inner pages: page band, "On this page" (3+ sections), sections ≤ 120 words, Next door, visit band; ≤ 900 words.
- [ ] First two phone screens show ages, hours, funded hours, places, grades with date and link, Book a visit and Phone.
- [ ] Menu is 6 items plus Book a visit. "Book a visit" is the only primary wording, red everywhere. No pop-ups, sliders, autoplay with sound, maps or social embeds.
- [ ] Footer review dates set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>`: **0 blockers, 0 major, 0 minor** on every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` on **every** page: no layout flags at all 9 widths. Look at 390, 768 and 1280 yourself.
- [ ] Homepage under about 1 MB on a phone (the example: about 210 KB).
- [ ] Keyboard: skip link, menu (Escape closes), "On this page" links, accordions, gallery lightbox (Esc closes, focus returns), yellow focus everywhere, nothing hidden under the booking bar.
- [ ] Reduced motion: no bobbing, no autoplaying loop.
- [ ] Live status tested with Playwright's clock.

## 13. Jaybees example: sources, and facts to confirm

**Sources** (crawled 13 October 2026): jaybeeschildcare.co.uk (22 pages, including the FAQ accordions read in a browser), the Care Inspectorate record in `prospects/nursery/data/page-035.json` (CS2008190761), and Dumfries and Galloway Council's ELC providers directory entry for Jaybees. Nothing else.

Confirm with the nursery before go-live:
1. **Days open.** The site gives 7:30am to 6pm and "51 weeks" but never names the days. The example says "Monday to Friday (phone to check)" and the schedule assumes weekdays.
2. **Closure dates.** The site says "closed for the four festive bank holidays and Easter Monday". The example lists the 2026/27 Scottish dates (25 and 28 December, 1 and 4 January, 29 March 2027). Confirm, and ask about any other closure (the 51st-week).
3. **Grade headings.** Care and play 5, Setting 5, Leadership 5 (staff team not graded), inspected 17 March 2026, published 31 March 2026, from our data's columns. The report is under the new framework: use its exact headings.
4. **Funded provider.** Jaybees is in the council's ELC providers directory ("a private nursery for 2 to 5-year-olds"), and a Facebook post mentions funded ELC letters, but the site doesn't say it. The example only says "You apply through Dumfries and Galloway Council". Also confirm funded 2 year olds ("phone to check" on the page).
5. **Places.** The Care Inspectorate registers 118 places (this includes the school club). Availability is "phone to check".
6. **Ages.** Baby Bumbles is "0 to 2" on the site; confirm the youngest age taken.
7. **School club details.** "We will drop off at school / collect from school": which school(s)? The example doesn't name one.
8. **Fees.** Not published. The example explains the 51-week monthly calculation and says "phone us". Childcare Vouchers are accepted (site); Tax-Free Childcare is "ask us".
9. **HMI quote.** "Almost all children are happy, motivated, confident and curious. They lead their own learning." is quoted on the team page as from "our recent HMI inspection"; confirm the date and wording against the report.
10. **Awards and memberships.** Eco Schools Green Flag (2022, per the Stingers page), Bev's "cook safe" award, and the accreditation logos (SSSC, Eat Safe, RHS Five Star Gardening School, Millie's Mark) are undated. Only the Green Flag and Bev's award appear in the text.
11. **Staff.** Names and roles are from the team page; many people have no stated role, so none is shown. Confirm everyone still works there, that each is happy to appear, and that the staff photos (the trio and Bev) can be reused.
12. **Volunteer.** "Granny Bees" volunteer Heather is named on the site; the example names her but leaves out the health details the old site published. Confirm she is happy to be named.
13. **What to bring.** Only the cuddly toy or blanket is from the site; outdoor clothes follow from "free flow outdoors" and the forest classroom. Ask for their list.
14. **Privacy notice and policies.** The old site has a privacy policy page; ask for current versions to publish as HTML.
15. **Mascot.** The bee is new, drawn for this template, not the nursery's logo bee. Ask whether they want it, want it named, or want it redrawn closer to their logo.
