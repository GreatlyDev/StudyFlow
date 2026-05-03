import unittest

from app.services.ai_service import get_ai_explanation_placeholder
from app.services.quiz_service import get_practice_quiz_placeholder


class PlaceholderServicesTest(unittest.TestCase):
    def test_practice_quiz_placeholder_returns_demo_questions(self):
        data = get_practice_quiz_placeholder()

        self.assertEqual(data["status"], "placeholder")
        self.assertGreaterEqual(len(data["sample_questions"]), 2)
        self.assertIn("question", data["sample_questions"][0])
        self.assertIn("correct_answer", data["sample_questions"][0])

    def test_ai_explanation_placeholder_returns_student_friendly_example(self):
        data = get_ai_explanation_placeholder()

        self.assertEqual(data["status"], "placeholder")
        self.assertIn("sample_topic", data)
        self.assertIn("sample_explanation", data)
        self.assertIn("next_step", data)


if __name__ == "__main__":
    unittest.main()
