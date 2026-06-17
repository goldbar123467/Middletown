# Middletown 100-Item Fix Audit

Last updated: 2026-06-17.

Status key:

- `Done`: current code and tests provide direct evidence.
- `Partial`: implemented in part, but evidence is incomplete or the design still needs more work.
- `Open`: not yet implemented or not verified.

## Current Verification Evidence

- `npm run qa`: lint, Node tests, and build pass.
- `npm run test:browser`: browser UI, end states, and visual baselines pass.
- `npm run playtest:rl`: full 100-quarter run passes with A 100/100.
- `npm run playtest:rl:matrix`: seeded matrix passes two normal samples and one hard-mode Bad Winter sample.
- Hard 100-quarter RL proof: `middletown-grading-hard-100.md` passes A 100/100 with budget 55, trust 96, services 98, debt 63, and victory visible.
- Content regression proof: generated resident problems, generated Council/News events, event tradeoffs, midgame arcs, over-optimization events, and quarter reports are guarded by unit/data tests.

## Audit Table

| # | Requirement | Status | Current evidence / remaining work |
| ---: | --- | --- | --- |
| 1 | Make `Choices` affordable enough to use after Q6. | Done | Full RL run records 50 visible agenda actions, including late-game actions. |
| 2 | Add no-cost civic choices with political tradeoffs. | Done | `CIVIC_MICRO_ACTIONS` appear as Small Wins on `Choices`; each has budget 0 and a non-budget downside. |
| 3 | Add staff-time costs separate from budget costs. | Done | Agenda actions, policies, audits, budget cuts, and labor systems affect `labor`. |
| 4 | Lower early agenda action budget penalties. | Done | Reducer scales early agenda budget costs down. |
| 5 | Add small-win actions every quarter. | Done | `Choices` rotates two no-budget Small Wins every quarter. |
| 6 | Add risky big-swing actions for confident players. | Done | Risky agenda cards get `Risky swing` labels; projects and emergency declarations remain bigger plays. |
| 7 | Make RL safety floor less conservative. | Done | RL uses lower late floors and a civic-cushion risk rule. |
| 8 | Reward visible actions more strongly in RL policy. | Done | RL agency score and action bonuses reject passive wins. |
| 9 | Penalize skipping `Choices` too many quarters. | Done | No-agenda drift and passive grading failures exist. |
| 10 | Track quarters with no mayor agenda as public drift. | Done | `civicRecord.noAgendaStreak` and `passiveQuarters`. |
| 11 | Add boredom/drift pressure when mayor does nothing. | Done | `applyNoAgendaDrift` penalizes trust/services/media. |
| 12 | Make budget recovery slower after aggressive cuts. | Done | Debt floor, maintenance, hard contingency spending, and department-cut morale pressure slow clean recovery. |
| 13 | Make debt zero harder to maintain. | Done | Debt payoff floor keeps old debt from vanishing automatically. |
| 14 | Add debt service pressure when debt was recently high. | Done | `applyCapacityPressure` adds debt-service budget pressure. |
| 15 | Add operating budget volatility every year. | Done | `annualVolatility` in `cityEngine`. |
| 16 | Add revenue dips in Act 2. | Done | `actTwoRevenueDip` in `cityEngine`. |
| 17 | Add hard winter fiscal shock in Act 3. | Done | `hardWinterDrag` and hard-mode Bad Winter pressure. |
| 18 | Add late-game maintenance costs. | Done | `lateMaintenance` and deferred maintenance spend. |
| 19 | Add service decay if departments are underfunded. | Done | Lean department budgets reduce services/labor/trust. |
| 20 | Add trust decay if problems linger too long. | Done | Resident pressure effects penalize trust/media/services. |
| 21 | Cap passive trust gains near 85. | Done | Passive cap prevents autopilot trust above 85. |
| 22 | Cap passive service gains near 85. | Done | Passive cap limits services without capital work. |
| 23 | Require active choices to reach 95+ trust. | Done | Passive wins fail; visible action agency is required in grading and caps. |
| 24 | Require active projects to reach 95+ services. | Done | Services cap and project completion bonuses push active capital work. |
| 25 | Make final `99 trust / 99 services / 0 debt` rare. | Done | Latest full normal RL ends with budget 89, trust 94, services 99, debt 65. |
| 26 | Add difficulty-specific RL grading expectations. | Done | `rlPolicy.mjs` now uses easy/normal/hard gates for score, agency, budget, trust, services, and max debt; unit tests prove hard and normal judge the same high-debt run differently. |
| 27 | Make hard mode actually stress the 100-quarter run. | Done | Full hard 100-quarter RL seed `bad-winter-full` passes with budget 55, trust 96, services 98, debt 63, and visible victory; debt rises +41 under hard pressure. |
| 28 | Add good-enough victory separate from perfect victory. | Done | `The Good Enough Mayor` ending exists. |
| 29 | Add ending tiers based on play style. | Done | `endingForState` branches by passive, budget, public process, builder, services, neighborhood, etc. |
| 30 | Add passive administrator weak ending. | Done | `The Passive Administrator`. |
| 31 | Add public process mayor ending. | Done | `The Public Process Mayor`. |
| 32 | Add budget hawk ending. | Done | `The Budget Hawk`. |
| 33 | Add builder mayor ending. | Done | `The Builder of Middletown`. |
| 34 | Add services mayor ending. | Done | `The Services Mayor`. |
| 35 | Add neighborhood mayor ending. | Done | `The Neighborhood Mayor`. |
| 36 | Make achievements unlock with more ceremony. | Done | Achievement reactions now render as an `Achievement unlocked` notice with a distinct success treatment. |
| 37 | Add mid-campaign achievements around Q25/Q50/Q75. | Done | Quarter 25/50/75 achievements exist. |
| 38 | Add failure achievements for memorable bad calls. | Done | Passive, debt scare, and staff burnout achievements exist. |
| 39 | Add visible goal rewards, not just labels. | Done | Goal board displays rewards/progress. |
| 40 | Show goal progress changes after every quarter. | Done | Goal progress deltas are calculated. |
| 41 | Make `Anti-Pot Mayor` require project investment. | Done | Requires project-cleared potholes. |
| 42 | Make potholes worsen after storms. | Done | Winter storm damage adds potholes. |
| 43 | Add district-specific pothole backlogs. | Done | `districtPotholes` and map calls exist. |
| 44 | Add resident complaints tied to potholes. | Done | High pothole backlogs create named resident complaint reactions. |
| 45 | Add map feedback when potholes improve. | Done | Map shows open pothole calls and unified trust colors. |
| 46 | Make `The People's Mayor` require diverse problem types solved. | Done | Goal progress blends solved percentage with solved problem-type diversity; achievement requires diverse problem types. |
| 47 | Make resident problems affect district metrics while active. | Done | Active/stalled resident pressure affects city metrics. |
| 48 | Show the oldest unresolved resident problem. | Done | People tab now shows `Oldest Unresolved`. |
| 49 | Show the most urgent resident problem. | Done | People tab now shows `Most Urgent`. |
| 50 | Add named follow-up messages when problems solve. | Done | Solved problem reactions name residents and titles. |
| 51 | Add resident disappointment when problems stall. | Done | Stalled problem reactions exist. |
| 52 | Add recurring residents who return across acts. | Done | Residents return with named act-break reactions at Q25/Q50/Q75. |
| 53 | Connect residents to Council events. | Done | Event reactions select resident by event district/domain. |
| 54 | Connect residents to News events. | Done | News reactions use the same local resident selection. |
| 55 | Connect residents to map districts. | Done | Residents/problems carry district IDs; map uses district state/backlogs. |
| 56 | Replace generic resident problem text with authored local details. | Done | `localFlavor.js` feeds all 900 resident problems with district scenes, occupations, domain artifacts, practical asks, and flagship issues; data tests assert generated problem detail coverage. |
| 57 | Give each district a flagship issue. | Done | `DISTRICT_FLAGSHIP_ISSUES`. |
| 58 | Make Northside aging mains recur in multiple systems. | Done | Flagship issue, resident problems, projects/events reference Northside infrastructure. |
| 59 | Make East Bank flood risk recur in multiple systems. | Done | Flagship issue, events, projects, resident problems. |
| 60 | Make Southgate mall/mobility recur in multiple systems. | Done | Flagship issue, mobility actions/events/residents. |
| 61 | Make Westhaven health/heat readiness recur in multiple systems. | Done | Flagship issue, heat/winter/emergency content. |
| 62 | Make Midtown renters/library disruption recur in multiple systems. | Done | Flagship issue, residents, events, library/housing content. |
| 63 | Make University District student housing recur in multiple systems. | Done | Flagship issue, residents, events, projects. |
| 64 | Make Airport Industrial freight/workforce recur in multiple systems. | Done | Flagship issue, freight/workforce/economy content. |
| 65 | Make Downtown legitimacy/budget hearings recur in multiple systems. | Done | Flagship issue, opening events, budget/public process content. |
| 66 | Turn `Projects` into reducer-backed gameplay. | Done | `START_CAPITAL_PROJECT`, active/completed/failed projects. |
| 67 | Give projects costs, duration, risk, and payoff. | Done | Project data and civic operations update costs/duration/risk/payoff. |
| 68 | Let projects fail if neglected. | Done | Projects fail after repeated neglect. |
| 69 | Add project milestones every few quarters. | Done | Milestone reports/reactions. |
| 70 | Turn `Policies` into reducer-backed gameplay. | Done | `ADOPT_POLICY` and `REPEAL_POLICY`. |
| 71 | Give policies upkeep and side effects. | Done | Policy upkeep/quarter effects. |
| 72 | Let policies anger one group while helping another. | Done | Policy effects include tradeoffs and reaction copy. |
| 73 | Add policy repeal or amendment choices. | Done | Repeal action exists; amendment is not separately modeled. |
| 74 | Add department morale consequences to budget cuts. | Done | Budget cuts reduce labor and increase staff vacancies. |
| 75 | Add staff vacancies as a real pressure. | Done | Vacancies affect service/trust/budget through capacity pressure. |
| 76 | Add labor negotiations as Act 2/3 systems. | Done | Labor negotiation pressure runs in Act 2/3 windows. |
| 77 | Add council blocs with memory. | Done | `civicMemoryEngine` tracks bloc memory. |
| 78 | Make council members react to repeated patterns. | Done | Bloc memory affects event consequences/reactions. |
| 79 | Make news outlets remember past scandals. | Done | News outlet memory and public records pressure exist. |
| 80 | Add public records request events. | Done | Council and News packs now include dedicated public-record request cards/headlines. |
| 81 | Add audits as a budget/trust mechanic. | Done | `RUN_AUDIT` and UI button. |
| 82 | Add emergency declarations as rare high-pressure tools. | Done | `DECLARE_EMERGENCY` and UI button. |
| 83 | Make Council/News option text less templated. | Done | Generated Council/News events are exported through `enrichGeneratedCivicEvent`; tests reject the old generic option trio and generic description pattern. |
| 84 | Add stronger consequence copy after choices. | Done | Event outcomes append "Why this happened" memory lines. |
| 85 | Reduce repeated best-option-index patterns. | Done | Seeded random event selection and option scoring vary choices. |
| 86 | Add more event options where no answer is purely best. | Done | Generated Council/News options now receive mixed tradeoff effects; data tests assert every generated option carries a downside. |
| 87 | Add events that punish over-optimization. | Done | Authored over-optimization hearings/headlines plus `overOptimizationReport` punish clean ledgers, perfect dashboards, and repeated fast-response patterns. |
| 88 | Add visible why-this-happened explanations. | Done | `recordCivicEventChoice` appends explanations. |
| 89 | Improve quarter report prose. | Done | `enginePartReport` replaces generic engine-part report text with local district/department/domain prose; engine smoke rejects old generic report wording. |
| 90 | Make Chronicle easier to skim. | Done | Latest recap plus typed entries. |
| 91 | Add compact last-quarter-changed recap. | Done | Chronicle latest record card. |
| 92 | Add visual regression tests for title/start/tabs/map/victory. | Done | Browser screenshots checked against visual baselines; victory included. |
| 93 | Add browser tests for budget input reactions. | Done | UI smoke changes Mayor budget and waits for reaction. |
| 94 | Add browser tests for resident reaction visibility. | Done | UI smoke waits for Resident reaction. |
| 95 | Add browser tests for People problem progress. | Done | UI smoke checks People progress, oldest, and urgent panels. |
| 96 | Add browser tests for victory achievements. | Done | End-state browser smoke asserts `Century Mayor`, `The Anti-Pot Mayor`, and `The People's Mayor`. |
| 97 | Add bad-play RL runs that should fail. | Done | RL policy unit test rejects passive and debt-failure runs. |
| 98 | Add multiple seeded RL runs, not just one deterministic path. | Done | `playtest:rl:matrix` runs seeded normal and hard samples. |
| 99 | Add grading section for fun/agency, not only survival metrics. | Done | RL grading sheet includes Fun and Agency. |
| 100 | Keep the middle 60 quarters from becoming "press Council/News until victory." | Done | Full RL uses actions/projects/policies/audits/emergencies, and generated content now rotates Budget Markup, Labor and Records, Capital Queue, Bad Winter, and Long Memory arcs. |

## Beyond This 100-Item Audit

The 100 listed fixes are now marked `Done` with current code or test evidence.
Future polish can still go deeper:

1. Add strict pixel-diff golden screenshots once the UI stops moving.
2. Keep hand-authoring more named Council/News spotlight events beyond the catalog-driven local flavor layer.
3. Add more resident portraits and voice-log variants for late-game recurring residents.
