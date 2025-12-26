// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "http://localhost:4000/api";

// helpers
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getMonthIndex(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length < 2) return null;
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(m)) return null;
  return m - 1;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const THERAPY_COLORS = [
  "#6366F1",
  "#F97316",
  "#22C55E",
  "#EC4899",
  "#A855F7",
];

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [homeVisits, setHomeVisits] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ profile from Settings (localStorage)
  const profile = JSON.parse(localStorage.getItem("userProfile")) || {};

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        setError("");

        const [pRes, eRes, hvRes, rRes] = await Promise.all([
          fetch(`${API}/patients`),
          fetch(`${API}/employees`),
          fetch(`${API}/home-visits`),
          fetch(`${API}/revenue`),
        ]);

        const [pData, eData, hvData, rData] = await Promise.all([
          pRes.json(),
          eRes.json(),
          hvRes.json(),
          rRes.json(),
        ]);

        setPatients(Array.isArray(pData) ? pData : []);
        setEmployees(Array.isArray(eData) ? eData : []);
        setHomeVisits(Array.isArray(hvData) ? hvData : []);
        setInvoices(Array.isArray(rData) ? rData : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  const today = todayISO();

  // ================= METRICS =================
  const metrics = useMemo(() => {
    const totalPatients = patients.length;

    const newToday = patients.filter(
      (p) => p.createdAt?.slice(0, 10) === today
    ).length;

    const activeStaff = employees.filter(
      (e) => (e.status || "").toLowerCase() === "active"
    ).length;

    const totalStaff = employees.length;
    const visitsToday = homeVisits.filter((v) => v.date === today).length;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    let revenueToday = 0;
    let revenueMonth = 0;
    let revenueYear = 0;

    invoices.forEach((inv) => {
      // ✅ FIX: use date or fallback to createdAt
      const dStr = inv.date || inv.createdAt?.slice(0, 10);
      if (!dStr) return;

      const [y, m, d] = dStr.split("-").map((x) => parseInt(x, 10));
      if (!y || !m || !d) return;

      const amount = Number(
        inv.finalAmount ?? inv.totalAmount ?? inv.amount ?? 0
      );

      if (dStr === today) revenueToday += amount;
      if (y === currentYear && m === currentMonthIndex + 1)
        revenueMonth += amount;
      if (y === currentYear)
        revenueYear += amount;
    });

    return {
      totalPatients,
      newToday,
      activeStaff,
      totalStaff,
      visitsToday,
      revenueToday,
      revenueMonth,
      revenueYear,
    };
  }, [patients, employees, homeVisits, invoices, today]);

  // ================= REVENUE CHART =================
  const revenueChartData = useMemo(() => {
    const base = MONTH_LABELS.map((name) => ({ name, revenue: 0 }));

    invoices.forEach((inv) => {
      const dStr = inv.date || inv.createdAt?.slice(0, 10);
      const idx = getMonthIndex(dStr);
      if (idx == null || idx < 0 || idx > 11) return;

      const amount = Number(
        inv.finalAmount ?? inv.totalAmount ?? inv.amount ?? 0
      );
      base[idx].revenue += amount;
    });

    return base;
  }, [invoices]);

  // Dummy therapy distribution
  const therapyData = [
    { name: "Physical Therapy", value: 40 },
    { name: "Speech Therapy", value: 15 },
    { name: "Mental Health", value: 20 },
    { name: "Pediatric Therapy", value: 15 },
    { name: "Occupational Therapy", value: 10 },
  ];

  return (
    <div className="dash-page">
      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Overview of your clinic at a glance.</p>
        </div>

        {/* PROFILE */}
        <div className="dash-header-right">
          <div className="user-pill">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="user-avatar-img"
              />
            ) : (
              <div className="user-avatar">
                {profile.name ? profile.name.charAt(0) : "B"}
              </div>
            )}

            <div className="user-info">
              <div className="user-name">
                {profile.name || "Bhargavi"}
              </div>
              <div className="user-role">
                {profile.role || "Admin · Central Medical"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      {/* TOP BIG CARDS */}
      <div className="dash-top-row">
        <div className="dash-card big purple">
          <div className="dash-card-label">Average Monthly Revenue</div>
          <div className="dash-card-value">
            ₹{metrics.revenueMonth.toLocaleString("en-IN")}
          </div>
          <div className="dash-card-note">
            Based on current month invoices
          </div>
        </div>

        <div className="dash-card big green">
          <div className="dash-card-label">Year-to-Date Revenue</div>
          <div className="dash-card-value">
            ₹{metrics.revenueYear.toLocaleString("en-IN")}
          </div>
          <div className="dash-card-note">
            From {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="dash-grid dash-grid-4">
        <div className="dash-card stat">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{metrics.totalPatients}</div>
          <div className="stat-foot">
            New today: <span>{metrics.newToday}</span>
          </div>
        </div>

        <div className="dash-card stat">
          <div className="stat-label">Staff</div>
          <div className="stat-value">
            {metrics.activeStaff} / {metrics.totalStaff}
          </div>
          <div className="stat-foot">Active / Total staff</div>
        </div>

        <div className="dash-card stat">
          <div className="stat-label">Home Visits Today</div>
          <div className="stat-value">{metrics.visitsToday}</div>
          <div className="stat-foot">Scheduled for {today}</div>
        </div>

        <div className="dash-card stat">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">
            ₹{metrics.revenueToday.toLocaleString("en-IN")}
          </div>
          <div className="stat-foot">From all invoices</div>
        </div>
      </div>

      {/* MAIN CHART + SIDE */}
      <div className="dash-main-row">
        <div className="dash-card chart-card">
          <div className="card-head">
            <h3>Revenue Overview</h3>
            <span className="chip chip-soft">This year</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card side-card">
          <div className="card-head">
            <h3>Therapy Distribution</h3>
            <span className="chip chip-soft">Sample</span>
          </div>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={therapyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {therapyData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={THERAPY_COLORS[i % THERAPY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && <div className="dash-loading">Loading dashboard...</div>}
    </div>
  );
}
