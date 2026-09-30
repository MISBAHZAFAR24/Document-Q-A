from pathlib import Path

from pypdf import PdfReader


def extract_pages(path: Path) -> list[str]:
    reader = PdfReader(str(path))
    return [(page.extract_text() or "").strip() for page in reader.pages]
