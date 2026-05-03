def get_practice_quiz_placeholder() -> dict:
    """
    Placeholder for future AI-generated practice quizzes.
    It gives the frontend realistic sample data without claiming AI is finished.
    """

    return {
        "title": "Practice Quiz Generator",
        "status": "placeholder",
        "message": "Practice quizzes will be generated from saved study materials in a future sprint.",
        "sample_questions": [
            {
                "question": "What molecule stores usable energy for the cell?",
                "options": ["ATP", "DNA", "Glucose", "Oxygen"],
                "correct_answer": "ATP",
                "explanation": "ATP is the molecule cells use as a direct energy source.",
            },
            {
                "question": "Which study habit does StudyFlow try to support?",
                "options": [
                    "Last-minute cramming",
                    "Structured review sessions",
                    "Ignoring deadlines",
                    "Random guessing",
                ],
                "correct_answer": "Structured review sessions",
                "explanation": "StudyFlow is designed to organize coursework into manageable study blocks.",
            },
        ],
        "next_step": "Connect saved notes and flashcards to a future quiz-generation service.",
    }
