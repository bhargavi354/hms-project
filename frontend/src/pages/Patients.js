import React, { useEffect, useState, useMemo } from "react";
import "./Patients.css";
import API_BASE from "../config";


export default function Patients() {

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    phone: "",
    condition: "",
  });

  // Load patients from backend
  useEffect(() => {
  fetch(`${API_BASE}/patients`)
    .then((res) => res.json())
    .then((data) => setPatients(data))
    .catch((err) => console.error("Error:", err));
}, []);


  // FILTERING
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    filtered = filtered.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        p.condition.toLowerCase().includes(search.toLowerCase());

      const matchGender =
        genderFilter === "all" || p.gender === genderFilter;

      return matchSearch && matchGender;
    });

    if (selectedDate) {
      filtered = filtered.filter(
        (p) => p.createdAt?.slice(0, 10) === selectedDate
      );
    }

    return filtered;
  }, [patients, search, genderFilter, selectedDate]);

  // SUMMARY
  const summary = useMemo(
    () => ({
      total: patients.length,
      male: patients.filter((p) => p.gender === "male").length,
      female: patients.filter((p) => p.gender === "female").length,
      today: patients.filter(
        (p) =>
          p.createdAt?.slice(0, 10) ===
          new Date().toISOString().slice(0, 10)
      ).length,
    }),
    [patients]
  );

  // ADD + EDIT
  const savePatient = () => {
    if (!form.name || !form.age || !form.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      fetch(`${API_BASE}/patients/${editId}`, {

        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then(() => {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === editId ? { ...p, ...form } : p
          )
        );
      });
    } else {
      fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((newPatient) => {
          // ✅ FIX: add new patient at TOP
          setPatients((prev) => [newPatient, ...prev]);
        });
    }

    setShowModal(false);
  };

  const deletePatient = (id) => {
    if (!window.confirm("Delete this patient?")) return;

    fetch(`${API_BASE}/patients/${id}`, { method: "DELETE" }).then(() => {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      age: "",
      gender: "male",
      phone: "",
      condition: "",
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditId(p.id);
    setForm(p);
    setShowModal(true);
  };

  return (
    <div className="patients-page">
      {/* SUMMARY CARDS */}
      <div className="patients-summary">
        <div className="p-card blue">
          <h4>Total Patients</h4>
          <p>{summary.total}</p>
        </div>

        <div className="p-card green">
          <h4>Male</h4>
          <p>{summary.male}</p>
        </div>

        <div className="p-card pink">
          <h4>Female</h4>
          <p>{summary.female}</p>
        </div>

        <div className="p-card purple">
          <h4>New Today</h4>
          <p>{summary.today}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="patients-filters">
        <input
          type="text"
          placeholder="Search name, phone, condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-filter"
        />

        <button className="add-btn" onClick={openAddModal}>
          + Add Patient
        </button>
      </div>

      {/* TABLE */}
      <div className="patients-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.condition}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePatient(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  No matching records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editId ? "Edit Patient" : "Add Patient"}</h3>

            <input
              type="text"
              placeholder="Patient Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Condition / Problem"
              value={form.condition}
              onChange={(e) =>
                setForm({
                  ...form,
                  condition: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={savePatient}
              >
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
