import React, { useEffect, useRef, useState } from "react";

export default function EmployeeCard({ e, onView, onEdit, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDocClick(ev) {
      if (!ref.current) return;
      if (!ref.current.contains(ev.target)) setOpen(false);
    }
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="employee-card fade-in" style={{ position: "relative" }}>
      <img src={e.img || `https://i.pravatar.cc/100?u=${e.email || e.id}`} alt={e.name} />
      <div className="info">
        <h4>{e.name}</h4>
        <p>{e.role}</p>
        <span className={`status ${e.status === "active" ? "active" : "inactive"}`}>{(e.status || "N/A").toUpperCase()}</span>
        <p>{e.dept}</p>
        <p>⭐ {e.rating ?? "-"} rating • {e.years ?? 0}y exp • {e.sessions ?? 0} sessions</p>
      </div>

      <div className="menu" ref={ref}>
        <button
          className="dots"
          onClick={(ev) => {
            ev.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          ⋮
        </button>

        <div className="menu-options" style={{ display: open ? "block" : "none" }}>
          <p onClick={() => { setOpen(false); onView?.(e.id); }}>View Profile</p>
          <p onClick={() => { setOpen(false); onEdit?.(e.id); }}>Edit</p>
          <p onClick={() => { setOpen(false); onRemove?.(e.id); }}>Remove</p>
        </div>
      </div>
    </div>
  );
}
