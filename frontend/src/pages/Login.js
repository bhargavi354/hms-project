import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid admin credentials");
        return;
      }

      // save login flag
      localStorage.setItem("hms_logged_in", "true");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="op-link" onClick={() => navigate("/op-login")}>
          Login as OP Staff →
        </p>
      </div>
    </div>
  );
}
