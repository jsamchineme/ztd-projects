# Working the Pipeline as an agent

The Pipeline is a board of buckets. Each website is a card that moves left to right through them. You work one stage at a time: claim a card, do the stage's work, write your results into the card's fields, then complete it. The server moves the card to the right next bucket.

The server must be running (`make pipeline` from the repo root). Run every command from the repo root.

## The loop

```sh
export PIPELINE_AGENT=claude-analyst      # your name on claims and history; pick one per agent

node pipeline/cli.mjs claim analysis      # takes the next card and prints it with the instructions for this stage
# ... do the work the instructions describe ...
node pipeline/cli.mjs set 12 score=3 analysis=@/tmp/analysis-12.md
node pipeline/cli.mjs complete 12         # moves it on; fails and names any required field you haven't filled in
```

Repeat until `claim` prints `Nothing waiting` (exit code 3). A practice with no working website (dead site, Facebook only, or an NHS listing link) isn't a dead end: plan a brand-new site and complete with `new_site`. If you can't finish a card, give it back with `node pipeline/cli.mjs release 12 --note "why"` so someone else can take it. Claims expire after 90 minutes.

- `claim` prints what to do, which fields are required and which outcomes are allowed. Follow it.
- Long text: write it to a file and pass `field=@path`, or use `\n` for line breaks.
- `--json` on `claim` or `show` gives you the whole card as JSON.
- Use `comment <id> <text>` for anything a human should see that doesn't belong in a field.

## Stages agents work

| Stage | Claim with | Pulls from | Fill in | Complete with |
| --- | --- | --- | --- | --- |
| Discovery | (none, just add) | | | `add <url> --name "<business>"` or `import <file>` |
| Analysis | `claim analysis` | Targets | `score` (1–10), `analysis` | `complete <id>`: goes to Bad, Average or Good by score |
| Redesign study | `claim study` | Bad sites, then Average sites | `findings`, `template`, `plan` | `complete <id>` (redesign), or `complete <id> new_site` when there's no working website. Both go to Ready to build. |
| Build | `claim build` | Ready to build | `previewUrl` | `complete <id>`: goes to AI review |
| AI review | `claim ai_review` | | `review` | `complete <id> pass` or `complete <id> changes` |

Human review and the Sales stages are for people, who work them in the web board.

Score bands: 1–4 is bad, 5–7 average, 8–10 good. Set `rating=` yourself to override the band. Redesign study always takes the highest-priority card first, then the worst-scoring site, then the one that has waited longest.

## Running Claude Code as a stage worker

```sh
PIPELINE_AGENT=claude-analyst claude -p "Read pipeline/AGENTS.md. Work the analysis stage: claim cards one at a time and complete them until nothing is waiting."
```

Run one of these per stage, or several on the same stage. Claims stop two agents from taking the same card.
