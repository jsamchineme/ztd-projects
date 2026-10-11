# Front Desk Local

> Pipeline name: **Front Desk Local** (folder `templates/uk-local/`). The **Front Desk** family (GP, Dental, Local) is task-first with little imagery; the **Familiar Faces** family (GP, Dental) and **Doorway** are people- and photo-led. When this brief says "Front Desk", it means this template.

A website template for small and rural UK dental practices and GP surgeries.

**The idea in one line:** the homepage does what a good receptionist does. It tells you if the practice is open, gives you the phone number, answers the five questions people ring up to ask, and tells you who to call when it's closed. Then it gets out of the way.

Front Desk is the "after" in a before-and-after pitch. It doesn't try to win on photography or fashion. It wins on what patients notice straight away: the number is right there, it says "Open now. Closes at 6pm", and the answer to "Can I join?" is on the first screen of their phone. It looks expensive because of how well it's made: one very legible typeface, a careful type scale, the practice's own colour used with restraint, and NHS patterns patients already trust. It doesn't look expensive because of decoration.

## Files

| Path | What it is |
|---|---|
| `styles.css` | The whole design system. Section 1 is the **tokens**: re-theme a practice by editing only that block. |
| `frontdesk.js` | About 120 lines of plain JS. It runs the phone menu and the live "Open now" status. There are no dependencies and no build step. |
| `fonts/` | Atkinson Hyperlegible Next as a variable woff2 (weights 200 to 800), with Latin and Latin Extended subsets totalling 53 KB. The licence is SIL OFL 1.1 (`fonts/OFL.txt`). It's referenced by relative path from `styles.css`. |
| `example/index.html` | A complete homepage for a real practice, Wick Dental Practice in Caithness. It's built only from facts on its own website, its NHS inform listing and official NHS pages. |

The example uses no images, so there's no `example/img/`. That's deliberate (see decision 6).

---

## 1. Why it looks like this: research to design

Each major decision comes from a research finding. If a client asks for something that breaks one of these, show them the finding.

| # | Decision | Research finding that drives it |
|---|---|---|
| 1 | **Top tasks fill the first phone screen.** The order is: status, a Call button with the number in it, the address with "Get directions", then *Quick answers* ("I'm in pain", "Can I join?", "How do I book?", "What will it cost?", "Where are you?"). | NHS England: *"the homepage is the first place that 80% of users will look when searching for a task"* and *"put all key tasks high up on the homepage."* Patients' top tasks for a dentist are join, book, emergencies, costs, hours, phone and address. 81% of nhs.uk sessions are on mobile (NHS England, *Creating a highly usable and accessible GP website*, 1.5). |
| 2 | **Quick answers are a ruled question-and-answer list, not a tile grid.** Each item has a question as its heading, a one-line answer, and one verb link to the full section. | NHS England: *"Don't have paragraphs of text on the homepage, just have tasks and calls to action"*, and *"the more options users had on a page, the more likely they were to be unsure which to choose."* A short answer often finishes the task without a click, which matters for patients with low digital confidence. |
| 3 | **No pop-ups, overlays, cookie walls, chat widgets or carousels.** Time-limited news goes into the section it's about. | *"27% of participants who visited a site with an overlay as the first thing they saw struggled to get past the overlay, especially on mobile"* (NHS England 3.12). The practice's current site opens with exactly that kind of popup. |
| 4 | **A menu of 7 items or fewer, with "Home" in it.** On phones the button says **Menu** in words; there's no hamburger icon. | NHS England 3.4: *"Main menus should not have more than seven items"* and *"most patients do not know that the logo… takes you to the homepage."* NHS England 3.5: *"don't use an icon to represent the menu… use the word 'menu'."* |
| 5 | **Plain English at a reading age of 9 to 11.** Sentences have 20 words or fewer. Links start with a verb ("Get directions", "Read how joining works", "Check the GDC register"). Times are written as 8am, 5:30pm and midday, and ranges use "to". | NHS service manual, *How we write* and *Numbers, measurements, dates and time*. NHS England: links should *"start with a verb."* |
| 6 | **No decorative photography and no stock photos.** A photo is used only when it does a job, such as showing the building's entrance or a real team member's face, and only if the practice's own photo is good. | NHS England, stage 2 of the step-by-step guide: *"Images… should only be used if there is a real user need,"* and *"remove non-essential images."* NHS service manual, *Images*: *"Unnecessary or decorative images can frustrate users."* Wick's own photos are 363×300 composites with stock backgrounds, so they're left out. |
| 7 | **The NHS care-card pattern for emergencies,** ordered by severity: emergency (999 or A&E), urgent (phone us, or 111 when closed) and non-urgent (next working day). | NHS service manual, *Care cards*: *"users scanning pages consistently paused to read care cards and understood the required action."* Patients in Scotland know these cards from NHS inform. The content comes from NHS inform *Dental emergencies* and nhs.uk. |
| 8 | **A live open or closed status** from the published hours, in Europe/London time. It says "Open now. Closes at 6pm", "Open now. Closes soon, at 6pm" or "Closed now. Opens on Monday at 8am". | "Can I ring them now?" is the question behind most visits. NHS England 3.6: *"make sure useful information like opening times and the practice phone number are visible on the homepage."* |
| 9 | **Atkinson Hyperlegible Next for everything,** with 19px body text on phones and 20px on desktop. | It was designed by the Braille Institute for readers with low vision, and its letterforms are unambiguous (I, l and 1 differ; the zero is slashed so 0 is not read as O in a phone number). That suits older readers. The NHS default is 16px on mobile and 19px on desktop; this template goes larger because many patients are older. |
| 10 | **NHS meaning colours and NHS focus style.** Links are blue #005EB8, care cards use NHS red and blue, and focus is yellow #FFEB3B with a black bar. The practice's own colour is used only for brand moments: the header stripe, the mark, the Call button and the hero tint. | NHS service manual, *Colour* and *Focus state*. Patients already know these signals from nhs.uk and NHS inform. Not using the NHS logo or the NHS blue header keeps it clear that this is the practice's own site. |
| 11 | **Total weight under 100 KB.** It uses one font file, no images, no third-party scripts, no map embed and no analytics. | The brief targets rural signal. NHS England 1.5: *"build for relatively simple browsers (like those used on a mobile)."* A Google Maps embed alone is about 1 MB and sets third-party cookies, so the template uses a "Get directions" link instead (GDPR). |
| 12 | **A "Page last reviewed" date** in the footer. | NHS England, stage 2.4: *"Add timestamps to your pages to show when the content was last reviewed."* |
| 13 | **Phone first, then wider screens.** It's one column on a phone. The desktop only adds the Opening times card next to the hero and lays the answers out as a table. | NHS England 1.5: *"think of it as a long list (how it will be viewed on a mobile screen)."* |

### What the rejected rounds got wrong, and how this one avoids it

- **Haven** led with a large landscape photograph and a "hotel" mood. It looked beautiful, but it put decoration before tasks, which is the opposite of decision 6. A nervous patient doesn't need cliffs; they need the number.
- **Atelier** was a magazine look: serif display type, italic flourishes and asymmetric grids. It's trend-driven and reads as a cosmetic clinic, not an NHS provider.
- **Civic** was close in spirit, but its 01 to 09 numerals and its timetable bars were still decoration. A nine-tile grid is the very "tile grid" competitors use.
- **Front Desk** keeps one idea, task first, and makes it premium through craft and restraint.

---

## 2. Rules (non-negotiable)

1. **Never invent facts.** Every name, qualification, time, service, phone number and policy must come from the practice's current site, its NHS listing (NHS inform in Scotland, nhs.uk in England) or the job card.
   - Don't invent prices, online booking, reviews, statistics, awards, parking, wheelchair access, waiting times or team members.
   - When a fact is stale or unclear, tell patients to phone to check, and list it in your report.
   - A GDC or NHS rule must be presented as that body's rule ("General Dental Council standards say…"), never as the practice's own promise.
2. **The first phone screen (390×844) must show:**
   - the open or closed status
   - a Call button with the number in it
   - the address with "Get directions"
   - "I'm in pain" (dental) or the urgent-help route (GP)
   - the start of "Can I join?"
3. **No pop-ups, overlays, carousels, auto-play, chat widgets, accessibility overlays or cookie banners.** The template sets no cookies. If a builder adds analytics, it must be cookieless and self-hosted, or there must be a consent design that doesn't cover content.
4. **The menu has 7 items or fewer and includes "Home".** There are no sub-menus. On phones the button reads "Menu".
5. **Plain English.**
   - Reading age 9 to 11, sentences of 20 words or fewer, and paragraphs of 3 sentences or fewer.
   - Use "you" and "we".
   - Write headings as patients' own words, often as questions.
   - Start links with a verb, and make sure each one makes sense out of context.
6. **Numbers.**
   - Practice numbers are `tel:` links written like the NHS listing (for example `01955 609949`).
   - Short NHS numbers (999, 111, 116 123) are **plain text in `<strong>`**, never `tel:` links.
   - Times are written as 8am, 5:30pm and midday. Ranges use "to", never a dash.
7. **Photos are optional.**
   - Use the practice's own photos only when they're sharp, at least 800px wide, honest (no stock backgrounds) and of a real person or place.
   - Use Wikimedia Commons photos only if they help someone find the building, and credit them visibly with the licence.
   - Never use stock photos of people.
   - Never use a Google Street View capture.
8. **No third-party embeds.**
   - Don't embed a map. Link to Google Maps with an `api=1` search URL.
   - If a client insists on an embedded map, give the iframe `tabindex="-1"` and `aria-hidden="true"` and keep the text "Get directions" link.
9. **Logos are inline SVG,** never `<img src="*.svg">`.
10. **Scotland and England differ.** In Scotland, use NHS inform and NHS 24 on 111. In England, use nhs.uk, NHS 111, NHS dental bands and CQC. Check the official cost page on the day of the build, because figures change every April.

### Accessibility (WCAG 2.2 AA): built in, and don't break it

- **Contrast:** text is 4.5:1 or more and UI components 3:1 or more. All token pairs are listed in section 5. Check any new colour with a contrast checker before use.
- **Focus:** the NHS pattern is built in. Links get a yellow fill with a black bar; buttons turn yellow with a black underline. Don't override `:focus-visible`.
- **Skip link:** "Skip to main content" is the first element. `<main id="main" tabindex="-1">`.
- **Landmarks:** `header`, `nav[aria-label="Main menu"]`, `main`, `section[aria-labelledby]`, `aside` and `footer`.
- **Headings:** one `h1`, an `h2` for each section and `h3` inside, with no skipped levels. The footer column headings are `h2`.
- **Tap targets:** 44×44px or more on phones. Buttons are 56px tall. Stand-alone links use `.go`, which has a 44px minimum height. Footer links and contact links have their own `min-height: var(--tap)`. A link inside a sentence is exempt.
- **Menu:** the `.menu-toggle` button has `aria-expanded` and `aria-controls="site-nav"`. Escape closes the menu and returns focus to the button. Without JS the menu is simply open.
- **Motion:** smooth scrolling only under `prefers-reduced-motion: no-preference`, and all transitions are switched off under `reduce`. Nothing animates on load.
- **Text resize:**
  - Sizes are in rem and breakpoints in em.
  - Tested at 200% text with no horizontal scroll at 1280px, and at 390px (which is past the WCAG requirement).
  - Hours rows wrap.
  - Grid tracks are `minmax(0, 1fr)`.
  - Long email addresses wrap.
- **Tables:** the hours are a `<table>` with `th scope="row"` and a hidden caption. Today's row gets `aria-current="date"`.
- **Care cards:** each heading has a visually hidden urgency prefix, as in NHS.UK ("Immediate action required:", "Urgent advice:", "Non-urgent advice:").

---

## 3. Homepage structures

Use these class names exactly. Every section is `<section class="section" id="…" aria-labelledby="…">` wrapping `.wrap`. Alternate `section--surface` (white) with the default paper ground so long pages have rhythm.

### 3a. Dental practice (as in the example)

| # | Section | id | Classes | Content rules |
|---|---|---|---|---|
| 1 | Header | | `.site-header`, `.site-header__bar`, `.brand`, `.brand__mark`, `.header-call`, `.menu-toggle`, `.site-nav` | Inline SVG mark, practice name and town. The Call button with the number shows from 40em. The menu is: Home, Emergencies, Join, Costs, Treatments, Our team, Opening times and contact (7). |
| 2 | Hero | | `.hero`, `.hero__grid`, `.status[data-status]`, `.hero__lead`, `.btn.btn--block`, `.hero__where`, `.today.today--hero` | **h1 = what and where** ("Your NHS and private dentist in Wick"). Lead = "Phone us to book, to ask about joining, or if you're in pain." Then the Call button, then the address and "Get directions". The Opening times card, with hours grouped (for example "Monday, Tuesday, Thursday, Friday"), shows from 56em only. Put the no-JS fallback text inside `[data-status-text]`. |
| 3 | Quick answers | | `.section--answers`, `.answers`, `.answer`, `.answer--urgent`, `.go` | 5 rows in this order: I'm in pain, Can I join?, How do I book?, What will it cost?, Where are you? Each row is an `h3`, a one-line `p` and one `.go` verb link. |
| 4 | Dental pain and emergencies | `emergency` | `.care-card--emergency`, `--urgent`, `--non-urgent`, `.note`, `.source` | Copy the three cards from NHS inform and nhs.uk (see the example). Add the **local health board's dental helpline** for unregistered patients (NHS inform *Dental emergencies* lists each board). Out of hours is NHS 24 on 111. |
| 5 | Joining | `join` | `.steps`, `.note`, `.ruled` | If NHS registration status isn't confirmed today, say: "We cannot always take new NHS patients. Phone us to ask." Use three steps (phone, details, first check-up). Add a "Feeling nervous?" note, quoting the practice's own words if it has any. Then "Good to know" facts from NHS inform. |
| 6 | Costs | `costs` | `.cost-hero`, `.cap`, `.note` | Scotland: free check-ups for everyone; free treatment groups; 80% of cost capped at £384 per course; HC2 and HC3. Private: "ask us for a quote", unless the practice publishes a current, dated price list. Cite the GDC standard on written treatment plans. Link to the official source. |
| 7 | Treatments | `treatments` | `.split`, `.ruled` | Two lists, "On the NHS" and "Private (ask for a quote)". Only list treatments the practice names. Put plain words first, then the clinical term in brackets. |
| 8 | Our team | `team` | `.people`, `.person`, `.person__initial`, `.person__role`, `.person__quals` | Name, role and qualifications exactly as published. Use initials unless there's a good real photo (then swap `.person__initial` for a 112×112 `<img>` with `border-radius:50%`). End with the "Check the GDC register" line. Never show a GDC number you haven't verified. |
| 9 | Opening times and contact | `contact` | `.today`, `.hours`, `.contact-list`, `.go` | The full 7-day table, a second status pill, phone, address, email (with "Do not email about pain"), "Get directions on Google Maps", and a link to the NHS listing. |
| 10 | Footer | | `.site-footer`, `.foot-grid`, `.foot-bottom` | Name, address, Call link; Urgent help (999, 111 as plain text); Useful links (NHS care, GDC register, complaints); © line and "Page last reviewed: [date]". |

### 3b. GP surgery (NHS England benchmark)

Use the same tokens, components and tone. The structure changes to meet NHS England's *GP website benchmark and improve tool* and *Creating a highly usable and accessible GP website*.

**Menu (6 or 7 items, no sub-menus):**
- **Home, Appointments, Prescriptions, Services, About the surgery, Contact us.** This is NHS England's recommended six.
- A seventh, **Test results**, is allowed only if the client insists.
- Never use "News".
- On a multi-page GP site, put a visible search box labelled "Search" in the header (NHS England 3.5). Build it with a static index (for example Pagefind) and never with a third-party script.

| # | Section | Content rules |
|---|---|---|
| 1 | Header | As for dental. Call button with the number. |
| 2 | Hero | Status pill. **h1 = practice name and town** ("Kingsmills Medical Practice, Inverness"). Lead: "Contact us to make an appointment, order a prescription or get help." Call button. Address and "Get directions". On desktop, the Opening times card, which must include **phone line hours if they differ from door hours** (use two `.today` tables). |
| 3 | **Top tasks** (`.answers`), immediately after the hero, so they sit in the **top third** of the page | 7 rows, using NHS England's tested wording as `.go` links: **Make, change or cancel an appointment**, **Get a repeat prescription**, **Get test results**, **Get a sick note for work** (fit note), **Join the surgery**, **Phone us** (number and line hours), **Find us** (address). Each row has a one-line answer specific to the practice (for example "Phone from 8am, or use the online form from 8am to 6:30pm"). Link to an online service only if the practice's site confirms it. Never use the phrases "online consultation" or "emergency appointment"; say "contact us online" and "urgent". |
| 4 | **Urgent help** (`id="urgent"`) | Three care cards ordered by severity: **Emergency:** "Call 999 or go to A&E if…" (life-threatening: chest pain, stroke signs, severe bleeding, struggling to breathe). Take the list from nhs.uk *When to call 999*. **Urgent:** "Phone us, or 111 when we are closed" (Scotland: NHS 24 on 111; England: NHS 111 online or 111). **Non-urgent:** "Ask a pharmacist" for minor illnesses (Scotland: Pharmacy First; England: Pharmacy First conditions). Put 999 and 111 as plain text. |
| 5 | How we deal with your request | `.steps` showing what happens after you contact the practice (who reads it, how fast, how you're contacted). Describe only a process the practice publishes. Use "consultation" for any contact with a clinician. |
| 6 | Prescriptions and results | Two `.split` columns with `.ruled` lists: ways to order (NHS App, online, paper slip, pharmacy) and how long it takes; how and when to get results. |
| 7 | **Our team** | A **staff list with roles and qualifications**, grouped with `h3`s: GPs (with GMC-listed qualifications, for example "MBChB MRCGP"), Nurses, Healthcare assistants, Pharmacists, Practice management, Reception. Use `.people` and `.person`. Name, role and qualifications are required; use photos only if they're real and good. Add "Check the GMC register" (England, Scotland and Wales GPs: gmc-uk.org) and the NMC register for nurses. |
| 8 | Opening times and contact | As for dental, plus the practice boundary or catchment if published, and a link to the NHS listing. |
| 9 | Footer | As for dental, plus links to Privacy notice, Accessibility statement, Complaints, and (in England) the CQC rating and GP earnings statement, but only if those pages exist. |

**GP benchmark self-check:**
- Top tasks are in the top third.
- The menu has 7 items or fewer and includes Home, Appointments and Prescriptions.
- Urgent help shows 999, 111 and the pharmacy.
- There's a staff list with roles and qualifications.
- There are no overlays.
- Every link starts with a verb.
- Phone number and opening times are on the homepage.
- There's a "Page last reviewed" date.

---

## 4. Components

- **`.btn`**: primary, in the brand colour with white text, 56px tall and pill-shaped. Use **one** primary per screen (Call). `.btn--secondary` is outlined. `.btn--block` is full width on phones.
- **`.go`**: a stand-alone verb link with an arrow and a 44px tap height.
- **`.status[data-status]`**: the live status pill. Put fallback text in `[data-status-text]`. JS sets `data-state` to `open`, `closing` (last 60 minutes) or `closed`. You can use it more than once per page.
- **`.today` and `.hours`**: the Opening times card. Each `<tr data-day="mon">` (or `data-day="mon tue thu fri"` for a grouped row) is highlighted when it's today.
- **`.answers` and `.answer`**: the ruled Q&A list. `.answer--urgent` turns the question NHS red; use it only for the pain or urgent row.
- **`.care-card--emergency | --urgent | --non-urgent`**: NHS care cards. Use them only for "who to contact and how fast".
- **`.steps`**: a numbered sequence with a connecting line.
- **`.cost-hero`**: one big figure ("Free") in a brand panel. **`.cap`**: a big figure with a one-line explanation, between rules.
- **`.ruled`**: a hairline list. Add `<small>` for a plain-English description.
- **`.note`**: a tinted inset with a brand bar for advice or GDC and NHS rules. **`.source`**: small grey text naming the source, with a link.
- **`.people` and `.person`**: staff cards: initial or photo, name (`h3`), role, qualifications.

### Hours data (the only JS configuration)

Put this just before `</body>`. The status pill and the "Today" highlight read it.

```html
<script type="application/json" id="practice-hours">
{
  "timeZone": "Europe/London",
  "days": {
    "mon": [["08:00", "18:00"]],
    "tue": [["08:00", "18:00"]],
    "wed": [["08:00", "20:00"]],
    "thu": [["08:00", "18:00"]],
    "fri": [["08:00", "18:00"]],
    "sat": [],
    "sun": []
  },
  "closures": ["2026-12-25", "2026-12-26"]
}
</script>
<script src="../frontdesk.js" defer></script>
```

- Times use 24-hour `HH:MM`.
- A lunch closure is two sessions: `[["08:30","12:30"],["13:30","18:00"]]`.
- `closures` are whole days in `YYYY-MM-DD`. Only add dates the practice has published.
- The table text in the HTML must match this data. Write the text in NHS style ("8am to 6pm").

---

## 5. Token reference (`styles.css`, section 1)

| Token | Default (Wick) | Role, and the rule to keep |
|---|---|---|
| `--brand` | `#55297C` | The practice colour: Call button, header stripe, mark, step numbers, `.cost-hero`. **Must be 7:1 or more with white** (Wick is 10.5:1). Take it from the logo and darken it until it passes. |
| `--brand-strong` | `#3E1D5C` | Hover and pressed state of `--brand`, about 15% darker. |
| `--brand-tint` | `#F4F0F8` | Hero ground, today row, notes. A very light tint of `--brand` (L of 95% or more), so `--ink` stays above 14:1 (Wick: 14.2:1). |
| `--brand-line` | `#DCD0E8` | Rules and borders on the tint. Decorative only. |
| `--mark-accent` | `#E8792B` | The second logo colour. **Use it in the SVG mark only, never for text** (it fails contrast). |
| `--ink` | `#1D2228` | Body text: 14.7:1 on paper. |
| `--ink-soft` | `#4A535D` | Secondary text: 7.2:1 on paper, 7.8:1 on white. Don't go lighter. |
| `--paper` | `#F7F5F1` | Page ground, warm and low-glare (NHS uses a grey ground for the same reason). |
| `--surface` | `#FFFFFF` | Cards and alternate sections. |
| `--line` / `--line-strong` | `#DAD5CC` / `#8C857A` | Hairlines (decorative) and control borders (3.7:1). |
| `--link`, `--link-hover`, `--link-visited` | NHS `#005EB8`, `#7C2855`, `#330072` | **Don't re-theme.** Patients recognise NHS link blue. |
| `--open`, `--closing`, `--closed` | `#00703C`, `#8A4B00`, `#4A535D` | Status pill colours. Don't re-theme. |
| `--care-blue`, `--care-red`, `--care-black` | NHS `#005EB8`, `#D5281B`, `#212B32` | Care cards. Don't re-theme. |
| `--focus`, `--focus-ink` | NHS `#FFEB3B`, `#0B0C0C` | Focus state. Don't re-theme. |
| `--font` | Atkinson Hyperlegible Next | Keep it. To swap, use another OFL face with a large x-height, distinct I/l/1 and a 0 that differs from O, self-hosted in `fonts/`. |
| `--text-base` | 19px phone, 20px desktop | Don't go below 18px. |
| `--text-small` | 17px | The smallest text anywhere. |
| `--h1`, `--h2`, `--h3` | clamp scales | Change only if a long practice name breaks the h1 at 390px. |
| `--radius`, `--radius-small` | 12px, 8px | Card corners. Buttons are always pills. |
| `--tap` | 44px | Minimum tap size. Never lower it. |
| `--button-height` | 56px | Primary button height. |
| `--gutter`, `--section`, `--wrap` | fluid | Side padding, section spacing and max width (73rem). |

## 6. How to re-theme for a new practice

1. Copy the whole `uk-local/` folder. Make `practice-name/index.html` from `example/index.html`, keeping `../styles.css`, `../frontdesk.js` and `../fonts/`. If the folder layout changes, fix the relative paths and the font `preload`.
2. **Gather the facts.** Use the practice site, the NHS listing (NHS inform service directory or nhs.uk) and the job card. Write down where each fact came from. Flag anything undated or contradictory.
3. **Set the brand colour.** Sample the logo's main colour and darken it until white text on it is 7:1 or more. Set `--brand`, `--brand-strong` (darker), `--brand-tint` (95–97% lightness of the same hue) and `--brand-line` (88–90%). Set `--mark-accent` to the logo's second colour. Don't touch the NHS tokens.
4. **Make the mark.** Redraw the practice's logo as a simple inline SVG at 44×44, using `class="brand__bg"` and `class="brand__accent"` so it follows the tokens. If the logo is too complex, use a rounded square in `--brand` with a simple tooth (dental) or the initial (GP). Never use `<img src=".svg">`.
5. **Write the copy** by replacing the Wick facts section by section. Keep the headings and the order. Read every sentence aloud: if it has more than 20 words or a word a 10-year-old wouldn't know, rewrite it.
6. **Set the hours** in both tables, the grouped hero table and the JSON. Check them against the NHS listing.
7. **Set the local emergency route:** the health board's dental helpline (Scotland) or 111 (England).
8. Update the `<title>`, the meta description, `theme-color` (= `--brand`), the footer © and "Page last reviewed".
9. Run the checklist below.

## 7. Pre-handover checklist

**Facts**
- [ ] Every fact on the page is traceable to the practice site, NHS listing, official NHS or GDC page, or the job card. Uncertain items are listed in the handover note.
- [ ] No prices unless the practice gave a current, dated list. Otherwise "ask for a quote".
- [ ] NHS costs match the official page on the build date. In Scotland, check that £384 and 80% are still current.
- [ ] Joining status: if it's not confirmed today, the copy says "phone to ask".
- [ ] Team: names, roles and qualifications as published. No invented staff. No unverified registration numbers.
- [ ] GDC or NHS rules are attributed to that body.

**First screen (390×844 phone)**
- [ ] Status pill, Call button with the number, address and "Get directions", "I'm in pain" (or Urgent help), and the start of "Can I join?" are all visible without scrolling.
- [ ] On a 1280×800 desktop, the menu, the Call button, the Opening times card and the Quick answers heading are visible.

**Content and links**
- [ ] The menu has 7 items or fewer and includes Home. The GP menu includes Appointments and Prescriptions.
- [ ] Every link starts with a verb and makes sense out of context. No "click here" or "read more".
- [ ] 999 and 111 are plain text. Practice numbers are full `tel:` links.
- [ ] No `href="#"`. Every anchor target exists.
- [ ] No pop-ups, carousels, embeds, trackers or external fonts or CSS.

**Accessibility**
- [ ] Keyboard only: skip link, menu (Enter opens, Escape closes), every link shows the yellow focus.
- [ ] Text at 200% (browser text-size setting): no sideways scrolling at 1280px or 390px.
- [ ] One `h1`, and headings in order.
- [ ] Any new colour pair is checked: 4.5:1 for text, 3:1 for UI components.

**Performance**
- [ ] The homepage is under 600 KB on a phone (the example is about 78 KB). Any photo is under 120 KB, WebP or JPEG, with `width` and `height` set and `loading="lazy"` if below the fold.

**Audit**
- [ ] Run `node pipeline/audit.mjs http://127.0.0.1:PORT/practice/ OUTDIR`. The result must be 0 blockers, 0 major and 0 minor.
- [ ] Open the desktop and phone screenshots and review them.
- [ ] Test the live status: compare the pill with the hours, today's row highlight and the next-opening wording.

## 8. Sources

- NHS England, *Creating a highly usable and accessible GP website for patients*: https://www.england.nhs.uk/long-read/creating-a-highly-usable-and-accessible-gp-website-for-patients/
- NHS England, *Step-by-step guide to improving general practice website online journeys*: https://www.england.nhs.uk/long-read/step-by-step-guide-to-improving-general-practice-website-online-journeys/
- NHS digital service manual: https://service-manual.nhs.uk/ (Care cards, Images, Typography, Colour, Focus state, How we write, Numbers and dates)
- NHS inform, *Receiving NHS dental treatment in Scotland* (costs, registering): https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/receiving-nhs-dental-treatment-in-scotland/
- NHS inform, *Dental emergencies* (what counts, health-board helplines, out of hours): https://www.nhsinform.scot/care-support-and-rights/nhs-services/dental/dental-emergencies/
- nhs.uk, *How to find an emergency or urgent NHS dentist appointment* (999 or A&E criteria): https://www.nhs.uk/nhs-services/dentists/how-to-find-an-nhs-dentist-in-an-emergency/
- GDC, *Standards for the Dental Team*, Principle 2 (2.3.6 and 2.3.7 on written treatment plans, 2.4 on costs): https://standards.gdc-uk.org/
- Braille Institute, Atkinson Hyperlegible: https://www.brailleinstitute.org/freefont/
