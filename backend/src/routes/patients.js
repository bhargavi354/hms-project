const express = require("express");
const router = express.Router();
const { Patient } = require("../models");

router.get("/", async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

router.post("/", async (req, res) => {
  const newPatient = await Patient.create(req.body);
  res.json(newPatient);
});

router.put("/:id", async (req, res) => {
  await Patient.update(req.body, { where: { id: req.params.id } });
  const updated = await Patient.findByPk(req.params.id);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Patient.destroy({ where: { id: req.params.id } });
  res.json({ message: "deleted" });
});

module.exports = router;
