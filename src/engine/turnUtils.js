import { QUARTERS } from "../config/cityConfig.js";

export function turnToQuarterYear(turn) {
  const zero = turn - 1;
  return {
    quarter: QUARTERS[zero % QUARTERS.length],
    year: Math.floor(zero / QUARTERS.length) + 1,
  };
}

export function addChronicle(chronicle, text, state, type = "system") {
  return [
    ...chronicle,
    {
      text,
      type,
      turn: state.turn,
      quarter: state.quarter,
      year: state.year,
    },
  ];
}

export function computeDeltas(before, after) {
  const deltas = {};
  for (const key of Object.keys(after)) {
    deltas[key] = (after[key] ?? 0) - (before[key] ?? 0);
  }
  return deltas;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
