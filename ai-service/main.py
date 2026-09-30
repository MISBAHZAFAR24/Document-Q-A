from fastapi import FastAPI

from controllers.document_controller import create_document_store
from controllers.qa_controller import create_qa_controller
from routes.document_routes import create_document_router
from routes.qa_routes import create_qa_router
from services.rag_service import RAGService
from services.retrieval_service import RetrievalService
from services.vector_service import VectorIndex


def create_app() -> FastAPI:
    app = FastAPI(title="Document Q&A AI Service", version="1.0.0")
    index = VectorIndex()
    _, store = create_document_store(index)
    answer_question = create_qa_controller(RAGService(RetrievalService(index)), store.get)

    app.include_router(create_document_router(store))
    app.include_router(create_qa_router(answer_question))

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
