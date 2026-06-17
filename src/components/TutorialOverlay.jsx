import { ArrowLeft, ArrowRight, BadgeInfo, CheckCircle2, Headphones, Landmark, MapPin, X } from "lucide-react";
import { TAB_CONFIG } from "../data/tabs.js";
import { TUTORIAL_STEPS } from "../data/tutorial.js";

const TAB_LABELS = Object.fromEntries(TAB_CONFIG.map((tab) => [tab.id, tab.label]));

export default function TutorialOverlay({ tutorial, dispatch }) {
  if (!tutorial?.active) return null;

  const step = TUTORIAL_STEPS[tutorial.index] ?? TUTORIAL_STEPS[0];
  const isLast = tutorial.index >= TUTORIAL_STEPS.length - 1;
  const StepIcon = step.kind === "voice_log" ? Headphones : BadgeInfo;

  return (
    <aside className="tutorial-dock" role="dialog" aria-modal="false" aria-labelledby="tutorial-title">
      <div className="tutorial-popup">
        <div className="tutorial-ribbon">
          <span className="tutorial-ribbon-title">Middletown Q1 Orientation</span>
          <button className="tutorial-close" onClick={() => dispatch({ type: "TUTORIAL_SKIP" })} aria-label="Skip orientation">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="tutorial-body">
          <div className="tutorial-speaker-mark">
            <StepIcon size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="section-kicker">{step.kind === "voice_log" ? "Resident voice log" : "City Hall popup"}</p>
            <h2 id="tutorial-title" className="text-xl font-black mt-1">{step.title}</h2>
            <div className="tutorial-speaker-line">
              <strong>{step.speaker}</strong>
              <span>{step.role}</span>
            </div>
            <div className="tutorial-meta-row">
              <span>
                <MapPin size={14} aria-hidden="true" />
                {step.district}
              </span>
              <span>
                <Landmark size={14} aria-hidden="true" />
                {step.metricFocus}
              </span>
            </div>
            <p className="tutorial-message">{step.message}</p>
            {step.kind === "voice_log" && (
              <blockquote className="tutorial-transcript">
                {step.transcript}
              </blockquote>
            )}
          </div>
        </div>

        <div className="tutorial-progress" aria-label="Orientation progress">
          {TUTORIAL_STEPS.map((item, index) => (
            <button
              key={item.id}
              className={index === tutorial.index ? "tutorial-dot is-active" : "tutorial-dot"}
              onClick={() => dispatch({ type: "TUTORIAL_OPEN_STEP", payload: { index } })}
              aria-label={`Open tutorial step ${index + 1}`}
            />
          ))}
        </div>

        <div className="tutorial-actions">
          <button
            className="btn btn-quiet"
            disabled={tutorial.index === 0}
            onClick={() => dispatch({ type: "TUTORIAL_PREV" })}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Previous
          </button>
          <button className="btn btn-quiet" onClick={() => dispatch({ type: "SET_TAB", payload: { tab: step.targetTab } })}>
            Show {TAB_LABELS[step.targetTab] ?? "Tab"}
          </button>
          <button className="btn btn-primary" onClick={() => dispatch({ type: "TUTORIAL_NEXT" })}>
            {isLast ? <CheckCircle2 size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            {isLast ? "Begin Governing" : "Next"}
          </button>
        </div>
      </div>
    </aside>
  );
}
