# Monkey Puzzle Day Nurseries (monkeypuzzledaynurseries.com)

Studied 13 October 2026. Crawl and screenshots: `/private/tmp/claude-501/-Users-samuelosuh-codes-mapboard/c179b3f0-507a-47ce-a937-2eef0da893bf/scratchpad/study-2/monkeypuzzle/` (plus `clean/monkeypuzzle-home-*.png`, with the cookie banner removed). The URL in the brief redirects to `monkeypuzzledaynurseries.com` without "www".

## At a glance
- **Who:** the self-described "UK's largest childcare franchise network", 70+ nurseries, 4.5k children a week, "20+ years" (the first Monkey Puzzle opened 17 March 2002 in Hertfordshire; owners Mark and Rebecca Crosby). Head office is in Berkhamsted, Herts. Nurseries are in the South East, East, Midlands, North West and London. None in Scotland in the crawl.
- **Position:** mid-market private. No prices anywhere on the main site. The fees page points to a funding brochure and a per-nursery calculator.
- **Format:** a franchise, so each nursery has its own site and the main site is a brand and lead-generation hub. The whole site is built to capture an enquiry ("Find your nearest Monkey Puzzle Day Nursery", a lead form on nearly every page).
- **Built by:** Path Marketing (footer credit). Built on WordPress with Avada (Fusion) and Gravity Forms.

## Site map
**Header (desktop):** Find a nursery ▾ (find near you, by location) · For parents & carers ▾ (Choosing a nursery, Marvin's World, Babies, Toddlers, Preschool, Nursery fees and funding, Nutrition) · About us ▾ (About, Early Years Insights, Community, News, Nursery franchise) · Careers ▾ (careers, job opportunities, apprenticeships, training) · **Seasons of Wonder** · a purple "ENQUIRE NOW" button. On a phone: logo and burger only.

**Footer:** teal block, "Get in touch" card with Facebook, Instagram, LinkedIn, email and phone icons, "Enquire Now", the head office address; three accordions (Discover, You might also like, Our Policies); "Designed by Path Marketing".

**Page types found**
- Homepage with a nursery-finder form.
- Nursery directory (`/nurseries-near-me/`): a list of all nurseries with a daynurseries score each (e.g. 9.7, 9.9, 8.6), "Enquire now" and "View nursery" buttons.
- County pages (Bedfordshire, Berkshire, Essex, Kent, and so on) and London area pages (east, north, south-west...). These are written as local-search landing pages ("Looking for a nursery near me in Bedfordshire?").
- Age pages: Babies (3 to 18 months, "no more than three children" per carer), Toddlers, Preschool.
- Choosing a nursery (an advice guide), Nutrition (menus with a nutrition specialist, an embedded flip-book), Fees and funding, Extracurricular activities, Early Years Insights (blog), Community, Our charity, News, Seasons of Wonder, Marvin's World.
- Individual nursery pages live on separate sites, which we did not crawl.

## Homepage, section by section (390px)
1. **Header:** a round logo badge (the monkey mascot in a circle) and burger. A thin teal bar at the very top.
2. **Hero slide:** a seasonal campaign banner: a 3D-rendered red monkey (Marvin) walking through an autumn wood, with the title "Discover the Seasons of Wonder" in white outlined puffy lettering on teal, a lime "Start Marvin's walk" button, and flat decorative circles (lilac, lime, gold, purple) at the edges. It is a carousel (four dots).
3. **Find Your Nearest Nursery:** a pale mint bar with a chevron that opens a form. On desktop the fields are "Start date" (required), "Child's date of birth", "Postcode or location" and a purple "Find your nearest nursery" button.
4. **Welcome to Monkey Puzzle:** centred teal heading, a paragraph and a purple "ABOUT MONKEY PUZZLE" pill button. Below: a large photo of a smiling boy with rounded corners.
5. **Mint card carousel:** text on mint, an image beside it (a room with wooden furniture and a teal wall on desktop). Headings: Enriching Environments, Community Cornerstones, Our People Care, Holistic Early Years Approach. Each card has a purple pill button. Four dots.
6. **Why Choose Monkey Puzzle?:** four teal tiles (white line icons: a slide and tower, an adult reading to a child, a star with a hand, an adult holding a baby) with big numbers: 70+ nurseries, 4.5k supported children, 9.4/10 Daynurseries score, 20+ years.
7. **Parent and Carer Reviews:** daynurseries.co.uk widget (9.4 from 3,147 reviews, a row of review cards). **On a phone, this section and the next screen rendered as a blank white block** in our capture (a lilac block below it). It may be a lazy widget that didn't load, but it means a parent may see a very long empty gap.
8. **News and insights, careers:** cards (not visible in the capture).
9. **Footer:** a teal block with rounded "Get in touch" card.

## How it sells
- **Promise:** "Play, learn and grow" (the hero on Marvin's World and the strapline throughout). "Home from home." "For over twenty years ... outstanding childcare."
- **Tone:** polite, long-winded, SEO-driven. Plenty of keyword questions in the copy ("Asking 'Where can I find a nursery near me?'"). The emotional note is in the advice page ("it's possibly the first time you will be leaving your precious child in the care of someone other than friends and family").
- **Proof:**
  - **9.4/10 from 3,147 daynurseries.co.uk reviews**, with the widget showing stars, a date, a snippet and "review of [nursery] by [initials] (Mother of Child)". Individual nurseries show their own score (8.6 to 9.9) on the directory.
  - "Ofsted" is named in the welcome line ("worked closely with parents, staff and Ofsted to deliver outstanding childcare") with no grade shown on the main site.
  - Numbers tiles (70+, 4.5k, 20+).
  - Menus "created in partnership with Laura Matthews, a specialist in early years nutrition" (a named expert).
- **Differentiators:**
  - **Marvin the monkey**: a mascot with his own world (activities at home, adventures around the world, bedtime stories, a science and nature hub, arts and crafts, cooking, a "Marvin the Monkey" profile) and a hashtag.
  - **Seasons of Wonder**: a seasonal activity programme parents can use at home ("Start Marvin's walk", "Explore our January activities").
  - Extracurricular activities (music, dance, language, gymnastics, cookery, drama, and so on), varying by nursery.
  - Baby rooms with a three-to-one ratio, separate sleep rooms.
  - Security procedures (secure entrances, a password for third-party collection, sign-in and sign-out).
- **Urgency or scarcity:** none in the pages we read.

## Conversion mechanics
- **Primary CTA:** purple "ENQUIRE NOW" in the desktop header. "Find your nearest nursery" (the form on nearly every page). Purple pills ("About Monkey Puzzle", "Find a nursery", "Explore our January activities"). Directory rows: "Enquire now" and "View nursery".
- **Enquiry form (Gravity Forms, repeated on almost every page):** first name, email, phone, postcode, preferred start date, child's date of birth and (optional) child's name, all required except the child's name. There are hidden fields for "Nursery ID", "Lead Source", "Distance" and "Campaign", so each enquiry is tracked back to a page and a nursery. It is a single step. No calendar, no tour slot. The result is that the nearest nursery calls the parent.
- **Fees:** no prices. "Click here to view our funding brochure"; a funding and fees calculator "available on each nursery's website". A funding FAQ accordion (Tax-free vs 30 free hours, parental declaration form, maternity leave, mixing funded and paid hours, rolling over unused hours). Funding content is England-centred (15 or 30 hours, "from 9 months").
- **Waiting list:** not mentioned.
- **Pop-ups:** a cookie banner (a white card with "Accept cookies / Deny / View preferences"). In our phone capture it covers about a third of the first screen. A "Manage consent" tab floats at the left of the desktop page. No chat widget.
- **Local SEO pages:** each county page repeats the "nursery near me" phrasing and lists nurseries with phone numbers shown as plain text.

## Visual design
- **Typefaces:** "Filson Pro" (Adobe Fonts, a rounded geometric sans in a friendly heavy-ish cut) for everything: 600 weight headings in teal at about 28px, 300 weight body at 17px, with wide line spacing. On the campaign banner the title uses a custom puffy outlined display lettering. Body text in light weight and long line lengths is a readability risk.
- **Palette:** a dominant **teal `#4897A8`** (headings, tiles, footer), a mint tint `#DDF0F0` for panels, **purple** (about `#8147A9`) for every button, lime green and gold dots as decoration, white. A lilac `#DFDCEE` section background. The brand red of the monkey is the only warm colour and is kept to the mascot.
- **Illustration:** the **Marvin 3D render** (a plush-style red monkey in photographic scenes: woods, a lake at sunset) in the campaign banners. White line icons on teal tiles. Flat coloured circles as decoration on the banner edges.
- **Photography:** real nursery photos with faces: a close-up of a smiling boy tilted to the camera, rounded corners; interior shots of well-lit rooms with pale wood furniture and a teal accent wall (these are the stronger images). The wide room photo is one of the better ones in our whole study: no children in it, and it still sells the place.
- **Shapes and textures:** rounded-rectangle cards (about 24px), full pill buttons in uppercase, circles. Everything is flat. No torn edges or paper textures.
- **Motion:** carousels (hero and mint cards with four dots). Nothing else noted.
- **Density:** a lot of text on inner pages, mostly SEO copy.
- **Fun and engaging:** Marvin and the seasonal campaign, the bright teal and lilac palette, the stat tiles.
- **Premium:** the interior photo, teal and mint pairing.
- **Twee, cheap or generic:** the puffy outlined headline lettering, the 3D mascot in a stock-looking forest, white outline icons that look like a template set, "ENQUIRE NOW" in capitals.

## Phone experience
- **Works:** large type, one column, the logo and burger kept simple, a collapsible "Find Your Nearest Nursery" bar (no keyboard until the parent taps it), tap-sized purple buttons, accordion funding FAQs.
- **Doesn't:**
  - Long blank white gap where the reviews widget should be, and a lilac block with nothing in it.
  - Body text in a light 300 weight; centred paragraphs over many lines.
  - Carousels with tiny dots.
  - The funding FAQ list repeats items (the first three questions appear twice), which looks like a CMS error.
  - The cookie card covers the top of the page.
  - A calculator that lives on each separate nursery site, so a parent must leave this site to see a figure.

## Steal this
1. **A named mascot with a "world" of at-home activities.** Marvin gives parents a reason to come back and a way to share. A Scottish nursery can do this without a character: a "Things to do this week" page with a simple activity card per season (autumn leaf rubbing, puddle science). We'd draw it as an illustration or hands only.
2. **A seasonal campaign banner that changes four times a year.** "Seasons of Wonder" is easy to run and keeps the homepage feeling alive. For us: a Scottish-year banner (Hogmanay, Burns Night, Tattie Howkin' holidays, Highland Games, first frost) in the nursery's own colours, drawn rather than photographed.
3. **Stat tiles with a big number and a one-line caption.** Only with numbers the nursery can prove: places, years open, staff in the baby room, the date of the last Care Inspectorate report, a review score and its source.
4. **A baby-room ratio stated as a promise** ("no more than three children each"). For us, state the ratio only if the nursery confirms it, with the regulation it sits within.
5. **Review cards that carry the nursery name, date and parent type** ("Mother of Child, 9 Oct 2026"). Keep the transparency, and use only the nursery's own reviews with consent.
6. **A fold-away "Find your nearest nursery" bar** is not needed for a one-site nursery, but the idea of a short enquiry (name, phone, child's age, preferred start) is. Four or five fields, all large, with a plain promise of who will call and when.
7. **A big, empty-room photo.** Their best image is a bright room with wooden furniture and a teal wall. Parents want to picture the room. A child-free room photo is the safest way for us to show the place.
8. **A flat circle motif** (lime, gold, lilac) around a banner. It costs nothing, needs no art, and gives a playful feel without clip art.
9. **A named nutrition expert on the menu page** ("created with [name], a specialist in early years nutrition"). Only if the nursery really works with someone, and with their agreement to be named.
10. **A funding FAQ as an accordion with real questions** (maternity leave, mixing funded and paid hours, rolling over unused hours). Do the Scottish version: 2-year-old eligibility, 3 and 4-year-olds, deferral, funded hours across the year. Check against the council and mygov.scot.

## Avoid this
- SEO-first copy ("Where can I find a nursery near me?") that talks to Google, not to a worried parent.
- A lead form on every page that asks for a postcode and date of birth before showing anything about the nursery.
- A cartoon or 3D mascot as the whole brand. A small nursery's real garden and real people are better.
- Light-weight (300) body text in a light colour on white or mint.
- Duplicated FAQ items and an empty review area. Test every widget on a phone.
- Hiding the prices. We should publish a dated fee sheet or say "phone to check".
- Cookie banners (we use no tracking).
- Using the monkey, the logo or the Marvin art, or any child photo: we can't reuse these.
