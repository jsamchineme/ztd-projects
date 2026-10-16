# Sunny Side: a nursery template where the emblem opens into the site

> Pipeline name: **Sunny Side** (folder `templates/nursery/sunny-side/`). It is one of the four "spacious" nursery directions in `prospects/research/nursery-spacious-directions.md` (direction 2), built to fix the owner's complaint about our first 11 nursery templates: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages."*

**The idea in one line:** many nurseries are named after the sun, a flower, a tree or a bird. Sunny Side draws that **emblem** (never with a face) as the brand, and opens it into the navigation: a **flower of doors** whose centre is "Book a visit" and whose petals are the inner pages. Around it sits a wide, calm **sky** with very few words. A tiny **companion** (here a bee) appears in exactly three places: the hero, the Book a visit band and the 404 page.

The homepage is a short summary (156 words, 5.7 phone screens). Everything else lives on six calm inner pages, each opening with the same tinted band, so a parent always knows which petal they tapped.

Read these once before your first build:
- `prospects/research/nursery-spacious-directions.md`: **the space brief (S1 to S13) is binding.** Rule numbers like **S5** below point into it.
- `prospects/research/nursery-websites.md`: §3 (Scottish facts), §3.6 (what a nursery may claim), §4 (trust), §5 (photos and children), §6 (structure). Section numbers like **§3.6** point into it.
- `prospects/research/nursery-colourful-directions.md`: the shared rules for gallery, video and contrast (its word budget is replaced by S4).
- `prospects/research/nursery-sites-3/sunflower.md` and `playhouse.md`: where the patterns come from.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token, with computed contrast notes. | Tokens only (section 1) |
| `sunnyside.js` | About 200 lines of plain JavaScript, no dependencies: the menu sheet, live status and the sun on the sun arc, dated notices, the phone call bar, the living photo, gallery filters and lightbox. Respects `prefers-reduced-motion`. | Never. It reads its data from the page |
| `fonts/` | Young Serif 400 (headings, the name) and Plus Jakarta Sans 400 to 600 (variable, body and interface), Latin and Latin Extended woff2 subsets, 84 KB in all (43 KB for Latin). SIL OFL in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | What to photograph, in order of value, for the nursery or a site visit. | Hand to the nursery |
| `example/` | A complete worked example for **Sunshine Nursery, Glenrothes** (Fife), a real prospect, built only from its own website, its Care Inspectorate report and our prospect data. Eight pages: `index.html`, `join-us.html`, `fees-and-funding.html`, `our-nursery.html`, `our-team.html`, `parents.html`, `gallery.html`, `404.html`. | Copy it for each nursery |
| `example/img/` | The nursery's own photos (WebP at 400px and full size, JPEG fallback), two videos made from them (`garden-loop.mp4`, `tour.mp4` with `tour.vtt`) and `CREDITS.txt`, which also lists every photo **not** used and why. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/sunny-side`. | After changes |

Pages link `../styles.css` and `../sunnyside.js`; fonts load from `../fonts/` through the stylesheet. Keep that folder shape. No build step, no framework, and nothing loads from another server: no Google Fonts, CDNs, analytics, maps or social embeds (GDPR, §6.6).

**The SVG sprite is inline at the top of every page** (`<svg class="sprite">`), and drawings use `<use href="#id">`. Board previews are sandboxed, so an external `file.svg#id` draws nothing there. Never move the sprite to a file.

---

## 1. Concept, and what it avoids

Sunflower Nursery (Ilford) feels open because of big light headings on a lot of soft sky, single white cards with one action, and a calm band at the top of every inner page. It goes wrong with 13px text, white text on yellow, a 3D AI-looking mascot, carousels and a 4,682-word hub page. Our 11 earlier templates go wrong differently: 8 to 10.5 text blocks per phone screen, 2 by 2 fact boxes with three tiers of text, and homepages 14 to 20 screens long.

Sunny Side keeps Sunflower's calm and drops everything else:
- **Few things per screen.** One idea per phone screen, one item per row, hairline lists instead of boxes.
- **The emblem is the brand and the map.** A flat, hand-coded sun (or flower, acorn, thistle…) of repeated petal paths, three tones, **no face and no limbs**. On desktop it becomes the flower of doors; on phones the petals stack as full-width coloured bands.
- **Colour means page.** Each petal has its own tint, and that tint becomes its page's band, its "Next" door and its menu dot.
- **The facts stay plain.** The sunny tone is in the headings and the drawings, never in the facts: "Places: phone to check", "Care Inspectorate: Good and Very good, February 2025".

It must not use any of the existing signature devices (luggage tags, cork boards, full-stop headlines, storybooks, weather tiles, recipe cards, leaf corners, torn paper, boxed fact rows, a posing mascot, highlighted-word headings, clock boxes, dashed day paths, wave seams, ringed circle photos, big-number cards, watercolour blobs, one-word photo tiles, pastel room blocks, arch frames, hi-vis stripes). Photos sit in soft rounded rectangles (24px); never circles.

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Homepage = hero, the essentials, the intent pair, the flower of doors, Book a visit, footer.** Nothing else. | S3: hero plus at most 5 sections, at most 6 phone screens. Weekly menus, grade tables, timelines, team lists and FAQs are banned from the homepage. |
| 2 | **120 to 180 words in `<main>`.** The example has 156. | S4. Playhouse's welcome alone is 229 words; Sunflower's curriculum block 232. |
| 3 | **Hero: name, H1, one sentence, Book a visit and Phone.** At least 70% of the first phone screen, mostly sky and sun. | S2 hero rule; S12 (35% of the homepage is picture or plain colour). |
| 4 | **The essentials as one list with seed-sized suns, not boxes**, and the hours drawn as the **sun arc**. Grades line links straight to the report. | S9. Our old 2 by 2 fact grids put 8 to 13 boxes on the first screen. |
| 5 | **Intent pair** ("We're looking for a nursery." / "What will it cost?"): two white cards on sky, one door each. | Sunflower's best homepage device (sunflower.md, "What's lovely" 2). Parents' own questions route them deeper. |
| 6 | **Flower of doors**: 6 petals, each a whole-tile link with a drawing, a label of up to 3 words and a line of up to 8. | S9 doors; S6 one per row on phones; S7 24px gaps. |
| 7 | **Every inner page opens with a tinted band**: breadcrumb eyebrow, H1 of up to 6 words, intro of up to 35, one action, "Questions? Phone…" and the page's own drawing in a ring of rays. | Sunflower's band and "Want to know more?" note; S10. |
| 8 | **"On this page"** as a plain vertical list of anchors, 48px rows, on pages with 3 or more sections. | S10 item 2. Not tabs. |
| 9 | **Short sections** (an H2 and up to 120 words, one list or image), long material in `<details>`. | S10 item 3; Sunflower's and Playhouse's long hub and policy pages are the anti-pattern. |
| 10 | **"Next" door then the Book a visit band at the foot of every inner page.** | S10 item 5. |
| 11 | **One action wording, "Book a visit", in gold, everywhere**; the second action is always "Phone 01xxx xxxxxx". | S13; Playhouse's single repeated "Enquire now". |
| 12 | **Menu: 6 items plus Book a visit.** Phones get a full-height sheet (a modal `<dialog>`) with 56px rows in the same order as the doors, then Book a visit and Phone. | S11. Playhouse's 12 flat items printed twice is the anti-pattern. |
| 13 | **Sticky call bar on phones** (Book a visit, Phone), tucked away while the hero, page band, Book a visit band or footer is on screen, and the page padded by its height. | S11; Playhouse's floating Enquire pill. |
| 14 | **Brown "soil" ink instead of black**, gold for the button with soil text (never white), leaf green links. | Sunflower's palette idea, made to pass: its white-on-yellow pills are 1.4:1. |
| 15 | **Living photo and tour film**, self-hosted, honest labels. | nursery-colourful-directions.md "Video, in two kinds". |
| 16 | **Gallery page** with filter buttons in the petal tints and a 2-column grid with captions; a `<dialog>` lightbox. No carousel. | colourful directions "Gallery"; §6.4. |
| 17 | **No people drawn.** The companion is a bee with no face; the emblem has no face. | Project rule; the line between this and Sunflower's mascot and our Sidekick. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, ratio, policy and service must come from the nursery's current site or documents, or its Care Inspectorate record (`prospects/nursery/data/*.json`, the datastore CSV, the report). §3.6 is binding. Use its "Otherwise write" wording: "Phone us for our current fees", "Phone us to check for places", "Ask us about staff ratios when you visit".
2. **Grades:** the homepage line carries the summary, month and year, and links to the report. The full set, with the exact key-question headings of that report and its dates, goes on Our nursery (`#grades`). Reports before 22 September 2025 use the old key questions ("How good is our care, play and learning?" and so on); later ones use the new framework. Don't relabel. Never use the Care Inspectorate logo.
3. **Ratios:** only print a ratio the nursery itself publishes (Sunshine does, per room).
4. **Funded status** changes. Write "1,140 funded hours, with [council]" only when the nursery says it is a partner or funded provider, and confirm at build time.
5. **Reviews and quotes** only from the nursery's own site or report, attributed as it does.
6. Where sources disagree, use the newest dated source and list the disagreement in your report.

### Photos (§5)
7. **No identifiable children, ever.** Treat any old-site image with a child in it as excluded. Crop where a person is at the edge.
8. Allowed: empty rooms, garden, entrance and sign, food as served, artwork without names, staff with their own written consent.
9. Strip metadata. Record every photo used and every photo rejected, with the reason, in `img/CREDITS.txt`.
10. The template must look finished with **no photos**: remove the intent photo and the homepage is still complete; inner pages carry their band drawings.

### Space (the space brief; check with the density script)
11. **Gutters** 24px on phones, 40px from 600px, 64px from 1024px; content at most 1,120px; text at most 60ch (S1, S8).
12. **Section padding** `--space-section` (80px phone, 128px desktop). Don't reduce it (S2).
13. **Per phone screen (844px):** at most 1 H2, 6 text blocks (7 on the first), 1 primary and 1 secondary action, 3 boxed elements (S5). Hairlines in lists are pseudo-elements, never borders on each row.
14. **One item per row on phones** for anything with more than a 3-word label. Never 3 per row. Chips: 4 per group at most (S6).
15. **Homepage:** at most 6 phone screens and 120 to 180 words in `<main>` (hard limit 200). Every content section ends with exactly one door link.
16. **Inner pages:** up to about 900 visible words; split into a sub-page with "← Back to [parent]" (class `.back`) if they grow.

### Content style
17. Plain English at reading age 9 to 11. Times "7:30am", "6pm", "midday"; ranges with "to"; days and months in full. Links start with a verb unless they are navigation.
18. Phone numbers are `tel:+44…` links shown as written locally. 999 is plain text in `<strong>`.
19. No pop-ups, carousels, auto-advancing anything, chat widgets, feeds, map embeds or trackers. A "Get directions" link instead of a map.

### Accessibility (WCAG 2.2 AA)
20. Keep the token pairs in section 7. Text 4.5:1 at least; body ink is 9.8:1 or better on every ground. UI edges and focus 3:1.
21. One `h1` per page; `h2` per section; `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. The skip link is the first element in `body`.
22. Focus is a 3px soil ring with a white halo (gold on the footer). Never remove it.
23. Tap targets 44px. Drawings are `aria-hidden="true"`; every link and button has a text name.
24. Motion only inside `prefers-reduced-motion: no-preference`; the hero sun rises, turns and glows twice while the clouds drift in and the bee flies in and bobs once; the little sun climbs the sun arc to the current time when it is first seen; the companion in the visit band bobs 3 times. The sun in Explore (`data-sun-play`) turns and glows each time it scrolls into view, then rests. Every animation stops within 5 seconds, so nothing needs a pause control (WCAG 2.2.2); don't add a continuous loop.

### Known quirks
25. **The board preview blocks the fonts** (the sandbox gives the page a null origin and `/templates/` sends no CORS header), so the preview at `localhost:4391/templates/…` shows Georgia and system sans. That affects every template; the real site and `http-server` are fine. Drawings render there because the sprite is inline.
26. Council sites (Fife included) refuse automated checks; the audit reports them as "couldn't be verified", information only. Check them by hand.
27. Don't link Facebook from the footer (the audit gets a 400 minor).

### Performance
28. Homepage under about 1 MB on a phone. The example weighs **160 KB on a phone** (the living photo stays a poster) and **about 485 KB at 1280px** (the 323 KB loop plays).
29. Photos: WebP at 400px and full size (quality about 62), JPEG fallback (about 74), `width` and `height` set, `loading="lazy"` below the fold.

## 4. Homepage structure (keep this order)

Measured on a 390 by 844 phone (the example):

| # | Section | Classes | Holds | Screen |
|---|---|---|---|---|
| 0 | Header | `.site-header`, `.brand`, `.site-nav` (from 70em), `a.menu-toggle[data-menu-open]`, `dialog#menu-sheet` | Emblem mark, name, town; Menu | 1 |
| 1 | **Hero** | `section.hero` > `.hero__art` (emblem, 2 clouds, dashed trail, `.hero__bee`) + `.hero__text` | `p.hero__name` "[Name], [Town]"; `h1` (up to 8 words; the nursery's own line if it has one); `p.hero__lead` (one sentence, ages and weeks); `.actions` with `a.btn` Book a visit and `a.call-link` Phone | 1 |
| 2 | **The essentials** | `section.essentials` > `h2` + `ul.essentials__list` + `p.more` | 5 lines, up to 8 words each: ages; hours as `li.essentials__hours` holding the **sun arc**; funded hours with the council; places; grades (a link to the report). Then "All the details →" | 1 to 2 |
| 3 | **Intent pair** | `section.section--sky.intent` > optional `figure.living.intent__photo` + `h2` + `ul.intent__list` of 2 `li.intent-card` | Each card: `p.intent-card__q` (up to 8 words) and one `a.go` door | 3 |
| 4 | **Flower of doors** | `section.doors` > `.doors__head` (96px emblem mark, `h2`) + `.flower` > `ul.flower__petals` of 4 to 6 `li.petal.petal--{key}` + `.flower__centre` (desktop) | Each petal: `a` > `svg.petal__mark` (petal shape + drawing), `span.petal__label`, `span.petal__line`, arrow | 4 to 5 |
| 5 | **Book a visit band** | `section.visit` > `.visit__card` with `svg.visit__bee` on its top edge | `h2`, one line, Book a visit, Phone | 5 |
| 6 | Footer | `footer.site-footer#site-footer` | Name; address, phone, email; all pages (`nav#site-footer-nav`, the no-JS target of Menu); Care Inspectorate record, complaints, directions; operator, service number, review dates | 5 to 6 |
| – | Call bar, schedule | `div.callbar[data-callbar]`, `script#nursery-schedule` | | |

**Where to put a photo on the homepage:** only in the intent section, as the living photo (or a plain `figure.photo` with an `img`). Keep it to one. If the nursery has none, leave it out; the page still reads well.

**The H2 per screen rule is tight.** Each of the four H2s must start in its own 844px screen. If you add words to the hero or essentials and the essentials H2 slips into screen 2, the density check will show 7 text blocks there; shorten the hero sentence or the essentials lines rather than cutting padding.

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no layout flags on any page.

| From | What changes |
|---|---|
| 0 | One column. Gutters 24px. The hero sun sits top right, partly off the edge, with the bee and its dashed trail on the left; text below. Doors are **full-width petal bands** (edge to edge, alternating which corner gets the 28px petal curve) with 24px between them. |
| 30em (480px) | Buttons stop being full width. |
| 37.5em (600px) | Gutters 40px. Doors become petal cards, 2 per row. |
| 48em (768px) | Body 19px. Intent cards 2 per row. The page band puts its drawing beside the text. "On this page" in 2 columns. The call bar goes. |
| 56em (896px) | Hero in two columns (text left, big sun right). Essentials sit beside their heading. The intent photo sits beside the heading and cards. Footer in 2 columns. Gallery 3 columns. |
| 64em (1024px) | Gutters 64px. **The flower of doors:** six petals in two arcs either side of a 25rem sun whose centre is the "Book a visit" link. Rooms 3 per row. |
| 70em (1120px) | Full menu row with the Book a visit button; Menu goes. Links stay on one line; the current page has a gold underline. |
| 80em (1280px) | Body 20px. |

The DOM order of the petals runs left, right, left, right, left, right on desktop, so reading and tab order match what people see. On phones and for screen readers the petals are a plain list.

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn`, `.btn--small`, `.btn--block` | The gold main action with soil text and a 3px darker bottom edge. "Book a visit" only (or "Phone …" on Visit and join and Parents, where the visit is the page). |
| `.call-link` | The secondary "Phone 01xxx xxxxxx" link with a handset icon. |
| `.go` | A stand-alone door link with an arrow, 44px tall. One per content section. |
| `.back` | "← Back to [parent]" at the top of a sub-page. |
| `.essentials__list`, `.essentials__hours`, `.seed` | The essentials list. Seeds are the 24px emblem bullets. |
| `.sun-arc[data-sun-arc][data-cx][data-cy][data-rx][data-ry]` | The sun arc: horizon, hills, half-sun arc, the opening time at the left foot and closing time at the right, days below. The script slides the little sun along the arc while open and hides it when closed. Real hours only. Screen readers hear "Open 7:30am to 6pm" from visually hidden words. |
| `.intent__list`, `.intent-card`, `.intent-card__q` | Intent pair. |
| `.flower`, `.flower__petals`, `.petal.petal--{visit|fees|nursery|team|parents|gallery}`, `.petal__mark`, `.petal__label`, `.petal__line`, `.flower__centre`, `.flower__book` | Flower of doors. |
| `.visit`, `.visit__card`, `.visit__bee` | Book a visit band (sun pattern, single card, bee on the edge). |
| `.page-band.page-band--{key}`, `.crumb`, `.page-band__intro`, `.page-band__note`, `.page-band__art` | Inner page band. The art is the page's drawing inside a ring of rays in `--deep-{key}`. |
| `.on-page` | "On this page". |
| `.next`, `.next-door.petal--{key}` | The "Next" door, coloured as the page it leads to. |
| `.section`, `.section--sky`, `.section--cream`, `.prose`, `.section-head` | Sections. Alternate white and cream on inner pages. |
| `.ruled` | Hairline list with seed bullets; `small` for a second line. |
| `.steps` | Numbered process with sun-disc numbers (enrolment, complaints). |
| `.summary` | Key and value rows (`dl`). |
| `.note` | One important point on a tint (999, deadlines). |
| `.rooms`, `.room.room--a/b/c`, `.room__mark`, `.room__age`, `.room__ratio` | Rooms by age, one per row on phones, 3 across on desktop. |
| `.whats-here` | The nursery's real amenities: a drawing and up to 4 words each (Playhouse's "Everything families need", made as HTML). Only amenities the nursery or its report confirms. |
| `.people`, `.people--2`, `.person`, `.person__sun` | Staff: initials in a small sun, name, role, a `dl` of facts, an optional quote in their own words. A consented portrait can replace the sun (a 64px rounded square, not a circle). |
| `.grades`, `.suns[data-grade]` | Every key question with its grade word and six small suns (decorative, `aria-hidden`). |
| `.details` | Folded reference material (`<details>` rows with a plus that turns). Policies, staff lists, "what the letters mean", help with costs. |
| `.meals`, `.meals__day` | **The meal schedule** (see below). |
| `.status[data-status]` + `[data-status-text]` | Live open or closed pill (Parents). |
| `.notice-band[data-show-from][data-show-until]` > `.notice` | Dated closure notice in the page flow. |
| `.photo`, `.photo--wide` | A figure with a 24px-radius photo and caption. |
| `.living[data-living]`, `.living__toggle` | Living photo (section 10). |
| `.tour` | Tour film (section 10). |
| `.filters`, `.mosaic`, `.lightbox` | Gallery (section 11). |
| `.lost`, `.lost__peek`, `.lost__horizon` | 404 page with the peeking companion. |
| `.visually-hidden`, `.nowrap`, `.eyebrow`, `.lede`, `.more`, `.source` | Utilities. |

### The meal schedule (Food)
Use it only with a real menu from the nursery. Phones get one day per block, never a sideways-scrolling table. Allergens in `<strong>`.

```html
<ul class="meals">
  <li class="meals__day">
    <h3>Monday</h3>
    <dl>
      <div><dt>Breakfast <time>8am</time></dt><dd>Porridge with banana (<strong>milk, oats</strong>)</dd></div>
      <div><dt>Lunch <time>11:45am</time></dt><dd>Chicken casserole, rice and peas</dd></div>
      <div><dt>Tea <time>3:15pm</time></dt><dd>Toast fingers and cucumber (<strong>wheat</strong>)</dd></div>
    </dl>
  </li>
  …
</ul>
```
The example nursery doesn't publish a menu (and its 2025 report says parents provided lunches), so its Food section says "Phone us to check what to send for lunch, and what snacks we provide". Don't show the schedule with made-up food.

### Group nurseries
For a group with 2 to 5 sites, add an "Our nurseries" petal and page: one `li.room` per site with a building-front photo (`figure.photo`), the street name as the `h3`, its phone, and a door to its sub-page. One per row on phones. Sub-pages open with `a.back` "← Back to Our nurseries".

## 7. Tokens (section 1 of `styles.css`)

| Token | Default (Sunshine) | Role, and the rule to keep |
|---|---|---|
| `--sky` | `#D7EEF5` | Hero, intent band, visit band, header. Soil on it 10.4:1; leaf 5.3:1. |
| `--paper`, `--cream` | `#FFFFFF`, `#FFF9EC` | Page and cards; the alternate quiet band (soil 12.0:1). |
| `--soil` | `#4A2C20` | **All text.** 12.6:1 on white. |
| `--soil-soft` | `#6B5247` | Small print only: 7.2:1 on white, 6.0:1 on sky. |
| `--leaf`, `--leaf-strong` | `#2F6B3A`, `#245A2E` | Links: 6.4:1 on white, 5.0:1 on the lowest tint (lilac). Hover 8.1:1. |
| `--gold`, `--gold-strong`, `--gold-edge` | `#F2B705`, `#E0A100`, `#B07F00` | The button: soil text on gold 6.9:1. **Never white text on gold (1.8:1).** The edge is 3.6:1 on white so the button shape reads. |
| `--sun-disc`, `--sun-glow`, `--sun-core` | `#FFC21A`, `#FFD54D`, `#FFE38A` | The emblem's three tones. Decorative only. |
| `--tint-{key}` / `--deep-{key}` | visit `#FFF1C2`/`#F6D77A`, fees `#E3F1DA`/`#B9DCA6`, nursery `#FBE0D0`/`#F2B596`, team `#E6E1F5`/`#C3B8E8`, parents `#FCE1E8`/`#F3B3C4`, gallery `#D6EFEA`/`#9FD8CB` | Petal bands, page bands, Next doors. Soil on each tint 9.8 to 11.1:1. `--deep-*` is decorative only (marks, rays, menu dots). |
| `--line`, `--line-strong` | `#E9DFD6`, `#8F786C` | Hairlines (decorative); control and empty-sun edges (4.1:1). |
| `--footer`, `--footer-ink`, `--footer-link` | `#4A2C20`, `#FFF6E3`, `#FFD54D` | Footer: 11.7:1 and 8.9:1. |
| `--focus`, `--focus-halo` | soil, white | Focus ring. Switches to gold on soil in the footer. |
| `--font`, `--font-display` | Plus Jakarta Sans; Young Serif | Young Serif for `h1`, `h2`, the name, petal labels and big times only, always at 400. |
| `--text-base`, `--text-small`, `--text-lead` | 18px (19px from 48em, 20px from 80em), 16px, 20px | Body text never below 17px. |
| `--gutter`, `--wrap`, `--space-section`, `--space-group`, `--gap-cards`, `--gap-photos` | 24/40/64px, 1,120px, 80 to 128px, 48/64px, 24/32px, 12/16px | The space brief. Don't shrink. |
| `--petal`, `--corner`, `--radius-photo` | 28px, 8px, 24px | A petal has one 28px corner and three 8px corners. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder (keep `../styles.css`, `../sunnyside.js`, `../fonts/` resolving), or copy the whole template folder.
2. **Gather facts** first (section 9 lists the sources). Crawl the old site with `node pipeline/crawl.mjs <url> <scratch>/source`, read the latest inspection report, and note where each fact came from.
3. **Choose the emblem from the nursery's name or logo**, and draw it as `#emblem` in the sprite: a set of repeated petal or leaf paths around a centre, two or three flat tones, no outline, **no face, no limbs**. It must read at 32px (the header mark) and at 480px (the hero). Keep the symbol's `viewBox="-100 -100 200 200"` so every use stays centred. **Use it in an `<svg>` without a `viewBox`** (or the symbol draws from the centre and is cropped).
   - **Sun or sunflower** (this example): the default tokens.
   - **Acorn or oak:** ink `#2E3B1F`, button `#A8C66C` (ink on it 6.2:1), band `#DCEFD0` (ink 9.8:1), links `#8A5A2B` (5.9:1 on white, 4.8:1 on the band). Emblem: oak leaves around an acorn cup.
   - **Bluebell:** ink `#2A2150`, button `#B9A6F0` (6.8:1), band `#E4E8FA` (12.0:1), links `#5B47B8` (6.9:1 on white, 5.7:1 on the band).
   - **Thistle:** ink `#3A1F45`, button `#C9A0DC` (6.5:1), band `#EFE3F5` (11.6:1), links `#7B3F9E` (6.9:1, 5.6:1).
   - **Rainbow:** keep the soil ink and gold button; the six petal tints carry the colours.
   - Re-compute every pair you change with the WCAG formula and update the notes in section 1.
4. **Companion:** pick one small animal that suits the emblem (bee for a sun or flower, a robin or wren for a tree, a ladybird for a garden name), drawn in three poses at most (`#bee-fly`, `#bee-rest`, `#bee-peek`; rename the ids if you change the animal). It appears **only** in the hero, the visit band and 404. No face.
5. **Door drawings** (`#d-visit`, `#d-fees`, `#d-nursery`, `#d-team`, `#d-parents`, `#d-gallery`, 120 by 120): redraw `#d-visit` as the nursery's own building (Sunshine's has a red gable with cloud-shaped boards). Keep the others unless the nursery has a better local object.
6. **Copy:** replace every Sunshine fact on every page. Afterwards `grep -n "Sunshine\|630485\|KY7\|Glenrothes\|Newark\|Rankin\|Carr\|Knox\|Sadco\|CS2024000070\|Fife\|Tiddlers\|Biggies" example/*.html` must return nothing from Sunshine.
7. **Schedule:** rewrite `#nursery-schedule` (section 8) on every page.
8. **Grades:** copy every heading, grade and date from the latest report into Our nursery `#grades` and the homepage line.
9. Update `<title>`, meta description, `theme-color` (= `--sky`), the footer operator line and the review dates (today, and today plus 6 months).
10. Run the checks in section 11.

## 8. The schedule (`#nursery-schedule`)

At the end of `body` on every page.

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["07:30", "18:00"]], "tue": [["07:30", "18:00"]], "wed": [["07:30", "18:00"]],
            "thu": [["07:30", "18:00"]], "fri": [["07:30", "18:00"]], "sat": [], "sun": [] },
  "term": { "from": "2026-08-12", "to": "2027-06-25", "label": "the summer holidays" },
  "closures": [ { "from": "2026-12-25", "to": "2026-12-26", "label": "Christmas" } ]
}
```
- `days`: 24-hour sessions per weekday. `term` only for term-time nurseries.
- `closures`: only dates the nursery has published, in date order. Sunshine says it closes "2 days over Christmas and 2 days at New Year" without dates, so the example lists none and the Parents page says "Phone us to check the dates".
- Wording: "Open now, until 6pm"; in the last 30 minutes "Open now. Closing soon, at 6pm"; "Closed now. Opens today at 7:30am"; "Closed now. Opens tomorrow at 7:30am" or "…on Monday…"; "Closed for Christmas. Opens on Monday 28 December at 7:30am".
- The sun arc's sun sits at the matching point of the arc while open, and is hidden when closed. Without JavaScript it sits at the top.
- Tested with Playwright's clock: Wednesday 7am (closed, opens today), 10am (sun at the left third), 5:40pm (closing soon), Friday 6:30pm and Saturday noon ("Opens on Monday at 7:30am").

## 9. Inner pages

Every page reuses the head, sprite, header, menu sheet, footer, call bar and schedule exactly. Only `<title>` ("[Page]: [Name], [Town]"), the description, the page band and `aria-current` change.

**Frame (S10):** `.page-band.page-band--{key}` → `nav.on-page` (3+ sections) → `section.section` blocks alternating white and `.section--cream` → `.next` → `.visit` → footer.

| Page | Band (H1, action) | Sections in the example |
|---|---|---|
| `join-us.html` (Visit and join, butter) | "Come and see us", Phone button | Book a visit (how, plus questions parents ask) · How enrolment works (`.steps`) · Sessions and places (`.summary`, registered places) · What's here (`.whats-here`: one card per thing, the nursery's own photo when it shows that exact thing, otherwise its drawing in `.whats-here__art`) · Find us (address, directions, sign photo). Next: Fees and funding |
| `fees-and-funding.html` (green) | "Fees and funding", Book a visit | Funded hours (council partner, 1,140 hours, how to apply) · When funding starts (birthday table, mygov.scot source) · 2 year olds · Our fees (phone for fees; sessions; registration fee) · Help with costs (`.details`: Tax-Free Childcare, Universal Credit, Parent Club). Next: Our nursery |
| `our-nursery.html` (peach) | "Our rooms and garden" | Rooms by age (`.rooms`, with the nursery's own ratios) · A look round (tour film, transcript) · Outdoors (photo) · How children learn · Food · Our inspection grades (`.grades`, every indicator in `.details`, report and register links). Next: Our team |
| `our-team.html` (lilac) | "Meet our team" | Our managers (`.people--2`) · Your child's key worker · The whole team (`.details` per group) · Staff in each room · What the letters mean. Next: Parents |
| `parents.html` (pink) | "For parents", Phone button | Opening times (live `.status`) · Sessions · Who to speak to · Paying fees · Worries and complaints (`.steps`, then the Care Inspectorate) · Keeping children safe (999 `.note`) · Our policies (`.details`). Next: Gallery |
| `gallery.html` (mint) | "Our nursery in photos" | One section: filters, grid, lightbox. Next: Visit and join |
| `404.html` (sky) | "We can't find that page" | The peeking bee on a horizon, Home and Phone |

Sub-pages (a single policy, one nursery of a group) open with `<a class="back" href="parents.html"><svg aria-hidden="true"><use href="#i-back"/></svg>Back to Parents</a>` above the H1 in the band.

## 10. Video

**Living photo** (`figure.living[data-living="our garden"]`):
```html
<figure class="living photo" data-living="our garden">
  <video muted loop playsinline preload="none" poster="img/garden.webp" data-src="img/garden-loop.mp4" width="640" height="480" aria-label="[what it shows]"></video>
  <button class="living__toggle" type="button" hidden><svg aria-hidden="true"><use href="#i-play"/></svg><span data-label>Play</span></button>
  <figcaption>Our garden, in a slow pan across one photo.</figcaption>
</figure>
```
- 6 to 10 seconds, muted, under 1.5 MB, self-hosted MP4 (H.264). Phones and reduced-motion visitors get the poster and a Play button; from 40em it autoplays with a visible Pause button.
- Honest label in the caption. The example's loop is a slow pan across one real photo (ffmpeg `zoompan`, played forward then reversed so the loop is seamless), 323 KB.
- Recipe: `ffmpeg -loop 1 -i garden.jpg -vf "scale=1280:960,zoompan=z='1.18':x='(iw-iw/zoom)*on/99':y='(ih-ih/zoom)/2':d=100:s=640x480:fps=25" -frames:v 100 pan.mp4`, then `-filter_complex "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1"` with `-c:v libx264 -crf 30 -an -movflags +faststart`.

**Tour film** (`figure.tour`):
```html
<figure class="tour">
  <video controls preload="none" playsinline poster="img/building-front.webp" width="640" height="480">
    <source src="img/tour.mp4" type="video/mp4">
    <track kind="captions" src="img/tour.vtt" srclang="en" label="English" default>
  </video>
  <figcaption>A look round [Name]. [length], no sound, empty rooms only.</figcaption>
</figure>
```
Plus a `.details` transcript ("Read what the film shows"). Click to play, poster, captions, sound only if the user asks. Title it "A morning at [name]" when it's real footage of empty rooms. The example has no real footage, so it is a 33-second **photo film** (eight of the nursery's photos with slow zooms and cross-fades, 1.2 MB), labelled as made from photos with no sound. Replace it with real footage when the nursery has some (PHOTO-SHOTLIST.md).

## 11. Gallery

- Filter buttons (`.filters button[data-filter][aria-pressed]`) take the petal tints: Rooms (peach), Garden (green), Building (butter), Food and Artwork when the nursery has them. Four groups at most. A polite live region announces "Showing n photos".
- `ul.mosaic` > `li[data-group]` > `figure` > `button[data-lightbox="img/x.webp"]` > `picture` + `figcaption`. Two columns on phones (12px gaps), three from 56em. True alt text on every image and a short caption.
- The lightbox is a `<dialog>`: Escape or the backdrop closes it, focus returns to the photo. Without JavaScript the button opens the image.
- Keep its Previous / Next icon buttons (`[data-lightbox-prev]`, `[data-lightbox-next]`, 44px+, named "Previous photo" / "Next photo") and the `aria-live` "3 of 9" count: they step through the photos the filters leave visible and wrap; arrow keys and a sideways swipe do the same. On phones they sit in a bar under the photo, from 40em on its edges.
- No homepage strip in this template (the Gallery petal is the door).

## 12. Pre-handover checklist

Any "no" blocks handover.

**Facts**
- [ ] Every fact traces to the nursery's site, documents or Care Inspectorate record; disagreements listed.
- [ ] Grades, exact headings, inspection and publication dates match the latest report; the report link resolves.
- [ ] Funded status confirmed; fees dated or "Phone us for our current fees".
- [ ] Hours and closures match the schedule JSON; weekdays checked.
- [ ] Staff names, roles, qualifications and quotes exactly as supplied; no ratio unless the nursery publishes it.
- [ ] No identifiable child in any image or video frame; metadata stripped; `img/CREDITS.txt` complete.

**Space** (run `node <scratch>/tools/density.mjs http://127.0.0.1:PORT/example/` on every page)
- [ ] Homepage 6 phone screens or fewer; 120 to 180 words in `<main>`.
- [ ] Each homepage screen: at most 1 H2, 6 text blocks (7 on the first), 3 boxes, 1 button and 1 text action.
- [ ] One item per row on phones; doors at least 96px tall with 24px gaps.
- [ ] Inner pages: band, "On this page" (3+ sections), sections of 120 words or fewer, Next door, Book a visit band; about 900 words at most.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/example/ <out>` reports **0 blockers, 0 major, 0 minor**; also run it on `404.html`.
- [ ] `node pipeline/viewports.mjs <page url> <out>` shows no layout flags at all 9 widths, on every page. Look at 390, 768 and 1280px yourself.
- [ ] Live status tested with Playwright's clock (section 8). Menu sheet: opens, Escape closes, focus returns.
- [ ] Keyboard only: skip link, menu, petals, filters, lightbox, details, video controls.
- [ ] Homepage under about 1 MB on a phone.
- [ ] Previewed on the board (`localhost:4391/templates/…`): drawings render (fonts fall back there; see quirk 25).

### The example's measured results (14 October 2026)
- **Homepage at 390px:** 4,820px (5.71 screens); **156 words** in `<main>`. Per screen (text blocks / H2s / boxes): 4/1/3 (one "box" is the off-screen skip link), 6/0/0, 4/1/3, 6/1/0, 3/1/2, 5/0/0. Averages: 4.7 text blocks, 1.2 boxes per screen (references: 5.3 to 6.0 and 1.1 to 3.8; our old templates 8 to 10.5 and 2.3 to 5.6).
- **Inner pages at 390px:** Visit and join 5,863px; Fees and funding 5,485px; Our nursery 7,433px; Our team 5,675px; Parents 6,104px; Gallery 3,483px. All well under 900 words. Their second screen holds the "On this page" list, so it counts 9 to 14 short text blocks; boxes average 0.7 to 1.6 per screen.
- **Audit:** 0 blockers, 0 major, 0 minor on all 8 pages. **Viewports:** no layout flags on any page at any of the 9 widths.
- **Weight:** 160 KB on a phone, 295 KB at 1280px.

## 13. Sunshine Nursery example: sources, and facts to confirm

**Sources:** mysunshinenursery.co.uk (7 pages, crawled 14 October 2026), its uploaded Care Inspectorate report (inspection 6 and 11 February 2025, published 1 April 2025, service CS2024000070), and our prospect record `n068-02`. Fife Council's ELC page was found by search; it blocks automated checks.

Confirm with the nursery before go-live:
1. **Address.** The site says "Unit 4 Newark Road, Eastfield Business Park, Glenrothes KY7 4NS"; the Care Inspectorate says "Newark Road South". The example uses the site's.
2. **Funded hours.** The site says "We are in partnership with Fife Council so your child may be entitled to funding". Confirm partner status and whether it takes **funded 2 year olds**.
3. **Fees and the registration fee.** Not published; the example says to phone. The FAQ asks "What is included in the fees?" with no answer.
4. **Closures.** "2 days over Christmas and 2 days at New Year": which dates? None are in the schedule.
5. **Places.** Registered for 47 (no more than 16 under 2); current availability "phone to check".
6. **Ages.** The site says "from 6 weeks to 5 years old"; the Care Inspectorate registration doesn't state a minimum age.
7. **Lunch.** The February 2025 report says "lunches were provided by parents"; the example only says to phone and check. Ask whether this has changed (the National Standard requires a free meal for funded sessions).
8. **Grades line.** "Good and Very good, February 2025" summarises 4, 4, 4 and 5. Check the Care Inspectorate register shows no newer inspection.
9. **Denise Rankin's years.** Her profile says "24 years" with no date; the example says "More than 20 years". Donna Carr is "Assistant Manager" on the About page and "Deputy Manager" on the Team page; the example uses Deputy manager.
10. **Staff list.** Some staff are first names only (Darren, Cara, Nikki, Megan, Chloe R, apprentices); confirm names and roles, and whether the list is current. No staff photos are used.
11. **Ratios** are the nursery's own per-room figures (1:3, 1:5, 1:8); confirm they are current.
12. **Policies.** Only CCTV and medicines are mentioned, both from the inspection report. Ask for the real policy list and current versions.
13. **Room names and photos.** Tiddlers, Toddlers and Biggies come from the Services page. The "under-2s play room" caption is our best match from the photo; confirm.
14. **The H1** "Where the sun always shines" is painted on the nursery's own playroom wall (seen in a site photo). Check they're happy to use it.
15. **Group.** The site says Sadco runs four nurseries (Sunshine, Noah's Ark in Lochgelly, Poppins Kindergarten and Mulberry Bush Montessori in Glasgow); the example mentions only the operator. Add an "Our nurseries" page if they want the group shown.
16. **Logo.** The nursery's logo is a sun with a face and glasses; the template's emblem is a redrawn faceless sun. Ask whether they also want the original logo shown.
17. **Report link.** The homepage grades line and Our nursery link to the PDF on the nursery's current site; move it with the site, or link to the register record once the Care Inspectorate's beta site gives stable record URLs.
