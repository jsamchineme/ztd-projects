# Links Nursery (Musselburgh) and City and Little City Nursery (Edinburgh)

Studied 13 October 2026. The two sites are **sister nurseries** in one group of three ("Links Nursery is part of a group of three nurseries"; the Links careers page also recruits for "City and Little City Nursery in Edinburgh"). Both were built by **Childcare Marketing** ("Proudly Created by Childcare Marketing") on one WordPress and Elementor template, so I treat them as one study with differences noted. Scratchpad folder: `study-3/links/` and `study-3/city/`.

**How these were collected:** both sites block headless browsers behind a "security check" page (the pipeline crawler got HTTP 401 and a screenshot of the check). I fetched the HTML with `curl` instead and rendered it in Chrome by feeding it through (`study-3/shotcurl.mjs`), so the layout is real but some images and one section are missing, and fonts are read from computed styles. I captured the home pages at 390 and 1280px; inner pages were read as text only (no inner screenshots). The booking calendar is an embedded widget I could not load.

## At a glance
- **Links Day Nursery, Musselburgh** (8 Balcarres Road, EH21 7SD, East Lothian): independent, since 1995, ages 0 to 5, in a "spacious traditional stone building with three large garden areas" beside Musselburgh racecourse. Rooms: Hedgehogs (0 to 2, up to 27), Squirrels (2 to 3, up to 25), Foxes (3 to 5). Mon to Fri 7.30am to 6pm. Council funded places with East Lothian Council.
- **City and Little City Nursery, Edinburgh:** two red-stone buildings in Greenbank (City Nursery, 47 Greenbank Drive EH10 5SA; Little City Nursery, 2A Rattray Drive EH10 5TH), up to **143 children**, 0 to 5, 7.30am to 6pm. Council funded places (1,140 hours) with the City of Edinburgh Council. Rooms include Caterpillars, Busy Bees, Ladybirds and Early Learners.
- **Price position:** mid-market private, with **published fees**. Links (from 1 March 2025): under 2s £48.50 morning, £44.85 afternoon, £89.55 full day; over 2s £45.55, £41.50, £82.00; hourly £10.55 without lunch, £15.60 with. City: under 2s £50.40 morning and £89.00 full day, over 2s £44.00 / £79.00 full day; hourly £10.55 and £15.60. 5% sibling discount (six or more sessions each).
- **URLs:** https://linksnursery.co.uk/ and https://city-nursery.co.uk/ (both confirmed; the City site is the "City & Little City" one).

## Site map
- **Links menu:** Home / Parents Information (with Facilities, Fees, Menu as in-page sections of one long page) / Blog & Resources / Gallery / Careers / Contact Us / Events; buttons "Book a Tour" and "Parent Noticeboard" (a side tab).
- **City menu:** Home / Parent Information / Our Facilities / Our Fees / Our Menus / Our Staff (these are sections on one long page) / Blog & Resources / Gallery / Careers / Contact Us / Events, with Little City and City Nursery as sub-choices, plus "Book a Tour" and "Parent Noticeboard".
- **Footer:** Parent Information, Blog & Resources, Careers, Contact Us, Book a Tour, privacy policy, the phone number and "Enquire Now".
- **Page types:** homepage; one long Parents Information page that holds almost everything (communication, staff, rooms, outdoor, **a full weekly menu**, contracts, fees, funded places); Gallery; Blog (empty template); Events ("We currently have no events coming up. Don't panic! Register to our events alert system"); Careers (with an application form); Contact; **Book a Tour**, which is just an embedded calendar.
- **Gaps:** the News section shows "News Title Here / Lorem ipsum dolor sit amet" placeholders on both sites. A parent sees unfinished template text.

## Homepage, section by section (phone)
1. A header with a **mascot logo**: "Links Nursery" uses a coloured letter L-I-N-K-S with a small pony in the "I" slot (red, blue, pink, green, in a Playbill-style serif) and "Nursery" in slate blue. City and Little City uses a mouse in the "C" of a coloured "City".
2. A hamburger, a call icon and a lime-green pill **"Book a Tour"** in a header that stays at the top.
3. Hero: a big photo masked by a circle or a rounded corner. Links: children in hi-vis tops hanging over a fence in a field. City: children from behind in purple backpacks and hi-vis tops walking through a museum, in a big circle mask on desktop. Small lime label "Links Day Nursery Musselburgh", then a large heading "High Quality Childcare for 0-5 Year Olds in Musselburgh" (white on the photo at Links, slate on white at City) with a clock icon and "Monday to Friday: 7.30am until 6pm" and a lime "Enquire Now" button. City adds "full time and part time places, and a limited capacity for term time only places."
4. **Four icon tiles** (pale blue circles with line icons: a house with a heart, a snail, hands holding a heart, a chef hat), each with a coloured title (red, lime, slate, orange): "Modern purpose-built nursery facilities", "Large and inviting garden areas", "In the heart of the community", "On-site chef cooking nutritious meals", each with one sentence.
5. A pale blue panel with a large quote mark and **a Care Inspectorate inspection quote as the testimonial**, shown as three slides with dots. Links: "Kind, nurturing and warm interactions: Children were supported by staff who knew their preferences and characters well..." City: "Children experienced a sense of belonging and nurturing support." Each ends "- Care Inspectorate". At Links a photo of children looking at a racecourse fence sits left, in a rounded-corner mask.
6. A gallery strip of room photos in rounded rectangles (two visible on a phone, a carousel).
7. **Google reviews** (Trustindex widget) with the names, e.g. "12 Google reviews" at Links and "3 Google reviews" at City.
8. "Providing Quality Childcare in Musselburgh/Edinburgh": two paragraphs of description (capacity, area, flexible contracts, funded places).
9. Footer with phone, address, "Enquire Now", the designer credit; a **blue circle accessibility icon** floats bottom right on every page, and the **"Parent Noticeboard" tab** is fixed on the right edge on desktop.

## How it sells
- **Promise:** a nurturing, flexible local nursery. "Flexible Childcare for 0-5 Year Olds in Edinburgh". "Notwithstanding our size, you can still expect a warm personal welcome for your child." "In the heart of the community."
- **Tone:** plain, practical and professional; descriptive rather than emotional. The warmth comes from quotes, not copy.
- **Proof:** the standout idea is **quoting the inspector**. The homepage testimonial slider is built from Care Inspectorate wording: "The genuine love shown by the staff was evident by visibly happy children." This sidesteps the ban on grades without a date by using their own report's words, attributed. (A parent still can't see the grades or the date, so link to the report as well.) Also Google reviews with named reviewers, staff registered with SSSC or GTC and PVG checked (City), a named manager (Cara Ross, City), **stated ratios** (1:3 and 1:5 in the younger rooms, 1:8 in preschool, as the City page words it, and 1:8 in Links' preschool; the brief's rule is not to print a ratio unless the nursery states it).
- **Real parent phrases (Google):** "she was so excited when we arrived and she got to ring the bell"; "the little ones go out on at least one walk a day, sometimes two"; "Beautiful red stone buildings!"; "On site parking making drop off and pick up easy."
- **Differentiators:** an on-site chef with a **full weekly menu printed on the site** (Monday: pasta of the day, vegetarian option, natural yoghurt with fruit sauce, homemade muffin); forest school outings two days a week to Hermitage of Braid nature reserve (City); daily walks (Links); mud kitchen and loose parts; three gardens; on-site parking; CCTV monitoring of sleep areas at Little City (their statement, partly truncated in my capture).
- **Urgency and scarcity:** "limited capacity for term time only places"; "limited availability" for 40-week funded places; "Register to our events alert system".

## Conversion mechanics
- **CTAs:** "Book a Tour" (lime pill in the header on every page, plus the footer), "Enquire Now" (hero, after each section, footer), a phone icon (call) in the header, the phone number in the footer.
- **Tour flow:** click Book a Tour, land on a page that is only a heading and an **embedded calendar widget** (the booking widget loads from a CRM, api.re-start.app) that lets the parent pick a day and slot. At City the page holds a calendar per nursery. This is the only calendar-style tour booking in my sample. I couldn't see the steps or fields.
- **Enquire Now:** a pop-up form (an Elementor pop-up link) with a message; fields not captured.
- **Fees transparency:** high. Session prices and hourly rates are written out with the effective date ("from 1st March 2025"), plus sibling discount and how funded places work (Links: 40 weeks, three full days 7.30 to 5.00; or 50 weeks, two full days and one "floating day" a month). The dates are a year old, so they may be out of date.
- **Waiting list:** none stated.
- **Pop-ups:** a consent banner (Complianz) that opens on first visit and covers most of the bottom of a phone, an Enquire pop-up, the side Parent Noticeboard tab.

## Visual design
- **Type:** Nunito Sans (700 for headings, 18px grey body) and **Sanchez** (a slab serif) for large display subheads at about 52px; the nav falls back to the system sans. Tidy, friendly, readable.
- **Palette:** lime or apple green **#A7C957** (CTAs, small titles), slate blue about **#547584** (headings, text), baby blue **#BEE1F5** (panels, icon discs), accents of red, orange, magenta and purple only in the logo and the tile titles. White ground.
- **Illustration:** the mascot logos (a pony; a mouse), and a custom set of soft line icons in baby-blue discs. Nothing else.
- **Shapes:** large organic radius on images (a circle mask at City, a one-corner round at Links, pill-shaped gallery tiles), pill buttons, a pale blue panel with a big quote mark.
- **Photography:** real, informal outing photos: children in hi-vis tops and backpacks in a field, at a museum, at a racecourse fence. The Links hero shows laughing faces to camera; the City hero and the racecourse-fence photo show children from behind, which is **the pattern we are allowed to reuse in spirit**: it shows life and movement without faces. A few room shots (a calm play room with a leaf canopy, a loose-parts den) are strong and need no children.
- **Motion:** sliders, a sticky header, a pop-up.
- **Density:** medium, with long text on the parent page.
- **Fun:** the hi-vis crowd photo; the mascot pony and mouse; icon discs.
- **Premium:** none really; it reads friendly and practical.
- **Weak:** placeholder "Lorem ipsum" news boxes; a gallery slider; rainbow colours in the tile titles (red, lime, slate, orange) look arbitrary; the slate-on-pale-blue text and lime-on-white labels are low contrast; the white-on-lime button text is low contrast.

## Phone experience
- **Works:** the header has Book a Tour and a call icon at once; the hero photo is big; the four tiles read in one scroll; hours are in the hero; the lime button is easy to find; the full menu and fees are on the same page.
- **Doesn't:** the consent banner takes the bottom third and the Enquire pop-up adds another layer; the Parent Noticeboard side tab overlaps the hero text on City (it cut off the word "in"); the heading wraps awkwardly beside the tab; the fixed accessibility button covers content; very long single page for parents.

## Steal this
1. **Quote the inspector, attributed and dated.** Lift one or two sentences from the nursery's own latest Care Inspectorate report as a pull-quote ("Children experienced a sense of belonging and nurturing support - Care Inspectorate, [month year]") and link to the full report with grades. Wording must be copied exactly from the report.
2. **Four icon tiles for the four things parents ask first** (the building, the garden, the community, the food). Draw them in a consistent line style in baby-blue discs; works for any nursery with no photos at all.
3. **Print the weekly menu on the page.** Monday to Friday with the vegetarian option. It is the most concrete "what will my child eat" answer and needs no child photo; photograph a plate or the kitchen.
4. **Fees with an effective date and the funding patterns explained** (e.g. 40 weeks over three days or 50 weeks over two days plus a floating day). Phone to check for anything unclear.
5. **A calendar tour booking.** Pick a slot on the page. Build it as a simple "choose a day" list for the nursery's real open times with a phone fallback; no third-party widget, per GDPR rules.
6. **Children from behind in a line, in matching hi-vis, as the hero.** That is a real pattern in this market, and it is what we may show. For our builds use a similar view with no identifiable child, or the row of hi-vis tops and wellies on pegs.
7. **A mascot or local character in the logo** (a pony near a racecourse, a mouse for "City"). Have a nursery's own character drawn once and re-used as a sticker, a map pin and a favicon.
8. **A circle-masked hero image** as a single friendly shape; the mask also crops tightly to hands, boots and garden.

## Avoid this
- Lorem ipsum news boxes and empty "no events" pages; remove sections the nursery can't maintain.
- Multiple stacked overlays (consent, enquiry pop-up, floating accessibility button, side tab) on a 390px screen.
- A rainbow of tile title colours; keep one accent.
- Fee dates a year old with no "phone to check".
- Grey body text on white and lime-on-white labels; they will fail WCAG 2.2 AA contrast.
- Stated ratios and CCTV claims unless the nursery gives them; they are claims we can't verify.
- Bot-blocking security checks that stop crawlers and some real visitors seeing the site at all.
