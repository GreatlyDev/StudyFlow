import { useEffect, useState } from "react";

import { aiApi } from "../api/client";

export default function AiAssistantPage() {
  const [explanationPreview, setExplanationPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExplanationPreview() {
      try {
        const data = await aiApi.getExplanationPlaceholder();
        setExplanationPreview(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadExplanationPreview();
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI Foundation</p>
          <h2>AI Assistant</h2>
        </div>
        <p className="helper-text">
          This section is reserved for future AI study recommendations, explanations, and guided
          planning features.
        </p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="schedule-grid">
        <article className="card">
          <h3>Planned capabilities</h3>
          <div className="list-stack">
            <div className="mini-summary-card">
              <span className="mini-summary-label">Study recommendations</span>
              <strong>Suggest what to study next based on deadlines and workload.</strong>
            </div>
            <div className="mini-summary-card">
              <span className="mini-summary-label">Concept help</span>
              <strong>Explain difficult topics in simpler student-friendly language.</strong>
            </div>
            <div className="mini-summary-card">
              <span className="mini-summary-label">Smart planning</span>
              <strong>Generate balanced study sessions from your real schedule data.</strong>
            </div>
          </div>
        </article>

        <article className="card">
          <h3>Current status</h3>
          <p className="helper-text">
            The backend structure is ready, but the real AI behavior is intentionally being saved
            for a later phase of the project.
          </p>

          <div className="insight-chip-row">
            <span className="insight-chip">Prototype mode</span>
            <span className="insight-chip">UI placeholder</span>
            <span className="insight-chip">Backend ready</span>
          </div>
        </article>
      </div>

      <article className="card">
        <h3>{explanationPreview?.title || "AI Concept Explanation"}</h3>
        <p className="helper-text">
          {explanationPreview
            ? explanationPreview.sample_explanation
            : "Loading sample explanation from the backend..."}
        </p>

        <div className="insight-chip-row">
          <span className="insight-chip">
            {explanationPreview?.sample_topic || "Sample concept"}
          </span>
          <span className="insight-chip">{explanationPreview?.status || "loading"}</span>
        </div>

        {explanationPreview?.next_step ? (
          <p className="helper-text">{explanationPreview.next_step}</p>
        ) : null}
      </article>
    </section>
  );
}
