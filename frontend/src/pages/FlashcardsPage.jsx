export default function FlashcardsPage() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Study Tools</p>
          <h2>Flashcards</h2>
        </div>
        <p className="helper-text">
          This page is the flashcard feature foundation for the next phase of StudyFlow.
        </p>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>Flashcard workflow</h3>
          <div className="list-stack">
            <div className="mini-summary-card">
              <span className="mini-summary-label">Step 1</span>
              <strong>Save study material in the Study Materials tab.</strong>
            </div>
            <div className="mini-summary-card">
              <span className="mini-summary-label">Step 2</span>
              <strong>Generate question and answer cards from course material.</strong>
            </div>
            <div className="mini-summary-card">
              <span className="mini-summary-label">Step 3</span>
              <strong>Review cards during scheduled study sessions.</strong>
            </div>
          </div>
        </article>

        <article className="card">
          <h3>Prototype note</h3>
          <p className="helper-text">
            The tab is now part of the app structure so the feature is visible in the interface,
            even though full flashcard generation is still planned for a later implementation step.
          </p>

          <div className="insight-chip-row">
            <span className="insight-chip">Feature visible</span>
            <span className="insight-chip">Placeholder page</span>
            <span className="insight-chip">Ready to expand</span>
          </div>
        </article>
      </div>
    </section>
  );
}
