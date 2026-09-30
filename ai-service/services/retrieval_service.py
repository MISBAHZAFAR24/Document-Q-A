from .vector_service import VectorIndex


class RetrievalService:
    def __init__(self, index: VectorIndex) -> None:
        self.index = index

    def retrieve(self, document_id: str, question: str, limit: int) -> list[dict]:
        return self.index.search(document_id, question, limit)
