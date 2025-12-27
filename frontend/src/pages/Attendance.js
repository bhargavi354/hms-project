import React, { useEffect, useMemo, useState } from "react";
import "./Attendance.css";
import API_BASE from "../config";


// HELPER
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // LOAD EMPLOYEES
  useEffect(() => {
  fetch(`${API_BASE}/employees`)

      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Employees Error:", err));
  }, []);

  // LOAD ATTENDANCE FOR DATE
  useEffect(() => {
  fetch(`${API_BASE}/attendance/${selectedDate}`)

      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error("Attendance Fetch Error:", err));
  }, [selectedDate]);

  // GET STATUS FOR ROW
  const rowStatus = (empId) => {
    const rec = attendance.find(
      (a) => a.employeeId === empId && a.date === selectedDate
    );
    return rec ? rec.status : "not marked";
  };

  // SAVE STATUS
  const saveStatus = (empId, status) => {
  fetch(`${API_BASE}/attendance`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: empId,
        date: selectedDate,
        status: status,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setAttendance((prev) => {
          const existing = prev.filter(
            (p) => !(p.employeeId === empId && p.date === selectedDate)
          );
          return [...existing, updated];
        });
      });
  };

  // CLEAR STATUS
  const clearStatus = (empId) => {
    saveStatus(empId, "not marked");
  };

  // FILTER EMPLOYEES
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, employees]);

  // APPLY STATUS FILTER
  const visibleRows = useMemo(() => {
    return filteredEmployees.filter((emp) => {
      const st = rowStatus(emp.id);
      if (statusFilter === "all") return true;
      return st === statusFilter;
    });
  }, [filteredEmployees, statusFilter, attendance, selectedDate]);

  // SUMMARY
  const summary = useMemo(() => {
    const [y, m] = viewMonth.split("-").map(Number);
    const days = daysInMonth(y, m - 1);

    let present = 0,
      absent = 0,
      late = 0,
      half = 0;

    attendance.forEach((a) => {
      if (!a.date.startsWith(viewMonth)) return;
      if (a.status === "present") present++;
      if (a.status === "absent") absent++;
      if (a.status === "late") late++;
      if (a.status === "half") half++;
    });

    const total = present + absent + late + half;
    const pct = total === 0 ? 0 : Math.round((present / total) * 100);

    return { present, absent, late, half, pct, days };
  }, [attendance, viewMonth]);

  // ⭐ STATUS COLOR CLASS
  const statusClass = (status) => {
    switch (status) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "late":
        return "status-late";
      case "half":
        return "status-half";
      default:
        return "status-none";
    }
  };

  return (
    <div className="attendance-page">
      {/* SUMMARY */}
      <div className="attendance-summary">
        <div className="sum-card"><h4>Total Days</h4><p>{summary.days}</p></div>
        <div className="sum-card present"><h4>Present</h4><p>{summary.present}</p></div>
        <div className="sum-card absent"><h4>Absent</h4><p>{summary.absent}</p></div>
        <div className="sum-card late"><h4>Late</h4><p>{summary.late}</p></div>
        <div className="sum-card half"><h4>Half Day</h4><p>{summary.half}</p></div>
        <div className="sum-card pct"><h4>Attendance %</h4><p>{summary.pct}%</p></div>
      </div>

      {/* FILTERS */}
      <div className="attendance-filters">
        <div>
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label>Month</label>
          <input
            type="month"
            value={viewMonth}
            onChange={(e) => setViewMonth(e.target.value)}
          />
        </div>

        <div>
          <label>Search</label>
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half">Half Day</option>
            <option value="not marked">Not marked</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Role</th>
              <th>Status ({selectedDate})</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((emp, i) => (
              <tr key={emp.id}>
                <td>{i + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.role}</td>

                {/* ⭐ COLORED STATUS DROPDOWN */}
                <td>
                  <select
                    className={`status-select ${statusClass(
                      rowStatus(emp.id)
                    )}`}
                    value={rowStatus(emp.id)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "not marked") clearStatus(emp.id);
                      else saveStatus(emp.id, val);
                    }}
                  >
                    <option value="not marked">-- Choose --</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half">Half Day</option>
                  </select>
                </td>
              </tr>
            ))}

            {visibleRows.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No matching records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
