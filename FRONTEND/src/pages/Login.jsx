
import { useState } from "react";
import { api } from "../api";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const result = await api("/user/getUser");

      onLogin(result.user);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-wrap">

      <form className="panel login" onSubmit={handleLogin}>

        <div className="login-icon">🏠</div>

        <h1>Real Estate Manager</h1>

        <p className="muted">
          Login to manage your projects and plots.
        </p>

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="error">{error}</p>
        )}

        <button
          type="submit"
          className="primary full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted small">
          Use an account already created in the backend database.
        </p>

      </form>

    </main>
  );
}

export default Login;
