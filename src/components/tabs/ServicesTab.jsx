import Meter from "../Meter.jsx";
import { METRIC_CONFIG } from "../../data/metrics.js";

const SERVICE_GROUPS = [
  { title: "Core services", keys: ["services", "safety", "utilities", "mobility"] },
  { title: "Community outcomes", keys: ["health", "education", "emergencyReadiness", "labor"] },
];

export default function ServicesTab({ state }) {
  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Operations</p>
        <h2 className="text-xl font-black mt-1">Service Dashboard</h2>
        <p className="muted-copy mt-1">Essential services, city capacity, and public-facing outcomes.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SERVICE_GROUPS.map((group) => (
          <section key={group.title} className="panel p-5">
            <h3 className="font-black">{group.title}</h3>
            <div className="grid gap-4 mt-4">
              {group.keys.map((key) => (
                <Meter key={key} label={METRIC_CONFIG[key].label} value={state.metrics[key]} max={METRIC_CONFIG[key].max} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
