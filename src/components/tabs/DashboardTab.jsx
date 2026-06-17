import Meter from "../Meter.jsx";
import VoiceLogPanel from "../VoiceLogPanel.jsx";
import GoalBoard from "../GoalBoard.jsx";
import ReactionFeed from "../ReactionFeed.jsx";
import { METRIC_CONFIG } from "../../data/metrics.js";

const HEADLINE_KEYS = ["trust", "services", "budget", "debt"];

export default function DashboardTab({ state, dispatch }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="page-stack">
        <GoalBoard goals={state.goals} achievements={state.achievements} />
        {state.turn === 1 && <VoiceLogPanel tutorial={state.tutorial} dispatch={dispatch} />}
        <section className="panel p-5">
          <p className="section-kicker">How to Play</p>
          <h2 className="text-xl font-black mt-1">Three Moves, Then Run the Quarter</h2>
          <div className="simple-steps mt-4">
            <div>
              <strong>1. Hear the town</strong>
              <span>Tap a resident voice log.</span>
            </div>
            <div>
              <strong>2. Pick a choice</strong>
              <span>Use Choices or Money to make a simple move.</span>
            </div>
            <div>
              <strong>3. Run Quarter</strong>
              <span>Watch trust, services, money, and debt shift.</span>
            </div>
          </div>
        </section>
      </div>
      <div className="page-stack">
        <section className="panel p-5">
          <p className="section-kicker">Mayor's Briefing</p>
          <h2 className="text-xl font-black mt-1">What Matters This Quarter</h2>
          <p className="mt-2 muted-copy">
            Keep the town solvent, trusted, and basically working. That is the game.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mt-5">
            {HEADLINE_KEYS.map((key) => (
              <div key={key} className="dashboard-signal">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold muted-copy">{METRIC_CONFIG[key].label}</span>
                  <strong className="text-2xl">{Math.round(state.metrics[key])}</strong>
                </div>
                <Meter label="Current" value={state.metrics[key]} max={METRIC_CONFIG[key].max} inverse={METRIC_CONFIG[key].polarity === "inverse"} />
              </div>
            ))}
          </div>
        </section>
        <ReactionFeed reactions={state.reactions} />
      </div>
    </div>
  );
}
