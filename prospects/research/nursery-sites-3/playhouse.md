# The Playhouse Nursery, Muswell Hill

Studied 14 October 2026, one of the two sites the owner likes. Sources:
- a crawl of 11 pages and 22 blog posts;
- full-page captures, scroll recordings and contact sheets of 12 pages at 1280px and 390px;
- the 66-second tour film and its frame sheet;
- my own Playwright measurements of computed styles, section padding, gutters, words and per-screen density, on the live homepage at 390px and 1280px.

Scratchpad: `playhouse/` (captures) and `spacious/` (my measurements, slices and scripts).

## At a glance
- **Site:** https://www.theplayhousenursery.com/. A single, family-run day nursery at 70 Hampden Road, Muswell Hill, London N10 2NX. It takes children from 6 months to 5 years, 8am to 6pm, Monday to Friday, 51 weeks a year. Phones are 020 8883 2396 and 0777 513 5333 (WhatsApp). Ofsted "Good". It was named a daynurseries.co.uk **Top 20 London 2026** nursery and shows 40 reviews scoring 10.
- **Tech:** Duda site builder, with fonts from Google (Montserrat, Amiko, Source Sans Pro), a reCAPTCHA form, a daynurseries.co.uk review widget and a black cookie bar.
- **Character:** warm, busy and photo-heavy. Its one big asset is a **jungle soft-play room**, which it uses as the hero photo. It is a small owner-run nursery, the closest kind to our prospects.

## Site map
- **Top bar (desktop only),** sunflower yellow: social icons on the left; a phone icon and both numbers on the right.
- **Header:** the logo, then **12 uppercase menu items** separated by thin pipes:
  - Home;
  - Our Rooms, with a hover dropdown to the 3 room anchors;
  - Parents Corner, Settling In, Gallery, Contact, Policies, Recruitment, News & Info, Fees & Food.
- **Phone header:** a yellow hamburger, *and* the same 12 items printed inline under the logo in three rows, so the full menu shows twice. The hamburger opens a sheet with the same list.
- **Floating "ENQUIRE NOW" pill:** teal, fixed at the bottom of the phone screen on every page. It goes to Contact.
- **Footer:** a strip of partner logos (Barnet Safeguarding, Early Years Alliance, Barnet, Tapestry), then the Top 20 badge and a privacy link.

**Page types:**

| Type | Pages | Length (desktop / phone) | Words |
| --- | --- | --- | ---: |
| Home | `/` | 5,464 / 7,120px | about 650 visible, plus about 1,000 hidden in the review slider |
| Rooms | `/classes`, one page with 3 anchors | 2,401 / 3,651px | 431 |
| Topic pages | Parents Corner, Settling In | 2,400 / 3,800px | 330 to 460 |
| Fees & Food | `/Fees-Food` | 2,536 / 4,156px | 541 |
| Gallery | `/gallery` | 8,347 / 10,045px | 0 words, 40+ photos and 1 video |
| Contact | `/contact` | 1,454 / 2,643px | 46 |
| Policies | `/policies`, one page | 14,275 / **28,779px** | **8,466** |
| Recruitment | `/recruitment` | 1,442 / 2,559px | 59 |
| News list and posts | `/blog`, 22 posts | 2,600 / 7,900px | newsletters, closures, funding updates |

## Page layouts
Every inner page follows the same pattern:
1. A **photo banner with a scalloped cloud edge** at the bottom: white cloud bumps over the photo. Several banner photos look like stock (children at a table with toy animals, a parent reading to a toddler, play-dough on a table).
2. A **centred small-caps heading** (Amiko 25px, grey `#888888`).
3. **Long centred paragraphs,** sometimes justified, at 14 to 15px in grey. Even the bullet lists are centred.
4. Sometimes a **photo band with an overlaid heading and a yellow pill** ("We take good care of your child!" then "GET IN TOUCH").
5. **Icon-circle blocks** on Parents and Settling In: a thin yellow outline circle around a line icon (printer, tie, nurse), with a small-caps heading and a paragraph. They are evenly spaced and calm.
6. The partner-logo footer.

**Rooms (`/classes`):** one page with three anchors.
- Each room gets a **large thin-line icon in its own colour:** a yellow bunny for Little Discoverers, a teal owl for Little Explorers, an orange tepee for Little Inventors.
- Each room has a coloured uppercase name, an age line ("2 to 3 years old") and 120 to 160 words.
- A hairline rule separates the rooms. It is the most spacious page on the site: the icon sits alone in about 150px of white space before each room.

**Fees & Food:**
- Session times and prices for consumables (morning £7, afternoon £5, full day £10) and a 10% sibling discount.
- Funded childcare (England's 15 and 30 hours), a Food Hygiene 5 badge, and three **week menus as PDF links,** each beside a circle photo with a black ring.
- The text is all centred and the price lines are tiny (about 11 to 12px in the capture), so it is the densest page.

**Gallery:**
- A 2-column grid of square photos on a phone and 2 or 3 columns on desktop, with an **8px gap** and a full-width photo every few rows. No captions and no groups.
- The photos mix outings, theatre trips, messy play, a police car visit and an Ofsted badge. Most show children's faces.
- One click-to-play video (Chinese New Year, 40 seconds, controls, not autoplay).
- My probe couldn't open a lightbox, and no lightbox showed in the captures.

**Contact:** a white card with a shadow and the heading "Register Your Interest", then:
- a short line, and a form (name, email, phone, child's age, enquiry, a consent tick box, then SUBMIT in yellow);
- the address, email, both phones and office hours;
- a yellow "Call Us" pill, social icons and a second yellow pill.

**Policies:** every policy on one page, 8,466 words and 28,779px on a phone (34 screens). It is the clearest example of the wrong way to give detail.

## The homepage, section by section
Measured on the live site. Phone: 7,120px (8.4 screens of 844px). Desktop: 5,463px (6.5 screens). Visible words: about 650. The welcome alone is 229.

| # | Section | Desktop (1280px) | Phone (390px) | Words |
| --- | --- | --- | --- | ---: |
| 1 | Top bar and nav | Yellow bar, logo, 12 uppercase items in one line | Hamburger, logo, and the 12 items inline in 3 rows (215px) | 30 |
| 2 | **Hero** | Full-bleed photo of the **jungle soft-play room** (orange and green foam, ball pit, zebra, painted sky and parrots), 510px tall. Overlaid "ENQUIRE NOW" (Montserrat 36px, yellow), "FOR A TOUR OF OUR NURSERY", "AGES 6 MONTHS TO 5 YEARS OLD". The bottom edge is a **row of white cloud scallops**. | Same photo, 460px, with the overlaid text wrapping to 4 lines over a busy photo | 19 |
| 3 | **Tour film** | A small **portrait video**, about 170 by 300px, centred, with a teal "ENQUIRE NOW" pill overlapping its bottom edge | About 250px wide, centred | 0 |
| 4 | Award poster | **A designed image full of text** ("We're proud to be one of the Top 20…"): 13 coloured criterion icons, an ethos paragraph and 3 small columns. All the text is inside the image. | Same image, unreadable at 360px | 0 (all in the image) |
| 5 | "Everything families need" | **An image of a 5-icon row:** Garden & outdoor area, Soft play indoor area, Safe drop-off & pick-up, Bicycle parking, Buggy storage. Pale circle icons with 2 small lines each. | Same image, tiny | 0 (in the image) |
| 6 | Badges | Top 20 badge, Ofsted Good badge, Food Hygiene 5 (in a small slider with arrows) | Stacked | 0 |
| 7 | Welcome | "Welcome to The Playhouse Nursery", then 5 **centred paragraphs at 986px wide (about 137 characters a line)**, 15px grey | 360px wide, 14px grey, centred, about 54 characters a line, 2.5 screens tall | 229 |
| 8 | **Home from home** | **50:50 split:** a photo of the role-play corner on the left and a **sunflower-yellow panel** on the right. The heading is in grey caps and the paragraph is **white on yellow (1.5:1)** and justified. | Photo full width, then the yellow panel | 94 |
| 9 | **Indoor & outdoor playground** | 50:50 split reversed: a pale grey panel with right-aligned text, and a photo of staff and children dancing | Stacked | 63 |
| 10 | **Our rooms** | A heading and 2 lines, then **3 photo cards in a row:** a square photo plus the room name in its colour (yellow, teal, orange) on a white strip with a soft shadow | **One card per row, each photo about 450px square:** the most spacious stretch of the phone page | 50 |
| 11 | Reviews | daynurseries.co.uk widget: a score of 10, "40 reviews", 5 cards in a horizontal slider with stars and dates. Serif text, 16px with 16px line height. | One card at a time, 140px tall | about 30 visible |
| 12 | Parent quote | A photo slider (the welcome mural, a "water wall") with one quote overlaid in white | Same | 40 |
| 13 | Logos and badge | Partner logos and the Top 20 badge | Logos stacked at full size (about 900px of logos) | 0 |

### Spacing (computed)
- **Side gutter:** 15px on a phone. On desktop, the content is 986px wide inside a 1280px window (about 147px each side).
- **Section padding:** most rows have 15px top and bottom; the split panels have 30px; Our Rooms has 40 to 80px.
  - The page feels open on a phone mostly because **photos fill whole rows**: the room cards, the split-panel photos and the logos each take a full screen width.
  - Stretches of 230 to 390px with no text are common (photos and blank space). At 1280px the median gap between blocks is 150px.
- **Per phone screen** (my density count): 5.3 text blocks, 4 links and **1.1 boxed elements** on average. Our templates have 7.9 to 10.5 text blocks and 2.3 to 5.6 boxes.
- **Line length:**
  - Phone: 54 characters (fine), but at 14px in `#888888`, centred, and sometimes justified, so the line starts and spacing are uneven.
  - Desktop: **137 characters** in the welcome. Far too long.
- **Line height:** 1.5 (21px on 14px text). The review widget uses 1.0 (16px on 16px), which is cramped.
- **Density:** low on the first phone screen (hero, film), very high in the welcome (2.5 screens of grey centred text), then low again (one photo per row).

## Navigation and how deeper detail is reached
- **The menu is everything:** 12 items at the same level, with no grouping and no priority. Recruitment and Policies sit beside Fees.
- **The homepage barely links onward.**
  - The 3 room cards are the only doors on the page (they go to `/classes#…`).
  - The teal "ENQUIRE NOW" pills all go to Contact.
  - Nothing on the homepage leads to Fees & Food, Settling In or Parents. A parent has to find them in the menu.
- **Inner pages are long and centred,** with no in-page contents list. The rooms are the exception: a dropdown links to their anchors.
- **Detail lives in PDFs** (menus, newsletters) and in blog posts (closure dates, funding updates, term dates).
- **What works:** the floating "ENQUIRE NOW" pill is always one tap away, and the room anchors in the dropdown are a simple "go deeper" pattern.

## Colour, type, shapes, illustration and photography
**Palette** (from computed styles):

| Role | Hex | Note |
| --- | --- | --- |
| Sunflower yellow (top bar, split panel, pills) | `#FFCF38`, `#FAC415`, `#FDCC2D` | White text on it is 1.5 to 1.6:1, a fail |
| Teal (Enquire pill) | `#449198` | Text `#F7F7F7` on it is 3.4:1, a fail for 14px text |
| Light teal (Explorers label) | `#68CCD1` | 1.9:1 on white, a fail |
| Orange (Inventors label) | `#FF8D4E` | Decorative |
| Red (Top 20, accents) | `#FF4530` | 3.4:1 on white |
| Grey text | `#888888` | **3.5:1 on white: every paragraph on the site fails AA** |
| Pale grey bands | `#F4F4F4`, `#F7F7F7` | |

**Type:**
- Montserrat 700 for the hero only.
- **Amiko** for headings: 25px, 400 weight, small caps, wide letter-spacing, grey.
- Amiko 14 to 15px for body text.
- Source Sans Pro as the base font.

The thin, grey, spaced capitals look calm and "boutique", but they are low-contrast and small.

**Shapes and illustration:**
- **Cloud scallops** along the bottom of every banner. The site's one signature shape: soft, childlike and cheap to make.
- **Thin-line icons in room colours** (bunny, owl, tepee). Simple and charming.
- **Thin outline circles** around icons on the topic pages.
- The logo: hand-drawn children holding balloons and a kite under an arched "The Playhouse" word.

**Photography:**
- The real premises carry the site: the soft-play room, the role-play corner, the welcome mural with its arched gate, and the water wall.
- About half the inner banners look like stock.
- Most photos show children's faces. We can't do that.
- The best "no faces" images are the **empty soft-play room**, the **front door** and the **mural**.

## Video and gallery
- **Homepage tour film:** 66 seconds, vertical, **autoplay, muted, looped, no controls,** 42 MB, with a watermark logo in the middle.
  - Its structure is good: brick front and door, then the door opening, then rooms, a piano corner, a home corner, a cot and a reading circle, then a black end card with the logo.
  - Most frames show identifiable children.
  - The film loads on every visit, and there's no way to pause it.
- **Gallery video:** Chinese New Year, 40 seconds, click to play with controls. The right model.
- **Gallery:** one long ungrouped grid with no captions or alt text. It's vivid, but there's no story and no way in (no filters or groups).

## Calls to action and the enquiry flow
- **One action, repeated:** "ENQUIRE NOW" in the hero, on the film, as the floating phone pill and in every page footer. Every one goes to Contact.
- **On Contact:** "Register Your Interest" covers both visiting and applying for a place, so it's one form for everything. The form is short (5 fields and a consent box).
- **WhatsApp** is offered as a contact route (a mobile number). Parents like it, but it raises GDPR questions for a nursery.
- **No booking calendar and no prices on the homepage.** Fees are one menu tap away.

## What's lovely
1. **One idea per row on a phone.** The room cards, the split panels and the photos each take the full width, and the eye rests. This is what the owner reads as "space".
2. **The soft-play room as the hero.** One real, joyful, empty space says "fun" with no child in view.
3. **The cloud-scalloped banner edge.** A gentle, recognisable signature.
4. **Room identity:** each room has a name, a colour and a line-drawn creature, carried from the homepage card to the rooms page.
5. **A single, always-visible action** (the floating Enquire pill).
6. **"Everything families need" as icons** (garden, soft play, drop-off, bike parking, buggy storage). It answers practical questions without paragraphs. It's a great idea, ruined by being an image.
7. **The tour film opens at the front door.** Arriving, the door opening, then inside: a natural story.

## What's weak
1. **Contrast fails everywhere:** grey body text (3.5:1), white on yellow (1.5:1), light teal labels (1.9:1).
2. **Text inside images** (the award poster and the icon row): invisible to screen readers and unreadable on a phone.
3. **A 12-item flat menu,** printed twice on phones.
4. **Long centred paragraphs,** some justified. The desktop welcome runs to 137 characters a line.
5. **Policies on one 28,779px phone page.**
6. **A 42 MB autoplaying film** with no pause button, full of identifiable children.
7. **The homepage gives no route to Fees, Settling In or Parents.**
8. **A review slider** with 1.0 line height. Reviews on a third-party widget with tracking UTM links.

## Borrow this (adapted to our rules)
- **Full-width, one-per-row photo rows on a phone,** each with a single label: rooms, garden, food, the front door. Use empty rooms, details, hands and backs, never faces.
- **A signature soft edge** on page banners. Our version must be a new shape, not waves (Make Waves) or torn paper (Cut and Stick). Playhouse's cloud scallop is an option for one direction.
- **Room identity cards:** the room's real name, its colour and a drawn line icon (animal or object). Reuse the same icon on the room's section of the inner page. Only room names the nursery really uses.
- **"Everything families need" as real HTML:** 4 to 6 practical amenities (garden, buggy park, drop-off, bike rack, cooked meals), each a line icon plus 2 to 4 words. Only amenities the nursery really has.
- **One repeated primary action** ("Book a visit") and a sticky phone bar that never covers content.
- **The front-door opening as the start of the tour film,** with no children: outside, the door opening, the hall, the empty rooms, the garden. Click to play, captions, `preload="none"`.
- **The room dropdown linking to page anchors.** On our inner pages this becomes an in-page contents list.
- **Avoid:** grey body text, text in images, centred long text, flat 12-item menus, one-page policy dumps, and autoplaying long films.
