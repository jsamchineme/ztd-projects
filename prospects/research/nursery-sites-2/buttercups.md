# Buttercups Day Nurseries

Studied 13 October 2026: full crawl (32 pages), screenshots at 390px and 1280px of the homepage and 11 inner pages (2 nursery pages, About, Montessori, Forest School, Funding guide, a fees page, Join our Team, Contact, Healthy Eating, Settling In), and computed styles. Scratchpad folder: `study2-a/buttercups/`.

## At a glance
- **Site:** https://www.buttercups-nursery.co.uk/
- **Who runs it:** a family-run group of 10 nurseries in west London (Acton, Ealing, Chiswick ×2, Isleworth, Syon Park, Teddington, Wizard House) and Chalfont St Peter in Buckinghamshire. Kew is "coming soon". The owner and managing director is Carol Whitehouse, who opened the first nursery in her own home in 1980. Head office is at 24a Popes Lane, Ealing W5 4NT. The positioning is "Where Montessori meets Forest School", with Ofsted ratings and Top 20 Nursery Group badges for 2018 to 2026.
- **Tech:** a hand-built Bootstrap 5 site (Bootstrap Studio). Montserrat comes from Google Fonts' CDN. Also present: animate.css, AOS, baguetteBox (lightbox, from cdnjs), Bootstrap carousels, a Google Maps embed, the daynurseries widget, and Microsoft Bookings for viewings. The footer says © 2021.

## Site map
- **Header (sticky):** the logo (a yellow buttercup with a green swoosh), then Our Nurseries (dropdown, 10), About Us (dropdown: About, Montessori, Forest School, Clubs, Healthy Eating, Settling In, Safeguarding, Policies, Previous News), Funding (dropdown: Guide to Funding, per-nursery fee pages), Join our Team (Your Career, Apprenticeships, Vacancies), Contact. A green **"Book a Viewing"** button with a hard 2px offset shadow.
- **Footer:** about 20 award and council logos, a **large cow mascot holding a buttercup**, social icons, email, phone and head office.
- **Page types:**
  - **Nursery page** (×10, 1,150 to 1,450 words): Ofsted badge, name, tagline, award badges, a green "extremely popular, register soon" banner, a long text column next to a stack of rounded photos, then a 10-photo grid, a clubs panel, a map and reviews.
  - **Topic pages** (Montessori, Forest School, Clubs, Healthy Eating, Settling In, Safeguarding): text with a photo grid.
  - **Funding guide** (990 words).
  - **Per-nursery fee pages** for under 3s and over 3s (about 950 words plus **fee tables as images**).
  - **Careers** pages (3) and job descriptions.
  - **Contact** (70 words: email, phone, and the questions to answer when asking about fees).
  - **Previous news** (3,849 words).

## Homepage section by section
Editorial copy is about **600 words** (654 measured). Desktop is 6,152px (7.7 screens), phone 11,826px.

| # | Section | Desktop | Phone | Words |
| --- | --- | --- | --- | --- |
| 1 | Header | Logo, 5 menu items, green "Book a Viewing" | Logo and hamburger | – |
| 2 | Hero | **One image** (2479×892 JPG): leafy green branches framing the logo set large, with a **cartoon pink butterfly** top right. No headline text in HTML. | The same image shrunk to 240px tall | 0 |
| 3 | Title | H1 "Where Montessori meets Forest School", green `#1eb53a`, 40px Montserrat 500 | Wraps to 3 lines | 5 |
| 4 | Welcome | Three H3s (Welcome, Outstanding Childcare, Success – the Buttercups Philosophy) with 4 paragraphs on the left. Two square rounded photos on the right (a staff member high-fiving a baby; the vegetable patch). A **handwritten-style orange slogan image** ("Learning through play the Buttercups way"). | Photos inline between paragraphs. It reads as a long text wall on a phone. | 268 |
| 5 | Our Nurseries | A grey band (`#ced4da`). A 4-column grid of **photos of each nursery building** with a **green name plate in a handwritten font** (the plate is part of the image), 20px radius. | One per row (10 tall cards) | 2 |
| 6 | Four pillars | Four equal tiles alternating **solid green / grey**: white icon (certificate, mortarboard, tree, football), title (Ofsted Outstanding, Montessori, Forest School, Clubs), a 10-word line | Stacked, each a full-width colour block | 51 |
| 7 | Photo carousels | **Three pebble-shaped photo carousels** (img `border-radius:100px`) that autoplay every 3 seconds: painting with broccoli, mark-making, floating and sinking, the beach role-play shop, mud cakes, a Gruffalo party. Most shots are **hands, the back of a head, or a child looking down**. | One per row. The first was blank in both captures. | 6 |
| 8 | Nursery News | A mint band (`#c7e1cc`), 3 posts, each a photo carousel next to text (New Forest School in Acton, Buttercups Fete 2026, New Nursery opening) | Stacked | 276 |
| 9 | Award wall | About 20 logos (Ofsted, NDNA, Food Hygiene 5, STAR, Superstar Award, 9 × Top 20 badges, 5 councils) | Wraps | 0 |
| 10 | Footer | The big cow mascot, social icons, contact | Same | 34 |

## Why it feels colourful and fun
It is the least "designed" site in this batch, and its fun comes from **characters and real photos**, not layout.

- **Palette** (computed):

  | Role | Hex |
  | --- | --- |
  | Brand green | `#1eb53a` (headings, buttons, tiles) |
  | Mint | `#c7e1cc` (news band) |
  | Light grey | `#ced4da`, `#adb5bd` (bands and tiles) |
  | Yellow | the buttercup logo |
  | Pink | the butterfly |
  | Orange | the slogan |

  The body text is near-black `#212529`. The page is mostly white with green.
- **Mascots:** a goggle-eyed **pink butterfly** in the hero and a **cartoon cow holding a buttercup** in the footer. The cow also turns up on a fete chalkboard in a photo, so it is a real house character.
- **Handwriting:** the slogan and the nursery name plates are a handwritten typeface **baked into images**. It adds warmth, but it is inaccessible and can't be translated.
- **Shapes:** rounded photos (20px), **pebble-shaped carousels** (100px radius on a square), and alternating green and grey tiles.
- **Photography:** real, unstaged, bright phone photos. The nursery-building photos with name plates make each location feel real. The activity photos are close-ups of materials and hands: broccoli painting, mud cakes, a rainbow of sweets dissolving in water.
- **Type:** Montserrat 400 and 500. H1 is 40px in green, H3 28px, body 16px with a 24px line height. The "Book a Viewing" button is Montserrat 20px, `#1eb53a` with white text, 8px radius and a **hard offset shadow** `2px 2px 0 #343a40`, which gives a playful sticker feel.
- **Motion:** auto-advancing carousels (3 seconds), animate.css and AOS loaded (one fade used).
- **Spacing:** Bootstrap defaults, fairly tight, with sections butting together.

## How it keeps text light
It doesn't, really. The homepage has 268 words in the welcome before any pictures, and nursery pages run 1,300 words. The light parts are:
- the **building-photo grid** (2 words of HTML; the names are in the images);
- the **four pillar tiles** (icon, title, 10 words);
- **photo carousels with no text**;
- topic pages that end in a **photo grid with no captions**.

## Inner pages
- **Nursery page (Acton, Chalfont):** a header row with the Ofsted badge, the name in green, a tagline ("A homely nursery, highly rated by parents") and 2 to 3 award badges. Then a **green scarcity banner** ("this nursery is extremely popular so we recommend registering as soon as possible"). Then a 540 to 600 word text column (Great Facilities, Our Montessori Approach, Child-centred Care, NEW Forest School!, Great Team, Safety and Well-being, Practical Information) beside **3 to 4 stacked rounded photos** (building front, garden, forest area). Then a **full-bleed 10-photo grid** (2 rows × 5, 20px radius). Then a half photo, half green Clubs panel (Drama, Cooking, Science Club, Magic Train…), a map and the daynurseries reviews. The head teacher is named in the text (Acton: Toni, 25 years).
- **Fees:** each nursery has two fee pages (under 3 and over 3). They explain the stepped hourly pricing, funded hours windows (for example "11am to 6pm, Tuesday to Thursday"), the registration fee (£60) and a surcharge rule, but **the actual price tables and the council funding rates are images** with empty alt.
- **About:** history (Carol, 1980), a photo of Carol reading to children under a red-and-white striped canopy, a mission list of 8 "▶" bullets, and a **gallery** of 8 photos with a lightbox.
- **Contact:** email and phone only, plus a list of the five things to tell them when asking about fees (nursery, age, days, start date, funding). Viewings go to **Microsoft Bookings**.
- **Careers:** apprenticeships, vacancies, job descriptions.

## Video
**None.** No `<video>`, no YouTube or Vimeo iframes on any page crawled.

## Gallery
- **Where:** in three places. A **10-photo grid on each nursery page** (full-bleed, 5 across on desktop, 20px radius). **Photo-gallery sections with a lightbox** on About (8), Montessori, Forest School and Join our Team (13 to 16 images each). **Carousels** on the homepage (three of 3 photos, plus news carousels of 6 and 9).
- **Layout:** a uniform square grid. baguetteBox.js lightbox on the "photo-gallery" sections (loaded from cdnjs). No captions, no filtering by room or nursery.
- **Sizes:** **no lazy loading anywhere** (0 of 62 images on the homepage). Several originals are huge (Forest School square 3443×3449 shown at 474px, 2000×2000 photos shown at 451px). **40 of 62 homepage images have no alt.**
- **What the photos show:** a mix. Many are activity close-ups and children from behind (painting, mud kitchen, eggs in an incubator, the forest area, the garden playhouse), but the nursery-page grids include **several clearly identifiable children's faces**. One file is literally named `3 children (boy removed) - needs permission.jpg`, which shows the provider is wrestling with consent.
- **Screenshots:** `buttercups/vp/acton-html/1280-2.png` (10-photo grid), `buttercups/vp/home/390-5.png` (pebble carousels on a phone), `buttercups/vp/about-us-html/1280-1.png`.

## Conversion
- A green **Book a Viewing** button in the sticky header on every page, linking to Microsoft Bookings (a third-party calendar).
- An "extremely popular, register soon" banner on nursery pages.
- Contact is email or phone (a shared head-office number), with a checklist for fee enquiries.
- In-text links ("Book a viewing now to come and see it for yourself!").

## Phone experience
- The sticky header and hamburger work. The hero logo image becomes a 240px strip.
- The welcome is a long text wall.
- The 10 nursery cards stack into about 2,600px of scrolling, and the pillar tiles become tall colour blocks.
- The pebble carousels look good full width, but one was blank, and the page is 11,800px tall with all images loaded eagerly.
- `viewports.mjs` found no layout flags.

## Borrow this
1. **A photo of each building or room with a name plate:** a real photo of the nursery front or each room, with the name set in a friendly typeface in HTML (not in the image), on a coloured plate. It instantly says "this is a real place".
2. **Pebble or soft-blob photo frames:** a big border-radius (100px on a square, or an organic `border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%`) for photos of rooms, materials and hands. It is fun with zero text.
3. **Close-up activity photos with no faces:** painting with broccoli, mud cakes, mark-making, sinking and floating. This is the best model in the batch for "fun without identifiable children": hands, materials, the backs of heads.
4. **A sticker-style button:** a solid colour, a 2 to 3px hard offset shadow in a dark ink colour, and a small press-down transform on `:active` (and none under reduced motion).
5. **A house mascot** used sparingly (once in the hero, once in the footer), drawn for the client.
6. **Alternating colour tiles for the 3 to 4 pillars** (icon, 2-word title, 10-word line). Keep text contrast AA: white on `#1eb53a` is about 2.9:1 and fails, so use a darker green (about `#15803d`) or dark text.
7. **Fees in a real HTML table,** never an image, plus a "what to tell us when you ask about fees" checklist on the contact page. It is useful and honest.
8. **A gallery under our rules:** a square grid of 8 to 12 room, garden, food and artwork photos per nursery page, `loading="lazy"`, WebP at 2 sizes, real alt text that doubles as a visible caption, and an optional `<dialog>` lightbox that traps nothing (Esc closes, focus returns, arrow keys move, a visible close button).

## Avoid this
- Text baked into images (slogans, nursery names, fee tables, funding rates).
- Autoplaying carousels with 3-second intervals and no pause.
- No lazy loading and 3,000px originals.
- Google Fonts from the CDN, a lightbox from cdnjs, Microsoft Bookings and Google Maps. All are third parties.
- A 268-word welcome at the top of the homepage.
- An award logo wall of 20 badges, which is noise on a phone.
- Low-contrast white text on mid-green and grey tiles.
