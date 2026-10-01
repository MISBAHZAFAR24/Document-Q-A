import { useState } from "react";
import API from "../services/api";

function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await API.post("/documents/upload", formData);
      setFile(null);
      onUploaded?.(data);
    } catch (requestError) {
      const responseMessage = requestError.response?.data?.message;
      if (responseMessage) {
        setError(responseMessage);
      } else if (requestError.response) {
        setError(`Upload failed with status ${requestError.response.status}.`);
      } else {
        setError(`Could not reach the upload service: ${requestError.message}. Check the connection and try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Document</h2>

      <p>
        Upload your PDF and ask questions from it.
      </p>

      {error && <p className="error-message">{error}</p>}

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />

      {file && (
        <p>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <button className="primary-btn" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}

export default FileUpload;