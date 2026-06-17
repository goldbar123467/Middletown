import { Headphones, MapPin, PlayCircle, Radio } from "lucide-react";
import { TUTORIAL_STEPS } from "../data/tutorial.js";

const VOICE_LOGS = TUTORIAL_STEPS
  .map((step, index) => ({ ...step, index }))
  .filter((step) => step.kind === "voice_log");

export default function VoiceLogPanel({ tutorial, dispatch }) {
  const openedIds = new Set(tutorial?.openedIds ?? []);

  return (
    <section className="panel voice-log-panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-kicker">Q1 Resident Orientation</p>
          <h2 className="text-xl font-black mt-1">Meet the Town</h2>
          <p className="mt-2 muted-copy">
            Tap a resident to hear what they care about. Keep it simple: money, trust, services.
          </p>
        </div>
        <span className="status-chip is-warm">
          <Radio size={14} aria-hidden="true" />
          City Hall intake
        </span>
      </div>

      <div className="voice-log-list mt-4">
        {VOICE_LOGS.map((log) => {
          const heard = openedIds.has(log.id);
          return (
            <button
              key={log.id}
              className={heard ? "voice-log-item is-heard" : "voice-log-item"}
              onClick={() => dispatch({ type: "TUTORIAL_OPEN_STEP", payload: { index: log.index } })}
            >
              <span className="voice-log-icon">
                {heard ? <Headphones size={18} aria-hidden="true" /> : <PlayCircle size={18} aria-hidden="true" />}
              </span>
              <span className="min-w-0">
                <span className="voice-log-name">{log.speaker}</span>
                <span className="voice-log-meta">
                  <MapPin size={13} aria-hidden="true" />
                  {log.district} / {log.metricFocus}
                </span>
                <span className="voice-log-quote">{log.role}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
