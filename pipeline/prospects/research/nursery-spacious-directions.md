# Spacious nursery directions: a space brief and four themes

The owner's feedback on our 11 nursery templates (`pipeline/templates/nursery/*`, `nursery/garden-gate`, `nursery/key-worker`):
- "A bit cramped, especially in mobile view."
- "I need more space and sometimes less detail on the home page, with a clear way to go into separate pages to access more details."

He pointed us at two sites he likes. Both are studied in full in `prospects/research/nursery-sites-3/`:
- **The Playhouse Nursery,** Muswell Hill (`playhouse.md`): a single, owner-run nursery. Photo-led, with a jungle soft-play hero, cloud-scalloped banners and one photo per row on a phone.
- **The Sunflower Nursery,** Ilford (`sunflower.md`): a 5-nursery family group. Sky blue, brown and sunflower yellow, intent cards, photo door tiles, and a calm band at the top of every inner page.

This document has two parts:
1. **The space brief:** measurable rules that fix the complaint. They apply to the four new themes and should be applied when we revise the existing 11.
2. **Four theme directions** that take real ideas from both sites without copying them.

Every rule in `nursery-colourful-directions.md` still holds, except where the space brief below replaces it (the homepage word budget, and how the "one scroll" facts are shown). In short:
- no identifiable children;
- no stock, AI or 3D people;
- no invented facts ("phone to check");
- Scottish facts: 1,140 funded hours, plus the council, and Care Inspectorate grades with the date and a link;
- WCAG 2.2 AA;
- self-hosted fonts, no CDNs or trackers;
- no pop-ups or carousels;
- hand-coded SVG illustration with no people.

---

## Part 1. What "cramped" means, measured

I measured the live homepages of both sites and our 11 template homepages with the same Playwright scripts (`scratchpad/spacious/scripts/measure2.mjs`, `density.mjs` and `pads.mjs`) on a 390 by 844 phone.

- A "screen" is 844px.
- **Text blocks** are headings, paragraphs and list items.
- **Boxes** are elements with their own fill or border that are narrower than the screen (cards, pills, chips, panels).

| Homepage at 390px | Length | Screens | Words on page* | Text blocks per screen (average / first screen) | Boxes per screen (average / first screen) |
| --- | ---: | ---: | ---: | --- | --- |
| **Playhouse** | 7,120px | 8.4 | 1,608 (about 650 outside the review slider) | **5.3** / 14 (the inline menu) | **1.1** / 1 |
| **Sunflower** | 6,656px | 7.9 | 848 | **6.0** / 7 | **3.8** / 10 (carousel) |
| Big Table | 17,009px | **20.2** | 1,574 | 8.2 / **15** | 2.9 / **13** |
| Full Stop | 15,002px | 17.8 | 1,341 | **10.5** / 15 | 3.8 / 11 |
| Cut and Stick | 15,948px | 18.9 | 1,420 | 9.3 / 14 | 3.2 / 10 |
| Weatherproof | 14,156px | 16.8 | 1,325 | 8.8 / 15 | 2.3 / 10 |
| Chapter One | 13,920px | 16.5 | 1,169 | 9.4 / 14 | 2.9 / 10 |
| Front Desk Nursery | 9,982px | 11.8 | 978 | **10.5** / 13 | 3.4 / 10 |
| Garden Gate | 13,316px | 15.8 | 1,319 | – | – |
| Key Worker | 11,980px | 14.2 | 1,117 | – | – |
| Sidekick | 7,053px | 8.4 | 414 | 7.9 / 5 | **5.6** / 9 |
| Make Waves | 6,969px | 8.3 | 465 | 8.8 / 9 | 3.9 / 9 |
| Meadow | 6,587px | 7.8 | 374 | 9.1 / 9 | 4.5 / 8 |

\* All visible words, including the header, menu and footer.

### What the numbers and screenshots say
1. **It isn't the padding between sections.**
   - Our median gap between blocks on a phone is 49 to 98px.
   - Sunflower's is 55px, and its sections are 72 to 126px apart (Flatsome's 42px or 84px padding plus a 30px column margin).
   - Playhouse's rows have only 15 to 30px of padding.
   - Both sites use **15px side gutters,** narrower than ours (16 to 18px).
2. **It's how much sits inside each screen.**
   - We put **8 to 10.5 text blocks** on an average phone screen. They put 5 to 6.
   - On the **first** screen we put 13 to 15 text blocks and 8 to 13 boxes:
     - Big Table: a status pill, an eyebrow, a 3-line H1, a paragraph, then a **2 by 2 grid of fact boxes, each with 3 tiers of text** (label, value, sub-note), a grades box, 2 buttons and a 2 by 2 "Already with us?" grid. All in 1.3 screens.
     - Sidekick: a speech bubble, a status pill, an eyebrow, an H1, a paragraph, 2 buttons, then **7 facility pills wrapping over 5 rows.**
3. **Two things side by side on a phone.** Fact boxes, quick links and pills sit 2 or 3 to a row at 170px wide, each with 2 or 3 sizes of text. Both reference sites put **one thing per row** on a phone: Playhouse's room cards are 360px-wide square photos, and Sunflower's intent cards are full width with 30px between them.
4. **Boxes inside boxes.** Our cards hold labels, values, sub-notes and inline links. Theirs hold a heading and one button, or a photo and one label.
5. **Pages are too long.** The 5 "engaging" templates run 14 to 20 screens. The references run about 8, and they would be shorter without their review sliders and logo walls.
6. **Detail on the homepage.** Weekly menus, full grade tables, day timelines, settling-in steps, guarantees, team lists and FAQs all sit on our homepages. Both reference sites push those into inner pages. Their mistake is making the inner pages long and unstructured too (Playhouse's 28,779px policies page, Sunflower's 4,682-word For Parents page).
7. **Small, light text reads as "busy" even when it is short.** Sunflower uses 13px on phones and Playhouse uses 14px grey `#888888`. We already avoid this; keep 18px body text.

So the fix is mostly fewer things per screen, one thing per row, and real doors to inner pages. Padding is the smaller part.

---

## Part 2. The space brief

Every rule is measurable, so `viewports.mjs` screenshots and a density script can check it. "Phone" means 360 to 430px. "Desktop" means 1280px.

### S1. Side gutters
- **Phone:** 24px. Both references use 15px, which is part of why their text feels jammed against the glass. 24px is the minimum, not the default.
- **Tablet** (600 to 900px): 40px.
- **Desktop:** content container 1,120px at most, with gutters of at least 64px. Long text sits in a 640px column inside that.

### S2. Vertical rhythm
- **Section padding** (each of top and bottom): **at least 80px on a phone** and **at least 128px at 1280px**. Token: `--space-section: clamp(5rem, 3.6rem + 5.6vw, 8rem)`.
  - This gives at least 160px between the last word of one section and the first of the next on a phone. Sunflower manages 72 to 126px; we must beat both.
- **Inside a section:**
  - eyebrow to heading: 12px;
  - heading to body: 16 to 24px;
  - body to action: 32px;
  - between groups inside a section: 48px (phone) or 64px (desktop).
- **Hero:** at least 70% of the first phone screen. It may hold only the name, an H1, one sentence, and at most 2 actions (Book a visit, Phone).

### S3. Homepage length and sections
- **Phone length:** 6 screens at most (about 5,000px at 390px). Both references are about 8, and ours run up to 20.
- **Sections:** the hero plus **5 at most**, then the footer. The last of the 5 is always the "Book a visit" band. So there are at most 4 content sections, and one of them must be the doors (S9).
- **Never on the homepage:**
  - weekly menus, the full grade table, the day timeline, settling-in steps;
  - FAQs (not even folded), policies, team lists, bios;
  - review walls or sliders, newsletter forms, partner-logo walls;
  - curriculum essays.

### S4. Homepage word budget
- **120 to 180 visible words in `<main>`.** Hard maximum 200. The header, menu and footer don't count.
  - This replaces the 250 to 350 in `nursery-colourful-directions.md`.
  - Playhouse's welcome alone is 229 words. Sunflower's curriculum block is 232. Those are the blocks that read as dense on the reference sites.
- **Per block:**
  - the hero: up to 25 words;
  - a section's body: up to 30 words;
  - a door label: up to 3 words, plus an optional line of up to 8 words;
  - a fact: up to 8 words.
- **Headings:** H1 up to 8 words; H2 from 2 to 5 words.

### S5. One idea per screen
On a phone, each 844px screen holds:
- **at most 1 H2;**
- **at most 6 text blocks.** The first screen may hold 7;
- **at most 1 primary and 1 secondary action** (a button and a text link);
- **at most 3 boxed elements.** A full-width band doesn't count.

The references average 5.3 to 6 text blocks and 1.1 to 3.8 boxes. Ours average 8 to 10.5 blocks, with 8 to 13 boxes on the first screen.

### S6. Items per row on a phone
- **1 per row** for anything holding more than a 3-word label: cards, facts, doors, intent cards.
- **2 per row** only for **photo-only** gallery tiles or **label-only** door tiles (an icon and up to 2 words, no sub-line).
- **Never 3 per row** on a phone.
- **Pills or chips:** 4 at most per group, never wrapping onto a third line. Sidekick's 7 facility pills over 5 rows is the anti-pattern.
- **Desktop:** at most 3 cards per row. The doors may go to 3 by 2.

### S7. Gaps
- **Between cards or doors:** at least 24px on a phone and 32px on desktop. Sunflower uses 30px. Our 2 by 2 fact grids use about 8px.
- **Between gallery photos:** 12px on a phone and 16px on desktop. Playhouse uses 8px, which reads as a wall.
- **Between list rows** (essentials, contents): 16px, with a hairline divider.

### S8. Text
- **Body size:** 18px on a phone (17px at least) and 19 to 20px on desktop, with line height 1.55 to 1.65.
- **Line length:** **60 characters at most** (`max-width: 60ch`) on every width. On a phone at 18px with 24px gutters it lands at about 38 to 42 characters, which is fine. Playhouse's desktop welcome runs 137 characters a line and Sunflower's curriculum 154.
- **Alignment:** left-aligned. Centre only blocks of 2 lines or fewer. Never justify.
- **At most 3 sizes of text per block** (eyebrow, heading, body). Never stack label, value, sub-note and link inside a box on the homepage.
- **Ink:** body text at 7:1 or better on its ground. Neither reference site's grey or white-on-yellow pairs would pass.

### S9. Summarise on the homepage, expand on inner pages
- **"The essentials":** a single list, **not boxes,** of 5 lines on one band, within the first 2 phone screens:
  - Ages ("From 6 months to 5 years");
  - Hours ("8am to 6pm, Monday to Friday");
  - Funded hours ("1,140 funded hours, with [council]");
  - Places ("Places: phone to check", or the real state);
  - Grades ("Care Inspectorate: [grade summary], [Month Year]", linking to the report).

  Each line is up to 8 words with a small icon. There are no sub-notes. One link closes the list: "All the details →", which goes to Visit and join or Fees and funding.
- **Grades:** the homepage line carries the summary, the date and the report link. **Every** quality theme, with its date and inspector, is shown on the inner page (Our nursery or Visit and join).
- **Every content section on the homepage ends with exactly one door link,** for example "More about food →". No section carries two links.
- **The doors section:** 4 to 6 doors, each one link covering its whole tile (at least 96px tall on a phone, 1 per row, or 2 per row if label-only), to:
  - Visit and join;
  - Fees and funding;
  - Our nursery (rooms and the day);
  - Food;
  - Our team;
  - Parents;
  - Gallery.

  Choose 4 to 6 per nursery. Each door shows a drawing or a photo, a label of up to 3 words and an optional line of up to 8 words.
- **Intent wording** (from Sunflower) may replace plain labels in the doors' *sub-line*, never in the label:
  - "Fees and funding": "What it costs, and help with fees";
  - "Visit and join": "Come and see us".

### S10. Inner-page structure
Every inner page follows the same frame:
1. **The page band** (from Sunflower):
   - an eyebrow naming the section or "Home";
   - an H1 of up to 6 words;
   - an intro of up to 35 words;
   - one action (Book a visit, or Phone);
   - a drawing or photo that differs per page.
2. **"On this page":** a plain list of anchor links, shown when the page has 3 or more sections. Not tabs. On a phone it is a vertical list of up to 7 links, each 48px tall.
3. **Short sections:** each is an H2 and **up to 120 words** of body, plus at most one list, table or image.
   - Long reference material (policies, the full menu, funding rules, FAQs) goes in `<details>` accordions grouped under H3s, or links to PDFs with their size and date.
4. **Total:** up to about 900 visible words per inner page. If a page grows past that, split it into a sub-page with "← Back to [parent]" at the top (from Sunflower).
5. **The end of every page:** a "Next" door to the most likely following page ("Next: Fees and funding →"), then the Book a visit band.
6. **Policies:** a list of policy names, each opening a `<details>` with a 2-line summary and the document link. Never one long page (Playhouse's policies page is 34 phone screens).

### S11. Navigation
- **Menu:** up to 6 items plus a "Book a visit" button. GP-style restraint: Playhouse's 12 flat items, shown twice on phones, are the anti-pattern.
- **Phone menu:** a full-height sheet. One link per row, 56px tall, in the same order as the doors, with Phone and Book a visit at the bottom. No inline menu printed under the logo.
- **A sticky phone bar** (Book a visit and Phone) is allowed. Playhouse's floating Enquire pill is the evidence that it works. It mustn't cover content or focus: pad the bottom of the page by its height.

### S12. Room to breathe: images and colour fields
- **At least about 35% of the phone homepage height** is image, drawing or plain colour field without text.
- **Every 2 screens** carry one full-width image or drawn scene.
- Playhouse's phone page feels open because its photos fill whole rows (the room cards and split panels). Sunflower's feels open because of big empty sky bands around single white cards.

### S13. Actions
- **One primary action wording site-wide ("Book a visit"),** in one colour, everywhere. The secondary action is always "Phone 01xxx xxxxxx".
- Sunflower puts 7 different actions on its homepage. Playhouse puts "Enquire now" everywhere, and that is the better model.

### Checks to add
- **Density script:** text blocks and boxes per 844px screen, plus phone length.
- **Words in `<main>`:** on the homepage only.
- **`viewports.mjs` at all 9 widths:** no row has two text cards side by side under 600px.
- **The rest unchanged:** audit 0/0/0 and a homepage under about 1 MB on a phone.

---

## Part 3. Four theme directions

The four directions must look different from each other and from the 11 we have. So none of them uses these existing signature devices:
- luggage-tag facts, cork noticeboards, full-stop headlines, storybook chapters;
- weather tiles, recipe cards, leaf-shaped corners, torn paper, boxed key-fact rows;
- a posing mascot, highlighted-word headings, clock boxes, a dashed day path;
- wave seams, ringed circle photos, big-number cards, watercolour blobs, one-word photo tiles, pastel room blocks;
- arch frames (Big Table), hi-vis stripes (Weatherproof).

Every direction follows the space brief exactly. Every homepage has the same bones, and only the dressing differs:

> Hero → The essentials → 1 or 2 feature moments → Doors → Book a visit band → Footer

None uses a font from our existing templates. Every font below is under the SIL Open Font License and self-hostable as WOFF2.

All contrast ratios are computed with the WCAG formula (relative luminance). "Decorative" means the colour never carries text.

---

### 1. Open House (`nursery/open-house`): the nursery as a drawn house you walk into

**Concept.** A homely nursery is a house with its doors open. The homepage is a **drawn house front**, cut away like a dolls' house:
- each room of the house is a door to an inner page: the playroom, the kitchen, the garden, the office, the staff room and the photo wall;
- on a phone the house becomes a tall, narrow front: a roof and gable at the top holding the nursery's name, then **one "floor" per section,** so there is one idea per floor and per screen.

It turns "a clear way into separate pages" into the main picture on the page.

**Target nursery:**
- small owner-run nurseries in a house, villa, cottage or converted church hall. This is common across Scotland: Victorian villas in Glasgow's southside, Edinburgh and Perth, and cottages in towns;
- nurseries whose pitch is "home from home" (Playhouse's own phrase);
- 20 to 60 places.

**Homepage on a phone:**
1. **Hero:**
   - the drawn house front (roof, chimney, 4 lit windows), with the name in the gable;
   - H1 "A home from home in [town]" (8 words at most);
   - one line;
   - the **door button** "Book a visit", the house's front door drawn as the primary button, plus a "Phone" link.
2. **The essentials:** 5 lines on the "hall" floor: a cream wall with a skirting line. Each line has a small drawn household icon (a coat peg for ages, the hall clock for hours, a piggy bank for funded hours, a chair for places, a star for grades).
3. **Come in:** one photo of the real front door or entrance, full width in a house-shaped frame (a pitched top). One line, plus "Watch: Come in (1 minute)" if there is a film.
4. **Rooms of the house (the doors):**
   - desktop: the cutaway house, 3 rooms by 2 floors;
   - phone: one room per row as a full-width tile, a drawing of the room on the left and its label and line on the right.
   - Rooms: Our nursery (the playroom), Food (the kitchen), Outdoors (the garden), Fees and funding (the office), Our team (the staff room), Gallery (the photo wall).
5. **Book a visit:** the house at dusk (deep slate), windows lit, a single cream card "Come round for a look", Book a visit and Phone.

**Inner pages and how to reach them:**
- **Pages:** Visit and join, Fees and funding, Our nursery (with the rooms and the day), Food, Our team, Parents, Gallery.
- **Reached by:** the cutaway doors, a 6-item menu and each section's single door link.
- **Each inner page's band** shows **that room of the house** drawn larger (the kitchen for Food, the office for Fees), with a little roofline above the eyebrow. Parents always know which room they're in.
- **Sub-pages** (for example a policy list under Parents) open with "← Back to Parents".

**Signature components:**
- **House-front hero:** an SVG façade in 4 variants (villa, cottage, modern single-storey, hall), recoloured with the nursery's real door colour where it is known from photos.
- **The door button:** primary buttons have a door shape (a slight inner panel line and a round knob). Text links stay plain.
- **Floors:** section boundaries are a floorboard line (a 6px ink rule with tiny nail dots) plus a change of wall tint. There are no wavy or torn edges.
- **The cutaway rooms:** each room is a 3:2 box with a roof or ceiling line, a window and its signature object, drawn in 2px slate lines on a wall tint. The whole tile is the link.
- **Roofline headings:** a small inverted-V roof drawn above each H2's eyebrow.
- **"What's here" icons** (Playhouse's "Everything families need", made as HTML): garden, buggy park, bike rack, cooked meals, a parking or drop-off spot. Only amenities that really exist, each with up to 4 words, on the Visit and join page.

**Fonts:**
- **Sniglet** 800 for the gable name, H1 and H2 (rounded, homely, chunky at a few words);
- **Golos Text** 400 and 600 for body text and the interface (clear, open, good at 18px).

**Palette:**

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `--wall` | `#FBF6EE` | Page ground | Ink on it 12.0:1 |
| `--ink` (slate roof) | `#23324A` | Text, lines | |
| `--brick` | `#A63E2A` | Door button, links | White on it 6.3:1; on wall 5.8:1 |
| `--sage` | `#3F6B50` | Secondary links, icons | 5.7:1 on wall |
| `--muted` | `#5B6475` | Small print | 5.5:1 on wall |
| `--lamp` | `#F4D27A` | Lit windows, highlights | Ink on it 8.8:1 |
| Floor tints | `#F6DCD3` pink, `#DCEBDD` mint, `#FAEBC0` butter, `#DCEAF4` sky | One per floor and per room | Ink on each 9.9 to 10.9:1 |

**Illustration, shape and motion:**
- **Line drawings:** 2px slate, rounded joins, flat tint fills. Households things (pegs, cups, a kettle, a rug, a teddy on a shelf), plants and a cat on the windowsill. No people.
- **Shapes:** pitched roofs, gables, four-pane windows and a door with a fanlight.
- **Motion** (none under reduced motion):
  - the hero windows light one by one (opacity, 120ms apart, once);
  - the chimney smoke drifts slowly (8s loop) with a pause button;
  - doors lift 2px on hover or focus.

**Photo needs and fallbacks:**
- **Needed:** the front of the building or its entrance, one empty room per room, the kitchen or a plate of food, and the garden.
- **Fallbacks:** the drawn house variant and drawn rooms. The template must look finished with zero photos.
- **Never:** faces.

**Copy voice:** a neighbour at the door. Short, warm, second person:
- "Come in and have a look round."
- "This is where lunch happens."

Labels stay plain ("Fees and funding"), and the house metaphor lives in the pictures, not the words.

**Video and gallery:**
- **"Come in"** (from Playhouse's tour film): a click-to-play film that starts outside, then the door opens, then the hall, the empty rooms, the kitchen and the garden. No children. Poster of the front door, captions and a transcript, `preload="none"`.
- **Optional living photo:** the garden or the hall in daylight, phones get the poster.
- **The gallery page is "The photo wall":**
  - groups named for the house's rooms (Rooms, Kitchen, Garden, Artwork) with filter buttons;
  - a 2-column mosaic on a phone with 12px gaps and captions;
  - the homepage carries no strip; the Gallery door shows 1 photo.

**Borrowed:**
- *Playhouse:* "home from home", the playroom as the star, the tour film that opens at the front door, room identity (colour plus drawn object), "Everything families need" icons.
- *Sunflower:* door tiles with "Explore →", the eyebrow band on every inner page, "← Back to" links, building-front photos.
- **How it differs from Garden Gate** (`nursery/garden-gate`): Garden Gate walks through real photos in visit order. Open House is drawn, and its picture *is* the navigation.

---

### 2. Sunny Side (`nursery/sunny-side`): an emblem that opens into the site

**Concept.** Many nurseries are named after a flower, a tree, the sun or a bird: Sunflower, Buttercups, Daisy Chain, Little Acorns, Bluebells, Thistle, Rainbow, Sunshine, Robins.
- Sunny Side draws that **emblem** (never with a face) as the brand, and opens it into the navigation: a **flower of doors**. The centre is "Book a visit", and each petal is an inner page.
- The ground is a wide, calm **sky** with very few words: big, light headings floating in space, as on Sunflower's best screens.
- A tiny **companion** (a bee, ladybird, robin or wren, whichever suits the emblem) appears in exactly 3 places: the hero, the visit band and the 404 page. It is a detail, not a mascot.

**Target nursery:**
- nurseries with a nature or sky name or logo;
- mid-size private and partnership nurseries;
- small groups with 2 to 5 sites. The petals can be the sites.

**Homepage on a phone:**
1. **Hero:**
   - a sky band holding the large emblem (for example a sunflower head of 16 to 20 drawn petals) and the companion;
   - H1 in a light serif, "Sunny days in [town]" or the nursery's real line;
   - one sentence;
   - Book a visit and Phone.
2. **The essentials:** 5 lines on white, with seed-sized emblem bullets. The hours line is shown as the **sun arc** (below).
3. **The intent pair** (from Sunflower): two full-width white cards on sky, 32px apart. Each has one sentence of up to 8 words and one door:
   - "We're looking for a nursery" → Visit and join;
   - "What will they eat?" → Food.
4. **The flower of doors:**
   - desktop: the emblem with 6 petal-shaped links around a centre "Book a visit";
   - phone: the emblem shrinks to a 96px header mark, and the petals become a **stacked list of full-width rounded "petal" cards**, each with a petal-shaped colour mark, a label and a line, one per row.
5. **Book a visit:** a sky band with a faint emblem pattern (from Sunflower's sunflower-pattern band), a single white card, the companion sitting on its top edge, and one action.

**Inner pages and how to reach them:**
- **Pages:** the 7 standard pages. For a group, "Our nurseries" too, with one sub-page per site.
- **Reached by:** the petals, a 6-item menu, the intent cards and each section's door link.
- **Each petal has its own tint,** which becomes that page's band colour, so a parent recognises the page they tapped.
- **Every band** has the eyebrow, H1, intro and a small **"Questions? Phone [number]"** note (from Sunflower's "Want to know more?").

**Signature components:**
- **The flower of doors:** petals are `<a>` elements in a CSS radial layout on desktop. They fall back to a plain list, which is what phones and screen readers get.
- **The sun arc for hours:** a thin drawn horizon with a half-sun arc. The opening time sits at the left foot and the closing time at the right. Days and the year pattern (for example 51 weeks) sit underneath in text. Only real hours.
- **Petal cards:** full-width cards with a 28px radius on one corner and 8px on the others, like a petal, each in its page tint.
- **Light display headings:** a large serif at regular weight, generous space around it, 2 to 5 words.
- **The meal schedule** on the Food page (from Sunflower's timetable):
  - time pills (Breakfast 8:00, Lunch 11:45, Tea 3:15) beside each day's food, with allergens in bold;
  - phones get one day per block, never a sideways-scrolling table.
- **Group nurseries:** building-front photo cards with the street name, one per row on a phone.

**Fonts:**
- **Young Serif** 400 for H1, H2 and the emblem name (a warm, old-fashioned garden-catalogue serif);
- **Plus Jakarta Sans** 400 and 600 for body text and the interface (open and modern, good at 18px).

**Palette** (the sunflower variant; the emblem swaps the accent):

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `--sky` | `#D7EEF5` | Bands | Soil on it 10.4:1 |
| `--paper` | `#FFFFFF` | Cards, page | Soil on it 12.6:1 |
| `--soil` (ink) | `#4A2C20` | All text | |
| `--gold` | `#F2B705` | Primary button fill, emblem | **Soil text on it 6.9:1** (never white) |
| `--leaf` | `#2F6B3A` | Links | 6.4:1 on white, 5.3:1 on sky |
| `--soil-soft` | `#6B5247` | Small print | 7.2:1 on white |
| Petal tints | `#FFF1C2`, `#FBE0D0`, `#E3F1DA`, `#E6E1F5` | Page bands, petal cards | Soil on each 9.8 to 11.1:1 |

**Other emblems:**
- acorn: oak green and a nut brown;
- bluebell: a violet accent with deep-violet ink;
- thistle: purple with deep heather ink;
- rainbow: the petals carry the colours and the ink stays soil.

Each set needs its own computed contrast notes.

**Illustration, shape and motion:**
- **The emblem:** flat, crisp hand-coded SVG with 2 or 3 tones and no outlines, built from repeated petal or leaf paths so it scales from 32px to 480px. **No face and no limbs.** That is the line between this and Sunflower's 3D mascot and our Sidekick.
- **The companion:** a 40px drawing in 3 fixed poses at most (flying, resting, peeking).
- **Motion** (none under reduced motion):
  - petals unfold from the centre once on load (scale 0.9 to 1 with a 40ms stagger);
  - the sun arc draws once;
  - the companion bobs 3px.

**Photo needs and fallbacks:**
- **Needed:** the garden, food, empty rooms and the building front.
- **Fallbacks:** the emblem, sky and petal colour fields. The template works with 3 photos or none.
- Photos sit in soft rounded rectangles with a 24px radius. No circles: that's Make Waves.

**Copy voice:** bright, calm and short. The sunny tone lives in the headings, never in the facts:
- "Sunny days start here."
- "What we'll cook this week."
- "Come and see us."

**Video and gallery:**
- **Living photo:** the garden with flowers moving in the wind, or sunlight across an empty room, under 1.5 MB with a pause button.
- **Tour film:** click to play, titled "A morning at [name]", empty rooms only, with captions.
- **Gallery:** a homepage strip is optional; if used, 4 photos in 2 by 2. On the gallery page, the filter buttons take the petal tints (Rooms, Garden, Food, Artwork) over a 2-column mosaic with captions.

**Borrowed:**
- *Sunflower:* the name-derived palette with brown ink instead of black, the eyebrow band with its "Want to know more?" note, the intent cards, the patterned visit band with one card, the companion on a card edge, the meal timetable, building fronts for groups, big light headings in open space.
- *Playhouse:* the floating single action, the room and page colour coding, the "Everything families need" icons (on Visit and join).

---

### 3. Signpost (`nursery/signpost`): a wayfinding site where colour means place

**Concept.** The owner wants "a clear way into separate pages". Signpost makes the wayfinding itself the look:
- the homepage's main picture is a **fingerpost**: a drawn wooden post with **colour-coded arrow boards**, one per inner page;
- each board's colour *becomes* that page: its band, its section numbers and its "you are here" marker. A parent learns the system in one tap. Green is food, blue is fees, and so on.
- Inside each page, a numbered **waymarker trail** (the "On this page" list) leads through short sections.

It is the clearest route to detail of the four, so it suits nurseries with a lot to say.

**Target nursery:**
- village and community nurseries, and partnership or voluntary nurseries with lots of practical information (funding routes, term dates, transport);
- small groups with several sites. There is an "Our nurseries" board, and each site gets its own sub-board;
- parents comparing options.

**Homepage on a phone:**
1. **Hero:**
   - the fingerpost drawing (on a phone the post sits at the right edge, with 3 visible boards, and the rest below);
   - H1 "[Name], [Town]: where do you want to go?";
   - one sentence;
   - Book a visit and Phone.
2. **The essentials:** 5 lines, each with a small **waymarker disc** icon (a round yellow disc with an ink symbol).
3. **You are here:** one photo of the building front with a small "You are here" pin-board. The address in one line, and "Directions →" to Visit and join.
4. **The boards (the doors):**
   - on a phone, 6 full-width **arrow boards** stacked with 24px gaps, each a saturated colour with white text, a pointed right end, a page name of up to 3 words and an 8-word line;
   - on desktop, the boards hang off the drawn post at slight angles.
5. **Book a visit:** a single "Start here" board in the brand red, plus Phone.

**Inner pages and how to reach them:**
- **Pages:** Visit and join, Fees and funding, Our nursery, Food, Our team, Parents, Gallery (and Our nurseries for groups).
- **Reached by:** the boards, a 6-item menu in the same colours (a colour tab beside each item), and the "Next" board at the foot of each page.
- **The page band** is the board's colour. The eyebrow reads "You are here: Fees and funding", with a small post icon.
- **Then** the **waymarker trail:** numbered discs (1, 2, 3…) as the "On this page" list, and the same numbers on each H2. Sections stay at 120 words or fewer.
- **Every page ends** with a **"Next" arrow board** to the logical next page, coloured as that page.

**Signature components:**
- **Arrow boards:** `clip-path` polygons with a pointed end and 2 tiny drawn screws. The whole board is the link. Focus shows a 3px ink outline outside the shape (we test the clip so the outline isn't clipped).
- **Colour = place:** 6 page colours, each used for the board, the page band, the waymarker discs and that page's link underline. Nowhere else.
- **Waymarker discs:** 32px yellow circles with ink numbers or symbols. They number the contents list and the H2s, and mark the essentials.
- **The fingerpost:** a drawn post with wood-grain lines, and optionally a robin perched on top.
- **"What's here" info signs:** the nursery's real amenities as road-sign-style squares with an icon and up to 4 words (buggy park, bike rack, garden, kitchen, step-free entrance). From Playhouse's "Everything families need", made accessible.
- **The "Next" board** at the foot of every page.

**Fonts:**
- **Overpass** 800 for display, and 400 and 600 for body text, with tabular figures for hours and fees.
- Overpass descends from the US road-sign typeface (Highway Gothic): legible at a distance, and right for wayfinding. It's a single family, so it loads light.

**Palette:**

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `--paper` | `#F7F5EF` | Ground | Ink on it 13.5:1 |
| `--ink` | `#1F2A2E` | Text | |
| `--muted` | `#4F5B60` | Small print | 6.4:1 on paper |
| `--marker` | `#F2C14E` | Waymarker discs | Ink on it 8.8:1 |
| Board: Visit and join | `#B8432A` | Also the primary action colour | White on it 5.4:1; as text on paper 5.0:1 |
| Board: Fees and funding | `#1D6E8C` | | White on it 5.7:1 |
| Board: Our nursery | `#2E7D4F` | | White on it 5.1:1 |
| Board: Our team | `#6E4790` | | White on it 7.1:1 |
| Board: Food | `#A35A14` | | White on it 5.2:1 |
| Board: Parents / Gallery | `#A8355F` | | White on it 6.3:1 |
| Post wood | `#8A5A3B` | Decorative only | |

**Illustration, shape and motion:**
- **Drawings:** flat signage-style shapes with 2px ink details (screws, grain lines). Small local touches may top the post: a robin, a thistle, a lamp post. No people.
- **Motion** (none under reduced motion):
  - boards swing in once from −3° to 0° with a 60ms stagger;
  - board arrows nudge 4px on hover or focus.

**Photo needs and fallbacks:**
- **Needed:** the building front (for "You are here"), the entrance, rooms and the garden.
- **Fallbacks:** the boards and info signs carry the page alone. This direction needs the fewest photos.

**Copy voice:** helpful and direct, like good signage. Verbs first, no fuss:
- "Find a place."
- "See what it costs."
- "Meet the team."
- "You are here: Food."

Labels are always the plain page names.

**Video and gallery:**
- **Tour film "The way in":** from the gate or front door to the rooms, empty, click to play with captions. Its poster is the front door.
- **Gallery:** the filter buttons are mini arrow boards (Rooms, Garden, Food, Artwork) over a 2-column mosaic with captions.
- **No homepage strip:** the Gallery board is the door.

**Borrowed:**
- *Sunflower:* the grouped menu, "← Back to" links and section eyebrows (here "You are here"), the in-post contents list (here the waymarker trail), multi-site nursery cards with building fronts.
- *Playhouse:* room colour coding carried across pages, the "Everything families need" amenities (here as info signs), the single always-visible action.

**How it differs:** Front Desk is a plain task page with no metaphor. Make Waves has small icon cards with squiggles. Signpost is a whole site system: shape (arrows), colour per place, and numbered trails.

---

### 4. Soft Play (`nursery/soft-play`): chunky foam shapes, bouncy and bright

**Concept.** Playhouse's best picture is its empty jungle soft-play room: orange wedges, green cushions, a ball pit and a zebra.
- Soft Play turns the **look of padded foam play equipment** into a brand: chunky rounded blocks, wedges, cylinders and steps in bright soft-play colours on a calm off-white, with **very few words in very big type**.
- Buttons are foam blocks that **squish** when pressed.
- The facts climb a **foam staircase**.
- Every door is a different foam shape.

It's the most playful of the four, and still airy, because each shape sits alone on its own row.

**Target nursery:**
- town and city nurseries with indoor play spaces (a soft-play room, a sensory room, a big hall);
- newer purpose-built nurseries, toddler-heavy settings and younger families;
- nurseries with few outdoor photos.

**Homepage on a phone:**
1. **Hero:**
   - a drawn foam scene: a wedge, a cylinder, two cubes and a scatter of balls, with the nursery name built from the shapes' colours;
   - H1 of up to 6 words ("Big play, little people, Paisley");
   - one sentence;
   - a foam-block "Book a visit" and Phone.
2. **The foam staircase (the essentials):**
   - on desktop, 5 steps rising left to right, each step one fact (Ages, Hours, 1,140 funded hours, Places, Grades);
   - on a phone, 5 full-width foam bars, each a different colour, stepping in 12px from the left, each with one fact of up to 8 words.
   - Grades link to the report.
3. **The play room:** one full-width photo of the empty play space (or the drawn foam scene), with a single line and "See the rooms →".
4. **Doors:** 6 doors, each a different **foam shape** (cylinder for Our nursery, wedge for Fees and funding, cube for Food, half-moon for Our team, step for Visit and join, ball for Gallery). On a phone the shape sits on the left and the label on the right, one per row, with 24px gaps.
5. **Book a visit:** a deep blue band with a row of drawn balls along the top edge, one foam-block button, and Phone.

**Inner pages and how to reach them:**
- **Pages:** the 7 standard pages.
- **Reached by:** the foam doors, a 6-item menu and section door links.
- **Each inner page's band** carries its foam shape, large, in that page's colour. The "On this page" list uses small foam cubes as bullets. Sections are up to 120 words.
- **On Our nursery,** each real room gets its own colour and a drawn line icon (an animal or object), as on Playhouse's rooms page (bunny, owl, tepee). Only the room names the nursery uses.

**Signature components:**
- **Foam-block buttons:**
  - a solid colour with a 6px darker bottom edge and a large 18px radius;
  - on press they move down 3px and the edge shrinks: a tactile squish;
  - the focus ring sits outside the edge.
- **The foam staircase** for the essentials.
- **Foam-shape doors:** each page has its own shape and colour, used for its door, its band and its bullets.
- **The ball row:** a row of 12 to 20 overlapping drawn balls in mixed colours along the top of the visit band and the footer. The site's one seam, developed from Playhouse's cloud scallops into ball-pit balls.
- **Chunky photo frames:** a 24px radius with a thick 6px coloured border (a foam mat edge).

**Fonts:**
- **Bagel Fat One** for H1, H2 and door labels only (a super-chunky, soft display face; no more than 5 words at a time);
- **Albert Sans** 400 and 600 for body text and the interface (neutral and clear, calming the display face).

**Palette:**

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `--floor` | `#FFF9F2` | Ground | Ink on it 16.1:1 |
| `--ink` | `#1D1B2F` | Text | |
| `--muted` | `#545266` | Small print | 7.2:1 on floor |
| `--tomato` | `#E8553D` | Foam (shapes) | Ink on it 4.6:1 (passes, but use for labels only) |
| `--tomato-deep` | `#C7402B` | Primary button, links | White on it 5.0:1; as text on floor 4.8:1 |
| `--sun` | `#FFC93C` | Foam, staircase step | Ink on it 10.9:1 |
| `--grass` | `#3DAA5C` | Foam | Ink on it 5.7:1 |
| `--grass-deep` | `#1F6B3A` | Text band | White on it 6.5:1 |
| `--pool` | `#5BB0E6` | Foam | Ink on it 7.0:1 |
| `--pool-deep` | `#1F5F99` | Visit band | White on it 6.7:1 |
| `--grape` | `#6C3FB0` | Foam, text band | White on it 7.1:1 |
| Soft tints | `#FFE7B8`, `#D8F0DF`, `#DCEBFA` | Inner page bands | Ink on each 13.8 to 14.0:1 |

**Illustration, shape and motion:**
- **Shapes:** chunky geometric SVG foam (wedges, cylinders, cubes, steps, half-moons, balls) with a single flat highlight and a soft darker underside. Optional props from soft-play rooms: a drawn zebra rocker, a tunnel, a giraffe height chart. Animals and objects only, no people.
- **Motion** (none under reduced motion):
  - balls drop into the ball row once on first view (300ms with a small bounce);
  - buttons squish on press;
  - the stairs settle in once.

**Photo needs and fallbacks:**
- **Needed:** the empty play or soft-play room (the hero candidate), rooms with toys close up, food and the garden.
- **Fallbacks:** the drawn foam scenes for the hero and each inner page band. It works with no photos.
- **Never:** children's faces. Hands on blocks and backs in the tunnel are fine.

**Copy voice:** playful, short, verb-first, never silly about facts:
- "Climb in and look around."
- "Lunch, cooked here."
- "Come and play."

The facts on the staircase are written plainly.

**Video and gallery:**
- **Living photo:** a slow pan across the empty play room (made with ffmpeg from a real photo and labelled honestly, "Our play room"), under 1.5 MB, with a pause button; phones get the poster.
- **Tour film:** click to play, captions, the empty room first.
- **Gallery:** a 2-column mosaic with chunky foam borders, the frame colour cycling by group (Rooms, Garden, Food, Artwork), with filter buttons as small foam blocks. The homepage has no strip.

**Borrowed:**
- *Playhouse:* the soft-play room as the brand idea, the cloud-scallop edge (developed into the ball row), room identity (colour plus line creature), one repeated action, a big full-width photo per row.
- *Sunflower:* pill-soft rounded shapes, big headings with few words, intent wording in the door sub-lines, the eyebrow band on inner pages, a single centred card with one action in the visit band.

**How it differs from Sidekick:** Sidekick is character-led (a mascot in poses, Fredoka, highlighted-word headings, clock boxes). Soft Play has no character at all. Its fun comes from shape, colour and touch.

---

## Part 4. Side by side

| | Open House | Sunny Side | Signpost | Soft Play |
| --- | --- | --- | --- | --- |
| **Folder** | `nursery/open-house` | `nursery/sunny-side` | `nursery/signpost` | `nursery/soft-play` |
| **Big idea** | The nursery as a drawn house you walk into | An emblem that opens into the site | Wayfinding: colour means place | Chunky foam play shapes |
| **Feels** | Homely, warm, calm | Bright, airy, gentle | Clear, confident, practical | Bouncy, bold, tactile |
| **Doors** | Rooms of a cutaway house | A flower of petal cards | Arrow boards on a fingerpost | Foam shapes |
| **Essentials** | List in the "hall", household icons | List with the sun arc for hours | List with waymarker discs | A foam staircase |
| **Inner-page marker** | The room drawn in the band | The petal tint | The board colour and "You are here" | The foam shape |
| **Fonts** | Sniglet + Golos Text | Young Serif + Plus Jakarta Sans | Overpass | Bagel Fat One + Albert Sans |
| **Ground** | Cream wall | Sky and white | Paper | Off-white floor |
| **Photos needed** | Front door, rooms | Garden, food | Building front | Play room |
| **Works with zero photos** | Yes | Yes | Yes (best) | Yes |
| **Best for** | Villa or cottage nurseries, "home from home" | Nature-named nurseries, small groups | Information-heavy or multi-site nurseries | Indoor-play, city, toddler-heavy |

### Building them
1. **Build Signpost first.** It answers the complaint most directly and is the easiest to check against the space brief.
2. **Example nurseries:** pick real Scottish prospects from `prospects/` that fit each target. All their facts must come from their own site or the Care Inspectorate, with "phone to check" for anything unclear.
3. **Gate every template on:**
   - the density script (S5);
   - the homepage word count (S4);
   - the phone length (S3);
   - `viewports.mjs` at all 9 widths;
   - audit 0/0/0.
4. **Then retrofit the 11 existing templates** to S1 to S13:
   - move their menus, timelines, grade tables and guarantees into inner pages;
   - replace 2 by 2 fact grids with the 5-line essentials list;
   - cut every homepage to 6 screens or fewer.
