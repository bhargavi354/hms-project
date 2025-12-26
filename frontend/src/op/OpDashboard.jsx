import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OpDashboard() {
  const navigate = useNavigate();

  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    fetchOpSummary();
  }, []);

  const fetchOpSummary = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/op");
      const ops = res.data;

      const today = new Date().toISOString().split("T")[0];

      let todayOp = 0;
      let pending = 0;
      let completed = 0;

      ops.forEach((op) => {
        const createdDate = op.createdAt.split("T")[0];

        if (createdDate === today) todayOp++;
        if (op.status === "Pending") pending++;
        if (op.status === "Completed") completed++;
      });

      setTodayCount(todayOp);
      setPendingCount(pending);
      setCompletedCount(completed);
    } catch (err) {
      console.error("Failed to fetch OP summary", err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "linear-gradient(#e9fbff, #dff7f0)",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#006d6f" }}>
        OP Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          margin: "30px 0",
        }}
      >
        <div style={cardStyle}>
          <h3>Today OP</h3>
          <p style={countStyle}>{todayCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending</h3>
          <p style={countStyle}>{pendingCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>Completed</h3>
          <p style={countStyle}>{completedCount}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/op-booking")}
        style={{
          width: "100%",
          padding: "12px",
          background: "#0066ff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Go to OP Booking
      </button>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "20px",
  minWidth: "160px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const countStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: 0,
};
