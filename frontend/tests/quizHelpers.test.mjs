import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildStudySets,
  getFlashcardSetTitle,
  getMissedCards,
  getQuizSummary,
} from "../src/utils/quizHelpers.js";

const flashcards = [
  {
    id: 1,
    question: "What is agile development?",
    set_title: "COSC 458: Software Engineering",
    source_type: "starter_topic",
  },
  {
    id: 2,
    question: "What is a sprint?",
    set_title: "COSC 458: Software Engineering",
    source_type: "starter_topic",
  },
  {
    id: 3,
    question: "What is ATP?",
    set_title: "Biology: Cellular Respiration",
    source_type: "starter_topic",
  },
];

describe("quiz helpers", () => {
  it("groups flashcards into study sets by set title", () => {
    const sets = buildStudySets(flashcards);

    assert.deepEqual(sets, [
      {
        title: "COSC 458: Software Engineering",
        sourceType: "starter_topic",
        count: 2,
      },
      {
        title: "Biology: Cellular Respiration",
        sourceType: "starter_topic",
        count: 1,
      },
    ]);
  });

  it("falls back to General flashcards when a card has no set title", () => {
    assert.equal(getFlashcardSetTitle({ set_title: "" }), "General flashcards");
  });

  it("summarizes score and returns missed cards", () => {
    const responses = {
      1: "correct",
      2: "missed",
      3: "correct",
    };

    assert.deepEqual(getQuizSummary(flashcards, responses), {
      answered: 3,
      correct: 2,
      missed: 1,
      scorePercent: 67,
      isComplete: true,
    });
    assert.deepEqual(getMissedCards(flashcards, responses), [flashcards[1]]);
  });
});
