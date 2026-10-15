# Chapter One (spacious): a storybook website template for Scottish nurseries

## Spacious version (read this first)

This folder (`templates/nursery/chapter-one-spacious/`) is the **spacious version** of Chapter One, made so the owner can compare it side by side with the original (`templates/nursery/chapter-one/`). It answers his feedback on the originals: *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."* The spec is the **space brief, S1 to S13**, in `prospects/research/nursery-spacious-directions.md` (Part 2). Read it before changing any spacing.

Same identity as the original: dusk-and-cream book jacket, Fraunces + Nunito, every drawing, the cottage-at-home-time hero scene, bookplates, book pages with a curl, the book spread for grades, room chapters, back-cover blurbs, the dusk invitation, the starry footer, the voice and the Cosy Cottage example with every fact it had. No fact was added; nothing was deleted, only moved inward.

### What changed and why

| Change | Rule |
|---|---|
| Tokens: gutters 24px phone, 40px from 600px, 64px from 1024px; content 1,120px max; section padding `clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80 to 128px); `--measure: 60ch` on every paragraph; `--gap` 24/32px between cards; `--group` 48/64px between groups; kicker to heading 12px, heading to body 20px, body to action 32px. | S1, S2, S7, S8 |
| **Homepage cut from hero + 11 sections to hero + 4:** the essentials, the first chapter, the contents (doors), and the visit band. | S3 |
| **Hero** holds only the name (eyebrow in the `h1`), the promise, one sentence, "Book a visit" and a "Phone 0131 285 6855" text link. The 5 bookplates left the hero. | S2, S5, S13 |
| **The essentials:** the 5 hero bookplates became **one bookplate holding a 5-line list** (ages, open, funded hours, places, grades with date and report link), each line with a drawn icon and no sub-notes, closed by "All the details". | S9, S8 (3 sizes of text at most) |
| **The first chapter:** 5 chapter pages became **one open page** (Chapter 3, Settling in, the peg drawing) and "Read all five chapters". The five pages live on Visit and join. | S5, S9 |
| **Contents** (new, `ol.contents` of `a.door`): 5 doors to the inner pages, styled as a book's contents page: a drawing, a Fraunces label, an intent sub-line, a roman folio and a drawn arrow. One per row, at least 120px tall, hairline dividers, no boxes. | S6, S7, S9 |
| **Visit band** (the dusk invitation with the moon) ends every page: kicker, H2, one sentence, Book a visit + phone link. | S3, S10, S13 |
| Inner pages: the page band shows its drawing on phones too and carries one action; "On this page" is a numbered contents list with 48px rows (not chips); every page ends with a **"Next" door** and the visit band. | S10 |
| The sticky-free header, the 6-item menu and the footer are unchanged (see "judgement calls"). | S11 |

### Where the homepage content went (nothing lost)

| Was on the homepage | Now |
|---|---|
| 5 hero bookplates | The essentials list (homepage); "34 registered places" was already on Visit and join › How places are offered |
| "Already with us?" band and the Christmas notice | Parents page (notice, login, closures, illness, paying) and the Parents door |
| The 5 chapter pages, the quote, "Thinking about starting?" card | Visit and join › Settling in (already there, with the quote) |
| Book spread of grades | Our nursery › Inspection grades (already there) |
| Proof plates (registered since 2013, CS number; funded provider) | **Moved** under the book spread on Our nursery |
| Three room chapters | Our nursery › Our rooms (already there) |
| "What fills the days" timeline | Our nursery › A week here (already there) |
| Team text, manager card, motto plate | Our team (already there) |
| Parents say (3 back-cover blurbs) | **Moved** to Our nursery, after A week here, with the "On this page" entry "Parents say" |
| What your fee includes | Fees and funding › Our fees (already there) |
| Your first visit (3 steps, places card) | Visit and join › Book a visit and How places are offered (already there) |
| Find us and contact us (address, phone, email, hours, open, directions) | **Moved** to a new last section of Visit and join (`#find-us`), with the cottage drawing |

### Measured results (spacious example, 14 October 2026)

Measured at 390 × 844 with `scratchpad/tools/density.mjs` and the words-in-`<main>` script. "Before" is the original Chapter One homepage.

| Homepage at 390px | Space brief | Before (original) | After (spacious) |
|---|---|---|---|
| Length | ≤ 6 screens (≈ 5,064px) | 13,920px, 17 screens | **4,864px, 6 screens** |
| Words in `<main>` | 120 to 180 (max 200) | 1,057 | **180** |
| Sections in `<main>` | hero + ≤ 5 | 11 | **hero + 4** |
| First screen: text blocks / boxes | ≤ 7 / ≤ 3 | 14 / 10 | **4 / 4** (3 visible: header Phone, Menu, Book a visit; the 4th is the off-screen skip link the script counts) |
| Screens 2 and 3: text blocks / boxes | ≤ 6 / ≤ 3 | 10 / 3 and 13 / 6 | **6 / 1 and 5 / 2** |
| Average per screen: text blocks / boxes | | 9.4 / 2.9 | **6.7 / 1.5** (the average includes the footer's two screens) |
| H2 per screen (main) | ≤ 1 | up to 2 | 1 |
| Hero height | ≥ 70% of first screen | | 670px hero below a 134px header (95% of the screen) |
| Items per row on phone | 1 | 2 (plates, already-with-us links) | 1 everywhere; "What's included" icon tiles stay 2 per row (label-only, S6) |

Inner pages (words in `<main>`, incl. the Next door and visit band; sections ≤ 120 words of body excluding tables, folds and the one list allowed by S10): Visit and join 604 (Settling in is the 5-page chapter list plus 38 words), Fees and funding 599, Our nursery 692 (rooms 121, the three room bands), Our team 246, Parents 373.

Checks: `audit.mjs` **0 blockers, 0 major, 0 minor** (6 pages, 207 links). `viewports.mjs` **no layout flags** on all 6 pages at all 9 widths.

### Judgement calls
- **The essentials stay a bookplate.** S9 says "a list, not boxes". The list is a plain `ul` with hairlines, but it sits inside one bookplate frame because bookplates are this template's signature. That is one box on its screen.
- **The open page shows Chapter 3, "Settling in"**, not Chapter 1: settling in is the emotional centre of the template.
- **The doors are a contents page**, not tiles: rows with hairline dividers and no fill, so 5 doors fit the 3-boxes-per-screen rule and the page stays under 6 screens. Each row is a single link at least 120px tall.
- **Header and footer unchanged.** The two "keep" menu items under the bar are a research decision of the original (E§2.1), not Playhouse's 12-item inline menu; the open phone menu is unchanged. The footer's two screens hold more than 6 text blocks each (S4 excludes the footer; S5 is met for every screen of `<main>`).
- **The doors H2 starts only about 18px below the 3rd screen boundary.** If you lengthen the first chapter or the essentials, check S5 (1 H2 per screen) again.

---

> Pipeline name: **Chapter One** (folder `templates/nursery/chapter-one/`; this spacious version is `templates/nursery/chapter-one-spacious/`). One of the five engaging nursery templates (Cut and Stick, Full Stop, Chapter One, Weatherproof, Big Table). Its calm siblings are Front Desk Nursery (`nursery/front-desk`), Key Worker and Garden Gate. Chapter One sells **settling in, the people and the feeling of a safe, cosy day**.

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
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/chapter-one-spacious`. | After changes |

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
| 2 | **Key facts as "The essentials"**: one bookplate holding a 5-line list (ages, open, funded, places, grades), straight after the hero. (Spacious: was 5 plates on the hero.) | E§2.2 item 3; §6.2 item 3; S9. Bookplates are the theme's chip (E§4.3). |
| 3 | **"Book a visit" (rust button) and "Phone 0131 285 6855" (text link)** in the hero. Desktop header has both. | E§1.5, E§1.12 item 10; S5 (one button, one link per screen), S13. |
| 4 | **The drawn scene sits under the text, never behind it.** | E§4.3 hero rule; "no text on a busy photo" (E§2.2). |
| 5 | **Current parents** use the Parents door and menu item; the dated notice sits on the Parents page. (Spacious: the "Already with us?" band left the homepage.) | E§2.2 item 5; S3. |
| 6 | **Five chapter pages** for joining and settling in on Visit and join, each with a vignette, title and two sentences; the homepage shows one open page. Steps only as the nursery describes them. | Settling in sold as a promise with steps (E§1.8, `thrive.md`, `busy-bees.md`). Parents ask about it (§4.4). |
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

The space brief caps the homepage at the hero plus 5 sections, 6 phone screens and 120 to 180 words in `<main>` (S3, S4). Don't add sections; add inner-page content instead.

1. Skip link, then `svg.sprite` (only the symbols the page uses, plus `#wash`).
2. **Header** `header.site-header`: `.site-header__bar` with `a.brand` (mark, `.brand__name` with a small gold spark, `.brand__place`) and `.header-actions` (`a.header-call`, `a.btn.header-visit` from 60em, `button.menu-toggle`); then `nav.site-nav#site-nav` with 6 items, two marked `li.nav__item--keep`.
3. **Hero** `section.hero.on-dusk`: `.hero__grid` with the `h1` (eyebrow span + `.hero__promise`), one `p.hero__lead` sentence, `.actions.hero__actions` (`a.btn` Book a visit + `a.phone-cta`). Then `.hero__scene` holding the inline scene SVG. Hero words ≤ 25.
4. **The essentials** `section.section`: `.bookplate` with the star rule, `h2`, `ul.essentials` (exactly 5 lines, ≤ 8 words each, a drawn icon each, grades line linking to the report) and `div.go-row` "All the details".
5. **The first chapter** `section.section--surface#first-chapter`: centred `.section-head` (kicker, `h2`, one sentence ≤ 30 words), one `.opening-page` (drawing, `.chapter__num`, `h3`, one sentence), `div.go-row.center` "Read all five chapters".
6. **Contents** `section.section`: `.contents-head` (kicker "Contents", `h2`), `ol.contents` of 4 to 6 `a.door` (drawing, `.door__label` ≤ 3 words, `.door__line` ≤ 8 words, `.door__folio`).
7. **Visit band** `section.invite.visit-band.on-dusk`: moon, kicker, `h2`, one sentence, Book a visit + `a.phone-cta`.
8. **Footer** `footer.site-footer.on-dusk`: star row, the promise in italic, 3 columns, `.foot-plate` with company name and CS number, review dates. (No hill edge after the visit band.)
9. `script#nursery-schedule`, then `<script src="../chapter.js" defer>`.

Every content section ends with exactly one onward link (S9). Never on the homepage: grades table, timeline, room panels, team, blurbs, fees detail, FAQs (S3).

## 5. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px.

| From | What changes |
|---|---|
| 0 | One column, 24px gutters. Header: name and place, "Phone" and "Menu"; the two keep items sit in a row below with gold dots. Essentials and doors one per row. Chapters: drawing beside "Chapter n" and the title, text full width below. Room drawing under the text. Page bands: the drawing (88px disc) beside the breadcrumb and title. |
| 25em | The brand mark appears. |
| 37.5em | Gutters 40px. |
| 40em | Plates in 3 columns. Actions stop stretching. Fee table stops stacking. "What's included" in 4 columns. |
| 46em | Chapters on inner pages put the drawing in a left column. Rooms go to 2 columns, alternating sides. Door drawings grow to 104px. |
| 48em | Body 19px. Header phone shows the number. |
| 52em | `.split` goes to 2 columns. Page-head drawing grows to a 224px moonlight disc. Blurbs in 3 columns. "On this page" in 2 columns. |
| 60em | Desktop header: phone, "Book a visit" and the full menu row under the bar. Story timeline in 3 columns. |
| 64em | Gutters 64px, card gaps 32px, group gaps 64px. Hero text column 46rem. |
| 90em | Brand, menu and actions on one row. |

## 6. Components

| Class | Use |
|---|---|
| `.btn`, `.btn--secondary`, `.btn--moon` | Rust main action ("Book a visit"), ink outline, moonlight outline on dusk. |
| `.go` | Stand-alone verb link with a drawn arrow, 44px. |
| `.plates`, `.plate`, `.plate--wide`, `.plate--solo` | Bookplates: cream, a thin gold rule inset. Awards, CS number, the team motto. (No longer on the homepage hero.) |
| `.bookplate`, `.essentials` | The essentials: one large bookplate holding the 5-line list. Homepage only. |
| `.opening-page`, `.opening-page__art` | One chapter page with a curl, for the homepage's first chapter. |
| `.contents`, `.door`, `.door__label`, `.door__line`, `.door__kicker`, `.door__folio`, `.contents-head` | The doors, as a contents page; `.door` is also the inner pages' "Next" door. |
| `.next`, `.next__frame` | The "Next" door at the end of every inner page. |
| `.visit-band` (with `.invite.on-dusk`) | The dusk visit band that ends every page. |
| `.phone-cta` | The secondary action: "Phone 0131 285 6855" as a text link with an icon. |
| `.go-row` | Wraps the single onward link that ends a section (32px above). |
| `.star-rule` | Three drawn stars. Replaces `<hr>`. |
| `.chapters`, `.chapters--book`, `.chapter`, `.chapter__art`, `.chapter__num` | The first chapter on Visit and join. (`--book`, 5 pages in a row from 64em, is no longer used on the homepage.) |
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
| `.page-head`, `.breadcrumb`, `.page-head__art`, `.page-head__edge`, `.jump` | Inner page band with a hill edge, and "On this page" as a numbered list with 48px rows. |
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
| `--gutter` | 24px; 40px from 37.5em; 64px from 64em | S1. Never lower. |
| `--section` | `clamp(5rem, 3.6rem + 5.6vw, 8rem)` | S2: 80px phone, 128px at 1280. |
| `--wrap`, `--measure` | 70rem (1,120px), 60ch | S1, S8. |
| `--gap`, `--group` | 24/32px, 48/64px | S7, S2. |

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder so `../styles.css`, `../chapter.js` and `../fonts/` still resolve. Keep the homepage to the five blocks in section 4 and the word budget (S4).
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

Every page reuses the head, header, footer, schedule and script exactly. `<title>` is "[Page]: [Nursery], [area]". Each page follows S10: `.page-head.on-dusk` (breadcrumb, `h1` ≤ 6 words, lead ≤ 35 words, **one** action, the page's drawing in a disc on every width, the hill edge), then `nav.jump` "On this page" when there are 3 or more sections, then sections (≤ 120 words of body each; long detail in `.faq` folds) alternating `.section--surface` and paper, then `nav.next` (the "Next" door) and the `.visit-band`. Keep each page under about 900 words.

| Page | Drawing | Sections |
|---|---|---|
| `join-us.html` Visit and join | `door` | Book a visit (3 steps, phone and email card, the nursery's own enquiry form linked only if it has a compliant one) · Questions to ask on your visit · How places are offered (`dl.summary`: ages, places, how to secure one, funded children, waiting list, start dates) · Settling in (the 5 chapters, quote) · Find us (address, phone, email, hours, weeks, directions). Next: Fees and funding |
| `our-nursery.html` Our nursery | `cottage` | Rooms (tabs + room chapters with ids) · Outdoors · A week here · Parents say (back-cover blurbs, at most 3) · How children learn (plain English, `.faq` explainers) · Meals (menu and cook only if supplied) · Inspection grades (book spread, then proof plates). Next: Our team |
| `fees-and-funding.html` | `tea` | Funded hours (`.figure-row`, council link, "how it works here" note) · When funding starts (birthday table, source line) · 2 year olds · Our fees (`.table--stack`, source and "Last checked", included tiles) · Paying · Help with costs. Next: Our nursery |
| `our-team.html` | `nook` | Manager (`.person`) · Our staff (team size only from the Care Inspectorate record, with its date; the nursery's motto) · Training · Questions to ask. Next: Visit and join |
| `parents.html` For parents | `window` | Dated notice · Parent login · Holidays and closures (term table with `tr[data-from]` when dates exist) · If your child is off · Paying fees · Worries and complaints (nursery, then Care Inspectorate) · Keeping children safe (999 in a `.note--warm`). Next: Our team |

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
- [ ] The first 390×844 screen shows the name, the promise, the fact sentence and both actions; the essentials follow on screen 2.
- [ ] Density script on the homepage: ≤ 6 screens, ≤ 6 text blocks (7 on the first), ≤ 3 boxes and ≤ 1 H2 per screen; `<main>` 120 to 180 words; every content section ends with one onward link.
- [ ] Inner pages: "On this page" when ≥ 3 sections, sections ≤ 120 words, "Next" door and visit band at the end, ≤ about 900 words.
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
