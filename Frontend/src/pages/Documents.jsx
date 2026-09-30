import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import DocumentCard from "../components/DocumentCard";
import API from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      const { data } = await API.get("/documents");
      setDocuments(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load documents");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar title="Documents" />

        <FileUpload onUploaded={loadDocuments} />

        <h2 style={{ marginBottom: "20px" }}>
          My Documents
        </h2>

        {error && <p className="error-message">{error}</p>}

        <div className="document-grid">

          {documents.map((document) => (
            <DocumentCard
              key={document._id || document.id}
              document={document}
            />
          ))}

          {!documents.length && !error && <p>No documents uploaded yet.</p>}

        </div>

      </main>

    </div>
  );
}

export default Documents;