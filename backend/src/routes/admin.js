const express = require("express");
const router = express.Router();
const { Admin } = require("../models");

// LOGIN API
router.post("/", async (req, res) => {
  try {
    console.log("🔐 Login attempt:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = await Admin.findOne({
      where: { username: username.trim() }
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
