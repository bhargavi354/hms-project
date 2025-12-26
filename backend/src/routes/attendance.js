const express = require("express");
const router = express.Router();
const { Attendance } = require("../models");

// GET attendance for a specific date
router.get("/:date", async (req, res) => {
  const data = await Attendance.findAll({
    where: { date: req.params.date }
  });
  res.json(data);
});

// SAVE attendance (create or update)
router.post("/", async (req, res) => {
  const { employeeId, date, status } = req.body;

  const existing = await Attendance.findOne({
    where: { employeeId, date }
  });

  if (existing) {
    // update
    existing.status = status;
    await existing.save();
    return res.json(existing);
  }

  // create new
  const newEntry = await Attendance.create({ employeeId, date, status });
  res.json(newEntry);
});

module.exports = router;
