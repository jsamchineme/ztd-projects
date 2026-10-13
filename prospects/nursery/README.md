# Nursery prospects

Independent nurseries and playgroups in Scotland, graded as website-redesign prospects. They feed the nursery board (`make nurseries`, http://localhost:4391).

The spreadsheet is `nursery-prospects.xlsx`. It has one row per nursery, worst sites first, with phone, email, manager and Care Inspectorate grades.

## What's in the list

There are 802 services from the Care Inspectorate datastore as at 31 August 2026. A service is included when it is:

- active "Day Care of Children" that runs a nursery or playgroup;
- private or voluntary (council nurseries can't buy);
- run by a provider with 3 services or fewer (chains have their own web teams);
- not an after-school or holiday club.

| Grade | Count | Meaning |
| --- | ---: | --- |
| Bad | 109 | Dated, broken on a phone or near-empty. Includes Facebook-only pages and sites that don't load (new-site prospects) |
| Average | 160 | Works, but is dated, cluttered or hides what parents need |
| Good | 22 | Modern and clear. Not a target |
| NoSite | 460 | No website found. 196 haven't been searched for yet (`search.kind` "unsearched") |
| Excluded | 51 | Independent schools, colleges, universities, chains, big charities, placeholder sites |

## Files

- `data/page-NNN.json`: one record per nursery. Fields:
  - Care Inspectorate fields: `csNumber`, `places`, `under3s`, `grades`, `manager`, `provider`, `sector`;
  - `website`: confirmed, or found by search;
  - `websiteGuess`: from the email domain;
  - `site`: what `check-sites.mjs` measured;
  - `search`: the web search result;
  - `exclude`: why the nursery isn't a target.
- `grades/page-NNN.json`: `{id, grade, reason}`.
- `shots/`: desktop and phone screenshots of each site (gitignored).
- `source/`: the raw datastore CSV (gitignored).

## Rebuilding

```sh
# 1. Download the latest CSV from https://www.careinspectorate.scot/resources-data/data-and-statistics/datastore
node prospects/nursery/build-list.mjs prospects/nursery/source/<datastore>.csv   # overwrites data/
node prospects/nursery/check-sites.mjs            # visits sites, screenshots, confirms `website`
# 2. Websites for nurseries with a free-mail address were found by search agents, and the Bad/Average/Good
#    grades by agents reading the screenshots (see grades/). Then:
node prospects/nursery/grade-rest.mjs             # grades the nurseries the screenshot graders skip
python3 prospects/nursery/make-sheet.py           # rebuilds the spreadsheet
```

`build-list.mjs` starts from scratch, so it loses the search results and hand checks. To refresh only the sites, run `check-sites.mjs --redo` or `--retry-failed`.

## Loading the board

```sh
make nurseries                                                                  # in one terminal
PIPELINE_URL=http://localhost:4391 node pipeline/import-prospects.mjs prospects/nursery            # Bad and Average
PIPELINE_URL=http://localhost:4391 node pipeline/import-prospects.mjs prospects/nursery --grades NoSite   # optional: new-site prospects
```

Nurseries that share one website become one card. Card notes carry the Care Inspectorate grades, so build workers can show them exactly.

## Caveats

- The 196 unsearched nurseries ran out of web-search budget. Some will have websites.
- Grades came from the screenshots. Pop-ups and Cloudflare checks hid a few sites, which were graded on what was visible.
- The research brief for these sites is `prospects/research/nursery-websites.md`.
