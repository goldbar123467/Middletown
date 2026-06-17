import { Building2, Landmark, Users } from "lucide-react";
import { DIFFICULTIES } from "../config/cityConfig.js";

export default function TitleScreen({ onStart }) {
  return (
    <main className="title-page min-h-screen grid place-items-center px-4 py-10">
      <section className="panel title-panel w-full max-w-5xl p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="civic-seal">
                <Landmark size={30} aria-hidden="true" />
              </span>
              <div>
                <p className="section-kicker">Office of the Mayor</p>
                <h1 className="text-5xl font-black mt-1">Middletown</h1>
              </div>
            </div>
            <p className="mt-4 text-lg muted-copy">
              You are the mayor of a Midwestern town of 100,000 people. Balance budgets, services, council politics, neighborhood trust, and the quiet grind of local government.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="status-chip is-warm">Red / white / black civic standard</span>
              <span className="status-chip">100 quarters</span>
              <span className="status-chip">8 districts</span>
              <span className="status-chip">Q1 resident orientation</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 mt-8">
              {Object.entries(DIFFICULTIES).map(([id, config]) => (
                <button key={id} className="btn difficulty-card text-left h-full" onClick={() => onStart(id)}>
                  <span className="block font-bold">{config.label}</span>
                  <span className="block text-sm mt-1 muted-copy">{config.description}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="subtle-panel p-5 city-grid relative overflow-hidden min-h-80">
            <div className="official-map-label">Municipal Operations Map</div>
            <div className="map-river" />
            <div className="absolute top-6 left-6 right-6 grid grid-cols-2 gap-3">
              <div className="mini-district"><Building2 size={24} /><strong className="block mt-2">Downtown</strong><span className="text-sm muted-copy">civic square</span></div>
              <div className="mini-district"><Users size={24} /><strong className="block mt-2">Northside</strong><span className="text-sm muted-copy">schools and homes</span></div>
              <div className="mini-district"><Landmark size={24} /><strong className="block mt-2">Midtown</strong><span className="text-sm muted-copy">library and shops</span></div>
              <div className="mini-district"><Building2 size={24} /><strong className="block mt-2">Airport</strong><span className="text-sm muted-copy">industry and freight</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
