const FAILURE = {
  trust_collapse: "The town did not run out of buildings or slogans. It ran out of belief that City Hall would listen.",
  insolvent: "The city became insolvent. Every good plan still needed payroll, reserves, and honest math.",
  service_failure: "Essential services failed together. Residents stopped debating priorities and started asking who was in charge.",
};

export default function GameOverScreen({ reason, onPlayAgain }) {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="panel max-w-2xl p-8 text-center">
        <p className="section-kicker" style={{ color: "var(--color-bad)" }}>Term Ends Early</p>
        <h1 className="text-3xl font-black mt-2">Middletown Breaks Faith</h1>
        <p className="mt-3 muted-copy">{FAILURE[reason] ?? "The administration collapsed."}</p>
        <button className="btn btn-primary mt-6" onClick={onPlayAgain}>Try Another Term</button>
      </section>
    </main>
  );
}
