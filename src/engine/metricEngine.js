import { METRIC_CONFIG } from "../data/metrics.js";
import { clamp } from "./turnUtils.js";

export function clampMetrics(metrics) {
  const next = {};
  for (const [key, config] of Object.entries(METRIC_CONFIG)) {
    const value = Number(metrics[key]);
    next[key] = clamp(Number.isFinite(value) ? value : config.start, config.min, config.max);
  }
  return next;
}

export function applyMetricEffects(metrics, effects = {}) {
  const next = { ...metrics };
  for (const [key, delta] of Object.entries(effects)) {
    if (!Object.hasOwn(METRIC_CONFIG, key)) continue;
    const amount = Number(delta);
    if (!Number.isFinite(amount)) continue;
    const current = Number(next[key]);
    next[key] = (Number.isFinite(current) ? current : METRIC_CONFIG[key].start) + amount;
  }
  return clampMetrics(next);
}

export function civicScore(metrics) {
  const qualityKeys = Object.keys(METRIC_CONFIG).filter((key) => key !== "population" && key !== "budget" && key !== "reserves" && key !== "debt");
  const quality = qualityKeys.reduce((sum, key) => sum + (metrics[key] ?? 0), 0) / qualityKeys.length;
  const fiscal = Math.min(100, Math.max(0, (metrics.budget ?? 0) * 0.45 + (metrics.reserves ?? 0) * 0.8 - (metrics.debt ?? 0) * 0.6));
  return Math.round(quality * 0.7 + fiscal * 0.3);
}

export function metricStatus(value, inverse = false) {
  const score = inverse ? 100 - value : value;
  if (score >= 72) return "strong";
  if (score >= 48) return "strained";
  return "critical";
}
