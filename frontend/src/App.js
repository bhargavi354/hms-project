import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Attendance from "./pages/Attendance";
import Employees from "./pages/Employees";
import Revenue from "./pages/Revenue";
import HomeVisits from "./pages/HomeVisits";
import Settings from "./pages/Settings";

import OpLogin from "./op/OpLogin";
import OpBooking from "./op/OpBooking";
import OpDashboard from "./op/OpDashboard";
import Reports from "./op/Reports";

import NewInvoice from "./pages/NewInvoice";
import ViewInvoice from "./pages/ViewInvoice";

// ================= PROTECTED ROUTES =================

// ADMIN
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("hms_logged_in");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// OP STAFF
function OpProtectedRoute({ children }) {
  const isOpLoggedIn = localStorage.getItem("op_logged_in");
  return isOpLoggedIn ? children : <Navigate to="/op-login" replace />;
}

function App() {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/op-login" element={<OpLogin />} />

      {/* ================= OP STAFF ================= */}
      <Route path="/op" element={<Navigate to="/op-dashboard" replace />} />

      <Route
        path="/op-dashboard"
        element={
          <OpProtectedRoute>
            <OpDashboard />
          </OpProtectedRoute>
        }
      />

      <Route
        path="/op-booking"
        element={
          <OpProtectedRoute>
            <OpBooking />
          </OpProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <OpProtectedRoute>
            <Reports />
          </OpProtectedRoute>
        }
      />

      <Route
        path="/revenue/new"
        element={
          <OpProtectedRoute>
            <NewInvoice />
          </OpProtectedRoute>
        }
      />

      <Route
        path="/revenue/view"
        element={
          <OpProtectedRoute>
            <ViewInvoice />
          </OpProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="employees" element={<Employees />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="home-visits" element={<HomeVisits />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
