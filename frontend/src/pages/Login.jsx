import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/folders");
        }, 1000); // Redirect after 1 second
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
        setTimeout(() => {
          setError("");
        }, 2000); // Clear error after 2 seconds
        window.location.reload();
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container">
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2 style={{ marginTop: '0' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
    </div>
  );
}

export default Login;
