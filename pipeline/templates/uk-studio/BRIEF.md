# Studio

> Pipeline name: **Studio** (folder `templates/uk-studio/`). A template for **private and mixed private/NHS dental practices**. It sits beside the **Front Desk** family (task-first, little imagery), the **Familiar Faces** family (people-led) and **Doorway** (premises-led). When this brief says "Studio", it means this template.

**The idea in one line:** the room is the brand. A private patient is choosing where to spend money and, often, where to face a fear. Studio shows them the actual rooms, the actual prices and the actual people, in an editorial voice that feels like a well-run private clinic, after it has answered the four questions every patient arrives with.

Studio is not a mood board. The first screen on a phone is the same disciplined task block as Front Desk (what the practice is, whether it's open, how to book, what to do in pain). The design starts straight after: arched frames of the practice's own interiors, an editorial serif with one italic accent word per headline, a treatment index with prices, a nervous-patient section and the principal's "why".

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), then components and inner-page components. | Tokens only. |
| `studio.js` | About 130 lines of plain JS: phone menu, live open or closed status (Europe/London), the treatment index, and the ribbon's pause button. | No. |
| `fonts/` | Newsreader (headings: a static optical-size instance, weights 380 to 620, roman and italic) and Hanken Grotesk (text, weights 400 to 800), latin and latin-ext woff2, plus `OFL.txt`. | No. |
| `PHOTO-SHOTLIST.md` | What to photograph for this template. Doubles as a paid add-on. | Give it to the practice. |
| `example/index.html` | The worked homepage for Polwarth Dental Clinic, Edinburgh. | Yes, for each practice. |
| `example/treatments.html`, `new-patients.html`, `about.html` | The worked inner pages (see "Inner pages"). | Yes, for each practice. |
| `example/img/` | The practice's own images, and `CREDITS.txt` with every source URL. | Replace for each practice. |

The example links `../styles.css`, `../studio.js` and `../fonts/…`. Keep that layout: one template folder, one `example/` (or practice) folder inside it.

## 2. Concept, and what it is not

The owner rejected generic, trend-driven templates (magazine, hotel, transit signage) that put style before tasks. Studio's style is borrowed from **real Scottish private practices that convert**, not from a mood, and every borrowed pattern is kept only where it helps a patient decide.

- **Not a magazine.** The h1 says what and where ("Private dentist in *Polwarth,* Edinburgh"), never a slogan. The italic is one word, in the practice's second colour, used as emphasis, not decoration.
- **Not a hotel.** Interiors appear because anxious patients want to know where they'll be (we say so on the page). They are captioned with plain facts ("One of our ground-floor treatment rooms"), never with lifestyle copy.
- **Not stock.** If a practice has no good interior photos, the layout degrades cleanly (section 7), and the shot list becomes a paid add-on.

## 3. Patterns used, from the study

From `prospects/research/private-dental-patterns.md` (131 Scottish private sites, studied 12 October 2026). The study found 4 in 5 "good" private sites are the same few agency layouts with cookie walls, chat widgets and pop-ups. Truly custom sites (Glenrothes Dental House, Crafted Dental, Bank Street Dental, EH10, Inverleith) share the patterns below.

| # | Study pattern | How Studio uses it | Why |
| --- | --- | --- | --- |
| 1 | Editorial typography, italic accent word, marquee ribbon | Newsreader headings with exactly one `<em>` per h1 and h2. One optional slow ribbon of 3 to 4 facts, with a Pause button, paused on hover and focus, static under reduced motion. | Gives a private-clinic voice cheaply. The ribbon repeats facts shown elsewhere, so it's never essential. |
| 2 | The room as the brand | Arched (`--arch`) and softly rounded frames of the practice's own reception, waiting room, treatment rooms and building. A "See the rooms before you come" section. | Anxious patients are reassured by knowing what to expect (NHS service manual: tell users what will happen next). The photos are the practice's real asset; stock faces are not. |
| 4 | Transparent "From £" prices, price list in the menu | Every index row shows its price. "Treatments and prices" is the first menu item. A full fee table with a "Last checked" line. | Clarity about cost builds trust; price is the second question a private patient asks. |
| 5 | Treatment index with a detail panel | `.index`: a numbered list on the left, the chosen treatment's panel on the right (60em and up); an accordion on phones; every panel visible without JS. | Lets a patient compare treatments without a grid of identical cards or a page per treatment. |
| 6 | Patient stories as content | Real reviews quoted exactly, with names, a large lead quote. A nervous patient's review leads the nervous section. | Peer reassurance outperforms claims. |
| 8 | Nervous-patient section with an empathetic headline | A dark section: "For anyone who has *put off* the dentist for years", a real review, three things the practice actually does, a Call button. | Dental anxiety is common, and many nervous patients never phone. |
| 9 | Numbered principles | `ol.principles` 01 to 04, written only from the practice's own stated approach. | Scannable proof of how the practice works. |
| 10 | Founder's "why" | `.letter`: the practice's own published words, edited for plain English, beside an interior photo, signed by the team with the principal named. | Personal without inventing a quote. Swap in a genuine letter from the principal when they approve one (section 10). |
| 12 | Finance and plans | The membership plan as a dark card with the real "from" price. Interest-free payment plans mentioned only as the practice describes them. | Monthly cost lowers the barrier for private care. |

**Not used:** 3 (before/after sliders, see section 7), 7 (outcome stats: Polwarth publishes none), 11 (smile tools: they need a backend; link to a consultation instead), 13 (awards: Polwarth's only badge is a 2019 award for its old website), 14 (Instagram feeds: third-party scripts and trackers).

**What the study says to avoid, and Studio never does:** pop-ups and cookie walls on arrival (27% of research participants were stopped by overlays), chat widgets over the Call button, auto-rotating carousels and video backgrounds, light grey text on cream, thin serif body text, "Book online" with no visible phone number, stock models as patients.

## 4. Research → design decisions

| Decision | Research |
| --- | --- |
| The phone's first screen holds the live status, the h1, a one-line answer to "can I join and how do I book?", the Call button with the number, and the emergency route. The design starts after. | NHS England's GP website guide (patients arrive with a task); NHS service manual design principles. Hard requirement from the brief. |
| h1: "[Private / NHS and private] dentist in *[Area],* [Town]". | NHS service manual: users need to confirm they're in the right place; headings describe content. |
| Body text in a sans (Hanken Grotesk, 17 to 19px, plain numerals); serif only for headings, numerals, the letter's opening line and lead quotes. | NHS.UK uses 16 to 19px sans body text. The study warns about thin serif body text on private sites. |
| Text over photos never happens: photos sit in frames with captions underneath, and the hero's "Plan your visit" card is a solid panel that overlaps the photo's edge. | WCAG 2.2 AA contrast; the study's "light grey on cream" failure. |
| Live "Open now / Closed for lunch / Closed now · opens tomorrow at 9am" pill in the hero and the visit section, plus "Today: …" in the plan card. | NHS England lists opening times among the top patient tasks. |
| Emergency: a red-edged line in the hero, a full care card on the homepage (`#emergency`) with in-hours, out-of-hours and 999. 111 and 999 are plain text. | NHS inform, dental emergencies: phone your own practice first; out of hours phone 111. |
| Prices shown with "from" and a "Last checked" date; anything unpublished says "Ask for a price" or "Phone to ask". | Never invent prices (project rules). |
| One yellow NHS.UK focus style on everything. | NHS.UK frontend focus pattern. |
| No NHS logo or NHS blue as brand colour; the practice's logo colour is the brand. | Independent contractors may not use the NHS identity without permission. |

Sources: [NHS service manual](https://service-manual.nhs.uk/), [NHS England: improving GP website online journeys](https://www.england.nhs.uk/long-read/step-by-step-guide-to-improving-general-practice-website-online-journeys/), [NHS inform: dental emergencies](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/dental-emergencies/), [NHS inform: dentist](https://www.nhsinform.scot/dentist).

## 5. Rules (every build, no exceptions)

1. **Never invent facts.** Every name, GDC number, qualification, date, treatment, hour, price, plan detail and review comes from the practice's site, its NHS listing or the job card. No made-up offers, stats, awards, "years of experience", online booking, sedation, finance or team members.
2. **Write unknowns as an action:** "Ask for a price", "Phone to ask", "Ask us how much it is when you book".
3. **The first screen on a 390 × 844 phone** shows the status pill, h1, lead, Call button and the start of the emergency line. The header Call button is always visible (sticky header below 64em).
4. **No pop-ups, overlays, cookie banners, chat widgets, carousels, autoplay video, map embeds or third-party scripts.** Studio sets no cookies and loads nothing from another domain, so it needs no cookie banner. If a map must be embedded, give the iframe `tabindex="-1"` and put a text "Get directions" link beside it.
5. **Accessibility, WCAG 2.2 AA:** contrast 4.5:1 for text (the token table is pre-checked), visible focus, skip link, landmarks, one h1, headings in order, 44px tap targets (arrow links, breadcrumb, footer and inline links are built to 44px), everything keyboard-operable (menu: `aria-expanded`, `aria-controls`, Escape; index: disclosure buttons; ribbon: a real Pause button with `aria-pressed`), `prefers-reduced-motion` stops the ribbon and all transitions, and the page works at 200% text.
6. **111 and 999 are plain text.** Full numbers are `tel:+44…` links.
7. **Images:** practice photos only, JPEG quality 72 to 78, `width` and `height` set, `srcset` of 480w and 800w, `loading="lazy"` below the first screen and `fetchpriority="high"` on the hero. Inline SVG for icons. A text-only SVG logo must be inlined, never `<img src=".svg">`.
8. **Performance:** self-hosted fonts only, plain HTML, CSS and JS, no framework. Homepage under about 1.2 MB on desktop and 800 KB on a phone. The example homepage is about 503 KB on desktop and 610 KB on a 3× phone (after scrolling to the bottom).
9. **NHS facts** come from NHS inform (Scotland) or nhs.uk (England), quoted plainly, with a link.

## 6. Homepage structure

Sections are `<section class="section [--surface|--stone|--deep]" aria-labelledby="…">` wrapping `.wrap`. Section heads are `.head` > `p.eyebrow` + `h2` (one `<em>`) + `p.lead`. Alternate grounds as listed.

1. **Icon sprite**, then the **skip link**.
2. **Header** (`.site-header`, surface). `.brand` (logo mark 40px + name in Newsreader + tag "Private dentist, [Town]"), `.header-call` ("Call" on phones, the full number from 48em), `.menu-toggle` (below 64em). `nav.nav#site-nav` with **6 items**: Treatments and prices, New patients, Nervous patients, The practice and team, Emergencies, Hours and find us. From 64em the nav is a second row.
3. **Hero** (`.hero`, page ground). Left `.hero__main`: `.status` pill, `h1`, `.hero__lead` (1 to 2 sentences: what, where, since when, how to book or join), `.btn-row` (Call with number + arrow link to treatments), `.urgent-line`. Right `.hero__media`: an arched `figure.frame--arch.frame--tall` of reception (or the building) with `style="--pos: x% y%"` to choose the crop, then `.plan` ("Plan your visit": today's hours via `[data-today-hours]`, address with directions, access).
4. **Ribbon** (`section.ribbon`, optional). One `ul` of 3 to 4 short facts, then an identical `ul aria-hidden="true"`, then the Pause button. Facts must repeat things shown elsewhere on the page. Drop it if the practice has nothing worth repeating.
5. **The rooms** (page ground). `.rooms`: `.rooms__main` (arched 4:5), `.rooms__side` (a rounded 4:3 and an arched 4:5), `.rooms__text` (eyebrow, h2 "See the rooms *before* you come", lead, `ul.facts` of 3 plain facts, arrow link to `about.html`).
6. **Treatments and prices** (surface). `.index[data-index]` of 6 or 7 `.index__item`s, each a `button.index__btn` (number, name, price, chevron) and a `div.index__panel` (h3, `.price-tag`, one line, `dl.detail-list` of 2 to 3 facts, arrow link to `treatments.html#t-[slug]`). End with a link to the full fee guide.
7. **Nervous patients** (`#nervous`, deep). `.nervous`: an arched photo of a calm room, then eyebrow, empathetic h2, `figure.nervous__quote` (a real nervous patient's review), `ul.helps` (3 things the practice really does), Call button (`.btn--light`) and a link to `new-patients.html#nervous`.
8. **Why we practise this way** (page ground). `.letter` (arched interior + `.letter__body` with a serif first paragraph and `.letter__sign`), then `ol.principles` 01 to 04.
9. **Reviews** (surface). `ul.voices`: a large `.voice--lead` and two cards, then a line saying where reviews come from.
10. **Visit** (`#visit`, stone). Second status pill. `.visit`: hours card (`table.hours`, a `tr[data-day]` per day, lunch note), Find us card (address, `ul.contact-list`, building photo), and the `.care-card#emergency`.
11. **Footer** (deep): brand line, address, Contact us, Patients, Information; legal line with ICO number if published and the out-of-hours rule.
12. **Hours JSON** (`script#practice-hours`), then `<script src="../studio.js">`.

### The hours JSON

```json
{ "timeZone": "Europe/London",
  "open": { "mon": [["09:00","13:00"],["14:00","17:30"]], "tue": [["09:00","13:00"],["14:00","18:30"]], "sat": [], "sun": [] } }
```

Every day `mon` to `sun` must appear. Split days around lunch; `[]` means closed. Keep the visible `table.hours` and the JSON-LD `openingHoursSpecification` in step by hand. Without JS the pill reads the fallback text you write in the HTML ("Open Monday to Friday · Closed at weekends").

## 7. Components, and how each degrades

| Component | Class | When the practice lacks the material |
| --- | --- | --- |
| Arched frame | `.frame.frame--arch` (+ `--tall` 4:5, `--land` 4:3, `--wide` 3:2), crop with `style="--pos: 30% 60%"` | **No interior photos:** use the building's front or sign for the hero; if there are none, remove `.hero__media`'s figure and let `.plan` stand alone in the right column; drop the rooms section and sell the shoot (`PHOTO-SHOTLIST.md`). Never fill an arch with stock, illustration or a colour block pretending to be a photo. |
| Plan your visit | `.plan` | Always possible (hours and address are always known). |
| Ribbon | `.ribbon` | Optional. Remove it if there are fewer than 3 real facts. |
| Rooms | `.rooms` | **One or two photos:** keep `.rooms__main` and `.rooms__text`, delete `.rooms__side`. |
| Treatment index | `.index[data-index]` | **No prices published:** keep the index; every `.index__price` reads "Ask for a price" and the panel's `.price-tag--ask` says "Price on request". Don't add a fee table. **Very few treatments (under 4):** use `ul.facts` instead of an index. |
| Before and after | not in the example | **Only** if the practice itself published the photos and confirms each patient's written consent for web use. Add them inside the relevant `.index__panel` as two `figure.frame--land` side by side, captioned "Before" and "After", with the treatment and dentist named. A comparison slider must be keyboard-operable and stop under reduced motion; side-by-side is preferred. If consent is unclear, leave them out (the Polwarth example does). |
| Nervous section | `.nervous` | **No nervous-patient review:** drop the quote, keep the three helps. **No anxiety support described anywhere:** keep the section short: "Tell us when you phone", and the Call button. Never claim sedation unless it's published. |
| Letter | `.letter` | Use the principal's own approved words if you have them, signed with their name and photo. Otherwise use the practice's published words and sign "The team at [Practice]", naming the principal underneath (as in the example). **No principal named:** drop the signature row. |
| Principles | `ol.principles` | Only principles the practice states. If you can't find four, use three (`grid` still works) or drop the list. |
| Reviews | `ul.voices` | **No reviews:** remove the section and the nervous quote. Never write or paraphrase reviews. |
| Membership plan | `.plan-card` | **No plan:** remove it and its menu and footer links. |
| Team | `ul.team` > `li.person` | **No portraits:** remove `.person__photo`; the card still works. Never use silhouettes or avatars. |

Other pieces: `.btn--primary`, `.btn--secondary`, `.btn--light` (on deep grounds), `.arrow-link` (verb-first, 44px tall, keep the last word and arrow together with `.nowrap`), `.inline-tap`, `.status[data-status]`, `.urgent-line`, `.care-card`, `table.hours`, `ul.facts`, `ul.helps`, `ol.steps`, `.callout`, `.faq details`, `.fee-table`, `.gallery`, `.on-page`, `.breadcrumb`, `.page-head`.

## 8. Tokens and re-theming

Re-theme by editing only the **Brand** block (and, if the rooms are cold and modern, the **Grounds** block). Ratios checked with the WCAG formula.

| Token | Use | Rule | Polwarth |
| --- | --- | --- | --- |
| `--brand` | Logo colour exactly. Eyebrow rules, ribbon dots, review dashes, callout edge. | Decoration only. | `#14BEE0` (2:1 on page) |
| `--brand-text` | Links, primary buttons, icons. | ≥ 4.5:1 on `--page`, `--surface` and `--stone`; white on it ≥ 4.5:1. | `#0A6A80` (5.6:1 page, 5.0:1 stone; white 6.2:1) |
| `--brand-text-hover` | Hover and pressed. | Darker than `--brand-text`. | `#08566A` (7.4:1) |
| `--brand-deep` | Nervous section, plan card, footer, ribbon, "Today" tag. | White on it ≥ 7:1. | `#102A33` (15:1) |
| `--brand-on-deep` | Links and icons on deep. | ≥ 4.5:1 on deep. | `#6FD6EC` (8.9:1) |
| `--accent-text` | The italic accent word, numerals, roles. Take it from the rooms (here the mahogany desk) or a second logo colour. | ≥ 4.5:1 on page, surface and stone. | `#8C4A2B` (6.0:1 page, 5.4:1 stone) |
| `--accent-on-deep` | Accent word and footer headings on deep. | ≥ 4.5:1 on deep. | `#E7B48F` (8.1:1) |
| `--on-deep-soft` | Body text on deep. | ≥ 7:1. | `#E4ECEE` (12.5:1) |
| `--page`, `--surface`, `--stone` | Grounds: warm stone, near-white, plaster. | Keep `--ink-soft` ≥ 4.5:1 on all three. | `#F6F2EC`, `#FFFDFA`, `#ECE5DA` |
| `--ink`, `--ink-soft` | Text. | Don't change. | 14.3:1, 7.1:1 on page |
| `--ok`, `--warn`, `--urgent`, `--focus` | Fixed meanings. Status text only sits on `--surface`. | Never re-theme. | NHS.UK-based |
| `--font-display`, `--font`, `--fs-*` | Type. | Don't change. | Newsreader, Hanken Grotesk |
| `--radius`, `--arch`, `--tap`, `--section` | Shape and space. | `--tap` stays 44px. | |

**Re-theming steps**
1. Sample the logo's main colour exactly from the file: that's `--brand`.
2. Darken it in the same hue until it passes 4.5:1 on `--stone` (the darkest light ground): that's `--brand-text`. `node ../uk-dental/retheme.mjs "#MAIN"` gives a good starting value for the same hue.
3. Make `--brand-deep` a near-black in the brand hue (lightness about 12%), and `--brand-on-deep` a light tint of the brand (≥ 4.5:1 on it).
4. Pick `--accent-text` from the rooms (timber, brick, upholstery) or a second logo colour, and darken it to ≥ 4.5:1 on `--stone`. Make `--accent-on-deep` a light tint of it. The accent must be clearly a different hue from `--brand-text` and must not be red (red means urgent).
5. If the practice's rooms are cool and white, cool the grounds (for example `--page: #F3F5F5`, `--stone: #E6EBEB`) and re-check `--ink-soft`.
6. Logo: transparent PNG at 3× its display size or inline SVG. Here the roundel is cropped from the practice's own logo and the name is set in Newsreader.

## 9. Inner pages

Real practice sites need more pages: Redesign study writes a `pages` site map, and Build makes every page on it. The example has three worked inner pages; copy the closest.

| Page | What it shows | Patterns to copy |
| --- | --- | --- |
| `treatments.html` | The full treatment index (10 items), the fee table, the membership plan and payment plans | `.page-head` with photo and "On this page", `.index[data-index]` with `t-[slug]` ids (deep-linkable: the index opens the panel named in the URL hash), `.fee-table`, sticky `.plan-card` |
| `new-patients.html` | How to join (4 steps), the first visit (4 steps + FAQs), nervous patients, the membership plan, and where to find an NHS dentist | `ol.steps` beside an arched photo, `.faq` + `.callout`, `.nervous`, `ul.facts` + `.plan-card`, NHS `.callout` |
| `about.html` | The letter and principles, the rooms gallery, the team with GDC numbers and bios, a long-standing patient's review | `.letter`, `ol.principles`, `.gallery` (3 columns from 60em, middle column arched), `ul.team` for clinicians and `ul.team.team--compact` for nurses and reception (arched portraits) |

- **Same shell everywhere.** Header, menu, footer, tokens, fonts and JS are identical on every page except `aria-current="page"` on the current menu item. Menu items that point to homepage sections use `./#emergency` and `./#visit`.
- **Page pattern.** `.page-head`: breadcrumb, `h1` with one `<em>`, a one- or two-sentence lead, Call button, then the `.urgent-line` on treatment and appointment pages. On the right (from 60em) a `.page-head__photo` (hidden on phones, so it costs nothing there) above `nav.on-page`.
- **Keep the urgent route on every page**: header Call button always; the urgent line on treatment pages; the footer's out-of-hours line.
- **Long content**: FAQs in `<details>`; fee lists in `.fee-table` with a "Last checked" line; policies as plain pages linked from the footer.
- **File names**: short and lowercase (`treatments.html`, `new-patients.html`, `about.html`), relative links.
- **Check**: the audit crawls every linked page; all must pass, and `viewports.mjs` must be clean on each page.

## 10. Responsive layout

Checked at 360, 390, 768, 1024, 1280 and 1440px (`viewports.mjs`: no layout flags on any page), and at 200% text from 320px up (no sideways scroll on any page). Every grid column is `minmax(0, …)` so long words wrap instead of pushing the page wide; the hours table stacks day over time when its card is narrower than 16rem (a container query), which only happens with enlarged text.

**Breakpoints:** 27em, 30em, 40em, 44em, 48em, 52em, 56em, 60em, 64em, 70em. Gutters are always `--gutter` on `.wrap`.

- **Header:** below 48em one sticky row: logo, two-line name, "Call", Menu (icon-only below 27em). 48em to 64em: tag line and the full number. From 64em: nav as a second row, not sticky.
- **Hero:** one column below 60em in the order status, h1, lead, Call, urgent line, photo, plan card (photo 5:4 below 40em; photo and card side by side 40em to 60em). From 60em two columns; the plan card tucks up over the photo's lower-left edge.
- **Rooms:** below 64em the text comes first (on a phone the reader gets the reason before three photos), then the photos in 2 columns from 44em. From 64em three columns: big arch, two stacked frames, then the text.
- **Index:** an accordion below 60em (all closed until tapped; price under the name below 30em). From 60em the list and the sticky detail panel sit side by side and one panel is always open.
- **Nervous:** stacked below 52em; photo and text side by side above.
- **Principles:** 1 column, 2 from 48em, 4 from 70em.
- **Letter:** stacked below 56em; photo then letter above.
- **Reviews:** 1 column; the lead quote full width with two cards below from 48em; three across from 64em.
- **Visit:** 1 column; 2 from 48em (care card full width); 3 from 64em.
- **Team:** two lists. Clinicians (`ul.team`): below 30em the arched portrait sits beside the words; 30em to 64em one column of wide cards (portrait left, bio right); 4 across from 64em. Nurses and reception (`ul.team.team--compact`, names, roles and GDC numbers only): 2 across, 4 from 44em. Each list has a `p.eyebrow.team-sub` label.
- **Footer:** 1 column; 3 from 44em; 4 from 70em.

## 11. Photos and consent

- **Source:** the practice's own published photos or a new shoot (`PHOTO-SHOTLIST.md`). Never stock or AI-generated people, never anyone presented as staff who isn't. Every file and source URL goes in `example/img/CREDITS.txt`.
- **Staff:** before launch the practice confirms in writing that everyone shown consents to their photo, name, role and bio being on the site, and agrees to remove photos within 5 working days of someone leaving.
- **Patients:** never shown, except in before-and-after photos the practice itself published **and** for which it holds the patient's specific written consent for web use. Confirm this in writing before launch.
- **Unnamed people in premises photos** (for example a receptionist at the desk) are not named on the page and need the same consent.
- **Alt text:** describe what's in the room ("A curve of red leather chairs in the bay window of the waiting room"). Portraits: name plus a short visual description, never age, body or ethnicity. Captions add a fact, not a repeat of the alt.

## 12. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the practice site, its NHS listing or the job card. List anything unconfirmed in your report.
- [ ] Phone number checked digit by digit in header, hero, nervous section, care card, visit card and footer.
- [ ] Hours match in the table, the hours JSON and the JSON-LD. Fallback status text written.
- [ ] Every price matches the practice's current fee list, and the "Last checked" line names its date.
- [ ] Reviews quoted exactly, with names as published.
- [ ] GDC numbers checked on the register.

**First screen (390 × 844)**
- [ ] Status, h1, lead, Call button and the start of the urgent line are visible without scrolling. The header Call button is visible.
- [ ] Test the status at three times (open, lunch, closed).

**Accessibility and quality**
- [ ] `node pipeline/audit.mjs <url> <out>`: 0 blockers, 0 major, 0 minor.
- [ ] Tab through every page: focus visible, skip link works, menu opens with Enter and closes with Escape, index rows open with Enter and Space, the ribbon pauses.
- [ ] Reduced motion on: the ribbon is static and wraps; nothing animates.
- [ ] 200% text at 320px: no sideways scroll.
- [ ] `viewports.mjs` clean on every page at 360, 390, 768, 1024, 1280 and 1440.
- [ ] One h1, headings in order; every image has a fitting alt.

**Performance and licences**
- [ ] Homepage under 1.2 MB desktop and 800 KB phone after scrolling to the bottom.
- [ ] No request leaves the site. `fonts/OFL.txt` present; every photo in `CREDITS.txt`.
- [ ] Consent confirmed in writing for staff photos (and any patient photos).

## 13. The worked example: Polwarth Dental Clinic, Edinburgh

**Why this practice.** Graded Average (dated slider design, 2019 award badge, no booking button). It's a private practice (its fee guide and copy say so), established in 1955, with a principal dentist with a bio (Dr Ross Saunderson) and an unusually good set of **professional interior photographs**: a curved timber reception desk, a waiting room with a fireplace and bay window, framed Edinburgh railway posters, an arched hallway and five treatment rooms. It publishes real prices ("From £") and a monthly plan. That is exactly the material Studio is built to show off.

Sources: www.polwarthdental.co.uk, crawled on 12 October 2026 (60 pages); [NHS inform: dental emergencies](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/dental-emergencies/) (updated 29 September 2026).

**Judgement calls and unconfirmed facts**
- **NHS status:** the site describes a private practice and never mentions NHS treatment, but the practice appears in the NHS inform dental directory. The page says "We provide private dental care. Phone us if you want to ask whether we can see you on the NHS." Confirm with the practice.
- **Prices** are from the practice's fee guide, "correct as of March 2025", 19 months old. The page says so and asks patients to phone to check. Prices for implants, aligners, bonding and children's treatment aren't published, so they read "Ask for a price".
- **Deposit:** the site says a non-refundable deposit secures a first appointment and a non-registered patient's emergency appointment; the amount isn't published.
- **Interest-free payment plans** are mentioned once on the site with no details; the page says to ask the dentist.
- **Membership plan:** "Maintenance Plan from £21.97 per month" with an "agreed number" of visits. Plan tiers and children's prices aren't published.
- **Out-of-hours call-out fee £135** ("currently") and "members can claim most of this back" are from the emergency page. Confirm it's current.
- **The letter** is written from the practice's own published welcome and first-appointment text and signed "The team at Polwarth Dental Clinic, led by Dr Ross Saunderson". It is not presented as Dr Saunderson's words. Ask him to approve or rewrite it.
- **Principles 01 to 04** paraphrase the practice's welcome and first-appointment pages ("get to know you personally", "if you understand your dental health, you are more relaxed", "itemised treatment plan and financial estimate", "seeing our patients on time is important").
- **"Dr Mckeachen"** (the previous owner) appears only inside a patient's review, quoted exactly; the practice's history isn't otherwise published.
- **"Same-day emergency appointments, Monday to Friday"**: the site says "we will endeavour to see you on the same day" and "we always endeavour to rectify your dental problem on the day". The page says "we offer same-day emergency appointments" (the practice's own phrase from its welcome page).
- **Who you'll see:** Dr Ross Saunderson provides ClearCorrect aligners (his bio) and the practice also describes Smilelign aligners; Dr Andrew Jeffrey is the implant dentist; Dr Jenny Wylie and Karen Reid have children's dentistry experience. Confirm current roles.
- **Hygiene:** the hygiene page says a hygienist provides it, but the team list has a dental therapist (Karen Reid) and the fee guide says "Hygiene treatment (with therapist)". The page names the therapist.
- **Nurses and receptionist** have "Coming soon" bios, so only names, roles and GDC numbers are shown. Shirley Law (receptionist) has no GDC number.
- **"Alana"**, praised in one review, isn't on the team page, so that review isn't used.
- **Online booking:** some treatment pages link to an Appointmentor patient login. It isn't linked from the main pages and may be for existing patients only, so the example says "phone to book". Confirm before adding a "Book online" button.
- **Before-and-after photos** on the site are one generic pair repeated on every treatment page, so they aren't used (see `CREDITS.txt`).
- **Access:** "we can provide a ramp for wheelchair access … as well as ground floor surgeries" is from the How to find us page.
- **Facts in captions** ("old fireplace", "bay window", "railway posters") describe what's visible in the practice's photos.

Licences: Newsreader © The Newsreader Project Authors and Hanken Grotesk © The Hanken Grotesk Project Authors, SIL OFL 1.1 (`fonts/OFL.txt`). Icons adapted from Feather (MIT). All photos © Polwarth Dental Clinic, used for a sales mock-up (`example/img/CREDITS.txt`).
