from fastapi import APIRouter
from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    question: str = Field(min_length=1)
    limit: int | None = Field(default=None, ge=1, le=20)


def create_qa_router(answer_question) -> APIRouter:
    router = APIRouter(prefix="/qa", tags=["qa"])

    @router.post("/{document_id}")
    def answer(document_id: str, request: QuestionRequest):
        if request.limit is None:
            return answer_question(document_id, request.question)
        return answer_question(document_id, request.question, request.limit)

    return router
