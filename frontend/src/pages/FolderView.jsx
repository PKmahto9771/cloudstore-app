import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "./FolderView.module.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function FolderView() {
  const { folderId } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const url = folderId ? `${API_BASE_URL}/api/folders/${folderId}` : `${API_BASE_URL}/api/folders`;
    fetch(url)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return res.text().then(text => {
          if (text.includes('<html') || text.includes('<!DOCTYPE html')) {
            setError('You may not be logged in, or the backend returned HTML instead of JSON. Please login first.');
          } else {
            setError(`Failed to load folders: ${res.status} ${res.statusText} - ${text}`);
          }
          throw new Error(text);
        });
      })
      .then(data => {
        setBreadcrumbs(data.breadcrumbs || []);
        setFolders(data.folders || []);
        setFiles(data.files || []);
      })
      .catch(err => {
        if (!error) setError("Failed to load folders");
        console.error("FolderView fetch error:", err);
      });
  }, [folderId]);

  return (
    <div className={styles.container}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <Navbar />
      {/* Breadcrumb Navigation */}
      <nav className={styles['breadcrumb-nav']} aria-label="Breadcrumb">
        <span style={{ fontWeight: 600 }}>Path:</span>
        <Link to="/folders" style={{ color: '#007bff', fontWeight: 600 }}>Root</Link>
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb._id}> / <Link to={`/folders/${crumb._id}`} style={{ color: '#007bff' }}>{crumb.name}</Link></span>
        ))}
      </nav>

      {/* Responsive grid for forms */}
      <div className={styles['responsive-row']}>
        {/* Create Folder */}
        <section className={styles.section}>
          <h3 style={{ marginBottom: '0.5em' }}>Create Folder</h3>
          <form onSubmit={async e => {
            e.preventDefault();
            const form = e.target;
            const name = form.name.value;
            const parentId = form.parentId.value;
            try {
              const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parentId }),
                credentials: 'include' // Include cookies for session management
              });
              const contentType = res.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                if (!res.ok) {
                  setError(data.message || 'Failed to create folder');
                  form.reset();
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  window.location.reload();
                } else {
                  setSuccess('Folder created successfully!');
                  form.reset();
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  window.location.reload();
                }
                } else {
                  setError('Failed to create folder: ' + res.statusText);
              }
            } catch (err) {
              setError(err.message);
            }
          }} 
          aria-label="Create Folder" autoComplete="off">
            <input type="hidden" name="parentId" value={breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1]._id : ''} />
            <label htmlFor="folder-name" style={{ display: 'none' }}>New folder name</label>
            <input id="folder-name" type="text" name="name" placeholder="New folder name" required className={styles['input-full']} aria-required="true" />
            <button type="submit" className={styles['button-full']} aria-label="Create Folder">Create</button>
          </form>
        </section>

        {/* Upload File */}
        <section className={styles.section}>
          <h3 style={{ marginBottom: '0.5em' }}>Upload File</h3>
          <form onSubmit={async e => {
            e.preventDefault();
            const form = e.target;
            const folderId = form.folderId.value;
            const fileInput = form.file;
            if (!fileInput.files.length) return setError('No file selected');
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('folderId', folderId);
            try {
              const res = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Include cookies for session management
              });

              const contentType = res.headers.get('content-type') || '';

              if (!res.ok) {
                let errorMessage = 'Failed to upload file';
                if (contentType.includes('application/json')) {
                  const errorData = await res.json();
                  errorMessage = errorData.message || errorMessage;
                }
                throw new Error(errorMessage);
              }

              if (contentType.includes('application/json')) {
                const data = await res.json();
                // if (data.redirectUrl) {
                //   window.location.href = data.redirectUrl;
                //   return;
                // }
                setSuccess(data.message || 'File uploaded successfully.');
              } else {
                setSuccess('File uploaded successfully.');
              }

              // Wait 2 seconds and reload
              setTimeout(() => {
                window.location.reload();
              }, 2000);

            } catch (err) {
              setError(err.message || 'An unexpected error occurred while uploading the file.');
            }
          }} 

          encType="multipart/form-data" aria-label="Upload File" autoComplete="off">
            <input type="hidden" name="folderId" value={breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1]._id : ''} />
            <label htmlFor="file-upload" style={{ display: 'none' }}>Select file to upload</label>
            <input id="file-upload" type="file" name="file" required className={styles['input-full']} aria-required="true" />
            <button type="submit" className={styles['button-full']} aria-label="Upload File">Upload</button>
          </form>
        </section>
      </div>

      <hr style={{ margin: '1em 0' }} />

      {/* Responsive grid for lists */}
      <div className={styles['responsive-row']}>
        <section className={styles.section}>
          <h3 style={{ marginBottom: '0.5em' }}>Folders</h3>
          {folders.length ? (
            <ul className={styles.list}>
              {folders.map(folder => (
                <li key={folder._id} className={styles['list-item']} tabIndex={0} aria-label={`Folder: ${folder.name}`}>
                  <Link to={`/folders/${folder._id}`}>{folder.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#888' }}>No folders found.</p>
          )}
        </section>

        <section className={styles.section}>
          <h3 style={{ marginBottom: '0.5em' }}>Files</h3>
          {files.length ? (
            <ul className={styles.list}>
              {files.map(file => (
                <li key={file._id} className={styles['list-item']} tabIndex={0} aria-label={`File: ${file.originalName}`}>
                  <Link to={`/files/versions/${file.fileGroupId}`}>{file.originalName}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#888' }}>No files found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default FolderView;
