function CitationCard({ citation }) {
  if (!citation) {
    return null;
  }

  return (
    <div className="citation-card">
      <strong>📌 Source</strong>

      <p>{citation.text}</p>

      <small>
        Page: {citation.page}
      </small>
    </div>
  );
}

export default CitationCard;