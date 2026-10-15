# Chapter One: a storybook website template for Scottish nurseries

> Pipeline name: **Chapter One** (folder `templates/nursery/chapter-one/`). One of the five engaging nursery templates (Cut and Stick, Full Stop, Chapter One, Weatherproof, Big Table). Its calm siblings are Front Desk Nursery (`nursery/front-desk`), Key Worker and Garden Gate. Chapter One sells **settling in, the people and the feeling of a safe, cosy day**.

**The idea in one line:** a warm storybook site where the hero of every page is the reader's own child, never drawn. Drawn scenes wait for them (a peg with small wellies, a cup of tea for you, a lit window at home time), and starting nursery is told as the first chapter.

It is the "after" in a before-and-after pitch, and the system AI build workers reuse for every nursery that suits it. It looks premium because the storytelling is restrained (story devices in headings only, never in facts), the palette is a dusk-and-cream book jacket rather than a rainbow, and every fact is dated, sourced or marked "phone to check".

**Research behind it:**
- `prospects/research/nursery-engaging-patterns.md` §4.3 (this direction), §1 to §3 and §5. Cited below as **E§**.
- `prospects/research/nursery-websites.md` (fact, photo, funding and inspection rules). Cited as **§**.
- Study files in `prospects/research/nursery-sites/`: `storal.md`, `banbury-cross.md`, `thrive.md`, `busy-bees.md`, `kirktonholme.md`, `willowden.md`.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `chapter.js` | About 190 lines, no dependencies. Front Desk's logic unchanged (phone menu, dated notices, term-aware live status, term-date marks) plus one "rise once" motion. | Never. It reads its data from the page |
| `fonts/` | Fraunces (upright variable 450 to 620 with SOFT 100 and WONK 0 baked in; italic static 420) and Nunito (variable 400 to 800). Latin and Latin Extended woff2. `OFL.txt`. About 110 KB per page for Latin. | Never |
| `example/` | Worked six-page site for **Cosy Cottage Nursery School**, Northfield, Edinburgh (CS2013314940), built only from its own website and Care Inspectorate record. | Copy it for each nursery |
| `example/img/CREDITS.txt` | Image sources, and every image on the old site that was not used and why. | Each nursery |
| `PHOTO-SHOTLIST.md` | The 3 to 9 photos to ask for. | No |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/chapter-one`. | After changes |

Pages link `../styles.css` and `../chapter.js`; fonts load from `../fonts/`. No build step, no framework, nothing from another server (no Google Fonts, CDNs, analytics, maps, social embeds).

The illustrations live **inline in each page**: a hidden `svg.sprite` straight after the skip link holds one `<symbol>` per drawing plus the `#wash` filter, and drawings are placed with `<svg class="ill"><use href="#door"/></svg>`. Each page carries only the symbols it uses. The homepage hero scene is its own inline SVG. When you copy a section between pages, copy the symbols it needs too (search the page for `id="name"`).

---

## 1. Concept

Most nursery sites sell with stock toddlers. We can't (no identifiable children, ever), and parents of babies are the most anxious audience there is (E§1.8). Chapter One turns that rule into the idea: **the drawings show the places and things waiting for the child, and the parent pictures their own child in them.** A peg. A door. A cup of tea for you while they settle. A gate at home time with a lit window behind it.

It reads like a picture book in chapters:
1. **The first chapter** is joining and settling in, from "Hello" to "Home time", placed high on the homepage because it is the emotional centre (E§1.8; `thrive.md`, `kirktonholme.md`).
2. **Proof is an open book**: grades on the left page, the meaning of the scale (or an inspector quote) on the right.
3. **Rooms are chapters in their own colours**, like Banbury Cross's age-group panels (`banbury-cross.md`).
4. **Parents' words are back-cover blurbs.**
5. **The site starts and ends at dusk**: a dusk-blue hero with the nursery itself drawn as the lit house at home time, and a dusk footer with a row of stars and the promise.

## 2. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Promise in the `h1`, fact sentence under it**: "Every story starts with a first day." then ages, area and weeks. Eyebrow inside the `h1` holds the nursery name and place. | Feeling first, then a hard fact (E§1.1, `busy-bees.md`). First screen must still answer "Is this for us?" (§6.2). |
| 2 | **Bookplate key facts** (ages, open, funded, places, grades) on the dusk hero, 2 columns at 390px. | E§2.2 item 3; §6.2 item 3. Bookplates are the theme's chip (E§4.3). |
| 3 | **"Book a visit" (rust) and "Phone us" (moonlight outline)** side by side on a phone, before the bookplates. Desktop header has both. | A visit button and a phone button on every phone screen (E§1.5, E§1.12 item 10). Moved above the facts so both actions are in the first 450px. |
| 4 | **The drawn scene sits under the text, never behind it.** | E§4.3 hero rule; "no text on a busy photo" (E§2.2). |
| 5 | **"Already with us?" band** right after the hero, with the dated notice. | Current parents shouldn't scroll through the pitch (E§2.2 item 5). |
| 6 | **Five chapter pages** for joining and settling in, each with a vignette, title and two sentences. Steps only as the nursery describes them. | Settling in sold as a promise with steps (E§1.8, `thrive.md`, `busy-bees.md`). Parents ask about it (§4.4). |
| 7 | **Book spread for grades**: every grade, its heading, the inspection and publication dates and a report link; the 6-point scale on the facing page with ours highlighted. | Grades shown whole and dated (E§1.4 item 1, §4.1). Scale from [CI-G] (§3.2). |
| 8 | **Room chapters** in apricot, rose and sage, small-caps age label, Fraunces name, an offset colour tile behind the drawing or photo. | `banbury-cross.md` colour chapters and offset tiles; E§1.9. Never invent room names. |
| 9 | **A story timeline** ("What fills the days") with drawn icons and the frequency the nursery gives ("Most days", "Every week"). Times only if supplied. | E§1.3 "A day here"; §4.5 times only if supplied. |
| 10 | **Back-cover blurbs**, at most 3, attributed as the nursery attributes them. | E§1.4 item 3: 3 quotes at most, no slider. |
| 11 | **"What's included" as drawn icon tiles** on Home and Fees. | E§2.3; `bright-horizons-uk.md`, `kids-planet.md`. |
| 12 | **"Your first visit" in 3 steps** in a dusk "invitation" with a moon, and a "Places" card with both actions. | E§1.5, E§1.12 item 5. |
| 13 | **Fraunces + Nunito.** Soft bookish serif for `h1`, `h2`, `h3` and quotes; rounded sans at 18px/1.6, never below weight 400. | E§4.3 type; light body text failed at Storal (`storal.md`). |
| 14 | **Dusk, cream, rust, three room tints, gold stars.** Earthy, not primary. | E§3 "earthy or confident colour, not primaries". |
| 15 | **Motion as reward only**: hero stars fade in once (1.2s total), chapter pages and timeline items rise 12px once, room drawings settle onto their tiles. Nothing loops. All off under reduced motion; content never waits for JS. | E§3 motion rules; WCAG 2.2.2. |
| 16 | **Six-item menu**; on phones "Visit and join" and "Fees and funding" stay visible under the bar, the rest behind "Menu". | E§2.1, §6.1. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, date, time, name, room name, grade, policy, service, quote and award comes from the nursery's own site or documents, or its Care Inspectorate record (`prospects/nursery/data/*.json`, datastore CSV in `prospects/nursery/source/`). §3.6 is binding. Use its "Otherwise write" wording.
2. **The story never carries a fact.** Story devices ("chapter", "home time", "tired, fed and full of things to tell you") go in headings and the closing line of a chapter. Every claim inside a chapter must be something the nursery says. If the nursery hasn't described its settling-in steps, write "Ask us how settling-in sessions work here" (as the example does), never "three sessions over a week".
3. **Grades:** every grade from the latest report, its exact headings and both dates. Never only the best grade; never the Care Inspectorate logo. Reports before 22 September 2025 use the old key questions; keep the note under the scale that newer reports use different headings (delete it once the nursery's report is under the new framework).
4. **Inspector quotes** go on the right-hand page of the book spread, exact words with the month and year, only from the report you have read. Without the report text, keep the six-point scale page (as the example does).
5. **Funded status** changes (§3.1). Write "We're in partnership with [council]" or "We're a funded provider for [council]" only when the nursery says so.
6. **Quotes** only from the nursery's own site or Google reviews it links, attributed exactly as it does (E§1.4 item 3). At most 3 on a page.
7. **Never promise outcomes** ("they'll settle in a week"), never "magical", and "once upon a time" at most once on the whole site (E§4.3).

### Drawings and photos
8. **The drawings never show a person, face, hand or figure**, not even a silhouette in a window. Animals only where the nursery's world gives a reason (the example's butterfly is the Butterflies Room). Objects, places, weather and plants are always fine.
9. **No identifiable children in any photo**, and no children at all in our builds (§5.2). Photos are rooms, gardens, doors, food, baskets and consented staff. See `PHOTO-SHOTLIST.md`.
10. Strip metadata; record every image and every rejected image in `img/CREDITS.txt`.
11. The template must look complete with **no photos**: every slot has a drawing.

### Content style
12. Times and dates: "8am to 6pm", days and months in full, "to" not dashes.
13. Phone numbers are `tel:+44…` links shown as written locally. 999 is plain text in `<strong>`.
14. Links start with a verb and make sense alone. Homepage sentences 20 words or fewer.
15. No pop-ups, carousels, auto-play, chat bubbles, social embeds, map embeds or trackers.

### Accessibility (WCAG 2.2 AA)
16. Keep the token pairs in section 7. Text 4.5:1, UI edges and focus 3:1. `--star` is never text on paper; `--door` is never text.
17. One `h1` per page; `h2` per section; `h3` inside. The hero eyebrow is a `span` inside the `h1`.
18. Focus is GOV.UK yellow with a black bar; on dusk grounds links get a 2px dusk inner ring (`.on-dusk`). Put `.on-dusk` on every dusk section.
19. Tap targets 44px: `.go`, `.phone-line`, `dd a[href^=tel]`, nav and breadcrumb links. Inline links in sentences are exempt. A small link inside a bookplate uses `.tap-pad`.
20. Every drawing is `aria-hidden="true"` with an empty role: the words carry the meaning. The grade pips are `aria-hidden`; the plate's "5 · 4 · 5 · 5" has a visually hidden sentence.
21. Motion only inside `prefers-reduced-motion: no-preference`.

### Performance
22. Homepage under 1 MB on a phone (the example is about 210 KB with fonts). Keep each page's sprite to the symbols it uses.
23. Photos: see `PHOTO-SHOTLIST.md` for sizes and formats.

## 4. Homepage structure (keep this order)

1. Skip link, then `svg.sprite` (symbols and `#wash`).
2. **Header** `header.site-header`: `.site-header__bar` with `a.brand` (mark, `.brand__name` with a small gold spark, `.brand__place`) and `.header-actions` (`a.header-call`, `a.btn.header-visit` from 60em, `button.menu-toggle`); then `nav.site-nav#site-nav` with 6 items, two marked `li.nav__item--keep`.
3. **Hero** `section.hero.on-dusk`: `.hero__grid` with the `h1` (eyebrow span + `.hero__promise`), `p.hero__lead`, `.actions.hero__actions`, then `dl.plates` (4 `.plate` + 1 `.plate--wide` for grades). Then `.hero__scene` holding the inline scene SVG.
4. **Already with us** `section.already`: optional `.notice[data-show-from][data-show-until]`, `h2` and 4 icon links (login, closures, fees, child off).
5. **The first chapter** `section#first-chapter`: star rule, `ol.chapters.chapters--book` of 5 `li.chapter`, then `.chapter-close` with one parent quote and a "Thinking about starting?" card.
6. **Proof** `section#grades`: `.book` spread, then `.proof-plates` (registration year and CS number, funded status, a real award if any).
7. **Rooms** `section` > intro block + one `div.room.room--{apricot|rose|sage|moon}` per room the nursery has.
8. **A week here** `section#week`: `ol.story.story--row`.
9. **Team** `section#team`: text plus `.person` card (drawn initial unless a consented portrait) and the nursery's own motto in a plate, if it has one.
10. **Parents say** `section.back-cover.on-dusk`: `ul.blurbs` (at most 3).
11. **Fees** `section#fees`: `ul.included` plus a card with the fee line ("From £x a day. Fees from [date]." or "Phone us for our current fees.") and one funded-hours sentence.
12. **Come and see us** `section.invite.on-dusk#visit`: 3 `.steps`, `.invite__card` with places and both actions.
13. **Find us** `section#contact`: `dl.summary` (address, phone, email, hours, weeks), "Get directions", drawing in `.find__art`.
14. **Jobs strip** only when there are vacancies (a `.note`).
15. **Footer** `footer.site-footer.on-dusk`: star row, the promise in italic, 3 columns, `.foot-plate` with company name and CS number, review dates.
16. `script#nursery-schedule`, then `<script src="../chapter.js" defer>`.

Flex: sections 7 to 11 may be reordered. Remove any section the nursery can't fill with real content; never pad it (E§2.2).

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px.

| From | What changes |
|---|---|
| 0 | One column. Header: name and place, "Phone" and "Menu"; the two keep items sit in a row below with gold dots. Plates in 2 columns. Chapters: drawing beside "Chapter n" and the title, text full width below. Room drawing under the text. |
| 25em | The brand mark appears. |
| 40em | Plates in 3 columns. Actions stop stretching. Fee table stops stacking. "What's included" in 4 columns. |
| 46em | Chapters on inner pages put the drawing in a left column. Rooms go to 2 columns, alternating sides. |
| 48em | Body 19px. Header phone shows the number. |
| 52em | `.split` goes to 2 columns. Page heads show the drawing in a moonlight disc. Blurbs in 3 columns. |
| 60em | Desktop header: phone, "Book a visit" and the full menu row under the bar. Story timeline in 3 columns. |
| 64em | Hero in 2 columns (text left, plates right). Homepage chapters in a row of 5 book pages. |
| 90em | Brand, menu and actions on one row. |

## 6. Components

| Class | Use |
|---|---|
| `.btn`, `.btn--secondary`, `.btn--moon` | Rust main action ("Book a visit"), ink outline, moonlight outline on dusk. |
| `.go` | Stand-alone verb link with a drawn arrow, 44px. |
| `.plates`, `.plate`, `.plate--wide`, `.plate--solo` | Bookplates: cream, a thin gold rule inset. Key facts, awards, CS number. |
| `.star-rule` | Three drawn stars. Replaces `<hr>`. |
| `.chapters`, `.chapters--book`, `.chapter`, `.chapter__art`, `.chapter__num` | The first chapter. `--book` puts 5 pages in a row from 64em (homepage only). |
| `.quote` | One pull quote with a rust opening mark. |
| `.book`, `.book__page`, `.book__folio`, `.grades`, `.pips[data-grade]`, `.scale`, `.is-ours` | The proof spread. Pips are decorative. |
| `.proof-plates` | Plates under the spread. |
| `.room.room--{apricot,rose,sage,moon}`, `.room__label`, `.room__art`, `.room-tabs` | Room chapters. `.room__art > div` holds a drawing or an `<img>`; the colour tile behind uses `--room-tile`. |
| `.story`, `.story--row`, `.story__icon`, `.story__when` | Timeline with drawn icons. |
| `.person`, `.person__initial`, `.person__role` | Staff card with a drawn initial (or a 84px round consented portrait). |
| `.back-cover`, `.blurbs`, `.blurb` | Parents' words. |
| `.included` | "What's included" icon tiles. |
| `.steps`, `.steps--row` | Numbered steps on gold discs. |
| `.invite`, `.invite__card`, `.invite__moon` | Come and see us. |
| `.notice` (+ `data-show-from`/`data-show-until`) | Dated notice, in the flow. |
| `.page-head`, `.breadcrumb`, `.page-head__art`, `.page-head__edge`, `.jump` | Inner page head with a hill edge, and the "On this page" chip bar. |
| `.table`, `.table--stack` (+ `td[data-label]`), `.table-note` | Tables; `--stack` turns the fee table into cards under 40em. |
| `.summary`, `.ruled`, `.questions`, `.note`, `.note--warm`, `.card`, `.figure-row`, `.figure`, `.faq` | Supporting blocks. |
| `.status[data-status]` | Front Desk's live status pill works unchanged if you add one (style it as a `.plate`); it needs `days` in the schedule. |
| `.on-dusk`, `.tint`, `.tap-pad`, `.visually-hidden`, `.nowrap` | Utilities. |

## 7. Tokens (section 1 of `styles.css`)

| Token | Default | Rule |
|---|---|---|
| `--ink` | `#2A2522` | Body text and drawing line. 13.8:1 on paper. |
| `--ink-soft` | `#5A524C` | 7.0:1 on paper; 4.7:1 on room tints (fine for body size). |
| `--paper` / `--surface` | `#FBF4E6` / `#FFFCF5` | Book cream; cards. Paper carries a faint SVG grain (`--grain`). |
| `--dusk`, `--dusk-deep` | `#23325C`, `#1A2647` | Hero, page heads, back cover, invite, footer. Paper on dusk 11.4:1. |
| `--moonlight` | `#D9E0F0` | Text on dusk (9.4:1), notes, disc behind drawings. |
| `--star` | `#F2C66B` | Stars, kickers and eyebrows on dusk (7.8:1). **Never text on paper.** |
| `--star-line` | `#B8862B` | Gold rules on paper. Decorative. |
| `--rust`, `--rust-strong` | `#A2412E`, `#86321F` | Main button (white 6.3:1), drop caps, links on paper (5.8:1). On room tints use `--rust-strong` (5.2:1); `.tint` does this. |
| `--door` | `#D9826E` | Drawing wash only. |
| `--apricot`, `--rose`, `--sage` | `#F2C1A0`, `#EBC3C0`, `#C9DCC4` | Room chapters and washes. Ink on them 9.3 to 10.5:1. |
| `--scene-*` | | Hero scene only. |
| `--focus`, `--focus-ink`, `--open`, `--closing`, `--notice-*` | | Public-service patterns. Never change. |
| `--font`, `--font-display`, `--display-weight` | Nunito, Fraunces, 520 | Keep. |
| `--text-base` | 18px (19px from 48em) | Never below 16px anywhere. |
| `--tap`, `--button-height` | 44px, 52px | Never lower. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../chapter.js` and `../fonts/` still resolve.
2. **Gather facts** with `node pipeline/crawl.mjs <url> <scratch>/source` and the Care Inspectorate record. Note each fact's source.
3. **Colour.** Keep dusk and cream: they are the template. The nursery's own colour may replace `--rust` if white on it is 4.5:1 or more (test it), and room tints may follow the nursery's room colours if ink on them stays 7:1 or more. Update `theme-color`.
4. **Mark and hero scene.** Redraw the nursery's own building, logo or sign as the 48px `#mark` symbol and in the hero scene (edit `scene` in the homepage: the cottage group sits around x 600 to 850 of a 1440×320 viewBox; keep the main building centred so a 390px phone sees it). Use only `.ln`/`.lt` lines and the wash classes, so tokens recolour it. If the nursery has no distinctive building, draw a generic front door and lit window, never a stock house.
5. **Chapters.** Rewrite the five chapters from the nursery's own visit, joining and settling-in wording. Keep the titles short verbs or moments ("Hello", "Saying yes", "Settling in", "The first full day", "Home time").
6. **Rooms.** One panel per room, using the nursery's room names and ages. Choose a drawing that matches the name (an animal only if the room is named after it) or the age (basket, books, bag).
7. **Grades, schedule, notices:** copy every heading, grade and date; write `#nursery-schedule` (Front Desk Nursery BRIEF §8 explains the format); set notice dates.
8. Replace every fact. Afterwards `grep -n "Cosy\|Northfield\|285 6855\|EH8\|Naghmana\|CS2013314940\|Butterflies\|NurseryWeb" *.html` must return nothing from the example.
9. Update titles, descriptions and footer review dates (today and today plus 6 months). Run the checklist in section 10.

## 8. Drawing set (all in-house, inline SVG, no people)

Drawn by our designer in code for this template, 1.7px ink line with a loose wash that is deliberately mis-registered and feathered by the `#wash` filter (`feTurbulence` + `feDisplacementMap`). Not stock, not AI-generated.

- **Scenes (120 box):** `door` (red front door, lantern, plant pot), `peg` (coat on a peg, small wellies, no name label), `tea` (a cup of tea for you, with a biscuit), `lunch` (table laid: bowl, cup, spoon, apple), `gate` (garden gate at home time, moon, lit window), `basket` (treasure basket), `butterfly` (butterfly and flower, for a room of that name), `bag` (school bag with a painting sticking out), `nook` (empty armchair, lamp, books), `window` (lit window with curtains), `cottage` (the nursery's building).
- **Icons (48 box):** `i-boots`, `i-music`, `i-walk`, `i-books`, `i-bowl`, `i-home`, `i-apple`, `i-milk`, `i-brush`, `i-key`, `i-pound`, `i-calendar`, `i-chat`, `i-bell`.
- **Marks:** `mark` (48px brand mark), `spark` (4-point star), `star` (5-point star with ink line).
- **Hero scene:** the nursery at home time with lit windows, chimney smoke, a lamp, a tree, a blossom tree, a picket fence, neighbouring rooftops, a moon and 12 stars. Rewritten per nursery (step 4 above).

New drawings follow the same rules: line plus wash, 2 to 3 washes from the tokens, no faces on anything (no smiling cups, suns or moons), no people.

## 9. Inner pages

Every page reuses the head, header, footer, schedule and script exactly. `<title>` is "[Page]: [Nursery], [area]". Each page opens with `.page-head.on-dusk` (breadcrumb, `h1`, lead, optional actions, a drawing in the disc from 52em, the hill edge) and a `.jump` chip bar, then sections alternating `.section--surface` and paper.

| Page | Drawing | Sections |
|---|---|---|
| `join-us.html` Visit and join | `door` | Book a visit (3 steps, phone and email card, the nursery's own enquiry form linked only if it has a compliant one) · Questions to ask on your visit · How places are offered (`dl.summary`: ages, places, how to secure one, funded children, waiting list, start dates) · Settling in (the 5 chapters, quote) |
| `our-nursery.html` Our nursery | `cottage` | Rooms (tabs + room chapters with ids) · Outdoors · A week here · How children learn (plain English, `.faq` explainers) · Meals (menu and cook only if supplied) · Inspection grades (book spread) |
| `fees-and-funding.html` | `tea` | Funded hours (`.figure-row`, council link, "how it works here" note) · When funding starts (birthday table, source line) · 2 year olds · Our fees (`.table--stack`, source and "Last checked", included tiles) · Paying · Help with costs |
| `our-team.html` | `nook` | Manager (`.person`) · Our staff (team size only from the Care Inspectorate record, with its date; the nursery's motto) · Training · Questions to ask |
| `parents.html` For parents | `window` | Dated notice · Parent login · Holidays and closures (term table with `tr[data-from]` when dates exist) · If your child is off · Paying fees · Worries and complaints (nursery, then Care Inspectorate) · Keeping children safe (999 in a `.note--warm`) |

Add `inspection.html` or `awards.html` only for a long report quote or a real award, linked from the book spread, never the menu (E§2.1).

## 10. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the nursery's site, documents or Care Inspectorate record; disagreements listed in your report.
- [ ] Every chapter sentence is something the nursery says; unknowns say "ask us" or "phone to check".
- [ ] Grades, exact headings and both dates match the latest report; the link resolves.
- [ ] Funded status confirmed with the nursery (and the council list where there is one).
- [ ] Fees show their source and "Last checked", or say "Phone us for our current fees".
- [ ] Quotes attributed as the nursery attributes them; at most 3 per page.
- [ ] No ratio printed unless the nursery states it.

**Drawings and photos**
- [ ] No person, face, hand or figure in any drawing; no face on any object.
- [ ] No child in any photo; EXIF stripped; `img/CREDITS.txt` complete.
- [ ] Each page's sprite contains the symbols it uses (no blank drawings).

**Content**
- [ ] The first 390×844 screen shows the name, the promise, the fact sentence, both actions and the start of the bookplates.
- [ ] Menu is 6 items; "Visit and join" and "Fees and funding" visible on phones.
- [ ] No pop-ups, carousels, auto-play, social or map embeds, trackers.
- [ ] Footer review dates set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>` reports **0 blockers, 0 major, 0 minor**.
- [ ] `node pipeline/viewports.mjs` is clean on every page. Look at 390, 768 and 1280px yourself.
- [ ] Keyboard: skip link, menu (Escape closes), yellow focus everywhere, including on dusk.
- [ ] Reduced motion: stars and pages appear in their final state.
- [ ] If you add opening hours, test the live status with Playwright's clock (Front Desk Nursery BRIEF §8).

## 11. Cosy Cottage example: sources, and facts to confirm

**Sources** (13 October 2026): cosycottagenurseryschool.co.uk (10 pages, crawled) and the Care Inspectorate datastore of 31 August 2026 (CS2013314940). Nothing else. The site has no photos, so the example uses drawings only; the hero scene and mark redraw the nursery's own painted-cottage logo.

Confirm before go-live:
1. **Opening hours.** Not published anywhere we could read. Every page says "phone to check", and the schedule has no `days`, so the live status is off. Add hours and the status pill once confirmed.
2. **Christmas closure dates.** The site says only "a week over the Christmas period". The notice says "phone us to check this year's dates" and shows until 23 December 2026.
3. **Grade headings.** The 2023 report predates the new framework. The headings shown ("Care, play and learning", "Setting", "Leadership", "Staff team") are the datastore's key-question columns, not read from the report. Check against the report.
4. **No inspector quote.** We didn't read the report, so the right-hand page shows the six-point scale. Add an exact quote with its month and year once read.
5. **Registration fee and funded children.** The site says the deposit is "not applicable for children receiving the 1140 pre-school hours". The example says children receiving the 1,140 funded hours don't pay it. Confirm it applies to children who also buy extra hours.
6. **Funded status.** "In partnership with Edinburgh City Council … 1140 hours of pre-school funding for children eligible." Confirm it is current, and whether it takes funded 2 year olds (the example says phone to check).
7. **Pre-School room name.** Its page address is `/cosy-cabin-3-5-years/`, suggesting it is called "Cosy Cabin", but the page says "Pre-School Room". The example uses "The Pre-School Room".
8. **Baby Room age range.** "From babies through to approximately two years"; the youngest age isn't given. The example says "Babies to 5" and "Babies to about 2 years".
9. **Manager.** Naghmana Sajjad is from the Care Inspectorate register; the website names no staff. A julie@ email appears on the contact page with no role, so Julie isn't named. Ask for a manager's welcome line and a consented portrait.
10. **Team size.** "9 staff" is the datastore's NumberStaff (31 August 2026); confirm.
11. **Parent quotes.** Five unattributed, undated quotes on the homepage. Three are used, attributed "A Cosy Cottage parent". Ask where they came from and when.
12. **NurseryWeb.** The site links a ParentView login and embeds a NurseryWeb enquiry form. The example links both. Confirm what ParentView shows parents (the example doesn't claim photos or daily notes) and that the enquiry form has a privacy notice.
13. **Childcare Vouchers.** The site lists them as a payment method; the scheme closed to new joiners in 2018. Confirm, and ask about Tax-Free Childcare (the example says "Ask us if we accept it").
14. **Settling in.** The site doesn't describe settling in. The chapters say only what the site says (visits, the registration fee, meals included, the gardens, feedback at home time) and "Ask us how settling-in sessions work here".
15. **"What does play-based mean?"** The answer paraphrases the nursery's own room pages ("child-led play, creative activities and planned learning"). Have the nursery approve the wording.
16. **Logo redraw.** Confirm the nursery is happy for its logo cottage to be redrawn as the mark and hero scene.
17. **Policies, privacy notice, complaints procedure.** None are published. Pages say "ask us for a copy". Publish them as HTML pages at handover.
