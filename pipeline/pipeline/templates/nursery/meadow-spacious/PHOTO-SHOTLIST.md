# Meadow: photo shot list

Meadow lives on photos of places, animals and things. It never needs a child's face. Use this list when a nursery wants new photos, or when you sort the photos on its current site.

## The rules (from `prospects/research/nursery-websites.md` §5)

- **No identifiable children, ever.** No faces, names, name pegs, nappies, changing, bathing or sleeping. Treat any old-site photo with a child in it as excluded, even from behind, unless the nursery confirms consent for the new site in writing. For a sales mock-up, exclude them all.
- **Staff** only with their own consent. Portraits already published by name on the nursery's own site may go in a mock-up; confirm before go-live.
- **Never** stock or AI-generated people, children or staff.
- Strip all metadata (the build script's WebP re-encode does this). Record every source, and every rejected photo with the reason, in `example/img/CREDITS.txt`.

## What Meadow uses, and where

| Slot | What to shoot | Shape on the page | Count |
| --- | --- | --- | --- |
| Collage, big blob | The nursery's signature: an animal, the building, the best view of the garden | Square, blob mask | 1 |
| Collage, living photo | Something that moves gently: lambs grazing, the stream, washing on the line, leaves, hens pecking. Film 10 s on a tripod, or use one still for a pan | Square, blob mask, 6 to 10 s loop | 1 |
| Collage, small blobs and oval | An animal close-up, a garden feature (fire pit, mud kitchen), food or artwork | Square and 4:3 oval | 3 |
| One-word tiles | One clear subject each: an animal face, a sign, a room corner, a person (staff, consented) | Square on phones, 4:3 on desktop | 4 to 6 (painted doodles fill the rest) |
| Snapshot strip | Five favourites across the groups | 1 wide plus 4 pebbles | 5 |
| Gallery page | Groups: Animals, Garden, Growing (food), The farm (or Rooms, Garden, Food, Artwork) | Mosaic, 2 columns on phones | 16 to 40 |
| Team | Head and shoulders on a plain, light wall, in nursery tops | Square, blob mask | 1 per person |
| Farm film | 10 to 15 calm photos of empty spaces, or 30 to 60 s of real footage with no children | 16:9 | 1 |

## Shot ideas that work without children

- **Animals:** faces in close-up (horse, cow, rabbit), groups (ducks in a row, hens at the run), babies (ducklings, kittens, a chick in cupped hands).
- **Hands at work:** planting seeds, holding an egg, stirring the mud kitchen, painting. Hands only, no faces, no name labels.
- **Garden features:** signs (The Secret Garden), the fire pit circle, swings, the treehouse, tools on the fence, raised beds with labels.
- **Food:** what children grow (peas, carrots, berries, apples) and what is served, plated, from above.
- **Rooms:** empty, tidied, in morning light, from a child's eye height. Shoot the cosy corner, the book nook and the art table.
- **Weather and seasons:** the same view in snow and in summer. Meadow's watercolour scene loves seasons.
- **Heritage:** old drawings, the sign by the gate, old machinery.

## Technical

- Landscape 4:3 or square, at least 1600px on the long side. Natural light, no flash.
- Save at 400 and 800px wide as WebP (quality 60 to 65); staff at 240 and 480px.
- Living photo: H.264 MP4, 640x640, no audio, CRF 26 to 28, `+faststart`, under 1.5 MB (the example is 240 KB). Poster WebP from the first frame.
- Farm film: H.264 MP4, 1280x720, no audio unless a narrator is recorded, under about 4 MB. Write WebVTT captions and the same words as a transcript on the page.
