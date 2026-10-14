# Pear Tree Nurseries: Arnhall, Dunblane (peartreenurseries.co.uk)

Studied 13 October 2026. Crawl, screenshots and measurements are in `/private/tmp/claude-501/-Users-samuelosuh-codes-mapboard/c179b3f0-507a-47ce-a937-2eef0da893bf/scratchpad/study2-b/peartree/`. Paths below are relative to that folder.

## At a glance
- **Site:** https://www.peartreenurseries.co.uk/arnhall-dunblane/ (the nursery page) inside the group site https://www.peartreenurseries.co.uk/.
- **Who runs it:** Pear Tree Nurseries, a small Scottish group: three nurseries in Haddington, East Lothian (Meadowpark, West Road, Church Street) plus Arnhall Nursery near Dunblane (107 places, founded 1990, Stirling Council funded partner). The cookie policy gives a `brightstars-nurseries.com` marketing email, which suggests Pear Tree is now part of the Bright Stars group, but the site doesn't say so. Built on WordPress with the Divi theme by Nettl of Stirling.
- **Odd fact:** Arnhall isn't in the "Locations" menu, the footer, or the homepage location cards. Those list only the three Haddington nurseries. The Arnhall page is reachable only by direct link.
- **Overall feel:** green and grey, not very colourful. Its fun comes from a handwritten display font, a drone-style background video and an illustrated logo, not from colour. It's the least colourful of my four sites, but it has two ideas worth taking (named rooms in a handwritten font, and a full-width video with a poster and a play button).

## Site map
**Header:** logo · Home · Locations (Meadowpark, West Road, Church Street) · Useful Info (Forest Schools, Parent Portal on eylog.co.uk) · Working With Us (Latest Vacancies) · Safeguarding · Contact · green "Book a Visit" button (goes to /contact/). Each menu item has a small Font Awesome icon (map pin, envelope).

**Footer:** a pale mint (`#DDEDE2`-ish) field with a wavy top edge, the large illustrated logo (a pear tree with two cartoon children), the daynurseries "Top 20 2026" badge, three addresses and phone numbers, "Website design by Nettl", privacy PDF.

**Page types (9 crawled)**
- Group homepage `/`: video hero, mission statement, location cards, a recruitment advert, quick contact. 278 words.
- Nursery pages (`/arnhall-dunblane/`, `/meadowpark-haddington/`, etc.): one long page each, 1,070 to 1,450 words. They hold everything: about, premises, news, parent zone, team, parent information accordions, a photo strip, rooms, Forest Schools, aims, map and the location cards again.
- `/forest-schools/`: a long text page (592 words) in alternating image and text rows.
- `/safeguarding/` (257 words), `/vacancies/` (9 words), `/contact/` (77 words).
- No separate fees, gallery, rooms or team pages. No fees are published anywhere.

## Homepage section by section
Measured at 390px and 1280px (`vp-home/`). 278 words in total, 3,384px tall on desktop, about 4 phone screens.

| # | Section | Words | Phone | Desktop |
| --- | --- | ---: | --- | --- |
| 1 | Video hero: "welcome to / Peartree Nurseries" with a round "Play Video" button | 5 | A full-screen looping background video of a walled garden with play towers, filmed from a high angle. Children are small figures. The white Montserrat title is 44px. | The same at full width, 650px tall. |
| 2 | Mission statement over a green-tinted photo of hands in sand: the "Top 20 2026" badge, "OUR NURSERY MISSION STATEMENT", then "is to plant the seeds of curiosity and nurture children to their full potential" | 21 | The handwritten font (Just Me Again Down Here, 54px) fills the screen in four lines. | The most charming block on the site: handwriting over a sage photo. |
| 3 | "OUR NURSERY LOCATIONS": three photo cards of the buildings, each with a name and a white "MORE" pill | 15 | Stacked cards with a blue tint over the photos. | Three cards in a row on a dark photo background. |
| 4 | "Grandparents Wanted!" recruitment advert | 110 | A stock photo of grandparents with a baby, then a bulleted list. | Photo left, text right. |
| 5 | Quick Contact (one green "CONTACT US" pill) and "Latest Reviews" (empty) | 6 | The empty reviews widget leaves a blank grey block. | The same. |
| 6 | Footer with a wavy top edge | 60 | | |

**Desktop vs phone:** the same order. On a phone the hero video still plays (Vimeo `background=1`), and the location cards stack.

## Why it feels colourful and fun (or doesn't)
- **Palette (computed):**
  - Slate text `#4D5E66` (rgb 77,94,102), used for headings and body.
  - Leaf green `#69B42E` for buttons, subheads and the "Book a Visit" button.
  - Dark green `#487F1C` for links.
  - Sage `#8BC79E` for the "Our Aims" band and a 30% tint behind the mission.
  - Teal tint `rgba(0,81,99,.2)` over photos.
  - Pale grey `#F9F9F9` and white for most of the page.
  - Red `#D51111` only on the "Dunblane" label under the Arnhall title.
  - Mint footer. Colour mostly comes from photos and green buttons, so the page reads as white and slate.
- **Shapes:**
  - Rounded cards with 10px corners and soft coloured shadows (`0 16px 18px -6px rgba(0,81,99,.28)`, plus a sage version).
  - Pill buttons with 50px corners.
  - One clever shape: an "In safe hands…" photo cropped to a **rounded-bottom arch/teardrop** (border-radius on three corners).
  - Circular staff portraits.
  - A **wavy SVG edge** on top of the footer.
- **Illustration:** only the logo (a pear tree with two cartoon kids), repeated large in the footer. No mascot.
- **Icons:** Font Awesome glyphs in front of every section heading (megaphone, user, hand, map pin, tree), in green or slate. On the Arnhall page, "Our Aims" uses green tick-box icons in two columns.
- **Photography:**
  - Professional outdoor shoots (Andy Semple Photography): children in bright waterproof suits (red, blue, pink) in woodland. The colour comes from the children's clothes.
  - Room photos are phone snapshots of children at tables.
  - Children are fully identifiable throughout.
- **Type:**
  - Montserrat 700 for headings: 70px for the H1 on a nursery page, 42 to 60px for H2s, often uppercase.
  - PT Sans 500 for body: 16px with a very loose 32px line height.
  - **"Just Me Again Down Here"**, a handwritten marker font, for the mission statement and for **room names** ("Dragonfly Room", "Butterfly Room", "Bumblebees Room", "Grasshopper Room", "Garden") at 55px. That is the fun.
- **Motion:**
  - Divi entrance animations (fade, slide and bounce keyframes are loaded).
  - Revolution Slider is loaded.
  - The background hero video.
  - Hover lifts on the cards.
- **Spacing:** generous. Sections have 80 to 100px of padding, and paragraphs are centred in narrow columns.

## How it keeps text light
- The **group homepage is only 278 words**, but that's because it holds almost nothing: no fees, no hours, no rooms. Everything lives on the long nursery page.
- **Accordions** for the dull but essential parent information: Childcare Vouchers, Grant funding, Extra Curricular Activities, Sessions, Absence and Illness, Sample Menu, Waiting List, Nursery Closure, Duty of Candour. These are 9 white pill buttons with a "+" icon in a 3×3 grid, so nine policies take up one short screen.
- **Room names as display headings** in handwriting, with one photo each, in alternating left and right rows.
- **"Our Aims" as a tick list**: twelve bold one-line aims, each with one line under it.
- **Weak points:**
  - The nursery page is still 1,450 words with long centred paragraphs (up to 118 words).
  - The "Play, Learn & Share" text is 81 words of grey 13px-looking text.

## Inner pages
- **Rooms (on the nursery page):** a "Rooms" heading with a frame icon, then each room as a two-column row: handwritten name, the age range in the first sentence, 60 to 100 words, and one photo with rounded corners. Rows alternate. Garden comes last as if it were a room.
- **Fees and funding:** no fees anywhere. "Grant funding" and "Childcare Vouchers" are accordions. The text links to childcarechoices.gov.uk, which is an English scheme, on a Scottish site.
- **About and team:** "Meet the team" sits on a pale blue-grey band. Three circular portraits with handwritten names, a green job title and a 40 to 60 word bio with personal touches ("enjoys cycling", "playing cricket").
- **Parents:** the "Parent Zone" card ("Downloads, reports and nursery info") and the Parent Portal link (eylog). The "latest news from Arnhall" card shows "No Results Found", a broken feed.
- **Contact and visits:**
  - `/contact/` has a hero photo of children posting a letter, three addresses, and a sentence promising a form.
  - In our render **the form doesn't appear** (blocked until cookies are accepted, which is reCAPTCHA behaviour), and a raw Divi shortcode `[dica_divi_carousel …]` prints on the page.
  - There is a Google map with pins.
  - "Book a Visit" goes to this page. There is no booking flow.
- **Forest Schools:** a hero of a child on a rope swing, alternating photo and text rows, a mint panel listing curriculum links (Maths, Language, Health…), and "The benefits of Forest Schools" as four centred paragraphs.
- **Gallery:** none (see Gallery below).

## Gallery
- **Where:** no gallery page. Each nursery page has one **photo strip**: three full-bleed square photos side by side (desktop) or stacked (phone), between Parent information and Rooms. Rooms each have one photo. Forest Schools has five photos in rows.
- **Layout:** a static strip of 3, not clickable, no lightbox, no captions, no filtering.
- **Content:** children's faces in close-up (a toddler in a sun hat, children in cycle helmets, a practitioner with a baby). Room photos show children at tables. The building photos (stone turret, garden tyres) are the only ones without children.
- **Image handling:** JPEGs of about 1,000px at 200 to 280 KB each. No srcset seen. The total image weight on the Arnhall page is about 1.5 MB on first load.
- **Screenshot:** `vp-arnhall/sheet-desktop-1280-2.jpg` (left column, bottom: the three-photo strip; centre and right: the room rows).

## Video
| | Homepage hero | Homepage "Play Video" | Arnhall page |
| --- | --- | --- | --- |
| Where | Full-bleed hero background | A round play button in the hero opens a second video in a lightbox | Full-width inline block between "Play, Learn & Share" and "In safe hands" |
| Hosting | Vimeo (private hash link `c70a980a8d`), `background=1` | Vimeo 302448457 | Vimeo 302448457, `dnt=1` |
| Autoplay / muted / loop | Yes / yes / yes | No: plays on click | No: a custom poster image with a "Play Video" circle, then the Vimeo player |
| Controls | None (background mode) | Vimeo controls | Vimeo controls |
| Poster | None of its own: the first frame shows while it loads | n/a | Yes: a still of three children carrying a log (Divi image overlay) |
| Length and content | Short loop: a high, drone-style shot over the walled garden and play towers, with children as small figures | "Peartree & Arnhall Nursery", **107 seconds**, by Andy Semple Photography: "All about nursery!" | The same 107-second film |
| Captions | None | Unknown (Vimeo) | Unknown (Vimeo) |
| Phone | The background video **plays on a phone** at 390px (Vimeo serves HLS). It adds the Vimeo player script (~230 KB) and the video stream to a 3.3 MB page. | The lightbox didn't open in our phone test: the tap did nothing visible. | The iframe is 390×293. |
| Reduced motion | The CSS includes a `prefers-reduced-motion` rule (Divi), but the Vimeo background keeps playing. | | |

Screenshots: `video-home-390/iframe0-b.jpg` (hero frame with the play button on a phone), `video-home-1280/iframe0-a.jpg`, `video-arnhall-1280/iframe0-b.jpg` (poster with play button), and `../states/pt-playvideo-390.jpg` (after tapping Play Video on a phone: nothing opened).

**Effect:** the hero video gives the site life it doesn't otherwise have. The garden filmed from above makes the nursery feel big and outdoorsy, and you can't make out the children's faces. That framing suits our rules.

## Conversion
- One green "Book a Visit" button in the header leads to the contact page, where the form is hidden behind cookie consent.
- "GET IN TOUCH" and "CONTACT US" pills appear mid-page.
- Phone numbers are in the footer only (as text with a phone icon).
- No visit booking, no fees, no open day, no "what happens on a visit".
- A grandparent recruitment advert takes the homepage's best slot after the locations.

## Phone experience
- **Works:**
  - The video hero.
  - Big handwriting.
  - Stacked cards.
  - The accordions stack into a single column of nine tappable pills.
- **Doesn't:**
  - The cookie consent box covers the middle of the first screen.
  - There's no sticky call or visit button. "Book a Visit" sits behind the burger menu.
  - The "No Results Found" news card.
  - Long centred grey paragraphs at 13 to 14px that read small.
  - The "Our Aims" and "Where to find us" headings are **white text on a parallax background image that didn't render**, so they show as white on white (visible in `vp-arnhall/sheet-desktop-1280-3.jpg`).
  - The total phone page is about 13,000px long.

## Borrow this
1. **Room names in a handwritten display font.** "Dragonfly Room" at 55px in a marker hand is instantly friendly. Self-host a legible hand font (with a fallback stack), use it only for names and short headings (never body text), and check its contrast.
2. **Nine policies as a 3×3 grid of accordion pills.** Sessions, absence, menu, waiting list and closures each become one tappable pill. Use native `<details>`/`<summary>` so it works with a keyboard and without JS.
3. **A photo cropped into an arch or teardrop.** Border-radius on three corners turns a plain photo into a soft shape. Use it for photos of hands, the garden or a room.
4. **A wavy SVG edge on the footer** and on one or two section joins. It's cheap and adds charm.
5. **Video, our way: a short, silent "garden from above" loop.**
   - Self-host a 6 to 10 second MP4/WebM (under 1.5 MB, 720p) of the garden, the empty rooms or a slow walk through the door.
   - Film it high, wide or from behind so no child is identifiable. Better still, film before opening time.
   - Use `muted playsinline loop`, a poster image, and no autoplay under `prefers-reduced-motion: reduce`. Add a visible pause button (WCAG 2.2.2).
   - On a phone, show the poster only and offer a "Watch the garden" button.
6. **A longer "tour" film behind a poster and a play button**, never autoplaying, with sound only when the user starts it, a captions track (`<track kind="captions">`) and a transcript link. Host it ourselves rather than on Vimeo or YouTube, so there are no third-party cookies and no consent box.
7. **Personal one-liners in staff bios** ("enjoys cycling") with real photos and consent only.

## Avoid this
- A nursery page that isn't linked from the menu (Arnhall is invisible from the homepage).
- Broken or empty widgets: "No Results Found" news, the empty "Latest Reviews", a printed shortcode, a contact form that needs cookies to appear.
- White headings on background images that may not load.
- Stock photos (the grandparents advert) and identifiable children everywhere.
- English funding links (childcarechoices.gov.uk) on a Scottish nursery's page. Link to the Scottish 1140 hours information instead.
- Hiding fees completely.
- A single 1,450-word nursery page with long centred grey paragraphs.
