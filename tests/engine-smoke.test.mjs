import assert from "node:assert/strict";
import { gameReducer, initialState } from "../src/engine/gameReducer.js";
import { CIVIC_ACTIONS } from "../src/data/civicActions.js";
import { ENGINE_PARTS } from "../src/data/engineParts.js";
import { METRIC_CONFIG } from "../src/data/metrics.js";
import { setDepartmentBudget } from "../src/engine/budgetEngine.js";
import { runCityEngine } from "../src/engine/cityEngine.js";
import { applyMetricEffects, clampMetrics } from "../src/engine/metricEngine.js";

function dispatch(state, type, payload) {
  return gameReducer(state, { type, payload });
}

function test(name, fn) {
  fn();
  console.log("ok - " + name);
}

test("starts a normal mayoral term with the 90-part civic engine intact", () => {
  const state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  assert.equal(state.phase, "management");
  assert.equal(state.metrics.population, 100000);
  assert.ok(ENGINE_PARTS.length >= 90, "engine has at least 90 parts");
  assert.ok(CIVIC_ACTIONS.length >= 90, "civic action list has at least 90 actions");
});

test("normalizes unknown difficulty ids to the normal ruleset", () => {
  const state = dispatch(initialState, "START_GAME", { difficulty: "impossible" });
  assert.equal(state.difficulty, "normal");
  assert.equal(state.metrics.budget, initialState.difficultyConfig.startingBudget);
});

test("runs the management to citizen response phase flow", () => {
  let state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const budgetBefore = state.metrics.budget;
  state = dispatch(state, "EXECUTE_CIVIC_ACTION", { actionId: CIVIC_ACTIONS[0].id });
  assert.equal(state.phase, "management");
  assert.notEqual(state.metrics.budget, budgetBefore);
  assert.ok(state.chronicle.length >= 2);

  state = dispatch(state, "SIMULATE_QUARTER");
  assert.ok(["council_session", "city_resolve", "game_over", "victory"].includes(state.phase));
  if (state.phase === "council_session") {
    state = dispatch(state, "SELECT_COUNCIL_OPTION", { optionIndex: 0 });
  }
  assert.equal(state.phase, "city_resolve");
  state = dispatch(state, "CONTINUE_TO_NEWS");
  if (state.phase === "news_event") {
    state = dispatch(state, "SELECT_NEWS_RESPONSE", { optionIndex: 1 });
  }
  assert.equal(state.phase, "citizen_response");
  state = dispatch(state, "ADVANCE_QUARTER");
  assert.ok(["management", "victory"].includes(state.phase));
});

test("ignores malformed department budget writes", () => {
  const state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const withUnknownDepartment = setDepartmentBudget(state.departments, "ghostDepartment", 20);
  assert.equal(Object.hasOwn(withUnknownDepartment, "ghostDepartment"), false);

  const withBadBudget = setDepartmentBudget(state.departments, "finance", Number.NaN);
  assert.equal(withBadBudget.finance.budget, state.departments.finance.budget);
});

test("metric helpers keep metrics finite and schema-shaped", () => {
  const state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const clamped = clampMetrics({ ...state.metrics, trust: 999, ghostMetric: 12 });
  assert.equal(clamped.trust, METRIC_CONFIG.trust.max);
  assert.equal(Object.hasOwn(clamped, "ghostMetric"), false);

  const affected = applyMetricEffects(state.metrics, {
    trust: 999,
    budget: Number.NaN,
    ghostMetric: 12,
  });
  assert.equal(affected.trust, METRIC_CONFIG.trust.max);
  assert.equal(affected.budget, state.metrics.budget);
  assert.equal(Object.hasOwn(affected, "ghostMetric"), false);
});

test("city engine output remains finite and bounded after all engine parts run", () => {
  const state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const result = runCityEngine({
    ...state,
    metrics: { ...state.metrics, ghostMetric: 42 },
  });
  for (const [key, config] of Object.entries(METRIC_CONFIG)) {
    assert.equal(Number.isFinite(result.metrics[key]), true, key + " should be finite");
    assert.ok(result.metrics[key] >= config.min, key + " should be above min");
    assert.ok(result.metrics[key] <= config.max, key + " should be below max");
  }
  assert.equal(Object.hasOwn(result.metrics, "ghostMetric"), false);
  assert.ok(result.reports.length > 0);
  assert.ok(result.reports.every((line) => !/Part \d+ watches|visible dashboard movement/i.test(line)), "reports should use local quarter prose");
});

test("hard mode adds visible annual stress beyond normal pressure", () => {
  const normal = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const hard = {
    ...dispatch(initialState, "START_GAME", { difficulty: "hard" }),
    turn: 4,
    quarter: "Winter",
  };
  const normalResult = runCityEngine({ ...normal, turn: 4, quarter: "Winter" });
  const hardResult = runCityEngine(hard);

  assert.ok(hardResult.metrics.budget < normalResult.metrics.budget, "hard mode should create stronger fiscal stress");
  assert.ok(hardResult.metrics.debt >= hard.metrics.debt, "hard mode should make debt harder to erase");
  assert.ok(hardResult.reports.some((line) => line.includes("Bad Winter difficulty")), "hard stress should be visible in reports");
});

console.log("engine smoke test passed");
