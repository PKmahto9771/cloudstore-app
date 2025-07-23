// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include' // Ensure cookies are sent with the request
        });
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
