# Playwright Gameplay Testing

Use this when an agent needs to test or play Middletown through the browser.

## Start the App

From `middletown/`:

```bash
npm run dev -- --host 127.0.0.1 --port 5175
```

If Vite chooses another port, pass it to the runner:

```bash
$env:MIDDLETOWN_URL="http://127.0.0.1:5176/"
npm run playtest:rl
```

## Run the RL Playtest

```bash
npm run playtest:rl
```

The default run is the full 100-quarter campaign. Optional shorter smoke run:

```bash
$env:MIDDLETOWN_RL_TURNS="6"
npm run playtest:rl
```

Output:

```text
playwright-results/middletown-grading-sheet.md
```

Useful PowerShell overrides:

```bash
$env:MIDDLETOWN_RL_SEED="civic-a"
$env:MIDDLETOWN_RL_DIFFICULTY="hard"
$env:MIDDLETOWN_RL_OUTPUT="hard-seed.md"
npm run playtest:rl
```

## Run Seeded RL Matrix

```bash
npm run playtest:rl:matrix
```

The default matrix runs two normal seeded samples and one 64-quarter hard-mode
Bad Winter stress sample. Full seeded marathon:

```bash
$env:MIDDLETOWN_MATRIX_FULL="1"
npm run playtest:rl:matrix
```

Output:

```text
playwright-results/middletown-rl-matrix.md
playwright-results/middletown-grading-normal-civic-a.md
playwright-results/middletown-grading-normal-civic-b.md
playwright-results/middletown-grading-hard-winter-a.md
```

## Run Browser UI Smoke

```bash
npm run test:browser
```

This requires the dev server to be running. It checks title/start, tab
switching, budget reactions, resident reactions, project starts, policy
adoption, public audits, emergency declarations, map pothole feedback, People
progress, victory, game-over, and writes visual-baseline-checked screenshots to:

```text
playwright-results/ui-smoke-title.png
playwright-results/ui-smoke-town.png
playwright-results/ui-smoke-choices.png
playwright-results/ui-smoke-map.png
playwright-results/ui-smoke-victory.png
playwright-results/ui-smoke-gameover.png
```

## Run Standard QA

```bash
npm run qa
```

This runs lint, Node tests, and build. It does not run the browser playtest.

## What the Playtest Does

1. Opens the title screen.
2. Starts normal difficulty with `Mayor's Desk`.
3. Confirms the first-quarter tutorial and resident voice logs exist.
4. Uses the `Money` tab to right-size starter department budgets for survivability.
5. Uses the `Choices` tab to file an RL-selected agenda action when the budget
   is healthy enough.
6. Starts useful capital projects on a cadence.
7. Adopts standing policies when the city can afford upkeep.
8. Uses public audits on a cadence and rare emergency declarations during
   seasonal service pressure.
9. Runs the quarter.
10. Chooses the best visible Council and News options by reward score.
11. Advances quarters until the requested turn count finishes or victory is reached.
12. Writes the grading sheet with a `Fun and Agency` section and a victory
   visibility check.

The full RL run also writes:

```text
playwright-results/rl-victory.png
```

## Troubleshooting

- If the runner says Middletown is not reachable, start the Vite server or set
  `MIDDLETOWN_URL`.
- If the runner says Playwright is unavailable, run from the parent workspace
  where Playwright is installed or install Playwright locally.
- If no browser launches, install Playwright browsers or ensure Microsoft Edge
  or Chrome is installed.
- If the grade is `RETRY`, open the grading sheet and inspect which metric
  collapsed.
