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
      console.log("🔥 Using API:", API_BASE);

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

      // ✅ login success
      localStorage.setItem("hms_logged_in", "true");
      navigate("/");
    } catch (error) {
      alert("Server error");
      console.error(error);
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
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
