import { useEffect, useState } from "react";
import Navbar  from "../components/Navbar";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Versions() {
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const { fileGroupId } = useParams();

  // get all the versions of a file
useEffect(() => {
  const fetchVersions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/files/versions/${fileGroupId}`, {
        method: "GET",
        credentials: "include", // Include cookies for session management
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        throw new Error("Failed to fetch versions");
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setVersions(data.versions || data || []);
      } else {
        const text = await res.text();
        if (text.includes('<html') || text.includes('<!DOCTYPE html')) {
          throw new Error('You may not be logged in, or the backend returned HTML instead of JSON. Please login first.');
        }
        throw new Error(text);
      }
    } catch (err) {
      setError(err.message || "Failed to load versions");
      console.error("Versions fetch error:", err);
    }
  };

  fetchVersions();
}, [fileGroupId]);


  const [signedUrl, setSignedUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  return (
    <div className="container" style={{ margin: '0.5em auto', padding: '1em', boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <div style={{ width: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', margin: '1em auto' }}>
        <h3 style={{marginTop: '0' }}>File Versions</h3>
        {error && <p style={{ color: "red", marginTop: '0' }}>{error}</p>}
        {actionMessage && <p style={{ color: "green", marginTop: '0' }}>{actionMessage}</p>}
        {signedUrl && (
          <div style={{ margin: '1em 0', padding: '0.5em', border: '1px solid #ccc', background: '#f6f6f6' }}>
            <strong>Signed URL:</strong>
            <input type="text" value={signedUrl} readOnly style={{ width: '80%' }} onClick={e => e.target.select()} />
            <button onClick={() => {navigator.clipboard.writeText(signedUrl)}} style={{ marginLeft: '1em' }}>Copy</button>
          </div>
        )}
        {shareUrl && (
          <div style={{ margin: '1em 0', padding: '0.5em', border: '1px solid #ccc', background: '#f6f6f6' }}>
            <strong>Share Link:</strong>
            <input type="text" value={shareUrl} readOnly style={{ width: '80%' }} onClick={e => e.target.select()} />
            <button onClick={() => {navigator.clipboard.writeText(shareUrl)}} style={{ marginLeft: '1em' }}>Copy</button>
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eaeaea', color: '#222' }}>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Version</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Original Name</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Uploaded At</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Download</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Delete</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Signed-url</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Share</th>
              <th style={{ fontWeight: 'bold', padding: '0.75em', border: '1px solid #ccc' }}>Revoke</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((file) => (
              <tr key={file._id || file.version}>
                <td style={{ background: '#fff', color: '#111', padding: '0.75em', border: '1px solid #eee' }}>{file.version}</td>
                <td style={{ background: '#fff', color: '#111', padding: '0.75em', border: '1px solid #eee' }}>{file.originalName}</td>
                <td style={{ background: '#fff', color: '#111', padding: '0.75em', border: '1px solid #eee' }}>{new Date(file.uploadedAt).toLocaleString()}</td>
                <td style={{ background: '#fff', color: '#111', padding: '0.75em', border: '1px solid #eee' }}>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/files/download/${file.storageKey}`, { method: 'GET', credentials: 'include' });
                      if (!res.ok) throw new Error('Download failed');
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = file.originalName;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      setActionMessage('Download started.');
                      setTimeout(() => {
                        setActionMessage('');
                      }, 2000); // Clear message after 2 seconds
                    } catch (err) {
                      setError(err.message);
                    }
                  }}>Download</button>
                </td>
                <td>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/files/${file.storageKey}`, { method: 'DELETE', credentials: 'include' });
                      if (!res.ok) throw new Error('Delete failed');
                      setVersions(versions.filter(v => v._id !== file._id));
                      setActionMessage('File deleted.');
                    } catch (err) {
                      setError(err.message);
                    }
                  }}>Delete</button>
                </td>
                <td>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/files/signed-url/${file.storageKey}`, { method: 'GET', credentials: 'include' });
                      const data = await res.json();
                      if (!res.ok || !data.signedUrl) throw new Error('Failed to get signed URL');
                      setSignedUrl(data.signedUrl);
                      setActionMessage('Signed URL generated.');
                    } catch (err) {
                      setError(err.message);
                    }
                  }}>Get Link</button>
                </td>
                <td>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/files/share/${file._id}`, { method: 'POST', credentials: 'include' });
                      const data = await res.json();
                      if (!res.ok || !data.shareUrl) throw new Error('Failed to get share link');
                      setShareUrl(data.shareUrl);
                      setActionMessage('Share link generated.');
                    } catch (err) {
                      setError(err.message);
                    }
                  }}>Get Link</button>
                </td>
                <td>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/files/unshare/${file._id}`, { method: 'POST', credentials: 'include' });
                      if (!res.ok) throw new Error('Failed to revoke share');
                      setActionMessage('Share revoked');
                    } catch (err) {
                      setError(err.message);
                    }
                  }}>Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Versions;