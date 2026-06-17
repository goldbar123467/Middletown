# Lord's Ledger Polish Comparison

Middletown successfully borrows the core Lord's Ledger pattern without cloning
the medieval layer. The player gets a concrete role, a resource dashboard, a
turn button, interrupts, public consequences, and a chronicle-style record.

## What Already Matches

- **Clear loop:** title to management to council session to city resolve to news
  event to citizen response to the next quarter.
- **Concrete resources:** the simplified HUD keeps budget, trust, services, and
  debt visible immediately, while the deeper civic metrics still drive the
  engine underneath.
- **Data-driven pressure:** the 90-part city engine and large civic action/event
  packs give the game the same data-heavy backbone as Lord's Ledger.
- **Guided opening:** the first quarter now has resident voice logs and City
  Hall popups so the player meets characters before learning systems.
- **Long campaign:** Middletown now targets a 100-quarter mayoral career with
  first-year survival tests, resident problems, and achievement goals.
- **Resident progression:** every resident in the 900-person dataset starts
  with a problem that progresses and can be solved over time.
- **Playable project/policy layer:** capital projects and standing policies now
  have reducer-backed costs, upkeep, milestones, failures, and public reactions.
- **Civic pressure tools:** public audits, emergency declarations, labor
  negotiations, records pressure, and staff-vacancy consequences now turn
  municipal process into playable pressure.
- **Agency-aware RL:** the 100-quarter playtest now rejects passive wins and
  records agenda actions, projects, policies, audits, emergency declarations,
  and agency score. A seeded matrix now replays multiple event paths, including
  a hard-mode Bad Winter stress sample.
- **Event cockpit:** quarter interrupts force the player into Chronicle, disable
  tab browsing, and ask for a visible decision.
- **Public memory:** council choices, news responses, repeated district/domain
  attention, bloc memory, news-outlet memory, and engine reports flow into the
  public record.
- **Genre translation:** raids and seasonal medieval incidents are replaced by
  council politics, headlines, neighborhood stress, and resident memory.

## Where Lord's Ledger Is Still Ahead

- **System depth:** Lord's Ledger still has more mature subsystem variety and
  more hand-polished copy in its deeper tabs. Middletown now has interactive
  budget, council, resident-problem, goal, achievement, project, and policy
  surfaces.
- **Implemented action breadth:** Middletown's `ACTION_TYPES` file names a much
  wider future game than the reducer currently supports.
- **Classroom readability:** Middletown is now calmer and more pick-up-and-play
  on the surface, but some engine/event text still feels templated.
- **Progression confidence:** Middletown now has a verified 100-quarter RL win
  with 50 visible agenda actions, 8 projects, 4 policies, and a visible victory
  screen. The middle years have mechanical pressure hooks; they still need more
  hand-authored copy so repeated arcs feel less generated.
- **QA maturity:** Lord's Ledger has broader Playwright/PWA hooks. Middletown
  now has Node engine/data tests, browser UI/end-state smoke scripts,
  dimension/byte-range visual baselines, a full 100-quarter RL browser
  playtest, and a seeded RL matrix.
- **Delivery polish:** Middletown now uses a dark six-tab surface and code-split
  tab content, but the resident data chunk is still large enough to watch as
  content grows.

## Polish Checklist

- Add pixel-baseline visual comparison for the browser smoke screenshots.
- Replace the current dimension/byte-range visual baselines with strict
  pixel-diff goldens when the UI stabilizes.
- Add a balance fixture that verifies a reasonable student path can survive at
  least the first year on normal.
- Replace generated-sounding engine/action/event lines with a smaller number of
  higher-signal, classroom-readable reports and recurring civic arcs.
- Keep large content packs lazy-loaded by tab or event phase as the data grows.
- Keep the default Town screen simple; move optional detail to secondary tabs
  instead of adding more first-screen panels.
- Keep the Lord's Ledger comparison focused on polish parity, not feature
  parity. Civic equivalents should carry the same function even when the theme
  differs.
