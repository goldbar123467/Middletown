import { METRIC_CONFIG } from "../data/metrics.js";

function metricLabel(key) {
  return METRIC_CONFIG[key]?.label ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function effectTone(key, value) {
  if (value === 0) return "is-neutral";
  const inverse = METRIC_CONFIG[key]?.polarity === "inverse";
  return inverse ? (value < 0 ? "is-good" : "is-bad") : value > 0 ? "is-good" : "is-bad";
}

export default function EffectPreview({ effects, limit = 4, compact = false }) {
  const entries = Object.entries(effects ?? {}).filter(([, value]) => value !== 0);

  if (!entries.length) {
    return (
      <div className={compact ? "effect-list is-compact" : "effect-list"}>
        <span className="effect-chip is-neutral">No visible shift</span>
      </div>
    );
  }

  const visible = entries.slice(0, limit);
  const hiddenCount = entries.length - visible.length;

  return (
    <div className={compact ? "effect-list is-compact" : "effect-list"}>
      {visible.map(([key, value]) => (
        <span key={key} className={`effect-chip ${effectTone(key, value)}`}>
          {metricLabel(key)} {value > 0 ? "+" : ""}{value}
        </span>
      ))}
      {hiddenCount > 0 && <span className="effect-chip is-neutral">+{hiddenCount} more</span>}
    </div>
  );
}
