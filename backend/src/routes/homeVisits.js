const express = require("express");
const router = express.Router();
const { HomeVisit } = require("../models");

// GET all visits
router.get("/", async (req, res) => {
  try {
    const visits = await HomeVisit.findAll({ order: [["id", "DESC"]] });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD visit
router.post("/", async (req, res) => {
  try {
    const visit = await HomeVisit.create(req.body);
    res.json({ message: "Visit added", visit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE visit
router.delete("/:id", async (req, res) => {
  try {
    await HomeVisit.destroy({ where: { id: req.params.id } });
    res.json({ message: "Visit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
