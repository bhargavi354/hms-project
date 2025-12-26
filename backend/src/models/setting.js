// backend/src/models/setting.js
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define("Setting", {
    // Profile
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.TEXT, // base64 image string

    // Theme
    theme: {
      type: DataTypes.STRING,
      defaultValue: "light", // "light" | "dark" | "system"
    },

    // Language
    language: {
      type: DataTypes.STRING,
      defaultValue: "en", // "en" | "hi" | "te"
    },

    // Notifications
    notifyEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notifySms: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notifyAppointments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // Privacy
    privacyTwoFactor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    privacyLoginAlerts: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Setting;
};
