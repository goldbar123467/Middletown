import assert from "node:assert/strict";
import { CIVIC_ACTIONS } from "../src/data/civicActions.js";
import {
  chooseAgendaAction,
  gradePlaythrough,
  parseMetricText,
  scoreTransition,
  summarizeMetrics,
} from "../tests/playwright/rlPolicy.mjs";

const startingMetrics = {
  budget: 118,
  trust: 54,
  services: 58,
  debt: 22,
  safety: 60,
  infrastructure: 55,
  housing: 52,
};

const strainedMetrics = {
  budget: 76,
  trust: 39,
  services: 42,
  debt: 44,
  safety: 47,
  infrastructure: 45,
  housing: 41,
};

const action = chooseAgendaAction({
  metrics: strainedMetrics,
  availableActions: CIVIC_ACTIONS.slice(0, 12),
  usedActionIds: new Set(),
});

assert.ok(action, "policy should choose an action");
assert.ok(CIVIC_ACTIONS.some((candidate) => candidate.id === action.id), "chosen action should come from available game data");
assert.ok(action.reason.length > 10, "chosen action should explain the move");
assert.ok(action.expectedReward > 0, "chosen action should have positive expected reward for a strained town");

const summary = summarizeMetrics(startingMetrics);
assert.equal(summary.money, 118, "summary should expose money");
assert.equal(summary.trust, 54, "summary should expose trust");
assert.equal(summary.services, 58, "summary should expose services");
assert.equal(summary.debt, 22, "summary should expose debt");

assert.deepEqual(
  parseMetricText("Operating Budget118"),
  { budget: 118 },
  "metric parser should handle compact Playwright text",
);
assert.deepEqual(
  parseMetricText("Public Trust\n54"),
  { trust: 54 },
  "metric parser should handle newline-separated Playwright text",
);

const goodReward = scoreTransition({
  before: strainedMetrics,
  after: { ...strainedMetrics, trust: 47, services: 51, debt: 40, budget: 80 },
});
const badReward = scoreTransition({
  before: strainedMetrics,
  after: { ...strainedMetrics, trust: 34, services: 36, debt: 52, budget: 62 },
});

assert.ok(goodReward > badReward, "reward function should prefer better trust/services/debt outcomes");

const grade = gradePlaythrough({
  turnsPlayed: 4,
  startMetrics: startingMetrics,
  finalMetrics: { ...startingMetrics, trust: 62, services: 65, debt: 24, budget: 112 },
  actions: [
    { turn: 1, label: "Repair high-complaint blocks", expectedReward: 12, reason: "Service quality was the weakest visible signal." },
    { turn: 2, label: "Open neighborhood hours", expectedReward: 8, reason: "Public trust needed a small lift." },
  ],
  projects: [{ turn: 1, label: "Northside Safe Routes Crossings" }],
  policies: [{ turn: 2, label: "Pavement and Pipe Triage Standard" }],
  events: [
    { turn: 1, label: "Council choice resolved" },
    { turn: 2, label: "News response resolved" },
  ],
});

assert.ok(grade.score >= 80, "healthy playthrough should earn a strong grade");
assert.equal(grade.passed, true, "healthy playthrough should pass");
assert.match(grade.markdown, /# Middletown RL Grading Sheet/, "grade should render markdown heading");
assert.match(grade.markdown, /Repair high-complaint blocks/, "grade should include action history");
assert.match(grade.markdown, /Fun and Agency/, "grade should include an agency section");
assert.match(grade.markdown, /Final Grade/, "grade should include final grade");

const debtFailure = gradePlaythrough({
  turnsPlayed: 100,
  requiredTurns: 100,
  startMetrics: startingMetrics,
  finalMetrics: { ...startingMetrics, trust: 95, services: 95, budget: 180, debt: 90 },
  actions: [],
  events: [],
});
assert.equal(debtFailure.passed, false, "grading should fail a 100-quarter run with uncontrolled debt");

const passiveFailure = gradePlaythrough({
  turnsPlayed: 100,
  requiredTurns: 100,
  startMetrics: startingMetrics,
  finalMetrics: { ...startingMetrics, trust: 95, services: 95, budget: 160, debt: 12 },
  actions: [],
  projects: [],
  policies: [],
  events: [{ turn: 1, label: "Council choice resolved" }],
});
assert.equal(passiveFailure.passed, false, "grading should fail a clean but passive 100-quarter run");
assert.match(passiveFailure.markdown, /Agency Score/, "passive failure should explain the agency score");

const activeHardStressActions = Array.from({ length: 15 }, (_, index) => ({
  turn: index * 6 + 1,
  label: `Hard-mode service intervention ${index + 1}`,
  expectedReward: 8,
  reason: "Kept the town active during a fiscally stressed hard-mode path.",
}));
const activeHardStressProjects = Array.from({ length: 4 }, (_, index) => ({
  turn: index * 18 + 1,
  label: `Hard-mode capital fix ${index + 1}`,
}));
const activeHardStressPolicies = Array.from({ length: 3 }, (_, index) => ({
  turn: index * 20 + 2,
  label: `Hard-mode standing policy ${index + 1}`,
}));
const activeHardStressEvents = Array.from({ length: 12 }, (_, index) => ({
  turn: index + 1,
  label: `Hard-mode event response ${index + 1}`,
}));
const hardStress = {
  turnsPlayed: 100,
  requiredTurns: 100,
  startMetrics: startingMetrics,
  finalMetrics: { ...startingMetrics, trust: 88, services: 84, budget: 62, debt: 82 },
  actions: activeHardStressActions,
  projects: activeHardStressProjects,
  policies: activeHardStressPolicies,
  events: activeHardStressEvents,
};
const hardStressGrade = gradePlaythrough({ ...hardStress, difficulty: "hard" });
const normalStressGrade = gradePlaythrough({ ...hardStress, difficulty: "normal" });
assert.equal(hardStressGrade.passed, true, "hard grading should permit controlled high-debt survival with high agency");
assert.equal(normalStressGrade.passed, false, "normal grading should still reject the same high-debt finish");
assert.match(hardStressGrade.markdown, /Difficulty Gates/, "hard report should show the difficulty gate table");
assert.match(hardStressGrade.markdown, /Difficulty: \*\*Hard\*\*/, "hard report should label its difficulty");

console.log("rl policy test passed");
