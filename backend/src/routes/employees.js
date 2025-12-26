// backend/src/routes/employees.js

const express = require("express");
const router = express.Router();
const { Employee } = require("../models");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [["id", "DESC"]],
    });
    res.json(employees);
  } catch (err) {
    console.error("GET /employees error:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE employee
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      dept,
      status,
      rating,
      years,
      sessions,
      img,
      nextShift,
    } = req.body;

    const employee = await Employee.create({
      name,
      email,
      role,
      dept,
      status,
      rating: rating ?? 4.5,
      years: years ?? 0,
      sessions: sessions ?? 0,
      img: img || null,
      nextShift: nextShift || "TBD",
    });

    res.json(employee);
  } catch (err) {
    console.error("POST /employees error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const {
      name,
      email,
      role,
      dept,
      status,
      rating,
      years,
      sessions,
      img,
      nextShift,
    } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    await employee.update({
      name,
      email,
      role,
      dept,
      status,
      rating,
      years,
      sessions,
      img,
      nextShift,
    });

    res.json(employee);
  } catch (err) {
    console.error("PUT /employees/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const employee = await Employee.findByPk(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    await employee.destroy();
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("DELETE /employees/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
