import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Download() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/files/download?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = key;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        setError(data.message || "Download failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container">
      <h2>Download File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="key"
          placeholder="Enter file key"
          required
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <button type="submit">Download</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Download;
