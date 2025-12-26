// backend/src/routes/settings.js

const express = require("express");
const router = express.Router();
const { Setting } = require("../models");

// Helper to always work with single row (id = 1)
async function getSingletonSetting() {
  const [row] = await Setting.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: "Bhargavi",
      email: "bbhargavi738@gmail.com",
      phone: "+917601075506",
      theme: "light",
      language: "en",
      notifyEmail: true,
      notifySms: true,
      notifyAppointments: true,
      privacyTwoFactor: false,
      privacyLoginAlerts: true,
    },
  });
  return row;
}

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    const setting = await getSingletonSetting();
    res.json(setting);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

// PUT /api/settings
router.put("/", async (req, res) => {
  try {
    const setting = await getSingletonSetting();

    const allowed = [
      "name",
      "email",
      "phone",
      "avatar",
      "theme",
      "language",
      "notifyEmail",
      "notifySms",
      "notifyAppointments",
      "privacyTwoFactor",
      "privacyLoginAlerts",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    await setting.update(updates);
    res.json(setting);
  } catch (err) {
    console.error("PUT /settings error:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

module.exports = router;
