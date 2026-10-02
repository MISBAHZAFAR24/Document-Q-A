import unittest

from services.llm_service import generate_answer


class GenerateAnswerTests(unittest.TestCase):
    def test_returns_best_retrieved_sentence_when_keywords_do_not_overlap(self):
        contexts = [
            {
                "text": "Failure to submit before the deadline will trigger a penalty.",
                "page": 1,
                "score": 0.91,
            },
        ]

        answer = generate_answer("What happens if I miss the cutoff?", contexts)

        self.assertIn("penalty", answer.lower())
        self.assertNotEqual(answer, "I could not find an answer in the document.")

    def test_returns_no_answer_message_for_empty_contexts(self):
        answer = generate_answer("What is this?", [])

        self.assertEqual(answer, "I could not find an answer in the document.")


if __name__ == "__main__":
    unittest.main()
