from .citation_service import build_citations
from .llm_service import generate_answer
from .retrieval_service import RetrievalService


class RAGService:
    def __init__(self, retrieval: RetrievalService) -> None:
        self.retrieval = retrieval

    def answer(self, document_id: str, question: str, limit: int) -> dict:
        contexts = self.retrieval.retrieve(document_id, question, limit)
        return {
            "answer": generate_answer(question, contexts),
            "citations": build_citations(contexts),
        }
