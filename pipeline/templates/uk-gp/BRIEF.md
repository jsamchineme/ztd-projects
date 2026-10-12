# Front Desk GP: a website template for UK GP practices
> Pipeline name: **Front Desk GP** (folder `templates/uk-gp/`). The **Front Desk** family (GP, Dental, Local) is task-first with little imagery; the **Familiar Faces** family (GP, Dental) and **Doorway** are people- and photo-led. When this brief says "Front Desk", it means this template.


**Front Desk** makes a practice website do what a good receptionist does all day: say whether the practice is open, tell people the answer to their question straight away, and point them to the right place when the practice is not the right place. It is built on the NHS.UK look and the NHS design system, because patients trust it and NHS England's GP website benchmark rewards it. The premium comes from doing the NHS patterns exceptionally well, not from fashion: a live "are you open?" panel, answers printed on the task cards, a week-at-a-glance rota of who works when, and a full staff list with qualifications.

It is the "after" in a before-and-after pitch, and the design system AI build workers reuse for every practice. Follow this brief exactly.

## Files

| File | What it is | Edit per practice? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token as a CSS custom property. | Tokens only (section 1) |
| `frontdesk.js` | Plain JavaScript, about 200 lines, no dependencies. It runs the phone menu, the live open/closed status, dated notices, the "Now" row in opening times, and the in-page search. | Never. It reads its data from the page |
| `fonts/` | Hind Regular and SemiBold as Latin-subset woff2 files (16 KB each), SIL Open Font Licence (`fonts/OFL.txt`). | Never |
| `example/index.html` | A full worked homepage for Kingsmills Medical Practice, Inverness, using only supplied facts. Copy it for each new practice. | Yes, it's the copy you start from |
| `example/img/` | The example's one photo (WebP and JPEG) and `CREDITS.txt`. | Each practice gets its own `img/` |

The page links `../styles.css` and `../frontdesk.js`, and fonts load from `../fonts/` through the stylesheet. Keep that folder shape. There is no build step and no framework, and nothing loads from another server: no Google Fonts, no CDNs, no analytics, no embedded maps (GDPR).

---

## 1. Concept, and what went wrong before

The rejected rounds (`civic/`, `atelier/`, `haven/`) were each well made but designed for designers. Civic used giant 01–09 wayfinding numerals and condensed display type. Atelier was an editorial magazine with italic serif headlines. Haven was a "Highland hotel" with a full-bleed landscape and a serif voice. All three:
- traded the NHS identity patients look for for a fashion reference (transit signage, magazine, hotel);
- ignored the benchmark's explicit reward for NHS components and colours;
- made people decode a concept before finding the phone number;
- used warm "paper" grounds and custom display type that read as boutique, not as a health service.

A practice manager is buying trust and fewer phone calls, not a look.

Front Desk goes the other way:
- **Credible first.** It uses NHS Blue, the NHS grey page, NHS focus yellow, NHS green buttons, NHS care cards, inset text, warning callout, summary list, details, action link and card patterns. A patient who knows nhs.uk knows how to use it.
- **Answers, not signposts.** Every task card carries the answer in one line ("Phone us from 2pm to 5:30pm, Monday to Friday"), so many people never need to click.
- **Live, honest status.** The panel at the top says "Open now", "Closed for lunch" or "Emergencies only" in UK time. It knows public holidays and special closures, and says when the practice opens next.
- **Premium through care, not decoration.** The finish is a 4px brand rule on key surfaces, a single place photograph on desktop, tabular figures for times, an exact 8px spacing rhythm, and real information design: the GP rota and the hours table with the current period highlighted.

## 2. Research-to-design decisions

Each major decision and the finding that drives it. Sources:
- **[B]** NHS England GP website benchmarking and improvement tool (2023, 50 criteria), with the item number.
- **[G]** NHS England's step-by-step guide to improving GP website online journeys.
- **[SM]** NHS digital service manual.
- **[HW]** Healthwatch 2025 audit of 19 practices.

| Decision | Finding that drives it |
|---|---|
| No pop-ups, overlays, cookie walls, chat widgets or carousels. Notices are in-page warning callouts; search results appear in the page flow. | 27% of participants who met an overlay first struggled to get past it, especially on mobile [B1]. |
| NHS look: NHS Blue header, NHS palette, Frutiger-like type (Hind, OFL), NHS components throughout. | The NHS logo and blue are "highly recognised and trusted" [B27]. A site "built largely using components from the NHS Digital Service Manual" scores Well [B28]. |
| "Appointments" is in the main menu and is the first task card. A "How to get an appointment" link is in the hero. | "Appointments" is the word patients scan for; it must be in the main menu and the top third of the homepage [B2]. |
| Main menu of 7 items: Home, Appointments, Prescriptions, Test results, Register, Our team, Contact us. | One main menu of 7 or fewer items, including Home, Appointments and Prescriptions [B29]. |
| Phones: Appointments and Prescriptions stay visible, and a button labelled "Menu" (no hamburger icon) shows the rest. Desktop: the full menu is always open. | Menu visible on desktop; on mobile, "don't use an icon to represent the menu… users often don't understand these icons" [B30]. |
| Search is always visible with the word "Search" and a real button, on desktop and phone. The example's search answers inline from `data-search` keywords. | Search box visible, contains "search", has a button [B32]. Searches for appointment, prescription, sick note, test results and register must surface the main page first [B33]. Tested: all five do. |
| Task cards in research order: book, change or cancel, prescription, sick or fit note, test results, register, home visit, team, find us. Book, prescription and test results are the three large cards. | Top tasks ranked by patient research [G]. Test results link in the top third, ideally above the fold [B18]. Five top tasks in the upper third [B36]. 80% of users look on the homepage first [B36]. |
| Homepage copy is links and sentences of 20 words or fewer. Detail sits in sections with short paragraphs. | "No paragraphs of text on the homepage… short sentences (20 words or fewer)" [B35]. Short paragraphs of 30 to 60 words, clear headings [B4, B17]. |
| Appointments section has headings literally called "Routine appointments" and "Urgent appointments", plus change or cancel and home visits. | Benchmark labels [B5, B6, B7, B11]. |
| Honest channels: "Online booking is suspended for now." No NHS App or online-consultation claims unless the practice confirms them. | Explain which tools exist and what they are for [B10]. Never invent (owner's rule). |
| "Need help urgently?" uses NHS care cards: emergency 999, urgent closed (NHS 24 on 111 in Scotland, NHS 111 in England), urgent open (duty doctor), not urgent (pharmacy), plus the dental helpline. A one-line urgent route also sits in the hero. | Out-of-hours information on the appointments and contact content [B24]. Urgent and out-of-hours routes are a common failure [HW]. |
| Opening times use NHS style: "8am to 6pm", "8:30am", "midday", "to" not dashes, days and months in full. | [B23]; NHS content style guide on numbers, dates and time [SM]. |
| One contact section holds phone, address, email (with "not for medical matters"), out of hours, opening times, public holidays, directions and building access. | All contact information on one page, including physical access [B22, B25]. Access is a common failure [HW]. |
| The staff list shows every clinician's role, qualifications and year and place qualified, plus gender where the practice states it. GP partners are listed separately. A "What do the letters mean?" expander explains the qualifications. | Staff list with roles, gender and qualifications [B47, HW]. Partnership information is a contractual requirement (compliance section). Avoid jargon [G]. |
| Week-at-a-glance rota of GPs' usual days (desktop), plus usual days in words on every card (all sizes). | Helps patients choose and keep their own doctor. Supports "named GP" and continuity [B48, HW]. |
| A "Your named GP" block. If the practice hasn't said how it assigns one, it says to phone. | Named or accountable GP information [B48]; often missed [HW]. |
| CHI or NHS number card. In Scotland it's the CHI number; in England, link to the NHS number finder. | Find your NHS number [B49]; often missed [HW]. |
| Vaccinations card linking to NHS inform (Scotland) or nhs.uk (England). | [B46]; often missed [HW]. |
| Test results by phone, with times, identity check and call-back. Text results only if the practice confirms them. | [B19]; results by phone and text is a common failure [HW]. |
| Links start with verbs and say where they go ("Read about fit notes on NHS inform"). | Link text guidance [G]. |
| Reading age 9 to 11: short words, "we" and "you", no jargon ("ECGs (heart traces)"). | [G], [B34]. |
| "Page last reviewed" and "Next review due" (6 months) in the footer. | Add timestamps; review key pages every 6 months [G]. |
| Images only where they help: one decorative place photo on desktop only (phones never download it). No stock people, ever. | "Images should only be used if there is a real user need" [G]. Performance on mobile data. |
| WCAG 2.2 AA throughout: NHS yellow focus, 44px targets, skip link, landmarks, reduced motion, 200% text. | NHS accessibility requirements [SM, G]; the owner's audit. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts.** Every name, qualification, time, date, service, policy and channel must come from the practice's current website, NHS listing or job card.
   - No online booking, NHS App, online consultation, text results, parking, ramps, lifts, hearing loops, awards, statistics or reviews unless supplied.
   - Don't infer a person's gender from their name. State gender only where the source does.
2. **When something is unknown, say "phone us".** Or link to NHS inform (Scotland) or nhs.uk (England). Examples: building access, named GP, how to request a fit note, complaints process, CHI or NHS number.
3. **Photos:**
   - Use the practice's own photos, or Creative Commons photos of the town from Wikimedia Commons, downloaded locally and credited per licence (on the image on desktop and in the footer) and in `img/CREDITS.txt`.
   - Never use stock photos of people. Never present a photo as the practice building unless you have confirmed it is that practice. On Southside Road, Inverness, the Geograph "Southside Road Surgery" photos show a different practice.
4. **Logos:**
   - Never redraw the NHS logo. If the practice supplies an official NHS or board logo file, place it as an inline SVG or image with class `brand__logo` inside `.brand`. Otherwise use the text lockup ("GP practice in [town], part of NHS [board]").
   - In England, the NHS primary care logo is what [B27] rewards, so ask the practice for it.

### Content style (NHS)
5. **Times and dates:**
   - Times: `9am`, `5:30pm`, `midday`.
   - Ranges with "to": "Monday to Friday, 8am to 6pm".
   - Dates in full: "Friday 16 October 2026".
6. **Phone numbers:**
   - Practice numbers are `tel:+44…` links shown as "01463 235245".
   - **Short numbers (999, 111, 119) are plain text, never `tel:` links.**
7. **Links:** start with a verb and make sense on their own. Never "click here".
8. **Homepage sentences:** 20 words or fewer. **Section paragraphs:** 60 words or fewer.
9. **Pop-ups:** none, of any kind. A cookie notice, if a live site ever needs one, must sit in the page flow, not over it.

### Accessibility (WCAG 2.2 AA)
10. **Contrast:** keep the token pairs in section 6. If you change a colour, re-check it: text 4.5:1 (3:1 at 24px or 19px bold and larger); UI edges, icons and focus indicators 3:1.
11. **Structure:** one `h1` (the practice name). Then `h2` per section and `h3`/`h4` inside, never skipping a level. Landmarks are `header`, `nav[aria-label]`, `main#main`, `footer`. Keep the skip link as the first element in `body`.
12. **Focus:** the NHS focus style (yellow block and dark bar) comes from `styles.css`. Never remove it or set `outline: none` without a replacement.
13. **Tap targets** are 44×44px or more on phones. The stylesheet already pads links in `p`, `li`, `dd` and `td` inside `main`, plus footer and status-panel links. If you invent a new container, add it to that rule.
14. **Phone menu:**
    - Keep `aria-expanded` and `aria-controls="nav-list"` on `.nav__toggle`; Escape closes it.
    - Mark the two most used items with `nav__item--keep` so they stay visible on phones.
15. **Motion and sizing:**
    - Motion only inside `prefers-reduced-motion: no-preference`.
    - Use rem everywhere. Never fix heights on text containers. The layout is tested at 200% text.
16. **Icons:** decorative SVGs get `aria-hidden="true" focusable="false"`.

### Known quirks of the in-house browser audit
17. Write short numbers like 111 and 999 as text, never `tel:` links (the audit rejects them).
18. Inline SVG marks and logos. Never use `<img src="….svg">` for text-only SVGs, because the audit flags them as broken.
19. Give small-print links a real 44px tap height on mobile. The footer rules already do this; keep them.
20. Don't embed maps; link to directions instead. If a practice insists on an embed, give the iframe `tabindex="-1"` and add a text "Get directions" link beside it.
21. Every link must resolve. Before handover, curl every external URL: NHS inform URLs change, so verify each one rather than guessing paths.
22. A practice-relative background image must be set in an inline `style` on the element. A URL inside a CSS custom property resolves against `styles.css` and 404s.

### Performance
23. Under about 1.5 MB per homepage. The example weighs 280 KB on desktop and 131 KB on a phone (the photo is desktop-only).
24. Photos:
    - Resize to 1600px wide.
    - Save WebP at quality 60–65 plus a JPEG fallback at about 72.
    - Use them through `image-set()` on `.hero__photo`.
    - Any `<img>` below the fold gets `loading="lazy"`, `width` and `height`.
25. Fonts: only the two preloaded woff2 files. Don't add weights or italics.

## 4. Homepage structure (keep this order)

All ids below are used by the menu, task cards, search and footer. Keep them.

1. **Skip link**: `a.skip-link` → `#main`.
2. **Header**: `header.header`.
   - `.header__top`, in this order: `a.brand` (name plus description line), `a.header__phone` (the number from 40em, "Call us" with an icon on phones), `button.nav__toggle` (chevron icon plus `span.nav__toggle-label` "Menu", `aria-controls="nav-list"`), and `form.search` (label, `input#search-field[required]`, button with "Search"). The toggle lives in the header row, not inside the nav, so name, Call and Menu share one row.
   - `nav.nav` with `ul#nav-list.nav__list` (7 items max).
3. **Search results region**: `div#search-results` (empty and hidden; `frontdesk.js` fills it).
4. **Hero**: `div.hero`.
   - `.hero__photo` (inline-style background, desktop only) and `.hero__credit`.
   - `.hero__intro`:
     - `h1` with the practice name;
     - a lede of one sentence;
     - `ul.hero__facts` (address, booking hours);
     - `p.hero__urgent` (the urgent route in one sentence);
     - `.hero__actions` (green `a.button` "Call [number]", and "How to get an appointment").
   - `section#status.status`: the live panel. Its children carry `data-status="date"`, `data-status="word"` and `data-status="detail"`, with a no-JavaScript fallback text. Below them, `dl.status__list` holds phone, booking hours, test results line and home-visit cut-off, then a link to `#opening-times`.
5. **Dated notice** (optional): `div.notice-band[data-show-from][data-show-until]` containing a `.callout`. It hides itself outside the dates. Use it for closures, training afternoons and phone changes. Never use it for marketing.
6. **Top tasks**: `section.tasks` with `h2` "How can we help?".
   - `ul.task-grid` holds 3 large `li.card.card--task` cards: book, prescription, test results.
   - `ul.task-list` holds the next 6 `li.task-list__item` cards: change or cancel, fit note, register, home visit, team, find us.
   - Each card has `h3.card__title > a.card__link`, a one-line `p.card__text` answer of 20 words or fewer, and the chevron SVG.
7. **Urgent help**: `section#urgent`, a `.care-grid` of 4 `.care` cards (`care--emergency`, `care--urgent` ×2, `care--non-urgent`), followed by the dental line in `.inset#dental`.
8. **Appointments**: `section#appointments`, using `.split` (main column plus `aside.split__aside` with the booking `.panel`).
   - Blocks: `#routine`, `#urgent-appointments`, `#cancel`, `#home-visits`, `#who-to-see` (nurse and HCA lists as two `.card--plain`).
9. **Repeat prescriptions**: `section#prescriptions`.
   - Three ways to order as `.card-grid--3`, with the online route as an `.action-link`.
   - The "no phone requests" `.inset`.
   - `#pharmacy-collection` and `#medication-review`.
10. **Test results**: `section#test-results`, numbered `ol.steps`.
11. **Sick and fit notes**: `section#fit-notes`, two cards (7 days or less, more than 7 days).
12. **Register**: `section#register`, `ol.steps` (area, proof, forms, health check), languages line, NHS inform link.
13. **Our team**: `section#team`.
    - Named GP block `#named-gp` in `.inset`.
    - Rota `table.rota` in `.rota-wrap` (desktop), with cell classes `day--all` (shows "Working"), `day--am` "Morning", `day--pm` "Afternoon", `day--alt` "Every other week" and `day--off` "Not usually".
    - Then `ul.people` lists by group (GP partners, salaried GPs, nurses, other staff), each `li.person` with `h4`, `p.person__role`, and `dl` (Qualifications, Qualified, Usual days).
    - Then the `details#qualifications` explainer. Only include abbreviations that appear on the page.
14. **Contact us**: `section#contact` with `.split`.
    - `dl.summary` (phone, address, email, when we're closed).
    - `#opening-times`: a `table.hours-table` whose rows carry `data-from` and `data-to` (HH:MM) so the current row gets a "Now" tag.
    - `#holidays`: a `ul.dates`, each `li[data-date]`; past dates hide themselves.
    - `#access`.
    - The aside holds a "Find us" panel with an action link to Google Maps directions.
15. **More information**: `section#more`, `.card-grid--3` of `.card--plain`: `#chi-number` (or NHS number), `#vaccinations`, `#health-a-z`, `#self-help`, `#complaints`, `#records`.
16. **Footer**: `footer.footer`.
    - Three columns: practice (address, call, email), Get help (NHS 24 or 111, NHS inform or nhs.uk, find a pharmacy, dental emergency), About us (team, complaints, health board).
    - `.footer__meta`: page last reviewed and next review due, photo credit, copyright.
17. **Schedule data**: `script#practice-schedule` (JSON, section 7). Place it at the end of `body`.

Sections alternate grey and `.section--white` to give rhythm. Keep the alternation if you remove a section.

**On a full multi-page build**, each of sections 8 to 15 becomes its own page with the same content and the same `h1`/`h2` pattern ([G] recommends separate Appointments, Prescriptions and Contact pages). The homepage then keeps items 1 to 7 plus a short contact strip, and the menu links point to the pages instead of the anchors.

**Search keywords:**
- Any element with an `id` and `data-search="words patients use"` becomes a search target. Add `data-search-title` if its heading isn't the right label, and `data-search-hint` for the one-line answer.
- Always include the patient words "sick note", "sick line", "appointment", "prescription", "test results" and "register".

## Responsive layout (keep it right)

Checked at 320, 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px, with no sideways scroll at any width. The breakpoints are 40em (640px), 45em (720px), 48em (768px) and 64em (1024px). Do not add others without re-checking every width.

**Header**
- **Under 40em:** one row with the practice name on the left, then the Call and Menu buttons. Both are compact bordered buttons of the same size, each an icon above a short label ("Call us", "Menu"). The search field sits full width below, then the nav band with the two `nav__item--keep` links.
- **40em to 64em (tablets):** the same row, but Call shows the full number with an icon, and Menu shows its label and a chevron. The search field is still full width below.
- **64em and up:** the name, number and search sit on one row (the search is 15 to 20rem wide), and the full 7-item nav sits below. There is no Menu button.
- **Open menu (under 64em):** the full list is shown stacked, with each row 48px tall.
- **Without JavaScript:** the Menu button is hidden and all 7 links wrap.
- The header row uses flex-wrap, so with very large text the name gets its own row instead of being squeezed. Keep `.brand` at `flex: 1 1 9rem`.

**Grids**
- **Top tasks:** one column of row cards (chevron on the right) until 64em, then 3 across (chevron at the bottom). Never put 3 big cards side by side on a tablet.
- **Task list:** 1 column, then 2 from 45em, then 3 from 64em. The hairlines come from a 1px grid gap. A short last row is stretched, so there are never empty cells.
- **`card-grid--3`:** 1 column, then 2 from 40em with an odd last card made full width, then 3 from 64em.
- **`card-grid--2`:** 2 from 40em.
- **Care cards:** 2 from 48em.
- **People:** 2 from 40em with an odd last card made full width, then 4 from 64em, or 3 when the group has exactly 3 people. Under 24em each label sits above its value.
- **Footer:** 1 column. Between 40em and 64em, the practice details are full width with the two link lists side by side. From 64em, 3 columns.
- **Status panel:** stacked on phones. From 48em to 64em the times sit beside the headline. From 64em the panel stretches beside the intro, with "See all opening times" pinned to the shared bottom edge.
- **Split (2/3 + 1/3):** from 64em only. The summary lists and date lists in the 2/3 column run full width, so they share a right edge with the tables.

**Text and rhythm**
- `h1` to `h3`, the status headline, the brand name and `.big-number` all scale with `clamp()`. There are no jumps.
- `text-wrap: pretty` on running text stops lone last words.
- Phone numbers, postcodes (wrap them in `span.nowrap`) and rota pills never break across lines.
- Sections end on their own padding: the last child in each `.wrap`, the last step and blocks inside grids have no bottom margin. Do not add bottom margins back to the last element of a section.

## 5. Components (all in `styles.css`)

| Class | Use |
|---|---|
| `.header`, `.brand`, `.header__phone`, `.search`, `.nav` | NHS organisational header. |
| `.callout` + `.callout__label` | NHS warning callout: closures, service changes. |
| `.hero`, `.hero__intro`, `.hero__urgent` | Hero box. On desktop it overlaps the photo band. |
| `.status` with `[data-state=open/limited/closed]` | Live status panel; the colour rule, dot and tag follow the state. |
| `.card--task`, `.task-list__item` | Clickable cards (the whole card is the target through `.card__link::after`). |
| `.card--plain`, `.card-grid--2/--3` | Grouped content with any number of links. |
| `.care--emergency/--urgent/--non-urgent` | NHS care cards. Emergency is red over black; urgent is red; non-urgent is blue. |
| `.inset` | NHS inset text for one important point. |
| `.panel` | The single key action next to a section (in `.split__aside`). |
| `.button` | Green NHS button. Use it once per screen, for the main action. |
| `.action-link` | NHS green-arrow link for going somewhere to do a task (order online, directions). |
| `.steps` | Numbered process. |
| `.summary` | NHS summary list (key and value rows). |
| `.details` | Expander for optional detail. |
| `.table`, `.hours-table`, `.rota`, `.day--*` | Tables. Hours stack on phones; the rota is desktop-only, because its content is repeated in words on each person card. |
| `.tag--open/--limited/--closed/--blue` | Status tags. |
| `.people`, `.person` | Staff list. |
| `.big-number` | Large figures for 999, 111 and the practice number in cards and panels. |
| `.visually-hidden` | Screen-reader-only text. |

Don't add new components until you have checked that one of these will not do. If you must add one, use tokens only, never raw colours.

## 6. Tokens (section 1 of `styles.css`)

| Token | Default | Role | Checked pair |
|---|---|---|---|
| `--colour-brand` | `#005eb8` NHS Blue | Header, links, non-urgent cards, key rules | White text 6.4:1 |
| `--colour-brand-dark` | `#003087` | Search button, pressed and tint text | White 11.9:1 |
| `--colour-brand-tint` | `#e5eff8` | Hover ground, "Now" row, morning pills | Link 5.5:1, text 12.4:1 |
| `--colour-on-brand` | `#ffffff` | Text on brand | – |
| `--colour-text` | `#212b32` | Body text | 14.4:1 white, 13.0:1 page |
| `--colour-text-secondary` | `#4c6272` | Hints, labels | 6.4:1 white, 5.8:1 page |
| `--colour-page` | `#f0f4f5` | Page ground | – |
| `--colour-surface` | `#ffffff` | Cards and panels | – |
| `--colour-border` | `#d8dde0` | Hairlines (decorative only) | – |
| `--colour-border-strong` | `#4c6272` | Edges that must be seen | 6.4:1 |
| `--colour-footer` | `#d8dde0` | Footer ground | Text 10.5:1 |
| `--colour-link`, `-hover`, `-visited`, `-active` | NHS link set | Links | 6.4:1, 9.2:1, 15.2:1 |
| `--colour-focus`, `--colour-focus-text` | `#ffeb3b`, `#212b32` | Focus. **Never change.** | 11.8:1 |
| `--colour-button`, `-hover`, `-shadow` | NHS Green set | Buttons | White 5.1:1 |
| `--colour-open-*`, `--colour-limited-*`, `--colour-closed-*` | NHS tag tints | Status | Text 9:1+; edges 3:1+ on white |
| `--colour-urgent` | `#d5281b` NHS Red | Urgent and emergency cards, hero urgent rule | White 5.1:1 |
| `--colour-emergency-body` | `#212b32` | Emergency card body | White 14.4:1 |
| `--colour-warning-bg`, `--colour-warning-edge` | `#fff9c4`, `#ffeb3b` | Warning callout | Text 13.5:1 |
| `--font-body` | Hind, then Frutiger, Arial | All text | – |
| `--weight-regular`, `--weight-bold` | 400, 600 | Two weights only | – |
| `--fs-*` | 17px body on phones, 19px from 40em | Type scale (h1 32 or 48px) | – |
| `--space-1` … `--space-8` | 4px to 64px | Spacing rhythm | – |
| `--radius` | 4px | Buttons, tags, search (cards stay square, as NHS.UK) | – |
| `--page-max`, `--measure`, `--gutter` | 70rem, 42rem, 1 or 2rem | Layout | – |
| `--tap` | 44px | Minimum target | – |
| `--hero-height` | 25rem | Desktop photo band | – |

### How to re-theme for a new practice
1. Copy `example/` to a new folder next to `styles.css` (or copy the whole template folder). Keep `../styles.css`, `../frontdesk.js` and `../fonts/` resolving.
2. **Colours:**
   - **Leave the NHS colours alone by default.** The benchmark rewards the NHS look [B27], so most practices should change no colour tokens at all.
   - If a practice has a strong brand colour, use it only for `--colour-brand-tint` (a pale tint) and possibly `--colour-brand-dark`. Check contrast against white and `--colour-text`.
   - Never re-colour focus, urgent, button or status tokens.
3. Replace every Kingsmills fact in `index.html` (`grep -n "Kingsmills\|01463\|IV2\|Southside\|Highland\|55817"` must return nothing from Kingsmills afterwards).
4. Rewrite `#practice-schedule` (section 7) and the hours table rows to match.
5. Hero photo: either supply one per rule 3 and set it in the inline style on `.hero__photo`, or remove `.hero__photo` and `.hero__credit`. The hero then sits on the grey ground, which works well.
6. Update the footer review dates (today, and today plus 6 months), and the credit or copyright lines.
7. **England instead of Scotland:**
   - 111 is "NHS 111" (not NHS 24) and the fit-note self-certification wording stays the same.
   - Link nhs.uk instead of NHS inform: health A to Z, NHS number finder, vaccinations, complaints, Pharmacy First.
   - Replace the CHI card with "Find your NHS number" linking to the nhs.uk NHS number service.
   - Ask for the NHS primary care logo.

## 7. The schedule (`#practice-schedule`)

```json
{
  "timezone": "Europe/London",
  "phone": "01463 235245", "phoneHref": "+441463235245",
  "weekdays": [1,2,3,4,5],                       // 0 = Sunday … 6 = Saturday
  "periods": [                                    // one normal day, in order, "HH:MM" 24-hour UK time
    { "from": "08:00", "to": "08:30", "state": "limited", "label": "Emergencies only", "detail": "…" },
    { "from": "09:00", "to": "13:00", "state": "open",    "label": "Open now",         "detail": "…" }
  ],
  "holidays": ["2026-12-25"],                     // closed all day
  "specialDays": { "2026-10-16": { "periods": [ … ], "closedLabel": "Closed for staff training" } },
  "closed": { "label": "Closed", "holidayLabel": "Closed for the public holiday", "detail": "If you need urgent help, call NHS 24 on 111. In an emergency, call 999." }
}
```

- **States:** `open` (green), `limited` (yellow, for emergencies only, restricted service or lunch with urgent calls) and `closed` (grey).
- Any time not covered by a period counts as closed. The panel then says "We open again tomorrow at 8am" (or the day, or the full date if a holiday intervenes), followed by `closed.detail`.
- A period with `state: "closed"` (for example early pre-booked appointments) shows its own `detail` plus `closed.detail`.
- Every label and detail is NHS-style plain English of 15 words or fewer.
- Keep the hours table's `data-from`/`data-to` in step with `periods`.

Test it before handover with Playwright's clock (`page.clock.setFixedTime`) at these times:
- 6am, 8:10am, 8:45am, 10am, 1:15pm, 3pm, 5:45pm and 7pm on a weekday;
- a Saturday;
- each holiday;
- each special day, before and after its close.

## 8. Adapting Front Desk for a dental practice

The system carries over unchanged. Only content and some section choices change.
- **Identity:** NHS dental practices may use the NHS look if they provide NHS care. A private-only practice must not use NHS Blue as a brand or anything that suggests it is an NHS service. Set `--colour-brand` to the practice colour (check 4.5:1 with white), and keep the care cards and focus colours.
- **Menu (7 max):** Home, New patients, Appointments, Treatments, Costs, Our team, Contact us.
- **Status panel rows:** Phone, Emergency slots (if the practice has a time to phone for same-day emergencies), Lunch, and "Out of hours: NHS 24 on 111" (Scotland) or "NHS 111" (England).
- **Top tasks, in this order:**
  1. "Join as a new patient" (NHS list open, closed or waiting list; say exactly what the source says, or "phone to check");
  2. "Book a check-up";
  3. "I'm in pain: get emergency help";
  4. "Check NHS costs";
  5. "Change or cancel";
  6. "Find us".
- **Urgent help:**
  - Emergency card: 999 for facial swelling affecting breathing or vision, or heavy bleeding that won't stop. Use NHS wording.
  - Urgent and open: phone the practice.
  - Urgent and closed: NHS 24 on 111 (Scotland) or NHS 111.
  - No GP duty doctor and no pharmacy card, unless the source mentions pain relief advice.
- **Costs section:**
  - Scotland: check-ups are free; patients pay 80% of treatment up to the NHS inform cap. Quote the current figure from NHS inform with a link, and recheck it at every build.
  - England: the nhs.uk bands.
  - Never invent private prices. Show them only if supplied, in a `.table`.
- **Nervous patients:** a `ol.steps` "What happens at your first visit", only with steps the practice confirms. Otherwise say "Tell us when you book if you feel nervous" (an instruction, not a claim).
- **Team:**
  - Dentists with their GDC number (if supplied), qualifications and year qualified; hygienists and therapists; nurses.
  - Drop the GP rota and the named-GP block. Keep a usual-days row only if supplied.
- **Remove:** test results, fit notes, repeat prescriptions, home visits, CHI number, named GP.
- **Search keywords:** "toothache", "emergency", "register", "join", "price", "cost", "check-up", "nervous".

## 9. Pre-handover checklist

Tick every line. Any "no" blocks handover.

**Facts**
- [ ] Every fact traces to the practice's site, its NHS listing or the job card. No online booking, NHS App, online consultation, text results, parking or access features unless the source states them.
- [ ] Unknowns say "phone us" or link to NHS inform or nhs.uk.
- [ ] Staff gender is shown only where stated. Every clinician is listed with role and qualifications, and partners are listed separately.
- [ ] Opening times, holidays and special closures match the source, and the schedule JSON and hours table match each other.
- [ ] The live status has been tested at the times in section 7.
- [ ] The dated notice has the right `data-show-from` and `data-show-until`, or has been removed.
- [ ] Photos are local, credited on the page and in `img/CREDITS.txt`. No stock people. The building is not misidentified.

**Content**
- [ ] Menu has 7 items or fewer and includes Home, Appointments and Prescriptions.
- [ ] Book, prescription and test results are in the top third on a 390px phone.
- [ ] Homepage task lines are 20 words or fewer. Paragraphs are 60 words or fewer.
- [ ] Every link starts with a verb.
- [ ] NHS style throughout: "9am to 5:30pm", days and months in full, no dashes in time ranges.
- [ ] 999 and 111 appear as text, not links.
- [ ] Search for "appointment", "prescription", "sick note", "test results" and "register" each returns the right section first.
- [ ] Footer review dates are set (today and today plus 6 months).

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:4481/<folder>/ <out>` reports **0 blockers, 0 major, 0 minor**.
- [ ] Desktop and phone screenshots reviewed, top to bottom (the audit only captures the top part, so screenshot the rest yourself).
- [ ] Phone menu opens and closes, and Escape closes it.
- [ ] Keyboard only: every control is reachable with a visible yellow focus.
- [ ] Text at 200% (`html{font-size:200%}`) at 390px and 1280px: no sideways scroll and nothing overlapping.
- [ ] `prefers-reduced-motion: reduce` turns off smooth scroll and the chevron nudge.
- [ ] Page weight is under 1.5 MB on desktop and phone. No request goes to any other server except link targets.
- [ ] Every external link returns 200 (curl them).

## 10. Kingsmills example: notes on the source facts

These were ambiguous in the brief and are worded to stay faithful. Confirm them with the practice before go-live:
- **Friday 16 October 2026:** "restricted service, closing at 12:30pm for staff training, with no incoming calls". It isn't clear whether calls are off all day or only after 12:30pm. The page repeats the source wording.
- **Extended hours:** "Extended-hours appointments daily 7:20am to 8am (ask reception)". The page says "daily", as the source does. The practice only opens Monday to Friday.
- **Opening times table:** it translates "administration 9am to 5:30pm" as reception being open for booking, from "Phone or call in, 9am to 5:30pm".
- **Unknowns, so the page says to phone:** test results by text, how the named GP is assigned, how to request a fit note after 7 days, building access, the complaints process, and how to get your CHI number.
- **Gender:** stated only for Dr Carrie Forbes (female), Dr Jonathan Humby (male) and Mrs Katie Skea (female). All other gender information is missing and should be requested.
- **Rota:** days listed without "morning" or "afternoon" are shown as "Working", meaning usually working that day, not necessarily all day.
