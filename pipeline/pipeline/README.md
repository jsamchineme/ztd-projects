# Pipeline

A board for moving website redesign projects through buckets, worked by people and AI agents together.

**Production:** Targets → Analysis → Bad sites / Average sites (Good sites are parked) → Redesign study → Ready to build → Build → AI review → Human review

**Sales:** Ready to pitch → Pitched → Interested / Not interested

Approving a card in Human review sends it to Ready to pitch.

## Run it

```sh
make pipeline            # from the repo root; needs Node.js 18+
```

Then open http://localhost:4390. To use another port, run `make pipeline PIPELINE_PORT=4400`.

## Using the board

- **Add sites** puts websites into Targets. Paste one per line, either `url` or `url, Business name`.
- **Take next** on a stage gives you the next card that's waiting for it. Redesign study takes from Bad sites before Average sites.
- Click a card to see the before and after links, fill in its fields, and finish the stage with the outcome buttons. A stage's buttons stay disabled until its required fields (marked *) are filled in.
- Drag a card onto any bucket, or use **Move to**, to move it by hand.
- Every change shows up live for everyone who has the board open, agents' changes included. Each card keeps a full history.

## AI workers and workflows

Open **Workflows** on the board to set up AI workers. A workflow is a list of steps. Each step puts Claude workers on one queue, for example Redesign study, Build or AI review. A worker takes the next card, does that stage's work, fills in the card's fields and completes it. The card moves to the next bucket, where the next step's workers pick it up.

For each step you choose:

- **AI workers:** how many work the queue at once (1–5).
- **Card limit:** the most cards the step takes in one run. 0 means no limit. Set a limit on the first step so a run doesn't work through all 500 prospects.
- **Model** and **Max $ per card:** a worker that hits the cap gives the card back.
- **Workers can:** research the web, or research and also build files. Build steps need files.
- **Extra instructions:** added on top of the stage's own instructions from config.json.
- **Then:** where each outcome sends the card. It defaults to the bucket in config.json. The editor shows whether a later step picks the card up or it stops there.

Each workflow also has run limits, set in its editor:

- **Run for:** minutes, for example 60. 0 means run until the queues are empty.
- **Spend limit per run:** dollars, for example 20. 0 means no limit.

When either limit is reached, the run winds down: workers finish the cards they're on and take no new ones. Each card can still spend up to its step's **Max $ per card**, so a run can end slightly over its spend limit. While a run is going, the workflow shows time left and spend so far. **Finish up** winds a run down the same way by hand; **Stop now** ends it at once and sends cards in progress back to their queues unfinished.

For long runs, keep the Mac awake, for example with Amphetamine; a sleeping Mac pauses the workers.

**Run** starts the workers and **Stop** ends them. Cards a stopped worker was holding go back to their queue. A run finishes on its own once nothing is left for any of its steps. Columns show how many AI workers are on them, and the workflow shows each worker's current card, progress, cost and a log.

Workers run the local `claude` CLI, so they use the account `claude` is logged in with. If a worker can't finish a card, it moves it to **Needs attention** with the reason, and the card stays out of every AI queue until you move it on. A practice with no working website isn't a failure: Redesign study plans a brand-new site from its NHS listing, Facebook page and web search, and the card gets a **New site** label. After 3 failures in a row a worker stops. A card that comes back to the same step 3 times in one run, such as Build ↔ AI review, also goes to Needs attention.

### Browser audit

Build and AI review cards get a browser audit before a worker starts. It runs on your Mac with Playwright and your installed Chrome, at desktop (1280px) and phone (390px) width, and checks:

- **Links:** crawls every page of the preview, clicks its links, checks section anchors, files, phone and email links, and checks external links once.
- **Accessibility:** axe-core to WCAG 2.1 AA, covering contrast, labels, alt text, heading order and landmarks.
- **Phone layout:** sideways scrolling, tap targets under 24px (with WCAG's spacing exception) or under the recommended 44px, and text under 12px.
- **Menu:** that the phone menu exists and opens.
- **Forms:** submit buttons, required fields, and that valid answers are accepted.
- **Keyboard:** Tab reaches every control with a visible focus ring and never gets stuck.
- **Content and errors:** placeholder text, missing titles, broken images, console errors and failed requests.

Issues are graded blocker, major, minor or info. Cards show **Audit passed** or **Audit: N to fix**. The card panel has the counts, a **Run audit** button and the full report with screenshots (`/audit/<card>/`). AI review sends a card back to Build when there's any blocker or major issue. Build workers can run the audit themselves (`node pipeline/audit.mjs <preview url> <out dir>`, the only shell command they're allowed) and fix what it finds before handing over.

On a workflow step, **Workers can → use a real browser** also gives workers Chrome through the Playwright MCP, so a reviewer can use the site like a patient (open the menu, follow the booking path, try forms). It's slower and costs more, so it's opt-in.

`make pipeline` installs these the first time. To run an audit by hand: `node pipeline/audit.mjs http://localhost:4390/preview/12/ /tmp/audit-12`.

### Templates

Six design templates live in `pipeline/templates/`, listed in `config.json` (`templates`, `templateFiles`, `templateSummaries`). On a card, the **Template** field is a picker: each template shows a thumbnail and a one-line summary, with **Preview** (the worked example at phone, tablet or desktop size, inside the board), **Open** (the example in a new tab) and **Brief** (the rules build workers follow). After changing a template, refresh its thumbnail with `node pipeline/template-thumbs.mjs`.

Build workers write the new site into `pipeline/data/work/<card>/site/`. It's published at `http://localhost:4390/preview/<card>/` and saved as the card's redesign preview. Previews are sandboxed, so their scripts can't touch the board.

Human review and the Sales stages can't be given to AI workers.

## Agents

Agents use the CLI (or the HTTP API it wraps). See [AGENTS.md](AGENTS.md).

```sh
node pipeline/cli.mjs stages            # buckets and counts
node pipeline/cli.mjs claim analysis    # take the next card, with instructions
node pipeline/cli.mjs help
```

## Changing the pipeline

Everything about the workflow is in [config.json](config.json): buckets, who works each one (`ai`, `human` or `any`), what each stage pulls from, required fields, outcomes, the template list, the score bands and the instructions agents are given. Restart the server after editing it.

- `pullFrom`: buckets a stage takes work from, in priority order.
- `feeds`: marks a holding bucket and names the stage that empties it.
- `outcomes`: the ways a stage can finish and where each one sends the card. `next` is shorthand for a single "Done" outcome.
- `terminal`: a final bucket.

## Data

Cards are saved in `pipeline/data/cards.json`. Back it up by copying the file. Set `PIPELINE_DATA=/path/to/cards.json` to keep it somewhere else. The server only accepts requests from this machine.
