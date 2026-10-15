# Three colourful nursery directions

These three directions come from the owner's own picks. He sees good nursery sites as "very colourful, fun and not too text dense, especially on the home page". The sites he picked:

- Banana Moon (Aberdeen International, Westhill)
- Buttercups
- Cherubs
- Pear Tree Arnhall
- Bright Horizons First Class
- Bright Starts Thornliebank
- Busy Bees Melrose
- Thrive Dunblane
- Abacus Ark Wandsworth
- Heads of Ayr

Where the evidence is:

- the studies, in `prospects/research/nursery-sites-2/` (one file per site);
- the cross-site findings, in `SUMMARY-A.md` and `SUMMARY-B.md` in that folder.

## A fresh visual language

These templates must **not** reuse the signature devices of our existing eight nursery templates:

- luggage-tag facts
- cork noticeboards
- full-stop headlines
- storybook chapters
- weather tiles
- recipe cards
- leaf-shaped corners
- torn paper
- key facts as a row of boxed cards

Every parent fact still has to be there, presented in a new way.

## Rules all three share

**Homepage text**
- About 250 to 350 visible words. Headings of 2 to 6 words, paragraphs of 1 or 2 sentences.
- Everything deeper goes on inner pages, reached by big colourful tiles or buttons.

**What parents need to find within one scroll of the phone homepage**
- Ages and hours.
- Funded hours: 1,140 hours in Scotland, plus the council.
- Places, or "phone to check".
- Care Inspectorate grades with the date and a link.
- Book a visit and phone.

**Inner pages**
- Visit and join, Fees and funding, Our nursery (rooms and the day), Our team, Parents, and a **Gallery** page.

**Facts**
- Never invent facts. Write "phone to check" when a fact is unclear.

**Photos**
- No identifiable children. No stock or AI-generated people.
- Photos of empty rooms, the garden, food, artwork, hands and children from behind are fine, and the studies show they look vivid.

**Gallery**
- A homepage strip of 4 to 6 photos, plus a gallery page.
- A CSS mosaic, 2 columns on a phone. Groups for Rooms, Garden, Food and Artwork, with optional filter buttons.
- Real `<img>` with true alt text and short captions. Lazy loading, and WebP at 400 and 800px.
- No slider. An optional lightbox must be a `<dialog>` that closes with Esc and returns focus.

**Video, in two kinds**
- **Living photo:** a 6 to 10 second loop, under 1.5 MB, self-hosted MP4.
  - It has a poster image and is muted. It autoplays only when the viewer hasn't asked for reduced motion and the screen is wider than a phone; phones get the poster.
  - It has a visible pause button.
  - It may be made from the nursery's own footage of rooms, the garden or food, with no identifiable children. Or it can be a slow pan across one of the nursery's real photos, made with ffmpeg and labelled honestly, for example "Our garden".
- **Tour or film:** click to play, `preload="none"`, `playsinline`, a poster image, WebVTT captions plus a transcript link, and sound only when the user asks. No YouTube, Vimeo or Wistia.

**Colour and contrast**
- Bright bands must pass WCAG AA. Use deeper shades for text bands, or put text on white or cream cards over the band. Every token pair needs a computed contrast note.

**Build and quality**
- Self-hosted fonts, no CDNs, no trackers, pop-ups or chat widgets.
- A sticky "Book a visit" and "Phone" bar on phones is allowed. It must not cover content or focus.
- All illustration is hand-coded SVG. Animals, plants, objects, buildings and weather are fine; **people are not**.
- Audit 0/0/0, clean at all 9 widths, homepage under about 1 MB on a phone (the video loads on demand).

## 1. Sidekick (`nursery/sidekick`), mascot-led

- **Inspired by:** Busy Bees Melrose's bee in every section, Banana Moon's characters and Buttercups' butterfly.
- **Concept:** the nursery gets a drawn **mascot** that guides parents through the site.
  - The mascot is drawn from its name or logo: a bee, owl, squirrel, hedgehog, puffin, bear, ladybird, or the nursery's own animal.
  - It appears in a different pose in each section: waving, holding a clock for the hours, a spoon at lunch, a magnifying glass for learning, a pillow at nap time, a map for find us.
  - It makes a plain page feel joyful with zero photos of children.
- **Signature devices:**
  - **Highlighted-word headings:** one word per heading sits in a solid colour box ("A **warm** welcome", "Your nursery in **Paisley**"). Alternate the two accent colours.
  - **Clock-box hours:** a colour band showing "7:30 AM to 6:00 PM" as two big clock-style boxes.
  - **Mascot day path:** a dashed path through the day (arrive, play, lunch, nap, outside, home), with the mascot at each stop.
  - **Facility tags:** pills with icons under the hero (Garden, Under 3s, Meals cooked here, Funded hours).
  - **A sticky booking bar on phones,** with a tiny mascot.
  - **In-page tab chips** on long pages.
- **Look:** a white ground with bold blocks in two strong accents (for example tomato red and sunflower yellow) plus a deep ink colour. Heavy rounded display type in short headings, and a friendly sans for body text.
- **Suits:** nurseries with an animal or creature name or logo, mid-size private nurseries, and nurseries with few usable photos.

## 2. Make Waves (`nursery/make-waves`), colour bands and a local theme

- **Inspired by:**
  - Banana Moon's flat colour bands with choppy wave seams and the animals sitting on them;
  - Abacus Ark's boat motif carried through the logo, copy and rooms, and its ringed circle photos;
  - Bright Starts' rotating colour sections and colour-coded room cards.
- **Concept:** the page is a stack of full-width flat colour bands that change hue as you scroll, joined by hand-drawn **wavy seams**.
  - Small drawn objects or animals sit on the seams, taken from **one local theme** chosen for the nursery.
  - Theme examples: hills and sheep for a rural nursery; a river with ducks and a boat for a riverside town; sea, gulls and a lighthouse for a coastal town; a city skyline with pigeons for a city nursery; a forest with squirrels.
  - The theme also names the copy lightly ("Come aboard", "Welcome to the hill"), but only uses room names the nursery really has.
- **Signature devices:**
  - **Wave seams** in 2 or 3 styles: choppy, swell, and a double line. Each is one inline SVG recoloured per band.
  - **Ringed circle photos** of empty rooms, the ring colour rotating.
  - **Big-number cards** for the facts ("1,140 funded hours", "From 6 weeks", "51 weeks a year", the ratio if published).
  - **Icon-card navigation:** an icon, 2 words, and a coloured squiggle underline.
  - **Colour-coded room cards,** each room its own band colour.
  - **A hero with the theme scene drawn along its bottom edge.**
- **Look:** 5 or 6 saturated colours used as whole bands (turquoise, teal, sun yellow, apricot, coral, deep navy), with deeper shades wherever text sits. Rounded heavy display type, with a single word coloured in a headline.
- **Suits:** nurseries in places with a strong local identity, such as seaside, riverside, rural or hill towns; bigger private nurseries that want a big, bright brand.

## 3. Meadow (`nursery/meadow`), light, charming and painterly

- **Inspired by:**
  - Heads of Ayr: 165 homepage words, a watercolour header, blob-shaped photos, pastel room blocks each with a doodle, photo tiles with one-word labels, and a video inside a photo collage;
  - Buttercups' pebble frames of hands at work;
  - Thrive's soft circles.
- **Concept:** the gentlest and lightest of the three, with the fewest words.
  - A painted **watercolour scene** across the top: a meadow, a garden or the nursery building, with animals, birds, flowers and washing on a line, but no people.
  - Then a **photo collage** of blob and oval photos, with one "living photo" video in the mix.
  - Then **one-word photo tiles** as the main routes to inner pages (Rooms, Food, Outdoors, Team, Fees, Gallery).
- **Signature devices:**
  - A **watercolour wash** texture built from SVG filters or a tiny WebP, plus hand-painted-looking SVG blobs.
  - **Blob and pebble photo masks,** each slightly different.
  - **Pastel room blocks:** each room gets its own pastel and a painted doodle (sun, rainbow, boots, moon).
  - **One-word tiles** that carry a photo or painting, as the homepage's main navigation.
  - **The collage with a living photo.**
  - **The price as a painted badge** if fees are published.
- **Look:** a cream ground and 4 or 5 soft pastels with one deeper accent for actions. Hand-lettered display type for names and short headings only, and a calm, very readable body face.
- **Suits:** small owner-run nurseries, rural and farm nurseries, and nurseries with good photos of rooms, the garden and animals.
