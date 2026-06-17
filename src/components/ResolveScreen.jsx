import { CheckCircle2 } from "lucide-react";
import EffectPreview from "./EffectPreview.jsx";

export default function ResolveScreen({ title, body, buttonText, deltas, onContinue }) {
  return (
    <section className="panel resolve-card">
      <div>
        <p className="section-kicker">Resolution</p>
        <div className="flex items-center gap-2 mt-1">
          <CheckCircle2 size={22} style={{ color: "var(--color-good)" }} aria-hidden="true" />
          <h2 className="text-xl font-black">{title}</h2>
        </div>
        {body && <p className="mt-2 muted-copy">{body}</p>}
        {deltas && (
          <div className="mt-4">
            <EffectPreview effects={deltas} limit={6} />
          </div>
        )}
      </div>
      <button className="btn btn-primary" onClick={onContinue}>{buttonText}</button>
    </section>
  );
}
