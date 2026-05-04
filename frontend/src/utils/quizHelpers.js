export function getFlashcardSetTitle(flashcard) {
  return flashcard.set_title || "General flashcards";
}

export function getDifficultyLabel(value) {
  const labels = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  return labels[value] || "Medium";
}

export function buildStudySets(flashcards) {
  return Array.from(
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
}

export function getQuizSummary(cards, responses) {
  const answered = cards.filter((card) => responses[card.id]).length;
  const correct = cards.filter((card) => responses[card.id] === "correct").length;
  const missed = cards.filter((card) => responses[card.id] === "missed").length;

  return {
    answered,
    correct,
    missed,
    scorePercent: cards.length === 0 ? 0 : Math.round((correct / cards.length) * 100),
    isComplete: cards.length > 0 && answered === cards.length,
  };
}

export function getMissedCards(cards, responses) {
  return cards.filter((card) => responses[card.id] === "missed");
}
