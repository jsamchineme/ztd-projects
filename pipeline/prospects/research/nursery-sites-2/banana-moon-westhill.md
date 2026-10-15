# Banana Moon Westhill (and what is franchise template versus local)

Studied 13 October 2026: full crawl (40 pages), screenshots at 390px and 1280px of the homepage and 9 menu pages, and the stylesheet (`css/app.css`, 451 KB). Scratchpad folder: `study2-a/bm-westhill/`. Read `banana-moon-aberdeen-international.md` first. This file covers only what differs and what that tells us about a franchise template.

## At a glance
- **Site:** https://www.bananamoon-westhill.co.uk/
- **Who runs it:** Cygnus Enterprises Ltd (the same company and the same owner, Will Hanekom, as Aberdeen International), trading as Banana Moon Day Nursery. The nursery is at Westhill Business Park, 6B Peregrine Road, Westhill AB32 6JL, phone 01224 742277. It is open 7.30am to 6.30pm and scores 9.9 from 63 reviews on daynurseries.co.uk.
- The build, menu, page set, typography and colours are identical to Aberdeen International.

## Site map
The menu, footer and page types are the same as Aberdeen International. Westhill's News is busier: **monthly "NURSERY NEWS" posts** (April to October 2026, 400 to 600 words each), Bookbug sessions, the giant African snails, a Kiltwalk fundraiser and a book appeal. It also links 4 downloadable documents (menus and newsletters).

## Franchise template versus local

| Element | Franchise (identical on both) | Local (differs) |
| --- | --- | --- |
| Header, nav, pills, footer layout | Yes | Address, ICO number |
| Hero frame (3 jungle PNG layers, teal wash, wavy edge) | Yes | **Slide photos** (Westhill: a girl in a spotted raincoat on a ride-on outdoors; Aberdeen: a girl with magnetic sticks indoors) and the phone number |
| Headline "Find a place to grow their world" | Yes | Nursery name in bold |
| Intro paragraph and 4 outline cards | Yes, word for word | – |
| Awards slider | Franchise award artwork (Midnight Moon Awards) | Which awards are shown. Westhill adds a Top 20 2024 badge next to NDNA. |
| Owner welcome band (orange, cat and crab on the wave) | Layout and first paragraph | **Westhill adds a parent testimonial card** (white card, outline heart icon, orange text, 2-dot slider) and a longer welcome (223 words against 69) |
| Our Moons (4 rooms, stat cards, FAQs) | Yes, identical text (349 words) | – |
| Our World, Facilities, Curriculum, Nutrition, Parent App, Bright Futures | Yes, nearly identical (±10 words) | Our World: **Westhill embeds 3 parent quotes in a slider**, while Aberdeen shows the daynurseries widget |
| Gallery page frame (seaside illustration, intro text) | Yes, same 147-word intro | **The photos**: Westhill has 11 WebP files (`/storage/1.webp`…), Aberdeen 18 original JPGs |
| Sky TV Ad | Same agency-hosted MP4 | – |
| News | Template | Entirely local, and the most local content on either site |
| Careers | Template text | Email address |

**What this tells us:** a franchise gets a *strong, recognisable look* from one illustrated frame, one wave, one palette and one icon set. The **local identity lives in only four places**: the hero photos, the gallery photos, the owner welcome and the news. That is a good model for our templates: the design system carries the "fun", and the client supplies a small number of real assets (photos of rooms, a manager's note, news). A Westhill parent learns almost nothing specific from Our Moons or Our World. A good template should leave clear slots for local facts (room names, ratios, garden features) instead.

## Homepage section by section
The same as Aberdeen, with two differences. Section 4 has the **testimonial card on the right** (desktop) or below (phone), and the welcome is longer. Editorial copy is about **350 words**. Desktop is 4,330px and phone 6,319px tall.

## Why it feels colourful and fun
The same as Aberdeen. CSS confirms `@import url(https://use.typekit.net/dxl8mly.css)` for Sofia Pro and Sofia Pro Soft. The wave is an inline `<svg viewBox="0 0 1132 175.83" class="blue">`, recoloured by class. The hero illustration is three PNG layers (`/img/banner/vectors/1.png`, `2.png`, `3.png`) over the photo slides, so the **illustrated frame stays still while the photos change**. The "photo inside a cartoon world" effect is cheap to build.

## How it keeps text light
The same devices: icon cards, stat cards, icon tabs and FAQs. Westhill puts more text on the homepage (the 223-word welcome), and it reads heavier on a phone: the orange band runs 1,120px tall.

## Inner pages
The same patterns. The monthly newsletter posts are long, plain text blocks with one photo. They read as a diary, not a design.

## Video
The same national advert on the "Our Sky TV Ad" page (31 seconds, 11.8 MB MP4 in an iframe, native controls, no poster, no captions, no autoplay). There is no local video. Screenshot: `bm-westhill/vp/our-sky-tv-ad/1280-1.png`. Frames: `video-frames/bananamoon-skyad-sheet.png`.

## Gallery
- **Layout:** the same 4-column grid, 11 photos, no lightbox, no captions, no filter. The images are CSS backgrounds with hidden `<img>` whose **alt text is "2", "12", "123", "1234"…**, so the alt text is junk.
- **What the photos show:** mostly room set-ups (a small-world dinosaur tray, the welcome area, a construction corner, an emotions puppet basket, a block area, a reading den under fabric). **Two photos are groups of children with identifiable faces** (a "Welcome" wall group photo and a dressing-up day). Aberdeen's set has none, which shows that the same template can be filled more or less safely.
- **Screenshots:** `bm-westhill/vp/gallery/1280-1.png`, `bm-westhill/vp/gallery/390-1.png`.

## Conversion
The same as Aberdeen. Brochure download, callback with a time picker, phone in the hero, Contact modal.

## Phone experience
The same. The hero collapses to a blue block with two pills. The long welcome and the testimonial make the orange band tall.

## Borrow this
1. **Fixed illustrated frame, swappable photo:** a still decorative layer (drawn shapes and plants) around one real photo of the nursery building or garden. Each client swaps only the photo. Use one still photo, not a slider.
2. **Clear local slots in a shared design:** the template defines where the nursery's own facts go (room names and ages, ratio, garden features, manager's note, opening hours), so pages are never generic.
3. **One parent quote card in a coloured band** next to the welcome. Use only real quotes the client has permission to use, with initials and a date, and no slider.
4. **Monthly news as a simple list** with a date chip and one photo of an activity (hands, artwork, food), not a wall of text.
5. **Video:** if the client has no video, don't fake one. A good alternative is a short self-hosted "walk round the rooms" clip filmed after hours (no children), with a poster, captions and `preload="none"`.
6. **Gallery alt text written as captions** that a parent would want anyway ("Small-world dinosaur tray with bark and pine cones"). They double as visible captions.

## Avoid this
- **Template copy that says nothing local** on inner pages (Our Moons and Our World are word for word on both sites).
- Group photos of children in the gallery, and junk alt text.
- A testimonial slider with dots (it hides quotes).
- The same third-party load as Aberdeen (Typekit, Facebook, GTM, reCAPTCHA, Cookiebot).
