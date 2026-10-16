# Make Waves, spacious version: a website template for independent Scottish nurseries

> Pipeline name: **Make Waves (spacious)**, folder `templates/nursery/make-waves-spacious/`. A copy of `nursery/make-waves/` rebuilt to the **space brief** (rules S1 to S13, Part 2 of `prospects/research/nursery-spacious-directions.md`) so the owner can compare it side by side with the original. Same palette, fonts, bands, wave seams, riders, Oban scene, example nursery and facts. **Read the space brief before changing any spacing.**

## Spacious version: what changed and why

The owner found the original "a bit cramped, especially in mobile view" and wanted "less detail on the home page, with a clear way to go into separate pages". The fix is fewer things per phone screen, one thing per row, and real doors to inner pages.

**Homepage** (hero plus 4 sections, S3): Hero → The essentials → Have a look around → Come aboard (doors) → Come and see us (visit band) → footer.
- **Hero (S2, S13):** only the name, one sentence (13 words) and two actions: "Book a visit" (now to `join-us.html#visit`, the one primary wording site-wide) and "Phone 01631 567491". The status pill and "Join the waiting list" moved out (status to the visit band and Find us; waiting list stays on Visit and join). The Oban scene and the desktop living photo are unchanged.
- **The essentials (S9) replace the big-number fact mosaic:** 5 lines on the sea band, not boxes. The mosaic lives on in each line's small tilted colour tile and its Baloo display number ("**9 months** to 5 years"). The grades line is a summary with the date and the report link ("Care Inspectorate, July 2026: Weak to Good"); all four grades with meters stay on Our nursery. One closing link: "All the details".
- **Have a look around (S6, S12):** two ringed photos, photo-only, 2 to a row, and one door link. The other three ring photos are on Our nursery and the Gallery.
- **Come aboard, the doors (S9, S5, S7):** the 2-column icon cards became **door strips**: on a phone each door is a full-width strip in its page's colour with its own little wave top, one per row, 154px apart (icon, page name, squiggle, one line, arrow). From 48em they are bordered tiles, 2 then 3 to a row. Colours match the menu dots and each page head.
- **Come and see us (S13):** the visit band, the same on every page: status pill, one sentence, Book a visit and Phone, on sun.
- **Moved off the homepage, nothing lost:** room cards ("A room for every age") → already on Our nursery; the parent quote → Visit and join, under "Moving up a room"; "Find us on Croft Road" (status, directions, address card) → a new Find us section on Visit and join; the 5-photo ring strip → Our nursery and Gallery (all already there).

**Every page**
- **Space tokens (S1, S2, S7, S8):** `--gutter` 24 / 40 / 64px; `--section` `clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80px phone, 128px at 1280), and bands with a wave now keep the full top padding (it was 55%); `--group` 48 / 64px; `--gap-cards` 24 / 32px for cards, rooms, panels, day items and facts; `--measure` 60ch on paragraphs; body line height 1.6.
- **Menu (S11):** 6 items (Home dropped: the logo is the home link) plus "Book a visit". Phones get a full-height sheet, 56px rows in door order, with Book a visit and Phone at the bottom. No items printed under the logo. The header is sticky on phones so the sheet's Close button stays reachable.
- **Footer:** "Help for families" (3 links) and "Look around the nursery" were dropped from the footer: every one of those links is in the body of Fees and funding, Visit and join or the menu. The footer is now contact + About us.

**Inner pages (S10)**
- **Page head:** breadcrumb as the eyebrow, H1, intro, one action (Phone), and a drawing that differs per page (ferry, creel, seal, fishing boat, sailboat, otter). The status pills in the Visit and Parents heads moved to the visit band.
- **"On this page":** the jump chips became a vertical list of up to 7 links, 48px rows with a wave bullet, on pages with 3 or more sections (the Gallery has 2, so none).
- **Accordions:** on Our nursery the inspectors' quotes ("What the inspectors liked", "What we must improve") are in `<details>`; the grades, date, both requirements and their deadline stay visible.
- **End of every page:** a "Next" door (a door tile in the next page's colour) on cream, then the visit band. Order: Visit and join → Fees and funding → Our nursery → Our team → Parents → Gallery → Visit and join.
- **Gallery filters (S6):** 4 pills (All, Rooms, Garden, Building). The Food and Artwork groups, with their honest "no photos yet" tiles, still show under All.

### Space figures (Oban example, 390 × 844, `scratchpad/tools/density.mjs`, 14 October 2026)

| Check | Space brief | Original | Spacious |
|---|---|---|---|
| Homepage phone length | ≤ 6 screens (≈ 5,064px) | 6,969px (8.3 screens) | **4,555px (5.4 screens)** |
| Words in homepage `<main>` | 120 to 180 | 335 | **143** |
| Text blocks, first three screens | ≤ 7 / 6 / 6 | 9 / 10 / 8 | **4 / 6 / 5** (average 5.5, footer included) |
| Boxes on the first screen (average) | ≤ 3 | 9 (3.9) | **3 (2.2)** |
| Hero height | ≥ 70% of the first screen | n/a | 608px below a 68px header (72%) |
| Items per row on a phone | 1 (2 photo-only) | 2 (facts, cards, rings) | 1; 2 only for the two photo-only rings |
| Gutters / section padding | 24 / 40 / 64px; ≥ 80 / 128px | 16 to 32px; 52 to 96px | as the brief |
| Inner page words in `<main>` | ≤ about 900 | | Visit and join 500, Fees 422, Our nursery 531, Team 165, Parents 287, Gallery 193 |
| `audit.mjs` | 0 / 0 / 0 | | **0 blockers, 0 major, 0 minor** (7 pages, 236 links) |
| `viewports.mjs`, 9 widths | no flags | | **no layout flags** on all 7 pages |

The footer screens (5 and 6) hold more than 6 text blocks: contact lines and links. S5 is applied to the content above it.

---

## The original brief (still current except where the section above says otherwise)

**The idea in one line:** the page is a stack of full-width flat colour bands that change hue as you scroll, joined by hand-drawn wave seams, with small drawn things from **one local theme** riding on the seams. For Oban that is the bay: a seal on a rock, gulls, a ferry, a fishing boat, a creel and a lighthouse, under a hero scene of the town, McCaig's Tower and the nursery's own stone school.

It is built to **sell the nursery to parents** (bright, fun, not text-heavy) while still answering every parent question honestly: ages, hours, funded hours, places and a grades summary with its date are in the essentials on the first two phone screens; every grade is on Our nursery.

Sources behind every decision:
- `prospects/research/nursery-colourful-directions.md` (the direction, shared rules and banned devices);
- `prospects/research/nursery-sites-2/` (studies of Banana Moon Aberdeen, Abacus Ark Wandsworth and Bright Starts Thornliebank, plus `SUMMARY-A.md` and `SUMMARY-B.md`);
- `prospects/research/nursery-websites.md` §3.6 (what a nursery may claim), §4 (trust), §5 (photos), §6 (structure). References like **§6.2** point there.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `waves.js` | About 200 lines, no dependencies: full-height phone menu, live open/closed status, dated notices, phone booking dock, gallery filters, lightbox `<dialog>`, living-photo play and pause. | Never. It reads its data from the page |
| `fonts/` | Baloo 2 (display, 600 to 800, used at 800) and Onest (body, 400 to 700). Latin and Latin Extended woff2 subsets, 116 KB in all. `fonts/OFL.txt`. Neither font has a Reserved Font Name, so subsetting is allowed. | Never |
| `example/*.html` | A finished 7-page site for **Oban's 1st Steps Day Nursery**, a real private nursery in Oban, Argyll and Bute, built only from its website, its parents' handbook and its Care Inspectorate record and July 2026 report. | Copy for each nursery |
| `example/img/` | 11 real photos (WebP, 400 and 500px), a living-photo loop, a photo tour with captions, posters and `CREDITS.txt` (sources, exclusions and why). | Each nursery gets its own |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to photograph and film. | No |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/make-waves-spacious`. | After changes |

Pages link `../styles.css`, `../waves.js` and `../fonts/`. Every page carries the same inline SVG sprite (waves, riders, icons) after the skip link. Nothing loads from another server: no Google Fonts, no CDNs, no maps, no analytics, no social embeds, no YouTube or Vimeo (§6.6).

---

## 1. Concept, and what it deliberately avoids

What the owner's chosen sites do well, and we keep:
- **Whole bands of flat colour** that change hue section by section (Banana Moon about 70% colour, Abacus about 90%).
- **Wavy seams** between bands: Banana Moon's choppy child-drawn sea, Abacus's long swells with a thin crest line. The cheapest device that makes a page feel "for children".
- **Small drawn characters on the seams** (Banana Moon's cat and crab, ducklings, seagull and lighthouse; Abacus's five boats). They cost no words.
- **One theme carried everywhere** (Abacus: the boat in the logo, the waves, "Setting sail").
- **Ringed circle photos** of empty rooms (Abacus), and **colour-coded room cards** (Bright Starts).
- **Icon-card navigation** with a coloured squiggle (Banana Moon) and **big-number facts** ("3:1", "From 3 months").

What they do badly, and we fix:
- Bright bands fail contrast (white on `#f08650` is 2.6:1). Here every band has a computed ink colour, and bright bands only ever carry navy text (section 7).
- No fees, no funding, no grades (Banana Moon, Abacus). Here the facts band answers all of it on the first phone scroll.
- Sliders, review widgets, trackers, Typekit, 50 MB pages. Here: none, and the phone homepage weighs **285 KB**.
- Galleries as CSS backgrounds with `alt="AI"`. Here: real `<img>`, true alt text, captions, filters and an accessible `<dialog>`.

**Devices we must not reuse** from our earlier nursery templates (luggage tags, cork boards, full-stop headlines, storybook chapters, weather tiles, recipe cards, leaf corners, torn paper, key facts as a row of boxed cards). The big-number facts here are a **mosaic** of differently coloured, slightly tilted cards of different widths with a squiggle under each number, plus one wide grades card, not a uniform row of boxes.

## 2. Research-to-design decisions

| # | Decision | Why |
|---|---|---|
| 1 | **Hero: nursery name with one coloured word, one sentence, "Book a visit" (green, to Visit and join) and "Phone"** (spacious version, S2), then the drawn **theme scene** along the bottom edge. | §6.2 hero order; direction 2's "hero with the theme scene drawn along its bottom edge". The scene costs 13 KB and no consent. |
| 2 | **The essentials straight after the hero, on the sea band** (spacious version; the original had a facts mosaic): ages, hours, funded hours, places and a grades summary with date and link, as 5 lines. Every grade with its meter is on Our nursery. | The shared rule: ages, hours, 1,140 funded hours, places (or "phone to check"), grades with date and link, and book/phone, all within one phone scroll (§6.2 item 3). Measured: the first facts start at about 770px on a 390×844 phone. |
| 3 | **Grades shown honestly, all of them, with their exact headings.** The Oban example shows a 2 (Weak) because that is the latest report. The Our nursery page quotes what the inspectors liked and what must improve, verbatim, and the requirement deadline. | §3.2 and §4.1: never show only the best grade; upheld complaints and reports are public anyway. Honesty is part of the premium feel. |
| 4 | **"Come aboard" door strips** (6 doors: icon, page name, coloured squiggle, one line; full-width strips with wave tops on phones, tiles from 48em). | Banana Moon's homepage cards are its navigation; the shared rule says deeper content sits on inner pages reached by big colourful tiles. |
| 5 | **Colour-coded room cards** (Our nursery page) with the nursery's real room names and a drawn emblem each. | Bright Starts' room colours; theme copy only uses real room names (direction 2). Emblems rather than photos because we can't always tell which photo is which room. |
| 6 | **Ringed circle photos**: 2 on the homepage, 3 on Our nursery, ring colour rotating. | Abacus's circles; the gallery strip of 4 to 6 photos (shared rule). |
| 7 | **Living photo** (muted loop, poster, pause button, autoplays only above phone width without reduced motion) and **photo tour** (click to play, `preload="none"`, captions, transcript). | The shared video rules. Self-hosted, no YouTube or Vimeo. |
| 8 | **One parent quote** (Visit and join, under Settling in), attributed as the nursery's site attributes it. | Reviews only from the nursery's own site (house rule). |
| 9 | **Find us** (Visit and join) with address, phone, email, hours, a second status pill and a directions link, no map embed. | §6.4, §6.6. |
| 10 | **Inner pages each get their own band colour** in the page head (Visit and join coral, Fees sun, Our nursery deep sea, Team heather, Parents apricot, Gallery leaf) with matching nav dots. | Banana Moon's per-page colour: parents can tell where they are by colour alone. |
| 11 | **"On this page"** under each inner page head with 3 or more sections: a vertical list of 48px rows (the spacious version replaced the jump chips, S10). | Long pages stay short to scan. |
| 12 | **Phone booking dock** ("Book a visit" and "Phone", with a tiny drawn boat). It appears only once the hero buttons have scrolled away, and the footer pads for it. | Allowed by the shared rules if it never covers content or focus. `scroll-padding-bottom: 6rem` keeps focused items above it. |
| 13 | **Six-item menu** (Visit and join, Fees and funding, Our nursery, Our team, Parents, Gallery) plus Book a visit; the logo is Home. Phones get a full-height sheet under "Menu". | §6.1, S11. |
| 14 | **Rounded heavy display type (Baloo 2, 800)** for headings with one coloured word, and **Onest** for body text at 18px (20px from 48em). | Direction 2's look; Abacus's Belanosima plus large readable body text. Baloo has a hand-cut warmth without being crayon. |
| 15 | **No pop-ups, carousels, auto-advancing anything, chat, trackers or embeds.** | §6.4, [NNG-C], [ICO-PECR]. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, policy and service comes from the nursery's site, its documents, or its Care Inspectorate record and report. The §3.6 list is binding. Use its "Otherwise write" wording: "Phone us to check for a space", "Phone us for our current fees", "Ask us about staff ratios when you visit".
2. **Grades:** read the nursery's Care Inspectorate record page (it shows the latest inspection date) and its latest report. Our datastore can be a year out of date: for Oban it held the July 2025 grades, but the record showed a July 2026 inspection with different headings and grades. Copy the report's exact headings, grades and date. Show all of them.
3. **Ratios:** print only the nursery's own stated ratios. The Care Inspectorate conditions of registration are not the nursery's statement.
4. **Theme copy is light and true.** "Come aboard", "Outside, every day": yes. Invented room names, mascots with names, "our little sailors": no. Only real room names.
5. **Where sources disagree**, use the newest dated source and list the disagreement in your report (section 12 shows how).

### Photos (§5)
6. **No identifiable children, ever.** Check every photo at full size: Oban's `facilities/3.jpg` looked empty at thumbnail size but has a child in a dressing-up costume in the middle distance.
7. Allowed: empty rooms, the garden, the building, food, artwork without names, hands, children from behind or far away, staff with written consent.
8. Strip metadata, record every source and every exclusion in `img/CREDITS.txt`. Never upscale: if the site only holds 500px images, ship 400 and 500 and ask for originals.
9. **The template must look complete with no photos.** Remove the rings strip and mosaic groups and the bands, riders and scene still carry it. Empty gallery groups use the drawn fallback tile (`.mosaic__drawn`) with an honest line ("No food photos yet. Ask to see lunch when you visit.").

### Content style
10. "8am to 6pm", days and months in full, "to" not dashes. Links start with a verb. Homepage sentences 20 words or fewer; **homepage 120 to 180 words in `<main>`** (S4; Oban: 143). Hero up to 25 words, section body up to 30, door line up to 8, essentials line up to 8.
11. Phone numbers are `tel:+44…` links shown as written locally. Short numbers (999) are plain `<strong>` text.

### Accessibility (WCAG 2.2 AA)
12. **Contrast:** keep the band/ink pairs in section 7. Bright bands (sea, sun, apricot, coral, leaf, sky) carry **navy text only**. White text only on sea-deep, heather and navy.
13. Headline accent words (`.hl`) take `--hl` from their band; every pair passes 4.5:1.
14. One `h1` per page, `h2` per section, `h3` inside. The skip link is first; the SVG sprite follows it with `aria-hidden`.
15. **Every drawing is decorative:** waves, riders, emblems and the scene all carry `aria-hidden="true" focusable="false"`.
16. Tap targets 44px or more (`.go`, `.summary a`, `.phone-line a`, chips, filters). The GOV.UK yellow focus style is in `styles.css`: never remove it.
17. **Motion:** riders bob and clouds drift only inside `prefers-reduced-motion: no-preference`. The living photo never autoplays on phones or under reduced motion, and always has a pause button.

### Performance
18. Homepage under about 1 MB on a phone (Oban: 285 KB on a phone, 650 KB on desktop including the 367 KB living-photo loop). Below-the-fold images are `loading="lazy"` with `width` and `height`.
19. Living photo under 1.5 MB, 6 to 10 seconds. Tour under 4 MB, `preload="none"`.

## 4. Homepage structure (keep this order)

1. Skip link, SVG sprite, header (`a.brand` with the 44px mark, `a.header-call` "Phone" / the number from 48em, `button.menu-toggle` "Menu", `nav.site-nav#site-nav` with 6 items in door order and `.nav-extra` with Book a visit and Phone). Sticky on phones.
2. **Hero** `section.hero` (sky, at least 70% of the first phone screen): `h1` name with `span.hl`; `p.hero__lead` (one sentence); `.actions` (green `a.btn` "Book a visit" to `join-us.html#visit`, `a.btn.btn--ghost` "Phone 01631 567491"); `.hero__aside` (desktop only) with the living photo in a ring; then the **theme scene** `svg.scene`.
3. **The essentials** `section.band.band--sea.band--flush-top.essentials-band`: `h2`, `ul.essentials` of 5 `li` (each `span.essentials__tile` with `--tile` colour and an icon, then the line with one `span.essentials__big`), then `p.go-row > a.go` "All the details".
4. **Have a look around** (navy, double seam): `.look-grid` with `.section-head`, `div.rings.rings--2` (2 photo-only `figure.ring`) and one `.go` link.
5. **Come aboard** (cream, swell seam): `ul.doors` of 6 `a.door.door--{visit|fees|nursery|team|parents|gallery}` (icon, title, squiggle, line, arrow).
6. **Come and see us** `section.band.band--sun.visit-band`: `h2`, status pill, one sentence, Book a visit and Phone, a ferry drawing on desktop.
7. Footer (navy, choppy seam, lighthouse rider), phone dock, `script#nursery-schedule`, `waves.js`.

At most 4 content sections plus the visit band (S3). Every content section ends with exactly one `.go` link (S9). Bands must alternate hue. Never put two bands of the same colour next to each other; when you remove a section, re-pick the following band's colour and its seam.

## 5. Bands, seams and riders (how the signature works)

**A band** is `<section class="band band--{colour}">`. Its **wave** is the first child and draws the band's own top edge in its own colour, so the band above shows behind the crests:

```html
<section class="band band--sun">
  <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><use href="#w-choppy"/></svg>
  <div class="riders" aria-hidden="true">
    <svg class="rider bob" viewBox="0 0 136 90" style="--x:80%;--w:96px;--sit:.1" aria-hidden="true" focusable="false"><use href="#r-fishing"/></svg>
  </div>
  <div class="wrap">…</div>
</section>
```

- **Three seam styles**, one SVG each in the sprite: `#w-choppy` (Banana Moon's child-drawn sea), `#w-swell` (long Abacus swell with a light crest line), `#w-double` (swell plus two broken water lines). Use them in rotation; avoid the same style twice in a row.
- `preserveAspectRatio="xMidYMax slice"` keeps the wave shape at every width (it crops rather than squashes on phones). Seam height is `--wave-h` (46 to 80px).
- **Bottom padding:** every band reserves `var(--wave-h) * .75` under its content, because the next band's wave and riders draw over it. Don't override `padding-bottom` without keeping that.
- **Riders** sit in `.riders` (positioned at the band's top edge). Set `--x` (percent across), `--w` (phone width in px; it grows 1.3× from 48em) and `--sit` (how far up the wave the base sits, as a fraction of `--wave-h`; things with their own rock use about 0, boats about .1, standing birds .3). Add `bob`, `bob--slow` or `bob--tilt` for gentle motion, and `rider--desk` to hide one on phones.
- **No more than 2 riders per seam and about 6 per page.** Keep them near the edges (x below 25% or above 75%) so they never sit on text. Check 390px and 1280px screenshots: if a rider touches content, move it or drop it.
- Riders available in the sprite: `r-seal`, `r-gull`, `r-gull-fly`, `r-sailboat` (recolour with `--sail` and `--hull`), `r-fishing`, `r-ferry`, `r-crab`, `r-creel`, `r-buoy`, `r-lighthouse`, `r-starfish`, `r-otter`.

### Re-theming the riders and scene for another place
The theme must be **true to the place** (direction 2): a river with ducks and a boat for a riverside town, hills and sheep for a rural nursery, a skyline with pigeons for a city, a forest with squirrels.
1. Pick the theme from the nursery's own words ("overlooking the bay", "beside the river", "in the woods") and the town.
2. Draw new `r-*` symbols in the same style: flat fills from the palette, a 2 to 2.4px navy (`#0B2A4A`) keyline, round joins, a white catchlight in each eye, no people or faces of people. 40 to 230 units wide. Keep each under about 2 KB.
3. Redraw the hero scene (`svg.scene`, viewBox 1440×270): sky, far hills, a landmark the town is known for, the nursery's own building drawn from its photo, and a band of the next section's colour along the bottom (the `.sea` path takes `var(--sea)`). **Keep the important things between x 380 and x 1060**: that is all a 390px phone shows.
4. Rename theme copy only where it stays true ("Come aboard" for the sea; "Come on in" or "Welcome to the hill" elsewhere).

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.band`, `.band--sky/sea/sea-deep/sun/apricot/coral/heather/leaf/navy/cream/white` | Full-width colour bands; each sets `--band`, `--band-ink`, `--band-soft` and `--hl`. Add `.on-light` on cream and white bands so plain links use link blue. |
| `.wave`, `.riders`, `.rider` (+ `--sm`, `--lg`, `--desk`), `.bob`, `.drift` | Seams and their characters (section 5). |
| `.hero`, `.scene`, `.hero__aside` | Homepage hero and theme scene. |
| `.page-head` (+ `--deep`), `.page-head__grid`, `.page-head__art`, `.breadcrumb`, `.toc` | Inner page head in the page's colour (`style="--page:var(--coral)"`) with its own drawing, then "On this page" (`nav.toc`, 48px rows) when there are 3 or more sections. `.chips` remains in the CSS but is no longer used. |
| `.essentials`, `.essentials__tile`, `.essentials__big`, `.go-row` | The homepage essentials list (S9). |
| `.doors`, `.door`, `.door--visit…gallery`, `.next-door`, `.visit-band` | Door strips, the Next door and the Book a visit band (S9, S10, S13). |
| `.facts`, `.fact` (+ `--sun/apricot/cream/coral`, `--wide`, `--grades`, `--tilt-l/-r`), `.fact__big`, `.fact__line`, `.fact__note` | Big-number fact cards, now inner pages only (Fees, and the grades card on Our nursery). One per row on phones. |
| `.grades__list`, `.grades__area`, `.grades__word`, `.meter[data-grade]` | Grades with a 6-step meter (`aria-hidden`; the words carry the meaning). |
| `.navcards`, `.navcard--1…6` | The original icon cards. Not used in the spacious example (replaced by `.doors`). |
| `.rooms`, `.room--1…4`, `.room__emblem`, `.room__age` | Colour-coded room cards. Colours come from `--room-1…4`. |
| `.rings` (+ `--5`), `.ring`, `.ring__frame` | Ringed circle photos; ring colour rotates through `--ring-1…4`. |
| `.living`, `.living__toggle` | Living photo (section 9). |
| `.tour`, `.tour__frame`, `.tour__meta` | Click-to-play tour film. |
| `.quote` | One big quote on a band. |
| `.contact`, `.card`, `.summary` | Contact block and key/value lists. |
| `.steps` (`--step` colour), `.day` + `.day__buoy` | Numbered process; icon list for "a day here" and a short history. |
| `.panels` (+ `--3`), `.panel--sun/coral/heather/apricot/leaf` | Cards with a coloured top band. |
| `.ticks` | Lists with a small wave bullet. |
| `.table`, `.table-wrap`, `.table-note` | Fee and date tables. |
| `.note`, `.notice-band[data-show-from][data-show-until]` | Dated notices (closures only), in the page flow. |
| `.person`, `.person__badge` | Staff with initials (or a consented photo). |
| `.filters`, `.filter`, `.mosaic-group[data-group]`, `.mosaic`, `.is-big`, `.mosaic__drawn`, `.lightbox` | Gallery (section 10). |
| `.dock`, `.dock__boat` | Phone booking dock. |
| `.btn` (green), `.btn--sun`, `.btn--ghost`, `.go`, `.phone-line`, `.status` | Actions, links and the live status. |

## 7. Tokens and contrast (section 1 of `styles.css`)

| Token | Default (Oban) | Pairs (computed) |
|---|---|---|
| `--sky` | `#CDEFF0` | navy 11.9:1; accent `--hl-sky` `#0B6E76` 4.9:1 |
| `--sea` | `#3FC1C0` | navy 6.65:1. **Never white text (2.2:1).** |
| `--sea-deep` | `#0B6E76` | white 5.99:1 |
| `--sun` | `#FFC94A` | navy 9.49:1; accent `--hl-sun` `#5B3F99` 5.24:1 |
| `--apricot` | `#FFA968` | navy 7.70:1 |
| `--coral` | `#F47C68` | navy 5.49:1. **Never white text (2.65:1)**, never link blue (2.58:1) |
| `--heather` | `#5B3F99` | white 8.03:1; sun accent 5.24:1 |
| `--leaf` | `#8ED19A` | navy 8.13:1 |
| `--navy` | `#0B2A4A` | white 14.5:1; sun accent 9.49:1; sea 6.65:1 |
| `--cream` / `--white` | `#FFF8EC` / `#FFFFFF` | navy 13.8 / 14.5:1; accent `--hl-cream` `#B33A28` 5.6:1 |
| `--ink`, `--ink-soft` | `#0B2A4A`, `#3B5470` | soft ink 7.8:1 on white, 7.4:1 on cream |
| `--on-deep-soft` | `#D6E9F7` | 11.7:1 on navy |
| `--button`, `--button-strong` | `#1E6E46`, `#17583A` | white 6.2:1 and 8.4:1. Keep it green (§6.2). |
| `--link`, `--link-visited` | `#1A5C9E`, `#5B3F99` | 6.5:1 and 7.6:1 on cream. Cream and white bands only. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. Never change. |
| `--room-1…4`, `--ring-1…4` | coral, sea, sun, leaf / sun, coral, sea, apricot | All take navy text. |
| `--font`, `--font-display` | Onest / Baloo 2 at 800 | Keep. |
| `--text-base`, `--text-small` | 18px (20px from 48em), 17px | Never below 17px. |
| `--wave-h`, `--radius`, `--tap`, `--button-height` | 46–80px, 26px, 44px, 56px | Never lower `--tap`. |
| `--gutter`, `--section`, `--group`, `--gap-cards`, `--measure` | 24/40/64px, 80 to 128px, 48/64px, 24/32px, 60ch | The space brief. Never lower them. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../waves.js` and `../fonts/` still resolve.
2. Gather the facts (section 11), crawl the site (`node pipeline/crawl.mjs <url> <out>`), read any handbook, and **open the Care Inspectorate record and latest report**.
3. **Palette:** take the nursery's logo colours and map them onto the six band roles, darkening or lightening until each pair in the table above still passes. Bright colours stay bright (they're the point) but carry navy text. Oban's logo is six coloured squares, so its palette is those six, used whole.
4. **Mark:** redraw the logo's idea as a 44px inline SVG (Oban's six squares become a staircase of "first steps" over a wave). Never paste a raster logo.
5. **Theme:** section 5. New scene, new riders, light theme copy.
6. **Copy:** replace every Oban fact on every page. Afterwards `grep -n "Oban\|01631\|PA34\|Croft\|Burke\|CS2003003167\|firststeps\|Argyll\|01369" *.html` must return nothing from Oban.
7. Rewrite `#nursery-schedule` on every page, the dated notice, `<title>`, meta description, footer review dates (today, and today plus 6 months).
8. Photos and videos (section 9 and `PHOTO-SHOTLIST.md`), `CREDITS.txt`.
9. Run the checklist in section 11.

## 8. The schedule (`#nursery-schedule`)

On every page, before `waves.js`:

```json
{ "timeZone": "Europe/London", "closingSoonMinutes": 30,
  "days": { "mon": [["08:00","18:00"]], "tue": [["08:00","18:00"]], "wed": [["08:00","18:00"]],
            "thu": [["08:00","18:00"]], "fri": [["08:00","18:00"]], "sat": [], "sun": [] },
  "closures": [ { "from": "2026-12-24", "to": "2027-01-04", "label": "Christmas and New Year" } ] }
```

- `days`: 24-hour sessions per weekday (two sessions for a lunchtime closure).
- `closures`: whole days, inclusive, **only dates the nursery has published**. Oban publishes "Easter weekend, Christmas and New Year" without dates, so its list is empty and the pages say "Phone us to check this year's dates".
- Wording: "Open now, until 6pm"; last 30 minutes "Open now. Closing soon, at 6pm"; "Closed now. Opens today at 8am", "…tomorrow at 8am", "…on Monday at 8am", or "Closed for Christmas and New Year. Opens on Tuesday 5 January at 8am".
- The no-JS fallback text inside `[data-status-text]` must be true at any time ("Open 8am to 6pm, Monday to Friday").
- **Dated notice:** `<div class="notice-band" data-show-from="YYYY-MM-DD" data-show-until="YYYY-MM-DD" hidden>` with a `.note[role=note]`. Closures, snow and deadlines only, never marketing. The Oban Parents page has one for Christmas that shows from 16 November.
- Test with Playwright's clock (`page.clock.setFixedTime`): a weekday at 7:50am, 10am, 5:40pm and 6:10pm, a Friday evening, a Saturday, and a day inside each closure.

## 9. Video: the two components

**Living photo** (homepage hero aside on desktop, Our nursery garden section):
```html
<figure class="ring living">
  <span class="ring__frame" style="--ring:var(--sun)">
    <video muted loop playsinline preload="none" poster="img/living-garden-poster.webp" width="480" height="480" aria-label="Our garden: a slow pan across one photo">
      <source src="img/living-garden.mp4" type="video/mp4">
    </video>
    <button class="living__toggle" type="button" data-name="the garden film">…play and pause icons…<span class="visually-hidden">Play the garden film</span></button>
  </span>
  <figcaption>Our garden <small>A slow pan across one photo</small></figcaption>
</figure>
```
- 6 to 10 seconds, under 1.5 MB, no audio track, square 480px for the ring. `waves.js` autoplays it only at 48em and wider without reduced motion; phones get the poster and the button.
- From the nursery's own footage (rooms, garden, food, no identifiable children), or, as in Oban, an **honestly labelled** pan across one real photo. The ffmpeg recipe (5 s forward, reversed, so it loops seamlessly):
  `ffmpeg -i garden.jpg -filter_complex "[0:v]scale=1500:1440,zoompan=z=1.18:d=125:x='(iw-iw/zoom)*on/124':y='(ih-ih/zoom)/2':s=480x480:fps=25,format=yuv420p,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart -map_metadata -1 living-garden.mp4`

**Tour or film** (Gallery page, navy band):
```html
<video controls preload="none" playsinline poster="img/tour-poster.webp" width="640" height="480" aria-describedby="tour-meta">
  <source src="img/tour.mp4" type="video/mp4">
  <track kind="captions" src="img/tour.en.vtt" srclang="en" label="English" default>
</video>
```
- Click to play, nothing downloads until then, captions on by default, a "Read the tour as text" transcript in a `details`, and a meta line (length, sound, captions, size).
- Oban has no film, so its tour is made from the 11 photos with slow zooms and 0.7 s fades (39 s, 2 MB) and says so: "made from still photos, not film". A real walk-through of empty rooms replaces it when the nursery films one (`PHOTO-SHOTLIST.md`). Keep it under 4 MB at 720p or less.

## 10. Gallery page

- Filter buttons (`button.filter[data-filter][aria-pressed]`) show one group at a time; "All" shows every group. Groups: Rooms, Garden, Building, Food, Artwork (drop or add groups to match the photos you have, and keep the filter list in step).
- Each group is a 2-column mosaic on phones, 4 from 48em, with one `li.is-big` photo per group. Each photo is a real `<img>` in an `a[data-lightbox]` pointing at the larger file, with true alt text and a short visible caption.
- The lightbox is one `<dialog id="lightbox">` at the end of the page: Esc and the Close button close it, a backdrop click closes it, and focus returns to the photo.
- Keep its Previous and Next icon buttons (`button.lightbox__step[data-lightbox-step]`, 48px sun circles in a navy strip under the photo on phones, either side of it from 48em) and the "3 of 11" count (`[data-lightbox-count]`, aria-live). Together with the arrow keys and a 40px swipe, they step through the photos the current filter shows and wrap at the ends. The big image is the link's `href` file, and its alt is the thumbnail's alt.
- No slider, no autoplay, no share buttons.

## 11. Pre-handover checklist

Any "no" blocks handover.

**Facts**
- [ ] Every fact traces to the nursery's site, documents, or Care Inspectorate record/report. Disagreements are listed in your report.
- [ ] Grades, exact headings and date match the **latest** report (check the record page, not just our data). All grades shown. Report and record links resolve.
- [ ] Funded status, fees, places, ratios, closures and staff details are as supplied, or say "phone to check".
- [ ] Only real room names. Theme copy says nothing untrue.
- [ ] No identifiable child in any image (checked at full size), metadata stripped, `img/CREDITS.txt` complete.

**Content and design**
- [ ] On a 390×844 phone the first screen shows the name, hero sentence and both actions, and the essentials (ages, hours, funded hours, places, grades with date and link) are within the first 2 screens.
- [ ] Homepage 120 to 180 words in `<main>`, ≤ 6 phone screens, ≤ 6 text blocks (7 on the first), ≤ 3 boxes and ≤ 1 H2 per screen (`scratchpad/tools/density.mjs`). Headings 2 to 5 words.
- [ ] Bands alternate hue; seams rotate style; riders never touch text at 390, 768 or 1280px.
- [ ] No pop-ups, carousels, autoplaying sound, social embeds, map embeds or trackers.
- [ ] Footer review dates set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>` reports **0 blockers, 0 major, 0 minor**.
- [ ] `node pipeline/viewports.mjs <url> <out>` shows no layout flags on every page at all 9 widths.
- [ ] Homepage under about 1 MB on a phone; living photo under 1.5 MB; tour under 4 MB.
- [ ] Live status tested with Playwright's clock (section 8).
- [ ] Keyboard only: skip link, menu (Esc closes), chips, filters, lightbox (Esc returns focus), video controls.
- [ ] `node pipeline/template-thumbs.mjs nursery/make-waves-spacious` after template changes.

## 12. Oban example: sources, and facts to confirm

**Sources:** firststepsoban.co.uk (one long page, last modified 28 January 2026, crawled 13 October 2026); its *Parent's Handbook* PDF (made April 2018); the Care Inspectorate record for CS2003003167 and the inspection report completed 28 July 2026; our prospect data (`n052-05`).

Confirm with the nursery before go-live:
1. **Grades.** The July 2026 report gives Leadership 2 (Weak), Children thrive and develop in quality spaces 4, Children play and learn 3 (the report says "Satisfactory / Adequate"; the site shows "Adequate"), Children are supported to achieve 4. Our prospect data still holds the July 2025 grades (4, 3, 4, 3 under the old headings). Check the publication date and that the nursery is happy with how the inspectors' quotes are presented; ideally add a line in its own words about what it is improving.
2. **Funded hours.** The website says "600 term time hours" (out of date; the entitlement has been 1,140 since 2021) and the 2018 handbook says the nursery is a "partner provider" for 40 children. The example says "Phone us to check how funded hours work at 1st Steps". Confirm funded status with Argyll and Bute's provider list, and whether it takes funded 2 year olds.
3. **Council phone number** 01369 708508 ("pre-school education department") comes from the nursery's site. Confirm it is current.
4. **Fees.** None published. Only the £50 registration fee is shown (website). Ask for a fee table with a "from" date.
5. **Ages.** Website: 9 months to 5 years. Handbook (2018): from 3 months. The example uses 9 months.
6. **Email.** Website: admin@firststepsoban.co.uk. Handbook: manager.firststeps@yahoo.co.uk. Care Inspectorate: a manager's personal address. The example uses the website's.
7. **Opening year.** Handbook: opened in 1999 by Ann Burke, "the first Day Nursery in Oban". Care Inspectorate: registered 1 April 2002; the 2026 report says 1 April 2011. The example says 1999 (handbook). Confirm the "first day nursery in Oban" claim before keeping it.
8. **Room details** (Baby Room conservatory, Tweenie Room wooden toys and its own toilets, ELCC over two playrooms) come from the 2018 handbook. The age limits per room (12, 17, 32) are the Care Inspectorate's registration conditions. The room names are the website's (Baby, Tweenie, ELCC).
9. **Which photo is which room.** Only the conservatory is placed (Baby Room, per the handbook). Other photos are captioned by what they show.
10. **Garden details:** cherry trees, mud kitchen, digging area, sand and water trays (handbook 2018); outdoor shelter and dens (2026 report). Confirm they're all still there. The handbook also mentions growing potatoes and fruit and walks to the woods, harbour and railway pier; these were left out because they may be out of date.
11. **Staff qualifications and first aid** ("qualified … trained in paediatric first aid") come from the 2018 handbook and the website's "qualified and caring nursery practitioners". Ask for current staff names, roles and qualifications to fill the team page.
12. **Depute manager.** The 2026 report mentions a recently appointed depute; the name isn't published.
13. **Closure dates.** "Easter weekend, Christmas and New Year" has no dates. Add them to `closures` once published.
14. **Famly app.** The 2026 report says the nursery records learning in Famly. The nursery's site links a Famly enquiry form; it isn't used in the example (third-party form). Confirm the nursery has a data processing agreement before linking it.
15. **CCTV "day and night"** and the coded gate are from the website ("CCTV in operation 24 hours a day").
16. **Photos** are from the current site, about 500px wide. Ask for the originals (and for food and artwork photos) to fill the empty gallery groups.
17. **Privacy notice.** The site links a privacy policy we couldn't open; the example asks parents to request a copy. Publish it as an HTML page.
