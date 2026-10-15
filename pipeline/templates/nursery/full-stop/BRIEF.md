# Full Stop: a nursery website template for busy working parents

> Pipeline name: **Full Stop** (folder `templates/nursery/full-stop/`). One of the five "engaging" nursery templates in `prospects/research/nursery-engaging-patterns.md` §4 (this is §4.2). Its siblings are Front Desk Nursery (`nursery/front-desk`), Key Worker, Garden Gate, Cut and Stick, Chapter One, Weatherproof and Big Table.

**The idea in one line:** a confident, modern colour-block brand for working parents. Everything a parent needs sits in big, friendly blocks, and every statement heading ends with the nursery's own coloured full stop.

**The selling story:** "Your week, sorted." For a parent who commutes, the emotional win is relief: a nursery that fits the drop-off, feeds their child all day, tells them about the day at pick-up, and has no surprises on the invoice. So the site sells **ease and clarity**: hours and drop-off up front, "What your fee covers" as a headline act, proof as big dated numbers, and a plain visit-to-start path.

It looks premium because it is restrained: flat colour, one chunky grotesque, one dot, generous space, and nothing claimed that can't be shown. It is fun because of the colour blocks, the dot, the drawn icons and the copy voice, not because of cartoon children.

The research behind it:
- `prospects/research/nursery-engaging-patterns.md` (§1 selling patterns, §2 blueprint, §3 visual vocabulary, §4.2 this direction, §5 build notes).
- `prospects/research/nursery-websites.md` (the first brief: §3 Scottish facts, §3.6 claim wording, §4 trust signals, §5 photos and children, §6 structure, §8 checks).
- Study files in `prospects/research/nursery-sites/`: `busy-bees.md` (the full stop, feeling-first hero, curved footer), `n-family-club.md` (bento colour blocks, interior photos), `monkey-puzzle.md` (number tiles, empty room photo), `kids-planet.md` (Essentials and Extras, fact tags, hours card), `bright-horizons-uk.md` (included-in-fees list), `partou-uk.md` (itemised fees), `kido.md` (two side-by-side actions).

Section references below like **E§1.4** point into the engaging-patterns brief and **N§3.6** into the first nursery brief.

## Files

| Path | What it is | Edit per nursery? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token. | Tokens only (section 1) |
| `fullstop.js` | About 200 lines, no dependencies. Phone menu, dated notices, live term-aware open/closed status, "Today" row, Now/Next term-date marks and the next-closure line (the shared Front Desk logic, unchanged), plus one-off scroll motion. | Never. It reads its data from the page |
| `fonts/` | Bricolage Grotesque (headings, instanced at width 96 and optical size 48, weights 600 to 800) and Figtree (body, 400 to 700). Latin and Latin Extended woff2, 76 KB in all, 51 KB for an English page. SIL OFL in `fonts/OFL.txt`. | Never |
| `PHOTO-SHOTLIST.md` | The 2 to 6 place photos this template can use, and the fallbacks. | Read it |
| `example/` | Worked example for **KingsWellies Nursery**, a real 173-place private nursery at Prime Four Business Park, Kingswells, Aberdeen. Six pages, built only from its website, its PDFs (fees from April 2026, the 2026/27 funding pack, the January 2026 menu, its newsletters) and its Care Inspectorate report of October 2024. | Copy it for each nursery |
| `example/img/` | Five photos of the real building and empty rooms (WebP and JPEG at 720 and up to 1200px) and `CREDITS.txt`, which also lists every photo excluded and why. | Each nursery gets its own |
| `thumb.jpg` | Picker thumbnail. `node pipeline/template-thumbs.mjs nursery/full-stop`. | After changes |

Pages link `../styles.css` and `../fullstop.js`; fonts load from `../fonts/`. Keep that shape. No build step, no framework, nothing from another server: no Google Fonts, no CDNs, no analytics, no map embeds, no social widgets, no review widgets (N§6.6).

---

## 1. Research-to-design decisions

| # | Decision | Finding that drives it |
|---|---|---|
| 1 | **Hero: an ink block with the promise in the `h1`**, the nursery name as its eyebrow, then a plain fact sentence (ages, area, hours, weeks) in butter. "Drop-off from 7.30. Home by 6. Sorted." | Feeling first, then a hard fact (Busy Bees "Smoother mornings. Easier goodbyes.", E§1.1). The parent's worry for this audience is the commute and the drop-off. The first screen must still answer "Is this for us?" (N§6.2). |
| 2 | **The full stop.** A drawn dot in `--dot` after every statement heading (`.stop`). Never on questions, labels, buttons or body text. It's CSS, so screen readers don't announce it. | Busy Bees' yellow full stop: "cheap, ownable, confident" (E§3 theme 5, `busy-bees.md`). It works in any brand colour with no imagery. |
| 3 | **Key facts as white pills on the ink hero**: ages, hours, funded status, places, and every grade with its month. | The key facts strip (E§2.2 item 3, N§6.2 item 3). Kids Planet's fact tags (`kids-planet.md`). |
| 4 | **Two actions side by side**: "Book a visit" (white on ink) and "Phone us" (outline), plus Phone and Book in the header. | A visible visit button and a phone button on every phone screen (E§1.5, E§1.12 #10; `kido.md`, `links-city-nurseries.md`). |
| 5 | **"Already with us?"** chips straight after the hero. | Current parents shouldn't scroll through the pitch (E§2.2 item 5). |
| 6 | **Number tiles for proof**, each with a source line and an HTML comment naming the source. Grades get a big tile with every heading. A real inspector quote, dated. A real award as one drawn rosette, with "finalist" said plainly. | Monkey Puzzle's stat tiles (`monkey-puzzle.md`), but only provable numbers (E§1.4). Inspector's words beside the full grades (`links-city-nurseries.md`). One award object, not a badge stack (`bright-beginnings-leeds.md`, `storal.md`). No count-up animation (`fennies.md`). |
| 7 | **"Your week, sorted": a bento of 6 colour blocks**, mixed sizes, one headline with a dot, one short sentence, the whole block a link. A room photo crops into the first block. | N Family Club's colour-block bento (`n-family-club.md`); Young Friends' colour cards (E§1.12 #3). |
| 8 | **"Here's what your fee covers" as a butter block** with a ticked list and the fee line beside it. | All-inclusive fees as a selling point (`kids-planet.md`, `bright-horizons-uk.md`). "Making the price feel earned" (E§2.1). |
| 9 | **Rooms as colour blocks** with the nursery's own room names, age ranges and registered places, each with a drawn emblem from the nursery's own world (for KingsWellies: a wellie that grows room by room). | Named rooms as colour chapters (E§1.9; `banbury-cross.md`, `bright-beginnings-leeds.md`). Never invent room names. |
| 10 | **A day here as a vertical list** with times in a bold tabular column, joined by a dotted line of dots. Words ("Morning", "Lunch") where the nursery gives no time. | A horizontal day strip is a carousel, so it's banned (E§4.2 item 10). Times only if supplied (N§4.5). |
| 11 | **Settling in as 4 tinted steps**, then one parent quote about settling. | Settling in sold as a promise with steps (E§1.8, `thrive.md`, `busy-bees.md`). |
| 12 | **Food: a clean menu card** ("A week of lunches") beside the inspector's words on mealtimes. | Food as a headline act (E§1.7, `links-city-nurseries.md`). |
| 13 | **"Come and see us" as an ink block**: 3 big numbered steps, the places rules, both actions. | "How visits work" in three honest steps (E§1.5; `young-friends-kindergarten.md`, `kids-planet.md`). |
| 14 | **A live hours board** with "Open now" and the next closure. | Kids Planet's hours card with an Open chip (`kids-planet.md`); the shared term-aware status (E§4.0). |
| 15 | **Curved ink footer** with the promise repeated, dots and all. | Busy Bees' curved footer with a one-line promise (`busy-bees.md`). |
| 16 | **Fee table that stacks into cards** below 46em; an "Optional extras" table that says plainly what's optional. | Willow Den's table breaks on a phone (`willowden.md`). Funded providers can't charge top-ups; extras must be optional (N§3.1). |
| 17 | **Flat colour, no texture.** Navy ink, cream ground, four tints, one action colour, one dot. | Premium sites used deep or muted colour, never primaries (E§3 rules). |

## 2. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every fee, time, name, qualification, grade, room, menu, policy and service must come from the nursery's own site or documents, or its Care Inspectorate record. N§3.6's "Never invent" list is binding. Use its "Otherwise write" wording: "Phone us to check for places", "Phone us for our current fees", "Ask us about staff ratios when you visit".
2. **Number tiles:** only numbers the nursery can prove, each with a visible source line and an HTML comment naming the document. Good tiles: registered places, year opened, weeks open, grades, a real review score written as "9.6 from 41 reviews, daynurseries.co.uk, [date]". Never a group-wide score, never a count-up.
3. **Grades:** every grade from the latest report, its exact headings, the inspection and publication dates, and a link. Never only the best grade. Never the Care Inspectorate logo. Below 4: keep the tile, and lean the "why us" blocks on hours, fees and food rather than proof (E§4.2).
4. **Quotes:** copy inspector quotes word for word from the latest report, with month and year. Parent quotes only from the nursery's own published pages, attributed as the nursery does, 3 at most. Never trim a sentence so it changes meaning.
5. **Awards:** name, body and year, and say "finalist" or "shortlisted" when that's what it was. One drawn rosette, set in our type; use a badge image only where the award body's rules allow.
6. **"What your fee covers":** only items in the nursery's own fee terms. Don't write "No hidden extras" if any charge exists outside the fee.
7. **Funded status** is confirmed with the nursery's own papers and, where possible, the council at build time (N§3.1).
8. **Dates:** term dates and closures go in the schedule JSON and the tables, and must match. Check every weekday with a script.

### Photos (N§5)
9. No identifiable children, ever, and no children's names on pegs, paintings or displays. Crop or exclude. Strip metadata. Log every used and excluded photo in `img/CREDITS.txt`.
10. Staff photos only with their written consent; otherwise initials in a tinted circle.
11. The template must look complete with **no photos**.

### The full stop
12. `.stop` goes on `h1`, `h2` or `h3` that end a statement. **Never** on a question ("Already with us?"), a label, a button, a name, or body text. Full stops inside a multi-sentence heading are `<span class="dot">.</span>`. Number tiles get their dot automatically.
13. Never add a dot after a heading that ends in a number that could read as a decimal (write "Up to 50 children", not "50."), except in a number tile.

### Copy voice
14. Brisk, confident, parent-to-parent. Short declarative headlines, each ending in its dot. Facts as headlines: "Hot lunch, every day." "Park at the door." "Ready for P1."
15. Reading age 9 to 11. Homepage sentences 20 words or fewer. "7:30am to 6pm" in body text, days and months in full. The hero and footer promise may use "7.30" and "6" as a brand line.
16. Avoid superlatives ("exceptional", "world-class", "best in class"), big-group language ("our nurseries"), jargon ("pedagogy", "provocations") and any claim the nursery can't evidence. Translate the nursery's own claims into plain words; drop the ones you can't check.

### Accessibility (WCAG 2.2 AA)
17. Keep the token pairs in section 6. Text on every tint and on cream is `--ink` (10.7:1 or more). White text only on ink and on `--action`. `--dot` is never text.
18. Focus: yellow with an ink ring, from `styles.css`. It shows on ink, cream, white and butter. Never remove it. Whole-block links (`.block-link`) light up their heading and ring the block.
19. Tap targets 44px or more. Stand-alone links use `.go`; contact lines use `p.phone-line`; chips are 44px tall.
20. One `h1` per page, then `h2` per section, `h3` inside. Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. Skip link first.
21. Motion only under `prefers-reduced-motion: no-preference`; content never depends on JavaScript to appear (blocks already on screen are never hidden).
22. No smooth scrolling (it breaks jump-link checks and the reveal motion in automated screenshots).

### Performance and GDPR
23. Homepage under 1 MB on a phone. The example homepage transfers **about 205 KB on a 390px phone** after scrolling the whole page (HTML 38 KB, CSS 43 KB, JS 10 KB, fonts 50 KB, photos 64 KB as WebP).
24. Photos 3:2, 720px and 1200px, WebP plus JPEG, `loading="lazy"`, with `width` and `height`.
25. No map embeds: a "Get directions" link. No Facebook links in the body (the audit can't verify them).

## 3. Homepage structure (keep this order, E§2.2)

All ids are used by menus, chips and the footer. Keep them.

1. **Skip link**, then the inline SVG sprite (icons `#i-*` and the brand emblem `#boot`).
2. **Header** `header.site-header`: `a.brand` (inline SVG mark, `.brand__name` with its dot, `.brand__place`), `.header-actions` with `a.header-btn--ink` (Phone; the number shows from 48em), `a.btn.header-book` (from 60em) and `button.menu-toggle` ("Menu", three dots). `nav.site-nav#site-nav` with 6 items; from 60em it's a row of pills under the bar.
3. **Hero** `section.hero.on-ink`: `svg.hero__art` (desktop dots), `.hero__grid` with the status pill `p.status[data-status]`, `h1.stop` (eyebrow span + promise), `p.hero__lead`, then `dl.facts` (4 pills plus `.facts__wide` grades) and `.actions--pair`.
4. **Dated notice** (optional) `div.notice-band[data-show-from][data-show-until]`.
5. **Already with us?** `section.regulars`: `h2` (no dot) and 4 chips (closures, lunch, paying, illness).
6. **Proof** `section#proof`: `.bento[data-rise]` with the grades block (`.wide`), the inspector quote (`.wide`), 4 `.half.tile` number tiles and the award (`.full`).
7. **Your week, sorted** `section#why`: `.bento[data-rise]`: one `.wide.tall` photo block, four `.half` blocks, one `.full` block. Each has `.block__icon`, an `h3` holding `a.block-link.stop`, and one sentence.
8. **What your fee covers** `section#included`: a butter block, `.split--wide`, `ul.ticks.ticks--2` and a white block with `.fee-line` and a `.go` link.
9. **Our rooms** `section#rooms`: `.rooms` of 4 tinted `.room` blocks (`.room__art`, `h3`, `.room__ages`, `.room__places`).
10. **A day here** `section#day`: `.split`, intro and `ol.day`.
11. **Settling in** `section#settling`: `ol.steps.steps--4.steps--tint` and a `.quote--plain`.
12. **Food** `section#food`: intro, inspector quote block, `.menu-card` with `ul.menu-list`.
13. **Team** `section#team`: `ul.people.people--3` (manager first).
14. **Parents say** `section#reviews`: `.bento.bento--3` of 3 `figure.quote` blocks in mint, peach and sky. No slider.
15. **Come and see us** `section#visit`: an ink block with `ol.steps.steps--3.steps--big`, a `dl.summary` of place rules, and both actions.
16. **Find us** `section#find`: address, Wellie-Jellies-style notes, parking, "Get directions", the hours board (`.status--light`, `table.hours` with `tr[data-day]`, `[data-next-closure]`), and the entrance photo.
17. **Jobs strip** (only when the nursery is recruiting).
18. **Footer** `footer.site-footer.on-ink`: `.footer-promise` (aria-hidden, it repeats the hero), 4 columns, `.foot-bottom` with © , CS number, "Page last reviewed" and "Next review due".
19. `script#nursery-schedule` then `<script src="../fullstop.js" defer>`.

**Flex rules.** Sections 7 to 13 may move to suit the nursery. Sections 1 to 6 and 15 to 18 stay in order. **Any section the nursery can't fill with real content is removed, not faked**: no menu, no food card; no named staff, no team section; no parent quotes, no "Parents say".

### First phone screen (390 × 844)
Header 64, status 36, eyebrow 22, promise 2 to 3 lines, fact sentence 3 to 4 lines, facts 3 rows, actions 56. In the example "Book a visit" sits at about 700px. If a long nursery name or promise pushes the actions below 844px, shorten the promise, not the facts.

## 4. Responsive layout

Checked with `viewports.mjs` at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px on every page: no flags. Breakpoints are in em; side gutters come only from `.wrap`.

| From | What changes |
|---|---|
| 0 | One column. Header: mark, name, icon-over-label "Phone" and "Menu". Facts in 2 columns, grades full width. Bento: 2 columns, where `.half` blocks sit side by side and everything else spans both. Rooms 2 by 2. |
| 30em | Header buttons become single-line pills. |
| 40em | Brand place line shows. Facts in 4 columns (grades full width) until the hero splits at 56em. Bento: every block is 1 column, `.wide` and `.full` span 2. Steps 2 columns. |
| 46em | Fee and date tables stop stacking. People and next-links go to 2 or 3 columns. |
| 48em | The header Phone button shows the number. |
| 56em | Hero goes to 2 columns (text, then facts and actions) and shows its dots. `.split` goes to 2 columns. |
| 60em | Full nav row of pills, "Book a visit" in the header, no Menu button. |
| 64em | Bento goes to 4 columns: `.tall` spans 2 rows, `.full` spans the row; `.bento--3` is 3 columns. Rooms in a row of 4. Steps in a row. Footer in 4 columns. |

Rules:
- In a `.half` block on a phone, write a headline and up to 8 words. Longer copy goes in a `.wide` or `.full` block.
- The bento must come out even at 360px: `.half` blocks come in pairs.
- Keep the menu to 6 items so the pill row fits at 60em.

## 5. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.stop`, `.dot`, `.on-ink` | The full stop on a heading; a coloured stop inside a heading; switch the dot to `--dot-on-ink` on ink. |
| `.btn`, `.btn--outline`, `.btn--small`, `.actions--pair` | Pill buttons that press down 2px. On ink (`.on-ink`) the main button is white with ink text. One action colour. |
| `.go` | Stand-alone verb link with a round arrow, 44px tall. |
| `.chip`, `.chips`, `.chip--tag` | 44px pill links (Already with us?, On this page) and colour tags for facts ("French", "Early start"). |
| `.status[data-status]`, `.status--light` | Live open/closed pill on ink, or on a light block. |
| `.facts`, `.facts__wide`, `.facts__grades .g` | Hero key facts as white pills; grades as small round numbers (the words are in a visually hidden span). |
| `.block` + `--butter/--mint/--sky/--peach/--ink/--line` | The colour block. 24px radius. Text is always ink on tints. |
| `.bento` + `.half/.wide/.tall/.full`, `.bento--3`, `[data-rise]` | The bento grid. `data-rise` opts the children into the rise-once motion. |
| `.block__icon`, `.block__photo`, `.block-link`, `.block__more` | A round icon badge; a photo cropped into the top of a block; a heading link that makes the whole block clickable. |
| `.tile`, `.tile__num`, `.tile__label`, `.tile__source` | Number tiles. `.tile__num` ends with the dot automatically. |
| `.grades`, `.grades--row` | Every grade with its heading and word. Row of 4 from 64em on inner pages. |
| `.award` | Rosette SVG plus text. |
| `.ticks`, `.ticks--2` | Icon-ticked list ("What your fee covers", "What to bring", questions to ask). |
| `.fee-line`, `.closure-line` | The one big price sentence; the next-closure sentence. |
| `.day`, `.day__time`, `.day__node`, `.day__what` | The vertical day, joined by a dotted line of dots. |
| `.steps`, `--tint`, `--big`, `--3`, `--4` | Numbered steps. |
| `.quote`, `.quote--plain` | Quote in display type with a source line. |
| `.menu-card`, `.menu-list` | "A week of lunches" with the vegetarian option under each. |
| `.table`, `.table--stack`, `.table-note`, `.row-flag` | Tables that stack into cards below 46em (use `data-label` on every `td`). Rows with `data-from`/`data-to` get past, Now and Next. |
| `.hours` | The hours board; `tr[data-day]` gets "Today". |
| `.summary` | Key and value rows (place rules, payment terms). |
| `.people`, `.person`, `.person__initial`, `.person__role`, `.person__body` | Staff cards with initials in a tint (or a consented 64px round photo). |
| `.rooms`, `.room`, `.room__art` | Room blocks with the drawn emblem. |
| `.notice`, `.notice-band` | Dated notice in the page flow. |
| `.note` (+ tints), `.details` | Inset note; expanders ("What the letters mean"). |
| `.photo` | 3:2 photo with a caption. |
| `.page-head`, `.breadcrumb`, `.contents`, `.next-links` | Inner page head (ink block with dots), breadcrumb, "On this page" chips. |

Don't add a component until you've checked one of these won't do. If you must, use tokens only.

## 6. Tokens (section 1 of `styles.css`)

| Token | Example value (KingsWellies) | Rule |
|---|---|---|
| `--ink` | `#1E1B3A` | Text, hero, footer. 16.5:1 on white, 15.6:1 on cream. Keep it a deep navy or near-black. |
| `--ink-soft` | `#4A4766` | Secondary text: 8.3:1 on cream, 5.7:1 or more on every tint. Don't go lighter. |
| `--cream`, `--white` | `#FFF8EC`, `#FFFFFF` | Page ground; cards, header, alternate sections. |
| `--action`, `--action-strong` | `#0B5A8E`, `#08446B` | The one action colour: main button and links. **White on it 4.5:1 or more** (7.3:1 here). |
| `--dot` | `#168BD0` | The full stop on light grounds. **Never text.** Aim for 3:1 on white (3.7:1 here). |
| `--dot-on-ink` | `#4FB6EE` | The stop on ink, the footer dots, button shadows on ink. 7.3:1 on ink. |
| `--butter`, `--mint`, `--sky`, `--peach` | `#FFD166`, `#BFE6D3`, `#C9DDF7`, `#FFC2B0` | The four block tints. Ink on each is 10.7:1 or more. Keep them flat. |
| `--line`, `--line-strong` | `#E7DFD0`, `#77738F` | Hairlines; control and table edges (4.6:1 on white). |
| `--open`, `--closing`, `--closed` | | Status pill dots. Don't re-theme. |
| `--focus`, `--focus-ink` | `#FFDD00`, `#0B0C0C` | GOV.UK focus. Never change. |
| `--font`, `--font-display` | Figtree, Bricolage Grotesque | Keep. Display face for headings, numbers, quotes and the brand name only. |
| `--text`, `--text-small` | 18px, 17px | Never below 17px for reading text. |
| `--h1`, `--h2`, `--h3`, `--num` | `clamp()` scales | Change only if a long name breaks the `h1` at 360px. |
| `--radius`, `--radius-l` | 24px, 32px | Blocks; hero and footer corners. |
| `--tap`, `--button-height` | 44px, 56px | Never lower. |

The default palette in E§4.2 uses a tomato dot (`#E4572E`) and a brick action (`#B83A24`). The example swaps both for KingsWellies' wellie blue, as E§4.2 allows ("the nursery's brand colour may replace `--dot` and `--action`").

### How to re-theme for a new nursery
1. Copy `example/` to a sibling folder, keeping `../styles.css`, `../fullstop.js` and `../fonts/` resolving.
2. **Gather facts** (section 9's list) and note where each came from. Read every PDF on the site: fee sheets, funding packs, menus and newsletters are usually newer and fuller than the web pages.
3. **Colour.** Take the nursery's logo or sign colour.
   - `--dot`: the colour itself, darkened until it's about 3:1 on white. `--dot-on-ink`: a lighter version with 4.5:1 or more on ink.
   - `--action`: the same hue darkened until white on it is 4.5:1 or more (aim for 7:1), and `--action-strong` about 15% darker.
   - If the brand colour is a hot primary (pillar-box red, pure yellow), use it only as `--dot` and keep a deep `--action`.
   - Keep `--ink`, the tints, focus and status tokens. Check every pair with a contrast script.
4. **Mark and emblem.** Redraw the nursery's logo as a simple inline SVG at 64 × 72 (`.brand__mark`). If its rooms have names, draw one emblem that can vary per room (KingsWellies: a wellie in four sizes). Flat shapes, 2.5px ink outline, no faces, no cartoon eyes.
5. **Promise.** Write one about the parent's day, 8 words or fewer, ending in the dot, with true times ("Drop-off from 8. Home by 5.45. Sorted."). The fact sentence goes under it.
6. **Copy:** replace every KingsWellies fact on every page. Then `grep -n "Wellie\|KingsWellies\|741175\|AB15\|Prime Four\|Kingswells\|Entier\|CS2014328470\|Laura\|Kerry\|Aberdeen" *.html` must return nothing from KingsWellies.
7. **Schedule and dates:** rewrite `#nursery-schedule` (section 7), the hours board, the date tables and any dated notice. Check weekdays with a script.
8. **Grades:** copy every heading, grade and date from the latest report.
9. Update `<title>`, meta description, `theme-color` (= `--ink`) and the footer review dates.
10. Run the checklist in section 10.

## 7. The schedule (`#nursery-schedule`)

On **every** page, at the end of `body`. Same format as Front Desk.

```json
{
  "timeZone": "Europe/London",
  "closingSoonMinutes": 30,
  "days": { "mon": [["07:30", "18:00"]], "tue": [["07:30", "18:00"]], "wed": [["07:30", "18:00"]],
            "thu": [["07:30", "18:00"]], "fri": [["07:30", "18:00"]], "sat": [], "sun": [] },
  "closures": [
    { "from": "2026-12-21", "to": "2027-01-01", "label": "Christmas and New Year" }
  ]
}
```

- `days`: 24-hour sessions per weekday.
- `term` (optional, term-time nurseries only): `{"from", "to", "label"}`; days outside it are closed. All-year nurseries leave it out and list closures.
- `closures`: whole days, inclusive, in date order. `label` reads after "Closed for".
- Status wording: "Open now. Home time is 6pm"; in the last 30 minutes "Open now. Home time soon, at 6pm"; "Closed now. Opens tomorrow at 7:30am"; "Closed for Christmas and New Year. Opens on Monday 4 January at 7:30am".
- `[data-next-closure]` gets "Next closure: …, from Monday 21 December. Back on Monday 4 January." Write a sensible static fallback.
- Table rows with `data-from`/`data-to` get past, Now and Next marks. Use them for funded weeks or term dates.

Test with Playwright's clock (`page.clock.setFixedTime`) before handover: a weekday at 7:15am, 10am, 5:40pm and 6:10pm; a Friday evening; a day inside each closure; the day before a closure.

## 8. Inner pages

Every page reuses the head, header, footer, schedule and script exactly. Only `<title>` ("[Page]: [Nursery], [area]"), the meta description and `aria-current="page"` change.

**Page head** (replaces the hero): `div.page-head.on-ink` with `svg.page-head__art`, `nav.breadcrumb`, `h1.stop`, `p.page-head__lead` (the answer most people came for), optional `.page-head__actions` and status pill, and `nav.contents` ("On this page" chips, one per `h2`). Sections alternate `.section--white` and cream.

| Page | `h1` | Sections, in order |
|---|---|---|
| `join-us.html` | Visit and join | How visits work (3 tinted steps) · What you'll see (inspector quote, a room photo, 4 half blocks) · Questions to ask on your visit (our list, Parent Club link) · How places are offered (`dl.summary` of the nursery's rules + "Register your interest" block) · Settling in (4 steps, moving up a room, a parent quote) · What to bring · When funded hours start (birthday table from the council) · Your information (privacy policy link) |
| `our-nursery.html` | Our nursery | Rooms (room blocks + photos) · A day here (full `ol.day` + funded-day note) · Food (who cooks, allergies, inspector quote, a week's menu as a stacked table) · Outdoors (bento) · Learning (national guidance in plain words, classes as tags) · Care, sleep and handover · Extra support · Our inspection (grades row, two quotes, what the nursery is improving) |
| `fees-and-funding.html` | Fees and funding | What your fee covers · Our fees (stacked table, source and "Last checked", 3 number tiles for discounts, deposit, minimum days) · Funded hours (tiles, how it works here, splitting, how to apply) · Funded weeks (dated table with Now and Next) · 2 year olds · Optional extras on funded days (table + opt-out note) · Paying your fees · Help with costs |
| `our-team.html` | Our team | Running the nursery (manager first) · Behind the scenes (directors) · Kitchen · Your child's key person · Qualified and checked (SSSC and PVG as supplied, "What the letters mean") · In their words (staff quotes the nursery published) · Work with us |
| `parents.html` | For parents | (dated notice) · Closures and dates (next closure, dated table) · If your child is ill · What to wear · Lunch · Paying fees · Drop-off and parking · Staying in touch · Our policies · Worries and complaints (steps, then the Care Inspectorate) |

Rules:
- Forms are HTML, not PDF (N§6.4). Static templates default to "Phone or email us"; add a form only with a compliant receiving service and minimal fields (N§6.3).
- Don't link pages that don't exist. Policies, privacy and accessibility pages are added when the nursery supplies them.

## 9. Illustration and motion

**Illustration is drawn in-house as inline SVG**, recoloured with tokens. No people, faces or hands, no stock packs, no AI images. The set:
- **About 34 line icons** (24px grid, 2px stroke, round caps) in the sprite: phone, dots (Menu), clock, sunrise, moon, bowl, apple, cup, nappy, paint, music, book, boot, tree, rain, chat, key, car, pin, calendar, pound, tick, star, door, bed, leaf, mail, ball, heart, file, sun, home, shield, people. Generated into each page by the build; copy the `<svg class="sprite">` block as is.
- **The brand emblem** (`#boot` symbol and `.brand__mark`): the nursery's logo, redrawn. Per nursery, replace it.
- **Room emblems:** the emblem at 4 heights (55%, 70%, 85%, 100% of `.room__art`), one per room.
- **Rosette** for one real award.
- **Decorative dots** (`.hero__art`, `.page-head__art`): two or three flat circles in ink-tint, `--dot-on-ink` and butter, desktop only, never behind text.

**Motion** (only under `prefers-reduced-motion: no-preference`):
- Bento children below the first screen rise 8px and fade in once as they scroll in (250ms, 40ms stagger). Anything already on screen at load is never hidden.
- A heading's full stop pops once (scale 0.6 to 1, 200ms) as it scrolls in.
- Buttons press down 2px; whole-block links lift 3px on hover.
- No loops, no parallax, no count-ups, no carousels.

## 10. Pre-handover checklist

Any "no" blocks handover. This adds to N§8.

**Facts**
- [ ] Every fact traces to the nursery's site, its documents or its Care Inspectorate record. Disagreements are listed in your report.
- [ ] Every number tile has a source line on the page and a source comment in the HTML, and the number is still true.
- [ ] Grades, exact headings, inspection and publication dates match the latest report. The report link resolves.
- [ ] "What your fee covers" matches the fee terms word for word in meaning. Optional extras say they're optional.
- [ ] Funded status is confirmed. Fees show "from [date]" and "Last checked".
- [ ] Quotes: inspector quotes verbatim with month; parent quotes from the nursery's own pages, 3 at most.
- [ ] Award wording says finalist or winner correctly, with the body and year.
- [ ] Schedule JSON, hours board, date tables and notices agree; every weekday checked.
- [ ] No identifiable child, no child's name, in any image. EXIF stripped. `img/CREDITS.txt` complete.

**Design**
- [ ] Every `.stop` sits on a statement, never a question, label or name.
- [ ] Bento rows come out even at 360px and 1280px. `.half` blocks hold a headline and 8 words or fewer.
- [ ] First 390 × 844 screen: status, name, promise, fact sentence, key facts and both actions.
- [ ] Menu is 6 items. No pop-ups, carousels, auto-play, embeds, widgets or trackers.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:PORT/<folder>/ <out>`: **0 blockers, 0 major, 0 minor**.
- [ ] `node pipeline/viewports.mjs <url> <out>` on every page: no flags at all 9 widths. Look at 390, 768 and 1280 yourself.
- [ ] Live status tested with Playwright's clock (section 7).
- [ ] Keyboard only: skip link, menu (Escape closes), visible focus on ink, cream and butter.
- [ ] Text at 200%: no sideways scroll at 390px or 1280px.
- [ ] Homepage under 1 MB on a phone.
- [ ] Every external link checked by hand where the audit couldn't verify it.

## 11. KingsWellies example: sources, and facts to confirm

**Sources** (crawled 13 October 2026): kingswelliesnursery.com (60 pages), its PDFs (*Fees Information from April 2026*, *1140 Hours Funding Information Pack 26-27* with the 2026/27 funding calendar, *Nursery Lunch Menu* and *Snack and Lunch Menu* January 2026, *Prospectus* October 2024, newsletters from 2024 to August 2026, the *Community Award 2026* entry, the *Food Law Summary* January 2023), the nursery's copy of the **Care Inspectorate report of 24 October 2024**, and our Care Inspectorate data (CS2014328470, 173 places, manager Laura Barry, grades published 2 December 2024).

KingsWellies is one of three Wellies Nurseries (with QueensWellies and West End Wellies) that share one website. Only facts that the site ties to KingsWellies, or that apply to all three, were used.

Confirm these with the nursery before go-live:
1. **Parent quotes.** The three homepage quotes and the settling and key-person quotes come from "August 2026 Parent / Carer Feedback" on the shared Wellies site, which mixes all three nurseries. Only one ("a huge asset to KingsWellies", trimmed to its first sentence) names KingsWellies. Confirm each is from a KingsWellies parent and that the nursery is happy to reuse it.
2. **Places.** The website says KingsWellies has "limited spaces" (undated). The example says "Phone to check".
3. **Visit times.** The site says "contact us for a tour" but gives no times. The example says "Phone to check our visit times."
4. **Who makes lunch.** The diet page says lunch is prepared by catering partner Entier; newsletters mention a chef (Chef Sandra, August 2025) and a kitchen team. Confirm how lunch is made today, and Sandra's consent to be named.
5. **Which menu week is current.** The example shows week 1 of the January 2026 four-week menu. Confirm the current menu.
6. **Three Green Flags.** From the About us page, with no dates. Confirm the years and that they're current.
7. **Room ages.** The website and the Care Inspectorate report give slightly different ages (Tots "about 1.5 to 2.5" on the site, "18 months to 3" in the report; Beans "2.5 to 5"). The example uses the website's ages and the report's place numbers.
8. **Room photos.** The three room photos are from the website, probably from around opening (2015 to 2016). Confirm they still look like this, and which room each shows.
9. **SSSC and PVG.** The site says all staff "will be registered" with the SSSC and screened through PVG. Confirm current wording.
10. **Tax-Free Childcare.** The site explains it but never says the nursery accepts it. The example says "Ask us about paying this way". The fee terms also mention childcare vouchers and old Tax Credits links.
11. **Ratios.** The prospectus has a ratio table whose numbers didn't survive extraction. The example says "Ask us about our staff ratios".
12. **Complaints procedure.** Not published. The example says to speak to the key person, the office or Laura, and offers the Care Inspectorate route.
13. **Policies.** Only PDF contents lists (September 2022) and a few documents are online. Publish current policies as HTML.
14. **Award.** Finalist in 4 categories at the Scottish Nursery Awards 2026 (news post of 1 October 2026; finals on 21 November 2026, from the badge artwork). Update after the finals.
15. **Facebook and Instagram.** Mentioned in newsletters; no page URLs were found for KingsWellies, so none are linked.
16. **Christmas closure dates** come from the 2026/27 funding calendar (purple weeks): Monday 21 December 2026 to Friday 1 January 2027. The end of summer 2027 is marked "estimated" by the nursery.
17. **Privacy policy** links to the nursery's current page on its old site; replace it with the new site's page at handover.
