import { useEffect, useState } from "react";

import { aiApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AiAssistantPage() {
  const { token } = useAuth();
  const [explanationPreview, setExplanationPreview] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAiPageData() {
      try {
        const [explanationData, recommendationPreview] = await Promise.all([
          aiApi.getExplanationPlaceholder(),
          aiApi.getRecommendations(token),
        ]);
        setExplanationPreview(explanationData);
        setRecommendationData(recommendationPreview);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadAiPageData();
  }, [token]);

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
        <article className="card ai-recommendation-panel">
          <div className="section-header section-header-tight">
            <span>{recommendationData?.title || "AI Study Recommendations"}</span>
          </div>

          <p className="helper-text">
            {recommendationData?.summary ||
              "StudyFlow will use your current coursework to build recommendation cards."}
          </p>

          <div className="ai-recommendation-list">
            {(recommendationData?.recommendations || []).map((recommendation) => (
              <div key={`${recommendation.category}-${recommendation.title}`} className="ai-rec-card">
                <div className="card-row">
                  <span className="tag">{recommendation.category}</span>
                  <span className={`priority-pill priority-${recommendation.priority}`}>
                    {recommendation.priority}
                  </span>
                </div>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.reason}</p>
                <strong>{recommendation.action}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Current status</h3>
          <p className="helper-text">
            StudyFlow is currently using a rule-based AI foundation endpoint. This gives the
            prototype useful recommendations now and leaves a clean place to connect OpenAI next.
          </p>

          <div className="insight-chip-row">
            <span className="insight-chip">Prototype mode</span>
            <span className="insight-chip">{recommendationData?.status || "foundation"}</span>
            <span className="insight-chip">
              {recommendationData?.recommendation_count ?? 0} recommendations
            </span>
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
