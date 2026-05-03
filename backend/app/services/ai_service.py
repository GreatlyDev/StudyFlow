def get_ai_recommendation_placeholder() -> dict[str, str]:
    """
    Placeholder for future AI integration.
    This keeps the project structure ready without implementing AI too early.
    """

    return {
        "title": "AI Study Recommendations",
        "message": "AI recommendation engine will be added in a future sprint.",
        "status": "placeholder",
        "next_step": "Connect study habits, deadlines, and course data to a future recommendation service.",
    }


def get_ai_explanation_placeholder() -> dict[str, str]:
    """
    Placeholder for future AI concept explanations.
    This keeps the demo honest while showing where AI support will live.
    """

    return {
        "title": "AI Concept Explanation",
        "status": "placeholder",
        "sample_topic": "Cellular Respiration",
        "sample_explanation": (
            "Cellular respiration is how cells turn glucose into usable energy. "
            "Think of it like converting food into a battery the cell can spend."
        ),
        "next_step": "Connect this endpoint to selected flashcards, notes, and future AI responses.",
    }
