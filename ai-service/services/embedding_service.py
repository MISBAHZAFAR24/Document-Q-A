import math
import re
from collections import Counter

_TOKEN_PATTERN = re.compile(r"[a-z0-9']+")


def embed(text: str) -> dict[str, float]:
    tokens = _TOKEN_PATTERN.findall(text.lower())
    counts = Counter(tokens)
    length = math.sqrt(sum(value * value for value in counts.values())) or 1
    return {token: value / length for token, value in counts.items()}
