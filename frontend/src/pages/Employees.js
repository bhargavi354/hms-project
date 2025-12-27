// frontend/src/pages/Employees.js

import React, { useEffect, useMemo, useState } from "react";
import EmployeeCard from "../components/EmployeeCard";
import "./Employees.css";
import API_BASE from "../config";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // modal fields
  const [mName, setMName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mRole, setMRole] = useState("");
  const [mDept, setMDept] = useState("");
  const [mStatus, setMStatus] = useState("active");
  const [mRating, setMRating] = useState(4.5);
  const [mYears, setMYears] = useState(1);
  const [mSessions, setMSessions] = useState(0);
  const [mImg, setMImg] = useState(""); // ⭐ profile photo (base64 or URL)

  // ------- LOAD EMPLOYEES FROM BACKEND -------
  async function loadEmployees() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employees`);

      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading employees:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  // ------- DERIVED VALUES -------
  const roles = useMemo(() => {
    const s = new Set(employees.map((e) => e.role).filter(Boolean));
    return Array.from(s);
  }, [employees]);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "active").length;
    const avg = total
      ? (
          employees.reduce((s, e) => s + (Number(e.rating) || 0), 0) / total
        ).toFixed(1)
      : "0.0";
    const sessions = employees.reduce(
      (s, e) => s + (Number(e.sessions) || 0),
      0
    );
    return { total, active, avg, sessions };
  }, [employees]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return employees.filter((e) => {
      const matchesQ =
        !q ||
        [e.name, e.email, e.role]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q));
      const matchesRole =
        roleFilter === "all" ||
        (e.role || "").toLowerCase().includes(roleFilter.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter;
      return matchesQ && matchesRole && matchesStatus;
    });
  }, [employees, query, roleFilter, statusFilter]);

  // ------- CRUD HANDLERS (BACKEND) -------
  function handleView(id) {
    const e = employees.find((x) => x.id === id);
    if (!e) return alert("Employee not found");
    alert(
      `${e.name}\n\nRole: ${e.role}\nDept: ${e.dept}\nEmail: ${e.email}\nRating: ${e.rating}\nSessions: ${e.sessions}\nStatus: ${e.status}`
    );
  }

  function handleEdit(id) {
    const e = employees.find((x) => x.id === id);
    if (!e) return;
    setEditingId(id);
    setMName(e.name || "");
    setMEmail(e.email || "");
    setMRole(e.role || "");
    setMDept(e.dept || "");
    setMStatus(e.status || "active");
    setMRating(e.rating ?? 4.5);
    setMYears(e.years ?? 0);
    setMSessions(e.sessions ?? 0);
    setMImg(e.img || "");
    setModalVisible(true);
  }

  async function handleRemove(id) {
    if (!window.confirm("Remove this employee?")) return;
    try {
      await fetch(`${API_BASE}/employees/${id}`, {

        method: "DELETE",
      });
      await loadEmployees();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete employee");
    }
  }

  function openAdd() {
    setEditingId(null);
    setMName("");
    setMEmail("");
    setMRole("");
    setMDept("");
    setMStatus("active");
    setMRating(4.5);
    setMYears(1);
    setMSessions(0);
    setMImg("");
    setModalVisible(true);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMImg(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  }

  async function saveModal() {
    const name = (mName || "").trim();
    if (!name) return alert("Name required");

    const payload = {
      name,
      email: mEmail || `${name.toLowerCase().replace(/\s+/g, ".")}@clinic.local`,
      role: mRole || "Staff",
      dept: mDept || "General",
      status: mStatus,
      rating: parseFloat(mRating) || 4.5,
      years: parseInt(mYears) || 0,
      sessions: parseInt(mSessions) || 0,
      img:
        mImg ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    try {
      if (editingId) {
        await fetch(`${API_BASE}/employees/${editingId}`, {

          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setModalVisible(false);
      await loadEmployees();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save employee");
    }
  }

  // ------- DEPARTMENTS, SCHEDULES, PERFORMANCE -------
  const deptMap = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      const k = e.dept || "General";
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    return map;
  }, [employees]);

  const schedules = employees.map((e) => ({
    id: e.id,
    name: e.name,
    date: e.nextShift || "TBD",
  }));

  const performance = [...employees].sort(
    (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
  );

  return (
    <div>
      <header className="topbar" style={{ margin: 8 }}>
        <div className="left">
          <h2>Employee Management</h2>
          <p>Manage staff, schedules, and performance metrics</p>
        </div>
        <div className="right">
          <input
            id="globalSearch"
            type="text"
            placeholder="🔍 Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button id="addButton" className="add-btn" onClick={openAdd}>
            + Add Employee
          </button>
        </div>
      </header>

      <main className="container">
        {/* Stats */}
        <section className="stats" aria-hidden="false">
          <div className="card">
            <h3>Total Employees</h3>
            <p className="num" id="statTotal">
              {loading ? "..." : stats.total}
            </p>
          </div>
          <div className="card">
            <h3>Active Staff</h3>
            <p className="num" id="statActive">
              {loading ? "..." : stats.active}
            </p>
          </div>
          <div className="card">
            <h3>Avg Rating</h3>
            <p className="num" id="statRating">
              {loading ? "..." : stats.avg}
            </p>
          </div>
          <div className="card">
            <h3>Sessions Done</h3>
            <p className="num" id="statSessions">
              {loading ? "..." : stats.sessions}
            </p>
          </div>
        </section>

        {/* Tabs */}
        <nav className="tabs" role="tablist">
          <button
            className={`tab ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${tab === "departments" ? "active" : ""}`}
            onClick={() => setTab("departments")}
          >
            Departments
          </button>
          <button
            className={`tab ${tab === "schedules" ? "active" : ""}`}
            onClick={() => setTab("schedules")}
          >
            Schedules
          </button>
          <button
            className={`tab ${tab === "performance" ? "active" : ""}`}
            onClick={() => setTab("performance")}
          >
            Performance
          </button>
        </nav>

        {/* Filters */}
        <section className="filters">
          <input
            id="searchInput"
            type="text"
            placeholder="Search employees by name, email, or role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            id="roleSelect"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r.toLowerCase()}>
                {r}
              </option>
            ))}
          </select>
          <select
            id="statusSelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>

        {/* Overview */}
        <section
          id="overview"
          className={`tab-panel ${tab === "overview" ? "active" : ""}`}
        >
          <div className="employee-grid">
            {loading ? (
              <div className="placeholder">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="placeholder">No employees found.</div>
            ) : (
              filtered.map((e) => (
                <EmployeeCard
                  key={e.id}
                  e={e}
                  onView={handleView}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </section>

        {/* Departments */}
        <section
          id="departments"
          className={`tab-panel ${
            tab === "departments" ? "active" : ""
          }`}
        >
          <div className="department-grid">
            {Object.keys(deptMap).map((d) => (
              <div className="dept-card fade-in" key={d}>
                <h4>
                  {d}{" "}
                  <small style={{ color: "#6b7280" }}>
                    ({deptMap[d].length})
                  </small>
                </h4>
                <div className="dept-list">
                  {deptMap[d].map((p) => (
                    <div key={p.id}>
                      {p.name} •{" "}
                      <span style={{ color: "#6b7280" }}>{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedules */}
        <section
          id="schedules"
          className={`tab-panel ${tab === "schedules" ? "active" : ""}`}
        >
          <div className="schedule-list">
            {schedules.map((s) => (
              <div className="schedule-item fade-in" key={s.id}>
                <div>
                  <strong>{s.name}</strong>
                  <div style={{ color: "#6b7280", fontSize: 13 }}></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{s.date}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>
                    Next Shift
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance */}
        <section
          id="performance"
          className={`tab-panel ${
            tab === "performance" ? "active" : ""
          }`}
        >
          <div className="performance-table-wrap">
            <table className="performance-table" id="performanceTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Sessions</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((e) => (
                  <tr key={e.id} className="fade-in">
                    <td>{e.name}</td>
                    <td>{e.role}</td>
                    <td>{e.dept}</td>
                    <td>{e.sessions}</td>
                    <td>⭐ {e.rating}</td>
                    <td>
                      <button className="link" onClick={() => handleView(e.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal */}
      <div
        id="modal"
        className={`modal ${modalVisible ? "visible" : ""}`}
        aria-hidden={!modalVisible}
      >
        <div
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <h3 id="modalTitle">
            {editingId ? "Edit Employee" : "Add Employee"}
          </h3>

          <form
            className="form-grid"
            onSubmit={(ev) => {
              ev.preventDefault();
              saveModal();
            }}
          >
            <label>
              Full name
              <input
                value={mName}
                onChange={(e) => setMName(e.target.value)}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={mEmail}
                onChange={(e) => setMEmail(e.target.value)}
              />
            </label>

            <label>
              Role
              <input
                value={mRole}
                onChange={(e) => setMRole(e.target.value)}
              />
            </label>

            <label>
              Department
              <input
                value={mDept}
                onChange={(e) => setMDept(e.target.value)}
              />
            </label>

            <label>
              Status
              <select
                value={mStatus}
                onChange={(e) => setMStatus(e.target.value)}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>

            <label>
              Rating (0.0 - 5.0)
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={mRating}
                onChange={(e) => setMRating(e.target.value)}
              />
            </label>

            <label>
              Years of experience
              <input
                type="number"
                min="0"
                value={mYears}
                onChange={(e) => setMYears(e.target.value)}
              />
            </label>

            <label>
              Sessions done
              <input
                type="number"
                min="0"
                value={mSessions}
                onChange={(e) => setMSessions(e.target.value)}
              />
            </label>

            <label>
              Profile Photo
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {mImg && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={mImg}
                  alt="Preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </form>

          <div className="modal-actions">
            <button
              className="btn-muted"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={saveModal}>
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
