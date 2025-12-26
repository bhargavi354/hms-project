import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OpBooking.css";

export default function OpBooking() {
  const navigate = useNavigate();

  const [ops, setOps] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [revenue, setRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    problem: "",
    doctor: "",
    visitTime: "",
  });

  useEffect(() => {
    fetchOps();
    fetchRevenue();
  }, []);

  const fetchOps = async () => {
    let url = "http://localhost:4000/api/op";
    const params = [];

    if (search) params.push(`search=${search}`);
    if (date) params.push(`date=${date}`);
    if (params.length) url += `?${params.join("&")}`;

    const res = await fetch(url);
    const data = await res.json();
    setOps(data);
  };

  // ✅ FIXED: Fetch OP revenue stats (not admin)
  const fetchRevenue = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/op-revenue/stats"
      );
      const data = await res.json();
      setRevenue(data.totalRevenue || 0);
      setTodayRevenue(data.todayRevenue || 0);
    } catch (err) {
      console.error("Revenue load failed", err);
    }
  };

  useEffect(() => {
    fetchOps();
  }, [search, date]);

  const today = new Date().toISOString().slice(0, 10);

  const todayCount = ops.filter(
    (op) => op.createdAt && op.createdAt.slice(0, 10) === today
  ).length;

  const pendingCount = ops.filter((op) => op.status === "Pending").length;
  const completedCount = ops.filter((op) => op.status === "Completed").length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.patientName || !form.visitTime) {
      alert("Patient name & time required");
      return;
    }

    await fetch("http://localhost:4000/api/op", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      patientName: "",
      age: "",
      gender: "",
      phone: "",
      problem: "",
      doctor: "",
      visitTime: "",
    });

    setShowForm(false);
    fetchOps();
    fetchRevenue();
  };

  const markCompleted = async (id) => {
    await fetch(`http://localhost:4000/api/op/${id}/complete`, {
      method: "PUT",
    });
    fetchOps();
    fetchRevenue();
  };

  return (
    <div className="op-container">
      <h2 className="title">OP Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h4>Today OP</h4>
          <h2>{todayCount}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Pending</h4>
          <h2>{pendingCount}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Completed</h4>
          <h2>{completedCount}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Today Revenue</h4>
          <h2>₹ {todayRevenue}</h2>
        </div>

        <div style={cardStyle}>
          <h4>Revenue</h4>
          <h2>₹ {revenue}</h2>
        </div>
      </div>

      <h2 className="op-title">OP Booking</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          className="search"
          placeholder="Search by Token / Patient Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          className="search"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => setShowForm(true)}>
        + Add OP
      </button>

      {showForm && (
        <div className="op-form">
          <input
            name="patientName"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={handleChange}
          />
          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="problem"
            placeholder="Problem"
            value={form.problem}
            onChange={handleChange}
          />
          <input
            name="doctor"
            placeholder="Doctor"
            value={form.doctor}
            onChange={handleChange}
          />

          <input
            type="time"
            name="visitTime"
            value={form.visitTime}
            onChange={handleChange}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Doctor</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {ops
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((op) => (
              <tr key={op.id}>
                <td>{op.token}</td>
                <td>{op.patientName}</td>
                <td>{op.doctor}</td>
                <td>{op.visitTime}</td>
                <td>{op.status}</td>
                <td>
                  {op.status === "Pending" && (
                    <button onClick={() => markCompleted(op.id)}>
                      Complete
                    </button>
                  )}

                  {op.status === "Completed" && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/revenue/new?opId=${op.id}`)
                        }
                      >
                        Generate Bill
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/revenue/view?opId=${op.id}`)
                        }
                      >
                        View Bill
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};
