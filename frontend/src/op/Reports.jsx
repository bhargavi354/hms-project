import React, { useState } from "react";
import "./Reports.css";
import API_BASE from "../config";

export default function Reports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [opSummary, setOpSummary] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [revenueSummary, setRevenueSummary] = useState({
    total: 0,
  });

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      // 🔹 Fetch OP summary
      const opRes = await fetch(
        `${API_BASE}/op/summary?from=${fromDate}&to=${toDate}`
      );
      const opData = await opRes.json();
      setOpSummary(opData);

      // 🔹 Fetch revenue summary
      const revRes = await fetch(
        `${API_BASE}/revenue/summary?from=${fromDate}&to=${toDate}`
      );
      const revData = await revRes.json();
      setRevenueSummary(revData);
    } catch (err) {
      console.error("Failed to load report", err);
      alert("Failed to fetch report data");
    }
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Reports</h2>

      {/* Date Filters */}
      <div className="report-filters">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <span>to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleGenerate}>Generate Report</button>
      </div>

      {/* Summary Cards */}
      <div className="report-row">
        {/* OP Summary */}
        <div className="report-card">
          <h3>OP Summary</h3>
          <div className="card-item">
            Total OPs: <b>{opSummary.total}</b>
          </div>
          <div className="card-item">
            Pending: <b>{opSummary.pending}</b>
          </div>
          <div className="card-item">
            Completed: <b>{opSummary.completed}</b>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="report-card">
          <h3>Revenue Summary</h3>
          <div className="card-item big">₹ {revenueSummary.total}</div>

          <div className="download-btns">
            <button>Download CSV</button>
            <button>Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
