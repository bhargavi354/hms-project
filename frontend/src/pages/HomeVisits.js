import React, { useState, useEffect } from "react";
import "./HomeVisits.css";
import API_BASE from "../config";


export default function HomeVisits() {
  const [showSection, setShowSection] = useState(false);

  const [visits, setVisits] = useState([]);

  const [patientsList, setPatientsList] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [patient, setPatient] = useState("");
  const [staff, setStaff] = useState("");
  const [visitType, setVisitType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Scheduled");

  // ⭐ LOAD PATIENTS
  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch(`${API_BASE}/patients`);

        const data = await res.json();
        setPatientsList(data);
      } catch (error) {
        console.error("Error loading patients:", error);
      }
    }
    loadPatients();
  }, []);

  // ⭐ LOAD STAFF
  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch(`${API_BASE}/employees`);

        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        console.error("Error loading staff:", error);
      }
    }
    loadStaff();
  }, []);

  // ⭐ LOAD VISITS
  async function loadVisits() {
    try {
    const res = await fetch(`${API_BASE}/home-visits`);

      const data = await res.json();
      setVisits(data);
    } catch (error) {
      console.error("Error loading visits:", error);
    }
  }

  useEffect(() => {
    if (showSection) loadVisits();
  }, [showSection]);

  // ⭐ ADD VISIT
  async function handleSubmit(e) {
    e.preventDefault();

    const data = { patient, staff, visitType, date, time, notes, status };

    await fetch(`${API_BASE}/home-visits`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    loadVisits();

    setPatient("");
    setStaff("");
    setVisitType("");
    setDate("");
    setTime("");
    setNotes("");
    setStatus("Scheduled");
  }

  // ⭐ DELETE
  async function handleDelete(id) {
    await fetch(`${API_BASE}/home-visits/${id}`, {

      method: "DELETE",
    });
    loadVisits();
  }

  // ⭐ VIEW POPUP
  function handleView(v) {
    alert(
`Patient: ${v.patient}
Staff: ${v.staff}
Visit Type: ${v.visitType}
Date: ${v.date}
Time: ${v.time}
Status: ${v.status}
Notes: ${v.notes}`
    );
  }

  return (
    <div className="container">

      {!showSection && (
        <div className="button-container">
          <button
            id="showSectionBtn"
            className="btn-submit"
            onClick={() => setShowSection(true)}
          >
            View Scheduled Visits
          </button>
        </div>
      )}

      {showSection && (
        <div id="homeVisitSection">
          <h2>Home Visit Management</h2>

          <form id="homeVisitForm" className="form-card" onSubmit={handleSubmit}>

            {/* ⭐ SEARCHABLE PATIENT */}
            <label>Select Patient</label>
            <input
              list="patientList"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Search or select patient..."
              required
            />
            <datalist id="patientList">
              {patientsList.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>

            {/* ⭐ SEARCHABLE STAFF */}
            <label>Select Medical Staff</label>
            <input
              list="staffList"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              placeholder="Search or select staff..."
              required
            />
            <datalist id="staffList">
              {staffList.map((s) => (
                <option key={s.id} value={`${s.name} (${s.role})`} />
              ))}
            </datalist>

            {/* ⭐ SEARCHABLE VISIT TYPE */}
            <label>Visit Type</label>
            <input
              list="visitTypeList"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              placeholder="Search or select visit type..."
              required
            />
            <datalist id="visitTypeList">
              <option value="Routine Checkup" />
              <option value="Physiotherapy" />
              <option value="Emergency Visit" />
            </datalist>


            <div className="date-time">
              <div>
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div>
                <label>Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>

            <label>Notes / Instructions</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter note or instruction for the visit"
            ></textarea>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button type="submit" className="btn-submit">Schedule Visit</button>
          </form>

          {/* TABLE */}
          <table className="visit-table" id="visitTable">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Staff</th>
                <th>Visit Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="visitTableBody">
              {visits.map((v) => (
                <tr key={v.id}>
                  <td>{v.patient}</td>
                  <td>{v.staff}</td>
                  <td>{v.visitType}</td>
                  <td>{v.date}</td>
                  <td>{v.time}</td>
                  <td>
                    <span className={`status-badge status-${v.status.toLowerCase()}`}>
                      {v.status}
                    </span>
                  </td>
                  <td title={v.notes}>{v.notes}</td>
                  <td>
                    <button className="action-btn view-btn" onClick={() => handleView(v)}>
                      View
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(v.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
