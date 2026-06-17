export default function GoalBoard({ goals = [], achievements = [] }) {
  const unlocked = achievements.filter((achievement) => achievement.unlocked).slice(0, 3);

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Campaign Goals</p>
          <h2 className="text-xl font-black mt-1">Win the Long Game</h2>
        </div>
        <span className="status-chip is-warm">{unlocked.length} unlocked</span>
      </div>
      <div className="goal-list mt-4">
        {goals.slice(0, 5).map((goal) => (
          <article key={goal.id} className="goal-row">
            <div>
              <strong>{goal.title}</strong>
              <span>{goal.description}</span>
              {goal.reward && <span>Reward: {goal.reward}</span>}
            </div>
            <div className="goal-progress">
              <span>{goal.progress}%</span>
              {goal.progressDelta !== 0 && (
                <small className={goal.progressDelta > 0 ? "goal-delta is-good" : "goal-delta is-bad"}>
                  {goal.progressDelta > 0 ? "+" : ""}{goal.progressDelta} this qtr
                </small>
              )}
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${goal.progress}%`, background: goal.complete ? "var(--color-good)" : "var(--color-civic-red)" }} />
              </div>
            </div>
          </article>
        ))}
      </div>
      {unlocked.length > 0 && (
        <div className="achievement-strip mt-4">
          {unlocked.map((achievement) => (
            <span key={achievement.id} className="status-chip is-good">{achievement.title}</span>
          ))}
        </div>
      )}
    </section>
  );
}
