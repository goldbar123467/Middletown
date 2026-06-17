import { endingForState } from "../engine/rules.js";
import { civicScore } from "../engine/metricEngine.js";

export default function VictoryScreen({ state, onPlayAgain }) {
  const title = endingForState(state);
  const score = civicScore(state.metrics);
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <section className="panel max-w-3xl p-8 text-center">
        <p className="section-kicker" style={{ color: "var(--color-good)" }}>25-Year Record</p>
        <h1 className="text-4xl font-black mt-2">{title}</h1>
        <p className="mt-3 muted-copy">
          Middletown finishes 100 quarters with a civic score of {score}. The town remembers not one decision, but the pattern of the whole administration.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {state.achievements?.filter((achievement) => achievement.unlocked).slice(0, 6).map((achievement) => (
            <span key={achievement.id} className="status-chip is-good">{achievement.title}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {["trust", "services", "budget", "housing", "infrastructure", "economy", "equity", "debt"].map((key) => (
            <div key={key} className="metric-tile">
              <div className="metric-tile-label uppercase">{key}</div>
              <div className="font-black text-xl">{Math.round(state.metrics[key])}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-6" onClick={onPlayAgain}>Run Again</button>
      </section>
    </main>
  );
}
