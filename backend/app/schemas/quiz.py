from pydantic import BaseModel


class PracticeQuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str


class PracticeQuizPlaceholderResponse(BaseModel):
    title: str
    status: str
    message: str
    sample_questions: list[PracticeQuizQuestion]
    next_step: str
