# Bright Starts Children's Nursery, Thornliebank (brightstarts.co)

Studied 13 October 2026. Crawl, screenshots and measurements are in `/private/tmp/claude-501/-Users-samuelosuh-codes-mapboard/c179b3f0-507a-47ce-a937-2eef0da893bf/scratchpad/study2-b/brightstarts/`. Paths below are relative to that folder.

## At a glance
- **Site:** https://brightstarts.co/thornliebank/ (the nursery's own mini-site) plus the group front door https://brightstarts.co/.
- **Who runs it:**
  - Bright Starts Children's Nurseries, a Scottish group of eight nurseries: Thornliebank, Greenock, Glasgow, Perth, Inchinnan, Dunfermline, Bridge of Allan and Blantyre.
  - Thornliebank is a purpose-built two-storey nursery in Spiersbridge Business Park, G46 8NG. It opened in 2013, changed owners and management in 2023, takes ages 12 weeks to 5, is open 7:30am to 6pm for 51 weeks, and is regulated by the Care Inspectorate.
  - WordPress with the "wp_kindergarten" theme and WPBakery.
- **Structure:** every nursery is its own WordPress sub-site (`/thornliebank/`, `/greenock/`…) with its own menu. The group homepage is only a picker.
- **Overall feel:** **the most colourful of my sites.** It has loud full-bleed bands of red, coral, pink, green and yellow, a fine diagonal texture on every band, illustrated daisies, grass and clouds, a tall thin hand-drawn display font and a coloured icon menu. It's busy and a little dated, but unmistakably "nursery".

## Site map
**Thornliebank header:** sun-and-star logo on the left; six menu items, each with a **coloured icon above the word**: Home (blue house), All About Us (pink person), Playrooms (pink mortarboard), Team (purple people), Information (green "i"), Contact (teal phone). The current page's label turns red. On a phone this becomes a red square burger button.

**Group header (brightstarts.co):** eight location links, each with a house icon in a different colour (green, pink, teal…).

**Footer (every page):** a full red textured band with the logo, "Socials" (big Facebook, Instagram and TikTok tiles), "Contact" (address, email, phone), "Opening Hours" (one sentence) and a Famly app logo, with headings in the hand-drawn font.

**Page types (28 crawled)**
- Nursery home `/thornliebank/` (1,192 words): hero, welcome band, why us, team carousel, playroom facilities, tabbed "Education / Learning Experiences / Friendship / Development", testimonials, playroom cards, "Your Children" accordion, gallery link.
- All About Us (226 words): one building photo, six centred paragraphs, gallery band.
- Playrooms (374 words): Baby, Toddler and Preschool rooms, each a three-photo collage plus text, with yellow and red slogan bands between them.
- Team (97 words): a group photo, then a carousel of portraits. Each person also has a near-empty profile page (3 words).
- Information `/pricingtables/` (666 words): a **price table**, opening times, extra hours, PDF forms, testimonials, map.
- Contact (56 words): an illustrated meadow with an embedded sign-up form (Famly), then a map.
- Gallery (0 words): a 30-thumbnail grid on 2 pages.
- Testimonial and team-category archive pages: thin, auto-generated.

## Homepage section by section
**Group homepage, brightstarts.co** (`vp-grouphome/`, 972 words, 4,388px tall on desktop):
1. A full-width photo of children and staff with arms in the air (slider).
2. A red textured band: "Hello & welcome to **'Bright Starts Children's Nurseries'**" in white and yellow.
3. "Location picker": 8 building photos, each with its name in red above and a green circular arrow tab on the right edge. A 4×2 grid on desktop; one per screen on a phone, as a slider with arrows.
4. A pink band: "What The Parents Say", with long quotes (222, 116 and 82 words) in white.
5. "Your Children": red text paragraph plus an accordion (Safety pink, Happiness blue, Education green).
6. A green band: "Your children's education and welfare are our main priorities", the Famly logo and an app quote.
7. A red footer with all eight addresses in a 4×2 grid.

**Nursery home, Thornliebank** (`vp-home/`, 1,192 words, 6,378px desktop, about 12 phone screens):

| # | Section | Words | Visual treatment |
| --- | --- | ---: | --- |
| 1 | Hero: the building (a blue-and-orange façade with a painted logo) | 3 ("EDUCATION THROUGH PLAY" slide label) | Full-width photo, Revolution Slider. |
| 2 | Welcome band: "Welcome to **'Bright Starts Nursery Thornliebank'**" | 6 | Red `#E5231F` band with diagonal texture; white and yellow `#FFDD00` text, 38px Dosis bold. |
| 3 | "Why Bright Starts Children's Nursery" | 120 | White. Amatic SC 53px with the name in red, a short teal underline bar, centred grey paragraphs, one photo, a red "Read More" button. |
| 4 | "Meet Our Educators" | 25 + names | Coral `#DD7373` band; a 4-up carousel of square portraits on a patterned wallpaper background, names in Amatic 48px. |
| 5 | "Playroom Facilities" | 45 | White; text plus a photo of children in hard hats. |
| 6 | Tabs: Education · Learning Experiences · Friendship · Development | 30 to 60 per tab | Coral band; the tabs are coral pills, and the active tab is white with a red Amatic heading. On a phone the tabs become an accordion. |
| 7 | "What The Parents Say" | 106 | Pink `#D75894` band; one long quote at a time (slider). |
| 8 | "Our Playrooms" | 106 | Pale sky band with **illustrated clouds**. Four room cards, each in its own colour (Baby purple `#6F4793`, Tweenies pink `#DC5F9A`, 2–3 orange `#EC8D6C`, 3–5 orange): photo of the empty room, Amatic name, ratio line, red "More Info" button. |
| 9 | "Your Children" | 113 | White fading into **an illustrated meadow of daisies, grass and a ladybird** (`bg-vector-lg.png`). Red bold paragraph left, a three-colour accordion right. |
| 10 | "Your children's education and welfare are our main priorities" | 8 | Red text over the illustrated grass. |
| 11 | "Gallery" | 6 | Green `#82B849` textured band with an outline button "CLICK HERE TO VIEW OUR FULL GALLERY". |
| 12 | Footer | 60 | Red textured band. |

**Phone:** the same order. The hero becomes a short building photo; the bands turn into tall coloured screens one after another. Scrolling feels like turning pages of a picture book. (`vp-home/sheet-phone-390-1.jpg`)

## Why it feels colourful and fun
- **Palette (computed):**
  - Pillar-box red `#FE0000` and `#E5231F` for bands, buttons and heading accents.
  - Coral `#DD7373`, pink `#D75894` / `#DC5F9A` and green `#82B849` / `#87BB50` for bands.
  - Purple `#6F4793` / `#6D4690` for the Baby room and underline bars.
  - Orange `#EC8D6C`, yellow `#FFDD00` for highlight words and the stars, sky blue `#35B6D0`.
  - Pale grey `#E9E9E9` / `#F8F8F8`.
  - Body text is grey `#9C9C9C` (too light) and headings are `#575656`.
- **How colour is used:**
  - **Whole sections are solid colour.** About 60% of the scroll is a red, coral, pink, green or yellow band.
  - Each band carries **a fine diagonal-line texture** (an image overlay), so flat colour looks like paper or felt.
  - Each room has its own card colour.
  - Inside white sections, **one or two words of a heading turn red** ("Why **Bright Starts Children's** Nursery").
  - In welcome lines the nursery name turns yellow.
- **Shapes:**
  - Mostly square: small 3 to 5px radii.
  - Short **thick coloured underline bars** under every section heading (teal, purple, white).
  - Circular avatars only in the group's location cards (100%).
- **Illustration:**
  - A **meadow**: big daisies, grass blades, a ladybird and a cartoon girl in pigtails on the contact page.
  - Puffy **clouds** behind the playroom cards and the price table.
  - The logo is a cartoon sun with a star.
  - Together this is the most "children's book" thing on the site, and it involves no children's photos.
- **Icons:** the **coloured header icons** (one colour per menu item), Font Awesome glyphs in accordion headers (child, smile, book), and a child icon in a circle over the price table.
- **Photography:**
  - Bright, flash-lit indoor shots: children with play dough, paint, dinosaurs and hard hats.
  - Room photos are often **empty rooms** in natural wood.
  - The building façade is itself colourful (blue walls, orange and pink glass).
  - Staff portraits are taken against a patterned wall.
  - Children are identifiable in most shots.
- **Type:**
  - **Amatic SC 400**, a tall thin hand-drawn capital font, for all headings: 50 to 62px H1s, 39 to 53px H2s, 48px names.
  - **Dosis** (rounded, condensed) for body and bold slogans: 18px body, 38px bold slogans.
  - The thin, tall Amatic is very playful but hard to read at small sizes and in grey.
- **Motion:** Revolution Slider in the hero, Owl-style carousels for the team, testimonials and locations, a 420ms body transition and WPBakery fade-ins. No hover play beyond button colour.
- **Spacing:** generous padding inside bands (80 to 100px), but text blocks inside are full-width and centred.

## How it keeps text light
- **Slogan bands instead of paragraphs:** "Over **30 Years** Experience in the childcare & development sector", "Purpose **built play** areas to capture your child's interests", "**Fully** skilled practitioners to get your child ready for primary school". One sentence on a coloured band, with key words in yellow, breaks up the playrooms page.
- **Tabs and accordions** hide four "Education / Learning Experiences / Friendship / Development" texts and three "Safety / Happiness / Education" texts.
- **Room cards** carry one line (the ratio) and a button. Detail is on the Playrooms page.
- **Prices are shown big**: "£66.00 Full Day Sessions", "£38.00 Half Day Sessions", with the number in 30px blue Dosis. One glance answers the main question.
- **Weak points:**
  - The group homepage has a 222-word testimonial.
  - The "Your Children" paragraph is 113 words of bold red text.
  - Centred grey 14 to 16px paragraphs throughout.

## Inner pages
- **Rooms (Playrooms):** for each room, a **three-photo collage** (three tall photos edge to edge, about 480px), then the room name in Amatic, a pink underline, "AGES 12 Weeks – 2 Years" in yellow caps, 2 short paragraphs and a red "Contact Us" button. Slogan bands (yellow, red, yellow) separate the rooms. (`vp-playrooms/sheet-desktop-1280-1.jpg`)
- **Fees (Information):**
  - A cloud background, a white card, an icon in a circle, "All Ages and Rooms" in red, then two bordered rows with the price.
  - One line on what's included: meals, snacks, nappies and wipes.
  - Session times, then "Email us here" and "Call us on" in large type.
  - Then three columns: Opening Times / Extra Hours / Forms (PDF prospectus and registration form).
  - Testimonial band (red) and "How to find us" (yellow band + map).
  - (`vp-information/sheet-desktop-1280-1.jpg`)
- **About:** one building photo, six centred paragraphs, a green gallery band.
- **Team:** a red header band ("TEAM / MEET OUR EDUCATORS"), a whole-team group photo, then a 3-up portrait carousel with name and role. Individual pages are nearly empty.
- **Contact and visits:** "Send Us Your Enquiry" / "Click Below" in red Amatic over the illustrated meadow, with a Famly sign-up form image in the middle. The actual enquiry happens in the Famly form. There's no booking calendar. Email and phone sit in the footer.
- **Inner page header pattern:** every inner page opens with the **same red textured band**: the page name in white caps and a one-line subtitle in yellow caps ("PLAYROOMS / FOR A REAL HEAD START IN LIFE", "NURSERY INFORMATION / NURSERY PRICES & DETAILS", "GALLERY / TAKE A LOOK AT OUR FABULOUS FACILITIES").

## Gallery
- **Where:** its own page `/thornliebank/gallery/`, reached from the green "Gallery" band at the foot of the home and About pages. The homepage shows no photos from it, just a button.
- **Layout:** Photo Gallery by 10Web (`bwg`). A **thumbnail grid**: 5 columns × 6 rows on desktop (about 88×60px thumbs, very small) and 2 columns on a phone. **Pagination** "1 of 2" (30 per page, about 36 in all), plus a side arrow either side of the grid.
- **Opening:** a tap opens the plugin's **lightbox**: a black overlay, a large image, a filmstrip of thumbnails along the top, prev/next arrows, and a toolbar with play (slideshow), fullscreen, expand, info, Facebook and Twitter share.
  - The URL changes to `#bwg0/356`.
  - In our keyboard test **focus stayed on the thumbnails behind the overlay** (Tab moved through `a.bwg_lightbox` links under it), and there's no `role="dialog"`. Escape closed it.
  - Screenshot: `../gallery/bs-390-open.jpg`.
- **Captions and filters:** none. The alt text is the file name ("bsg building front pic1", "bsg_room_photo1(edited)").
- **Images:** 500px-wide thumbnails, lazy loaded (`data-src`), about 2.6 MB for the 30 thumbs.
- **Content, in order:** 7 photos of the building front, then rooms (some edited), then activity photos with identifiable children (sand, paint, hard hats, babies). The building and empty-room photos are the ones we could use.
- **Screenshots:** `vp-gallery/sheet-desktop-1280-1.jpg` (grid), `../gallery/bs-390-grid.jpg` (phone grid), `../gallery/bs-390-open.jpg` (lightbox on a phone).

## Video
- **None.** No `<video>`, no YouTube or Vimeo iframe on the group home, the nursery home or the playrooms page (checked at 390 and 1280px).
- The site gets its motion from sliders instead.
- **Phone performance is still poor without video:**
  - The group homepage loads **50 MB** on a phone (4.5 MB PNG holding page, plus 3 to 4 MB unresized camera JPEGs used as location thumbnails).
  - The Thornliebank home loads 9.8 MB (a 1.2 MB meadow illustration PNG, 0.4 to 0.7 MB room photos).
  - A short self-hosted video would have weighed less than these images.

## Conversion
- No sticky button and no "Book a visit". Calls to action are generic: "Read More", "More Info" on each room card (goes to Playrooms), "Contact Us" under each room.
- The real conversion points are the **price, email and phone in big type** on the Information page and in the footer.
- The enquiry form is Famly's (third party).
- No visit booking, no open days, no waiting list information, no funding information (1140 hours isn't mentioned).

## Phone experience
- **Works:**
  - Bands become full screens of colour, which is cheerful.
  - Big Amatic headings.
  - The price card is readable.
  - The footer has the address and hours.
- **Doesn't:**
  - Grey `#9C9C9C` body text on white fails contrast (about 2.7:1).
  - The thin Amatic fails at small sizes.
  - No phone link in the header.
  - Carousels for team, testimonials and locations with tiny arrows.
  - 50 MB on the group homepage.
  - The gallery thumbnails are tiny.
  - The lightbox doesn't manage focus.

## Borrow this
1. **Full-bleed colour bands with a subtle texture.** Alternate 3 or 4 brand colours as whole sections, and add a 2 to 4% opacity SVG pattern (diagonal hatch, paper grain) as a CSS background. That makes flat colour feel crafted at almost no weight.
   - Keep body text in its own white or cream card when contrast demands it.
   - Check every text colour against its band: white on `#E5231F` passes at large sizes only.
2. **One colour per room.** Each room card, header and badge takes its own colour, so Baby is always purple and Preschool always orange. Parents learn the colour code.
3. **A coloured icon above each menu word** (house, person, book, people, info, phone), each icon a different brand colour. Keep the menu to six or fewer items, with labels as real text.
4. **Inner page header band: the page name plus one yellow subtitle line** ("NURSERY INFORMATION / Prices and details").
5. **Slogan bands between sections:** one sentence, two words highlighted. Only use facts the nursery confirms ("Open 51 weeks a year").
6. **Illustrated scenery instead of child photos.** A meadow strip, clouds and a sun drawn as lightweight SVG (not a 1.2 MB PNG). It brings the picture-book feeling without consent issues.
7. **The price, big, on one card,** with what's included listed under it, and "phone to check" where the nursery hasn't confirmed something.
8. **Gallery, our way:**
   - Its own page, plus a 4 to 6 photo strip on the home page.
   - Photos of rooms, the garden, food, artwork, hands and children from behind.
   - A simple CSS grid (2 columns on a phone, 3 to 4 on desktop) of real `<a>` links to full-size images, with written alt text ("Baby room sleep corner with wooden cots"), `loading="lazy"`, and `srcset` at 400/800/1200px WebP.
   - Optional room filter buttons ("All · Baby · Toddler · Preschool · Garden") as real buttons with `aria-pressed`.
   - If we add a lightbox, use a native `<dialog>` with focus moved in, Escape to close, focus returned to the thumbnail, and no autoplaying slideshow.
9. **Video, our way:** none is needed here. If we add one, a 6 to 10 second muted, poster-first loop of the colourful building façade or an empty room, self-hosted at under 1.5 MB, not autoplaying under `prefers-reduced-motion`, with a pause button.

## Avoid this
- Grey body text and thin hand-drawn fonts for anything longer than a heading.
- Carousels for team, testimonials and the location picker (our rules ban them). Show all items in a grid.
- 50 MB of unresized photos. Use resized WebP and lazy loading.
- File names as alt text, and a lightbox that leaves focus behind.
- Nearly empty auto-generated pages (team profiles, testimonial archives).
- Third-party enquiry forms and share buttons (Facebook, Twitter) inside the gallery.
- Leaving "Class Size:" blank on every room card. Don't show a field we can't fill.
