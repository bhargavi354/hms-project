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
    console.log("✅ Settings component mounted");
  console.log("Settings rendered");
  const [activeSection, setActiveSection] = useState("Profile Settings");

  // ---------- PROFILE ----------
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

  // ---------- THEME ----------
  const [theme, setTheme] = useState(
    localStorage.getItem("hms_theme") || "light"
  );

  // ---------- NOTIFICATIONS ----------
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

  // ---------- CHANGE PASSWORD ----------
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // ---------- PRIVACY ----------
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

  // ---------- SYSTEM PREFS ----------
  const [language, setLanguage] = useState(
    localStorage.getItem("hms_language") || "en"
  );
  const [systemMsg, setSystemMsg] = useState("");

  // ---------- BACKUP / RESTORE ----------
  const [backupMsg, setBackupMsg] = useState("");
  const [restoreError, setRestoreError] = useState("");

  // ===== EFFECTS =====

  // Apply theme to <body> and save
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("hms_theme", theme);
  }, [theme]);

  // Persist individual profile fields
  useEffect(() => {
    localStorage.setItem("hms_profile_name", profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem("hms_profile_email", profileEmail);
  }, [profileEmail]);

  useEffect(() => {
    localStorage.setItem("hms_profile_phone", profilePhone);
  }, [profilePhone]);

  useEffect(() => {
    if (avatar) {
      localStorage.setItem("hms_profile_avatar", avatar);
    }
  }, [avatar]);

  // ⭐⭐⭐ NEW — Save unified profile object for Dashboard ⭐⭐⭐
  useEffect(() => {
    const fullProfile = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      photo: avatar,
      role: "Admin · Central Medical",
    };
    localStorage.setItem("userProfile", JSON.stringify(fullProfile));
  }, [profileName, profileEmail, profilePhone, avatar]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem("hms_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Persist privacy
  useEffect(() => {
    localStorage.setItem("hms_privacy", JSON.stringify(privacy));
  }, [privacy]);

  // Persist language
  useEffect(() => {
    localStorage.setItem("hms_language", language);
  }, [language]);

  // ===== HANDLERS =====

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    setProfileMsg("Profile updated successfully.");
    setTimeout(() => setProfileMsg(""), 2500);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordSave = () => {
    setPwdError("");
    setPwdMsg("");

    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdError("Please fill all password fields.");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("New password should be at least 6 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New password and confirm password do not match.");
      return;
    }

    setPwdMsg("Password changed successfully.");
    setOldPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => setPwdMsg(""), 3000);
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageSave = () => {
    setSystemMsg("Language preference saved.");
    setTimeout(() => setSystemMsg(""), 2500);
  };

  const handleBackup = () => {
    setBackupMsg("");
    setRestoreError("");

    const data = {
      profile: {
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        avatar,
      },
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
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setBackupMsg("Settings backup downloaded.");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupMsg("");
    setRestoreError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (json.profile) {
          setProfileName(json.profile.name || "");
          setProfileEmail(json.profile.email || "");
          setProfilePhone(json.profile.phone || "");
          if (json.profile.avatar) setAvatar(json.profile.avatar);
        }
        if (json.theme) setTheme(json.theme);
        if (json.notifications) setNotifications(json.notifications);
        if (json.privacy) setPrivacy(json.privacy);
        if (json.language) setLanguage(json.language);

        setBackupMsg("Settings restored successfully.");
        setTimeout(() => setBackupMsg(""), 3000);
      } catch (err) {
        setRestoreError("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  // ========= RENDER HELPERS =========

  const renderProfile = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Profile Settings</h2>

      <div className="profile-avatar-row">
        <div className="avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt="avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">B</div>
          )}
        </div>
        <div className="avatar-upload">
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      </div>

      <div className="settings-field">
        <label>Name</label>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <label>Email</label>
        <input
          type="email"
          value={profileEmail}
          onChange={(e) => setProfileEmail(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <label>Phone</label>
        <input
          type="tel"
          value={profilePhone}
          onChange={(e) => setProfilePhone(e.target.value)}
        />
      </div>

      {profileMsg && <div className="settings-success">{profileMsg}</div>}

      <button className="settings-primary-btn" onClick={handleProfileSave}>
        Save
      </button>
    </div>
  );

  const renderTheme = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Theme &amp; Appearance</h2>
      <p className="settings-desc">Choose your dashboard theme.</p>

      <div className="theme-toggle-group">
        <button
          className={theme === "light" ? "theme-btn theme-btn-active" : "theme-btn"}
          onClick={() => handleThemeChange("light")}
        >
          Light Mode
        </button>
        <button
          className={theme === "dark" ? "theme-btn theme-btn-active" : "theme-btn"}
          onClick={() => handleThemeChange("dark")}
        >
          Dark Mode
        </button>
        <button
          className={theme === "system" ? "theme-btn theme-btn-active" : "theme-btn"}
          onClick={() => handleThemeChange("system")}
        >
          System Default
        </button>
      </div>

      <p className="settings-subtext">
        Current theme:{" "}
        <strong>
          {theme === "light"
            ? "Light"
            : theme === "dark"
            ? "Dark"
            : "System Default"}
        </strong>
      </p>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Notifications</h2>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => toggleNotification("email")}
          />
          <span>Email Notifications</span>
        </label>
      </div>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={() => toggleNotification("sms")}
          />
          <span>SMS Alerts</span>
        </label>
      </div>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={notifications.appointments}
            onChange={() => toggleNotification("appointments")}
          />
          <span>Appointment Reminders</span>
        </label>
      </div>

      <p className="settings-subtext">
        These preferences are saved for this browser only.
      </p>
    </div>
  );

  const renderChangePassword = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Change Password</h2>

      <div className="settings-field">
        <label>Current Password</label>
        <input
          type="password"
          value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <label>New Password</label>
        <input
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        />
      </div>

      {pwdError && <div className="settings-error">{pwdError}</div>}
      {pwdMsg && <div className="settings-success">{pwdMsg}</div>}

      <button className="settings-primary-btn" onClick={handlePasswordSave}>
        Update Password
      </button>
    </div>
  );

  const renderPrivacy = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Privacy &amp; Security</h2>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={privacy.twoFactor}
            onChange={() => togglePrivacy("twoFactor")}
          />
          <span>Enable two-factor authentication</span>
        </label>
      </div>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={privacy.shareAnalytics}
            onChange={() => togglePrivacy("shareAnalytics")}
          />
          <span>Allow anonymous usage analytics</span>
        </label>
      </div>

      <div className="notification-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={privacy.securityAlerts}
            onChange={() => togglePrivacy("securityAlerts")}
          />
          <span>Send email alerts for suspicious activity</span>
        </label>
      </div>

      <p className="settings-subtext">
        These options do not talk to a real server yet, but they show that you
        understand privacy settings in a real HMS.
      </p>
    </div>
  );

  const renderSystemPreferences = () => (
    <div className="settings-panel">
      <h2 className="settings-title">System Preferences</h2>

      <div className="settings-field">
        <label>Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English (Default)</option>
          <option value="hi">Hindi</option>
          <option value="te">Telugu</option>
        </select>
      </div>

      {systemMsg && <div className="settings-success">{systemMsg}</div>}

      <button className="settings-primary-btn" onClick={handleLanguageSave}>
        Save Preferences
      </button>

      <p className="settings-subtext">
        UI texts are still in English, but this setting is saved and can be
        used later for multi-language support.
      </p>
    </div>
  );

  const renderBackupRestore = () => (
    <div className="settings-panel">
      <h2 className="settings-title">Backup &amp; Restore</h2>

      <p className="settings-desc">
        Download a backup of your <strong>settings</strong> (profile, theme,
        notifications, privacy, language) and restore them later.
      </p>

      <div className="backup-row">
        <button className="settings-primary-btn" onClick={handleBackup}>
          Download Settings Backup
        </button>
      </div>

      <div className="backup-row">
        <label className="file-label">
          <span className="file-label-btn">Choose Backup File</span>
          <input
            type="file"
            accept="application/json"
            onChange={handleRestore}
          />
        </label>
      </div>

      {backupMsg && <div className="settings-success">{backupMsg}</div>}
      {restoreError && <div className="settings-error">{restoreError}</div>}

      <p className="settings-subtext">
        This does <strong>not</strong> backup database records (patients,
        invoices) — only UI settings for this admin account.
      </p>
    </div>
  );

  const renderRightPanel = () => {
    switch (activeSection) {
      case "Profile Settings":
        return renderProfile();
      case "Theme & Appearance":
        return renderTheme();
      case "Notifications":
        return renderNotifications();
      case "Change Password":
        return renderChangePassword();
      case "Privacy & Security":
        return renderPrivacy();
      case "System Preferences":
        return renderSystemPreferences();
      case "Backup & Restore":
        return renderBackupRestore();
      default:
        return null;
    }
  };

  return (
    <div
  className="settings-page"
  style={{ background: "#ffedd5", minHeight: "100vh" }}
>
  <h1 style={{ color: "red" }}>Settings Page Loaded</h1>
      <div className="settings-card">
        {/* LEFT MENU */}
        <div className="settings-sidebar">
          {SECTIONS.map((label) => (
            <button
              key={label}
              className={
                activeSection === label
                  ? "settings-tab settings-tab-active"
                  : "settings-tab"
              }
              onClick={() => setActiveSection(label)}
            >
              {label === "Backup & Restore" && (
                <span className="star-icon">★</span>
              )}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="settings-content">{renderRightPanel()}</div>
      </div>
    </div>
  );
}
