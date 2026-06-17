import { DISTRICTS } from "../data/districts.js";
import { applyMetricEffects } from "./metricEngine.js";

const DISTRICT_NAMES = Object.fromEntries(DISTRICTS.map((district) => [district.id, district.name]));

const COUNCIL_BLOCS = {
  fiscal: {
    label: "Fiscal Watch bloc",
    domains: ["budget", "economy", "business"],
  },
  service: {
    label: "Service Delivery bloc",
    domains: ["safety", "infrastructure", "utilities", "services", "health", "emergency"],
  },
  neighborhood: {
    label: "Neighborhood Equity bloc",
    domains: ["housing", "equity", "mobility", "neighborhoods", "education", "youth", "seniors"],
  },
  growth: {
    label: "Growth and Jobs bloc",
    domains: ["economy", "business", "downtown", "environment", "labor"],
  },
};

const NEWS_OUTLETS = {
  accountability: {
    label: "Middletown Ledger",
    domains: ["budget", "equity", "communications"],
  },
  civic: {
    label: "Channel 7 Civic Desk",
    domains: ["safety", "health", "emergency", "services"],
  },
  neighborhood: {
    label: "Neighborhood Wire",
    domains: ["housing", "mobility", "education", "youth", "seniors"],
  },
  business: {
    label: "Courier Business Page",
    domains: ["economy", "business", "downtown", "labor"],
  },
};

export function civicMemoryDefaults(metrics = {}) {
  return {
    noAgendaStreak: 0,
    choicesFiled: 0,
    quartersWithActions: 0,
    projectsStarted: 0,
    projectsCompleted: 0,
    projectsFailed: 0,
    policiesAdopted: 0,
    policiesRepealed: 0,
    auditsRun: 0,
    emergencyDeclarations: 0,
    debtPeak: metrics.debt ?? 0,
    passiveQuarters: 0,
    staffVacancies: 0,
    publicProcess: 0,
    councilChoices: 0,
    newsChoices: 0,
    publicRecordsRequests: 0,
    laborNegotiations: 0,
    eventPatterns: {},
    districtMentions: {},
    domainMentions: {},
    councilBlocMemory: {},
    newsMemory: {},
  };
}

export function normalizeCivicRecord(state) {
  return {
    ...civicMemoryDefaults(state.metrics ?? {}),
    ...(state.civicRecord ?? {}),
    eventPatterns: { ...(state.civicRecord?.eventPatterns ?? {}) },
    districtMentions: { ...(state.civicRecord?.districtMentions ?? {}) },
    domainMentions: { ...(state.civicRecord?.domainMentions ?? {}) },
    councilBlocMemory: { ...(state.civicRecord?.councilBlocMemory ?? {}) },
    newsMemory: { ...(state.civicRecord?.newsMemory ?? {}) },
  };
}

function scoreEffects(effects = {}) {
  return Object.entries(effects).reduce((score, [key, value]) => {
    if (key === "debt") return score - value;
    if (key === "budget" && value < 0) return score + Math.round(value / 2);
    return score + value;
  }, 0);
}

function choicePattern(text = "") {
  const lower = text.toLowerCase();
  if (/\b(delay|wait|forecast|grant|verify|next quarter|hold)\b/.test(lower)) return "delay";
  if (/\b(broker|compromise|compact|public|council|share|process|stand with)\b/.test(lower)) return "process";
  if (/\b(move|authorize|release|show|name|immediate|quickly|now)\b/.test(lower)) return "fast";
  return "balanced";
}

function increment(map, key, amount = 1) {
  if (!key) return map;
  return {
    ...map,
    [key]: (map[key] ?? 0) + amount,
  };
}

function memoryKeyFor(collection, domain) {
  return Object.entries(collection).find(([, item]) => item.domains.includes(domain))?.[0] ?? Object.keys(collection)[0];
}

function councilBlocFor(event, option) {
  const optionKeys = Object.keys(option.effects ?? {});
  const domain = event?.domain ?? optionKeys.find((key) => key !== "budget" && key !== "debt");
  const key = memoryKeyFor(COUNCIL_BLOCS, domain);
  return { id: key, ...COUNCIL_BLOCS[key] };
}

function newsOutletFor(event, option) {
  const optionKeys = Object.keys(option.effects ?? {});
  const domain = event?.domain ?? optionKeys.find((key) => key !== "budget" && key !== "debt");
  const key = memoryKeyFor(NEWS_OUTLETS, domain);
  return { id: key, ...NEWS_OUTLETS[key] };
}

function memoryEffects({ source, pattern, score, record, districtCount, blocId, outletId }) {
  const effects = {};

  if (source === "council") {
    record.councilChoices += 1;
    if (pattern === "process") {
      record.publicProcess += 1;
      effects.trust = 1;
      effects.labor = -1;
    }
    if (pattern === "fast") {
      effects.services = 1;
      effects.labor = (effects.labor ?? 0) - 1;
    }
    if (pattern === "delay") {
      record.publicRecordsRequests += 1;
      effects.trust = -1;
      effects.media = -1;
    }
    if ((record.eventPatterns[pattern] ?? 0) >= 4 && pattern !== "process") {
      effects.media = (effects.media ?? 0) - 1;
    }
    if ((record.councilBlocMemory[blocId] ?? 0) <= -3) {
      effects.trust = (effects.trust ?? 0) - 1;
    }
  }

  if (source === "news") {
    record.newsChoices += 1;
    if (pattern === "delay" || score < -1) {
      record.publicRecordsRequests += 1;
      effects.media = -1;
    }
    if ((record.newsMemory[outletId] ?? 0) >= 4) {
      effects.media = (effects.media ?? 0) + 1;
      effects.trust = (effects.trust ?? 0) + 1;
    }
    if ((record.newsMemory[outletId] ?? 0) <= -3) {
      effects.media = (effects.media ?? 0) - 1;
      effects.trust = (effects.trust ?? 0) - 1;
    }
  }

  if (districtCount >= 4 && districtCount % 4 === 0) {
    effects.trust = (effects.trust ?? 0) + (score >= 0 ? 1 : -1);
  }

  return effects;
}

function explainMemory({ source, pattern, district, districtCount, domain, score, bloc, outlet }) {
  const place = DISTRICT_NAMES[district] ?? district ?? "Middletown";
  const actor = source === "news" ? outlet.label : bloc.label;
  const memory = score >= 0 ? "as evidence that City Hall can connect decisions to visible work" : "as another entry in the town's list of unresolved tradeoffs";
  return `Why this happened: ${actor} filed the ${pattern} choice ${memory}. ${place} has now shown up in the public record ${districtCount} time${districtCount === 1 ? "" : "s"} around ${domain ?? "city services"}.`;
}

export function recordCivicEventChoice(state, event, option, source = "event") {
  const record = normalizeCivicRecord(state);
  const pattern = choicePattern(option.text);
  const score = scoreEffects(option.effects);
  const direction = score >= 0 ? 1 : -1;
  const district = event?.district;
  const domain = event?.domain;
  const bloc = councilBlocFor(event, option);
  const outlet = newsOutletFor(event, option);

  record.eventPatterns = increment(record.eventPatterns, pattern);
  record.districtMentions = increment(record.districtMentions, district);
  record.domainMentions = increment(record.domainMentions, domain);
  record.councilBlocMemory = increment(record.councilBlocMemory, bloc.id, source === "council" ? direction : 0);
  record.newsMemory = increment(record.newsMemory, outlet.id, source === "news" ? direction : 0);

  const districtCount = district ? record.districtMentions[district] : 0;
  const effects = memoryEffects({
    source,
    pattern,
    score,
    record,
    districtCount,
    blocId: bloc.id,
    outletId: outlet.id,
  });
  const metrics = applyMetricEffects(state.metrics, effects);
  const actor = source === "news" ? outlet.label : bloc.label;

  return {
    metrics,
    civicRecord: record,
    effects,
    line: explainMemory({ source, pattern, district, districtCount, domain, score, bloc, outlet }),
    reaction: {
      id: `reaction_${state.turn}_${source}_memory_${event?.id ?? "event"}`,
      turn: state.turn,
      type: `${source}_memory`,
      sentiment: score >= 0 ? "win" : "worry",
      residentName: actor,
      message: `${actor} remembers this as a ${pattern} pattern, not a one-off quote.`,
    },
  };
}
