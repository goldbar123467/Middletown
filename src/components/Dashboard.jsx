import { Landmark, Radio } from "lucide-react";
import { METRIC_CONFIG } from "../data/metrics.js";

const DASHBOARD_KEYS = ["budget", "trust", "services", "debt"];
const PHASE_STEPS = [
  { id: "management", label: "Mayor's Desk" },
  { id: "council_session", label: "Council" },
  { id: "city_resolve", label: "Staff Reports" },
  { id: "news_event", label: "News" },
  { id: "citizen_response", label: "Public Response" },
];

function Delta({ metricKey, value }) {
  if (!value) return null;
  const inverse = METRIC_CONFIG[metricKey]?.polarity === "inverse";
  const good = inverse ? value < 0 : value > 0;
  return <span className="metric-delta" style={{ color: good ? "var(--color-good)" : "var(--color-bad)" }}>{value > 0 ? "+" : ""}{value}</span>;
}

function phaseClass(stepIndex, currentIndex) {
  if (stepIndex === currentIndex) return "phase-step is-current";
  if (currentIndex > 0 && stepIndex < currentIndex) return "phase-step is-complete";
  return "phase-step";
}

export default function Dashboard({ state }) {
  const currentPhaseIndex = Math.max(0, PHASE_STEPS.findIndex((step) => step.id === state.phase));
  const population = Math.round(state.metrics.population).toLocaleString();

  return (
    <header className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-3">
          <span className="civic-seal is-small">
            <Landmark size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="section-kicker">Middletown City Hall</p>
            <div className="flex flex-wrap items-end gap-3">
            <h1 className="text-2xl font-black">Mayor's Desk</h1>
              <span className="status-chip is-warm">Q{state.turn} / {state.quarter}, Year {state.year}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="status-chip">{population} residents</span>
              <span className="status-chip">{state.difficultyConfig.label}</span>
              {state.turn === 1 && !state.tutorial?.completed && (
                <span className="status-chip is-warm">
                  <Radio size={14} aria-hidden="true" />
                  Resident tutorial active
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2">
          {DASHBOARD_KEYS.map((key) => {
            const config = METRIC_CONFIG[key];
            return (
              <div key={key} className="metric-tile">
                <div className="metric-tile-label">{config.label}</div>
                <div className="metric-tile-value">
                  {Math.round(state.metrics[key])}
                  <Delta metricKey={key} value={state.resourceDeltas[key]} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="phase-strip mt-3" aria-label="Quarter phase">
        {PHASE_STEPS.map((step, index) => (
          <div key={step.id} className={phaseClass(index, currentPhaseIndex)}>
            <span className="phase-dot" />
            <span className="text-xs font-bold">{step.label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
