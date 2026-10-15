# The Sunflower Nursery, Ilford (5 nurseries)

Studied 14 October 2026, the second of the two sites the owner likes. Sources:
- a crawl of 40 pages;
- full-page captures, scroll recordings, contact sheets and 193 click results for 18 pages at 1280px and 390px;
- my own Playwright probes of the dropdown menus and the FAQ tabs;
- measurements of computed colour, type, section padding, gutters, words and per-screen density on the live homepage.

Scratchpad: `sunflower/` (captures) and `spacious/` (my measurements, slices and scripts).

## At a glance
- **Site:** https://thesunflowernursery.co.uk/. A small family group (Al-Falah The Sunflower Nursery, opened 1997) with **5 nurseries** in Ilford and South Woodford: Albert Road, York Road (St Albans), Empress Avenue (head office, 57 Empress Avenue, IG1 3DE), Green Lane and South Woodford.
  - It takes children from 3 months to 5 years. The group line is 0208 554 6556, Monday to Friday, 8am to 6pm, and each nursery has its own phone and email.
  - It is in England, so it has Ofsted reports and England's funding (15 and 30 hours, Tax-Free Childcare).
- **Tech:**
  - WordPress with the Flatsome theme and **Outfit** loaded from Google;
  - Complianz cookie consent, Contact Form 7, a daynurseries.co.uk badge and an embedded PDF viewer;
  - **no video anywhere** on the site.
- **Character:** sunny, soft and tidy. A sky-blue and brown palette with sunflower-yellow pills, and a **3D smiling sunflower mascot** with a cartoon bee on a dashed flight path.
  - Calm white space between sections, but **long text** once you're inside a block.
  - The blog is very long: 1,000 to 3,600 words per post, clearly written for search engines.

## Site map
- **Desktop header** (sticky, it shrinks on scroll):
  - the logo ("THE SUNFLOWER NURSERY" stacked, the O drawn as a sunflower, plus a bee);
  - "Call us on 0208 554 6556" top right;
  - **5 menu items:** Our Nurseries ▾, For Parents ▾, Training, About us, News & Events;
  - an outline pill "FUNDRAISING" and a solid orange pill "GET IN TOUCH".
- **Dropdowns** (from my hover probe) are **yellow panels with brown text and hairline dividers:**
  - Our Nurseries lists the 5 nurseries by street name;
  - For Parents lists Meal Plan, Payments and Policy & Procedures.
- **Phone header:** a hamburger on the left and the logo in the middle. The menu is a **drawer from the left covering about 75% of the screen,** with the page dimmed behind. It has 5 uppercase items with yellow triangle toggles for the sub-menus, social icons and a big yellow "GET IN TOUCH" pill.
- **Footer** (the same on every page):
  - a **carousel of the 5 nurseries** (photo cards, "Explore →");
  - "Join Our Newsletter" (name and email);
  - **two full-width bars:** FUNDRAISING → in orange and GET IN TOUCH → in brown;
  - the logo, the tagline "Childcare at the heart of the community", "Open Monday – Friday", the phone, email and head office, and 7 social icons.

**Page types:**

| Type | Example | Phone height | Words |
| --- | --- | --- | ---: |
| Home | `/` | 6,656px (7.9 screens) | 848 visible; the FAQ answers add 4,000 more, hidden in accordions |
| **Section hub** | `/our-nurseries/`, `/for-parents/` | 5,260 to 7,480px | 480 to 4,680 |
| **Nursery page** (×5) | `/our-nurseries/albert-road-ilford/` | 5,460 to 8,530px | 570 to 1,530 |
| Sub-page | Meal Plan, Payments, Policy & Procedures | 1,650 to 6,420px | 400 to 600 |
| About us | `/about-us/` (in-page tabs: About Us, Our Team) | 5,180px | 680 |
| News list and post | `/news-events/` (a 70,900px phone page!), posts | up to 9,600px | 1,000 to 3,600 per post |
| Training (for practitioners) | 8 course pages | about 5,000px | about 200 each |
| Contact | `/contact/` | 2,283px | 43 |

## Page layouts
**Every inner page opens the same way. This is the site's best pattern.**
1. A **pale sky-blue band** (`#CEEAF2`) with:
   - a **small bold eyebrow** naming the section ("For Parents", "Our Nurseries");
   - a **big brown H1** (48px desktop, 29px phone, Outfit 500), e.g. "Parents and children, a home away from home";
   - a short intro (40 to 80 words);
   - a darker sky **"Want to know more?" callout** with a yellow "Contact us" pill.
2. On desktop, the 3D sunflower and bee fill the right half of the band. On a phone they drop below the text or disappear.
3. Then **door tiles** to the sub-pages:
   - full-width **photo tiles** with a label top-left ("Meal Plan", "Payments") and "Explore →" bottom-right in white;
   - on Our Nurseries, a grid of 5 nursery photo cards, each with a yellow "Nurseries" tag, the street name, "Explore →" and an Ofsted roundel.

**Nursery page** (Albert Road), top to bottom:
- **"← Back to Our Nurseries".**
- A **photo gallery with a thumbnail strip:** a big photo of the entrance, a yellow expand button for the lightbox and 8 to 10 thumbnails underneath. The photos are almost all **empty rooms** (tables laid with whiteboards, carpet areas, a home corner).
- A yellow "Nurseries" tag, then the H1 "Albert Road, Ilford".
- **Address, phone and email in a column, each with a brown line icon** (a sunflower for the address, a phone handset, an envelope).
- **Opening times with a clock icon:** "Mon–Fri 9.00am–3.00pm", half-day sessions, and "Free Sessions available for 2yr, 3yr and 4yr olds, please call for details".
- **Three buttons:** "Make a booking" (yellow, full width), "Ofsted Report" and "Reviews" (outlined, each with a logo).
- Then 2 long text blocks (Our Nursery, Our Sunflower Team, 300 to 450 words), the booking form, a 6-item checklist "All of our nurseries are…", 15 or more parent reviews in white cards, and the footer.

**For Parents:**
- 3 photo door tiles (Meal Plan, Payments, …);
- a "Calendar" section with the **term-dates letter embedded as a PDF viewer;**
- "Parents Welcome Pack";
- Funding, Tax-Free Childcare and 30-hour funding, each a short intro plus accordions ("Am I eligible?");
- the FAQ.

The page is 4,682 words. The pattern is good but the page is too long.

**Meal Plan:** a **weekly timetable:**
- rows are Breakfast 8.00–8.45am, Lunch 11.15am–12.00pm and Tea-time 3.15–3.50pm. Each row label is a **white rounded "pill" cell** sticking out into a yellow grid;
- columns are the days, with dashed vertical dividers;
- allergens are in bold, and there are two weeks;
- on a phone the table scrolls sideways (the days are cut off at "Tues").

**About us:**
- **in-page tab links** (About Us / Our Team) with a yellow underline;
- the founding story;
- Our Vision with an 11-item tick list;
- Meet the team: portrait photos with name, role in orange, and 150 to 250-word first-person bios.

**News post:** a sky header band with "← Back to News & Events", the H1 and share buttons, then:
- a date and a yellow "News" tag;
- a big photo (the post photos look AI-generated: odd signage, a staged classroom);
- an **in-page contents list** (anchor links: Understanding…, The Power of…, FAQ);
- an "In other news" sidebar.

**Contact:** a sky band, "Always welcoming new faces", a one-line intro, then:
- head office, phone and email with line icons;
- the mascot;
- a "Happy to help" form with **rounded white pill inputs** on a darker sky card. It asks "Already attending one of our Nurseries?" and has a select and a message box.

## The homepage, section by section
Measured on the live site. Phone: 6,656px (7.9 screens). Desktop: 5,206px (6.2 screens). 848 visible words, including header and footer.

| # | Section | Desktop (1280px) | Phone (390px) | Words |
| --- | --- | --- | --- | ---: |
| 1 | Header | White: logo, 5 items, 2 pills, phone | Hamburger and logo, 90px | 12 |
| 2 | **Hero** | Full-bleed photo of a laughing toddler with blocks (it looks like stock) under a 40% black overlay. Eyebrow "Childcare at the heart of the community"; H1 "Where education and fun shines all year round" (Outfit 500, 58.7px, white); a white pill "Discover more" plus an underlined "Meet the team"; "Read our reviews on daynurseries 9.6" | 39px H1 centred, same buttons; the review badge image is **broken** on the phone | 17 |
| 3 | **Nursery carousel** | Overlapping the bottom of the hero: 5 photo cards of the **real buildings** (street name and "Explore →"), with **big round yellow arrow buttons** at each end | One card at a time between two big yellow arrows | 20 |
| 4 | **Statement and mascot** | A sky band. A big brown 48px statement ("Our foremost goal is to create a safe, happy, caring, secure, and stimulating environment…"), a short paragraph and a yellow "Ofsted Report" pill. The **3D sunflower mascot waves** on the right and a **bee trails a dashed loop** toward the text. | Statement 29px over 5 lines; the mascot below at half size | 41 |
| 5 | **Intent cards** | Two white cards on sky: "**I am looking for a nursery** → Our Nurseries" and "**Nutritional daily meals for healthy growth** → Meal Plans". Each has a 3D cartoon child (they look AI-generated) on a yellow circle. | Stacked, without the cartoon children: a light 19px line and one yellow pill each, with **30px between the cards** | 16 |
| 6 | Early Years Curriculum | White band: H2, then 2 paragraphs **at full container width (1,180px, about 154 characters a line)**, a sky box of 90 words, and "About Us" | 13px text over 3 blocks, 1.4 screens | 232 |
| 7 | **Book a free nursery tour** | Sky band with a **faint sunflower pattern;** a centred white card (800px) with a bee perched on its top edge, an H2, one line and a "Book tour" pill | Same: the card has 24px margins | 30 |
| 8 | **FAQ** | **9 category tabs** in a vertical list on the left (Viewing and Booking, Starting at a Nursery, Food and Dietary, Medication and Illness, Care Learning and Development, Staff, Financial, Funding, Compliments and Complaints); accordion questions on the right on pale grey bars with yellow triangles | The tabs become **2 pills side by side** that scroll sideways; the questions are stacked bars | 35 (plus about 4,000 hidden) |
| 9 | Our Vision | Left: a bold 60-word intro and 120 words in a pale sky box. Right: "We Aim:" with **11 items, each with an orange outlined tick circle** | Stacked: the 11 items run for 1.5 screens | 320 |
| 10 | Award banner | Redbridge Education Awards image on sky | Same | 0 |
| 11 | Newsletter and bars | Newsletter row, then the FUNDRAISING (orange) and GET IN TOUCH (brown) bars | Stacked full-width bars, 60px each | 10 |
| 12 | Footer | 3 columns | Centred stack | 40 |

### Spacing (computed)
- **Side gutter:** 15px on a phone. On desktop the container is 1,180px with 50px gutters.
- **Section padding:**
  - Flatsome's "normal" padding is **42px** top and bottom, and "large" is **84px**. Each column adds a **30px bottom margin**, so there are 72 to 126px between sections on a phone.
  - The median gap between blocks is 55px on a phone and 69px on desktop. Section breaks are 124 to 164px.
- **Card gap:** 30px between the white intent cards and between the review cards. The FAQ bars are 10px apart.
- **Line length:**
  - Phone: 45 to 58 characters (good), but **at 13px** (18.2px line height) in most blocks. The tick list uses 16px with 25.6px line height, and is far easier to read.
  - Desktop: 49 to 75 characters in the 2-column blocks, but **154 characters** in the curriculum paragraphs.
- **Per phone screen:** 6.0 text blocks, 4.8 links and 3.8 boxes on average. The first screen is busier: 10 boxes, counting the carousel cards and the arrows.
- **Why it feels open:**
  - **Big headings with few words** (48px desktop statements, H2s of 1 to 4 words: "FAQ", "Our Vision").
  - **A lot of pale sky ground** around few white cards.
  - Long text hides inside accordions and tabs.
  - **Centred cards with one line and one button.**
- **Why it still gets dense:** the curriculum and vision blocks drop to 13px and run 150 to 320 words.

## Navigation and how deeper detail is reached
This site is better than Playhouse at "a clear way into separate pages":
1. **Grouped menu with dropdowns** (5 items), and the same groups in the phone drawer.
2. **Intent cards on the homepage** ("I am looking for a nursery" → Our Nurseries). They are phrased as the parent's own need.
3. **Photo door tiles** on the hub pages, labelled with one or two words and "Explore →".
4. **"← Back to …" links** at the top of every child page: a clear sense of place.
5. **Section eyebrows** in the page bands ("For Parents") act as a breadcrumb.
6. **In-page tabs** (About Us / Our Team), FAQ category tabs, an in-post contents list and accordions keep long material folded.
7. **A nursery carousel** on every page to jump between nurseries.

**Weaknesses:**
- the hub pages still pile everything on (For Parents is 4,682 words);
- the FAQ hides 4,000 words on the homepage;
- the news list is a 70,900px phone page;
- the carousel is the only way to compare nurseries on the homepage.

## Colour, type, shapes, illustration and photography
**Palette** (computed):

| Role | Hex | Contrast |
| --- | --- | --- |
| Brown ink (all headings and body) | `#5E3327` | 10.6:1 on white, 8.4:1 on sky |
| Sky band | `#CEEAF2` (and 30% and 90% tints) | |
| Sunflower yellow (pills, tags, dropdowns) | `#FFD836` | Brown on it is 7.6:1. **White on it is 1.4:1** (some pills are set white in CSS) |
| Orange (header CTA, bars, reviewer names) | `#F9B200`, `#F48B00` | **White on `#F9B200` is 1.8:1;** orange names on white are 1.8:1. Fails |
| Pale grey (FAQ bars) | `#F7F9FA` | |
| Greys in widgets | `#777777` and others | |

**Type:**
- **Outfit throughout** (300 to 900), a geometric rounded sans: friendly but adult.
- H1 58.7px and H2 48px (500 weight) on desktop; on a phone 38.7px and 29.4px.
- Intent-card titles are 30px at 300 weight, which gives a light, airy feel.
- Body text is 16px on desktop but **13px on a phone,** which is too small.

**Shapes:**
- Pill buttons (radius 99px);
- rounded white cards (about 16px radius) on sky;
- **rounded pill inputs;**
- big **round yellow arrow buttons** on carousels;
- a dashed bee flight path;
- **the faint sunflower pattern** in the tour band;
- the meal timetable's pill-shaped row labels.

**Illustration:**
- A **3D-rendered smiling sunflower** with a cartoon bee is the mascot on every hub page.
- 3D cartoon children on the desktop intent cards.
- Both look AI-generated or bought. **We can't use either:** no AI-generated people, and our illustration is hand-coded SVG. The *idea* of a nursery-name emblem with a little flying companion is what we can borrow.

**Photography:**
- Real **building fronts** for every nursery (signage, gates, doors), and **empty rooms** in the nursery galleries. Exactly the kind of photo our rules allow.
- The hero and the post photos look like stock or AI images.

## Video and gallery
- **No video.** The site feels lively anyway thanks to the mascot, the colour and the carousels.
- **Galleries live per nursery:** a main image, a thumbnail strip and an expand button that opens a lightbox (143 image clicks in the capture, all opening the overlay).
  - Photos are mostly empty rooms and building fronts, with no captions.
  - The thumbnail-strip pattern is clear, but it is effectively a carousel: thumbnails scroll sideways.

## Calls to action and the enquiry flow
- **Header:** "GET IN TOUCH" (orange pill) and "Call us on…".
- **Homepage:** "Discover more", "Meet the team", "Ofsted Report", "Our Nurseries", "Meal Plans", "About Us" and "**Book tour**" (in the tour band). That's 7 different actions, but each sits alone in its block.
- **Nursery pages:**
  - "Make a booking" scrolls to an **in-page booking form** (name, email, phone, child's name, date of birth, nursery, start date, and which days as Mon to Fri tick boxes, with "add another child");
  - "Ofsted Report" and "Reviews" are outlined.
- **Every inner page** has the "Want to know more? Contact us" callout in its top band.
- **Every page** ends with the GET IN TOUCH bar.
- The booking form asks for the days needed up front: useful for the nursery, heavy for a first enquiry.

## What's lovely
1. **The inner-page band:** eyebrow, a short big H1, a short intro and a "Want to know more?" note. Every page starts calmly, the same way.
2. **Intent cards:** "I am looking for a nursery" or "Nutritional daily meals", then one button. The parent's own question routes them deeper.
3. **Photo door tiles** with a one-word label and "Explore →".
4. **"← Back to …"** on every child page.
5. **Big headings with few words on a lot of soft colour.** The 30px light-weight card titles feel open.
6. **A palette named after the nursery:** sky, sunflower yellow and soil brown. Warm, not childish. Brown ink instead of black is softer and still has high contrast.
7. **The tour band:** a single white card on a patterned ground with one action, and a little bee sitting on the card edge.
8. **The meal timetable:** pill-shaped time labels and dashed day dividers. Food as a schedule, readable at a glance.
9. **Folded detail:** FAQ category tabs plus accordions, in-page tabs and in-post contents lists.
10. **Real building fronts** as the nursery cards.

## What's weak
1. **Small body text on phones** (13px) and very long desktop lines (154 characters).
2. **White text on yellow and orange** (1.4 to 1.8:1), and orange reviewer names.
3. **3D AI-looking mascot and cartoon children,** a stock-looking hero, and AI-looking post photos.
4. **Carousels** (nurseries, gallery thumbnails) and an embedded PDF viewer.
5. **Hidden bulk:** 4,000 FAQ words on the homepage, a 4,682-word For Parents hub, a 70,900px news list and 3,000-word SEO posts.
6. **Seven different actions on the homepage,** with no single obvious next step until the tour band halfway down.
7. **The broken review badge** on phones. The phone sideways scroll on the meal table.

## Borrow this (adapted to our rules)
- **An inner-page band** on every page: section eyebrow, an H1 of 6 words or fewer, an intro of 35 words or fewer, and one action. "Want to know more?" becomes "Questions? Phone 01xxx xxxxxx" or "Book a visit".
- **Intent cards on the homepage,** phrased as parents' needs ("We're looking for a nursery", "What will they eat?", "How much will it cost?"). Each has one line and one door to an inner page.
- **Door tiles** (photo or illustration) with a 1 or 2-word label and an arrow. Full width on a phone, one per row.
- **"← Back to …" links** and eyebrows, so inner pages always say where you are.
- **A brand palette drawn from the nursery's name or emblem,** with deep brown or deep ink instead of black for text. All pairs computed to pass AA.
- **A small companion drawing** that visits a few sections (the bee). It must be hand-coded SVG, an animal or object, never a 3D render or a person. It shouldn't become a full mascot system (that's Sidekick).
- **A single centred card with one action on a patterned band,** for the main "Book a visit" moment.
- **A meal schedule** (time pills plus a day grid) on the Food inner page, stacked by day on a phone (no sideways scroll).
- **FAQ groups plus `<details>` accordions** on inner pages, never on the homepage.
- **Building-front photos** as cards for multi-site groups.
- **Avoid:** 13px body text, white on yellow or orange, carousels, embedded PDF viewers, 3D or AI-generated imagery, and hiding thousands of words in homepage accordions.
