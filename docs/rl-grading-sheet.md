# RL Grading Sheet Guide

Middletown uses an RL-style playtest harness rather than a trained model. The
policy is deterministic, readable, and designed to help agents play the game
correctly.

## Reward Priorities

The policy rewards:

- Higher `Public Trust`
- Higher `Service Quality`
- Positive or stable `Operating Budget`
- Lower or stable `Debt Burden`
- Secondary improvements to safety, infrastructure, housing, economy, health,
  education, mobility, equity, labor, and media climate

The policy penalizes:

- Debt increases
- Trust losses
- Service losses
- Budget collapse
- Passive quarters where the mayor avoids visible choices for too long

## Action Selection

During the `Choices` tab, the policy ranks visible agenda actions by their
effects. It gives extra value to effects that address the weakest current city
signals. For example, if services are low, an action that improves service
quality or safety should outrank a nice-to-have economic headline.

The policy no longer treats the budget as a hard stop after the opening. It
uses lower safety floors later in the campaign, and it may take moderate
late-game tradeoffs when trust, services, and debt give the mayor enough civic
cushion. This keeps the middle years from becoming passive Council/News
coasting.

The runner also uses reducer-backed capital projects, standing policies, public
audits, and rare emergency declarations when they fit the long-run city state.
The runner injects a deterministic seeded `Math.random` before the app loads,
so event selection can be replayed.

During Council and News events, the Playwright runner reads visible option
effects and clicks the option with the best reward score.

## Grade Formula

The final grade combines:

- Survival and turns completed
- Public Trust delta
- Service Quality delta
- Operating Budget delta
- Debt Burden delta
- Number of visible agenda actions filed
- Capital projects started
- Standing policies adopted
- A `Fun and Agency` score that rejects passive wins
- Number of event decisions resolved

Passing requires:

- Completing the requested turn count, normally the full `100` quarters
- Score, agency, budget, trust, services, and debt inside the selected
  difficulty gates
- A visible victory screen for the full 100-quarter run

Current gates:

| Difficulty | Min Score | Long-Run Agency | Min Budget | Min Trust | Min Services | Max Debt |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Easy | 65 | 36 | 1 | 30 | 30 | 80 |
| Normal | 70 | 45 | 1 | 35 | 35 | 70 |
| Hard | 68 | 55 | 1 | 32 | 32 | 88 |

Hard mode allows a wider debt lane because the town faces more fiscal stress,
but it demands more visible agency across the run.

## Output

The runner writes a Markdown grading sheet:

```text
playwright-results/middletown-grading-sheet.md
```

The report includes:

- Final grade and pass/retry status
- Start and final core metrics
- RL action trace
- Project and policy trace
- Fun and agency section
- Event decision trace
- Runner metadata with start/final summaries and victory-screen visibility
- Difficulty gates used for that run
- Agent notes

The current verified 100-quarter run (2026-06-17) passed with an A 100/100,
50 visible agenda actions, 8 projects, 4 policies, and final metrics of budget
89, trust 94, services 99, and debt 65.

The current verified hard 100-quarter run (2026-06-17), seed
`bad-winter-full`, passed with an A 100/100, victory visible, and final metrics
of budget 55, trust 96, services 98, and debt 63. The hard run started at debt
22, so the +41 debt delta is an intentional stress scar rather than a perfect
ledger.

The seeded matrix adds three replayable browser samples:

- `normal-civic-a`: 36/36, PASS.
- `normal-civic-b`: 36/36, PASS.
- `hard-winter-a`: 64/64, PASS, budget 83 and debt 67 after the Bad Winter
  pressure window.

## Source Files

- `tests/playwright/rlPolicy.mjs`
- `tests/playwright/runMiddletownRlPlaytest.mjs`
- `tests/rl-policy.test.mjs`
