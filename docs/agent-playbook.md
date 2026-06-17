# Middletown Agent Playbook

This guide is for agents that need to navigate, test, or play Middletown without
rediscovering the UI.

## Start

1. Start the dev server from `middletown/`:

   ```bash
   npm run dev -- --host 127.0.0.1 --port 5175
   ```

2. Open `http://127.0.0.1:5175/`.
3. Choose `Mayor's Desk` for the normal difficulty.
4. In quarter 1, use at least one resident voice log. You may close the
   tutorial popup after confirming it appears.

## Main Loop

The player loop is intentionally simple:

1. Read the four top signals: `Operating Budget`, `Public Trust`,
   `Service Quality`, and `Debt Burden`.
2. Use `Money` early to keep starter department budgets sustainable.
3. Use `Choices` to file visible agenda actions when the budget can afford it.
   Use `Small Wins` when the town needs a move that costs staff time or
   political patience instead of operating budget.
4. Use `Choices` to start capital projects, adopt standing policies, run public
   audits, or declare rare emergencies.
5. Press `Run Quarter`.
6. During Council or News events, pick the option with the best visible effects:
   improve trust/services/budget and avoid debt.
7. Press `Advance Quarter`.

## Tabs

- `Town`: first stop. Shows resident voice logs, quick play instructions, and
  the four key signals.
- `Choices`: best place to make a quarter action. File agenda moves, start a
  capital project, or adopt a policy, then run the quarter.
- `Money`: short budget controls for the starter departments.
- `Map`: district condition view. Use when trust/service load needs context.
- `People`: resident sample. Use for flavor and priorities.
- `Log`: public record of actions, events, and quarter reports.

## Good Play

Good play is not maximizing every stat. Good play keeps the town stable:

- The full win target is 100 quarters.
- Public Trust should not collapse.
- Service Quality should not collapse.
- Debt Burden should not climb without a visible service reason.
- Operating Budget should stay above zero.
- The agent should make visible choices before running quarters.
- The agent should skip extra agenda spending when budget drops below the
  safety floor.
- The agent should use audits when records pressure or public confusion builds.
- The agent should reserve emergency declarations for real service/weather
  pressure because they add debt and scrutiny.
- Ongoing projects and policies count as public work, but passive wins now fail
  the RL agency gate.
- Long-run achievements include `Century Mayor`, `The Anti-Pot Mayor`, and
  `The People's Mayor`.

## Fast Agent Command

Run the automated RL-style playtest:

```bash
npm run playtest:rl
```

The command writes:

```text
playwright-results/middletown-grading-sheet.md
```
