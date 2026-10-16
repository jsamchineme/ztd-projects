# Nursery websites in Scotland: research brief

For template designers and AI build workers. Written 13 October 2026. It covers independent nurseries: private, and voluntary or not-for-profit. Council nurseries are out of scope because they can't buy.

The house rules in `CLAUDE.md` still apply: never invent facts, put tasks first on a 390px phone, no pop-ups or carousels, WCAG 2.2 AA, self-hosted fonts, and real photos only. This brief adds what changes when the visitor is a parent choosing childcare rather than a patient.

Source tags such as **[SG25]** point to the list in section 9. Each fact was checked on the page cited on 13 October 2026. **Unverified** marks anything that couldn't be confirmed. Don't treat those items as fact.

---

## 1. The headline

Parents choose a nursery mainly on **location, trust in the staff, links to their child's future school, and reputation** [SG25-7]. Parent Club, the Scottish Government's site for parents, tells them to judge quality from the **inspection report** [PC-Q]. It also tells them to ask about the day, settling in, key workers, food, time outdoors, ratios, qualifications, daily communication, hours and **whether the nursery offers funded places** [PC-C].

So a nursery site has four jobs, in this order:
1. Say plainly **who it's for**: ages, hours, weeks a year, area and funded status.
2. **Prove quality honestly**: inspection grades with the date and a link to the report, and real staff with their qualifications.
3. **Show the place and the day**: rooms, garden, routine, food and settling in, using real photos.
4. Make the next step easy: **"Book a visit"**, **"Join the waiting list"** or **"Phone us"**.

Most nurseries we prospect for score "Good". Of the 754 graded services on our prospect list (Care Inspectorate datastore, 31 August 2026, `prospects/nursery/`), the lowest grade is:

| Lowest grade | Services |
|---|---|
| 4 (good) | 549 (73%) |
| 5 (very good) | 129 |
| 3 (adequate) | 59 |
| 2 (weak) | 10 |
| 6 (excellent) | 7 |

Design for an honest "Good" first, not for a trophy shelf.

---

## 2. Who uses a nursery website, and their top tasks

We found **no published top-tasks study of nursery websites**, either in the UK or in Scotland. The ranking below is our synthesis of three sources:
- the Scottish Government 2025 parent survey (7,589 responses, published 17 March 2026) [SG25];
- the Parent Club checklist [PC-C];
- the GP benchmark's general findings.

Test it with real parents when we can.

### Prospective parents (the main audience)
They often look a long way ahead. Parent Club warns that "you might have to apply quite early", and that some councils take funded-place applications well before the start date [PC-F]. The common belief that parents look before the baby is born is anecdotal; we found no statistic for it.

What drives their choice [SG25-7]:
- location: 52%;
- liking and trusting the staff: 43%;
- continuity with their child's future school: 43%;
- reputation: 41%;
- flexibility: 20 to 23% for working households.

Of parents surveyed, 39% had problems getting childcare [SG25-9]. The most common were:
- no local places: 19% (25% in remote areas);
- inflexible hours: 14%;
- no holiday cover: 11%.

**Their top tasks on a 390px phone, in this order:**
1. **"Is this for us?"** Ages taken (babies or not), opening hours, weeks a year, area. All of it must be visible without scrolling.
2. **"Can we get a place?"** Whether there's availability or a waiting list. This is usually "phone to check".
3. **"What will it cost?"** Fees, and whether the nursery is a funded provider for the council and for which ages. This includes how funded hours, Tax-Free Childcare and Universal Credit fit.
4. **"Is it good?"** Grades with the date, and a link to the latest report.
5. **"Who will look after my child?"** The manager and key staff with their qualifications, and the key-worker system.
6. **"What is a day like?"** Rooms, garden and outdoor time, routine, food and allergies, sleep, nappies and toilet training.
7. **"How do we start?"** Book a visit, join the waiting list, settling in, and what to bring.
8. **"Can my child be supported?"** Additional support needs. 89% of parents of children with ASN were satisfied that funded ELC met their child's needs [SG25-3]. Say what the nursery does, never what it "guarantees".

### Current parents
Their tasks:
- today's closure or snow notice;
- holiday and closure dates;
- this week's menu;
- forms (absence, medicine, holiday booking, changing sessions);
- fees and invoices, and how to pay;
- contact numbers;
- the parent app login, if the nursery uses one;
- policies (sickness exclusion, collection).

In the 2025 survey, 79% agreed their setting communicated openly and regularly. Parents valued "detailed information, photos and videos" of their child's day. Dissatisfaction came from "generic rather than child-specific communication" [SG25-12].

The child-specific part belongs in the nursery's private app or email, **never on the public site**.

### Grandparents and other carers
They need to know:
- where it is, how to get in and where to park (only if the source says);
- who can collect a child and how (password or named adults, only if the policy says);
- the phone number.

Large text and plain English matter most for this group.

### Job applicants
They need to know:
- current vacancies and how to apply;
- the qualifications needed;
- SSSC registration;
- pay.

Funded providers must pay at least the real Living Wage to staff who deliver funded hours [FFC-2]. Only say what the nursery pays if it confirms the figure.

---

## 3. Scottish facts a nursery site must get right

### 3.1 Funded early learning and childcare (ELC)

**Who gets it**
- 3 to 5 year olds get up to **1,140 hours a year**: about 30 hours a week in term time, or about 22 hours a week all year. It is "free to you" [MG-F].
- **Some 2 year olds** are eligible [MG-2]. Parent Club says this is "about a quarter" [PC-F]. A child qualifies if the family gets one of these benefits:
  - Universal Credit, with monthly household take-home pay of **£885 or less** if they work;
  - Income Support;
  - income-based Jobseeker's Allowance;
  - income-related Employment and Support Allowance;
  - Incapacity Benefit;
  - Severe Disablement Allowance;
  - State Pension Credit;
  - asylum support.
- A 2 year old also qualifies if the child or a parent has **experience of care**: looked after, or in kinship or guardian care [MG-2]. That page was last updated on 1 April 2026.
- **Deferral:** a child who is 4 on the school start date can defer school and keep funded ELC [MG-F].

**When they can start.** It's usually the term after the child's 3rd birthday [MG-F]:

| Birthday | Usual start |
|---|---|
| 1 March to 31 August | August |
| 1 September to 31 December | January |
| 1 January to end of February | March or April |

Councils set the exact dates, so link to the council rather than printing them.

**How parents apply.** Through their **local council**, using its own process and deadlines [MG-F, PC-F]. A private or voluntary nursery delivers funded hours only if it has a contract with the council. Our wording for this is a **"funded provider"**; councils also say "partner provider".

**What a funded provider must meet (the National Standard)** [FFC-2]:
- Care Inspectorate evaluations of "good" or better for the relevant areas;
- benchmark qualifications: SCQF level 7 for practitioners and level 9 for managers;
- daily outdoor play, including regular play in a natural setting;
- **a free meal for every child at a funded session**, following *Setting the Table*;
- the real Living Wage;
- parental engagement;
- **no top-up fees for funded hours**. Any extras must be optional and limited to things like snacks, outings and extra activities.

**Splitting hours.** Parents can split funded hours between settings, for example a nursery and a childminder [PC-F, SG25-7].

**Grades and funding.** If a funded provider falls below "good", the Care Inspectorate aims to revisit within the next inspection year, in line with the National Standard [CI-QIF]. Funded status can therefore change. **Always check it with the nursery and the council's provider list at build time.**

### 3.2 The Care Inspectorate and inspection

**Registration.** Every nursery must be registered with the Care Inspectorate to operate legally [CI-P]. Each service has a CS number; ours are in `prospects/nursery/data/*.json` as `csNumber`.

**The new framework.** Since **22 September 2025**, the Care Inspectorate and HM Inspectors use one shared **"Quality improvement framework for the early learning and childcare sectors"** [CI-QIF]. It replaced both:
- *A quality framework for daycare of children, childminding and school-aged childcare*, which brought the four key questions (care, play and learning; setting; leadership; staff team) from 2022;
- *How good is our early learning and childcare?*

Reports from before that date use the old key questions; later ones use the new framework. **Show grades with the exact headings and date of the nursery's latest report.** Don't relabel them.

**Who inspects.** The Care Inspectorate inspects every ELC setting. HM Inspectors also inspect settings that provide funded ELC, except childminders [CI-QIF]. Parent Club tells parents to look at reports from both [PC-Q].

**The six-point scale** [CI-G]:

| Grade | Meaning |
|---|---|
| 6 | Excellent |
| 5 | Very good |
| 4 | Good |
| 3 | Adequate |
| 2 | Weak |
| 1 | Unsatisfactory |

**Linking to the report.** The Care Inspectorate moved to **careinspectorate.scot** in 2026, and its new site is in beta. Old careinspectorate.com links redirect.
- Members of the public find a service on the register, open its record, and the latest report is linked at the top [CI-R].
- Service profiles also publish upheld complaints and enforcement action [CI-P].
- Link to the nursery's own service record and check the URL resolves at build time. If you can't find a stable record URL, link to the register search with the service name ([CI-S]). This is what `ciUrl` in our data does.

**Public data.** The Care Inspectorate publishes a monthly CSV datastore of every service. It includes grades, the last inspection date, places and upheld complaints. Build workers should read the facts from it rather than from the nursery's own site, which is often out of date.

### 3.3 Staff: the SSSC and ratios

**Qualifications.** The benchmarks of SCQF 7 for practitioners and SCQF 9 for managers are verified for funded providers [FFC-2].

**SSSC registration (unverified).** We understand that daycare workers must register with the Scottish Social Services Council as:
- support workers;
- practitioners;
- managers or lead practitioners.

There is a time limit after starting, and qualification conditions. **This is unverified:** sssc.uk.com refused automated access on 13 October 2026. Check on sssc.uk.com before writing any SSSC wording.
- Show "SSSC registered" for a named person only if the nursery confirms it. The public can check the SSSC register.

**Ratios.** The National Standard states:
- 1 adult to 5 children for 2 year olds;
- 1 to 8 for children aged 3 and over attending 4 hours or more a day;
- 1 to 10 for under 4 hours [FFC-2].

The ratio for under-2s (commonly given as 1 to 3) **was not verified** from an official page here.

**Never print a ratio on a site unless the nursery states its own ratios.** Parents do ask about them [PC-C], so offer "Ask us about our staff ratios when you visit".

### 3.4 Help with costs (link, don't calculate)

**Tax-Free Childcare** [GOV-TFC]:
- the government adds £2 for every £8 paid in;
- up to £2,000 per child a year, or £4,000 if the child is disabled;
- for children up to 11, or 16 if disabled;
- **the provider must be signed up**, so say "we accept Tax-Free Childcare" only if confirmed.

**Universal Credit childcare** [GOV-UC]:
- up to **85%** of costs back;
- capped at £1,071.09 a month for one child and £1,836.16 for two or more;
- the childcare must be registered (with the Care Inspectorate in Scotland);
- help with the first month's costs is available when starting work.
- The caps change each April, so link to GOV.UK rather than hard-coding them.

**Scottish Child Payment** [MG-SCP]: £28.20 a week per child under 16, from Social Security Scotland. It isn't childcare money and the figure changes, so link to mygov.scot. Don't quote the amount.

**Average spend.** Parents who pay for childcare spend an average of £726 a month [SG25-3]. Don't use this on nursery sites. It's context for the pitch only.

**Coram survey (unverified).** Coram's *Childcare Survey 2026* reports that prices for under-3s "continue to rise in Scotland" [CORAM]. We could not verify its Scottish £-per-week figures from the published page, so don't quote them.

### 3.5 Practice guidance worth naming

- **Realising the Ambition: Being Me** is Scotland's national practice guidance for the early years, from pre-birth to early primary [RTA]. It was published in 2020 and updated in January 2026. Nurseries often say they follow it.
- Mention it only if the nursery does, in one plain sentence, for example "We follow Scotland's national guidance, Realising the Ambition". Never use jargon like "child-centred pedagogy".
- *Setting the Table* is the nutrition guidance funded providers must follow [FFC-2].

### 3.6 What a nursery may claim, and how to word it

| Topic | Write this only if confirmed | Otherwise write |
|---|---|---|
| Funded hours | "We're a funded provider for [council] for 3 and 4 year olds [and eligible 2 year olds]." | "Phone us to check if we offer funded hours." |
| Fees | The nursery's own fee table, with "Fees from [date]". | "Phone us for our current fees." |
| Places | "We have places for [age] from [month]." | "Phone us to check for places." |
| Grades | The latest report's grades, with the date and a link. | Nothing. Never estimate a grade. |
| Ratios | The nursery's stated ratios. | "Ask us about staff ratios when you visit." |
| Staff | Each person's name, role, qualification and SSSC registration, as supplied. | A role without a name, or leave it out. |
| Meals | "Meals are cooked on site", the menu, how allergies are handled. | "Ask us about meals and allergies." |
| Hours | Exact hours, weeks a year and closures. | Phone to check. |
| Tax-Free Childcare and UC | "We accept Tax-Free Childcare." | Link to GOV.UK and say "Ask us about paying". |
| Apps | "We use [Famly / Tapestry / Blossom] to share your child's day." | Nothing. |
| Outdoor | "We go outside every day" (a National Standard duty for funded providers [FFC-2]), plus any specifics they confirm. | Describe only the space you can see in their photos. |

**Never invent:**
- fees, availability, funded status, grades or report dates;
- ratios, staff names, qualifications or SSSC status;
- menus, allergen handling, opening hours, closures or term dates;
- policies, awards, reviews or testimonials;
- "forest school" or "Gaelic medium" status;
- languages spoken, ASN specialisms, apps, CCTV, parking or accessibility features.

---

## 4. Trust signals parents look for

All of these must come from the nursery or the Care Inspectorate record.

1. **Inspection grades, shown honestly.**
   - Show every grade from the latest report, the report date, and a "Read our latest inspection report" link.
   - Never show only the best grade.
   - Never use the Care Inspectorate logo; we found no published permission for providers to use it.
   - If grades are 3 or below, still link to the report. The page can say what the nursery is improving, using its own words.
   - Upheld complaints are public on the profile [CI-P], so hiding things doesn't work.
2. **Real staff.**
   - Manager and room leads with their role, qualification, years at the nursery and SSSC registration, as supplied.
   - Name the key-worker system. Parent Club tells parents to ask "Will my child have a key worker?" [PC-C].
   - "Liked and trusted the staff" was the second biggest reason for choosing a setting (43%) [SG25-7].
3. **Real photos of rooms and outdoor space.**
   - Users ignore generic stock people but study photos of real people and real things [NNG-P].
   - Parents value outdoor play: 88% said their setting gave daily outdoor access. Small outdoor spaces were a reason for dissatisfaction [SG25-12].
4. **Settling in.** The process step by step, how long it usually takes and what parents do, only as the nursery describes it [PC-C].
5. **A day at nursery.** A routine table per room (arrival, snack, outdoors, lunch, sleep, home time), with times only if supplied [PC-C].
6. **Food and allergies.**
   - Who cooks and a sample week's menu [PC-C].
   - How allergies and cultural or dietary needs are handled. Parents value "multiple meal options" and accommodation of dietary needs [SG25-12].
   - Funded sessions include a free meal [FFC-2].
7. **Communication.** Who parents speak to at pick-up, and the app (Famly, Tapestry, Blossom or another), only if used.
8. **Additional support.** How the nursery spots and supports additional needs, and who to speak to [PC-C].

---

## 5. Photos and children

### 5.1 The law
- Photos of identifiable people are personal data. Publishing them for "promotional material" is covered by data protection law, unlike a parent's personal snaps [ICO-S].
  - The organisation must tell parents how photos will be used and on what lawful basis.
  - Consent is only one possible basis.
  - The ICO recommends offering an **opt-out** [ICO-S].
  - Public posting needs care about whether people "would reasonably expect" that use [ICO-S].
- "Children merit specific protection" [ICO-C]. For nursery-age children, the parent decides.
- If consent is the basis, it must be freely given, specific, informed and unambiguous, and **can be withdrawn at any time**. After that, the images must stop being used [DfE].

### 5.2 Our rules
1. **Lead with rooms, garden, staff and children's work, not children's faces.**
   - A website is public, permanent and scraped.
   - Consent can be withdrawn at any time [DfE].
   - Each child's consent is a separate fact we can't check.
   - A template that needs faces breaks the day a parent says no.
2. **Allowed:**
   - empty or tidied rooms;
   - the garden and outdoor kit;
   - entrance and signage;
   - staff (with their own written consent);
   - children's artwork and models (no names);
   - close-ups of hands at work: painting, planting, building;
   - children from behind or at a distance where no one is identifiable;
   - food as served.
3. **Not allowed in our builds:**
   - identifiable children's faces;
   - children's names;
   - name labels or pegs with names visible;
   - photos of children in nappies, getting changed, bathing or sleeping;
   - school or nursery uniform logos together with faces;
   - location data in the files. Strip EXIF metadata from every image.
4. **Photos already on the nursery's current site.**
   - The crawler (`crawl.mjs`) downloads them. That doesn't mean we may reuse them.
   - Treat any image with an identifiable child as **excluded**. We don't know what the parents agreed to, and a sales mock-up is a new use.
   - Reuse rooms, garden, building, food, artwork and staff images where the staff member's identity is already public on that site, and record the source in `img/CREDITS.txt`.
   - After handover, the nursery may add child photos under its own consent process. The templates should still look complete without them.
5. **Never use** stock or AI-generated children or staff, clip-art children, or illustrations of "happy toddlers". Parents are judging the real place [NNG-P].
6. **Use the nursery's own photo when it has one; otherwise the template's drawing.** (Owner's decision, October 2026.)
   - Each thing a page lists (a playroom, the garden, wetsuits, a library bus) gets a photo only if the nursery has one that shows that exact thing.
   - If it doesn't, keep the template's drawing in the same frame, so the layout doesn't depend on photos. Sunny Side's "What's here" is the worked example.
   - AI pictures of objects with no people are not banned, but never pass them off as the nursery's own: label them "Illustration", or prefer the drawing.

---

## 6. Structure

### 6.1 Page set and menu (6 items, never more than 7)

| Menu item | Page | Holds |
|---|---|---|
| Home | `index.html` | See 6.2 |
| Visit and join | `join-us.html` | Book a visit, waiting list, how places are offered, settling in, what to bring, starting dates |
| Fees and funding | `fees-and-funding.html` | Fee table (if supplied), funded hours and how to apply to the council, eligible 2 year olds, Tax-Free Childcare, Universal Credit, extras (optional only for funded hours) |
| Our nursery | `our-nursery.html` | Rooms by age, a day at nursery, outdoor play, food and allergies, sleep, additional support |
| Our team | `our-team.html` | Manager, room leads and staff, with role, qualifications and SSSC (as supplied); key workers |
| Parents | `parents.html` | Closures and term dates, this week's menu, forms (HTML, not PDF), paying fees, sickness and collection policies, app login link |

- **Contact** is the last item if there's room. Otherwise contact details sit in the header phone button and the footer.
- **Footer:**
  - jobs;
  - policies;
  - privacy notice;
  - accessibility statement;
  - complaints (the nursery's process, then the Care Inspectorate route [CI-CO]);
  - Care Inspectorate record;
  - "Page last reviewed".
- **Jobs** is a footer link and a homepage strip when vacancies are open.
- On phones, keep the label **"Menu"** with no icon, and keep "Visit and join" and "Fees and funding" visible. This follows the GP brief.

### 6.2 Homepage hierarchy on a 390px phone

1. **Header:** name, **"Phone us"** button, "Menu" button.
2. **Hero:**
   - `h1` with the nursery name;
   - one sentence: "Nursery in [area] for children aged [x months] to 5. Open [7:45am to 6pm], Monday to Friday, [all year / term time]";
   - one real photo of a room or the garden, which may be desktop-only as in Front Desk.
3. **Key facts strip, above the fold:**
   - ages;
   - hours;
   - funded provider status;
   - "Places: phone to check" (or the confirmed status);
   - the latest grades with the date and a report link.
4. **Two actions:**
   - green **"Book a visit"**: a phone link, or a form only if the nursery has a compliant way to receive it;
   - **"Join the waiting list"**.
5. **Dated notice**, optional: closures, snow, holiday booking deadlines. Use the `data-show-from` and `data-show-until` pattern, and never for marketing.
6. **"For parents at [Nursery]"**: 4 task links (closures, menu, forms, pay fees).
7. **Our rooms** (cards by age), then **outdoor**, then **a day at nursery**, each a summary with a link.
8. **Our team**: the manager plus 2 or 3 faces with qualifications (staff consent only).
9. **Fees and funding** in plain words, with a link.
10. **Settling in**, in 3 to 5 steps.
11. **Find us**: address, a directions link (no map embed), parking or drop-off only if supplied.
12. **Jobs strip**, if there are vacancies.
13. **Footer.**

### 6.3 Calls to action
- Use one main action per screen: **"Book a visit"**. Secondary actions are "Join the waiting list" and "Phone us".
- Waiting-list forms collect **children's personal data**:
  - Ask only for parent name and contact, the child's first name and date of birth (or due date), the start date wanted, and the days or sessions wanted.
  - **Never** ask for health, allergy, ASN, religion or ethnicity on a website form. That's special category data; collect it at registration.
  - Give a privacy notice at the point of collection, saying who, why, how long it's kept and the parent's rights [ICO-I].
  - No third-party form service without a UK GDPR data processing agreement.
- Our templates are static. **Default to "Phone or email us to join the waiting list"** and add a form only when the nursery has a compliant receiving service.

### 6.4 What to avoid
- **Pop-ups, overlays and chat widgets.** The GP benchmark found 27% of participants who met an overlay first struggled to get past it (GP brief, [B1]).
- **Carousels and auto-play.** People scroll past them, dots go unnoticed on mobile, and one frame gives the wrong idea of the place [NNG-C]. Auto-forwarding frustrates readers [NNG-A]. Use a static photo grid instead.
- **PDF-only information** (menus, forms, policies, fee lists):
  - PDFs need zooming and scrolling on phones, are hard to adapt for accessibility, lose the site's navigation, and go stale [GDS-PDF].
  - Publish in HTML. A PDF may sit alongside as a download, never instead.
- **Facebook-only updates.**
  - Not every parent or grandparent uses Facebook, some posts need a login, and the site loses the dated, findable record.
  - Put closures on the site, and on Facebook too if the nursery wants. This is our judgement; we found no study on it.
- **Embedded Facebook feeds, Instagram widgets and Google Maps.** They're third-party trackers and need consent (see 6.6).
- **Jargon.** Avoid "pedagogy", "provocations", "in the moment planning" and "SCQF" without explanation. Write "how we plan play around your child's interests".

### 6.5 Plain English and accessibility
- Aim for a reading age of 9 to 11, with sentences of 20 words or fewer on the homepage. Follow GOV.UK and NHS content style: "8am to 6pm", days and months in full, and "to" rather than dashes ([GOVUK-S]; GP brief).
- **WCAG 2.2 AA** throughout. The same `audit.mjs` and `viewports.mjs` gates apply: 0 blockers, 0 major, 0 minor.
  - New in 2.2: targets at least 24×24px (2.5.8) [W3C-TS]. We keep 44px, as in the GP brief.
  - Focus must not be hidden by sticky headers.
  - Forms mustn't make people re-enter what they already gave.

### 6.6 Performance and GDPR
- Use self-hosted fonts and no CDNs (house rule).
- No analytics, pixels, embedded social feeds or maps that set non-essential cookies or send data to third parties without **prior consent** [ICO-PECR].
  - The simplest compliant site sets no non-essential cookies at all.
  - If one is ever needed, the consent notice sits in the page flow, not as a pop-up.
- Keep the homepage under about 1.5 MB, with photos resized and WebP plus JPEG.
- Publish a privacy notice that covers the website, enquiries and the waiting list [ICO-I], plus an accessibility statement.

---

## 7. Visual direction

### 7.1 Premium versus twee
UK nursery sites in our sample are dominated by:
- primary-colour rainbows;
- bubble or crayon fonts;
- clip-art suns, balloons and ABC blocks;
- stock smiling toddlers;
- auto-playing sliders.

These read as cheap and generic. They also say nothing about this nursery, which is what parents are judging [NNG-P].

What reads as trustworthy and premium to UK parents in 2026 is evidence presented calmly:
- **Calm, homely, natural.** Parents in the 2025 research praised a "very sort of homey environment" where children "feel comfortable and safe" [SG25-12]. Use warm neutrals, one confident accent colour, natural-light photos of real rooms, and wood and garden textures from the nursery's own photos.
  - We have not verified a specific quote from Realising the Ambition on environments, so don't cite it for this.
- **Grown-up typography** that a child's world can sit inside:
  - a humanist sans for body text;
  - optionally one warm serif or rounded display face for headings only, self-hosted, two weights at most;
  - no Comic Sans, crayon or bubble fonts.
- **Children's own marks as the decoration.** A scanned painting edge, a real drawing as a section divider, the nursery's own logo. Never bought clip art.
- **Information design as reassurance:**
  - the grades panel;
  - a routine timeline;
  - a fees and funding table;
  - "Rooms by age" cards;
  - opening hours with the current period marked, reusing Front Desk's live status ("Open now · closes 6pm").
- **Honesty as the premium.** Real staff, a real report link, dated fees and "phone to check".

### 7.2 Three template directions
These mirror our GP and dental families, so build workers can reuse the systems.

#### A. Front Desk Nursery (task-first; Front Desk family, `nursery/front-desk`)
- **For:**
  - funded providers whose parents mostly come through the council;
  - voluntary playgroups and community nurseries;
  - nurseries with few good photos.
  - Most of our 802 prospects are small: the median is 50 places.
- **Concept:**
  - the Front Desk system re-themed away from the NHS colours, because a nursery isn't an NHS service;
  - a live "open now" status;
  - a key facts strip (ages, hours, funded status, places, grades);
  - task cards with the answer printed on them ("Funded hours: we're a funded provider for Fife. Apply through Fife Council.");
  - a parents' panel for closures, menus and forms.
- **Why:**
  - Location and practical fit are the top reasons for choice [SG25-7].
  - Lack of places and inflexible hours are the top barriers [SG25-9].
  - Answer them first.
- **Photos needed:** one exterior or entrance photo, optional (desktop only). Children's artwork for texture, optional. It needs **no photos of people**.

#### B. Key Worker (people-led; Familiar Faces family, `nursery/key-worker`)
- **For:**
  - owner-run private nurseries with a stable, qualified team;
  - baby rooms, where parents weigh up trusting staff with an infant.
- **Concept:**
  - the team is the hero: the manager's welcome in their own words;
  - every room's team with qualification, SSSC registration (as confirmed) and years at the nursery;
  - the key-worker system explained;
  - settling in told as steps with the staff who do it.
- **Why:**
  - "Liked and trusted the staff" is the second reason for choice (43%) [SG25-7].
  - Parents are told to ask about key workers and qualifications [PC-C].
  - Real-people photos get attention; stock ones are ignored [NNG-P].
- **Photos needed:**
  - a consented head-and-shoulders portrait of each named staff member, in natural light against a real nursery wall;
  - 2 or 3 staff-at-work shots where children are unidentifiable (hands, from behind);
  - one room photo per age group.
  - Write a `PHOTO-SHOTLIST.md` as for `practice/familiar-faces-dental`, with the staff consent wording.

#### C. Garden Gate (place-led; Doorway family, `nursery/garden-gate`)
- **For:**
  - nurseries with a distinctive place: a converted villa or church hall, a big garden, woodland or beach access, a forest-kindergarten approach (only if the nursery says so), or a rural setting;
  - often premium private nurseries in Edinburgh, Glasgow's West End, Aberdeenshire and Perthshire.
- **Concept:**
  - a walk-through from gate to garden: entrance, each room by age, the garden and outdoor kit, the kitchen, sleep room, cloakroom;
  - a "day at nursery" timeline over the photos;
  - a strong outdoor section ("Outside every day", only if confirmed).
- **Why:**
  - 88% of parents said their setting offered daily outdoor access, and small outdoor spaces drove dissatisfaction [SG25-12].
  - Funded providers must offer daily outdoor play, including in natural settings [FFC-2].
  - Showing the space answers the visit question before the visit.
- **Photos needed:**
  - 10 to 16 landscape photos of the premises, taken empty or with children unidentifiable: entrance, every room, garden from several angles, outdoor kit, mud kitchen or planting beds, the kitchen and food as served, sleep area, cloakroom and pegs (with names hidden), and children's displays;
  - a shot list and a "tidy the room" checklist for the nursery.

**Shared across all three:**
- the grades panel with the report link;
- the fees and funding page pattern;
- the parents' area;
- the waiting-list wording from 6.3;
- the photo rules from section 5;
- the same 6-item menu.

---

## 8. Pre-handover checks specific to nurseries

- [ ] Funded status is confirmed with the nursery, and with the council's provider list where there is one.
- [ ] Grades, their headings and the report date match the latest Care Inspectorate record. The report link resolves.
- [ ] Fees, availability, hours, closures, menus, ratios, staff qualifications and SSSC status are as supplied, or say "phone to check".
- [ ] No identifiable child appears in any image, and EXIF data is stripped. Staff consent is recorded in `img/CREDITS.txt`.
- [ ] No pop-ups, carousels, auto-play, social embeds, map embeds or third-party trackers.
- [ ] Menus, forms and policies are HTML, not PDF-only.
- [ ] The waiting list or enquiry route asks for minimal data and has a privacy notice.
- [ ] Every external link (mygov.scot, GOV.UK, Parent Club, Care Inspectorate, council) returns 200.
- [ ] `audit.mjs` reports 0/0/0 on every page, and `viewports.mjs` is clean at every width.

---

## 9. Sources (all checked 13 October 2026)

| Tag | Source |
|---|---|
| SG25-3 | Scottish Government, *ELC parents' views and use: research findings 2025*, executive summary (published 17 March 2026): https://www.gov.scot/publications/early-learning-childcare-elc-parents-views-use-research-findings-2025/pages/3/ |
| SG25-7 | Same report, Use of funded ELC (reasons for choice, provider types): https://www.gov.scot/publications/early-learning-childcare-elc-parents-views-use-research-findings-2025/pages/7/ |
| SG25-9 | Same report, Accessibility of ELC: https://www.gov.scot/publications/early-learning-childcare-elc-parents-views-use-research-findings-2025/pages/9/ |
| SG25-12 | Same report, Quality of funded ELC: https://www.gov.scot/publications/early-learning-childcare-elc-parents-views-use-research-findings-2025/pages/12/ |
| MG-F | mygov.scot, Funded early learning and childcare for 3 to 5 year olds: https://www.mygov.scot/childcare-costs-help/funded-early-learning-and-childcare |
| MG-2 | mygov.scot, Funded early learning and childcare for 2 year olds (updated 1 April 2026): https://www.mygov.scot/childcare-costs-help/funded-early-learning-and-childcare-for-2-year-olds |
| MG-SCP | mygov.scot, Scottish Child Payment: https://www.mygov.scot/scottish-child-payment |
| FFC-2 | Scottish Government, *Funding Follows the Child and the National Standard: operating guidance*, Section 2 (August 2025): https://www.gov.scot/publications/funding-follows-child-national-standard-early-learning-childcare-providers-operating-guidance-3/pages/3/ |
| CI-QIF | Care Inspectorate, Quality improvement framework for ELC sectors and FAQs (updated 1 July 2026): https://www.careinspectorate.scot/for-providers/quality-frameworks/early-learning-and-childcare-sector/quality-improvement-framework-elc |
| CI-G | Care Inspectorate, What our evaluations mean (six-point scale): https://www.careinspectorate.scot/for-providers/inspections-and-enforcements/what-to-expect-when-we-inspect/evaluations-grades |
| CI-R | Care Inspectorate, How to find an inspection report: https://www.careinspectorate.scot/find-care/search-for-care/how-to-find-inspection-report |
| CI-P | Care Inspectorate, Understanding a care service profile: https://www.careinspectorate.scot/find-care/search-for-care/care-service-profiles |
| CI-S | Care Inspectorate register search (Day Care of Children): https://www.careinspectorate.scot/find-care/search-for-care/care-services?service_type=Day+Care+of+Children&current_status=Active |
| CI-CO | Care Inspectorate, Complain about a service: https://www.careinspectorate.scot/complaints-and-feedback/complaints-about-registered-services/complain-about-a-service |
| PC-Q | Parent Club, How do I know if an ELC setting is high quality?: https://www.parentclub.scot/articles/how-do-i-know-if-elc-setting-high-quality |
| PC-C | Parent Club, Things to consider when choosing ELC: https://www.parentclub.scot/articles/things-consider-when-choosing-elc |
| PC-F | Parent Club, Early learning and childcare funded hours: https://www.parentclub.scot/articles/whats-your-child-entitled-to |
| RTA | Education Scotland, *Realising the Ambition: Being Me* (2020, updated January 2026): https://education.gov.scot/resources/realising-the-ambition/ |
| GOV-TFC | GOV.UK, Tax-Free Childcare: https://www.gov.uk/tax-free-childcare |
| GOV-UC | GOV.UK, Universal Credit and childcare: https://www.gov.uk/help-with-childcare-costs/universal-credit |
| CORAM | Coram Family and Childcare, *Childcare Survey 2026*: https://www.coram.org.uk/resource/childcare-survey-2026/ |
| ICO-S | ICO, Taking photos in schools: https://ico.org.uk/for-the-public/schools/photos |
| ICO-C | ICO, Children and the UK GDPR: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/ |
| ICO-I | ICO, The right to be informed: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/ |
| ICO-PECR | ICO, Cookies and similar technologies: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/ |
| DfE | GOV.UK (DfE), Taking and using photos and videos in schools (England, but the consent rules are UK GDPR): https://www.gov.uk/guidance/data-protection-in-schools/taking-and-using-photos-and-videos-and-using-cctv-in-schools |
| NNG-C | Nielsen Norman Group, Designing effective carousels: https://www.nngroup.com/articles/designing-effective-carousels/ |
| NNG-A | Nielsen Norman Group, Auto-forwarding carousels: https://www.nngroup.com/articles/auto-forwarding/ |
| NNG-P | Nielsen Norman Group, Photos as web content: https://www.nngroup.com/articles/photos-as-web-content/ |
| GDS-PDF | GDS blog, Why GOV.UK content should be published in HTML and not PDF: https://gds.blog.gov.uk/2018/07/16/why-gov-uk-content-should-be-published-in-html-and-not-pdf/ |
| GOVUK-S | GOV.UK, Writing to GOV.UK standards: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/tone-of-voice/ |
| W3C-TS | W3C, Understanding WCAG 2.2 SC 2.5.8 Target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| Data | Care Inspectorate datastore, 31 August 2026, in `prospects/nursery/source/`; prospect list in `prospects/nursery/data/` |

**Not verified, so don't state these as fact:**
- SSSC register parts, deadlines and conditions (sssc.uk.com blocked automated access);
- the under-2s staff ratio;
- Coram's Scotland £-per-week prices;
- any statistic on how far ahead parents start looking;
- a quotable Realising the Ambition line on calm environments;
- a top-tasks study specific to nursery websites (none found).

My web-search allowance ran out partway through. Further checks, especially SSSC and the Care Inspectorate ratio guidance, need a follow-up session.
