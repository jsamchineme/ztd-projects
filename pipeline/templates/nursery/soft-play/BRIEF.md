# Soft Play: a spacious website template for Scottish nurseries

> Pipeline name: **Soft Play** (folder `templates/nursery/soft-play/`). It is the fourth of the "spacious" nursery directions in `prospects/research/nursery-spacious-directions.md` (Part 3, section 4). It obeys the **space brief** in Part 2 of that document (S1 to S13) exactly. Read that document once before your first build. Section numbers like **§5.2** point into `prospects/research/nursery-websites.md`; **S5** means space-brief rule 5.

**The idea in one line:** the nursery's website looks and feels like a room of padded foam play equipment. Chunky wedges, rolls, cubes, steps, half-moons and balls in bright soft-play colours sit on a calm off-white floor, with very few words in very big type. Buttons are foam blocks that squish when pressed. The five key facts climb a foam staircase. Every inner page has its own foam shape and colour, used for its door, its page band and its bullets.

It is the most playful of the four spacious directions, and still airy, because each shape sits alone on its own row. There is **no character or mascot** (that's Sidekick): the fun comes from shape, colour and touch.

**Best for:** town and city nurseries with indoor play spaces (a soft-play room, sensory room, big hall), newer purpose-built nurseries, toddler-heavy settings and younger families, and nurseries with few outdoor photos. It works with zero photos.

---

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `softplay.js` | About 170 lines of plain JavaScript, no dependencies: phone menu sheet, sticky phone bar, living photo, dated notices, live open/closed status, gallery filters and the staircase entrance. Reads everything from the page. | Never |
| `foam-sprite.svg` | The source of every reusable drawing as `<symbol>`s: 6 foam shapes, the brand mark, staircase icons, room icons and "What's here" signs. **Paste its `<svg>` inline straight after `<body>` on every page** and draw with `<svg><use href="#id"/></svg>`. | Add symbols if needed |
| `fonts/` | Bagel Fat One (display) and Albert Sans (variable, body), latin and latin-ext woff2 subsets, 82 KB in all. SIL OFL in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to photograph. | Never |
| `example/` | The worked example, **Leaps and Bounds Nursery, Paisley**: `index.html`, `join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html`, `gallery.html`. | Copy for each nursery |
| `example/img/` | 10 real photos of the nursery's empty rooms and garden (WebP 400/800/1200 + JPEG), and `CREDITS.txt` (sources, blurring, exclusions). | Each nursery gets its own |
| `example/media/` | Living photo loop (154 KB, 30fps) and poster, photo tour film (1.3 MB, 30fps), poster and WebVTT captions. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail. Regenerate with `node pipeline/template-thumbs.mjs nursery/soft-play`. | After changes |

Pages link `../styles.css` and `../softplay.js`; fonts load from `../fonts/` through the stylesheet. No build step, no framework, nothing from another server: no Google Fonts, CDNs, analytics, maps or social embeds (GDPR, §6.6).

**Sandboxed previews:** board previews (`/templates/…`, `/preview/<card>/`) are sandboxed. `<use href="foam-sprite.svg#id">` draws nothing there, so the sprite is **inline** in every page. Every `<video>` that has a `<track>` must carry `crossorigin="anonymous"`, or its captions load nothing in the sandboxed preview. (Fonts and caption files load in previews because the board server sends a CORS header; if fonts look like fallbacks on the board, restart the board server.)

---

## 1. Concept, and what it avoids

The owner's complaint about our first 11 nursery templates: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages."* Soft Play is built around that:

- **Few things per screen.** Each 844px phone screen holds at most one H2, six text blocks and three boxed elements (S5). The homepage is 172 words.
- **One thing per row on a phone.** The staircase bars, the doors and the play-room photo each take a whole row.
- **Real doors to detail.** Six foam-shape doors lead to inner pages; every inner page opens with the same band, an "On this page" list, short sections and a "Next" door.
- **Fun through shape, colour and touch,** not through characters, slogans or clip art: a drawn foam scene, chunky photo frames like foam mat edges, a beach ball that bounces gently on the visit card, and buttons that squish.

It deliberately avoids every signature device of our earlier templates (luggage tags, cork boards, full-stop headlines, storybook chapters, weather tiles, recipe cards, leaf corners, torn paper, boxed key-fact rows, a posing mascot, highlighted-word headings, clock boxes, dashed day paths, wave seams, ringed circle photos, big-number cards, watercolour, one-word photo tiles, pastel room blocks, arch frames, hi-vis stripes).

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | Hero = drawn foam scene, the nursery name in four foam colours, an H1 of up to 6 words, one sentence, Book a visit and Phone. Nothing else. | S2: the hero may hold only the name, an H1, one sentence and 2 actions. Playhouse's best image is its empty soft-play room: "fun" with no child in view. |
| 2 | **Foam staircase** for the essentials: one `<ol>`, five lines (ages, hours, funded hours, places, grades), each up to 8 words with a small icon. On a phone five full-width bars stepping in 12px; on desktop five steps rising left to right. | S9: the essentials are a single list, not boxes, within the first 2 phone screens. The bars are drawn with `::before`, so each row stays a list line, not a box (S5 counts boxes). |
| 3 | Grades line links to the Care Inspectorate record; every quality theme, with its date, is on Visit and join. | S9; §3.2; §4.1 (every grade, the date and a link; never only the best). |
| 4 | **One play-room photo**, full row, 4:5 on a phone, with a chunky foam-mat frame; a living photo on wide screens. | S12: 35% of the phone homepage is picture or colour field; one full-width picture every 2 screens. Playhouse feels open because photos fill rows. |
| 5 | **Six foam-shape doors** (step, wedge, cylinder, half-moon, cube, ball), one per row on a phone with hairlines drawn as backgrounds, 3 by 2 on desktop. Label ≤3 words in Bagel, one line ≤8 words with intent wording. | S6, S7, S9; Sunflower's intent wording ("What it costs, and help with fees", "Come and see us"). |
| 6 | **Book a visit band**: deep pool blue with generous padding, one centred white card with a gently bouncing beach ball on its edge, one button and Phone, and a pile of foam at its foot. | S13 one primary action; Sunflower's single-card visit band; Ball-pit edging removed on the owner's feedback (too busy). |
| 7 | **"Book a visit"** in tomato-deep everywhere; Phone is always a plain text link with a handset icon. | S13. Playhouse's repeated "Enquire now" is the model. |
| 8 | Inner pages: page band (eyebrow with Home, H1 ≤6 words, intro ≤35 words, one action, the page's foam shape large in its colour), "On this page" with foam-cube bullets, sections of ≤120 words, `<details>` for reference, a **Next** door, the visit band. | S10. Sunflower's calm band on every inner page; Playhouse's room colour coding. |
| 9 | Menu of 6 items plus Book a visit; on phones a full-height sheet, one 56px link per row with the page's foam shape, Phone and Book a visit at the bottom. | S11; §6.1. Playhouse's 12 flat items shown twice is the anti-pattern. |
| 10 | Sticky phone bar (Book a visit, Phone) only after the hero, hidden while the visit band or footer is on screen; the body is padded by its height. | S11: allowed if it never covers content or focus. |
| 11 | Body text 18px on a phone, 20px on desktop, line height 1.6, 60ch measure, ink at 16:1; Bagel only for H1, H2 and door labels, never more than 5 words. | S8; §6.5. Playhouse's 14px grey and Sunflower's 13px read as busy. |
| 12 | Rooms on Our nursery each get a colour and a drawn line icon (rattle, duck, rocket, watering can). Only the room names the nursery uses. | Playhouse's room identity (bunny, owl, tepee), made our own. |
| 13 | Links are ink with a 2px tomato underline, never coloured text. | Tomato-deep text is only 4.1:1 on the pale bands; ink passes everywhere. |

## 3. Rules (non-negotiable)

### Facts
- **Never invent facts.** No made-up prices, places, grades, days, menus, ratios, staff, policies, awards or reviews. Write "phone to check" or "Ask us …" where a fact is unclear (§3.6 table).
- Grades: the latest report's themes, grade words and dates exactly as published, plus a link to the nursery's Care Inspectorate record (`ciUrl` in our data). Never estimate a grade.
- Funded hours: "1,140 funded hours, with [council]" only if the nursery says it is a funded provider; otherwise "Phone to check funded hours". Link to the council's own apply page.
- Quotes only from the nursery's own site, attributed as it does ("A parent, on our website"). Never edit a quote except to drop a child's name (or don't use it).

### Photos (§5.2)
- Empty rooms, the garden, food, artwork, hands and backs only. **No identifiable child, ever.** Check background walls for pinned photos and blur them (feathered) or exclude the photo.
- No stock or AI-generated people. Drawings are hand-coded SVG: foam, toys, animals, objects. **No people, faces or figures.**
- Strip metadata; record every source and every exclusion in `img/CREDITS.txt`.

### Space (S1 to S13): the gates
- Phone gutters 24px, tablet 40px, desktop ≥64px with a 1,120px container (`--gutter`, `--container`).
- Section padding `--space-section` (80px phone, 128px desktop) on every homepage section and every inner section.
- Homepage: hero + 4 sections max (essentials, play room, doors, visit band), ≤6 phone screens, **120 to 180 words in `<main>`** (hard max 200), at most 1 H2, 6 text blocks (7 on the first screen) and 3 boxes per 844px screen.
- **Never on the homepage:** menus, the full grade table, the day, settling-in steps, FAQs, policies, team lists, review walls, newsletter forms, logo walls, curriculum essays.
- Every homepage content section ends with exactly one door link.
- Inner pages: ≤900 visible words, sections ≤120 words.

### Accessibility (WCAG 2.2 AA)
- `audit.mjs` must report 0 blockers, 0 major, 0 minor on every page; `viewports.mjs` must show no layout flags at all 9 widths.
- Targets ≥44px (links in lists and `<details>` are `inline-flex` at 44px for this reason).
- Focus: 3px ink outline; links get the GOV.UK yellow; foam buttons turn yellow with an ink edge.
- Every animation is off under `prefers-reduced-motion`; the living photo never plays then.

### Performance
- Homepage on a phone: **187 KB** transferred in the example (fonts, CSS, JS, one poster). The living photo loads only on wide screens; the tour film is `preload="none"`.
- Self-hosted fonts only. No third-party requests.

## 4. Homepage structure (keep this order)

> Hero → The essentials → The play room → Doors → Book a visit band → Footer

| Section | Content | Budget |
|---|---|---|
| Hero (`.hero`, `data-bar-after`) | `.hero__scene` (inline foam scene SVG on a sky-and-sun field), `.hero__name` (4 coloured words), H1, `.hero__sentence`, `.actions` (Book a visit + Phone) | H1 ≤6 words, sentence ≤25 words |
| The essentials | H2, `ol.stairs` with 5 `<li>` (icon + text), one `.more` "All the details →" | each line ≤8 words, no sub-notes |
| The play room (`.playroom`) | `figure.frame.living` (video with poster), H2, one `.lede`, one door link | body ≤30 words |
| Doors (`.doors-section`) | `.tumble` (3 small foam shapes), H2, `ul.doors` with 6 `a.door.door--{shape}` | label ≤3 words, line ≤8 words |
| Visit band (`.visit`, `data-bar-hide`) | `.visit__card` with a bouncing beach ball (`foam-ball-body` over a still shadow), H2, one line, Book a visit + Phone, `.visit__pile` | ≤20 words |

The H2s are placed so each falls on its own 844px phone screen. If you change copy length, re-run the density check and adjust (the `.tumble` drawing above the doors heading and the 4:5 photo exist partly to keep the doors H2 on its own screen).

## 5. Responsive layout

| Width | What changes |
|---|---|
| < 600px | 24px gutters. Scene full bleed above the words. Staircase bars stepping in 12px. Play photo 4:5. Doors one per row (shape 104px left, label right). Sticky phone bar after the hero. Tables stack to label/value rows. |
| 600 to 899px | 40px gutters. Play photo 3:2. Doors 2 per row from 760px (labels only change size). |
| ≥ 900px | Hero in two columns (words left, the scene on a rounded sky panel right). Staircase becomes 5 rising steps. Play room photo and words side by side. Page bands in two columns with the foam shape right. Gallery 3 columns. |
| ≥ 1024px | Desktop nav replaces the Menu button; phone bar off. Doors 3 by 2 with a tinted hover. |
| ≥ 1248px | 64px gutters; container 1,120px. |

## 6. Components (all in `styles.css`)

- **Foam-block button** `.btn` (tomato-deep, 18px radius, 6px darker bottom edge; squishes 3px on `:active`; yellow with an ink edge on focus). `.btn--small` for the header and phone bar; `.btn--sun` exists for yellow ground only.
- **Phone link** `.phone-link`: `<a class="phone-link" href="tel:+44…"><svg><use href="#i-phone"/></svg>Phone 0141 …</a>`.
- **Arrow link** `.arrow-link` with `#i-arrow`: every "More about … →" door link.
- **Foam staircase** `ol.stairs[role=list] > li` (`<svg><use href="#i-ages|i-clock|i-coin|i-chair|i-star"/></svg><span>…</span>`). Colours come from `:nth-child`; don't add a 6th line.
- **Foam-shape door** `a.door.door--step|wedge|cylinder|halfmoon|cube|ball` > `svg > use#foam-*` + `.door__label` + `.door__line`. The whole row is the link. The shape colours come from `--foam`, `--foam-hi`, `--foam-lo` set by the `door--*` class.
- **Page colours:** Visit and join = step, tomato; Fees and funding = wedge, sun; Our nursery = cylinder, grass; Our team = half-moon, grape; Parents = cube, pool; Gallery = beach ball. Set `body.page--visit|fees|nursery|team|parents|gallery`; it sets the band tint and the foam colours for the band shape, the "On this page" bullets, `<details>` markers and quote bars. **Keep the same shape and colour per page across the menu sheet, doors, band and Next door.**
- **Visit ball** `svg.visit__shape`: the `foam-ball-body` symbol in `g.visit__ball` over `ellipse.visit__shadow`. The ball bounces about 9px and the shadow shrinks as it rises (2.4s loop, off under reduced motion). The ball-pit rows along the visit band and footer were removed on the owner's feedback that they were too much.
- **Chunky photo frame** `.frame` + `.frame--pool|grass|tomato|grape`: the 6px border is on the `<img>`/`<video>` itself.
- **Page band** `.page-band` + `.page-band__shape` + `.eyebrow` (Home / Section) + H1 + `.page-band__intro` + one action.
- **On this page** `nav.on-this-page > h2 + ol > li > a` (only when the page has 3+ sections).
- **Inner section** `section.inner-section#id > .wrap > h2 + …`.
- **Facts list** `ul.facts[role=list] > li > b + value` (contacts, sessions). **Grades list** `ul.grades` with `.pips` (6 pips, n filled). **Table** `.table.table--stack` with `data-label` on each `td`.
- **Rooms** `ul.rooms > li.room.room--baby|toddler|pre|garden` with `#room-rattle|duck|rocket|can`. Pick icons that fit the nursery's real room names; add symbols if needed.
- **People** `ul.people > li.person.door--{shape}` with a foam shape instead of a photo. With consented staff photos, replace the svg with a framed `<img>` (`.frame`).
- **"What's here" signs** `ul.signs > li` with `#sign-areas|floors|garden|heart|sessions` and up to 4 words. **Real amenities only.**
- **Quote** `blockquote.quote > p + footer`.
- **Next door** `.next > a.door` with `.next__eyebrow` "Next".
- **Dated notice** `<div class="notice" data-show-from="2026-12-20" data-show-until="2027-01-05"><p class="wrap">…</p></div>` in the flow (closures, snow). Never marketing.
- **Live status** `<p class="status" data-status data-open="07:30" data-close="18:00" data-days="1-5">Open 7.30am to 6pm, Monday to Friday</p>`. **Only add `data-days` when the days are confirmed**; without it the printed text stays (the example has no `data-days`, because Leaps and Bounds doesn't publish its days).

## 7. Tokens (section 1 of `styles.css`) and re-theming

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--floor` | `#FFF9F2` | Ground | Ink 16.1:1 |
| `--ink` | `#1D1B2F` | All text, outlines | |
| `--muted` | `#545266` | Small print | 7.2:1 on floor |
| `--action` | `#C7402B` | Book a visit, link underlines | White on it 5.0:1 |
| `--tomato / -hi / -lo` | `#E8553D / #F7A08D / #B53A26` | Foam | Ink on hi 8.3:1 |
| `--sun / -hi / -lo` | `#FFC93C / #FFE08A / #D99A00` | Foam | Ink on sun 10.9:1 |
| `--grass / -hi / -lo` | `#3DAA5C / #8ED3A0 / #27803F` | Foam | Ink on hi 9.6:1 |
| `--pool / -hi / -lo` | `#5BB0E6 / #8CCBF0 / #2F86C2` | Foam | Ink on hi 9.5:1 |
| `--grape / -hi / -lo` | `#8A5DD0 / #C3A8EC / #5E3A9E` | Foam | Ink on hi 8.1:1 |
| `--pool-deep` | `#1F5F99` | Visit band | White 6.7:1 |
| `--grass-deep`, `--grape-deep` | `#1F6B3A`, `#6C3FB0` | Wordmark letters | 6.2 and 6.8:1 on floor |
| Tints | `#FFE3DC #FFE7B8 #D8F0DF #DCEBFA #ECE3FA` | Inner page bands | Ink 13.5 to 14.0:1 |

Text only ever sits on the floor, white, the tints, the `-hi` faces or `--sun` (all ≥7:1 for ink), or white on `--action` / `--pool-deep`. Never put text on a mid foam colour except `--sun`.

**How to re-theme for a new nursery:**
1. If the nursery has brand colours, swap the five foam families in section 1 (keep each `-hi` at ≥7:1 with ink, and keep `-lo` darker than the body). Check every pair with the WCAG formula and update the comment.
2. Keep `--action` a single deep colour that carries white at ≥4.5:1. It is the one action colour.
3. Change the `.wordmark` and `.hero__name` words to the nursery's name (each word is a `<b>`; the colours cycle).
4. Swap the photo frame colours (`frame--*`) to suit the photos.
5. The hero scene is inline SVG coloured by the same tokens, so it follows automatically. Move or drop props (the zebra rocker is optional) but keep: a wedge, a roll, two cubes, balls. No people.

## 8. Inner pages

| Page | Shape / colour | Sections in the example | Next |
|---|---|---|---|
| `join-us.html` Visit and join | step / tomato | Book a visit (contacts, map link), Is it good? (all four grades with dates), What's here (signs), Places and the waiting list, Starting and settling in | Fees and funding |
| `fees-and-funding.html` | wedge / sun | Sessions and fees (table), 1,140 funded hours, Funded places for 2 year olds, Help with costs (`<details>`: Tax-Free Childcare, Universal Credit, mygov.scot) | Our nursery |
| `our-nursery.html` | cylinder / grass | Our rooms (room icons), A photo tour (film), How children play here (quote), Food and allergies | Our team |
| `our-team.html` | half-moon / grape | Who runs the nursery, Key workers (quote), Qualifications and ratios, Working here | Parents |
| `parents.html` | cube / pool | Session times (status), Who to contact, Closures and holidays, Policies (`<details>`: Privacy, Accessibility, Complaints) | Gallery |
| `gallery.html` | beach ball | Filters + mosaic, link to the tour | Visit and join |

Add a **Food** page (cube, with the meal list) only if the nursery publishes menus; then give Parents another shape. If a page grows past ~900 words, split it into a sub-page that opens with `<a class="back-link" href="parents.html"><svg><use href="#i-back"/></svg>Back to Parents</a>`. Policies are always a list of `<details>`, each with a 2-line summary and the document link (with its size and date); never one long page.

## 9. Video and gallery

**Living photo** (homepage play room):
```html
<figure class="frame frame--pool living" data-living>
  <video muted loop playsinline preload="none" width="768" height="432"
         poster="media/play-room-poster.jpg" data-src="media/play-room-loop.mp4"
         aria-label="Our block play room: …"></video>
  <figcaption class="living__label" data-playing="Our block play room, as a slow pan across one photo">Our block play room</figcaption>
  <button class="living__toggle" type="button" aria-pressed="false" hidden>
    <svg aria-hidden="true"><use href="#i-pause"/></svg><span class="living__text">Pause</span></button>
</figure>
```
`softplay.js` loads and plays it only at ≥768px when motion is welcome, shows the Pause button, and swaps the label to the honest `data-playing` text. Phones and reduced-motion users get the poster and never download the film. Keep it under 1.5 MB, 6 to 10 seconds, muted, of an **empty** room. From the nursery's own footage, or a slow pan across one real photo made with ffmpeg and labelled as such. A seamless back-and-forth pan:
```
ffmpeg -i room-800.jpg -filter_complex "crop=iw:iw*9/16,scale=7680:4320:flags=lanczos,format=yuv444p,zoompan=z=1.2:x='(iw-iw/zoom)*(0.5-0.5*cos(2*PI*on/300))':y='(ih-ih/zoom)/2':d=300:s=768x432:fps=30,setsar=1,format=yuv420p" -an -c:v libx264 -crf 32 -preset slow -g 150 -movflags +faststart play-room-loop.mp4
```

**Tour film** (Our nursery): `<figure class="frame frame--grass film"><video controls preload="none" playsinline crossorigin="anonymous" poster=…><source …><track kind="captions" … default></video><figcaption>…</figcaption></figure>` followed by a `<details class="transcript">`. Empty rooms first, captions always, sound only if the user asks. No YouTube or Vimeo. The example's film is honestly described as "made from still photos, 27 seconds, no sound".

Making a tour from stills without judder: crop each photo to 16:9 (never squash it), scale it up 10 times, and use full-resolution colour (`yuv444p`) before `zoompan`. `zoompan` moves in whole source pixels, and with `yuv420p` only in even ones, so on a small photo a slow pan stalls every few frames. Use 30fps, eased pans of 6 s each, and 0.8 s cross-fades, so captions change every 5.2 s:
```
seg="crop=iw:iw*9/16,scale=7680:4320:flags=lanczos,format=yuv444p,zoompan=z=1.12:x='(iw-iw/zoom)*(0.5-0.5*cos(PI*on/179))':y='(ih-ih/zoom)/2':d=180:s=768x432:fps=30,setsar=1"
# Pan right to left on alternate photos: (0.5+0.5*cos(PI*on/179)).
ffmpeg -i a.jpg -i b.jpg … -filter_complex "[0:v]$seg[a];[1:v]$seg[b];…;[a][b]xfade=transition=fade:duration=0.8:offset=5.2[ab];…,format=yuv420p[out]" \
  -map "[out]" -an -c:v libx264 -crf 27 -preset slow -g 60 -movflags +faststart photo-tour.mp4
```
The living-photo recipe above uses the same method, as one 10 s cosine back-and-forth so it loops seamlessly.

**Gallery:** `.filters[data-filters=mosaic]` (foam-block buttons with `aria-pressed`, groups Rooms, Play, Garden, and Food or Artwork when there are photos) over `ul.mosaic#mosaic > li[data-group] > figure > picture + figcaption`: 2 columns with 12px gaps on a phone, 3 on desktop, frame colour by group. Real `<img>` with true alt text and short captions, `loading="lazy"`, WebP 400/800 + JPEG. No slider, no lightbox. The homepage has **no** gallery strip; the Gallery door is the way in.

## 10. Final figures for the example (14 October 2026)

Measured at 390 by 844 with `scratchpad/tools/density.mjs` rules (text blocks = headings, paragraphs, list items, captions; boxes = filled or bordered elements narrower than the screen).

| Homepage check | Space brief | Result |
|---|---|---|
| Phone length | ≤6 screens (~5,000px) | **4,823px, 5.7 screens** |
| Sections | hero + ≤5 | hero + 4 (essentials, play room, doors, visit band) |
| Words in `<main>` | 120 to 180 | **172** |
| H2 per screen | ≤1 | 0, 1, 1, 1, 1, 0 |
| Text blocks per screen | ≤6 (first ≤7) | 3, 6, 3, 6, 3, 4 (footer) — average 4.2 |
| Boxes per screen | ≤3 | 2, 0, 2, 0, 2, 0 — average 1.0 |
| Two text items side by side under 600px | 0 | 0 |
| Picture or plain colour field | ~35% | 27% (scene field, photo, drawings, visit band); 33% counting the coloured foam staircase bars |
| Weight on a phone | <1 MB | 187 KB |

Inner pages: 96 to 318 words (limit 900), 3.9 to 6.3 screens, every section ≤120 words. Most inner screens hold 2 to 8 text blocks; three screens run higher because of lists (Our nursery's four rooms: 10; Our team's two people plus a quote: 12; the gallery's captions: 16). Inner sections are short, so two short H2s can share a screen.

Audit: **0 blockers, 0 major, 0 minor** on all 7 pages. `viewports.mjs`: **no layout flags at any of the 9 widths** on all 7 pages.

## 11. Pre-handover checklist

- [ ] Every fact traced to the nursery's site or the Care Inspectorate record; "phone to check" everywhere else (§3.6).
- [ ] Grades: every theme, the inspection and publication dates, the link resolves. Check for a newer report.
- [ ] Funded provider status confirmed with the nursery and the council list.
- [ ] No child's face anywhere, including background walls; metadata stripped; `CREDITS.txt` complete.
- [ ] Living photo and film labelled honestly; captions present; film `preload="none"`.
- [ ] Sprite inline on every page; nothing uses `foam-sprite.svg#…` by URL.
- [ ] Each page's shape and colour match across menu sheet, doors, band and Next door.
- [ ] Homepage: 120 to 180 words in `<main>`, ≤6 phone screens, one H2 per screen, ≤6 text blocks and ≤3 boxes per screen (run the density script).
- [ ] Each homepage content section ends with exactly one door link.
- [ ] `node pipeline/audit.mjs <url> <out>`: 0/0/0. `node pipeline/viewports.mjs` on every page: no flags.
- [ ] Homepage under ~1 MB on a phone. No third-party requests.
- [ ] "Page last reviewed" date in the footer.
- [ ] `node pipeline/template-thumbs.mjs nursery/soft-play` if the template changed.

## 12. Leaps and Bounds example: sources, and facts to confirm

**Sources:** `https://labnursery.co.uk/` (a one-page site, crawled 14 October 2026) and the Care Inspectorate record in `prospects/nursery/data` (CS2003053457).

**From the nursery's site:** address, phone, both emails; "the heart of Paisley"; 21 years; 96 children aged 0 to 5; 3 to 5 room up to 44, 2 to 3 room 25, 0 to 2 intake 27 split within 3 rooms; 4 main play areas over two floors; free flow from each playroom into its own garden; a key worker before the start date; partnership with Renfrewshire Council for funded pre-school places; sessions 7.30am to 6pm, AM 7.30am to 1pm, PM 1pm to 6pm; three parent quotes (two used; the third names a child and a staff member, so it was left out).

**From the Care Inspectorate record:** manager Melissa Donaldson; 96 places; grades 5 (Very good) for care and play, setting, leadership and staff team; inspected 1 April 2021, published 10 May 2021.

**Facts to confirm with the nursery:**
1. **Which days it opens** and how many weeks a year (the site doesn't say; the example says "phone to check" and the live status is switched off).
2. **Fees** for each session (not published).
3. **Places** available now, and how the waiting list works.
4. Whether it offers **funded places for eligible 2 year olds** (only pre-school funded places are stated).
5. **Grades:** whether there is a newer report than April 2021, and the exact theme headings on the report (shown here as Care, play and learning; Setting; Leadership; Staff team).
6. The youngest age it takes ("babies" is used because the site says 0 to 5).
7. Which room names it uses (the site says "Baby room", "Toddler room" and "Preschool room" in one place and "0-2", "2-3", "3-5" in another).
8. **Pauline's** full name and role (the site shows only "Management – pauline@…").
9. Meals: who cooks, menus, allergy handling. Closures and holidays. Policies, privacy notice and complaints process.
10. Staff qualifications and SSSC registration, and ratios (never printed until supplied).
11. Whether it accepts Tax-Free Childcare.
12. Consent to reuse its room photos, and whether it wants its round logo (which shows drawn children) in the header.

## 13. Changes from the direction brief, and why

- **The Food door became Parents (cube).** Leaps and Bounds publishes nothing about food, so a Food page would be empty. Food sits as a short "Ask us" section on Our nursery. Add a Food page when a nursery publishes menus.
- **The play-room photo is the block play room, not a soft-play room.** The nursery has no soft-play room; its block play room (tyres, blocks, a plank) is its most playful empty space. The foam scene carries the soft-play idea.
- **The visit band gained a foam pile at its foot, and the doors a small "tumble" of shapes above their heading,** to reach the picture share (S12) and to keep each H2 on its own phone screen.
- **The hero scene has a zebra rocker** (an optional prop in the brief) and no steps; the steps shape is the Visit and join door.
- **The living photo plays from 768px**, not only on desktop, because tablets can afford 138 KB.
