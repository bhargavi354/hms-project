const express = require("express");
const router = express.Router();
const { Admin } = require("../models");

// LOGIN API
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({
    where: { username, password }
  });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

module.exports = router;
