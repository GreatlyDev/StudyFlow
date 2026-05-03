import { useEffect, useState } from "react";

import { flashcardApi, studyMaterialApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  question: "",
  answer: "",
  status: "new",
  difficulty: "2",
  study_material_id: "",
};

const statusOptions = ["new", "reviewing", "mastered"];

function getDifficultyLabel(value) {
  const labels = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };
  return labels[value] || "Medium";
}

export default function FlashcardsPage() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const materialTitleMap = Object.fromEntries(
    materials.map((material) => [material.id, material.title]),
  );
  const activeCard = flashcards[activeIndex] || null;

  async function loadPageData() {
    try {
      const [materialItems, flashcardItems] = await Promise.all([
        studyMaterialApi.list(token),
        flashcardApi.list(token),
      ]);
      setMaterials(materialItems);
      setFlashcards(flashcardItems);
      setActiveIndex((currentIndex) =>
        flashcardItems.length === 0 ? 0 : Math.min(currentIndex, flashcardItems.length - 1),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const buildPayload = () => ({
    ...formData,
    difficulty: Number(formData.difficulty),
    study_material_id: formData.study_material_id ? Number(formData.study_material_id) : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      if (editingId) {
        await flashcardApi.update(token, editingId, buildPayload());
        setSuccessMessage("Flashcard updated.");
      } else {
        await flashcardApi.create(token, buildPayload());
        setSuccessMessage("Flashcard saved.");
      }

      resetForm();
      setIsAnswerVisible(false);
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (flashcard) => {
    setEditingId(flashcard.id);
    setFormData({
      question: flashcard.question,
      answer: flashcard.answer,
      status: flashcard.status,
      difficulty: String(flashcard.difficulty),
      study_material_id: flashcard.study_material_id ? String(flashcard.study_material_id) : "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (flashcardId) => {
    setError("");
    setSuccessMessage("");

    try {
      await flashcardApi.remove(token, flashcardId);
      if (editingId === flashcardId) {
        resetForm();
      }
      setSuccessMessage("Flashcard deleted.");
      setIsAnswerVisible(false);
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const moveReview = (direction) => {
    if (flashcards.length === 0) {
      return;
    }
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        return flashcards.length - 1;
      }
      if (nextIndex >= flashcards.length) {
        return 0;
      }
      return nextIndex;
    });
    setIsAnswerVisible(false);
  };

  const handleStatusChange = async (status) => {
    if (!activeCard) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await flashcardApi.update(token, activeCard.id, { status });
      setSuccessMessage(`Marked as ${status}.`);
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Study Tools</p>
          <h2>Flashcards</h2>
        </div>
        <p className="helper-text">
          Turn saved study material into question-and-answer cards for quick review sessions.
        </p>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>{editingId ? "Edit Flashcard" : "Create Flashcard"}</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="span-2">
              Study Material
              <select
                name="study_material_id"
                value={formData.study_material_id}
                onChange={handleChange}
              >
                <option value="">General flashcard</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="span-2">
              Question
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What molecule stores usable energy for the cell?"
                required
              />
            </label>

            <label className="span-2">
              Answer
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows="5"
                placeholder="ATP stores usable energy for the cell."
                required
              />
            </label>

            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Difficulty
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </label>

            {error ? <p className="error-text span-2">{error}</p> : null}
            {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

            <div className="button-row span-2">
              <button type="submit" className="button" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update Flashcard" : "Save Flashcard"}
              </button>

              {editingId ? (
                <button type="button" className="button button-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="card flashcard-review-card">
          <div className="section-header section-header-tight">
            <h3>Review Session</h3>
            <span className="tag">
              {flashcards.length === 0 ? "0 cards" : `${activeIndex + 1} of ${flashcards.length}`}
            </span>
          </div>

          {activeCard ? (
            <div className="flashcard-review">
              <p className="mini-summary-label">
                {materialTitleMap[activeCard.study_material_id] || "General flashcard"}
              </p>
              <h3>{activeCard.question}</h3>

              <div className={`review-answer ${isAnswerVisible ? "is-visible" : ""}`}>
                {isAnswerVisible ? activeCard.answer : "Tap reveal when you are ready to check."}
              </div>

              <div className="insight-chip-row">
                <span className="insight-chip">{activeCard.status}</span>
                <span className="insight-chip">
                  {getDifficultyLabel(activeCard.difficulty)}
                </span>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => moveReview(-1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setIsAnswerVisible((current) => !current)}
                >
                  {isAnswerVisible ? "Hide Answer" : "Reveal Answer"}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => moveReview(1)}
                >
                  Next
                </button>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => handleStatusChange("reviewing")}
                >
                  Keep Reviewing
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => handleStatusChange("mastered")}
                >
                  Mark Mastered
                </button>
              </div>
            </div>
          ) : (
            <p className="helper-text">
              No flashcards yet. Create one on the left, then use this panel for a quick review.
            </p>
          )}
        </article>
      </div>

      <article className="card">
        <h3>Saved Flashcards</h3>

        {flashcards.length === 0 ? (
          <p className="helper-text">
            Flashcards you create will appear here so you can edit, delete, and review them.
          </p>
        ) : (
          <div className="list-stack">
            {flashcards.map((flashcard) => (
              <div key={flashcard.id} className="list-item study-material-item">
                <div>
                  <strong>{flashcard.question}</strong>
                  <p>{materialTitleMap[flashcard.study_material_id] || "General flashcard"}</p>
                  <p className="material-preview">{flashcard.answer}</p>
                  <div className="insight-chip-row">
                    <span className="insight-chip">{flashcard.status}</span>
                    <span className="insight-chip">
                      {getDifficultyLabel(flashcard.difficulty)}
                    </span>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => handleEdit(flashcard)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleDelete(flashcard.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
