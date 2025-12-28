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
      return JSON.parse(localStorage.getItem("hms_notifications")) || {
        email: true,
        sms: true,
        appointments: false,
      };
    } catch {
      return { email: true, sms: true, appointments: false };
    }
  });

  // ---------- PASSWORD ----------
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // ---------- PRIVACY ----------
  const [privacy, setPrivacy] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hms_privacy")) || {
        twoFactor: false,
        shareAnalytics: true,
        securityAlerts: true,
      };
    } catch {
      return { twoFactor: false, shareAnalytics: true, securityAlerts: true };
    }
  });

  // ---------- SYSTEM ----------
  const [language, setLanguage] = useState(
    localStorage.getItem("hms_language") || "en"
  );
  const [systemMsg, setSystemMsg] = useState("");

  // ---------- BACKUP ----------
  const [backupMsg, setBackupMsg] = useState("");
  const [restoreError, setRestoreError] = useState("");

  // ===== EFFECTS =====
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("hms_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("hms_profile_name", profileName);
    localStorage.setItem("hms_profile_email", profileEmail);
    localStorage.setItem("hms_profile_phone", profilePhone);
    if (avatar) localStorage.setItem("hms_profile_avatar", avatar);

    const fullProfile = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      photo: avatar,
      role: "Admin · Central Medical",
    };
    localStorage.setItem("userProfile", JSON.stringify(fullProfile));
  }, [profileName, profileEmail, profilePhone, avatar]);

  useEffect(() => {
    localStorage.setItem("hms_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("hms_privacy", JSON.stringify(privacy));
  }, [privacy]);

  useEffect(() => {
    localStorage.setItem("hms_language", language);
  }, [language]);

  // ===== HANDLERS =====
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    setProfileMsg("Profile updated successfully.");
    setTimeout(() => setProfileMsg(""), 2500);
  };

  const toggleNotification = (key) => {
    setNotifications((p) => ({ ...p, [key]: !p[key] }));
  };

  const handlePasswordSave = () => {
    setPwdError("");
    setPwdMsg("");

    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("Password must be at least 6 chars.");
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
    setTimeout(() => setPwdMsg(""), 3000);
  };

  const togglePrivacy = (key) => {
    setPrivacy((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleLanguageSave = () => {
    setSystemMsg("Language saved.");
    setTimeout(() => setSystemMsg(""), 2000);
  };

  const handleBackup = () => {
    const data = {
      profile: { name: profileName, email: profileEmail, phone: profilePhone, avatar },
      theme,
      notifications,
      privacy,
      language,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hms-settings-backup.json";
    a.click();
    URL.revokeObjectURL(url);

    setBackupMsg("Backup downloaded.");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
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

        setBackupMsg("Settings restored.");
        setTimeout(() => setBackupMsg(""), 3000);
      } catch {
        setRestoreError("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  // ===== RENDER =====
  const renderRightPanel = () => {
    switch (activeSection) {
      case "Profile Settings":
        return <div>Profile form here</div>;
      case "Theme & Appearance":
        return <div>Theme options here</div>;
      case "Notifications":
        return <div>Notifications here</div>;
      case "Change Password":
        return <div>Password change here</div>;
      case "Privacy & Security":
        return <div>Privacy here</div>;
      case "System Preferences":
        return <div>System prefs here</div>;
      case "Backup & Restore":
        return <div>Backup & Restore here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
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
              {label}
            </button>
          ))}
        </div>

        <div className="settings-content">{renderRightPanel()}</div>
      </div>
    </div>
  );
}
