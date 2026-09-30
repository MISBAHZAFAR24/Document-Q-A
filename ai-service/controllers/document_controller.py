from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from config.config import CHUNK_OVERLAP, MAX_CHUNK_SIZE, UPLOAD_DIR
from models.document_model import Document
from services.chunking_service import chunk_pages
from services.pdf_service import extract_pages
from services.vector_service import VectorIndex


def create_document_store(index: VectorIndex) -> tuple[dict[str, Document], object]:
    documents: dict[str, Document] = {}

    async def upload(file: UploadFile) -> dict:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="A PDF file is required")
        document_id = str(uuid4())
        path = Path(UPLOAD_DIR) / f"{document_id}.pdf"
        path.write_bytes(await file.read())
        try:
            pages = extract_pages(path)
            chunks = chunk_pages(pages, MAX_CHUNK_SIZE, CHUNK_OVERLAP)
        except Exception as error:
            path.unlink(missing_ok=True)
            raise HTTPException(status_code=400, detail=f"Unable to read PDF: {error}") from error
        document = Document(document_id, file.filename or path.name, path, len(pages), chunks)
        documents[document_id] = document
        index.add(document_id, chunks)
        return document.summary()

    def get(document_id: str) -> Document:
        document = documents.get(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document

    def remove(document_id: str) -> None:
        document = get(document_id)
        document.path.unlink(missing_ok=True)
        documents.pop(document_id)
        index.remove(document_id)

    return documents, SimpleNamespace(upload=upload, get=get, remove=remove)
