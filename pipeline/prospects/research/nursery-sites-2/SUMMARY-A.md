# Liked nursery sites, group A: summary

Sites: Banana Moon Aberdeen International, Banana Moon Westhill, Buttercups, Cherubs, Thrive Dunblane and Abacus Ark Wandsworth. There's one study file per site in this folder. The screenshots are in the session scratchpad (`study2-a/`), which isn't kept.

## Top 10 techniques for colour, fun and light text

1. **Whole bands of flat colour that change hue section by section.** White is the exception.
   - Banana Moon: `#0091da`, `#fac32d`, `#f08650`, `#a660a3` and `#bcdefa`, with navy `#0e3f57`.
   - Abacus: `#69c8c4`, `#136874`, `#f1d584`, `#fab078` and `#f07b68`, with `#09434e`.
2. **Wavy edges between bands.**
   - Banana Moon: a choppy hand-drawn wave, one inline SVG recoloured for each band.
   - Abacus: long soft swells with a thin crest line.
   - This is the cheapest device that makes a page feel "for children".
3. **Small characters or objects standing on the seams between bands.**
   - Banana Moon: a cat and crab, ducklings, pigs and a seagull, different on each page.
   - Abacus: five sailing boats on the hero wave.
   - They're decorative and cost no words.
4. **One theme carried everywhere.**
   - Abacus: the logo boat becomes the motif, the copy says "Setting sail", and the rooms have themed names.
   - Banana Moon: the moon, with rooms called "Baby Moons" and "Full Moons".
   - For a Scottish nursery the theme could be hills, a river or birds, drawn for that nursery.
5. **Soft photo shapes.**
   - Abacus: circles with thick coloured rings that rotate colour.
   - Thrive: a circle with a smaller overlapping circle and leaf line art.
   - Buttercups: pebble frames with a 100px radius.
6. **Empty-room photography that still looks lively.** Abacus and Banana Moon Aberdeen show only rooms, murals, trays and gardens, and they read as vivid. This proves the no-children rule works.
7. **Icon cards as navigation.** Each card has an icon, a 2-word title and a 5-word line. Banana Moon adds a coloured squiggle under each.
8. **Facts shown as devices, not sentences.**
   - Big-number cards ("3:1", "Zzz", "From 3 months").
   - An icon fact strip (phone, manager, hours).
   - Opening hours as a single 30px line.
   - A meal timetable.
   - A grid of key-feature icons.
   - Fees as short HTML rows (Cherubs).
9. **Jump-to chips on long nursery pages.**
   - Cherubs: the chips become five big stacked buttons on a phone.
   - Thrive: a floating "Call" and "Book a Tour" pair that stays in reach on a phone.
10. **Rounded, heavy display type at large sizes.**
    - Fonts seen: Sofia Pro Soft, Omnes 800, Belanosima (self-hosted by Abacus) and Proxima Soft.
    - Single headline words are coloured, and a hand-drawn underline is used once.
    - Motion stays minimal: the fun comes from illustration and shape, not animation.

**Watch out: contrast.** Bright bands fail contrast on nearly every site:
- white on `#f08650`: about 2.6:1
- white on `#0091da`: about 3.5:1
- white on lime: about 1.5:1

Use darker shades for bands that carry text, or put text on white or cream cards over the band.

## Comparison

| | Banana Moon | Buttercups | Cherubs | Thrive Dunblane | Abacus Wandsworth |
|---|---|---|---|---|---|
| Feel | Loud, illustrated | Homemade, mascots | Calm, colour tiles | Soft pastels, rounded | Bright, nautical |
| Words on homepage or nursery page | ~200 | ~600 | 282 | 4,275 | 1,052 |
| Screen heights on desktop | 5 | 7.7 | 3.8 | 20 | 13 |
| Share of the page in colour | ~70% | ~30% | ~50% | ~65% | ~90% |
| Fees shown | No | Yes, as images | Yes, in HTML | No | No |
| Video | 31-second TV ad | None | 2:24 film, 81 MB | None | None |
| Gallery | Grid of 18 or 11 photos | Grids, lightbox, carousels | None (360° tour) | 29-photo slider | 11 circle photos |

Banana Moon is a franchise. Its two sites share the same layout, illustration, palette, icons and inner-page text. Only the hero and gallery photos, the owner's welcome and the news are local.

## Video

Only 2 of the 6 sites use video, and none autoplays a background video or embeds YouTube or Vimeo.

- **Banana Moon:** the franchise's 31-second TV advert, 11.8 MB. It has controls, but no poster and no captions.
- **Cherubs, homepage:** a brand film, 2:24 and 81 MB, self-hosted, with `preload="auto"`. It's the worst phone-performance problem in the batch.
- **Cherubs, careers:** a staff film, 2:05 and 38 MB.
- **Cherubs, tours:** a self-hosted 360° tour of empty rooms for each nursery.
- **Content:** the films mostly show children's faces close up.

**Under our rules:**
- A 20 to 45 second self-hosted MP4 or WebM at 720p, under about 4 MB.
- Use `controls preload="none" playsinline`, with a real room photo as the poster.
- No sound unless the user starts it, and no autoplay when `prefers-reduced-motion` is set.
- Add WebVTT captions and a one-line summary.
- Film empty rooms, the garden, food and hands.

## Galleries

- **Banana Moon:** a 4-column grid built from CSS background images, with junk alt text. Aberdeen's photos are all of empty rooms.
- **Buttercups:** grids, lightboxes and autoplay carousels. Nothing is lazy-loaded, and many images have no alt text. Its close-ups of hands and materials are the best in the batch.
- **Thrive:** a 29-photo slider.
- **Abacus:** 11 ringed circle photos of empty rooms, used as a guided tour.

**Under our rules:**
- A visible grid of 6 to 12 photos, grouped Rooms / Garden / Food / Artwork, with no identifiable children.
- Real `<img>` elements with short, true alt text that doubles as a caption, lazy loading, and WebP at 400 and 800px.
- Any filter chips are plain buttons.
- Any lightbox is a `<dialog>` that closes with Esc and returns focus.
- No sliders.

## Other findings

- **Thrive Dunblane:** the page never mentions the Care Inspectorate or the 1,140 funded hours, and its brochure link points to a Liverpool nursery's file.
- **Abacus:** its Google review widget shows an AI-written review, word for word.
- **Fees:** only Cherubs publishes fees in HTML.
