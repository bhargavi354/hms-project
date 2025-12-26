const express = require("express");
const router = express.Router();
const { Patient, Employee, Revenue, HomeVisit } = require("../models");
const { Op } = require("sequelize");

// Dashboard API
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const totalPatients = await Patient.count();
    const newToday = await Patient.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(today)
        }
      }
    });

    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({
      where: { status: "ACTIVE" }
    });

    const todayRevenue = await Revenue.sum("finalAmount", {
      where: {
        date: today
      }
    }) || 0;

    const totalHomeVisits = await HomeVisit.count();

    // recent activity (last 5)
    const recentActivity = await Revenue.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      totalPatients,
      newToday,
      totalEmployees,
      activeEmployees,
      todayRevenue,
      totalHomeVisits,
      recentActivity
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
