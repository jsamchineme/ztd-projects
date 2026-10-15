# Front Desk Dental

> Pipeline name: **Front Desk Dental** (folder `templates/practice/front-desk-dental/`). The **Front Desk** family (GP, Dental, Local) is task-first with little imagery; the **Familiar Faces** family (GP, Dental) and **Doorway** are people- and photo-led. When this brief says "Front Desk", it means this template.

A website template for UK dental practices (NHS, private or mixed), adaptable for GP surgeries.

**The idea in one line:** the homepage does what a good receptionist does in the first ten seconds. It tells you whether the practice is open, how to get through, whether you can join, what to do if you're in pain and what it costs. Then it reassures you.

Front Desk is not a "concept" site. It is a calm, well-made NHS-grade service page with the finish of a private clinic. The premium comes from precision (type, spacing, colour, real faces, live information that's right), not from decoration. It should look like the practice paid for a serious website, and it should feel as trustworthy as NHS.UK.

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), components below, including the inner-page components. | Tokens only. |
| `frontdesk.js` | About 120 lines of plain JS: the phone menu and the live open or closed status. Reads the hours from the page. | No. |
| `fonts/` | Figtree variable woff2 (weights 300 to 900), latin and latin-ext, plus `OFL.txt`. Referenced from `styles.css` by relative path. | No. |
| `retheme.mjs` | Prints contrast-safe brand tokens from a logo colour. `node retheme.mjs "#13ABC3" "#B8902F"` | No. |
| `example/index.html` | The worked homepage for Musselburgh Dental Care. Copy it for each practice. | Yes, for each practice. |
| `example/treatments.html`, `example/aesthetics.html`, `example/our-team.html` | Worked inner pages (see "Inner pages"). Copy the one closest to each page on the practice's site map. | Yes, for each practice. |
| `example/img/` | That practice's images and `CREDITS.txt`. | Replace for each practice. |

The example links `../styles.css` and `../frontdesk.js`. Keep that layout: one template folder, one `example/` (or practice) folder inside it.

## 2. Why the earlier rounds were rejected (and what Front Desk does instead)

I looked at `atelier/`, `civic/` and `haven/`. Each is skilful, and each is the wrong kind of skilful for this buyer.

- **Atelier** is a design magazine. A 90px italic serif slogan ("Calm, careful dentistry") takes the first screen, and a patient's tasks start below the fold. The practice's amateur headshots are blown up to fashion-shoot size, which exposes them. It reads as a boutique brand, not a healthcare provider.
- **Civic** is GOV.UK with a wayfinding gimmick. It is credible but austere, and it looks like a public body, not a business that a practice owner would be proud of. The big numerals are decoration that patients have to learn.
- **Haven** is a hotel. A coastal landscape fills the hero and the practice floats on it in a card. Place comes before the practice, and the status line is small print.
- **What they share:** each starts from a mood ("magazine", "transit signage", "Highland retreat") rather than from what patients came to do. Each makes the h1 a slogan. None puts the live status, the Call button, joining and the emergency route together in the first screen.

**Front Desk starts from the patient's task list**, uses the patterns NHS patients already know (care cards, plain task links, yellow focus), and spends its craft on making those feel finished: one confident typeface, the practice's own colour, real faces at a sensible size, and live information.

## 3. Research → design decisions

| Decision | Research it comes from |
| --- | --- |
| The first screen holds the live status, the h1, how to join, the Call button and the emergency route. A "How can we help?" panel lists the five top tasks as links. | NHS England's GP website guide: patients come with a task (appointments, registering, phone number, opening times, address). The brief's dental tasks: book, register, phone, hours, address, emergency, costs. NHS design principle "Do the hard work to make it simple". |
| The h1 says what the practice is and where ("NHS and private dentist in Musselburgh"), not a slogan. The practice name is in the header. | NHS service manual: users need to confirm they're in the right place; headings describe content. A slogan answers nothing. |
| The Call button carries the number ("Call 0131 665 2786") in the header and the hero. On phones the header button says "Call" and stays visible (sticky header). | Phoning is the only way to book or register here. A Call button visible on a 390px phone without scrolling is a hard requirement. |
| Live "Open now / Closed for lunch / Closed now · opens tomorrow at 9am" pill at the top of the hero and the hours section. It also shows whether the emergency phone line is open now, and today's hours in the task panel. | "Are you open?" is a top task. NHS England lists opening times among the top 9 patient tasks. |
| Emergency route in the hero (red-edged, compact) and a full urgent care card in the hours section. 111 and 999 are plain text. | NHS.UK care cards: testing found users scanning a page stopped to read them and understood the action. NHS inform: out of hours, phone NHS 24 on 111. |
| No pop-ups, cookie walls, chat widgets, carousels or auto-play. | 27% of research participants were stopped by overlays and pop-ups. |
| Plain English at reading age 9 to 11. Sentences under 20 words, paragraphs under 3 sentences. Times as "9am to 5:30pm"; ranges with "to", not dashes. Links start with a verb ("Join the dental plan online", "Read about dental costs on NHS inform"). | NHS service manual content guide ("How we write"; "Numbers, measurements, dates and time"). NHS England GP guide: reading age 9 to 11, verb-first links that say where they go. |
| "Join as a new patient" is the first section: two routes side by side (NHS waiting list, dental plan), each as numbered "what happens next" steps. | Access to an NHS dentist is the main worry in Scotland now. Anxious users need to know what happens next. The first check-up step uses NHS inform's description of the registration examination. |
| "Nervous about the dentist?" callout, a nervous-patient quote in the hero, and real reviews with names. | Trust and anxiety research in the brief. Three of the four real reviews are from nervous patients, so the page leads with them instead of claiming it. |
| The NHS charges for Scotland are shown as three plain cards (free check-ups, who gets free treatment, 80% up to £384) with a link to the source. | Clarity about NHS and private costs builds trust. Figures quoted from nhsinform.scot/dentist. |
| The team: every person with role, GDC number where known and one factual line, plus a link to check the GDC register. | Trust comes from real people with registration numbers. |
| One typeface, Figtree, at 17px (phone) to 19px (desktop) body, with plain numerals. | NHS.UK uses one family at 16 to 19px body. Figtree has a large x-height and open shapes. I tested Atkinson Hyperlegible Next first, but its slashed zero turns "0131" into "Ø131" in the most important element on the page, the phone number. |
| NHS.UK yellow focus style on every link and control. | NHS.UK frontend focus pattern. Familiar to NHS users, and it shows on light and dark grounds. |
| No NHS logo or NHS blue as the brand colour. The practice's own logo colour is the brand. | Independent contractors may not use the NHS identity without permission. The practice is a business with its own brand. |

Sources: [NHS service manual](https://service-manual.nhs.uk/) (design principles, content style guide, typography, care cards), [NHS England: step-by-step guide to improving GP website online journeys](https://www.england.nhs.uk/long-read/step-by-step-guide-to-improving-general-practice-website-online-journeys/), [NHS inform: dentist](https://www.nhsinform.scot/dentist).

## 4. Rules (every build, no exceptions)

1. **Never invent facts.** Every name, GDC or GMC number, qualification, year, treatment, hour, price, plan detail and review comes from the practice's current site, its NHS listing (NHS inform in Scotland, nhs.uk in England) or the job card. Do not add online booking, finance, prices, awards, statistics, "years established", star ratings, team members or treatments. If a fact is missing (for example a GDC number), leave the line out. Do not write a placeholder.
2. **Write facts you can't confirm as an action.** "Phone us to ask about the plan's cost", not a cost. "Ask us for the price before you start", not "affordable".
3. **The first screen on a 390px phone shows:** the live status, the h1, how to join (with the waiting time), the Call button with the number, and the start of the emergency box. The header Call button is always visible.
4. **No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play video, map embeds or third-party scripts.** Link to Google Maps for directions. If you ever must embed a map, give the iframe `tabindex="-1"` and put a text "Get directions" link beside it.
5. **Accessibility is WCAG 2.2 AA.** Text contrast at least 4.5:1 (3:1 for text 24px and up, and for UI components). Visible focus on everything (built in). A skip link, `header`, `nav`, `main`, `footer`, one `h1`, and `h2` then `h3` in order. Tap targets at least 44×44px on phones, including footer links, inline links (`.inline-tap`) and contact links. Keyboard only works, including the menu: the toggle has `aria-expanded` and `aria-controls`, and Escape closes it. `prefers-reduced-motion` turns off the only animation. Text resizes to 200% and the page reflows at 320px.
6. **Short numbers (111, 999) are plain text**, never `tel:` links. Full numbers are `tel:+44…` links.
7. **Images:** inline SVG for icons and marks (never `<img src=".svg">`). Photos are JPEG at quality 72 to 80, sized to how they show, with `width` and `height`, and `loading="lazy"` below the first screen. Never stock photos of people. A Creative Commons photo of the town is allowed if it is downloaded locally, credited on the page and listed in `img/CREDITS.txt`.
8. **Performance:** fonts self-hosted (no Google Fonts or any CDN, for GDPR). Plain HTML, CSS and JS. No framework, no build step. Keep the homepage under 1.5 MB. The example is about 480 KB on desktop and 250 KB on a phone.
9. **NHS facts come from the official source,** quoted plainly, with a link to the source page.

## 5. Writing rules

- Say "you" and "we". Active voice. Sentences under 20 words, paragraphs of 1 to 3 sentences.
- Times: `9am`, `5:30pm`, `midday`. Ranges: "9am to 1pm", "Monday to Friday". Never "09:00–13:00".
- Plain word first, then the clinical term: "Gum treatment (periodontal treatment)".
- Links start with a verb and say where they go: "Join the dental plan online", "Read our privacy notice", "Check a dentist or nurse on the GDC register". Never "click here", "learn more" or "find out more" on its own.
- Each treatment gets one plain line on what it is. No promises ("pain-free", "perfect smile").
- Quote reviews exactly, including the reviewer's own spelling and punctuation, with their name as published. Lead with nervous-patient reviews if there are any.
- Use curly apostrophes and quotes (’ “ ”).

## 6. Homepage structure

Follow this order and reuse the class names. Sections are `<section class="section" id="…" aria-labelledby="…">` wrapping `.wrap`. Alternate the grounds as shown, so the page has rhythm without decoration.

1. **Icon sprite** (`svg.sprite`), then the **skip link** (`.skip-link` → `#main`).
2. **Header** (`.site-header`).
   - Row 1 (`.site-header__bar`): `.brand` (logo PNG or inline SVG, name, tagline), `.header-meta` (address, wide screens only), `.btn.btn--primary.header-call` (the number from 48em, "Call" on phones), `.menu-toggle` (below 60em).
   - Row 2: `nav.nav#site-nav` with **6 or fewer** items, named for tasks: New patients, NHS costs, Treatments, (signature service), Our team, Hours and contact.
3. **Hero** (`.hero`, tint ground, 4px brand edge at the top).
   - Left (`.hero__main`): `.status` pill (live); `h1` "[NHS / private / NHS and private] dentist in [Town]"; `.hero__lead` of 1 to 2 sentences that answers "can I join?" with the real waiting position; `.btn-row` with the Call button and an arrow link to `#join`; `.urgent-line` (emergency rule and NHS 24 on 111, with a link to `#emergency`); `.trust` (one real review, then the partners' faces and a line linking to `#team`). Keep `.trust` as the last child of `.hero__main`: below 60em the CSS moves the task panel up between the urgent line and the trust row.
   - Right: `aside.desk` "How can we help?". Five `.task` links: join, book (a `tel:` link), toothache (`.task--urgent`), costs, opening hours. `.desk__foot` has today's hours (`[data-today-hours]`) and the address with a directions link.
4. **Join as a new patient** (`#join`, page ground). `.grid-2` of two `.card.card--feature`: NHS route and plan or private route. Each has a `.card__label`, `h3`, one sentence and `ol.steps` ("what happens next"), then its action. Below: `.callout` for nervous patients.
   - If the practice is not taking NHS patients, say so plainly in the NHS card and the hero lead, and give the NHS inform link for finding a dentist. Never hide it.
5. **NHS costs** (`#costs`, white). `.costs` of three `.card.cost`: free check-ups, who gets free treatment, what everyone else pays. Then `.costs-note` with the private-price line and the source link. In England, swap in the nhs.uk band charges.
6. **Reviews** (`#reviews`, page ground). `ul.quotes` of `figure.quote`. The first is `.quote--lead` (dark). 2 to 4 reviews. If there are no real reviews, drop the section and the hero quote.
7. **Treatments** (`#treatments`, white). `.treatments` of `.treat-group` (icon, `h3`, `dl.treat-list`). Group by what the patient wants, not by specialty: Fillings, Saving teeth, Repairing and replacing teeth, How your teeth look, Children, plus a group that points to the signature service. 3 to 6 groups. List only treatments the source names.
8. **Signature service** (`#aesthetics` here, page ground). `.feature`: portrait in `figure.feature__media` with a factual caption, then the section head, `ul.ticks`, how to book and a Call button. Drop this section if the practice has no signature service.
9. **Our team** (`#team`, white). `ul.team` of `li.person`: 4:5 photo, name (`h3`), `.person__role`, `.person__gdc` (only if known), `.person__bio` (one factual line). Dentists first (partners, then associates by length of service), then nurses and the manager. End with the GDC register link.
10. **Opening hours and how to find us** (`#visit`, page ground). Section head with a second `.status` pill. `.visit` with: the hours card (`table.hours`, one `tr[data-day]` per day, with the lunch note) and a right column of the address card (`address`, Call, Get directions, Email) and the urgent care card (`.care-card#emergency`: when we're open, when we're closed, life-threatening). Then `figure.place` (town photo and credit) if you have one.
11. **Footer** (`.site-footer`, brand-deep). Brand, one-line description and address. Columns: Contact us, New patients, Information (privacy notice, FOI or complaints pages, NHS source). Legal line with the year and the out-of-hours rule.
12. **The hours JSON** (`script#practice-hours`), then `<script src="../frontdesk.js">`.

### The hours JSON (the single source of the live status)

```json
{
  "timeZone": "Europe/London",
  "open": {
    "mon": [["09:00", "13:00"], ["14:00", "17:30"]],
    "sat": [],
    "sun": []
  },
  "emergency": { "mon": [["09:00", "11:00"]] }
}
```

- Every day `mon` to `sun` must appear in `open`. Use 24-hour `HH:MM`. Split a day into sessions around lunch. An empty list means closed.
- `emergency` is optional: the phone-in windows for urgent calls. It drives "The emergency phone line is open now, until 11am."
- Keep the visible `table.hours` and the JSON-LD `openingHoursSpecification` in the `<head>` in step with it. They are written by hand, so check all three.
- `frontdesk.js` works in Europe/London time whatever the visitor's clock, says times NHS-style (9am, 5:30pm, midday), marks today's row, and refreshes every minute. Without JS, the pill reads "Open Monday to Friday · Closed at weekends". Write that fallback text for each practice.

## 7. Tokens and re-theming

Re-theme a practice by changing only the **Brand** block at the top of `styles.css`. Leave the neutrals, status colours, type and spacing alone.

| Token | Use | Rule | Musselburgh |
| --- | --- | --- | --- |
| `--brand` | Logo colour exactly. Decoration only: hero edge, quote marks, menu hover underline. | Never text on a light ground. | `#13ABC3` (2.75:1, so decoration only) |
| `--brand-text` | Links, primary button fill, icons, card top edges, roles. | At least 4.5:1 on `#FFFFFF`, `--page` and `--brand-tint` (aim for 5:1). White text on it at least 4.5:1. | `#0A6B7A` (6.2:1) |
| `--brand-text-hover` | Hover and pressed states. | About 6 lightness points darker than `--brand-text`. | `#085A67` |
| `--brand-deep` | Footer, task panel foot, nervous callout, lead review, step numbers. | White on it at least 7:1. | `#0B3B43` (12.2:1) |
| `--brand-on-deep` | Brand-coloured text and icons on `--brand-deep`. | At least 4.5:1 on `--brand-deep` (aim for 7:1). | `#7FD9E6` (7.5:1) |
| `--brand-tint` | Hero ground, task icon circles, today's row. | Lightness about 95%. | `#EAF6F8` |
| `--accent` | Second logo colour. The short rule above each h2 and before review names. | Decoration only. If the logo has one colour, use `--brand-text`. | `#B8902F` |
| `--accent-on-deep` | Footer headings on `--brand-deep`. | At least 4.5:1 on `--brand-deep`. | `#E6C46A` (7.3:1) |
| `--on-deep-soft` | Body text on `--brand-deep`. | Keep near-white. | `#E3ECEE` |
| `--ink`, `--ink-soft`, `--page`, `--surface`, `--line`, `--line-strong` | Neutrals. | Don't change. | |
| `--ok`, `--warn`, `--urgent`, `--urgent-tint`, `--focus`, `--focus-ink` | Fixed meanings: open, lunch or closing soon, urgent, focus. | Never re-theme. | NHS.UK values |
| `--font`, `--fs-*`, `--lh-*`, `--measure` | Type. | Don't change. | Figtree |
| `--radius`, `--radius-sm`, `--max`, `--gutter`, `--section`, `--tap`, `--shadow` | Shape and space. | `--tap` stays 44px. | |

### How to re-theme from a logo

1. Sample the logo's main colour exactly (from the SVG or PNG, not by eye). Sample a second colour if the logo has one.
2. Run `node retheme.mjs "#MAIN" "#SECOND"`. It keeps the logo's hue and prints all eight brand tokens, with a contrast check line.
3. Paste the output over the Brand block. Small hand adjustments are fine if the check line stays at or above the rules in the table.
4. **Special cases:**
   - **A red or pink brand:** the urgent card must still stand out, so keep `--urgent` as NHS red and don't use the brand on anything alarming.
   - **A very light or yellow brand:** `--brand-text` will come out dark and muddy. Raise its saturation by hand, or use a dark neutral of the same hue.
   - **A navy or near-black brand:** `--brand-text` can equal `--brand`. Keep `--brand-tint` clearly visible against `--page`.
5. Logo: use the practice's real logo. Show it as a transparent PNG at 3× its display size (144px for a 48px display) or as inline SVG. A text-only SVG logo must be inlined, not used with `<img>`.

## 8. Components quick reference

`.btn--primary` (filled, the one action per block), `.btn--secondary` (outline), `.arrow-link` (verb-first text link with an arrow), `.inline-tap` (adds a 44px tap height to a link inside text without changing the line height), `.status[data-status]` (live pill: `.status__dot`, `.status__state`, `.status__detail`), `.urgent-line`, `.desk` and `.task`, `.card` (`.card--feature`, `.card__label`), `ol.steps`, `.callout`, `.quote` (`.quote--lead`), `.cost`, `.treat-group`, `.feature`, `.person`, `table.hours`, `.care-card`, `.place`, `.contact-line`, `.nowrap` (keeps an arrow link's last word with its arrow, or a name, on one line), `.keep` (keeps a phone number or a time range together but still wraps inside itself at 200% text).

**Icons:** a sprite of `<symbol>`s at the top of the body. Use one with `<svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>`. Icons are always decorative, with the meaning in text beside them. The available icons are phone, arrow, chevron, pin, clock, mail, join, alert, tag, menu, close, check, external, heart, tooth, shield, layers, star, smile, face and quote.

## 9. Responsive layout

Checked at 320, 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px, and at 200% text on a 320px phone (no sideways scroll). Don't add breakpoints in a build; if a practice's content breaks a layout, fix it in the template.

**Breakpoints:** 30em (480px), 44em (704px), 48em (768px), 60em (960px), 64em (1024px), 70em (1120px). Side gutters are always `--gutter` on `.wrap`, so every section, card and panel shares one left edge. Section spacing is always `--section`.

**Header**
- Below 48em (phones, 600px tablets): one sticky row. Logo, the name on two lines (no tagline), a "Call" button, and a Menu toggle (icon only below 384px).
- 48em to 60em (768 and 834px tablets): one sticky row. Logo, name and tagline, "Call 0131 …" with the number, and the Menu toggle.
- From 60em: the full nav as a second row, not sticky. The address shows from 64em. The nav must fit one row at 960px: keep it to 6 short items.
- The open menu is a single column of 48px rows under the header bar.

**Hero:** two columns from 60em (main left, task panel right). Below 60em it is one column in this order: status, h1, lead, Call and join link, urgent line, the task panel, then the review and faces. The urgent line and trust row then go full width so their edges line up with the panel.

**Status pill:** one line from 30em. Below 30em it is a two-line rounded box: the state, then the detail under it, with no "·".

**Grids**
- Join (`.grid-2`): 1 column, 2 from 52em. Cards are equal height and the action sits on the card's bottom edge. On phones the card buttons go full width.
- Costs: stacked cards on phones; from 30em to 60em, one card per row with the figure in its own left column; 3 columns from 60em.
- Reviews: 1 column, 2 from 48em (2 × 2).
- Treatments: 1 column, 2 from 36em, 3 from 60em. Use 3 or 6 groups so no row has a lone group at desktop.
- Signature feature: portrait as a small byline beside the caption below 44em; two columns (portrait left) from 44em, top-aligned up to 64em and centred above. The ticks list goes to 2 columns only where each item fits on one line.
- Team: below 64em, cards with the photo on the left (1 column, 2 from 44em). From 64em, 4 portrait cards a row. Use an even number of people for the 2-column tablet layout where you can; 8 is ideal.
- Visit: 1 column; 2 equal columns from 48em (hours left; address and urgent care card stacked right); 1.1 / 0.9 from 60em.
- Footer: 1 column; brand row over 3 link columns from 44em; 4 columns from 70em.

**Text:** headings use `clamp()` sizes and `text-wrap: balance`; body text uses `text-wrap: pretty`. Wrap phone numbers inside running text and each opening-hours session in `<span class="keep">`, and the last word plus arrow of an `.arrow-link` in `<span class="nowrap">`. Put `<wbr>` before the `@` of a long email address.

**Images:** the town photo is 21:8 from 48em, 16:9 from 30em and 4:3 on phones. Portraits are 4:5 with `object-fit: cover` everywhere; in the tablet team cards they fill the card height.

## 10. Adapting Front Desk for a GP practice

NHS England's benchmark asks for top tasks first, plain English, and urgent help that's easy to find. Changes:

1. **h1:** "GP surgery in [Town]" or "[Practice name], [Town]". Lead: how to contact the practice today (phone and online form, with the times each is open).
2. **Task panel (5 to 6 tasks, verb-first):** Request an appointment (the online consultation link or phone), Order a repeat prescription, Get test results, Get a fit note (sick note), Register with the practice, See opening hours. Booking is the first task.
3. **Urgent help:** replace the dental emergency box with care cards. "Phone 111 if you need help urgently and we're closed" (urgent), and "Call 999 if someone is seriously ill or injured, or their life is at risk" (emergency, `--urgent` head on dark). In Scotland, "phone NHS 24 on 111". Keep both visible in the first screen on a phone.
4. **Menu, 7 items or fewer:** Appointments, Prescriptions, Test results, Register, Opening hours, Our team, Contact us.
5. **Sections in order:** Appointments (how to ask, by phone and online, with times and what happens next) → Prescriptions → Test results → Register (online form or paper; catchment area) → Opening hours and contact (with the `emergency` JSON key used for the duty doctor or call-back window, or dropped) → Team (GPs with GMC numbers, nurses, manager) → Footer (practice policies, complaints, privacy, accessibility statement, NHS app link).
6. **Drop:** NHS dental costs, treatments, the signature feature and the "nervous" callout. Keep reviews only if the practice publishes them.
7. Point Scottish practices to NHS inform and English practices to nhs.uk.
8. Check against the [GP website benchmark tool](https://www.england.nhs.uk/long-read/step-by-step-guide-to-improving-general-practice-website-online-journeys/) before handover.

## 11. Pre-handover checklist

**Facts**
- [ ] Every fact on the page traces to the practice site, its NHS listing or the job card. Nothing is invented. List any you couldn't confirm in your report.
- [ ] Phone number checked digit by digit in the header, hero, task panel, address card, emergency card and footer. `tel:` links use `+44` and no spaces.
- [ ] Hours match in the visible table, the hours JSON and the JSON-LD.
- [ ] Reviews are quoted exactly, with names.
- [ ] NHS cost figures match the current official page, and the link works.
- [ ] GDC or GMC numbers checked on the register. Lines without a known number are left out.

**First screen (390 × 844 phone)**
- [ ] Status pill, h1, join answer, Call button and emergency box are visible without scrolling. The header Call button is visible.
- [ ] Test the live status at three times (open, lunch and closed). In the browser console, `new Date()` must give London time. Or use the audit's screenshots plus one manual check.

**Accessibility and quality**
- [ ] `node pipeline/audit.mjs <url> <out>` shows 0 blockers, 0 major and 0 minor issues.
- [ ] Tab through the whole page. Focus is always visible, the skip link works, and the menu opens with Enter and closes with Escape.
- [ ] Zoom to 200% and check at 320px wide: no sideways scrolling, nothing cut off.
- [ ] Check 360, 768 and 1024px: header on one row, nav not wrapped, no lone word or stray "·", phone numbers whole (see section 9).
- [ ] Turn on reduced motion: nothing animates.
- [ ] Every image has the right `alt` (a person's name, a description of a place, or `alt=""` for decorative logos next to the name).
- [ ] Headings in order: one h1, then h2s, then h3s.

**Performance and licences**
- [ ] Page weight under 1.5 MB (check the Network panel after scrolling to the bottom).
- [ ] No request leaves the site except the links patients click. No fonts, scripts or maps from a CDN.
- [ ] Every Creative Commons photo is credited on the page and in `img/CREDITS.txt`. `fonts/OFL.txt` is present.
- [ ] `<title>` and meta description name the practice, the town and "NHS" or "private" as appropriate.

## 12. The worked example: Musselburgh Dental Care

`example/index.html` uses only the facts in the job card. These are the judgement calls:

- **"Run by Dr Martin Chan and Dr Caroline McArdle, the practice partners."** This comes from their role (partners).
- **"These are not NHS treatments" (facial aesthetics).** Anti-wrinkle injections, fillers and botulinum toxin aren't part of NHS dental treatment in Scotland. Confirm the wording with the practice.
- **The NHS first check-up step** uses NHS inform's description of the registration examination. It is not a practice claim.
- **"Phone us between 9am and 11am, Monday to Friday" for emergencies.** The practice is closed at weekends, so the 9am to 11am rule applies on weekdays.
- **"Call 999" for life-threatening problems** is standard NHS advice, not a practice claim.
- **Anna Maguire and Lynsey Ogilvie** have no GDC number in the source, so none is shown. Lynsey Ogilvie's year of qualification isn't given.
- **The dental plan's cost and cover** aren't published, so the page asks patients to email or phone.

**Inner pages (12 October 2026):**
- **NHS charges** on `treatments.html` are NHS inform's table (charges from 1 November 2025, page updated 27 July 2026). The practice's own FAQ page still shows the November 2023 charges and links to a Scottish Dental page that no longer exists, so neither is used.
- **Check-up frequency** follows NHS inform ("from less than 6 months to every 2 years"), not the practice's "annual" wording.
- **Aesthetics prices** are as published on the practice's aesthetics page, which dates from 2022. The page says "phone us to check before you book". The before-and-after patient photos on that page are not used.
- **Joanna Adamczak-Gawrychowska** is on the old team page but not on the current homepage team list, so she is left out. Confirm with the practice.
- **"Shirley"** is listed with no surname, as published.
- **Fraser Sim:** his bio says he became a partner in 1985; the practice history says "soon after" 1980. The team page uses 1985 and the timeline says "later".
- **Saturday appointments:** the practice FAQ says some dentists may offer them, but the hours say closed at weekends. Left out; phone to check.
- **The Edinburgh branch** (28 Annadale Street) in Mr Sim's bio is left out, as it's unclear whether it is still part of the practice.

Licences: Figtree © The Figtree Project Authors, SIL OFL 1.1. Icons adapted from Feather (MIT). High Street photo © Barbara Carr, CC BY-SA 2.0, via Geograph and Wikimedia Commons.

## Inner pages

Real practice sites need more pages: Redesign study writes a `pages` site map, and Build makes every page on it. The example now has three worked inner pages. Copy the closest one and keep its structure.

| Page | What it shows | Patterns to copy |
| --- | --- | --- |
| `example/treatments.html` | Treatment groups, the NHS charges table, help with costs, how to pay, and 14 FAQs in 4 groups | Page head with "On this page" panel, `.treatments` groups with ids, fee table, `.costs` cards, FAQ groups beside the "Still have a question?" card |
| `example/aesthetics.html` | Dr McArdle, four treatments with what to expect, every price, aftercare, and who to phone if something goes wrong | Page head with a price panel, `.feature` portrait, treatment cards (`.card--feature` + `.treat-list`), fee table, private-only `.callout`, aftercare expanders beside a `.care-card` |
| `example/our-team.html` | Six dentists, the manager and head nurse with long bios and GDC numbers, the wider team by name, and the history since the 1960s | `.team--list` cards, `.names` list, `.history` timeline with `.photos` |

All three are built from the homepage's header, menu and footer. The menu links to the inner pages (`treatments.html#costs`, `treatments.html`, `aesthetics.html`, `our-team.html`) and back to homepage sections as `./#join` and `./#visit`, so the header is identical on every page except for `aria-current="page"`. The homepage's task panel, costs note, treatments, aesthetics feature and team section each end with a link to the matching inner page.

- **Same shell everywhere.** Every page reuses this template's header, menu, footer, tokens, fonts and JS, copied exactly from `example/index.html`. Mark the current page in the menu with `aria-current="page"`.
- **Page pattern.** A short breadcrumb or "Back to home" link, one `h1` that says what the page is, a one- or two-sentence intro, then sections with `h2` headings. Use the same components as the homepage (cards, care cards, summary lists, tables, the team grid) rather than inventing new ones.
- **Keep the urgent route on every page.** The call button stays in the header. Pages about appointments, emergencies or treatment repeat the short urgent-help block.
- **Long content.** FAQs go in `<details>` expanders grouped under headings. Fee lists go in a simple table with a "last checked" date and a link to the official NHS charges. Policies (privacy, FOI, complaints) go on plain text pages linked from the footer.
- **Menu.** The 7 or fewer menu items point to the most-used pages. Everything else is linked from the footer and from the pages it belongs to.
- **File names.** Use short lowercase names like `treatments.html` and `new-patients.html`, all in the site root, with relative links between them.
- **Check.** The browser audit crawls every page. All pages must pass it, and `viewports.mjs` must show clean layouts on the main inner pages too.

### Inner-page patterns (copy the markup from the example)

1. **Page head** (`section.page-head` > `.wrap.page-head__grid`). Left (`.page-head__main`): `nav.breadcrumb` (`ol`: "Home" link, then the page name in `span[aria-current="page"]`), the `h1`, `p.page-head__lead` (1 to 2 sentences), a `.btn-row` with the Call button and one arrow link, then the page's `.urgent-line` (treatment and appointment pages) or a `.trust` row (team page). Right: `nav.desk` "On this page" with 4 to 6 `.task` links to the page's sections. Same-page tasks use `.task__chev--down`, so the chevron points down. The desk text can carry real facts (the aesthetics panel shows each price). It sits under the main column below 60em.
2. **Fee table** (`.fee-table-wrap` > `table.fee-table`). The `caption` names the list, with a one-line `span` under it. `thead` has "Treatment" and "You pay" (or "Price"). One `tbody` per group, starting with `tr.fee-table__group > th[scope="rowgroup"][colspan="2"]`; each item is `th[scope="row"]` plus a `td` price. Free items get `td.fee-table__free`. Wrap each end of a price range in `.keep` ("£104.68 to" / "£164.52"). Follow it with `.costs-note`: `p.last-checked` (`<strong>Last checked: [date].</strong>`, where the figures come from and their date) and an arrow link to the official source. NHS charges in Scotland come from the [NHS inform charges table](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/receiving-nhs-dental-treatment-in-scotland/), never from the practice's old site. Private price lists link to the NHS charges instead and say "phone us to check before you book".
3. **FAQ groups** (`.faq-layout` > `.faq-groups` + `.card.card--feature`). Each `.faq-group` has an `h3` with an icon, then `div.faq` of `details` > `summary` (the question, then `<svg class="icon"><use href="#i-chevron"/></svg>`) and `div.faq__body`. Group by task (check-ups, treatment, paying, getting here), 2 to 4 questions a group. Questions in the patient's words; answers in 1 to 3 short paragraphs or a list. The side card is "Still have a question?" with Call, email and an hours link; it sticks in view from 60em. Use `div.faq` on its own (no layout or card) for short lists such as aftercare.
4. **Treatment cards** (`.grid-2` of `.card.card--feature` with an `id`). `.card__label` holds the price ("From £130"), then `h3`, 1 to 3 short paragraphs, and a `dl.treat-list` of plain facts: "How long it takes", "How long it lasts", "You may notice".
5. **Help card beside a list** (`.visit` > `div.faq` + `.care-card#help`). For anything that can go wrong after treatment: rows of "what you notice" (`h4`) and "who to phone" (with `tel:` links).
6. **Team page** (`ul.team.team--list`). The same `li.person` markup as the homepage, with up to two `.person__bio` paragraphs: training and career first, then one personal line if the practice publishes one. The photo sits beside the words from 30em and above them on small phones. Two columns from 64em. Group as dentists, then manager and senior nurse in their own section. The wider team goes in `ul.names` (names only, as published).
7. **History** (`.history-layout` > `ol.history` + `.photos`). Each `li` is `span.history__when` and one `p`, in plain present tense ("Mr Carr moves the practice…"). Only dates the source gives. The `.photos` column takes one wide `figure.photo.photo--wide` (old photo, natural ratio) and two 4:5 `figure.photo`s, each with a short caption. Photos are the practice's own, of premises or staff, never patients, and each is listed in `img/CREDITS.txt` with its source URL.
8. **Grounds.** After the page head, alternate `.section` and `.section--white` exactly as the homepage does.

