export default function DepartmentsTab({ state }) {
  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Department Cabinet</p>
        <h2 className="text-xl font-black mt-1">City Hall Capacity</h2>
        <p className="muted-copy mt-1">Directors, staffing pressure, and resident expectations across municipal operations.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Object.values(state.departments).map((dept) => (
          <article key={dept.id} className="panel p-4 action-card">
            <div>
              <p className="section-kicker">{dept.domain}</p>
              <div className="flex items-start justify-between gap-3 mt-1">
                <div>
                  <h3 className="text-lg font-black">{dept.name}</h3>
                  <p className="text-sm muted-copy">{dept.director}</p>
                </div>
                <span className="status-chip is-warm">Budget {dept.budget}</span>
              </div>
              <p className="text-sm mt-3 muted-copy">{dept.briefing}</p>
            </div>
            <div className="grid gap-3">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="muted-copy">Staffing</span>
                  <strong>{dept.staffing}</strong>
                </div>
                <div className="meter-track mt-1"><div className="meter-fill" style={{ width: `${dept.staffing}%`, background: "var(--color-good)" }} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="muted-copy">Public expectation</span>
                  <strong>{dept.publicExpectation}</strong>
                </div>
                <div className="meter-track mt-1"><div className="meter-fill" style={{ width: `${dept.publicExpectation}%`, background: "var(--color-warn)" }} /></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
