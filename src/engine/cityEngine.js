import { ENGINE_PARTS } from "../data/engineParts.js";
import { enginePartReport } from "../data/localFlavor.js";
import { applyMetricEffects, clampMetrics } from "./metricEngine.js";
import { budgetPressure } from "./budgetEngine.js";

function partWeight(part, state) {
  const dept = state.departments[part.department];
  const district = state.districts[part.district];
  const budgetFactor = dept ? Math.max(0.45, Math.min(1.35, (dept.budget ?? 10) / 10)) : 1;
  const trustFactor = district ? Math.max(0.65, Math.min(1.25, (district.trust ?? 55) / 55)) : 1;
  return budgetFactor * part.budgetSensitivity + trustFactor * part.trustSensitivity;
}

function scaleEffects(effects, weight, pressureScale) {
  const scaled = {};
  for (const [key, value] of Object.entries(effects)) {
    scaled[key] = Math.round(value * weight * pressureScale);
  }
  return scaled;
}

export function runCityEngine(state) {
  let metrics = { ...state.metrics };
  const reports = [];
  const reportCandidates = [];
  const pressure = budgetPressure(metrics, state.departments);
  const pressureScale = state.difficultyConfig?.pressureScale ?? 1;
  const turn = state.turn ?? 1;
  const year = Math.max(1, Math.ceil(turn / 4));
  const hardMode = state.difficulty === "hard";
  const annualVolatility = [0, 2, -2, 1, -3, 0, 2, -1][year % 8];
  const actTwoRevenueDip = turn >= 25 && turn <= 52 ? -4 : 0;
  const hardWinterDrag = turn >= 49 && turn <= 60 && state.quarter === "Winter" ? -7 : 0;
  const lateMaintenance = turn >= 65 ? -Math.min(6, Math.ceil((turn - 64) / 8)) : 0;
  const hardModeRevenueDrag = hardMode ? -8 : 0;
  const hardModeWinterDrag = hardMode && state.quarter === "Winter" ? -5 : 0;

  for (const part of ENGINE_PARTS) {
    const weight = partWeight(part, state);
    const effects = scaleEffects(part.effects, weight, pressureScale);
    metrics = applyMetricEffects(metrics, effects);
    const impact = Object.values(effects).reduce((sum, value) => sum + Math.abs(value), 0);
    if (part.priority >= 4 || impact >= 6) {
      reportCandidates.push({ impact, text: enginePartReport(part, effects, state) });
    }
  }

  reports.push(...reportCandidates
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 8)
    .map((item) => item.text));

  if (pressure.strained) {
    metrics = applyMetricEffects(metrics, {
      trust: -1,
      labor: -1,
      media: -1,
      reserves: -Math.min(3, Math.max(1, Math.ceil(Math.abs(pressure.gap) / 14))),
      debt: Math.abs(pressure.gap) > 25 ? 1 : 0,
    });
    reports.push("Budget pressure reached department desks; staff kept the basics moving, but reserves, debt, and public patience felt the squeeze.");
  } else {
    metrics = applyMetricEffects(metrics, {
      reserves: Math.min(2, Math.max(0, Math.floor(pressure.gap / 24))),
      trust: pressure.gap > 20 ? 1 : 0,
      debt: pressure.gap > 45 ? -1 : 0,
    });
    reports.push("The budget held together, but only visible choices turn fiscal room into a public story.");
  }

  const revenue = 62
    + Math.round(((metrics.economy ?? 50) + (metrics.business ?? 50) + (metrics.trust ?? 50)) / 24)
    + Math.round((metrics.reserves ?? 0) / 24)
    - Math.round((metrics.debt ?? 0) / 22)
    + annualVolatility
    + actTwoRevenueDip
    + hardWinterDrag
    + lateMaintenance
    + hardModeRevenueDrag
    + hardModeWinterDrag;
  const quarterlyBalance = revenue - pressure.spend;
  metrics.budget = Math.max(0, Math.min(220, metrics.budget + Math.max(-13, Math.min(5, quarterlyBalance))));
  if (annualVolatility || actTwoRevenueDip || hardWinterDrag || lateMaintenance || hardModeRevenueDrag || hardModeWinterDrag) {
    reports.push(`Revenue conditions shifted by ${annualVolatility + actTwoRevenueDip + hardWinterDrag + lateMaintenance + hardModeRevenueDrag + hardModeWinterDrag}; the town can feel the wider economy under City Hall's ledger.`);
  }
  if (hardMode && turn % 4 === 0) {
    metrics = applyMetricEffects(metrics, {
      budget: -4,
      trust: -1,
      labor: -1,
      services: -1,
      debt: 1,
    });
    reports.push("Bad Winter difficulty added annual wage, salt, overtime, and service pressure before the mayor could declare victory over the ledger.");
  }
  if (hardMode && metrics.budget > 115) {
    const contingencySpend = Math.min(9, Math.max(2, Math.ceil((metrics.budget - 105) / 12)));
    metrics = applyMetricEffects(metrics, {
      budget: -contingencySpend,
      emergencyReadiness: contingencySpend >= 5 ? 1 : 0,
      infrastructure: contingencySpend >= 7 ? 1 : 0,
    });
    reports.push(`Bad Winter contingency spending absorbed ${contingencySpend} budget points for salt, overtime, detours, and backup service plans.`);
  }
  if (pressure.rawSpend < 90) {
    metrics = applyMetricEffects(metrics, {
      services: -2,
      labor: -1,
      trust: -1,
    });
    reports.push("Lean department budgets created staff vacancies and slower service; saving money still has a public cost.");
  }
  if (metrics.budget > 55 && metrics.debt > 12) {
    const paydown = Math.min(4, Math.max(1, Math.ceil((metrics.debt ?? 0) / 30)), Math.max(0, metrics.debt - 12));
    if (paydown > 0) {
      metrics = applyMetricEffects(metrics, {
        budget: -paydown,
        debt: -paydown,
      });
      reports.push("Finance paid down a manageable slice of debt; the city can control the burden, but not erase it for free.");
    }
  }
  if (metrics.budget > 115 && metrics.debt > 12) {
    const paydown = Math.min(5, Math.max(1, Math.floor((metrics.budget - 95) / 18)), Math.max(0, metrics.debt - 12));
    if (paydown > 0) {
      metrics = applyMetricEffects(metrics, {
        budget: -paydown * 2,
        debt: -paydown,
        trust: paydown >= 4 ? 1 : 0,
      });
      reports.push("The city paid down a little old debt, but debt no longer vanishes just because one quarter looks clean.");
    }
  }
  if (turn >= 65 && metrics.budget > 115) {
    const catchUpMaintenance = Math.min(8, Math.max(1, Math.ceil((metrics.budget - 110) / 12)));
    metrics = applyMetricEffects(metrics, {
      budget: -catchUpMaintenance,
      services: 1,
      infrastructure: 1,
    });
    reports.push(`Deferred maintenance absorbed ${catchUpMaintenance} budget points; healthy ledgers still have pipes, roofs, and vehicles waiting for work.`);
  }
  if (turn >= 70 && (metrics.trust ?? 0) > 96 && (metrics.services ?? 0) > 96) {
    metrics = applyMetricEffects(metrics, {
      budget: -2,
      trust: -1,
      services: -1,
    });
    reports.push("High expectations became their own pressure: a town with excellent services notices smaller delays and asks why surplus is not already work.");
  }
  if (metrics.budget < 18) {
    metrics = applyMetricEffects(metrics, {
      reserves: -2,
      trust: -1,
      debt: 1,
    });
    reports.push("Cash is thin enough that every new promise feels risky, but the city still has room to recover.");
  }
  if (metrics.debt > 68 && metrics.budget > 18) {
    const restructure = Math.min(16, Math.max(5, metrics.debt - 63));
    metrics = applyMetricEffects(metrics, {
      debt: -restructure,
      budget: -Math.ceil(restructure / 3),
      trust: -1,
      services: -1,
    });
    reports.push("Debt pressure forced a restructuring move: the burden came down, but the public felt the budget and service tradeoff.");
  }
  metrics.population = Math.max(85000, Math.min(130000, Math.round(metrics.population + (metrics.economy - 50) * 8 + (metrics.housing - 50) * 6)));

  return {
    metrics: clampMetrics(metrics),
    reports,
  };
}
