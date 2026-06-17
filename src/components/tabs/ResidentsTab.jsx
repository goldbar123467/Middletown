import { RESIDENTS } from "../../data/residents.js";
import { residentProblemSummary } from "../../engine/residentProblemEngine.js";

export default function ResidentsTab({ state }) {
  const problems = state?.residentProblems ?? [];
  const summary = residentProblemSummary(problems);
  const activeProblems = problems.filter((problem) => problem.status !== "solved");
  const oldestProblem = [...activeProblems].sort((a, b) => {
    const aPct = a.progress / a.duration;
    const bPct = b.progress / b.duration;
    if (aPct !== bPct) return aPct - bPct;
    return b.duration - a.duration;
  })[0];
  const urgentProblem = [...activeProblems].sort((a, b) => {
    const aRemaining = a.duration - a.progress;
    const bRemaining = b.duration - b.progress;
    return aRemaining - bRemaining;
  })[0];
  const visibleProblems = problems
    .filter((problem) => problem.status !== "solved")
    .sort((a, b) => {
      const aRemaining = a.duration - a.progress;
      const bRemaining = b.duration - b.progress;
      if (aRemaining !== bRemaining) return aRemaining - bRemaining;
      return b.progress - a.progress;
    })
    .slice(0, 6);
  const residentById = new Map(RESIDENTS.map((resident) => [resident.id, resident]));

  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Public Voices</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-black mt-1">Resident Problems</h2>
            <p className="muted-copy mt-1">Every resident starts with a problem. The board shows a small active slice.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="status-chip is-good">{summary.solved} solved</span>
            <span className="status-chip is-warm">{summary.active} active</span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {oldestProblem && (
          <article className="subtle-panel p-4">
            <p className="section-kicker">Oldest Unresolved</p>
            <h3 className="text-lg font-black mt-2">{oldestProblem.title}</h3>
            <p className="text-sm muted-copy mt-1">{oldestProblem.residentName} in {oldestProblem.district} has only reached {Math.round((oldestProblem.progress / oldestProblem.duration) * 100)}% progress.</p>
          </article>
        )}
        {urgentProblem && (
          <article className="subtle-panel p-4">
            <p className="section-kicker">Most Urgent</p>
            <h3 className="text-lg font-black mt-2">{urgentProblem.title}</h3>
            <p className="text-sm muted-copy mt-1">{urgentProblem.residentName} has {urgentProblem.duration - urgentProblem.progress} quarters left before patience runs out.</p>
          </article>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleProblems.map((problem) => {
          const resident = residentById.get(problem.residentId);
          const pct = Math.round((problem.progress / problem.duration) * 100);
          return (
          <article key={problem.id} className="panel p-4 action-card">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="status-chip is-warm">{problem.priority}</span>
                <span className="status-chip">{problem.district}</span>
                <span className="status-chip">{problem.duration - problem.progress} qtrs left</span>
              </div>
              <h3 className="text-lg font-black mt-3">{problem.residentName}</h3>
              <p className="text-sm capitalize muted-copy">{resident?.occupation}</p>
              <strong className="block mt-3">{problem.title}</strong>
              <p className="text-sm mt-3 leading-relaxed">{problem.problem}</p>
            </div>
            <div className="grid gap-2">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="muted-copy">Progress</span>
                  <strong>{pct}%</strong>
                </div>
                <div className="meter-track mt-1"><div className="meter-fill" style={{ width: `${pct}%`, background: "var(--color-good)" }} /></div>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
