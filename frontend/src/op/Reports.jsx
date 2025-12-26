import React, { useState } from "react";
import "./Reports.css";

export default function Reports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Dummy values for now – later API nunchi fetch chestam
  const opSummary = {
    total: 13,
    pending: 2,
    completed: 11,
  };

  const revenueSummary = {
    total: 5250,
  };

  const handleGenerate = () => {
    alert(`Generate report from ${fromDate} to ${toDate}`);
    // Later: API call here
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
          <div className="card-item">Total OPs: <b>{opSummary.total}</b></div>
          <div className="card-item">Pending: <b>{opSummary.pending}</b></div>
          <div className="card-item">Completed: <b>{opSummary.completed}</b></div>
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
