const express = require("express");
const router = express.Router();
const { OpBooking } = require("../models");
const { Op } = require("sequelize");

/* ======================
   GET OPs (FILTER + ORDER)
====================== */
router.get("/", async (req, res) => {
  try {
    const { search, date } = req.query;
    let where = {};

    if (search && search !== "") {
      where[Op.or] = [
        { token: { [Op.like]: `%${search}%` } },
        { patientName: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (date && date !== "") {
      where.createdAt = {
        [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
      };
    }

    const data = await OpBooking.findAll({
      where,
      order: [["createdAt", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   GET SINGLE OP (FOR BILLING)
====================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let op = await OpBooking.findByPk(id);

    if (!op) {
      op = await OpBooking.findOne({
        where: {
          token: {
            [Op.like]: `%${id}`,
          },
        },
      });
    }

    if (!op) {
      return res.status(404).json({ message: "OP not found" });
    }

    res.json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   ADD OP (SEQUENTIAL TOKEN)
====================== */
router.post("/", async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      phone,
      problem,
      doctor,
      visitTime,
    } = req.body;

    if (!patientName || !doctor || !visitTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const lastOp = await OpBooking.findOne({
      order: [["createdAt", "DESC"]],
    });

    let nextNumber = 1;

    if (lastOp && lastOp.token) {
      const parts = lastOp.token.split("-");
      const lastNum = parseInt(parts[1], 10);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    const token = "OP-" + String(nextNumber).padStart(4, "0");

    const op = await OpBooking.create({
      token,
      patientName,
      age,
      gender,
      phone,
      problem,
      doctor,
      visitTime,
      status: "Pending",
    });

    res.json(op);
  } catch (err) {
    console.error("Add OP error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   MARK OP AS COMPLETED
====================== */
router.put("/:id/complete", async (req, res) => {
  try {
    const op = await OpBooking.findByPk(req.params.id);

    if (!op) {
      return res.status(404).json({ message: "OP not found" });
    }

    op.status = "Completed";
    await op.save();

    res.json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   OP DASHBOARD STATS (TODAY)
====================== */
router.get("/stats/summary", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const totalToday = await OpBooking.count({
      where: {
        createdAt: {
          [Op.between]: [`${today} 00:00:00`, `${today} 23:59:59`],
        },
      },
    });

    const pending = await OpBooking.count({
      where: { status: "Pending" },
    });

    const completed = await OpBooking.count({
      where: { status: "Completed" },
    });

    res.json({
      today: totalToday,
      pending,
      completed,
    });
  } catch (err) {
    console.error("OP stats error:", err);
    res.status(500).json({ message: "Failed to load OP stats" });
  }
});

/* ======================
   🆕 OP STATS BY DATE RANGE (FOR REPORTS)
====================== */
router.get("/stats/range", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To dates required" });
    }

    const start = `${from} 00:00:00`;
    const end = `${to} 23:59:59`;

    const total = await OpBooking.count({
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
    });

    const pending = await OpBooking.count({
      where: {
        status: "Pending",
        createdAt: { [Op.between]: [start, end] },
      },
    });

    const completed = await OpBooking.count({
      where: {
        status: "Completed",
        createdAt: { [Op.between]: [start, end] },
      },
    });

    res.json({ total, pending, completed });
  } catch (err) {
    res.status(500).json({ message: "Failed to load OP range stats" });
  }
});

module.exports = router;
