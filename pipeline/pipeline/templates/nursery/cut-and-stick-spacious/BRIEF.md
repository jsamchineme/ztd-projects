# Cut and Stick (spacious): a website template for playful, making-led Scottish nurseries

## Spacious version (read this first)

> Folder `templates/nursery/cut-and-stick-spacious/`, a copy of `nursery/cut-and-stick/` rebuilt to the **space brief** (S1 to S13 in `prospects/research/nursery-spacious-directions.md`, Part 2). The original stays as it was so the owner can compare the two side by side.

**Why:** the owner found our nursery templates "a bit cramped, especially in mobile view" and wanted "less detail on the home page, with a clear way to go into separate pages". The original Cut and Stick homepage ran to 19 phone screens with 14 text blocks and 10 boxes on the first one.

**What stayed:** the palette, Shantell Sans and Lexend, kraft paper and torn edges, the stickers and paper-cut icons, cut-paper cards, the noticeboard, taped notes and polaroids, washi-tape day, lined paper, numbered paper circles, the voice, and the Little Bugs example with every fact, quote and photo it had. Nothing was deleted: everything that left the homepage moved to an inner page or into an accordion.

**What changed, and the rule behind it:**

| Change | Rule |
|---|---|
| Tokens: gutters 24px phone / 40px from 600px / 64px from 900px; `--space-section` 80px phone to 128px at 1280; `--space-group` 48 / 64px; `--gap-cards` 24 / 32px; `--measure: 60ch`; line height 1.6; container 1,120px. **Don't lower them.** | S1, S2, S7, S8 |
| Homepage is the hero plus 4 sections: **The essentials, "Have a wander round" (doors), Our noticeboard, and the "Come and see us" band.** | S3 |
| The 5 luggage **fact tags became the essentials list**: 5 lines on one band, hairline rows, each with a small luggage-tag label holding a paper-cut icon, no sub-notes, closed by "All the details". The tags themselves now live only in "What's included" on Fees and funding. | S9, S5 |
| Hero holds only the name, the promise, one sentence, "Book an open evening" and "Phone 01383 279 380" as a text link. It fills 70% of the first phone screen. The toad polaroid still shows from 60em (it never downloads on phones). | S2, S13 |
| Doors are 5 big cut-paper tiles (sticker, label of up to 3 words, a line of up to 8), one per row on phones with 64px between them so no screen holds more than 3; 2 across from 600px, 3 across from 960px. | S5, S6, S9 |
| The homepage noticeboard keeps one inspector note (and a pheasant sticker for the Pheasantry). The full grades card, every quote and the report's advice are on Our nursery. | S3, S9 |
| Header on phones is the brand and Menu only (no inline nav items under the logo). The menu opens as a full-height kraft sheet with 56px rows in door order, then Book and Phone. The header Phone pill returns from 48em. | S11 |
| Every inner page: a coloured **page band** (breadcrumb or "Back to" link, H1, intro of 35 words or fewer, one action, a large sticker), a numbered **"On this page"** list (cut-paper number circles, 56px rows) in place of the chips, sections of 120 words or fewer, long detail in `<details>`, then a **"Next" door** and the visit band. | S10 |
| Our nursery was split: **`a-day-here.html`** (a sub-page starting "Back to Our nursery") holds the day, food, keeping safe and extra support, so neither page passes 900 words. | S10.4 |
| Footer slimmed to the promise, address, phone and email, one line of page links and one line of small print. At most 2 footer stickers on phones (so a screen never holds more than 3 with the "Next" door). | S5, rule 15 |
| One action wording everywhere: **"Book an open evening"** (Little Bugs only shows families round at open evenings, so "Book a visit" would be untrue). The secondary action is always "Phone 01383 279 380". | S13 |

**What moved where (homepage, before → after):**
- Fact tags → the essentials list (homepage); the live open/closed status → Find us on Visit and join, and the Parents band.
- "Already with us?" strip → the Parents door ("Closures, days off and paying") and the Parents page.
- Noticeboard grades card, parent quote told to the inspector, signpost polaroid → Our nursery (#inspection, #rules). Nikki F.'s review → Visit and join, Starting.
- "What we get up to" (6 cards) → Our nursery #play. "Our spaces" → Our nursery #spaces (it was already there in full).
- "A day here", the paint polaroid and its inspector quote → A day here #day.
- "Starting" steps → Visit and join (#places and #starting, already there). Auli's review → Our team, How we work.
- "Lunch" recipe card and garlic photo → A day here #food, with allergies and the menu in accordions.
- "Who's here" (Louise's words) → Our team and A day here #support (both quotes were already there).
- "Fees and funding" and "What's included" → Fees and funding (already there; "Tax-Free Childcare accepted" tag added).
- "Come and see us" steps, notice and "How places are offered" → Visit and join (already there); the homepage keeps the visit band with the dated open evening line.
- "Find us" (address, directions, parking, hours) → Visit and join #find. Jobs strip → Our team #join (the footer's Jobs link goes there).
- Inner-page moves: "What to wear and bring" became a question in Visit and join's accordion; "Brothers and sisters" moved to Parents; Parents' "The app" and "Have your say" merged into "Keeping in touch", and "Lunch" and "Paying fees" merged; the footer's Parent Club link moved to Fees and funding.

**Space figures** (390 × 844 phone, `density.mjs` and the words-in-main count, 14 October 2026):

| Homepage | Before (original) | After (spacious) | Space brief |
|---|---:|---:|---|
| Length | 15,930px, 19 screens | **4,927px, 5.8 screens** | ≤ 6 screens (5,064px) |
| Sections in `<main>` | 12 | **5** (hero + 4) | hero + ≤ 5 |
| Words in `<main>` | 1,270 | **160** | 120 to 180 |
| First screen: text blocks / boxes | 14 / 10 | **5 / 3** | ≤ 7 / ≤ 3 |
| Screens 2 and 3: text blocks / boxes | 13 / 6, 8 / 3 | **6 / 1, 3 / 3** | ≤ 6 / ≤ 3 |
| Every screen (text / boxes) | 9.3 / 3.2 average | 5/3, 6/1, 3/3, 5/3, 5/1, 5/1 (average 4.8 / 2.0) | ≤ 6 / ≤ 3 |
| Stickers on any 844px window | up to 4 | 3 | ≤ 3 |

The first screen's 3 boxes include the off-screen skip link, which the density script counts.

Inner pages (visible words in `<main>`; every section 120 words or fewer outside its one list, table, image or accordion): Visit and join 698, Our nursery 643, A day here 588, Fees and funding 574, Our team 433, Parents 557.

Checks: `audit.mjs` 0 blockers, 0 major, 0 minor on all 7 pages; `viewports.mjs` no layout flags at all 9 widths on every page.

---


> Pipeline name: **Cut and Stick** (original folder `templates/nursery/cut-and-stick/`; this spacious copy is `templates/nursery/cut-and-stick-spacious/`). It is one of the five "engaging" nursery templates (with Full Stop, Chapter One, Weatherproof and Big Table) that sit beside the three calm ones (Front Desk Nursery `nursery/front-desk`, Key Worker `nursery/key-worker`, Garden Gate `nursery/garden-gate`). It sells mainly by **play, making and belonging**.

**The idea in one line:** a nursery site made like a nursery wall. Cut paper, stickers of Scottish wildlife, children's own paintings, and a noticeboard of honest proof, with every fact a parent needs printed plainly underneath.

**The promise it sells:** "Come and see what we made today." Parents choose a small nursery for belonging. They picture their child coming home with a painting in their bag (or mud on their boots), and a nursery that feels like a community, not a chain. The fun comes from colour, type, shape, illustration and copy voice, never from children's faces.

Research behind it:
- `prospects/research/nursery-engaging-patterns.md` (§ numbers below with an **E**, for example **E1.4**). Section **E4.1** is this template's direction.
- `prospects/research/nursery-websites.md` (the first brief, § numbers with an **F**, for example **F3.6**). Its fact, photo and funding rules all still apply.
- Study files in `prospects/research/nursery-sites/` (cited by name).

Read E4.1, F3.6, F5.2 and this brief before your first build.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `cutpaper.js` | About 190 lines of plain JavaScript. The phone menu, dated notices, the live term-aware open or closed status, "today" rows, term-date marks, the next-closure line (all the same as Front Desk's `frontdesk.js`), plus the noticeboard "settle". | Never. It reads its data from the page |
| `cutpaper.svg` | The source library (pages never load it; see below). The illustration set: **16 stickers** (`s-…`) and **23 paper-cut icons** (`i-…`), drawn for this template. Each page carries an inline copy of only the symbols it uses (see §6.1). | Add symbols only in the same style |
| `kraft.webp` | 256px tiling kraft-paper texture (19 KB, transparent specks and fibres over `--paper`). | Never |
| `fonts/` | Shantell Sans (display, instanced at Informal 60, Bounce 0, weight 600 to 800) and Lexend (body, 400 to 600), Latin and Latin Extended woff2, 132 KB in all; a page loads about 75 KB. `OFL.txt` holds both licences. | Never |
| `example/` | Worked example for **Little Bugs at Abercorn**, a real fully outdoor nursery on the Hopetoun Estate near South Queensferry: `index.html`, `join-us.html`, `our-nursery.html`, `a-day-here.html` (a sub-page of Our nursery), `fees-and-funding.html`, `our-team.html`, `parents.html`. | Copy it for each nursery |
| `example/img/` | 8 photos (JPEG plus WebP) and `CREDITS.txt`, which lists every photo on the old site that was **not** used and why. | Each nursery gets its own |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to shoot and scan. | Send to the nursery |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/cut-and-stick-spacious`. | After changes |

Pages link `../styles.css` and `../cutpaper.js`; fonts and the texture load through the stylesheet. Nothing loads from another server: no Google Fonts, no CDNs, no analytics, no maps, no social embeds (F6.6).

**Why the sprite is inline.** The board serves previews in a sandbox (an opaque origin). An external `<use href="../cutpaper.svg#…">` is a cross-origin fetch there and silently fails. So each page has a hidden `<svg class="sprite">` right after the skip link, holding only the `<symbol>`s that page uses, and every sticker is `<svg><use href="#s-hedgehog"/></svg>`. The colour rules (`.f-k`, `.f-r` and so on) live in `styles.css`, so the drawings follow the tokens.

---

## 1. Who it's for

- **Type:** playgroups, community and voluntary nurseries, and small to mid private nurseries (15 to 70 places) with a playful name or creature room names, and a strong making, art or outdoor culture.
- **Suits nurseries with:** few good photos, lots of children's artwork, and a warm, chatty, community feel.
- **Good prospects** (E4.1): Little Beehive (Cupar, Strathkinness, Montrose, Newport-on-Tay), Little Bugs (Abercorn, Fordell Firs), Red Squirrel (Dundee, Perth), Puddleduck (Glasgow), Humpty Dumpty Community Nursery, Bonnyrigg, Compass, Midstocket, Tom Thumb and Udny Station playgroups.
- **Not for:** large commuter nurseries that sell on hours and price (use Full Stop), or nurseries with a beautiful building and many room photos (use Garden Gate).

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Feeling first, then a plain fact.** The `h1` holds the nursery name (eyebrow) and a promise of 8 words or fewer; the next sentence gives ages, setting, hours, days and weeks. | Busy Bees' "Smoother mornings…" then a hard fact [`busy-bees.md`]; E1.1; "Is this for us?" still answered first (F6.2). |
| 2 | **Key facts as the essentials list** (spacious version): five lines, each with a small luggage-tag label, never rotated: ages, hours, funded hours, places, grades with date. The full tags now only carry "What's included". | S9; tags are this theme's chip (E4.1). Facts must never tilt (E3). |
| 3 | **Header: kraft bar, sticker mark, Phone and Menu pills**; "Book an open evening" (or "Book a visit") joins at 60em. Torn bottom edge. | A visible visit and phone action on every phone screen [`links-city-nurseries.md`, `tops-day-nurseries.md`]; E1.5. |
| 4 | **First 390×844 screen** (spacious version) holds the header, the eyebrow, the promise, the fact sentence and both actions, then the start of the essentials. | S2 hero rule, S5. |
| 5 | **Current parents** use the Parents door ("Closures, days off and paying") and the menu. The "Already with us?" strip is no longer on the homepage (its CSS stays for variants). | S3 section limit; E2.2 item 5. |
| 6 | **The noticeboard** for proof: a pinned, straight grades card with every heading and date; taped notes (tilted 1°) with one exact inspector quote, a parent's words told to the inspector, a parent review; a polaroid. | Links and City use the inspector's words as testimonials [`links-city-nurseries.md`]; Tops' taped polaroids [`tops-day-nurseries.md`]; E1.4 rules: grades whole, quotes exact and dated. |
| 7 | **"What we get up to"**: six cut-paper cards, one paper-cut icon, one sentence and one link each, only confirmed activities. | Kids Planet's paper icons [`kids-planet.md`]; a 3 to 6 card "why us" stack (E1.2, E1.12 #3). |
| 8 | **Named rooms or spaces** as paper cards with a creature sticker, only where the nursery's world gives the creature a reason. | Bright Beginnings' creature per room [`bright-beginnings-leeds.md`]; E1.9: never invent room names. |
| 9 | **"A day here" as a strip of washi tape** with a paper-cut icon per moment; times only where supplied. | E1.3, F4.5. |
| 10 | **Settling in as four numbered paper circles** plus one parent's note. | E1.8 [`thrive.md`, `kirktonholme.md`]. |
| 11 | **Food on lined paper** beside a real photo: the cook's first name, how food is served, the allergy line, the menu (or "ask the office"). | Food is the most underused selling point (E1.7) [`kirktonholme.md`, `young-friends-kindergarten.md`]. |
| 12 | **Manager's or founder's words on lined paper** with a drawn signature line. | E1.11 [`willowden.md`]. |
| 13 | **Fees and "What's included" as ticked tags**; an "ask" tag (dot, white) for anything not confirmed. | E2.3; [`bright-horizons-uk.md`, `kids-planet.md`]. |
| 14 | **"Come and see us"**: 3 stuck-on steps, the dated open evening notice, "How places are offered", both buttons again. | Young Friends' 3 honest steps [`young-friends-kindergarten.md`]; Thrive's "no obligation" [`thrive.md`]; E1.6. |
| 15 | **Torn-paper edges** between sections (3 variants so neighbours never repeat), 16px tall. | Kids Planet's torn dividers make a long page feel like chapters [`kids-planet.md`]. |
| 16 | **One illustration system** (flat stickers with a white cut edge, rough-cut 2-colour icons), 4 paper colours, 2 typefaces. Earthy, not primary. | E3 "one system per template"; "illustration is the main event or it's absent" [`fennies.md`]. |
| 17 | **Motion only as a reward**: card icons lift 2px and turn 3° on hover or focus; noticeboard notes settle once from 0° to 1°; buttons press down. All off under reduced motion, and nothing depends on it. | E3 motion rules; WCAG 2.2.2. |
| 18 | **No pop-ups, carousels, auto-play, chat, social feeds, map embeds or trackers.** "Get directions" is a link. | F6.4, F6.6. |

In the spacious version, the components from decisions 6 to 14 (noticeboard, cards, spaces, day, steps, food, manager's words, fees tags, visit steps) live on the inner pages (§9). The homepage keeps one noticeboard note and the visit band.

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, qualification, grade, policy, activity, space and service comes from the nursery's site or documents, or its Care Inspectorate record and report. F3.6 is binding. Use its "Otherwise write" wording: "Phone us to check for places", "Phone us for our current fees", "Ask us about staff ratios when you visit".
2. **Grades:** every grade from the latest report, its exact headings, the inspection date and the publication date, with links to the report and the record. Never only the best one. Never the Care Inspectorate logo. Grades are **pinned straight**, set in Lexend, never tilted, never in a sticker.
3. **Quotes:** copied word for word, with the source and month. Inspector quotes come from the latest report. Parent quotes come from the nursery's own site or the report, attributed as there (first name and initial). Never trim a sentence so it changes meaning. **Never a child's name inside a quote**: pick another quote. At most three parent quotes on the homepage.
4. **Placeholder-looking reviews:** if the nursery's review list has generic names and generic text (a sign of a website builder's sample content), leave them out and list them in your report.
5. **Activities on the cards** must each trace to a source (site text, report, blog). "Baking Fridays" only if they bake on Fridays.
6. **Stickers need a reason** from the nursery's world: a room name, an animal in its logo, a creature it names (owl boxes, hedgehog homes), its town. Note each reason in your report.
7. **Dates:** check every weekday with a script. Dated notices carry `data-show-until`.
8. **Where sources disagree**, use the newest dated source, write "phone to check" if it touches money or places, and list it.

### Photos and artwork (F5.2)
9. **No identifiable children, ever.** No faces, names, name pegs, nappies, changing, sleeping. Treat any old-site image with a child's face as excluded; crop to hands and objects only where no child can be identified.
10. Allowed: empty rooms and gardens, the gate or building, food as served, hands at work, children's artwork with the name removed, staff with their own consent.
11. Strip metadata. Record every photo and every exclusion in `img/CREDITS.txt`.
12. **Never** stock, AI images, clip-art children or "children's art" from the internet.
13. The template must look complete with **no photos and no artwork**. Remove a `figure.polaroid` and its column collapses.

### Illustration
14. **No people, no faces, no hands** in drawings. Animals have dot eyes only: no highlights, no smiles, no clothes. No tartan.
15. **At most 3 stickers on any phone screen.** Stickers are decorative: `aria-hidden="true" focusable="false"`.
16. **Tilt only notes, quotes and photos**, by `--tilt` (1°). Never facts, never buttons, never long body text, never more than 2° anywhere.

### Content style
17. Chatty, warm, short sentences. "We" and "your child". **Avoid** baby talk, "little ones" more than once a page, exclamation marks in headings, puns in facts. Scots words only if the nursery uses them ("wee one" appears in Little Bugs' own reviews).
18. Times: "8am", "6:30pm", "8am to 6pm"; days and months in full; "to" not dashes.
19. Homepage sentences 20 words or fewer. Links start with a verb.
20. Phone numbers are `tel:+44…` links shown as written locally. 999 is plain `<strong>` text.

### Accessibility (WCAG 2.2 AA)
21. Keep the token pairs in §7. **On butter, sky, grass and blush, links and soft text turn ink** automatically (the blue link drops to 3.7 to 4.4:1 there). Don't override that.
22. One `h1`, then `h2` per section, `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. Skip link first.
23. Focus is GOV.UK yellow with ink; never remove it.
24. Tap targets 44×44px. Links in tags, figcaptions and summary values get an expanded hit area from the CSS; keep link text inside them short.
25. Grades dots are `aria-hidden`; the words carry the meaning.

### Known audit quirks
26. `audit.mjs` clicks links by their visible text. Keep a space between the brand name and place spans, or the text runs together and the click "fails".
27. Text-only SVGs must be inline, not `<img>`.
28. `body` has `overflow-x: clip` as a safety net, which also hides overflow from `viewports.mjs`. **Look at 600, 768 and 834px yourself.**

## 4. Homepage structure (spacious version: keep this order; S3)

1. **Skip link**, then the inline sprite `svg.sprite`.
2. **Header** `header.site-header`: `a.brand` (sticker mark, `.brand__name`, a space, `.brand__place`), `.header-actions` (`a.pill.pill--visit` from 60em, `a.pill` phone from 48em, `button.menu-toggle` "Menu"), `nav.site-nav#site-nav` with 6 items in door order, then `.nav-extra` (Book and `.phone-link`, phones and tablets only).
3. **Hero** `section.hero.section--paper > .hero__grid`: `.hero__text` (`.hero__sticker`, `h1` with `span.eyebrow` and the promise, `p.hero__fact` of one sentence, `.actions` with `.btn` and `a.phone-link`); `.hero__art` (60em and up only: the polaroid through `<picture>` with `media="(min-width: 60em)"` sources and a 1px placeholder `src`, plus stickers `.s1`, `.s2`). Hero text 25 words or fewer.
4. **The essentials** `section.section--white`: `.essentials-grid` with the `h2` and `ul.essentials` (5 `li`, each a `span.tagmark` holding an icon, 8 words or fewer), then one `p.go-row > a.go` "All the details".
5. **Doors** `section.section--grass`: `h2` and `ul.doors` of 4 to 6 `a.door.door--<colour>` (sticker, `.door__label`, `.door__line`).
6. **Our noticeboard** `section#noticeboard`: `.board-split` with the `h2`, `.board.board--home` (one `figure.taped.quote`, optional `.board__sticker`) and one `a.go` to the full grades.
7. **Come and see us** `section.visit-band.section--butter`: icon, `h2`, `.close-promise`, the dated `p.visit-band__when[data-show-until]`, `.btn` and `.phone-link`. The same band ends every page.
8. **Footer** `footer.site-footer.torn.torn--c`: `.foot-stickers`, `.foot-promise`, `.foot-grid` (contact; `nav > p.foot-links`), `.foot-bottom` (CS number, record and report links, review dates).
9. `script#nursery-schedule`, then `<script src="../cutpaper.js" defer>`.

**Never on the homepage** (S3): grade tables, the day timeline, settling-in steps, menus, FAQs, team lists, fees tables, rooms grids. Every content section ends with exactly one `.go` link. Words in `<main>` 120 to 180 (hard maximum 200).

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no flags on any page, and checked by eye at 390, 768 and 1280.

| From | What changes |
|---|---|
| 0 | One column. Header: brand and Menu; the menu is a full-height sheet. Essentials one line per row. Doors, cards and notes one per row. |
| 30em | Header pills full size. |
| 37.5em | Grids, doors and ticked tags go 2 across (never two text cards side by side under 600px). Gutters 40px. |
| 40em | Tags 4 across (grades full width). Fee table becomes a real table (below this it stacks into cards). Page-head sticker grows. |
| 46em | Noticeboard 2 across. |
| 48em | Body text 19px. The header Phone pill appears, with the number. Page band sticker moves to the right. |
| 56em | `.split` goes 2 columns. |
| 56.25em | Gutters 64px; essentials and noticeboard go 2 columns. |
| 60em | Hero gets its photo column; the hero sticker goes. Full nav; Menu goes; the visit pill appears. Grids and doors go 3 across (4 for sessions). Steps can go in a row (`.steps--row`). |
| 64em | Facts strip in one row of 5. Noticeboard 3 across with the grades card spanning 2 rows. Footer 4 columns. |

## 6. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.btn`, `.btn--outline`, `.btn--block` | Tomato main action with a paper-edge shadow (once per screen); white outlined second action. Labels in the display face. |
| `.pill`, `.pill--visit`, `.menu-toggle` | Header pills. |
| `.go` | A stand-alone verb link with a drawn arrow and 44px height. |
| `.status[data-status]`, `.tag__status[data-status]` | Live status (pill, or a line inside the Hours tag). |
| `.tags`, `.tag`, `.tag--wide`, `.tags--facts`, `.tags--ticks`, `.tag--ask` | Paper luggage tags: key facts (`dl`), "What's included" (`ul`, with ticks). `.tag--ask` is for "ask us" items. Colours rotate butter, sky, grass, blush, white, and shift automatically so a tag never matches its section. |
| `.paper`, `.paper--butter/sky/grass/blush/kraft/white`, `.paper__art` | Cut-paper card with scissor-cut corners; colours rotate in a `.grid` unless set. `.paper__art` is the white cut disc that holds an icon. |
| `.space` | A room or space card (with `.paper`): sticker or icon, name, `.space__tag`, one line. |
| `.board`, `.board__fact`, `.pinned`, `.pin`, `.taped`, `.taped--sky/grass` (tape colour), `.taped--butter/blush/sky-paper` (paper colour), `.polaroid`, `.quote`, `.note-label`, `.settle`, `.tilt-l`, `.tilt-r` | The noticeboard and its notes. Any `.taped` or `.polaroid` can be used outside the board too. |
| `.grades`, `.grades__list`, `.dots[data-grade]` | The grades block: every heading, a 6-dot meter (hidden from screen readers), the scale, the links. |
| `.day`, `.day__icon`, `.day__time` | Washi-tape timeline. |
| `.steps`, `.steps--row` | Numbered paper circles. |
| `.visit-steps` | Three taped "How visits work" notes, numbered. |
| `.lined`, `.signature`, `.recipe` | Lined paper with a margin line and a torn bottom. |
| `.notice` (with `.taped`), `[data-show-from]`, `[data-show-until]` | Dated notice (open evening, closure, snow). Never marketing. |
| `.fees` | Fee table; stacks into cards below 40em. Every `td` needs `data-label`. |
| `.faq` | Expanders ("Questions to ask on a visit"). |
| `.person`, `.person__photo`, `.person__badge`, `.person__role` | Staff cards. Badge (cut circle with an initial) unless there's a consented portrait. |
| `.jump`, `.chip` | Old "On this page" chips; replaced by `.onpage` in the spacious version. |
| `.essentials`, `.tagmark` | The homepage essentials list (S9). |
| `.door`, `.door--<colour>`, `.doors`, `.door__kicker/label/line` | Paper doors on the homepage and the "Next" door (`nav.next`) on inner pages. |
| `.visit-band`, `.visit-band__when` | The "Come and see us" band that ends every page. |
| `.page-band`, `.page-band--<colour>`, `.page-band__art`, `.backlink` | Inner page band (replaces `.page-head`). |
| `.onpage` | Numbered "On this page" list (shown with 3 or more sections, 7 items at most). |
| `.phone-link` | The secondary action as a text link with a phone glyph. |
| `.board--home`, `.board-split`, `.board__sticker` | The homepage noticeboard. |
| `.summary` | Label and value rows; `div[data-day]` rows get "today". |
| `.note`, `.note--leaf`, `.note--sky` | Inset note. |
| `.art-band`, `.art-band--divider`, `.art-band__panel` | **Children's artwork band**: a scanned painting as the ground (`style="--art: url('img/art/art-1.jpg')"`) with text only on the solid panel. Not used in the Little Bugs example (no artwork supplied). |
| `.page-head`, `.breadcrumb`, `.page-head__lead` | Inner page head with a large sticker. |
| `.torn`, `.torn--b`, `.torn--c` | Torn top edge in the section's own colour. |
| `.sticker`, `.sticker--s`, `.sticker--l`, `.icon`, `.icon--s` | Illustrations. |
| `.section--paper/white/kraft/butter/sky/grass/blush`, `.split`, `.split--wide/narrow/center`, `.grid--2/3/4`, `.stack` | Layout. |

### 6.1 The illustration set (`cutpaper.svg`)

Drawn for this template in code: each shape is cut into short straight facets with a small wobble, so it looks scissor-cut. Colours are classes (`.f-k` ink, `.f-r` red, `.f-y` butter, `.f-b` sky, `.f-g` grass, `.f-G` green, `.f-p` blush, `.f-c` cream, `.f-n` brown, `.f-N` bark, `.f-o` orange, `.f-v` violet, `.f-B` blue, `.f-t` tan) that read the `--st-*` tokens.

- **Stickers** (`s-`, 100×100): ladybird, bee, butterfly, caterpillar, hedgehog, owl, robin, squirrel (red squirrel), pheasant, newt, puffin, frog, thistle, acorn, bluebell, toadstool. The white cut edge and shadow come from `.sticker`'s filter.
- **Paper-cut icons** (`i-`, 64×64): magnifier, boot, apple, spoon, book, paintbrush, leaf, sun, cloud, pin, house, key, cup, hammock (rest), phone, pot (mud kitchen), spade, den, music, egg, tree, heart, basket.
- **To use one:** add `<svg class="sticker" aria-hidden="true" focusable="false"><use href="#s-owl"/></svg>` and copy the matching `<symbol>` from `cutpaper.svg` into the page's `svg.sprite`. Include only what the page uses.
- **To add one** (an otter, a heron, a fox): draw it in the same way: flat shapes, 2 to 4 colour classes, dot eyes only, no outlines (the sticker filter adds the white edge), under 3 KB. No people, faces or hands.

### 6.2 Motion
- Card icon or sticker lifts 2px and turns 3° on hover or focus-within (200ms).
- `.board .settle` notes rotate from 0° to their tilt once when they enter the viewport (300ms; `cutpaper.js` adds `.is-in`). Without JS, or with reduced motion, they simply sit at their tilt.
- Buttons press down 2px. Nothing loops; no parallax, auto-play or counters.

## 7. Tokens (section 1 of `styles.css`)

| Token | Default | Role, and the rule to keep |
|---|---|---|
| `--ink` | `#2B2420` | All text. 12.8:1 on paper, 15.3:1 on white, 8.2:1 or more on every paper colour. |
| `--ink-soft` | `#5C5148` | Secondary text on paper, white and kraft only (6.5, 7.7, 5.2:1). |
| `--paper` / `--kraft` / `--cork` / `--white` | `#F3EADB` / `#E3D3B8` / `#D4B48C` / `#FFF` | Page ground (with `kraft.webp`), header and strip, noticeboard, cards. |
| `--tomato`, `--tomato-deep` | `#B3261E`, `#7E1A14` | Main button (white 6.5:1). A nursery's red may replace it if white stays 4.5:1. **Never text on kraft** (4.4:1). |
| `--leaf`, `--leaf-deep` | `#146734`, `#1B4D2E` | The nursery's colour: step 1, grade badges and dots, ticks, the green in stickers; the footer (cream 8.4:1, white 9.8:1). Example: Little Bugs' logo green. Keep white on `--leaf` 4.5:1 or more and footer text 7:1 or more. |
| `--butter`, `--sky`, `--grass`, `--blush` | `#F6C945`, `#A8D5E2`, `#9CCB7A`, `#F4B6A6` | Paper colours. Flat. Ink on each 8.2 to 9.7:1. Links turn ink on them. |
| `--link`, `--link-hover`, `--link-visited` | `#1F5E8C`, `#123D5E`, `#5B3A86` | Don't re-theme. 5.8:1 on paper, 6.9:1 on white. |
| `--open`, `--closing`, `--closed` | `#146734`, `#8A4B00`, `#5C5148` | Status dots. Don't re-theme. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. Never change. |
| `--st-*`, `--sticker-edge` | see file | Illustration colours. `--st-green` follows `--leaf`, `--st-red` follows `--tomato`. |
| `--font`, `--font-display` | Lexend / Shantell Sans | Display for `h1` to `h3`, tag values, buttons, pills, quotes on notes. **Never** for body text, tables, the grades block or forms. |
| `--text-base`, `--text-lead`, `--h1`, `--h2`, `--h3` | 18px (19px from 48em), 20px, clamp scales | Don't go below 16px anywhere. |
| `--tilt` | 1deg | Notes and photos only. Never above 2deg. |
| `--tear` | 16px | Torn-edge height (12 to 20px). |
| `--tap`, `--button-height` | 44px, 52px | Never lower. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder (keep `../styles.css`, `../cutpaper.js`, `../fonts/`, `../kraft.webp` resolving).
2. **Gather facts** (§9's list), noting each source. Download and read the latest Care Inspectorate report PDF: it has the exact grade headings and quotable sentences.
3. **Colour:** set `--leaf`/`--leaf-deep` from the nursery's logo or sign (darken until white on it is 4.5:1 or more; footer text 7:1). Swap `--tomato` only for the nursery's own red. Leave paper colours unless one clashes with the logo.
4. **Mark:** pick the sticker that matches the nursery's name or logo (beehive → bee, Red Squirrel → squirrel, Puddleduck → draw a duck in the same style). Never redraw a logo with a face on it as a sticker.
5. **Stickers in the page:** one in the hero corner, two around the desktop photo, one per page head, four in the footer, and one per named room. Each needs a reason (§3 rule 6).
6. **Copy:** write the promise (8 words or fewer, about the parent's or child's day), the fact sentence, and every section from the sources. Replace every Little Bugs fact: afterwards `grep -n "Little Bugs\|Abercorn\|Hopetoun\|01383\|EH30\|CS2022000093\|Licznerski\|Becca\|Vas\|Wee Foragers\|McGregor\|Pheasantry" *.html` must return nothing from Little Bugs.
7. **Sprite:** after editing, make sure each page's `svg.sprite` holds every symbol its `<use>` elements name (and no others).
8. **Schedule and dates:** rewrite `#nursery-schedule` (§8), the dated notices and any term table. Check weekdays with a script.
9. Update `<title>`, meta description and the footer review dates (today and today plus 6 months).
10. Run the checklist in §11.

## 8. The schedule (`#nursery-schedule`)

Identical to Front Desk Nursery (see `templates/nursery/front-desk/BRIEF.md` §8): `timeZone`, `closingSoonMinutes`, `days` (24-hour sessions per weekday), optional `term` for term-time nurseries, and `closures` (whole days, `from`/`to`, a `label` that reads after "Closed for …"). Put it on every page. The example is all-year, 8am to 6pm, Monday to Friday, with **no closures listed** because the nursery hasn't published its bank holiday and Christmas dates: add them as soon as it does, or the status will say "Open" on those days.

Tested with Playwright's clock: a weekday at 7:15am ("Closed now. Opens today at 8am"), 10am ("Open now. Home time is 6pm"), 5:40pm ("Home time soon, at 6pm"), Friday 6:30pm and Saturday ("Opens on Monday at 8am"), and the open-evening notice hiding after 4 November 2026.

## 9. Inner pages

Every page reuses the head, header, sprite approach, footer, schedule and script. Only `<title>` ("[Page]: [Nursery], [area]"), the description, `aria-current="page"` and the sprite's symbols change.

**Page band** (spacious version, S10): `.page-band.page-band--<colour>` with `nav.breadcrumb` (or `p.backlink` on a sub-page), `h1` of 6 words or fewer, `.page-band__intro` (35 words or fewer), one action (Book an open evening on Visit and join, the Phone outline button elsewhere) and a large sticker that differs per page. Then `nav.onpage` (numbered list, 7 items at most), sections of 120 words or fewer (plus one list, table, image or accordion group), `nav.next` with one `.door`, then the visit band. Keep inner pages under about 900 visible words; split into a sub-page past that.

| Page | Band | Sections in the example | Next |
|---|---|---|---|
| `join-us.html` Visit and join | butter, butterfly | How visits work (`.visit-steps`, the dated notice, "Why open evenings only?" folded) · Questions to ask (`.faq`, now with what to wear and bring) · How places are offered · Sessions · Starting (inspector and parent notes) · Find us (status, address, directions, hours) · Your information | Fees and funding |
| `our-nursery.html` | grass, owl | Our four rules · What we get up to · Our spaces (with the leaves polaroid) · Our inspection (grades card, 4 notes) | A day here |
| `a-day-here.html` (sub-page, "Back to Our nursery") | grass, newt | The shape of the day · Food and allergies (recipe card, accordions) · Keeping safe · Extra support | Our team |
| `fees-and-funding.html` | sky, bee | Our fees · What's included · Funded hours (accordions) · When funding starts · 2 year olds · Help with costs | Our nursery |
| `our-team.html` | blush, caterpillar | Who's who · How we work · Qualifications and ratios · Work with us | Parents |
| `parents.html` | kraft, frog (with the live status) | Closures and holidays · If your child is off · Keeping in touch · Lunch and paying fees · Brothers and sisters · Worries and complaints · Policies and privacy | Visit and join |

Forms are HTML, not PDF. Waiting-list forms only with a compliant receiving service and a privacy notice (F6.3); otherwise phone or email. Don't link pages that don't exist.

## 10. Variants

- **Playgroup (mornings, term time):** add `term` to the schedule; hero fact "Open 9am to 12 noon, Monday to Friday, in term time". "A day here" may be 4 moments.
- **Nursery with named rooms:** section 7 becomes "Our rooms", one `.space` card per room with its age range and places if given, and the room's creature sticker (Caterpillars → caterpillar). Draw any missing creature in the same style.
- **With artwork scans:** add one `.art-band` after "What we get up to" or as a divider before the footer, and consider an artwork polaroid on the noticeboard ("From the art table, March 2026").
- **Not a funded provider:** the funded hours line in the essentials reads "Funded hours: phone to check"; the fees page leads with the table.
- **Grades 3 or below:** the pinned grades card stays, unchanged and straight. Add a `.note` in the nursery's own words about what it's improving, if supplied. Choose quiet stickers.
- **A real award:** a polaroid on the noticeboard with the award name, body and year ("Finalist" if it was), and the judges' words if published.

## 11. Pre-handover checklist

Any "no" blocks handover. This adds to F8.

**Facts**
- [ ] Every fact, activity, space and quote traces to the nursery's site, documents or Care Inspectorate report. Disagreements are listed in your report.
- [ ] Grades, headings and both dates match the latest report; report and record links resolve.
- [ ] Funded status confirmed with the nursery (and the council where possible).
- [ ] Fees show their source and "checked on" date.
- [ ] Every sticker has a stated reason. No more than 3 on any phone screen.
- [ ] No child's name anywhere, including inside quotes.
- [ ] No identifiable child in any image; EXIF stripped; `img/CREDITS.txt` complete.

**Content and design**
- [ ] Homepage at 390×844: 6 screens or fewer, 120 to 180 words in `<main>`, no screen over 6 text blocks (7 on the first) or 3 boxes (`density.mjs`); the hero is at least 70% of the first screen.
- [ ] Menu is 6 items in door order; on phones it opens as a full-height sheet with Book and Phone at the bottom.
- [ ] Inner pages: band, "On this page" (3+ sections), sections of 120 words or fewer, "Next" door, visit band; under about 900 words.
- [ ] No tilt on facts, grades or buttons; tilts 1° (2° at most).
- [ ] Each page's sprite holds exactly the symbols it uses.
- [ ] Every section that couldn't be filled truthfully is removed.
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or trackers.
- [ ] Footer review dates set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>`: **0 blockers, 0 major, 0 minor**.
- [ ] `node pipeline/viewports.mjs <url> <out>` clean on every page, and you've looked at 390, 768 and 1280 yourself (overflow is clipped, so look).
- [ ] Live status tested with Playwright's clock (§8).
- [ ] Keyboard only: skip link, menu (Escape closes), yellow focus everywhere.
- [ ] Reduced motion: nothing moves; all content visible.
- [ ] Homepage under about 1 MB on a phone (no photos load on a phone homepage now).

## 12. Little Bugs example: sources, and facts to confirm

**Why Little Bugs:** E4.1 names it as a target ("creature names the stickers can echo"). Its site has real, specific content (a walled garden, the Pheasantry hut, Mr McGregor's garden, a wild corner with a bug hotel, owl boxes and hedgehog homes, a chef and a food story) and a full Care Inspectorate report. It shows Cut and Stick working for an outdoor nursery whose "making" is mud, foraging and natural art, and whose photos almost all show children (so the fallbacks get a real test).

**Sources** (13 October 2026): littlebugs.co.uk (28 pages, crawled), its Care Inspectorate inspection report (unannounced inspection completed 16 July 2024, CS2022000093, linked from its site), and our Care Inspectorate data (`prospects/nursery/data`, id n041-07). Nothing else.

Confirm with the nursery before go-live:
1. **Places.** The 2024 report says registered for up to 34 children aged 2 to 12 (no more than 15 under 3); our datastore says 42 places. The example says "Phone to check".
2. **Inspection date.** The report's cover says completed 16 July 2024; its text says the visit was on 16 June 2024. The example uses July 2024 (report published 20 August 2024 per the datastore). The report uses the old framework's key questions; check there's no newer report under the new framework.
3. **Manager's name.** The site says "Becca"; the Care Inspectorate record says Rebecca Morris. The example uses "Becca" only.
4. **Fees.** Taken from the fees page, which has no "fees from" date. Check they're current, whether they're per session or per day, what meals and snacks are included, and any other charges (deposit, registration fee: Wild Bugs has a £100 admin fee; the nursery's isn't stated).
5. **Funded hours.** The site says "Funded Providers for eligible 3 to 5 year olds" and, elsewhere, "15-30 hours per week for eligible 3-4 year olds". Confirm the council (West Lothian for Abercorn), how funded hours fit full-year sessions, and whether it takes funded 2 year olds.
6. **Tax-Free Childcare and vouchers.** Listed under "funding and payment options"; confirm both are accepted at Abercorn.
7. **Closures.** "Closed on bank holidays and during the Christmas period": get the dates for the schedule. Confirm which term dates the 9am to 3pm sessions follow.
8. **The app.** The report mentions "the 'family' app" (probably Famly). The example says "an app"; confirm the name and login link.
9. **Meals.** Wee Foragers and chef Vas come from the home page and blog. Confirm Vas is happy to be named, which meals and snacks each session includes, and get a sample weekly menu to print.
10. **Spaces.** The site describes some spaces in the future tense ("will be growing", "will be our cosy space"). The 2024 report confirms growing, the Pheasantry and the yurt site; check the descriptions are current.
11. **Settling in.** The report says the transition was revised after parent feedback; the nursery doesn't describe the steps. Ask for them.
12. **Reviews.** Five of the nine reviews on the site (Emma Wilson, Sarah Mitchell, James Thompson, Michael Brown, Lisa Anderson) read like website-builder sample content and were **not used**. "Alisha"'s reviews name her children, so they weren't used either. Nikki F. and Auli are used; confirm both are happy to be quoted.
13. **Photos.** Two crops (paint, sticks) are from the Wild Bugs (school-age) gallery at the same site. The founders' portraits are reused from the site. Confirm consent for all, and ask for the shot list and artwork scans.
14. **Policies and privacy notice.** The site's privacy policy page is empty. The example says to ask the office; publish them as HTML before go-live.
15. **Open evening.** Wednesday 4 November 2026, 6:30pm to 7:30pm, booked through bookwhen.com/littlebugs. Confirm, and keep `data-show-until` in step.
16. **Tiny Bugs and Holiday Club** details (dates, prices, places) are from the site on 13 October 2026; they change each term.
17. **Vacancy.** "Supply practitioners at Abercorn" is from the Join Our Team page; remove the jobs strip when it closes.
