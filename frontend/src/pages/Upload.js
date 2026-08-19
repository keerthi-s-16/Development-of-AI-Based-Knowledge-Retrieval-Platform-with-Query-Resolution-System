import { useEffect, useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("indexedDocuments") || "[]"
    );
    setDocuments(saved);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a PDF or DOCX file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      const newDocument = {
        name: file.name,
        message: data.message || "Ready for retrieval and citation",
        chunks: data.chunks || 0,
      };

      const updatedDocuments = [
        ...documents.filter((doc) => doc.name !== file.name),
        newDocument,
      ];

      setDocuments(updatedDocuments);

      localStorage.setItem(
        "indexedDocuments",
        JSON.stringify(updatedDocuments)
      );

      setMessage("Document uploaded and indexed successfully.");
      setFile(null);

      document.getElementById("document-input").value = "";
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Upload failed");
    }

    setLoading(false);
  };

  const clearDocuments = () => {
    setDocuments([]);
    localStorage.removeItem("indexedDocuments");
    setMessage("Document list cleared.");
  };

  const refreshDocuments = () => {
    const saved = JSON.parse(
      localStorage.getItem("indexedDocuments") || "[]"
    );

    setDocuments(saved);
    setMessage("Document list refreshed.");
  };

  return (
    <main className="knowledge-page">

      {/* Banner */}
      <section className="page-banner knowledge-banner">
        <div>
          <h1>Knowledge Base</h1>

          <p>
            Upload PDF or DOCX files, index them for retrieval,
            and manage your organization's document library.
          </p>
        </div>
      </section>

      {/* Upload Card */}
      <section className="upload-card">

        <div className="upload-card-header">
          <h2>Knowledge Base Upload</h2>

          <p>
            Send files to the backend, let ingestion index them,
            and keep track of what is already available for retrieval.
          </p>
        </div>

        <label className="upload-label">
          Choose files
        </label>

        <div className="file-picker">
          <label htmlFor="document-input" className="choose-file-btn">
            ⬆ Upload
          </label>

          <input
            id="document-input"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />

          <span>
            {file ? file.name : "200MB per file • PDF, DOCX"}
          </span>
        </div>

        <div className="upload-actions">

          <button
            className="upload-index-btn"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? "Uploading..." : "Upload and index"}
          </button>

          <button
            className="clear-btn"
            onClick={clearDocuments}
          >
            Clear knowledge base
          </button>

          <button
            className="refresh-btn"
            onClick={refreshDocuments}
          >
            Refresh list
          </button>

        </div>

        {message && (
          <p className="upload-message">
            {message}
          </p>
        )}

      </section>

      {/* Documents */}
      <section className="documents-section">

        <h2>Indexed documents</h2>

        {documents.length === 0 ? (
          <div className="empty-document-card">
            No documents indexed yet.
          </div>
        ) : (
          documents.map((doc, index) => (
            <div className="document-card" key={doc.name}>

              <div className="document-icon">
                📄
              </div>

              <div>
                <h3>
                  {index + 1}. {doc.name}
                </h3>

                <p>
                  Ready for retrieval and citation
                  {doc.chunks
                    ? ` • ${doc.chunks} chunks`
                    : ""}
                </p>
              </div>

            </div>
          ))
        )}

      </section>

    </main>
  );
}