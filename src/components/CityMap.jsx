import { Building2, BusFront, Factory, GraduationCap, Home, Landmark, Trees, Waves } from "lucide-react";
import { DISTRICTS } from "../data/districts.js";

const DISTRICT_META = {
  downtown: { area: "downtown", icon: Landmark, label: "Civic core" },
  northside: { area: "northside", icon: Home, label: "Schools" },
  eastbank: { area: "eastbank", icon: Waves, label: "Riverfront" },
  southgate: { area: "southgate", icon: BusFront, label: "Retail" },
  westhaven: { area: "westhaven", icon: Home, label: "Homes" },
  midtown: { area: "midtown", icon: Building2, label: "Main street" },
  university: { area: "university", icon: GraduationCap, label: "Campus" },
  airport: { area: "airport", icon: Factory, label: "Industry" },
};

function trustToneForDistrict(current) {
  const trust = current.trust ?? 0;
  if (trust >= 70) return { label: "Trusted", className: "status-chip is-trust-high", color: "var(--color-trust-high)" };
  if (trust >= 50) return { label: "Trust Watch", className: "status-chip is-trust-mid", color: "var(--color-trust-mid)" };
  return { label: "Low Trust", className: "status-chip is-trust-low", color: "var(--color-trust-low)" };
}

function clampPct(value) {
  return Math.max(0, Math.min(100, value ?? 0));
}

export default function CityMap({ state }) {
  const cityPopulation = DISTRICTS.reduce((sum, district) => sum + (state.districts[district.id]?.population ?? district.population), 0);

  return (
    <section className="panel p-5 city-map">
      <div className="city-map-header">
        <div>
          <p className="section-kicker">City Map</p>
          <h2 className="text-xl font-black">District Conditions</h2>
          <p className="text-sm muted-copy mt-1">{cityPopulation.toLocaleString()} residents across eight operating districts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="status-chip is-trust-high">High trust</span>
          <span className="status-chip is-trust-mid">Watch</span>
          <span className="status-chip is-trust-low">Low trust</span>
          <span className="status-chip is-load">Load</span>
        </div>
      </div>
      <div className="city-map-canvas city-grid">
        <div className="map-river" />
        <div className="map-road is-horizontal" />
        <div className="map-road is-vertical" />
        <div className="city-map-layout">
          {DISTRICTS.map((district) => {
            const current = state.districts[district.id] ?? district;
            const meta = DISTRICT_META[district.id] ?? DISTRICT_META.downtown;
            const Icon = meta.icon;
            const trustTone = trustToneForDistrict(current);
            const potholes = state.cityBacklogs?.districtPotholes?.[district.id] ?? 0;
            return (
              <article
                key={district.id}
                className="district-tile"
                style={{ "--trust-color": trustTone.color, gridArea: meta.area }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="district-icon"><Icon size={18} aria-hidden="true" /></span>
                    <span className={trustTone.className}>{trustTone.label}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase muted-copy">{meta.label}</p>
                    <h3 className="text-lg font-black">{district.name}</h3>
                    <p className="text-xs muted-copy mt-1">{potholes} open pothole calls</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="muted-copy">Trust</span>
                      <strong>{Math.round(current.trust)}</strong>
                    </div>
                    <div className="tile-bar-track mt-1">
                      <div className="tile-bar-fill is-trust" style={{ width: `${clampPct(current.trust)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="muted-copy">Load</span>
                      <strong>{Math.round(current.serviceLoad)}</strong>
                    </div>
                    <div className="tile-bar-track mt-1">
                      <div className="tile-bar-fill is-load" style={{ width: `${clampPct(current.serviceLoad)}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
