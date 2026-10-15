# Results

> Pipeline name: **Results** (folder `templates/practice/results/`). A template for **private and mixed private/NHS dental practices** that do cosmetic and restorative work. It sits beside the **Front Desk** family (task-first, little imagery), **Familiar Faces** (people-led) and **Doorway** (premises-led). When this brief says "Results", it means this template.

**The idea in one line:** answer the patient's tasks first, then *show the outcome*: real before-and-after cases from the practice's own surgery, the patients' own words, a clear 4-step journey and prices in plain sight.

Results is for the private patient who is weighing up veneers, whitening or a bridge and wants proof before they phone. It has to look like a clinic they would trust with their face, and it has to be as honest and usable as NHS.UK. The premium comes from three things: a lightbox that makes clinical photos look intentional, an editorial serif with one italic accent per heading, and restraint everywhere else.

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), then components, including the inner pages. | Tokens only. |
| `results.js` | About 150 lines of plain JS: the phone menu, the before-and-after sliders and the live open or closed status. Reads the hours from the page. | No. |
| `fonts/` | Source Serif 4 (roman and italic, variable weight) and Instrument Sans (variable weight), latin and latin-ext woff2, plus `OFL.txt`. | No. |
| `example/index.html` | The worked homepage for Finesse Dental Care, Paisley. Copy it for each practice. | Yes, for each practice. |
| `example/results.html` | The smile gallery: every case, grouped by treatment, each with a slider and notes. | Yes. |
| `example/treatments.html` | A treatment index with the detail beside it: what it helps with, what happens, how long, "From £". | Yes. |
| `example/finance.html` | Plans, private fees and NHS charges, exactly as published, with last-checked notes. | Yes. |
| `example/img/` | The practice's own photos and `CREDITS.txt`. | Replace for each practice. |
| `PHOTO-SHOTLIST.md` | What to photograph for this template. Doubles as a paid add-on. | Reuse. |

The example links `../styles.css`, `../results.js` and `../fonts/`. Keep that layout: one template folder, one `example/` (or practice) folder inside it. Inner pages share the homepage's header, menu, footer and hours JSON exactly; copy them from `index.html` and move `aria-current="page"` to the right menu item.

## 2. The concept, and why it is different

The owner rejected trend-driven "concept" templates (magazine, hotel and signage pastiches) that put style before the patient. Results starts from the same discipline as Front Desk, then adds the one thing a private patient needs that an NHS service page never shows: **evidence of the work**.

- **Front Desk Dental** is a service page: one typeface, task panel, almost no imagery.
- **Familiar Faces Dental** sells the people: big staff portraits, warm and personal.
- **Results** sells the outcome: a dark "lightbox" for clinical photos, real sliders, case numbers, prices and the journey. It reads as a private clinic, without hiding the NHS route, the phone number or the emergency rule.

What it deliberately does *not* copy from private dental sites: cookie walls, lead-form pop-ups, "special offer" modals, AI chat bubbles over the Call button, auto-rotating carousels, video backgrounds, grey text on cream, and stock models posing as patients.

## 3. Research and the decisions it drives

### From our study of 131 Scottish private dental sites

Source: `prospects/research/private-dental-patterns.md` (12 October 2026). About 4 in 5 "good" private sites are the same few agency layouts; truly custom sites are rare, and that gap is the opportunity. Results uses these patterns from the study:

| Pattern (study number) | How Results uses it | Why |
| --- | --- | --- |
| 3. Proof of results | The hero slider, a 3-case band on the homepage and `results.html` with every case | The strongest signal of competence a private patient can get, and the reason this template exists. Study examples: The Smile Gallery, Snowdrop, Inverleith, EH10. |
| 6. Patient stories | A testimonial in the hero, a dark lead story and two supporting quotes, quoted exactly | Erskine leads with a patient quote. Patients trust other patients more than the practice's claims. |
| 7. Outcome and trust stats | Three figures, only ones the practice publishes (founded 1950, relaunched 2012, 7 published cases) | Stats are persuasive and easy to invent. The rule is "published or nothing". |
| 9. The 4-step journey | Consultation, plan, treatment, aftercare, with real visit counts and times | Inverleith uses a smile journey. Anxious patients need to know what happens next and when they'll know the cost. |
| 12. Finance and plans up front | A calm plans band with "from £x a month", no offers | Snowdrop and Smile Rooms show plans early. Cost worry stops people booking. |
| 4. Transparent "From £" prices | On case cards, treatment entries and the fee guide | EH10 and Westhill do this. A price builds more trust than "affordable". |
| 5. Treatment index with a detail panel | `treatments.html`: a sticky index beside the detail | Glenrothes Dental House. Faster than a grid of identical cards. |
| 8. Nervous-patient section | "Nervous? You set the pace", built from a real patient's words and a staff member's stated experience | Glenrothes. A third of the example's testimonials mention fear. |
| 10. Founder's "why" | The principal's own sentence from her bio, beside a real photo of her at the desk | Crafted Dental uses a founder video. A quote in her words is cheaper and just as honest. |
| 13. Awards, press and professional bodies | A quiet text band: GDC registration, Childsmile, NHS, the plan provider | No logos to licence, nothing invented. Add awards only if the practice has them. |
| 1. Editorial type with an italic accent | Source Serif 4 headings with one italic word in the brand colour | The study's most distinctive sites (Glenrothes, EH10, Crafted). Used once per heading, never in body text. |
| 2. The room as the brand | The practice's waiting room (bay window, chandelier) and building, not stock interiors | Real rooms beat stock smiles. |

Not used: 11 (smile tools need a backend; link to a consultation instead) and 14 (Instagram feeds and WhatsApp buttons add trackers and clutter).

### From the NHS research we follow

| Decision | Source |
| --- | --- |
| The first screen on a 390px phone holds the live status, an h1 that says what and where ("Private and NHS dentist in Paisley"), what's offered and how to pay, the Call button with the number, and the start of the emergency box. The slider comes right after. | NHS England's GP website guide (patients arrive with a task); NHS service manual (confirm you're in the right place; headings describe content). |
| No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play or map embeds. The example sets no cookies, so it needs no banner. | 27% of research participants were stopped by overlays (study, "What to avoid"). |
| Plain English at reading age 9 to 11, sentences under 20 words, "9am to 5pm", verb-first links. | NHS service manual content guide. |
| Emergency route in the hero and a full care card: when open, when closed (our patients, everyone else), life-threatening. 111 and 999 as text. | NHS.UK care cards; NHS inform: out of hours, phone NHS 24 on 111. |
| NHS charges quoted from NHS inform with the date and a link. | nhsinform.scot (charges from 1 November 2025, page updated 27 July 2026). |
| NHS.UK-style yellow focus on every link and control. | NHS.UK frontend focus pattern. |

Sources: [NHS service manual](https://service-manual.nhs.uk/), [NHS England: improving GP website online journeys](https://www.england.nhs.uk/long-read/step-by-step-guide-to-improving-general-practice-website-online-journeys/), [NHS inform: receiving NHS dental treatment in Scotland](https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/receiving-nhs-dental-treatment-in-scotland/).

## 4. Rules (every build, no exceptions)

1. **Never invent facts.** Every price, plan, case, stat, award, review, name, GDC number, hour and policy comes from the practice's current site, its leaflets, its NHS listing or the job card. No online booking, finance, offers, "years of experience", star ratings or results the practice hasn't published. If something is unclear or looks out of date, write "Phone to check" or "Ask for a written estimate".
2. **Before-and-after photos are the practice's own,** published by the practice, and the live site needs each patient's **written consent** for web use (section 10). Crop them; never retouch, recolour, straighten teeth or swap backgrounds. Never pair a named testimonial with a case photo unless the practice confirms it is the same patient and they consented to both.
3. **The first screen on a 390px phone** shows: the status pill, the h1 ("[Private / NHS / Private and NHS] dentist in [Town]"), the lead (what's offered, how to pay), the Call button with the number, and the start of the urgent line. The header Call button is always visible.
4. **No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play video or third-party scripts.** Link to Google Maps. If you must embed a map, give the iframe `tabindex="-1"` and put a "Get directions" text link beside it.
5. **Accessibility is WCAG 2.2 AA.** Text contrast 4.5:1 or more, including on the dark lightbox (tokens are pre-checked). Never put text straight onto a photo: the Before and After tags sit on solid pills. Visible focus everywhere, a skip link, one h1, headings in order, tap targets of 44px on phones (`.inline-tap` for small links), keyboard-operable sliders and menu, reduced motion respected, reflow at 320px and 200% text.
6. **111 and 999 are plain text.** Full numbers are `tel:+44…` links.
7. **Images:** inline SVG for icons and the logo mark (never `<img src=".svg">`). Photos as JPEG, `width` and `height` set, `srcset` at two sizes, `loading="lazy"` below the first screen. Never stock or AI-generated people.
8. **Performance:** fonts self-hosted, no CDN. No framework, no build step. Homepage under 1.2 MB on desktop and 800 KB on a phone.
9. **No smooth scrolling.** `scroll-behavior: smooth` breaks the audit's anchor check and the viewport tool's lazy-image scroll. Leave it out.

## 5. Writing rules

- "You" and "we", active voice, sentences under 20 words, 1 to 3 sentence paragraphs.
- Times `9am`, `12:30pm`, `midday`. Ranges with "to". Prices as published: "From £350", "£150 one arch".
- Plain word first: "Single-visit veneers (Componeers)", "Root canal treatment".
- Links start with a verb and say where they go: "See all 7 cases", "Compare the plans".
- No promises: never "pain-free", "perfect smile", "guaranteed". Every result block says results vary.
- Quote testimonials exactly, with the name as published. You may quote whole sentences from a longer testimonial; don't splice or correct words. Skip a quote rather than fix it (the example skips one with a doubled word).
- Use curly apostrophes and quotes (’ “ ”). One italic accent word per heading, at most.

## 6. Homepage structure

Sections are `<section class="section …" id="…" aria-labelledby="…">` wrapping `.wrap`. Grounds alternate so the page has rhythm without decoration.

1. **Icon sprite** (`svg.sprite`), then the **skip link**.
2. **Header** (`.site-header`, sticky). `.brand` (inline SVG mark + two-line wordmark), `.header-meta` (address, 72em and up), `.header-call` ("Call" on phones, the number from 40em), `.menu-toggle` (below 64em). Then `nav.nav#site-nav` with **7 or fewer** items: Results, Treatments, Fees and plans, New patients, Our team, Emergencies, Hours and contact.
3. **Hero** (`.hero`, page ground). Left: `.status` (live), `h1` with one `em.accent`, `.hero__lead`, `.btn-row` (Call, "See real results"), `.urgent-line`, `.hero-quote` (one short real testimonial). Right: `figure.hero-case` (lightbox) holding one `.ba[data-ba]` slider, the treatment name, "From £" if published, and a caption.
4. **How can we help?** (`.quick`): five `.task` links: join, book (`tel:`), toothache (`.task--urgent`), fees, hours (`[data-today-hours]`).
5. **Results band** (`#results`, `.section--lightbox`): section head, `ul.cases.cases--3` of three `.case-card` (static before/after pair, case number, h3, price, one line), `.band-foot` buttons, `.consent-note`.
6. **Stats** (`.stats`, white): three published figures. Drop the section if the practice publishes none.
7. **New patients** (`#new`): `ul.ways` (Private, Plan, NHS, each with one action), then `.split` with the first-visit `ol.steps` and a real interior photo (`figure.place`).
8. **Patient stories** (`#stories`, white): `.stories` with one `.story--lead` (dark, longest real quote) and a `.story-stack` of two. Then `.calm#nervous`.
9. **Journey** (`#journey`, deep): `ol.journey`, four steps, each with a real time.
10. **Plans** (`#plans`, stone): `ul.plans` of three `.plan` (`.plan--featured` on the middle one), a button to `finance.html` and a `.last-checked` note.
11. **Founder and team** (`#team`, white): `.founder` (photo of the principal at work, her own sentence, name, GDC number) then `ul.team` of `.person`.
12. **Trust band** (`.trust-band`): 2 to 5 factual items with icons.
13. **Visit** (`#visit`): second `.status`, `.visit` with the hours card (`table.hours`, `tr[data-day]` can list several days: `data-day="mon tue wed thu"`), address, contact list, getting-here lists, then the `.care-card#emergency` and the building photo.
14. **Footer**, then `script#practice-hours`, then `<script src="../results.js">`.

### The hours JSON

```json
{ "timeZone": "Europe/London",
  "open": { "mon": [["09:00","12:30"],["13:30","17:00"]], "fri": [["09:00","12:30"],["13:30","15:00"]], "sat": [], "sun": [] } }
```

Every day `mon` to `sun` must appear. Split days around lunch. Keep the visible table, the JSON and the JSON-LD in the `<head>` in step. Without JS the pill reads the fallback text you write ("Open Monday to Friday · Closed at weekends").

## 7. Components and how each degrades

| Component | Markup | When the practice lacks the material |
| --- | --- | --- |
| **Before-and-after slider** | `figure.ba[data-ba]` › `.ba__frame` › two `.ba__pane` (before first) + `.ba__handle`; `.ba__controls` with a visible `<label>`, `input.ba__range[type=range]` and two `button.ba__btn[data-ba-show]`. Give every range a unique `id`. | **No before/after photos:** drop the hero slider and the results band. Put a real interior photo in `figure.hero-case` instead (the lightbox frame still works), rename "Results" in the menu to "Treatments", and don't build `results.html`. Never use stock "results". **Only 1 or 2 cases:** keep the hero slider, drop the homepage band, list them on `treatments.html` under each treatment. |
| **Static case pair** (homepage band) | `.ba` without `data-ba`: the two photos side by side. Lighter than a slider. | Show 2 or 3; fewer than 2 → drop the band. |
| **Case numbering** | "Case 01" to "Case 07", the same number on every page. | If cases are added later, append numbers; never renumber. |
| **Price line** | `.case-card__price`, `.price`, `.plan__from` | **No prices published:** write "Ask for a written estimate". Never an invented "from" figure. |
| **Stats** | `ul.stats` | **No published figures:** drop the section. Don't use review counts unless the practice publishes them on its own site. |
| **Patient stories** | `.stories` | **No testimonials:** drop the section and the hero quote; keep `.calm` only if you can ground it in a real staff statement. |
| **Plans band** | `ul.plans` | **No plan:** show "Pay as you go" with the new-patient exam fee, or drop. **Denplan or another provider:** name the provider and link to the practice's own plan page. **0% finance published:** add one `.plan` "Finance" with the exact published terms and representative APR; never "from £x a month" unless the practice prints it. |
| **Founder** | `.founder` | **No photo of the principal at work:** use their portrait from `.team` at 4:5, or drop the photo and keep the quote. **No first-person words:** drop the quote and keep the bio facts. |
| **Interior photos** | `figure.place` | **None:** drop the figure; the `.split` falls back to one column. Offer `PHOTO-SHOTLIST.md`. |
| **Trust band** | `.trust-band` | List only true registrations and schemes. No logos unless the practice supplies them with permission. |
| **Treatments the practice refers out** | A `.treat` entry with "We refer you" | Implants and straightening in the example: say who does them, never imply in-house. |

## 8. Tokens and re-theming

Re-theme by changing only the **Brand** block at the top of `styles.css`. Neutrals, status colours, type and spacing stay fixed.

| Token | Use | Rule | Finesse value and contrast |
| --- | --- | --- | --- |
| `--brand` | The logo colour. Hero-case slider thumb border, quote marks, eyebrow rule, handle, menu underline, plan top edge. | Decoration only on light grounds. | `#00B1F0` (2.5:1 on white; 6.5:1 on `--brand-deep`) |
| `--brand-text` | Links, primary button, icons, accent italics, labels. | 4.5:1 or more on white and `--page`; white text on it 4.5:1 or more. | `#00668E` (6.4:1 on white, 5.8:1 on `--page`) |
| `--brand-text-hover` | Hover and pressed. | About 6 lightness points darker. | `#005475` |
| `--brand-deep` | Journey band, lead story, footer, step numbers. | White on it 7:1 or more. | `#0F2433` (white 15.9:1) |
| `--brand-on-deep` | Links and accents on dark grounds (deep and lightbox). | 7:1 or more on `--brand-deep`. | `#7FD8F8` (9.9:1) |
| `--brand-tint` | Pale ground: nervous callout, today's hours row, labels. | Lightness about 95%. `--brand-text` on it 4.5:1 or more. | `#EAF6FB` (5.8:1) |
| `--accent` | Second logo colour: eyebrows, small labels. | 4.5:1 or more on `--page` and white. If the logo has one colour, use a warm grey like this. | `#58595B` (7.0:1 on white, 6.4:1 on `--page`) |
| `--page`, `--surface`, `--stone`, `--lightbox`, `--on-deep`, `--on-deep-soft`, `--ink`, `--ink-soft`, `--line*` | Neutrals. `--lightbox` is the near-black behind photos. | Don't change. `--on-deep-soft` is 10.5:1 on `--brand-deep`. | |
| `--ok`, `--warn`, `--urgent`, `--focus` | Open, lunch or closing soon, urgent, focus. | Never re-theme. | NHS.UK values |
| `--font-display`, `--font`, `--fs-*` | Source Serif 4 for headings, Instrument Sans for body. | Don't change. | |
| `--radius*`, `--max`, `--gutter`, `--section`, `--tap` | Shape and space. | `--tap` stays 44px. | |

### How to re-theme from a logo

1. Sample the logo colours exactly. The strongest goes in `--brand`.
2. Darken it in OKLCH (keep the hue) until white text reaches 6:1: that is `--brand-text`. Darken again by about 6 points for the hover.
3. For `--brand-deep`, keep the hue and drop to about 20% lightness with low chroma; it must take white at 7:1 or more. Navy-ink grounds suit most dental blues and greens.
4. Lighten the hue to about 80% lightness for `--brand-on-deep`; check 7:1 on `--brand-deep`.
5. `--brand-tint`: the hue at about 95% lightness and very low chroma.
6. Check every pair with a contrast checker, then run the audit. The template's own `results.js` and component CSS need no changes.

## 9. Responsive layout

| Width | What changes |
| --- | --- |
| 320 to 399px | Header: mark, two-line wordmark, "Call", "Menu" on one row (tightened below 25em). Hero stacks: status, h1, lead, Call, "See real results", urgent line, quote, then the slider. Tasks in one column. Cases, ways, plans, journey stack. Team in 2 columns. Fee tables wrap their cells instead of scrolling. |
| 400 to 767px | Tasks in 2 columns from 36em. Team in 3 columns from 36em. |
| 768 to 1023px | Cases, ways, plans and stats in 2 or 3 columns from 48em. The hero is still one column; the lightbox is capped at 42rem so the photo doesn't dominate. Header shows the full number from 40em. |
| 1024 to 1279px | Menu row appears from 64em (no toggle). Hero goes two columns from 60em. Treatments index becomes a sticky sidebar from 64em. Tasks in 3 columns. Visit goes two columns from 60em. |
| 1280px and up | Header address appears from 72em. Results band in 3 columns from 72em. Team in 7 columns. Tasks in 5 columns from 78em. Content max width 76rem. |

Check at 360, 390, 768, 1024, 1280 and 1440 with `viewports.mjs`. Things that break first: the header row at 360 (if the practice name is long, keep a short first word on line one), the hero h1 if the town name is long (it wraps, that's fine), and the task tiles at 1024 (3 columns is deliberate).

## 10. Photos and consent

- **Before-and-after:** the practice's own clinical photos only. For the live site, the practice must hold each patient's **written consent for their photos to appear on the website** (GDC Standards for the Dental Team, principle 3 on valid consent and principle 4 on protecting patients’ information; under UK GDPR, health photos are special category data). Ask the practice to confirm consent in writing for every case before handover. If they can't, drop the case.
- **Cropping:** crop each pair to the same framing (centre on the upper front teeth, 3:2) so the slider lines up. Never retouch, whiten, warp or change backgrounds. Say "cropped, not retouched" on the page.
- **People:** real staff only, with their consent. Never present anyone as staff who isn't. Never use stock or AI-generated people anywhere.
- **Testimonials:** only those the practice publishes, quoted exactly with the name as published.
- **Credits:** list every source URL in `img/CREDITS.txt`.
- Practices short on photos: sell `PHOTO-SHOTLIST.md` as an add-on.

## 11. Pre-handover checklist

**Facts**
- [ ] Every price, plan, case, stat, name, GDC number and hour traces to the practice's site, leaflets, NHS listing or the job card. Unconfirmed facts are listed in your report.
- [ ] Written consent confirmed for every before-and-after case.
- [ ] The phone number checked digit by digit everywhere. `tel:` links use `+44` and no spaces.
- [ ] Hours match in the table, the JSON and the JSON-LD.
- [ ] NHS charges match NHS inform, with the "Last checked" date updated.
- [ ] Plan prices and the fee guide carry their source and a "phone to check" note.

**First screen (390 × 844)**
- [ ] Status pill, h1, lead, Call button and the start of the urgent line are visible without scrolling. Header Call is visible.

**Accessibility and quality**
- [ ] `node pipeline/audit.mjs <url>/example/ <out>` shows 0 blockers, 0 major, 0 minor across all pages.
- [ ] `node pipeline/viewports.mjs` at 360, 390, 768, 1024, 1280, 1440 for every page: no flags, and you've looked at the shots.
- [ ] Tab through: the sliders move with arrow keys, Home and End; the Before and After buttons work; focus is always visible; Escape closes the menu.
- [ ] Turn off JS: each slider shows the two photos side by side with labels.
- [ ] Reduced motion on: nothing animates (the buttons jump instead of sliding).
- [ ] 200% zoom at 320px: no sideways scrolling.

**Performance and licences**
- [ ] Homepage under 1.2 MB desktop, 800 KB phone, after scrolling to the bottom.
- [ ] No request leaves the site except links patients click. `fonts/OFL.txt` present.
- [ ] Re-run `node pipeline/template-thumbs.mjs` after any template change.

## Inner pages

Every inner page shares the homepage's header, menu, footer, tokens, hours JSON and `results.js`. Move `aria-current="page"` to the matching menu item. Each page starts with a `.page-hero` (or `.page-hero--deep` for the gallery) holding a breadcrumb, the h1 with one accent word, a lead, and optional `.jump` links.

### The example's pages and menu

| Page | Menu item | What it holds |
| --- | --- | --- |
| `index.html` | (home) | Section 6 |
| `results.html` | Results | Seven cases in five `.case-group`s (veneers, single-visit veneers, whitening, repairs, bridges). Each `article.case` has a slider and `.case__notes` (case number, h3, `dl` of what it helps with, visits, cost, one line). Consent note, then a "Thinking about treatment?" call to action with a surgery photo. |
| `treatments.html` | Treatments | `nav.treat-index` (sticky from 64em) beside `.treat-group`s of `article.treat`: name, price, one-line description, `dl.treat__facts` (what it can help with, what happens, how long, link to the case). Includes the treatments the practice refers out. |
| `finance.html` | Fees and plans | Plan cards, a table per plan, what's covered and not, how to join, "good to know"; the private fee guide table; NHS charges (three `.cost` cards and a table from NHS inform); "Paying for larger treatment". |

### Inner-page patterns (copy exactly)

- **Tables** sit in `.table-wrap[tabindex="0"][role="region"][aria-labelledby]` so a wide table can scroll and keyboard users can reach it. Captions carry the source.
- **Last-checked notes** (`.last-checked`) under every price block: the source, the date and "phone to check".
- **Jump links** (`ul.jump`) only when a page has three or more sections.
- **Inline small links** get `.inline-tap` (44px tap height on phones without opening up the line).

## 12. The worked example: Finesse Dental Care, Paisley

**Why this practice:** graded Average ("Dated template with washed-out photo hero, phone only in top bar, no booking button"). It is mixed NHS and private, publishes **seven before-and-after cases** from its own surgery, a 2024 private fee guide with "From £" prices, three monthly plan leaflets with prices, eight written testimonials, a full team page with GDC numbers, and real photos of its sandstone building, bay-window waiting room and surgeries. That is every ingredient Results needs, with nothing to invent.

Runners-up checked: Whitburn Dental Centre (real clinical before/afters and reviews, but fewer practice photos and no team photos), Windmill Dental Care, Motherwell (strong team photos, one before/after), Stirling Dental Practice (five case photos, very little else), Forth Valley Smile Design (lovely people photos, no results), Greenlaw Dental Care (professional team shoot, no results), Tooth Plus and Turriff (stock-heavy).

**Sources (crawled 12 October 2026):** finessedental.co.uk home, team, testimonials, fees (Fee Guide 2024), dental plans and the three plan PDFs, treatment photos, practice photos, every service page, emergency, first visit, location, news (January 2026). NHS charges from NHS inform (page updated 27 July 2026, charges from 1 November 2025).

**Judgement calls and unconfirmed facts:**
- **Consent for the seven cases** is not stated on the practice site. The photos are published by the practice; written consent for web use must be confirmed before going live.
- **Whether the practice is taking new NHS patients** isn't stated. The site shows a "New patients welcome" badge and the January 2026 newsletter says new patients should get in touch. The page says "Phone to check if we can take you on the NHS right now". NHS inform's listing could not be read (it blocks automated access).
- **Plan prices** come from leaflets created in April 2021 that say "prices correct at time of print". Shown with "Phone to check current prices".
- **The Standard Plan's "10% discount on many treatments"** (leaflet) doesn't match the fee guide, where the Standard Plan column shows the same fees as private. Both are shown as published; confirm with the practice.
- **Private fees** are from the "Fee Guide 2024". The emergency appointment has no plan price in the guide, so the page says "Phone to check".
- **Lunch closure** (12:30pm to 1:30pm) is listed once for the week; applied Monday to Friday. Confirm Friday.
- **"Appointments outwith above hours with prior arrangement"** is shown as "Appointments outside these hours can be arranged in advance".
- **The practice's own NHS page** still shows 1 November 2018 NHS charges and "under 18" free treatment; not used. NHS inform's current charges and "under 26" are used instead.
- **Componeers, single-tooth whitening, the front-teeth restoration and the fibre bridge** have no listed price, so they say "Ask for a written estimate". The fibre-bridge "about half the fee of a conventional bridge" is the practice's own wording.
- **"Case 06: front teeth restorations"** is all the practice says about that case; the page doesn't guess the treatment.
- **Teena Viju Kovoor's role:** her bio says she is "an overseas qualified dentist and a registered dental hygienist"; shown as "Dental hygienist". Her anxious-patient line is from her bio.
- **Folashade Adeyole's GDC number** is blank on the source, so none is shown. **Shilpa Balachandran** is shown as on maternity leave, as the site says (March 2026).
- **Denplan:** the site footer shows a Denplan logo but no Denplan details; not mentioned. Confirm.
- **The out-of-hours plan line (0808 169 8117)** is as published on the emergency page under "Practice Plan".
- **"Treating generations of Paisley patients since 1950"** paraphrases the homepage ("the privilege of treating successive generations of patients since 1950").
- **The 999 line** is standard NHS advice, not a practice claim.
- **The hero testimonial (Kevin)** and the veneers case beside it are not the same patient; the page doesn't link them.
- **The brand mark** is drawn for the example after the curve in the logo; use the practice's real logo as inline SVG on a live build.
- **Photo resolution:** the waiting-room photo is only 710px wide and the team portraits 218 × 244px on the source. Ask for originals or reshoot.
