import React, { useState } from "react";
import "./OpAddModal.css";

export default function OpAddModal({ onClose, onSuccess }) {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [doctor, setDoctor] = useState("");
  const [visitTime, setVisitTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientName,
      age: Number(age),
      gender,
      phone,
      problem,
      doctor,
      visitTime,
    };

    try {
      const res = await fetch("http://localhost:4000/api/op", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to add OP");
        return;
      }

      await res.json();

      onSuccess(); // 🔄 reload OP list
      onClose();   // ❌ close modal
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div className="op-modal-overlay">
      <div className="op-modal">
        <h3>Add OP</h3>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />

          <input
            placeholder="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            placeholder="Problem / Complaint"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
          />

          <input
            placeholder="Doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />

          <input
            placeholder="Visit Time (eg: 10:30 am)"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            required
          />

          <div className="op-modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
