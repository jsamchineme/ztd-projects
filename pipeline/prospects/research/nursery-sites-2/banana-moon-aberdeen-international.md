# Banana Moon Aberdeen International

Studied 13 October 2026: full crawl (37 pages), screenshots at 390px and 1280px of the homepage and all 12 menu pages, computed styles, and the inline SVG and CSS. Scratchpad folder: `study2-a/bm-aberdeen/` (screenshots in `vp/<page>/`, crawl in `source/`). The sister site, Banana Moon Westhill, is compared in `banana-moon-westhill.md`.

## At a glance
- **Site:** https://www.bananamoon-aberdeeninternational.co.uk/
- **Who runs it:** a Banana Moon franchise. The operating company is Cygnus Enterprises Limited, trading as Banana Moon Day Nursery. The owner, Will Hanekom, signs the welcome. The same owner runs Westhill. Banana Moon is an English franchisor, and every franchise site runs on one shared Laravel/Vue build with a per-nursery content database.
- **Setting:** a day nursery in Aberdeen International Business Park, Dyce (AB21 0BR). It takes children from 3 months to 5 years, is open 7.30am to 6.30pm, and is "open all public holidays". It is a funded provider with Aberdeen City Council. It scores 10 from 38 reviews on daynurseries.co.uk.
- **Tech:** Sofia Pro and Sofia Pro Soft come from Adobe Typekit (`use.typekit.net`). Also on the page: Cookiebot, Google Tag Manager, a Facebook pixel and SDK, reCAPTCHA, the daynurseries.co.uk review widget, and Flickity sliders.

## Site map
- **Header:** Home, Our Moons, Our World (dropdown: Facilities, Nutrition, Curriculum, Parent App), Bright Futures, Gallery (Our Photos, Our Sky TV Ad), News, Careers. There are two pill buttons: **Contact Us** (blue `#0091da`) and **Download Brochure** (yellow `#fac32d`).
- **Footer:** a navy band (`#0e3f57`) with the address, company number, ICO number, privacy and cookies.
- **Page types:**
  - **Our Moons** (rooms): four tab-cards (Baby Moons from 3 months, Teenie Moons up to 2, Mini Moons for toddlers, Full Moons up to 5). Each opens a text column next to three tall white "stat" cards, then an FAQ accordion.
  - **Our World:** an orange hub with four outline icon cards linking to the subpages, then reviews and the contact block.
  - **Facilities:** seven icon tiles that act as tabs (fingerprint entry, CCTV, outdoor play, sleep room, interactive screen, defibrillator, LifeVac). The selected tile fills blue and shows a text-and-photo panel.
  - **Nutrition, Curriculum, Parent App:** text with one photo each, at 250 to 430 words.
  - **Bright Futures:** the franchise's own early learning programme.
  - **Gallery:** 18 photos of empty rooms.
  - **Sky TV Ad:** a 31-second video.
  - **News:** about 30 local posts with emoji in the titles.
  - **Careers.**
  - **Download Brochure:** a lead form.
- There is no fees page and no separate contact page. "Contact Us" in the menu is `javascript:void(0)`, which opens a form.

## Homepage section by section
Visible editorial copy is about **200 words**. The crawler measured 13 words because most text is rendered by script. My count adds the form labels and leaves out the review widget.

| # | Section | Desktop (1280) | Phone (390) | Words |
| --- | --- | --- | --- | --- |
| 1 | Header | Logo (a yellow banana-moon mascot in a blue disc), 7 links, 2 pills | Logo and hamburger | – |
| 2 | Hero | A full-bleed photo slider under a teal wash, framed by **three illustrated PNG layers**: a jungle with a tiger, a lion, a chameleon, birds, a snake, vines and flowers. A white **wavy bottom edge**. Centred "Find a place to grow their world", "at Banana Moon **Aberdeen International**", a yellow "Download Brochure" pill and an outline "Call us on 01224 772063" pill. Prev/next arrows. | **The photo and illustrations are dropped.** A solid blue (`#0091da`) band with a wavy top edge, the same headline and two pills. 364px tall. | 38 |
| 3 | Intro and cards | H1 "Excellence in Children's Day Care" (blue, 36px), one 45-word paragraph. A 2×2 grid of **outline cards** (1px grey border, 20px radius), each with a thin line icon (moon, book-tree, rosette, apple), a bold title, a 5-word line and a **coloured squiggle** below (purple, blue, teal, yellow). On the right, an awards slider ("Under the Sea" Midnight Moon Awards artwork on navy) and an NDNA logo. | Cards stack, one per row. The awards slider follows. | 85 |
| 4 | Owner welcome | An **orange band** (`#f08650`) with wavy top and bottom edges, a flying bird pair, a 60-word welcome in white and a handwritten signature image. A **cartoon cat and crab** sit on the wave edge into the next band. | Same | 69 |
| 5 | Contact | A **blue band** with the address, hours and "Open all public holidays" in bold, a yellow "Contact Us" pill, and a contact form on blue with white outline inputs. | Stacked | 133 |
| 6 | Brochure form | A white band, purple heading, three inputs and a purple "Download" pill | Stacked | ~40 |
| 7 | Reviews | The daynurseries.co.uk carousel widget, 4 across | 1 across | (widget) |
| 8 | Social | A pale blue band (`#bcdefa`) with a wavy top edge, **ducklings and a bucket of chips** on the wave, "Follow us on social media", and two white circle icons | Same | 11 |
| 9 | Footer | A navy band | Same | 41 |

Desktop is 4,169px tall (about 5 screens). Phone is 5,890px (about 7 screens). By rough area, colour or image fills about 70% of the desktop page. Only the intro and the brochure form sit on white.

## Why it feels colourful and fun
- **Palette** (computed, by area):

  | Role | Hex |
  | --- | --- |
  | Primary blue | `#0091da` |
  | Sun yellow | `#fac32d` |
  | Orange | `#f08650` |
  | Purple | `#a660a3` |
  | Pale sky | `#bcdefa` |
  | Deep navy (footer, text) | `#0e3f57`, `#165c7d` |
  | Red accent (crab) | `#ff4530` |
  | Teal | used in the squiggles |

  The colour comes from **whole bands**, not accents. Each band is one flat colour, and the next band changes hue.
- **Section shape:** every band change is a **wavy edge**. It is an inline SVG (`viewBox="0 0 1132 175.83"`) recoloured by class. The waves are irregular, like a child's drawing of the sea, not a sine wave.
- **Mascots on the seams:** small flat-vector animals (cat and crab, ducklings, birds, pigs, cow, seagull, lighthouse, turtle) **stand on the wave edges** between bands. They are the single biggest source of "fun". They cost no text and break up every seam. Each page gets a different pair.
- **Per-page colour:** Our Moons is purple, Our World is orange, Gallery is pale sky with a seaside scene, and the Sky TV Ad page is purple. A parent can tell where they are by colour alone.
- **Squiggles:** a 56×9px SVG squiggle under every card title, coloured per card. It works like a hand-drawn underline.
- **Icons:** thin single-line icons (1.5px stroke) in the brand colours. They are calm next to the loud bands.
- **Photography:** the hero photos show children with a teal wash. The gallery shows only empty rooms with murals (jungle, seaside, farm). The rooms are colourful in themselves, so the photos add colour without faces.
- **Type:** headings are **Sofia Pro Soft 700** (rounded terminals, friendly), 36px for H1, in blue or white. Body text is **Sofia Pro 400**, 16px, line height 1.5, grey. Buttons are Sofia Pro 700, 14px, uppercase in the header, with a pill radius (`9999px`) and padding of 16px 48px.
- **Motion:** sliders only (Flickity). There are no scroll animations and no hover tricks beyond colour. The fun comes from illustration, not movement.
- **Spacing:** generous. Bands run 500 to 900px tall on desktop with 80 to 120px of padding.

## How it keeps text light
- The homepage holds **one paragraph** (45 words), four 5-word card captions, a short owner note and the contact details. Everything else is pushed to Our Moons, Our World and its subpages.
- **Card navigation:** the four homepage cards *are* the navigation into the inner pages. Each is icon, 2-word title and 5-word line.
- **Number devices:** on Our Moons, three tall white cards show **"Zzz"** (CCTV-monitored sleep rooms), **"3:1"** (children to staff ratio) and **"3"** (from 3 months old) in big purple type over a squiggle. One fact per card.
- **Icon tabs:** on Facilities, seven icon tiles act as tabs. Only one fact's text is shown at a time.
- **Short lines:** card captions run 3 to 6 words, and headings 2 to 6 words.
- **FAQs** sit in accordions, closed.

## Inner pages
- **Rooms (Our Moons):** tab-cards along the top in white outline on purple, one room open at a time, stat cards beside the text, then FAQs. About 350 words.
- **Fees and funding:** **none.** There is one news post, "Funded Childcare Spaces", and nothing else. Fees are a phone call.
- **About and team:** no team page. The owner welcome is on the homepage. Staff appear only in news posts (awards, qualifications).
- **Parents:** a Parent App page (190 words, phone mock-ups) and a Bright Futures programme page.
- **Contact and visits:** "Contact Us" opens a modal form. Every inner page ends with **"Request a callback"** on blue (name, phone, **"Select a time"** dropdown, submit). The homepage has the full form and the address.
- **Gallery:** see below.

## Video
- **Where:** its own page, "Our Sky TV Ad" (under Gallery). There is no video on the homepage or room pages.
- **What:** the **national franchise TV advert**, the same file on every Banana Moon site (`emails.denfield.co.uk/bananamoon/ad.mp4`, hosted by the franchisor's agency, 11.8 MB, 31 seconds). Frames (`video-frames/bananamoon-skyad-sheet.png`) show a staff member cuddling a child, a toddler on a climbing frame with the **brand's wavy yellow and teal shapes wiping across**, CCTV and app screens, staff in branded aprons, and an end card with the logo. The brand's wave motif carries into the video.
- **How:** an **`<iframe>` pointing straight at the MP4**, 600×300, so Chrome shows its native player. It does not autoplay. Sound plays on press. There is **no poster** (Chrome shows the first frame), **no captions** and no transcript. It does not loop.
- **Phone effect:** nothing loads until play, because the iframe only fetches metadata. The page stays light at 1,908px.
- **Screenshots:** `bm-westhill/vp/our-sky-tv-ad/1280-1.png` (the same page on the sister site), `video-frames/bananamoon-skyad-sheet.png`.

## Gallery
- **Where:** its own page (Gallery, Our Photos). There is also an awards slider on the homepage, which is not a photo gallery.
- **Layout:** a **plain 4-column grid** (2 columns on a phone), equal 282×211 tiles with no gaps beyond 24px and square corners. **18 photos.** There is no lightbox, no captions and no filtering. The tiles are not clickable.
- **What the photos show:** **every photo is an empty room or corner**: the reading den with a teepee, the role-play kitchen, a jungle-mural wall, the treasure basket, a fairy-light branch installation, a sensory tray, the welcome area. There are no children and no staff. This is exactly what our rules need, and it still reads as colourful, because the rooms are colourful.
- **Build:** each tile is a `div` with a CSS `background-image`. The `<img>` inside is hidden and lazy, with **alt="AI"** on every one. The originals are full-size phone JPGs (`/storage/nursery/Our Nursery 2025/<uuid>.JPG`). Screen readers get nothing useful, and phones download big files.
- **Header:** the gallery page opens with 147 words of intro on a pale-sky band with a seaside illustration (seagull on a rock, lighthouse, turtle, crab, wavy sea).
- **Screenshots:** `bm-aberdeen/vp/gallery/1280-1.png`, `bm-aberdeen/vp/gallery/390-1.png`.

## Conversion
- There are two persistent header calls to action: **Contact Us** and **Download Brochure**. The hero repeats Download Brochure and **Call us on 01224 772063** (tel link).
- The **brochure is the main lead magnet:** name, email and phone, with a marketing opt-in tickbox.
- A **"Request a callback" form with a time picker** ends every inner page. That is a low-effort ask.
- There is no "book a visit" wording. The homepage says "Should you wish to visit we are available at any time to meet with you."

## Phone experience
- The hero becomes a short solid-blue block with two pills, and the call link is on the first screen. That works well.
- Cards stack full width, and the wavy bands and mascots survive.
- The reCAPTCHA badge overlaps the right edge, and the review widget is wide.
- `viewports.mjs` flagged one "text cut off" box (the "Our Nutrition" card caption) at both widths.

## Borrow this
1. **Wavy band edges in one inline SVG, recoloured per band.** A hand-drawn irregular wave (not a perfect sine) between flat colour bands. Ship one SVG path and colour it with `currentColor`. It costs no images.
2. **Small flat-vector characters standing on the seams.** One or two simple animals or objects per seam. They must be drawn for the client or properly licensed (never AI-generated), use `alt=""` because they are decorative, and be no more than 3 to 6 per page.
3. **A colour per page or section family:** rooms in purple, "Our world" in orange, gallery in sky blue. It aids wayfinding without words.
4. **A 2×2 outline icon card grid as homepage navigation:** a thin line icon, a 2-word title, a 5-word line and a coloured squiggle. It replaces paragraphs.
5. **Big-number stat cards for facts** ("3:1", "3 months", "Zzz"). Use only numbers the client confirms, and write the ratio as the law sets it if unsure ("phone to check").
6. **Icon tiles that reveal one facility at a time.** Build them as real buttons with `aria-controls` and `aria-expanded`, or simply as anchor links to short sections.
7. **An empty-room gallery:** an honest grid of the real rooms, murals and corners. Use real `<img>` with real alt text ("Reading den with a canvas teepee and floor cushions"), `loading="lazy"`, a `srcset` of 400 and 800px WebP, and an optional simple accessible lightbox (a `<dialog>` with a close button and Esc, focus returned to the tile).
8. **A "Request a callback" form with a preferred-time choice** at the foot of inner pages. Keep it to name, phone and time, posted to the client's own email, with no reCAPTCHA (use a honeypot).
9. **A short owner note with a signature** on a coloured band. It is personal and short (60 words).
10. **Video under our rules:** a 20 to 40 second self-hosted MP4 or WebM tour of the **empty rooms and garden** (a walk-through, children absent or seen only from behind or as hands), with the brand shapes wiping between shots like the franchise ad does. Use `<video controls preload="none" poster="room.jpg" playsinline>` with a `<track kind="captions">` and a one-line transcript, no autoplay with sound, and no autoplay at all under `prefers-reduced-motion`. Keep it under about 4 MB at 720p.

## Avoid this
- A hero **photo slider with arrows** (it hides content), and a second slider for awards.
- Third-party scripts everywhere: Typekit, a Facebook pixel and SDK, GTM, reCAPTCHA, the daynurseries widget, and an iframe to an agency domain for the video. All fail our GDPR and performance rules.
- Gallery photos as CSS backgrounds with hidden `<img alt="AI">`: inaccessible and heavy.
- **No fees or funding page** for a Scottish funded provider. Parents need the 1,140 hours explained.
- A "Contact Us" menu item that is `javascript:void(0)`, which is not a real link.
- **Contrast failures from the bright bands:** white body text on orange `#f08650` is about 2.6:1, and white on blue `#0091da` is about 3.5:1. Both fail AA for 16px text. When we borrow the bright bands, we either darken the band (about `#c2410c` or `#0369a1`) or put the text on a white or cream card that sits on the band.
- The marketing opt-in mixed into the contact form.
