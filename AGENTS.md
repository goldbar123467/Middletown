# AGENTS.md

This file is the frozen project operating manual for Codex agents working in
Middletown.

## Project

Middletown is a local-government simulation about running a Midwestern city of
100,000 people. The player is the mayor. They manage budgets, departments,
districts, public trust, infrastructure, housing, safety, services, labor,
business confidence, environmental resilience, and citizen patience across a
mayoral term.

Stack:

- React 19
- Vite 7
- Tailwind CSS 4
- Plain JavaScript only
- One reducer as the source of truth
- Pure engine functions
- Data-driven civic actions, events, residents, and narrative beats

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:browser
npm run playtest:rl
npm run playtest:rl:matrix
npm run qa
```

## Frozen Agent Team

Every sub-agent uses model `gpt-5.5`, reasoning effort `xhigh`, and priority
service tier when available.

### Orchestrator

Owns integration, final architecture, verification, and comparison against The
Lord's Ledger.

### Agent 1: Engine Cartographer

Frozen scope: `src/engine/`, reducer flow, simulation math, invariants, action
handling, civic memory, and engine-part orchestration.

### Agent 2: Data Systems Archivist

Frozen scope: `src/data/` and `docs/gameplay-story.md`. Owns narrative,
residents, events, civic actions, departments, districts, and content schemas.

### Agent 3: Interface Flow Mapper

Frozen scope: `src/App.jsx`, `src/components/`, and `src/index.css`. Owns
the dashboard, tabs, event cockpit, city map, readability, and municipal polish.

### Agent 4: QA and Refactor Steward

Frozen scope: `tests/`, `docs/qa-report.md`, and polish comparison docs.
Owns smoke tests, engine checks, build/lint verification, and the Lord's Ledger
comparison checklist.

## Mental Model

Middletown uses the Lord's Ledger loop in civic form:

```text
title
  -> management
  -> council_session
  -> city_resolve
  -> news_event
  -> citizen_response
  -> management
  -> victory or game_over
```

The reducer owns persistent state. The engine computes quarterly consequences.
The data layer describes the town. The UI displays the civic dashboard and
dispatches actions.

`src/engine/civicOperationsEngine.js` owns reducer-backed capital projects,
standing policies, public-work drift, debt restructuring pressure, audits, and
emergency declarations. Projects and policies are playable from the `Choices`
screen so the simplified six-tab UI stays intact.

`src/engine/civicMemoryEngine.js` owns the cross-quarter public memory model:
Council blocs, news outlets, repeated district mentions, repeated domain
mentions, public-records pressure, and the "why this happened" lines appended
to event outcomes.

`src/engine/cityEngine.js` owns the broad 90-part civic heartbeat plus fiscal
friction. Debt payoff should remain possible but not automatic; strong runs
should still feel budget tension from debt service, maintenance, labor, records,
public expectations, and Bad Winter contingency spending.

## Quality Bar

Middletown should feel as polished as The Lord's Ledger:

- clear phase flow
- meaningful tradeoffs
- readable resource deltas
- dense but understandable tabs
- narrative consequences in the chronicle
- agency across the 100-quarter campaign, not passive Council/News coasting
- public audits, emergency declarations, labor negotiations, and records
  pressure visible as simple civic tools or quarter consequences
- `src/data/localFlavor.js` is the preferred seam for upgrading generated
  resident, Council/News, and quarter-report copy with local-government
  specificity and tradeoffs
- no artificial line padding in logic
- large content volume belongs in data and story files
- lint, build, and tests must pass before completion claims
- `npm run test:browser` must cover visual baselines plus victory and game-over
  routes when UI/end-state behavior changes
- `npm run playtest:rl:matrix` should be used when randomness, difficulty, or
  long-run balance changes
- RL grading is difficulty-specific: normal keeps stricter debt control, while
  hard permits higher debt only with stronger long-run agency. Current hard
  100-quarter proof is seed `bad-winter-full`, A 100/100, victory visible,
  final budget 55, trust 96, services 98, debt 63.
