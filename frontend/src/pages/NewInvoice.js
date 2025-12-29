import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Revenue.css";
import API_BASE from "../config";

export default function NewInvoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const opIdParam = searchParams.get("opId");
  const opId = Number(opIdParam);

  // OP DETAILS
  const [token, setToken] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [visitTime, setVisitTime] = useState("");

  // BILLING
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Paid");
  const [loading, setLoading] = useState(false);

  // LOAD OP DETAILS
  useEffect(() => {
    if (!opId) return;

    fetch(`${API_BASE}/op/${opId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.token) {
          alert("OP details not found");
          return;
        }

        setToken(data.token || "");
        setPatientName(data.patientName || "");
        setDoctor(data.doctor || "");
        setVisitTime(data.visitTime || "");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load OP details");
      });
  }, [opId]);

  // SAVE INVOICE (OP REVENUE API)
  const saveInvoice = async () => {
    if (!opId) {
      alert("Invalid OP ID");
      return;
    }

    if (!token || !patientName) {
      alert("OP details not loaded yet");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid bill amount");
      return;
    }

    const payload = {
      opId,
      token,
      patientName,
      doctor,
      visitTime,
      amount: Number(amount),
      status,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/op-revenue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create OP invoice");
        return;
      }

      alert("Invoice generated successfully");
      navigate(`/revenue/view?opId=${opId}`);
    } catch (err) {
      console.error(err);
      alert("Server error while saving invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="revenue-container">
      <h2 className="revenue-title">New Invoice</h2>

      <div className="revenue-form">
        <input value={token} disabled placeholder="OP Token" />
        <input value={patientName} disabled placeholder="Patient Name" />
        <input value={doctor} disabled placeholder="Doctor" />
        <input value={visitTime} disabled placeholder="Visit Time" />

        <input
          placeholder="Bill Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button
          className="save-btn"
          onClick={saveInvoice}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Invoice"}
        </button>

        <button
          className="cancel-btn"
          onClick={() => navigate("/op-booking")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
