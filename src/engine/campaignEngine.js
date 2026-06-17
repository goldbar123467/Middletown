import { ACHIEVEMENT_DEFINITIONS, CITY_BACKLOG_START, GOAL_DEFINITIONS } from "../data/campaign.js";
import { MAX_TURNS } from "../config/cityConfig.js";
import { applyMetricEffects } from "./metricEngine.js";
import { residentProblemSummary, updateResidentProblems } from "./residentProblemEngine.js";

const MAX_REACTIONS = 8;
const PEOPLE_MAYOR_REQUIRED_TYPES = 10;

export function createAchievements() {
  return ACHIEVEMENT_DEFINITIONS.map((achievement) => ({
    ...achievement,
    unlocked: false,
    unlockedTurn: null,
  }));
}

function goalProgress(goalId, state) {
  const problems = residentProblemSummary(state.residentProblems ?? []);
  const solvedTypes = new Set((state.residentProblems ?? [])
    .filter((problem) => problem.status === "solved")
    .map((problem) => problem.priority));
  const diverseSolvedPct = Math.min(100, Math.round((solvedTypes.size / PEOPLE_MAYOR_REQUIRED_TYPES) * 100));
  const backlogs = state.cityBacklogs ?? CITY_BACKLOG_START;
  const m = state.metrics ?? {};

  switch (goalId) {
    case "hundred_quarter_mayor":
      return Math.min(100, Math.round(((state.turn - 1) / MAX_TURNS) * 100));
    case "first_four_quarters":
      return Math.min(100, Math.round(((state.turn - 1) / 4) * 100));
    case "anti_pot_mayor":
      return Math.min(100, Math.round(((CITY_BACKLOG_START.potholes - backlogs.potholes) / CITY_BACKLOG_START.potholes) * 85)
        + Math.min(15, Math.round(((backlogs.projectClearedPotholes ?? 0) / 24) * 15)));
    case "peoples_mayor":
      return Math.round(problems.solvedPct * 0.8 + diverseSolvedPct * 0.2);
    case "budget_grown_up": {
      const budgetScore = Math.min(100, Math.max(0, m.budget ?? 0));
      const debtScore = Math.min(100, Math.max(0, 100 - (m.debt ?? 0)));
      return Math.round((budgetScore + debtScore) / 2);
    }
    case "active_government":
      return Math.min(100, Math.round(((state.civicRecord?.quartersWithActions ?? 0) / 35) * 55)
        + Math.round(((state.civicRecord?.policiesAdopted ?? 0) / 3) * 20)
        + Math.round(((state.civicRecord?.projectsStarted ?? 0) / 5) * 25));
    case "builder_mayor":
      return Math.min(100, Math.round(((state.civicRecord?.projectsCompleted ?? 0) / 5) * 100));
    default:
      return 0;
  }
}

export function createGoals(state = {}) {
  return GOAL_DEFINITIONS.map((goal) => {
    const progress = goalProgress(goal.id, state);
    const previousProgress = state.goals?.find((item) => item.id === goal.id)?.progress ?? progress;
    return {
      ...goal,
      progress,
      progressDelta: progress - previousProgress,
      complete: progress >= 100,
    };
  });
}

function achievementUnlocked(id, state) {
  const problems = residentProblemSummary(state.residentProblems ?? []);
  const backlogs = state.cityBacklogs ?? CITY_BACKLOG_START;
  const m = state.metrics ?? {};

  switch (id) {
    case "first_term_survivor":
      return state.turn >= 5 && state.phase !== "game_over";
    case "hundred_quarter_mayor":
      return state.phase === "victory" || state.turn > MAX_TURNS;
    case "anti_pot_mayor":
      return backlogs.potholes <= 0 && (backlogs.projectClearedPotholes ?? 0) >= 24;
    case "peoples_mayor":
      return problems.total > 0
        && problems.solved === problems.total
        && new Set((state.residentProblems ?? []).map((problem) => problem.priority)).size >= PEOPLE_MAYOR_REQUIRED_TYPES;
    case "budget_grown_up":
      return state.turn >= 20 && (m.budget ?? 0) >= 30 && (m.debt ?? 0) <= 45;
    case "services_actually_work":
      return state.turn >= 12 && (m.services ?? 0) >= 78 && (m.safety ?? 0) >= 60;
    case "quarter_25_public_record":
      return state.turn >= 25 && (state.civicRecord?.quartersWithActions ?? 0) >= 8;
    case "quarter_50_hard_winter":
      return state.turn >= 50 && (m.trust ?? 0) >= 55 && (m.budget ?? 0) > 0;
    case "quarter_75_long_memory":
      return state.turn >= 75 && (m.services ?? 0) >= 65 && problems.solvedPct >= 60;
    case "hands_on_mayor":
      return (state.civicRecord?.choicesFiled ?? 0) >= 18;
    case "builder_mayor":
      return (state.civicRecord?.projectsCompleted ?? 0) >= 3;
    case "policy_mayor":
      return (state.civicRecord?.policiesAdopted ?? 0) >= 3;
    case "passive_administrator":
      return (state.civicRecord?.passiveQuarters ?? 0) >= 8;
    case "debt_scare":
      return (state.civicRecord?.debtPeak ?? 0) >= 72;
    case "staff_burnout":
      return (state.civicRecord?.staffVacancies ?? 0) >= 5 || (m.labor ?? 0) <= 25;
    default:
      return false;
  }
}

export function updateAchievements(achievements, state) {
  const unlocked = [];
  const next = achievements.map((achievement) => {
    if (achievement.unlocked || !achievementUnlocked(achievement.id, state)) {
      return achievement;
    }
    const updated = {
      ...achievement,
      unlocked: true,
      unlockedTurn: state.turn,
    };
    unlocked.push(updated);
    return updated;
  });
  return { achievements: next, unlocked };
}

export function updateCityBacklogs(backlogs, state, actions = []) {
  const publicWorksBudget = state.departments?.publicWorks?.budget ?? 10;
  const actionBoost = actions.reduce((sum, action) => {
    const effects = action.effects ?? {};
    const infrastructureHelp = Math.max(0, effects.infrastructure ?? 0);
    const mobilityHelp = Math.max(0, effects.mobility ?? 0);
    return sum + infrastructureHelp + mobilityHelp + (action.domain === "infrastructure" ? 2 : 0);
  }, 0);
  const quarterlyRepair = Math.max(0, Math.round(publicWorksBudget / 18) + Math.floor(actionBoost / 2));
  const stormDamage = state.quarter === "Winter" && state.turn >= 8 ? 3 : 0;
  const currentDistrictPotholes = backlogs.districtPotholes ?? CITY_BACKLOG_START.districtPotholes;
  const districtPotholes = { ...currentDistrictPotholes };
  const actionDistricts = actions.map((action) => action.district).filter(Boolean);
  for (const district of actionDistricts) {
    districtPotholes[district] = Math.max(0, (districtPotholes[district] ?? 0) - 1);
  }
  if (stormDamage > 0) {
    const stormDistrict = ["northside", "eastbank", "southgate", "midtown"][state.turn % 4];
    districtPotholes[stormDistrict] = (districtPotholes[stormDistrict] ?? 0) + stormDamage;
  }
  const districtTotal = Object.values(districtPotholes).reduce((sum, value) => sum + value, 0);

  return {
    ...backlogs,
    districtPotholes,
    potholes: Math.max(0, Math.min(districtTotal, (backlogs.potholes ?? CITY_BACKLOG_START.potholes) + stormDamage - quarterlyRepair)),
    unansweredCases: Math.max(0, state.residentProblems?.filter((problem) => problem.status !== "solved").length ?? backlogs.unansweredCases),
  };
}

function residentPressureEffects(problems = []) {
  const active = problems.filter((problem) => problem.status !== "solved");
  const stalled = active.filter((problem) => problem.progress <= Math.max(2, problem.duration * 0.2));
  const urgent = active.filter((problem) => problem.duration - problem.progress <= 6);
  return {
    effects: {
      trust: stalled.length > 220 ? -2 : stalled.length > 120 ? -1 : 0,
      services: urgent.length > 120 ? -1 : 0,
      media: stalled.length > 200 ? -1 : 0,
    },
    stalled,
    urgent,
  };
}

function potholeComplaint(state, cityBacklogs) {
  const districtPotholes = cityBacklogs.districtPotholes ?? {};
  const [district, count] = Object.entries(districtPotholes)
    .sort(([, a], [, b]) => b - a)[0] ?? [];
  if (!district || count <= 0) return null;
  if (count < 10 && state.quarter !== "Winter" && state.turn % 5 !== 0) return null;

  const resident = (state.residentProblems ?? []).find((problem) => problem.status !== "solved" && problem.district === district)
    ?? (state.residentProblems ?? []).find((problem) => problem.district === district);
  const residentName = resident?.residentName ?? "A Middletown resident";

  return {
    id: `reaction_${state.turn}_pothole_${district}`,
    turn: state.turn,
    type: "pothole",
    sentiment: "worry",
    residentName,
    message: `${residentName} counted ${count} open pothole calls in ${district}. The map is not abstract when it is the route to work, school, or a clinic.`,
  };
}

function recurringResidentReturn(state) {
  if (![25, 50, 75].includes(state.turn)) return null;
  const active = (state.residentProblems ?? []).filter((problem) => problem.status !== "solved");
  const pool = active.length ? active : state.residentProblems ?? [];
  const problem = pool[(state.turn / 25 - 1) % Math.max(1, pool.length)];
  if (!problem) return null;
  return {
    id: `reaction_${state.turn}_return_${problem.residentId}`,
    turn: state.turn,
    type: "resident_return",
    sentiment: problem.status === "solved" ? "win" : "worry",
    residentName: problem.residentName,
    message: problem.status === "solved"
      ? `${problem.residentName} returns at the act break to remind City Hall that solved problems become public memory.`
      : `${problem.residentName} returns at the act break with ${problem.title}. The same resident, later in the term, makes drift harder to hide.`,
  };
}

function appendReactions(existing, next) {
  return [...next, ...existing].slice(0, MAX_REACTIONS);
}

function residentForAction(state, action) {
  const problems = state.residentProblems ?? [];
  return (
    problems.find((problem) => problem.status !== "solved" && (problem.priority === action.domain || problem.district === action.district)) ??
    problems.find((problem) => problem.status !== "solved") ??
    problems[0]
  );
}

export function reactionForAction(state, action, metrics) {
  const resident = residentForAction(state, action);
  const effects = action.effects ?? {};
  const positive = Object.entries(effects).filter(([, value]) => value > 0);
  const negative = Object.entries(effects).filter(([, value]) => value < 0);
  const sentiment = positive.length >= negative.length ? "win" : "worry";
  const residentName = resident?.residentName ?? "A Middletown resident";
  const message = sentiment === "win"
    ? `${residentName} noticed ${action.label}. It made City Hall feel a little more useful right away.`
    : `${residentName} noticed the tradeoff in ${action.label}. The town wants proof this will be worth it.`;

  return {
    id: `reaction_${state.turn}_${action.id}_${state.reactions?.length ?? 0}`,
    turn: state.turn,
    type: "choice",
    sentiment,
    residentName,
    message,
    metricSnapshot: {
      trust: metrics.trust,
      services: metrics.services,
      budget: metrics.budget,
      debt: metrics.debt,
    },
  };
}

function residentForEvent(state, event, effects = {}) {
  const problems = state.residentProblems ?? [];
  const effectKeys = Object.entries(effects)
    .filter(([, value]) => value > 0)
    .map(([key]) => key);
  return (
    problems.find((problem) => problem.status !== "solved" && problem.district === event?.district) ??
    problems.find((problem) => problem.status !== "solved" && problem.priority === event?.domain) ??
    problems.find((problem) => problem.status !== "solved" && effectKeys.includes(problem.priority)) ??
    problems.find((problem) => problem.status !== "solved") ??
    problems[0]
  );
}

export function reactionForEventChoice(state, event, option, source = "event", metrics = state.metrics) {
  const text = option?.text ?? "";
  const effects = option?.effects ?? {};
  const positive = Object.values(effects ?? {}).filter((value) => value > 0).length;
  const negative = Object.values(effects ?? {}).filter((value) => value < 0).length;
  const sentiment = positive >= negative ? "win" : "worry";
  const problem = residentForEvent(state, event, effects);
  const residentName = problem?.residentName ?? "A Middletown resident";
  const sourceLabel = source === "news" ? "headline response" : source === "council" ? "council call" : "public choice";
  const localDetail = event?.district ? ` in ${event.district}` : "";
  const problemDetail = problem?.title ? ` It touches ${problem.title}.` : "";
  const metricDetail = metrics
    ? ` Trust ${Math.round(metrics.trust ?? 0)}, services ${Math.round(metrics.services ?? 0)}, budget ${Math.round(metrics.budget ?? 0)}.`
    : "";

  return {
    id: `reaction_${state.turn}_event_${state.reactions?.length ?? 0}`,
    turn: state.turn,
    type: "event",
    sentiment,
    residentName,
    message: sentiment === "win"
      ? `${residentName} liked the ${sourceLabel}${localDetail}: ${text}.${problemDetail}${metricDetail}`
      : `${residentName} is watching the fallout from the ${sourceLabel}${localDetail}: ${text}.${problemDetail}${metricDetail}`,
  };
}

export function reactionForBudgetChange(state, department, previousBudget, nextBudget) {
  const problems = state.residentProblems ?? [];
  const resident = (
    problems.find((problem) => problem.status !== "solved" && problem.priority === department.domain) ??
    problems.find((problem) => problem.status !== "solved") ??
    problems[0]
  );
  const residentName = resident?.residentName ?? "A Middletown resident";
  const increased = nextBudget > previousBudget;
  const delta = Math.abs(nextBudget - previousBudget);

  return {
    id: `reaction_${state.turn}_budget_${department.id}_${state.reactions?.length ?? 0}`,
    turn: state.turn,
    type: "budget",
    sentiment: increased ? "win" : "worry",
    residentName,
    message: increased
      ? `${residentName} saw ${department.name} get ${delta} more budget points. They expect the improvement to show up soon.`
      : `${residentName} noticed ${department.name} lose ${delta} budget points. City Hall will need to explain the tradeoff.`,
  };
}

export function campaignQuarterUpdate(state, metrics, actions = []) {
  const cityBacklogs = updateCityBacklogs(state.cityBacklogs, { ...state, metrics }, actions);
  const problemResult = updateResidentProblems({
    problems: state.residentProblems,
    metrics,
    actions,
    turn: state.turn,
  });
  const residentPressure = residentPressureEffects(problemResult.problems);
  const pressuredMetrics = applyMetricEffects(metrics, residentPressure.effects);
  const solvedReactions = problemResult.solved.slice(0, 3).map((problem) => ({
    id: `reaction_${state.turn}_${problem.id}`,
    turn: state.turn,
    type: "resident_problem",
    sentiment: "win",
    residentName: problem.residentName,
    message: `${problem.residentName}'s problem moved from complaint to solved: ${problem.title}.`,
  }));
  const stalledReactions = residentPressure.stalled.slice(0, 1).map((problem) => ({
    id: `reaction_${state.turn}_stalled_${problem.id}`,
    turn: state.turn,
    type: "resident_problem",
    sentiment: "worry",
    residentName: problem.residentName,
    message: `${problem.residentName} is still waiting on ${problem.title}. The issue is starting to feel ignored.`,
  }));
  const potholeReaction = potholeComplaint(state, cityBacklogs);
  const returnReaction = recurringResidentReturn(state);
  const nextState = {
    ...state,
    metrics: pressuredMetrics,
    cityBacklogs,
    residentProblems: problemResult.problems,
  };
  const achievementResult = updateAchievements(state.achievements, nextState);
  const achievementReactions = achievementResult.unlocked.map((achievement) => ({
    id: `reaction_${state.turn}_${achievement.id}`,
    turn: state.turn,
    type: "achievement",
    sentiment: "achievement",
    residentName: "Middletown",
    message: `Achievement unlocked: ${achievement.title}.`,
  }));

  return {
    cityBacklogs,
    metrics: pressuredMetrics,
    residentProblems: problemResult.problems,
    achievements: achievementResult.achievements,
    goals: createGoals({
      ...nextState,
      achievements: achievementResult.achievements,
      residentProblems: problemResult.problems,
      cityBacklogs,
    }),
    reactions: appendReactions(state.reactions ?? [], [
      ...solvedReactions,
      ...stalledReactions,
      ...(potholeReaction ? [potholeReaction] : []),
      ...(returnReaction ? [returnReaction] : []),
      ...achievementReactions,
    ]),
    solvedProblems: problemResult.solved,
    unlockedAchievements: achievementResult.unlocked,
  };
}

export function appendCampaignReactions(state, reactions) {
  return appendReactions(state.reactions ?? [], reactions);
}
