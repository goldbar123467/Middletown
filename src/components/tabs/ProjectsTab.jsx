import { CAPITAL_PROJECTS } from "../../data/projects.js";

function cleanProjectName(name) {
  return name.replace(/\s+project$/i, " project").replace(/^./, (letter) => letter.toUpperCase());
}

export default function ProjectsTab({ state, dispatch }) {
  const activeIds = new Set([...(state?.activeProjects ?? []), ...(state?.completedProjects ?? [])].map((project) => project.id));
  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Capital Planning</p>
        <h2 className="text-xl font-black mt-1">Project Shelf</h2>
        <p className="muted-copy mt-1">Longer horizon improvements competing for money, staff, and public attention.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {CAPITAL_PROJECTS.slice(0, 20).map((project) => (
          <article key={project.id} className="panel p-4 action-card">
            <div className="flex flex-wrap gap-2">
              <span className="status-chip is-warm">{project.domain}</span>
              <span className="status-chip">{project.district}</span>
              <span className="status-chip">Cost {project.cost}</span>
              <span className="status-chip">{project.duration} quarters</span>
            </div>
            <div>
              <h3 className="text-lg font-black">{cleanProjectName(project.name)}</h3>
              <p className="text-sm mt-1 muted-copy">{project.description}</p>
            </div>
            <button
              className="btn btn-primary mt-auto"
              disabled={activeIds.has(project.id)}
              onClick={() => dispatch?.({ type: "START_CAPITAL_PROJECT", payload: { projectId: project.id } })}
            >
              {activeIds.has(project.id) ? "In Public Record" : "Start Project"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
