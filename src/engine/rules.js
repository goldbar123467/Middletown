import { MAX_TURNS } from "../config/cityConfig.js";
import { civicScore } from "./metricEngine.js";

export function checkGameOver(state) {
  const m = state.metrics;
  if ((m.trust ?? 0) <= 0) return "trust_collapse";
  if ((m.budget ?? 0) <= 0 && (m.reserves ?? 0) <= 0) return "insolvent";
  if ((m.services ?? 0) <= 10 && (m.safety ?? 0) <= 10) return "service_failure";
  return null;
}

export function checkVictory(state) {
  return state.turn > MAX_TURNS;
}

export function endingForState(state) {
  const score = civicScore(state.metrics);
  const m = state.metrics;
  const record = state.civicRecord ?? {};
  if ((record.passiveQuarters ?? 0) >= 30) return "The Passive Administrator";
  if ((m.debt ?? 0) <= 18 && (m.budget ?? 0) >= 80 && (record.choicesFiled ?? 0) >= 12) return "The Budget Hawk";
  if ((record.publicProcess ?? 0) >= 24 && (m.trust ?? 0) >= 68) return "The Public Process Mayor";
  if ((record.projectsCompleted ?? 0) >= 5 && m.infrastructure >= 70) return "The Builder of Middletown";
  if (m.services >= 82 && m.safety >= 70 && (record.staffVacancies ?? 0) < 5) return "The Services Mayor";
  if ((state.residentProblems ?? []).filter((problem) => problem.status === "solved").length >= 700 && m.neighborhoods >= 70) return "The Neighborhood Mayor";
  if (score >= 75 && m.trust >= 70) return "The Trusted Mayor";
  if (m.economy >= 78 && m.business >= 75) return "The Boomtown Mayor";
  if (m.emergencyReadiness >= 75) return "The Crisis Mayor";
  if (score >= 58) return "The Good Enough Mayor";
  return "The Hollow Victory";
}
