# Cut and Stick: a website template for playful, making-led Scottish nurseries

> Pipeline name: **Cut and Stick** (folder `templates/nursery/cut-and-stick/`). It is one of the five "engaging" nursery templates (with Full Stop, Chapter One, Weatherproof and Big Table) that sit beside the three calm ones (Front Desk Nursery `nursery/front-desk`, Key Worker `nursery/key-worker`, Garden Gate `nursery/garden-gate`). It sells mainly by **play, making and belonging**.

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
| `cutpaper.svg` | The illustration set: **16 stickers** (`s-…`) and **23 paper-cut icons** (`i-…`), drawn for this template. Each page carries an inline copy of only the symbols it uses (see §6.1). | Add symbols only in the same style |
| `kraft.webp` | 256px tiling kraft-paper texture (19 KB, transparent specks and fibres over `--paper`). | Never |
| `fonts/` | Shantell Sans (display, instanced at Informal 60, Bounce 0, weight 600 to 800) and Lexend (body, 400 to 600), Latin and Latin Extended woff2, 132 KB in all; a page loads about 75 KB. `OFL.txt` holds both licences. | Never |
| `example/` | Worked example for **Little Bugs at Abercorn**, a real fully outdoor nursery on the Hopetoun Estate near South Queensferry: `index.html`, `join-us.html`, `our-nursery.html`, `fees-and-funding.html`, `our-team.html`, `parents.html`. | Copy it for each nursery |
| `example/img/` | 8 photos (JPEG plus WebP) and `CREDITS.txt`, which lists every photo on the old site that was **not** used and why. | Each nursery gets its own |
| `PHOTO-SHOTLIST.md` | What to ask the nursery to shoot and scan. | Send to the nursery |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/cut-and-stick`. | After changes |

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
| 2 | **Key facts as paper luggage tags**, five of them, never rotated: ages, hours (with the live status inside), funded hours, places, grades with date. | E2.2 item 3; tags are this theme's chip (E4.1). Facts must never tilt (E3). |
| 3 | **Header: kraft bar, sticker mark, Phone and Menu pills**; "Book an open evening" (or "Book a visit") joins at 60em. Torn bottom edge. | A visible visit and phone action on every phone screen [`links-city-nurseries.md`, `tops-day-nurseries.md`]; E1.5. |
| 4 | **First 390×844 screen** holds the header, the two kept nav items, the eyebrow, the promise, the fact sentence, all five tags and both actions (checked on the example). | E2.2 first-screen budget. |
| 5 | **"Already with us?" kraft strip** right after the hero: closures, absence, lunch, fees. | Current parents shouldn't scroll through the pitch (E2.2 item 5). |
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

## 4. Homepage structure (keep this order; E2.2, E4.1)

1. **Skip link**, then the inline sprite `svg.sprite`.
2. **Header** `header.site-header`: `a.brand` (sticker mark, `.brand__name`, a space, `.brand__place`), `.header-actions` (`a.pill.pill--visit` from 60em, `a.pill` phone with `.pill__short`/`.pill__long`, `button.menu-toggle` "Menu"), `nav.site-nav#site-nav` with 6 items; "Visit and join" and "Fees and funding" are `li.nav__item--keep`.
3. **Hero** `section.hero.section--paper > .hero__grid`:
   - `.hero__text`: `.hero__sticker` (one sticker, phones and tablets only), `h1` with `span.eyebrow` ("[Nursery], [near town]") and the promise; `p.hero__fact`.
   - `.hero__art` (desktop only): one `figure.polaroid.taped` with the hero photo through `<picture>` with `media="(min-width: 60em)"` sources and a 1px placeholder `src`, so phones never download it; two stickers `.s1`, `.s2`.
   - `.hero__below`: `dl.tags.tags--facts` (5 `div.tag`; the Hours tag holds `small.tag__status[data-status]`), then `.actions.hero__actions` (`.btn` "Book a visit / an open evening", `.btn.btn--outline` "Phone us" with the number in `aria-label`).
4. **Already with us?** `section.section--kraft.already.torn`: `h2` and 4 links with paper-cut icons.
5. **Our noticeboard** `section#noticeboard`: `.board` holding `.pinned.board__fact` (`.pin` icon + the grades block) and up to 4 `figure.taped.quote.settle.tilt-l|r` / `figure.polaroid` items.
6. **What we get up to**: `ul.grid.grid--3` of `.paper` cards (`.paper__art` icon, `h3`, one sentence, `a.go`).
7. **Our rooms / Our spaces**: `ul.grid.grid--2` of `.paper.space` cards (sticker or icon, `h3`, `.space__tag` age range or role, one sentence).
8. **A day here** `section#day`: `ol.day` (icon, `h3` with optional `.day__time`, one line) beside a photo and a quote in `.stack`.
9. **Starting**: `ol.steps` (4) and a parent's `figure.taped.quote`.
10. **Lunch** `section#food`: photo plus `.lined.recipe`.
11. **Who's here**: one line and link, plus the manager's or founder's words on `.lined` with `.signature`.
12. **Fees and funding** on butter: the fee line with its date, the funded line, `ul.tags.tags--ticks` "What's included".
13. **Come and see us** `section#visit`: `.close-promise`, `ol.visit-steps` (3 taped steps), the dated `.taped.notice[data-show-until]`, "How places are offered", both buttons.
14. **Find us** `section#find`: status pill, address, "Get directions", directions and parking text, `dl.summary` with `div[data-day]` rows; the jobs strip `.jobs#jobs` when there are vacancies.
15. **Footer** `footer.site-footer.torn.torn--c`: `.foot-stickers` (4 stickers), `.foot-promise` (the promise again), 4 columns, `.foot-bottom` with the CS number and review dates.
16. `script#nursery-schedule`, then `<script src="../cutpaper.js" defer>`.

Sections 1 to 5 and 12 to 15 stay in order. Sections 6 to 11 may move to suit the nursery. **Any section without real content is removed, not faked.** Section backgrounds alternate paper, white and one paper colour; give each `.torn`, `.torn--b` or `.torn--c` so neighbouring edges differ.

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px: no flags on any page, and checked by eye at 390, 768 and 1280.

| From | What changes |
|---|---|
| 0 | One column. Header: brand, compact Phone and Menu pills; two kept nav items below. Tags 2 across (grades full width). Hero buttons side by side. Cards stack. |
| 30em | Header pills full size. |
| 36em | Grids go 2 across. Ticked tags 2 across. |
| 40em | Tags 4 across (grades full width). Fee table becomes a real table (below this it stacks into cards). Page-head sticker grows. |
| 46em | Noticeboard 2 across. |
| 48em | Body text 19px. Phone pill shows the number. "Already with us?" links in a row. |
| 56em | `.split` goes 2 columns. |
| 60em | Hero gets its photo column; the hero sticker goes. Full nav; Menu goes; the visit pill appears. Grids go 3 or 4 across. Steps can go in a row (`.steps--row`). |
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
| `.jump`, `.chip` | "On this page" chips on inner pages. |
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

**Page head** (replaces the hero): `.page-head.section--paper` with a large sticker, breadcrumb, `h1`, `.page-head__lead` (the answer most people came for), optional actions or status, and `nav[aria-label="On this page"] > ul.jump` chips. Sections follow, each `.section` with an `id`, a torn edge variant and a `.section-head`.

| Page | Sections in the example |
|---|---|
| `join-us.html` Visit and join | How visits work (`.visit-steps`, the dated notice, "why open evenings only") · Questions to ask on a visit (`.faq` answered from the report) · How places are offered (`.steps`, waiting-list and funded notes) · Sessions (`.paper` cards) · Starting (key worker, settling, inspector quote) · What to wear and bring · Brothers and sisters (parent-and-toddler group, holiday club) · Your information |
| `our-nursery.html` | Our four rules (signpost photo and four cards) · Our spaces (all named spaces) · A day here · Food and allergies · Keeping safe and free to explore · Extra support · Our inspection (the noticeboard again with report quotes and the report's advice, summarised) |
| `fees-and-funding.html` | Our fees (`.fees`, source and "checked on") · What's included (ticked tags) · Funded hours (1,140, how to apply, splitting) · When funding starts (birthday table) · 2 year olds · Help with costs (Tax-Free Childcare, vouchers, Universal Credit) |
| `our-team.html` | Who's who (`.person` cards: consented portraits or badges) · How we work (from the report) · Qualifications and ratios ("ask us") · Work with us |
| `parents.html` | Closures and holidays · If your child is off · The app · Lunch · Paying fees · Have your say · Worries and complaints (nursery, then the Care Inspectorate) · Policies and privacy |

Forms are HTML, not PDF. Waiting-list forms only with a compliant receiving service and a privacy notice (F6.3); otherwise phone or email. Don't link pages that don't exist.

## 10. Variants

- **Playgroup (mornings, term time):** add `term` to the schedule; hero fact "Open 9am to 12 noon, Monday to Friday, in term time". "A day here" may be 4 moments.
- **Nursery with named rooms:** section 7 becomes "Our rooms", one `.space` card per room with its age range and places if given, and the room's creature sticker (Caterpillars → caterpillar). Draw any missing creature in the same style.
- **With artwork scans:** add one `.art-band` after "What we get up to" or as a divider before the footer, and consider an artwork polaroid on the noticeboard ("From the art table, March 2026").
- **Not a funded provider:** the Funded hours tag reads "Phone to check"; the fees page leads with the table.
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
- [ ] First 390×844 screen: header, kept nav, eyebrow, promise, fact sentence, all five tags, both actions.
- [ ] Menu is 6 items; "Visit and join" and "Fees and funding" visible on phones.
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
- [ ] Homepage under about 1 MB on a phone (the example: about 255 KB uncompressed).

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
