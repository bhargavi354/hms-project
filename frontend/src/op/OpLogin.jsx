import React, { useState } from "react";
import "./OpLogin.css";
import { useNavigate } from "react-router-dom";

export default function OpLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleOpLogin = (e) => {
    e.preventDefault();

    if (username === "opdesk" && password === "12345") {
      localStorage.setItem("op_logged_in", true);
      navigate("/op-booking");
    } else {
      alert("Invalid OP credentials");
    }
  };

  return (
    <div className="op-login-container">
      <div className="op-login-card">
        <h2>OP Staff Login</h2>

        <form onSubmit={handleOpLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter OP username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter OP password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Log In</button>
        </form>

        <p className="back-admin" onClick={() => navigate("/login")}>
          ← Back to Admin Login
        </p>
      </div>
    </div>
  );
}
