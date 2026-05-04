import { useEffect, useMemo, useState } from "react";

import { flashcardApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  buildStudySets,
  getDifficultyLabel,
  getFlashcardSetTitle,
  getMissedCards,
  getQuizSummary,
} from "../utils/quizHelpers";

export default function PracticeQuizzesPage() {
  const { token } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [selectedSetTitle, setSelectedSetTitle] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [error, setError] = useState("");

  const studySets = useMemo(() => buildStudySets(flashcards), [flashcards]);
  const activeDeck = useMemo(
    () =>
      selectedSetTitle
        ? flashcards.filter((flashcard) => getFlashcardSetTitle(flashcard) === selectedSetTitle)
        : flashcards,
    [flashcards, selectedSetTitle],
  );
  const activeCard = activeDeck[activeIndex] || null;
  const quizSummary = useMemo(() => getQuizSummary(activeDeck, responses), [activeDeck, responses]);
  const missedCards = useMemo(() => getMissedCards(activeDeck, responses), [activeDeck, responses]);
  const progressPercent =
    activeDeck.length === 0 ? 0 : Math.round((quizSummary.answered / activeDeck.length) * 100);

  async function loadFlashcards() {
    try {
      const flashcardItems = await flashcardApi.list(token);
      setFlashcards(flashcardItems);
      setSelectedSetTitle((currentTitle) => {
        const availableTitles = flashcardItems.map(getFlashcardSetTitle);

        if (availableTitles.length === 0) {
          return "";
        }

        return availableTitles.includes(currentTitle) ? currentTitle : availableTitles[0];
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadFlashcards();
  }, [token]);

  useEffect(() => {
    setActiveIndex(0);
    setResponses({});
    setIsQuizStarted(false);
    setIsAnswerVisible(false);
  }, [selectedSetTitle]);

  const startQuiz = () => {
    if (activeDeck.length === 0) {
      return;
    }

    setActiveIndex(0);
    setResponses({});
    setIsAnswerVisible(false);
    setIsQuizStarted(true);
  };

  const resetQuiz = () => {
    setActiveIndex(0);
    setResponses({});
    setIsAnswerVisible(false);
    setIsQuizStarted(false);
  };

  const moveQuestion = (direction) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= activeDeck.length) {
        return currentIndex;
      }
      return nextIndex;
    });
    setIsAnswerVisible(false);
  };

  const markAnswer = (result) => {
    if (!activeCard || !isAnswerVisible) {
      return;
    }

    setResponses((currentResponses) => ({
      ...currentResponses,
      [activeCard.id]: result,
    }));
    setIsAnswerVisible(false);

    if (activeIndex < activeDeck.length - 1) {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }
  };

  const renderEmptyState = () => (
    <article className="card">
      <p className="eyebrow">No Quiz Ready Yet</p>
      <h3>Create flashcards first</h3>
      <p className="helper-text">
        Generate flashcards from a starter topic or study material, then come back here to turn
        that exact set into a practice quiz.
      </p>
    </article>
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Practice Quiz</p>
          <h2>Practice Quizzes</h2>
        </div>
        <p className="helper-text">
          Test yourself from one flashcard set at a time, then review the cards you missed.
        </p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="schedule-grid quiz-grid">
        <article className="card quiz-setup-card">
          <p className="eyebrow">Quiz Builder</p>
          <h3>Choose a flashcard set</h3>
          <p className="helper-text">
            Each quiz uses only the selected study set, so your COSC 458 cards stay separate from
            biology, algebra, or custom material.
          </p>

          <label>
            Active Study Set
            <select
              value={selectedSetTitle}
              onChange={(event) => setSelectedSetTitle(event.target.value)}
              disabled={studySets.length === 0}
            >
              {studySets.map((set) => (
                <option key={set.title} value={set.title}>
                  {set.title} ({set.count} cards)
                </option>
              ))}
            </select>
          </label>

          <div className="insight-chip-row">
            <span className="insight-chip">{activeDeck.length} cards</span>
            <span className="insight-chip">{selectedSetTitle || "No set selected"}</span>
          </div>

          <div className="button-row">
            <button className="button" type="button" onClick={startQuiz} disabled={!activeDeck.length}>
              Start Quiz
            </button>
            <button className="button button-secondary" type="button" onClick={resetQuiz}>
              Reset
            </button>
          </div>
        </article>

        <article className="card quiz-score-card">
          <p className="eyebrow">Quiz Score</p>
          <strong className="quiz-score-number">{quizSummary.scorePercent}%</strong>
          <p className="helper-text">
            {quizSummary.answered} of {activeDeck.length} answered
          </p>
          <div className="study-progress-track" aria-label="Quiz progress">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="insight-chip-row">
            <span className="insight-chip">{quizSummary.correct} correct</span>
            <span className="insight-chip">{quizSummary.missed} missed</span>
          </div>
        </article>
      </div>

      {!activeDeck.length ? renderEmptyState() : null}

      {isQuizStarted && activeCard ? (
        <article className="card quiz-question-card">
          <div className="quiz-question-topbar">
            <div>
              <p className="eyebrow">Question {activeIndex + 1} of {activeDeck.length}</p>
              <h3>{activeCard.question}</h3>
            </div>
            <span className="insight-chip">{getDifficultyLabel(activeCard.difficulty)}</span>
          </div>

          <div className={`quiz-answer-box ${isAnswerVisible ? "is-visible" : ""}`}>
            {isAnswerVisible ? activeCard.answer : "Think through your answer, then reveal it."}
          </div>

          <div className="button-row">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => moveQuestion(-1)}
              disabled={activeIndex === 0}
            >
              Previous
            </button>
            <button
              className="button"
              type="button"
              onClick={() => setIsAnswerVisible((current) => !current)}
            >
              {isAnswerVisible ? "Hide Answer" : "Reveal Answer"}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => moveQuestion(1)}
              disabled={activeIndex === activeDeck.length - 1}
            >
              Next
            </button>
          </div>

          <div className="button-row quiz-mark-row">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => markAnswer("missed")}
              disabled={!isAnswerVisible}
            >
              Missed It
            </button>
            <button
              className="button"
              type="button"
              onClick={() => markAnswer("correct")}
              disabled={!isAnswerVisible}
            >
              I Know This
            </button>
          </div>
        </article>
      ) : (
        activeDeck.length > 0 && (
          <article className="card quiz-question-card">
            <p className="eyebrow">Ready When You Are</p>
            <h3>{selectedSetTitle}</h3>
            <p className="helper-text">
              Press Start Quiz to begin. StudyFlow will keep score and show missed cards when you
              finish.
            </p>
          </article>
        )
      )}

      {quizSummary.isComplete ? (
        <article className="card">
          <p className="eyebrow">Quiz Results</p>
          <h3>
            You scored {quizSummary.correct} out of {activeDeck.length}
          </h3>
          <p className="helper-text">
            {missedCards.length === 0
              ? "No missed cards. This set is looking strong for presentation."
              : "Review these missed cards before trying the set again."}
          </p>

          {missedCards.length > 0 ? (
            <div className="quiz-result-list">
              {missedCards.map((card) => (
                <div key={card.id} className="mini-summary-card">
                  <span className="mini-summary-label">{getDifficultyLabel(card.difficulty)}</span>
                  <strong>{card.question}</strong>
                  <p className="helper-text">Answer: {card.answer}</p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
