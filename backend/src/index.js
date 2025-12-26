const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("HMS Backend Running ✅");
});

// Routes
app.use("/api/employees", require("./routes/employees"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/revenue", require("./routes/revenue"));       // ✅ Admin revenue
app.use("/api/op-revenue", require("./routes/opRevenue")); // 🆕 OP revenue (NEW)
app.use("/api/home-visits", require("./routes/homeVisits"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/login", require("./routes/admin"));
app.use("/api/op", require("./routes/op"));

(async () => {
  try {
    // ✅ SAFE SYNC — no alter, no force (NO data loss)
    await sequelize.sync({ alter: false });
    console.log("✅ DB synced safely (no alter)");

    const { Admin } = require("./models");
    const exists = await Admin.findOne({ where: { username: "admin" } });

    if (!exists) {
      await Admin.create({
        username: "admin",
        password: "12345",
      });
      console.log("⭐ Default admin created: admin / 12345");
    }

    app.listen(4000, () => {
      console.log("✅ Backend running on http://localhost:4000");
    });
  } catch (err) {
    console.error("❌ Backend start failed:", err);
  }
})();
