# Meadow: a website template for small, charming Scottish nurseries

> Pipeline name: **Meadow** (folder `templates/uk-nursery-meadow/`). It is direction 3 of `prospects/research/nursery-colourful-directions.md`: light, charming and painterly, with the fewest words of the three colourful directions. It suits small owner-run nurseries, rural and farm nurseries, and any nursery with good photos of rooms, the garden or animals.

**The idea in one line:** open with a painted watercolour picture of the nursery's own place, then let parents wander: a collage of blob-shaped photos with one gently moving "living photo", then big one-word tiles (Animals, Outdoors, Rooms, Team, Fees, Gallery) that lead to every answer.

It sells the nursery the way a lovely visit does: the place first, then the people, with every parent fact one tap away and the essentials (ages, hours, funded hours, places, grades, phone) on the first phone scroll. It is fun but premium: one brush-lettered display face used sparingly, a calm reading face, cream paper, five soft pastels and one deep green for actions.

Research behind it:
- `prospects/research/nursery-colourful-directions.md` (the direction, shared rules and the banned devices list).
- `prospects/research/nursery-sites-2/heads-of-ayr.md` (watercolour header, blob photos, collage with a video, one-word tiles, pastel room blocks), `buttercups.md` (pebble frames, hands at work), `thrive-dunblane.md` (soft circles, floating Call and Book pair), and `SUMMARY-A.md` / `SUMMARY-B.md`.
- `prospects/research/nursery-websites.md` §3.6 (what a nursery may claim), §4 (trust signals), §5 (photos and children) and §6 (structure). Section numbers like **§6.2** below point there.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `meadow.js` | About 200 lines of plain JavaScript. Phone menu, dated notices, live open/closed status (with "phone to check" on public holidays), the living photo's play and pause, gallery filters and the `<dialog>` lightbox. | Never. It reads its data from the page |
| `meadow-scene.svg` | The painted watercolour scene (1440x560), hand-coded SVG with a watercolour filter. Used at the top of every page. | **Yes: redraw for each nursery** (see "Redrawing the scene") |
| `fonts/` | Caveat Brush (display) and Andika (body, regular and bold), Latin and Latin Extended woff2 subsets, about 75 KB for the Latin files. SIL OFL in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | What photos Meadow needs and how to make them. | No |
| `example/` | Seven worked pages for **Bardykes Farm Nursery School**, a real family farm nursery in Blantyre, South Lanarkshire, built only from its website (crawled 13 October 2026) and its Care Inspectorate record. | Copy for each nursery |
| `example/img/` | 31 place and animal photos and 15 staff portraits, WebP at 2 sizes, plus `CREDITS.txt` (sources, and every excluded photo and why). | Each nursery gets its own |
| `example/media/` | The living photo loop, the farm film, posters and captions. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail: `node pipeline/template-thumbs.mjs uk-nursery-meadow`. | After changes |

Pages link `../styles.css`, `../meadow.js` and `../meadow-scene.svg`. No build step, no framework, nothing from another server: no Google Fonts, CDNs, analytics, maps, social embeds or YouTube (GDPR, §6.6).

---

## 1. Concept, and what it avoids

Most nursery sites either shout (primary colours, clip art, stock toddlers, sliders) or bury parents in text. Heads of Ayr showed a third way: 165 words on the homepage, a watercolour picture, soft photo shapes and four photo tiles. Meadow keeps that charm and fixes its faults:

- **The scene never hides the answers.** Heads of Ayr's phone opens on a screen of pure illustration. Meadow's scene is about 200px tall on a phone, and the status, name, one-sentence summary, "Book a visit" and the five key facts follow at once.
- **No people in the art.** The scene has the farmhouse, a horse, a Highland cow, lambs, hens, ducks, bees, an apple tree and washing on the line. No children, faces or figures: the photos carry the real people (staff, with consent).
- **The video is a living photo, not a hero.** A 6 to 10 second muted loop inside a blob, under 1.5 MB, with a pause button; phones get the poster. The longer farm film is click-to-play with captions and a transcript.
- **Words stay few.** The example homepage has 270 visible words. Everything deeper is one tile away.

It must not reuse the signature devices of our earlier nursery templates: no luggage tags, cork boards, full-stop headlines, storybook chapters, weather tiles, recipe cards, leaf corners, **torn paper** (Heads of Ayr's edges are deliberately not copied: the scene fades into the cream, and the footer has a grass fringe) or key facts as a row of boxed cards (Meadow's facts are staggered **stepping stones**, each a different pebble).

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Painted scene of the nursery's own place** across the top of every page (shorter on inner pages). | Heads of Ayr's watercolour header brings play and childhood in "without photographing any child" (heads-of-ayr.md, Borrow 1). Drawn characters or scenery instead of photographed children (SUMMARY-B, technique 1). |
| 2 | **Status, name, one sentence, two actions and five stepping stones on the first phone scroll**: ages, hours, funded hours, places, grades with date and link. | The directions document's "what parents need within one scroll". §6.2. Heads of Ayr's first phone screen has no action (Avoid list). |
| 3 | **Stepping stones**, not boxes: five pastel pebbles, each a different blob, gently staggered on desktop. | "Facts shown as devices, not sentences" (SUMMARY-A 8, SUMMARY-B 5), but boxed fact rows are banned. |
| 4 | **Collage of blob and oval photos around one short card**, with the living photo inside it. | Heads of Ayr's scrapbook collage and its video "inside a photo collage" (SUMMARY-B 10). Buttercups' pebble frames; Thrive's soft circles. |
| 5 | **One-word tiles as the main routes**: photo or painting plus one brush-lettered word on a painted label. | Heads of Ayr's photo tiles with one-word labels (SUMMARY-B 8). Keeps the homepage light (250 to 350 words). |
| 6 | **Living photo**: a muted loop, autoplay only above 48em and without reduced motion, a visible Pause / Play button, poster on phones, `preload="none"`. | Directions document, video rules. Heads of Ayr swaps in a still on phones (the right pattern) but sends 12 MB to desktop (Avoid). |
| 7 | **Farm film**: click to play, `preload="none"`, `playsinline`, poster, WebVTT captions and an on-page transcript. No YouTube. | Directions document. No studied site has captions (SUMMARY-B, Video). Heads of Ayr's "virtual tour coming soon" (Avoid). |
| 8 | **Gallery page grouped (Animals, Garden, Growing, The farm)** with filter buttons and a `<dialog>` lightbox; 2 columns on phones; real alt text and captions. | No studied site filters, captions or writes alt text; Heads of Ayr has 0 of 44 alts (heads-of-ayr.md, Gallery). Directions document, gallery rules. |
| 9 | **Pastel room blocks, each with a painted doodle** (sun, wellies, moon, apple). | Heads of Ayr's Sunshine Room, Rainbow Room and Garden (SUMMARY-B 4). |
| 10 | **Rosettes**: painted agricultural-show rosettes for the grades, the funded hours and any published price. | The direction's "price as a painted badge". Grades shown with every heading and the date (§4.1). A rosette suits a farm and reads as a badge, not a box. |
| 11 | **Team cards with a blob portrait, brush-lettered first name, role and one line of qualifications or experience.** | Heads of Ayr's team cards (Borrow 7). "Liked and trusted the staff" is the second reason for choice (§4.2). |
| 12 | **Phone-only call bar** (Book a visit, Phone) that never covers content: the footer gets matching bottom padding and `scroll-padding-bottom` keeps focus visible. | Thrive's floating Call and Book a Tour pair (thrive-dunblane.md, Borrow 4). Directions document allows it. |
| 13 | **Andika for reading, Caveat Brush for names and short headings only.** | Directions document: "hand-lettered display type for names and short headings only, and a calm, very readable body face". Andika was designed for new readers: clear a, g, l, I and 1. Heads of Ayr's light Futura is too faint (Avoid). |
| 14 | **Cream ground, five pastels, one deep green for actions, ink text on every pastel** (6.8:1 or better). | Directions document, colour rules. Heads of Ayr's sage-on-cream headings are low contrast (Avoid). |
| 15 | **Live status that never guesses**: on a public holiday the nursery hasn't confirmed, it says "Phone to check if we're open." | §3.6: never invent hours, closures or term dates. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts** (§3.6). Fees, availability, funded status, grades, dates, ratios, staff, qualifications, SSSC status, menus, allergies, hours, closures, policies, awards and reviews come only from the nursery's site or documents, or the Care Inspectorate record in `prospects/nursery/data/*.json`. Otherwise use "phone to check" wording.
2. **Grades:** every key question from the latest report, with its exact wording, the inspection date, the publication date and a link. Never only the best one, never the Care Inspectorate logo. If the nursery's site claims a better grade than the latest report, use the report and list the difference.
3. **Reviews** only from the nursery's own site, attributed exactly as it does ("Laura D, parent"). Quote word for word; cut, don't edit.
4. **Awards** only when real and dated, in the nursery's words.
5. Where sources disagree, use the newest dated source and list the disagreement in your report.

### Photos (§5, and `PHOTO-SHOTLIST.md`)
6. **No identifiable children, ever.** Treat every old-site photo with a child in it as excluded. Staff only where their portrait is already public on the nursery's site, or with consent.
7. Strip metadata, make 400 and 800px WebP, record every source and every exclusion in `img/CREDITS.txt`.
8. The template must still look complete with few photos: swap any tile's photo for a painted doodle (`.tile__art` with an SVG), and use doodles in room blocks.

### Illustration
9. **All illustration is hand-coded SVG. No people**: no children, faces or figures. Animals, plants, buildings, weather and objects only. No stock packs, no AI images.

### Content style
10. Homepage: about 250 to 350 visible words; headings 2 to 6 words; paragraphs of 1 or 2 sentences of 20 words or fewer.
11. Times "8am to 6pm"; days and months in full; "to", not dashes. Links start with a verb.
12. Phone numbers are `tel:+44…` links shown locally ("01698 822212"). 999 is plain bold text.

### Accessibility (WCAG 2.2 AA)
13. Keep the token pairs in section 7. Text on pastels is always `--ink` or `--heading`. White text only on `--action` and the footer.
14. One `h1` per page; `h2` per section; never skip levels. Skip link first. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`.
15. Tap targets 44px or more (stand-alone links use `.go`; contact links use `.phone-line`).
16. Motion: the living photo autoplays only without `prefers-reduced-motion: reduce`, and always has a visible Pause. No other animation except a gentle tile zoom on hover (reduced-motion safe). No smooth scrolling.
17. Decorative SVG is `aria-hidden="true"`. Photos in tiles whose word is the link text have `alt=""`; every other photo has short, true alt text.

### Performance
18. Homepage under about 1 MB on a phone. The example: **about 520 KB on a phone after scrolling the whole page** (no video downloads on phones), about 1.07 MB on desktop including the 240 KB loop.
19. Below-the-fold images use `loading="lazy"`, `width`, `height` and `srcset`. The collage's first blob is eager.

## 4. Homepage structure (keep this order)

1. Skip link, inline SVG sprite (icons, the brand mark, doodles).
2. **Header** `header.site-header`: `a.brand` (mark, name, place), `a.header-call` ("Phone" on phones, the number from 48em), `button.menu-toggle` ("Menu", hidden from 64em), `nav#site-nav` with 7 items (Home, Visit and join, Fees and funding, Our nursery, Our team, Parents, Gallery). Never more than 7.
3. **Hero** `section.hero`: `.scene` (the SVG as `<img alt="">`), then `.hero__body`: `p.status[data-status]`, `p.place-tag` (one short brush-lettered line, for example "On the farm since 1991"), `h1`, `p.hero__lead` (one sentence: who, where, ages, hours, all year or term time), `.actions` (Book a visit as a `tel:` link; Join the waiting list), a visually hidden `h2` "At a glance", and `dl.stones` with 5 `.stone` (`dt.stone__label`, `dd.stone__value`, optional `dd.stone__more`). The grades stone is `.stone--wide` (full width on phones).
4. **Collage** `section > .collage`: `.c1` big blob (eager), `.c2` living photo, `.c3` blob, `.collage__card` (h2, two sentences, a link), `.c4` oval, `.c5` blob.
5. **One-word tiles** `ul.tiles` of 6: each `a.tile > span.tile__art (img or svg) + span.tile__word`.
6. **A parent's words** `figure.quote` with a visually hidden `h2`.
7. **Snapshots** `ul.strip` of 5 figures plus "See all our photos".
8. **Come and see us** `.visit`: contact card, find-us card (address, directions in words, "Get directions" link, no map embed), opening-hours card with a second status pill and `tr[data-day]` rows.
9. **Footer** (grass fringe), then `nav.callbar` (phones only), then `script#nursery-schedule`, then `meadow.js`.

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags on any page.

| From | What changes |
|---|---|
| 0 | One column. Header: mark, name (no place line), Phone and Menu. Stones in 2 columns (grades full width). Collage in 2 columns, the card full width. Tiles in 2 columns. Call bar fixed at the bottom. |
| 30em | The place line shows under the name. Menu items in 2 columns. |
| 40em | Tiles in 3 columns. Gallery mosaic in 3 columns. Action buttons stop stretching. |
| 46em | Room blocks, people (3), animals (3) and answer cards go to 2 or 3 columns. |
| 48em | Body text 19px. The header shows the phone number. The call bar goes. The living photo may autoplay. |
| 52em | Stones in one staggered row of 5. Collage becomes the 12-column scrapbook. `.split` goes to 2 columns. Snapshot strip in one row. Footer in 3 columns. |
| 64em | Full nav row; Menu goes. Tiles 4:3, wider gaps. Mosaic 4 columns. Rooms in 4, people in 4, animals in 4. |

Rules: grid children have `min-width: 0` so tables and long emails never push the page sideways; emails wrap anywhere; tables sit in `.table-wrap`.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.scene`, `.scene--short` | The painted scene. Hero height `clamp(12.5rem, 30vw, 27rem)`; inner pages shorter, focused lower. |
| `.status[data-status]` | Live pill: open, closing (last 30 minutes) or closed. |
| `.place-tag` | One brush-lettered line in barn red (8.3:1 on cream). |
| `.btn`, `.btn--ghost`, `.go`, `.chip` | Main action (deep green), second action, verb link with arrow, in-page contents chip. |
| `.stones`, `.stone`, `.stone--wide` | Key facts as stepping stones. |
| `.collage`, `.c1`…`.c5`, `.collage__card` | Homepage scrapbook. |
| `.pair` | Two blobs side by side on inner pages (add `.blob--wide` for a full-width third). |
| `.blob`, `.blob--2`…`--5`, `.blob--oval` | Photo in a pebble mask with a pastel wash behind. Add a `figcaption` for a brush-lettered label. |
| `.living[data-living]`, `.living__btn` | The living photo (section 8). |
| `.tiles`, `.tile`, `.tile__art`, `.tile__word` | One-word routes. The label colour follows the tile's pastel. |
| `.strip` | Homepage snapshots: one wide and four pebbles. |
| `.quote` | A parent's words, brush-lettered, with the painted quote mark. |
| `.card`, `--butter`, `--mint`, `--sky`, `--blush`, `--lilac` | Soft cards with a painted shadow. |
| `.rooms`, `.rooms--4`, `.room__ages` | Pastel room blocks with a doodle each. |
| `.rosettes`, `.rosette`, `.rosette--long` | Painted show rosettes for grades, funded hours and prices. The rosette SVG is built by the example's helper (copy one from the example HTML and change the three colours and the text). |
| `.people`, `.people--lead`, `.person__photo`, `.person__role`, `.person__line` | Team cards. |
| `.animals` | Animal cards: photo, brush-lettered name, one line. |
| `.things` | Pill list with a doodle each (garden features, events). |
| `.steps` | Numbered steps on painted pebbles. |
| `.ruled`, `.ticks`, `.note`, `.details`, `.table`, `.table-wrap`, `.table-note`, `.hours` | Lists, notes, expanders and tables. |
| `.filters`, `.filter`, `.photo-group`, `.mosaic`, `.wide`, `.tall`, `.lightbox` | Gallery (section 9). |
| `.tour`, `.tour__frame` | The farm film. |
| `.callbar` | Phone-only Book a visit and Phone bar. |
| `.page-head`, `.breadcrumb`, `.chips` | Inner page head. |

Doodles in the sprite: `d-sun`, `d-moon`, `d-boots`, `d-apple`, `d-egg`, `d-sprout`, `d-bee`, `d-horseshoe`, `d-pound`, `d-clock`, `d-star`, `d-house`, `d-flower`, `d-quote`, `d-hen`. Use with `<svg aria-hidden="true" focusable="false"><use href="#d-sun"/></svg>`.

## 7. Tokens (section 1 of `styles.css`)

| Token | Default | Rule, with computed contrast |
|---|---|---|
| `--paper` | `#FBF6EA` cream | Page ground. Ink 13.4:1. |
| `--paper-deep` | `#F2EAD3` | Tinted sections. Ink 12.0:1, link 6.0:1. |
| `--ink` / `--ink-soft` | `#2B2A20` / `#55513F` | Text. Ink-soft is 7.4:1 on paper and 6.1:1 on blush, the lowest pastel. |
| `--heading` | `#2E5233` | Brush-lettered headings: 8.2:1 on paper, 6.8:1 on blush. |
| `--butter`, `--mint`, `--sky`, `--blush`, `--lilac` | `#FBECA8`, `#D9EECF`, `#D7E9F4`, `#F8DCD2`, `#E7DFF2` | Backgrounds only. Ink on each 11.1:1 or more; link 5.6:1 or more. |
| `--*-paint` | `#EBC24E`, `#8DBA7E`, `#7FAFD0`, `#E39C86`, `#A992CC` | Painted shadows and doodles. **Decorative, never text.** |
| `--action`, `--action-strong` | `#2E6B3E`, `#245632` | The one deep accent for actions. White 6.4:1 and 8.6:1. Re-check white 4.5:1 if you change it. |
| `--accent` | `#B2412E` barn red | Place tag (8.3:1 on paper), the brand mark, doodles. |
| `--link`, `--link-hover` | `#1D5A8C`, `#123E63` | Don't re-theme. 6.7:1 on paper. |
| `--open`, `--closing`, `--closed` | `#1F6B3A`, `#8A4B00`, `#55513F` | Status. 6.0:1 and 6.3:1 on paper. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. Never change. |
| `--footer`, `--footer-ink`, `--footer-soft` | `#2A4630`, `#F4EFE0`, `#CFE0C6` | Footer: 9.1:1 and 7.5:1. |
| `--line-strong` | `#8C8470` | Control edges: 3.45:1 on paper. |
| `--font`, `--font-display` | Andika; Caveat Brush | Display face for `h1`, `h2`, names, tile words, room names and captions only. Never for body text or anything under 22px except figure captions. |
| `--blob-1`…`--blob-5`, `--pebble` | Organic `border-radius` values | Keep each slightly different. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder (keep `../styles.css`, `../meadow.js`, `../meadow-scene.svg` and `../fonts/` resolving), or copy the whole template folder.
2. **Gather facts** (section 12 shows the kind of list) and crawl the site with `pipeline/crawl.mjs`.
3. **Colours:** keep the cream and pastels unless the nursery's colours are pastel already. Pick `--action` from the nursery's strongest colour, darkened until white is 4.5:1 or more (6:1 is better). Leave link, status and focus tokens alone.
4. **Mark:** redraw `#mark` in the sprite from the nursery's logo or its animal (Bardykes' is the Highland cow on its T-shirts). 48x48, a pastel circle, an ink line of 1.1px.
5. **Scene:** redraw `meadow-scene.svg` (next section).
6. **Copy:** replace every Bardykes fact on every page. Afterwards `grep -rn "Bardykes\|Blantyre\|01698\|G72\|Wilkie\|CS2003006362\|South Lanarkshire" example/` must return nothing from Bardykes.
7. **Schedule, grades, fees, photos, media**, then `<title>`, meta description and footer review dates. Run the checklist in section 11.

## 8. Redrawing the scene (`meadow-scene.svg`)

- ViewBox 1440x560, `preserveAspectRatio="xMidYMax slice"`. A 390px phone shows roughly x 270 to 1170, so put the building and the best animal there. Wide screens see the pond and the beehive at the ends.
- Filters: `#wc` (watercolour: wobbly edge, grain and a darker pigment rim; use on filled shapes with `fill-opacity` .7 to .9 so the rims show), `#soft` (clouds), `#ink` (a slight wobble for 2px ink lines in `#3B3127`).
- Layers have ids: `sky-wash`, `sun`, `clouds`, `birds`, `hills`, `far-trees`, `big-tree`, `farmhouse`, `cart`, `field`, `horse`, `fence`, `highland-cow`, `washing`, `apple-tree`, `beehive`, `hens`, `lambs`, `pond`, `flowers`, `grass`. Delete what the nursery doesn't have and draw what it does: its own building (from a photo of the front), its garden features, its animals, local hills, sea or river.
- **Never draw people**, and nothing the nursery doesn't have (no invented animals or play equipment).
- The bottom 60 units fade to the cream ground. Don't add a torn or wavy edge.
- Keep it under about 25 KB and check it renders in Safari and Firefox.

## 9. Video: the two components

**Living photo** (homepage collage):

```html
<figure class="living c2" data-living="our lambs">
  <div class="living__frame">
    <video muted loop playsinline preload="none" poster="media/lambs-loop-poster.webp" width="640" height="640"
           aria-label="Moving photo: three lambs grazing in the field">
      <source data-src="media/lambs-loop.mp4" type="video/mp4">
    </video>
    <button class="living__btn" type="button" hidden aria-label="Play the moving photo: our lambs">…icons…<span data-label aria-hidden="true">Play</span></button>
  </div>
  <figcaption>Our lambs<span class="living__note">A slow pan across one photo</span></figcaption>
</figure>
```

- The source has `data-src`, so nothing downloads until the script decides. It plays only at 48em and wider without reduced motion; otherwise the poster shows and the button says Play. The button's accessible name starts with its visible word.
- 6 to 10 seconds, 640x640 H.264, no audio, under 1.5 MB, with a poster from the first frame.
- **Be honest about what it is.** The example is a slow back-and-forth pan across one real photo (made with ffmpeg: `scale=1706:1280,crop=1280:1280:x='(iw-1280)*(1-cos(2*PI*t/8))/2':y=0,scale=640:640`), so the caption says "A slow pan across one photo". Real footage (lambs, the stream, washing on the line) with no children can say just "Our lambs".

**Farm film** (Our nursery and Gallery):

- `<video controls preload="none" playsinline poster>`, an MP4 `source`, a `track kind="captions"` (WebVTT), a one-line description with the length and "no sound", and a transcript in `details` on the Our nursery page.
- The example is a 41 second slideshow of 12 of the nursery's own photos, each slowly panned with cross-fades, labelled "A walk round the farm, in photos". 3.4 MB. If the nursery has real footage of empty rooms and the garden, use it (30 to 90 s, under about 4 MB at 720p) and caption any speech.

## 10. Gallery (`gallery.html`)

- One `section.photo-group[data-group-title]` per group, each with a doodle and `h2`, then `ul.mosaic`. Groups in the example: Animals, Garden, Growing, The farm. Use Rooms, Garden, Food and Artwork when the nursery has those photos.
- Each `li` holds `figure > button[data-full] > img` plus a `figcaption`. Mark a few `li.wide` (2 columns) and `li.tall` (2 rows). On phones there are 2 columns, so keep each group's cell count even (wide and tall each count 2) and put a tall photo early, or a hole appears.
- `ul.filters` (hidden until the script runs) holds `button.filter[data-filter][aria-pressed]`. The count line has `aria-live="polite"`.
- The `<dialog class="lightbox">` opens on click, moves with the arrow keys or Previous and Next, closes with Esc, Close or a click outside, and returns focus to the photo. Without `<dialog>` support the button opens the photo.
- Real alt text on every photo; no slider; `loading="lazy"`; 400 and 800px WebP.

## 11. The schedule (`#nursery-schedule`) and status

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["08:00", "18:00"]], "tue": [["08:00", "18:00"]], "wed": [["08:00", "18:00"]],
            "thu": [["08:00", "18:00"]], "fri": [["08:00", "18:00"]], "sat": [], "sun": [] },
  "closures": [ { "from": "2026-12-24", "to": "2027-01-04", "label": "the Christmas holidays" } ],
  "term": { "from": "2026-08-12", "to": "2027-06-25", "label": "the summer holidays" },
  "checkDays": [ { "date": "2026-12-25", "label": "Christmas Day" } ]
}
```

- `closures` (only dates the nursery has published) and `term` (term-time nurseries only) work as in Front Desk Nursery.
- `checkDays`: Scottish public holidays the nursery hasn't confirmed. On those days the status says "Today is Christmas Day. Phone to check if we're open." instead of guessing. The example lists the holidays from 30 November 2026 to 2 August 2027 because Bardykes publishes no closures. Remove a date once the nursery confirms it, and move it to `closures` if it's closed.
- Status wording: "Open now until 6pm", "Open now. Home time soon, at 6pm", "Closed now. Opens tomorrow at 8am", "Closed now. Opens on Monday at 8am".
- Tested with Playwright's clock: a weekday at 7:15am, 10am and 5:40pm, Friday 6:30pm, a Saturday and Christmas Day.

### Dated notices
Closures, snow and deadlines only, never marketing, in the page flow:

```html
<div class="notice-band" data-show-from="2026-12-01" data-show-until="2026-12-24">
  <div class="wrap notice" role="note"><span class="notice__label">Closed</span><p>We close for Christmas on Thursday 24 December. Back on Tuesday 5 January.</p></div>
</div>
```
Place it straight after the hero. The example has none because Bardykes has published no closures.

## 12. Inner pages

Every page copies the head, header, sprite, footer, call bar, schedule and script exactly. Only `<title>` ("[Page]: [Nursery], [area]"), the meta description and `aria-current="page"` change. Each opens with the short scene, a breadcrumb, `h1`, a one-sentence lead and `nav.chips` ("On this page").

| Page | Sections in the example |
|---|---|
| `join-us.html` | Book a visit (questions to ask, contact card) · How to join (steps from the nursery's own process, funded-hours card) · Sessions · Settling in (a parent's words) · Finding us (directions in words, the nursery's own drawing) · Your information |
| `fees-and-funding.html` | Funded hours (rosette, steps, mygov.scot) · 2 year olds · Our fees ("phone us" when fees aren't published, plus a dated table of the charges that are, and a rosette for the registration fee) · Paying · Help with costs (Tax-Free Childcare, Universal Credit, Parent Club) |
| `our-nursery.html` | Rooms (pastel blocks) · Outdoors (feature pills, blobs) · Meet the animals · Farm film (captions, transcript) · Food · Extra support · Inspection grades (rosettes) · Our story (awards, the nursery's own drawing) |
| `our-team.html` | Who runs the nursery · Our practitioners · Key workers and child protection · Work with us |
| `parents.html` | Hours and closures · Collecting your child · Paying fees · Parties and events · Parents' page · Worries and complaints (steps, then the Care Inspectorate, 999 note) |
| `gallery.html` | Filters, four photo groups, the farm film, the lightbox |

## 13. Variants

- **Few or no photos:** every tile can be a painted doodle; room blocks need none; the collage can drop to the card plus two blobs and the living photo can be skipped (delete the `figure.living`). Keep at least the scene, so the page still feels alive.
- **No animals:** redraw the scene with the building, garden, trees, birds and weather; swap the Animals tile for Garden or Food.
- **Term-time nursery:** add `term` to the schedule; the hero sentence says "in term time".
- **Fees published:** add a rosette with the main price ("£73 a full day") and a full `.table` with "Fees from [date]" and "Last checked".
- **Grades below 4:** keep the rosettes (in the same colours, never red for a low grade), add a `.note` in the nursery's words about what it is improving.

## 14. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the nursery's site, documents or Care Inspectorate record. Disagreements are listed in your report.
- [ ] Grades: every key question, exact wording, inspection and publication dates, working link.
- [ ] Funded status confirmed with the nursery (and the council list).
- [ ] Reviews quoted word for word with the nursery's attribution; awards real and dated.
- [ ] `checkDays` and `closures` up to date; weekdays checked with a script.

**Photos and art**
- [ ] No identifiable child anywhere, including the film and the living photo. EXIF stripped. `img/CREDITS.txt` complete with exclusions.
- [ ] The scene shows the nursery's own place, with no people and nothing it doesn't have.
- [ ] The living photo is labelled honestly.

**Content**
- [ ] The first phone scroll shows status, name, the one-sentence summary, Book a visit, Join the waiting list and the five stepping stones.
- [ ] Homepage 250 to 350 visible words. Menu 7 items or fewer.
- [ ] No pop-ups, carousels, sliders, social embeds, map embeds or trackers.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/example/ <out>`: 0 blockers, 0 major, 0 minor across every page.
- [ ] `node pipeline/viewports.mjs` on every page: no layout flags at all 9 widths. Look at 390, 768 and 1280px yourself.
- [ ] Homepage under about 1 MB on a phone after a full scroll.
- [ ] Keyboard: skip link, menu (Escape closes), living photo button, gallery filters, lightbox (Esc, arrows, focus return), video controls.
- [ ] Reduced motion: the loop doesn't start. Text at 200%: no sideways scroll.
- [ ] `node pipeline/template-thumbs.mjs uk-nursery-meadow` after template changes.

## 15. Bardykes example: sources, and facts to confirm

**Sources:** bardykes.co.uk (25 pages crawled 13 October 2026, last modified 9 October 2026), its linked inspection report PDF (completed 21 February 2023), and our Care Inspectorate data (service CS2003006362: 56 places, grades published 30 March 2023, manager Kerstin McKim). Nothing else.

Confirm before go-live:
1. **"Excellent" claim.** The nursery's site says the Care Inspectorate "awarded us EXCELLENT", but the report it links (February 2023) and our data give 5, very good, for all four key questions. The example shows the report's grades.
2. **Manager.** Our Care Inspectorate data names Kerstin McKim as manager; the website lists Katie Peters as Nursery Manager and Kerstin McKim as Quality and Standards (after 6 months as interim manager). The example shows both roles as the website gives them.
3. **Ages and places.** The 2023 report registers 44 children from age 2; our data now shows 56 places; the website (2026) says it has places for 2 to 5 year olds in 2026/27 and baby room places for 0 to 2. The example says "Babies to 5" and "phone to check" for places.
4. **Rooms.** The example's rooms (three playrooms in the old dairy, the large outdoor playroom, the baby room, the farmhouse kitchen) come from the 2023 report, the parents' contract and a testimonial. Room names, ages per room and ratios are not published.
5. **Funded hours.** The 2023 report says the nursery is in partnership with South Lanarkshire Council; the site offers the council's 2025-2026 funding forms. Confirm current funded status for 3 and 4 year olds and for eligible 2 year olds.
6. **Fees.** No session fees are published. The registration fee (£80), late collection (£15 per 15 minutes after 6pm), the 10% late-payment charge, the 2-day minimum and 1 month's notice come from the application page and parents' contract.
7. **Closures.** None published. The status says "phone to check" on Scottish public holidays.
8. **Staff.** Names, roles and lines come from the "Our Humans" page; photos are matched by their order on that page. "All first aid trained, PVG checked and members of the SSSC" is the site's claim; check it covers the trainees and apprentices. Confirm each person's consent for the new site.
9. **Animals.** Names come from the site's photo labels and posts (Rosie and Ruth the horses, Miffy and Peanut the rabbits, Schnitzel, Bonnie, Dinah and Myrtle, Coco and Goose, Tommy the tortoise, Meryl Sheep and Lady Baa Baa). Check they are all still at the farm, and which horse is in the photo.
10. **Awards.** Mrs Wilkie's National Lifetime Achievement Award (Scottish Nursery Awards, 22 November 2025) and the Bronze Early Years Team of the Year (Pearson National Teaching Awards 2025) are in the news page text. The Pocket Garden 2026 winner comes from a certificate image. Eco-Schools and Sun Safe Nursery are named on the site without dates. The site also shows Nursery Awards badges (2020, 2021, 2022, 2024), a daynurseries Top 20 2024 badge and a Living Wage Employer logo as images only: not used until confirmed.
11. **Owner's name.** The news page spells her first name both "Alisa" and "Ailsa"; the example says "Mrs Wilkie", as the team page does.
12. **Photos.** Several animal photos appear to be from a Cameron-Laird Photography shoot; confirm reuse rights. The farm drawing is from the site header.
13. **Parents' page link** points to the current site's password page; move it when the new site goes live.
