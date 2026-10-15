# Open House: a spacious website template for independent Scottish nurseries

> Pipeline name: **Open House** (folder `templates/nursery/open-house/`). One of the four "spacious" nursery directions in `prospects/research/nursery-spacious-directions.md` (direction 1). It exists to fix the owner's complaint about our earlier nursery templates: "a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."

**The idea in one line:** a homely nursery is a house with its doors open. The homepage is a drawn house front; scroll down and you go floor by floor (the hall, the come-in room, the rooms of the house), and every room is a door to an inner page. The picture *is* the navigation.

It is the "after" in a before-and-after pitch, and the system AI build workers reuse for every nursery that suits it. It sells the nursery with warmth (a lit house, a cat on the sill, a kettle in the kitchen) and space (one idea per phone screen), while every parent fact is one tap away on a calm, structured inner page.

**Best for:** small owner-run nurseries in a house, villa, cottage or converted church hall (Glasgow's southside, Edinburgh, Perth villas; town cottages), "home from home" nurseries, 20 to 60 places. Not for big purpose-built centres or chains.

Read these once before your first build:
- `prospects/research/nursery-spacious-directions.md`: the **space brief (S1 to S13)** is binding on every page you build;
- `prospects/research/nursery-websites.md` §3 to §6: Scottish facts, photo rules, structure (section numbers like **§3.6** below point into it);
- `prospects/research/nursery-colourful-directions.md`: shared rules on photos, gallery, video and contrast.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `openhouse.js` | About 130 lines of plain JavaScript, no dependencies: the phone menu sheet, the call bar that slides in after the hero, the live open or closed status, dated notices, the smoke pause button, the living photo, the click-to-play tour film and the gallery filters. It reads everything from the page. | Never |
| `fonts/` | **Sniglet** 800 (display) and **Golos Text** 400 to 600 (variable, body), Latin and Latin Extended subsets as woff2, 67 KB in all. SIL Open Font Licence in `fonts/OFL.txt`. | Never |
| `example/index.html` | Worked homepage for **My Second Home**, a real family-run nursery in a Victorian house in Cardonald, Glasgow, built only from its own website and its Care Inspectorate record. | Copy it for each nursery |
| `example/join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html`, `gallery.html` | The six inner pages, one per menu item. | Yes |
| `example/hire-our-space.html` | A **sub-page** of Parents, showing the "← Back to Parents" pattern. | Only if the nursery needs a sub-page |
| `example/img/` | The nursery's own photos (cropped, no faces), the tour film and its captions, the living photo, and `CREDITS.txt` (every source, and every excluded photo with the reason). | Each nursery gets its own `img/` |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to photograph. | No |
| `thumb.jpg` | Picker thumbnail. Regenerate with `node pipeline/template-thumbs.mjs nursery/open-house`. | After changes |

Pages link `../styles.css` and `../openhouse.js`; fonts load from `../fonts/` through the stylesheet. Keep that folder shape. No build step, no framework, nothing from another server (no Google Fonts, CDNs, analytics, map embeds or social widgets; GDPR, §6.6).

**The drawings are an inline SVG sprite** at the top of every page's `<body>` (the `<svg class="sprite">` block). Board previews are sandboxed, so `<use href="file.svg#id">` would draw nothing: every drawing is `<svg class="art"><use href="#id"/></svg>` pointing at a symbol in the same page. When you change a drawing, paste the same sprite into every page. Every stroked shape carries `vector-effect="non-scaling-stroke"`, so lines stay 2px at 40px and at 600px; keep that attribute on anything you add.

---

## 1. Concept, and what it avoids

Our first 11 nursery templates were measured on a 390 by 844 phone (space brief, Part 1): 8 to 10.5 text blocks per screen, 13 to 15 on the first screen, 2 by 2 fact grids with three sizes of text, 7-pill rows, homepages of 14 to 20 screens with menus, timelines and grade tables on them. The two sites the owner likes (Playhouse and Sunflower) put 5 to 6 text blocks on a screen, one thing per row, and push detail into inner pages.

Open House answers that with a picture parents understand instantly:
- **The house front is the hero.** A drawn villa (or cottage, modern single-storey or hall) with the nursery's name in the gable, windows that light one by one and a cat on the sill. One H1, one line, the door button, Phone. Nothing else.
- **One floor per idea.** Each homepage section is a floor of the house, separated by a floorboard (a 6px ink rule with nail dots) and a change of wall tint. One H2 per phone screen.
- **The essentials hang in the hall.** Five plain lines with household icons (a coat peg for ages, the hall clock for hours, a piggy bank for funded hours, a chair for places, a star for grades). Not boxes.
- **Rooms of the house are the doors.** Six drawn rooms (playroom, kitchen, garden, office, staff room, photo wall), each a whole-tile link to an inner page. On a phone they stack one per row; on desktop they become a **cutaway house**, 3 rooms by 2 floors under a slate roof.
- **Each inner page is a room.** Its band shows that room drawn large, with an eyebrow naming it ("The office" for Fees and funding), so parents always know where they are. Labels stay plain; the metaphor lives in the pictures and eyebrows, never in the facts.
- **Book a visit is the house at dusk.** Deep slate, the same house with every window lit, and one cream card: "Come round for a look".

**What it is not:** no luggage tags, cork boards, full-stop headlines, storybook chapters, weather tiles, recipe cards, torn paper, wave seams, ringed circle photos, big-number cards, pastel room blocks, arch frames or hi-vis stripes (the 11 existing templates' signatures). No mascot, no people in any drawing, no carousel, no pop-up, no stock or AI imagery. It differs from Garden Gate (`nursery/garden-gate`) because Garden Gate walks through real photos in visit order; Open House is drawn, and its picture is the navigation.

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Homepage: hero + 4 sections**, about 6 phone screens, 120 to 180 words in `<main>`. Never menus, grade tables, timelines, FAQs, team lists or reviews on the homepage. | Space brief S3, S4. Our old homepages ran 14 to 20 screens and 1,100 to 1,600 words; Playhouse's welcome alone is 229 words and reads as dense. |
| 2 | **One idea per phone screen**: at most 1 H2, 6 text blocks, 1 primary and 1 secondary action and 3 boxes per 844px. | S5. The references average 5.3 to 6 blocks and 1.1 to 3.8 boxes. |
| 3 | **One item per row on a phone**, 24 to 32px between items, 24px gutters, 80px section padding (128px at 1280). | S1, S2, S6, S7. Playhouse's full-width rows are what the owner reads as "space". |
| 4 | **The essentials as one list of 5 lines** with icons, ending in one "All the details →". Grades line = summary, date and report link; every grade is on Our nursery. | S9. Answers "Is this for us?" within 2 screens (§6.2) without fact boxes. Parent Club tells parents to judge quality from the report [PC-Q]. |
| 5 | **Door tiles as drawn rooms**: each tile is one link (≥96px tall), a 3-word label and an 8-word line. | S9 and S6. Sunflower's photo door tiles; Playhouse's room identity (colour plus drawn object). |
| 6 | **Every homepage section ends with exactly one door link.** | S9. |
| 7 | **Inner page frame**: band (eyebrow, H1 ≤6 words, intro ≤35 words, one action, the room drawing), "On this page" (48px rows), short sections (H2 + ≤120 words), a "Next" door, then the Book a visit band. | S10. Sunflower's calm inner-page band; Playhouse's room dropdown as an in-page contents list. |
| 8 | **One action wording site-wide: "Book a visit"**, drawn as the front door; secondary is always "Phone 0141 …". | S13; §6.3. Playhouse's single repeated "Enquire" beats Sunflower's seven actions. |
| 9 | **Menu: 6 items + Book a visit**; on phones and tablets a full-height sheet, 56px rows, in the same order as the doors, with Book a visit and Phone at the bottom. | S11; §6.1. Playhouse's 12 flat items printed twice are the anti-pattern. |
| 10 | **A sticky call bar on phones** (Book a visit + Phone) that slides in only once the page's own Book a visit button has scrolled away. The page is padded by its height. | S11; Playhouse's floating Enquire pill. Hiding it at the top keeps the first screen to one primary action and stops it covering the hero. |
| 11 | **18px body text on phones (20px at 1280), line height 1.6, 60ch measure, left aligned.** Ink at 9.9:1 or better on every ground. | S8. Sunflower's 13px and Playhouse's grey 14px read as busy. |
| 12 | **Drawn rooms as photo fallbacks**: the template looks finished with zero photos. | §5.2: a template that needs faces breaks the day a parent says no. Most nursery sites (including the example's) have few usable photos. |
| 13 | **Gallery = "The photo wall"**: a 2-column mosaic on phones with captions and 3 filter buttons; no homepage strip (the Gallery door shows the photo wall). | Spacious direction 1; colourful directions' gallery rules. |
| 14 | **Two video components**: a click-to-play "look round" film (poster, captions, transcript, `preload="none"`, no sound unless asked) and a living photo (muted loop, autoplays only on wide screens with no reduced-motion request, pause button). | Playhouse's tour film that starts at the front door, minus its 42 MB autoplay and its children. |
| 15 | **Honest, dated grades**: every theme, the inspection and publication dates, the scale, and a link. Never the CI logo. | §3.2, §4.1. |
| 16 | **Self-hosted fonts, no trackers, no map embed** ("Get directions" link instead). | §6.6, [ICO-PECR]. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, grade, room, amenity and policy comes from the nursery's own site or documents, or its Care Inspectorate record (`prospects/nursery/data/*.json`). The §3.6 list is binding.
2. Where unsure, use the §3.6 "Otherwise write" wording: "Places: phone to check", "Phone us for our current fees", "Ask us about staff ratios when you visit", "Ask us about this week's menu".
3. **Grades:** the homepage line is a summary in words with the month and year of the report, linked. Our nursery shows every theme with its exact heading (old framework headings for reports before 22 September 2025, §3.2), the inspection and publication dates, and "Read our latest inspection report".
4. **"What's here"** (Visit and join) lists only amenities the nursery states. Up to 4 words each.
5. **Rooms** use the nursery's own room names and age bands only.
6. Reviews and quotes only from the nursery's own site, attributed as it does. Awards only if real and dated.
7. Where sources disagree (the website versus the Care Inspectorate record), use the newest dated source and list the difference in your report.

### Photos (§5.2)
8. **No identifiable children, ever.** No faces, names (check artwork labels and pegs), nappies, changing, sleeping. Crop or exclude; blur artwork name labels.
9. Allowed: empty rooms, the garden, the entrance, food, artwork without names, hands at work, staff with their own written consent.
10. Never stock or AI images, never clip-art people. Our drawings never show people: objects, plants, animals and weather only.
11. Strip metadata. Record every source and every exclusion in `img/CREDITS.txt`.

### Content style
12. Plain English at reading age 9 to 11, "you" and "we", sentences of 20 words or fewer on the homepage, "8am to 6pm", days and months in full.
13. **Copy voice: a neighbour at the door.** Short, warm, second person: "Come in and have a look round." "Come round for a look." Labels stay plain ("Fees and funding").
14. Word budgets (S4): hero ≤25 words; section body ≤30; door label ≤3 words plus a line ≤8; fact ≤8; H1 ≤8 words; H2 2 to 5 words; inner sections ≤120 words; inner pages ≤900 words.

### Accessibility (WCAG 2.2 AA)
15. `audit.mjs` must report **0 blockers, 0 major, 0 minor** and `viewports.mjs` no flags at all 9 widths.
16. Focus: a 3px ink outline with a lamp-yellow halo (lamp outline on the dusk band). Never remove it.
17. Tap targets 44px or more. Links that stand alone in lists, fact rows and folds get a 44px row (`.lines li > a`, `.facts dd > a`, `.solo > a`).
18. All motion stops under `prefers-reduced-motion`. The chimney smoke loops for 8s, so it has a visible **Pause** button.
19. Drawings are `aria-hidden` except the hero house, which has `role="img"` and an `aria-label` naming the variant ("Drawing of our Victorian house…").

### Known quirks of the in-house audit
- **Skip link:** a 1px skip link is flagged as a tap target. Ours keeps its full size and sits above the screen (`translateY(-300%)`, transparent) until focused. Don't change it to the 1px pattern.
- **Links with several spans:** the audit finds links by their text. Keep a space between `.room__label` and `.room__line` (and the Next door's spans), or the click check fails.
- **The call bar** is fixed. `viewports.mjs` flags anything it overlaps at the top of the page, which is one reason it stays hidden until the hero's own button scrolls away.

### Performance
20. Homepage under about 1 MB on a phone (the example is about 230 KB fully scrolled on a 3x phone: no photo above the fold, one lazy photo, fonts 51 KB for the Latin subsets). Videos load only on demand.
21. Photos WebP plus JPEG at 400 and 800px, `loading="lazy"`, with width and height set.

## 4. The space brief, and the example's measured figures

Measured with `scratchpad/tools/density.mjs` (390 by 844, iPhone UA) on 14 October 2026. A screen is 844px.

| Page | Length | Screens | Words in `<main>` | Text blocks per screen (avg) | Boxes per screen (avg) |
|---|---:|---:|---:|---:|---:|
| **Home** | 5,026px | **5.95** (≤6) | **168** (120 to 180) | **4.0** | **1.3** |
| Visit and join | 5,416px | 6.4 | 245 | 6.0 | 0.7 |
| Fees and funding | 4,971px | 5.9 | 266 | 5.0 | 0.8 |
| Our nursery | 8,037px | 9.5 | 434 | 5.1 | 0.9 |
| Our team | 4,364px | 5.2 | 172 | 4.7 | 1.5 |
| Parents | 5,488px | 6.5 | 185 | 5.9 | 0.7 |
| Gallery | 3,726px | 4.4 | 94 | 4.8 | 2.0 |
| Hire our space (sub-page) | 4,125px | 4.9 | 124 | 5.8 | 1.0 |

**Homepage, screen by screen** (text blocks / H2s / boxes): 2/0/3 · 6/1/0 · 2/1/1 · 6/1/0 · 3/1/2 · 5/1/2 (footer). Every screen meets S5. The first screen's 3 boxes are the Menu button, the Pause button and the door button.

Other homepage checks:
- **Room to breathe (S12):** 53% of the phone homepage's height has no text at all (drawings, the photo and plain colour fields). The brief asks for 35%.
- **A drawn scene or photo every 2 screens:** the house (screen 1), the house-shaped photo (screens 2 and 3), the six rooms (screen 4), the house at dusk (screen 5).
- **One per row on phones:** the essentials, the doors and every inner list. Only gallery photos sit two to a row.

**Where inner pages go past S5, and why.** S5 is written for one-idea screens, but S10 requires an "On this page" list of up to 7 links on inner pages, and lists of facts. So the screen holding the contents list (and a few screens with short lists) reach 7 to 12 text blocks, and screens with two short sections hold 2 H2s. We kept the *average* at 6 or fewer on every inner page, never more than 3 boxes on any screen, and 160px of air between sections. Don't shorten section padding to fix this: split long pages instead (S10.4).

## 5. Homepage structure (keep this order)

> Hero → The essentials → Come in → Rooms of the house (doors) → Book a visit (dusk) → Footer

1. **Hero** (`.hero`): the house drawing, H1 "A home from home in [area]" (≤8 words), one line (≤25 words with the H1), the door button "Book a visit" and "Phone 0141 …". At least 70% of the first phone screen.
2. **The essentials** (`.floor--hall`): eyebrow "In the hall", H2 "The essentials", five lines (ages, hours and days, funded hours with the council, places, grades with link), then "All the details →" to Visit and join. On desktop the hall drawing sits beside it.
3. **Come in** (`.floor--pink`): one photo in the house-shaped frame (`.housepic`; best is the real front door), eyebrow "Come in", H2 (≤5 words), one line (≤30 words), one door link to the tour film on Our nursery. No photo? Put `<svg class="art housepic__art"><use href="#room-hall"/></svg>` in the frame.
4. **Rooms of the house** (`.cutaway`, `.rooms--cutaway`): 4 to 6 rooms. Standard set: Our nursery (playroom), Food (kitchen), Outdoors (garden), Fees and funding (office), Our team (staff room), Gallery (photo wall). Swap one for Visit and join (`#room-hall`) or Parents (`#room-porch`) if that suits the nursery better. Sub-lines may use intent wording ("What it costs, and help with fees").
5. **Book a visit** (`.dusk`): the same house variant at dusk, the card "Come round for a look", one sentence, Book a visit and Phone. It ends every page.

## 6. Inner pages

Every inner page uses one frame (`.band`, `.contents`, `.sec`, `.next`, then `.dusk`):

| Page | File | Band tint and room | Eyebrow | Sections in the example |
|---|---|---|---|---|
| Visit and join | `join-us.html` | butter, `#room-hall` | The hall | Book a visit (with questions to ask), Getting a place, Opening hours (live status), What's here, Find us |
| Fees and funding | `fees-and-funding.html` | pink, `#room-office` | The office | Funded hours, When funding starts (eligible 2s in a fold), Extra hours and fees, Other help with costs |
| Our nursery | `our-nursery.html` | sky, `#room-playroom` | The playroom | A look round (tour film), Our rooms, The Digital Den (living photo), Outdoors, Food, How they learn, Inspection grades |
| Our team | `our-team.html` | mint, `#room-staffroom` | The staff room | Who runs it, Our manager, Key workers and ratios, Join our team |
| Parents | `parents.html` | sky, `#room-porch` | The porch | Notices, Getting in touch, Paying, Events, Keeping children safe, Policies (folds), Hire our space |
| Gallery | `gallery.html` | butter, `#room-photowall` | The photo wall | The photo wall (filters and mosaic) |
| Sub-page | `hire-our-space.html` | any | the parent page's name | starts with "← Back to Parents" (`.back`) |

- **Food** can be its own page (`food.html`, band butter, `#room-kitchen`, eyebrow "The kitchen") when the nursery publishes a menu. Then point the Food door at it. In the example it is a section of Our nursery because the nursery publishes no menu.
- "On this page" appears only with 3 or more sections. Max 7 links.
- Sections: H2 plus at most 120 words and one list, table, image or film. Reference material (eligibility rules, policies, transcripts) goes in `.fold` `<details>`.
- Policies: a list of `<details>`, each with a 2-line summary and the link. Never one long page.
- **Next door** order: Visit and join → Fees and funding → Our nursery → Our team → Parents → Gallery → Visit and join.
- On desktop (≥1000px) each section's H2 sits in its own left column (sticky) and the content on the right. `.sec--wide` turns that off (the gallery).

## 7. Responsive layout

| Width | What changes |
|---|---|
| 360 to 599 | 24px gutters. Everything one per row; gallery 2 columns. Menu sheet. Call bar after the hero. |
| 600 to 899 | 40px gutters. Doors 2 per row (phone tile layout). Menu sheet. Call bar. |
| 900 to 999 | Hero, Come in and the dusk band go two columns. Doors become the **cutaway house** (3 by 2 under the roof). No call bar. |
| 1000 to 1239 | 64px gutters. Inner sections go two columns (H2 left). Menu still a sheet. |
| 1240 and up | Inline menu (6 items + Book a visit). Container 1,120px. |

## 8. Components (all in `styles.css`)

| Component | Class or id | Notes |
|---|---|---|
| House front | `#house-villa`, `#house-cottage`, `#house-modern`, `#house-hall` | Pick the one nearest the real building. Colours come from `--h-*` properties (section 1 tokens and the `.dusk` block). Windows `.win--1` to `.win--4` light up in turn; `.smoke` puffs drift (not on `#house-modern`: no chimney). The name in the gable is SVG text: shorten long names, or move it below the gable by editing the symbol's `<text>`. |
| Door button | `.door-btn`, `.door-btn--small` | The front door: brick fill, inner panel line, lamp knob, lifts 2px. Only ever says "Book a visit". |
| Phone link | `.phone-link` (pages), `.phone-btn` (call bar) | Always "Phone 0141 …" with the number. |
| Door link | `.more` inside `.after` | Exactly one per homepage section. |
| Floors | `.floor`, `.floor--hall/pink/mint/butter/sky/quiet` | Floorboard rule on top; `--hall` adds the skirting board. No wavy or torn edges. |
| Roofline eyebrow | `.eyebrow` | A small inverted-V roof above the label. |
| The essentials | `.essentials` | 5 `<li>`, each an icon (`#ico-peg`, `#ico-clock`, `#ico-piggy`, `#ico-chair`, `#ico-star`) and ≤8 words. |
| House-shaped photo | `.housepic`, `.housepic__frame` | Pitched top via `clip-path`, with an ink keyline. |
| Rooms (doors) | `.cutaway`, `#cutaway-roof`, `.rooms--cutaway`, `.room`, `.room__label`, `.room__line` | Rooms: `#room-playroom`, `#room-kitchen`, `#room-garden`, `#room-office`, `#room-staffroom`, `#room-photowall`, `#room-hall`, `#room-porch`. |
| Dusk band | `.dusk`, `#dusk-sky` | Redefines `--h-*` for night. Cream card with one H2, one sentence, two actions. |
| Page band | `.band`, `.band--tint`, `.band__art` | The room drawn large. Skirting board along the bottom. |
| On this page | `.contents` | 48px rows, ↓ arrows. |
| Sections | `.sec`, `.sec--wide`, `.body`, `.measure` | |
| Lines and facts | `.lines`, `.lines--icons`, `.facts` | Hairlines are background gradients, not borders, so they don't read as boxes. |
| Grades | `.grades` | Table with 6 pips per row (decorative) plus "4, Good". |
| Room rows | `.roomrows`, `.roomrow--cosy/curious/bears/big` | `#ico-bear` tinted by `--bear`. Use the nursery's real room names; swap the bear for another animal or object if its rooms are named differently. |
| What's here | `.here` | `#ico-tree`, `#ico-pot`, `#ico-radio`, `#ico-pan`, `#ico-parking`. Only real amenities. |
| People | `.people`, `.person`, `.person__frame` | A drawn door-shaped frame with an initial. Swap in a photo only with the person's written consent. |
| Folds | `.fold`, `.solo` | `<details>` with 56px summaries. |
| Notice | `.notice[data-show-from][data-show-until]` | Closures, snow, deadlines only. Put inside `#notices` on Parents (and above the essentials on the homepage if urgent). |
| Live status | `.status[data-hours]` | `{"days":[1,2,3,4,5],"open":"08:00","close":"18:00","closed":["2026-12-25"]}`, UK time. Only the nursery's own closure dates. |
| Tour film | `figure.film[data-film]`, `.film__play` | See section 10. |
| Living photo | `figure.living`, `video[data-living]`, `.living__btn` | See section 10. |
| Gallery | `.filters`, `.mosaic`, `.drawn`, `.drawn__box` | `data-filter` buttons over `data-group` items. 3 or 4 filters at most. |
| Back link | `.back` | "← Back to [parent]" on sub-pages. |
| Next door | `.next`, `.next__door` | The next room, drawn small. |
| Call bar | `.callbar` | Phones and tablets under 900px. |

## 9. Tokens and re-theming

Section 1 of `styles.css`. Contrast is WCAG, computed:

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--wall` | `#FBF6EE` | Page ground | Ink 12.0:1 |
| `--wall-2` | `#F3EADB` | Footer, skirting | Ink 10.8:1 |
| `--ink` | `#23324A` | Text and all drawn lines | |
| `--brick` | `#A63E2A` | Door button, links | White on it 6.3:1; on wall 5.8, pink 4.8, mint 5.1, butter 5.3, sky 5.1 |
| `--brick-deep` | `#8A3020` | Hover | White on it 8.3:1 |
| `--sage` | `#3F6B50` | Eyebrows | Wall 5.7, pink 4.7, mint 4.9, butter 5.2, sky 5.0 |
| `--muted` | `#5B6475` | Small print only | Wall 5.5, wall-2 5.0 |
| `--lamp` | `#F4D27A` | Lit windows, focus halo, pips | Ink on it 8.8:1. Never a text colour on light grounds |
| `--pink`, `--mint`, `--butter`, `--sky` | `#F6DCD3`, `#DCEBDD`, `#FAEBC0`, `#DCEAF4` | Floor and band tints | Ink 9.9 to 10.9:1 |
| `--dusk` | `#23324A` | Book a visit band | Wall text 12.0:1, lamp 8.8:1 |
| `--h-wall`, `--h-wall2`, `--h-roof`, `--h-door` | | The house front | Decorative |

### How to re-theme for a new nursery
1. **Pick the house variant** nearest the real building and use it in the hero and the dusk band.
2. **Recolour the house** from its photos: `--h-wall` (stone or render), `--h-roof`, `--h-door` (the real door colour). Keep the windows lamp-yellow.
3. **Brand colour:** `--brick` may change to the nursery's own colour only if white on it stays at 4.5:1 or more and it reaches 4.5:1 on every tint. Compute it; don't guess.
4. Keep `--ink`, `--wall` and the four tints unless the nursery's palette clearly demands otherwise; then recompute every pair in the table.
5. Replace the name in the house symbol's `<text>`, the header and the footer.
6. Keep the fonts. Sniglet only for H1, H2, the brand, door labels and the menu sheet; never for body text.

## 10. Video

**Tour film: "A look round"** (`figure.film[data-film]` on Our nursery, linked from the homepage's Come in section).
- `<video controls preload="none" playsinline crossorigin="anonymous" poster>`, an MP4 source, a WebVTT `<track kind="captions" default>`, and a transcript in a fold. **Every `<video>` with a `<track>` must carry `crossorigin="anonymous"`**, or the captions load nothing in the sandboxed board preview.
- JavaScript hides the native controls behind a big lamp-yellow play disc until clicked. No autoplay, no sound unless the film has it and the viewer asks.
- Best: the nursery's own walk-through, starting outside the front door, then the hall, the empty rooms, the kitchen and the garden. No children. Re-encode small (`ffmpeg -crf 30`, 960px wide).
- **The example's film** is honest about what it is: the nursery has no footage without children, so it is a 31-second, 0.9 MB film made with ffmpeg from five of its real photos (slow pans and fades), labelled "Made from our own photos, with no sound. No children are shown."

**Living photo** (`figure.living` in the Digital Den section).
- `<video data-living data-src="…" poster muted loop playsinline preload="none">`. It plays only on screens 700px and wider with no reduced-motion request; everyone else sees the poster and downloads nothing. A Pause button appears when it plays.
- Under 1.5 MB, 6 to 10 seconds. The example's is an 8-second, 118 KB slow pan across one real photo of the sensory corner, labelled as such.

## 11. Illustration rules

- Hand-coded SVG only, in the sprite. **2px slate lines, rounded joins, flat tint fills.** Objects, plants, animals (a cat, a robin, a teddy on a shelf) and weather. **No people, no faces of children, no figures.**
- Shapes come from houses: pitched roofs, gables, four-pane windows, a door with a fanlight, floorboards.
- Motion (none under reduced motion): windows light one by one (120ms apart, once); smoke drifts on an 8s loop with Pause; doors lift 2px on hover or focus.

## 12. Pre-handover checklist

- [ ] Every fact traced to the nursery's site or Care Inspectorate record; unknowns say "phone to check".
- [ ] Grades: summary and date on the homepage; every theme, both dates and the link on Our nursery; headings match the report's framework.
- [ ] Funded status and council confirmed (§3.1); "1,140 funded hours, with [council]".
- [ ] No identifiable child in any photo, crop or video frame; artwork names blurred; metadata stripped; `img/CREDITS.txt` complete.
- [ ] House variant and door colour match the real building.
- [ ] Homepage: hero + at most 5 sections; 120 to 180 words in `<main>`; ≤6 phone screens; density per screen within S5.
- [ ] Every homepage section ends with exactly one door link; doors 4 to 6, each one link.
- [ ] Inner pages: band, "On this page" (3+ sections), sections ≤120 words, page ≤900 words, Next door, dusk band.
- [ ] Sprite pasted identically into every page; drawings show on the board preview (`http://localhost:4391/templates/…`).
- [ ] `node pipeline/audit.mjs <url> <out>`: 0 blockers, 0 major, 0 minor.
- [ ] `node pipeline/viewports.mjs <url> <out>` on every page: no flags at all 9 widths. Look at 390, 768 and 1280 yourself.
- [ ] Homepage under about 1 MB on a phone; videos `preload="none"`.
- [ ] "Page last reviewed" date in the footer.
- [ ] `node pipeline/template-thumbs.mjs nursery/open-house` if the template changed.

## 13. The example: My Second Home, Cardonald. Sources, and facts to confirm

**Why this nursery:** it describes itself as "a second home", in "a large, charming Victorian house" in Cardonald, family-run, 34 places (Care Inspectorate). Its own logo is a drawn house. It is an Average-graded prospect whose current site is a lead-generation funnel (free guides, webinars, a map embed and forms that send data to "Healthy Steps Nursery").

**Sources:** mysecondhomenursery.co.uk (home, /about-us, /programs, /check-availability, /facilityhire-1, /funded-places), crawled 14 October 2026; Care Inspectorate record CS2017357823 via `prospects/nursery/data/page-050.json` (manager, places, phone, email, grades: care, play and learning 4, setting 5, staff team 4, leadership 5; inspected 30 January 2024, published 7 March 2024).

**Facts to confirm with the nursery before launch:**
1. **Phone number:** the example uses 0141 882 0286 (Care Inspectorate register). The website shows only the mobile 07883 282110. Which should lead?
2. **Email:** the example uses info@mysecondhomenursery.co.uk (register). The current website's footer shows info@healthystepschildcare.co.uk.
3. **Days:** "Monday to Friday" is inferred: the site gives 8am to 6pm, and offers the building for hire on weekday evenings and all weekend. Confirm, and supply closure days for the live status.
4. **Funded hours:** the site says 3 to 5s and eligible 2s, 1,140 hours spread over the year (23 hours 45 minutes a week), from "the Monday after their third birthday". Confirm with Glasgow City Council's current provider list and start rules.
5. **Places:** none published ("phone to check").
6. **Fees:** none published. The site mentions supplements for longer sessions and one monthly payment.
7. **Tax-Free Childcare:** the site lists it as help; confirm the nursery is signed up before saying "we accept".
8. **Team:** Angela and Dior (Managing Directors), Lindsay Smith (manager on the register; not named on the website). Confirm names, roles, qualifications and whether staff photos may be used. Which owner is the "certified Early Years Yoga teacher"?
9. **Rooms:** Cosy Cubs (0 to 2, six babies), Curious Cubs (2 to 3), Brilliant Bears (3 to 4 and 4 to 5). The site calls both older groups "Brilliant Bears"; confirm room names.
10. **Parking:** "ample parking" appears on the facility-hire page; confirm it applies to drop-off.
11. **Policies:** only a privacy notice is online (and it names Healthy Steps). Ask for the policy list, a complaints procedure and an accessibility statement.
12. **Photos:** all six are from the current site, cropped and blurred as `img/CREDITS.txt` explains; confirm consent for reuse. No front-door, garden, kitchen or food photos exist yet (see `PHOTO-SHOTLIST.md`).
13. **Care Inspectorate link:** `ciUrl` is the register search for the name; replace it with the service's own record URL if a stable one exists.
