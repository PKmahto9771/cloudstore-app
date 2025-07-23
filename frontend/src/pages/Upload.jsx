import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies for session management
      });
      if (res.ok) {
        setSuccess("File uploaded successfully!");
        setFile(null);
        // Redirect to parent folder after successful upload
        setTimeout(() => {
          navigate("/folders");
        }, 500); // Optional: show success message for 0.5s
      } else {
        const data = await res.json();
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container">
      <h2>Upload file</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Upload;
