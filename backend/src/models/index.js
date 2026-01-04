const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "../../hms.sqlite"),
      logging: false,
    });

/* ===== MODELS ===== */
const Employee   = require("./employee")(sequelize, DataTypes);
const Patient    = require("./patient")(sequelize, DataTypes);
const Attendance = require("./attendance")(sequelize, DataTypes);
const Revenue    = require("./revenue")(sequelize, DataTypes);
const HomeVisit  = require("./homeVisit")(sequelize, DataTypes);
const Admin      = require("./admin")(sequelize, DataTypes);
const OpBooking  = require("./OpBooking")(sequelize, DataTypes);

/* ===== AUTO CREATE ADMIN ===== */
const ensureAdmin = async () => {
  try {
    const admin = await Admin.findOne({
      where: { username: "admin" },
    });

    if (!admin) {
      await Admin.create({
        username: "admin",
        password: "12345",
      });
      console.log("✅ Default admin created (admin / 12345)");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error ensuring admin:", err.message);
  }
};

/* ===== SYNC DB (IMPORTANT FIX) ===== */
sequelize
  .sync({ alter: true })   // ✅ THIS FIXES POSTGRES TOKEN ISSUE
  .then(() => {
    console.log("✅ DB synced (alter)");
    ensureAdmin();
  })
  .catch((err) => {
    console.error("❌ DB sync failed:", err);
  });

module.exports = {
  sequelize,
  Employee,
  Patient,
  Attendance,
  Revenue,
  HomeVisit,
  Admin,
  OpBooking,
};
