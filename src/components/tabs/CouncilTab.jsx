import { CIVIC_ACTIONS, CIVIC_MICRO_ACTIONS } from "../../data/civicActions.js";
import { POLICIES } from "../../data/policies.js";
import { CAPITAL_PROJECTS } from "../../data/projects.js";
import EffectPreview from "../EffectPreview.jsx";

function cleanActionLabel(label) {
  return label.replace(/\s+initiative\s+\d+$/i, "");
}

function rotatingItems(items, start, count) {
  if (!items.length) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(start + index) % items.length]);
}

export default function CouncilTab({ state, dispatch }) {
  const executedIds = new Set(state.executedActions.map((action) => action.id));
  const unusedActions = CIVIC_ACTIONS.filter((action) => !executedIds.has(action.id));
  const actionPool = unusedActions.length >= 6 ? unusedActions : CIVIC_ACTIONS;
  const actionStart = ((state.turn - 1) * 3) % actionPool.length;
  const featured = rotatingItems(actionPool, actionStart, 6);
  const microStart = (state.turn - 1) % CIVIC_MICRO_ACTIONS.length;
  const smallWins = rotatingItems(CIVIC_MICRO_ACTIONS, microStart, 2);
  const activeProjectIds = new Set([...(state.activeProjects ?? []), ...(state.completedProjects ?? [])].map((project) => project.id));
  const projectPool = CAPITAL_PROJECTS.filter((project) => !activeProjectIds.has(project.id));
  const visibleProjects = rotatingItems(projectPool, ((state.turn - 1) * 2) % Math.max(1, projectPool.length), 3);
  const activePolicyIds = new Set((state.activePolicies ?? []).map((policy) => policy.id));
  const policyPool = POLICIES.filter((policy) => !activePolicyIds.has(policy.id));
  const visiblePolicies = rotatingItems(policyPool, (state.turn - 1) % Math.max(1, policyPool.length), 2);
  const recordsPressure = Math.max(0, (state.civicRecord?.publicRecordsRequests ?? 0) - (state.civicRecord?.auditsRun ?? 0) * 2);
  const emergencyCount = state.civicRecord?.emergencyDeclarations ?? 0;

  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Council Agenda</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-black mt-1">Pick a Few Moves</h2>
            <p className="muted-copy mt-1">Choose simple, visible actions. A resident reacts right away, then the quarter shows the deeper effect.</p>
          </div>
          <span className="status-chip">{state.executedActions.length} filed this term</span>
        </div>
      </div>

      <div className="panel p-5">
        <p className="section-kicker">Small Wins</p>
        <h2 className="text-xl font-black mt-1">No New Money, Real Tradeoffs</h2>
        <p className="muted-copy mt-1">These are cheap civic moves. They spend attention, staff time, or political patience instead of budget.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {smallWins.map((action) => (
          <article key={action.id} className="panel p-4 action-card">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="status-chip is-good">No budget cost</span>
                <span className="status-chip is-warm">{action.domain}</span>
                <span className="status-chip">{action.district}</span>
              </div>
              <h3 className="text-lg font-black mt-3">{action.label}</h3>
              <p className="text-sm mt-1 muted-copy">{action.summary}</p>
            </div>
            <EffectPreview effects={action.effects} compact limit={5} />
            <button className="btn btn-primary mt-auto" onClick={() => dispatch({ type: "EXECUTE_CIVIC_ACTION", payload: { actionId: action.id } })}>Put on Agenda</button>
          </article>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {featured.map((action) => (
          <article key={action.id} className="panel p-4 action-card">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="status-chip is-warm">{action.domain}</span>
                <span className="status-chip">{action.district}</span>
                {(action.cost ?? 0) >= 14 && <span className="status-chip">Risky swing</span>}
                {(action.effects?.budget ?? 0) === 0 && <span className="status-chip is-good">No budget cost</span>}
                {executedIds.has(action.id) && <span className="status-chip is-good">Filed</span>}
              </div>
              <h3 className="text-lg font-black mt-3">{cleanActionLabel(action.label)}</h3>
              <p className="text-sm mt-1 muted-copy">{action.summary}</p>
            </div>
            <EffectPreview effects={action.effects} compact limit={5} />
            <button className="btn btn-primary mt-auto" onClick={() => dispatch({ type: "EXECUTE_CIVIC_ACTION", payload: { actionId: action.id } })}>Put on Agenda</button>
          </article>
        ))}
      </div>

      <div className="panel p-5">
        <p className="section-kicker">Oversight Tools</p>
        <div className="grid gap-3 lg:grid-cols-2 mt-3">
          <article className="subtle-panel p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-chip is-warm">Audit</span>
              <span className="status-chip">{state.civicRecord?.auditsRun ?? 0} run</span>
              {recordsPressure > 0 && <span className="status-chip">Records pressure {recordsPressure}</span>}
            </div>
            <h3 className="text-lg font-black mt-3">Public Ledger Audit</h3>
            <p className="text-sm mt-1 muted-copy">Finance opens books before rumor math becomes the story.</p>
            <EffectPreview effects={{ budget: -2, trust: 2, media: 2, labor: -1 }} compact limit={4} />
            <button className="btn btn-quiet mt-3" onClick={() => dispatch({ type: "RUN_AUDIT" })}>Run Audit</button>
          </article>

          <article className="subtle-panel p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-chip is-warm">Emergency</span>
              <span className="status-chip">{emergencyCount} declared</span>
            </div>
            <h3 className="text-lg font-black mt-3">Emergency Declaration</h3>
            <p className="text-sm mt-1 muted-copy">A rare fast tool for snow, flood, outage, heat, or service triage.</p>
            <EffectPreview effects={{ budget: -4, emergencyReadiness: 6, services: 2, debt: 2, trust: -1 }} compact limit={5} />
            <button className="btn btn-quiet mt-3" onClick={() => dispatch({ type: "DECLARE_EMERGENCY" })}>Declare Emergency</button>
          </article>
        </div>
      </div>

      <div className="panel p-5">
        <p className="section-kicker">Capital Promises</p>
        <h2 className="text-xl font-black mt-1">Build Something Residents Can Point To</h2>
        <p className="muted-copy mt-1">Projects cost money and staff time now, then hit milestones or fail if neglected.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <article key={project.id} className="panel p-4 action-card">
            <div className="flex flex-wrap gap-2">
              <span className="status-chip is-warm">{project.domain}</span>
              <span className="status-chip">{project.district}</span>
              <span className="status-chip">Cost {project.cost}</span>
              <span className="status-chip">{project.duration} qtrs</span>
            </div>
            <div>
              <h3 className="text-lg font-black mt-3">{cleanActionLabel(project.name)}</h3>
              <p className="text-sm mt-1 muted-copy">{project.description}</p>
            </div>
            <button className="btn btn-primary mt-auto" onClick={() => dispatch({ type: "START_CAPITAL_PROJECT", payload: { projectId: project.id } })}>Start Project</button>
          </article>
        ))}
      </div>

      <div className="panel p-5">
        <p className="section-kicker">Standing Rules</p>
        <h2 className="text-xl font-black mt-1">Adopt a Policy</h2>
        <p className="muted-copy mt-1">Policies create recurring advantages and recurring upkeep. Somebody will like them, somebody will not.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {visiblePolicies.map((policy) => (
          <article key={policy.id} className="panel p-4 action-card">
            <div className="flex flex-wrap gap-2">
              <span className="status-chip is-warm">{policy.domain}</span>
              <span className="status-chip">Upkeep {policy.upkeep}</span>
            </div>
            <div>
              <h3 className="text-lg font-black mt-3">{cleanActionLabel(policy.name)}</h3>
              <p className="text-sm mt-1 muted-copy">{policy.description}</p>
            </div>
            <EffectPreview effects={policy.effects} compact limit={4} />
            <button className="btn btn-primary mt-auto" onClick={() => dispatch({ type: "ADOPT_POLICY", payload: { policyId: policy.id } })}>Adopt Policy</button>
          </article>
        ))}
      </div>
    </section>
  );
}
