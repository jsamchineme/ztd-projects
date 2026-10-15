# Full Stop: photo shot list

Full Stop needs **2 to 6 photos**, all of places, not people. The colour blocks are the main look, so photos are cropped into the top of blocks or shown at 3:2 with a 24px radius. **The template is complete with no photos at all**: remove every `.block__photo` and `figure.photo` and the page still works.

## Rules (from `prospects/research/nursery-websites.md` §5.2)
- No identifiable children, ever: no faces, no backs of heads you'd recognise, no names on pegs, paintings, drawers or wall displays. Check every wall in the frame.
- No children in nappies, changing, bathing or sleeping.
- Staff only with their own written consent, recorded in `img/CREDITS.txt`.
- Never stock or AI-generated people.
- Strip all metadata. Save each photo at 720px and 1200px wide, WebP (quality 60 to 65) and JPEG (about 72).

## The shots, in order of value

| # | Shot | Where it goes | How to take it |
|---|---|---|---|
| 1 | **One room per age group**, tidy and empty, lights on | "Your week, sorted" first block; Our nursery rooms | Landscape, from a corner at child height (about 1m), so the floor and the furniture read. Morning light. Clear the walls of photo displays and named artwork, or shoot away from them. |
| 2 | **The front entrance** with the sign | Find us | Straight on, from the car park or the path. No cars with readable plates. |
| 3 | **The garden or outdoor area** | Outdoors, "Outside, most of the day" | Wide, empty, ideally with the kit out (water station, mud kitchen, bikes). |
| 4 | **The lunch table set** | Food block | From above or at a low angle, plates of the real day's lunch, no hands. |
| 5 | **Coats and wellies on pegs** | Settling in, What to bring | Close-up. Hide or blur every name label. |
| 6 | **A second building or room** the nursery is proud of (a preschool room, a sensory room) | Rooms | As shot 1. |

## Crops
- Blocks crop photos to 3:2 with `object-fit: cover`. Keep the subject in the middle 60%.
- Never crop a person in. If a photo needs a person removed, don't use it.

## Fallbacks
- No room photos: the rooms section uses the drawn growing wellies (or the nursery's own creature for its room names) on tinted blocks. That's the default.
- No entrance photo: Find us shows the hours board alone, full width.
- Old photos (more than 5 years): use them only if the nursery confirms the room still looks like that, and list the year in `CREDITS.txt`.
