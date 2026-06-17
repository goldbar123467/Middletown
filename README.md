# Middletown

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=111111)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=ffffff)
![JavaScript](https://img.shields.io/badge/JavaScript-plain-efd81d?logo=javascript&logoColor=111111)
![Playwright](https://img.shields.io/badge/Playwright-tested-2ead33?logo=playwright&logoColor=ffffff)
![Status](https://img.shields.io/badge/status-playable-success)
![QA](https://img.shields.io/badge/QA-lint%20%7C%20tests%20%7C%20build-blue)
![Game](https://img.shields.io/badge/game-local%20government%20strategy-b11226)

**Middletown** is a browser-based local government strategy game about running
a mid-sized Midwestern town of 100,000 people.

You are the mayor. Every quarter, you manage budgets, city departments,
district backlogs, council politics, headlines, residents, long-term projects,
public trust, service quality, and debt pressure. The goal is not to create a
perfect spreadsheet. The goal is to leave Middletown with a public record that
residents can actually feel.

## Tags

`browser-game` `local-government` `civic-sim` `strategy-game`
`react` `vite` `playwright` `reducer-state-machine` `rl-playtest`
`dark-mode` `municipal-budget` `narrative-simulation`

## Gameplay

Middletown is played across **100 quarters**, a 25-year mayoral career.

Each quarter asks you to make practical city choices:

- File visible mayoral actions in the **Choices** tab.
- Adjust department funding in **Money**.
- Start capital projects that take several quarters to finish.
- Adopt standing policies with recurring upkeep and side effects.
- Answer Council events and News headlines.
- Watch named residents react to wins, stalls, and failures.
- Keep debt useful but dangerous instead of letting it become a free number.
- Survive hard fiscal/weather pressure without turning government into drift.

The first four quarters work as an in-game tutorial. Residents, staff, popups,
and voice-log style introductions teach the player what City Hall can do.

## What Makes It Work

Middletown is built around a reducer-driven civic engine:

- **90 civic engine parts** move city metrics every quarter.
- A single reducer owns persistent game state and phase flow.
- Data files define departments, districts, events, residents, projects,
  policies, achievements, goals, and narrative beats.
- Council and News events remember repeated patterns through a public-record
  memory system.
- Residents begin with problems that take 10-50 quarters to solve over time.
- Achievements reward different mayor styles, including:
  - **Century Mayor**: win the full 100-quarter career.
  - **The Anti-Pot Mayor**: clear the townwide pothole backlog.
  - **The People's Mayor**: solve every resident problem.
  - **Budget Grown-Up**: control fiscal pressure without breaking services.
  - **Hands-On Mayor**: keep filing visible public actions.

## Main Systems

| System | What It Does |
| --- | --- |
| Civic Engine | Runs the 90-part quarterly simulation backbone. |
| Budget Engine | Turns department funding into staffing, service, and fiscal pressure. |
| Civic Operations | Advances projects, policies, audits, emergencies, drift, records pressure, labor negotiations, and over-optimization backlash. |
| Civic Memory | Tracks Council blocs, news outlets, public records, repeated districts, repeated domains, and "why this happened" explanations. |
| Resident Problems | Gives every resident a local problem with progress over time. |
| Campaign Engine | Updates goals, achievements, potholes, endings, recurring residents, and resident reactions. |
| RL Playtest Harness | Uses Playwright to play full campaigns and generate a grading sheet. |

## UI

The game uses a dark local-government aesthetic with Middletown's civic colors:
white, red, and black. The interface is intentionally pick-up-and-play:

- **Town**: goals, current quarter, resident reactions, and latest civic story.
- **Choices**: small wins, agenda actions, projects, policies, audits, and
  emergency declarations.
- **Money**: department budget sliders and fiscal tension.
- **Map**: district trust, potholes, and local backlogs.
- **People**: resident problem progress, oldest unresolved case, and most
  urgent case.
- **Log**: chronicle, Council events, News events, and quarter reports.

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Plain JavaScript
- Reducer-driven state
- Playwright browser automation
- No external state manager

## Run Locally

```bash
npm install
npm run dev
```

Vite starts the local app. The browser test harness expects:

```text
http://127.0.0.1:5175/
```

If needed, start that exact port:

```bash
npm run dev -- --host 127.0.0.1 --port 5175
```

## Commands

```bash
npm run dev                 # Start Vite
npm run lint                # ESLint
npm run test                # Node regression/data/engine/RL policy tests
npm run test:browser        # Playwright UI and end-state smoke tests
npm run build               # Production build
npm run qa                  # lint + test + build
npm run playtest:rl         # Full 100-quarter Playwright RL playthrough
npm run playtest:rl:matrix  # Seeded normal/hard RL matrix
npm run lines               # Count project lines
```

## QA Evidence

Latest local verification:

- `npm run qa`: pass
- `npm run test:browser`: pass in Microsoft Edge
- `npm run playtest:rl`: pass, 100/100 quarters, A 100/100
- Hard 100-quarter RL seed `bad-winter-full`: pass, A 100/100
- `npm run playtest:rl:matrix`: pass
- `npm run lines`: 100,147 lines

Current normal 100-quarter RL finish:

```text
Budget 89 | Trust 94 | Services 99 | Debt 65
```

Current hard 100-quarter RL finish:

```text
Budget 55 | Trust 96 | Services 98 | Debt 63
```

## Project Layout

```text
src/
  components/      UI tabs, dashboard, event screens, victory/game-over
  config/          Difficulty and game configuration
  data/            Departments, districts, actions, events, residents, projects
  engine/          Reducer, civic engine, budget, memory, campaign logic
tests/
  playwright/      Browser UI, end-state, RL playtest, matrix harness
  *.test.mjs       Node regression, data, engine, and RL policy tests
docs/
  100-item-fix-audit.md
  rl-grading-sheet.md
  qa-report.md
  agent-playbook.md
```

## Design Notes

Middletown is meant to feel like local government, not a fantasy economy with
new labels. Good play requires tradeoffs:

- A balanced budget can still anger residents if nothing visible changes.
- Fast action can solve a problem and exhaust city staff.
- Public process can build trust and slow delivery.
- High services and trust can create higher public expectations.
- Debt can buy capacity, but it comes back through service pressure and public
  scrutiny.

That tension is the point. The player should feel wins immediately, feel
failures clearly, and understand why residents reacted the way they did.
