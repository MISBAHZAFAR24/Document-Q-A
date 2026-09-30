from fastapi import APIRouter, File, UploadFile


def create_document_router(store) -> APIRouter:
    router = APIRouter(prefix="/documents", tags=["documents"])

    @router.post("/upload")
    async def upload_document(file: UploadFile = File(...)):
        return await store.upload(file)

    @router.get("/{document_id}")
    def get_document(document_id: str):
        return store.get(document_id).summary()

    @router.delete("/{document_id}", status_code=204)
    def delete_document(document_id: str):
        store.remove(document_id)

    return router
