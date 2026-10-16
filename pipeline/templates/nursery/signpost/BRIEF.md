# Signpost: a website template for independent Scottish nurseries

> Pipeline name: **Signpost** (folder `templates/nursery/signpost/`). It is direction 3 of `prospects/research/nursery-spacious-directions.md`: a wayfinding site where **colour means place**. Its siblings there are Open House, Sunny Side and Soft Play.

**The idea in one line:** the homepage is a light, roomy summary whose main picture is a drawn **fingerpost**. Each arrow board on it is a door to an inner page, and each board's colour *becomes* that page: its band, its waymarker rings and its link underlines. Inside each page a numbered **waymarker trail** ("On this page") leads through short sections.

It exists to fix the owner's complaint about our earlier nursery templates: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages."* Every rule in the **space brief** (S1 to S13 of the directions document) is built in and measured (section 11).

Sources behind every decision:
- `prospects/research/nursery-spacious-directions.md`: the space brief (Part 2) and this direction (Part 3, section 3). **Read Part 2 before changing any spacing.**
- `prospects/research/nursery-sites-3/playhouse.md` and `sunflower.md`: the two sites the owner likes.
- `prospects/research/nursery-colourful-directions.md`: shared rules on facts, photos, gallery, video and contrast (its 250 to 350 word homepage budget is **replaced** by S4: 120 to 180).
- `prospects/research/nursery-websites.md` §3.6 (what a nursery may claim), §4 (trust), §5 (photos), §6 (structure). References like **§3.6** point there; **S5** etc. point to the space brief.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `signpost.js` | About 200 lines, no dependencies: phone menu, phone dock, live open/closed status (with closures and early finishes), dated notices, boards that swing once into place, gallery filters, lightbox `<dialog>`, living photo. | Never. It reads its data from the page |
| `fonts/` | **Overpass**, one variable file (weights 400 to 800), subset to Latin and Latin Extended woff2: 26 KB + 31 KB. `fonts/OFL.txt`. No Reserved Font Name, so subsetting is allowed. | Never |
| `example/*.html` | A finished 7-page site for **Kilbarchan Community Nursery**, a real parent-run charity nursery in Kilbarchan, Renfrewshire, built only from its website, its documents and its Care Inspectorate record and report. | Copy for each nursery |
| `example/img/` | 15 cropped real photos (WebP 400 and 800px), a living-photo loop, a still-photo tour with captions, posters and `CREDITS.txt` (sources, crops, exclusions and why). | Each nursery gets its own |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to photograph and film. | No |
| `thumb.jpg` | Picker thumbnail: `node pipeline/template-thumbs.mjs nursery/signpost`. | After changes |

Pages link `../styles.css`, `../signpost.js` and `../fonts/`. **Every page carries its own inline SVG sprite** (only the symbols it uses) right after `<body>`, and draws with `<use href="#id">`. Never point `<use>` at an external file: board previews are sandboxed and draw nothing from `file.svg#id`. Nothing loads from another server: no Google Fonts, CDNs, maps, analytics, social embeds, YouTube or Vimeo (§6.6).

---

## 1. Concept, and what it deliberately avoids

**What the owner's two sites do well, and we keep:**
- **Sunflower:** a calm coloured band at the top of every inner page with an eyebrow, title and one action; intent wording ("What it costs, and help with fees"); "← Back to" links; big empty space around single cards.
- **Playhouse:** room colour coding carried across pages; one repeated action ("Enquire now", here "Book a visit") in a sticky phone bar; "Everything families need" amenities (here as road-sign **info signs**); one thing per row on a phone.

**What they do badly, and we fix:** Playhouse's 12-item menu printed twice on phones, its 137-character lines and grey `#888` text; Sunflower's 13px phone text, 7 different actions, carousel and a 4,682-word For Parents page. Here: a 6-item menu, 60-character lines, 18px ink text at 13.5:1, one action wording, and inner pages capped at about 900 words in sections of 120 words or fewer.

**Devices we must not reuse** (spacious directions, Part 3): luggage tags, cork boards, full-stop headlines, storybook chapters, weather tiles, recipe cards, leaf corners, torn paper, boxed key-fact rows, mascots, highlighted-word headings, clock boxes, dashed day paths, wave seams, ringed circle photos, big-number cards, watercolour blobs, one-word photo tiles, pastel room blocks, arch frames, hi-vis stripes. Signpost's devices are its own: **arrow boards, colour = place, waymarker discs, the fingerpost, info signs and the "Next" board.** The "yellow brick road" is a solid drawn footpath, not a dashed path.

## 2. Research-to-design decisions

| # | Decision | Why |
|---|---|---|
| 1 | **Homepage bones:** Hero → The essentials → "You are here" → Doors ("Where to next?") → "Start here" visit band → footer. Hero plus 4 sections; no menus, grade tables, timelines, FAQs, team lists or reviews on the homepage. | S3: hero plus at most 5, the last being Book a visit; the "never on the homepage" list. |
| 2 | **Hero:** "You are here" kicker, the nursery name as H1, one sentence, "Book a visit" and "Phone". The drawn fingerpost stands at the right edge with 4 coloured boards, a robin on its cap and a real detail of the nursery (Kilbarchan: its Eco-Schools green flag) tied to it. At least 70% of the first phone screen. | S2 hero rule; direction 3 hero. "You are here" starts the wayfinding language that every inner page continues. |
| 3 | **The essentials:** 5 lines on one band, each with a yellow **waymarker disc** icon, hairline dividers, no sub-notes, closed by one "All the details →" link. | S9. A list, not boxes (our earlier 2 by 2 fact grids were the main cause of "cramped"). |
| 4 | **"You are here":** the building front with a "You are here" pin, the address in one line and "Directions →". Kilbarchan has no building photo, so it's a drawn scene (section 5). | Direction 3 item 3. Its handbook calls the footpath "the yellow brick road", which became the heading. |
| 5 | **Doors as arrow boards** stacked on a drawn post on phones (one per row, ≥ 120px tall, 164px apart so **no 844px screen ever holds more than 3**), with a small drawing on the post between boards (bird box, waymark, flag, lantern, thistle and snail). On desktop the post stands in the middle and the boards hang off both sides at slight angles. | S5 (≤ 3 boxes and ≤ 6 text blocks per screen), S6 (one per row), S7 (≥ 24px gaps), S9 doors. The drawings fill the gaps so the space reads as a picture, not emptiness (S12). |
| 6 | **Colour = place.** Six board colours, one per inner page, used for that page's board, menu tab, band, waymarker rings and link underlines, and nowhere else. | Direction 3. A parent learns the system in one tap. |
| 7 | **Inner page frame:** a band in the page colour with "You are here: [page]", H1 ≤ 6 words, intro ≤ 35 words, one action (Phone) and a drawing unique to the page; then the **waymarker trail** (numbered discs, 56px rows); then numbered sections ≤ 120 words; then a **"Next" board** coloured as the next page; then the "Start here" band. | S10. Sunflower's band and in-post contents list. |
| 8 | **Long reference material in `<details>`** (illness, medicines, policies and documents, each with a 2-line summary, its size and date). Tables only for fees, sessions and dates. | S10.3 and S10.6. Playhouse's 34-screen policies page is the anti-pattern. |
| 9 | **One action wording, one colour:** "Book a visit" in Visit red everywhere (header, hero, dock, visit band); the secondary action is always "Phone 01505 704839". Inner page bands use Phone, so no red button ever sits on another board colour. | S13. |
| 10 | **Menu:** 6 items (the doors, in the same order) with colour tabs, plus Book a visit. On phones a full-height sheet, 56px rows, Phone and Book a visit at the bottom. No inline menu under the logo. | S11; §6.1. |
| 11 | **Phone dock** (Book a visit and Phone) appears after the first screen and **hides when the footer comes into view**, so it never covers the end of the page and no bottom padding is needed. `scroll-padding-bottom` keeps focused items above it. | S11 sticky bar rule. |
| 12 | **Overpass** 800 for display and 400 to 700 for text, tabular figures for times and prices. | Direction 3: Overpass descends from the US road-sign face; one family loads light. |
| 13 | **Gallery:** filter buttons drawn as mini arrow boards over a 2-column mosaic with captions; a still-photo tour, "The way in", click to play with captions. No homepage strip: the Gallery board is the door. | Direction 3 video and gallery. |
| 14 | **Grades** on the homepage as one line (summary, date, link to the report). Every grade with its exact heading and date on Our nursery, plus one verbatim line from the report. | S9; §3.2 and §4.1. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, ratio and policy comes from the nursery's site, its documents, or its Care Inspectorate record and report. The §3.6 table is binding. Otherwise write "phone to check" / "Phone us to check for places" / "Ask us about staff ratios when you visit".
2. **Grades:** open the nursery's Care Inspectorate record page (`careinspectorate.scot/find-care/search-for-care/care-services/<CS number>/<slug>`), which shows the latest inspection date and links the report PDF. Copy the exact headings, grades and dates. Show all of them. Our datastore can be out of date; the record page wins.
3. **Ratios:** print only the nursery's own stated ratios (Kilbarchan's handbook states 1 to 8, and 1 to 2 on outings). The Care Inspectorate's conditions of registration are not the nursery's statement.
4. **Closures:** only dates the nursery publishes. Kilbarchan's colour-coded holiday PDF was read by rendering it; check every date against the PDF.
5. **Staff names** only as the nursery publishes them, with the roles it gives. No surname, no name.
6. **Where sources disagree,** use the newest dated source and list the disagreement in your report (section 12 shows how).

### Space (the space brief, measured in section 11)
7. **Homepage:** ≤ 6 phone screens (5,064px at 390 × 844), hero plus ≤ 5 sections, **120 to 180 words in `<main>`** (hard max 200). Hero ≤ 25 words; section body ≤ 30; door label ≤ 3 words plus a line ≤ 8; essentials lines ≤ 8; H1 ≤ 8 words; H2 2 to 5 words.
8. **Per 844px phone screen:** ≤ 1 H2, ≤ 6 text blocks (7 on the first), ≤ 1 primary and 1 secondary action, ≤ 3 boxed elements. Every homepage content section ends with **exactly one** door link (`.go`).
9. **One thing per row on phones** for anything with more than a 3-word label. Two per row only for photo-only gallery tiles and label-only info signs (icon + ≤ 2 words). Never 3. On desktop, at most 3 per row; the doors go 2 by 3.
10. **Inner pages:** ≤ about 900 words, sections ≤ 120 words plus at most one list, table or image; the trail when there are 3 or more sections (≤ 7 items). Past 900 words, split a sub-page and start it with `<a class="backlink" href="parents.html">Back to Parents</a>`.
11. Don't lower `--space-section`, `--gutter`, `--measure`, the board spacing (`.boards__item + .boards__item`) or the 18px body size. They are the fix.

### Photos (§5)
12. **No identifiable children, ever.** Check every photo at full size. Kilbarchan's site has about 55 photos and almost all show faces: only crops of hands, toys, food and empty spaces were used (`img/CREDITS.txt`).
13. Strip metadata, record every source and exclusion in `img/CREDITS.txt`. Fetch WordPress originals by removing the `-225x300` size suffix from the file name, then crop.
14. **The template must look complete with no photos.** The homepage uses none; inner pages drop their `figure.part__media` and the bands, boards and drawings carry them.

### Accessibility (WCAG 2.2 AA)
15. Keep the token pairs in section 7. White text only on board colours and ink; ink text on paper, sand, sky, white and the marker yellow.
16. One `h1` per page. The skip link comes first; the sprite has `aria-hidden="true"`; every drawing is `aria-hidden="true" focusable="false"`.
17. **Arrow boards:** the colour and point are drawn on `::before` with `clip-path`, so the link itself is never clipped and its focus ring (3px ink outline with the GOV.UK yellow halo) draws outside the shape. Never move `clip-path` onto the `<a>`.
18. Tap targets ≥ 44px: rows, buttons, `.go`, footer links, and inline text links in sections (`.part__body a` gets vertical padding).
19. **Motion:** boards swing once (−3° to 0°, 60ms apart) when the doors scroll into view, and nudge 4px on hover or focus. Nothing moves under `prefers-reduced-motion`. The living photo never autoplays on phones or with reduced motion, and always has a play/pause button.

### Performance
20. Homepage under about 1 MB on a phone (Kilbarchan: about 100 KB: HTML 30 KB, CSS 36 KB, JS 9 KB, one font file 26 KB, no photos). Inner-page photos are `loading="lazy"` with `width` and `height`. Living photo under 1.5 MB; tour under 4 MB with `preload="none"`.

## 4. Homepage structure (keep this order)

1. Skip link, sprite, `header.site-header` (`a.brand` with the 40px mark, `button.menu-toggle` with `aria-expanded`, `nav.site-nav#site-nav` holding `ul.nav-list` of 6 links with `tab-*` classes and `.nav-extra` with Book a visit and Phone).
2. `section.hero`: `p.hero__here` ("You are here"), `h1` with the name in three `span`s, `p.hero__lead` (one sentence), `.actions` (`a.btn` Book a visit, `a.phone-link`), then `svg.hero__post` (`#hero-post`) and `.hero__ground`.
3. `section.section.section--white` "The essentials": `.split` with the H2, then `ul.essentials` of 5 `li` each starting with `span.disc` (icons `i-age`, `i-clock`, `i-fees`, `i-chair`, `i-star`), then `p.go-row > a.go` "All the details".
4. `section.section.here-section`: `.here` with `.here__scene` (`#here-scene`, or a real building photo in `.photo`), eyebrow "You are here", H2, one sentence, `a.go` "Directions".
5. `section.section.section--white` "Where to next?": `h2.doors-h`, `ul.boards` of 4 to 6 `li.boards__item`, each an `svg.board-deco` (phones only) and an `a.board.board--{colour}` with `.board__icon`, `.board__label` (≤ 3 words) and `.board__line` (≤ 8 words). The first deco is the robin on the post top.
6. `section.visit-band`: `h2.start-board` "Start here" (a drawn red board on a post), one sentence, Book a visit and Phone.
7. `footer.site-footer`, `.dock`, `script#nursery-schedule`, `signpost.js`.

## 5. Drawings (the sprite)

All drawings are flat signage shapes with 2px ink (`#1F2A2E`) details, rounded joins and the palette's own fills. **No people, faces or figures.** Animals, plants, objects, weather and buildings only.

| Symbol | Where | Notes |
|---|---|---|
| `mark` | header, footer | Mini fingerpost, two boards. Never paste a raster logo; redraw the nursery's idea in this style if it has one. |
| `i-visit`, `i-fees`, `i-nursery`, `i-team`, `i-parents`, `i-gallery`, `i-food` | board icons | One per page. 24px grid, 2px `currentColor` lines. The key for Our team stands for key workers. |
| `i-age`, `i-clock`, `i-chair`, `i-star`, `i-pin`, `i-post`, `i-phone`, `i-mail`, `i-play`, `i-pause` | essentials, eyebrows, actions | Same grid. |
| `i-garden`, `i-quiet`, `i-family`, `i-ball`, `i-lock`, `i-kitchen` | info signs | Use only for amenities that really exist. |
| `hero-post` (260 × 470) | hero | Post, cap, robin, 4 boards (Visit, Fees, Our nursery, Team colours with their pictograms and bars for "text"), a local detail tied on, grass and a thistle. Recolour boards only through their fills. |
| `hero-ground` | hero foot | Two grass hills, stretches to any width. |
| `deco-robin`, `deco-birdbox`, `deco-waymark`, `deco-flag`, `deco-lantern`, `deco-thistle` | between doors on phones | 128 × 112, sit beside the post. Swap one for a true local detail (Kilbarchan's green flag is real: 8 Eco-Schools Green Flags). |
| `here-scene` (400 × 250) | "You are here" | Illustrative, **not a map**: a one-storey building, the school behind, a yellow footpath, the street sign, a "Staff only" car park sign, a red pin. Change the street name, the door colour and any detail you can see in the nursery's photos. Don't invent a layout you can't see. |
| `art-join`, `art-fees`, `art-nursery`, `art-team`, `art-parents`, `art-gallery` (240 × 200) | page bands | A front door with wellies; a coin jar; the garden boat (Kilbarchan really has one) with a sapling; coat pegs with a coat, bag, key and scarf; a calendar with sun, cloud and an envelope; a framed child-style picture with a camera. Redraw `art-nursery` with the nursery's own garden feature. |
| `post-stub` | spare | A plain post, for sub-page bands. |

Nested `<use>` inside a symbol must have `width="24" height="24"`, or it renders at full size.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.wrap`, `.section` (+ `--sand`, `--white`), `.split`, `.measure`, `.eyebrow`, `.go`, `.go-row` | Layout, rhythm and the single door link that ends a section. |
| `.btn` (+ `--light`, `--outline`), `.phone-link`, `.actions` | Book a visit (always `.btn`, Visit red), Phone, and the outline Phone button on page bands. |
| `.site-header`, `.brand`, `.menu-toggle`, `.site-nav`, `.nav-list`, `.tab-*`, `.nav-extra` | Header and menu. |
| `.hero`, `.hero__here`, `.hero__lead`, `.hero__post`, `.hero__ground` | Homepage hero. |
| `.essentials`, `.disc` (+ `--ring`) | The essentials list and waymarker discs. On inner pages discs get a ring in the page colour. |
| `.here`, `.here__scene`, `.here-section` | "You are here". On phones the scene sits flush at the top of its section. |
| `.boards`, `.boards__item`, `.board-deco`, `.board`, `.board--visit/fees/nursery/team/parents/gallery`, `.board__icon/__text/__label/__line` | Arrow boards on the post (the doors). |
| `.next`, `.next__kicker` | "Next" board at the foot of an inner page. |
| `.visit-band`, `.start-board` | "Start here" band. |
| `.page-band`, `.page-band__grid`, `.page-band__intro`, `.page-band__art`, `.backlink` | Inner page band (colour from `body.page--*`). |
| `.trail` | "On this page" waymarker trail. |
| `.part`, `.part__head`, `.part__body`, `.part__media` | Numbered inner sections. |
| `.photo`, `figure figcaption`, `.table-wrap`, `table`, `.num`, `.tabular` | Photos and tables (tabular figures). |
| `.folds` + `details` / `summary`, `.doc-meta` | Accordions for reference material and documents. |
| `.signs`, `.sign` | Road-sign info squares ("What's here"): icon + ≤ 2 words, 2 per row on phones, at most 3 per group so a screen holds ≤ 3 boxes. |
| `.grades`, `.grades__score` | Inspection grades (exact headings). |
| `.people`, `.person`, `.person__badge` | Staff with initials, or a consented photo in place of the badge. |
| `.ticks`, `.quote`, `.small`, `.notice[data-show-from][data-show-until]` | Lists, a verbatim quote, small print, dated notices (closures only). |
| `.status[data-status]` + `[data-status-text]` | Live status (section 8). |
| `.living`, `.living__toggle`, `.tour`, `.tour__meta` | Video (section 9). |
| `.filters`, `.filter`, `.mosaic-group[data-group]`, `.mosaic`, `li.is-big`, `.lightbox` | Gallery (section 10). |
| `.site-footer`, `.footer__*`, `.dock` | Footer and phone dock. |

## 7. Tokens and contrast (section 1 of `styles.css`)

All ratios computed with the WCAG relative-luminance formula.

| Token | Kilbarchan | Pairs |
|---|---|---|
| `--paper` | `#F7F5EF` | ink 13.5:1; muted 6.4:1 |
| `--paper-2` (sand) | `#EFE8DA` | ink 12.1:1; muted 5.8:1 |
| `--sky` | `#E3EEEC` | ink 12.4:1 |
| `--ink` | `#1F2A2E` | all body text; white on it 14.7:1 |
| `--muted` | `#4F5B60` | small print only; 7.0:1 on white |
| `--marker` | `#F2C14E` | ink on it 8.8:1 (waymarker discs) |
| `--visit` | `#B8432A` | white 5.4:1; on paper 5.0:1. **The primary action colour** |
| `--visit-deep` | `#96331E` | hover; white 7.5:1 |
| `--fees` | `#1D6E8C` | white 5.7:1 |
| `--nursery` | `#2E7D4F` | white 5.1:1 |
| `--team` | `#6E4790` | white 7.1:1 |
| `--parents` | `#A8355F` | white 6.3:1 |
| `--gallery` | `#A35A14` | white 5.2:1 |
| `--wood`, `--wood-dark`, `--wood-light`, `--grass`, `--grass-deep`, `--leaf`, `--brick`, `--robin` | | decorative only, never carry text |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. Never change |
| `--font` | Overpass | keep |
| `--text-base` | 18px, 19px from 64em, 20px from 80em | never below 17px |
| `--gutter` | 24px, 40px from 37.5em, 64px from 64em | S1 |
| `--space-section` | `clamp(5rem, 3.6rem + 5.6vw, 8rem)` | S2: 80px phone, 128px at 1280 |
| `--measure` | 60ch | S8 |
| `--container`, `--tap`, `--board-tip` | 1120px, 48px, 28px | |

Board colours on paper as *text*: Visit 5.0, Fees 5.3, Team 6.5, Parents 5.8, Gallery 4.8, Our nursery 4.6:1. Links are ink text with a page-colour underline, so link text itself is always 13.5:1.

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../signpost.js` and `../fonts/` still resolve.
2. Crawl the site (`node pipeline/crawl.mjs <url> <out>`), extract its PDFs (`pdftotext -layout`; render colour-coded calendars with `pdftoppm -r 150`), and **open the Care Inspectorate record and latest report**.
3. **Palette:** keep the six-colour system. If the nursery has strong brand colours, swap the board colours for its nearest hues, keeping white text ≥ 4.5:1 and making sure no two boards are confusable. Visit stays the warmest, strongest colour, because it is the primary action.
4. **Mark and drawings:** redraw the mark, the local detail on the hero post, one board deco and `art-nursery` from the nursery's own world (its garden feature, its street, its town). Redraw `here-scene` from a photo of the building if you have one; otherwise keep it generic.
5. **Copy:** replace every Kilbarchan fact on every page. Afterwards `grep -n "Kilbarchan\|01505\|PA10\|Meadside\|Renfrewshire\|SC009757\|CS2015337344\|Sugarsnap\|Orr" *.html` must return nothing from Kilbarchan.
6. Rewrite `#nursery-schedule`, the dated notice, `<title>`, meta description, the footer review dates (today, and today plus 6 months).
7. Photos and video (section 9, `PHOTO-SHOTLIST.md`), `img/CREDITS.txt`.
8. Measure (section 11) and run the checklist.

## 8. The schedule (`#nursery-schedule`)

On every page, before `signpost.js`:

```json
{ "timeZone": "Europe/London", "closingSoonMinutes": 30,
  "days": { "mon": [["08:00","18:00"]], "tue": [["08:00","18:00"]], "wed": [["08:00","18:00"]],
            "thu": [["08:00","18:00"]], "fri": [["08:00","18:00"]], "sat": [], "sun": [] },
  "closures":   [ { "from": "2026-12-23", "to": "2027-01-05", "label": "Christmas and New Year" } ],
  "earlyClose": [ { "from": "2026-12-22", "to": "2026-12-22", "at": "14:30" } ] }
```

- `closures`: whole days, inclusive, **only published dates**. Labels read after "Closed for …".
- `earlyClose`: days that end early (Kilbarchan: 22 December and 2 April at 2:30pm; 30 June at midday).
- Wording: "Open now, until 6pm"; "Open now. Closing soon, at 6pm"; "Closed now. Opens tomorrow at 8am"; "Closed for the October holiday. Opens on Tuesday 20 October at 8am".
- The no-JS text inside `[data-status-text]` must be true at any time ("Open 8am to 6pm, Monday to Friday, in term time").
- **Dated notice:** `<div class="notice" data-show-from="YYYY-MM-DD" data-show-until="YYYY-MM-DD" hidden role="note">`. Closures, snow and deadlines only. Kilbarchan's Parents page has one for the 22 December early finish.
- Test with Playwright's clock (`page.clock.setFixedTime`): a weekday at 7:50am, 10am, 5:40pm and 6:10pm, a Friday evening, a Saturday, a day inside each closure and each early-close day.

## 9. Video: the two components

**Living photo** (Our nursery, "Outdoors"):
```html
<figure class="part__media living">
  <video muted loop playsinline preload="none" poster="img/living-garden-poster.webp" width="640" height="360" aria-label="Our garden after snow: a slow pan across one photo">
    <source src="img/living-garden.mp4" type="video/mp4">
  </video>
  <button class="living__toggle" type="button" data-name="the garden film">…#i-play and #i-pause… <span class="visually-hidden">Play the garden film</span></button>
</figure>
<p class="small">Our garden after snow. A slow pan across one photo, not a film.</p>
```
- 6 to 10 seconds, under 1.5 MB, no audio, 16:9. `signpost.js` autoplays it only at 48em and wider without reduced motion; phones get the poster and the button.
- From the nursery's own footage (no identifiable children), or, as for Kilbarchan, an **honestly labelled** pan across one real photo. Recipe (4.5 s across, reversed, 9 s loop, 215 KB):
  `ffmpeg -loop 1 -t 4.5 -framerate 25 -i garden.png -filter_complex "[0:v]crop=w=iw*0.686:h=ih:x='(iw-ow)*t/4.5':y=0,scale=640:360,format=yuv420p,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 27 -preset slow -movflags +faststart -map_metadata -1 living-garden.mp4`

**Tour, "The way in"** (Gallery):
```html
<video controls preload="none" playsinline poster="img/tour-poster.webp" width="640" height="360" aria-describedby="tour-meta">
  <source src="img/tour.mp4" type="video/mp4">
  <track kind="captions" src="img/tour.en.vtt" srclang="en" label="English" default>
</video>
```
- Click to play, nothing downloads until then, captions on by default, "Read the tour as text" in a `details`, and a meta line (length, sound, captions, size).
- Kilbarchan's tour is made from 12 still crops with slow zooms and 0.6 s fades (35 s, 1.3 MB) and says "Made from 12 still photos, not film". Kilbarchan has a real 2021 tour film on YouTube; it was not used (third-party embed, unchecked for children, rights unknown). Ask for the file and replace `tour.mp4`, keeping it under 4 MB at 720p or less. Ideal: a walk from the gate to the empty rooms (`PHOTO-SHOTLIST.md`).

## 10. Gallery page

- Filter buttons (`button.filter[data-filter][aria-pressed]`) are mini arrow boards; one group at a time, "All" shows every group. Kilbarchan groups: Rooms, Garden, Play, Food, Art. Keep the filter list in step with the groups you have.
- Each group is a 2-column mosaic on phones (12px gaps) and 3 columns from 48em (16px), with one `li.is-big` per group. Each photo is a real `<img>` (WebP 400 and 800) in an `a[data-lightbox]` pointing at the larger file, with true alt text and a short caption.
- The lightbox is one `<dialog id="lightbox">` at the end of the page: Esc, the Close button and a backdrop click close it; focus returns to the photo.
- A short "About these photos" section says why there are no faces. No slider, autoplay or share buttons.

## 11. Measured results (Kilbarchan example)

Measured with `scratchpad/tools/density.mjs` (390 × 844, per 844px screen) and Playwright, 14 October 2026.

| Check | Space brief | Kilbarchan |
|---|---|---|
| Homepage phone length | ≤ 6 screens (≈ 5,064px) | **5,061px, 6 screens** |
| Words in homepage `<main>` | 120 to 180 (max 200) | **167** |
| Homepage text blocks per screen | ≤ 6 (first ≤ 7) | **5, 6, 6** on the first three; average 5.7 |
| Homepage boxes per screen | ≤ 3 | **3** on the first screen, 0 to 1 after; average 0.8. Doors are spaced 164px apart so no screen holds more than 3 boards. |
| Hero height | ≥ 70% of first screen | 591px of 844 (70%) below a 69px header |
| H2 per screen | ≤ 1 | 1 |
| Items per row on phone | 1 (2 for photo-only or label-only) | 1 everywhere; 2 for gallery photos and info signs |
| Side gutters | 24 / 40 / ≥ 64px | 24 / 40 / 64px |
| Section padding | ≥ 80px phone, ≥ 128px at 1280 | 80px / 128px |
| Line length | ≤ 60ch | ≤ 60ch |
| Inner page words in `<main>` | ≤ about 900 | Visit and join 505, Fees 346, Our nursery 510, Team 331, Parents 462, Gallery 216 |
| Inner section body | ≤ 120 words | longest 103 (Find us), tables and folds excluded |
| Audit (`pipeline/audit.mjs`) | 0 / 0 / 0 | **0 blockers, 0 major, 0 minor** (7 pages, 266 links) |
| `viewports.mjs`, 9 widths, every page | no flags | **no layout flags** on all 7 pages |
| Homepage weight on a phone | < 1 MB | about 100 KB (no photos) |

Inner pages go above 6 text blocks on some screens (the "On this page" trail, the team list, gallery captions). S5 is written for the homepage; inner pages follow S10. Keep each section short and one thing per row.

## 12. Pre-handover checklist

Any "no" blocks handover.

**Facts**
- [ ] Every fact traces to the nursery's site, documents, or Care Inspectorate record/report. Disagreements are listed in your report.
- [ ] Grades, exact headings and date match the **latest** report (record page checked). All grades shown. Report and record links resolve.
- [ ] Funded status, fees, places, ratios, closures and staff are as supplied, or say "phone to check".
- [ ] No identifiable child in any image (checked at full size); metadata stripped; `img/CREDITS.txt` complete.
- [ ] Every drawing that claims a local fact (the flag, the boat, the street sign) is true for this nursery.

**Space**
- [ ] Density script on the homepage: ≤ 6 screens, ≤ 6 text blocks (7 first), ≤ 3 boxes and ≤ 1 H2 per screen.
- [ ] Homepage `<main>` 120 to 180 words; every content section ends with one door link.
- [ ] Inner pages ≤ ~900 words, sections ≤ 120 words, trail present when ≥ 3 sections, "Next" board present.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>`: **0 blockers, 0 major, 0 minor**.
- [ ] `node pipeline/viewports.mjs <url> <out>` on every page: no flags at all 9 widths.
- [ ] Looked at 390, 768 and 1280px screenshots: no board touching text, no drawing over a button.
- [ ] The example renders on the board (`http://localhost:4391/templates/<folder>/example/`), drawings included.
- [ ] Live status tested with Playwright's clock (section 8).
- [ ] Keyboard only: skip link, menu (Esc closes), boards (focus ring outside the arrow), trail, folds, filters, lightbox (Esc returns focus), video controls.
- [ ] `node pipeline/template-thumbs.mjs nursery/signpost` after template changes.

## 13. Kilbarchan example: sources, and facts to confirm

**Sources:** kilbarchancn.com (crawled 14 October 2026); its documents: Parent's Handbook (2021), holiday list 2026/27 (uploaded October 2026, "correct as of March 2026"), Standards and Quality Report (June 2026), Improvement Plan 2026/27, Duty of Candour report (September 2026), signed accounts (July 2025), Renfrewshire general admissions guidance (2021); the Care Inspectorate record for CS2015337344 and its inspection report completed 14 October 2022; our prospect data (`n037-01`).

Confirm with the nursery before go-live:
1. **Grades.** Latest inspection 10 to 12 October 2022 (report completed 14 October 2022, old framework headings): care, play and learning 5; setting 5; leadership 4; staff team 5. That is four years old; check no newer report is due or published.
2. **Holiday dates.** Read from the colour-coded 2026/27 PDF (yellow = children on holiday, blue = in-service). Check that "children on holiday" means the nursery and its clubs are closed, and the summer return date in August 2027.
3. **Hours.** 8am to 6pm, Monday to Friday, 38 weeks a year (handbook, contact page). Confirm the after-school and late sessions run every term-time day.
4. **Ages.** Care Inspectorate: 3 years to school age (plus up to 30 primary school children in out-of-school care). The site says applications are taken after the 2nd birthday, starting the month after the 3rd. Confirm.
5. **Places:** none published; the example says "phone us to check". Registered for 56.
6. **Fees.** Extra hours £6.50; breakfast club £4.50 an hour plus 50p; snack donation 50p a half-day (website, undated). After-school prices aren't published. Ask for a dated fee list. Confirm whether Tax-Free Childcare is accepted (the example only says "Ask us").
7. **How to apply.** The site offers a 2020 Word application form; the 2021 council guidance says apply online through Renfrewshire Council. The example says "phone us to check which to use this year".
8. **Staff.** Names and roles from the June 2026 report: Victoria Orr (Head of Nursery; also the Care Inspectorate's named manager), Amy Grimason, Sophie Paterson, Rebecca Hamilton, "Stepanie" Meikle (printed in the example as **Stephanie**; check the spelling), Siobhan Kincaid. Chloe and Elaine are named without surnames and were left out. The 2021 handbook signs off as "Mairi, Nursery Manager", now out of date. Ask for consented photos and roles for everyone.
9. **SSSC and Living Wage.** From logos on the current site ("Our staff are registered with the SSSC", "We are a Living Wage Employer"). Confirm both are current.
10. **Ratios** 1 to 8, and 1 to 2 on outings: the 2021 handbook. Confirm.
11. **Forest Kindergarten trips, P6 buddies, transition visits, nut-free policy, 4-week menu by email, Sugarsnap Caterers:** handbook (2021) and website. Confirm they still run.
12. **The garden boat, mud kitchen, raised beds and rainwater catchers** are from 2020-21 photos. Confirm they're still there (the boat is drawn on the Our nursery band).
13. **"The yellow brick road"** footpath, the staff car park rule and the one-way system (Shuttle Street, Meadside Avenue, Wheatlands Farm Road): 2021 handbook. Confirm they're current. The drawn building and path are illustrative, not the real building.
14. **Address.** The handbook says 51 Meadside Avenue; the website and Care Inspectorate give no number. The example uses no number.
15. **Funded provider since 1999**, partnership renewed from August 2021 (website). Confirm the current contract with Renfrewshire Council.
16. **Eco-Schools:** the June 2026 report says the 8th Green Flag; the site's logo says "Green Flag award holder since 2011". The example says 8.
17. **Fundraising** "just over £6,500" last session (June 2026 report).
18. **Video.** The 2021 YouTube tour wasn't used. Ask for the original file, checked for children.
19. **Photos** are 2020-21 phone shots with almost every child's face cropped out. Ask for new photos (`PHOTO-SHOTLIST.md`), especially the building front for "You are here".
20. **Facebook:** the site links a parents' group page that returned an error to our checker; the example mentions the group without linking it.
21. **Privacy notice** is a 2021 PDF. Ask for an HTML version that covers the website and enquiries, and add an accessibility statement.
