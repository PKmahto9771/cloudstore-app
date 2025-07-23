import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{ width: '100%', background: '#007bff', color: '#fff', padding: '0.75em 0', marginBottom: '1em', borderRadius: '4px 4px 0 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5em' }}>
        <nav style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05em', marginBottom: '0em' }}>
          <Link to="/" style={{ color: '#fff', fontWeight: 600 }}>Home</Link>
          <Link to="/folders" style={{ color: '#fff', fontWeight: 600 }}>Folders</Link>
          <Link to="/logout" style={{ color: '#fff', fontWeight: 600 }}>Logout</Link>
        </nav>
      </div>
    </header>
  );
}
