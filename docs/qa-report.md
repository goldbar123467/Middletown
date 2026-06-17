# Middletown QA Report

Last QA pass: 2026-06-17.

## Automated Checks

- `npm run test` now runs every `tests/*.test.mjs` file through
  `tests/run-tests.mjs`.
- `tests/engine-smoke.test.mjs` covers start, one agenda action, quarter
  simulation, local quarter report prose, council resolution, news response,
  and quarter advancement.
- `tests/data-contracts.test.mjs` checks unique IDs, known department and
  district references, known metric effect keys, event option shape, content
  volume floors, metric bounds, tab IDs, generated resident problem detail,
  generated Council/News local copy, event tradeoff coverage,
  over-optimization events, midgame arc labels, and reducer action registry
  coverage.
- `tests/reducer-regression.test.mjs` checks difficulty starts, metric clamps,
  invalid action no-ops, management-only guards, event phase progression,
  cleanup when advancing quarters, and victory at `MAX_TURNS`.
- `tests/campaign-regression.test.mjs` checks the 100-quarter campaign length,
  first-year survival, every-resident problem generation, visible reactions,
  reducer-backed projects and policies, public audits, emergency declarations,
  council/news memory, budget-cut staff morale, Act 2/3 labor negotiations,
  passive-play failure, debt-controlled active 100-quarter victory, and
  reachable `Anti-Pot Mayor` / `The People's Mayor` achievements.
- `tests/rl-policy.test.mjs` checks the RL reward parser, scoring, grading
  output, difficulty-specific pass gates, the debt-control pass gate, and
  rejection of passive 100-quarter wins.
- `tests/playwright/uiSmoke.mjs` is a browser smoke/visual artifact check for
  title/start, tabs, budget reactions, resident reactions, project starts,
  policy adoption, public audits, emergency declarations, map pothole feedback,
  and People progress. It now checks screenshots against visual baselines for
  title, Town, Choices, and Map.
- `tests/playwright/endStateSmoke.mjs` verifies dev-only victory and game-over
  browser scenarios and checks both screenshots against visual baselines.
- `tests/playwright/runMiddletownRlPlaytest.mjs` plays the full 100-quarter
  browser campaign, uses agenda actions, projects, policies, audits, and rare
  emergency declarations, writes a difficulty-aware grading sheet, and
  screenshots victory.
- `tests/playwright/runRlMatrix.mjs` runs multiple seeded RL paths, including
  a hard-mode Bad Winter stress sample.

## Manual Browser Inspection

Inspected `http://127.0.0.1:5175/` with Playwright using the system Edge
browser after the dark-mode simplification pass.

- Title screen presents the civic premise clearly and offers three difficulties.
- Normal start lands in management with a dark red/black/white shell, four top
  metrics, six simple tabs (`Town`, `Choices`, `Money`, `Map`, `People`, `Log`),
  and a bottom `Run Quarter` action.
- The `Town` screen shows campaign goals and latest resident reactions. The
  `People` tab shows active resident problems and progress instead of a static
  quote wall.
- The `Choices` screen now rotates agenda actions and exposes capital projects
  and standing policies as playable choices. It also exposes compact oversight
  tools for public audits and emergency declarations.
- The `Map` tab shows unified trust colors and district pothole calls so
  street-repair progress is visible.
- The first-quarter tutorial appears as a resident/city-hall popup, and the
  Town screen shows resident voice logs plus a three-step pick-up-and-play guide.
- The full district map is no longer on the default Town screen; it is isolated
  behind the `Map` tab to reduce first-screen clutter.
- Simulating a quarter forces the Chronicle cockpit, disables normal tab
  browsing, shows inline metric deltas, presents a council event with three
  choices, and appends public-record entries with "why this happened" memory
  lines.
- Browser console showed no page errors during the inspected title, start,
  tutorial, tab-switching, and Map-tab path.

## Verification Commands

Run before completion claims:

```bash
npm run lint
npm run test
npm run build
npm run test:browser
npm run playtest:rl
```

`npm run qa` remains the combined gate for lint, tests, and build. `npm run
test:browser` and `npm run playtest:rl` are browser gates and require the dev
server at `http://127.0.0.1:5175/`.

Latest full verification on 2026-06-17:

- `npm run qa`: pass.
- `npm run test:browser`: pass in Microsoft Edge, including visual baselines
  and victory/game-over end states.
- `npm run playtest:rl`: pass, A 100/100, 100/100 quarters.
- `npm run playtest:rl:matrix`: pass, two normal seeded 36-quarter samples and
  one hard seeded 64-quarter Bad Winter stress sample.
- Final RL summary: budget 89, trust 94, services 99, debt 65.
- Full hard RL evidence: seed `bad-winter-full`, pass, A 100/100, 100/100
  quarters, budget 55, trust 96, services 98, debt 63, victory visible.
- Content evidence: all 100 audit rows are now `Done`; generated resident
  problems use local detail templates, generated Council/News options reject
  the old generic trio, every generated option has a downside, and quarter
  reports reject old generic engine-part prose.
- Agency evidence: 50 visible agenda actions, 8 projects, 4 policies, and
  victory screen visible.
- Screenshot artifacts written: `ui-smoke-title.png`, `ui-smoke-town.png`,
  `ui-smoke-choices.png`, `ui-smoke-map.png`, `ui-smoke-victory.png`,
  `ui-smoke-gameover.png`, and `rl-victory.png`.
- Seeded matrix evidence: normal seeds `civic-a` and `civic-b` both passed
  36/36; hard seed `bad-winter-a` passed 64/64 with budget 83 and debt 67,
  proving hard mode has meaningful fiscal stress without immediate collapse.
- Difficulty gates are no longer shared: normal keeps a max debt of 70, while
  hard permits debt up to 88 only with a higher long-run agency score.

## Current Gaps

- The browser UI smoke now compares against visual baselines, but the baseline
  is dimension/byte-range based rather than a strict pixel-diff image golden.
- `ACTION_TYPES` still lists many future interactions that the reducer does not
  yet handle, such as service cases, bonds, utility rates, parking policy, and
  many detailed service-level controls.
- The first four quarters are covered by regression tests, and the RL runner
  verifies a full 100-quarter win. Future tuning should focus on stronger
  authored copy for the memory hooks rather than adding more first-screen
  complexity.
- Build output is code-split and currently passes without a Vite chunk warning.
  `ResidentsTab` is still the largest lazy chunk, so it should stay on the QA
  watchlist or eventually load a smaller playable resident slice.
- The raw archive files still contain generated source material, but exported
  playable content now passes through local flavor and tradeoff enrichment.
  Future polish should add more named spotlight events rather than returning
  to generic generation.
