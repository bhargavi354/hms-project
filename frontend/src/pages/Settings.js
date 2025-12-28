import React, { useEffect, useState } from "react";
import "./Settings.css";

const SECTIONS = [
  "Profile Settings",
  "Theme & Appearance",
  "Notifications",
  "Change Password",
  "Privacy & Security",
  "System Preferences",
  "Backup & Restore",
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("Profile Settings");

  // ===== Profile =====
  const [profileName, setProfileName] = useState(
    localStorage.getItem("hms_profile_name") || "Bhargavi"
  );
  const [profileEmail, setProfileEmail] = useState(
    localStorage.getItem("hms_profile_email") || "bbhargavi738@gmail.com"
  );
  const [profilePhone, setProfilePhone] = useState(
    localStorage.getItem("hms_profile_phone") || "+917601075506"
  );
  const [avatar, setAvatar] = useState(
    localStorage.getItem("hms_profile_avatar") || ""
  );
  const [profileMsg, setProfileMsg] = useState("");

  // ===== Theme =====
  const [theme, setTheme] = useState(
    localStorage.getItem("hms_theme") || "light"
  );

  // ===== Notifications =====
  const [notifications, setNotifications] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("hms_notifications")) || {
          email: true,
          sms: true,
          appointments: false,
        }
      );
    } catch {
      return { email: true, sms: true, appointments: false };
    }
  });

  // ===== Password =====
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // ===== Privacy =====
  const [privacy, setPrivacy] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("hms_privacy")) || {
          twoFactor: false,
          shareAnalytics: true,
          securityAlerts: true,
        }
      );
    } catch {
      return { twoFactor: false, shareAnalytics: true, securityAlerts: true };
    }
  });

  // ===== System =====
  const [language, setLanguage] = useState(
    localStorage.getItem("hms_language") || "en"
  );
  const [systemMsg, setSystemMsg] = useState("");

  // ===== Backup =====
  const [backupMsg, setBackupMsg] = useState("");
  const [restoreError, setRestoreError] = useState("");

  // ===== Effects =====
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("hms_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("hms_profile_name", profileName);
    localStorage.setItem("hms_profile_email", profileEmail);
    localStorage.setItem("hms_profile_phone", profilePhone);

    // 👉 Small object for dashboard (avoid base64 quota issue)
    const userProfile = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      role: "Admin · Central Medical",
      photo: localStorage.getItem("hms_profile_avatar") || "",
    };
    try {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } catch (e) {
      console.warn("userProfile not saved (quota).");
    }
  }, [profileName, profileEmail, profilePhone]);

  useEffect(() => {
    if (avatar) {
      localStorage.setItem("hms_profile_avatar", avatar);
    }
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem("hms_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("hms_privacy", JSON.stringify(privacy));
  }, [privacy]);

  useEffect(() => {
    localStorage.setItem("hms_language", language);
  }, [language]);

  // ===== Handlers =====
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // limit size ~200KB
    if (file.size > 200 * 1024) {
      alert("Please choose image below 200KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    setProfileMsg("Profile updated successfully.");
    setTimeout(() => setProfileMsg(""), 2000);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordSave = () => {
    setPwdError("");
    setPwdMsg("");

    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("Password must be at least 6 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Passwords do not match.");
      return;
    }

    setPwdMsg("Password changed successfully.");
    setOldPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageSave = () => {
    setSystemMsg("Language saved.");
    setTimeout(() => setSystemMsg(""), 2000);
  };

  // ===== Backup / Restore =====
  const handleBackup = () => {
    const data = {
      profileName,
      profileEmail,
      profilePhone,
      avatar,
      theme,
      notifications,
      privacy,
      language,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hms-settings-backup.json";
    a.click();
    URL.revokeObjectURL(url);

    setBackupMsg("Backup downloaded successfully.");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        setProfileName(json.profileName || "");
        setProfileEmail(json.profileEmail || "");
        setProfilePhone(json.profilePhone || "");
        setAvatar(json.avatar || "");
        setTheme(json.theme || "light");
        setNotifications(json.notifications || notifications);
        setPrivacy(json.privacy || privacy);
        setLanguage(json.language || "en");

        setBackupMsg("Settings restored successfully.");
        setRestoreError("");
      } catch {
        setRestoreError("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  // ===== Panels =====
  const renderProfile = () => (
    <div className="settings-panel">
      <h2>Profile Settings</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #0a7",
            }}
          />
        ) : (
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#e0f7f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#0a7",
            }}
          >
            {profileName.charAt(0)}
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
      <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
      <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />

      {profileMsg && <p style={{ color: "green" }}>{profileMsg}</p>}
      <button onClick={handleProfileSave}>Save</button>
    </div>
  );

  const renderTheme = () => (
    <div className="settings-panel">
      <h2>Theme & Appearance</h2>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <p>Current: {theme}</p>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-panel">
      <h2>Notifications</h2>
      <label>
        <input type="checkbox" checked={notifications.email}
          onChange={() => toggleNotification("email")} /> Email
      </label>
      <label>
        <input type="checkbox" checked={notifications.sms}
          onChange={() => toggleNotification("sms")} /> SMS
      </label>
      <label>
        <input type="checkbox" checked={notifications.appointments}
          onChange={() => toggleNotification("appointments")} /> Appointments
      </label>
    </div>
  );

  const renderChangePassword = () => (
    <div className="settings-panel">
      <h2>Change Password</h2>
      <input type="password" placeholder="Old" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
      <input type="password" placeholder="New" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
      <input type="password" placeholder="Confirm" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
      {pwdError && <p style={{ color: "red" }}>{pwdError}</p>}
      {pwdMsg && <p style={{ color: "green" }}>{pwdMsg}</p>}
      <button onClick={handlePasswordSave}>Update</button>
    </div>
  );

  const renderPrivacy = () => (
    <div className="settings-panel">
      <h2>Privacy & Security</h2>
      <label><input type="checkbox" checked={privacy.twoFactor}
        onChange={() => togglePrivacy("twoFactor")} /> Two Factor</label>
      <label><input type="checkbox" checked={privacy.shareAnalytics}
        onChange={() => togglePrivacy("shareAnalytics")} /> Share Analytics</label>
      <label><input type="checkbox" checked={privacy.securityAlerts}
        onChange={() => togglePrivacy("securityAlerts")} /> Security Alerts</label>
    </div>
  );

  const renderSystemPreferences = () => (
    <div className="settings-panel">
      <h2>System Preferences</h2>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="te">Telugu</option>
      </select>
      {systemMsg && <p style={{ color: "green" }}>{systemMsg}</p>}
      <button onClick={handleLanguageSave}>Save</button>
    </div>
  );

  const renderBackupRestore = () => (
    <div className="settings-panel">
      <h2>Backup & Restore</h2>
      <button onClick={handleBackup}>Download Backup</button>
      <br /><br />
      <input type="file" accept="application/json" onChange={handleRestore} />
      {backupMsg && <p style={{ color: "green" }}>{backupMsg}</p>}
      {restoreError && <p style={{ color: "red" }}>{restoreError}</p>}
    </div>
  );

  const renderRightPanel = () => {
    switch (activeSection) {
      case "Profile Settings": return renderProfile();
      case "Theme & Appearance": return renderTheme();
      case "Notifications": return renderNotifications();
      case "Change Password": return renderChangePassword();
      case "Privacy & Security": return renderPrivacy();
      case "System Preferences": return renderSystemPreferences();
      case "Backup & Restore": return renderBackupRestore();
      default: return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="settings-sidebar">
          {SECTIONS.map((label) => (
            <button
              key={label}
              className={activeSection === label ? "settings-tab active" : "settings-tab"}
              onClick={() => setActiveSection(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="settings-content">{renderRightPanel()}</div>
      </div>
    </div>
  );
}
