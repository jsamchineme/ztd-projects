# Doorway

A photography-led website template for UK dental practices (NHS, private or mixed), adaptable for GP surgeries.

**The idea in one line:** see inside before you visit. The homepage does the patient's jobs first (call, join, toothache, open now, costs). Then it walks a nervous patient through the visit with real photos of the practice, in the order they'll see each place: the car park, reception, the chair and the people.

Doorway sits beside the approved "Front Desk" family (`uk-dental`, `uk-gp`, `uk-local`). It keeps their discipline: tasks first, plain English, live status, NHS patterns and no pop-ups. Front Desk is deliberately light on imagery. Doorway makes the practice's own photographs the second thing on the page, and gives every one a job: **orientation** (recognise the building, find the door) or **reassurance** (this is the room, these are the people). No photo is decoration.

Worked example: **Family Dental Care East Lothian, Prestonpans** (`example/index.html`).

## 1. Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `styles.css` | The whole design system. Tokens at the top (section 1), then components. | Tokens only. |
| `doorway.js` | About 100 lines of plain JS: the phone menu and the live open or closed status. Reads the hours from the page. No network calls. | No. |
| `fonts/` | Red Hat Display (headings) and Red Hat Text (body), variable woff2, latin and latin-ext, plus `OFL.txt`. About 88 KB in all; a page usually loads only the two latin files (61 KB). | No. |
| `example/index.html` | The worked homepage. Copy it for each practice. | Yes, for each practice. |
| `example/img/` | That practice's photos and `CREDITS.txt`. | Replace for each practice. |
| `PHOTO-SHOTLIST.md` | One-page brief for the practice or a local photographer. Doubles as the paid photo add-on. | Rarely. |

The example links `../styles.css`, `../doorway.js` and `../fonts/`. Keep that layout.

## 2. How Doorway differs from what came before

- **Front Desk (approved):** a task panel and live information, with small faces and almost no photography. Doorway keeps the task rule but answers a different patient need: "What will it be like?" It is for practices whose premises are an asset, and for anxious patients.
- **Haven (rejected):** used a landscape as a mood backdrop, with the practice floating on it in a card. Doorway never shows a photo that isn't the practice. Each photo has a caption that says what it shows and why it matters ("Look for this sign on the timber wall").
- **Atelier and Civic (rejected):** slogans as h1s, magazine type and wayfinding gimmicks. Doorway's h1 is "NHS dentist in [Town]". Its one signature device, the numbered route of four stops, is the content itself, not ornament.

## 3. Research and the decisions it drives

| Decision | Research it comes from |
| --- | --- |
| **The patient's tasks fill the first phone screen:** the live status, the h1, a one-line join answer, a full-width "Call [number]" button, then join, toothache (red edge, with "closed? phone 111") and costs. The header Call button is always visible (sticky). The photo starts below, peeking in at the bottom of a 390 × 844 screen. | NHS England, *Creating a highly usable and accessible GP website* (1.1): "Put all key tasks high up on the homepage… just have tasks and calls to action." Phone number, opening times and registering are among the top tasks. The brief's rule: imagery must never push tasks down. |
| **The first photo is the building, captioned on a solid plate:** "This is us: the timber building on the High Street… next to Lidl. Parking is free." | NHS service manual, *Images*: "Use images only if there is a real user need." Finding the place is a real need for a first visit. The plate (never text on the photo) keeps 4.5:1 contrast whatever the photo. |
| **"See inside, from the car park to the chair":** four numbered stops (Arriving, Reception, The treatment room, The people) on a route line, each with photos, captions and practical answers. | Fear of the unknown drives dental anxiety. Information that sets realistic expectations gives patients a sense of control. In a randomised trial, children who looked at positive dental images for 2 minutes before an appointment had lower anticipatory anxiety than those who saw neutral images (*Viewing positive images of dentistry reduces anticipatory anxiety in children*, University of Dundee; a later controlled trial in 7 to 12 year olds, PMC4335108, found the same). Dental anxiety is common: the Adult Dental Health Survey 2009 found about 1 in 3 adults with moderate anxiety and about 1 in 8 with extreme anxiety (England, Wales and Northern Ireland). |
| **Photos are stacked in a sequence, not shown as a side-by-side gallery or carousel.** On phones every photo is full width, one under another. | NHS service manual, *Images*: in testing, "gallery views (images side by side) confused users"; stack images instead. NHS England GP guide and the brief: no carousels. |
| **Every photo has descriptive alt text and a one-sentence caption that does a different job.** Alt text describes the place for someone who can't see it ("a long, curved desk faced with light wood, under the word 'Reception'"). The caption says what to do with it ("Look for this sign on the timber wall."). | NHS service manual, *Images*: "Images must have text alternatives that describe the information"; captions are "a full sentence ending with a full stop", ideally one sentence, and don't duplicate the alt text. |
| **Each stop pairs photos with facts:** parking, bus, step-free access ("phone to check"), baby changing, number of treatment rooms, digital x-rays, sterilisation. | NHS England GP guide: give practical information plainly. Anxiety research: what reduces anxiety is knowing what will happen, not mood. |
| **Nervous-patient tips appear in context, attributed to the NHS:** tell the team you're nervous (at reception), agree a stop signal (in the treatment room), bring someone (first visit). | NHS dental anxiety advice (NHS Scotland and NHS trust guidance): tell the receptionist and dentist you're nervous; agree a "stop, I need a break" signal such as raising your hand; take a friend or relative; listen to your own music. Placed where the worry happens, not in a separate "nervous patients" page. |
| **The GDC's consent standard is stated and attributed:** "The General Dental Council (GDC) expects every dentist to explain your options and get your consent before treatment." | GDC *Standards for the Dental Team*, principle 3 (obtain valid consent). Stated as the regulator's rule, not a practice promise. |
| **Faces of the people you'll meet** are step 4 of the route, with names and roles as the practice publishes them, plus a link to the GDC register. | Trust comes from real, named people. NHS identity guidance: use real NHS staff, with consent and records kept. |
| **Live status pill** ("Open now until 5:30pm", "Closed now, opens tomorrow at 8am") at the top of the hero and again by the hours table. Today's row is highlighted. | "Are you open?" is a top task (NHS England GP guide 1.1 and 3.5: opening times and phone number visible on the homepage). |
| **Urgent help as three care cards:** when we're open (routine colour), when we're closed (red, NHS 24 on 111), life-threatening (red head, black body, 999). 111 and 999 are plain text. | NHS.UK care card pattern (non-urgent, urgent, emergency). NHS inform: out of hours, phone NHS 24 on 111. |
| **NHS costs for Scotland** as three cards with the official figures and a link to the source. | NHS inform, *Dentist*: free check-ups for everyone; free treatment for under-26s, during pregnancy and for 12 months after, and with income-based exemptions; others pay 80% up to £384 per course. |
| **No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play video or embedded maps.** The video tour is a plain link. | NHS England GP guide 3.12: "27% of participants who visited a site with an overlay as the first thing they saw struggled to get past the overlay, especially on mobile." Also bans accessibility overlay widgets. |
| **The menu button says "Menu"** with a small chevron, not a hamburger icon. Six task-named items. | NHS England GP guide 3.5: avoid hamburger icons on mobile. |
| **Plain English:** reading age 9 to 11, sentences under 20 words, times as "8:45am to 5:30pm". Verb-first links that say where they go. | NHS service manual content guide (*How we write*; *Numbers, measurements, dates and time*: "5pm, 5:30pm, midday"). NHS England GP guide 3.1 and 3.3. |
| **NHS.UK yellow focus** on every link and control. | NHS.UK frontend focus style. |
| **Typeface: Red Hat Display and Text.** Open, humanist shapes, plain numerals (no slashed zero in phone numbers), and a separate display cut so headings feel finished without a second family. Distinct from Front Desk's Figtree, Hind and Atkinson. | NHS.UK uses one sans family at 16 to 19px body. Body here is 17px on phones and 18px from 768px. |

Sources: [NHS service manual: Images](https://service-manual.nhs.uk/design-system/components/images) · [NHS service manual: content guide](https://service-manual.nhs.uk/content) · [NHS England: Creating a highly usable and accessible GP website for patients](https://www.england.nhs.uk/long-read/creating-a-highly-usable-and-accessible-gp-website-for-patients/) · [NHS inform: Dentist](https://www.nhsinform.scot/dentist) · [NHS England identity guidelines: imagery](https://www.england.nhs.uk/nhsidentity/identity-guidelines/imagery/) · [Viewing positive images of dentistry reduces anticipatory anxiety in children (Dundee)](https://discovery.dundee.ac.uk/en/publications/viewing-positive-images-of-dentistry-reduces-anticipatory-anxiety/) · [Effect of exposure to positive images of dentistry on dental anxiety, 7 to 12 year olds (PMC4335108)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4335108/) · Adult Dental Health Survey 2009 (NHS Information Centre) · GDC *Standards for the Dental Team*.

## 4. Rules (every build, no exceptions)

1. **Never invent facts, quotes, reviews or claims.** Every name, role, hour, treatment, policy and number comes from the practice's own site or leaflet, its NHS listing (NHS inform in Scotland, nhs.uk in England) or the job card. If something is unclear, missing or stale, write "phone to check" (styled `.check-note`). Attribute regulator rules to the GDC and patient advice to the NHS.
2. **Tasks first on a 390px phone:** status, h1, join line, Call button with the number, join, toothache (with 111) and costs, all without scrolling. Photos come after. Never put a photo above the tasks on a phone.
3. **Photos must be the practice's own** (or commissioned for it). Never stock, never AI-generated, never someone presented as staff who isn't. No identifiable patients unless the practice holds written consent for website use. See section 8.
4. **No text on photos.** Captions sit on a solid plate or below the photo.
5. **No pop-ups, overlays, cookie banners, chat widgets, carousels, auto-play video, third-party scripts or embedded maps.** Link to Google Maps and YouTube instead. If a map must be embedded, give the iframe `tabindex="-1" aria-hidden="true"` and put a text "Get directions" link beside it.
6. **WCAG 2.2 AA:** text contrast at least 4.5:1 (3:1 for 24px and up, and for control borders). Visible focus everywhere. A skip link, `header`, `nav`, `main`, `footer`, one `h1`, then `h2` and `h3` in order. Tap targets at least 44 × 44px, including footer, inline (`.inline-tap`) and contact links. Keyboard only works; the menu toggle has `aria-expanded` and `aria-controls`, and Escape closes it. `prefers-reduced-motion` turns off transitions. Text at 200% and a 320px screen don't scroll sideways.
7. **Short numbers (111, 999) are plain text.** Full numbers are `tel:+44…` links without spaces.
8. **Icons and marks are inline SVG** (the sprite at the top of the body), never `<img src=".svg">`. A practice logo can be a PNG at 3× display size, or inline SVG.
9. **Performance:** self-hosted fonts (no Google Fonts or any CDN, for GDPR), plain HTML, CSS and JS, no framework or build step. Photos are progressive JPEG at quality 72 to 78, at 480px and 720 to 1200px wide with `srcset`, `width` and `height` set, and `loading="lazy"` on everything except the first photo (`fetchpriority="high"`). Budgets: under 1.2 MB on desktop, under 700 KB on a phone.
10. **NHS facts come from the official source,** quoted plainly, with a link to it.

## 5. Writing rules

- "You" and "we". Active voice. Sentences under 20 words. Paragraphs of 1 to 3 sentences.
- Times: `8am`, `5:30pm`, `midday`. Ranges: "8:45am to 5:30pm", "Monday to Friday".
- Captions: one full sentence with a full stop. Say what to notice or do ("Look for this sign on the timber wall."). Don't repeat the alt text.
- Alt text: describe the place for someone who can't see it: what it is, where things are, colours and materials that help recognition. Don't start with "Image of". Leave headshots `alt=""` when the name is printed beside them.
- Links start with a verb and say where they go. External links carry a hidden "(opens in a new tab)" via `.ext`.
- Plain word first, clinical word in brackets: "Braces (orthodontics)".
- Never "pain-free", "state of the art", "best", or anything the patient can't check.

## 6. Homepage structure

Sections alternate white and warm paper grounds. Reuse the class names.

1. **Icon sprite** (`svg.sprite`), then the **skip link** (`.skip-link` → `#main`).
2. **Header** (`.site-header`, sticky). `.brand` (logo mark, name, tagline; the tagline hides below 576px and the logo mark below 360px), `.btn.btn--primary.header-call` ("Call" on phones, the full number from 640px), `.menu-toggle` ("Menu"). Then `nav.nav#site-nav` with 6 task-named items: See inside, Join, Toothache, Costs, Our team, Hours and directions.
3. **Arrival** (`.arrival`, white). Left: `.status[data-live-status]`, `h1` "[NHS / private / NHS and private] dentist in [Town]", `.arrival__lead` (the join answer plus the "look inside" invitation), `ul.tasks` with four `.task` links: `.task--call` (the `tel:` link with the number), join, `.task--urgent` toothache, costs. Right (below on phones): `figure.first-look` with the outside photo and a solid caption plate that names the building, a landmark and parking, plus two links (See inside, Get directions).
4. **See inside** (`#inside`, paper). `.section__head`, then `nav.route` (jump links to the four stops), then `ol.journey` of `li.stop`:
   - `.stop__marker` (number), `.stop__head` (`.stop__kicker` "Step 1 of 4" and an `h3`), `.stop__media` (one or more `figure.photo`, each with `figcaption`), `.stop__body` (a sentence, `ul.facts` with icons, an optional `.tip`, an optional `.arrow-link`).
   - Stop 1, Arriving: the entrance or sign, address, landmark, parking, bus, step-free access.
   - Stop 2, Reception and waiting: the desk and waiting room, facilities, "tell us if you're nervous".
   - Stop 3, The treatment room: the chair (`.photo--tall`), x-ray or equipment, sterilising. Use `.stop__media--pair` for two or three photos. The GDC consent line, the "stop signal" tip and any video tour link.
   - Stop 4, The people (`.stop--people`, `id="people"`): `ul.faces` of `li.face` (photo, name, role), then the nurses-and-receptionists line and the GDC register link.
5. **Join** (`#join`, white). `.grid-2`: a `.card` with `ol.steps` (how joining works) and its buttons, and a `.card` "What to expect at your first visit" with `ul.ticks` and a `.tip`.
   - If the practice isn't taking NHS patients, say so in the hero lead and this card, and link to NHS inform's dentist finder.
6. **Urgent help** (`#emergency`, paper). `.care-cards`: `.care--routine` (when we're open), `.care--urgent` (when we're closed, 111), `.care--emergency` (999).
7. **Costs** (`#costs`, white). `.costs` of three `.card.cost`, then `.costs-note` with the private-price line and the source link. In England, use the nhs.uk band charges.
8. **Treatments** (`#treatments`, paper). `ul.treatments`: an `h3` and one plain line each. Only treatments the source names.
9. **Hours and directions** (`#visit`, white). A second live status pill. `.visit`: the hours `.card` (`table.hours`, one `tr[data-day]` per day) and the Find us `.card` (`ul.contact-lines`, Get directions, and "See the building", which jumps to stop 1).
10. **Footer** (`.site-footer`, brand-deep). Name, one line, address, contact and patient links, the out-of-hours line, and a photo credit.
11. **Hours JSON** (`script#practice-hours`), then `<script src="../doorway.js">`.

### Hours JSON (the single source of the live status)

```json
{
  "timeZone": "Europe/London",
  "open": {
    "mon": [["08:00", "16:45"]],
    "tue": [["08:45", "17:30"]],
    "sat": [],
    "sun": []
  }
}
```

- List every day from `mon` to `sun`. Use 24-hour `HH:MM`. Split a day around lunch (`[["09:00","13:00"],["14:00","17:30"]]`) to get "Closed for lunch". An empty list means closed.
- Keep the visible `table.hours` and the JSON-LD `openingHoursSpecification` in the `<head>` in step with it.
- `doorway.js` works in Europe/London time, writes times NHS style, marks today's row, refreshes every minute and shows "Closing soon" in the last 30 minutes. Without JS, the pill reads the fallback text you write in the HTML ("Open Monday to Friday · Closed at weekends").

### Responsive layout (keep it this way)

Checked at 320, 360, 390, 430, 600, 768, 834, 1024, 1280 and 1440px, and at 200% text on a 320px screen. All breakpoints are in `styles.css`; don't add new ones for a single practice.

**Header**
- Below 1024px: the name, the Call button and the Menu toggle always share one row. `.brand` is `flex: 1 1 0` with `min-width: 0`, so a long practice name wraps inside its own space instead of pushing the buttons onto a second row. Keep `.brand__name` short (the trading name, not the legal one).
- Below 640px the button says "Call"; from 640px it shows the full number. The tagline shows from 576px. The logo mark hides below 360px.
- From 1024px: the menu toggle goes and the six nav links sit in a row under the header bar. With more than six items, or long labels, check 1024px still fits on one row.
- The open phone menu is a full-width list of 48px rows under the bar.

**Hero (`.arrival`)**
- Below 576px: tasks, then the building photo full width.
- 576 to 959px: the tasks run full width, then `.first-look` turns into a row (photo left, caption plate right), so the photo doesn't take over the screen.
- From 960px: tasks left (5fr), photo right (6fr).

**See inside (`.journey`)**
- Below 720px: each stop stacks (heading, photos, answers) at full width.
- 720 to 895px: the photo and the answers sit side by side (1fr 1fr). A `.stop__media--pair` spans the full width with the answers below it.
- From 896px: the desktop layout, with the dashed route line, photos 7fr and answers 5fr.
- `.stop__media--pair` from 600px: the `.photo--tall` sits beside the two stacked photos and stretches to their exact height (it uses `contain: size`, so it never sets the row height). Below 600px the tall photo is cropped square.
- The `.route` jump links: one column below 400px, two equal-height columns to 767px, then one wrapping row.
- `.faces`: auto-fill columns (min 5.5rem on phones, 6.5rem from 480px). Photos never grow past 7.5rem, so the 96px headshots stay sharp. Upload the 192px versions as `2x`.

**Card grids**
- Join (`.grid-2`) and Hours and Find us (`.visit`): one column, then two equal-height columns from 768px.
- Care cards: one column; from 640px "open" and "closed" side by side with "life-threatening" deliberately full width beneath; three columns from 896px.
- Costs: one column; 576 to 1023px each card is a row (figure left, words right); three columns from 1024px.
- Treatments: one column; two from 576px; three from 1152px.
- Footer: one column; from 576px the practice blurb runs full width over two link columns; three columns from 768px.
- Buttons in a card's `.btn-row` grow to fill the row: side by side when both fit, otherwise each full width. Don't set fixed button widths.

**Text**
- Headings use `text-wrap: balance`, and body text `text-wrap: pretty`, so there are no lone last words.
- `.inline-tap` links stay inline, so a full stop after the link never drops onto its own line.
- `table.hours` uses a fixed layout (day column 42%, 46% below 480px). "(today)" sits on its own line under the day name until 1152px.
- Every single-column grid uses `minmax(0, 1fr)`, so nothing pushes the page sideways at 200% text. Keep this if you add a grid.

## 7. Tokens and re-theming

Change only the **Brand** and **Place** blocks at the top of `styles.css`.

| Token | Use | Rule | Example |
| --- | --- | --- | --- |
| `--brand` | The logo colour exactly. Decoration only (nav hover underline). | Never text. | `#36ACC6` (2.7:1 on white) |
| `--brand-text` | Links, buttons, icons, the Call task, cost figures. | 4.5:1+ on white, `--paper` and `--brand-tint`; white text on it 4.5:1+. | `#0A6577` (6.7:1) |
| `--brand-text-hover` | Hover and pressed. | Darker than `--brand-text`. | `#074F5D` |
| `--brand-deep` | Caption plates, step markers, routine care card, footer. | White on it 7:1+. | `#0D3640` (13:1) |
| `--brand-on-deep` | Links and headings on `--brand-deep`. | 4.5:1+ on `--brand-deep`. | `#9ADDEB` (8.6:1) |
| `--brand-tint` | Task icon circles, today's row, labels. | Lightness about 95%. | `#E5F3F6` |
| `--place` | **A warm colour sampled from the practice's own photos** (cladding, a feature wall, the chair). Used for the route line, eyebrow rules and caption rules, so the page picks up the building. | Decoration only. | `#C08A4E` (the larch cladding) |
| `--place-text` | Small labels ("Step 1 of 4", "phone to check"). | 4.5:1+ on white and paper. | `#85511F` (6.6:1) |
| `--place-tint` | The ground of `.tip` notes. | Light. Ink on it 7:1+. | `#F6EDE1` |
| `--ink`, `--ink-soft`, `--paper`, `--surface`, `--line`, `--line-strong` | Neutrals. | Don't change. | |
| `--ok`, `--warn`, `--urgent`, `--urgent-deep`, `--urgent-tint`, `--focus`, `--focus-ink` | Fixed meanings. | Never re-theme. | NHS values |
| `--font-*`, `--fs-*`, `--lh-*`, `--measure` | Type. | Don't change. | Red Hat |
| `--radius`, `--max`, `--gutter`, `--section`, `--tap`, `--photo-ratio` | Shape and space. `--gutter` is in px so 200% text keeps its room. | `--tap` stays 44px. | |

### How to re-theme for a new practice

1. Sample the logo's main colour from the file (not by eye) for `--brand`.
2. Make `--brand-text` the same hue, darkened until it reaches 5:1 or more on white. Make `--brand-deep` the same hue at about 15% lightness, and `--brand-on-deep` the same hue at about 80%.
3. Pick `--place` from the strongest warm or characteristic colour in the practice's best outside or reception photo. Darken it for `--place-text` until it reaches 4.5:1 on `--paper`. If the photos are all white and grey, use a muted version of the brand's second colour.
4. Check every pair with a contrast checker (the example's ratios are in the table). Special cases:
   - **A red or pink brand:** keep `--urgent` as NHS red, and use a neutral `--brand-deep` so care cards still stand out.
   - **A very light or yellow brand:** `--brand-text` will be muddy. Use a dark neutral of the same hue.
5. Logo: crop the practice's mark (not its full lockup) as a PNG at 3× the display height, or use inline SVG. The name is live text beside it.

## 8. Photo rules

**Purpose first.** Each photo must help a patient recognise a place or know what to expect. If it does neither, leave it out. Order follows the visit: outside → entrance → reception and waiting → corridor or stairs (if any) → treatment room → equipment the patient will notice → people.

**Consent and privacy**
- **Staff:** use a photo of a person only with their written consent for website use, kept by the practice (NHS identity guidance: real people, with consent and records kept). Headshots: name and role exactly as the practice publishes them. If a group photo is old and you can't confirm the people still work there, don't caption it as "our team" (the example leaves one such photo out).
- **Patients:** no identifiable patients without the practice holding written, specific consent for website use, which they can withdraw. Prefer staff or volunteers in the chair. Treat the backs of heads, reflections, screens and paperwork with care: no patient names, records, x-rays labelled with a name, or appointment books in shot.
- **Children:** only with a parent or guardian's written consent, and never with a name.
- **Copyright:** use the practice's own photos (it owns them or has a licence) or commissioned ones. Record the source of every file in `img/CREDITS.txt`.

**Alt text:** describe the place for someone who can't see it, in one or two sentences: what it is, then what helps recognition (materials, colours, signs, layout). Write any words that appear in the photo ("the word 'Reception' on the wall"). People: what they're doing, not what they look like, unless it helps (uniform colour). Headshots next to a printed name get `alt=""`.

**Technical:** 3:2 landscape for most photos (`--photo-ratio`), 4:5 on phones and 6:11 on desktop for `.photo--tall`. Export at 480px and up to 1200px wide, progressive JPEG quality 72 to 78, sRGB, metadata (including GPS) removed. Headshots: 5:6 crop, 96px and 192px wide.

**The shot list** in `PHOTO-SHOTLIST.md` is written for the practice or a local photographer, and can be sold as an add-on.

## 9. Fallback: when a practice has only a few photos

Doorway still works with no photos at all. It never uses stock, silhouettes, illustrations of people or empty placeholders.

| What the practice has | What to do |
| --- | --- |
| **Everything** (outside, reception, a treatment room, headshots) | The full layout, as in the example. |
| **Outside only** | Keep `figure.first-look` with the photo. Mark the four stops `.stop--text` and remove their `.stop__media`. The facts lists spread into two columns on desktop. Change the journey intro to "What to expect, from the car park to the chair", without "real photos". |
| **A few inside photos, no outside** | Use `figure.first-look.first-look--text` (remove its `img`): the dark plate keeps its place and gives the building name, landmark and parking as large text. Put the inside photos in their stops; other stops get `.stop--text`. |
| **No headshots** | Use `ul.faces.faces--names` and remove the `img`s: names and roles as a tidy list with a warm rule. Keep the GDC link. |
| **A video tour but few stills** | Use a still from the practice's own video for that stop (as the example does for the treatment room), say so in the caption, and link to the video. Never embed it. |
| **Nothing at all** | All of the above. The page is still a complete, task-first Front Desk-grade site, with a clear upsell: the photo shot list. |

The example's treatment-room photo is a frame from the practice's own YouTube tour, so it is soft. That is the fallback working as intended, and a reason to sell the shoot.

## 10. Adapting Doorway for a GP practice

The same "see inside" logic helps GP patients who are anxious, autistic, have a learning disability or are new to the area. The tasks change; the route stays.

1. **h1:** "GP surgery in [Town]". Lead: how to contact the practice today (phone and online form, with the times each is open).
2. **Tasks (5 to 6, verb-first):** Request an appointment (`.task--call` for the phone; a second task for the online form), Order a repeat prescription, Get test results, Get a fit note, Register with us. Keep the urgent task: "Need help now? When we're closed, phone 111" (in Scotland, NHS 24 on 111).
3. **The route:** Arriving (entrance, parking, step-free access, the accessible toilet), Reception and the self check-in screen, The waiting room (how you'll be called: screen, name or both), A consulting room, The people (GPs with GMC numbers, nurses, practice manager, care navigators). This also serves as an easy-read "visiting the surgery" guide.
4. **Care cards:** replace the dental content with "Phone 111 if you need help urgently and we're closed" (urgent) and "Call 999 if someone is seriously ill or injured, or their life is at risk" (emergency).
5. **Menu, 7 items or fewer:** Appointments, Prescriptions, Test results, Register, See inside, Opening hours, Contact us.
6. **Drop:** NHS dental costs and treatments. Add the practice boundary to Register.
7. **Photo privacy is stricter:** never photograph a waiting room with patients in it, screens showing names, or noticeboards with personal details. Shoot before opening.
8. Point Scottish practices to NHS inform and English practices to nhs.uk. Check against the NHS England GP website benchmark before handover.

## 11. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the practice's site or leaflet, its NHS listing or the job card. Anything unclear says "phone to check". List what you couldn't confirm in your report.
- [ ] The phone number is checked digit by digit in the header, tasks, join card, care card, Find us and footer. `tel:` links use `+44` and no spaces.
- [ ] Hours match in the visible table, the hours JSON and the JSON-LD.
- [ ] NHS cost figures match the current NHS inform (or nhs.uk) page, and the link works.
- [ ] Names and roles match the practice's own team page. GDC numbers only if checked on the register (the example leaves them out because two sources disagree for one dentist).

**Photos**
- [ ] Every photo is the practice's own or commissioned, and is in `img/CREDITS.txt` with its source.
- [ ] No identifiable patient without written consent. No patient data in shot. Every person shown is (to the practice's knowledge) current staff, or not presented as staff.
- [ ] Every photo has descriptive alt text and a one-sentence caption that doesn't repeat it.
- [ ] No text sits on a photo.
- [ ] The fallback classes are used where photos are missing. No empty frames or placeholders.

**First screen (390 × 844 phone)**
- [ ] Status pill, h1, join line, the Call button with the number, join, toothache (with 111) and costs are visible without scrolling. The header Call button is visible.
- [ ] Check the live status at an open time and a closed time (and lunch, if any).

**Accessibility and quality**
- [ ] `node pipeline/audit.mjs <url> <out>` gives 0 blockers, 0 major and 0 minor.
- [ ] Tab through the page: focus always visible, the skip link works, the menu opens with Enter and closes with Escape.
- [ ] 200% text and a 320px screen: no sideways scrolling, nothing cut off.
- [ ] Reduced motion on: nothing moves.
- [ ] One h1, then h2s, then h3s.

**Performance and licences**
- [ ] Desktop under 1.2 MB and phone under 700 KB after scrolling to the bottom (the example: about 350 KB desktop, 300 KB phone, 420 KB on a 3× phone).
- [ ] No request leaves the site except links patients click.
- [ ] `fonts/OFL.txt` is present. `<title>` and the meta description name the practice, the town and NHS or private.

## 12. The worked example: Family Dental Care East Lothian

**Why this practice:** graded Average in the prospect data (a dated 2013 tile layout, small text, no tappable phone, no booking route), in Prestonpans (M to Z). Its own site holds the best real premises photography of the candidates checked (about 40 M to Z practices graded Bad or Average, 3 shortlisted in depth): a distinctive purpose-built timber building with its car park, the sign, a bright reception, the sterilising room, digital x-rays, plus 14 current headshots and a video tour of a treatment room. Its own words ("10 beautiful, bright, sunny… surgeries", "a large, comfortable waiting area… works of art from local art groups") show it already wants to show off the building. The current site hides all of this behind "Find out more" tiles.

**Sources used:** familydentalcareeastlothian.co.uk (home, about, services, emergency dentistry, facilities, team, contact and register pages), the practice leaflet PDF on that site, the practice's YouTube tour, and its NHS inform listing (hours confirmed, last updated 30 May 2025).

**Judgement calls and facts to confirm with the practice:**
- **Free parking, next to Lidl, close to a bus stop** come from the leaflet; "on a main bus route, ample parking" from the facilities page.
- **Step-free access and disabled parking** are not stated anywhere: shown as "phone to check".
- **Emergency:** the site and leaflet say registered patients should phone first thing in the morning and will be seen within 24 hours, and that out of hours the practice phone gives the emergency dental service number. Quoted as the practice's own policy. Confirm it's current.
- **First visit:** the printed estimate, paying before treatment (cash, debit or credit card) and 24 hours' notice to cancel come from the leaflet, which is older than the website (its staff list differs). Payment is marked "phone to check".
- **Joining:** the site's form says you join a queue and reception will contact you. The waiting time isn't published: "phone to check how long the wait is now".
- **Treatments:** from the services page. White fillings and fluoride or fissure sealants come from the leaflet. Facial aesthetics and Invisalign (leaflet only) are left out as possibly stale.
- **Orthodontics:** the leaflet says "specialist orthodontic care"; the page says "Our orthodontist works here" and avoids the protected word "specialist" without a GDC specialist-list check.
- **GDC numbers** are left out: the website gives Charles Crummey's as 52345 and the leaflet as 49922. Link to the register instead.
- **Photo dates:** the building, reception and facilities photos were uploaded in December 2013. The sterilising photo shows two nurses who are not named or described as current staff. A reception-desk group photo and a photo of a patient are deliberately not used.
- **NHS 24 for unregistered patients:** from NHS inform ("contact NHS 24"). The 999 line follows NHS urgent-care advice (swelling affecting breathing or swallowing, bleeding that won't stop).
