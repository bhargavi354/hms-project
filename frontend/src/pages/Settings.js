import React, { useState } from "react";
import "./Settings.css";

const SECTIONS = [
  "Profile Settings",
  "Change Password",
  "System Preferences",
  "Backup & Restore",
];

export default function Settings() {
  const [active, setActive] = useState("Profile Settings");

  const renderContent = () => {
    switch (active) {
      case "Profile Settings":
        return (
          <div>
            <h3>Profile Settings</h3>
            <p>Name, email, phone details can be managed here.</p>
          </div>
        );

      case "Change Password":
        return (
          <div>
            <h3>Change Password</h3>
            <p>Update your account password here.</p>
          </div>
        );

      case "System Preferences":
        return (
          <div>
            <h3>System Preferences</h3>
            <p>Theme, language, and system options.</p>
          </div>
        );

      case "Backup & Restore":
        return (
          <div>
            <h3>Backup & Restore</h3>
            <p>Take backup or restore system data.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">⚙️ Settings</h2>

      <div className="settings-card">
        {/* Left Menu */}
        <div className="settings-sidebar">
          {SECTIONS.map((item) => (
            <button
              key={item}
              className={
                active === item
                  ? "settings-tab active"
                  : "settings-tab"
              }
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
