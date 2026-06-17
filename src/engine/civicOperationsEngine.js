import { DISTRICT_FLAGSHIP_ISSUES } from "../data/campaign.js";
import { overOptimizationReport } from "../data/localFlavor.js";
import { CAPITAL_PROJECTS } from "../data/projects.js";
import { POLICIES } from "../data/policies.js";
import { applyMetricEffects, clampMetrics } from "./metricEngine.js";
import { civicMemoryDefaults, normalizeCivicRecord } from "./civicMemoryEngine.js";

function projectById(projectId) {
  return CAPITAL_PROJECTS.find((project) => project.id === projectId);
}

function policyById(policyId) {
  return POLICIES.find((policy) => policy.id === policyId);
}

function clampBacklog(value) {
  return Math.max(0, Math.round(value ?? 0));
}

function domainEffects(domain, amount) {
  const effects = {
    trust: Math.max(1, Math.floor(amount / 2)),
    services: amount,
  };
  if (domain) {
    effects[domain] = (effects[domain] ?? 0) + amount + 1;
  }
  if (["infrastructure", "utilities", "mobility", "emergency"].includes(domain)) {
    effects.infrastructure = (effects.infrastructure ?? 0) + 2;
  }
  if (["housing", "health", "equity"].includes(domain)) {
    effects.neighborhoods = (effects.neighborhoods ?? 0) + 1;
  }
  return effects;
}

function projectPotholeRepair(project) {
  if (!project) return 0;
  if (["infrastructure", "utilities", "mobility"].includes(project.domain)) return 12;
  if (["safety", "emergency", "environment"].includes(project.domain)) return 6;
  return 2;
}

function updateDistrictPotholes(districtPotholes = {}, project, repair) {
  const district = project?.district;
  if (!district || repair <= 0) return districtPotholes;
  return {
    ...districtPotholes,
    [district]: clampBacklog((districtPotholes[district] ?? 0) - repair),
  };
}

function districtIssueLine(project) {
  const issue = DISTRICT_FLAGSHIP_ISSUES[project.district];
  if (!issue) return `${project.name} moved from shelf talk into public work.`;
  return `${project.name} now answers ${project.district}'s recurring issue: ${issue.title}.`;
}

function civicRecord(state) {
  return {
    ...civicMemoryDefaults(state.metrics ?? {}),
    ...normalizeCivicRecord(state),
  };
}

export function startCapitalProject(state, projectId) {
  const project = projectById(projectId);
  if (!project) return null;
  const alreadyKnown = [...(state.activeProjects ?? []), ...(state.completedProjects ?? [])]
    .some((item) => item.id === project.id);
  if (alreadyKnown) return null;

  const upfrontCost = Math.max(3, Math.ceil(project.cost / 4));
  const metrics = applyMetricEffects(state.metrics, {
    budget: -upfrontCost,
    labor: -1,
    trust: 1,
    debt: project.cost >= 24 ? 1 : 0,
  });
  const activeProject = {
    id: project.id,
    name: project.name,
    domain: project.domain,
    district: project.district,
    cost: project.cost,
    duration: project.duration,
    remaining: project.duration,
    progress: 0,
    status: "active",
    startedTurn: state.turn,
    neglected: 0,
    nextMilestone: Math.max(1, Math.ceil(project.duration / 2)),
  };
  const nextRecord = civicRecord(state);
  nextRecord.projectsStarted += 1;
  nextRecord.noAgendaStreak = 0;

  return {
    metrics,
    activeProject,
    civicRecord: nextRecord,
    reaction: {
      id: `reaction_${state.turn}_project_${project.id}`,
      turn: state.turn,
      type: "project",
      sentiment: "win",
      residentName: project.district,
      message: `${project.name} started. Residents can now watch a visible promise move quarter by quarter.`,
    },
    line: `${project.name} leaves the project shelf with an upfront cost of ${upfrontCost} and a ${project.duration}-quarter public schedule.`,
  };
}

export function adoptPolicy(state, policyId) {
  const policy = policyById(policyId);
  if (!policy) return null;
  if ((state.activePolicies ?? []).some((item) => item.id === policy.id)) return null;

  const metrics = applyMetricEffects(state.metrics, {
    ...policy.effects,
    budget: (policy.effects.budget ?? 0) - policy.upkeep,
    trust: (policy.effects.trust ?? 0) + 1,
    labor: (policy.effects.labor ?? 0) - 1,
  });
  const nextRecord = civicRecord(state);
  nextRecord.policiesAdopted += 1;
  nextRecord.publicProcess += 1;
  nextRecord.noAgendaStreak = 0;

  return {
    metrics,
    activePolicy: {
      id: policy.id,
      name: policy.name,
      domain: policy.domain,
      upkeep: policy.upkeep,
      adoptedTurn: state.turn,
      status: "active",
    },
    civicRecord: nextRecord,
    reaction: {
      id: `reaction_${state.turn}_policy_${policy.id}`,
      turn: state.turn,
      type: "policy",
      sentiment: "win",
      residentName: "Council Clerk",
      message: `${policy.name} is now standing policy. It will help some residents and create upkeep every quarter.`,
    },
    line: `Council adopts ${policy.name}; the rule now changes future quarters instead of staying a binder note.`,
  };
}

export function repealPolicy(state, policyId) {
  const activePolicy = (state.activePolicies ?? []).find((item) => item.id === policyId);
  const policy = policyById(policyId);
  if (!activePolicy || !policy) return null;

  const nextRecord = civicRecord(state);
  nextRecord.policiesRepealed += 1;
  nextRecord.publicProcess += 1;

  return {
    activePolicies: (state.activePolicies ?? []).filter((item) => item.id !== policyId),
    metrics: applyMetricEffects(state.metrics, { trust: -1, budget: Math.max(1, policy.upkeep), media: -1 }),
    civicRecord: nextRecord,
    reaction: {
      id: `reaction_${state.turn}_repeal_${policy.id}`,
      turn: state.turn,
      type: "policy",
      sentiment: "worry",
      residentName: "Council Clerk",
      message: `${policy.name} was repealed. Supporters feel the reversal immediately; the budget gets a little room back.`,
    },
    line: `Council repeals ${policy.name}; the city saves upkeep but spends public trust on the reversal.`,
  };
}

export function runAudit(state) {
  const nextRecord = civicRecord(state);
  nextRecord.auditsRun += 1;
  nextRecord.publicProcess += 1;
  nextRecord.noAgendaStreak = 0;
  return {
    metrics: applyMetricEffects(state.metrics, { budget: -2, trust: 2, media: 2, labor: -1 }),
    civicRecord: nextRecord,
    reaction: {
      id: `reaction_${state.turn}_audit`,
      turn: state.turn,
      type: "audit",
      sentiment: "win",
      residentName: "Finance Office",
      message: "The audit costs staff time now, but residents get a cleaner explanation of what City Hall can prove.",
    },
    line: "Finance opens a public audit, trading staff time for trust and clearer budget facts.",
  };
}

export function declareEmergency(state) {
  const nextRecord = civicRecord(state);
  nextRecord.emergencyDeclarations += 1;
  nextRecord.noAgendaStreak = 0;
  return {
    metrics: applyMetricEffects(state.metrics, { budget: -4, emergencyReadiness: 6, services: 2, debt: 2, trust: -1 }),
    civicRecord: nextRecord,
    reaction: {
      id: `reaction_${state.turn}_emergency`,
      turn: state.turn,
      type: "emergency",
      sentiment: "worry",
      residentName: "Emergency Operations",
      message: "The emergency declaration unlocks capacity, but the town will remember the cost and the reason.",
    },
    line: "The mayor declares an emergency; capacity rises quickly, while debt and scrutiny follow.",
  };
}

function policyQuarterEffects(state) {
  const reports = [];
  let metrics = { ...state.metrics };
  for (const active of state.activePolicies ?? []) {
    const policy = policyById(active.id);
    if (!policy) continue;
    const scaled = Object.fromEntries(
      Object.entries(policy.effects ?? {}).map(([key, value]) => [key, Math.round(value * 0.35)]),
    );
    scaled.budget = (scaled.budget ?? 0) - policy.upkeep;
    metrics = applyMetricEffects(metrics, scaled);
    reports.push(`${policy.name}: standing policy shifted services by rule, not by one-time heroics.`);
  }
  return { metrics, reports };
}

function projectQuarterUpdate(state) {
  const reports = [];
  const reactions = [];
  const completedProjects = [...(state.completedProjects ?? [])];
  const failedProjects = [...(state.failedProjects ?? [])];
  const activeProjects = [];
  let metrics = { ...state.metrics };
  let cityBacklogs = { ...(state.cityBacklogs ?? {}) };
  let record = civicRecord(state);

  for (const active of state.activeProjects ?? []) {
    const project = projectById(active.id);
    if (!project) continue;
    const funded = (metrics.budget ?? 0) >= 18 && (metrics.labor ?? 0) >= 35;
    const progressStep = funded ? 1 : 0;
    const neglected = funded ? 0 : active.neglected + 1;
    const progress = active.progress + progressStep;
    const remaining = Math.max(0, active.duration - progress);

    if (!funded) {
      metrics = applyMetricEffects(metrics, { trust: -1, media: -1, services: -1 });
      reports.push(`${project.name} stalled because money or staff capacity was too thin to keep the public schedule honest.`);
    } else if (progress === active.nextMilestone && remaining > 0) {
      reports.push(`${project.name} hit a public milestone; residents can see the promise becoming work instead of a press release.`);
      reactions.push({
        id: `reaction_${state.turn}_milestone_${project.id}`,
        turn: state.turn,
        type: "project",
        sentiment: "win",
        residentName: project.district,
        message: `${project.name} reached a milestone in ${project.district}.`,
      });
    }

    if (neglected >= 3) {
      const failedProject = { ...active, status: "failed", failedTurn: state.turn, neglected };
      failedProjects.push(failedProject);
      record.projectsFailed += 1;
      metrics = applyMetricEffects(metrics, { trust: -3, services: -2, media: -2 });
      reports.push(`${project.name} failed after repeated neglect, turning a capital promise into a trust problem.`);
      reactions.push({
        id: `reaction_${state.turn}_failed_${project.id}`,
        turn: state.turn,
        type: "project",
        sentiment: "worry",
        residentName: project.district,
        message: `${project.name} failed after too many stalled quarters.`,
      });
      continue;
    }

    if (remaining <= 0) {
      const completedProject = { ...active, status: "complete", completedTurn: state.turn, progress: active.duration, remaining: 0 };
      completedProjects.push(completedProject);
      record.projectsCompleted += 1;
      const repair = projectPotholeRepair(project);
      cityBacklogs = {
        ...cityBacklogs,
        potholes: clampBacklog((cityBacklogs.potholes ?? 0) - repair),
        projectClearedPotholes: clampBacklog((cityBacklogs.projectClearedPotholes ?? 0) + repair),
        districtPotholes: updateDistrictPotholes(cityBacklogs.districtPotholes, project, repair),
      };
      metrics = applyMetricEffects(metrics, domainEffects(project.domain, 5));
      reports.push(`${districtIssueLine(project)} The completed work reduced the pothole backlog by ${repair}.`);
      reactions.push({
        id: `reaction_${state.turn}_complete_${project.id}`,
        turn: state.turn,
        type: "project",
        sentiment: "win",
        residentName: project.district,
        message: `${project.name} is complete. This is a win residents can point to.`,
      });
      continue;
    }

    activeProjects.push({
      ...active,
      progress,
      remaining,
      neglected,
    });
  }

  return { metrics, activeProjects, completedProjects, failedProjects, cityBacklogs, civicRecord: record, reports, reactions };
}

function applyNoAgendaDrift(state, actionsThisTurn) {
  const record = civicRecord(state);
  let metrics = { ...state.metrics };
  const reports = [];
  const reactions = [];
  const visibleOngoingWork = (state.activeProjects?.length ?? 0) > 0 || (state.activePolicies?.length ?? 0) > 0;

  if (actionsThisTurn.length > 0 || visibleOngoingWork) {
    record.noAgendaStreak = actionsThisTurn.length > 0 ? 0 : Math.max(0, record.noAgendaStreak - 1);
    record.choicesFiled += actionsThisTurn.length;
    if (actionsThisTurn.length > 0) {
      record.quartersWithActions += 1;
      record.publicProcess += 1;
    }
    return { metrics, civicRecord: record, reports, reactions };
  }

  record.noAgendaStreak += 1;
  record.passiveQuarters += 1;
  if (record.noAgendaStreak >= 2) {
    const penalty = Math.min(3, record.noAgendaStreak - 1);
    metrics = applyMetricEffects(metrics, { trust: -penalty, services: -1, media: -1 });
    reports.push("No mayor agenda reached the public this quarter. Staff kept working, but the term felt like drift.");
    reactions.push({
      id: `reaction_${state.turn}_no_agenda`,
      turn: state.turn,
      type: "drift",
      sentiment: "worry",
      residentName: "Middletown",
      message: "Residents noticed another quarter without a visible mayor agenda.",
    });
  }

  return { metrics, civicRecord: record, reports, reactions };
}

function applyCapacityPressure(state) {
  let metrics = { ...state.metrics };
  const reports = [];
  const record = civicRecord(state);

  if ((metrics.labor ?? 0) < 38) {
    record.staffVacancies += 1;
    metrics = applyMetricEffects(metrics, { services: -2, trust: -1, budget: -1 });
    reports.push("Staff vacancies turned low morale into slower service, even where the budget looked acceptable.");
  }
  if ((metrics.debt ?? 0) > record.debtPeak) {
    record.debtPeak = metrics.debt;
  }
  if ((metrics.debt ?? 0) > 0 && state.turn % 4 === 0) {
    const debtService = Math.min(3, Math.max(1, Math.ceil((metrics.debt ?? 0) / 35)));
    metrics = applyMetricEffects(metrics, { budget: -debtService, trust: debtService >= 3 ? -1 : 0 });
    reports.push(`Debt service quietly took ${debtService} budget points before any new promise reached council.`);
  }

  return { metrics, civicRecord: record, reports };
}

function applyLaborNegotiationPressure(state) {
  let metrics = { ...state.metrics };
  const reports = [];
  const reactions = [];
  const record = civicRecord(state);
  const inNegotiationWindow = (state.turn >= 28 && state.turn <= 36) || (state.turn >= 60 && state.turn <= 68);
  const pressureIsVisible = (metrics.labor ?? 0) < 52 || (record.staffVacancies ?? 0) >= 4 || (metrics.budget ?? 0) < 34;
  const scheduledQuarter = state.turn % 4 === 0;

  if (!inNegotiationWindow || (!pressureIsVisible && !scheduledQuarter)) {
    return { metrics, civicRecord: record, reports, reactions };
  }

  record.laborNegotiations += 1;
  if ((metrics.budget ?? 0) < 28) {
    metrics = applyMetricEffects(metrics, { labor: -3, services: -2, trust: -1, media: -1 });
    reports.push("Labor negotiations opened with too little fiscal room. Staff heard caution instead of capacity, and service speed suffered.");
    reactions.push({
      id: `reaction_${state.turn}_labor_impasse`,
      turn: state.turn,
      type: "labor",
      sentiment: "worry",
      residentName: "City Workers Local",
      message: "Labor talks stalled because the budget room was too thin to promise relief.",
    });
  } else {
    metrics = applyMetricEffects(metrics, { budget: -3, labor: 4, services: 1, trust: 1 });
    reports.push("Labor negotiations produced a modest staffing memo: the budget pays now so residents feel shorter waits later.");
    reactions.push({
      id: `reaction_${state.turn}_labor_memo`,
      turn: state.turn,
      type: "labor",
      sentiment: "win",
      residentName: "City Workers Local",
      message: "The staffing memo gave departments a little capacity and residents a reason to expect faster service.",
    });
  }

  return { metrics, civicRecord: record, reports, reactions };
}

function applyRecordsPressure(state) {
  let metrics = { ...state.metrics };
  const reports = [];
  const reactions = [];
  const record = civicRecord(state);
  const unansweredRecords = (record.publicRecordsRequests ?? 0) - (record.auditsRun ?? 0) * 2;

  if (unansweredRecords < 3 || state.turn % 6 !== 0) {
    return { metrics, civicRecord: record, reports, reactions };
  }

  metrics = applyMetricEffects(metrics, { trust: -1, media: -2, labor: -1, budget: -1 });
  reports.push("Unanswered public records requests became a story of their own. The paperwork is cheap until trust starts charging interest.");
  reactions.push({
    id: `reaction_${state.turn}_records_pressure`,
    turn: state.turn,
    type: "records",
    sentiment: "worry",
    residentName: "Records Desk",
    message: "Records requests are piling up faster than audits can answer them.",
  });

  return { metrics, civicRecord: record, reports, reactions };
}

function applyPassiveCaps(state) {
  let metrics = { ...state.metrics };
  const reports = [];
  const record = civicRecord(state);
  const recentVisibleWork = record.noAgendaStreak <= 1 || record.projectsCompleted >= 2 || record.policiesAdopted >= 2;

  if (!recentVisibleWork && (metrics.trust ?? 0) > 85) {
    metrics.trust = 85;
    reports.push("Public trust stopped rising on autopilot; residents need visible choices to believe the term is still active.");
  }
  if ((record.projectsCompleted ?? 0) < 2 && (metrics.services ?? 0) > 92) {
    metrics.services = 92;
    reports.push("Service quality hit the ceiling of routine operations; capital work is needed for the next jump.");
  }

  return { metrics: clampMetrics(metrics), reports };
}

export function runCivicOperationsQuarter(state, actionsThisTurn = []) {
  const policyResult = policyQuarterEffects(state);
  const noAgendaResult = applyNoAgendaDrift({ ...state, metrics: policyResult.metrics }, actionsThisTurn);
  const projectResult = projectQuarterUpdate({ ...state, metrics: noAgendaResult.metrics, civicRecord: noAgendaResult.civicRecord });
  const capacityResult = applyCapacityPressure({ ...state, metrics: projectResult.metrics, civicRecord: projectResult.civicRecord });
  const laborResult = applyLaborNegotiationPressure({ ...state, metrics: capacityResult.metrics, civicRecord: capacityResult.civicRecord });
  const recordsResult = applyRecordsPressure({ ...state, metrics: laborResult.metrics, civicRecord: laborResult.civicRecord });
  const capped = applyPassiveCaps({ ...state, metrics: recordsResult.metrics, civicRecord: recordsResult.civicRecord });
  const optimization = overOptimizationReport({ ...state, metrics: capped.metrics, civicRecord: recordsResult.civicRecord });
  const optimizationReaction = optimization ? {
    id: `reaction_${state.turn}_optimization`,
    turn: state.turn,
    ...optimization.reaction,
  } : null;

  return {
    metrics: optimization ? clampMetrics(applyMetricEffects(capped.metrics, optimization.effects)) : capped.metrics,
    activeProjects: projectResult.activeProjects,
    completedProjects: projectResult.completedProjects,
    failedProjects: projectResult.failedProjects,
    activePolicies: state.activePolicies ?? [],
    cityBacklogs: projectResult.cityBacklogs,
    civicRecord: recordsResult.civicRecord,
    reports: [
      ...policyResult.reports,
      ...noAgendaResult.reports,
      ...projectResult.reports,
      ...capacityResult.reports,
      ...laborResult.reports,
      ...recordsResult.reports,
      ...capped.reports,
      ...(optimization ? [optimization.report] : []),
    ],
    reactions: [
      ...noAgendaResult.reactions,
      ...projectResult.reactions,
      ...laborResult.reactions,
      ...recordsResult.reactions,
      ...(optimizationReaction ? [optimizationReaction] : []),
    ],
  };
}
