from fastapi import HTTPException

from config.config import TOP_K
from services.rag_service import RAGService


def create_qa_controller(rag: RAGService, get_document):
    def answer(document_id: str, question: str, limit: int = TOP_K) -> dict:
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question is required")
        get_document(document_id)
        return rag.answer(document_id, question.strip(), limit)

    return answer
