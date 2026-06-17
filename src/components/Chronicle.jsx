function entryClass(type) {
  return `subtle-panel record-entry is-${type ?? "system"} p-3`;
}

export default function Chronicle({ entries }) {
  const reversedEntries = [...entries].reverse();
  const latest = reversedEntries[0];

  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Chronicle</p>
          <h2 className="text-xl font-black">Public Record</h2>
        </div>
        <span className="status-chip">{entries.length} entries</span>
      </div>
      {reversedEntries.length === 0 ? (
        <div className="subtle-panel p-4 mt-4 muted-copy">The public record is waiting for the first city action.</div>
      ) : (
        <div className="grid gap-3 mt-4">
          <article className="record-latest">
            <span className="section-kicker">Last Quarter Changed</span>
            <p className="mt-2">{latest.text}</p>
          </article>
          {reversedEntries.map((entry, index) => (
            <article key={entry.turn + "-" + index} className={entryClass(entry.type)}>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase" style={{ color: "var(--color-muted)" }}>
                <span>Quarter {entry.turn}</span>
                <span>{entry.quarter}, Year {entry.year}</span>
                <span className="status-chip">{entry.type}</span>
              </div>
              <p className="mt-2 leading-relaxed">{entry.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
