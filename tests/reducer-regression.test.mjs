import assert from "node:assert/strict";
import { MAX_TURNS } from "../src/config/cityConfig.js";
import { DEPARTMENTS } from "../src/data/departments.js";
import { METRIC_CONFIG } from "../src/data/metrics.js";
import { gameReducer, initialState } from "../src/engine/gameReducer.js";

function dispatch(state, type, payload) {
  return gameReducer(state, { type, payload });
}

function assertMetricsInsideBounds(state, label) {
  for (const [key, config] of Object.entries(METRIC_CONFIG)) {
    const value = state.metrics[key];
    assert.equal(typeof value, "number", `${label}: ${key} should be numeric`);
    assert.ok(Number.isFinite(value), `${label}: ${key} should be finite`);
    assert.ok(value >= config.min, `${label}: ${key} should stay above ${config.min}`);
    assert.ok(value <= config.max, `${label}: ${key} should stay below ${config.max}`);
  }
}

for (const difficulty of ["easy", "normal", "hard"]) {
  const state = dispatch(initialState, "START_GAME", { difficulty });
  assert.equal(state.phase, "management");
  assert.equal(state.difficulty, difficulty);
  assert.equal(state.turn, 1);
  assert.equal(state.quarter, "Spring");
  assert.equal(state.year, 1);
  assert.equal(state.activeTab, "dashboard");
  assert.equal(state.chronicle.length, 1);
  assert.equal(state.tutorial.active, true, "new games should begin with first-quarter orientation active");
  assert.equal(state.tutorial.completed, false, "first-quarter orientation should not start completed");
  assert.equal(state.tutorial.index, 0, "first-quarter orientation should begin at the first resident voice log");
  assertMetricsInsideBounds(state, `${difficulty} start`);
}

let state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
state = dispatch(state, "TUTORIAL_NEXT");
assert.equal(state.tutorial.index, 1, "tutorial next should advance the briefing");
state = dispatch(state, "TUTORIAL_PREV");
assert.equal(state.tutorial.index, 0, "tutorial previous should rewind the briefing");
state = dispatch(state, "TUTORIAL_OPEN_STEP", { index: 3 });
assert.equal(state.tutorial.index, 3, "tutorial can open a specific voice log");
state = dispatch(state, "TUTORIAL_SKIP");
assert.equal(state.tutorial.active, false, "tutorial skip should dismiss the orientation");
assert.equal(state.tutorial.completed, true, "tutorial skip should mark the orientation completed");
state = dispatch(state, "PLAY_AGAIN", { difficulty: "normal" });
const invalidActionState = dispatch(state, "EXECUTE_CIVIC_ACTION", { actionId: "missing-action" });
assert.equal(invalidActionState, state, "unknown civic action should be ignored");

const firstDepartment = DEPARTMENTS[0];
const beforeBudgetReactions = state.reactions.length;
state = dispatch(state, "SET_DEPARTMENT_BUDGET", { departmentId: firstDepartment.id, budget: -100 });
assert.equal(state.departments[firstDepartment.id].budget, 0, "department budgets clamp at zero");
assert.ok(state.reactions.length > beforeBudgetReactions, "budget choices should create an immediate resident reaction");
assert.equal(state.reactions[0].type, "budget", "budget reaction should be visible as budget feedback");

state = dispatch(state, "SIMULATE_QUARTER");
assert.ok(["council_session", "city_resolve", "game_over", "victory"].includes(state.phase));
assertMetricsInsideBounds(state, "after simulation");

const blockedBudgetState = dispatch(state, "SET_DEPARTMENT_BUDGET", { departmentId: firstDepartment.id, budget: 12 });
assert.equal(blockedBudgetState, state, "budget edits should be blocked outside management");

const blockedAgendaState = dispatch(state, "EXECUTE_CIVIC_ACTION", { actionId: "action_001" });
assert.equal(blockedAgendaState, state, "agenda actions should be blocked outside management");

if (state.phase === "council_session") {
  state = dispatch(state, "SELECT_COUNCIL_OPTION", { optionIndex: 0 });
}
assert.equal(state.phase, "city_resolve");
assertMetricsInsideBounds(state, "after council");

state = dispatch(state, "CONTINUE_TO_NEWS");
assert.ok(["news_event", "citizen_response"].includes(state.phase));
if (state.phase === "news_event") {
  state = dispatch(state, "SELECT_NEWS_RESPONSE", { optionIndex: 1 });
}
assert.equal(state.phase, "citizen_response");
assertMetricsInsideBounds(state, "after news");

state = dispatch(state, "ADVANCE_QUARTER");
assert.equal(state.phase, "management");
assert.equal(state.turn, 2);
assert.equal(state.quarter, "Summer");
assert.equal(state.year, 1);
assert.equal(state.activeTab, "dashboard");
assert.equal(state.tutorial.active, false, "orientation should be gone after the first quarter");
assert.equal(state.tutorial.completed, true, "orientation should be completed after the first quarter");
assert.equal(state.currentCouncilEvent, null);
assert.equal(state.currentNewsEvent, null);
assert.deepEqual(state.resourceDeltas, {});

const victoryReady = {
  ...state,
  phase: "management",
  turn: MAX_TURNS + 1,
};
const victoryState = dispatch(victoryReady, "SIMULATE_QUARTER");
assert.equal(victoryState.phase, "victory", "management simulation after MAX_TURNS should end in victory");

console.log("reducer regression test passed");
