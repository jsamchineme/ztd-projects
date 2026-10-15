# Garden Gate (spacious version)

> Folder `templates/nursery/garden-gate-spacious/`. A side-by-side alternative to `nursery/garden-gate`, made after the owner said the nursery templates felt *"a bit cramped, especially in mobile view. I need more space and sometimes less detail on the home page, with a clear way to go into separate pages."* Same nursery, palette, fonts, photos, facts and voice. **The space brief (rules S1 to S13 in `prospects/research/nursery-spacious-directions.md`, Part 2) is now part of this template's rules. Read it before changing any spacing.**

## Spacious version: what changed and why

**Homepage (S3, S4, S5, S9).** A hero plus five sections, in this order: the essentials, the dated notice band, the walk band, the doors, and the Book a visit band.
- **Hero (S2):** only the name (h1), one sentence, "Book a visit" and "Phone 07732 048289" (S13), then the arched gate photo. The live status pill, key facts, waiting-list button and gate caption left the hero.
- **The essentials (S9)** replace the boxed key-facts grid: five lines with an icon each (ages, hours, funded hours, places, Care Inspectorate summary with the report link), hairlines between, no sub-notes, and one link, "All the details".
- **Dated notice:** now a full-width warm band, so it isn't another box. It carries the label, one bold sentence and the term dates link.
- **The walk band** keeps the day-band device (a solid card rising over a full-width photo) for the walk-through teaser. The gate caption ("There's no building…") moved here. One link goes on to the stops.
- **Doors (S9, S6):** five doors in the menu's order. Each door is one link: a small **arched photo** (the gate, again), a label and one line. They sit one per row on phones, two per row at tablet width and three per row on desktop.
- **Moved off the homepage, with nothing lost:** For parents tasks → the Parents door (and the footer). The walk-through stops → Our nursery. The day timeline, team list and grades panel → Our nursery and Our team (the essentials keep the grade summary, its date and the link). Fee cards → Fees and funding. Joining steps → Visit and join. **Hours and Find us** (hours table, live status, address, directions) → Visit and join, `#find-us`, and the menu's "Find us" now points there. The practitioners' strip → Our team, `#visits`. Quick links under the header were removed (S11: no inline menu under the logo). The doors and the menu sheet do that job now.

**Spacing (S1, S2, S7, S8).** Gutters are 24, 40 and 64px. Section padding is `--section: clamp(5rem, 3.6rem + 5.6vw, 8rem)` (80px on phones, 128px at 1280px). Gaps between groups are 48 or 64px, and between cards or doors 24 or 32px. Body text is 18px on phones and 19px on desktop, line height 1.6, with paragraphs capped at 60ch. The smallest text is 16px.

**Menu (S11).** Six items plus "Book a visit". On phones and tablets the menu opens as a full-height sheet: rows 56px tall, then Book a visit and Phone at the bottom.

**Inner pages (S10).** Every page opens with the same **page band**: breadcrumb, h1, an intro of 35 words or fewer, one action, and an arched photo that differs per page (the same photo as that page's door). Below it, **On this page** lists the sections. It reuses the walk's route device: numbered arch markers, now a vertical list with 56px rows. Sections are 120 words or fewer, with long detail in `.faq` accordions. Every page ends with a **Next door** and the Book a visit band. These replace the old "Where next" task lists.
- Our nursery: each stop of the walk is now its own short `section.stop`. The day's group times, "Keeping warm and dry", Support, Starting school and Earlier inspections are in accordions.
- Visit and join: "Who can come" is an accordion (`#who`), and Hours and Find us is new.
- Fees: the funding start-date table, deferring and 2-year-olds are in accordions.
- Our team: Buttercups and Foxgloves are separate sections, and Visits for practitioners was added.
- Parents: short-notice closures, illness, winter kit and packing the bag are in accordions. The page now ends with a Next door and the visit band.

**Signature devices kept:** the arch (eyebrows, gate photo, step and route markers, door photos, page-band photos, and a big outline arch around the Book a visit band), the numbered walk with its dotted path, the day timeline, the honest grades panel with pips, dated notices and the live status, the place colour and the oat paper.

### Measured: before and after (390 × 844 phone, `scratchpad/tools/density.mjs`, `words.mjs`, `inner.mjs`, 14 October 2026)

| Check | Space brief | Original | Spacious |
| --- | --- | --- | --- |
| Homepage length | ≤ 6 screens (about 5,064px) | 13,316px, 16 screens | **4,759px, 6 screens** |
| Words in homepage `<main>` | 120 to 180 (max 200) | 1,194 | **171** |
| First screen: text blocks / boxes | ≤ 7 / ≤ 3 | 15 / 7 | **2 / 3** (header Phone, Menu, Book a visit) |
| Text blocks per screen | ≤ 6 | average 8.7 | 2, 6, 5, 6, 4, then 11 in the footer; average 5.7 |
| Boxes per screen | ≤ 3 | average 4.0 | at most 3 in `<main>` per screen; average 1.2 |
| Hero | ≥ 70% of the first screen | n/a | 893px from below the header: the whole first screen |
| Homepage sections | hero + 5 | hero + 9 | hero + 5 |
| Inner page words (`<main>`) | about 900 or fewer | 433 to 1,161 | Our nursery 956, Visit and join 486, Fees 411, Our team 524, Parents 453 |
| Inner section body | ≤ 120 words | up to 386 | longest 112 (accordions closed). The parents' term-dates table is 104 with its table |
| Audit | 0 / 0 / 0 | 0 / 0 / 0 | **0 blockers, 0 major, 0 minor** (6 pages, 212 links) |
| `viewports.mjs`, 9 widths, every page | no flags | – | **no layout flags** on all 6 pages |
| Homepage weight (3x phone, scrolled) | < 1 MB | 648 KB | about 165 KB measured |

Our nursery is slightly over 900 words, because the five stops are the template's main content. Each stop is a short section of 42 to 105 words. The footer screen counts 11 text blocks: its nine links sit two to a row (S6 allows label-only links two per row).

---

# Garden Gate (the original brief, updated for the spacious version)

A place-led website template for independent Scottish nurseries: private, and voluntary or not-for-profit. Part of the **Doorway** family (`practice/doorway`).

**The idea in one line:** walk through the gate before you visit. The homepage answers "Is this for us?" first: ages, hours, funding, places and inspection grades, with "Book a visit" and "Join the waiting list". Then it walks a parent through the nursery with real photos, in the order their child will meet each place: the gate, the cloakroom, each room, the garden. A day-at-nursery timeline sits over a photo of the place.

Garden Gate is for nurseries whose place is their strongest asset: a converted villa or church hall, a big garden, woodland or beach access, a rural setting, or a fully outdoor nursery. The research brief calls this direction **C** (`prospects/research/nursery-websites.md`, section 7.2). Source tags such as **[SG25-12]** point to that brief's section 9.

Worked example: **The Secret Garden Outdoor Nursery, Letham, Fife**, a six-page site: `example/index.html`, `our-nursery.html`, `join-us.html`, `fees-and-funding.html`, `our-team.html` and `parents.html`. It is a fully outdoor nursery, so the walk-through starts in the park, not at a front door. Section 10 shows how the same parts map onto a nursery with a building.

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), then components. | Tokens only. |
| `gardengate.js` | About 120 lines of plain JS: the phone menu sheet, the live open or closed status (term closures included), dated notices, and today's row in the hours table. Reads everything from the page. No network calls. | No. |
| `fonts/` | Lora 600 (headings only) and Red Hat Text (body, variable 400 to 700), latin and latin-ext woff2, plus `OFL.txt`. A page loads the two latin files: 52 KB. | No. |
| `example/index.html` | The worked homepage. Copy it for each nursery. | Yes, for each nursery. |
| `example/*.html` | The five worked inner pages (section 12). Copy the shell exactly from `index.html`. | Yes, for each nursery. |
| `example/img/` | That nursery's photos (`.jpg` and `.webp` at each size) and `CREDITS.txt`. | Replace for each nursery. |
| `PHOTO-SHOTLIST.md` | One-page brief for the nursery or a local photographer, with the "tidy the room" checklist and a staff consent form. Doubles as the paid photo add-on. | Rarely. |

The example links `../styles.css`, `../gardengate.js` and `../fonts/`. Keep that layout.

## 2. How Garden Gate differs from its relatives

- **Doorway (`practice/doorway`, dental):** the same idea, "see inside before you visit", the same numbered route of stops with photos and practical answers, the same caption and alt text rules. Garden Gate changes the tasks (a parent choosing childcare, not a nervous patient), adds the essentials, the grades panel, the day timeline and dated closure notices, and swaps NHS colours and urgent-care cards for a calm, place-sampled palette.
- **Front Desk Nursery (direction A) and Key Worker (direction B):** A is task-first with almost no photos; B makes the staff the hero. Garden Gate makes the **place** the second thing on the page, after the facts. Use A for nurseries with few photos, B where the team is the strongest asset.
- **What the owner rejected:** generic, trend-driven and twee designs. Garden Gate has no rainbows, crayon or bubble fonts, clip art or cartoon animals [7.1]. Its only ornament is a small arch (the gate) used for the eyebrow mark, the step markers and the first photo's frame. Everything else is information: facts, grades, a timeline, fees. The colour comes from the nursery's own photos.

## 3. Research and the decisions it drives

| Decision | Research it comes from |
| --- | --- |
| **The first phone screens answer "Is this for us?"** The h1 is the nursery's name. One sentence says what it is and where. Then two actions: green **"Book a visit"** (to Visit and join) and **"Phone"**. The gate photo comes after, then **the essentials** (ages, hours, funding, places, grades) as five plain lines (spacious version, S9). | Top tasks on a 390px phone: ages, hours, weeks and area without scrolling, then places, cost and quality [2, 6.2]. Location is the top reason for choice (52%), and lack of local places the top barrier (19%) [SG25-7, SG25-9]. |
| **Grades shown honestly:** every grade from the latest report, with its exact headings, the date and a "Read our inspection report" link. Six pips per row, so a 4 (good) reads as what it is. Never the inspector's logo. The homepage essentials line gives the summary, the month and the report link; the full panel is on Our nursery. | Parent Club tells parents to judge quality from the inspection report [PC-Q]. Show every grade, the date and the link; never only the best; don't relabel headings; no Care Inspectorate logo [3.2, 4.1]. Most prospects score "good", so design for an honest 4 [1]. |
| **The walk-through:** numbered stops on a dotted path, in the order a child meets each place. Each stop pairs real photos with practical answers and "phone to check" where a fact is unclear. Photos stack on phones; no galleries or carousels. | Parents value outdoor play (88% had daily access; small outdoor spaces drove dissatisfaction) and praised "homey" settings [SG25-12]. Users study real photos and ignore stock [NNG-P]. Carousels go unnoticed and give the wrong idea of the place [NNG-C, NNG-A]. Showing the space answers the visit question before the visit [7.2 C]. |
| **"A day at nursery" timeline over a photo band:** the day as a list of moments, with times only when the nursery publishes them. The card rises over the photo's lower edge; text never sits on the photo. | Parent Club tells parents to ask about the day, settling in, food and outdoor time [PC-C]. A routine with times only if supplied [4.5]. |
| **Fees and funding in plain words:** the nursery's own fee figures with "Fees from [date]" and "phone to check", the funded-provider line, how to apply through the council, when funded hours start, and links (not calculations) for Tax-Free Childcare and Universal Credit. | "What will it cost?" is task 3 [2]. 1,140 hours, apply through the council, start-date table [MG-F, PC-F]. Funded status can change: confirm at build time [3.1]. Link, don't calculate; caps change [3.4, GOV-TFC, GOV-UC]. |
| **Dated closure notices** in the page flow (`data-show-from`, `data-show-until`), and term closures in the hours JSON, so the live status says "Closed today: staff training day". | Current parents' first task is today's closure or snow notice, then holiday dates [2]. Put closures on the site, not only on Facebook [6.4]. Never use a notice for marketing [6.2]. |
| **Current parents** reach closures, kit, lunch and the parents' login through the dated notice band, the Parents door and the footer (spacious version: no task panel on the homepage). | Current parents' tasks: closures, menu, forms, fees, the app [2]. |
| **Menu of 6 plus Book a visit:** Our nursery, Visit and join, Fees and funding, Our team, Parents, Find us. On phones the button says "Menu" and opens a full-height sheet. The quick links under the header were removed in the spacious version (S11); the doors take their place. | Six items, never more than seven; "Menu" with no icon [6.1]; S11. |
| **No pop-ups, chat, cookie banners, carousels, auto-play, social feeds or map embeds.** Directions are a plain link. | 27% who met an overlay struggled to get past it [6.4, B1]. Embeds are third-party trackers needing consent [6.4, ICO-PECR]. |
| **Plain English:** reading age 9 to 11, homepage sentences of 20 words or fewer, "8:30am to 5:10pm", days and months in full. No "pedagogy" or "provocations". | GOV.UK content style [GOVUK-S]; nursery jargon to avoid [6.4, 6.5]. |
| **Type: Lora 600 for headings, Red Hat Text for everything else.** A warm, bookish serif that a child's world can sit inside, and a humanist sans shared with Doorway. Two files on a page, self-hosted. | "Grown-up typography": humanist sans body, optionally one warm serif for headings only, two weights at most; no Comic Sans, crayon or bubble fonts [7.1]. Self-hosted, no CDNs [6.6]. |
| **Colour from the place:** warm oat paper, one confident green sampled from the woods or garden, and one warm "place" colour from the photos (bark, a door, brick). | Warm neutrals, one confident accent, wood and garden textures from the nursery's own photos [7.1]. |
| **GOV.UK yellow focus, 44px targets, WCAG 2.2 AA.** | [6.5, W3C-TS]. A nursery isn't an NHS service, so the focus style is GOV.UK's, not NHS.UK's. |

## 4. Rules (every build, no exceptions)

1. **Never invent facts.** Fees, availability, funded status, grades and report dates, ratios, staff names, qualifications, SSSC status, menus, allergen handling, hours, closures, term dates, policies, awards, reviews, "forest school" or "Gaelic medium" status, apps, CCTV, parking and accessibility features: only as the nursery or the Care Inspectorate record states them [3.6]. If something is unclear, missing or stale, write "phone to check" or "ask us" (styled `.check-note`). Read grades, places, phone and manager from the Care Inspectorate datastore in `prospects/nursery/`, not the nursery's own site [3.2].
2. **Use the wording table in research section 3.6.** For example: "We’re a funded provider for [council]…" only if confirmed, otherwise "Phone us to check if we offer funded hours". Never print a ratio unless the nursery states its own; write "Ask us about staff ratios when you visit" [3.3].
3. **No identifiable child in any photo.** Rooms, garden, kit, food, children's work, and children only from behind or far away. No names, name labels or pegs, no nappies, changing, sleeping or bathing [5.2]. A photo already on the nursery's site is **excluded** if it shows a child's face [5.2.4]. Strip metadata. Record every file in `img/CREDITS.txt`.
4. **The name, one sentence and the two actions come first on a 390px phone, and the essentials follow within two screens.** Never put a photo above them. Follow the space brief (S1 to S13) for every spacing, word and density decision.
5. **No text on photos.** Captions sit on a solid plate or below the photo; the timeline card sits over the photo's edge, never on the image.
6. **No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play, social feeds, third-party scripts or map embeds** [6.4]. Link to maps.
7. **No website forms by default.** "Phone or email us to join the waiting list." Add a form only when the nursery has a compliant way to receive it, and then ask only for the fields in research 6.3, never health, allergy, ASN, religion or ethnicity, with a privacy notice at the point of collection [6.3, ICO-I].
8. **HTML, not PDF.** Term dates, kit lists, menus and fees are HTML. A PDF may sit beside them, never instead [GDS-PDF].
9. **WCAG 2.2 AA:** 4.5:1 text contrast (3:1 for 24px and up and for control borders), visible focus, a skip link, landmarks, one `h1`, headings in order, 44 × 44px targets (footer and inline links too), keyboard only works, the menu has `aria-expanded` and closes on Escape, reduced motion respected, no sideways scroll at 320px or 200% text.
10. **Performance:** self-hosted fonts, plain HTML, CSS and JS, no build step. Photos as WebP plus JPEG in `<picture>`, at 480, 800 and 1200px wide, with `width` and `height`, `loading="lazy"` on all but the first. Homepage under about 1.5 MB [6.6]; the example is 648 KB on a 3x phone, 354 KB on a 2x phone and 403 KB on desktop, after scrolling to the bottom.

## 5. Writing rules

- "You", "we" and "your child". Active voice. Sentences under 20 words on the homepage. Paragraphs of 1 to 3 sentences.
- Times and dates: `8:30am`, `5:10pm`, `midday`; "Monday to Thursday"; "Friday 13 November 2026". "To", never a dash.
- Quote the nursery's own words only where they're distinctive and true ("like trees", "Waterproofs over wellies, please"), and attribute a claim the reader can't check ("In our own words: …").
- Captions: one full sentence with a full stop, saying what to notice. Alt text: describe the place for someone who can't see it (materials, colours, layout, any words in the photo). Don't repeat one in the other.
- Links start with a verb and say where they go. External links carry a hidden "(opens in a new tab)" via `.ext`.
- Never "best", "outstanding", "state of the art", "guarantee", or anything a parent can't check. Say what the nursery does, never what it guarantees, for additional support [2].
- Leave out testimonials that name children. (The example leaves out all three of the nursery's quotes: two name a child, one is by a current director.)

## 6. Homepage structure (spacious version)

Five sections after the hero, at most (S3). Grounds: white hero, oat essentials, warm notice band, white walk band, oat doors, warm Book a visit band. Reuse the class names.

1. **Icon sprite** (`svg.sprite`), **skip link** (`.skip-link` → `#main`).
2. **Header** (`.site-header`, sticky): `.brand` (the logo mark, the short name, and a tagline from 576px; the mark hides below 360px), `.btn.btn--primary.header-call` ("Phone" on phones, the full number from 640px), `.menu-toggle` ("Menu", no icon). `nav.nav#site-nav` with the 6 items, then `li.nav__book` (Book a visit, and Phone on phones only). Below 1024px the nav is a full-height sheet.
3. **Arrival** (`.arrival`, white): `.arrival__head` (`h1` with the nursery name, `.arrival__lead` of one sentence, `.actions` with `.btn--primary` "Book a visit" → `join-us.html#visit` and `.phone-link` "Phone [number]"), then `figure.gate` > `.gate__frame` > `picture` (the arched first photo, 4:5 on phones; no caption, so the alt text does the work). Hero words: 25 at most.
4. **The essentials** (`section.essentials-section`, paper): `.split` with the `h2` and `ul.essentials` of five `li` (`.essentials__icon` + up to 8 words), then `.go-row > a.arrow-link` "All the details". Places is `<span class="check-note">phone to check</span>` unless confirmed. The grades line is the report link.
5. **Dated notices** (`.notice-band` > `.notice[data-show-from][data-show-until]`): `.notice__label`, one bold sentence and the term dates link. Write several ahead; the JS shows only the current one, and the band collapses when none is current.
6. **The walk band** (`section.walk-band#walk`): `figure.walk-band__photo` (full width), then `.walk-card` with eyebrow, `h2`, one sentence (up to 30 words) and one `.arrow-link` to `our-nursery.html#place`.
7. **Doors** (paper): `h2.doors-h` and `ul.doors` of 4 to 6 `a.door` (`.door__arch` with a 480/800px photo and `alt=""`, `.door__label` of up to 3 words, `.door__line` of up to 8, `.door__go`). Keep them in the menu's order.
8. **Book a visit band** (`section.visit-band` > `.visit-band__arch`): `h2`, one sentence and `.actions`. The same on every page.
9. **Footer** (`.site-footer`): name, one line, address and Care Inspectorate number, then one `ul.footer-links` of label-only links (two per row on phones), and the legal line with "Page last reviewed".
10. **Hours JSON** (`script#nursery-hours`), then `<script src="../gardengate.js">`.

**Never on the homepage** (S3): the walk-through stops, the day timeline, the grades panel, fee cards, joining steps, team lists, hours tables, FAQs, strips.

### Hours JSON (the single source of the live status)

```json
{
  "timeZone": "Europe/London",
  "open": { "mon": [["08:30", "17:10"]], "fri": [["08:30", "13:00"]], "sat": [], "sun": [] },
  "closed": [
    { "from": "2026-11-13", "to": "2026-11-13", "label": "staff training day" },
    { "from": "2026-12-21", "to": "2027-01-01", "label": "winter closure" }
  ]
}
```

- List every day `mon` to `sun`, 24-hour `HH:MM`. An empty list means closed. `closed` holds term closures and training days (inclusive dates, lower-case label: it reads "Closed today: staff training day").
- Keep the visible `table.hours`, the key facts, the JSON-LD `openingHoursSpecification` and the term dates table in step with it.
- `gardengate.js` works in Europe/London time, writes times GOV.UK style, marks today's row, refreshes every minute and shows "Closing soon" in the last 30 minutes. Without JS, the pill shows the fallback text you write in the HTML.
- **Dated notices:** `data-show-from` and `data-show-until` (YYYY-MM-DD, inclusive). **Term dates tables:** `tr[data-date-until]` rows go grey once the date has passed.

### Responsive layout (keep it this way)

Checked at 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px. All breakpoints are in `styles.css`; don't add new ones for a single nursery.

- **Gutters** 24px, 40px from 600px, 64px from 1024px. **Body** 18px, 19px from 1024px.
- **Header:** below 1024px the name, Phone button and Menu share one row, and Menu opens a full-height sheet. From 1024px the six links sit in a row with Book a visit on the right.
- **Arrival:** phones stack the words, actions and gate photo (4:5). 576 to 959px: the photo is 4:3, up to 30rem wide. From 960px: words on the left (7fr), the arched photo on the right (5fr, 4:5).
- **Essentials:** one column on phones; heading left (5fr) and list right (7fr) from 768px.
- **Doors:** one per row on phones (photo left, words right), two per row from 768px, three per row from 1024px with the arched photo on top.
- **Walk stops (Our nursery):** stacked below 720px; photo and answers side by side 720 to 895px; from 896px the dotted path, photos 7fr and answers 5fr.
- **Page band:** stacked on phones with a 2:1 arched photo; from 768px the photo (4:5) sits on the right.
- **Grids:** `.grid-2` and `.visit` go two-up from 768px; `.grid-3` two-up from 768px and three-up from 1024px; `.people` two-up from 576px and three-up from 1024px; `.steps--row` in a row from 1024px. Never two text cards side by side under 600px.
- Every single-column grid uses `minmax(0, 1fr)`. Headings use `text-wrap: balance`, body text `text-wrap: pretty`.

## 7. Tokens and re-theming

Change only the **Brand** and **Place** blocks at the top of `styles.css`.

| Token | Use | Rule | Example |
| --- | --- | --- | --- |
| `--brand` | Decoration only (group card rule, nav hover). | Never text. | `#6F8F3A` moss |
| `--brand-text` | Links, buttons, icons, prices, grade pips. | 4.5:1+ on white, paper and tints; white on it 4.5:1+. | `#2E5A2F` (8:1) |
| `--brand-text-hover` | Hover and pressed. | Darker. | `#224424` |
| `--brand-deep` | Step markers, the strip, footer. | White on it 7:1+. | `#1B3022` (14:1) |
| `--brand-on-deep` | Footer headings and links on deep. | 4.5:1+ on deep. | `#B5D79A` (8.8:1) |
| `--brand-tint` | Icon circles, today's row. | Lightness about 95%. | `#E9F0E1` |
| `--place` | **A warm colour sampled from the nursery's own photos** (bark, a painted door, brick, a fence). The gate outline, the path, eyebrow arches, caption rules, timeline dots. | Decoration only. | `#B9783A` |
| `--place-text` | Eyebrows, labels, "phone to check". | 4.5:1+ on white and paper. | `#8A4F1C` (5.8:1 on paper) |
| `--place-tint` | Tips and the dated notice. | Light; ink on it 7:1+. | `#F6ECDD` |
| `--ink`, `--ink-soft`, `--paper`, `--surface`, `--line`, `--line-strong` | Neutrals. | Don't change. | |
| `--ok`, `--warn`, `--focus`, `--focus-ink` | Fixed meanings (open, closing soon or closed today, focus). | Never re-theme. | GOV.UK values |
| `--font-*`, `--fs-*`, `--lh-*`, `--measure`, `--radius`, `--max`, `--gutter`, `--section`, `--group`, `--gap-cards`, `--tap` | Type, shape and space, set to the space brief (S1, S2, S7, S8). | Don't change. `--tap` stays 44px. | |

**How to re-theme**
1. If the logo has a clear colour, sample it from the file for `--brand`, then darken the same hue until it reaches 5:1 on white for `--brand-text`. If the logo is black, hand-drawn or a rainbow (common), **take the brand from the place**: the greenest garden or woodland colour in the best outdoor photo, muted.
2. `--brand-deep`: same hue at about 15% lightness. `--brand-on-deep`: same hue at about 80%.
3. `--place`: the strongest warm colour in the best photo. Darken for `--place-text` until it reaches 4.5:1 on `--paper`.
4. Check every pair with a contrast checker. Never use primary-colour rainbows, even if the logo has one [7.1].
5. Logo: crop the nursery's mark (not its full lockup) as a PNG at 3x display height, or inline SVG. The name is live text beside it.

## 8. Photo rules

**Purpose first.** Each photo shows a parent where something is or what it's like. Order follows a child's day: gate or meeting point → cloakroom → each room → garden and outdoor kit → food → rest area. If a photo does neither job, leave it out.

**Children:** see rule 3. Treat every photo on the nursery's current site as excluded until you've looked: a face, a name on a peg or bag, or a child in nappies, changing or sleeping rules it out. Cropping or blurring is fine when it removes the face or name completely (the example crops one photo to lose a name tag and blurs a second tag). Children from behind, at a distance, or as hands at work are allowed [5.2].

**Staff:** only with their own consent, name and role exactly as published, and only if you can be sure who is in the photo. Old group photos: leave out unless the nursery confirms everyone still works there.

**Never** stock or AI-generated children or staff, clip-art children or illustrations of "happy toddlers" [5.2.5]. Never photos from another nursery or a staff member's home presented as the nursery.

**Alt text** describes the place (materials, colours, layout, words in the photo). Children in the background are described by what they're doing, never by how they look.

**Technical:** 3:2 landscape for most photos (`--photo-ratio`), the gate photo cropped by CSS (4:5 on phones and desktop, 4:3 at tablet width: keep the subject central). Door and page-band photos are cropped to small arches, so pick photos whose subject sits in the middle. A very wide panorama (like `arch-*`) needs its 800px file. Export 480, 800 and 1200px wide, JPEG quality about 70 to 75 and WebP at 0.7, sRGB, all metadata removed. If ffmpeg has no WebP encoder, encode WebP in Chrome (canvas `toDataURL('image/webp', 0.7)`) through Playwright.

## 9. Fallback: when a nursery has few photos

Garden Gate still works without photos. It never uses stock, silhouettes, illustrations or empty placeholders.

| What the nursery has | What to do |
| --- | --- |
| **Everything** | The full layout, as in the example. |
| **Outside only** | Keep `figure.gate`. Mark the inside stops `.stop--text` and remove their `.stop__media`; their facts run in two columns from 896px. |
| **Inside, no outside** | Use the best room photo for `figure.gate` and say what it is in the caption. |
| **No usable photos (all show children)** | Use Front Desk Nursery (direction A) instead, and sell the shoot with `PHOTO-SHOTLIST.md`. |
| **No staff photos** | Names and roles only (`ul.people`), as in the example. |

## 10. Adapting the walk-through for a nursery with a building

The example is fully outdoor, so its stops are Setting off, the willow arch and yurt, Round the fire, and The woods. For a nursery with a building, keep the parts and change the stops:

1. **The gate or front door:** the building from the street, the door and how you get in (buzzer, password), drop-off and parking only if supplied.
2. **The cloakroom:** where coats and bags go, pegs with names hidden.
3. **Each room by age:** one stop per room (babies, toddlers, 3 to 5s), with a photo, the ages, and the room team's names. Keep each stop to 120 words or fewer.
4. **The garden:** two or three photos (`.stop__media--pair`), "We go outside every day" only if confirmed (a National Standard duty for funded providers [FFC-2]), and only the kit you can see.
5. **Food and rest:** the kitchen and a plate as served, the sleep room (empty).

The h1 stays the nursery's name. The day timeline, grades, fees and joining steps don't change.

## 11. Pre-handover checklist

**Facts** (research section 8)
- [ ] Funded status is confirmed with the nursery and the council's provider list.
- [ ] Grades, their exact headings, the inspection month and publication date match the latest Care Inspectorate record, and the report link resolves.
- [ ] Fees (with their date), availability, hours, closures, term dates, staff names, roles and qualifications are as supplied, or say "phone to check".
- [ ] The phone number is checked digit by digit in the header, menu sheet, actions, steps, Find us, Book a visit band and footer. `tel:` links use `+44` and no spaces.
- [ ] Hours match in the key facts, `table.hours`, the hours JSON and the JSON-LD. Closures match the term dates table and the notices.
- [ ] Every external link (mygov.scot, GOV.UK, Parent Club, Care Inspectorate, council) returns 200.

**Photos**
- [ ] No identifiable child in any image. No names anywhere in shot. Metadata stripped.
- [ ] Every photo is the nursery's own or commissioned, listed in `img/CREDITS.txt` with its source and any crop.
- [ ] Every photo has alt text and a one-sentence caption that doesn't repeat it. No text on photos.

**Quality**
- [ ] On a 390 × 844 phone: the h1, the lead and both actions are on the first screen, and the essentials start within the second. Homepage `<main>` is 120 to 180 words and 6 screens or fewer (`density.mjs`).
- [ ] `node pipeline/audit.mjs <url> <out>` gives 0 blockers, 0 major and 0 minor on every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` is clean at every width, on the homepage and every inner page.
- [ ] Check the live status at an open time, a closed time and a closure date.
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or trackers. `fonts/OFL.txt` is present.

## 12. Inner pages

Real nursery sites need the six-page set from research section 6.1. Build every page on the site map.

- **Same shell everywhere.** Copy the sprite, skip link, header, footer, hours JSON and script from `index.html` unchanged, except: the current page's nav link gets `aria-current="page"`; the JSON-LD stays on the homepage only.
- **Page band** (`div.page-head`, white): `.page-head__grid` with `nav.crumbs[aria-label="Breadcrumb"]`, one `h1` in parent words (6 words at most), `p.page-head__lead` (35 words at most) and `.actions` with one action (Book a visit, or the outline Phone button on Visit and join, Fees and Parents), then `.page-head__arch` with that page's door photo (`alt=""`).
- **On this page** (`nav.otp` > `ol.route`) when a page has 3 or more sections: up to 7 anchor links.
- **Sections** alternate white and paper, each with a `.section__head` (eyebrow, `h2`, one-line lead) and 120 words of body or fewer. Long reference detail goes in `.faq` `details`.
- **The end of every page:** `nav.next` with one `a.door` ("Next" kicker), then the Book a visit band.

| Page | What it holds | Sections, in order |
| --- | --- | --- |
| `our-nursery.html` | The place, the day, weather, food, approach, support, inspection | Page band · On this page · `#place` (each stop a `section.stop` inside `ol.walk > li`) · `#day` (`.day-card`, group times in an accordion) · `#weather` ("Keeping warm and dry" in an accordion) · `#food` · `#approach` (`#support` and Starting school as accordions) · `#inspection` (grades panel beside "Earlier inspections" in an accordion) · Next: Visit and join. |
| `join-us.html` | Visit and join, hours and Find us | Page band (Phone) · On this page · `#visit` (what happens, Phone and Email; `details#who`) · `#waiting-list` (`ol.steps.steps--row`) · `#starting` · `#find-us` (live status, `table.hours`, address and directions) · `#questions` (FAQ groups) · Next: Fees and funding. |
| `fees-and-funding.html` | Fees, funded hours, help with costs | Page band (Phone) · On this page · `#fees` (`.card.fee-card` > `table.fee-table` with "Fees from" and "phone to check", beside "Paying fees") · `#funded` (how it works; the start-date table, deferring and 2 year olds in accordions) · `#help` (links not figures) · Next: Visit and join. |
| `our-team.html` | Everyone the nursery publishes | Page band · On this page · `#leaders` · one section per room or group (`#groups`, `#foxgloves`: `h2` group name, `ul.people` with `h3` names) · `#sessional` · `#story` (directors beside a dated `ul.facts`) · `#visits` (the strip) · Next: Visit and join. |
| `parents.html` | Current parents | Page band (Phone) · On this page · `#dates` (`table.fee-table.dates-table` with `tr[data-date-until]` and `.tag`, "Last checked [date]"; short-notice closures and absence in accordions) · `#kit` (every day; winter and packing in accordions) · `#lunch` · `#resources` with `#contact` · `#policies` (the nursery first, then the Care Inspectorate [CI-CO]) · Next: Fees and funding. |

**Inner-page patterns (all in `styles.css`):** `.page-head`, `.otp` and `.route`, `.next`, `.fee-table` (also used for term dates and the funding start table), `.dates-table` with `.date-col` and `.tag`, `.faq` with `details`, `.people` and `.person` (`.person__role`, `.person__qual`, `.person__bio`), `.grid-3`, `.ticks--2`, `.strip`.

## 13. The worked example: The Secret Garden Outdoor Nursery

**Why this nursery:** in our prospect list (`prospects/nursery/data/page-073.json`, `n073-08`), its site loads, and it publishes full-resolution photos of a striking place: a willow arch framing a yurt, the yurt in snow and covered in children's chalk drawings, misty woodland, and children setting off up the hill from behind. It is a voluntary, not-for-profit nursery, a Fife Council partner provider, graded 5 (very good) in all four areas. Its current site is a stock WordPress theme. It leads with a full-width photo of a child's face, embeds Google Maps and YouTube (third-party trackers), has no tappable phone number, and carries two injected spam links ("buyzolpideminsomnia.com"), which says no one is maintaining it. Fees, the enrolment process and hours are on one long "Nursery Information" page; the term dates sit on the homepage between the welcome and the inspection results.

**Sources used:** the nursery's site, crawled 13 October 2026 (home, nursery information, about, staff, founder, visitor sessions, contact, and the blog posts on winter care, kit, food and starting school), and its Care Inspectorate datastore record (31 August 2026: CS2008176034, 28 places, grades, inspection date 24 May 2023, published 13 June 2023, manager, phone).

**Facts to confirm with the nursery before handover**
- **Fees** (£63.68 a full day, £35.82 a Friday session) are "commencing August 2025" on the site. Shown with "Fees from August 2025" and "phone to check". They may have changed in August 2026.
- **Funded status:** the site says "Partner Provider of Fife Council offering Preschool Education". Confirm it's current, and get Fife Council's own ELC application link (fife.gov.uk refused automated checks, so the example links to mygov.scot).
- **Meals at funded sessions:** the site says children bring lunch from home and the nursery provides snack. Funded providers must give a free meal at funded sessions [FFC-2]. Shown as "phone to check". Ask what the nursery does.
- **Hours:** "Monday to Thursday 0830 to 1710 and Fridays 0830 to 1300", 47 weeks a year, with two groups on "slightly staggered" times. Each group's times aren't published: "phone to check".
- **Where to meet:** the address is "The Woodland Hive, c/o Letham Village Hall". Drop-off and pick-up are "in the park" (blog), but the park isn't named. Shown as "phone to check where to meet".
- **Ages:** the Care Inspectorate registers it for under 3s, but the site says new children "must have turned 3". Shown as 3 to 5, with visits and waiting-list places for under 3s, and the "Buzzard" year and deferral as the site describes them.
- **Places:** not published. "Phone to check".
- **Toilets, handwashing, settling in, key workers, ratios, sickness and collection policies, privacy notice:** none published. Shown as "ask us".
- **Term dates** 2026 to 2027 are from the site's homepage list. The source mixes "Friday 18th December" (no year) with dated items; the example assumes 2026.
- **Earlier inspections:** the December 2022 grade 3 and July 2021 COVID-19 grade 5 are the nursery's own account, not in our datastore extract. Quoted and attributed.
- **Team:** names, roles and qualifications from the staff page (October 2026). The CI datastore lists 5.5 staff, while the site lists 16 people (many sessional): confirm who is current. A blog post names "Emma Goodfellow"; the staff page and Care Inspectorate say "Ellis Goodfellow", which the example uses.
- **"Scotland's first fully outdoor nursery"** and the awards (Nancy Ovens Award for Play 2008 and 2017, NMT awards 2019 and 2020) are the nursery's claims. The example states only the 2008 registration (confirmed by the datastore) and the founder's BEM.
- **Tax-Free Childcare:** not mentioned on the site ("we also accept Childcare Vouchers"). Shown as "ask us".
- **Photos:** all from the nursery's own site; ownership and reuse to confirm. See `example/img/CREDITS.txt`, including what was left out and why.
