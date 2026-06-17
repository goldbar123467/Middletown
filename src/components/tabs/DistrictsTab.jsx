import CityMap from "../CityMap.jsx";

export default function DistrictsTab({ state }) {
  const averageTrust = Object.values(state.districts).reduce((sum, district) => sum + district.trust, 0) / Object.values(state.districts).length;
  const averageLoad = Object.values(state.districts).reduce((sum, district) => sum + district.serviceLoad, 0) / Object.values(state.districts).length;

  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Neighborhood Office</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-black mt-1">District Field View</h2>
            <p className="muted-copy mt-1">Where resident trust and service load meet block by block.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="status-chip is-good">Avg trust {Math.round(averageTrust)}</span>
            <span className="status-chip is-warm">Avg load {Math.round(averageLoad)}</span>
          </div>
        </div>
      </div>
      <CityMap state={state} />
    </section>
  );
}
