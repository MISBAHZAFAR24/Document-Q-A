import { Link } from "react-router-dom";

function DocumentCard({ document }) {
  const documentId = document._id || document.id;

  return (
    <div className="document-card">
      <h3>📄 {document.name}</h3>

      <p>
        Uploaded: {new Date(document.createdAt).toLocaleDateString()}
      </p>

      <Link
        to={`/document/${documentId}`}
        className="view-btn"
      >
        Open & Ask
      </Link>
    </div>
  );
}

export default DocumentCard;