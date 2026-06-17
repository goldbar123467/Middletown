const CORE_METRICS = ["budget", "trust", "services", "debt"];
const GOOD_METRICS = [
  "budget",
  "reserves",
  "trust",
  "services",
  "safety",
  "infrastructure",
  "housing",
  "economy",
  "health",
  "education",
  "mobility",
  "equity",
  "labor",
  "media",
];
const BAD_METRICS = ["debt"];

const METRIC_WEIGHTS = {
  budget: 0.35,
  reserves: 0.4,
  trust: 1.25,
  services: 1.25,
  safety: 0.85,
  infrastructure: 0.85,
  housing: 0.85,
  economy: 0.65,
  health: 0.7,
  education: 0.55,
  mobility: 0.55,
  equity: 0.55,
  labor: 0.45,
  media: 0.35,
  debt: -1.05,
};

const LABEL_TO_METRIC = {
  "Operating Budget": "budget",
  "Public Trust": "trust",
  "Service Quality": "services",
  "Debt Burden": "debt",
  Budget: "budget",
  Trust: "trust",
  Services: "services",
  Debt: "debt",
};

const DIFFICULTY_GATES = {
  easy: {
    label: "Easy",
    minScore: 65,
    minBudget: 1,
    minTrust: 30,
    minServices: 30,
    maxDebt: 80,
    shortAgency: 15,
    longAgency: 36,
  },
  normal: {
    label: "Normal",
    minScore: 70,
    minBudget: 1,
    minTrust: 35,
    minServices: 35,
    maxDebt: 70,
    shortAgency: 20,
    longAgency: 45,
  },
  hard: {
    label: "Hard",
    minScore: 68,
    minBudget: 1,
    minTrust: 32,
    minServices: 32,
    maxDebt: 88,
    shortAgency: 26,
    longAgency: 55,
  },
};

export function summarizeMetrics(metrics = {}) {
  return {
    money: Math.round(metrics.budget ?? 0),
    trust: Math.round(metrics.trust ?? 0),
    services: Math.round(metrics.services ?? 0),
    debt: Math.round(metrics.debt ?? 0),
  };
}

export function scoreMetrics(metrics = {}) {
  return Object.entries(METRIC_WEIGHTS).reduce((total, [key, weight]) => {
    const value = Number(metrics[key] ?? 0);
    return total + value * weight;
  }, 0);
}

export function scoreTransition({ before = {}, after = {} }) {
  const coreGain =
    (after.trust ?? 0) - (before.trust ?? 0) +
    (after.services ?? 0) - (before.services ?? 0) +
    ((before.debt ?? 0) - (after.debt ?? 0)) * 1.2 +
    ((after.budget ?? 0) - (before.budget ?? 0)) * 0.3;
  return Math.round((scoreMetrics(after) - scoreMetrics(before) + coreGain) * 100) / 100;
}

export function metricPressure(metrics = {}) {
  const pressures = GOOD_METRICS.map((key) => ({
    key,
    pressure: 100 - Number(metrics[key] ?? 50),
  }));
  pressures.push(...BAD_METRICS.map((key) => ({ key, pressure: Number(metrics[key] ?? 0) })));
  return pressures.sort((a, b) => b.pressure - a.pressure);
}

function scoreEffects(effects = {}, metrics = {}) {
  const pressure = Object.fromEntries(metricPressure(metrics).map((item, index) => [item.key, Math.max(1, 6 - index)]));
  let score = 0;

  for (const [key, rawValue] of Object.entries(effects)) {
    const value = Number(rawValue ?? 0);
    const polarity = BAD_METRICS.includes(key) ? -1 : 1;
    const weight = Math.abs(METRIC_WEIGHTS[key] ?? 0.35);
    score += value * polarity * weight * (pressure[key] ?? 1);
  }

  return Math.round(score * 100) / 100;
}

export function chooseAgendaAction({ metrics = {}, availableActions = [], usedActionIds = new Set() }) {
  const ranked = availableActions
    .filter((action) => action && !usedActionIds.has(action.id))
    .map((action) => {
      const expectedReward = scoreEffects(action.effects, metrics);
      const biggestEffect = Object.entries(action.effects ?? {})
        .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))[0];
      const target = biggestEffect?.[0] ?? metricPressure(metrics)[0]?.key ?? "trust";
      const actionValue = Math.max(0, 4 - Math.abs(Number(action.effects?.budget ?? 0)) * 0.25);
      return {
        ...action,
        expectedReward: Math.round((expectedReward + actionValue) * 100) / 100,
        reason: `Targets ${target}, keeps the public record active, and protects trust, services, money, and debt.`,
      };
    })
    .sort((a, b) => b.expectedReward - a.expectedReward);

  return ranked[0] ?? null;
}

export function parseMetricText(text = "") {
  const metrics = {};
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const [label, key] of Object.entries(LABEL_TO_METRIC)) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = text.match(new RegExp(`${escaped}\\s*([+-]?\\d+(?:\\.\\d+)?)`, "i"));
    if (match) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) {
        metrics[key] = value;
      }
    }
  }

  for (let index = 0; index < lines.length - 1; index += 1) {
    const key = LABEL_TO_METRIC[lines[index]];
    const value = Number(lines[index + 1]?.replace(/[^0-9.-]/g, ""));
    if (key && Number.isFinite(value)) {
      metrics[key] = value;
    }
  }

  return metrics;
}

export function scoreOptionText(text = "") {
  let score = 0;
  const effectRegex = /([A-Za-z ]+)\s+([+-]\d+)/g;
  for (const match of text.matchAll(effectRegex)) {
    const metric = LABEL_TO_METRIC[match[1].trim()] ?? match[1].trim().toLowerCase().replace(/\s+/g, "");
    const value = Number(match[2]);
    const polarity = BAD_METRICS.includes(metric) ? -1 : 1;
    score += value * polarity * Math.abs(METRIC_WEIGHTS[metric] ?? 0.5);
  }
  return score;
}

function gradeLetter(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function metricDeltaLine(label, startValue, finalValue, inverse = false) {
  const delta = Math.round((finalValue ?? 0) - (startValue ?? 0));
  const good = inverse ? delta <= 0 : delta >= 0;
  return `| ${label} | ${Math.round(startValue ?? 0)} | ${Math.round(finalValue ?? 0)} | ${delta >= 0 ? "+" : ""}${delta} | ${good ? "Good" : "Needs work"} |`;
}

function gateForDifficulty(difficulty = "normal") {
  return DIFFICULTY_GATES[difficulty] ?? DIFFICULTY_GATES.normal;
}

export function gradePlaythrough({ difficulty = "normal", turnsPlayed, requiredTurns = 4, startMetrics, finalMetrics, actions = [], events = [], projects = [], policies = [] }) {
  const gate = gateForDifficulty(difficulty);
  const trustDelta = (finalMetrics.trust ?? 0) - (startMetrics.trust ?? 0);
  const servicesDelta = (finalMetrics.services ?? 0) - (startMetrics.services ?? 0);
  const budgetDelta = (finalMetrics.budget ?? 0) - (startMetrics.budget ?? 0);
  const debtDelta = (finalMetrics.debt ?? 0) - (startMetrics.debt ?? 0);
  const survivalBonus = turnsPlayed >= 4 ? 20 : turnsPlayed * 4;
  const actionBonus = Math.min(22, actions.length * 1.5);
  const projectBonus = Math.min(12, projects.length * 3);
  const policyBonus = Math.min(8, policies.length * 2);
  const eventBonus = Math.min(10, events.length * 2);
  const agencyScore = Math.min(100, Math.round(
    (actions.length / Math.max(1, requiredTurns / 5)) * 45
    + (projects.length / 5) * 30
    + (policies.length / 3) * 15
    + Math.min(10, events.length / 10),
  ));
  const rawScore = 60 + trustDelta * 0.8 + servicesDelta * 0.8 + budgetDelta * 0.1 - debtDelta * 0.75 + survivalBonus + actionBonus + projectBonus + policyBonus + eventBonus;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const requiredAgency = requiredTurns >= 40 ? gate.longAgency : gate.shortAgency;
  const passed = turnsPlayed >= requiredTurns
    && score >= gate.minScore
    && agencyScore >= requiredAgency
    && (finalMetrics.budget ?? 0) >= gate.minBudget
    && (finalMetrics.trust ?? 0) >= gate.minTrust
    && (finalMetrics.services ?? 0) >= gate.minServices
    && (finalMetrics.debt ?? 0) <= gate.maxDebt;
  const letter = gradeLetter(score);

  const markdown = [
    "# Middletown RL Grading Sheet",
    "",
    `Final Grade: **${letter} (${score}/100)**`,
    `Result: **${passed ? "PASS" : "RETRY"}**`,
    `Difficulty: **${gate.label}**`,
    `Turns played: **${turnsPlayed}/${requiredTurns}**`,
    "",
    "## Difficulty Gates",
    "",
    "| Gate | Required | Actual |",
    "| --- | ---: | ---: |",
    `| Score | ${gate.minScore} | ${score} |`,
    `| Agency | ${requiredAgency} | ${agencyScore} |`,
    `| Operating Budget | ${gate.minBudget} | ${Math.round(finalMetrics.budget ?? 0)} |`,
    `| Public Trust | ${gate.minTrust} | ${Math.round(finalMetrics.trust ?? 0)} |`,
    `| Service Quality | ${gate.minServices} | ${Math.round(finalMetrics.services ?? 0)} |`,
    `| Debt Burden Max | ${gate.maxDebt} | ${Math.round(finalMetrics.debt ?? 0)} |`,
    "",
    "## Core Metrics",
    "",
    "| Metric | Start | Final | Delta | Judgment |",
    "| --- | ---: | ---: | ---: | --- |",
    metricDeltaLine("Operating Budget", startMetrics.budget, finalMetrics.budget),
    metricDeltaLine("Public Trust", startMetrics.trust, finalMetrics.trust),
    metricDeltaLine("Service Quality", startMetrics.services, finalMetrics.services),
    metricDeltaLine("Debt Burden", startMetrics.debt, finalMetrics.debt, true),
    "",
    "## RL Action Trace",
    "",
    actions.length
      ? actions.map((action) => `- Q${action.turn}: **${action.label}** (${action.expectedReward >= 0 ? "+" : ""}${action.expectedReward}) - ${action.reason}`).join("\n")
      : "- No agenda actions recorded.",
    "",
    "## Projects and Policies",
    "",
    projects.length ? projects.map((project) => `- Q${project.turn}: Project started - **${project.label}**`).join("\n") : "- No projects started.",
    "",
    policies.length ? policies.map((policy) => `- Q${policy.turn}: Policy adopted - **${policy.label}**`).join("\n") : "- No policies adopted.",
    "",
    "## Fun and Agency",
    "",
    `Agency Score: **${agencyScore}/100**`,
    `Visible agenda actions: **${actions.length}**`,
    `Capital projects started: **${projects.length}**`,
    `Policies adopted: **${policies.length}**`,
    "",
    "## Event Trace",
    "",
    events.length ? events.map((event) => `- Q${event.turn}: ${event.label}`).join("\n") : "- No event decisions recorded.",
    "",
    "## Agent Notes",
    "",
    "- Protect Public Trust and Service Quality first.",
    "- Avoid letting Debt Burden climb unless the chosen action clearly stabilizes core services.",
    "- Use `Choices` for visible actions, `Money` for budget levers, and `Run Quarter` to resolve the town.",
    "",
  ].join("\n");

  return { score, letter, passed, markdown };
}

export { CORE_METRICS, DIFFICULTY_GATES };
