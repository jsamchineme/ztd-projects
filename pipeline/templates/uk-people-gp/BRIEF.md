# Familiar Faces GP: a people-led website template for UK GP practices
> Pipeline name: **Familiar Faces GP** (folder `templates/uk-people-gp/`). The **Front Desk** family (GP, Dental, Local) is task-first with little imagery; the **Familiar Faces** family (GP, Dental) and **Doorway** are people- and photo-led. When this brief says "Familiar Faces", it means this template.


**Familiar Faces** shows patients the real people behind their practice: who answers the phone, who they might see, and which doctor they can ask for again. It still does every job a good GP site must do first. The live status, the phone number and 8 top tasks come before any team content on a phone.

It is the "after" in a sales pitch, and a design system that AI build workers reuse. Follow this brief exactly.

- **Sister family:** Front Desk (`uk-gp/`, `uk-dental/`, `uk-local/`) is the task-led, nearly image-free option. Familiar Faces is the people-led option for practices that have, or will pay for, real staff photos. It keeps Front Desk's discipline: NHS patterns, plain English, no pop-ups, live status and verb-led links.
- **Worked example:** Linlithgow Group Medical Practice, West Lothian (prospect `p057-04`, graded Average). Every fact comes from its current website, lgmp.gpsurgery.net, checked on 11 October 2026.

## Files

| File | What it is | Edit per practice? |
|---|---|---|
| `styles.css` | The whole design system. Section 1 holds every token as a CSS custom property. | Tokens only |
| `familiar.js` | About 130 lines of plain JavaScript. It runs the phone menu, the live open or closed status, and hides past holiday dates. It reads its data from the page. | Never |
| `fonts/` | Atkinson Hyperlegible Next, Regular and Bold, Latin woff2 (12 KB each). SIL Open Font Licence (`fonts/OFL.txt`). | Never |
| `example/index.html` | The worked homepage for Linlithgow Group Medical Practice. Copy it to start a new practice. | Yes |
| `example/img/` | `people/` (portraits as 96, 240 and, for doctors, 400px WebP), the building photo, and `CREDITS.txt` with every source URL. | Each practice gets its own |
| `PHOTO-SHOTLIST.md` | One-page brief for the practice or a local photographer. It doubles as a paid add-on. | No |

The page links `../styles.css` and `../familiar.js`. Fonts load from `../fonts/` through the stylesheet. Nothing loads from another server: no CDNs, no Google Fonts, no analytics and no embedded maps (GDPR).

---

## 1. Concept

**"Your local practice, your people."** Patients trust people more than they trust institutions. A face beside "Practice nurse" tells a patient more than a list of clinics. Seeing the same doctor matters to people with long-term conditions. The template uses faces to answer real questions:
- Who will answer when I call?
- Do I need a GP, or can someone else help me sooner?
- Which doctor did I see last time, and can I ask for them?
- Who are all these people in the building?

Faces never replace answers. They sit beside answers, at the size of a name badge, never as a banner.

**How it differs from Front Desk**
- **Front Desk:** the NHS blue header band, an "answers on the card" task grid, a GP rota table and one decorative place photo.
- **Familiar Faces:**
  - a white NHS-style header;
  - a dark-blue "Are we open?" card that names the reception team, with their faces;
  - a **"Who does what"** section, with one card per role (care navigation);
  - **doctor badges**, styled like NHS staff ID badges;
  - a **reception wall**;
  - a team colour key taken from the NHS identity palette;
  - a real photo of the building.

**What it avoids (the rejected rounds):**
- No full-bleed hero photos.
- No serif display type, magazine layouts or "paper" grounds.
- No numbered wayfinding gimmicks.
- No carousels, sliders or animation.

The premium comes from real people photographed consistently, and from careful information design.

## 2. Research and the decisions it drives

**Sources:**
- **[SM]** NHS digital service manual: the images component (service-manual.nhs.uk/design-system/components/images), accessibility content guidance (alt text), and the content style guide.
- **[G1]** NHS England, *Creating a highly usable and accessible GP website for patients*.
- **[G2]** NHS England, *Step-by-step guide to improving general practice website online journeys*.
- **[B]** NHS England GP website benchmarking and improvement tool (May 2023, 50 criteria), cited by item number.
- **[ID]** NHS England identity guidelines: imagery (england.nhs.uk/nhsidentity/identity-guidelines/imagery).

### What the research says about photos of people
- **Use images only for a real need.** "Use images only if there is a real user need. Avoid unnecessary decoration" [SM, G2 task 2.1]. "Having unnecessary or decorative images can frustrate users, especially on information pages or transactional journeys" [SM].
- **Don't let images push tasks down.** "Avoid using images and banners", because they can push "important links and information off the screen as well as creating accessibility problems" [G1 1.7].
- **Use real people.** "Where possible, photography should feature real NHS patients and staff. Ensure the appropriate consent is obtained and records are kept" [ID]. Images should "reflect the diversity of NHS patients, the public and staff" [ID]. "Avoid poor quality photographs and clip art" [ID].
- **Keep images in the flow.** "Images should flow with the text content, not appear too prominent or isolated" [SM]. Research found side-by-side gallery layouts confused users [SM].
- **Write useful alt text.** Alt text describes "the information or function" the image represents, in under 125 characters, without saying "image of" [SM]. "Do not use images that have words in them" [SM].

**How Familiar Faces meets that bar.** Every portrait answers a real patient question: who answers my call, who will I see, and can I see them again. They are therefore informative, not decorative. They are never banners:
- faces are 40 to 72px in facepiles, name tags and the reception wall;
- doctor badges are at most about 200px wide, inside a card with the name, role and qualifications;
- the building photo sits beside the access information it supports.

On a phone, no photo appears above the top tasks except four 40px reception faces inside the status card.

### Decisions

| Decision | Finding that drives it |
|---|---|
| Phones show, in this order: name, the live "Are we open?" card with the call button, then 8 tasks. The first task shows on the first screen of a 390 x 844 phone. Team content comes after the urgent-help band. | Key tasks high on the homepage; 80% of users look there first [G1 3.6]. Appointments and test results in the top third [B2, B18]. Tasks before banners [G1 1.7]. |
| Task order: book, prescription, test results, sick or fit note, register, change or cancel, home visit, find us. Phone and opening hours sit in the status card. | Patient top-task research [G2 2.3]. Join link on the homepage [B37]. Fit notes linked from the homepage [B43]. |
| Every task carries its answer in one line of 20 words or fewer, such as "Phone after 11am. We only give results to you." | No paragraphs on the homepage; short sentences of 20 words or fewer [B35]. |
| Main menu of 7 items: Home, Appointments, Prescriptions, Test results, Our team, Register, Contact us. On phones, Appointments and Prescriptions stay visible beside a button labelled "Menu". | 7 or fewer items, including Home, Appointments and Prescriptions [B29]. No icon-only menu on mobile [B30]. |
| A live status card ("Open now", "Early appointments only", "Closed now", "Closed for the public holiday") with the next opening time. | Patients need "a quick way to know if the practice, and therefore if the phone lines, are open or closed" [G1, section 4]. |
| The **reception facepile** in the status card says who answers the call. | Real staff, not stock [ID]. A face lowers the barrier to phoning, the main way to book here. |
| **Who does what**: 8 role cards (GPs, practice nurses, health care assistants, physios, pharmacy team, mental health, reception, practice manager). Each has faces, names, what they help with, and a verb-led link. | Website should give an overview of "range of staff within the practice" [B, Services available]. Reduces calls by sending people to the right person. Self-referral to physio is linked straight from the card. |
| **Doctor badges** give each doctor's name, role (partner, salaried or registrar), gender as stated by the practice, and qualifications. There is a "What do the letters mean?" expander. A doctor without published qualifications says "Not published. Phone to check." | List of clinical staff with qualifications, role and gender [B47]. Avoid jargon [G2]. |
| A **"Seeing the same doctor"** inset sits at the top of the doctors section, with how to find your named GP. | Explain that patients have an assigned GP and can express a preference, on the staff page [B48]. The practice hasn't published its process, so the page says to phone. |
| A **training practice** card: registrars, and filmed consultations. | Say whether the practice trains health professionals [B47 note]. |
| **Everyone at the practice**: management, the reception wall, admin, nurses and HCAs are shown. The wider building team (pharmacy, physio, mental health, district nurses, health visitors, midwives) sits in an NHS details expander, so its images aren't loaded until opened. | Full names of people providing services [B47]. Keeps the phone page and page weight down. |
| Urgent help uses 3 NHS care cards: 999 (red over black), NHS 24 on 111, and pharmacy (NHS Pharmacy First Scotland). A line follows for "urgent and we are open". | Out-of-hours routes [B24]. The guide says don't say "emergency appointment" in general practice [G1 3.9], so the page says "Urgent appointments for today". |
| Links start with verbs and make sense alone: "Refer yourself to physio", "Check building access". | [G2 2.1], [G1 3.3]. |
| Reading age 9 to 11: short sentences, "we" and "you", jargon explained ("ECG (heart trace)", "COPD (chronic bronchitis)"). | [G1 3.2], [G2 2.1]. |
| NHS look: NHS colours, NHS focus style, care cards, inset text, details, action links, summary lists and steps. | Built largely from NHS components [B28]. |
| No pop-ups, overlays, cookie walls, chat widgets or carousels. | 27% of participants could not get past an overlay [B1, G1 3.12]. |
| "Page last reviewed" and "Next review due" in the footer. | Add timestamps [G2 2.4]. |
| Atkinson Hyperlegible Next: designed by the Braille Institute so that letters which look alike (such as I, l and 1, or O and 0) are easy to tell apart. | Accessibility for low-vision readers [SM accessibility]. It also sets the template apart from Front Desk's Hind. |

## 3. Rules (non-negotiable)

### Facts
1. **Never invent facts, quotes, bios or online services.** Every name, role, qualification, time, service and policy must come from the practice's current site, its NHS inform listing or the job card. If something is unknown, unclear or stale, write **"Phone to check"**.
2. **People:**
   - Show a person's gender only where the practice states it. Never infer it from a name or photo.
   - Never write bios or "interests" unless the practice supplies them.
   - Never show anyone as staff who isn't listed by the practice.
3. **Dates:** if source information is old (for example, access details last updated in 2014), say so in the small print: "The practice last updated this access information in 2014. Phone to check before you visit."

### Photos
4. **Use only:**
   - the practice's own photos;
   - photos taken for the practice under `PHOTO-SHOTLIST.md`;
   - Creative Commons photos of the town or building from Wikimedia Commons, credited.

   **Never use** stock people, AI-generated people, or a photo of a different building.
5. **Consent:** before go-live, the practice must confirm in writing that every person shown agreed to their photo being used. Anyone can opt out at any time; they then show as initials.
6. **Alt text:** a portrait's alt text is the person's name exactly as printed ("Dr Louisa Johnston", "Hazel").
   - Never describe appearance, age, ethnicity or clothing.
   - Never write "photo of".
   - Initials fallbacks are `aria-hidden`, because the name is always printed beside them.
   - Building photos describe what helps a visitor recognise the place ("a white two-storey building with a glass canopy over the entrance").
7. **No text over photos, ever.** Captions sit on solid panels (`.place figcaption`, `.team-photo figcaption`).
8. **Credits:** credit Creative Commons photos in the caption and the footer, and list every photo's source URL in `img/CREDITS.txt`.

### Content style (NHS)
9. Write times as `8am`, `10:30am` and `midday`. Write ranges with "to", such as "Monday to Friday, 8am to 6pm". Write dates in full, such as "Friday 25 December 2026".
10. Practice numbers are `tel:+44...` links. **Short numbers (999, 111) are plain text, never `tel:` links.**
11. Homepage task lines must be 20 words or fewer. Section paragraphs must be 60 words or fewer. Links start with a verb.

### Accessibility (WCAG 2.2 AA)
12. **Contrast:** keep the checked token pairs (section 6). Re-check any colour you change: 4.5:1 for text, 3:1 for UI edges.
13. **Structure:**
    - One `h1`, the practice name.
    - Headings in order: `h2` per section, `h3` per card, and `h4` only inside the wider-team expander.
    - Landmarks: `header`, `nav[aria-label]`, `main#main` and `footer`.
    - The skip link comes first.
14. **Focus:** use the NHS yellow focus style from `styles.css`. Never remove it.
15. **Tap targets:**
    - Every standalone link is at least 44px tall on phones. The rule in section 3 of `styles.css` covers links in `li` and `dd`, a `p.link-line` (a paragraph that is only a link), the footer and the status card.
    - Task-card links get invisible padding.
    - A new container needs adding to that rule.
16. **Phone menu:** keep `aria-expanded` and `aria-controls="nav-list"` on `.nav__toggle`. Escape closes it and returns focus to the button. Mark only Appointments and Prescriptions with `nav__item--keep`.
17. **Motion:**
    - Smooth scroll only runs under `prefers-reduced-motion: no-preference`.
    - Under `reduce`, all transitions are off.
    - There are no animations.
18. **200% text:**
    - Every grid uses `minmax(0, 1fr)`, so long words and facepiles wrap rather than push the page sideways.
    - Task icons drop out when a card is narrower than 20rem (container query).
    - Tested at 390px and 1280px with no sideways scroll.

### Known quirks of the in-house audit
19. Write 111 and 999 as text, never as `tel:` links.
20. Inline every SVG mark (the brand mark, icons and arrows). Never use `<img src="....svg">`.
21. Small links need a 44px tap height on phones. See rule 15.
22. No embedded maps: link to directions. If a practice insists on an embed, give the iframe `tabindex="-1"` and put a text "Get directions" link beside it.
23. Curl every external link before handover.

### Performance
24. **Budget:** under 1.2 MB on desktop and 700 KB on a phone. The example weighs about **235 KB on desktop and 235 KB on a phone** (first load, after scrolling the whole page).
25. **Portrait files:**
    - 96px and 240px WebP for everyone; doctors also get 400px.
    - Quality about 60.
    - Square crops, with the face in the upper third.
    - Use `srcset` with `sizes` that match the display size.
    - Every portrait below the first screen gets `loading="lazy"`, `width` and `height`.
    - Images in a closed `<details>` don't load until it is opened.
26. **Building photo:** 720px and 1200px WebP through `srcset`.
27. **Fonts:** only the two preloaded woff2 files. No extra weights or italics.

## 4. Homepage structure (keep this order)

1. **Skip link**: `a.skip-link`, pointing to `#main`.
2. **Header**: `header.masthead`.
   - `a.brand` holds the inline SVG mark, the name and a description line.
   - `a.masthead__call` holds the phone number (desktop only).
   - `nav.nav` holds `ul#nav-list` (7 items) and `button.nav__toggle`.
3. **Welcome**: `div.welcome > .welcome__grid` with grid areas `intro`, `now`, `tasks` and `people`.
   - `.welcome__intro`: `h1` and `p.lede` (one sentence that counts the team).
   - `section#now.now[data-state]`: the "Are we open?" card.
     - `.now__head` holds the `h2` and `.pill[data-now=word]`.
     - Then `[data-now=date]`, `[data-now=detail]`, the green call `.button` and a link to `#opening-times`.
     - `.now__team` holds a facepile of reception faces and one sentence naming them.
   - `aside.hero-team`: desktop only (hidden on phones). It holds 6 doctor faces and a link to `#team`.
   - `section.tasks`: `h2` "How can we help?" and `ul.task-list` with 8 `.task` items. Each has an icon, `h3.task__title > a.task__link`, `p.task__answer` and a chevron. The whole card is the target.
4. **Urgent help**: `section#urgent.urgent`, a `.care-grid` of `.care--emergency`, `.care--urgent` and `.care--pharmacy`, then `p.urgent__open`.
5. **Who does what**: `section#team`, a `ul.grid-4` of `.role[data-team]` cards. Each card has a facepile, `h3`, `.role__names`, `.role__for` and `.more-link`.
6. **Our doctors**: `section#doctors`.
   - `.inset.inset--people#named-gp` ("Seeing the same doctor").
   - `ul.badges` of `.badge[data-team=gp]`, partners first.
   - `details#qualifications` (only the abbreviations that appear on the page).
   - `.card#training`.
7. **Appointments**: `section#appointments` with `.split`.
   - Blocks: `#routine`, `#urgent-appointments`, `#early`, `#cancel` and `#home-visits`.
   - `#clinics` has a clinic-days table in a details expander.
   - The aside holds the "Book an appointment" card.
8. **Repeat prescriptions**: `section#prescriptions`.
   - Three cards: online (`#prescriptions-online`), hand in or post, and collect.
   - Then `#urgent-prescriptions` and `#medication-review`.
9. **Test results and fit notes**: two flagged cards, `#test-results` and `#fit-notes`.
10. **Register**: `section#register`.
    - `ol.steps`.
    - Two action links (adult, child).
    - A temporary-patient line.
    - A `.card--people` with reception faces.
11. **Everyone at the practice**: `section#everyone`.
    - Each `.team-group[data-team]` holds `ul.tags` of `.tag` (face, name, role).
    - `#reception` holds `ul.wall` (faces and first names).
    - `details#wider-team` holds the attached teams.
12. **Our building**: `section#our-building` with `.split`.
    - Access list (`#access`), directions action link and Traveline link.
    - `figure.place` with a solid caption and credit.
13. **Contact us**: `section#contact`.
    - `dl.summary-list`.
    - `#opening-times` table.
    - `#holidays` `ul.dates` of `li[data-date]`.
    - Training-closure line.
    - "Find us" aside.
14. **More information**: `section#more` with `#complaints`, `#vaccinations` and `#waiting`.
15. **Footer**:
    - Three columns: practice, Get help and About us. About us includes the accessibility statement and the health board.
    - Review dates and photo credits.
16. **Schedule**: `script#practice-schedule` (section 7), at the end of `body`.

Sections alternate white and `.section--tint`. Register uses `.section--blue` to stand out.

**Multi-page build.** The homepage keeps items 1 to 5, a 4-doctor preview of item 6 and a short contact strip. Items 6 to 14 become their own pages with the same markup ([G1] recommends separate Appointments, Prescriptions and Contact pages). The "Our team" menu item then points to a team page holding items 5, 6 and 11.

## 5. Components

| Class | Use |
|---|---|
| `.masthead`, `.brand`, `.masthead__call`, `.nav`, `.nav__toggle` | Header and menu. |
| `.now[data-state=open/limited/closed]`, `.pill` | The live status card. |
| `.task-list`, `.task`, `.task__link`, `.task__answer` | Top tasks with answers. |
| `.care--emergency/--urgent/--pharmacy`, `.care__number` | NHS care cards. |
| `.face`, `.face--initials`, `.face__initials` | One person: a portrait or initials. |
| `.facepile` (`--large`) | Overlapping faces for a team (2 to 6 people). Wraps at 200% text. |
| `.role` | Who does what card. |
| `.badge`, `.badge__photo`, `.badge__photo--initials` | Clinician ID badge. Horizontal on phones, vertical on desktop. Initials become a compact disc on desktop. |
| `.tags`, `.tag` | Compact name tags (face 56px, name, role). |
| `.wall` | Faces with first names (reception). |
| `.team-group[data-team]` | Group heading with a colour key square. |
| `.team-photo` | One group photo with a solid caption naming people left to right. |
| `.place` | Building photo with a solid caption and credit. |
| `[data-team=gp/nurse/care/admin/pharmacy/therapy/mental/community]` | Sets `--team` and `--team-tint` for bars, rings and initials grounds. |
| `p.link-line` | A paragraph that holds only a link. Gets a 44px tap height on phones. |
| `.inset`, `.inset--people`, `.card`, `.card--flag`, `.card--people`, `.steps`, `.details`, `.summary-list`, `.table`, `.dates`, `.callout`, `.button`, `.action-link`, `.more-link` | NHS content patterns. |

**Team colours.**
- They come from the NHS identity palette: GP blue, nurse aqua green, HCA light blue, admin warm yellow, pharmacy purple, therapy green, mental health dark pink and community grey.
- They are decorative only. The role is always written in words, so colour never carries meaning on its own.
- Keep the same mapping across practices, so patients and workers learn it.

## 6. Tokens and re-theming

All tokens are in section 1 of `styles.css`.

| Token | Default | Checked pair |
|---|---|---|
| `--colour-text` | `#212b32` | 14.4:1 on white, 13.0:1 on tint, 12.6:1 on blue tint |
| `--colour-text-secondary` | `#4c6272` | 6.4:1 white, 5.8:1 tint, 5.6:1 blue tint |
| `--colour-brand` / `--colour-link` | `#005eb8` NHS Blue | 6.4:1 white, 5.8:1 tint, 5.6:1 blue tint; white text on it 6.4:1 |
| `--colour-brand-dark` | `#003087` | White text 11.8:1 (status card, footer) |
| `--colour-brand-tint`, `--colour-tint`, `--colour-page` | `#e8f1f8`, `#f0f4f5`, `#fff` | Grounds |
| `--colour-border-strong` | `#768692` | 3.8:1 on white (card edges) |
| `--colour-link-hover`, `-visited`, `-active` | NHS link set | 9.2:1, 15.2:1 |
| `--colour-focus`, `--colour-focus-text` | `#ffeb3b`, `#212b32` | 11.8:1. **Never change.** |
| `--colour-button` (+ hover, shadow) | `#007f3b` NHS Green | White 5.1:1 |
| `--colour-urgent`, `--colour-emergency` | `#d5281b`, `#212b32` | White 5.1:1, 14.4:1 |
| `--colour-open/limited/closed-bg/-text` | Pale ground, dark text | 9.9:1, 11.8:1, 12.2:1 |
| `--team-*`, `--team-*-tint` | NHS identity palette | Initials on tints 10.8:1 or more |
| `--font-body`, `--weight-regular/bold` | Atkinson Hyperlegible Next 400 and 700 | – |
| `--fs-*`, `--lh-*` | 18px body on phones, 19px from 40em; h1 28, 32 or 44px | – |
| `--space-1` to `--space-8` | 4px to 64px | – |
| `--radius`, `--radius-card`, `--radius-photo` | 4, 8 and 12px | – |
| `--page-max`, `--measure`, `--gutter`, `--tap` | 72rem, 40rem, 1 or 2rem, 44px | – |
| `--face-s/m/l`, `--team-bar` | 2.5, 3.5 and 4.5rem; 6px | – |

### Re-theming for a new practice
1. Copy `example/` to a new folder beside `styles.css`, so `../styles.css`, `../familiar.js` and `../fonts/` still resolve.
2. **Colours:**
   - Leave the NHS colours alone. The benchmark rewards the NHS look [B28].
   - If the practice has a strong colour, use it only for `--colour-brand-tint` (the register band) and `--team-admin` (the hero panel stripe), then re-check contrast.
   - Never re-colour focus, urgent, button or status tokens.
3. **Content:** replace every Linlithgow fact. `grep -n "Linlithgow\|01506\|EH49\|lgmp\|Lothian"` must return nothing from Linlithgow afterwards.
4. **People:**
   - Rebuild the role cards, badges, tags and wall from the practice's own team list.
   - Pick role-card faces from people in that role.
   - Count people exactly ("Hazel and 12 medical receptionists").
5. **Schedule:** rewrite `#practice-schedule` and the hours table together.
6. **Footer:** update the review dates (today, and today plus 6 months) and the credits.
7. **England instead of Scotland:**
   - "NHS 111" instead of NHS 24.
   - nhs.uk links instead of NHS inform.
   - Pharmacy First (England) wording.
   - Ask the practice for the NHS primary care logo.

## 7. The schedule (`#practice-schedule`)

```json
{
  "timezone": "Europe/London",
  "weekdays": [1, 2, 3, 4, 5],
  "periods": [
    { "from": "07:00", "to": "08:00", "state": "limited", "label": "Early appointments only", "detail": "..." },
    { "from": "08:00", "to": "18:00", "state": "open", "label": "Open now", "detail": "Phone lines are open until 6pm." }
  ],
  "holidays": ["2026-12-25", "2026-12-28"],
  "specialDays": { "2026-11-12": { "periods": [ ... ], "closedLabel": "Closed for staff training" } },
  "closed": { "label": "Closed now", "holidayLabel": "Closed for the public holiday", "detail": "If you need help now, call NHS 24 on 111. In an emergency, call 999." }
}
```

- **States:** `open` (green pill), `limited` (yellow) and `closed` (grey).
- When closed, the card says when phone lines next open: "today at 8am", "tomorrow", "on Monday", or the full date if a holiday falls in between. The closed detail follows.
- **Training afternoons:** add a `specialDays` entry with the morning period only and a `closedLabel`.
- **Past dates:** `li[data-date]` hide themselves. When none are left, the list says "No upcoming dates are published. Phone to check."
- **Tested** with Playwright's clock at these times:
  - Tuesday 6am, 7:30am, 8am, 1:15pm, 5:59pm and 6pm;
  - Friday 7pm;
  - Saturday;
  - the clock-change night;
  - Christmas Eve evening, Christmas Day, Boxing Day Saturday and Monday 28 December;
  - 7:15am on 29 December;
  - January 2027.

  All were correct.

## 8. Fallbacks: full photos, one group photo, or none

The template must look intentional in all three states. Each was built and screenshotted during development.

1. **Full photo set (the example).**
   - Portraits appear in the status card, the hero panel, role cards, badges, tags and the wall.
   - Anyone without a photo gets initials automatically. In the example that is 16 of 69 people, including the mental health nurse and a health care assistant.
   - In a facepile, initials sit beside photos as equals, with a team-coloured ring.
2. **One group photo, no portraits.**
   - Put the group photo in a `figure.team-photo` at the top of "Who does what".
   - It is 16:9 on phones and 21:9 on desktop, with a solid caption naming people left to right.
   - Everything else uses initials.
   - Never crop individuals out of a group photo to make fake portraits.
3. **No photos at all.**
   - Every `.face` becomes `.face--initials` and every `.badge__photo` becomes `.badge__photo--initials`.
   - On desktop, badges become compact cards with a 72px initials disc, not big empty tiles.
   - Remove `figure.place`; the building section becomes a single text column with access and directions.
   - Consider retitling the hero panel to "Who works here", and sell the photo shoot (`PHOTO-SHOTLIST.md`).

Initials use the first letter of the first and last names ("Dr Andrew O'Neill" becomes AO; "Hazel" becomes H). They are `aria-hidden`, because the name is printed beside them.

## 9. Adapting Familiar Faces for a dental practice

People-led design suits dentistry even better. Nervous patients want to see who will treat them.

- **Identity:**
  - NHS dental practices may use the NHS look.
  - Private-only practices must not: set `--colour-brand`, `--colour-brand-dark` and `--colour-link` to the practice colour (4.5:1 on white).
  - Keep focus, urgent and button tokens.
- **Menu (7 maximum):** Home, New patients, Appointments, Treatments, Costs, Our team, Contact us.
- **Status card:** "Are we open?" plus a dental emergencies line, only if the practice publishes a time to phone. Keep the facepile of reception or treatment coordinators.
- **Top tasks:**
  1. Join as a new patient (say exactly whether the NHS list is open, or "Phone to check");
  2. Book a check-up;
  3. I'm in pain: get urgent help;
  4. Check NHS costs;
  5. Change or cancel;
  6. Find us.
- **Who does what:** dentists, hygienists and therapists, dental nurses, reception, practice manager. Each role card says what they do in plain English.
- **Badges:** dentists with GDC number (if supplied), qualifications and year. Show gender only if stated. Hygienists and therapists also get badges.
- **A "Your first visit" steps list:** only steps the practice confirms. Otherwise write "Tell us when you book if you feel nervous."
- **Urgent help:**
  - 999 for swelling that affects breathing or vision, or bleeding that won't stop.
  - NHS 24 on 111 (Scotland) or NHS 111 (England) when closed.
  - No pharmacy card unless the source mentions it.
- **Costs:**
  - Scotland: check-ups are free, and patients pay 80% of treatment up to the NHS inform cap. Quote the current figure and recheck it every build.
  - England: the nhs.uk bands.
  - Never invent private prices.
- **Remove:** named GP, test results, fit notes, prescriptions, home visits and the GP training card.

## 10. Pre-handover checklist

**Facts**
- [ ] Every fact traces to the practice site, its NHS listing or the job card. No invented bios, quotes, services, online booking, NHS App or text results.
- [ ] Unknowns say "Phone to check". Stale source information says when it was last updated.
- [ ] Every clinician is shown with role and qualifications. Gender is shown only where stated. Partners are listed first. Counts ("12 medical receptionists") are correct.
- [ ] Opening times, holidays and closures match the source. The schedule JSON and hours table agree, and the status has been tested at the section 7 times.

**People and photos**
- [ ] Written consent from the practice for every person shown. Opt-outs are shown as initials.
- [ ] No stock or AI-generated people. Nobody is presented as staff who isn't on the practice's list.
- [ ] Alt text is the person's name only. Building alt text helps people recognise the place.
- [ ] No text over photos. Creative Commons credits appear in the caption, the footer and `img/CREDITS.txt`, with source URLs.
- [ ] Portraits are consistent (same background, framing and light), or the practice has been offered the photo add-on.

**Content**
- [ ] The menu has 7 items or fewer, including Home, Appointments and Prescriptions.
- [ ] On a 390 x 844 phone, the status card and the first task show on the first screen. All 8 tasks come before any team section.
- [ ] Task lines are 20 words or fewer. Paragraphs are 60 words or fewer. Links start with verbs.
- [ ] NHS style: "8am to 6pm", days and months in full.
- [ ] 999 and 111 are plain text.
- [ ] The footer review dates are set.

**Technical**
- [ ] `node pipeline/audit.mjs http://127.0.0.1:4485/example/ <out>` reports **0 blockers, 0 major, 0 minor**.
- [ ] Desktop and phone full-page screenshots reviewed top to bottom. Take phone full-page shots at deviceScaleFactor 1; at 2x, Chrome repeats content past 16,384px.
- [ ] The phone menu opens and closes, and Escape returns focus to the button.
- [ ] Keyboard only: every control is reachable, with yellow focus.
- [ ] 200% text (`html{font-size:200%}`) at 390px and 1280px: no sideways scroll.
- [ ] Reduced motion turns off smooth scroll.
- [ ] Weight is under 1.2 MB on desktop and 700 KB on a phone. No request goes to another server.
- [ ] Every external link returns 200.

## 11. Linlithgow example: notes on the source facts

Confirm these with the practice before go-live:
- **Early appointments, 7am to 8am:** the source says they exist and must be pre-booked, but not on which days. The schedule assumes every weekday and shows "Early appointments only".
- **Holidays:** only 25 and 28 December 2026 remain for 2026. 2027 dates and staff-training afternoons ("from 1pm") are not published, so the page says to phone.
- **Named GP:** the practice doesn't publish how a named GP is assigned, so the page says to phone.
- **Qualifications:** none are published for Dr Tanat Chanrachakul or Dr Bronwen Jacob-Ramsdale.
- **Gender:** stated for all doctors and nurses, but not for most other staff, so it isn't shown for them.
- **Access:** the details (ramp, wide doors, accessible toilet, hearing loop, one disabled space in the rear staff car park) were last updated in 2014.
- **Pharmacies:** the list (Dears, Boots, Linlithgow Pharmacy) comes from the options on the practice's online-access form.
- **Pharmacy team and mental health team:** what they do at this practice isn't published, so the cards give a general description and say "Phone to check".
- **Building photo:** taken in 2011. It shows the health centre named on its sign. Ask for a current photo.
- **Accessibility statement:** the footer links to the practice's existing accessibility page, which isn't a full statement [B26]. A full statement is part of the build.
- **Email:** the only published email address is for returning health-check forms, so the contact list says "Phone to check if you can contact us by email."
