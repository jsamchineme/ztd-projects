# Garden Gate

A place-led website template for independent Scottish nurseries: private, and voluntary or not-for-profit. Part of the **Doorway** family (`practice/doorway`).

**The idea in one line:** walk through the gate before you visit. The homepage answers "Is this for us?" first: ages, hours, funding, places and inspection grades, with "Book a visit" and "Join the waiting list". Then it walks a parent through the nursery with real photos, in the order their child will meet each place: the gate, the cloakroom, each room, the garden. A day-at-nursery timeline sits over a photo of the place.

Garden Gate is for nurseries whose place is their strongest asset: a converted villa or church hall, a big garden, woodland or beach access, a rural setting, or a fully outdoor nursery. The research brief calls this direction **C** (`prospects/research/nursery-websites.md`, section 7.2). Source tags such as **[SG25-12]** point to that brief's section 9.

Worked example: **The Secret Garden Outdoor Nursery, Letham, Fife**, a six-page site: `example/index.html`, `our-nursery.html`, `join-us.html`, `fees-and-funding.html`, `our-team.html` and `parents.html`. It is a fully outdoor nursery, so the walk-through starts in the park, not at a front door. Section 10 shows how the same parts map onto a nursery with a building.

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), then components. | Tokens only. |
| `gardengate.js` | About 150 lines of plain JS: the phone menu, the live open or closed status (term closures included), dated notices, and today's row in the hours table. Reads everything from the page. No network calls. | No. |
| `fonts/` | Lora 600 (headings only) and Red Hat Text (body, variable 400 to 700), latin and latin-ext woff2, plus `OFL.txt`. A page loads the two latin files: 52 KB. | No. |
| `example/index.html` | The worked homepage. Copy it for each nursery. | Yes, for each nursery. |
| `example/*.html` | The five worked inner pages (section 12). Copy the shell exactly from `index.html`. | Yes, for each nursery. |
| `example/img/` | That nursery's photos (`.jpg` and `.webp` at each size) and `CREDITS.txt`. | Replace for each nursery. |
| `PHOTO-SHOTLIST.md` | One-page brief for the nursery or a local photographer, with the "tidy the room" checklist and a staff consent form. Doubles as the paid photo add-on. | Rarely. |

The example links `../styles.css`, `../gardengate.js` and `../fonts/`. Keep that layout.

## 2. How Garden Gate differs from its relatives

- **Doorway (`practice/doorway`, dental):** the same idea, "see inside before you visit", the same numbered route of stops with photos and practical answers, the same caption and alt text rules. Garden Gate changes the tasks (a parent choosing childcare, not a nervous patient), adds the key facts strip, the grades panel, the day timeline and dated closure notices, and swaps NHS colours and urgent-care cards for a calm, place-sampled palette.
- **Front Desk Nursery (direction A) and Key Worker (direction B):** A is task-first with almost no photos; B makes the staff the hero. Garden Gate makes the **place** the second thing on the page, after the facts. Use A for nurseries with few photos, B where the team is the strongest asset.
- **What the owner rejected:** generic, trend-driven and twee designs. Garden Gate has no rainbows, crayon or bubble fonts, clip art or cartoon animals [7.1]. Its only ornament is a small arch (the gate) used for the eyebrow mark, the step markers and the first photo's frame. Everything else is information: facts, grades, a timeline, fees. The colour comes from the nursery's own photos.

## 3. Research and the decisions it drives

| Decision | Research it comes from |
| --- | --- |
| **The first phone screen answers "Is this for us?"** The h1 is the nursery's name. One sentence says what it is, where, and for which ages. Then a **key facts strip** (ages, hours, funding, places, grades) and two actions: green **"Book a visit"** (a phone link) and **"Join the waiting list"**. The photo comes after. | Top tasks on a 390px phone: ages, hours, weeks and area without scrolling, then places, cost and quality [2, 6.2]. Location is the top reason for choice (52%), and lack of local places the top barrier (19%) [SG25-7, SG25-9]. |
| **Grades shown honestly:** every grade from the latest report, with its exact headings, the date and a "Read our inspection report" link. Six pips per row, so a 4 (good) reads as what it is. Never the inspector's logo. The full panel repeats on the homepage and Our nursery. | Parent Club tells parents to judge quality from the inspection report [PC-Q]. Show every grade, the date and the link; never only the best; don't relabel headings; no Care Inspectorate logo [3.2, 4.1]. Most prospects score "good", so design for an honest 4 [1]. |
| **The walk-through:** numbered stops on a dotted path, in the order a child meets each place. Each stop pairs real photos with practical answers and "phone to check" where a fact is unclear. Photos stack on phones; no galleries or carousels. | Parents value outdoor play (88% had daily access; small outdoor spaces drove dissatisfaction) and praised "homey" settings [SG25-12]. Users study real photos and ignore stock [NNG-P]. Carousels go unnoticed and give the wrong idea of the place [NNG-C, NNG-A]. Showing the space answers the visit question before the visit [7.2 C]. |
| **"A day at nursery" timeline over a photo band:** the day as a list of moments, with times only when the nursery publishes them. The card rises over the photo's lower edge; text never sits on the photo. | Parent Club tells parents to ask about the day, settling in, food and outdoor time [PC-C]. A routine with times only if supplied [4.5]. |
| **Fees and funding in plain words:** the nursery's own fee figures with "Fees from [date]" and "phone to check", the funded-provider line, how to apply through the council, when funded hours start, and links (not calculations) for Tax-Free Childcare and Universal Credit. | "What will it cost?" is task 3 [2]. 1,140 hours, apply through the council, start-date table [MG-F, PC-F]. Funded status can change: confirm at build time [3.1]. Link, don't calculate; caps change [3.4, GOV-TFC, GOV-UC]. |
| **Dated closure notices** in the page flow (`data-show-from`, `data-show-until`), and term closures in the hours JSON, so the live status says "Closed today: staff training day". | Current parents' first task is today's closure or snow notice, then holiday dates [2]. Put closures on the site, not only on Facebook [6.4]. Never use a notice for marketing [6.2]. |
| **"For parents at [nursery]"**: four task links (closures, kit or menu, lunch or forms, the parents' login), high on the homepage. | Current parents' tasks: closures, menu, forms, fees, the app [2]. |
| **Menu of 6:** Our nursery, Visit and join, Fees and funding, Our team, Parents, Find us. On phones the button says "Menu", and **"Visit and join" and "Fees and funding" stay visible** as two quick links under the header. | Six items, never more than seven; "Menu" with no icon; those two links stay visible on phones [6.1]. |
| **No pop-ups, chat, cookie banners, carousels, auto-play, social feeds or map embeds.** Directions are a plain link. | 27% who met an overlay struggled to get past it [6.4, B1]. Embeds are third-party trackers needing consent [6.4, ICO-PECR]. |
| **Plain English:** reading age 9 to 11, homepage sentences of 20 words or fewer, "8:30am to 5:10pm", days and months in full. No "pedagogy" or "provocations". | GOV.UK content style [GOVUK-S]; nursery jargon to avoid [6.4, 6.5]. |
| **Type: Lora 600 for headings, Red Hat Text for everything else.** A warm, bookish serif that a child's world can sit inside, and a humanist sans shared with Doorway. Two files on a page, self-hosted. | "Grown-up typography": humanist sans body, optionally one warm serif for headings only, two weights at most; no Comic Sans, crayon or bubble fonts [7.1]. Self-hosted, no CDNs [6.6]. |
| **Colour from the place:** warm oat paper, one confident green sampled from the woods or garden, and one warm "place" colour from the photos (bark, a door, brick). | Warm neutrals, one confident accent, wood and garden textures from the nursery's own photos [7.1]. |
| **GOV.UK yellow focus, 44px targets, WCAG 2.2 AA.** | [6.5, W3C-TS]. A nursery isn't an NHS service, so the focus style is GOV.UK's, not NHS.UK's. |

## 4. Rules (every build, no exceptions)

1. **Never invent facts.** Fees, availability, funded status, grades and report dates, ratios, staff names, qualifications, SSSC status, menus, allergen handling, hours, closures, term dates, policies, awards, reviews, "forest school" or "Gaelic medium" status, apps, CCTV, parking and accessibility features: only as the nursery or the Care Inspectorate record states them [3.6]. If something is unclear, missing or stale, write "phone to check" or "ask us" (styled `.check-note`). Read grades, places, phone and manager from the Care Inspectorate datastore in `prospects/nursery/`, not the nursery's own site [3.2].
2. **Use the wording table in research section 3.6.** For example: "We’re a funded provider for [council]…" only if confirmed, otherwise "Phone us to check if we offer funded hours". Never print a ratio unless the nursery states its own; write "Ask us about staff ratios when you visit" [3.3].
3. **No identifiable child in any photo.** Rooms, garden, kit, food, children's work, and children only from behind or far away. No names, name labels or pegs, no nappies, changing, sleeping or bathing [5.2]. A photo already on the nursery's site is **excluded** if it shows a child's face [5.2.4]. Strip metadata. Record every file in `img/CREDITS.txt`.
4. **The facts and the two actions come first on a 390px phone.** Never put a photo above them.
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

## 6. Homepage structure

Sections alternate white and oat paper grounds. Reuse the class names.

1. **Icon sprite** (`svg.sprite`), **skip link** (`.skip-link` → `#main`).
2. **Header** (`.site-header`, sticky): `.brand` (the logo mark, the short name, and a tagline from 576px; the mark hides below 360px), `.btn.btn--primary.header-call` ("Phone" on phones, the full number from 640px), `.menu-toggle` ("Menu", no icon). `nav.nav#site-nav` with the 6 items. Then **`nav.quick`** (outside the sticky header, so it scrolls away): "Visit and join" and "Fees and funding", hidden from 1024px.
3. **Arrival** (`.arrival`, white), in this DOM order:
   - `.arrival__head`: `.status[data-live-status]`, `h1` (the nursery name), `.arrival__lead` (one or two sentences: what, where, ages).
   - `dl.keyfacts` of five `.keyfact` (each a `div` with `dt` and `dd`; a `span` inside `dd` adds the detail line): **Ages**, **Open**, **Funding**, **Places**, and `.keyfact--grades` (**Inspection**: the summary grade in words, the month, and the report link). Places is `<span class="check-note">Phone to check</span>` unless the nursery confirms availability.
   - `.arrival__actions`: `.btn--primary` "Book a visit: [number]" (`tel:`), `.btn--secondary` "Join the waiting list" (→ `join-us.html#waiting-list`).
   - `figure.gate`: `.gate__frame` > `picture` > `img` (the arched first photo), then `figcaption` with a `strong` line ("This is our nursery: …"), one sentence, and `.gate__links` (jump to the walk-through, and to Find us).
4. **Dated notices** (`.notice-band` > `.notice[data-show-from][data-show-until]`), with `.notice__label` ("Closed for children", "Winter closure"), a bold sentence and a link to the dates. Write several ahead; the JS shows only the current one. Remove the band if there are none.
5. **For parents** (paper): `ul.tasks.tasks--4` of four `.task` links.
6. **The walk-through** (`#walk`, white): `.section__head`, `nav.route` (jump links), `ol.walk` of `li.stop`:
   - `.stop__marker` (number), `.stop__head` (`.stop__kicker` "Stop 1 of 4" and an `h3`), `.stop__media` (one `figure.photo`, or two in `.stop__media--pair`), `.stop__body` (a sentence, `ul.facts` with icons, an optional `.tip` and `.arrow-link`).
   - Four stops on the homepage; the full set goes on Our nursery.
7. **A day at nursery** (`#day`, paper): `.day-band` > `.wrap` > `figure.day-band__photo.photo` then `.day-card` (`.day-card__head` with eyebrow, `h2` and one line; `ol.day.day--split` of `li` with `.day__when` and `.day__what`; `.day-card__foot` with the "phone to check" times line). On wide screens the list runs in two columns read top to bottom: set `style="--rows: N"` on the `ol` (half the moments, rounded up) and put `.day__col-end` on the last `li` of the first column.
8. **Team and inspection** (`#team`, white): `.grid-2` with a `.card` (`ul.people.people--stack` of `li.person` with `.person__name` and `.person__role`; `.person--lead` for the manager; a `.people-note` with "Ask us about key workers and staff ratios"; link to Our team) and the `.grades` panel.
9. **Fees and funding** (`#fees`, paper): `.fee-cards` of three `.card.fee` (the price in `.fee__figure`; `.fee--funded` for the funded-hours card), `.fee-meta` (dated, "phone to check"), and a link to the fees page.
10. **Visit and join** (`#join`, white): `ol.steps.steps--row` (`style="--steps: 4"`) and two buttons.
11. **Hours and find us** (`#find-us`, paper): second status pill; `.visit` with the hours `.card` (`table.hours`, a `tr[data-day]` per day) and the Find us `.card` (`ul.contact-lines`, directions link, "See the woods" or "See inside" back to the walk). No map embed.
12. **Strip** (`.strip`): jobs when there are vacancies, otherwise anything the nursery runs for others (the example: visits for practitioners). Remove it if neither applies.
13. **Footer** (`.site-footer`): name, one line, address and Care Inspectorate number; Contact, Parents and About columns (policies and complaints, Care Inspectorate record); "Page last reviewed".
14. **Hours JSON** (`script#nursery-hours`), then `<script src="../gardengate.js">`.

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

- **Header:** below 1024px the name, Phone button and Menu share one row (`.brand` is `flex: 1 1 0`, so a long name wraps in its own space). "Phone" becomes the full number from 640px. The quick links sit under the header to 1023px. From 1024px the six nav links sit in a row and the quick links go.
- **Arrival:** phones stack head, key facts, actions, gate photo. 576 to 959px: the gate photo and its caption sit side by side. From 960px: words, key facts and actions on the left (7fr), the arched photo on the right (5fr, 4:5).
- **Key facts:** two per row on phones (grades full width), one per row below 360px, three per row from 768px (grades spans two), two per row inside the hero's left column from 960px.
- **Walk-through:** stacked below 720px; photo and answers side by side 720 to 895px; from 896px the desktop layout with the dotted path, photos 7fr and answers 5fr. A `.stop__media--pair` sits side by side from 600px, stacks in the 7fr column at 896 to 1151px, then side by side again.
- **Day card:** overlaps the photo by 2.5rem on phones and 7rem from 896px. The timeline is one column with the "when" label above each moment below 480px, two columns of label and moment to 1023px, then two column-pairs.
- **Grids:** `.grid-2`, `.visit`, `.groups` go two-up from 768px; `.grid-3` two-up from 768px and three-up from 1024px; `.fee-cards` three-up from 768px; `.tasks--4` two-up from 768px and four-up from 1152px; `.people` two-up from 576px and three-up from 1024px; `.steps--row` in a row from 1024px.
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
| `--brand-tint` | Icon circles, today's row, quick links. | Lightness about 95%. | `#E9F0E1` |
| `--place` | **A warm colour sampled from the nursery's own photos** (bark, a painted door, brick, a fence). The gate outline, the path, eyebrow arches, caption rules, timeline dots. | Decoration only. | `#B9783A` |
| `--place-text` | Eyebrows, labels, "phone to check". | 4.5:1+ on white and paper. | `#8A4F1C` (5.8:1 on paper) |
| `--place-tint` | Tips and the dated notice. | Light; ink on it 7:1+. | `#F6ECDD` |
| `--ink`, `--ink-soft`, `--paper`, `--surface`, `--line`, `--line-strong` | Neutrals. | Don't change. | |
| `--ok`, `--warn`, `--focus`, `--focus-ink` | Fixed meanings (open, closing soon or closed today, focus). | Never re-theme. | GOV.UK values |
| `--font-*`, `--fs-*`, `--lh-*`, `--measure`, `--radius`, `--max`, `--gutter`, `--section`, `--tap` | Type, shape and space. | Don't change. `--tap` stays 44px. | |

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

**Technical:** 3:2 landscape for most photos (`--photo-ratio`), the gate photo cropped by CSS (4:3 on phones, 4:5 on desktop: keep the subject central). Export 480, 800 and 1200px wide, JPEG quality about 70 to 75 and WebP at 0.7, sRGB, all metadata removed. If ffmpeg has no WebP encoder, encode WebP in Chrome (canvas `toDataURL('image/webp', 0.7)`) through Playwright.

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
3. **Each room by age:** one stop per room (babies, toddlers, 3 to 5s), with a photo, the ages, and the room team's names. For three or more rooms, use one "Our rooms" stop with `.groups` cards instead.
4. **The garden:** two or three photos (`.stop__media--pair`), "We go outside every day" only if confirmed (a National Standard duty for funded providers [FFC-2]), and only the kit you can see.
5. **Food and rest:** the kitchen and a plate as served, the sleep room (empty).

The h1 stays the nursery's name. The day timeline, grades, fees, parents' panel and joining steps don't change.

## 11. Pre-handover checklist

**Facts** (research section 8)
- [ ] Funded status is confirmed with the nursery and the council's provider list.
- [ ] Grades, their exact headings, the inspection month and publication date match the latest Care Inspectorate record, and the report link resolves.
- [ ] Fees (with their date), availability, hours, closures, term dates, staff names, roles and qualifications are as supplied, or say "phone to check".
- [ ] The phone number is checked digit by digit in the header, actions, steps, Find us, Where next and footer. `tel:` links use `+44` and no spaces.
- [ ] Hours match in the key facts, `table.hours`, the hours JSON and the JSON-LD. Closures match the term dates table and the notices.
- [ ] Every external link (mygov.scot, GOV.UK, Parent Club, Care Inspectorate, council) returns 200.

**Photos**
- [ ] No identifiable child in any image. No names anywhere in shot. Metadata stripped.
- [ ] Every photo is the nursery's own or commissioned, listed in `img/CREDITS.txt` with its source and any crop.
- [ ] Every photo has alt text and a one-sentence caption that doesn't repeat it. No text on photos.

**Quality**
- [ ] On a 390 × 844 phone: the h1, the lead, the key facts and both actions are visible or within one short scroll, and the header Phone button is visible.
- [ ] `node pipeline/audit.mjs <url> <out>` gives 0 blockers, 0 major and 0 minor on every page.
- [ ] `node pipeline/viewports.mjs <url> <out>` is clean at every width, on the homepage and every inner page.
- [ ] Check the live status at an open time, a closed time and a closure date.
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or trackers. `fonts/OFL.txt` is present.

## 12. Inner pages

Real nursery sites need the six-page set from research section 6.1. Build every page on the site map.

- **Same shell everywhere.** Copy the sprite, skip link, header, quick links, footer, hours JSON and script from `index.html` unchanged, except: menu anchors become `index.html#…`; the current page's nav and quick link get `aria-current="page"`; the JSON-LD stays on the homepage only.
- **Page head** (`div.page-head`, white): `nav.crumbs[aria-label="Breadcrumb"]`, one `h1` in parent words, `p.page-head__lead` (1 to 2 sentences), and a `.btn-row` with the page's main action. No photo in the page head.
- **Bands** alternate white and paper, each with a `.section__head` (eyebrow, `h2`, one-line lead). Finish with **Where next** (`ul.tasks.next-tasks`, the `.task--call` first).

| Page | What it holds | Sections, in order |
| --- | --- | --- |
| `our-nursery.html` | The place, the day, weather, food, approach, support, inspection | Page head · the full walk-through (`#place`, every stop) · the day card (`.day-card.day-card--flat`, no photo band) · `#weather` (two cards) · `#food` (snack and lunch, or the menu) · `#approach` with `#support` · `#inspection` (grades panel beside "Earlier inspections" in the nursery's words) · Where next. |
| `join-us.html` | Visit and join | Page head (Book a visit, Email) · `#visit` (what happens; `#who` can come) · `#waiting-list` (`ol.steps.steps--row`) · `#starting` (settling in, groups and key workers, what to bring) · `#questions` (FAQ groups) · Where next. |
| `fees-and-funding.html` | Fees, funded hours, help with costs | Page head · `#fees` (`.card.fee-card` > `table.fee-table` with "Fees from" and "phone to check", beside "Paying fees") · `#funded` (how it works, and the start-date table, both sourced to mygov.scot) · `#help` (Tax-Free Childcare, Universal Credit, Scottish Child Payment, links not figures) · Where next. |
| `our-team.html` | Everyone the nursery publishes | Page head · `#leaders` · `#groups` (an `h3` per room or group, `ul.people` with `h4` names) · `#sessional` · `#story` (directors or owners beside a dated `ul.facts`) · Where next. |
| `parents.html` | Current parents | Page head · `#dates` (`table.fee-table.dates-table` with `tr[data-date-until]` and `.tag`, "Last checked [date]", beside short-notice closures and absence) · `#kit` (three cards) · `#lunch` (or the menu) · `#resources` with `#contact` · `#policies` (policies, then complaints: the nursery first, then the Care Inspectorate [CI-CO]). |

**Inner-page patterns (all in `styles.css`):** `.fee-table` (also used for term dates and the funding start table), `.dates-table` with `.date-col` and `.tag`, `.faq` with `details`, `.people` and `.person` (`.person__role`, `.person__qual`, `.person__bio`), `.groups` and `.group` (`.group__team` chips) for room cards, `.grid-3`, `.ticks--2`, `.strip`.

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
