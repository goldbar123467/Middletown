import { DEFAULT_DIFFICULTY, DIFFICULTIES, POPULATION_START } from "../config/cityConfig.js";
import { DEPARTMENTS } from "../data/departments.js";
import { DISTRICTS } from "../data/districts.js";
import { createResidentProblemSeeds } from "../data/residentProblemSeeds.js";
import { METRIC_CONFIG } from "../data/metrics.js";
import { CIVIC_ACTIONS } from "../data/civicActions.js";
import { PLAYABLE_COUNCIL_EVENTS } from "../data/playableCouncilEvents.js";
import { PLAYABLE_NEWS_EVENTS } from "../data/playableNewsEvents.js";
import { TUTORIAL_STEPS, clampTutorialIndex } from "../data/tutorial.js";
import { CITY_BACKLOG_START } from "../data/campaign.js";
import { runCityEngine } from "./cityEngine.js";
import {
  adoptPolicy,
  declareEmergency,
  repealPolicy,
  runAudit,
  runCivicOperationsQuarter,
  startCapitalProject,
} from "./civicOperationsEngine.js";
import { civicMemoryDefaults, normalizeCivicRecord, recordCivicEventChoice } from "./civicMemoryEngine.js";
import { applyMetricEffects, clampMetrics } from "./metricEngine.js";
import { setDepartmentBudget } from "./budgetEngine.js";
import { selectEvent, markUsed } from "./eventSelector.js";
import { checkGameOver, checkVictory } from "./rules.js";
import { addChronicle, computeDeltas, turnToQuarterYear } from "./turnUtils.js";
import { createResidentProblems } from "./residentProblemEngine.js";
import {
  appendCampaignReactions,
  campaignQuarterUpdate,
  createAchievements,
  createGoals,
  reactionForBudgetChange,
  reactionForAction,
  reactionForEventChoice,
  updateAchievements,
} from "./campaignEngine.js";

function startingBacklogs() {
  return {
    ...CITY_BACKLOG_START,
    districtPotholes: { ...CITY_BACKLOG_START.districtPotholes },
  };
}

function startingCivicRecord(metrics = {}) {
  return civicMemoryDefaults(metrics);
}

function departmentState() {
  return Object.fromEntries(DEPARTMENTS.map((dept) => [dept.id, { ...dept }]));
}

function districtState() {
  return Object.fromEntries(DISTRICTS.map((district) => [district.id, { ...district }]));
}

function startingMetrics(config) {
  const metrics = Object.fromEntries(Object.entries(METRIC_CONFIG).map(([key, def]) => [key, def.start]));
  metrics.population = POPULATION_START;
  metrics.budget = config.startingBudget;
  metrics.reserves = config.startingReserves;
  metrics.trust = config.trust;
  return clampMetrics(metrics);
}

function startingCampaignState(metrics, turn = 1) {
  const residentProblems = createResidentProblems(createResidentProblemSeeds());
  const campaignBase = {
    turn,
    phase: "management",
    metrics,
    residentProblems,
    cityBacklogs: startingBacklogs(),
    achievements: createAchievements(),
    civicRecord: startingCivicRecord(metrics),
  };
  return {
    residentProblems,
    cityBacklogs: startingBacklogs(),
    achievements: createAchievements(),
    goals: createGoals(campaignBase),
    reactions: [],
    civicRecord: startingCivicRecord(metrics),
  };
}

function tutorialVoiceLogIds() {
  return TUTORIAL_STEPS.filter((step) => step.kind === "voice_log").map((step) => step.id);
}

function tutorialState({ active = false, completed = false, index = 0, openedIds = [] } = {}) {
  const safeIndex = clampTutorialIndex(index);
  const currentId = TUTORIAL_STEPS[safeIndex]?.id;
  return {
    active,
    completed,
    index: safeIndex,
    openedIds: Array.from(new Set([...openedIds, currentId].filter(Boolean))),
    voiceLogIds: tutorialVoiceLogIds(),
  };
}

function startTutorialState() {
  return tutorialState({ active: true, completed: false, index: 0 });
}

function completeTutorial(tutorial) {
  return tutorialState({ ...tutorial, active: false, completed: true });
}

function openTutorialStep(tutorial, index, active = true) {
  return tutorialState({
    ...tutorial,
    active,
    index,
  });
}

export const initialState = {
  phase: "title",
  difficulty: DEFAULT_DIFFICULTY,
  difficultyConfig: DIFFICULTIES[DEFAULT_DIFFICULTY],
  turn: 1,
  quarter: "Spring",
  year: 1,
  activeTab: "dashboard",
  metrics: startingMetrics(DIFFICULTIES[DEFAULT_DIFFICULTY]),
  departments: departmentState(),
  districts: districtState(),
  activePolicies: [],
  activeProjects: [],
  completedProjects: [],
  failedProjects: [],
  civicRecord: startingCivicRecord(startingMetrics(DIFFICULTIES[DEFAULT_DIFFICULTY])),
  serviceCases: [],
  executedActions: [],
  usedCouncilIds: [],
  usedNewsIds: [],
  currentCouncilEvent: null,
  currentNewsEvent: null,
  chronicle: [],
  resourceDeltas: {},
  tutorial: tutorialState(),
  residentProblems: [],
  cityBacklogs: startingBacklogs(),
  achievements: createAchievements(),
  goals: [],
  reactions: [],
  toast: null,
  gameOverReason: null,
};

function startGame(difficulty = DEFAULT_DIFFICULTY) {
  const difficultyId = DIFFICULTIES[difficulty] ? difficulty : DEFAULT_DIFFICULTY;
  const config = DIFFICULTIES[difficultyId] ?? DIFFICULTIES.normal;
  const { quarter, year } = turnToQuarterYear(1);
  const metrics = startingMetrics(config);
  const campaignState = startingCampaignState(metrics, 1);
  const base = {
    ...initialState,
    phase: "management",
    difficulty: difficultyId,
    difficultyConfig: config,
    turn: 1,
    quarter,
    year,
    activeTab: "dashboard",
    metrics,
    departments: departmentState(),
    districts: districtState(),
    activePolicies: [],
    activeProjects: [],
    completedProjects: [],
    failedProjects: [],
    tutorial: startTutorialState(),
    ...campaignState,
    chronicle: [],
  };
  return {
    ...base,
    chronicle: addChronicle([], "The mayor takes office in Middletown. City Hall opens with a budget, a calendar, and a town waiting for proof.", base, "system"),
  };
}

const DEPARTMENT_DOMAIN_METRICS = {
  executive: "trust",
  administration: "media",
  safety: "safety",
  infrastructure: "infrastructure",
  growth: "housing",
  wellbeing: "health",
  quality: "services",
  mobility: "mobility",
  education: "education",
  economy: "economy",
  resilience: "emergencyReadiness",
};

function departmentBudgetEffects(department, previousBudget, nextBudget) {
  const delta = nextBudget - previousBudget;
  const severity = Math.min(4, Math.max(1, Math.ceil(Math.abs(delta) / 4)));
  const metricKey = DEPARTMENT_DOMAIN_METRICS[department.domain];

  if (delta < 0) {
    const effects = {
      labor: -severity,
      services: Math.abs(delta) >= 5 ? -1 : 0,
      trust: Math.abs(delta) >= 7 ? -1 : 0,
    };
    if (metricKey) {
      effects[metricKey] = (effects[metricKey] ?? 0) - Math.min(2, severity);
    }
    return effects;
  }

  const effects = {
    labor: delta >= 4 ? 1 : 0,
    services: delta >= 6 ? 1 : 0,
  };
  if (metricKey && delta >= 3) {
    effects[metricKey] = (effects[metricKey] ?? 0) + 1;
  }
  return effects;
}

function budgetChronicleLine(department, previousBudget, nextBudget) {
  const delta = nextBudget - previousBudget;
  const direction = delta > 0 ? "increased" : "cut";
  const why = delta > 0
    ? "staff hear capacity, and residents expect results"
    : "staff morale and service speed take the hit before the ledger looks better";
  return `${department.name} budget ${direction} by ${Math.abs(delta)}. Why this happened: ${why}.`;
}

function chooseOption(state, event, optionIndex, nextPhase, source = "event") {
  const option = event?.options?.[optionIndex];
  if (!option) return state;
  const before = state.metrics;
  const optionMetrics = applyMetricEffects(state.metrics, option.effects);
  const memory = recordCivicEventChoice({ ...state, metrics: optionMetrics }, event, option, source);
  const reaction = reactionForEventChoice(state, event, option, source, memory.metrics);
  const chronicleText = `${option.resultText ?? option.text} ${memory.line}`;
  const next = {
    ...state,
    phase: nextPhase,
    metrics: memory.metrics,
    civicRecord: memory.civicRecord,
    resourceDeltas: computeDeltas(before, memory.metrics),
    reactions: appendCampaignReactions(state, [reaction, memory.reaction]),
    chronicle: addChronicle(state.chronicle, chronicleText, { ...state, metrics: memory.metrics }, "event"),
  };
  const gameOverReason = checkGameOver(next);
  return gameOverReason ? { ...next, phase: "game_over", gameOverReason } : next;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME":
    case "PLAY_AGAIN":
      return startGame(action.payload?.difficulty ?? state.difficulty);

    case "SET_TAB":
      return { ...state, activeTab: action.payload?.tab ?? state.activeTab };

    case "TUTORIAL_NEXT": {
      const tutorial = state.tutorial ?? tutorialState();
      if (!tutorial.active) return state;
      const nextIndex = clampTutorialIndex(tutorial.index + 1);
      const atEnd = tutorial.index >= TUTORIAL_STEPS.length - 1;
      return {
        ...state,
        tutorial: atEnd ? completeTutorial(tutorial) : openTutorialStep(tutorial, nextIndex),
      };
    }

    case "TUTORIAL_PREV": {
      const tutorial = state.tutorial ?? tutorialState();
      if (!tutorial.active) return state;
      return {
        ...state,
        tutorial: openTutorialStep(tutorial, tutorial.index - 1),
      };
    }

    case "TUTORIAL_OPEN_STEP": {
      if (state.phase !== "management") return state;
      return {
        ...state,
        tutorial: openTutorialStep(state.tutorial ?? tutorialState(), action.payload?.index ?? 0, true),
      };
    }

    case "TUTORIAL_SKIP":
      return {
        ...state,
        tutorial: completeTutorial(state.tutorial ?? tutorialState()),
      };

    case "EXECUTE_CIVIC_ACTION": {
      if (state.phase !== "management") return state;
      const civicAction = CIVIC_ACTIONS.find((item) => item.id === action.payload?.actionId);
      if (!civicAction) return state;
      const before = state.metrics;
      const normalizedEffects = { ...civicAction.effects };
      if (normalizedEffects.budget < 0) {
        const factor = state.turn <= 16 ? 0.5 : 0.62;
        normalizedEffects.budget = -Math.max(1, Math.min(8, Math.ceil(Math.abs(normalizedEffects.budget) * factor)));
        normalizedEffects.labor = (normalizedEffects.labor ?? 0) - Math.max(1, Math.ceil((civicAction.cost ?? 8) / 10));
      }
      const metrics = applyMetricEffects(state.metrics, normalizedEffects);
      const reaction = reactionForAction(state, civicAction, metrics);
      const next = {
        ...state,
        metrics,
        executedActions: [...state.executedActions, { id: civicAction.id, turn: state.turn }],
        resourceDeltas: computeDeltas(before, metrics),
        reactions: appendCampaignReactions(state, [reaction]),
        chronicle: addChronicle(state.chronicle, civicAction.publicLine, { ...state, metrics }, "action"),
        toast: civicAction.label,
      };
      const gameOverReason = checkGameOver(next);
      return gameOverReason ? { ...next, phase: "game_over", gameOverReason } : next;
    }

    case "SET_DEPARTMENT_BUDGET": {
      if (state.phase !== "management") return state;
      const departmentId = action.payload?.departmentId;
      const previousDepartment = state.departments[departmentId];
      if (!previousDepartment) return state;
      const departments = setDepartmentBudget(state.departments, departmentId, action.payload.budget);
      const nextDepartment = departments[departmentId];
      if (nextDepartment.budget === previousDepartment.budget) {
        return { ...state, departments };
      }
      const before = state.metrics;
      const budgetEffects = departmentBudgetEffects(nextDepartment, previousDepartment.budget, nextDepartment.budget);
      const metrics = applyMetricEffects(state.metrics, budgetEffects);
      const civicRecord = normalizeCivicRecord(state);
      const cut = Math.max(0, previousDepartment.budget - nextDepartment.budget);
      if (cut >= 3) {
        civicRecord.staffVacancies += Math.ceil(cut / 4);
      }
      if (nextDepartment.budget > previousDepartment.budget && nextDepartment.budget - previousDepartment.budget >= 4) {
        civicRecord.publicProcess += 1;
      }
      const reaction = reactionForBudgetChange(state, nextDepartment, previousDepartment.budget, nextDepartment.budget);
      return {
        ...state,
        departments,
        metrics,
        civicRecord,
        resourceDeltas: computeDeltas(before, metrics),
        reactions: appendCampaignReactions(state, [reaction]),
        chronicle: addChronicle(state.chronicle, budgetChronicleLine(nextDepartment, previousDepartment.budget, nextDepartment.budget), { ...state, metrics }, "action"),
      };
    }

    case "START_CAPITAL_PROJECT": {
      if (state.phase !== "management") return state;
      const result = startCapitalProject(state, action.payload?.projectId);
      if (!result) return state;
      const next = {
        ...state,
        metrics: result.metrics,
        activeProjects: [...state.activeProjects, result.activeProject],
        civicRecord: result.civicRecord,
        resourceDeltas: computeDeltas(state.metrics, result.metrics),
        reactions: appendCampaignReactions(state, [result.reaction]),
        chronicle: addChronicle(state.chronicle, result.line, { ...state, metrics: result.metrics }, "action"),
        toast: result.activeProject.name,
      };
      const gameOverReason = checkGameOver(next);
      return gameOverReason ? { ...next, phase: "game_over", gameOverReason } : next;
    }

    case "ADOPT_POLICY": {
      if (state.phase !== "management") return state;
      const result = adoptPolicy(state, action.payload?.policyId);
      if (!result) return state;
      const next = {
        ...state,
        metrics: result.metrics,
        activePolicies: [...state.activePolicies, result.activePolicy],
        civicRecord: result.civicRecord,
        resourceDeltas: computeDeltas(state.metrics, result.metrics),
        reactions: appendCampaignReactions(state, [result.reaction]),
        chronicle: addChronicle(state.chronicle, result.line, { ...state, metrics: result.metrics }, "action"),
        toast: result.activePolicy.name,
      };
      const gameOverReason = checkGameOver(next);
      return gameOverReason ? { ...next, phase: "game_over", gameOverReason } : next;
    }

    case "REPEAL_POLICY": {
      if (state.phase !== "management") return state;
      const result = repealPolicy(state, action.payload?.policyId);
      if (!result) return state;
      return {
        ...state,
        metrics: result.metrics,
        activePolicies: result.activePolicies,
        civicRecord: result.civicRecord,
        resourceDeltas: computeDeltas(state.metrics, result.metrics),
        reactions: appendCampaignReactions(state, [result.reaction]),
        chronicle: addChronicle(state.chronicle, result.line, { ...state, metrics: result.metrics }, "action"),
      };
    }

    case "RUN_AUDIT": {
      if (state.phase !== "management") return state;
      const result = runAudit(state);
      return {
        ...state,
        metrics: result.metrics,
        civicRecord: result.civicRecord,
        resourceDeltas: computeDeltas(state.metrics, result.metrics),
        reactions: appendCampaignReactions(state, [result.reaction]),
        chronicle: addChronicle(state.chronicle, result.line, { ...state, metrics: result.metrics }, "action"),
        toast: "Public audit",
      };
    }

    case "DECLARE_EMERGENCY": {
      if (state.phase !== "management") return state;
      const result = declareEmergency(state);
      return {
        ...state,
        metrics: result.metrics,
        civicRecord: result.civicRecord,
        resourceDeltas: computeDeltas(state.metrics, result.metrics),
        reactions: appendCampaignReactions(state, [result.reaction]),
        chronicle: addChronicle(state.chronicle, result.line, { ...state, metrics: result.metrics }, "action"),
        toast: "Emergency declaration",
      };
    }

    case "SIMULATE_QUARTER": {
      if (state.phase !== "management") return state;
      if (checkVictory(state)) return { ...state, phase: "victory" };
      const before = state.metrics;
      const engineResult = runCityEngine(state);
      const actionsThisTurn = state.executedActions
        .filter((item) => item.turn === state.turn)
        .map((item) => CIVIC_ACTIONS.find((actionItem) => actionItem.id === item.id))
        .filter(Boolean);
      const operations = runCivicOperationsQuarter({
        ...state,
        metrics: engineResult.metrics,
      }, actionsThisTurn);
      const campaign = campaignQuarterUpdate({
        ...state,
        metrics: operations.metrics,
        activeProjects: operations.activeProjects,
        completedProjects: operations.completedProjects,
        failedProjects: operations.failedProjects,
        activePolicies: operations.activePolicies,
        cityBacklogs: operations.cityBacklogs,
        civicRecord: operations.civicRecord,
      }, operations.metrics, actionsThisTurn);
      const councilEvent = selectEvent(PLAYABLE_COUNCIL_EVENTS, state.turn, state.usedCouncilIds);
      const nextBase = {
        ...state,
        phase: councilEvent ? "council_session" : "city_resolve",
        metrics: campaign.metrics,
        activeProjects: operations.activeProjects,
        completedProjects: operations.completedProjects,
        failedProjects: operations.failedProjects,
        activePolicies: operations.activePolicies,
        civicRecord: operations.civicRecord,
        residentProblems: campaign.residentProblems,
        cityBacklogs: campaign.cityBacklogs,
        achievements: campaign.achievements,
        goals: campaign.goals,
        reactions: appendCampaignReactions({ reactions: campaign.reactions }, operations.reactions),
        currentCouncilEvent: councilEvent,
        usedCouncilIds: markUsed(state.usedCouncilIds, councilEvent),
        activeTab: "chronicle",
        resourceDeltas: computeDeltas(before, campaign.metrics),
        tutorial: state.turn === 1 ? completeTutorial(state.tutorial) : state.tutorial,
      };
      const quarterReports = [...engineResult.reports, ...operations.reports];
      const nextChronicle = quarterReports.reduce(
        (chronicle, line) => addChronicle(chronicle, line, nextBase, "system"),
        state.chronicle,
      );
      const next = { ...nextBase, chronicle: nextChronicle };
      const gameOverReason = checkGameOver(next);
      return gameOverReason ? { ...next, phase: "game_over", gameOverReason } : next;
    }

    case "SELECT_COUNCIL_OPTION":
      if (state.phase !== "council_session") return state;
      return chooseOption(state, state.currentCouncilEvent, action.payload?.optionIndex ?? 0, "city_resolve", "council");

    case "CONTINUE_TO_NEWS": {
      if (state.phase !== "city_resolve") return state;
      const newsEvent = selectEvent(PLAYABLE_NEWS_EVENTS, state.turn, state.usedNewsIds);
      return {
        ...state,
        phase: newsEvent ? "news_event" : "citizen_response",
        currentNewsEvent: newsEvent,
        usedNewsIds: markUsed(state.usedNewsIds, newsEvent),
      };
    }

    case "SELECT_NEWS_RESPONSE":
      if (state.phase !== "news_event") return state;
      return chooseOption(state, state.currentNewsEvent, action.payload?.optionIndex ?? 0, "citizen_response", "news");

    case "ADVANCE_QUARTER": {
      if (state.phase !== "citizen_response" && state.phase !== "city_resolve") return state;
      if (checkVictory(state)) return { ...state, phase: "victory" };
      const nextTurn = state.turn + 1;
      const { quarter, year } = turnToQuarterYear(nextTurn);
      const phase = checkVictory({ ...state, turn: nextTurn }) ? "victory" : "management";
      const nextBase = {
        ...state,
        phase,
        turn: nextTurn,
        quarter,
        year,
        activeTab: "dashboard",
        currentCouncilEvent: null,
        currentNewsEvent: null,
        resourceDeltas: {},
        tutorial: state.turn === 1 ? completeTutorial(state.tutorial) : state.tutorial,
      };
      const achievementResult = updateAchievements(nextBase.achievements, nextBase);
      const next = {
        ...nextBase,
        achievements: achievementResult.achievements,
        goals: createGoals({ ...nextBase, achievements: achievementResult.achievements }),
        reactions: appendCampaignReactions(nextBase, achievementResult.unlocked.map((achievement) => ({
          id: `reaction_${nextBase.turn}_${achievement.id}`,
          turn: nextBase.turn,
          type: "achievement",
          sentiment: "achievement",
          residentName: "Middletown",
          message: `Achievement unlocked: ${achievement.title}.`,
        }))),
      };
      return {
        ...next,
        chronicle: addChronicle(next.chronicle, "A new quarter begins. Department heads reset their binders, and the public remembers what changed.", next, "system"),
      };
    }

    case "DISMISS_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}
