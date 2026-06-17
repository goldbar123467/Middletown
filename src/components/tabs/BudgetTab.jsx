import { departmentBudgetTotal } from "../../engine/budgetEngine.js";

const STARTER_DEPARTMENTS = ["mayor", "finance", "police", "fire", "publicWorks", "housing"];

export default function BudgetTab({ state, dispatch }) {
  const total = departmentBudgetTotal(state.departments);
  const balance = Math.round(state.metrics.budget - total);
  const visibleDepartments = STARTER_DEPARTMENTS.map((id) => state.departments[id]).filter(Boolean);

  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Finance Office</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-black mt-1">Move Money Where It Matters</h2>
            <p className="muted-copy mt-1">A short starter budget. Raise or lower a few big levers, then run the quarter.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="status-chip is-warm">Operating {Math.round(state.metrics.budget)}</span>
            <span className={balance >= 0 ? "status-chip is-good" : "status-chip is-bad"}>Balance {balance}</span>
            <span className="status-chip">Allocated {total}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleDepartments.map((dept) => (
          <article key={dept.id} className="panel p-4 action-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">{dept.domain}</p>
                <h3 className="text-lg font-black mt-1">{dept.name}</h3>
                <p className="text-sm muted-copy">{dept.director}</p>
              </div>
              <label className="grid gap-1 text-right">
                <span className="text-xs muted-copy">Budget</span>
                <input
                  aria-label={dept.name + " budget"}
                  type="number"
                  min="0"
                  value={dept.budget}
                  onChange={(event) => dispatch({ type: "SET_DEPARTMENT_BUDGET", payload: { departmentId: dept.id, budget: Number(event.target.value) } })}
                  className="input-field w-24 text-right font-black"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="subtle-panel p-2">
                <span className="text-xs muted-copy">Staffing</span>
                <strong className="block">{dept.staffing}</strong>
              </div>
              <div className="subtle-panel p-2">
                <span className="text-xs muted-copy">Expectation</span>
                <strong className="block">{dept.publicExpectation}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
