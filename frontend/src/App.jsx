import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Upload from './pages/Upload';
import Download from './pages/Download';
import Versions from './pages/Versions';
import FolderView from './pages/FolderView';
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 12px rgba(0,0,0,0.05)',
      padding: '1.5rem',
      maxWidth: '800px',
      margin: '1rem auto',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        marginBottom: '1rem',
        marginTop: '0',
      }}>
        Welcome to the Cloud File Storage App!
      </h2>

      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        This app allows you to:
      </p>

      <ul style={{
        listStyleType: 'disc',
        textAlign: 'left',
        maxWidth: '500px',
        margin: '0 auto 1.5rem',
        paddingLeft: '1.5rem',
        lineHeight: '1.6'
      }}>
        <li>Create folders and nested subfolders</li>
        <li>Navigate between folders</li>
        <li>Upload files to specific folders</li>
        <li>View different versions of the same file</li>
        <li>Download and delete files</li>
        <li>Generate signed URLs (temporary public links)</li>
        <li>Share files and revoke access when needed</li>
      </ul>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>To start using the app, please log in:</p>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>

      <div>
        <p style={{ marginBottom: '0.5rem' }}>Or explore the app directly:</p>
        <Link to="/folders">
          <button>Go to the App</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/download"
          element={
            <ProtectedRoute>
              <Download />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <FolderView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders/:folderId"
          element={
            <ProtectedRoute>
              <FolderView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files/versions/:fileGroupId"
          element={
            <ProtectedRoute>
              <Versions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
