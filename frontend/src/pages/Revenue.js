/* eslint-disable */
import React, { useEffect, useMemo, useState, useRef } from "react";
import "./Revenue.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:4000/api";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function newInvoiceNo() {
  return "INV-" + Date.now();
}

export default function Revenue() {
  const [summary, setSummary] = useState({
    totalToday: 0,
    totalMonth: 0,
    pendingCount: 0,
    invoicesCount: 0,
  });
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const serviceList = [
    { desc: "Consultation", price: 300 },
    { desc: "Blood Test", price: 500 },
    { desc: "X-Ray", price: 700 },
    { desc: "Injection", price: 150 },
    { desc: "Medicine", price: 100 },
  ];

  const [form, setForm] = useState({
    invoiceNo: newInvoiceNo(),
    patientName: "",
    date: todayISO(),
    items: [{ desc: "", qty: 1, price: 0 }],
    totalAmount: 0,
    gstPercent: 18,
    discountPercent: 0,
    finalAmount: 0,
    status: "pending",
  });

  const invoiceRef = useRef();

  const loadInvoices = () => {
    fetch(`${API}/revenue`)
      .then((r) => r.json())
      .then((data) => setInvoices(Array.isArray(data) ? data : data.rows || []))
      .catch(() => setInvoices([]));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    const total = form.items.reduce(
      (s, it) => s + Number(it.qty || 0) * Number(it.price || 0),
      0
    );
    const gst = (total * Number(form.gstPercent || 0)) / 100;
    const disc = (total * Number(form.discountPercent || 0)) / 100;
    const finalAmount = Math.max(0, total + gst - disc);

    setForm((p) => ({ ...p, totalAmount: total, finalAmount }));

    const today = todayISO();
    const totalToday = invoices
      .filter((i) => i.date === today)
      .reduce(
        (s, it) =>
          s +
          Number(it.finalAmount ?? it.totalAmount ?? it.amount ?? 0),
        0
      );
    const thisMonth = today.slice(0, 7);
    const totalMonth = invoices
      .filter((i) => (i.date || "").slice(0, 7) === thisMonth)
      .reduce(
        (s, it) =>
          s +
          Number(it.finalAmount ?? it.totalAmount ?? it.amount ?? 0),
        0
      );
    const pendingCount = invoices.filter(
      (i) => (i.status || "pending") !== "paid"
    ).length;

    setSummary({
      totalToday,
      totalMonth,
      pendingCount,
      invoicesCount: invoices.length,
    });
  }, [form.items, form.gstPercent, form.discountPercent, invoices]);

  function setItem(idx, key, val) {
    setForm((prev) => {
      const items = [...prev.items];
      let newItem = { ...items[idx], [key]: val };

      if (key === "desc") {
        const found = serviceList.find((s) => s.desc === val);
        if (found) newItem.price = found.price;
      }
      if (key === "qty" || key === "price") newItem[key] = Number(val);

      items[idx] = newItem;
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((p) => ({
      ...p,
      items: [...p.items, { desc: "", qty: 1, price: 0 }],
    }));
  }

  function removeItem(idx) {
    setForm((p) => ({
      ...p,
      items: p.items.filter((_, i) => i !== idx),
    }));
  }

  function openNew() {
    setForm({
      invoiceNo: newInvoiceNo(),
      patientName: "",
      date: todayISO(),
      items: [{ desc: "", qty: 1, price: 0 }],
      totalAmount: 0,
      gstPercent: 18,
      discountPercent: 0,
      finalAmount: 0,
      status: "pending",
    });
    setShowModal(true);
  }

  function saveInvoice() {
    if (!form.patientName) {
      alert("Enter patient name");
      return;
    }

    const payload = {
      invoiceNo: form.invoiceNo,
      patientName: form.patientName,
      patient: form.patientName,
      date: form.date,
      items: JSON.stringify(form.items),
      totalAmount: form.totalAmount,
      gst: (form.totalAmount * form.gstPercent) / 100,
      discount: (form.totalAmount * form.discountPercent) / 100,
      finalAmount: form.finalAmount,
      status: "pending",
    };

    fetch(`${API}/revenue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        setShowModal(false);
        loadInvoices(); // ✅ refresh from DB
      })
      .catch(() => alert("Save failed"));
  }

  function togglePaid(inv) {
    const newStatus =
      (inv.status || "pending") === "paid" ? "pending" : "paid";

    fetch(`${API}/revenue/${inv.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(() => loadInvoices())
      .catch(console.error);
  }

  function deleteInvoice(id) {
    if (!window.confirm("Delete invoice?")) return;
    fetch(`${API}/revenue/${id}`, { method: "DELETE" })
      .then(() => loadInvoices())
      .catch(console.error);
  }

  async function downloadPdf() {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${form.invoiceNo}.pdf`);
  }

  const chartData = useMemo(() => {
    const map = {};
    invoices.forEach((i) => {
      const k = (i.date || "").slice(0, 7);
      map[k] =
        (map[k] || 0) +
        Number(i.finalAmount ?? i.totalAmount ?? i.amount ?? 0);
    });
    return Object.keys(map).map((k) => ({ month: k, revenue: map[k] }));
  }, [invoices]);

  const money = (n) => `₹${Number(n || 0).toLocaleString()}`;

  return (
    <div className="revenue-page" style={{ padding: 20 }}>
      <h2>Revenue</h2>

      <button onClick={openNew} style={{ padding: 12, width: "100%" }}>
        + New Invoice
      </button>

      <div style={{ height: 220, margin: "20px 0" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table style={{ width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Invoice</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => (
            <tr key={inv.id}>
              <td>{i + 1}</td>
              <td>{inv.invoiceNo}</td>
              <td>{inv.patientName || inv.patient || "-"}</td>
              <td>{inv.date}</td>
              <td>
                {money(
                  inv.finalAmount ??
                    inv.totalAmount ??
                    inv.amount ??
                    0
                )}
              </td>
              <td>{inv.status || "pending"}</td>
              <td>
                <button onClick={() => togglePaid(inv)}>
                  {inv.status === "paid" ? "Mark Pending" : "Mark Paid"}
                </button>
                <button onClick={() => deleteInvoice(inv.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div ref={invoiceRef}>
              <h3>New Invoice</h3>

              <input
                placeholder="Patient name"
                value={form.patientName}
                onChange={(e) =>
                  setForm({ ...form, patientName: e.target.value })
                }
                style={{ width: "100%", padding: 10 }}
              />

              <h4>Items</h4>
              {form.items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr auto",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <input
                    list="services"
                    value={it.desc}
                    onChange={(e) =>
                      setItem(idx, "desc", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) =>
                      setItem(idx, "qty", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e) =>
                      setItem(idx, "price", e.target.value)
                    }
                  />
                  <div>{money(it.qty * it.price)}</div>
                  <button onClick={() => removeItem(idx)}>
                    ×
                  </button>
                </div>
              ))}
              <datalist id="services">
                {serviceList.map((s) => (
                  <option key={s.desc} value={s.desc} />
                ))}
              </datalist>

              <button onClick={addItem}>+ Add Item</button>

              <p>Total: {money(form.totalAmount)}</p>
              <p>Final: {money(form.finalAmount)}</p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
              }}
            >
              <button onClick={saveInvoice}>Save</button>
              <button onClick={downloadPdf}>
                Download PDF
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
