import { useEffect, useState } from "react";

import { quizApi } from "../api/client";

export default function PracticeQuizzesPage() {
  const [quizPreview, setQuizPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuizPreview() {
      try {
        const data = await quizApi.getPlaceholder();
        setQuizPreview(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadQuizPreview();
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Practice Quiz Foundation</p>
          <h2>Practice Quizzes</h2>
        </div>
        <p className="helper-text">
          This preview shows how future quizzes will be generated from notes and flashcards.
        </p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="schedule-grid">
        <article className="card">
          <h3>{quizPreview?.title || "Practice Quiz Generator"}</h3>
          <p className="helper-text">
            {quizPreview?.message ||
              "Practice quiz placeholder data is loading from the backend."}
          </p>

          <div className="insight-chip-row">
            <span className="insight-chip">{quizPreview?.status || "loading"}</span>
            <span className="insight-chip">AI-ready structure</span>
            <span className="insight-chip">Future sprint</span>
          </div>
        </article>

        <article className="card">
          <h3>Sample Questions</h3>

          <div className="list-stack">
            {(quizPreview?.sample_questions || []).map((question, index) => (
              <div key={`${question.question}-${index}`} className="mini-summary-card">
                <span className="mini-summary-label">Question {index + 1}</span>
                <strong>{question.question}</strong>
                <p className="helper-text">Answer: {question.correct_answer}</p>
                <p className="helper-text">{question.explanation}</p>
              </div>
            ))}

            {!quizPreview ? (
              <p className="helper-text">Loading practice quiz preview...</p>
            ) : null}
          </div>
        </article>
      </div>

      {quizPreview?.next_step ? (
        <article className="card">
          <h3>Next Step</h3>
          <p className="helper-text">{quizPreview.next_step}</p>
        </article>
      ) : null}
    </section>
  );
}
