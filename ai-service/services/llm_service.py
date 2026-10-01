import re

STOP_WORDS = {
    "a", "an", "and", "are", "be", "can", "could", "did", "do", "does",
    "had", "has", "have", "he", "her", "his", "how", "i", "in", "is",
    "it", "its", "me", "my", "of", "on", "or", "please", "she", "the",
    "their", "them", "they", "this", "to", "us", "was", "we", "what",
    "when", "where", "which", "who", "with", "would", "you", "your",
}


def generate_answer(question: str, contexts: list[dict]) -> str:
    if not contexts:
        return "I could not find an answer in the document."

    question_terms = {
        term for term in re.findall(r"[a-z0-9']+", question.lower())
        if term not in STOP_WORDS
    }
    if not question_terms:
        return "I could not find an answer in the document."

    candidates: list[tuple[tuple[int, float, int], str]] = []

    for context in contexts:
        for sentence in re.split(r"(?<=[.!?])\s+", context["text"]):
            clean_sentence = sentence.strip()
            if not clean_sentence:
                continue

            terms = set(re.findall(r"[a-z0-9']+", clean_sentence.lower()))
            overlap = question_terms & terms
            if overlap:
                candidates.append(
                    (
                        (len(overlap), float(context.get("score", 0.0)), len(clean_sentence)),
                        clean_sentence,
                    )
                )

    if not candidates:
        return "I could not find an answer in the document."

    ranked = sorted(
        candidates,
        key=lambda item: (-item[0][0], -item[0][1], -item[0][2], item[1].lower()),
    )
    relevant_sentences = list(dict.fromkeys(sentence for _, sentence in ranked[:3]))
    return " ".join(relevant_sentences)
