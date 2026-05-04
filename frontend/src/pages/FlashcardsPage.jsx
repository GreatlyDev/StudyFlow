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
const starterTopics = [
  "Biology: Cellular Respiration",
  "Computer Science: Data Structures",
  "Math: Algebra Review",
];

function getDifficultyLabel(value) {
  const labels = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };
  return labels[value] || "Medium";
}

function getFlashcardSetTitle(flashcard) {
  return flashcard.set_title || "General flashcards";
}

export default function FlashcardsPage() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSetTitle, setSelectedSetTitle] = useState("");
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isStudyModeOpen, setIsStudyModeOpen] = useState(false);
  const [generatorData, setGeneratorData] = useState({
    source_type: "starter_topic",
    topic: starterTopics[0],
    study_material_id: "",
    count: "5",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const studySets = Array.from(
    flashcards
      .reduce((sets, flashcard) => {
        const title = getFlashcardSetTitle(flashcard);
        const existingSet = sets.get(title) || {
          title,
          sourceType: flashcard.source_type || "manual",
          count: 0,
        };

        sets.set(title, {
          ...existingSet,
          count: existingSet.count + 1,
        });

        return sets;
      }, new Map())
      .values(),
  );
  const activeDeck = selectedSetTitle
    ? flashcards.filter((flashcard) => getFlashcardSetTitle(flashcard) === selectedSetTitle)
    : flashcards;
  const activeCard = activeDeck[activeIndex] || null;
  const studyProgress =
    activeDeck.length === 0 ? 0 : Math.round(((activeIndex + 1) / activeDeck.length) * 100);

  async function loadPageData() {
    try {
      const [materialItems, flashcardItems] = await Promise.all([
        studyMaterialApi.list(token),
        flashcardApi.list(token),
      ]);
      setMaterials(materialItems);
      setFlashcards(flashcardItems);
      setSelectedSetTitle((currentTitle) => {
        const availableTitles = flashcardItems.map(getFlashcardSetTitle);
        if (availableTitles.length === 0) {
          return "";
        }

        return availableTitles.includes(currentTitle) ? currentTitle : availableTitles[0];
      });
      setActiveIndex(0);
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

  const handleGeneratorChange = (event) => {
    const { name, value } = event.target;
    setGeneratorData((current) => ({ ...current, [name]: value }));
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

  const handleGenerateFlashcards = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsGenerating(true);

    const payload = {
      source_type: generatorData.source_type,
      topic: generatorData.source_type === "starter_topic" ? generatorData.topic : null,
      study_material_id:
        generatorData.source_type === "study_material" && generatorData.study_material_id
          ? Number(generatorData.study_material_id)
          : null,
      count: Number(generatorData.count),
    };

    try {
      const generatedCards = await flashcardApi.generate(token, payload);
      setSuccessMessage(`Generated ${generatedCards.length} flashcard(s).`);
      if (generatedCards[0]?.set_title) {
        setSelectedSetTitle(generatedCards[0].set_title);
      }
      setActiveIndex(0);
      setIsAnswerVisible(false);
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
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
    if (activeDeck.length === 0) {
      return;
    }
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        return activeDeck.length - 1;
      }
      if (nextIndex >= activeDeck.length) {
        return 0;
      }
      return nextIndex;
    });
    setIsAnswerVisible(false);
  };

  const openStudyMode = () => {
    if (activeDeck.length === 0) {
      return;
    }
    setActiveIndex(0);
    setIsAnswerVisible(false);
    setIsStudyModeOpen(true);
  };

  const closeStudyMode = () => {
    setIsStudyModeOpen(false);
    setIsAnswerVisible(false);
  };

  const handleStatusChange = async (status) => {
    if (!activeCard) {
      return;
    }

    const updatedCardId = activeCard.id;
    setError("");
    setSuccessMessage("");

    try {
      const updatedCard = await flashcardApi.update(token, updatedCardId, { status });
      setFlashcards((currentCards) =>
        currentCards.map((card) => (card.id === updatedCardId ? updatedCard : card)),
      );
      setSuccessMessage(`Marked as ${status}.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (isStudyModeOpen) {
    return (
      <section className="page study-mode-page">
        <article className="study-mode-panel">
          <div className="study-mode-topbar">
            <div>
              <p className="eyebrow">Test Yourself</p>
              <h2>Flashcard Study Mode</h2>
            </div>
            <button type="button" className="button button-secondary" onClick={closeStudyMode}>
              Exit Study Mode
            </button>
          </div>

          <div className="study-progress-wrap" aria-label="Study progress">
            <div>
              <span className="mini-summary-label">Progress</span>
              <strong>
                Card {activeIndex + 1} of {activeDeck.length}
              </strong>
            </div>
            <div className="study-progress-track">
              <span style={{ width: `${studyProgress}%` }} />
            </div>
          </div>

          {activeCard ? (
            <>
              <button
                type="button"
                className={`study-flip-card ${isAnswerVisible ? "is-flipped" : ""}`}
                onClick={() => setIsAnswerVisible((current) => !current)}
              >
                <span className="mini-summary-label">
                  {isAnswerVisible ? "Answer" : "Question"}
                </span>
                <strong>{isAnswerVisible ? activeCard.answer : activeCard.question}</strong>
                <span className="helper-text">
                  {getFlashcardSetTitle(activeCard)}
                </span>
              </button>

              <div className="study-mode-controls">
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
                  {isAnswerVisible ? "Show Question" : "Reveal Answer"}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => moveReview(1)}
                >
                  Next
                </button>
              </div>

              <div className="study-mode-controls study-mode-status-controls">
                <button
                  type="button"
                  className={`button ${
                    activeCard.status === "reviewing" ? "" : "button-secondary"
                  }`}
                  onClick={() => handleStatusChange("reviewing")}
                >
                  Still Learning
                </button>
                <button
                  type="button"
                  className={`button ${
                    activeCard.status === "mastered" ? "" : "button-secondary"
                  }`}
                  onClick={() => handleStatusChange("mastered")}
                >
                  I Know This
                </button>
              </div>
            </>
          ) : (
            <p className="helper-text">No flashcards are available for this study session.</p>
          )}
        </article>
      </section>
    );
  }

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

      <article className="card ai-generator-card">
        <div>
          <p className="eyebrow">AI Flashcard Builder</p>
          <h3>Generate study cards</h3>
          <p className="helper-text">
            Choose a starter subject or one of your saved study materials. StudyFlow will create
            cards and save them into your review deck.
          </p>
        </div>

        <form className="flashcard-generator-form" onSubmit={handleGenerateFlashcards}>
          <label>
            Source
            <select
              name="source_type"
              value={generatorData.source_type}
              onChange={handleGeneratorChange}
            >
              <option value="starter_topic">Starter subject</option>
              <option value="study_material">Saved study material</option>
            </select>
          </label>

          {generatorData.source_type === "starter_topic" ? (
            <label>
              Starter Topic
              <select name="topic" value={generatorData.topic} onChange={handleGeneratorChange}>
                {starterTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label>
              Study Material
              <select
                name="study_material_id"
                value={generatorData.study_material_id}
                onChange={handleGeneratorChange}
                required={generatorData.source_type === "study_material"}
              >
                <option value="">Choose material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Number of Cards
            <select name="count" value={generatorData.count} onChange={handleGeneratorChange}>
              <option value="3">3 cards</option>
              <option value="5">5 cards</option>
              <option value="8">8 cards</option>
            </select>
          </label>

          <button type="submit" className="button" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </button>
        </form>
      </article>

      <article className="card study-set-picker-card">
        <div>
          <p className="eyebrow">Study Sets</p>
          <h3>Choose what to review</h3>
          <p className="helper-text">
            Generated flashcards stay grouped by starter topic or saved study material.
          </p>
        </div>

        {studySets.length === 0 ? (
          <p className="helper-text">Generate or create flashcards to start a study set.</p>
        ) : (
          <label>
            Active Study Set
            <select
              value={selectedSetTitle}
              onChange={(event) => {
                setSelectedSetTitle(event.target.value);
                setActiveIndex(0);
                setIsAnswerVisible(false);
              }}
            >
              {studySets.map((set) => (
                <option key={set.title} value={set.title}>
                  {set.title} ({set.count} cards)
                </option>
              ))}
            </select>
          </label>
        )}
      </article>

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
              {activeDeck.length === 0 ? "0 cards" : `${activeIndex + 1} of ${activeDeck.length}`}
            </span>
          </div>

          {activeCard ? (
            <div className="flashcard-review">
              <p className="mini-summary-label">
                {getFlashcardSetTitle(activeCard)}
              </p>
              <h3>{activeCard.question}</h3>

              <div className="review-answer">
                Open Test Yourself when you are ready to reveal answers and track progress.
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
                  onClick={openStudyMode}
                >
                  Test Yourself
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => moveReview(1)}
                >
                  Next
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
                  <p>{getFlashcardSetTitle(flashcard)}</p>
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
