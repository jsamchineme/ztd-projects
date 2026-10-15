# Partou UK

Studied 13 October 2026. Files: `/private/tmp/claude-501/-Users-samuelosuh-codes-mapboard/c179b3f0-507a-47ce-a937-2eef0da893bf/scratchpad/study-4/partou/` (source/pages 40 pages, nursery-source for Stockwood Lane; vp-home2, vp-find2, vp-bristol2, vp-openday2, vp-curriculum2, vp-nursery2 are real screenshots; the plain vp-* folders were removed after a 403).

## Fetching note
www.partou.co.uk returns **403 Forbidden** to our headless browser and curl. The bare **partou.co.uk** works. Screenshots in `partou/vp-*2` were taken with a normal desktop and iPhone user agent. A Cookiebot dialog covered the top of every screenshot and our script could not click through it.

## At a glance
- **Who:** the UK arm of a Dutch childcare group. Per its own history page, Partou launched in the UK in 2024 after merging Just Childcare and All About Children, and now runs 106 nurseries with about 9,000 children and 2,000 staff. Large chain: regional pages for Bristol (11 nurseries), Cheshire, Greater Manchester, London, Wirral and Yorkshire; head office Denton, Manchester. Mid-market price (Stockwood Lane, Bristol, shows fees split into Care, Meals & snacks and Consumables, e.g. 0-2 full day Care £59.75 + Meals £9.85 + Consumables £3.15).
- **URL:** https://partou.co.uk/ (live).
- **Certifications:** Certified B Corp; daynurseries.co.uk review score shown on location pages (Stockwood Lane 9.6).
- **Why it is in the study:** the big-chain benchmark. Strong in functional parent tools (nursery finder, open week, fees by line, reviews, Ofsted extracts) and quiet in emotion.

## Site map
- **Menu (desktop):** Childcare with us (dropdown), Working at Partou (dropdown), About Partou (dropdown), Open days, and a raspberry pill "Find a nursery" with a magnifier. (The crawler found no menu, likely JS built.)
- **Footer:** address, quick links (Find a nursery, About Partou, Childcare funding guide, School readiness, Careers, News and blogs, FAQs, Gender pay gap report, Terms and conditions, Complaints policy, Safeguarding Statement), Facebook, Instagram, LinkedIn, "Built by Fireworx".
- **Page types:** home; Find a Nursery (search plus parent reviews); regional pages (e.g. Nurseries in Bristol: 2,262 words of SEO copy, list of nurseries, 16 reviews); individual nursery pages; Curriculum ("Turning wonder into learning"); Keeping children safe; Safeguarding (3,000 words); Preparing children for school; Food & nutrition; Funding guide and "Working family childcare funding explained"; FAQs (2,000 words); Open day registration; Partou guide to play; B Corp; Our history; About; Careers, Partou & you, apprenticeships; news and blogs (Ofsted praise stories, how we create menus, tips for visits); a public **statement about a safeguarding failure at a former Bristol nursery** (a serious criminal case; the site gives a sober statement and lists the actions taken).
- **Nursery page holds:** Book a visit and Ask us a question buttons at the top; intro; daynurseries score; icon list of five facilities; accordion for Ofsted report, Nursery fees, Funded childcare; embedded Google map; reviews; Ofsted inspection highlights quoted in full with the date; a fees table.

## Homepage, section by section (phone)
1. **Header:** raspberry rounded-square logo, round magnifier button, hamburger.
2. **Hero:** dark photo, H1 "Where little minds grow big", a white **search card** (nursery name, city/town/postcode, distance in miles, search button). Cookie dialog covers it on arrival.
3. **"Exploring, discovering, learning"** on a warm-cream panel with a curved top edge: one paragraph about children's big questions, three outlined buttons (About us, Nursery life, Careers) stacked.
4. **"Why choose Partou?":** a rounded photo (adult and two children at a table) with a play-button video overlay.
5. **"Partou & You":** this is staff recruitment copy ("competitive salary, brilliant benefits") placed on the parents' home page.
6. **Latest news:** three cards with a swoosh-curved photo top, raspberry/coral headings, "Read more". All three news items are Ofsted praise stories (Gloucester, Ware, Sale).
7. **Footer.**

## How it sells
- **Promise:** "Where little minds grow big"; "Turning wonder into learning"; "we love children's big questions".
- **Tone:** polished and corporate with a soft edge. Plain, readable sentences.
- **Proof:** parent review carousels on the finder page and every region page with star ratings, first name plus initial, date and nursery name, a "Read more" link; daynurseries.co.uk score on each nursery; Ofsted inspection extracts printed in full on each nursery page with the date; B Corp; news posts for each good inspection.
- **Differentiators:** per-nursery "authentic treasures" from recycled and real-life items (Stockwood Lane); rotating 3-4 week seasonal menus with nutritionist input; "books are everywhere"; apprenticeships; a visit guide ("Top tips for making the most of your nursery visit") with a question checklist and honest notes (secure entry, photo ID check at the door, post-visit survey "we welcome your honesty").
- **Urgency:** "Open week" events listed by nursery; reviews are dated within days so the site feels alive.

## Conversion mechanics
- **CTAs:** search-first. "Find a nursery" in the header and in the hero. Then nursery-level "Book a visit" and "Ask us a question". Open-day registration by location search.
- **Visit flow (from the visit guide):** book a tour, get an email reminder the morning before with the address and a registration-form link, ring the bell and show photo ID, tour, then an email to register or a short survey.
- **Fees transparency:** high at nursery level. A table by age band and session with care, meals and consumables as separate lines, and funding explained on a long guide page. Group-level pricing is deliberately not shown.
- **Waiting list:** not seen. **Chat:** not seen. **Pop-ups:** Cookiebot full overlay (large, blocks the page until answered).

## Visual design
- **Typeface:** a friendly geometric sans in light and bold (we could not confirm the font name; it reads like a licensed rounded geometric face). Headings in raspberry bold.
- **Palette (estimated from screenshots, not read from CSS):** raspberry/crimson heading colour (about #B5154B), coral gradient bands (about #E8505B), warm cream (about #F5F0EC), near-black text, a soft green Cookiebot button.
- **Illustration and shapes:** no illustration. The signature is a **swoosh curve**: the tops of panels and image cards sweep like a hill or a wave; a crimson-to-coral gradient wave band before the footer CTA. Rounded-square logo. Photos have rounded corners.
- **Photography:** bright, professionally lit, staff in matching burgundy polo shirts with the logo on a child's level, close-ups of play. Faces visible. Warm and consistent.
- **Icons:** thin outline icons for facilities.
- **Motion:** carousels (reviews, news), play-button video, accordions.
- **Density:** medium; wide margins; consistent templating.
- **Fun vs premium:** neither; dependable. The uniforms and curves give it a house style. Fun is low, trust is high.

## Phone experience
- Works: search card early, stacked full-width buttons, accordion for Ofsted/fees/funding on each nursery, big readable body copy (about 18px), reviews as horizontally scrolling cards with a progress bar.
- Doesn't: the consent dialog takes about 60% of the first screen; staff recruitment copy on the main parent page; review carousels hide content; very long region pages (SEO copy); the nursery page is 10,000 px tall.

## Steal this
1. **Review cards with star rating, first name and initial, date and room**, where the nursery has real reviews it can quote with permission, with the source named. Never make reviews up.
2. **"Ofsted inspection highlights" as a block of quotes with the inspection date.** For us: the Care Inspectorate grades with the date and a link, plus two or three quoted lines from the report where the report says them.
3. **Fees split into care, meals and consumables.** Shows what funded hours cover and what extras are. For Scotland: funded 1,140 hours means no top-up fees (see the research brief section 3.1), so the split helps explain optional extras only.
4. **Accordion trio** (Inspection report, Fees, Funded places) under the facts list; keeps long pages short on a phone.
5. **Honest visit guide**: what happens at the door, ID check, what to ask, how to give feedback. A short "What to expect when you visit" page is cheap and builds trust with anxious parents. Add a downloadable list of questions (the nursery can supply the answers).
6. **Curved "hill" section edges** as the brand shape; a Scottish template could use a hill or glen line.
7. **Uniform colour as brand colour.** For small nurseries: pick one colour used on tabards and the site.
8. **A plain statement page** when something goes wrong (not for us to prompt, but it shows how to publish hard news plainly).

## Avoid this
- Cookiebot-style dialogs that block the page.
- Recruitment copy on the parent's home page.
- A "find a nursery" search as the hero when there is one nursery: just give the address, hours and phone.
- SEO region pages (2,000 words of boilerplate).
- Staff photos in matching uniforms are fine; identifiable children are not allowed in our builds.
