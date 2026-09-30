import math

from .embedding_service import embed


def similarity(left: dict[str, float], right: dict[str, float]) -> float:
    return sum(value * right.get(token, 0.0) for token, value in left.items())


class VectorIndex:
    def __init__(self) -> None:
        self._vectors: dict[str, list[tuple[dict[str, float], dict]]] = {}

    def add(self, document_id: str, chunks: list[dict]) -> None:
        self._vectors[document_id] = [(embed(chunk["text"]), chunk) for chunk in chunks]

    def remove(self, document_id: str) -> None:
        self._vectors.pop(document_id, None)

    def search(self, document_id: str, query: str, limit: int) -> list[dict]:
        query_vector = embed(query)
        scored = [
            {**chunk, "score": similarity(query_vector, vector)}
            for vector, chunk in self._vectors.get(document_id, [])
        ]
        return sorted(
            scored,
            key=lambda item: (
                -float(item["score"]),
                item.get("page", 0),
                item.get("start", 0),
                str(item.get("text", "")).lower(),
            ),
        )[:limit]
