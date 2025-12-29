import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function ViewInvoice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const opIdParam = searchParams.get("opId");
  const opId = Number(opIdParam);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refunding, setRefunding] = useState(false);

  const fetchInvoice = () => {
    if (!opId) {
      setError("Invalid OP ID");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/revenue/by-op/${opId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load invoice");
        return data;
      })
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvoice();
  }, [opId]);

  const handleRefund = async () => {
    if (!window.confirm("Are you sure you want to refund this invoice?")) return;

    try {
      setRefunding(true);
      const res = await fetch(
        `${API_BASE}/revenue/refund/${opId}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Refund failed");

      alert("✅ Invoice refunded");
      fetchInvoice();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setRefunding(false);
    }
  };

  if (loading)
    return <h3 style={{ textAlign: "center" }}>Loading invoice...</h3>;

  if (error)
    return <h3 style={{ textAlign: "center", color: "red" }}>{error}</h3>;

  if (!invoice)
    return <h3 style={{ textAlign: "center" }}>No Invoice Found</h3>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#dff7ff, #c7f1f1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#eaffff",
          padding: 30,
          borderRadius: 12,
          width: 400,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0b7c7b" }}>Invoice</h2>

        <p><b>Invoice No:</b> {invoice.invoiceNo}</p>
        <p><b>Token:</b> {invoice.token}</p>
        <p><b>Patient:</b> {invoice.patientName}</p>
        <p><b>Doctor:</b> {invoice.doctor}</p>
        <p><b>Visit Time:</b> {invoice.visitTime}</p>
        <p><b>Amount:</b> ₹{invoice.amount}</p>
        <p>
          <b>Status:</b>{" "}
          <span
            style={{
              color: invoice.status === "Refunded" ? "red" : "green",
            }}
          >
            {invoice.status}
          </span>
        </p>

        {invoice.status !== "Refunded" && (
          <button
            onClick={handleRefund}
            disabled={refunding}
            style={{
              width: "100%",
              padding: 10,
              background: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            {refunding ? "Refunding..." : "Refund Invoice"}
          </button>
        )}

        <button
          onClick={() => window.print()}
          style={{
            width: "100%",
            padding: 10,
            background: "#198754",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          Print / Save as PDF
        </button>

        <button
          onClick={() => navigate("/op-booking")}
          style={{
            width: "100%",
            padding: 10,
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
