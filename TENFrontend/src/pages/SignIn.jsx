import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_URL, isSignedIn, setToken } from "../utils/auth";
import "../site.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in: skip the form
  if (isSignedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Could not sign in. Try again.");
        return;
      }

      setToken(data.token);
      navigate("/admin", { replace: true });
    } catch {
      setError("Can't reach the server. Check that the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site">
      <div className="site-header">
        <Link className="site-brand" to="/">Worker QR</Link>
        <nav>
          <Link className="site-link" to="/">Back to home</Link>
        </nav>
      </div>

      <main className="site-signin-wrap">
        <form className="site-signin-card" onSubmit={handleSubmit} noValidate>
          <h1>Sign in</h1>
          <p className="site-muted">Use your admin email and password.</p>

          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="site-check">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
          </label>

          {error && (
            <p className="site-form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="site-btn site-btn-primary site-btn-block"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
