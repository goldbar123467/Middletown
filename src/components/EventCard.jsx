import { ArrowRight, Building2, MapPin, Tag } from "lucide-react";
import EffectPreview from "./EffectPreview.jsx";

function MetaChip({ icon, children }) {
  if (!children) return null;
  const IconComponent = icon;
  return (
    <span className="status-chip">
      <IconComponent size={14} aria-hidden="true" />
      {children}
    </span>
  );
}

export default function EventCard({ event, phaseLabel, onChoose }) {
  return (
    <section className="panel event-card">
      <div className="event-card-head">
        <div>
          <p className="section-kicker">{phaseLabel}</p>
          <h2 className="text-2xl font-black mt-1">{event.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <MetaChip icon={Tag}>{event.domain}</MetaChip>
          <MetaChip icon={MapPin}>{event.district}</MetaChip>
          <MetaChip icon={Building2}>{event.department}</MetaChip>
        </div>
      </div>
      <p className="text-lg leading-relaxed muted-copy">{event.description}</p>
      {event.context && <p className="event-context text-sm">{event.context}</p>}
      <div className="event-options">
        {event.options.map((option, index) => (
          <button key={`${option.text}-${index}`} className="event-option" onClick={() => onChoose(index)}>
            <span className="option-index">{index + 1}</span>
            <span className="grid gap-2 min-w-0">
              <span className="font-black">{option.text}</span>
              <EffectPreview effects={option.effects} compact limit={5} />
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
