def build_citations(contexts: list[dict]) -> list[dict]:
    citations = []
    seen_pages = set()
    for context in contexts:
        page = context["page"]
        if page in seen_pages:
            continue
        seen_pages.add(page)
        citations.append({
            "page": page,
            "text": context["text"],
            "score": round(context.get("score", 0.0), 4),
        })
    return citations
