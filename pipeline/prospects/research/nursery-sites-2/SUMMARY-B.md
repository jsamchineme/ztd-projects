# Liked nursery sites, group B: summary

This group covers Pear Tree Arnhall, Bright Starts Thornliebank, Bright Horizons First Class, Busy Bees Melrose and Heads of Ayr. There's one study file per site in this folder. The screenshots are in the session scratchpad (`study2-b/`), which isn't kept.

## Comparison

| | Pear Tree Arnhall | Bright Starts Thornliebank | Bright Horizons First Class | Busy Bees Melrose | Heads of Ayr |
| --- | --- | --- | --- | --- | --- |
| Colour | Low (green and slate) | Very high (whole sections in red, coral, pink, green) | Medium (navy and yellow, teal and green tiles) | High, in small doses on white | Gentle (cream, olive, pastels) |
| Fun device | Handwritten room names, video hero | Textured colour bands, a drawn meadow, a coloured icon menu | Grid of 12 line icons, playful button labels, wavy shapes | Bee mascot in every section, one highlighted word per heading, big clock-style hours, dashed timeline | Watercolour header, torn-paper edges, blob-shaped photos, a doodle per room |
| Homepage words | 278 group / 1,446 nursery | 972 / 1,192 | 533 / about 1,600 | 1,419, under 500 visible | 165 |
| Fees shown | No | Yes (£66 / £38) | PDF and calculator | Fee sheet download | Yes (£73, 1140 hours) |
| Video | Vimeo background loop, 107-second film | None | 25-second self-hosted hero loop (18 MB), 360° tour | 1:50 Wistia video in a pop-up player, sound on | 80-second Wix loop, desktop only |
| Gallery | 3-photo strip | 30-thumbnail grid page with a lightbox | Hero slider of 11 | Hero slider of 10 | 44-photo mosaic page |
| Phone page weight | 3.3 MB | 9.8 MB (group homepage 50 MB) | 3.2 MB (group homepage plus an 18 MB video) | 5.0 MB | 1.4 MB |

- **Busy Bees Melrose** is the best example of "colourful, fun, not text-dense" while using almost no photos of children.
- **Bright Starts** is the most colourful.
- **Heads of Ayr** is the lightest and most charming.

## Top 10 techniques

1. **Drawn characters or scenery instead of photographed children.**
   - Busy Bees: its bee mascot in about 12 poses, one per section and one per timeline slot.
   - Heads of Ayr: a watercolour header.
   - Bright Starts: an illustrated meadow and clouds.
   - As small SVGs, these give a "children's book" feeling with no consent problem.
2. **One word per heading in a solid colour box,** for example "Your nursery in [Melrose]". Busy Bees alternates red with white text and pale yellow `#FEE6A6` with black text.
3. **Whole sections in solid colour with a faint texture.**
   - Bright Starts rotates red, coral, pink and green bands, each with a diagonal-line overlay.
   - Heads of Ayr puts a paint-speckle pattern on cream.
4. **One colour and one doodle per room.**
   - Bright Starts gives each room card its own colour.
   - Heads of Ayr: the Sunshine Room in lemon with a sun, the Rainbow Room in mint with a rainbow, and the Garden with wellies.
5. **Facts shown as objects, not sentences.**
   - Big clock-style boxes for the hours on a red band (Busy Bees).
   - The price in big type on a card (Bright Starts, Heads of Ayr).
   - A grid of 12 two-word facility icons (Bright Horizons).
   - Facility tags under the title (Busy Bees).
   - A strip of trust signals under the hero: grade, review score and funding (Bright Horizons).
6. **Hand-lettered display fonts, for names and short headings only:** Chelsea Market, Amatic SC, "Just Me Again Down Here" for Pear Tree's room names, and Hero Junior at weight 900.
7. **Soft, hand-cut shapes.**
   - Wavy section edges and torn-paper joins.
   - Blob, oval and arch photo crops.
   - Dashed rounded cards joined by a dashed path for "a day at nursery".
8. **Photo or colour tiles labelled with one or two words** as the main routes to the inner pages. Heads of Ayr uses Rooms, News, Nutrition and Documents. Bright Horizons uses playful labels such as "Take a peek" and "Get a taste".
9. **A sticky tab bar within the page, and a sticky "Book a visit" bar at the bottom** (Busy Bees), so a long one-page nursery site feels short.
10. **Video as a small "living photo" or a filmed-from-above loop, never as the whole hero.**
    - Heads of Ayr puts a loop inside a photo collage.
    - Pear Tree films the garden from above, where children are tiny figures.

## Video

- **Hosting:** Vimeo on 2 sites, Wistia on 1, Wix on 1 and self-hosted on 1, plus a third-party 360° tour.
- **Captions:** no site has a captions track.
- **Phone weight:**
  - Bright Horizons sends an 18 MB video to phones.
  - Heads of Ayr swaps in a still image on phones, which is the right pattern.
  - Busy Bees loads nothing until the play button is tapped.
- **Under our rules:**
  - A short loop: a 6 to 10 second self-hosted clip under 1.5 MB, with a poster image. Muted, autoplaying only when the user hasn't asked for reduced motion and only above phone width, with a pause button.
  - A longer tour: click to play, captions plus a transcript, sound only when the user asks, and no YouTube or Vimeo.

## Galleries

- **No site filters by room, captions its photos or writes useful alt text,** and Bright Starts' lightbox leaves keyboard focus on the page behind it.
- **Photo sets closest to our rules:**
  - Busy Bees Melrose: mostly empty rooms and the garden.
  - Heads of Ayr: about 15 photos with no children (animals, a tractor, rooms, food, artwork), plus about 20 of children from behind.
- **Our version:**
  - A 4 to 6 photo strip on the homepage, plus a gallery page.
  - A CSS mosaic, 2 columns on a phone.
  - Real alt text, lazy loading and responsive image sizes.
  - Optional room filter buttons.
  - No slider. A lightbox only as a proper dialog that handles focus and closes on Escape.
