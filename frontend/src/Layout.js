import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  // ⭐ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("hms_logged_in"); // remove login flag
    navigate("/login"); // go back to login page
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#0b1224",
          height: "100vh",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2>Central Medical</h2>

          <nav
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <Link to="/">Dashboard</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/home-visits">Home Visits</Link>
            <Link to="/revenue">Revenue</Link>
            <Link to="/employees">Employees</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        </div>

        {/* ⭐ LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
<div style={{ flex: 1, padding: "20px", overflowY: "auto", height: "100vh" }}>
  <Outlet />
</div>
    </div>
  );
}

export default Layout; 