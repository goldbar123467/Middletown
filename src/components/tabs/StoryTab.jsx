import { STORY_SAMPLES } from "../../data/storySamples.js";

export default function StoryTab({ state }) {
  const start = ((state.turn - 1) * 6) % STORY_SAMPLES.length;
  const episodes = STORY_SAMPLES.slice(start, start + 6);
  return (
    <section className="page-stack">
      <div className="panel p-5">
        <p className="section-kicker">Civic Memory</p>
        <h2 className="text-xl font-black mt-1">Story Atlas</h2>
        <p className="muted-copy mt-1">Narrative beats for this stretch of the mayoral term.</p>
      </div>
      <div className="grid gap-3">
        {episodes.map((episode, index) => (
          <article key={episode.id} className="panel p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              <span className="option-index">{index + 1}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="status-chip is-warm">Act {episode.act}</span>
                  <span className="status-chip">{episode.domain}</span>
                </div>
                <h3 className="font-black text-lg mt-3">{episode.title}</h3>
                <p className="text-sm mt-1 leading-relaxed">{episode.beat}</p>
                <p className="text-sm mt-2 muted-copy">{episode.classroomQuestion}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
