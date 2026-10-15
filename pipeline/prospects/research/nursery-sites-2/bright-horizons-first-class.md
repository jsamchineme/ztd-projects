# Bright Horizons: First Class Nursery and Preschool, Aberdeen (brighthorizons.co.uk)

Studied 13 October 2026. Crawl, screenshots and measurements are in `/private/tmp/claude-501/-Users-samuelosuh-codes-mapboard/c179b3f0-507a-47ce-a937-2eef0da893bf/scratchpad/study2-b/brighthorizons/`. Paths below are relative to that folder. Clean screenshots (cookie banner, chat and WhatsApp pop-up removed) are in `clean-nursery/` and `clean-grouphome/`. A group-level study already exists at `prospects/research/nursery-sites/bright-horizons-uk.md`, so this file concentrates on the nursery page and what it borrows from the group pages.

## At a glance
- **Site:** https://www.brighthorizons.co.uk/our-nurseries/first-class-nursery-and-preschool (one nursery page in the group site).
- **Who runs it:**
  - Bright Horizons Family Solutions, a US-owned group with about 270 UK nurseries.
  - First Class Day Nursery and Preschool is in the Cunningham Building, Macaulay Drive, Craigiebuckler, Aberdeen AB15 8QW. It takes ages 3 months to 5 years and opens Monday to Friday, 7:30am to 6pm.
  - The page shows a Care Inspectorate "Very Good" grade, a daynurseries.co.uk score of 10 and a daynurseries "Top 20 2026" award.
- **Tech:** Next.js. Quicksand (self-hosted woff2) with a "Broadstone" script face. Splide carousels, OneTrust consent, Google Tag Manager, a "MinimizableWebChat" bot, and a WhatsApp channel pop-up.
- **Overall feel:** a tidy, corporate, warm page in navy `#20445D` and sunshine yellow `#F2BF00`, with **coloured card tiles** (teal, green, turquoise) and **a grid of 12 line-icon roundels**. Colourful in a controlled way. The fun is in the icon grid, the playful button labels and the shaped photo and video masks.

## Site map
**Header:**
- A top utility bar: Nurseries · Corporate Solutions · Careers · Foundation · Our Locations · Contact Us.
- The main bar: logo · Home · Find A Nursery · About Us · Our Curriculum · Family Zone · Open Days and Events.
- Two pills on the right: orange "BOOK A VISIT" and a yellow phone number.
- Below that, a breadcrumb.
- On a phone: logo, a yellow round phone button and a burger.

**Footer:** a navy field with a **wavy top edge**. Five columns: Nurseries, Corporate Solutions, Careers and Foundation, Legal, and yellow circular social icons.

**Nursery-level pages**
- The nursery page (about 1,600 words), described below.
- `…/book-a-tour-4539`: "Book a visit at First Class…". A 122-word intro, a "Weekday Personal Tour" picker, and a list of open days, webinars and stay-and-play sessions "as and when available".
- `…/virtual-tour`: a 360° walk-through embedded from `my.easyvirtual.tours`.
- A fee sheet PDF (`…fee-sheet-4539.pdf`) and the brochure download.

**Group pages linked from the nursery page:** The Nurture Approach, Childcare Funding, Our Nursery Day (with Baby, Toddler and Preschooler day pages), SEND Support, Family Resources, Settling In Sessions, Food and Mealtimes, the newsroom, and nearby nurseries.

## Homepage section by section
### The nursery page (the "homepage" for this nursery)
Measured at 390 and 1280px (`clean-nursery/`): about 1,600 words, 9,018px tall on desktop, about 15 phone screens. Eleven sections.

| # | Section | Words | Phone | Desktop |
| --- | --- | ---: | --- | --- |
| 1 | Hero: "First Class Nursery", a parent quote (from daynurseries), "Book A Visit" (yellow), "Apply For A Place" (orange), "Virtual Tour" link | 60 | Navy block with the text, then the photo slider below it | Navy panel left (about 40%); **photo slider** right (11 photos, yellow round arrows) |
| 2 | Trust strip: Care Inspectorate "Very Good" (download report) · daynurseries 10 (review score) · £ "Funding Options" | 12 | A white rounded card; three badges in a 2+1 grid | One row of three |
| 3 | "A Warm and Welcoming Nursery in rural Airyhall, near Aberdeen", then H3s: Enriching Rooms for Every Age · Getting Ready for Their Next Steps · Specialist Rooms · Large and Exciting Gardens · All-Inclusive Care · Your Personal Tour | 300 (truncated with "Show more") | Text column, then the map, address, what3words, hours table and four buttons | Text left (the "Top 20" badge floats in it); a **sticky side card** right with map, address, what3words, hours, phone, and Book A Visit / Apply for a Place / Download Brochure / Ask A Question |
| 4 | Manager card: photo, "Caroline, Nursery Manager", "Meet the team" | 4 | | |
| 5 | "Here's an 'at a glance guide' to what First Class has to offer." | 30 | Teal band; **12 white circles with yellow-and-navy line icons**, 3 per row | 6 per row |
| 6 | "Included in our fees" (7 green ticks) + "We've got it covered" + "Download Brochure" | 110 | Ticks first, then text | Two columns |
| 7 | "Nursery Fee Calculator" + "Estimate your fees" form (age in months, day radios, Calculate) + "Download Fee Sheet" | 110 | The form sits in a navy card with a yellow heading | Text left, navy card right |
| 8 | "Find out what people love about us": three testimonial cards with a yellow speech-bubble icon, first names | 140 | One card at a time with dots (carousel) | Three in a row |
| 9 | "Here you can explore more…": **7 coloured link cards** (The Nurture Approach, Childcare Funding, Our Nursery Day, SEND Support, Family Resources, Settling In Sessions, Food and Mealtimes) | 170 | Stacked; each card a different colour | 3 + 4 grid, colours alternate turquoise `#07ABB8`, green `#78A840`, teal `#3988A1` |
| 10 | "Meet the team": three photo cards (Manager, Deputy, Curriculum Lead) with "Read full biography" | 40 | | |
| 11 | Latest news (2 cards), "Follow us on social media…" (two navy Facebook and Instagram cards), "Other nearby nurseries" (carousel) | 140 | | |

### The group homepage (brighthorizons.co.uk)
- 533 words in six sections (`clean-grouphome/`):
  1. "Find your perfect nursery" with a postcode search, beside a **hero video in a wavy mask**.
  2. A daynurseries 9.5 rating card.
  3. "Our nurseries are extraordinary…".
  4. "This is more than childcare. **This is childhood**" (yellow) with a large click-to-play video block.
  5. A second postcode search band.
  6. Welcome and brochure, Childcare funding, "There's always something new" (news).
- On a phone a **yellow "Join our WhatsApp Channel!" pop-up** covers the bottom half of the first screen.

## Why it feels colourful and fun
- **Palette (from the `:root` tokens):**
  - `--color-blue #20445D` (navy text and bands), `--color-yellow #F2BF00` (buttons, icon accents, headings on navy).
  - `--color-teal #3988A1`, `--color-turquoise #07ABB8`, `--color-lightgreen #78A840`.
  - `--color-orange #DB6812` (Apply and Book a Visit), `--color-raspberry #B61752`, `--color-purple #5C306A`, `--color-lavender #977EB1`.
  - `--color-sky-blue #A6D9E9`, `--color-sky-blue-light #EFF7FA`, `--color-robwhite #F5F4F4` (page ground), `--color-red #E4032E` (score roundel).
  - Only five colours appear on the nursery page. The others are reserved for other page types.
- **How colour is used:**
  - Large **colour tiles** (the 7 link cards) rotate through turquoise, green and teal.
  - Bands alternate navy, teal and off-white.
  - **Every button is a yellow pill** with navy text, so the eye learns "yellow means act".
  - Yellow is also the accent inside the white line icons.
- **Shapes:**
  - `--border-radius: 20px` on cards; 50px pills.
  - Circles for icons (50%).
  - **10px 10px 0 0** tops on photo cards.
  - A **"0 0 40px 40px" rounded bottom** on the hero.
  - **Wavy masks** on the hero video and the footer top.
  - A thin inset shadow on the grey side card (`inset 4px 11px 11px #F5F4F4`).
  - Small card shadows (`0 1px 4px -1px rgba(0,0,0,.3)`).
- **Illustration:** none on this page. The **line-icon set** does the job: house with heart, car, plant pot, pot, mobile, Zz, chef hat, buggy, vegetable box, water drops, nature trail, music notes. Each is thin navy with one yellow detail, inside a white circle. It's the most "fun" device on the page and contains no people.
- **Photography:** a hero slider of 11 photos of the garden (sand pit with toys, a tepee, cones, a wooden play house), rooms and activities. Several show no children. Group pages use lifestyle shots of staff in blue polo shirts with children (faces shown).
- **Type:**
  - Quicksand throughout: H1 45px/700, H2 32px/700, H3 24px/700, body 16px/400.
  - The body line height is tight (20.48px, 1.28). That's the one readability weakness.
  - "Broadstone" is declared for script accents on group heroes.
- **Playful copy on buttons:** "Take a peek", "Follow their footsteps", "Catch the action", "Get a taste", "Dig a little deeper", "Explore our approach". Small, but it makes the cards feel fun rather than corporate.
- **Motion:** Splide carousels (hero photos, testimonials on a phone, nearby nurseries), an autoplay muted loop video on the group homepage, OneTrust and chat-widget animations. No scroll animation.
- **Spacing:** a 1232px inner width, a spacing scale in 0.625rem steps (`--spacing-1` to `--spacing-10`), and comfortable 40 to 60px between blocks.

## How it keeps text light
- **The icon grid replaces a facilities paragraph:** 12 facilities, 2 words each ("Duck Pond", "Boogie Mites", "Sleep Room").
- **The "Show more" truncation** on the 300-word description: on a phone only the first two sub-sections show until you tap.
- **The ticked "Included in our fees" list** (7 items of 3 to 6 words).
- **Trust as badges, not prose:** the inspection grade, review score and funding icon in one strip directly under the hero.
- **The sticky side card on desktop:** address, hours and four actions stay visible while you read.
- **Everything else is pushed to group pages** through the 7 colour cards (each about 25 words with a button).
- **Weak points:** about 1,600 words is still long, and the testimonial cards are 30 to 50 words each.

## Inner pages
- **Rooms:** no room-by-room page. The description has an "Enriching Rooms for Every Age" paragraph and the icon grid lists Sleep Room and Sensory Play. The group "Our Nursery Day" page has three colour cards: Your Baby's Day (3–18 months), Your Toddler's Day (18 months–3 years), Your Preschooler's Day (3–5 years). Each has a photo, a 60-word blurb and a playful button, and leads to a long day page (1,194 words for preschoolers).
- **Fees and funding:**
  - The fee sheet is a **PDF**. The **on-page calculator** asks for age in months and the days a week.
  - "Included in our fees" ticks.
  - The group "Childcare Funding Options" page has guides by nation.
  - No price is shown on the page itself.
- **About and team:** the manager card in the description, three team cards with "Read full biography" links, and group pages about "Our Nursery Teams" (738 words).
- **Parents:** Family Zone, Family Resources (activities, book reviews, nursery rhymes, recipes), Settling In Sessions, Food and Mealtimes, the parent panel.
- **Contact and visits:** the book-a-tour page with a personal tour picker and an open-days list, a phone number, "Ask A Question" and "Apply for a Place" forms.
- **Gallery:** only the hero slider and the virtual tour (see below).

## Gallery
- **Where:** the **hero slider** on the nursery page (Splide, `#splide01`) is the only gallery. There's no gallery page.
- **Layout:** one photo at a time (390×277 on a phone, about 640×400 on desktop) with **yellow circular prev/next arrows** at the bottom right. No dots, no counter, no autoplay seen. Rounded figure corners (`GalleryItem_hasRadius`).
- **Count:** 11 photos.
- **Captions and alt text:** none visible. All 11 images have the **same alt**, "First Class Day Nursery and Preschool".
- **Images:** served through Next.js image optimisation with `srcset` (11 of 11). The phone gets 389×188 images stretched to 390×277, so they're slightly soft. Not lazy loaded (all 11 load at once, about 180 KB extra on a phone).
- **Opening:** clicking a photo does nothing: no lightbox. The keyboard reaches only the "Next slide" button.
- **Content:** the first photo is the garden with a sand pit, tepee and cones and no children. Others show the rooms and garden.
- **Virtual tour** (`…/virtual-tour`): a full-width iframe (1236×704 desktop, 362×704 phone) from `my.easyvirtual.tours`. It opens on the building exterior with a title card, a big play button and "Tips". It sets its **own cookie banner inside the iframe**. 9.3 MB on desktop and 7.5 MB on a phone. Screenshot: `video-vtour-390/iframe0-screen.jpg`.
- **Screenshots:** `../gallery/bh-390-grid.jpg` (slider on a phone), `clean-nursery/sheet-desktop-1280-1.jpg` (hero slider on desktop).

## Video
| | Group homepage hero | Group homepage "PLAY VIDEO" block | Nursery page |
| --- | --- | --- | --- |
| Where | Inside the hero, beside the search, in a **wavy navy mask** | A full-width video block under "This is childhood" | No video on the page. A "Virtual Tour" link goes to the 360° tour. |
| Hosting | **Self-hosted MP4** on `assets.brighthorizons.co.uk` (`B2C-website-hero-video-980x600px_1.mp4`, 980×600) | A poster with a round play button. It didn't load until clicked; the group also links its YouTube channel. | easyvirtual.tours iframe |
| Autoplay / muted / loop / controls | Yes / yes / yes / none; `playsinline`, `preload="metadata"` | Click to play | Click to start the tour |
| Poster | `poster` is set to **the MP4 file itself** (a bug), so there's no real poster image | Yes | Title card |
| Length and content | **25 seconds**: staff in blue polo shirts playing with babies and toddlers (faces shown), on a yellow and wooden set | Children walking with adults, hands held (from behind and side) | Exterior and rooms in 360° |
| Captions | None (`<track>` count 0); no sound | Not checked | n/a |
| Phone performance | **The 18.1 MB MP4 downloads on a phone too**, and it was fetched twice in our test (about 37 MB of video on first load). There's a `prefers-reduced-motion` rule in the CSS, but it doesn't stop this video. On a phone it shows as a 390×234 band under the search. | n/a | 7.5 MB |

Screenshots: `video-home-1280/video0-a.jpg` and `video0-b.jpg` (two frames of the hero loop in its wavy mask), `video-home-390/video0-screen.jpg` (phone hero, with the WhatsApp pop-up covering the lower half), `video-vtour-390/iframe0-screen.jpg` (virtual tour on a phone).

**Effect:** the masked video makes the group hero feel alive, but at 18 MB it is the heaviest thing on any page in this study.

## Conversion
- **Four routes, always visible:** "Book A Visit" (yellow) and "Apply For A Place" (orange) in the hero; the header "BOOK A VISIT" pill and phone number; the sticky side card on desktop with Book A Visit, Apply for a Place, Download Brochure and Ask A Question; and "Book A Visit" again with the open day anchor (`#CurrentOpenDay`).
- **The visit flow:** a personal tour picker on its own page, open days listed underneath, and a phone fallback ("P.S. If you can't find a tour time that works for you, please call us").
- **Fee certainty:** a calculator and a fee sheet PDF.
- **Distractions:** the chat bot bubble, the WhatsApp pop-up and the OneTrust banner, all on the first screen of a phone.

## Phone experience
- **Works:**
  - Yellow phone button in the header.
  - Hero buttons in the thumb zone.
  - The trust strip.
  - The icon grid at 3 per row is easy to scan.
  - The colour cards stack well.
  - Hours shown as a table.
- **Doesn't:**
  - Three overlays at once (cookies, WhatsApp, chat).
  - The hero photo slider pokes 10px past the screen edge (viewports flag: `splide04-track -10–400px`), and the desktop page scrolls sideways by 6px.
  - Testimonials and nearby nurseries are carousels.
  - The tight 1.28 line height.
  - The fee calculator needs age in months.

## Borrow this
1. **A facilities icon grid** ("at a glance"): 9 to 12 roundels, two words each, thin line icons with one accent colour. Only list facilities the nursery confirms. It replaces a paragraph and needs no photos of children.
2. **A trust strip directly under the hero:** the latest Care Inspectorate grades (quoted exactly, with the report date and link), a funded-provider badge, and opening hours. Use real facts only.
3. **"Included in our fees" as a ticked list,** confirmed with the nursery, with "phone to check" for anything unclear.
4. **Coloured link cards with playful verbs** ("Take a peek", "Get a taste", "Dig a little deeper") to push detail to inner pages. Rotate 3 colours from the palette and keep text contrast at 4.5:1 (use navy text on light tints rather than white on mid-teal).
5. **A sticky "visit card" on desktop** (address, hours, phone, Book a visit) that becomes a sticky bottom bar on a phone.
6. **Wavy masks** on the hero image and footer top: an SVG `clip-path` that gives the page a soft, hand-cut edge.
7. **Video, our way:**
   - Copy the masked hero loop idea, not the file.
   - A 6 to 10 second self-hosted clip of the rooms or garden with no identifiable children: empty rooms, hands at the water tray, children seen from behind at a distance.
   - Encode at 720p, under 1.5 MB, as WebM with an MP4 fallback.
   - Use a real `poster` JPEG/WebP. `muted playsinline loop`, but **only start it when `prefers-reduced-motion: no-preference`** and the screen is wider than 600px, with a visible pause button.
   - On phones, show the poster only.
   - If there's speech, add captions (WebVTT) and a transcript.
8. **A "virtual tour", our way:** a self-hosted, poster-first, click-to-play walk-through video of the empty building (60 to 90 seconds, captioned, no music autoplay). It's lighter and more private than a third-party 360° iframe with its own cookies.
9. **Gallery, our way:** a static grid of 6 to 12 photos (garden, rooms, food, artwork, hands, children from behind), each with its own descriptive alt text, lazy loaded, with `srcset`. No slider, no lightbox needed.

## Avoid this
- An 18 MB autoplaying hero video that phones download in full, a `poster` that points at the video, and no reduced-motion handling.
- The same alt text on 11 photos.
- Pop-ups (WhatsApp channel), chat bots, third-party tour iframes and cookie walls, which our rules exclude.
- Carousels for photos, testimonials and nearby nurseries.
- "Show more" truncation that hides the key description on a phone. Write a shorter text instead.
- Fees only in a PDF and a calculator that needs the child's age in months.
