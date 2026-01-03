const express = require("express");
const cors = require("cors");
const { sequelize, Admin } = require("./models");

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("HMS Backend Running ✅");
});

/* ======================
   ROUTES
====================== */
app.use("/api/employees", require("./routes/employees"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/revenue", require("./routes/revenue"));
app.use("/api/op-revenue", require("./routes/opRevenue"));
app.use("/api/home-visits", require("./routes/homeVisits"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/login", require("./routes/admin"));
app.use("/api/op", require("./routes/op"));

/* ======================
   START SERVER (SAFE)
====================== */
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    /**
     * 🔒 SAFE SYNC
     * ❌ alter = false
     * ❌ force = false
     * Data delete avvadu
     */
    await sequelize.sync({ alter: false, force: false });
    console.log("✅ DB synced (SAFE MODE)");

    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "12345";

    const exists = await Admin.findOne({
      where: { username: ADMIN_USER },
    });

    if (!exists) {
      await Admin.create({
        username: ADMIN_USER,
        password: ADMIN_PASS,
      });
      console.log("⭐ Default admin created");
    } else {
      console.log("✅ Admin already exists");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Backend start failed:", err);
  }
})();
