const express = require("express");
const router = express.Router();
const { Revenue } = require("../models");

// ======================
// TEST
// ======================
router.get("/test", (req, res) => {
  res.send("Revenue route working ✅");
});

// ======================
// GET ALL INVOICES
// ======================
router.get("/", async (req, res) => {
  try {
    const data = await Revenue.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// CREATE INVOICE (MANUAL / UI)
// ======================
router.post("/", async (req, res) => {
  try {
    const {
      invoiceNo,
      patientName,
      date,
      finalAmount,
      totalAmount,
      status,
    } = req.body;

    if (!invoiceNo || !patientName) {
      return res
        .status(400)
        .json({ message: "Invoice no & patient name required" });
    }

    const saved = await Revenue.create({
      invoiceNo,
      patientName,
      date,
      amount: finalAmount ?? totalAmount ?? 0,
      status: status || "pending",
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice" });
  }
});

// ======================
// UPDATE STATUS (MARK PAID / PENDING)
// ======================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Revenue.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = status || invoice.status;
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update invoice" });
  }
});

// ======================
// DELETE INVOICE
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Revenue.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.destroy();
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete invoice" });
  }
});

// ======================
// GET BY OP ID (OPTIONAL - OLD FLOW)
// ======================
router.get("/by-op/:opId", async (req, res) => {
  try {
    const opId = Number(req.params.opId);
    const invoice = await Revenue.findOne({ where: { opId } });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
});

// ======================
// REFUND BY OP ID (OPTIONAL)
// ======================
router.put("/refund/:opId", async (req, res) => {
  try {
    const opId = Number(req.params.opId);
    const invoice = await Revenue.findOne({ where: { opId } });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "refunded";
    await invoice.save();

    res.json({ message: "Invoice refunded", invoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to refund invoice" });
  }
});

module.exports = router;
