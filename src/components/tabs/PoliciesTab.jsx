import { POLICIES } from "../../data/policies.js";
import EffectPreview from "../EffectPreview.jsx";

export default function PoliciesTab({ state, dispatch }) {
  const activeIds = new Set((state?.activePolicies ?? []).map((policy) => policy.id));
  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Policy Office</p>
        <h2 className="text-xl font-black mt-1">Standing Policy Shelf</h2>
        <p className="muted-copy mt-1">Rules that would reshape future quarters through upkeep and metric pressure.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {POLICIES.slice(0, 20).map((policy) => (
          <article key={policy.id} className="panel p-4 action-card">
            <div className="flex flex-wrap gap-2">
              <span className="status-chip is-warm">{policy.domain}</span>
              <span className="status-chip">Upkeep {policy.upkeep}</span>
            </div>
            <div>
              <h3 className="text-lg font-black">{policy.name.replace(/^./, (letter) => letter.toUpperCase())}</h3>
              <p className="text-sm mt-1 muted-copy">{policy.description}</p>
            </div>
            <EffectPreview effects={policy.effects} compact limit={5} />
            <div className="flex flex-wrap gap-2 mt-auto">
              <button
                className="btn btn-primary"
                disabled={activeIds.has(policy.id)}
                onClick={() => dispatch?.({ type: "ADOPT_POLICY", payload: { policyId: policy.id } })}
              >
                {activeIds.has(policy.id) ? "Adopted" : "Adopt Policy"}
              </button>
              {activeIds.has(policy.id) && (
                <button className="btn btn-quiet" onClick={() => dispatch?.({ type: "REPEAL_POLICY", payload: { policyId: policy.id } })}>
                  Repeal
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
