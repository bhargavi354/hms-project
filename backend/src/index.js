const express = require("express");
const cors = require("cors");
const { sequelize, Admin } = require("./models");

const app = express();

/* =========================
   ✅ OPEN CORS (for debugging on Render)
========================= */
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("HMS Backend Running ✅");
});

// Routes
app.use("/api/employees", require("./routes/employees"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/revenue", require("./routes/revenue"));
app.use("/api/op-revenue", require("./routes/opRevenue"));
app.use("/api/home-visits", require("./routes/homeVisits"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/login", require("./routes/admin"));
app.use("/api/op", require("./routes/op"));

(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("✅ DB synced safely (no alter)");

    // Create default admin if not exists
    const exists = await Admin.findOne({ where: { username: "admin" } });

    if (!exists) {
      await Admin.create({
        username: "admin",
        password: "12345",
      });
      console.log("⭐ Default admin created: admin / 12345");
    }

    // Render PORT or local fallback
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Backend start failed:", err);
  }
})();
