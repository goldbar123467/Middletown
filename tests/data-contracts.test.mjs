import assert from "node:assert/strict";

const actionTypesModule = await import("../src/data/actionTypes.js");
const civicActionsModule = await import("../src/data/civicActions.js");
const departmentsModule = await import("../src/data/departments.js");
const districtsModule = await import("../src/data/districts.js");
const enginePartsModule = await import("../src/data/engineParts.js");
const metricsModule = await import("../src/data/metrics.js");
const councilEventsModule = await import("../src/data/playableCouncilEvents.js");
const newsEventsModule = await import("../src/data/playableNewsEvents.js");
const policiesModule = await import("../src/data/policies.js");
const projectsModule = await import("../src/data/projects.js");
const residentsModule = await import("../src/data/residents.js");
const storySamplesModule = await import("../src/data/storySamples.js");
const tabsModule = await import("../src/data/tabs.js");
const tutorialModule = await import("../src/data/tutorial.js");
const residentProblemEngineModule = await import("../src/engine/residentProblemEngine.js");

const ACTION_TYPES = actionTypesModule.ACTION_TYPES;
const CIVIC_ACTIONS = civicActionsModule.CIVIC_ACTIONS;
const CIVIC_MICRO_ACTIONS = civicActionsModule.CIVIC_MICRO_ACTIONS;
const DEPARTMENTS = departmentsModule.DEPARTMENTS;
const DISTRICTS = districtsModule.DISTRICTS;
const ENGINE_PARTS = enginePartsModule.ENGINE_PARTS;
const METRIC_CONFIG = metricsModule.METRIC_CONFIG;
const PLAYABLE_COUNCIL_EVENTS = councilEventsModule.PLAYABLE_COUNCIL_EVENTS;
const PLAYABLE_NEWS_EVENTS = newsEventsModule.PLAYABLE_NEWS_EVENTS;
const POLICIES = policiesModule.POLICIES;
const CAPITAL_PROJECTS = projectsModule.CAPITAL_PROJECTS;
const RESIDENTS = residentsModule.RESIDENTS;
const STORY_SAMPLES = storySamplesModule.STORY_SAMPLES;
const TAB_CONFIG = tabsModule.TAB_CONFIG;
const TUTORIAL_STEPS = tutorialModule.TUTORIAL_STEPS;
const createResidentProblems = residentProblemEngineModule.createResidentProblems;

const metricKeys = new Set(Object.keys(METRIC_CONFIG));
const departmentIds = new Set(DEPARTMENTS.map((dept) => dept.id));
const districtIds = new Set(DISTRICTS.map((district) => district.id));
const tabIds = new Set(TAB_CONFIG.map((tab) => tab.id));

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label} ids should be unique`);
  assert.ok(ids.every(Boolean), `${label} ids should be present`);
}

function assertKnownReference(item, key, knownIds, label) {
  if (item[key] === undefined) return;
  assert.ok(knownIds.has(item[key]), `${label} ${item.id} references unknown ${key}: ${item[key]}`);
}

function assertEffectMap(effects, label) {
  assert.ok(effects && typeof effects === "object" && !Array.isArray(effects), `${label} should have an effects object`);
  for (const [key, value] of Object.entries(effects)) {
    assert.ok(metricKeys.has(key), `${label} uses unknown metric key: ${key}`);
    assert.equal(typeof value, "number", `${label}.${key} should be numeric`);
    assert.ok(Number.isFinite(value), `${label}.${key} should be finite`);
  }
}

function assertPlayableEvent(event, label) {
  assert.equal(typeof event.title, "string", `${label} ${event.id} should have a title`);
  assert.equal(typeof event.description, "string", `${label} ${event.id} should have a description`);
  assert.ok(event.minTurn >= 1, `${label} ${event.id} should have a playable minTurn`);
  assertKnownReference(event, "department", departmentIds, label);
  assertKnownReference(event, "district", districtIds, label);
  assert.ok(Array.isArray(event.options) && event.options.length >= 2, `${label} ${event.id} needs at least two options`);

  event.options.forEach((option, index) => {
    assert.equal(typeof option.text, "string", `${label} ${event.id} option ${index} should have text`);
    assert.equal(typeof option.resultText, "string", `${label} ${event.id} option ${index} should have resultText`);
    assertEffectMap(option.effects, `${label} ${event.id} option ${index}`);
  });
}

assertUniqueIds(CIVIC_ACTIONS, "civic action");
assertUniqueIds(ENGINE_PARTS, "engine part");
assertUniqueIds(PLAYABLE_COUNCIL_EVENTS, "playable council event");
assertUniqueIds(PLAYABLE_NEWS_EVENTS, "playable news event");
assertUniqueIds(DEPARTMENTS, "department");
assertUniqueIds(DISTRICTS, "district");
assertUniqueIds(POLICIES, "policy");
assertUniqueIds(CAPITAL_PROJECTS, "capital project");
assertUniqueIds(RESIDENTS, "resident");
assertUniqueIds(STORY_SAMPLES, "story sample");
assertUniqueIds(TAB_CONFIG, "tab");
assertUniqueIds(TUTORIAL_STEPS, "tutorial step");

assert.ok(CIVIC_ACTIONS.length >= 90, "civic action list should stay content-rich");
assert.ok(CIVIC_MICRO_ACTIONS.length >= 8, "micro action list should keep no-cost civic choices visible");
assert.ok(ENGINE_PARTS.length >= 90, "city engine should keep the 90-part simulation backbone");
assert.ok(PLAYABLE_COUNCIL_EVENTS.length >= 60, "council event pack should stay content-rich");
assert.ok(PLAYABLE_NEWS_EVENTS.length >= 60, "news event pack should stay content-rich");
assert.ok(RESIDENTS.length >= 500, "resident pack should stay large enough to feel civic");
assert.ok(STORY_SAMPLES.length >= 40, "story samples should stay large enough for narrative variety");
assert.ok(TUTORIAL_STEPS.length >= 8, "first-quarter tutorial should introduce a full civic cast");

for (const metric of Object.values(METRIC_CONFIG)) {
  assert.equal(metric.key in METRIC_CONFIG, true, `${metric.label} key should match METRIC_CONFIG`);
  assert.ok(metric.min <= metric.start && metric.start <= metric.max, `${metric.key} start should be inside bounds`);
  assert.ok(["normal", "inverse"].includes(metric.polarity), `${metric.key} should declare a supported polarity`);
}

for (const action of CIVIC_ACTIONS) {
  assert.equal(typeof action.label, "string", `action ${action.id} should have a label`);
  assert.equal(typeof action.publicLine, "string", `action ${action.id} should have publicLine`);
  assertKnownReference(action, "department", departmentIds, "action");
  assertKnownReference(action, "district", districtIds, "action");
  assertEffectMap(action.effects, `action ${action.id}`);
}

for (const action of CIVIC_MICRO_ACTIONS) {
  assert.equal(action.effects.budget, 0, `micro action ${action.id} should not cost operating budget`);
  assert.ok(
    Object.entries(action.effects).some(([key, value]) => key !== "budget" && value < 0),
    `micro action ${action.id} should still have a non-budget tradeoff`,
  );
}

for (const part of ENGINE_PARTS) {
  assert.equal(typeof part.label, "string", `part ${part.id} should have a label`);
  assert.ok(part.priority >= 1 && part.priority <= 5, `part ${part.id} priority should be 1-5`);
  assertKnownReference(part, "department", departmentIds, "engine part");
  assertKnownReference(part, "district", districtIds, "engine part");
  assertEffectMap(part.effects, `engine part ${part.id}`);
}

PLAYABLE_COUNCIL_EVENTS.forEach((event) => assertPlayableEvent(event, "council event"));
PLAYABLE_NEWS_EVENTS.forEach((event) => assertPlayableEvent(event, "news event"));
assert.ok(PLAYABLE_COUNCIL_EVENTS.some((event) => event.id.startsWith("council_records_")), "council events should include dedicated public-record request cards");
assert.ok(PLAYABLE_NEWS_EVENTS.some((event) => event.id.startsWith("news_records_")), "news events should include dedicated public-record request headlines");
assert.ok(PLAYABLE_COUNCIL_EVENTS.some((event) => event.id.startsWith("council_overopt_")), "council events should include over-optimization backlash hearings");
assert.ok(PLAYABLE_NEWS_EVENTS.some((event) => event.id.startsWith("news_overopt_")), "news events should include over-optimization backlash headlines");
assert.ok(
  PLAYABLE_COUNCIL_EVENTS.filter((event) => event.id.startsWith("council_0")).every((event) => !/Move quickly with staff authority|Broker a public compromise|Delay until next quarter|feels local, practical/i.test(JSON.stringify(event))),
  "exported generated council events should use local authored option language",
);
assert.ok(
  PLAYABLE_NEWS_EVENTS.filter((event) => event.id.startsWith("news_0")).every((event) => !/Move quickly with staff authority|Broker a public compromise|Delay until next quarter|feels local, practical/i.test(JSON.stringify(event))),
  "exported generated news events should use local authored option language",
);
assert.ok(
  PLAYABLE_COUNCIL_EVENTS.filter((event) => event.id.startsWith("council_0")).every((event) => event.options.every((option) => Object.values(option.effects).some((value) => value < 0))),
  "generated council options should each carry a visible tradeoff",
);
assert.ok(
  PLAYABLE_NEWS_EVENTS.filter((event) => event.id.startsWith("news_0")).every((event) => event.options.every((option) => Object.values(option.effects).some((value) => value < 0))),
  "generated news options should each carry a visible tradeoff",
);
for (const arcLabel of ["Budget Markup", "Labor and Records", "Capital Queue", "Bad Winter", "Long Memory"]) {
  assert.ok(
    PLAYABLE_COUNCIL_EVENTS.some((event) => event.title.includes(arcLabel)),
    `generated council events should include the ${arcLabel} arc`,
  );
}

const residentProblems = createResidentProblems(RESIDENTS);
assert.equal(residentProblems.length, RESIDENTS.length, "every resident should receive a starting problem");
assert.ok(
  residentProblems.slice(18).every((problem) => /routine runs through|practical ask|not a one-off complaint/i.test(problem.problem)),
  "generated resident problems should use local authored detail templates",
);

for (const step of TUTORIAL_STEPS) {
  assert.ok(["popup", "voice_log"].includes(step.kind), `tutorial ${step.id} should have a supported kind`);
  assert.equal(typeof step.speaker, "string", `tutorial ${step.id} should name a speaker`);
  assert.equal(typeof step.role, "string", `tutorial ${step.id} should name a role`);
  assert.equal(typeof step.district, "string", `tutorial ${step.id} should name a district`);
  assert.equal(typeof step.title, "string", `tutorial ${step.id} should have a title`);
  assert.equal(typeof step.message, "string", `tutorial ${step.id} should have a message`);
  assert.equal(typeof step.transcript, "string", `tutorial ${step.id} should have a voice transcript`);
  assert.ok(tabIds.has(step.targetTab), `tutorial ${step.id} references unknown target tab: ${step.targetTab}`);
}

for (const policy of POLICIES) {
  assertEffectMap(policy.effects, `policy ${policy.id}`);
}

for (const actionType of [
  "START_GAME",
  "PLAY_AGAIN",
  "SET_TAB",
  "TUTORIAL_NEXT",
  "TUTORIAL_PREV",
  "TUTORIAL_OPEN_STEP",
  "TUTORIAL_SKIP",
  "EXECUTE_CIVIC_ACTION",
  "SET_DEPARTMENT_BUDGET",
  "START_CAPITAL_PROJECT",
  "ADOPT_POLICY",
  "REPEAL_POLICY",
  "RUN_AUDIT",
  "DECLARE_EMERGENCY",
  "SIMULATE_QUARTER",
  "SELECT_COUNCIL_OPTION",
  "CONTINUE_TO_NEWS",
  "SELECT_NEWS_RESPONSE",
  "ADVANCE_QUARTER",
  "DISMISS_TOAST",
]) {
  assert.ok(ACTION_TYPES.includes(actionType), `ACTION_TYPES should include reducer action ${actionType}`);
}

console.log("data contract test passed");
