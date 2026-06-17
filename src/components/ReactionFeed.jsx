function reactionClass(sentiment) {
  if (sentiment === "win" || sentiment === "achievement") return "reaction-item is-good";
  if (sentiment === "worry") return "reaction-item is-worry";
  return "reaction-item";
}

export default function ReactionFeed({ reactions = [] }) {
  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Resident Reactions</p>
          <h2 className="text-xl font-black mt-1">What They Felt Immediately</h2>
        </div>
        <span className="status-chip">{reactions.length} latest</span>
      </div>
      {reactions.length === 0 ? (
        <p className="muted-copy mt-4">Make a choice and residents will react here right away.</p>
      ) : (
        <div className="reaction-list mt-4">
          {reactions.slice(0, 5).map((reaction) => (
            <article key={reaction.id} className={reactionClass(reaction.sentiment)}>
              <div className="flex items-center justify-between gap-3">
                <strong>{reaction.residentName}</strong>
                <span className="status-chip">{reaction.sentiment}</span>
              </div>
              <p className="text-sm muted-copy mt-1">{reaction.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
