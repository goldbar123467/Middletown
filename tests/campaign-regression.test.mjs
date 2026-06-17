import assert from "node:assert/strict";
import { MAX_TURNS } from "../src/config/cityConfig.js";
import { RESIDENTS } from "../src/data/residents.js";
import { gameReducer, initialState } from "../src/engine/gameReducer.js";
import { endingForState } from "../src/engine/rules.js";

function dispatch(state, type, payload) {
  return gameReducer(state, { type, payload });
}

function resolveQuarter(state) {
  let next = dispatch(state, "SIMULATE_QUARTER");
  if (next.phase === "council_session") {
    next = dispatch(next, "SELECT_COUNCIL_OPTION", { optionIndex: bestOptionIndex(next.currentCouncilEvent) });
  }
  if (next.phase === "city_resolve") {
    next = dispatch(next, "CONTINUE_TO_NEWS");
  }
  if (next.phase === "news_event") {
    next = dispatch(next, "SELECT_NEWS_RESPONSE", { optionIndex: bestOptionIndex(next.currentNewsEvent) });
  }
  if (next.phase === "citizen_response" || next.phase === "city_resolve") {
    next = dispatch(next, "ADVANCE_QUARTER");
  }
  return next;
}

function scoreEffects(effects = {}) {
  return Object.entries(effects).reduce((score, [key, value]) => score + (key === "debt" ? -value : value), 0);
}

function bestOptionIndex(event) {
  return (event?.options ?? []).reduce((best, option, index) => {
    const score = scoreEffects(option.effects);
    return score > best.score ? { index, score } : best;
  }, { index: 0, score: Number.NEGATIVE_INFINITY }).index;
}

function runQuarters(state, count) {
  let next = state;
  for (let index = 0; index < count; index += 1) {
    if (next.phase !== "management") return next;
    next = resolveQuarter(next);
  }
  return next;
}

function conservativeHundredQuarterRun() {
  let state = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  const projectIds = ["project_003", "project_017", "project_018", "project_020", "project_014", "project_009", "project_024", "project_033"];
  const policyIds = ["policy_002", "policy_001", "policy_013", "policy_016"];
  const actionIds = ["action_003_infrastructure", "action_008_education", "action_017_safety", "action_024_mobility", "action_022_health", "action_001_budget"];
  let projectIndex = 0;
  let policyIndex = 0;
  for (let index = 0; index < 100; index += 1) {
    if (state.phase !== "management") return state;
    if ((state.turn === 1 || state.turn % 8 === 0) && projectIndex < projectIds.length && state.metrics.budget > 35) {
      state = dispatch(state, "START_CAPITAL_PROJECT", { projectId: projectIds[projectIndex] });
      projectIndex += 1;
    }
    if ((state.turn === 2 || state.turn % 12 === 0) && policyIndex < policyIds.length && state.metrics.budget > 30) {
      state = dispatch(state, "ADOPT_POLICY", { policyId: policyIds[policyIndex] });
      policyIndex += 1;
    }
    if (state.metrics.budget > 25) {
      state = dispatch(state, "EXECUTE_CIVIC_ACTION", { actionId: actionIds[state.turn % actionIds.length] });
    }
    state = resolveQuarter(state);
  }
  return state;
}

const originalRandom = Math.random;
Math.random = () => 0;

try {
  assert.equal(MAX_TURNS, 100, "Middletown should be a 100-quarter mayoral career");

  const start = dispatch(initialState, "START_GAME", { difficulty: "normal" });
  assert.equal(start.residentProblems.length, RESIDENTS.length, "every resident should start with a problem");
  assert.ok(start.residentProblems.every((problem) => problem.duration >= 10 && problem.duration <= 50), "resident problems should resolve over 10-50 quarters");
  assert.match(start.residentProblems[0].problem, /diner|detours|budget/i, "spotlight residents should have authored local problem details");
  assert.ok(start.goals.some((goal) => goal.id === "anti_pot_mayor"), "goals should include Anti-Pot Mayor");
  assert.ok(start.goals.some((goal) => goal.id === "peoples_mayor"), "goals should include The People's Mayor");
  assert.ok(start.goals.some((goal) => goal.id === "hundred_quarter_mayor"), "goals should include 100-quarter victory");
  assert.ok(start.achievements.some((achievement) => achievement.id === "anti_pot_mayor" && !achievement.unlocked), "achievements should start locked");

  const reacted = dispatch(start, "EXECUTE_CIVIC_ACTION", { actionId: "action_003_infrastructure" });
  assert.ok(reacted.reactions.length > start.reactions.length, "every visible choice should create an immediate resident reaction");
  assert.equal(typeof reacted.reactions.at(-1).residentName, "string", "reaction should name a resident");
  assert.equal(typeof reacted.reactions.at(-1).message, "string", "reaction should include a visible message");
  assert.ok(Math.abs(reacted.resourceDeltas.budget ?? 0) <= 8, "agenda budget costs should be readable tension, not a cliff");

  const withProject = dispatch(start, "START_CAPITAL_PROJECT", { projectId: "project_003" });
  assert.equal(withProject.activeProjects.length, 1, "capital projects should be reducer-backed playable systems");
  assert.ok(withProject.reactions[0].message.includes("started"), "project starts should create immediate resident feedback");

  const withPolicy = dispatch(start, "ADOPT_POLICY", { policyId: "policy_002" });
  assert.equal(withPolicy.activePolicies.length, 1, "policies should be reducer-backed playable systems");
  assert.ok(withPolicy.reactions[0].message.includes("standing policy"), "policy adoption should explain recurring upkeep");

  const audit = dispatch(start, "RUN_AUDIT");
  assert.equal(audit.civicRecord.auditsRun, 1, "public audits should be reducer-backed playable systems");
  assert.ok(audit.metrics.trust > start.metrics.trust, "audits should trade money and staff time for public trust");

  const emergency = dispatch(start, "DECLARE_EMERGENCY");
  assert.equal(emergency.civicRecord.emergencyDeclarations, 1, "emergency declarations should be reducer-backed playable systems");
  assert.ok(emergency.metrics.emergencyReadiness > start.metrics.emergencyReadiness, "emergency declarations should create immediate response capacity");

  const publicWorksCut = dispatch(start, "SET_DEPARTMENT_BUDGET", { departmentId: "publicWorks", budget: 6 });
  assert.ok(publicWorksCut.metrics.labor < start.metrics.labor, "department budget cuts should immediately hurt staff morale");
  assert.ok(publicWorksCut.civicRecord.staffVacancies >= 2, "deep department cuts should create vacancy pressure");
  assert.ok(publicWorksCut.chronicle.at(-1).text.includes("Why this happened"), "budget changes should explain the consequence");

  let councilMemory = dispatch(start, "SIMULATE_QUARTER");
  assert.equal(councilMemory.phase, "council_session", "quarter resolution should surface a council event");
  assert.ok(councilMemory.reactions.some((reaction) => reaction.type === "pothole"), "pothole backlogs should create named resident complaints");
  const councilDistrict = councilMemory.currentCouncilEvent.district;
  councilMemory = dispatch(councilMemory, "SELECT_COUNCIL_OPTION", { optionIndex: 0 });
  assert.equal(councilMemory.civicRecord.councilChoices, 1, "council choices should be remembered");
  assert.equal(councilMemory.civicRecord.districtMentions[councilDistrict], 1, "council memory should track the event district");
  assert.ok(councilMemory.chronicle.at(-1).text.includes("Why this happened"), "council outcomes should include a why explanation");

  let newsMemory = dispatch(councilMemory, "CONTINUE_TO_NEWS");
  assert.equal(newsMemory.phase, "news_event", "quarter resolution should surface a news event");
  newsMemory = dispatch(newsMemory, "SELECT_NEWS_RESPONSE", { optionIndex: 0 });
  assert.equal(newsMemory.civicRecord.newsChoices, 1, "news responses should be remembered");
  assert.ok(Object.keys(newsMemory.civicRecord.newsMemory).length > 0, "news outlets should build memory across choices");
  assert.notEqual(newsMemory.reactions[0].residentName, "A Middletown resident", "event reactions should name a connected resident or institution");

  const laborSetup = {
    ...start,
    turn: 32,
    quarter: "Winter",
    metrics: { ...start.metrics, labor: 41, budget: 45 },
    executedActions: [],
  };
  const laborQuarter = dispatch(laborSetup, "SIMULATE_QUARTER");
  assert.ok(laborQuarter.civicRecord.laborNegotiations >= 1, "Act 2/3 labor negotiations should become a real quarterly system");
  assert.ok(laborQuarter.chronicle.some((entry) => entry.text.includes("Labor negotiations")), "labor negotiations should show in quarter prose");

  const returnQuarter = dispatch({ ...start, turn: 25, quarter: "Spring" }, "SIMULATE_QUARTER");
  assert.ok(returnQuarter.reactions.some((reaction) => reaction.type === "resident_return"), "recurring residents should return across campaign acts");

  const firstYear = runQuarters(start, 4);
  assert.notEqual(firstYear.phase, "game_over", "first four quarters should be reliably survivable");
  assert.ok(firstYear.turn >= 5, "first-year survival should reach quarter 5");
  assert.ok(firstYear.achievements.some((achievement) => achievement.id === "first_term_survivor" && achievement.unlocked), "surviving four quarters should unlock an achievement");

  const afterTen = runQuarters(start, 10);
  assert.ok(afterTen.residentProblems.some((problem) => problem.progress > 0), "resident problems should progress over time");
  assert.ok(afterTen.reactions.length > 0, "quarter resolution should leave visible wins or failures");

  const final = conservativeHundredQuarterRun();
  assert.equal(final.phase, "victory", "conservative RL-style play should be able to win 100 quarters");
  assert.ok(final.metrics.debt <= 70, "a 100-quarter win should keep debt controlled, not maxed out");
  assert.ok(final.civicRecord.choicesFiled >= 18, "a 100-quarter win should require visible mayor choices");
  assert.ok(final.civicRecord.projectsCompleted >= 3, "a 100-quarter win should include visible capital work");
  assert.ok(final.civicRecord.policiesAdopted >= 3, "a 100-quarter win should include standing policy choices");
  assert.ok(final.achievements.some((achievement) => achievement.id === "hundred_quarter_mayor" && achievement.unlocked), "100-quarter win should unlock the Century Mayor achievement");
  assert.ok(final.achievements.some((achievement) => achievement.id === "anti_pot_mayor" && achievement.unlocked), "100-quarter play should make Anti-Pot Mayor reachable");
  assert.ok(final.achievements.some((achievement) => achievement.id === "peoples_mayor" && achievement.unlocked), "100-quarter play should make The People's Mayor reachable");
  assert.equal(final.residentProblems.filter((problem) => problem.status === "solved").length, RESIDENTS.length, "The People's Mayor should mean every resident problem was solved");
  assert.ok(new Set(final.residentProblems.map((problem) => problem.priority)).size >= 10, "The People's Mayor should include diverse problem types");

  const passive = runQuarters(start, 100);
  assert.ok(passive.phase === "game_over" || endingForState(passive) === "The Passive Administrator", "passive play should fail or earn the weak passive ending");
  assert.ok((passive.civicRecord.passiveQuarters ?? 0) >= 8, "passive play should be recorded as public drift");
} finally {
  Math.random = originalRandom;
}

console.log("campaign regression test passed");
