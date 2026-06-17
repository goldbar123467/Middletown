export default function Meter({ label, value, max = 100, inverse = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const score = inverse ? 100 - pct : pct;
  const color = score >= 70 ? "var(--color-good)" : score >= 45 ? "var(--color-warn)" : "var(--color-bad)";
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="meter-label">{label}</span>
        <strong>{Math.round(value)}</strong>
      </div>
      <div className="meter-track mt-1">
        <div className="meter-fill" style={{ width: pct + "%", background: color }} />
      </div>
    </div>
  );
}
