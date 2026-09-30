import re


def chunk_pages(pages: list[str], chunk_size: int, overlap: int) -> list[dict[str, int | str]]:
    if overlap >= chunk_size:
        raise ValueError("CHUNK_OVERLAP must be smaller than MAX_CHUNK_SIZE")

    chunks = []
    for page_number, text in enumerate(pages, start=1):
        words = re.findall(r"\S+", text)
        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunks.append({
                "text": " ".join(words[start:end]),
                "page": page_number,
                "start": start,
                "end": end,
            })
            if end == len(words):
                break
            start = end - overlap
    return chunks
