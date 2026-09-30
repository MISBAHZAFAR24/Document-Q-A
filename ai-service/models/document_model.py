from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class Document:
    id: str
    name: str
    path: Path
    pages: int = 0
    chunks: list[dict[str, Any]] = field(default_factory=list)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def summary(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "pages": self.pages,
            "chunks": len(self.chunks),
            "created_at": self.created_at.isoformat(),
        }
